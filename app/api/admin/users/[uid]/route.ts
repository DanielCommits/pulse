import admin from "../../../../../lib/firebaseAdmin";
import { NextResponse } from "next/server";

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

export async function DELETE(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    await verifyAdmin(authHeader);

    const { uid } = params;
    await admin.auth().deleteUser(uid);
    return NextResponse.json({ success: true, message: `User ${uid} deleted` });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    await verifyAdmin(authHeader);

    const body = await req.json();
    const { uid } = params;

    // Support disable/enable user
    if (typeof body.disabled === "boolean") {
      await admin.auth().updateUser(uid, { disabled: body.disabled });
      return NextResponse.json({
        success: true,
        message: `User ${uid} ${body.disabled ? "disabled" : "enabled"}`,
      });
    }

    return NextResponse.json(
      { error: "No valid update provided" },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
