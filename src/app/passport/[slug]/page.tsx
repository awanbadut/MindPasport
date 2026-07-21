"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface PublicPassportData {
  passportNumber: string;
  issuedAt: string;
  lastUpdatedAt: string;
  user: {
    name: string;
    institution?: string;
    educationLevel?: string;
  };
  readiness: {
    category: string;
    score: number;
  } | null;
  topSkills: Array<{ name: string; category: string; score: number }>;
  verifiedExperiences: Array<{
    type: string;
    title: string;
    organizer?: string;
    startDate?: string;
    endDate?: string;
    verified?: boolean;
  }>;
}

export default function PublicPassportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [data, setData] = useState<PublicPassportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPublicData() {
      try {
        const res = await fetch(`/api/passport/public/${slug}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error.message || "Gagal memuat paspor.");
        }
      } catch {
        setError("Koneksi gagal. Coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    fetchPublicData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data paspor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-neutral-800">Akses Dibatasi</h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {error === "Passport ini bersifat privat"
              ? "Pemilik paspor ini memilih untuk menyetel visibilitasnya menjadi privat atau link tidak valid."
              : error}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const typeLabels: Record<string, string> = {
    training: "Pelatihan",
    organization: "Organisasi",
    internship: "Magang",
    project: "Proyek",
    competition: "Kompetisi",
    volunteer: "Kegiatan Sukarela",
    certificate: "Sertifikat",
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="Mind Passport Logo" className="w-12 h-12 object-contain flex-shrink-0 filter drop-shadow-md" />
            <span className="font-bold text-neutral-800 text-xl">Mind Passport</span>
          </div>
          <p className="text-xs text-neutral-400">Verifikasi Resmi Kompetensi Digital Pengguna</p>
        </div>

        {/* PASSPORT BODY */}
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xl">
          {/* Header Badge */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 p-6 sm:p-8 text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-800">
            <div>
              <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">PASPOR KOMPETENSI DIGITAL</span>
              <h1 className="text-2xl font-black mt-1">{data.user.name}</h1>
              <p className="text-xs text-indigo-200 mt-1">{data.user.institution || "Tanpa Institusi"}</p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">PASSPORT NO.</span>
              <p className="font-mono font-bold text-sm tracking-wider mt-0.5">{data.passportNumber}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Quick Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-b border-neutral-100 pb-6">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Pendidikan</span>
                <p className="font-semibold text-neutral-700 mt-0.5">{data.user.educationLevel || "—"}</p>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Tanggal Terbit</span>
                <p className="font-semibold text-neutral-700 mt-0.5">{new Date(data.issuedAt).toLocaleDateString("id-ID")}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Status Kesiapan Karier</span>
                <p className="font-bold text-indigo-600 mt-0.5">{data.readiness?.category || "Belum Dihitung"}</p>
              </div>
            </div>

            {/* Top Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Keahlian & Kompetensi Utama</h3>
              {data.topSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.topSkills.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-neutral-100 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div>
                        <p className="font-semibold text-neutral-800 text-sm">{s.name}</p>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wide">{s.category}</span>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        {s.score}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">Tidak ada keahlian yang tercatat.</p>
              )}
            </div>

            {/* Verified Certifications */}
            <div className="space-y-4 border-t border-neutral-100 pt-6">
              <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Pengalaman & Sertifikat Terverifikasi</h3>
              {data.verifiedExperiences.length > 0 ? (
                <div className="space-y-3">
                  {data.verifiedExperiences.map((e, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-neutral-200 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded">
                            {typeLabels[e.type] || e.type}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {e.startDate ? new Date(e.startDate).toLocaleDateString("id-ID", { year: "numeric", month: "short" }) : "—"}
                          </span>
                        </div>
                        <h4 className="font-bold text-neutral-800 text-sm mt-1">{e.title}</h4>
                        {e.organizer && <p className="text-xs text-neutral-500 mt-0.5">{e.organizer}</p>}
                      </div>
                      {e.verified ? (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          ✓ Terverifikasi
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                          ⏳ Ditinjau
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">Belum ada pengalaman atau sertifikat terverifikasi.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-neutral-400 leading-relaxed">
          Dokumen paspor kompetensi ini dikeluarkan oleh sistem otonom <strong>Mind Passport</strong>.<br />
          Untuk mendaftar paspor Anda sendiri, silakan kunjungi <Link href="/" className="text-indigo-600 hover:underline font-semibold">Mind Passport</Link>.
        </p>
      </div>
    </div>
  );
}
