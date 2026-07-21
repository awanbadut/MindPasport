import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-purple-900/15 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[40%] h-[45%] rounded-full bg-sky-900/10 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="relative max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
            <img src="/logo.png" alt="Mind Passport Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-extrabold text-lg text-white leading-none tracking-tight">
            Mind Passport
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all hover:scale-105 shadow-md shadow-indigo-500/20"
            >
              Buka Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white text-sm font-semibold transition-colors px-3 py-2"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/10 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto w-full px-6 pt-16 pb-24 z-10 flex flex-col items-center">
        <div className="text-center space-y-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            ⚡ Digital Career Ecosystem
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-3xl mx-auto">
            Paspor Kompetensi Digital & <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Pengembangan Karier Modern</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Petakan potensi kepribadian (Career DNA), ukur kesenjangan keahlian, bangun roadmap belajar adaptif, dan capai skor kesiapan kerja terverifikasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5"
            >
              Buat Paspor Kompetensi
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 font-bold py-3.5 px-8 rounded-2xl transition-all"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-28 w-full">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Satu Dasbor, Lengkap dengan 9 Fitur Utama
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Ekosistem pembelajaran dan portofolio kompetensi tervalidasi yang terintegrasi secara otonom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {/* Card 1: Career DNA */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">1. Career DNA Assessment</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Kuesioner 5 dimensi (Direction, Nature, Ability, Career Fit, Growth Potential) untuk memetakan kepribadian, gaya belajar, dan minat karier Anda.
              </p>
            </div>

            {/* Card 2: Skill Gap Analysis */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-sky-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">2. Skill Gap Analysis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pilih jalur karier target Anda, bandingkan keahlian Anda saat ini dengan standar industri secara instan, dan temukan skill prioritas yang perlu dipelajari.
              </p>
            </div>

            {/* Card 3: Personalized Roadmap */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">3. Personalized Roadmap</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sistem secara otomatis memprioritaskan gap keahlian terbesar Anda menjadi peta pembelajaran yang dilengkapi deskripsi & opsi kegiatan nyata.
              </p>
            </div>

            {/* Card 4: Portfolio Progress Tracker */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-amber-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">4. Verified Skill Progress</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Log sertifikat pelatihan, proyek sampingan, atau magang Anda. Kenaikan nilai keahlian terverifikasi akan langsung tercermin secara otomatis.
              </p>
            </div>

            {/* Card 5: Digital Competency Passport */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-rose-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">5. Digital Competency Passport</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Miliki Paspor digital permanen berformat `MP-YYYY-MM-XXXXXX` yang aman, shareable lewat URL khusus, dan memiliki template cetak PDF siap saji.
              </p>
            </div>

            {/* Card 6: Career Navigator */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">6. Career Navigator</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Konsultasi karier dinamis dengan Career Navigator yang menganalisis rekam perkembangan Anda untuk merekomendasikan pelatihan/lowongan terbaik.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-step Process Section */}
        <div className="mt-32 w-full max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Langkah Menuju Kesiapan Kerja</h2>
            <p className="text-slate-400 text-sm mt-2">Cara mudah mendominasi pasar kerja industri bersama Mind Passport</p>
          </div>

          <div className="relative border-l-2 border-indigo-500/20 ml-4 md:ml-32 space-y-12">
            {/* Step 1 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-indigo-500 rounded-full border-4 border-slate-900 shadow-md shadow-indigo-500/30" />
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Langkah 01</span>
              <h3 className="text-xl font-bold mt-1 text-white">Petakan Career DNA</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Lakukan kuesioner interaktif 25 pertanyaan untuk mengidentifikasi 5 pilar karakter diri dan arah minat karier awal Anda secara ilmiah.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-sky-400 rounded-full border-4 border-slate-900 shadow-md shadow-sky-400/30" />
              <span className="text-sky-400 font-bold text-xs uppercase tracking-wider">Langkah 02</span>
              <h3 className="text-xl font-bold mt-1 text-white">Lakukan Skill Gap Analysis</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Pilih target peran karier industri yang diidamkan. Sistem akan membandingkan keahlian Anda dengan standar minimum industri dan menyusun prioritas gap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-emerald-400 rounded-full border-4 border-slate-900 shadow-md shadow-emerald-400/30" />
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Langkah 03</span>
              <h3 className="text-xl font-bold mt-1 text-white">Ikuti Rekomendasi Roadmap & Log Progres</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Tutup gap keahlian dengan mengikuti rekomendasi roadmap. Log setiap progres pelatihan/proyek Anda untuk meningkatkan Career Readiness Score.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-rose-400 rounded-full border-4 border-slate-900 shadow-md shadow-rose-400/30" />
              <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">Langkah 04</span>
              <h3 className="text-xl font-bold mt-1 text-white">Publikasikan Paspor Kompetensi Anda</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Bagikan tautan paspor digital Anda yang unik dan terverifikasi kepada calon rekruter atau cetak langsung dalam bentuk PDF premium untuk melamar pekerjaan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-slate-500 text-xs z-10 bg-slate-950/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Mind Passport. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
