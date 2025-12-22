/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize admin SDK
admin.initializeApp();

const auth = admin.auth();
const db = admin.firestore();

/**
 * Verify the request is from an admin user
 */
async function verifyAdmin(token: string): Promise<boolean> {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    const adminUids = process.env.NEXT_PUBLIC_ADMIN_UIDS?.split(",") || [];
    return adminUids.includes(decodedToken.uid);
  } catch (error) {
    return false;
  }
}

/**
 * Cloud Function: Get all users
 */
export const getUsers = onRequest({ cors: true }, async (request, response) => {
  try {
    const token = request.get("Authorization")?.split(" ")[1];
    if (!token) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return response
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }

    const result = await auth.listUsers(1000);
    const users = result.users.map((user) => ({
      uid: user.uid,
      email: user.email || "unknown",
      displayName: user.displayName || null,
      createdAt: user.metadata.creationTime?.toISOString() || "unknown",
      lastSignInTime: user.metadata.lastSignInTime?.toISOString() || null,
      disabled: user.disabled,
    }));

    return response.json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
    return response.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * Cloud Function: Ban user
 */
export const banUser = onRequest({ cors: true }, async (request, response) => {
  try {
    const token = request.get("Authorization")?.split(" ")[1];
    if (!token) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return response
        .status(403)
        .json({ error: "Forbidden - Admin access required" });
    }

    const { uid, reason } = request.body;
    if (!uid) {
      return response.status(400).json({ error: "UID is required" });
    }

    // Disable user
    await auth.updateUser(uid, { disabled: true });

    // Store ban info
    await db
      .collection("bannedUsers")
      .doc(uid)
      .set({
        uid,
        reason: reason || "No reason provided",
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    logger.info(`User ${uid} banned`);
    return response.json({ success: true, message: "User banned" });
  } catch (error) {
    logger.error("Error banning user:", error);
    return response.status(500).json({ error: "Failed to ban user" });
  }
});

/**
 * Cloud Function: Unban user
 */
export const unbanUser = onRequest(
  { cors: true },
  async (request, response) => {
    try {
      const token = request.get("Authorization")?.split(" ")[1];
      if (!token) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const isAdmin = await verifyAdmin(token);
      if (!isAdmin) {
        return response
          .status(403)
          .json({ error: "Forbidden - Admin access required" });
      }

      const { uid } = request.body;
      if (!uid) {
        return response.status(400).json({ error: "UID is required" });
      }

      // Enable user
      await auth.updateUser(uid, { disabled: false });

      // Remove ban info
      await db.collection("bannedUsers").doc(uid).delete();

      logger.info(`User ${uid} unbanned`);
      return response.json({ success: true, message: "User unbanned" });
    } catch (error) {
      logger.error("Error unbanning user:", error);
      return response.status(500).json({ error: "Failed to unban user" });
    }
  }
);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
