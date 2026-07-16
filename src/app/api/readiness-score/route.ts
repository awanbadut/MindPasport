import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/readiness-score — Riwayat skor untuk grafik tren

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const scores = await prisma.readinessScoreHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { calculatedAt: "asc" }, // ascending untuk grafik tren
    });

    return NextResponse.json({ success: true, data: scores });
  } catch (err) {
    console.error("[GET /api/readiness-score] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
