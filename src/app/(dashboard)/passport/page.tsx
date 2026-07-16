"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Passport {
  id: string;
  passportNumber: string;
  publicSlug: string;
  isPublic: boolean;
  issuedAt: string;
  lastUpdatedAt: string;
}

interface UserData {
  name: string;
  email: string;
  institution?: string;
  educationLevel?: string;
  createdAt: string;
}

interface UserSkill {
  id: string;
  currentScore: number;
  skill: { name: string; category: string };
}

interface ProgressEntry {
  id: string;
  type: string;
  title: string;
  organizer?: string;
  startDate?: string;
  endDate?: string;
  verified: boolean;
}

interface Readiness {
  category: string;
  finalScore: number;
}

export default function CompetencyPassportPage() {
  const [passport, setPassport] = useState<Passport | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [latestReadiness, setLatestReadiness] = useState<Readiness | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [publicUrl, setPublicUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchPassportData = async () => {
    try {
      const res = await fetch("/api/passport");
      const json = await res.json();
      if (json.success) {
        setPassport(json.data.passport);
        setUser(json.data.user);
        setUserSkills(json.data.userSkills);
        setProgressEntries(json.data.progressEntries);
        setLatestReadiness(json.data.latestReadiness);
        setPublicUrl(json.data.publicUrl);
      }
    } catch {
      setError("Gagal memuat data passport.");
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await fetch("/api/passport/qrcode");
      const json = await res.json();
      if (json.success) {
        setQrCode(json.data.qrCode);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPassportData().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (passport) {
      fetchQrCode();
    }
  }, [passport]);

  const handleTogglePublic = async () => {
    if (!passport) return;
    setUpdating(true);
    try {
      const newStatus = !passport.isPublic;
      const res = await fetch("/api/passport", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setPassport(prev => prev ? { ...prev, isPublic: newStatus } : null);
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const handleRegenerateSlug = async () => {
    if (!confirm("Regenerasi link publik? Link publik lama Anda tidak akan berfungsi lagi.")) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/passport", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateSlug: true }),
      });
      const json = await res.json();
      if (json.success) {
        setPassport(prev => prev ? { ...prev, publicSlug: json.data.publicSlug } : null);
        setPublicUrl(`${window.location.origin}/passport/${json.data.publicSlug}`);
        fetchQrCode();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data passport...</p>
      </div>
    );
  }

  const verifiedCertificates = progressEntries.filter(
    e => (e.type === "certificate" || e.type === "training") && e.verified
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:p-0">
      {/* Header controls - Hidden when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Digital Competency Passport</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Agregasi sertifikat terverifikasi, skill terbaik, dan progress kesiapan kariermu yang terpusat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl text-sm font-semibold text-neutral-700 transition-colors"
          >
            🖨️ Cetak / Simpan PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Passport Document itself */}
        <div className="lg:col-span-2 space-y-6">
          {/* PASSPORT CARD */}
          <div
            id="passport-card"
            className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:shadow-none print:border-neutral-300 print:text-black print:bg-none print:bg-white"
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500 rounded-full opacity-10 blur-3xl pointer-events-none print:hidden" />

            <div className="flex justify-between items-start border-b border-indigo-800/60 pb-6 print:border-neutral-300">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-300 tracking-widest uppercase print:text-neutral-500">
                  Mind Passport
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight print:text-black">
                  PASPOR KOMPETENSI DIGITAL
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-indigo-400 print:text-neutral-400">PASSPORT NO.</span>
                <p className="font-mono font-bold text-sm tracking-wider mt-0.5 print:text-neutral-800">
                  {passport?.passportNumber}
                </p>
              </div>
            </div>

            {/* Profile body */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 items-center">
              {/* Photo placeholder / Initial avatar */}
              <div className="flex flex-col items-center justify-center bg-indigo-800/30 border border-indigo-700/50 rounded-2xl p-6 aspect-square w-36 h-36 mx-auto print:border-neutral-300">
                <span className="text-5xl font-black text-indigo-300 print:text-neutral-600">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Identity details */}
              <div className="sm:col-span-2 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Nama Lengkap</span>
                    <p className="font-bold text-base print:text-black">{user?.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Institusi</span>
                    <p className="font-medium text-neutral-200 print:text-neutral-800">{user?.institution || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Pendidikan</span>
                    <p className="font-medium text-neutral-200 print:text-neutral-800">{user?.educationLevel || "—"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Tanggal Terbit</span>
                    <p className="font-medium text-neutral-200 print:text-neutral-800">
                      {passport ? new Date(passport.issuedAt).toLocaleDateString("id-ID") : "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-indigo-800/40 pt-3 print:border-neutral-200">
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Status Kesiapan</span>
                    <p className="font-bold text-sky-400 print:text-indigo-600">
                      {latestReadiness?.category || "Belum Dihitung"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider print:text-neutral-500">Total Kompetensi</span>
                    <p className="font-bold print:text-neutral-800">{userSkills.length} Skill Aktif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Skills List */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Keahlian & Kompetensi Utama</h3>
            {userSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userSkills.slice(0, 8).map(s => (
                  <div key={s.id} className="p-3 rounded-xl border border-neutral-100 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div>
                      <p className="font-semibold text-neutral-800 text-sm">{s.skill.name}</p>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wide">{s.skill.category}</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                      {s.currentScore}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 text-center py-4">Belum ada data skill.</p>
            )}
          </div>

          {/* Verified Certificates */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Sertifikasi & Pelatihan Terverifikasi</h3>
            {verifiedCertificates.length > 0 ? (
              <div className="space-y-3">
                {verifiedCertificates.map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl border border-neutral-200 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">{entry.title}</h4>
                      {entry.organizer && <p className="text-xs text-neutral-500 mt-0.5">{entry.organizer}</p>}
                    </div>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1 flex-shrink-0">
                      ✓ Terverifikasi
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-neutral-400">Belum ada sertifikasi terverifikasi.</p>
                <p className="text-[10px] text-neutral-400 mt-1">Sertifikat Anda akan muncul di sini setelah diverifikasi oleh Admin.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Public sharing panel - Hidden when printing */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          {/* QR Code & Link sharing */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm text-center space-y-4">
            <h3 className="text-sm font-bold text-neutral-800">Bagikan Paspor Kompetensi</h3>
            <p className="text-xs text-neutral-500">
              Izinkan calon perekrut atau guru BK mengakses rangkuman kompetensimu secara publik.
            </p>

            {/* Toggle public */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-100 rounded-xl">
              <span className="text-xs font-semibold text-neutral-700">Status Visibilitas:</span>
              <button
                id="passport-visibility-toggle"
                onClick={handleTogglePublic}
                disabled={updating}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  passport?.isPublic
                    ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-neutral-100 border-neutral-300 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {passport?.isPublic ? "🌐 Publik" : "🔒 Privat"}
              </button>
            </div>

            {passport?.isPublic && (
              <>
                {/* QR Code base64 image */}
                {qrCode ? (
                  <div className="border border-neutral-200 rounded-2xl p-4 bg-white inline-block">
                    <img src={qrCode} alt="QR Code Link Publik" className="w-40 h-40 mx-auto" />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-neutral-50 border border-neutral-100 animate-pulse rounded-2xl mx-auto" />
                )}

                {/* Direct Link */}
                <div className="space-y-2 text-left">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Tautan Paspor Anda</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      readOnly
                      value={publicUrl}
                      className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-600 select-all focus:outline-none flex-1 truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(publicUrl);
                        alert("Link berhasil disalin ke clipboard!");
                      }}
                      className="px-3 py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-semibold transition-colors flex-shrink-0"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleRegenerateSlug}
                    disabled={updating}
                    className="w-full text-center text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors uppercase font-bold tracking-wider"
                  >
                    🔄 Ganti Link Baru
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
