import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";

// Dashboard layout — wajib login, menggunakan DashboardShell responsive
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
    <DashboardShell
      userRole={session.user.role}
      userName={session.user.name ?? "Pengguna"}
      userEmail={session.user.email ?? "user@example.com"}
    >
      {children}
    </DashboardShell>
  );
}
