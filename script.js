const LINKS_ORIGINAL = [
  // agregá tus URLs acá
  "https://app.powerbi.com/groups/me/reports/7e9d3785-...etc..."
];

const ROTATION_TIME = 30; // segundos
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
