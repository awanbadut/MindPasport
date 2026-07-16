import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// PATCH /api/admin/users/[id] — Ubah detail & password pengguna (admin only)
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
    const body = await request.json();
    const { role, name, email, educationLevel, institution, password } = body;

    // Proteksi: tidak bisa mengubah role diri sendiri
    if (role && id === session.user.id && role !== session.user.role) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Anda tidak bisa mengubah role Anda sendiri" } },
        { status: 400 }
      );
    }

    // Bangun payload update dinamis
    const updateData: any = {};

    if (role) {
      if (!Object.values(Role).includes(role)) {
        return NextResponse.json(
          { success: false, error: { code: "BAD_REQUEST", message: "Role tidak valid" } },
          { status: 400 }
        );
      }
      updateData.role = role as Role;
    }

    if (name !== undefined) updateData.name = name;
    if (educationLevel !== undefined) updateData.educationLevel = educationLevel;
    if (institution !== undefined) updateData.institution = institution;

    if (email !== undefined) {
      // Cek duplikasi email jika diubah
      const existing = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: { code: "EMAIL_EXISTS", message: "Email sudah terdaftar pada pengguna lain" } },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: { code: "BAD_REQUEST", message: "Password minimal harus 6 karakter" } },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        educationLevel: true,
        institution: true,
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
