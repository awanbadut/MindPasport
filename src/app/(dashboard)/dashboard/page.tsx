import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReadinessCategory } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Ringkasan perkembangan karier dan kompetensimu di Mind Passport",
};

function getReadinessColor(category: string) {
  switch (category) {
    case "Sangat Siap": return "text-green-600 bg-green-50 border-green-200";
    case "Cukup Siap": return "text-amber-600 bg-amber-50 border-amber-200";
    case "Berkembang": return "text-sky-600 bg-sky-50 border-sky-200";
    default: return "text-red-600 bg-red-50 border-red-200";
  }
}

function getReadinessDot(category: string) {
  switch (category) {
    case "Sangat Siap": return "bg-green-500";
    case "Cukup Siap": return "bg-amber-500";
    case "Berkembang": return "bg-sky-500";
    default: return "bg-red-500";
  }
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = session.user.id;

  // Parallel fetch semua data untuk dashboard
  const [careerDNA, latestReadiness, activeRoadmap, recentProgress, navigatorLogs] =
    await Promise.all([
      prisma.careerDNA.findUnique({ where: { userId } }),
      prisma.readinessScoreHistory.findFirst({
        where: { userId },
        orderBy: { calculatedAt: "desc" },
      }),
      prisma.skillRoadmap.findFirst({
        where: { userId, status: "active" },
        include: { items: true, careerRole: true },
      }),
      prisma.progressEntry.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.aiNavigatorLog.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const totalItems = activeRoadmap?.items.length ?? 0;
  const doneItems = activeRoadmap?.items.filter(i => i.status === "done").length ?? 0;
  const progressPercent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const firstName = session.user.name?.split(" ")[0] ?? "Pengguna";

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Halo, {firstName}! 👋
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Career Readiness Score */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Readiness Score</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {latestReadiness ? Math.round(latestReadiness.finalScore) : "—"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          {latestReadiness ? (
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${getReadinessColor(latestReadiness.category)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getReadinessDot(latestReadiness.category)}`} />
              {latestReadiness.category}
            </span>
          ) : (
            <Link href="/readiness-score" className="text-xs text-indigo-600 hover:underline">Hitung sekarang →</Link>
          )}
        </div>

        {/* Career DNA Status */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Career DNA</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {careerDNA ? "5D" : "—"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          {careerDNA ? (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Sudah diisi
            </p>
          ) : (
            <Link href="/career-dna" className="text-xs text-indigo-600 hover:underline">Isi sekarang →</Link>
          )}
        </div>

        {/* Roadmap Progress */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Roadmap</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">
                {activeRoadmap ? `${progressPercent}%` : "—"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          {activeRoadmap ? (
            <p className="text-xs text-neutral-500">{doneItems}/{totalItems} tahap selesai</p>
          ) : (
            <Link href="/skill-gap" className="text-xs text-indigo-600 hover:underline">Buat roadmap →</Link>
          )}
        </div>

        {/* Progress Entries */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Aktivitas</p>
              <p className="text-3xl font-bold text-neutral-900 mt-1">{recentProgress.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-neutral-500">aktivitas terakhir</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Roadmap progress */}
        <div className="lg:col-span-2 space-y-4">
          {/* Active Roadmap */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Roadmap Aktif</h2>
              <Link href="/roadmap" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Lihat semua →</Link>
            </div>

            {activeRoadmap ? (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-neutral-700">{activeRoadmap.careerRole?.title}</span>
                    <span className="text-neutral-500">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  {activeRoadmap.items.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        item.status === "done"
                          ? "bg-green-500 border-green-500"
                          : item.status === "in-progress"
                          ? "bg-amber-400 border-amber-400"
                          : "border-neutral-300"
                      }`}>
                        {item.status === "done" && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${item.status === "done" ? "line-through text-neutral-400" : "text-neutral-700"}`}>
                          {item.title}
                        </p>
                        <span className={`text-xs ${
                          item.priority === "Sangat Prioritas" ? "text-red-500"
                          : item.priority === "Prioritas" ? "text-amber-500"
                          : "text-sky-500"
                        }`}>{item.priority}</span>
                      </div>
                    </div>
                  ))}
                  {activeRoadmap.items.length > 4 && (
                    <p className="text-xs text-neutral-400 text-center pt-1">+{activeRoadmap.items.length - 4} tahap lainnya</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-500 mb-3">Belum ada roadmap aktif</p>
                <Link href="/skill-gap"
                  className="inline-flex items-center gap-1.5 text-sm text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition-colors">
                  Mulai Skill Gap Analysis
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Aktivitas Terbaru</h2>
              <Link href="/progress" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Semua →</Link>
            </div>

            {recentProgress.length > 0 ? (
              <div className="space-y-2">
                {recentProgress.map(entry => {
                  const typeLabel: Record<string, string> = {
                    training: "Pelatihan", organization: "Organisasi", internship: "Magang",
                    project: "Proyek", competition: "Kompetisi", volunteer: "Sukarela", certificate: "Sertifikat",
                  };
                  const typeColor: Record<string, string> = {
                    training: "bg-indigo-100 text-indigo-700", organization: "bg-purple-100 text-purple-700",
                    internship: "bg-sky-100 text-sky-700", project: "bg-green-100 text-green-700",
                    competition: "bg-amber-100 text-amber-700", volunteer: "bg-pink-100 text-pink-700",
                    certificate: "bg-teal-100 text-teal-700",
                  };
                  return (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md flex-shrink-0 ${typeColor[entry.type] ?? "bg-neutral-100 text-neutral-700"}`}>
                        {typeLabel[entry.type] ?? entry.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-neutral-700 font-medium truncate">{entry.title}</p>
                        {entry.organizer && <p className="text-xs text-neutral-400 truncate">{entry.organizer}</p>}
                      </div>
                      {entry.verified && (
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500 mb-2">Belum ada aktivitas dicatat</p>
                <Link href="/progress" className="text-sm text-indigo-600 hover:underline">Tambah aktivitas pertama →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick links and AI */}
        <div className="space-y-4">
          {/* Career DNA card */}
          {!careerDNA && (
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-indigo-200">
              <h3 className="font-semibold mb-2 text-lg">Mulai Career DNA</h3>
              <p className="text-indigo-100 text-sm mb-4">Temukan potensi karier terbaikmu melalui asesmen 5 dimensi.</p>
              <Link href="/career-dna"
                className="inline-flex items-center gap-1.5 bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Mulai Asesmen
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}

          {/* AI Navigator */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">AI Career Navigator</h3>
                <span className="text-xs bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full font-medium">Asisten AI</span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-3">Dapatkan rekomendasi pelatihan & karier personal dari AI.</p>
            <Link href="/navigator"
              className="block w-full text-center bg-sky-50 hover:bg-sky-100 text-sky-700 py-2 rounded-lg text-sm font-medium transition-colors">
              Minta Rekomendasi →
            </Link>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Aksi Cepat</h3>
            <div className="space-y-1">
              {[
                { href: "/skill-gap", label: "Analisis Skill Gap", icon: "📊" },
                { href: "/passport", label: "Lihat Passport", icon: "🎓" },
                { href: "/industry-match", label: "Cek Kecocokan Industri", icon: "🏢" },
                { href: "/readiness-score", label: "Hitung Readiness Score", icon: "⭐" },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 transition-colors group">
                  <span className="text-base">{link.icon}</span>
                  <span className="text-sm text-neutral-600 group-hover:text-neutral-900 font-medium">{link.label}</span>
                  <svg className="w-4 h-4 text-neutral-300 ml-auto group-hover:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
