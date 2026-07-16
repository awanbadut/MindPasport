import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const industryStandardSchema = z.object({
  careerRoleId: z.string().cuid(),
  skillId: z.string().cuid(),
  weightPercent: z.number().int().min(1).max(100),
  standardScore: z.number().int().min(0).max(100),
});

// GET /api/admin/industry-standards — Daftar IndustryStandardSkill
// POST /api/admin/industry-standards — Tambah/update standar

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } },
        { status: 403 }
      );
    }

    const standards = await prisma.industryStandardSkill.findMany({
      include: { skill: true, careerRole: true },
      orderBy: [{ careerRole: { title: "asc" } }, { weightPercent: "desc" }],
    });
    return NextResponse.json({ success: true, data: standards });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = industryStandardSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parseResult.error.issues[0]?.message ?? "Data tidak valid" },
        },
        { status: 400 }
      );
    }

    const { careerRoleId, skillId, weightPercent, standardScore } = parseResult.data;
    const standard = await prisma.industryStandardSkill.upsert({
      where: { careerRoleId_skillId: { careerRoleId, skillId } },
      create: { careerRoleId, skillId, weightPercent, standardScore },
      update: { weightPercent, standardScore },
      include: { skill: true, careerRole: true },
    });

    return NextResponse.json({ success: true, data: standard }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
