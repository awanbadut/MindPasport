import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatePassportSchema } from "@/lib/validation/passport";
import { customAlphabet } from "nanoid";
import QRCode from "qrcode";

// Helper untuk generate passport number: MP-YYYY-MM-XXXXXX
function generatePassportNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return `MP-${year}-${month}-${random}`;
}

// Helper untuk generate unique publicSlug (12 char nanoid)
const generateSlug = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);

// ==================== GET /api/passport ====================
// Ambil atau buat passport milik user login

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Cari atau buat passport
    let passport = await prisma.competencyPassport.findUnique({
      where: { userId },
    });

    if (!passport) {
      // Generate slug unik (retry jika collision)
      let slug = generateSlug();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await prisma.competencyPassport.findUnique({ where: { publicSlug: slug } });
        if (!existing) break;
        slug = generateSlug();
        attempts++;
      }

      passport = await prisma.competencyPassport.create({
        data: {
          userId,
          passportNumber: generatePassportNumber(),
          publicSlug: slug,
          isPublic: false,
        },
      });
    }

    // Agregasi data dari fitur lain (read-only, tidak disimpan di tabel sendiri)
    const [user, careerDNA, userSkills, progressEntries, latestReadiness] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, institution: true, educationLevel: true, createdAt: true },
      }),
      prisma.careerDNA.findUnique({ where: { userId } }),
      prisma.userSkill.findMany({
        where: { userId },
        include: { skill: true },
        orderBy: { currentScore: "desc" },
      }),
      prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.readinessScoreHistory.findFirst({
        where: { userId },
        orderBy: { calculatedAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        passport,
        user,
        careerDNA,
        userSkills,
        progressEntries,
        latestReadiness,
        // Generate QR URL (bukan base64, cukup URL publik)
        publicUrl: `${process.env.NEXTAUTH_URL}/passport/${passport.publicSlug}`,
      },
    });
  } catch (err) {
    console.error("[GET /api/passport] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// ==================== PATCH /api/passport ====================
// Update visibilitas (isPublic) atau regenerasi publicSlug

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = updatePassportSchema.safeParse(body);
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

    const { isPublic, regenerateSlug } = parseResult.data;

    let newSlug: string | undefined;
    if (regenerateSlug) {
      // Generate slug baru yang unik
      let slug = generateSlug();
      let attempts = 0;
      while (attempts < 5) {
        const existing = await prisma.competencyPassport.findUnique({ where: { publicSlug: slug } });
        if (!existing) break;
        slug = generateSlug();
        attempts++;
      }
      newSlug = slug;
    }

    const updated = await prisma.competencyPassport.update({
      where: { userId: session.user.id },
      data: {
        ...(isPublic !== undefined ? { isPublic } : {}),
        ...(newSlug ? { publicSlug: newSlug } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/passport] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
