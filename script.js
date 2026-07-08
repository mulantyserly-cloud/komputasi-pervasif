/*==================================================
=          KONFIGURASI SMART CBT (BAGIAN 1)
==================================================*/

// GANTI DENGAN URL WEB APP APPS SCRIPT ANDA
const URL_API = "https://script.google.com/macros/s/AKfycbwWufY9jY_pIscf4l5Wo3V6EhIUUY8_NubQx4JGRZbQiLo3uSpOv37_PhQ1L_DUj44i/exec";

// ======================
// Variabel Global
// ======================

let peserta = {
    nama: "",
    nim: ""
};

let soal = [];
let jawaban = [];
let nomorSoal = 0;

let waktu = 30 * 60;
let timer;

// ======================
// LOGIN MAHASISWA
// ======================

async function mulaiUjian() {

    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nama || !nim || !password) {
        alert("Nama, NIM dan Password wajib diisi.");
        return;
    }

    try {

        const url =
            `${URL_API}?nama=${encodeURIComponent(nama)}&nim=${encodeURIComponent(nim)}&password=${encodeURIComponent(password)}`;

        console.log("Request :", url);

        const response = await fetch(url);

        const data = await response.json();

        console.log("Response :", data);

        if (data.status === "sukses") {

            peserta.nama = data.nama;
            peserta.nim = data.nim;

            document.getElementById("namaPeserta").textContent = data.nama;
            document.getElementById("nimPeserta").textContent = data.nim;

            document.getElementById("loginPage").style.display = "none";
            document.getElementById("examPage").style.display = "block";

            mulaiTimer();
            tampilkanSoal();

        } else {

            alert(data.pesan);

        }

    } catch (err) {

        console.error(err);

        alert("Tidak dapat terhubung ke Google Spreadsheet.");

    }

}
/*==================================================
=          FUNGSI SOAL (BAGIAN 2)
==================================================*/

// Menampilkan soal
function tampilkanSoal() {

    if (soal.length === 0) {

        document.getElementById("pertanyaan").innerHTML =
            "<center>Soal belum tersedia.</center>";

        document.getElementById("pilihan").innerHTML = "";

        return;
    }

    const s = soal[nomorSoal];

    document.getElementById("nomorSoal").innerHTML =
        `Soal ${nomorSoal + 1}`;

    document.getElementById("pertanyaan").innerHTML = s.pertanyaan;

    const pilihan = document.getElementById("pilihan");
    pilihan.innerHTML = "";

    const opsi = ["A", "B", "C", "D", "E"];

    for (let i = 0; i < opsi.length; i++) {

        if (!s[opsi[i]]) continue;

        const div = document.createElement("div");

        div.className = "pilihan-item";

        if (jawaban[nomorSoal] === opsi[i]) {

            div.classList.add("aktif");

        }

        div.innerHTML = `
            <label>
                <input
                    type="radio"
                    name="jawaban"
                    value="${opsi[i]}"
                    ${jawaban[nomorSoal] === opsi[i] ? "checked" : ""}
                >

                <span><b>${opsi[i]}.</b> ${s[opsi[i]]}</span>

            </label>
        `;

        div.onclick = () => pilihJawaban(opsi[i]);

        pilihan.appendChild(div);

    }

    updateProgress();

}

// Memilih jawaban
function pilihJawaban(huruf) {

    jawaban[nomorSoal] = huruf;

    tampilkanSoal();

}

// Soal berikutnya
function soalBerikutnya() {

    if (nomorSoal < soal.length - 1) {

        nomorSoal++;

        tampilkanSoal();

    }

}

// Soal sebelumnya
function soalSebelumnya() {

    if (nomorSoal > 0) {

        nomorSoal--;

        tampilkanSoal();

    }

}

// Progress Bar
function updateProgress() {

    if (soal.length === 0) return;

    let sudah = 0;

    jawaban.forEach(j => {

        if (j) sudah++;

    });

    const persen = (sudah / soal.length) * 100;

    document.getElementById("progressBar").style.width =
        persen + "%";

}
/*==================================================
=          TIMER & HASIL UJIAN (BAGIAN 3)
==================================================*/

function mulaiTimer() {

    updateTimer();

    timer = setInterval(() => {

        waktu--;

        updateTimer();

        if (waktu <= 0) {

            clearInterval(timer);

            submitUjian();

        }

    }, 1000);

}

function updateTimer() {

    const menit = Math.floor(waktu / 60);
    const detik = waktu % 60;

    document.getElementById("timer").textContent =
        String(menit).padStart(2, "0") +
        ":" +
        String(detik).padStart(2, "0");

}

function submitUjian() {

    clearInterval(timer);

    let benar = 0;

    for (let i = 0; i < soal.length; i++) {

        if (jawaban[i] === soal[i].benar) {

            benar++;

        }

    }

    const total = soal.length;

    const nilai = total === 0
        ? 0
        : Math.round((benar / total) * 100);

    document.getElementById("examPage").style.display = "none";
    document.getElementById("hasilPage").style.display = "block";

    document.getElementById("hasilNama").textContent =
        peserta.nama;

    document.getElementById("hasilNim").textContent =
        peserta.nim;

    document.getElementById("nilaiAkhir").textContent =
        nilai;

    let predikat = "Kurang";

    if (nilai >= 90)
        predikat = "Sangat Baik";
    else if (nilai >= 80)
        predikat = "Baik";
    else if (nilai >= 70)
        predikat = "Cukup";
    else if (nilai >= 60)
        predikat = "Perlu Belajar Lagi";

    document.getElementById("predikat").textContent =
        predikat;

}


/*==================================================
=          WARNING PINDAH TAB
==================================================*/

let pelanggaran = 0;

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        pelanggaran++;

        document.getElementById("jumlahPelanggaran").textContent =
            pelanggaran;

        document.getElementById("warningModal").style.display =
            "flex";

    }

});

function tutupWarning() {

    document.getElementById("warningModal").style.display =
        "none";

}


/*==================================================
=          CONTOH SOAL
==================================================*/

soal = [

{
    pertanyaan:"2 + 2 = ...",

    A:"2",
    B:"3",
    C:"4",
    D:"5",
    E:"6",

    benar:"C"
},

{
    pertanyaan:"Ibu kota Indonesia adalah ...",

    A:"Bandung",
    B:"Surabaya",
    C:"Medan",
    D:"Jakarta",
    E:"Makassar",

    benar:"D"
},

{
    pertanyaan:"HTML adalah ...",

    A:"Bahasa Pemrograman",
    B:"Database",
    C:"Markup Language",
    D:"Framework",
    E:"Server",

    benar:"C"
}

];

jawaban = new Array(soal.length).fill(null);