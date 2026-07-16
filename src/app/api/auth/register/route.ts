import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";

// POST /api/auth/register — Registrasi user baru
// Sesuai 04-auth-dan-roles.md: validasi server (Zod), hash password bcrypt 10 rounds

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi input di server dengan Zod
    const parseResult = registerSchema.safeParse(body);
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

    const { name, email, password, educationLevel, institution } = parseResult.data;

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "Email sudah terdaftar",
          },
        },
        { status: 400 }
      );
    }

    // Hash password dengan bcrypt (10 salt rounds sesuai spesifikasi)
    const passwordHash = await bcrypt.hash(password, 10);

    // Buat user baru, role default USER
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
        educationLevel: educationLevel ?? null,
        institution: institution ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/auth/register] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Terjadi kesalahan server",
        },
      },
      { status: 500 }
    );
  }
}
