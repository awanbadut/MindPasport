"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(email: string, password: string): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau kata sandi salah. Silakan periksa kembali." };
        default:
          return { error: "Terjadi kesalahan autentikasi. Silakan coba lagi." };
      }
    }
    // Jika bukan AuthError, mungkin adalah redirect — ini normal di server action
    throw error;
  }
}
