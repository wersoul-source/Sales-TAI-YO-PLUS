import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function getPrivateKey() {
  return requireEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
}

export function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: requireEnv('FIREBASE_PROJECT_ID'),
        clientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
        privateKey: getPrivateKey()
      })
    });
  }
  return getFirestore();
}
