import * as admin from "firebase-admin";

const initializeAdmin = () => {
  if (admin.apps.length > 0) return admin;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error("❌ Firebase Admin missing keys in .env. Check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });

  console.log("✅ Firebase Admin SDK Initialized Successfully");
  return admin;
};

// Export a single instance
const adminApp = initializeAdmin();
export default adminApp;