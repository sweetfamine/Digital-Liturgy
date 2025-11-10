// all easyly accessible metadata with out having to ask for users permissions
var meta = {
  userAgent: navigator.userAgent,
  language: navigator.language,
  languages: navigator.languages ? navigator.languages.join(", ") : navigator.language,
  platform: navigator.platform,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

  viewport: String(window.innerWidth) + " x " + String(window.innerHeight),
  screen: String(screen.width) + " x " + String(screen.height),
  pixelRatio: window.devicePixelRatio || 1,
  colorDepth: screen.colorDepth ? String(screen.colorDepth) + " bit" : "n/a",
  orientation: screen.orientation ? screen.orientation.type : "n/a",
  visibility: document.visibilityState,
  prefersDark: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "yes" : "no",

  deviceMemoryRaw: navigator.deviceMemory || 0,
  hardwareConcurrencyRaw: navigator.hardwareConcurrency || 0,
  deviceMemory: navigator.deviceMemory ? String(navigator.deviceMemory) + " GB" : "n/a",
  hardwareConcurrency: navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) + " cores" : "n/a",

  doNotTrack: navigator.doNotTrack || "unspecified",
  cookieEnabled: navigator.cookieEnabled ? "yes" : "no",
  online: navigator.onLine ? "online" : "offline",
  referrer: document.referrer || "none",
  path: location.pathname + location.search,
  historyLength: history.length,

  connectionType: (navigator.connection && navigator.connection.effectiveType) ? navigator.connection.effectiveType : "unknown",
  downlink: (navigator.connection && navigator.connection.downlink) ? String(navigator.connection.downlink) + " Mbps" : "n/a",
  rtt: (navigator.connection && navigator.connection.rtt) ? String(navigator.connection.rtt) + " ms" : "n/a",

  storageUsed: "checking...",
  storageQuota: "checking...",

  exposure: "0%",
  clicks: 0,
  moves: 0,
  started: new Date().toISOString(),
  firstInteraction: null,

  // timer
  timeOnPage: "0s",
  // internal timer
  timeOnPageSeconds: 0
};

window.__DF_META__ = meta;

// hidden keys
var HIDDEN_KEYS = ["timeOnPageSeconds"];

// labels and descriptions
var LABELS = {
  userAgent: "User agent",
  language: "Language",
  languages: "Languages",
  platform: "Platform",
  timezone: "Time zone",
  viewport: "Viewport",
  screen: "Screen",
  pixelRatio: "Device pixel ratio",
  colorDepth: "Color depth",
  orientation: "Screen orientation",
  visibility: "Tab visibility",
  prefersDark: "Color scheme preference",
  prefersReducedMotion: "Reduced motion",
  deviceMemory: "Device memory",
  hardwareConcurrency: "Hardware threads",
  doNotTrack: "Do Not Track",
  cookieEnabled: "Cookies enabled",
  online: "Connectivity",
  referrer: "Referrer",
  path: "Current path",
  historyLength: "History length",
  connectionType: "Connection type",
  downlink: "Downlink speed",
  rtt: "Network RTT",
  storageUsed: "Storage used",
  storageQuota: "Storage quota",
  exposure: "Scroll exposure",
  clicks: "Clicks (ritual)",
  moves: "Pointer moves",
  started: "Session start",
  firstInteraction: "First interaction",
  timeOnPage: "Time on page"
};

