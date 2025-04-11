const LINKS_ORIGINAL = [
  // agregá tus URLs acá
   "https://app.powerbi.com/groups/me/reports/7e9d3785-efd4-4ba6-86b2-e6890eaf9efc/ReportSection020b3c6bb1de02141e39?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&chromeless=true&experience=power-bi", // resumen ejecutivo

        "https://app.powerbi.com/groups/me/reports/82b9efd6-ed22-472f-95e9-336547f995f1/7494775d5c4c11eddb1d?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&chromeless=true&experience=power-bi", // portal gsp
        "https://app.powerbi.com/groups/me/reports/79f67593-bef4-4cdf-a865-11e92d41571b/ReportSection?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&chromeless=true&experience=power-bi", //Riesgos grc
        "https://app.powerbi.com/groups/me/reports/3d207542-1bcb-4557-a2e1-4a195a66ebef/ReportSection?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&chromeless=true&experience=power-bi", //status backups

        "https://app.powerbi.com/groups/me/reports/481e7a55-3d56-4b5f-a736-de466a672cb7/3f59c63e62ec2e696753?experience=power-bi&chromeless=true",// geolocalizacio
        "https://app.powerbi.com/groups/me/reports/cb45d594-defe-448d-a218-1ff6ad03172f/ReportSection1554dd7e053a66979e0b?experience=power-bi&chromeless=true", //empleados, altas, bajas
        "https://app.powerbi.com/groups/me/reports/f542c10d-bc0a-41be-8983-9a6b9f25ccb2/56ad26d522ccc2e3b89c?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&experience=power-bi&chromeless=true", //Recaudaciones 2024
        "https://app.powerbi.com/groups/me/reports/f542c10d-bc0a-41be-8983-9a6b9f25ccb2/39641eae0b32fe7ea9da?ctid=9d6555ab-db4f-4ab0-8e7e-39efc4dc6730&experience=power-bi&chromeless=true" //Recaudaciones 2025
       
];

const ROTATION_TIME = 600; // segundos
let intervalId = null;
let countdown = ROTATION_TIME;
let currentIndex = 0;
let secondaryTab = null;

const ROTOS_KEY = "tablerosRotos";

// --- UTILIDADES ---
function getRotos() {
  return JSON.parse(localStorage.getItem(ROTOS_KEY) || "[]");
}

function addRoto(url) {
  const actuales = getRotos();
  if (!actuales.includes(url)) {
    actuales.push(url);
    localStorage.setItem(ROTOS_KEY, JSON.stringify(actuales));
  }
}

function clearRotos() {
  localStorage.setItem(ROTOS_KEY, JSON.stringify([]));
}

function getValidLinks() {
  const rotos = getRotos();
  return LINKS_ORIGINAL.filter(link => !rotos.includes(link));
}

// --- ROTACIÓN ---
function updateTimer() {
  const timer = document.getElementById("timer");
  const minutes = String(Math.floor(countdown / 60)).padStart(2, "0");
  const seconds = String(countdown % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
}

function openOrUpdateTab(url) {
  if (!secondaryTab || secondaryTab.closed) {
    secondaryTab = window.open(url, "_blank");
  } else {
    secondaryTab.location.href = url;
  }
}

function rotate() {
  const validLinks = getValidLinks();
  if (validLinks.length === 0) {
    alert("No hay tableros válidos para mostrar.");
    return;
  }
  if (currentIndex >= validLinks.length) currentIndex = 0;
  openOrUpdateTab(validLinks[currentIndex]);
  currentIndex = (currentIndex + 1) % validLinks.length;
}

function tick() {
  countdown--;
  updateTimer();
  if (countdown <= 0) {
    countdown = ROTATION_TIME;
    rotate();
  }
}

function startRotation() {
  if (intervalId) return;
  intervalId = setInterval(tick, 1000);
}

function pauseRotation() {
  clearInterval(intervalId);
  intervalId = null;
}

// --- DETECCIÓN DE ERROR ---
function checkForError() {
  const errorText = "No pudimos encontrar ese informe";
  const elements = [...(secondaryTab?.document?.querySelectorAll("div, span, p") || [])];
  const hasError = elements.some(el => el.textContent?.includes(errorText));
  if (hasError) {
    const url = secondaryTab.location.href;
    console.warn("Tablero roto detectado:", url);
    addRoto(url);
    rotate(); // salta al siguiente
  }
}

// --- ADMIN LISTA ROTA ---
function mostrarTablerosRotos() {
  const rotos = getRotos();
  const content = rotos.length
    ? rotos.map((url, i) => `${i + 1}. ${url}`).join("\n")
    : "No hay tableros rotos.";

  const win = window.open("", "TablerosRotos", "width=800,height=500");
  win.document.write(`
    <html><head><title>Tableros rotos</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      textarea { width: 100%; height: 300px; }
      button { margin-top: 10px; padding: 10px; }
    </style>
    </head><body>
    <h2>Tableros Rotos</h2>
    <textarea readonly>${content}</textarea><br/>
    <button onclick="localStorage.setItem('${ROTOS_KEY}', '[]'); alert('Lista limpiada'); location.reload();">Limpiar lista</button>
    </body></html>
  `);
}

// --- INICIO AUTOMÁTICO ---
rotate();         // primer tablero
updateTimer();    // muestra inicial
startRotation();  // arranca rotación
setInterval(checkForError, 5000); // chequea cada 5s
