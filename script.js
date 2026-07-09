const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxapMifTUhjuQLTQDvKkym5B1UdD8qTZWTXPrKqYDF91ypDr99_ckyj6CLVoRLt9iM/exec"; 

const quizData = [
    { q: "Negara manakah yang memenangkan trofi Piala Dunia FIFA terbanyak sepanjang sejarah sepak bola?", o: ["Prancis", "Jerman", "Brasil", "Argentina"], a: 2 },
    { q: "Gunung tertinggi di dunia yang terletak di perbatasan antara Nepal dan Tibet adalah...", o: ["Gunung Kilimanjaro", "Gunung Everest", "Gunung Fuji", "Gunung K2"], a: 1 },
    { q: "Siapakah ilmuwan terkenal yang menemukan teori relativitas (E = mc²)?", o: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"], a: 2 },
    { q: "Apakah nama samudra terluas yang ada di planet Bumi?", o: ["Samudra Pasifik", "Samudra Atlantik", "Samudra Hindia", "Samudra Arktik"], a: 0 },
    { q: "Dalam sistem tata surya kita, planet manakah yang dijuluki sebagai 'Planet Merah'?", o: ["Venus", "Mars", "Jupiter", "Saturnus"], a: 1 }
];

let currentQuestion = 0; 
let score = 0; 
let timeRemaining = 600; 
let timerInterval; 
let tabViolations = 0; 
let isPaused = false; 

function playClick() { 
    document.getElementById('sfx-click').play().catch(()=>{}); 
}

// HALAMAN 1: PROSES LOGIN YANG VALID
async function prosesLogin() {
    playClick();
    const nama = document.getElementById('input-nama').value.trim();
    const nim = document.getElementById('input-nim').value.trim();
    const pass = document.getElementById('input-pass').value.trim();

    if(!nama || !nim || !pass) { alert("Semua kolom login wajib diisi! ✨"); return; }

    const btn = document.querySelector('#login-scene button');
    btn.innerText = "CONNECTING STAGE..."; btn.disabled = true;

    try {
        const URL_TEMBAK = `${WEB_APP_URL}?action=login&nama=${encodeURIComponent(nama)}&nim=${encodeURIComponent(nim)}&password=${encodeURIComponent(pass)}`;
        const response = await fetch(URL_TEMBAK);
        const textData = await response.text();
        const cleanJSON = textData.substring(textData.indexOf("{"), textData.lastIndexOf("}") + 1);
        const result = JSON.parse(cleanJSON);

        if (result.status === "success") { 
            bukaHalamanUjian(nama, nim); 
        } else { 
            alert("❌ Akses Ditolak: " + result.message); 
            btn.innerText = "START STAGE!"; btn.disabled = false; 
        }
    } catch (error) {
        // Fallback langsung masuk panggung ujian lokal jika server eksternal offline
        bukaHalamanUjian(nama, nim); 
    }
}

// PINDAH KELUAR DARI HALAMAN LOGIN -> MASUK HALAMAN EXAM
function bukaHalamanUjian(nama, nim) {
    document.getElementById('login-scene').classList.add('animate__zoomOut');
    
    setTimeout(() => {
        document.getElementById('login-scene').style.display = 'none';
        
        const examScene = document.getElementById('exam-scene');
        examScene.classList.remove('hidden');
        examScene.classList.add('animate__zoomIn');
        
        document.getElementById('player-nama').innerText = nama;
        document.getElementById('player-nim').innerText = "NIM: " + nim;
        
        startTimer(); 
        loadQuestion(); 
        initAntiCheat();
    }, 400);
}

// ME-LOAD SOAL UJIAN
function loadQuestion() {
    if(currentQuestion >= quizData.length) { selfinishedQuiz(); return; }
    const data = quizData[currentQuestion];
    
    document.getElementById('question-badge').innerText = `STAGE 0${currentQuestion + 1}`;
    document.getElementById('question-text').innerText = data.q;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const alfabet = ["A", "B", "C", "D"];
    data.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn-ui-option animate__animated animate__fadeInUp";
        btn.style.animationDelay = `${idx * 0.05}s`;
        btn.innerHTML = `<span class="option-bullet-circle">${alfabet[idx]}</span> <span>${opt}</span>`;
        btn.onclick = () => nextQuestion(idx);
        optionsContainer.appendChild(btn);
    });
}

function nextQuestion(selectedIndex) {
    if(isPaused) return;
    playClick();
    if (selectedIndex === quizData[currentQuestion].a) { score++; }
    currentQuestion++;
    loadQuestion();
}

// TIMER ENGINE
function startTimer() {
    timerInterval = setInterval(() => {
        if(!isPaused) {
            timeRemaining--;
            let mins = Math.floor(timeRemaining / 60); 
            let secs = timeRemaining % 60;
            document.getElementById('game-clock').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            if(timeRemaining <= 0) { selfinishedQuiz(); }
        }
    }, 1000);
}

// FITUR PAUSE UJIAN YANG SINKRON
function togglePause() { 
    playClick(); 
    isPaused = true; 
    showOverlay("STAGE PAUSED", "Ujian panggung sedang dihentikan sementara."); 
}

function resumeGame() { 
    playClick(); 
    isPaused = false; 
    document.getElementById('overlay-screen').classList.add('hidden'); 
}

function showOverlay(title, desc) {
    const overlay = document.getElementById('overlay-screen');
    document.getElementById('overlay-title').innerText = title;
    document.getElementById('overlay-desc').innerText = desc;
    overlay.classList.remove('hidden');
}

// FITUR ANTI CHEAT DETEKSI MENINGGALKAN TAB
function initAntiCheat() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && !isPaused && currentQuestion < quizData.length) {
            tabViolations++;
            document.getElementById('warning-count').innerText = `${tabViolations}/3`;
            if(tabViolations >= 3) { 
                selfinishedQuiz(); 
            } else { 
                togglePause();
                showOverlay("WARNING! ⚠️", `Terdeteksi meninggalkan tab panggung arena! Pelanggaran ke-${tabViolations}.`); 
            }
        }
    });
}

// PINDAH KELUAR DARI HALAMAN EXAM -> MASUK HALAMAN RESULT
function selfinishedQuiz() {
    clearInterval(timerInterval);
    document.getElementById('exam-scene').style.display = 'none';
    document.getElementById('overlay-screen').classList.add('hidden');
    
    const resultScene = document.getElementById('result-scene');
    resultScene.classList.remove('hidden');
    resultScene.classList.add('animate__zoomInDown');
    
    let totalNilai = (score / quizData.length) * 100;
    document.getElementById('result-rank').innerText = totalNilai >= 80 ? "S" : "A";
    document.getElementById('result-score').innerText = totalNilai;
    document.getElementById('result-correct').innerText = `${score} / ${quizData.length}`;
    document.getElementById('result-violation').innerText = `${tabViolations} / 3`;
}