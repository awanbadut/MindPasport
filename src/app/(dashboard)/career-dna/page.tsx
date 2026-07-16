"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RadarChart5Dimensi } from "@/components/charts/RadarChart5Dimensi";
import type { RawAnswer, RecommendedCareer, TopTraits } from "@/types";

// 25 Pertanyaan asesmen (5 per dimensi)
const QUESTIONS = [
  // Direction (Arah minat & tujuan karier)
  { id: "q_dir_01", dimension: "direction", type: "likert", text: "Saya memiliki rencana dan target karier yang jelas untuk 5 tahun ke depan." },
  { id: "q_dir_02", dimension: "direction", type: "likert", text: "Saya aktif mengeksplorasi industri baru dan mencari informasi tren pekerjaan masa depan." },
  { id: "q_dir_03", dimension: "direction", type: "likert", text: "Saya merasa yakin dengan pilihan bidang pekerjaan yang ingin saya tekuni." },
  { id: "q_dir_04", dimension: "direction", type: "likert", text: "Saya selalu mengaitkan kegiatan belajar saya saat ini dengan tujuan karier masa depan." },
  { id: "q_dir_05", dimension: "direction", type: "likert", text: "Saya bersedia mengambil kursus tambahan atau proyek di luar sekolah demi menunjang karier idaman." },

  // Nature (Karakter diri & kecenderungan perilaku)
  { id: "q_nat_01", dimension: "nature", type: "likert", text: "Saya tetap tenang dan mencari solusi sistematis saat menghadapi kegagalan atau hambatan besar." },
  { id: "q_nat_02", dimension: "nature", type: "likert", text: "Saya lebih menyukai bekerja dalam tim yang beragam daripada bekerja sendirian." },
  { id: "q_nat_03", dimension: "nature", type: "likert", text: "Saya merasa nyaman ketika harus membuat keputusan cepat dalam situasi tidak pasti." },
  { id: "q_nat_04", dimension: "nature", type: "likert", text: "Nilai kerja utama saya adalah menciptakan dampak sosial yang positif bagi masyarakat sekitar." },
  { id: "q_nat_05", dimension: "nature", type: "likert", text: "Saya senang menantang cara-cara lama yang tidak efisien demi inovasi yang lebih baik." },

  // Ability (Kemampuan, bakat, & kompetensi)
  { id: "q_abi_01", dimension: "ability", type: "likert", text: "Saya memiliki keterampilan teknis (hard skill) yang kuat di bidang yang saya minati." },
  { id: "q_abi_02", dimension: "ability", type: "likert", text: "Saya mampu menyampaikan ide dan gagasan dengan jelas secara lisan maupun tulisan." },
  { id: "q_abi_03", dimension: "ability", type: "likert", text: "Saya aktif berorganisasi atau memimpin tim dalam proyek/kegiatan tertentu." },
  { id: "q_abi_04", dimension: "ability", type: "likert", text: "Saya cepat menguasai software atau perangkat teknologi baru yang menunjang produktivitas." },
  { id: "q_abi_05", dimension: "ability", type: "likert", text: "Saya mampu menganalisis masalah rumit dengan memecahnya menjadi bagian-bagian kecil." },

  // Career Fit (Kesesuaian potensi diri dengan pilihan karier)
  { id: "q_fit_01", dimension: "careerFit", type: "likert", text: "Saya yakin kepribadian dan gaya kerja saya sangat cocok dengan tuntutan pekerjaan impian saya." },
  { id: "q_fit_02", dimension: "careerFit", type: "likert", text: "Lingkungan kerja yang dinamis dan kompetitif adalah tempat terbaik bagi saya untuk berkembang." },
  { id: "q_fit_03", dimension: "careerFit", type: "likert", text: "Saya merasa minat alami saya selaras dengan mata kuliah atau mata pelajaran yang saya tekuni." },
  { id: "q_fit_04", dimension: "careerFit", type: "likert", text: "Saya merasa bakat yang saya miliki dapat tersalurkan sepenuhnya di industri yang saya tuju." },
  { id: "q_fit_05", dimension: "careerFit", type: "likert", text: "Pilihan karier saya saat ini didasarkan pada riset mendalam, bukan sekadar mengikuti tren atau opini orang lain." },

  // Growth Potential (Potensi pengembangan diri)
  { id: "q_gro_01", dimension: "growthPotential", type: "likert", text: "Saya secara rutin meminta umpan balik (feedback) dari orang lain untuk memperbaiki kinerja saya." },
  { id: "q_gro_02", dimension: "growthPotential", type: "likert", text: "Saya senang mempelajari hal-baru di luar bidang keahlian utama saya secara konsisten." },
  { id: "q_gro_03", dimension: "growthPotential", type: "likert", text: "Saya menganggap kegagalan sebagai kesempatan belajar yang berharga untuk tumbuh." },
  { id: "q_gro_04", dimension: "growthPotential", type: "likert", text: "Saya selalu mengalokasikan waktu khusus setiap minggu untuk meng-upgrade keterampilan saya." },
  { id: "q_gro_05", dimension: "growthPotential", type: "likert", text: "Saya mudah menyesuaikan diri dengan perubahan aturan atau lingkungan baru." },
];