// descriptions of keys
var DESCRIPTIONS = {
  userAgent: "String the browser sends to identify itself.",
  language: "Primary language you set in the browser.",
  languages: "All languages the browser reported it can use.",
  platform: "Operating system / platform string.",
  timezone: "Local time zone from your system.",
  viewport: "Current size of the browser window.",
  screen: "Full resolution of your device screen.",
  pixelRatio: "How many device pixels per CSS pixel.",
  colorDepth: "Bits used to show colors.",
  orientation: "What the device says the screen orientation is.",
  visibility: "Whether this tab is currently visible.",
  prefersDark: "Theme preference your system/browser exposed.",
  prefersReducedMotion: "If you asked for less animation.",
  deviceMemory: "Approximate RAM amount (coarse).",
  hardwareConcurrency: "CPU threads the browser exposes.",
  doNotTrack: "If you asked sites not to track you.",
  cookieEnabled: "Whether the browser accepts cookies.",
  online: "If the browser thinks it has a connection.",
  referrer: "The page you came from (can be empty).",
  path: "The exact path and query for this page.",
  historyLength: "How many steps this tab can go back.",
  connectionType: "Network quality guess.",
  downlink: "Estimated downstream speed.",
  rtt: "Estimated round-trip time.",
  storageUsed: "Rough storage used for this origin.",
  storageQuota: "Max storage this origin can use.",
  exposure: "How far you scrolled this document.",
  clicks: "Click events seen this session.",
  moves: "Pointer move events seen this session.",
  started: "When this page view began.",
  firstInteraction: "When you first did something here.",
  timeOnPage: "How long this tab has kept this page open (not across sites)."
};

// tooltips
var tooltip = document.createElement("div");
tooltip.className = "df-tooltip";
document.body.appendChild(tooltip);

function showTooltip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.left = String(x + 12) + "px";
  tooltip.style.top = String(y + 12) + "px";
  tooltip.style.opacity = 1;
}

function hideTooltip() {
  tooltip.style.opacity = 0;
}

// data grid
var dataGrid = document.getElementById("data-grid");

function renderData() {
  dataGrid.innerHTML = "";
  Object.entries(meta).forEach(function (entry) {
    var key = entry[0];
    var value = entry[1];

    if (HIDDEN_KEYS.indexOf(key) !== -1) {
      return;
    }

    if (value === null || typeof value === "undefined") {
      return;
    }

    var card = document.createElement("div");
    card.className = "data-card";
    var label = LABELS[key] ? LABELS[key] : key;
    var desc = DESCRIPTIONS[key] ? DESCRIPTIONS[key] : "No description.";
    card.setAttribute("data-key", key);
    card.setAttribute("data-desc", desc);
    card.innerHTML =
      '<div class="data-label">' + label + "</div>" +
      '<div class="data-value" data-key="' + key + '">' + value + "</div>";
    dataGrid.appendChild(card);
  });
}

// update single field
function updateDataField(key, value) {
  var element = document.querySelector('.data-value[data-key="' + key + '"]');
  if (element) {
    element.textContent = value;
  } else {
    renderData();
  }
}

renderData();

// event listeners for tooltips
dataGrid.addEventListener("mousemove", function (event) {
  var card = event.target.closest(".data-card");
  if (!card) {
    hideTooltip();
    return;
  }
  var desc = card.getAttribute("data-desc");
  if (desc) {
    showTooltip(desc, event.clientX, event.clientY);
  }
});

dataGrid.addEventListener("mouseleave", function () {
  hideTooltip();
});

// storage estimate
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(function (info) {
    meta.storageUsed = String(Math.round(info.usage / 1024 / 1024)) + " MB";
    meta.storageQuota = String(Math.round(info.quota / 1024 / 1024)) + " MB";
    renderData();
    renderProfile();
  });
}

// connection changes
if (navigator.connection) {
  navigator.connection.addEventListener("change", function () {
    meta.connectionType = navigator.connection.effectiveType ? navigator.connection.effectiveType : "unknown";
    meta.downlink = navigator.connection.downlink ? String(navigator.connection.downlink) + " Mbps" : "n/a";
    meta.rtt = navigator.connection.rtt ? String(navigator.connection.rtt) + " ms" : "n/a";
    updateDataField("connectionType", meta.connectionType);
    updateDataField("downlink", meta.downlink);
    updateDataField("rtt", meta.rtt);
    renderProfile();
  });
}

// visibility change
document.addEventListener("visibilitychange", function () {
  meta.visibility = document.visibilityState;
  updateDataField("visibility", meta.visibility);
  renderProfile();
});

// visualization canvas for the surface
var vizCanvas = document.getElementById("data-viz");
var vctx = vizCanvas ? vizCanvas.getContext("2d") : null;

