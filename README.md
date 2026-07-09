# 🎮 QUIZ ARENA! 🚀

Aplikasi web kuis interaktif berbasis *Single Page Architecture* (SPA) dengan tema visual panggung arcade/cyberpunk yang modern. Proyek ini menggabungkan antarmuka responsif berbasis **Tailwind CSS**, animasi dinamis **Animate.css**, serta sistem manajemen state kuis menggunakan **JavaScript** murni (*Vanilla JS*).

---

## 🛠️ Struktur Berkas Proyek

Proyek ini dibangun secara modular menggunakan tiga komponen utama[cite: 1]:
* **`index.html`** – Berisi kerangka utama halaman, struktur panggung kuis, dan tata letak UI[cite: 1].
* **`style.css`** – Mengatur gaya visual tema neon, efek latar belakang panggung, serta pembuatan komponen grafis karakter berbasis CSS murni[cite: 1].
* **`script.js`** – Mengatur logika kuis, *timer counting*, sistem deteksi kecurangan, dan sinkronisasi data dengan server[cite: 1].

---

## 📦 Langkah-Langkah Persiapan & Instalasi

Ikuti langkah berikut untuk menyiapkan proyek di komputer Anda:

### 1. Ekstrak Berkas
Pastikan Anda telah mengekstrak seluruh isi file `projek Serly Mulanty.zip` ke dalam satu folder khusus (misalnya nama folder: `quiz-arena`). Jangan memisahkan file `index.html`, `script.js`, dan `style.css` agar integrasi sistem tidak terputus[cite: 1].

### 2. Membuka Proyek
Anda dapat menjalankan aplikasi ini menggunakan dua metode:

* **Metode Standar (Langsung):**
  1. Buka folder tempat Anda mengekstrak berkas.
  2. Klik ganda (*double click*) pada file **`index.html`**[cite: 1].
  3. Aplikasi akan langsung terbuka di peramban (*browser*) bawaan Anda (Disarankan: Google Chrome atau Mozilla Firefox).

* **Metode Developer (Menggunakan Live Server VS Code):**
  1. Buka aplikasi **Visual Studio Code**.
  2. Pilih menu **File > Open Folder...** lalu arahkan ke folder proyek Anda.
  3. Pastikan ekstensi **Live Server** sudah terinstal di VS Code Anda.
  4. Klik kanan pada file `index.html`, lalu pilih **Open with Live Server**. Metode ini lebih disarankan untuk pengembangan karena mendukung pembaruan otomatis (*live reload*).

---

## 🕹️ Panduan Jalannya Permainan (Alur Kuis)

Aplikasi ini berjalan melalui 3 tahapan panggung utama secara sekuensial tanpa *reload* halaman:

1. **Login Stage (Tahap Autentikasi):**
   * Masukkan nama, NIM, dan kata sandi Anda pada kolom input yang tersedia.
   * Klik tombol **START STAGE!** untuk memverifikasi data dan masuk ke area kuis.

2. **Exam Stage (Tahap Pengerjaan):**
   * Anda akan dihadapkan pada 5 butir soal pilihan ganda secara bergantian.
   * **Sistem Timer:** Waktu pengerjaan akan terus berjalan mundur. Anda dapat menggunakan tombol *Pause* jika diperlukan, yang akan menghentikan waktu secara sinkron.
   * **Sistem Anti-Cheat:** Jangan berpindah tab atau meminimalkan jendela browser selama ujian aktif. Jika Anda keluar dari tab (peristiwa *blur/tab-out*), sistem akan memberikan peringatan tegas. Batas pelanggaran maksimal adalah 3 kali sebelum Anda dinyatakan gugur (*Game Over*).

3. **Result Stage (Tahap Hasil & Skor):**
   * Setelah selesai atau waktu habis, sistem akan menghitung skor Anda secara otomatis.
   * Halaman akan menampilkan total nilai akhir beserta peringkat kelulusan (*Rank*).
   * Tekan tombol **PLAY AGAIN 🔄** jika ingin mengulang kembali kuis dari awal.

---

## 📊 Hasil yang Dihasilkan (Expected Outputs)

Setelah Anda menjalankan proyek ini, berikut adalah output dan perilaku sistem yang akan dihasilkan pada setiap tahapan:

