"use client";

import { useState, useEffect } from "react";

interface CareerRole {
  id: string;
  title: string;
  category: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface Standard {
  id: string;
  careerRoleId: string;
  skillId: string;
  weightPercent: number;
  standardScore: number;
  skill: Skill;
}

export default function AdminStandardsPage() {
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state for adding/updating a standard
  const [newSkillId, setNewSkillId] = useState("");
  const [newWeight, setNewWeight] = useState(10);
  const [newScore, setNewScore] = useState(80);

  const fetchData = async () => {
    try {
      // 1. Fetch Career Roles
      const resRoles = await fetch("/api/career-roles");
      const jsonRoles = await resRoles.json();
      if (jsonRoles.success) setRoles(jsonRoles.data);

      // 2. Fetch Master Skills
      const resSkills = await fetch("/api/admin/skills");
      const jsonSkills = await resSkills.json();
      if (jsonSkills.success) setSkills(jsonSkills.data);

      // 3. Fetch all current standards
      const resStds = await fetch("/api/admin/industry-standards");
      const jsonStds = await resStds.json();
      if (jsonStds.success) setStandards(jsonStds.data);
    } catch {
      setError("Gagal mengambil data referensi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleId || !newSkillId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/industry-standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerRoleId: selectedRoleId,
          skillId: newSkillId,
          weightPercent: newWeight,
          standardScore: newScore,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess("Standar kompetensi industri berhasil disimpan!");
        // Reset form
        setNewSkillId("");
        setNewWeight(10);
        setNewScore(80);
        // Refresh standards list
        const resStds = await fetch("/api/admin/industry-standards");
        const jsonStds = await resStds.json();
        if (jsonStds.success) setStandards(jsonStds.data);
      } else {
        setError(json.error.message || "Gagal menyimpan standar.");
      }
    } catch {
      setError("Kesalahan koneksi ke server.");
    } finally {
      setSaving(false);
    }
  };

  const filteredStandards = standards.filter(
    std => std.careerRoleId === selectedRoleId
  );

  const totalWeight = filteredStandards.reduce((sum, std) => sum + std.weightPercent, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data standar kompetensi...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Atur Standar Kompetensi Industri</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Konfigurasi bobot kontribusi dan skor target minimum industri untuk setiap kompetensi di tiap role karier.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Role selection & Add new standard */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-800">1. Pilih Jalur Karier</h3>
            <div>
              <label htmlFor="careerRole" className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">
                Karier Target
              </label>
              <select
                id="careerRole"
                value={selectedRoleId}
                onChange={e => {
                  setSelectedRoleId(e.target.value);
                  setError("");
                  setSuccess("");
                }}
                className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">-- Pilih Karier --</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.title} ({role.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedRoleId && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-800">2. Tambah / Edit Skill Standar</h3>
              <form onSubmit={handleSaveStandard} className="space-y-4">
                <div>
                  <label htmlFor="skillSelect" className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">
                    Nama Kompetensi
                  </label>
                  <select
                    id="skillSelect"
                    value={newSkillId}
                    onChange={e => setNewSkillId(e.target.value)}
                    required
                    className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">-- Pilih Kompetensi --</option>
                    {skills.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="weight" className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">
                      Bobot (%)
                    </label>
                    <input
                      id="weight"
                      type="number"
                      min="1"
                      max="100"
                      value={newWeight}
                      onChange={e => setNewWeight(parseInt(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="score" className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">
                      Skor Target
                    </label>
                    <input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={newScore}
                      onChange={e => setNewScore(parseInt(e.target.value) || 0)}
                      required
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm"
                >
                  {saving ? "Menyimpan..." : "Simpan Standar"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right column: Standards list table */}
        <div className="lg:col-span-2">
          {selectedRoleId ? (
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <div>
                  <h3 className="text-base font-bold text-neutral-800">
                    Standar Aktif: {roles.find(r => r.id === selectedRoleId)?.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Bobot ideal total = 100%. Total bobot saat ini:{" "}
                    <span className={`font-bold ${totalWeight === 100 ? "text-green-600" : "text-amber-500"}`}>
                      {totalWeight}%
                    </span>
                  </p>
                </div>
              </div>

              {filteredStandards.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-neutral-600">
                    <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Nama Kompetensi</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4 text-center">Bobot Kontribusi</th>
                        <th className="px-6 py-4 text-center">Skor Target Industri</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredStandards.map(std => (
                        <tr key={std.id} className="hover:bg-neutral-50/50">
                          <td className="px-6 py-4 font-semibold text-neutral-800">
                            {std.skill.name}
                          </td>
                          <td className="px-6 py-4 text-neutral-500 text-xs">
                            {std.skill.category}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-neutral-800">
                            {std.weightPercent}%
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-sky-600">
                            {std.standardScore} / 100
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <span className="text-3xl block">📋</span>
                  <h3 className="font-bold text-neutral-700 text-base">Belum ada kompetensi standar</h3>
                  <p className="text-neutral-400 text-xs max-w-xs mx-auto">
                    Gunakan form di sebelah kiri untuk menambahkan kompetensi minimal bagi peran ini.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[40vh] space-y-2">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-bold text-neutral-700 text-base">Pilih peran terlebih dahulu</h3>
              <p className="text-neutral-400 text-xs max-w-xs leading-relaxed">
                Silakan pilih target peran karier di sebelah kiri untuk melihat dan mengonfigurasi standar industrinya.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
