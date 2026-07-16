import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const careerRoleSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.string().max(100).optional(),
  level: z.enum(["Entry Level", "Mid", "Senior"]).optional(),
  description: z.string().max(1000).optional(),
});

// GET /api/admin/career-roles — Daftar semua career roles
// POST /api/admin/career-roles — Tambah career role baru

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin" } },
        { status: 403 }
      );
    }

    const roles = await prisma.careerRole.findMany({
      include: { _count: { select: { industryStandards: true } } },
      orderBy: [{ category: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ success: true, data: roles });
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
    const parseResult = careerRoleSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parseResult.error.issues[0]?.message ?? "Data tidak valid" },
        },
        { status: 400 }
      );
    }

    const role = await prisma.careerRole.create({ data: parseResult.data });
    return NextResponse.json({ success: true, data: role }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
