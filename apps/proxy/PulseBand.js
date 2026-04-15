// ======================================================
// PulseBand.js — PulseBand v3 (GPU + UI Only)
// ======================================================

import { BrainInput, PulseGPUBrainExport} from "../../pulse-gpu/PulseGPUBrain.js";
// ⭐ NEW — GPU Runtime + Engine imports (frontend only)
import { PulseGPURuntime } from "./PulseGPURuntime.js";
import { PulseGPUEngine } from "./PulseGPUEngine.js";
import { PulseMarketplaceClient } from "./PulseMarketplaceClient.js";
// ======================================================
// PulseBand Compute Loop
// ======================================================

async function startPulseBandComputeLoop(marketplace) {
  console.log("⚡ PulseBand Compute Loop Started");

  // 1. Register device once
  const reg = await marketplace.register();
  console.log("Registered:", reg);

  // 2. Begin infinite compute loop
  while (true) {
    try {
      // ---------------------------------------------
      // Request a job
      // ---------------------------------------------
      const job = await marketplace.requestJob();

      if (!job || job.error) {
        console.warn("No job available, cooling down...");
        await sleep(2000);
        continue;
      }

      console.log("Received job:", job);

      // ---------------------------------------------
      // Run GPU compute
      // ---------------------------------------------
      const result = await PulseGPUEngine.compute(job.payload);

      console.log("GPU result:", result);

      // ---------------------------------------------
      // Submit result
      // ---------------------------------------------
      const submit = await marketplace.submitResult(job.id, result);
      console.log("Submitted:", submit);

      // ---------------------------------------------
      // Sync credits
      // ---------------------------------------------
      const credits = await marketplace.syncCredits();
      console.log("Credits:", credits);

      // Small cooldown to avoid hammering backend
      await sleep(500);

    } catch (err) {
      console.error("Compute loop error:", err);
      await sleep(2000);
    }
  }
}

// Utility sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// =======================================
// ⭐ PulseMinerAPI — v3 Miner Config
// (frontend config; used by PulseUpdate/MinerEngine)
// =======================================
window.PulseMinerAPI = {
  backendUrl: "https://us-central1-tropic-pulse.cloudfunctions.net",

  // PulseBand no longer manages marketplace adapters directly
  // It only talks to the backend via PulseMarketplaceClient
  marketplace: new PulseMarketplaceClient({
    baseUrl: "https://us-central1-tropic-pulse.cloudfunctions.net"
  }),

  capacity: {
    cpu: 1,
    gpu: 0
  },

  idleDelayMs: 1500,
  maxSystemWorkers: 1
};

