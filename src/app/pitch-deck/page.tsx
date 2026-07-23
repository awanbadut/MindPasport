"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    tag: "🚀 LOMBA INOVASI DIGITAL 2026",
    title: "Mind Passport",
    subtitle: "Ekosistem Digital Paspor Kompetensi & Kesiapan Kerja Otonom Berbasis AI",
    notes: "Selamat pagi/siang Bapak/Ibu dewan juri. Saya Zikry Kurniawan dari tim Mind Passport. Hari ini kami bangga menghadirkan Mind Passport — Ekosistem Digital Paspor Kompetensi dan Kesiapan Kerja Otonom berbasis AI. Platform ini menjembatani jurang antara lulusan perguruan tinggi dengan ekspektasi nyata standar industri modern.",
    content: (
      <div className="text-center max-w-4xl mx-auto py-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-300 to-sky-400 bg-clip-text text-transparent mb-6">
          Mind Passport
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Platform Kesiapan Kerja Otonom Berbasis AI untuk Memetakan, Mengukur, Mengarahkan, Memverifikasi, dan Membuktikan Kesiapan Kerja Mahasiswa.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">👨‍💻</span>
            <div className="text-left">
              <div className="text-xs text-slate-400">Lead Architect</div>
              <div className="font-bold text-white">Zikry Kurniawan & Team</div>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div className="text-left">
              <div className="text-xs text-slate-400">Tech Stack</div>
              <div className="font-bold text-sky-400">Next.js 15 • Gemini AI • Neon DB</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    tag: "⚠️ PROBLEM STATEMENT",
    title: "Krisis Kesenjangan Keahlian (Skill Gap)",
    subtitle: "Mengapa jutaan lulusan perguruan tinggi kesulitan menembus standar riil dunia kerja modern?",
    notes: "Setiap tahun Indonesia meluluskan lebih dari 1.5 juta sarjana, namun angka pengangguran terdidik masih tinggi. Ada 3 masalah utama: 1) Skill gap ekstrem antara kurikulum vs industri, 2) Ijazah fisik yang statis tanpa bukti praktik yang teruji, 3) Kebingungan mahasiswa menentukan arah belajar mandiri.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 p-6 rounded-2xl transition">
          <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-2.5 py-1 rounded-md">MASALAH 1</span>
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center text-2xl my-4">📉</div>
          <h3 className="text-xl font-bold text-white mb-2">Skill Gap Ekstrem</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Kurikulum akademis sering terlambat merespons perkembangan pesat industri teknologi, membuat mahasiwa tak tahu persis kelemahan skill mereka.
          </p>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl transition">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-md">MASALAH 2</span>
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center text-2xl my-4">📄</div>
          <h3 className="text-xl font-bold text-white mb-2">Ijazah Bersifat Statis</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            IPK dan ijazah fisik tidak memberikan bukti kompetensi praktik (proof of work) yang bisa divalidasi langsung oleh rekruter secara instan.
          </p>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 p-6 rounded-2xl transition">
          <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2.5 py-1 rounded-md">MASALAH 3</span>
          <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center text-2xl my-4">🧩</div>
          <h3 className="text-xl font-bold text-white mb-2">Arah Belajar Tak Terstruktur</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Mahasiswa menghabiskan ratusan jam menonton kursus online tanpa indikator terukur apakah mereka sudah 'Siap Kerja' atau belum.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    tag: "💡 THE SOLUTION",
    title: "Mind Passport: Solution End-to-End",
    subtitle: "Mengubah ketidakpastian karier menjadi alur pengembangan diri berbasis data ilmiah & QR Code terpercaya.",
    notes: "Solusi kami adalah Mind Passport. Platform otonom end-to-end yang memetakan potensi diri (Career DNA), mengukur gap keahlian, menyusun roadmap belajar adaptif, mengukur Career Readiness Score (CRS 0-100%), dan mempublikasikan Paspor Kompetensi Digital ber-QR Code.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <h4 className="font-bold text-white mb-1">Career DNA 5D Assessment</h4>
              <p className="text-xs text-slate-400">Asesmen ilmiah 5 dimensi untuk menemukan minat & target profesi.</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <h4 className="font-bold text-white mb-1">Autonomous Skill Gap & Roadmap</h4>
              <p className="text-xs text-slate-400">Sistem membandingkan nilai skill vs industri & langsung menyusun kurikulum.</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <h4 className="font-bold text-white mb-1">Instant QR Code Passport Verification</h4>
              <p className="text-xs text-slate-400">Paspor digital resmi ber-ID unik yang dapat di-scan rekruter secara live.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-center">
          <div className="text-xs font-bold text-sky-400 tracking-wider mb-2">METRIK KESIAPAN</div>
          <div className="text-5xl font-extrabold text-indigo-300 font-mono mb-2">CRS: 85%</div>
          <div className="text-sm font-bold text-emerald-400 mb-4">SANGAT SIAP KERJA</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Career Readiness Score dihitung dari formula 4 bobot: Career DNA (20%) + Skill Gap (35%) + Roadmap Completion (25%) + Verified Experiences (20%).
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    tag: "⚡ TECH ARCHITECTURE",
    title: "4-Second AI Fallback Engine",
    subtitle: "Menjamin 99.9% Uptime dan Kinerja Super Cepat Tanpa Pernah Crash.",
    notes: "Kami mengintegrasikan Google Gemini API 1.5 dengan Fallback Mechanism 4 Detik. Bila API lambat atau jaringan terganggu, sistem dalam < 1 detik beralih ke Static Template Engine sehingga aplikasi 100% Zero Crash.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-sky-400 mb-4">🛠️ Modern Tech Architecture</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Framework:</span>
              <span className="font-semibold text-white">Next.js 15 & React 19</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Database:</span>
              <span className="font-semibold text-white">PostgreSQL (Neon) + Prisma ORM</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">AI Intelligence:</span>
              <span className="font-semibold text-white">Google Gemini API 1.5</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Keamanan:</span>
              <span className="font-semibold text-white">Bcrypt & HTTP-Only Session</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Deployment:</span>
              <span className="font-semibold text-emerald-400">Vercel Serverless Platform</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-md inline-block mb-3">HIGH RELIABILITY GUARANTEE</span>
          <h3 className="text-lg font-bold text-white mb-2">Mekanisme AI Fallback (4 Detik)</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Jika respon Gemini API melebihi 4 detik, generator otomatis memicu static template engine berakurasi tinggi untuk menjaga aplikasi tetap responsif.
          </p>
          <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-emerald-400">
            [LOG] Gemini Timeout (&gt;4s) → Fallback Engine Triggered → Roadmap Generated in 120ms ✓
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    tag: "🛡️ DUAL ROLE & GOVERNANCE",
    title: "Panel Admin & Verifikasi Data Transparan",
    subtitle: "Memastikan integritas dokumen dengan kendali penuh administrator dan pemisahan antarmuka yang aman.",
    notes: "Tampilan administrator dipisahkan secara tegas menggunakan Dark Amber Mode dengan banner ADMIN MODE ACTIVE. Admin memiliki 3 fungsi kunci: Verifikasi 1-klik berkas siswa, Penyesuaian Standar Industri, dan Audit Log Aktivitas Keamanan.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-2xl">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded">DARK AMBER THEME</span>
          <div className="text-2xl my-3 text-amber-400">✓</div>
          <h4 className="font-bold text-white mb-2">Verifikasi 1-Klik</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Admin meninjau bukti sertifikat atau proyek siswa. Persetujuan otomatis menaikkan CRS siswa sebesar 20%.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-2xl">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded">STANDARDS MANAGER</span>
          <div className="text-2xl my-3 text-amber-400">⚙️</div>
          <h4 className="font-bold text-white mb-2">Manajemen Standar Industri</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Admin dapat memperbarui standar skor minimum kompetensi profesi mengikuti tren kebutuhan perusahaan terbaru.
          </p>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-2xl">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2 py-0.5 rounded">SECURITY AUDIT</span>
          <div className="text-2xl my-3 text-amber-400">🔐</div>
          <h4 className="font-bold text-white mb-2">Audit Logs & Keamanan</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pemantauan riwayat log login secara real-time untuk mendeteksi potensi ancaman atau kebocoran akses.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    tag: "⚔️ COMPETITIVE ADVANTAGE",
    title: "Matriks Keunggulan Kompetitif",
    subtitle: "Mengapa Mind Passport Memimpin Inovasi Di Banding Platform Tradisional.",
    notes: "Platform tradisional seperti LinkedIn atau LMS Kampus hanya mencatat klaim pasif teks, tidak memiliki asesmen DNA 5D, tidak ada roadmap otonom, dan tidak ada Readiness Score 4 bobot.",
    content: (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-left text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-sky-400">
              <th className="p-3">Fitur Utama</th>
              <th className="p-3 text-center text-slate-300">LinkedIn</th>
              <th className="p-3 text-center text-slate-300">LMS Kampus</th>
              <th className="p-3 text-center bg-indigo-950/60 text-indigo-300 font-bold">🌐 Mind Passport</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="p-3 font-semibold text-white">Career DNA Assessment (5D)</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center bg-indigo-950/40 text-emerald-400 font-bold">✅ Ya (5 Dimensi)</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Skill Gap Analysis vs Industry</td>
              <td className="p-3 text-center text-slate-400">Manual / Limited</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center bg-indigo-950/40 text-emerald-400 font-bold">✅ Otomatis & Visual</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Autonomous AI Skill Roadmap</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center bg-indigo-950/40 text-emerald-400 font-bold">✅ Dynamic & Timing</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Career Readiness Score (CRS)</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center text-slate-400">Hanya IPK</td>
              <td className="p-3 text-center bg-indigo-950/40 text-emerald-400 font-bold">✅ Formula 4 Bobot</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-white">Live QR Code Verification</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center text-rose-400">❌ Tidak Ada</td>
              <td className="p-3 text-center bg-indigo-950/40 text-emerald-400 font-bold">✅ Public Instant Scan</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: 7,
    tag: "✨ CLOSING & DEMO",
    title: "Siap Mencetak Talenta Kerja Masa Depan?",
    subtitle: "Satu Paspor Kompetensi Digital untuk Membuka Jutaan Peluang Karier Mahasiswa Indonesia.",
    notes: "Sekian presentasi dari kami. Mind Passport adalah langkah nyata menciptakan standar kesiapan kerja baru bagi talenta muda Indonesia. Kami siap mendemonstrasikan sistem secara live dan menjawab pertanyaan dewan juri.",
    content: (
      <div className="text-center max-w-2xl mx-auto py-6">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Empowering Talent, Validating Success.
        </h2>
        <p className="text-slate-400 text-sm mb-8">
          Buka kunci potensi karier mahasiwa Anda sekarang dengan Paspor Digital Terverifikasi.
        </p>

        <div className="inline-flex items-center gap-6 bg-indigo-950/50 border border-indigo-500/40 p-6 rounded-2xl text-left">
          <div className="w-20 h-20 bg-white p-1.5 rounded-lg shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect width="100" height="100" fill="white"/>
              <path d="M10 10h30v30h-30z M15 15v20h20v-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15v20h20v-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65v20h20v-20z M20 70h10v10h-10z M50 50h10v10h-10z M70 50h20v10h-20z M50 70h20v20h-20z M80 80h10v10h-10z" fill="black"/>
            </svg>
          </div>
          <div>
            <div className="text-xs font-bold text-sky-400">SCAN LIVE DEMO</div>
            <div className="text-lg font-extrabold text-white">mind-passport.vercel.app</div>
            <div className="text-xs text-slate-400 mt-1">Zikry Kurniawan & Team</div>
          </div>
        </div>
      </div>
    )
  }
];

