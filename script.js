const LINKS = [
    "https://app.powerbi.com/groups/me/reports/7e9d3785-...1e39?chromeless=true&experience=power-bi",
    "https://app.powerbi.com/groups/me/reports/88b3d9cb-...3402?chromeless=true&experience=power-bi"
];

const ROTATION_INTERVAL = 20000; // 20 segundos
let index = 0;
let popup = null;
let timer = ROTATION_INTERVAL;
let timerInterval;
let rotationInterval;
let paused = false;

const timerDisplay = document.getElementById("timer");
const resumeBtn = document.getElementById("resumeBtn");
const pauseBtn = document.getElementById("pauseBtn");

function updateTimerDisplay() {
    const seconds = Math.floor(timer / 1000);
    timerDisplay.textContent = `00:${String(seconds).padStart(2, '0')}`;
}

function rotarTablero() {
    if (!popup || popup.closed) {
        popup = window.open(LINKS[index], "_blank", "width=1280,height=800,top=50,left=100");
    } else {
        popup.location.href = LINKS[index];
        popup.focus();
    }
    index = (index + 1) % LINKS.length;
    timer = ROTATION_INTERVAL;
}

function startRotacion() {
    rotarTablero();
    rotationInterval = setInterval(rotarTablero, ROTATION_INTERVAL);
    timerInterval = setInterval(() => {
        if (!paused) {
            timer -= 1000;
            if (timer <= 0) timer = ROTATION_INTERVAL;
            updateTimerDisplay();
        }
    }, 1000);
}

function stopRotacion() {
    paused = true;
}

function resumeRotacion() {
    paused = false;
}

resumeBtn.addEventListener("click", resumeRotacion);
pauseBtn.addEventListener("click", stopRotacion);

// Inicio
updateTimerDisplay();
startRotacion();
