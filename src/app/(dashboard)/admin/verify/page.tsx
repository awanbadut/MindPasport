"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProgressEntry {
  id: string;
  userId: string;
  user: User;
  type: string;
  title: string;
  organizer: string | null;
  description: string | null;
  certificateUrl: string | null;
  verified: boolean;
  createdAt: string;
}

export default function AdminVerifyPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending");

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/admin/progress");
      const json = await res.json();
      if (json.success) {
        setEntries(json.data);
      } else {
        setError(json.error.message || "Gagal mengambil data.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleVerify = async (id: string, verified: boolean) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/progress/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(`Entri berhasil ${verified ? "diverifikasi" : "dibatalkan verifikasinya"}.`);
        // Update local state list
        setEntries(prev =>
          prev.map(entry => (entry.id === id ? { ...entry, verified } : entry))
        );
      } else {
        setError(json.error.message || "Gagal mengubah status verifikasi.");
      }
    } catch {
      setError("Kesalahan koneksi ke server.");
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === "pending") return !entry.verified;
    if (filter === "verified") return entry.verified;
    return true;
  });

  const getTypeName = (type: string) => {
    switch (type) {
      case "training": return "Pelatihan/Kursus";
      case "project": return "Proyek Praktik";
      case "internship": return "Peluang Magang";
      case "certificate": return "Sertifikasi Profesional";
      case "competition": return "Kompetensi/Lomba";
      case "organization": return "Organisasi";
      case "volunteer": return "Relawan";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "training": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "project": return "bg-green-50 text-green-700 border-green-100";
      case "internship": return "bg-sky-50 text-sky-700 border-sky-100";
      case "certificate": return "bg-purple-50 text-purple-700 border-purple-100";
      default: return "bg-neutral-50 text-neutral-600 border-neutral-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat pengajuan verifikasi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Verifikasi Progres & Sertifikasi</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Review dan setujui bukti fisik peningkatan skill yang diunggah oleh pengguna.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-px">
        {[
          { id: "pending", label: "Menunggu Verifikasi" },
          { id: "verified", label: "Sudah Diverifikasi" },
          { id: "all", label: "Semua Pengajuan" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px ${
              filter === tab.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Nama Kegiatan & Jenis</th>
                  <th className="px-6 py-4">Penyelenggara / Institusi</th>
                  <th className="px-6 py-4">Tanggal Pengajuan</th>
                  <th className="px-6 py-4">Bukti / Dokumen</th>
                  <th className="px-6 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{entry.user.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{entry.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-800 leading-snug">{entry.title}</div>
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1.5 ${getTypeColor(entry.type)}`}>
                        {getTypeName(entry.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-700">
                      {entry.organizer || "—"}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs">
                      {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {entry.certificateUrl ? (
                        <a
                          href={entry.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                          <span>📄</span> Lihat Bukti
                        </a>
                      ) : (
                        <span className="text-xs text-neutral-400">Tanpa lampiran</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {entry.verified ? (
                        <button
                          onClick={() => handleVerify(entry.id, false)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors border border-red-200"
                        >
                          Batalkan Verifikasi
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerify(entry.id, true)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-indigo-600/10"
                        >
                          Setujui & Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <span className="text-3xl block">📥</span>
            <h3 className="font-bold text-neutral-700 text-base">Tidak ada pengajuan</h3>
            <p className="text-neutral-400 text-xs max-w-xs mx-auto">
              Seluruh pengajuan verifikasi dalam kategori ini telah selesai diproses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
