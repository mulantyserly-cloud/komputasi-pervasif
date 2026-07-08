// URL Google Apps Script Web App Anda (Gunakan URL Hasil New Deployment Terakhir)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxapMifTUhjuQLTQDvKkym5B1UdD8qTZWTXPrKqYDF91ypDr99_ckyj6CLVoRLt9iM/exec"; 

// Data Soal Kuis Pengetahuan Umum
const quizData = [
    { 
        q: "Negara manakah yang memenangkan trofi Piala Dunia FIFA terbanyak sepanjang sejarah sepak bola?", 
        o: ["Prancis", "Jerman", "Brasil", "Argentina"], 
        a: 2,
        difficulty: "★☆☆☆☆"
    },
    { 
        q: "Gunung tertinggi di dunia yang terletak di perbatasan antara Nepal dan Tibet adalah...", 
        o: ["Gunung Kilimanjaro", "Gunung Everest", "Gunung Fuji", "Gunung K2"], 
        a: 1,
        difficulty: "★★☆☆☆"
    },
    { 
        q: "Siapakah ilmuwan terkenal yang menemukan teori relativitas (E = mc²)?", 
        o: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"], 
        a: 2,
        difficulty: "★★★☆☆"
    },
    { 
        q: "Apakah nama samudra terluas yang ada di planet Bumi?", 
        o: ["Samudra Pasifik", "Samudra Atlantik", "Samudra Hindia", "Samudra Arktik"], 
        a: 0,
        difficulty: "★★★★☆"
    },
    { 
        q: "Dalam sistem tata surya kita, planet manakah yang dijuluki sebagai 'Planet Merah'?", 
        o: ["Venus", "Mars", "Jupiter", "Saturnus"], 
        a: 1,
        difficulty: "★★★★★"
    }
];

let currentQuestion = 0;
let score = 0;
let timeRemaining = 600; // 10 Menit
let timerInterval;
let tabViolations = 0;
let isPaused = false;
let afkTimer;

function playClick() { 
    document.getElementById('sfx-click').play().catch(()=>{}); 
}

// --- KODE BARU: SISTEM LOGIN MENGGUNAKAN FETCH GET (ANTI-BLOKIR BROWSER) ---
async function prosesLogin() {
    playClick();
    const nama = document.getElementById('input-nama').value.trim();
    const nim = document.getElementById('input-nim').value.trim();
    const pass = document.getElementById('input-pass').value.trim();

    if(!nama || !nim || !pass) {
        alert("Semua kolom login wajib diisi! ✨");
        return;
    }

    const btn = document.querySelector('#login-scene button');
    btn.innerText = "CONNECTING TO STAGE... 🌐";
    btn.disabled = true;

    // Membuat URL parameter GET untuk menembak Apps Script secara transparan
    const URL_TEMBAK = `${WEB_APP_URL}?action=login&nama=${encodeURIComponent(nama)}&nim=${encodeURIComponent(nim)}&password=${encodeURIComponent(pass)}`;

    try {
        const response = await fetch(URL_TEMBAK);
        const textData = await response.text();
        
        // Ekstrak objek JSON murni dari dalam text respon balik
        const cleanJSON = textData.substring(textData.indexOf("{"), textData.lastIndexOf("}") + 1);
        const result = JSON.parse(cleanJSON);

        if (result.status === "success") {
            // BERHASIL -> DATA COCOK DI SPREADSHEET
            bukaHalamanUjian(nama, nim);
        } else {
            // DITOLAK -> AKUN TIDAK COCOK / DATA ASAL-ASALAN
            alert("❌ Akses Ditolak: " + result.message);
            btn.innerText = "START STAGE! 🎵";
            btn.disabled = false;
        }

    } catch (error) {
        console.error(error);
        alert("Gagal membaca respon database. Pastikan koneksi internet stabil!");
        btn.innerText = "START STAGE! 🎵";
        btn.disabled = false;
    }
}

function bukaHalamanUjian(nama, nim) {
    document.getElementById('login-scene').classList.add('animate__bounceOutUp');
    setTimeout(() => {
        document.getElementById('login-scene').style.display = 'none';
        const exam = document.getElementById('exam-scene');
        exam.classList.remove('hidden');
        exam.classList.add('animate__jackInTheBox');
        
        document.getElementById('player-nama').innerText = nama;
        document.getElementById('player-nim').innerText = "NIM: " + nim;
        
        startTimer();
        resetAFKTimeout();
        loadQuestion();
        initAntiCheat();
    }, 600);
}

