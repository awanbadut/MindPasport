"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface ProgressEntry {
  id: string;
  type: string;
  title: string;
  organizer?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  certificateUrl?: string;
  verified: boolean;
  relatedSkillIds?: string[];
  createdAt: string;
}

export default function ProgressTrackerPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("");

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "training",
    title: "",
    organizer: "",
    description: "",
    startDate: "",
    endDate: "",
    certificateUrl: "",
    relatedSkillIds: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch entries & master skills
  const fetchEntries = async () => {
    try {
      const typeQuery = filterType ? `?type=${filterType}` : "";
      const res = await fetch(`/api/progress${typeQuery}`);
      const json = await res.json();
      if (json.success) {
        setEntries(json.data);
      }
    } catch {
      setError("Gagal memuat riwayat aktivitas.");
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const json = await res.json();
      if (json.success) {
        setSkills(json.data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchEntries(), fetchSkills()]).finally(() => setLoading(false));
  }, [filterType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, relatedSkillIds: selectedOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // ISO dates
    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      certificateUrl: formData.certificateUrl || null,
      relatedSkillIds: formData.relatedSkillIds.length > 0 ? formData.relatedSkillIds : null,
    };

    try {
      const url = editingId ? `/api/progress/${editingId}` : "/api/progress";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setEditingId(null);
        setFormData({
          type: "training",
          title: "",
          organizer: "",
          description: "",
          startDate: "",
          endDate: "",
          certificateUrl: "",
          relatedSkillIds: [],
        });
        fetchEntries();
      } else {
        setError(json.error.message || "Gagal menyimpan aktivitas.");
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: ProgressEntry) => {
    setEditingId(entry.id);
    setFormData({
      type: entry.type,
      title: entry.title,
      organizer: entry.organizer || "",
      description: entry.description || "",
      startDate: entry.startDate ? entry.startDate.split("T")[0] : "",
      endDate: entry.endDate ? entry.endDate.split("T")[0] : "",
      certificateUrl: entry.certificateUrl || "",
      relatedSkillIds: entry.relatedSkillIds || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Anda yakin ingin menghapus aktivitas ini?")) return;

    try {
      const res = await fetch(`/api/progress/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchEntries();
      }
    } catch {
      setError("Gagal menghapus aktivitas.");
    }
  };

  const typeLabels: Record<string, string> = {
    training: "Pelatihan / Kursus",
    organization: "Pengalaman Organisasi",
    internship: "Magang / Kerja Praktik",
    project: "Proyek Pribadi / Tim",
    competition: "Kompetisi / Lomba",
    volunteer: "Kegiatan Sukarela",
    certificate: "Sertifikat / Lisensi",
  };

  const typeColors: Record<string, string> = {
    training: "bg-indigo-100 text-indigo-700 border-indigo-200",
    organization: "bg-purple-100 text-purple-700 border-purple-200",
    internship: "bg-sky-100 text-sky-700 border-sky-200",
    project: "bg-green-100 text-green-700 border-green-200",
    competition: "bg-amber-100 text-amber-700 border-amber-200",
    volunteer: "bg-pink-100 text-pink-700 border-pink-200",
    certificate: "bg-teal-100 text-teal-700 border-teal-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Skill Progress Tracker</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Catat pelatihan, proyek, magang, dan kegiatan pengembangan diri lainnya untuk melengkapi paspor kompetensimu.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({
              type: "training",
              title: "",
              organizer: "",
              description: "",
              startDate: "",
              endDate: "",
              certificateUrl: "",
              relatedSkillIds: [],
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20 self-start sm:self-center"
        >
          ➕ Tambah Aktivitas
        </button>
      </div>

      {/* Filter and Content */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <label htmlFor="filterType" className="text-sm font-semibold text-neutral-600">Filter Tipe:</label>
          <select
            id="filterType"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-sm text-neutral-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Semua Aktivitas</option>
            {Object.entries(typeLabels).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeColors[entry.type]}`}>
                      {typeLabels[entry.type]}
                    </span>
                    {entry.verified ? (
                      <span className="text-[10px] font-bold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ✓ Terverifikasi
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-neutral-50 border border-neutral-200 text-neutral-400 px-2 py-0.5 rounded-full">
                        Belum Diverifikasi
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-800 text-base leading-snug">{entry.title}</h3>
                    {entry.organizer && <p className="text-xs text-neutral-500 mt-1">Penyelenggara: {entry.organizer}</p>}
                  </div>
                  {entry.description && <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">{entry.description}</p>}

                  {/* Related skills badges */}
                  {entry.relatedSkillIds && entry.relatedSkillIds.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.relatedSkillIds.map(skillId => {
                        const skillName = skills.find(s => s.id === skillId)?.name || "Skill";
                        return (
                          <span key={skillId} className="text-[10px] bg-neutral-50 border border-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-medium">
                            #{skillName}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Dates & Certificate */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                    <span>
                      📅 {entry.startDate ? new Date(entry.startDate).toLocaleDateString("id-ID") : "—"}
                      {" s/d "}
                      {entry.endDate ? new Date(entry.endDate).toLocaleDateString("id-ID") : "Sekarang"}
                    </span>
                    {entry.certificateUrl && (
                      <a href={entry.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        🔗 Lihat Kredensial / Sertifikat
                      </a>
                    )}
                  </div>
                </div>

                {/* Edit / Delete */}
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-1.5 text-neutral-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-500 text-sm">Belum ada aktivitas yang dicatat.</p>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-neutral-800 text-lg">
                {editingId ? "Edit Aktivitas" : "Tambah Aktivitas Baru"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-2xl font-bold">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-xs font-semibold text-neutral-600 mb-1">Tipe Aktivitas</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.entries(typeLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="title" className="block text-xs font-semibold text-neutral-600 mb-1">Judul Kegiatan / Nama Event</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: Boot camp Data Analyst"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organizer" className="block text-xs font-semibold text-neutral-600 mb-1">Penyelenggara / Institusi</label>
                  <input
                    id="organizer"
                    name="organizer"
                    type="text"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Contoh: Digitalent Kominfo"
                  />
                </div>
                <div>
                  <label htmlFor="certificateUrl" className="block text-xs font-semibold text-neutral-600 mb-1">URL Sertifikat / Kredensial <span className="text-neutral-400">(opsional)</span></label>
                  <input
                    id="certificateUrl"
                    name="certificateUrl"
                    type="url"
                    value={formData.certificateUrl}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://sertifikat.com/abc"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-xs font-semibold text-neutral-600 mb-1">Tanggal Mulai</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-xs font-semibold text-neutral-600 mb-1">Tanggal Selesai <span className="text-neutral-400">(kosongkan jika masih berlangsung)</span></label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs font-semibold text-neutral-600 mb-1">Deskripsi Kegiatan</label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ceritakan peran Anda dan skill yang Anda gunakan..."
                />
              </div>

              <div>
                <label htmlFor="relatedSkillIds" className="block text-xs font-semibold text-neutral-600 mb-1">
                  Skill Terkait <span className="text-neutral-400">(Tahan Ctrl/Cmd untuk pilih beberapa)</span>
                </label>
                <select
                  id="relatedSkillIds"
                  multiple
                  value={formData.relatedSkillIds}
                  onChange={handleSkillSelectChange}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 h-28"
                >
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-md shadow-indigo-500/20"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
