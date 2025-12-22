import * as admin from "firebase-admin";

// Initialize admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const auth = admin.auth();
const db = admin.firestore();

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  lastSignInTime: string | null;
  disabled: boolean;
}

/**
 * Get all users from Firebase Auth
 */
export const getAllUsers = async (): Promise<UserRecord[]> => {
  try {
    const result = await auth.listUsers(1000);
    return result.users.map((user) => ({
      uid: user.uid,
      email: user.email || "unknown",
      displayName: user.displayName || null,
      createdAt: user.metadata.creationTime?.toISOString() || "unknown",
      lastSignInTime: user.metadata.lastSignInTime?.toISOString() || null,
      disabled: user.disabled,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Ban a user by disabling their account
 */
export const banUser = async (uid: string, reason?: string): Promise<void> => {
  try {
    // Disable the user in Firebase Auth
    await auth.updateUser(uid, { disabled: true });

    // Record ban in Firestore for reference
    await db
      .collection("bannedUsers")
      .doc(uid)
      .set({
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
        reason: reason || "No reason provided",
      });

    console.log(`User ${uid} has been banned`);
  } catch (error) {
    console.error("Error banning user:", error);
    throw error;
  }
};

/**
 * Unban a user by enabling their account
 */
export const unbanUser = async (uid: string): Promise<void> => {
  try {
    // Enable the user in Firebase Auth
    await auth.updateUser(uid, { disabled: false });

    // Remove from banned users collection
    await db.collection("bannedUsers").doc(uid).delete();

    console.log(`User ${uid} has been unbanned`);
  } catch (error) {
    console.error("Error unbanning user:", error);
    throw error;
  }
};

/**
 * Delete a user account completely
 */
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    // Delete from Firebase Auth
    await auth.deleteUser(uid);

    // Clean up user data from Firestore if exists
    await db.collection("users").doc(uid).delete();
    await db.collection("bannedUsers").doc(uid).delete();

    console.log(`User ${uid} has been deleted`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Get ban information for a user
 */
export const getBanInfo = async (uid: string) => {
  try {
    const banDoc = await db.collection("bannedUsers").doc(uid).get();
    if (banDoc.exists) {
      return banDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting ban info:", error);
    throw error;
  }
};
