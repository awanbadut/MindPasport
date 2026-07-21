import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/roadmap/[id] — Detail satu roadmap beserta item-nya

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const roadmap = await prisma.skillRoadmap.findUnique({
      where: { id },
      include: {
        careerRole: true,
        items: { orderBy: { stageNumber: "asc" } },
      },
    });

    if (!roadmap) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Roadmap tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (roadmap.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: roadmap });
  } catch (err) {
    console.error("[GET /api/roadmap/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

// PATCH /api/roadmap/[id] — Update dimulainya roadmap & perpanjangan durasi (extend days)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.skillRoadmap.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Roadmap tidak ditemukan" } },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.action === "start") {
      updateData.startedAt = new Date();
    }
    if (typeof body.extendDays === "number") {
      updateData.extendedDays = (existing.extendedDays || 0) + body.extendDays;
    }
    if (typeof body.targetDays === "number") {
      updateData.targetDays = body.targetDays;
    }
    if (body.status) {
      updateData.status = body.status;
    }

    const updated = await prisma.skillRoadmap.update({
      where: { id },
      data: updateData,
      include: {
        careerRole: true,
        items: { orderBy: { stageNumber: "asc" } },
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[PATCH /api/roadmap/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
