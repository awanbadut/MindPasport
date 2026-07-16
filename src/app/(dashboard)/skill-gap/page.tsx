"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SkillGapBarChart } from "@/components/charts/SkillGapBarChart";
import Link from "next/link";
import type { GapDetail } from "@/types";

interface CareerRole {
  id: string;
  title: string;
  category: string;
  description: string;
}

interface UserSkill {
  skillId: string;
  currentScore: number;
}

export default function SkillGapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role");

  const [careerRoles, setCareerRoles] = useState<CareerRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [skillsNeedAssess, setSkillsNeedAssess] = useState<any[]>([]);
  const [userScores, setUserScores] = useState<Record<string, number>>({});
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"assess" | "history">("assess");
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch Career Roles dropdown
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch("/api/career-roles");
        const json = await res.json();
        if (json.success) {
          setCareerRoles(json.data);
          // Auto select if query param exists
          if (initialRoleParam) {
            setSelectedRoleId(initialRoleParam);
          }
        }
      } catch (err) {
        setError("Gagal memuat daftar karier.");
      } finally {
        setLoadingRoles(false);
      }
    }
    fetchRoles();
  }, [initialRoleParam]);

  // Fetch History of analyses
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/skill-gap");
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  // Fetch skills and user current scores when selected role changes
  useEffect(() => {
    if (!selectedRoleId) {
      setSkillsNeedAssess([]);
      return;
    }

    async function fetchRoleStandards() {
      setLoadingSkills(true);
      setError("");
      try {
        // Ambil standar dari admin endpoint (untuk mendapatkan master skill dan standar industri)
        const resStd = await fetch("/api/admin/industry-standards");
        const jsonStd = await resStd.json();

        // Ambil skill user saat ini
        const resUserSkills = await fetch("/api/passport"); // contains userSkills
        const jsonUserSkills = await resUserSkills.json();
        const userSkillsList: any[] = jsonUserSkills.success ? jsonUserSkills.data.userSkills : [];
        const userSkillMap = new Map(userSkillsList.map(s => [s.skillId, s.currentScore]));

        if (jsonStd.success) {
          const standardsForRole = jsonStd.data.filter(
            (s: any) => s.careerRoleId === selectedRoleId
          );

          if (standardsForRole.length === 0) {
            setError("Standar kompetensi untuk karier ini belum tersedia.");
            setSkillsNeedAssess([]);
            return;
          }

          setSkillsNeedAssess(standardsForRole);

          // Set default scores from userSkills if exist, or 0
          const initialScores: Record<string, number> = {};
          standardsForRole.forEach((std: any) => {
            initialScores[std.skillId] = userSkillMap.get(std.skillId) ?? 0;
          });
          setUserScores(initialScores);
        }
      } catch (err) {
        setError("Gagal memuat standar skill untuk role ini.");
      } finally {
        setLoadingSkills(false);
      }
    }

    fetchRoleStandards();
  }, [selectedRoleId]);

  const handleScoreChange = (skillId: string, val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setUserScores(prev => ({ ...prev, [skillId]: clamped }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId) return;

    setSubmitting(true);
    setError("");

    const formattedScores = Object.entries(userScores).map(([skillId, score]) => ({
      skillId,
      score,
    }));

    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerRoleId: selectedRoleId,
          userSkillScores: formattedScores,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setAnalysisResult(json.data);
      } else {
        setError(json.error.message || "Gagal melakukan analisis gap.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Sangat Prioritas": return "bg-red-100 text-red-700 border-red-200";
      case "Prioritas": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Cukup Prioritas": return "bg-sky-100 text-sky-700 border-sky-200";
      default: return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getGapColor = (gap: number) => {
    if (gap > 0) return "text-green-600 font-semibold";
    if (gap === 0) return "text-neutral-500";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Skill Gap Analysis</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Bandingkan tingkat keahlianmu saat ini dengan standar industri untuk karier impianmu.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => { setActiveTab("assess"); setAnalysisResult(null); }}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "assess" ? "border-indigo-500 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Analisis Baru
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "history" ? "border-indigo-500 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Riwayat Analisis
        </button>
      </div>

      {activeTab === "assess" && (
        <>
          {!analysisResult ? (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Step 1: Dropdown */}
              <div className="max-w-md">
                <label htmlFor="careerRole" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Pilih Karier Tujuan
                </label>
                <select
                  id="careerRole"
                  value={selectedRoleId}
                  onChange={e => setSelectedRoleId(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">-- Pilih Karier --</option>
                  {careerRoles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.title} ({role.category})
                    </option>
                  ))}
                </select>
              </div>

              {loadingSkills && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <div className="animate-spin w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  Memuat standar kompetensi...
                </div>
              )}

              {/* Step 2: Skill scores input */}
              {skillsNeedAssess.length > 0 && !loadingSkills && (
                <form id="skill-gap-form" onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-neutral-100">
                  <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 mb-6">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-1">Informasi Role</h3>
                    <p className="text-xs text-neutral-500">
                      {careerRoles.find(r => r.id === selectedRoleId)?.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-neutral-800">
                      Kira-kira berapa skor kemampuan Anda pada skill berikut? (0–100)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {skillsNeedAssess.map(std => (
                        <div key={std.id} className="p-4 rounded-xl border border-neutral-200 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-semibold text-neutral-400 block tracking-wide uppercase">
                                {std.skill.category}
                              </span>
                              <span className="font-semibold text-neutral-800 text-sm">{std.skill.name}</span>
                            </div>
                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                              Target: {std.standardScore}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={userScores[std.skillId] ?? 0}
                              onChange={e => handleScoreChange(std.skillId, parseInt(e.target.value))}
                              className="w-full accent-indigo-500"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={userScores[std.skillId] ?? 0}
                              onChange={e => handleScoreChange(std.skillId, parseInt(e.target.value) || 0)}
                              className="w-16 text-center border border-neutral-200 rounded-lg py-1 font-bold text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    id="submit-gap-btn"
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
                  >
                    {submitting ? "Menganalisis..." : "Hitung Gap Analysis"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            // HASIL ANALISIS
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kesesuaian Role</span>
                  <span className="text-5xl font-bold text-indigo-600 mt-2">{analysisResult.overallReadinessPercent}%</span>
                  <p className="text-xs text-neutral-400 mt-2">Kecocokan total terhadap standar industri</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Defisit Gap</span>
                  <span className="text-5xl font-bold text-red-500 mt-2">{analysisResult.totalGapPoints}</span>
                  <p className="text-xs text-neutral-400 mt-2">Akumulasi seluruh kekurangan poin skill</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-800">Target Karier</h3>
                    <p className="text-base font-bold text-neutral-900 mt-1">{analysisResult.careerRole?.title}</p>
                    <p className="text-xs text-neutral-400 mt-1">{analysisResult.careerRole?.category}</p>
                  </div>
                  <Link
                    href={`/roadmap?generate=${analysisResult.id}`}
                    className="block text-center w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold transition-colors mt-4"
                  >
                    Generate Personalized Roadmap 🗺️
                  </Link>
                </div>
              </div>

              {/* Bar Chart comparing */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral-900 mb-4">Grafik Perbandingan Skill</h3>
                <SkillGapBarChart data={analysisResult.gapDetails} height={300} />
              </div>

              {/* Detail Table */}
              <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                  <h3 className="text-base font-semibold text-neutral-900">Rincian Gap per Kompetensi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-neutral-600">
                    <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100 text-xs">
                      <tr>
                        <th className="px-6 py-3">Nama Skill</th>
                        <th className="px-6 py-3">Kategori</th>
                        <th className="px-6 py-3 text-center">Skor Anda</th>
                        <th className="px-6 py-3 text-center">Standar Industri</th>
                        <th className="px-6 py-3 text-center">Gap</th>
                        <th className="px-6 py-3">Prioritas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {(analysisResult.gapDetails as GapDetail[]).map((d, i) => (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 font-semibold text-neutral-800">{d.skillName}</td>
                          <td className="px-6 py-4">{d.skillCategory}</td>
                          <td className="px-6 py-4 text-center font-bold">{d.userScore}</td>
                          <td className="px-6 py-4 text-center font-bold text-sky-600">{d.industryScore}</td>
                          <td className={`px-6 py-4 text-center ${getGapColor(d.gap)}`}>
                            {d.gap > 0 ? `+${d.gap}` : d.gap}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(d.priority)}`}>
                              {d.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Riwayat Analisis Sebelumnya</h2>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-3">
              {history.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 cursor-pointer transition-all"
                  onClick={() => setAnalysisResult(item)}
                >
                  <div>
                    <h4 className="font-semibold text-neutral-800">{item.careerRole.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Dianalisis pada: {new Date(item.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600">{item.overallReadinessPercent}% Match</span>
                    <p className="text-[10px] text-neutral-400">Readiness</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 py-6 text-center">Belum ada riwayat analisis.</p>
          )}
        </div>
      )}
    </div>
  );
}
