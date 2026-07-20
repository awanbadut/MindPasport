"use client";

import { useState, useEffect, useCallback } from "react";

interface LoginLog {
  _id: string;
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  reason?: string;
  userId?: string;
  role?: string;
  timestamp: string;
}

interface Pagination {
  page: number;
  total: number;
  totalPages: number;
}

const REASON_LABELS: Record<string, string> = {
  wrong_password: "Password salah",
  user_not_found: "Email tidak terdaftar",
  rate_limited: "Diblokir (terlalu banyak percobaan)",
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/logs?page=${page}&filter=${filter}`);
      const json = await res.json();
      if (json.success) {
        setLogs(json.data);
        setPagination(json.pagination);
      } else {
        setError(json.error?.message ?? "Gagal memuat log.");
      }
    } catch {
      setError("Kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (f: "all" | "success" | "failed") => {
    setFilter(f);
    setPage(1);
  };

  const formatDate = (ts: string) => {
    return new Date(ts).toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };

  const getDeviceIcon = (ua: string) => {
    if (/mobile|android|iphone/i.test(ua)) return "📱";
    if (/tablet|ipad/i.test(ua)) return "📟";
    return "🖥️";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Log Aktivitas Login</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Riwayat semua percobaan login tersimpan di MongoDB Atlas — real-time audit trail.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-neutral-900">{pagination.total}</div>
          <div className="text-xs text-neutral-500 mt-0.5 font-medium uppercase tracking-wide">Total Log</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-700">
            {filter === "success" ? pagination.total : "—"}
          </div>
          <div className="text-xs text-green-600 mt-0.5 font-medium uppercase tracking-wide">Login Berhasil</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-700">
            {filter === "failed" ? pagination.total : "—"}
          </div>
          <div className="text-xs text-red-600 mt-0.5 font-medium uppercase tracking-wide">Login Gagal</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {([
          { id: "all", label: "Semua Aktivitas" },
          { id: "success", label: "✅ Berhasil" },
          { id: "failed", label: "❌ Gagal" },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => handleFilterChange(tab.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all -mb-px ${
              filter === tab.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            <p className="text-neutral-500 text-sm">Memuat log dari MongoDB...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <span className="text-4xl block">📋</span>
            <h3 className="font-bold text-neutral-700">Belum ada log</h3>
            <p className="text-neutral-400 text-sm">Log akan muncul setelah ada aktivitas login.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 text-xs font-semibold uppercase tracking-wider border-b border-neutral-100">
                <tr>
                  <th className="px-5 py-4">Waktu</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">IP Address</th>
                  <th className="px-5 py-4">Perangkat</th>
                  <th className="px-5 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-neutral-500 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-neutral-800">
                      {log.email}
                    </td>
                    <td className="px-5 py-3.5">
                      {log.success ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                          ✅ Berhasil
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                            ❌ Gagal
                          </span>
                          {log.reason && (
                            <div className="text-[10px] text-neutral-400">
                              {REASON_LABELS[log.reason] ?? log.reason}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs bg-neutral-100 px-2 py-0.5 rounded-md font-mono text-neutral-600">
                        {log.ip}
                      </code>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-neutral-500">
                      <span title={log.userAgent}>
                        {getDeviceIcon(log.userAgent)}{" "}
                        {log.userAgent.length > 40
                          ? log.userAgent.substring(0, 40) + "..."
                          : log.userAgent}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {log.role ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          log.role === "ADMIN"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-sky-100 text-sky-800 border-sky-200"
                        }`}>
                          {log.role}
                        </span>
                      ) : (
                        <span className="text-neutral-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} log)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm font-semibold border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm font-semibold border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      )}

      {/* MongoDB Badge */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 border-t border-neutral-100 pt-4">
        <span className="text-base">🍃</span>
        <span>Data disimpan di <strong className="text-neutral-600">MongoDB Atlas</strong> — cluster0.2iprgo5.mongodb.net · database: mindpassport · collection: login_logs</span>
      </div>
    </div>
  );
}
