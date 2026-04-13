import { FieldValue } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { customerSchema } from '@/lib/customer-schema';
import { getDb } from '@/lib/firebase-admin';

const COLLECTION_NAME = 'customers';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').limit(100).get();
    const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load customers', detail: `${error}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const parsed = customerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parsed.error.issues
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const docRef = await db.collection(COLLECTION_NAME).add({
      ...parsed.data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer', detail: `${error}` }, { status: 500 });
  }
}
