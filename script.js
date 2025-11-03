// ===== META COLLECTION =====
const meta = {
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  viewport: `${window.innerWidth} x ${window.innerHeight}`,
  screen: `${screen.width} x ${screen.height}`,
  deviceMemory: navigator.deviceMemory ? navigator.deviceMemory + " GB" : "n/a",
  hardwareConcurrency: navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency + " cores"
    : "n/a",
  clicks: 0,
  moves: 0,
  started: new Date().toISOString()
};

// expose for teaching
window.__DF_META__ = meta;

// render cards
const dataGrid = document.getElementById("data-grid");
function renderData() {
  dataGrid.innerHTML = "";
  Object.entries(meta).forEach(([key, value]) => {
    const card = document.createElement("div");
    card.className = "data-card";
    card.innerHTML = `
      <div class="data-label">${key}</div>
      <div class="data-value">${value}</div>
    `;
    dataGrid.appendChild(card);
  });
}
renderData();

window.addEventListener("click", () => {
  meta.clicks++;
  renderData();
  drawViz();
});
window.addEventListener("mousemove", () => {
  meta.moves++;
  if (meta.moves % 25 === 0) {
    renderData();
    drawViz();
  }
});
window.addEventListener("resize", () => {
  meta.viewport = `${window.innerWidth} x ${window.innerHeight}`;
  renderData();
  resizeEye();
  drawViz();
});

// ===== SIMPLE BARS =====
const vizCanvas = document.getElementById("data-viz");
const vctx = vizCanvas.getContext("2d");

function drawViz() {
  const w = vizCanvas.width;
  const h = vizCanvas.height;
  vctx.clearRect(0, 0, w, h);

  const entries = [
    ["Clicks", meta.clicks],
    ["Moves", meta.moves],
    ["Cores", Number((meta.hardwareConcurrency || "0").toString().split(" ")[0]) || 0],
    ["Memory", Number((meta.deviceMemory || "0").toString().split(" ")[0]) || 0]
  ];

  const maxVal = Math.max(...entries.map(e => e[1]), 1);
  const barW = (w - 60) / entries.length;

  entries.forEach((entry, idx) => {
    const [label, val] = entry;
    const barH = (val / maxVal) * (h - 60);

    const x = 30 + idx * barW;
    const y = h - 30 - barH;

    // background bar
    vctx.fillStyle = "rgba(249,225,167,0.05)";
    vctx.fillRect(x, 30, barW - 20, h - 60);

    // value bar
    vctx.fillStyle = "rgba(249,225,167,0.55)";
    vctx.fillRect(x, y, barW - 20, barH);

    // label
    vctx.fillStyle = "rgba(239,239,239,0.7)";
    vctx.font = "10px system-ui";
    vctx.fillText(label, x, h - 15);

    // value
    vctx.fillStyle = "rgba(239,239,239,0.35)";
    vctx.fillText(val, x, y - 4);
  });

  // title
  vctx.fillStyle = "rgba(239,239,239,0.35)";
  vctx.font = "11px system-ui";
  vctx.fillText("interaction vs capability (artistic scale)", 14, 16);
}
drawViz();

// ===== EYE ANIMATION =====
const eyeCanvas = document.getElementById("eye-canvas");
const ectx = eyeCanvas.getContext("2d");
let ew = 0, eh = 0, ecx = 0, ecy = 0;

function resizeEye() {
  ew = eyeCanvas.width = window.innerWidth;
  eh = eyeCanvas.height = window.innerHeight;
  ecx = ew / 2;
  ecy = eh / 2;
}
resizeEye();

let mouseX = ecx;
let mouseY = ecy;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawEye() {
  ectx.clearRect(0, 0, ew, eh);

  // background glow
  const grad = ectx.createRadialGradient(ecx, ecy, 0, ecx, ecy, Math.max(ew, eh));
  grad.addColorStop(0, "rgba(26,25,38,1)");
  grad.addColorStop(1, "rgba(5,5,9,0)");
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, ew, eh);

  const time = performance.now() * 0.001;
  const eyeW = Math.min(ew * 0.45, 560);
  const eyeH = Math.min(eh * 0.23, 230);

  // eye outline
  ectx.save();
  ectx.translate(ecx, ecy);
  ectx.strokeStyle = "rgba(249,225,167,0.6)";
  ectx.lineWidth = 2.2;
  ectx.beginPath();
  ectx.moveTo(-eyeW / 2, 0);
  ectx.quadraticCurveTo(0, -eyeH, eyeW / 2, 0);
  ectx.quadraticCurveTo(0, eyeH, -eyeW / 2, 0);
  ectx.stroke();

  // pupil position towards mouse
  const relX = (mouseX - ecx) / (ew * 0.5);
  const relY = (mouseY - ecy) / (eh * 0.5);
  const pupilX = relX * (eyeW * 0.12);
  const pupilY = relY * (eyeH * 0.12);

  // iris
  ectx.beginPath();
  ectx.fillStyle = "rgba(249,225,167,0.1)";
  ectx.arc(pupilX, pupilY, 44, 0, Math.PI * 2);
  ectx.fill();

  // pupil inner
  ectx.beginPath();
  ectx.fillStyle = "rgba(5,5,9,1)";
  ectx.arc(pupilX, pupilY, 15 + Math.sin(time * 1.5) * 2, 0, Math.PI * 2);
  ectx.fill();

  // moving rings (ritual vibe)
  for (let i = 0; i < 3; i++) {
    ectx.beginPath();
    ectx.strokeStyle = `rgba(249,225,167,${0.17 - i * 0.04})`;
    const r = 70 + Math.sin(time * 0.6 + i) * 16;
    ectx.arc(pupilX, pupilY, r, 0, Math.PI * 2);
    ectx.stroke();
  }

  ectx.restore();

  requestAnimationFrame(drawEye);
}
drawEye();