import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateRoadmapItemSchema } from "@/lib/validation/roadmap";

// PATCH /api/roadmap/item/[id] — Update status item roadmap

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

    const body = await request.json();
    const parseResult = updateRoadmapItemSchema.safeParse(body);
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

    const { id } = await params;
    const { status } = parseResult.data;

    // Cek item ada dan milik user (via join ke roadmap)
    const item = await prisma.roadmapItem.findUnique({
      where: { id },
      include: { roadmap: true },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Item roadmap tidak ditemukan" } },
        { status: 404 }
      );
    }

    if (item.roadmap.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Akses ditolak" } },
        { status: 403 }
      );
    }

    const updatedItem = await prisma.roadmapItem.update({
      where: { id },
      data: {
        status,
        completedAt: status === "done" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (err) {
    console.error("[PATCH /api/roadmap/item/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
