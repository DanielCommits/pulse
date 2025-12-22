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

    const { uid } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Enable user
    await auth.updateUser(uid, { disabled: false });

    // Remove from Firestore
    const db = admin.firestore();
    await db.collection("bannedUsers").doc(uid).delete();

    return NextResponse.json({
      success: true,
      message: `User ${uid} has been unbanned`,
    });
  } catch (error) {
    console.error("Error unbanning user:", error);
    return NextResponse.json(
      { error: "Failed to unban user" },
      { status: 500 }
    );
  }
}
