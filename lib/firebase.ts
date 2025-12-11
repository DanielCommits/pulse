// Import the necessary functions from the SDKs
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
// If you are using analytics
import { getAnalytics, Analytics } from "firebase/analytics";

// 1. Configure Firebase using environment variables
// This ensures your secrets are only loaded from the .env.local file.
const firebaseConfig = {
  // We use the NEXT_PUBLIC_ prefix to access these variables on the client side
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Use if you kept it
};

// Initialize Firebase App in a safe way for Next.js (SSR/HMR)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics;

// Check if a Firebase app instance already exists to prevent re-initialization warnings
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// 2. Initialize and Export the services you need
// (Auth and Firestore are required for your God Mode login/signup/profile features)
auth = getAuth(app);
db = getFirestore(app);
analytics = getAnalytics(app); // Keep this if you want to use analytics

// Export the initialized services
export { app, auth, db, analytics };