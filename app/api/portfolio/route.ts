import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    const profile = await db.collection("profile").findOne({}, { projection: { _id: 0 } });
    const projects = await db.collection("projects").find({}, { projection: { _id: 0 } }).toArray();

    return NextResponse.json({ profile, projects });
  } catch {
    return NextResponse.json({ error: "DB connection failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("portfolio");
    await db.collection("profile").updateOne({}, { $set: body }, { upsert: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
