import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import QRCode from "qrcode";

// GET /api/passport/qrcode — Generate QR code base64 PNG dari URL publik passport

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Belum login" } },
        { status: 401 }
      );
    }

    const passport = await prisma.competencyPassport.findUnique({
      where: { userId: session.user.id },
    });

    if (!passport) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Passport belum dibuat" } },
        { status: 404 }
      );
    }

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://mind-pasport-awanbadutt77.vercel.app");

    const cleanBaseUrl = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const publicUrl = `${cleanBaseUrl.replace(/\/$/, "")}/passport/${passport.publicSlug}`;

    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1e1b4b", // Dark indigo for high contrast scan
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      success: true,
      data: { qrCode: qrCodeDataUrl, publicUrl },
    });
  } catch (err) {
    console.error("[GET /api/passport/qrcode] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan server" } },
      { status: 500 }
    );
  }
}
