"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface RoadmapItem {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  recommendedActivity: string;
  priority: string;
  status: "todo" | "in-progress" | "done";
}

interface Roadmap {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  careerRole?: { title: string; category: string };
  items: RoadmapItem[];
}

export default function RoadmapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generateParam = searchParams.get("generate");

  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [archivedRoadmaps, setArchivedRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");

  // Fetch all roadmaps (active & archived)
  const fetchRoadmaps = async () => {
    try {
      const res = await fetch("/api/roadmap");
      const json = await res.json();
      if (json.success) {
        const data: Roadmap[] = json.data;
        const active = data.find(r => r.status === "active") || null;
        const archived = data.filter(r => r.status === "archived");
        setActiveRoadmap(active);
        setArchivedRoadmaps(archived);
      }
    } catch {
      setError("Gagal memuat data roadmap.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger generation if URL parameter exists
  useEffect(() => {
    const generateRoadmap = async (analysisId: string) => {
      setGenerating(true);
      setError("");
      try {
        const res = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ skillGapAnalysisId: analysisId }),
        });

        const json = await res.json();
        if (json.success) {
          // Clear query param
          router.replace("/roadmap");
          fetchRoadmaps();
        } else {
          setError(json.error.message || "Gagal membuat roadmap.");
          setGenerating(false);
        }
      } catch {
        setError("Gagal membuat roadmap, koneksi error.");
        setGenerating(false);
      }
    };

    if (generateParam) {
      generateRoadmap(generateParam);
    } else {
      fetchRoadmaps();
    }
  }, [generateParam]);

  // Update status of roadmap item
  const handleItemStatusChange = async (itemId: string, newStatus: "todo" | "in-progress" | "done") => {
    if (!activeRoadmap) return;

    // Optimistic update
    const updatedItems = activeRoadmap.items.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    setActiveRoadmap({ ...activeRoadmap, items: updatedItems });

    try {
      const res = await fetch(`/api/roadmap/item/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) {
        // Rollback on error
        fetchRoadmaps();
      }
    } catch {
      fetchRoadmaps();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Sangat Prioritas": return "text-red-600 bg-red-50 border-red-200";
      case "Prioritas": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-sky-600 bg-sky-50 border-sky-200";
    }
  };

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">
          {generating ? "Menyusun roadmap personal dengan Gemini AI..." : "Memuat data roadmap..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Personalized Skill Roadmap</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Rencana pembelajaran bertahap berdasarkan prioritas gap untuk membantu peningkatan kompetensi Anda.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("current")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "current" ? "border-indigo-500 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Roadmap Aktif
        </button>
        <button
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "archived" ? "border-indigo-500 text-indigo-600" : "border-transparent text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Arsip Roadmap ({archivedRoadmaps.length})
        </button>
      </div>

      {activeTab === "current" && (
        <>
          {activeRoadmap ? (
            <div className="space-y-6">
              {/* Header card info */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wide">
                    {activeRoadmap.careerRole?.category || "Target"}
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 mt-2">{activeRoadmap.title}</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Dibuat pada: {new Date(activeRoadmap.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end justify-center">
                  <span className="text-2xl font-black text-neutral-800">
                    {Math.round(
                      (activeRoadmap.items.filter(i => i.status === "done").length / activeRoadmap.items.length) * 100
                    )}
                    %
                  </span>
                  <p className="text-[10px] text-neutral-500">Rasio Penyelesaian</p>
                </div>
              </div>

              {/* Timeline list */}
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {activeRoadmap.items.map((item, idx) => (
                  <div key={item.id} className="relative pl-10 group">
                    {/* Circle Bullet icon on timeline line */}
                    <div className={`absolute left-2 top-1.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center -translate-x-1/2 z-10 transition-colors ${
                      item.status === "done" ? "bg-green-500 border-green-500 text-white"
                      : item.status === "in-progress" ? "bg-amber-400 border-amber-400 text-white"
                      : "bg-white border-neutral-300"
                    }`}>
                      {item.status === "done" && (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* Card item */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-neutral-400 uppercase">Tahap {item.stageNumber}</span>
                            {item.priority !== "Dipertahankan" && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            )}
                          </div>
                          <h3 className={`font-semibold text-base mt-1 ${item.status === "done" ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                            {item.title}
                          </h3>
                        </div>

                        {/* Status Checkbox / Dropdown */}
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={e => handleItemStatusChange(item.id, e.target.value as any)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-400 ${
                              item.status === "done" ? "bg-green-50 border-green-200 text-green-700"
                              : item.status === "in-progress" ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-white border-neutral-200 text-neutral-600"
                            }`}
                          >
                            <option value="todo">Belum Dimulai</option>
                            <option value="in-progress">Sedang Dipelajari</option>
                            <option value="done">Selesai</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 leading-relaxed">{item.description}</p>

                      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 space-y-2">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Rekomendasi Aktivitas</span>
                        <p className="text-xs text-neutral-700 font-medium leading-relaxed">{item.recommendedActivity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-800 text-base mb-2">Belum ada Roadmap</h3>
              <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-5">
                Anda perlu melakukan Skill Gap Analysis terlebih dahulu sebelum menyusun roadmap pembelajaran personal.
              </p>
              <Link href="/skill-gap"
                className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20">
                Pilih Target Karier
              </Link>
            </div>
          )}
        </>
      )}

      {activeTab === "archived" && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Arsip Roadmap Sebelumnya</h2>
          {archivedRoadmaps.length > 0 ? (
            <div className="space-y-3">
              {archivedRoadmaps.map(roadmap => (
                <div
                  key={roadmap.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-all"
                  onClick={() => {
                    setActiveRoadmap(roadmap);
                    setActiveTab("current");
                  }}
                >
                  <div>
                    <h4 className="font-semibold text-neutral-800">{roadmap.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Diarsipkan pada: {new Date(roadmap.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">Klik untuk lihat</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 py-6 text-center">Tidak ada roadmap yang diarsipkan.</p>
          )}
        </div>
      )}
    </div>
  );
}
