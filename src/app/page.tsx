import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 flex flex-col justify-between text-white relative overflow-x-hidden">
      {/* Background Glows Dekoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-sky-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 right-10 w-[500px] h-[500px] bg-emerald-500 rounded-full opacity-5 blur-3xl" />
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

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto w-full px-6 pt-16 pb-24 z-10 flex flex-col items-center">
        <div className="text-center space-y-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
            ⚡ Powered by Gemini 2.0 AI
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-3xl mx-auto">
            Paspor Kompetensi Digital & <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">Pengembangan Karier AI</span>
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
              className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-8 rounded-2xl transition-all"
            >
              Dashboard Masuk
            </Link>
          </div>
        </div>

        {/* Feature Grid Section */}
        <div className="mt-28 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Fitur Unggulan Mind Passport</h2>
            <p className="text-slate-400 text-sm mt-2">Seluruh ekosistem digital untuk menuntun langkah kariermu secara presisi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Career DNA */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.571V11a4 4 0 118 0v.571c0 1.925.354 3.79 1 5.52M15 21a3 3 0 11-6 0m6 0h-6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">1. Career DNA Assessment</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pemetaan komprehensif atas 5 dimensi kepribadian (Direction, Nature, Ability, Career Fit, Growth Potential) untuk melahirkan radar visualisasi yang akurat.
              </p>
            </div>

            {/* Card 2: Skill Gap Analysis */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-sky-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-sky-500/10 text-sky-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">2. Skill Gap Analysis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Pilih peran target industri impianmu, masukkan nilai keahlianmu, dan bandingkan secara langsung dengan nilai standar industri yang berlaku.
              </p>
            </div>

            {/* Card 3: Adaptive Learning Roadmap */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">3. Personalized Roadmap</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Asisten AI Gemini secara otomatis memprioritaskan gap keahlian terbesar Anda menjadi peta pembelajaran yang dilengkapi deskripsi & opsi kegiatan nyata.
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

            {/* Card 6: AI Career Navigator */}
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-all hover:bg-white/[0.05] group">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">6. AI Career Navigator</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Konsultasi karier dinamis dengan AI Navigator yang menganalisis rekam perkembangan Anda untuk merekomendasikan pelatihan/lowongan terbaik.
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
              <h3 className="text-xl font-bold mt-1 text-white">Gunakan Rekomendasi AI & Log Progres</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Tutup gap keahlian dengan mengikuti rekomendasi roadmap buatan AI. Log setiap progres pelatihan/proyek Anda untuk meningkatkan Career Readiness Score.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-rose-400 rounded-full border-4 border-slate-900 shadow-md shadow-rose-400/30" />
              <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">Langkah 04</span>
              <h3 className="text-xl font-bold mt-1 text-white">Pamerkan Paspor Kompetensi Terverifikasi</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Unduh cetak PDF Paspor Kompetensi Anda yang berisi kualifikasi terverifikasi admin atau bagikan QR Code unik ke LinkedIn dan tim rekrutmen.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto w-full px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500 z-10">
        <p>&copy; {new Date().getFullYear()} Mind Passport. Made for Digital Competency & Career Development.</p>
      </footer>
    </div>
  );
}
