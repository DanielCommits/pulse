export const dynamic = "force-dynamic";
import admin from "../../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

// Middleware: verify admin claim from Authorization header (ID token)
async function verifyAdmin(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const idToken = authHeader.slice(7);
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  if (!decodedToken.admin) {
    throw new Error("User does not have admin privileges");
  }
  return decodedToken;
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    await verifyAdmin(authHeader);

    const list = await admin.auth().listUsers(1000);
    const users = list.users.map((u: admin.auth.UserRecord) => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName,
      disabled: u.disabled,
    }));
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
