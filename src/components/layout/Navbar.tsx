'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onMenuClick?: () => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userAvatar?: string;
}

const breadcrumbMap: Record<string, string> = {
  '/dashboard':       'Dashboard',
  '/career-dna':      'Career DNA Assessment',
  '/skill-gap':       'Skill Gap Analysis',
  '/roadmap':         'Learning Roadmap',
  '/industry-match':  'Industry Fit Match',
  '/navigator':       'Career Navigator',
  '/progress':        'Learning Progress Tracker',
  '/readiness-score': 'Readiness Score',
  '/admin/verify':    'Verifikasi Progres',
  '/admin/standards': 'Atur Standar Industri',
  '/admin/users':     'Kelola Pengguna',
  '/admin/logs':      'Log Login',
};

const notifications = [
  {
    id: '1',
    title: 'Career DNA selesai dianalisis',
    description: 'Hasil analisis 5 dimensi Anda sudah siap.',
    time: '5 menit lalu',
    read: false,
    icon: '🧬',
  },
  {
    id: '2',
    title: 'Roadmap baru tersedia',
    description: 'Roadmap "Frontend Developer" telah dibuat.',
    time: '1 jam lalu',
    read: false,
    icon: '🗺️',
  },
  {
    id: '3',
    title: 'Skill Gap Analysis selesai',
    description: '3 skill prioritas diidentifikasi untuk Anda.',
    time: '3 jam lalu',
    read: true,
    icon: '📊',
  },
];

export function Navbar({
  onMenuClick,
  userName = 'Pengguna',
  userEmail = 'user@example.com',
  userRole = 'Pelajar',
}: NavbarProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pageTitle = breadcrumbMap[pathname] ?? 'Mind Passport';
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Buka menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">{pageTitle}</h1>
        <p className="hidden sm:block text-xs text-slate-400 leading-none mt-0.5">
          Mind Passport &rsaquo; {pageTitle}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Search (decorative – TODO fase 2) */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          aria-label="Cari"
          // TODO fase 2: implement global search
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Cari...</span>
          <kbd className="ml-auto text-xs bg-slate-200 px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Notifikasi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Notifikasi</span>
                <span className="text-xs text-[#4F46E5] font-medium cursor-pointer hover:underline">
                  Tandai semua dibaca
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={[
                      'flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors',
                      !n.read ? 'bg-indigo-50/50' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <div className="flex-shrink-0 w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center text-lg">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 leading-snug">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#4F46E5] mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-slate-100">
                <button className="text-xs text-[#4F46E5] font-medium hover:underline w-full text-center py-1">
                  Lihat semua notifikasi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Menu profil"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                {userName}
              </p>
              <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">
                {userRole}
              </p>
            </div>
            <svg className="hidden md:block w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{userName}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{userEmail}</p>
                <span className="inline-flex mt-1.5 items-center px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {userRole}
                </span>
              </div>

              {/* Links */}
              <div className="py-1">
                {[
                  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
                  { label: 'Mind Passport Saya', href: '/passport', icon: '🪪' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                
                {userRole === "Administrator" && (
                  <>
                    <div className="border-t border-slate-100 my-1" />
                    {[
                      { label: 'Verifikasi Progres', href: '/admin/verify', icon: '📥' },
                      { label: 'Atur Standar Industri', href: '/admin/standards', icon: '⚙️' },
                      { label: 'Kelola Pengguna', href: '/admin/users', icon: '👥' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors font-medium"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </div>

                <button
                  onClick={async () => {
                    const { logoutAction } = await import("@/lib/actions/auth");
                    await logoutAction();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50 transition-colors font-medium text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Keluar dari Akun
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
