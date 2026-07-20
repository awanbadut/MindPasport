'use client';

import { useState } from 'react';
import Sidebar, { BottomNav } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

interface DashboardShellProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({
  children,
  userRole,
  userName = "Pengguna",
  userEmail = "user@example.com",
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userRole === "ADMIN";

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar userRole={userRole} />
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1E1B4B] shadow-2xl z-10">
            {/* Close button */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Tutup menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Sidebar userRole={userRole} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          onMenuClick={() => setMobileMenuOpen(true)}
          userName={userName}
          userEmail={userEmail}
          userRole={isAdmin ? "Administrator" : "Pelajar / Mahasiswa"}
        />

        {/* Content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-24 md:pb-6">
          {/* Admin Banner on Mobile if in Admin Mode */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm md:hidden">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
                ADMIN MODE ACTIVE
              </span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Panel Kontrol
              </span>
            </div>
          )}

          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile only (Adapts to Admin vs User role) */}
      <BottomNav userRole={userRole} />
    </div>
  );
}

export default DashboardShell;
