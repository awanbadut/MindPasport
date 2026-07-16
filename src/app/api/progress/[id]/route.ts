import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateProgressEntrySchema } from "@/lib/validation/progress";
import { applyProgressToSkill } from "@/lib/scoring";

// ==================== PATCH /api/progress/[id] ====================
// Edit entri progress

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

    const { id } = await params;
    const entry = await prisma.progressEntry.findUnique({ where: { id } });

    if (!entry) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Entri tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (entry.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = updateProgressEntrySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parseResult.error.issues[0]?.message ?? "Data tidak valid",
          },
        },
        { status: 400 }
      );
    }

    const { relatedSkillIds, startDate, endDate, ...data } = parseResult.data;

    const updated = await prisma.progressEntry.update({
      where: { id },
      data: {
        ...data,
        ...(startDate !== undefined ? { startDate: startDate ? new Date(startDate) : null } : {}),
        ...(endDate !== undefined ? { endDate: endDate ? new Date(endDate) : null } : {}),
        ...(relatedSkillIds !== undefined ? { relatedSkillIds: relatedSkillIds as any } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/progress/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== DELETE /api/progress/[id] ====================
// Hapus entri progress

export async function DELETE(
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
    const entry = await prisma.progressEntry.findUnique({ where: { id } });

    if (!entry) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Entri tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (entry.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    await prisma.progressEntry.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (err) {
    console.error("[DELETE /api/progress/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
