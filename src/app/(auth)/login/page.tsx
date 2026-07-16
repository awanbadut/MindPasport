'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router   = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau kata sandi salah. Silakan periksa kembali.');
      } else {
        // Cek apakah user sudah punya CareerDNA
        const res = await fetch('/api/career-dna');
        if (res.status === 404) {
          router.push('/career-dna');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-gradient min-h-screen flex items-center justify-center p-4 relative">
      {/* Decorative blobs */}
      <div className="absolute top-16 left-8 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-8 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Logo + heading */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 border border-white/30 mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h1>
            <p className="mt-1.5 text-indigo-200 text-sm">Masuk ke Mind Passport Anda</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/20 border border-red-400/30 text-red-100 text-sm animate-pulse-once">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/25 bg-white/10 text-sm text-white placeholder:text-indigo-300
                             focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-150"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-indigo-100">
                  Kata Sandi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-indigo-200 hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-white/25 bg-white/10 text-sm text-white placeholder:text-indigo-300
                             focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  aria-label={showPw ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-indigo-200 cursor-pointer">
                Ingat saya selama 30 hari
              </label>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold py-3 px-6
                         rounded-xl transition-all duration-150 shadow-lg hover:bg-indigo-50 hover:-translate-y-0.5
                         active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Masuk...' : 'Masuk ke Akun'}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-indigo-200">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-white hover:underline underline-offset-2">
              Daftar gratis
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-indigo-300/70">
          Dengan masuk, Anda menyetujui{' '}
          <Link href="/terms" className="underline hover:text-white">Syarat Layanan</Link>
          {' '}dan{' '}
          <Link href="/privacy" className="underline hover:text-white">Kebijakan Privasi</Link>
          {' '}kami.
        </p>
      </div>
    </div>
  );
}