function updateVizKeys(signalRaw, surfaceRaw, machineRaw) {
  var kSignal = document.getElementById("key-signal");
  var kSurface = document.getElementById("key-surface");
  var kMachine = document.getElementById("key-machine");

  if (kSignal) {
    kSignal.querySelector(".vk-value").textContent = String(signalRaw);
  }
  if (kSurface) {
    kSurface.querySelector(".vk-value").textContent = String(surfaceRaw) + "%";
  }
  if (kMachine) {
    kMachine.querySelector(".vk-value").textContent = String(machineRaw);
  }
}

// setup canvas for high-DPI
function setupVizCanvas() {
  if (!vizCanvas || !vctx) {
    return;
  }
  var dpr = window.devicePixelRatio || 1;
  var rect = vizCanvas.getBoundingClientRect();
  vizCanvas.width = rect.width * dpr;
  vizCanvas.height = rect.height * dpr;
  vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// draw visualization
function drawViz() {
  if (!vizCanvas || !vctx) {
    return;
  }

  var rect = vizCanvas.getBoundingClientRect();
  var w = rect.width;
  var h = rect.height;
  vctx.clearRect(0, 0, w, h);

  var signalRaw = meta.clicks + Math.floor(meta.moves / 25);
  var signal = signalRaw / 120;
  if (signal > 1) {
    signal = 1;
  }

  var surfaceRaw = parseInt(meta.exposure, 10);
  if (isNaN(surfaceRaw)) {
    surfaceRaw = 0;
  }
  var surface = surfaceRaw / 100;
  if (surface > 1) {
    surface = 1;
  }

  var mem = meta.deviceMemoryRaw ? meta.deviceMemoryRaw : 1;
  var cores = meta.hardwareConcurrencyRaw ? meta.hardwareConcurrencyRaw : 1;
  var machineRaw = cores * mem;
  var machine = machineRaw / 24;
  if (machine > 1) {
    machine = 1;
  }

  var cx = w * 0.3;
  var cy = h * 0.55;
  var baseR = Math.min(w, h) * 0.36;

  var axes = [
    { name: "Signal", value: signal, angle: -Math.PI / 2 },
    { name: "Surface", value: surface, angle: -Math.PI / 2 + (2 * Math.PI) / 3 },
    { name: "Machine", value: machine, angle: -Math.PI / 2 + (4 * Math.PI) / 3 }
  ];

  // base Form (pyramide)
  vctx.strokeStyle = "rgba(249,225,167,0.03)";
  vctx.lineWidth = 1;
  vctx.beginPath();
  axes.forEach(function (axis, index) {
    var x = cx + Math.cos(axis.angle) * baseR;
    var y = cy + Math.sin(axis.angle) * baseR;
    if (index === 0) {
      vctx.moveTo(x, y);
    } else {
      vctx.lineTo(x, y);
    }
  });
  vctx.closePath();
  vctx.stroke();

  // active form
  vctx.beginPath();
  axes.forEach(function (axis, index) {
    var r = baseR * (0.25 + axis.value * 0.75);
    var x = cx + Math.cos(axis.angle) * r;
    var y = cy + Math.sin(axis.angle) * r;
    if (index === 0) {
      vctx.moveTo(x, y);
    } else {
      vctx.lineTo(x, y);
    }
  });
  vctx.closePath();
  vctx.fillStyle = "rgba(249,225,167,0.18)";
  vctx.fill();
  vctx.strokeStyle = "rgba(249,225,167,0.7)";
  vctx.lineWidth = 1.4;
  vctx.stroke();

  // legend
  vctx.font = "10px system-ui";
  axes.forEach(function (axis) {
    var x = cx + Math.cos(axis.angle) * (baseR + 16);
    var y = cy + Math.sin(axis.angle) * (baseR + 16);
    vctx.fillStyle = "rgba(239,239,239,0.7)";
    vctx.fillText(axis.name, x - 14, y + 3);
  });

  // graphic name (middle)
  vctx.fillStyle = "rgba(239,239,239,0.35)";
  vctx.font = "11px system-ui";
  vctx.textAlign = "center";
  vctx.fillText("session shape", cx, cy - 6);
  vctx.textAlign = "start";

  updateVizKeys(signalRaw, surfaceRaw, machineRaw);
}

setupVizCanvas();
drawViz();

// interaction tracking
function markFirstInteraction() {
  if (!meta.firstInteraction) {
    meta.firstInteraction = new Date().toISOString();
    updateDataField("firstInteraction", meta.firstInteraction);
    renderProfile();
  }
}

window.addEventListener("click", function () {
  meta.clicks = meta.clicks + 1;
  markFirstInteraction();
  updateDataField("clicks", meta.clicks);
  drawViz();
  renderProfile();
});

window.addEventListener("mousemove", function () {
  meta.moves = meta.moves + 1;
  markFirstInteraction();
  if (meta.moves % 25 === 0) {
    updateDataField("moves", meta.moves);
    drawViz();
    renderProfile();
  }
});

window.addEventListener("scroll", function () {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  var ratio;
  if (max > 0) {
    ratio = (window.scrollY / max) * 100;
  } else {
    ratio = 100;
  }
  meta.exposure = String(Math.round(ratio)) + "%";
  updateDataField("exposure", meta.exposure);
  drawViz();
  renderProfile();
});

window.addEventListener("resize", function () {
  meta.viewport = String(window.innerWidth) + " x " + String(window.innerHeight);
  updateDataField("viewport", meta.viewport);
  setupVizCanvas();
  drawViz();
  resizeEye();
  renderProfile();
});

window.addEventListener("online", function () {
  meta.online = "online";
  updateDataField("online", meta.online);
  renderProfile();
});

window.addEventListener("offline", function () {
  meta.online = "offline";
  updateDataField("online", meta.online);
  renderProfile();
});

// time spent on page
setInterval(function () {
  meta.timeOnPageSeconds = meta.timeOnPageSeconds + 1;
  var secs = meta.timeOnPageSeconds;
  var mins = Math.floor(secs / 60);
  var rem = secs % 60;
  if (mins > 0) {
    meta.timeOnPage = String(mins) + "m " + String(rem) + "s";
  } else {
    meta.timeOnPage = String(rem) + "s";
  }
  updateDataField("timeOnPage", meta.timeOnPage);
  renderProfile();
}, 1000);

// hero "saurons" eye
var eyeCanvas = document.getElementById("eye-canvas");
var ectx = eyeCanvas ? eyeCanvas.getContext("2d") : null;
var ew = 0;
var eh = 0;
var ecx = 0;
var ecy = 0;

function resizeEye() {
  if (!eyeCanvas || !ectx) {
    return;
  }
  ew = eyeCanvas.width = window.innerWidth;
  eh = eyeCanvas.height = window.innerHeight;
  ecx = ew / 2;
  ecy = eh / 2;
}
resizeEye();

var mouseX = window.innerWidth / 2;
var mouseY = window.innerHeight / 2;
var targetX = mouseX;
var targetY = mouseY;

window.addEventListener("mousemove", function (event) {
  targetX = event.clientX;
  targetY = event.clientY;
});

function drawEye() {
  if (!ectx) {
    return;
  }

  ectx.clearRect(0, 0, ew, eh);

  mouseX = mouseX + (targetX - mouseX) * 0.12;
  mouseY = mouseY + (targetY - mouseY) * 0.12;

  var vowMode = document.body.classList.contains("vow-broken");
  var speed;
  if (vowMode) {
    speed = 0.002;
  } else {
    speed = 0.001;
  }
  var time = performance.now() * speed;

  // background
  var grad = ectx.createRadialGradient(ecx, ecy, 0, ecx, ecy, Math.max(ew, eh));
  if (vowMode) {
    grad.addColorStop(0, "rgba(80,5,5,1)");
    grad.addColorStop(1, "rgba(5,5,9,0)");
  } else {
    grad.addColorStop(0, "rgba(26,25,38,1)");
    grad.addColorStop(1, "rgba(5,5,9,0)");
  }
  ectx.fillStyle = grad;
  ectx.fillRect(0, 0, ew, eh);

  var eyeW = Math.min(ew * 0.45, 560);
  var eyeH = Math.min(eh * 0.23, 230);

  ectx.save();
  ectx.translate(ecx, ecy);
  ectx.strokeStyle = vowMode ? "rgba(255,80,80,0.8)" : "rgba(249,225,167,0.6)";
  ectx.lineWidth = 2.2;
  ectx.beginPath();
  ectx.moveTo(-eyeW / 2, 0);
  ectx.quadraticCurveTo(0, -eyeH, eyeW / 2, 0);
  ectx.quadraticCurveTo(0, eyeH, -eyeW / 2, 0);
  ectx.stroke();

  var relX = (mouseX - ecx) / (ew * 0.5);
  var relY = (mouseY - ecy) / (eh * 0.5);
  var pupilX = relX * (eyeW * 0.12);
  var pupilY = relY * (eyeH * 0.12);

  // iris
  ectx.beginPath();
  ectx.fillStyle = vowMode ? "rgba(255,50,50,0.25)" : "rgba(249,225,167,0.1)";
  ectx.arc(pupilX, pupilY, 44, 0, Math.PI * 2);
  ectx.fill();

  // pupil
  ectx.beginPath();
  ectx.fillStyle = vowMode ? "rgba(15,0,0,1)" : "rgba(5,5,9,1)";
  ectx.arc(pupilX, pupilY, 15 + Math.sin(time * 1.5) * 2, 0, Math.PI * 2);
  ectx.fill();

  // (Lord of the) Rings
  var i;
  for (i = 0; i < 3; i = i + 1) {
    ectx.beginPath();
    if (vowMode) {
      ectx.strokeStyle = "rgba(255,80,80," + String(0.25 - i * 0.05) + ")";
    } else {
      ectx.strokeStyle = "rgba(249,225,167," + String(0.17 - i * 0.04) + ")";
    }
    var r = 70 + Math.sin(time * 0.6 + i) * 16;
    ectx.arc(pupilX, pupilY, r, 0, Math.PI * 2);
    ectx.stroke();
  }

  ectx.restore();
  requestAnimationFrame(drawEye);
}
drawEye();

// follower eye
var followerCanvas = document.getElementById("follower-eye");
var fctx = followerCanvas ? followerCanvas.getContext("2d") : null;

function drawFollowerEye() {
  if (!fctx) {
    return;
  }
  fctx.clearRect(0, 0, followerCanvas.width, followerCanvas.height);

  var w = followerCanvas.width;
  var h = followerCanvas.height;
  var cx = w / 2;
  var cy = h / 2;
  var eyeW = 90;
  var eyeH = 55;

  fctx.save();
  fctx.translate(cx, cy);
  fctx.strokeStyle = "rgba(255,80,80,0.9)";
  fctx.lineWidth = 2;
  fctx.beginPath();
  fctx.moveTo(-eyeW / 2, 0);
  fctx.quadraticCurveTo(0, -eyeH, eyeW / 2, 0);
  fctx.quadraticCurveTo(0, eyeH, -eyeW / 2, 0);
  fctx.stroke();

  var mx = (targetX / window.innerWidth - 0.5) * 26;
  var my = (targetY / window.innerHeight - 0.5) * 18;

  fctx.beginPath();
  fctx.fillStyle = "rgba(180,0,0,1)";
  fctx.arc(mx, my, 10, 0, Math.PI * 2);
  fctx.fill();

  fctx.restore();

  requestAnimationFrame(drawFollowerEye);
}
drawFollowerEye();

// fix position of following mini eye
function updateFollowerPos() {
  if (!followerCanvas) {
    return;
  }
  followerCanvas.style.transform = "translate(16px, " + String(window.innerHeight * 0.4) + "px)";
}
window.addEventListener("scroll", updateFollowerPos);
window.addEventListener("resize", updateFollowerPos);
updateFollowerPos();

// render user profile summary
function renderProfile() {
  var container = document.getElementById("profile-grid");
  if (!container) {
    return;
  }

  var exposureNum = parseInt(meta.exposure, 10);
  if (isNaN(exposureNum)) {
    exposureNum = 0;
  }
  var signalScore = meta.clicks + Math.floor(meta.moves / 25);
  var hardwareScore = (meta.hardwareConcurrencyRaw || 1) * (meta.deviceMemoryRaw || 1);

  var likelyContext;
  if (exposureNum > 60) {
    likelyContext = "deep scroll / attentive";
  } else {
    likelyContext = "drive-by view";
  }

  var networkMood;
  if (meta.online === "online") {
    networkMood = "present";
  } else {
    networkMood = "intermittent";
  }

  var privacyPosture;
  if (meta.doNotTrack === "1") {
    privacyPosture = "expressed resistance";
  } else {
    privacyPosture = "no explicit resistance";
  }

  container.innerHTML =
    '<div class="profile-card">' +
    "<h3>Session temperament</h3>" +
    "<p>" + likelyContext + "</p>" +
    '<p class="small">exposure: ' + meta.exposure + ", signal: " + signalScore + ", time: " + meta.timeOnPage + "</p>" +
    "</div>" +
    '<div class="profile-card">' +
    "<h3>Machine aura</h3>" +
    "<p>" + (hardwareScore >= 16 ? "high-capacity device" : "ordinary client device") + "</p>" +
    '<p class="small">cores: ' + meta.hardwareConcurrency + ", memory: " + meta.deviceMemory + "</p>" +
    "</div>" +
    '<div class="profile-card">' +
    "<h3>Network stance</h3>" +
    "<p>" + networkMood + "</p>" +
    '<p class="small">connection: ' + meta.connectionType + ", rtt: " + meta.rtt + "</p>" +
    "</div>" +
    '<div class="profile-card">' +
    "<h3>Privacy posture</h3>" +
    "<p>" + privacyPosture + "</p>" +
    '<p class="small">dnt: ' + meta.doNotTrack + ", cookies: " + meta.cookieEnabled + "</p>" +
    "</div>";
}
renderProfile();

// ---- breaking the vow ----
var vowBtn = document.getElementById("break-vow");
var vowBanner = document.getElementById("vow-banner");
var codeSnippet = document.getElementById("code-snippet");
var artDisclaimer = document.getElementById("art-disclaimer");
var watermarkCat = document.getElementById("wm-cat");

var vowBroken = false;

if (vowBtn) {
  vowBtn.addEventListener("click", function () {
    vowBroken = !vowBroken;
    if (vowBroken) {
      document.body.classList.add("vow-broken");
      if (vowBanner) {
        vowBanner.classList.remove("hidden");
      }
      vowBtn.textContent = "🕯️ Restore the vow";
      if (codeSnippet) {
        codeSnippet.textContent =
          "// pseudo for extraction\n" +
          "fetch('/collect', {\n" +
          "  method: 'POST',\n" +
          "  body: JSON.stringify(window.__DF_META__)\n" +
          "});";
      }
      if (artDisclaimer) {
        artDisclaimer.textContent = "This is still only an art simulation. Even in “extraction” mode, no data is sent or stored.";
        artDisclaimer.classList.add("art-disclaimer-emph");
      }
      if (watermarkCat) {
        watermarkCat.textContent = " /\\_/\\\n( X.X )\n > ^ <\n@sweetfamine 2025";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.body.classList.remove("vow-broken");
      if (vowBanner) {
        vowBanner.classList.add("hidden");
      }
      vowBtn.textContent = "⚙️ Break the vow";
      if (codeSnippet) {
        codeSnippet.textContent =
          "// pseudo\n" +
          "const snapshot = window.__DF_META__;\n" +
          "draw(snapshot);";
      }
      if (artDisclaimer) {
        artDisclaimer.textContent = "This is an art simulation. Even if you “break the vow”, this page does not send or store your data.";
        artDisclaimer.classList.remove("art-disclaimer-emph");
      }
      if (watermarkCat) {
        watermarkCat.textContent = " /\\_/\\\n( o.o )\n > ^ <\n@sweetfamine 2025";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}