import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";

// GET /api/admin/logs — Ambil login audit logs dari MongoDB
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: { message: "Akses ditolak." } }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 20;
  const skip = (page - 1) * limit;
  const filter = searchParams.get("filter") ?? "all"; // all | success | failed

  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ success: false, error: { message: "MongoDB tidak terhubung." } }, { status: 503 });
    }

    const query: Record<string, unknown> =
      filter === "success" ? { success: true } :
      filter === "failed"  ? { success: false } : {};

    const [logs, total] = await Promise.all([
      db.collection("login_logs")
        .find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("login_logs").countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/logs] Error:", err);
    return NextResponse.json({ success: false, error: { message: "Gagal mengambil log." } }, { status: 500 });
  }
}
