import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/career-roles — Daftar semua CareerRole untuk dropdown
// Endpoint publik bagi user login untuk pilih karier tujuan

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const careerRoles = await prisma.careerRole.findMany({
      orderBy: [{ category: "asc" }, { title: "asc" }],
      select: {
        id: true,
        title: true,
        category: true,
        level: true,
        description: true,
      },
    });

    return NextResponse.json({ success: true, data: careerRoles });
  } catch (err) {
    console.error("[GET /api/career-roles] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
