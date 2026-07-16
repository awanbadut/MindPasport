import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

// PATCH /api/admin/users/[id] — Ubah role pengguna (admin only)
// DELETE /api/admin/users/[id] — Hapus pengguna (admin only)

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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin yang bisa mengakses data ini" } },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Proteksi: tidak bisa mengubah role diri sendiri
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Anda tidak bisa mengubah role Anda sendiri" } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !Object.values(Role).includes(role)) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Role tidak valid" } },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Hanya admin yang bisa mengakses data ini" } },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Proteksi: tidak bisa menghapus diri sendiri
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Anda tidak bisa menghapus akun Anda sendiri" } },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Pengguna tidak ditemukan" } },
        { status: 404 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Pengguna berhasil dihapus" });
  } catch (err) {
    console.error("[DELETE /api/admin/users/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
