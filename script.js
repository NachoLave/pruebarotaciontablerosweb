const LINKS = [
  "https://app.powerbi.com/groups/647f43d9-54a1-47ee-9e78-604bb84ac9ff/reports/01661e10-0139-4bee-bf88-1b96ba9d7f2e/44f3f26abe0a6fb92b24?experience=power-bi&chromeless=true", //Empleados - Altas y bajas
        "https://app.powerbi.com/groups/647f43d9-54a1-47ee-9e78-604bb84ac9ff/reports/01661e10-0139-4bee-bf88-1b96ba9d7f2e/ReportSectionf9fe292b4b0b2244a793?experience=power-bi&chromeless=true", //Edad y Sexo
        "https://app.powerbi.com/groups/647f43d9-54a1-47ee-9e78-604bb84ac9ff/reports/01661e10-0139-4bee-bf88-1b96ba9d7f2e/ReportSection7b34db0f300b875c8c1b?experience=power-bi&chromeless=true", //Antiguedad
"https://app.powerbi.com/groups/647f43d9-54a1-47ee-9e78-604bb84ac9ff/reports/01661e10-0139-4bee-bf88-1b96ba9d7f2e/ReportSection1554dd7e053a66979e0b?experience=powerbi&chromeless=true", //empleados Dotacion
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
