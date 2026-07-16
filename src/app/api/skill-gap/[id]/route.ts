import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/skill-gap/[id] — Detail satu hasil analisis

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const analysis = await prisma.skillGapAnalysis.findUnique({
      where: { id },
      include: { careerRole: true },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Analisis tidak ditemukan" } },
        { status: 404 }
      );
    }

    // Cek kepemilikan data
    if (analysis.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: analysis });
  } catch (err) {
    console.error("[GET /api/skill-gap/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
