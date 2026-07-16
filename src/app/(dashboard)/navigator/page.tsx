"use client";

import { useState, useEffect } from "react";

interface Recommendation {
  type: "training" | "internship" | "project" | "career-path";
  title: string;
  reason: string;
  url: string | null;
}

interface NavigatorLog {
  id: string;
  createdAt: string;
  recommendations: Recommendation[];
}

export default function AiNavigatorPage() {
  const [logs, setLogs] = useState<NavigatorLog[]>([]);
  const [latestLog, setLatestLog] = useState<NavigatorLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/navigator");
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data);
        if (json.data.length > 0) {
          setLatestLog(json.data[0]);
        }
      }
    } catch {
      setError("Gagal memuat riwayat rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/navigator", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setLatestLog(json.data);
        setSuccessMsg("Rekomendasi baru berhasil di-generate dari Gemini AI!");
        // Refresh logs list
        fetchData();
      } else {
        setError(json.error.message || "Gagal membuat rekomendasi.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setGenerating(false);
    }
  };

  const typeLabels = {
    training: "Pelatihan & Kursus",
    internship: "Peluang Magang",
    project: "Rekomendasi Proyek",
    "career-path": "Jalur Karier",
  };

  const typeIcons = {
    training: "📚",
    internship: "💼",
    project: "💻",
    "career-path": "🚀",
  };

  const typeBorderColors = {
    training: "border-indigo-100 bg-indigo-50/50",
    internship: "border-sky-100 bg-sky-50/50",
    project: "border-green-100 bg-green-50/50",
    "career-path": "border-purple-100 bg-purple-50/50",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data rekomendasi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Career Navigator</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Asisten otonom Gemini AI yang menganalisis profil lengkap Anda untuk merekomendasikan langkah karier berikutnya.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20 self-start sm:self-center"
        >
          {generating ? "Menganalisis..." : "✨ Minta Rekomendasi Baru"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          {successMsg}
        </div>
      )}

      {generating && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-pulse">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <h3 className="font-bold text-neutral-800">Menyusun Rekomendasi...</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Gemini sedang membaca profil Career DNA, progress roadmap, dan portofolio Anda untuk memformulasikan saran terbaik.
          </p>
        </div>
      )}

      {latestLog && !generating && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-neutral-800">Saran & Rekomendasi Aktif</h3>
              <span className="text-xs text-neutral-400">
                Terakhir diperbarui: {new Date(latestLog.createdAt).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(latestLog.recommendations as Recommendation[]).map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border-2 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                    typeBorderColors[rec.type] || "border-neutral-200"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{typeIcons[rec.type]}</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400">
                        {typeLabels[rec.type]}
                      </span>
                    </div>
                    <h4 className="font-bold text-neutral-800 text-sm leading-snug">{rec.title}</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History log panel */}
      {logs.length > 1 && !generating && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-800">Riwayat Konsultasi AI</h3>
          <div className="space-y-3">
            {logs.slice(1).map((log, idx) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => setLatestLog(log)}
              >
                <div>
                  <p className="font-bold text-neutral-800 text-xs">Konsultasi #{logs.length - idx - 1}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Lihat Hasil
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!latestLog && !generating && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
          </div>
          <h3 className="font-bold text-neutral-800 text-base mb-2">Belum ada Rekomendasi AI</h3>
          <p className="text-neutral-500 text-sm mb-5 leading-relaxed">
            Anda belum pernah meminta konsultasi dengan AI Career Navigator. Klik tombol di bawah untuk memulai.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20"
          >
            Mulai Konsultasi AI
          </button>
        </div>
      )}
    </div>
  );
}
