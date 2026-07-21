# 📜 NASKAH PRESENTASI & DEMO RESMI MIND PASSPORT

> **Panduan Baca Presentasi:** Gunakan dokumen ini sebagai naskah bacaan saat mendemonstrasikan aplikasi Mind Passport di depan dosen/penguji/audiens. Tanda `[AKSI KLIK]` adalah petunjuk hal yang perlu Anda klik/tampilkan di layar saat berbicara.

---

## 🕒 ALOKASI WAKTU PRESENTASI
- **1. Pembukaan & Background:** 1 Menit
- **2. Demo Alur Pengguna (8 Fitur Utama):** 6 Menit
- **3. Demo Panel Administrator (Role Admin):** 2 Menit
- **4. Penutup & Pertanyaan:** 1 Menit
- **TOTAL DURASI:** 10 Menit

---

## 🎬 BAGIAN 1: PEMBUKAAN (00:00 - 01:00)

### 🗣️ Naskah Bacaan:
> "Selamat pagi/siang Bapak/Ibu dosen penguji serta rekan-rekan sekalian.  
> 
> Perkenalkan, nama saya **[Sebutkan Nama Anda]**, dan pada hari ini saya akan mendemonstrasikan karya sistem aplikasi web bernama **Mind Passport** — sebuah *Ekosistem Digital Paspor Kompetensi & Kesiapan Karier Otonom*.
> 
> Latar belakang dibangunnya aplikasi ini adalah tantangan *skill gap* atau kesenjangan keahlian yang sering dihadapi oleh para lulusan baru (*fresh graduates*) dan mahasiswa saat memasuki dunia kerja. Banyak lulusan memiliki ijazah, namun tidak tahu seberapa siap kompetensi mereka terhadap standar nyata industri modern.
> 
> **Mind Passport** hadir sebagai solusi komprehensif. Platform ini tidak hanya mencatat sertifikat, tetapi memetakan potensi diri (*Career DNA*), mengukur gap keahlian, menyusun roadmap belajar adaptif, hingga menerbitkan **Paspor Digital Kompetensi** yang terverifikasi dan dapat di-scan via QR Code secara *real-time*."

---

## 🚀 BAGIAN 2: DEMO ALUR PENGGUNA / SISWA (01:00 - 07:00)

---

### 📍 Tahap 1: Landing Page & Autentikasi Sistem
`[AKSI KLIK: Tampilkan Beranda Utama di URL https://mind-pasport-awanbadutt77.vercel.app atau localhost]`

#### 🗣️ Naskah Bacaan:
> "Kita mulai demonstrasi dari halaman **Beranda Utama**. Di sini pengunjung disajikan antarmuka modern yang menjelaskan 4 alur utama menuju kesiapan kerja. Sistem kami dilengkapi autentikasi pintar. Saat pengguna sudah memiliki sesi login, navigasi otomatis menampilkan tombol **'Buka Dashboard →'**."

`[AKSI KLIK: Klik tombol 'Masuk' -> Masukkan Email & Password -> Klik 'Masuk']`

#### 🗣️ Naskah Bacaan:
> "Proses autentikasi login ditangani murni menggunakan database PostgreSQL dan enkripsi `bcrypt`, menjamin proses masuk yang sangat cepat, aman, dan tanpa *delay*."

---

### 📍 Tahap 2: Dashboard Utama & Indikator Kesiapan
`[AKSI KLIK: Tampilkan Halaman Dashboard (/dashboard)]`

#### 🗣️ Naskah Bacaan:
> "Setelah masuk, kita disambut oleh **Dashboard Utama**. Di bilah navigasi kiri — serta di navigasi bawah untuk pengguna smartphone — terdapat widget **Career Readiness Score** dinamis. 
> 
> Dashboard ini mengintegrasikan seluruh ringkasan aktivitas: mulai dari skor kesiapan karier saat ini, status roadmap yang sedang aktif, hingga rekomendasi pelatihan dari AI."

---

### 📍 Tahap 3: Fitur 1 – Career DNA Assessment (5 Dimensi)
`[AKSI KLIK: Klik menu 'Career DNA' di sidebar -> Klik 'Mulai Asesmen']`

#### 🗣️ Naskah Bacaan:
> "Langkah pertama siswa diawali dari **Career DNA Assessment**. Ini adalah kuesioner ilmiah interaktif yang mengukur 5 dimensi potensi diri:
> 1. **Direction:** Minat bidang dan orientasi masa depan.
> 2. **Nature:** Kepribadian dan nilai kerja.
> 3. **Ability:** Hard skill & soft skill dasar.
> 4. **Career Fit:** Kesesuaian minat dengan profesi.
> 5. **Growth Potential:** Kemauan belajar dan kemampuannya beradaptasi."

`[AKSI KLIK: Pilih jawaban kuesioner -> Klik 'Kirim Asesmen']`

