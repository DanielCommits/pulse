import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const auth = admin.auth();

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

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { uid, reason } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Disable user
    await auth.updateUser(uid, { disabled: true });

    // Record in Firestore
    const db = admin.firestore();
    await db
      .collection("bannedUsers")
      .doc(uid)
      .set({
        bannedAt: admin.firestore.FieldValue.serverTimestamp(),
        reason: reason || "No reason provided",
      });

    return NextResponse.json({
      success: true,
      message: `User ${uid} has been banned`,
    });
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 });
  }
}
