# Sales TAI-YO Plus V2 (Web App)

Sales TAI-YO Plus V2 is an internal web application for Tai-Yo sales teams and management.
The UI follows a Google-style minimal design with role-based themes.

> Scope: Sales App only (not T.I.S. platform)

---

## 1) Goals

- Provide a single place for sales operations (daily report, sample request, quote request, documents, tracking, etc.)
- Role-based access control (Board / Manager / Employee / Admin)
- Simple PIN-based login with account lock protection
- Admin approval workflow for new registrations
- AI-assisted text refinement with strict "max 10% enhancement" rule
- Check-in with geolocation, photo evidence, and attachments
- Data stored in Firestore (structured, queryable, auditable)
- Deployable on Google Cloud Run

---

## 2) Tech Stack

- Frontend: Next.js (Web App)
- Backend: Node.js + Fastify (API)
- Database: Firestore
- AI: Google gemini API
- Deployment: Google Cloud Run

---

## 3) Roles & Themes

### Roles
1. Board Executive (Board)
2. Department Manager (Manager)
3. Employee
4. Admin (single admin only)

### UI Theme by Role
- Board: Navy
- Manager: Red pastel
- Employee: Blue
- Admin: Gray

> Google minimal interface style for all roles.

---

## 4) Authentication & Registration

### Login
- 6-digit PIN login
- Track wrong attempts
- Lock account after 4 failed attempts
- Unlock requires IT/Admin action

### Registration (Manager & Employee only)
- Register using Google Email
- Required: First name, Last name, Phone, Department
- Set PIN 6 digits + confirm PIN
- On submit: save registration to Firestore immediately
- Show popup message:
  "TAI-YO system received your registration (...name...) successfully.
   Please contact an authorized person to approve your access.
   If not approved within 3 days, registration will be auto-cancelled and you must register again."

### Admin
- No registration page
- Admin PIN is fixed by policy (value should be stored securely, preferably as env variable)

---

## 5) Home Screen (Role-Based)

Each role has its own Home screen with:
- Profile photo (user upload)
- Full name
- Position/Role
- Main features (core modules)
- AI assistant entry "ผช.ประสาน" (AI assistant for Tai-Yo knowledge/tasks)

Core modules appear as buttons:
- Enabled modules are clickable
- Disabled modules show gray + lock icon

---

## 6) Core Modules (8)

1. Daily Report
2. Request Sample
3. Request Quotation
4. Documents (COA / MSDS / SDS / Company Profile / Catalog)
5. Order Tracking (real-time)
6. VDO Presentation
7. Company Chat Group
8. IT Issue Reporting

(Other features can be added later but must not clutter UI.)

---

## 7) Daily Report (Core)

### Report List Screen
- Shows only the current user's reports (never show others)
- Filters: 7 days / 1 month / 3 months / 1 year / custom range
- Search: customer name / contact / keywords
- Show latest 20 items list with summary:
  - customer logo/photo (if any)
  - customer name
  - visit date-time
  - customer status (1-5)

### Customer Check
- Quick lookup whether another salesperson has visited this customer
- Show minimal data only:
  - salesperson photo
  - last visit date-time
  - department/team
  - area

### Add Report Form
Fields:
1. Timestamp (auto)
2. Department (from user profile)
3. Reporter name (from user profile)
4. Customer (search dropdown from `customers`)
   - If not found -> quick add customer:
     - Company/Shop name (required)
     - Area (required, dropdown suggestion by district/subdistrict)
     - Contact person (optional)
     - Phone (optional)
     - Job categories/tags (multi-select)
5. Customer status (1-5)
6. Area (auto from customer data)
7. Contact person (auto from customer data)
8. Phone (auto from customer data)
9. Job categories (auto from customer data)
10. Estimated volume (money value)
11. Process stage (dropdown; admin-manageable list)
12. Detail (popup editor)
    - AI refine option:
      - Fix spelling, rearrange sentences
      - Enhance clarity max 10%
      - User must approve before saving
13. Follow-up date
14. Mandatory photos (2) with timestamp & location intent
15. Attachments: up to 6 files, max 2MB each
    - Auto-compress images to <= 1MB if needed
16. Check-in: store geolocation and provide map navigation link

### Read Report Screen
- Display submitted data clearly
- Provide Edit for status + process stage (and other fields if allowed)

---

## 8) Admin Panel

Admin can:
- Enable/Disable user access
- Assign permissions:
  - For Employees: toggle 8 modules
  - For Managers: toggle department visibility (8 departments)
- Unlock accounts
- Reset PIN
- Manage master data:
  - Departments list
  - Job categories/tags (add/edit/delete)
  - Process stage list (add/edit/delete)

---

## 9) Firestore (High-level Collections)

- users
- registrations_pending
- customers
- daily_reports
- permissions
- master_departments
- master_job_categories
- master_process_stages
- media

(Details to be finalized in the data model step.)

---

## 10) Deployment (Cloud Run)

- Backend API deploy to Google Cloud Run
- Frontend deploy to Google Cloud Run (or alternative hosting if required)
- Environment variables stored in Cloud Run configuration

---

## 11) Non-Goals (Out of Scope)

- No T.I.S platform framework
- No multi-env Terraform setup at initial stage
- No microservices split at initial stage
- No complex ops/sre folder structure at initial stage

---

## 12) Roadmap (Next Steps)

1. Finalize Firestore data model
2. Build API bootstrap (Fastify)
3. Build UI bootstrap (Next.js)
4. Implement Auth + RBAC
5. Implement Daily Report module end-to-end
6. Add AI refinement service
7. Add media upload + compression
8. Deploy Cloud Run (backend first, then frontend)

---

## 13) Current Delivery Status

- Part 1 complete: Next.js 14 UI flow (Role Select, Login PIN, Dashboard, Reports)
- Part 2 started: Firestore integration for customer registry via Next.js Route Handler (`/api/customers`)
- Customer module available at `/customers` for create/list customer records

---

## 14) Cloud Build + Cloud Run (GitHub latest commit)

This repository includes `cloudbuild.yaml` for CI/CD from GitHub trigger.

### Required setup (one-time)
1. Connect GitHub repository to Cloud Build trigger (branch: `main` or working branch).
2. Create Artifact Registry Docker repo in region `asia-east1`.
3. Grant Cloud Build service account roles:
   - Cloud Run Admin
   - Artifact Registry Writer
   - Service Account User (for Cloud Run runtime SA)
4. Set Cloud Run environment variables from `apps/web/.env.example`.

### Pipeline behavior
- Build container from `apps/web/Dockerfile`
- Push image to Artifact Registry
- Deploy latest image to Cloud Run service `sales-web`

### Manual deploy fallback
```bash
gcloud run deploy sales-web \
  --source apps/web \
  --region asia-east1 \
  --allow-unauthenticated
```
