🎓 Aplikasi Data Mahasiswa Berbasis Google Spreadsheet

👤 Nama Mahasiswa: Serly Mulanty

🎓 Dosen Pengampu :Zikri Wahyudi, S.T., M.Kom.

📚 Mata Kuliah: Komputasi Pervasif

1. 📖 Deskripsi Proyek
Aplikasi ini merupakan sistem berbasis web untuk mengelola data mahasiswa secara efisien dengan menggunakan Google Spreadsheet sebagai basis data (database). Sistem ini mendukung penuh operasi CRUD (Create, Read, Update, Delete) yang dijembatani melalui Google Apps Script sebagai API.

2. ✨ Fitur Utama
📊 Menampilkan data mahasiswa secara real-time.

➕ Menambah data baru ke spreadsheet.

✏️ Mengubah data yang sudah ada.

🗑️ Menghapus data mahasiswa.

🔍 Pencarian data secara cepat.

📱 Responsive Design (nyaman diakses via HP maupun Laptop).

🔗 Terhubung langsung dengan Google Spreadsheet.

3. 🛠️ Teknologi yang Digunakan
🌐 HTML5 – Struktur halaman web.

🎨 CSS3 – Desain dan tata letak.

⚡ JavaScript – Logika aplikasi dan integrasi API.

⚙️ Google Apps Script – Backend / API pendukung.

📊 Google Spreadsheet – Penyimpanan basis data.

4. 📂 Struktur Folder
Plaintext
project/
├── 📄 index.html
├── 🎨 style.css
├── ⚡ script.js
└── 📝 README.md
5. 🚀 Panduan Instalasi & Konfigurasi
📊 Buat Google Spreadsheet baru di Google Drive Anda.

📝 Buat header pada baris pertama dengan urutan: NIM, Nama, Prodi, Semester, Email.

🛠️ Klik menu Extensions → Apps Script.

📋 Tempel kode API (doGet) yang tersedia di bawah ke dalam editor Apps Script.

🌐 Klik tombol Deploy → New deployment.

⚙️ Atur konfigurasi: Execute as = Me dan Who has access = Anyone.

🔗 Klik Deploy dan Salin URL Web App yang dihasilkan.

💾 Buka file script.js di proyek Anda, lalu tempel URL tersebut ke dalam variabel API_URL.

💻 Jalankan project Anda menggunakan ekstensi Live Server di VS Code atau browser.

6. 💻 Contoh Google Apps Script
JavaScript
function doGet() {
 const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
 const data = sheet.getDataRange().getValues();
 let hasil = [];
 
 for(let i = 1; i < data.length; i++){
  hasil.push({
    nim: data[i][0],
    nama: data[i][1],
    prodi: data[i][2],
    semester: data[i][3],
    email: data[i][4]
  });
 }
 
 return ContentService.createTextOutput(JSON.stringify(hasil))
 .setMimeType(ContentService.MimeType.JSON);
}
7. 🧪 Metode Pengujian
Tambahkan satu atau dua baris data simulasi secara manual langsung pada Google Spreadsheet Anda.

Buka atau refresh halaman aplikasi web Anda.

Jika data berhasil muncul di tabel halaman web, berarti konfigurasi URL Web App dan integrasi API sudah berjalan dengan benar dan sukses! ✅

8. 🏁 Penutup
Dokumen ini disusun sebagai panduan penggunaan resmi dan dokumentasi teknis untuk proyek Aplikasi Data Mahasiswa Berbasis Google Spreadsheet. Semoga panduan ini mempermudah pemahaman alur kerja aplikasi. Selamat mencoba! 🎉
