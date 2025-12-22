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
    // You can add custom claims to check if user is admin
    // For now, we'll check against a hardcoded admin UID
    const adminUids = process.env.NEXT_PUBLIC_ADMIN_UIDS?.split(",") || [];
    return adminUids.includes(decodedToken.uid);
  } catch (error) {
    return false;
  }
}

export async function GET(request: NextRequest) {
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

    const result = await auth.listUsers(1000);
    const users = result.users.map((user) => ({
      uid: user.uid,
      email: user.email || "unknown",
      displayName: user.displayName || null,
      createdAt: user.metadata.creationTime?.toISOString() || "unknown",
      lastSignInTime: user.metadata.lastSignInTime?.toISOString() || null,
      disabled: user.disabled,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
