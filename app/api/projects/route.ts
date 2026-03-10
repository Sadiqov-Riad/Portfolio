import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// POST /api/projects — create new project
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("portfolio");
    await db.collection("projects").insertOne({ ...body });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
