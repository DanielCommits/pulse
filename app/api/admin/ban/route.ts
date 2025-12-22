import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { uid, reason } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Call Cloud Function
    const functionUrl = `${
      process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL ||
      "https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net"
    }/banUser`;
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error banning user:", error);
    return NextResponse.json({ error: "Failed to ban user" }, { status: 500 });
  }
}
