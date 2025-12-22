// Import the necessary functions from the SDKs
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendEmailVerification,
  reload,
} from "firebase/auth";
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

// ============================================
// AUTH FUNCTIONS
// ============================================

export interface AuthErrorResponse {
  code: string;
  message: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw formatAuthError(error);
  }
};

/**
 * Log in with email and password
 */
export const logIn = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw formatAuthError(error);
  }
};

/**
 * Log out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw formatAuthError(error);
  }
};

/**
 * Subscribe to auth state changes
 * Returns an unsubscribe function
 */
export const subscribeToAuthChanges = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (
  user: FirebaseUser
): Promise<void> => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw formatAuthError(error);
  }
};

/**
 * Check if user's email is verified and refresh token
 */
export const checkEmailVerified = async (
  user: FirebaseUser
): Promise<boolean> => {
  try {
    await reload(user);
    return user.emailVerified;
  } catch (error) {
    throw formatAuthError(error);
  }
};

/**
 * Helper function to format Firebase auth errors
 */
const formatAuthError = (error: unknown): AuthErrorResponse => {
  if (error instanceof Error && "code" in error) {
    const fbError = error as any;
    const code = fbError.code || "auth/unknown-error";
    const message = fbError.message || "An unknown error occurred";

    // Map common Firebase error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already in use",
      "auth/invalid-email": "Invalid email address",
      "auth/weak-password": "Password must be at least 6 characters",
      "auth/user-not-found": "User not found",
      "auth/wrong-password": "Incorrect password",
      "auth/too-many-requests": "Too many failed login attempts. Try again later",
      "auth/user-disabled": "This account has been disabled",
    };

    return {
      code,
      message: errorMessages[code] || message,
    };
  }

  return {
    code: "auth/unknown-error",
    message: "An unknown error occurred",
  };
};