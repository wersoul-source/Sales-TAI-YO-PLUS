# คู่มือเชื่อม GitHub -> Cloud Build -> Cloud Run

เอกสารนี้อธิบายขั้นตอน production สำหรับให้ทุกครั้งที่ push โค้ดเข้า GitHub แล้วระบบ deploy ไป Google Cloud Run อัตโนมัติ
โดยใช้ `cloudbuild.yaml` ที่อยู่ใน repo นี้

---

## 1) สถาปัตยกรรมการ deploy

1. Developer push code ไป GitHub branch ที่กำหนด
2. Cloud Build Trigger ทำงานจาก event ของ GitHub
3. Cloud Build build image จาก `apps/web/Dockerfile`
4. Push image เข้า Artifact Registry
5. Deploy image ล่าสุดไป Cloud Run service (`sales-web`)

อ้างอิง pipeline: `cloudbuild.yaml`

---

## 2) Prerequisites

- มี Google Cloud Project
- เปิด API ที่จำเป็น:
  - Cloud Build API
  - Cloud Run Admin API
  - Artifact Registry API
  - Secret Manager API (แนะนำสำหรับ production)
- มี GitHub repository ที่เข้าถึงได้
- มีสิทธิ์ IAM ระดับ Project Owner/Editor (ช่วง setup)

---

## 3) สร้าง Artifact Registry

```bash
gcloud artifacts repositories create sales-web \
  --repository-format=docker \
  --location=asia-east1 \
  --description="Sales web images"
```

> ค่าต้องตรงกับ `_REPO_NAME: sales-web` ใน `cloudbuild.yaml`

---

## 4) เชื่อม GitHub กับ Cloud Build Trigger

1. เข้า Google Cloud Console -> **Cloud Build** -> **Triggers**
2. กด **Create Trigger**
3. เลือก Source = **GitHub** แล้ว authorize repository
4. ตั้งค่า Trigger:
   - Event: `Push to a branch`
   - Branch: `^main$` (แนะนำ production)
   - Configuration: `Cloud Build configuration file`
   - Location: `Repository`
   - Cloud Build config file location: `cloudbuild.yaml`
5. Save

---

## 5) ให้สิทธิ์ Service Account ของ Cloud Build

Cloud Build จะใช้ service account รูปแบบ:

`PROJECT_NUMBER@cloudbuild.gserviceaccount.com`

ให้ role อย่างน้อย:

- `roles/run.admin`
- `roles/artifactregistry.writer`
- `roles/iam.serviceAccountUser`

ตัวอย่าง:

```bash
PROJECT_ID="<your-project-id>"
PROJECT_NUMBER="<your-project-number>"
CB_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Cloud Run deploy
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/run.admin"

# Push image เข้า Artifact Registry
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/artifactregistry.writer"

# ใช้งาน runtime service account
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CB_SA}" \
  --role="roles/iam.serviceAccountUser"
```

---

## 6) ตั้งค่า Environment Variables สำหรับ Cloud Run

ค่าที่จำเป็นของ Firestore Admin SDK (ดูตัวอย่างใน `apps/web/.env.example`):

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### วิธีที่แนะนำ (Production): ใช้ Secret Manager

1. สร้าง secrets
2. map secret เข้า Cloud Run service เป็น env vars
3. จำกัด IAM ให้เฉพาะ runtime service account

---

## 7) ทดสอบ Trigger

1. push commit ไป branch ที่ผูก trigger
2. ตรวจใน Cloud Build History ว่า build ผ่าน
3. ตรวจ Cloud Run revisions ว่า deploy revision ใหม่สำเร็จ
4. เปิด URL ของ service เพื่อตรวจสอบการทำงาน

---

## 8) Hardening ที่ควรเพิ่มทันที

- ใช้ protected branch + required PR review
- แยก trigger: `main` (prod), `develop` (staging)
- กำหนด manual approval ก่อน deploy prod
- ตั้ง Cloud Run min instances/concurrency ตาม SLA
- ตั้ง logging + alerting (Error rate, 5xx, latency)

---

## 9) คำสั่ง deploy แบบ manual fallback

```bash
gcloud run deploy sales-web \
  --source apps/web \
  --region asia-east1 \
  --allow-unauthenticated
```
