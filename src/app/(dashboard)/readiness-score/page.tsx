"use client";

import { useState, useEffect } from "react";
import { ReadinessScoreLineChart } from "@/components/charts/ReadinessScoreLineChart";

interface ReadinessHistoryItem {
  id: string;
  hardSkillScore: number;
  softSkillScore: number;
  practicalExperienceScore: number;
  leadershipScore: number;
  adaptabilityScore: number;
  consistencyScore: number;
  finalScore: number;
  category: string;
  calculatedAt: string;
}

export default function ReadinessScorePage() {
  const [latestScore, setLatestScore] = useState<ReadinessHistoryItem | null>(null);
  const [history, setHistory] = useState<ReadinessHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      // Fetch latest
      const resLatest = await fetch("/api/readiness-score/latest");
      const jsonLatest = await resLatest.json();
      if (jsonLatest.success) {
        setLatestScore(jsonLatest.data);
      } else {
        setLatestScore(null);
      }

      // Fetch history
      const resHistory = await fetch("/api/readiness-score");
      const jsonHistory = await resHistory.json();
      if (jsonHistory.success) {
        setHistory(jsonHistory.data);
      }
    } catch {
      setError("Gagal memuat data skor kesiapan karier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCalculate = async () => {
    setCalculating(true);
    setError("");
    try {
      const res = await fetch("/api/readiness-score/calculate", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setLatestScore(json.data);
        // Refresh history
        const resHistory = await fetch("/api/readiness-score");
        const jsonHistory = await resHistory.json();
        if (jsonHistory.success) {
          setHistory(jsonHistory.data);
        }
      } else {
        setError(json.error.message || "Gagal menghitung skor kesiapan karier.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setCalculating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sangat Siap": return "text-green-700 bg-green-50 border-green-200";
      case "Cukup Siap": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Berkembang": return "text-sky-700 bg-sky-50 border-sky-200";
      default: return "text-red-700 bg-red-50 border-red-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data kesiapan karier...</p>
      </div>
    );
  }

  const components = [
    { name: "Hard Skill (HS)", weight: "25%", score: latestScore?.hardSkillScore ?? 0, desc: "Rata-rata penguasaan skill teknis dari analisis gap." },
    { name: "Soft Skill (SS)", weight: "25%", score: latestScore?.softSkillScore ?? 0, desc: "Rata-rata soft skill (Komunikasi, Adaptasi, dll)." },
    { name: "Pengalaman Praktis (PP)", weight: "20%", score: latestScore?.practicalExperienceScore ?? 0, desc: "Magang, proyek, kompetisi, volunteer (terverifikasi bernilai penuh)." },
    { name: "Kepemimpinan (K)", weight: "15%", score: latestScore?.leadershipScore ?? 0, desc: "Aktivitas organisasi & skill Kepemimpinan." },
    { name: "Adaptasi (A)", weight: "10%", score: latestScore?.adaptabilityScore ?? 0, desc: "Nilai Growth Potential dari Career DNA." },
    { name: "Konsistensi (KP)", weight: "5%", score: latestScore?.consistencyScore ?? 0, desc: "Rasio penyelesaian item roadmap aktif." },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Career Readiness Score</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Pantau skor kesiapan kerja Anda yang dihitung berdasarkan formula resmi terbobot dari portofolio Anda.
          </p>
        </div>
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20 self-start sm:self-center"
        >
          {calculating ? "Menghitung..." : "🔄 Hitung Ulang Skor"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {latestScore ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: Big score Gauge indicator */}
          <div className="lg:col-span-1 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between min-h-[350px]">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider self-start">Skor Terbaru</h3>

            {/* Circular dial simulation */}
            <div className="relative w-44 h-44 flex items-center justify-center my-6">
              {/* Dial base */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#4F46E5"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * Math.round(latestScore.finalScore)) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              {/* Dial content */}
              <div className="absolute text-center">
                <span className="text-5xl font-black text-neutral-800">{Math.round(latestScore.finalScore)}</span>
                <span className="text-neutral-400 text-xs block mt-0.5">/ 100</span>
              </div>
            </div>

            <div className="w-full text-center space-y-2">
              <span className={`inline-flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full border ${getCategoryColor(latestScore.category)}`}>
                {latestScore.category}
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-[200px] mx-auto">
                Dihitung pada: {new Date(latestScore.calculatedAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Right Panel: Breakdown & History Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* History chart */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-neutral-900 mb-4">Tren Kesiapan Karier</h3>
              {history.length > 1 ? (
                <ReadinessScoreLineChart data={history} height={200} />
              ) : (
                <p className="text-xs text-neutral-400 text-center py-8">
                  Riwayat tren akan muncul di sini setelah Anda melakukan perhitungan skor lebih dari satu kali.
                </p>
              )}
            </div>

            {/* Components list */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-900">Rincian Komponen Pembentuk (CSR)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {components.map((comp, idx) => (
                  <div key={idx} className="p-4 border border-neutral-100 rounded-2xl bg-neutral-50 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-800 text-xs sm:text-sm">{comp.name}</span>
                        <span className="text-[10px] text-neutral-400 font-bold bg-white px-1.5 py-0.5 rounded border">
                          Bobot {comp.weight}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">{comp.desc}</p>
                    </div>
                    <span className="text-base font-black text-indigo-600 bg-white border px-3 py-1 rounded-xl shadow-sm flex-shrink-0">
                      {comp.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-neutral-800 text-base mb-2">Skor Belum Dihitung</h3>
          <p className="text-neutral-500 text-sm mb-5 leading-relaxed">
            Sistem belum memiliki catatan riwayat skor kesiapan karier Anda. Silakan picu perhitungan pertama Anda.
          </p>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20"
          >
            {calculating ? "Menghitung..." : "Mulai Hitung Skor"}
          </button>
        </div>
      )}
    </div>
  );
}
