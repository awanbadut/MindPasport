"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { MatchingSkill, MissingSkill } from "@/types";

interface IndustryMatch {
  id: string;
  careerRoleId: string;
  matchPercent: number;
  matchingSkills: MatchingSkill[];
  missingSkills: MissingSkill[];
  createdAt: string;
  careerRole: {
    id: string;
    title: string;
    category: string;
    level: string;
  };
  narrative?: string | null;
}

export default function IndustryMatchPage() {
  const [results, setResults] = useState<IndustryMatch[]>([]);
  const [selectedResult, setSelectedResult] = useState<IndustryMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/industry-match");
      const json = await res.json();
      if (json.success && json.data) {
        setResults(json.data);
        if (json.data.length > 0 && !selectedResult) {
          setSelectedResult(json.data[0]);
        }
      }
    } catch {
      setError("Gagal memuat data pencocokan industri.");
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
      const res = await fetch("/api/industry-match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        if (json.data.length > 0) {
          setSelectedResult(json.data[0]);
        }
      } else {
        setError(json.error.message || "Gagal menghitung kecocokan industri.");
      }
    } catch {
      setError("Koneksi error.");
    } finally {
      setCalculating(false);
    }
  };

  const getMatchColor = (percent: number) => {
    if (percent >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percent >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    if (percent >= 40) return "text-sky-600 bg-sky-50 border-sky-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMatchBarColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 60) return "bg-amber-500";
    if (percent >= 40) return "bg-sky-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data kecocokan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Industry Match Recommendation</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Bandingkan keahlian Anda saat ini dengan seluruh standar karier di sistem untuk menemukan peluang paling cocok.
          </p>
        </div>
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20 self-start sm:self-center"
        >
          {calculating ? "Menghitung..." : "🔄 Cek Ulang Kecocokan"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: ranked list of roles */}
          <div className="lg:col-span-1 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-neutral-800 border-b border-neutral-100 pb-3">Peringkat Kesiapan Karier</h3>
            <div className="space-y-2">
              {results.map((res, idx) => (
                <div
                  key={res.id}
                  onClick={() => setSelectedResult(res)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedResult?.id === res.id
                      ? "border-indigo-500 bg-indigo-50/30"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 font-bold tracking-wide block uppercase">
                      Peringkat #{idx + 1}
                    </span>
                    <h4 className="font-bold text-neutral-800 text-xs sm:text-sm truncate mt-0.5">{res.careerRole.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-medium truncate block">{res.careerRole.category}</span>
                  </div>

                  <span className={`text-xs font-bold px-2 py-1 rounded-lg border flex-shrink-0 ${getMatchColor(res.matchPercent)}`}>
                    {res.matchPercent}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: detail of selected role */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResult && (
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-neutral-100 pb-6">
                  <div>
                    <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {selectedResult.careerRole.level} — {selectedResult.careerRole.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">{selectedResult.careerRole.title}</h2>
                  </div>
                  <div className="flex flex-col items-start sm:items-end justify-center">
                    <span className={`text-2xl sm:text-3xl font-black px-3.5 py-1.5 rounded-2xl border ${getMatchColor(selectedResult.matchPercent)}`}>
                      {selectedResult.matchPercent}%
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-1">Kecocokan Standar</p>
                  </div>
                </div>

                {/* AI Narrative paragraph */}
                {selectedResult.narrative && (
                  <div className="bg-sky-50 border border-sky-100 text-sky-900 rounded-2xl p-5 text-sm leading-relaxed space-y-1">
                    <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest block mb-1">Rekomendasi & Analisis Sistem</span>
                    <p className="font-medium text-xs sm:text-sm">{selectedResult.narrative}</p>
                  </div>
                )}

                {/* Skills columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Matching skills (userScore >= industryScore * 0.8) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      ✅ Keahlian yang Cocok ({selectedResult.matchingSkills.length})
                    </h4>
                    {selectedResult.matchingSkills.length > 0 ? (
                      <div className="space-y-2">
                        {(selectedResult.matchingSkills as MatchingSkill[]).map((s, idx) => (
                          <div key={idx} className="p-3 bg-green-50/30 border border-green-100 rounded-xl flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-700">{s.skillName}</span>
                            <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                              {s.userScore} ≥ {s.industryScore}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">Belum ada skill yang memenuhi standar minimal (80%).</p>
                    )}
                  </div>

                  {/* Missing skills (ordered by gap size) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider">
                      ⚠️ Keahlian yang Kurang ({selectedResult.missingSkills.length})
                    </h4>
                    {selectedResult.missingSkills.length > 0 ? (
                      <div className="space-y-2">
                        {(selectedResult.missingSkills as MissingSkill[]).map((s, idx) => (
                          <div key={idx} className="p-3 bg-red-50/30 border border-red-100 rounded-xl flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-700">{s.skillName}</span>
                            <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              Gap {s.gap}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400">Seluruh skill utama sudah cocok.</p>
                    )}
                  </div>
                </div>

                {/* Footer action shortcut link */}
                <div className="flex justify-end pt-4 border-t border-neutral-100">
                  <Link
                    href={`/skill-gap?role=${selectedResult.careerRoleId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Mulai Skill Gap Analysis untuk Role Ini 📊
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 text-center shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="font-bold text-neutral-800 text-base mb-2">Kalkulasi Belum Tersedia</h3>
          <p className="text-neutral-500 text-sm mb-5 leading-relaxed">
            Sistem belum memiliki riwayat kalkulasi kecocokan industri Anda. Silakan picu perhitungan baru.
          </p>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20"
          >
            Mulai Cek Kecocokan
          </button>
        </div>
      )}
    </div>
  );
}