export default function CareerDnaPage() {
  const router = useRouter();
  const [hasResult, setHasResult] = useState<boolean | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0); // 0-4 untuk wizard, 5 untuk submit loading
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Ambil data Career DNA milik user saat ini
  useEffect(() => {
    async function fetchCareerDna() {
      try {
        const res = await fetch("/api/career-dna");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setResultData(json.data);
            setHasResult(true);
          } else {
            setHasResult(false);
          }
        } else if (res.status === 404) {
          setHasResult(false);
        } else {
          setHasResult(false);
        }
      } catch (err) {
        setHasResult(false);
      } finally {
        setLoading(false);
      }
    }
    fetchCareerDna();
  }, []);

  const dimensions = ["direction", "nature", "ability", "careerFit", "growthPotential"];
  const dimensionLabels = {
    direction: "Direction (Minat & Tujuan)",
    nature: "Nature (Karakter & Nilai)",
    ability: "Ability (Bakat & Skill)",
    careerFit: "Career Fit (Kesesuaian)",
    growthPotential: "Growth Potential (Potensi)",
  };

  const currentDimension = dimensions[step];
  const stepQuestions = QUESTIONS.filter(q => q.dimension === currentDimension);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isStepComplete = () => {
    return stepQuestions.every(q => answers[q.id] !== undefined);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    const formattedAnswers: RawAnswer[] = QUESTIONS.map(q => ({
      id: q.id,
      dimension: q.dimension as any,
      type: q.type as any,
      text: q.text,
      value: answers[q.id],
    }));

    try {
      // Gunakan PUT jika sudah pernah isi (hasResult === true), POST jika belum
      const method = hasResult ? "PUT" : "POST";
      const res = await fetch("/api/career-dna", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers }),
      });

      const json = await res.json();
      if (json.success) {
        setResultData(json.data);
        setHasResult(true);
        // Refresh session agar router tahu CareerDNA sudah ada
        router.refresh();
      } else {
        setSubmitError(json.error.message || "Gagal menyimpan hasil.");
      }
    } catch (err) {
      setSubmitError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setStep(0);
    setHasResult(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-neutral-500 text-sm font-medium">Memuat data asesmen...</p>
      </div>
    );
  }

  // JIKA SUDAH ADA HASIL
  if (hasResult && resultData) {
    const radarData = [
      { dimension: "direction", label: "Direction", score: resultData.directionScore },
      { dimension: "nature", label: "Nature", score: resultData.natureScore },
      { dimension: "ability", label: "Ability", score: resultData.abilityScore },
      { dimension: "careerFit", label: "Career Fit", score: resultData.careerFitScore },
      { dimension: "growthPotential", label: "Growth Potential", score: resultData.growthPotentialScore },
    ];

    const traits = resultData.topTraits as TopTraits;
    const recommendedCareers = resultData.recommendedCareers as RecommendedCareer[];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Career DNA Assessment</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Pemetaan minat, bakat, karakter, kesesuaian karier, dan potensi pengembangan dirimu.
            </p>
          </div>
          <button
            onClick={handleRetake}
            className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 rounded-xl text-sm font-medium text-neutral-700 transition-colors self-start sm:self-center"
          >
            Ulangi Asesmen (Retake)
          </button>
        </div>

        {resultData.aiAvailable === false && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            ⚠️ Insight AI belum sepenuhnya tersedia saat ini karena batas limit panggilan API. Namun, skor Anda tetap berhasil dihitung.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart */}
          <div className="lg:col-span-1 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-base font-semibold text-neutral-900 self-start mb-6">Profil 5 Dimensi</h3>
            <RadarChart5Dimensi data={radarData} height={300} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-xs w-full">
              {radarData.map(d => (
                <div key={d.dimension} className="flex justify-between border-b border-neutral-100 pb-1">
                  <span className="text-neutral-500 font-medium">{d.label}</span>
                  <span className="text-neutral-900 font-bold">{d.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Traits & Insight */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Traits */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Karakter & Karakteristik Utama (Top Traits)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dimensions.map(dim => {
                  const items = traits?.[dim as keyof TopTraits] || [];
                  return (
                    <div key={dim} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                        {dimensionLabels[dim as keyof typeof dimensionLabels]}
                      </p>
                      {items.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {items.map((item, i) => (
                            <span key={i} className="text-xs bg-white text-neutral-700 border border-neutral-200 px-2 py-1 rounded-md font-medium">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-400">Tidak ada trait dominan</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Rekomendasi Jalur Karier</h3>
              {recommendedCareers && recommendedCareers.length > 0 ? (
                <div className="space-y-3">
                  {recommendedCareers.map((career, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-sm sm:text-base">{career.title}</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Kategori: Standar Industri</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-bold text-indigo-600">{career.matchPercentage}%</span>
                          <p className="text-[10px] text-neutral-400">Match</p>
                        </div>
                        <Link
                          href={`/skill-gap?role=${encodeURIComponent(career.careerRoleId || "")}`}
                          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          Analisis Gap
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-neutral-400">Belum ada rekomendasi jalur karier.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WIZARD KUESIONER
  const progressPercent = Math.round(((step + 1) / 5) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Career DNA Assessment</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Lengkapi kuesioner asesmen ini untuk memetakan potensi karier dan bakat dirimu.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex justify-between text-xs font-semibold text-neutral-500">
          <span>Dimensi: {dimensionLabels[currentDimension as keyof typeof dimensionLabels]}</span>
          <span>{step + 1} dari 5</span>
        </div>
        <div className="w-full bg-neutral-100 rounded-full h-2.5">
          <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Questions Card */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-800 text-sm">
            {submitError}
          </div>
        )}

        <div className="space-y-6 divide-y divide-neutral-100">
          {stepQuestions.map((q, idx) => (
            <div key={q.id} className={`${idx > 0 ? "pt-6" : ""} space-y-3`}>
              <p className="text-sm sm:text-base font-medium text-neutral-800">
                {idx + 1}. {q.text}
              </p>

              {/* Likert Scale 1-5 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
                <span className="text-xs text-neutral-400 hidden sm:inline">Sangat Tidak Setuju</span>
                <div className="flex items-center justify-between sm:justify-center gap-2 flex-1 max-w-sm">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAnswerChange(q.id, val)}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                        answers[q.id] === val
                          ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-neutral-400 hidden sm:inline">Sangat Setuju</span>
                {/* Mobile indicators */}
                <div className="flex justify-between w-full sm:hidden text-[10px] text-neutral-400 px-1">
                  <span>Sangat Tidak Setuju</span>
                  <span>Sangat Setuju</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Kembali
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepComplete() || submitting}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Menghitung...
                </>
              ) : (
                "Kirim Hasil"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
