import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createProgressEntrySchema } from "@/lib/validation/progress";
import { applyProgressToSkill } from "@/lib/scoring";

// ==================== POST /api/progress ====================
// Tambah entri aktivitas baru

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = createProgressEntrySchema.safeParse(body);
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

    const entry = await prisma.progressEntry.create({
      data: {
        userId: session.user.id,
        ...data,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        relatedSkillIds: relatedSkillIds ? (relatedSkillIds as any) : undefined,
      },
    });

    // Jika ada relatedSkillIds, update UserSkill.currentScore (opsional peningkatan kecil)
    if (relatedSkillIds && relatedSkillIds.length > 0) {
      await Promise.all(
        relatedSkillIds.map(async (skillId) => {
          const existing = await prisma.userSkill.findUnique({
            where: { userId_skillId: { userId: session.user.id, skillId } },
          });
          const currentScore = existing?.currentScore ?? 0;
          const newScore = applyProgressToSkill(currentScore, data.type);

          await prisma.userSkill.upsert({
            where: { userId_skillId: { userId: session.user.id, skillId } },
            create: {
              userId: session.user.id,
              skillId,
              currentScore: newScore,
              source: "project",
            },
            update: { currentScore: newScore },
          });
        })
      );
    }

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/progress] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== GET /api/progress ====================
// Daftar entri progress (support filter type, sort by date)

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const entries = await prisma.progressEntry.findMany({
      where: {
        userId: session.user.id,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: entries });
  } catch (err) {
    console.error("[GET /api/progress] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
