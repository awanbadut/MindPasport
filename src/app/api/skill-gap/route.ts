import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { skillGapRequestSchema } from "@/lib/validation/skill-gap";
import {
  buildGapDetail,
  calculateOverallReadiness,
  calculateTotalGapPoints,
  applyProgressToSkill,
} from "@/lib/scoring";
import type { GapDetail } from "@/types";

// ==================== POST /api/skill-gap ====================
// Hitung gap, simpan SkillGapAnalysis, upsert UserSkill

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
    const parseResult = skillGapRequestSchema.safeParse(body);
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

    const { careerRoleId, userSkillScores } = parseResult.data;

    // Ambil standar industri untuk role yang dipilih
    const industryStandards = await prisma.industryStandardSkill.findMany({
      where: { careerRoleId },
      include: { skill: true },
    });

    if (industryStandards.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_STANDARDS",
            message: "Standar kompetensi untuk karier ini belum tersedia",
          },
        },
        { status: 400 }
      );
    }

    // Buat map dari userSkillScores untuk lookup cepat
    const userScoreMap = new Map(userSkillScores.map(s => [s.skillId, s.score]));

    // Hitung gap detail untuk tiap skill dalam standar industri
    const gapDetails: GapDetail[] = industryStandards.map(std => {
      const userScore = userScoreMap.get(std.skillId) ?? 0; // default 0 jika tidak diisi
      return buildGapDetail({
        skillId: std.skillId,
        skillName: std.skill.name,
        skillCategory: std.skill.category,
        weight: std.weightPercent,
        userScore,
        industryScore: std.standardScore,
      });
    });

    // Hitung overall readiness dan total gap
    const overallReadinessPercent = calculateOverallReadiness(
      gapDetails.map(d => ({
        weight: d.weight,
        userScore: d.userScore,
        industryScore: d.industryScore,
      }))
    );
    const totalGapPoints = calculateTotalGapPoints(gapDetails.map(d => d.gap));

    // Simpan SkillGapAnalysis
    const analysis = await prisma.skillGapAnalysis.create({
      data: {
        userId: session.user.id,
        careerRoleId,
        overallReadinessPercent,
        totalGapPoints,
        gapDetails: gapDetails as any,
      },
    });

    // Upsert UserSkill untuk tiap skill yang dinilai user (hanya yang ada di userSkillScores)
    // Ini agar jadi acuan default di analisis berikutnya
    await Promise.all(
      userSkillScores.map(({ skillId, score }) =>
        prisma.userSkill.upsert({
          where: { userId_skillId: { userId: session.user.id, skillId } },
          create: {
            userId: session.user.id,
            skillId,
            currentScore: score,
            source: "self-assessment",
          },
          update: {
            currentScore: score,
            source: "self-assessment",
          },
        })
      )
    );

    // Otomatis perbarui Career Readiness Score
    const { updateReadinessScore } = await import("@/lib/readiness-calculator");
    await updateReadinessScore(session.user.id);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...analysis,
          gapDetails,
          careerRole: await prisma.careerRole.findUnique({ where: { id: careerRoleId } }),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/skill-gap] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== GET /api/skill-gap ====================
// Riwayat semua analisis gap milik user

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const analyses = await prisma.skillGapAnalysis.findMany({
      where: { userId: session.user.id },
      include: { careerRole: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: analyses });
  } catch (err) {
    console.error("[GET /api/skill-gap] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