export default function PitchDeckPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600);

  const activeSlide = SLIDES[currentSlideIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, "0");
    const secs = (sec % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Progress Line */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-indigo-500 to-sky-400 h-1 transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / SLIDES.length) * 100}%` }}
        />
      </div>

      {/* Header Bar */}
      <header className="px-6 py-4 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-800 px-3 py-1.5 rounded-md">
            ← Dashboard
          </Link>
          <div className="font-extrabold text-lg bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            🌐 Mind Passport <span className="text-xs font-bold text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 rounded-full ml-2">PITCH DECK</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {formatTimer(timerSeconds)}
          </div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              showNotes ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🗣️ Naskah Presentasi
          </button>
          <a
            href="/pitch-deck.html"
            target="_blank"
            className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg transition font-semibold"
          >
            ⛶ Fullscreen Presentation Mode
          </a>
        </div>
      </header>

      {/* Main Slide Content */}
      <main className="flex-1 flex flex-col justify-center px-6 md:px-16 py-8 relative max-w-6xl mx-auto w-full">
        <div className="text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
          {activeSlide.tag}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          {activeSlide.title}
        </h2>
        <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8 max-w-3xl">
          {activeSlide.subtitle}
        </p>

        <div className="w-full">
          {activeSlide.content}
        </div>

        {/* Speaker Notes Overlay */}
        {showNotes && (
          <div className="mt-8 bg-slate-900/95 border border-indigo-500/50 rounded-xl p-4 text-xs leading-relaxed text-indigo-200 backdrop-blur-md animate-fadeIn">
            <div className="font-bold text-sky-400 mb-1 flex items-center justify-between">
              <span>🗣️ NASKAH BACAAN PRESENTASI (SPEAKER NOTES)</span>
              <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p>{activeSlide.notes}</p>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 py-4 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center z-20">
        <div className="text-xs text-slate-400 font-mono">
          Slide {currentSlideIndex + 1} / {SLIDES.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-white transition"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === SLIDES.length - 1}
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center text-white transition"
          >
            →
          </button>
        </div>
      </footer>
    </div>
  );
}
