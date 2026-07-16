import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mind Passport — Paspor Kompetensi Digital",
    template: "%s | Mind Passport",
  },
  description:
    "Paspor kompetensi digital untuk menunjang pengembangan karier. Petakan potensi, analisis gap skill, susun roadmap, dan ukur kesiapan kariermu.",
  keywords: ["karier", "skill", "kompetensi", "pengembangan diri", "career readiness"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
