import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/readiness-score/latest — Skor terbaru saja

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const latest = await prisma.readinessScoreHistory.findFirst({
      where: { userId: session.user.id },
      orderBy: { calculatedAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Skor belum dihitung" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...latest,
        displayScore: Math.round(latest.finalScore),
      },
    });
  } catch (err) {
    console.error("[GET /api/readiness-score/latest] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