#### 🗣️ Naskah Bacaan:
> "Setelah disubmit, sistem secara otomatis menghitung kalkulasi skor 5 dimensi dan menampilkannya dalam bentuk **Radar Chart 5 Dimensi**. Di bawah grafik, sistem merekomendasikan target karier yang cocok — sebagai contoh: *Data Analyst* atau *Software Engineer*. 
> 
> Dari hasil rekomendasi ini, pengguna cukup menekan 1 tombol **'Analisis Gap'** untuk melanjutkan alur."

---

### 📍 Tahap 4: Fitur 2 – Skill Gap Analysis
`[AKSI KLIK: Klik tombol 'Analisis Gap' -> Halaman /skill-gap otomatis memilih role target -> Klik 'Mulai Analisis Gap']`

#### 🗣️ Naskah Bacaan:
> "Tahap kedua adalah **Skill Gap Analysis**. Peran karier target yang kita pilih tadi otomatis terpilih tanpa perlu dicari manual. Sistem kemudian meminta pengguna menilai tingkat keahliannya saat ini pada kompetensi utama."

`[AKSI KLIK: Geser/isi nilai keahlian -> Klik 'Hitung Gap']`

#### 🗣️ Naskah Bacaan:
> "Hasil analisis menyajikan **Bar Chart Perbandingan** antara *Skor Anda* melawan *Standar Minimum Industri*. 
> 
> Sistem secara otomatis mengelompokkan keahlian menjadi kategori prioritas: **Sangat Prioritas** (merah), **Prioritas** (kuning), dan **Dipertahankan** (hijau). Pengguna kini tahu persis kekurangan skill apa yang wajib dikejar."

---

### 📍 Tahap 5: Fitur 3 – Personalized Skill Roadmap
`[AKSI KLIK: Klik tombol 'Generate Personalized Roadmap 🗺️' pada hasil analisis gap]`

#### 🗣️ Naskah Bacaan:
> "Tahap ketiga adalah **Personalized Skill Roadmap**. Hanya dalam waktu kurang dari 1 detik, sistem secara otonom menyusun kurikulum belajar bertahap (*Stage 1, Stage 2, dst.*) berdasarkan urutan prioritas gap terbesar."

`[AKSI KLIK: Tandai salah satu item roadmap dari 'Belum' menjadi 'Selesai (Done)']`

#### 🗣️ Naskah Bacaan:
> "Setiap kali pengguna menyelesaikan satu tahapan roadmap dan mengklik status **Selesai**, sistem di balik layar secara *real-time* merekalibrasi ulang *Career Readiness Score* pengguna."

---

### 📍 Tahap 6: Fitur 4 – Learning Progress Tracker
`[AKSI KLIK: Klik menu 'Learning Progress' (/progress) -> Klik 'Tambah Progres']`

#### 🗣️ Naskah Bacaan:
> "Tahap keempat adalah **Verified Learning Progress Tracker**. Di sini pengguna dapat mengunggah portofolio bukti nyata seperti sertifikat pelatihan, proyek aplikasi, pengalaman organisasi, maupun magang."

`[AKSI KLIK: Isi judul proyek/sertifikat -> Klik Simpan]`

#### 🗣️ Naskah Bacaan:
> "Setiap bukti aktivitas yang baru diunggah diberi status awal **'⏳ Ditinjau'** untuk menjaga integritas data sebelum diverifikasi oleh Administrator."

---

### 📍 Tahap 7: Fitur 5 – Career Readiness Score (CRS)
`[AKSI KLIK: Klik menu 'Readiness Score' (/readiness-score)]`

#### 🗣️ Naskah Bacaan:
> "Tahap kelima adalah **Career Readiness Score (CRS)**. Ini adalah metrik utama Mind Passport yang mengukur indeks kesiapan kerja pengguna dari skala 0 hingga 100%.
> 
> Skor ini dihitung dari kombinasi 4 bobot matematis:
> - **Career DNA Score (Bobot 20%)**
> - **Skill Gap Index (Bobot 35%)**
> - **Roadmap Completion Rate (Bobot 25%)**
> - **Verified Progress Entries (Bobot 20%)**
> 
> Di halaman ini pengguna dapat melihat grafik histori perkembangan kesiapannya dari minggu ke minggu."

---

### 📍 Tahap 8: Fitur 6 – Digital Competency Passport & Scan QR Code
`[AKSI KLIK: Klik menu 'Mind Passport' (/passport)]`

#### 🗣️ Naskah Bacaan:
> "Inilah puncaknya: **Digital Competency Passport**. Dokumen paspor digital ini diterbitkan secara otomatis dengan nomor paspor unik berformat `MP-YYYY-MM-XXXXXX`."

`[AKSI KLIK: Tunjukkan QR Code -> Arahkan Kamera HP ke QR Code (atau tunjukkan tombol Salin Link)]`

#### 🗣️ Naskah Bacaan:
> "Paspor ini dilengkapi **QR Code Ber-kontras Tinggi**. Ketika direkruter atau pihak industri mengarahkan kamera smartphone ke QR Code ini, paspor publik pengguna akan langsung terbuka secara *live* tanpa membutuhkan login. 
> 
> Pengguna juga dapat mencetak dokumen ini menjadi berkas fisik PDF resmi via tombol **'Cetak Paspor PDF'**."

