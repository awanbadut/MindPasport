import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex flex-col justify-between text-white relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Header / Navbar */}
      <header className="relative max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">Mind Passport</span>
            <p className="text-[10px] text-indigo-300">Paspor Kompetensi Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-indigo-200 hover:text-white transition-colors">
            Masuk
          </Link>
          <Link
            href="/register"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40"
          >
            Daftar
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative max-w-4xl mx-auto w-full px-6 py-16 text-center space-y-8 z-10 my-auto">
        <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
          🚀 Next-Gen Career Portfolio
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-3xl mx-auto">
          Miliki Paspor Kompetensi Digital Terbaikmu
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Mind Passport memetakan potensi diri (Career DNA), menganalisis kesenjangan skill, menyusun roadmap pembelajaran, dan mengukur kesiapan kerja Anda secara otonom dengan Gemini AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            Mulai Sekarang — Gratis
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-2xl transition-all"
          >
            Masuk ke Akun
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto w-full px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} Mind Passport. Made for Digital Competency & Career Development.</p>
      </footer>
    </div>
  );
}