### 1. Tampilan Login Stage (Awal)
* **Output Visual:** Halaman berlatar belakang gelap dengan aksen lampu neon futuristik. Di bagian tengah, terdapat form login interaktif. Di samping atau sekitar form, muncul karakter chibi *Megurine Luka* & *Hatsune Miku* yang dibuat menggunakan CSS murni dengan animasi halus (*floating effect*).
* **Hasil Aksi:** Jika input kosong atau salah, sistem memunculkan validasi. Jika berhasil, halaman akan bertransisi mulus (menggunakan efek *Animate.css*) langsung masuk ke area kuis tanpa *loading* ulang.

### 2. Tampilan Exam Stage (Proses Kuis)
* **Output Visual:** Pertanyaan kuis muncul satu per satu di dalam kotak panel (*card*) bergaya arkade. Di bagian atas panggung, terdapat bilah informasi yang menampilkan nama peserta, sisa waktu (*countdown timer*) yang terus berkurang secara *real-time*, dan indikator jumlah pelanggaran (*Cheat Count: 0/3*).
* **Hasil Mekanis Anti-Cheat:** 
  * Jika pengguna mencoba membuka tab baru, peramban akan langsung memicu fungsi *tab-out detection*.
  * Layar akan memunculkan pesan peringatan modal/alert: **"Peringatan: Jangan meninggalkan panggung ujian!"**.
  * Angka pelanggaran akan bertambah (+1). Jika mencapai 3 kali, panggung langsung terkunci dan menampilkan status *Game Over* / Gugur.

### 3. Tampilan Result Stage (Papan Skor Akhir)
* **Output Visual:** Panel kuis berganti menjadi papan pengumuman skor akhir yang meriah dengan efek animasi selebrasi jika lulus.
* **Hasil Kalkulasi:** Menampilkan total jawaban benar dari 5 soal, skor akhir berbasis skala 100, dan predikat kelulusan otomatis, misalnya **Rank S** untuk nilai sempurna, atau **Rank A/B/C**.

---

## 📈 Integrasi Database Spreadsheet (Google Sheets)

Ketika mahasiswa menekan tombol penyelesaian kuis pada **Result Stage**, `script.js` secara otomatis mengirimkan *payload* data mahasiswa secara *real-time* menggunakan metode HTTP POST ke Google Apps Script Web App[cite: 1]. 

Berikut adalah **struktur baris data mahasiswa** yang otomatis masuk dan tersusun rapi pada Spreadsheet admin:

| Timestamp | NIM | Nama Mahasiswa | Skor Akhir | Total Benar | Pelanggaran (Cheat Count) | Status Kelulusan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `09/07/2026 22:15:34` | `2209106001` | Serly Mulanty | `100` | `5 / 5` | `0 (Bersih)` | LULUS (Rank S) |
| `09/07/2026 22:18:12` | `2209106042` | Budi Dermawan | `80` | `4 / 5` | `1 (Peringatan)` | LULUS (Rank A) |
| `09/07/2026 22:20:05` | `2209106015` | Andi Wijaya | `0` | `0 / 5` | `3 (Gugur)` | GAGAL (Game Over) |

> ⚠️ **Catatan Sistem:** Jika status pelanggaran mencapai angka 3, sistem secara paksa mengirimkan nilai `0` ke dalam Spreadsheet dengan keterangan Status `GAGAL (Game Over)` sebagai sanksi fitur *Anti-Cheat*.

---

## ⚙️ Panduan Kustomisasi Developer (Advanced)

Jika Anda ingin memodifikasi atau mengembangkan kuis ini lebih lanjut:

* **Mengubah Bank Soal:**
  Buka file `script.js` dan cari array `quizData` pada baris atas[cite: 1]. Anda dapat mengubah teks pertanyaan, pilihan opsi, maupun indeks jawaban yang benar (dimulai dari indeks `0` untuk pilihan pertama hingga `3` untuk pilihan keempat).
* **Konfigurasi API Server:**
  Proyek ini menggunakan integrasi dengan Google Apps Script untuk sistem autentikasi eksternal. Endpoint server didefinisikan pada variabel `WEB_APP_URL` di dalam `script.js`[cite: 1]. Jika server eksternal mengalami kendala, sistem telah dilengkapi fitur *local fallback* otomatis agar kuis tetap dapat diuji coba secara lokal.

---
Developed with 💖 by **Serly Mulanty** ✨
