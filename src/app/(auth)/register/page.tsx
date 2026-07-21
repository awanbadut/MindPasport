"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    institution: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error.message);
        return;
      }

      // Auto-login setelah registrasi berhasil
      const loginResult = await loginAction(formData.email, formData.password);

      if (loginResult?.error) {
        router.push("/login");
      } else {
        // Redirect ke /career-dna karena baru daftar, wajib isi assessment dulu
        router.push("/career-dna");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 p-1.5 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20">
              <img src="/logo.png" alt="Mind Passport Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Mind Passport</h1>
              <p className="text-indigo-300 text-xs">Paspor Kompetensi Digital</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Buat akun dan mulai perjalanan kariermu</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1.5">Nama Lengkap</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Nama lengkap kamu" />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-slate-200 mb-1.5">Alamat Email</label>
              <input id="reg-email" name="email" type="email" required value={formData.email} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="nama@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-slate-200 mb-1.5">Password</label>
                <input id="reg-password" name="password" type="password" required value={formData.password} onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Min. 8 karakter" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-1.5">Konfirmasi</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Ulangi password" />
              </div>
            </div>

            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-slate-200 mb-1.5">Level Pendidikan <span className="text-slate-400">(opsional)</span></label>
              <select id="educationLevel" name="educationLevel" value={formData.educationLevel} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="" className="bg-slate-800">Pilih level pendidikan</option>
                <option value="SMA/SMK" className="bg-slate-800">SMA/SMK</option>
                <option value="D3" className="bg-slate-800">D3</option>
                <option value="S1" className="bg-slate-800">S1</option>
                <option value="S2" className="bg-slate-800">S2</option>
                <option value="S3" className="bg-slate-800">S3</option>
              </select>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-slate-200 mb-1.5">Institusi <span className="text-slate-400">(opsional)</span></label>
              <input id="institution" name="institution" type="text" value={formData.institution} onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Nama sekolah atau universitas" />
            </div>

            <button id="register-submit-btn" type="submit" disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mendaftar...
                </span>
              ) : "Buat Akun"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-300 hover:text-indigo-200 font-medium">Masuk sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
