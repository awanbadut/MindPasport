import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Endpoint SEMENTARA untuk debug login — hapus setelah masalah selesai
// GET /api/debug-login?email=xxx&password=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  if (!email || !password) {
    return NextResponse.json({ error: "email dan password diperlukan sebagai query params" });
  }

  const steps: Record<string, unknown> = {};

  try {
    // Step 1: Cari user di DB
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });

    steps.step1_find_user = user
      ? { found: true, name: user.name, role: user.role, hashLen: user.passwordHash.length, hashPrefix: user.passwordHash.substring(0, 10) }
      : { found: false };

    if (!user) {
      return NextResponse.json({ success: false, failedAt: "step1_find_user", steps });
    }

    // Step 2: bcrypt.compare
    const isValid = await bcrypt.compare(password, user.passwordHash);
    steps.step2_bcrypt_compare = { isValid };

    if (!isValid) {
      return NextResponse.json({ success: false, failedAt: "step2_bcrypt_compare", steps });
    }

    // Step 3: Semua OK
    steps.step3_authorize_return = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ success: true, steps });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      failedAt: "exception",
      error: err instanceof Error ? err.message : String(err),
      steps,
    });
  }
}