// --- LOADING & KONTROL SOAL ---
function loadQuestion() {
    if(currentQuestion >= quizData.length) {
        selfinishedQuiz();
        return;
    }
    const data = quizData[currentQuestion];
    
    document.getElementById('question-badge').innerText = `STAGE 0${currentQuestion + 1} | ${data.difficulty}`;
    document.getElementById('question-text').innerText = data.q;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    data.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 text-left px-5 py-4 rounded-2xl font-bold text-gray-700 transition-all flex items-center justify-between group transform hover:-translate-y-1";
        
        const alfabet = ["A", "B", "C", "D"];
        btn.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="bg-[#ff4081] text-white font-game rounded-xl px-3 py-1 text-sm">${alfabet[idx]}</span>
                <span>${opt}</span>
            </div> 
            <span class="opacity-0 group-hover:opacity-100 transition-opacity text-pink-500 font-game text-sm">SELECT ★</span>
        `;
        
        btn.onclick = () => nextQuestion(idx);
        optionsContainer.appendChild(btn);
    });
}

function nextQuestion(selectedIndex) {
    playClick();
    
    if (selectedIndex === quizData[currentQuestion].a) {
        score++;
    }

    currentQuestion++;
    const area = document.getElementById('quiz-content-area');
    area.classList.add('animate__animated', 'animate__fadeInRight');
    
    loadQuestion();
    
    setTimeout(() => {
        area.classList.remove('animate__animated', 'animate__fadeInRight');
    }, 500);
}

// --- TIMER ---
function startTimer() {
    timerInterval = setInterval(() => {
        if(!isPaused) {
            timeRemaining--;
            let mins = Math.floor(timeRemaining / 60);
            let secs = timeRemaining % 60;
            document.getElementById('game-clock').innerText = 
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            if(timeRemaining <= 0) {
                clearInterval(timerInterval);
                selfinishedQuiz();
            }
        }
    }, 1000);
}

// --- OVERLAY & KONTROL PAUSE ---
function togglePause() {
    playClick();
    isPaused = true;
    showOverlay("STAGE PAUSED", "Game di-pause sementara oleh peserta. Klik resume untuk melanjutkan.");
}

/* Fungsi memulihkan game dari freeze */
function resumeGame() {
    playClick();
    isPaused = false;
    document.getElementById('overlay-screen').classList.add('animate__fadeOut');
    setTimeout(() => {
        document.getElementById('overlay-screen').className = "hidden absolute inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate__animated";
    }, 400);
    resetAFKTimeout();
}

function showOverlay(title, desc, hideBtn = false) {
    const overlay = document.getElementById('overlay-screen');
    document.getElementById('overlay-title').innerText = title;
    document.getElementById('overlay-desc').innerText = desc;
    document.getElementById('btn-resume').style.display = hideBtn ? 'none' : 'block';
    overlay.classList.remove('hidden');
    overlay.classList.add('animate__fadeIn');
}

// --- ANTI-CHEAT & DETEKSI AFK ---
function initAntiCheat() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && !isPaused) {
            tabViolations++;
            document.getElementById('warning-count').innerText = `Pelanggaran Tab: ${tabViolations}/3`;
            
            if(tabViolations >= 3) {
                isPaused = true;
                clearInterval(timerInterval);
                selfinishedQuiz(); 
            } else {
                isPaused = true;
                showOverlay("WARNING! ⚠️", `Jangan kabur ke tab lain! Pelanggaran ke-${tabViolations}. Batas maksimal 3 kali.`);
            }
        }
    });

    window.onload = resetAFKTimeout;
    window.onmousemove = resetAFKTimeout;
    window.onmousedown = resetAFKTimeout; 
    window.onclick = resetAFKTimeout;     
    window.onkeydown = resetAFKTimeout;   
}

function resetAFKTimeout() {
    if(isPaused && document.getElementById('overlay-title').innerText === "AFK MODE DETECTED") return;
    clearTimeout(afkTimer);
    afkTimer = setTimeout(() => {
        if(!isPaused && currentQuestion < quizData.length) {
            isPaused = true;
            showOverlay("AFK MODE DETECTED", "Layar membeku karena kamu tidak aktif. Klik resume untuk kembali ke arena!");
        }
    }, 30000); // 30 Detik
}

// --- HALAMAN EVALUASI SKOR (HASIL AKHIR) ---
function selfinishedQuiz() {
    clearInterval(timerInterval);
    clearTimeout(afkTimer);
    
    document.getElementById('exam-scene').style.display = 'none';
    document.getElementById('overlay-screen').classList.add('hidden');
    
    const resultScene = document.getElementById('result-scene');
    resultScene.classList.remove('hidden');
    resultScene.classList.add('animate__jackInTheBox');
    
    let totalNilai = (score / quizData.length) * 100;
    
    let rank = "RANK D";
    if(tabViolations >= 3) rank = "DISQUALIFIED ❌";
    else if (totalNilai === 100) rank = "ALL PERFECT 👑";
    else if (totalNilai >= 80) rank = "RANK S ⭐";
    else if (totalNilai >= 60) rank = "RANK A";
    else if (totalNilai >= 40) rank = "RANK B";
    
    document.getElementById('result-rank').innerText = rank;
    document.getElementById('result-score').innerText = tabViolations >= 3 ? 0 : totalNilai;
    document.getElementById('result-correct').innerText = `${score} / ${quizData.length}`;
    document.getElementById('result-violation').innerText = `${tabViolations} Kali`;
}