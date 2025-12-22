import admin from "../../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

/**
 * DEV ONLY: Quick endpoint to grant admin to current user.
 * Usage: POST /api/dev/make-admin with Authorization header.
 *
 * WARNING: Remove this endpoint before going to production!
 */
export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Grant admin claim
    await admin.auth().setCustomUserClaims(uid, { admin: true });

    return NextResponse.json({
      success: true,
      message: `Admin claim granted to ${uid}. Sign out and back in to see changes.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
