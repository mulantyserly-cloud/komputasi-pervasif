README & Panduan Penggunaan
Aplikasi Data Mahasiswa Berbasis Google Spreadsheet
Nama Mahasiswa: Serly Mulanty
Mata Kuliah: Komputasi Pervasif
1. Deskripsi Proyek
Aplikasi ini merupakan sistem berbasis web untuk mengelola data mahasiswa menggunakan Google Spreadsheet sebagai basis data. Sistem mendukung operasi CRUD (Create, Read, Update, Delete) melalui Google Apps Script sebagai API.
2. Fitur
•	Menampilkan data mahasiswa
•	Menambah data
•	Mengubah data
•	Menghapus data
•	Pencarian data
•	Responsive
•	Terhubung dengan Google Spreadsheet
3. Teknologi
HTML5
CSS3
JavaScript
Google Apps Script
Google Spreadsheet
4. Struktur Folder
project/
├── index.html
├── style.css
├── script.js
└── README.md
5. Instalasi
1.	Buat Google Spreadsheet baru.
2.	Buat header: NIM, Nama, Prodi, Semester, Email.
3.	Buka Extensions → Apps Script.
4.	Tempel kode API (doGet).
5.	Deploy sebagai Web App.
6.	Atur Execute as = Me dan Who has access = Anyone.
7.	Salin URL Web App.
8.	Tempel URL ke variabel API_URL pada script.js.
9.	Jalankan project menggunakan Live Server.
6. Contoh Google Apps Script
function doGet() {
 const sheet=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
 const data=sheet.getDataRange().getValues();
 let hasil=[];
 for(let i=1;i<data.length;i++){
  hasil.push({nim:data[i][0],nama:data[i][1],prodi:data[i][2],semester:data[i][3],email:data[i][4]});
 }
 return ContentService.createTextOutput(JSON.stringify(hasil))
 .setMimeType(ContentService.MimeType.JSON);
}
7. Pengujian
Tambahkan data pada Spreadsheet kemudian refresh aplikasi. Data akan ditampilkan secara otomatis apabila URL Web App telah dikonfigurasi dengan benar.
8. Penutup
Dokumen ini disusun sebagai panduan penggunaan dan dokumentasi proyek Aplikasi Data Mahasiswa Berbasis Google Spreadsheet.
