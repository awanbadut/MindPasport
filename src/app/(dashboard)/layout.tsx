import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar, { BottomNav } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

// Dashboard layout — wajib login, sidebar tetap di kiri
// Sesuai 02-arsitektur-teknis.md dan 15-design-system-ui.md

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop only (hidden on mobile via CSS inside Sidebar component) */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          userName={session.user.name ?? "Pengguna"}
          userEmail={session.user.email ?? "user@example.com"}
          userRole={session.user.role === "ADMIN" ? "Administrator" : "Pelajar / Mahasiswa"}
        />

        {/* Content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-24 md:pb-6">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  );
}