---

### 📍 Tahap 9: Fitur 7 & 8 – AI Career Navigator & Industry Match
`[AKSI KLIK: Buka halaman /navigator dan /industry-match secara singkat]`

#### 🗣️ Naskah Bacaan:
> "Sebagai pelengkap ekosistem, terdapat fitur **AI Career Navigator** yang menganalisis seluruh rekam jejak pengguna untuk memberikan konsultasi rekomendasi pelatihan dan magang, serta **Industry Fit Match** untuk mengukur persentase kecocokan pengguna di berbagai sektor industri."

---

## 🛡️ BAGIAN 3: DEMO PANEL ADMINISTRATOR (07:00 - 09:00)

`[AKSI KLIK: Switch akun / Login menggunakan akun Admin (admin@mindpassport.com)]`

#### 🗣️ Naskah Bacaan:
> "Sekarang saya akan memperlihatkan sudut pandang **Administrator**. 
> 
> Perhatikan pada layar HP atau tampilan responsif, antarmuka Admin secara otonom menyesuaikan diri dengan **Dark Amber Mode** dan spanduk **ADMIN MODE ACTIVE** untuk membedakan fungsi kontrol dari akun pelajar biasa."

`[AKSI KLIK: Klik menu 'Verifikasi' (/admin/verify)]`

#### 🗣️ Naskah Bacaan:
> "1. **Verifikasi Progres (`/admin/verify`):** Admin meninjau berkas sertifikat atau proyek yang dikirim siswa dan dapat menyetujuinya dengan 1-klik `✓ Verifikasi`. Poin kesiapan siswa akan otomatis naik."

`[AKSI KLIK: Klik menu 'Standar' (/admin/standards)]`

#### 🗣️ Naskah Bacaan:
> "2. **Atur Standar Industri (`/admin/standards`):** Admin memiliki wewenang menyesuaikan standar skor target dan bobot (%) kompetensi mengikuti perkembangan tren industri terbaru."

`[AKSI KLIK: Klik menu 'Pengguna' (/admin/users) & 'Log Login' (/admin/logs)]`

#### 🗣️ Naskah Bacaan:
> "3. **Kelola Pengguna & Audit Logs (`/admin/users` & `/admin/logs`):** Admin dapat mengelola hak akses role pengguna serta mengaudit riwayat log aktivitas keamanan secara *real-time*."

---

## 🎯 BAGIAN 4: PENUTUP & RINGKASAN KEUNGGULAN (09:00 - 10:00)

#### 🗣️ Naskah Bacaan:
> "Sebagai penutup, aplikasi **Mind Passport** menawarkan 4 keunggulan utama:
> 1. **Otonom & Terintegrasi Penuh:** Seluruh alur (Career DNA → Skill Gap → Roadmap → Progress → Passport → Readiness Score) terhubung secara otomatis tanpa jeda.
> 2. **Verifikasi QR Code Nyata:** Dokumen paspor kompetensi terpercaya dan dapat divalidasi langsung via smartphone.
> 3. **Performa Super Cepat:** Dibangun dengan teknologi modern Next.js 15, PostgreSQL, dan Prisma ORM yang stabil dan ter-deploy di Vercel Cloud.
> 4. **Tampilan Mobile-First:** Antarmuka responsif yang disesuaikan khusus baik untuk pengguna pelajar maupun administrator.
> 
> Sekian demonstrasi dari aplikasi **Mind Passport**. Terima kasih banyak atas perhatian Bapak/Ibu dosen penguji. Saya menyambut baik segala masukan dan pertanyaan."

---

## ❓ ANTISIPASI PERTANYAAN PENGUJI (FAQ HANDBOOK)

**Q: Bagaimana jika koneksi internet lambat atau AI Gemini tidak merespons?**  
> **A:** *"Mind Passport dilengkapi dengan **Algorithm Fallback & Fast 4-Second Timeout**. Jika AI lambat, sistem secara otomatis beralih menggunakan kalkulasi matematis dan template terstruktur dalam waktu kurang dari 1 detik, sehingga aplikasi 100% tidak pernah crash atau hang."*

**Q: Bagaimana cara menghitung Career Readiness Score?**  
> **A:** *"Skor CRS dihitung menggunakan formula bobot kombinasi: Career DNA (20%) + Skill Gap Matching (35%) + Roadmap Progress (25%) + Verified Experiences (20%). Formula ini telah dibungkus dalam modul `readiness-calculator.ts`."*

**Q: Apakah QR Code benar-benar bisa discan via kamera HP?**  
> **A:** *"Ya, generator QR Code menggunakan pustaka server-side yang menghasilkan gambar PNG base64 ber-kontras tinggi berisikan URL publik unik paspor (`/passport/[slug]`). Siapa saja yang scan akan langsung diarahkan ke halaman paspor publik tanpa perlu login."*