(function () {

  function nowMs() { return Date.now(); }

  function computeNetworkHealthFromLatency(latencyMs) {
    if (!Number.isFinite(latencyMs) || latencyMs <= 0) return "Unknown";
    if (latencyMs < 120) return "Excellent";
    if (latencyMs < 250) return "Good";
    if (latencyMs < 500) return "Weak";
    return "Critical";
  }

  function formatDuration(seconds) {
    seconds = Math.floor(Number(seconds) || 0);
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m < 60) {
      return `${m}m ${s}s`;
    }
    const h = Math.floor(m / 60);
    const mm = m % 60;
    if (h < 24) {
      return `${h}h ${mm}m`;
    }
    const d = Math.floor(h / 24);
    const hh = h % 24;
    return `${d}d ${hh}h`;
  }

  /* ---------------------------------------------------------
     ⭐ GPU BRAIN INTEGRATION
  --------------------------------------------------------- */
  async function initGPUBrain(raw) {
    try {
      const input = new BrainInput({
        rawTextures: raw.textures || [],
        rawMeshes: raw.meshes || [],
        rawAnimations: raw.animations || [],
        rawShaders: raw.shaders || [],
        rawScenes: raw.scenes || []
      });

      const packages = PulseGPUBrainExport.buildAndStore(input);

      console.log("[PulseBand] GPU Brain packages ready:", packages);

      return packages;
    } catch (err) {
      console.error("[PulseBand] GPU Brain failed:", err);
      return null;
    }
  }

  const pulseband = {
    listeners: {},

    gpu: {
      ready: false,
      packages: null
    },

    /* ---------------------------------------------------------
       OPTIONAL: AUTO-INIT GPU BRAIN
    --------------------------------------------------------- */
    async initGraphics(rawAssets) {
      this.gpu.packages = await initGPUBrain(rawAssets);
      this.gpu.ready = !!this.gpu.packages;
    },

    state: {
      live: {
        pulsebandBars: 0,
        phoneBars: 0,
        latency: 0,
        latencyClass: "Unknown",
        networkHealth: "Unknown",
        microWindowActive: false,
        lastUpdateTimestamp: 0,
        lastSyncTimestamp: null,
        lastSyncSeconds: 0,
        route: "Primary",
        state: "Idle",
        efficiency: 100,
        efficiencyMode: null,
        phoneKbps: 0,
        appKbps: 0
      },

      snapshot: {
        lastChunkKbps: 0,
        lastChunkDurationMs: 0,
        lastChunkSizeKB: 0,
        lastChunkIndex: -1,
        advantage: 1.0,
        timeSaved: 0,
        lastUpdateTimestamp: 0
      },

      gpuPerformance: {
        warm: false,
        smoothness: 0,
        pacing: "Unknown",
        stalls: 0,
        efficiency: 100,
        load: 0
      },

      // Flat view
      latency: 0,
      latencyClass: "Unknown",
      networkHealth: "Unknown",
      microWindowActive: false,
      lastSyncTimestamp: null,
      lastSyncSeconds: 0,
      route: "Primary",
      state: "Idle",
      efficiency: 100,
      efficiencyMode: null,
      phoneKbps: 0,
      appKbps: 0,
      pulsebandBars: 0,
      phoneBars: 0,
      advantage: 1.0,
      timeSaved: 0
    },

    /* ---------------------------------------------------------
       GET STATUS
    --------------------------------------------------------- */
    getStatus() {
      const status = {
        ...this.state,
        live: { ...this.state.live },
        snapshot: { ...this.state.snapshot }
      };
      status.safeTimestamp = getSafeTimestamp(status);

      // Attach GPU Brain readiness
      status.gpuReady = this.gpu?.ready || false;
      status.gpuPerformance = { ...this.state.gpuPerformance };
      return status;
    },

    /* ---------------------------------------------------------
       SET STATUS (v3 merge logic)
    --------------------------------------------------------- */
    setStatus(newState) {
      const now = nowMs();

      // CLEAN INPUT
      const clean = {};
      for (const k in newState) {
        if (newState[k] !== undefined && newState[k] !== null) {
          clean[k] = newState[k];
        }
      }

      /* ---------------------------------------------------------
         ⭐ GPU BRAIN AUTO-INIT (if assets provided)
      --------------------------------------------------------- */
      if (!this.gpu.ready && clean.gpuAssets) {
        this.initGraphics(clean.gpuAssets);   // <-- calls GPU Brain
      }

      /* ---------------------------------------------------------
         v3: LIVE + SNAPSHOT MERGE
      --------------------------------------------------------- */
      if (clean.live) {
        const L = clean.live;

        // Latency
        const latency = L.latency ?? this.state.live.latency ?? 0;

        // Network health
        const networkHealth =
          L.networkHealth ??
          computeNetworkHealthFromLatency(latency);

        // Latency class
        const latencyClass =
          L.latencyClass ??
          (latency <= 0
            ? "Unknown"
            : latency < 80
            ? "Excellent"
            : latency < 150
            ? "Good"
            : latency < 300
            ? "Weak"
            : "Critical");

        // Micro-window (engine wins)
        const microWindowActive =
          L.microWindowActive ??
          (now - (this.state.live.lastUpdateTimestamp || 0) < 5000);

        this.state.live = {
          ...this.state.live,
          ...L,
          latency,
          networkHealth,
          latencyClass,
          microWindowActive,
          lastUpdateTimestamp: now
        };
      }

      if (clean.snapshot) {
        const S = clean.snapshot;

        this.state.snapshot = {
          ...this.state.snapshot,
          ...S,
          lastUpdateTimestamp: now
        };
      }

      /* ---------------------------------------------------------
         FLAT MIRROR (UI uses this)
      --------------------------------------------------------- */
      const L = this.state.live;
      const S = this.state.snapshot;

      this.state.latency = L.latency;
      this.state.latencyClass = L.latencyClass;
      this.state.networkHealth = L.networkHealth;
      this.state.microWindowActive = L.microWindowActive;

      // Sync age
      this.state.lastSyncTimestamp = L.lastSyncTimestamp;
      this.state.lastSyncSeconds =
        L.lastSyncTimestamp ? Math.floor((now - L.lastSyncTimestamp) / 1000) : 0;

      this.state.route = L.route;
      this.state.state = L.state;
      this.state.efficiency = L.efficiency;
      this.state.efficiencyMode = L.efficiencyMode;
      this.state.phoneKbps = L.phoneKbps;
      this.state.appKbps = L.appKbps;

      // Bars
      this.state.pulsebandBars = L.pulsebandBars;
      this.state.phoneBars = L.phoneBars;

      // Snapshot overlays
      this.state.advantage = S.advantage ?? this.state.advantage;
      this.state.timeSaved = S.timeSaved ?? this.state.timeSaved;

      if (clean.gpuPerformance) {
        this.state.gpuPerformance = {
          ...this.state.gpuPerformance,
          ...clean.gpuPerformance
        };
      }

      /* ---------------------------------------------------------
         GPU BRAIN STATUS MIRROR
      --------------------------------------------------------- */
      this.state.gpuReady = this.gpu?.ready || false;
      this.state.gpuPerformance.warm = this.gpu?.ready || false;

      /* ---------------------------------------------------------
         EMIT UPDATE
      --------------------------------------------------------- */
      this.emit("update", this.getStatus());
    },

    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */
    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    },

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((cb) => cb(data));
      }
    }
  };

  window.pulseband = pulseband;

  /* ---------------------------------------------------------
     UNIVERSAL REQUEST HELPER
  --------------------------------------------------------- */
  pulseband._request = function (type, extra = {}) {
    return new Promise((resolve, reject) => {
      try {
        const sessionId = type + "_" + Date.now();
        pulseband.emit("request", { type, sessionId, ...extra });
        pulseband.on("response:" + sessionId, (payload) => resolve(payload));
      } catch (err) {
        reject(err);
      }
    });
  };

  /* ---------------------------------------------------------
     CACHE REQUEST HELPERS (unchanged)
  --------------------------------------------------------- */
  pulseband.requestFullUsersCache = () =>
    pulseband._request("REQUEST_USERS_CACHE");

  pulseband.requestUsersCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_USERS_CACHE_DELTA", { baseVersion });

  pulseband.requestFullBusinessCache = () =>
    pulseband._request("REQUEST_BUSINESS_CACHE");

  pulseband.requestBusinessCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_BUSINESS_CACHE_DELTA", { baseVersion });

  pulseband.requestFullEventsCache = () =>
    pulseband._request("REQUEST_EVENTS_CACHE");

  pulseband.requestEventsCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_EVENTS_CACHE_DELTA", { baseVersion });

  pulseband.requestFullOrdersCache = () =>
    pulseband._request("REQUEST_ORDERS_CACHE");

  pulseband.requestOrdersCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_ORDERS_CACHE_DELTA", { baseVersion });

  pulseband.requestFullHistoryCache = () =>
    pulseband._request("REQUEST_HISTORY_CACHE");

  pulseband.requestHistoryCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_HISTORY_CACHE_DELTA", { baseVersion });

  pulseband.requestFullSettingsCache = () =>
    pulseband._request("REQUEST_SETTINGS_CACHE");

  pulseband.requestSettingsCacheDelta = (baseVersion) =>
    pulseband._request("REQUEST_SETTINGS_CACHE_DELTA", { baseVersion });

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */
  function safeSeconds(v) {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(n);
  }

  function getSafeTimestamp(status) {
    if (status.lastSyncTimestamp != null) return status.lastSyncTimestamp;
    if (status.lastSyncSeconds != null)
      return nowMs() - status.lastSyncSeconds * 1000;
    return nowMs();
  }

  /* ---------------------------------------------------------
    ⭐ BUBBLE UI HOOKS
  --------------------------------------------------------- */
  const bubbleEl = document.getElementById("pulseband-bubble");
  const bubbleSmoothEl = document.getElementById("pulseband-bubble-smooth");
  const bubbleGPUEl = document.getElementById("pulseband-bubble-gpu");
  const bubbleNetworkEl = document.getElementById("pulseband-bubble-network");

  /* ---------------------------------------------------------
   ⭐ BUBBLE UPDATE FUNCTIONS
  --------------------------------------------------------- */
  function updateBubbleSmoothness(status) {
    if (!bubbleSmoothEl) return;
    bubbleSmoothEl.textContent = status.gpuPerformance.smoothness;
  }

  function updateBubbleGPU(status) {
    if (!bubbleGPUEl) return;

    const warm = status.gpuPerformance.warm;
    const load = status.gpuPerformance.load;
    const pacing = status.gpuPerformance.pacing;

    bubbleGPUEl.textContent = warm
      ? `GPU: Warm • ${load}% • ${pacing}`
      : "GPU: Cold";
  }

  function updateBubbleNetwork(status) {
    if (!bubbleNetworkEl) return;

    bubbleNetworkEl.textContent =
      `Net: ${status.networkHealth} • ${status.latency}ms`;
  }

  /* ---------------------------------------------------------
   ⭐ CONNECT BUBBLE TO PULSEBAND UPDATES
  --------------------------------------------------------- */
  pulseband.on("update", (status) => {
    renderBubble(status);
  });

  /* ---------------------------------------------------------
     UI BOOTSTRAP
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const badge = document.getElementById("pulseband-badge");
    const panel = document.getElementById("pulseband-panel");
    const bars = document.querySelectorAll(".pb-bars span");
    const miniBadge = document.getElementById("pb-mini-badge");

    if (!badge || !panel || !bars.length) {
      console.log("⚠️ [PulseBand] UI elements not found; engine will stay passive.");
      return;
    }

    badge.addEventListener("click", () => {
      const isVisible = panel.style.display === "block";
      panel.style.display = isVisible ? "none" : "block";
    });

    updatePulseBandPanelInactive(pulseband.getStatus());

    pulseband.on("update", (s) => {
      updatePulseBandBadge(badge, bars, s);
      updatePulseBandPanelActive(panel, miniBadge, s);
    });
  });

  /* ---------------------------------------------------------
    ⭐ MASTER BUBBLE RENDERER
  --------------------------------------------------------- */
  function renderBubble(status) {
    if (!bubbleEl) return;

    const warm = status.gpuPerformance.warm;
    const health = status.networkHealth;

    bubbleEl.classList.toggle("warm", warm);
    bubbleEl.classList.toggle("excellent", health === "Excellent");
    bubbleEl.classList.toggle("good", health === "Good");
    bubbleEl.classList.toggle("weak", health === "Weak");
    bubbleEl.classList.toggle("critical", health === "Critical");

    updateBubbleSmoothness(status);
    updateBubbleGPU(status);
    updateBubbleNetwork(status);
  }

  function updatePulseBandBadge(badge, bars, s) {
    const L = s.live;
    const pulseBars = L.pulsebandBars || 0;

    bars.forEach((b, i) => {
      if (i < pulseBars) {
        b.classList.add("active");
        b.style.background = "#00ffd5";
      } else {
        b.classList.remove("active");
        b.style.background = "rgba(255,255,255,0.25)";
      }
    });

    const adv = Number(s.snapshot.advantage || 0);
    const isBoost = L.route === "Pulse" || adv >= 3;

    if (isBoost) badge.classList.add("boost");
    else badge.classList.remove("boost");
  }

  function updatePulseBandPanelInactive(s) {
    const L = s.live;

    const bars = document.querySelectorAll(".pb-bars span");
    document.getElementById("pb-bars-text").innerText = L.pulsebandBars + "/4";
    document.getElementById("pb-phonebars-text").innerText = L.phoneBars + "/4";

    bars.forEach((b, i) => {
      b.style.background = i < L.pulsebandBars ? "#00ffd5" : "rgba(255,255,255,0.25)";
      if (i < L.pulsebandBars) b.classList.add("active");
      else b.classList.remove("active");
    });

    const icons = {
      fast: "🚀",
      medium: "⚡",
      slow: "🦥",
      idle: "💤",
      route: "🧭",
      stable: "🌟",
      excellent: "🌈",
      good: "💠",
      weak: "⚠️",
      critical: "🔥",
      gpu: "🎨",
      gpuOn: "🟢",
      gpuOff: "🔴"
    };

    // Stability (NOW)
    document.getElementById("pb-stability").innerHTML =
      `${icons.stable} ${L.networkHealth}`;

    // Latency (NOW)
    document.getElementById("pb-latency").innerHTML =
      `${icons.medium} ${L.latency}ms`;

    // Micro-window (NOW)
    document.getElementById("pb-micro").innerHTML =
      L.microWindowActive ? `${icons.fast} Active` : `${icons.idle} Off`;

    // Route (NOW)
    document.getElementById("pb-route").innerHTML =
      `${icons.route} ${L.route}`;

    // State (NOW)
    document.getElementById("pb-state").innerHTML =
      `${icons.medium} ${L.state}`;

    // Sync age (NOW)
    const ts = L.lastSyncTimestamp ?? (nowMs() - (L.lastSyncSeconds ?? 0) * 1000);
    const lastSync = safeSeconds((nowMs() - ts) / 1000);
    document.getElementById("pb-sync").innerHTML =
      `⏱️ ${formatDuration(lastSync)} ago`;

    // Efficiency (NOW)
    const eff = L.efficiency ?? 100;
    const effIcon =
      eff > 80 ? icons.excellent :
      eff > 50 ? icons.good :
      eff > 20 ? icons.weak :
      icons.critical;

    document.getElementById("pb-efficiency").innerHTML =
      `${effIcon} ${eff.toFixed(0)}%`;

    // Advantage (NOW — always 1.0 here)
    document.getElementById("pb-advantage").innerHTML =
      `${icons.fast} ${(L.advantage ?? 1).toFixed(2)}×`;

    // Estimated time saved (NOW)
    document.getElementById("pb-estimated").innerHTML = "—";

    /* ---------------------------------------------------------
       ⭐ GPU BRAIN STATUS (NOW)
    --------------------------------------------------------- */
    const gpuEl = document.getElementById("pb-gpu-status");
    if (gpuEl) {
      gpuEl.innerHTML = s.gpuReady
        ? `${icons.gpuOn} GPU Ready`
        : `${icons.gpuOff} GPU Offline`;
    }
  }

  function updatePulseBandPanelActive(panel, miniBadge, s) {
    const H = s.snapshot; // THEN
    const L = s.live;     // NOW

    const icons = {
      fast: "🚀",
      medium: "⚡",
      slow: "🦥",
      idle: "💤",
      route: "🧭",
      stable: "🌟",
      excellent: "🌈",
      good: "💠",
      weak: "⚠️",
      critical: "🔥",
      gpu: "🎨",
      gpuOn: "🟢",
      gpuOff: "🔴"
    };

    // Bars (NOW)
    const bars = document.querySelectorAll(".pb-bars span");
    const pulseBars = L.pulsebandBars || 0;

    bars.forEach((b, i) => {
      if (i < pulseBars) {
        b.style.background = "#00ffd5";
        b.classList.add("active");
      } else {
        b.style.background = "rgba(255,255,255,0.25)";
        b.classList.remove("active");
      }
    });

    document.getElementById("pb-bars-text").innerText = pulseBars + "/4";
    document.getElementById("pb-phonebars-text").innerText =
      (L.phoneBars || 0) + "/4";

    // Stability (THEN)
    const stabilityIcon =
      H.networkHealth === "Excellent" ? icons.excellent :
      H.networkHealth === "Good" ? icons.good :
      H.networkHealth === "Weak" ? icons.weak :
      icons.critical;

    document.getElementById("pb-stability").innerHTML =
      `${stabilityIcon} ${H.networkHealth}`;

    // Latency (THEN)
    const latency = H.latency ?? 0;
    const latIcon =
      latency < 80 ? icons.excellent :
      latency < 150 ? icons.good :
      latency < 300 ? icons.weak :
      icons.critical;

    document.getElementById("pb-latency").innerHTML =
      `${latIcon} ${latency}ms`;

    // Micro-window (THEN)
    document.getElementById("pb-micro").innerHTML =
      H.microWindowActive ? `${icons.fast} Active` : `${icons.idle} Off`;

    // Route (NOW)
    document.getElementById("pb-route").innerHTML =
      `${icons.route} ${L.route}`;

    // State (NOW)
    document.getElementById("pb-state").innerHTML =
      `${icons.medium} ${L.state}`;

    // Sync (NOW)
    const ts = L.lastSyncTimestamp ?? (nowMs() - (L.lastSyncSeconds ?? 0) * 1000);
    const lastSync = safeSeconds((nowMs() - ts) / 1000);
    document.getElementById("pb-sync").innerHTML =
      `⏱️ ${formatDuration(lastSync)} ago`;

    // Efficiency (THEN)
    const eff = H.efficiency ?? 0;
    const effIcon =
      eff > 80 ? icons.excellent :
      eff > 50 ? icons.good :
      eff > 20 ? icons.weak :
      icons.critical;

    document.getElementById("pb-efficiency").innerHTML =
      `${effIcon} ${eff.toFixed(0)}%`;

    // Advantage (THEN)
    const adv = H.advantage ?? 1;
    document.getElementById("pb-advantage").innerHTML =
      `${icons.fast} ${adv.toFixed(2)}×`;

    // Estimated time saved (THEN)
    const est = H.timeSaved ?? 0;
    document.getElementById("pb-estimated").innerHTML =
      est > 0 ? `${icons.fast} ${est.toFixed(0)}ms saved` : "—";

    /* ---------------------------------------------------------
       ⭐ GPU BRAIN STATUS (THEN)
    --------------------------------------------------------- */
    const gpuEl = document.getElementById("pb-gpu-status");
    if (gpuEl) {
      gpuEl.innerHTML = s.gpuReady
        ? `${icons.gpuOn} GPU Ready`
        : `${icons.gpuOff} GPU Offline`;
    }
  }
  // ======================================================
