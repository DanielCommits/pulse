import * as admin from "firebase-admin";

const initializeAdmin = () => {
  if (admin.apps.length > 0) return admin;

  // 1. Get the full JSON string from your env
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountRaw) {
    throw new Error("❌ FIREBASE_SERVICE_ACCOUNT is missing in environment variables.");
  }

  try {
    // 2. Parse the string into a real object
    const serviceAccount = JSON.parse(serviceAccountRaw);

    // 3. Tweak: The mandatory Vercel newline fix
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // 4. Initialize using the whole object
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK Initialized Successfully");
    return admin;
  } catch (error) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", error);
    throw error;
  }
};

// Export a single instance
const adminApp = initializeAdmin();
export default adminApp;