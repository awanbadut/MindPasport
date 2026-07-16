import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/admin/progress/[id]/verify — Verifikasi entri progress (admin only)
// Sesuai 09-fitur-skill-progress-tracker.md

export async function PATCH(
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin yang bisa memverifikasi" } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const entry = await prisma.progressEntry.findUnique({ where: { id } });

    if (!entry) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Entri tidak ditemukan" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const verified = typeof body.verified === "boolean" ? body.verified : true;

    const updated = await prisma.progressEntry.update({
      where: { id },
      data: { verified },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/admin/progress/[id]/verify] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
