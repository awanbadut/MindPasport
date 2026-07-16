"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "MENTOR";
  educationLevel: string | null;
  institution: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN" | "MENTOR">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      } else {
        setError(json.error.message || "Gagal memuat pengguna.");
      }
    } catch {
      setError("Kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = async (id: string, newRole: string) => {
    setError("");
    setSuccess("");
    setProcessingId(id);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(`Role pengguna ${json.data.name} berhasil diubah menjadi ${newRole}.`);
        setUsers(prev =>
          prev.map(u => (u.id === id ? { ...u, role: newRole as any } : u))
        );
      } else {
        setError(json.error.message || "Gagal mengubah role pengguna.");
      }
    } catch {
      setError("Kesalahan koneksi.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setError("");
    setSuccess("");
    setConfirmDeleteId(null);
    setProcessingId(id);

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (json.success) {
        setSuccess("Akun pengguna berhasil dihapus dari sistem.");
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        setError(json.error.message || "Gagal menghapus pengguna.");
      }
    } catch {
      setError("Kesalahan koneksi.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.institution && user.institution.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "MENTOR":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-sky-100 text-sky-800 border-sky-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Kelola Pengguna Sistem</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Kelola hak akses pengguna, ganti peran (User, Mentor, Admin), serta hapus akun pengguna yang tidak aktif.
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

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 border-b border-neutral-200 w-full sm:w-auto">
          {[
            { id: "ALL", label: "Semua" },
            { id: "USER", label: "Pelajar" },
            { id: "ADMIN", label: "Admin" },
            { id: "MENTOR", label: "Mentor" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all -mb-px ${
                roleFilter === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama, email, sekolah..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">Peran (Role)</th>
                  <th className="px-6 py-4">Pendidikan</th>
                  <th className="px-6 py-4">Institusi</th>
                  <th className="px-6 py-4">Bergabung Pada</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{user.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-700">
                      {user.educationLevel || "—"}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-700">
                      {user.institution || "—"}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {processingId === user.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-indigo-500 border-t-transparent rounded-full" />
                        ) : (
                          <>
                            {/* Role changer dropdown */}
                            <select
                              value={user.role}
                              onChange={e => handleChangeRole(user.id, e.target.value)}
                              className="bg-neutral-50 border border-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-400 font-semibold text-neutral-700"
                            >
                              <option value="USER">User (Pelajar)</option>
                              <option value="MENTOR">Mentor</option>
                              <option value="ADMIN">Admin</option>
                            </select>

                            {/* Delete User */}
                            <button
                              onClick={() => setConfirmDeleteId(user.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-semibold p-1"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-2">
            <span className="text-3xl block">👥</span>
            <h3 className="font-bold text-neutral-700 text-base">Tidak ada pengguna</h3>
            <p className="text-neutral-400 text-xs max-w-xs mx-auto">
              Tidak ada pengguna yang cocok dengan kriteria pencarian atau filter Anda.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-neutral-100">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-lg">Hapus Pengguna</h3>
              <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus pengguna ini secara permanen? Seluruh data kuesioner, standar gap, dan progress paspor pengguna ini akan ikut terhapus. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-neutral-200 text-neutral-600 font-semibold rounded-xl text-sm hover:bg-neutral-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
