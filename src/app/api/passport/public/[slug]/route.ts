import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/passport/public/[slug] — PUBLIK, tanpa login
// Hanya tampilkan data terbatas dari passport yang isPublic: true

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const passport = await prisma.competencyPassport.findUnique({
      where: { publicSlug: slug },
      include: { user: true },
    });

    if (!passport) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Passport tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (!passport.isPublic) {
      return NextResponse.json(
        { success: false, error: { code: "PRIVATE", message: "Passport ini bersifat privat" } },
        { status: 403 }
      );
    }

    const userId = passport.userId;

    // Ambil data terbatas — JANGAN tampilkan rawAnswers atau data sensitif
    const [latestReadiness, userSkills, progressEntries] = await Promise.all([
      prisma.readinessScoreHistory.findFirst({
        where: { userId },
        orderBy: { calculatedAt: "desc" },
        select: { category: true, finalScore: true, calculatedAt: true },
      }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: { select: { name: true, category: true } } },
        orderBy: { currentScore: "desc" },
        take: 10, // top 10 skill
      }),
      prisma.progressEntry.findMany({
        where: { userId }, // Tampilkan semua aktivitas beserta status verifikasinya
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          type: true,
          title: true,
          organizer: true,
          startDate: true,
          endDate: true,
          verified: true,
        },
      }),
    ]);

    // Data identitas dasar — TIDAK termasuk email untuk privacy
    const publicData = {
      passportNumber: passport.passportNumber,
      issuedAt: passport.issuedAt,
      lastUpdatedAt: passport.lastUpdatedAt,
      user: {
        name: passport.user.name,
        institution: passport.user.institution,
        educationLevel: passport.user.educationLevel,
      },
      // Hanya kategori kesiapan, bukan breakdown detail
      readiness: latestReadiness
        ? { category: latestReadiness.category, score: Math.round(latestReadiness.finalScore) }
        : null,
      topSkills: userSkills.map(s => ({
        name: s.skill.name,
        category: s.skill.category,
        score: s.currentScore,
      })),
      verifiedExperiences: progressEntries,
    };

    return NextResponse.json({ success: true, data: publicData });
  } catch (err) {
    console.error("[GET /api/passport/public/[slug]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