// initGPU — Unified GPU Initialization Pipeline (IIFE SAFE)
// ======================================================
async function initGPU(rawAssets = {}) {
  console.log("[initGPU] Starting GPU initialization…");

  const brainInput = new BrainInput({
    textures: rawAssets.textures || [],
    meshes: rawAssets.meshes || [],
    animations: rawAssets.animations || [],
    shaders: rawAssets.shaders || [],
    scenes: rawAssets.scenes || []
  });

  const brain = await PulseGPUBrainExport.init(brainInput);
  console.log("[initGPU] Brain initialized:", brain);

  const runtime = await PulseGPURuntime.init({
    deviceId: PulseGPUBrainExport.deviceId,
    gpuInfo: PulseGPURuntime.getGPUInfo()
  });
  console.log("[initGPU] Runtime initialized:", runtime);

  const engine = await PulseGPUEngine.init({
    brain,
    runtime
  });
  console.log("[initGPU] Engine initialized:", engine);

  return { brain, runtime, engine };
}

// Make available globally if needed
window.initGPU = initGPU;


// ---------------------------------------------------------
// ⭐ WARMUP: GPU + Internet Layer
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[PulseBand] DOM ready — warming up subsystems…");

  await initGPU({
    textures: [],
    meshes: [],
    animations: [],
    shaders: [],
    scenes: []
  });

  pulseband.setStatus({
    live: {
      latency: 1,
      networkHealth: "Excellent",
      latencyClass: "Excellent"
    }
  });

  console.log("[PulseBand] Warmup complete — GPU + Internet ready.");
});


// ---------------------------------------------------------
// ⭐ Marketplace Client
// ---------------------------------------------------------
const marketplace = new PulseMarketplaceClient({
  deviceId: PulseGPUBrainExport.deviceId,
  gpuInfo: PulseGPURuntime.getGPUInfo(),
  baseUrl: "https://tropicpulse.bz/proxy"
});


// ---------------------------------------------------------
// ⭐ Start compute loop
// ---------------------------------------------------------
startPulseBandComputeLoop(marketplace);


})(); // END IIFE — correct position
