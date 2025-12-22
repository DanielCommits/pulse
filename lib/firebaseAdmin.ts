import admin from "firebase-admin";

// Expects FIREBASE_SERVICE_ACCOUNT env var to contain the JSON service account (stringified)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!admin.apps.length) {
  if (!serviceAccount) {
    // Fail fast on server start if missing
    throw new Error(
      "Missing FIREBASE_SERVICE_ACCOUNT environment variable for firebase-admin"
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccount)),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export default admin;
