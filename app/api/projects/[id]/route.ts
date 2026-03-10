import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// PUT /api/projects/[id] — update project
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");
    await db.collection("projects").updateOne({ id: params.id }, { $set: body });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/projects/[id] — delete project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    await db.collection("projects").deleteOne({ id: params.id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
