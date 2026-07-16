import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { industryMatchRequestSchema } from "@/lib/validation/industry-match";
import { calculateMatchPercent } from "@/lib/scoring";
import { generateTextResponse } from "@/lib/gemini";
import type { MatchingSkill, MissingSkill } from "@/types";

// POST /api/industry-match — Hitung kecocokan user dengan career roles

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
    const parseResult = industryMatchRequestSchema.safeParse(body);
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

    const { careerRoleId } = parseResult.data;
    const userId = session.user.id;

    // Ambil semua career roles yang akan dicek
    const careerRoles = await prisma.careerRole.findMany({
      where: careerRoleId ? { id: careerRoleId } : {},
      include: {
        industryStandards: {
          include: { skill: true },
        },
      },
    });

    if (careerRoles.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tidak ada career role yang ditemukan" } },
        { status: 404 }
      );
    }

    // Ambil semua UserSkill user
    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });
    const userSkillMap = new Map(userSkills.map(s => [s.skillId, s.currentScore]));

    // Hitung match percent untuk tiap role (MATEMATIS, tidak butuh AI)
    const results = [];
    for (const role of careerRoles) {
      if (role.industryStandards.length === 0) continue;

      const skillsData = role.industryStandards.map(std => ({
        skillId: std.skillId,
        skillName: std.skill.name,
        weight: std.weightPercent,
        userScore: userSkillMap.get(std.skillId) ?? 0, // 0 jika tidak punya skill tsb
        industryScore: std.standardScore,
      }));

      const matchPercent = calculateMatchPercent(skillsData);

      // matchingSkills: userScore >= industryScore * 0.8
      const matchingSkills: MatchingSkill[] = skillsData
        .filter(s => s.userScore >= s.industryScore * 0.8)
        .map(s => ({
          skillId: s.skillId,
          skillName: s.skillName,
          userScore: s.userScore,
          industryScore: s.industryScore,
        }));

      // missingSkills: sisanya, diurutkan dari gap terbesar
      const missingSkills: MissingSkill[] = skillsData
        .filter(s => s.userScore < s.industryScore * 0.8)
        .map(s => ({
          skillId: s.skillId,
          skillName: s.skillName,
          userScore: s.userScore,
          industryScore: s.industryScore,
          gap: s.userScore - s.industryScore,
        }))
        .sort((a, b) => a.gap - b.gap); // sort dari gap terkecil (paling negatif = paling butuh)

      // Simpan hasil
      const matchResult = await prisma.industryMatchResult.create({
        data: {
          userId,
          careerRoleId: role.id,
          matchPercent,
          matchingSkills: matchingSkills as any,
          missingSkills: missingSkills as any,
        },
      });

      results.push({
        ...matchResult,
        careerRole: { id: role.id, title: role.title, category: role.category, level: role.level },
        narrative: null as string | null, // akan diisi dari AI jika tersedia
      });
    }

    // Urutkan dari match tertinggi
    results.sort((a, b) => b.matchPercent - a.matchPercent);

    // Coba generate naratif singkat dari Gemini (OPSIONAL - jangan gagalkan kalau AI error)
    if (results.length > 0) {
      const topResult = results[0];
      const narrativeResult = await generateTextResponse({
        systemInstruction: "Kamu adalah konselor karier. Buat kalimat naratif singkat (1-2 kalimat) dalam Bahasa Indonesia tentang tingkat kecocokan pengguna dengan karier ini. Fokus pada kekuatan dan apa yang perlu ditingkatkan. Jangan gunakan angka persentase.",
        userPrompt: `Karier: ${topResult.careerRole.title}
Match: ${topResult.matchPercent}%
Skill cocok: ${((topResult.matchingSkills as unknown) as MatchingSkill[]).map(s => s.skillName).join(", ") || "belum ada"}
Skill kurang: ${((topResult.missingSkills as unknown) as MissingSkill[]).slice(0, 3).map(s => s.skillName).join(", ") || "semua terpenuhi"}`,
      });

      if (narrativeResult.success) {
        results[0].narrative = narrativeResult.data;
      }
      // Jika gagal, narrative tetap null — fitur tetap berfungsi
    }

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("[POST /api/industry-match] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// GET /api/industry-match — Riwayat hasil pencocokan

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    // Ambil hasil unik terbaru per careerRole
    const matches = await prisma.industryMatchResult.findMany({
      where: { userId: session.user.id },
      include: { careerRole: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: matches });
  } catch (err) {
    console.error("[GET /api/industry-match] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
