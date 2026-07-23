import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const skillSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(["Hard Skill", "Soft Skill", "Tools & Technical Competencies"]),
});

// GET /api/admin/skills — Daftar semua skill
// POST /api/admin/skills — Tambah skill baru
// Wajib role ADMIN

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const skills = await prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ success: true, data: skills });
  } catch (err) {
    console.error("[GET /api/admin/skills] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin yang bisa mengakses ini" } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = skillSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parseResult.error.issues[0]?.message ?? "Data tidak valid" },
        },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({ data: parseResult.data });
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/skills] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
