// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseBand.js
// LAYER: NERVOUS SYSTEM (PULSEBAND v6.3)
// ============================================================================
//
// ROLE:
//   THE NERVOUS SYSTEM — Sensory + Motor + Reflex Layer
//   • Senses: latency, network health, GPU readiness, pacing, stalls
//   • Processes: live + snapshot + GPU performance into a flat mirror
//   • Fires: events to the rest of the OS ("update", "request", "page-toggle")
//   • Controls: GPU warmup + engine init + micro-window activity
//
// CONTRACT:
//   • No backend calls here
//   • No routing logic
//   • No persistence
//   • Pure in-memory nervous system state + events
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PulseBand
// ============================================================================
import { Impulse } from "../lib/Connectors/Impulse.js";

// ============================================================================
// NERVOUS SYSTEM — CORE GPU + SHADOWLAYER IMPORTS
// ============================================================================
import * as PulseGPU from "../pulse-gpu/PulseGPU.js";
import * as Pulse from "./Pulse.js"; // SHADOWLAYER side-effects only

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const NERVOUS_LAYER_ID = "NERVOUS-SYSTEM";
const NERVOUS_LAYER_NAME = "PULSEBAND";
const NERVOUS_LAYER_ROLE = "Sensory + Motor + Reflex Layer";

const NERVOUS_DIAGNOSTICS_ENABLED =
  window?.PULSE_NERVOUS_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const nervousLog = (stage, details = {}) => {
  if (!NERVOUS_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: NERVOUS_LAYER_ID,
      pulseName: NERVOUS_LAYER_NAME,
      pulseRole: NERVOUS_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

nervousLog("NERVOUS_INIT", {});
window.PULSE_LOG = function (...args) {
    try {
        console.log("[PULSE]", ...args);
    } catch (err) {
        console.error("PULSE_LOG failed:", err);
    }
};

// ------------------------------------------------------------
// Utility helpers
// ------------------------------------------------------------
const nowMs = () => Date.now();

const computeNetworkHealthFromLatency = (latencyMs) => {
  if (!Number.isFinite(latencyMs) || latencyMs <= 0) return "Unknown";
  if (latencyMs < 120) return "Excellent";
  if (latencyMs < 250) return "Good";
  if (latencyMs < 500) return "Weak";
  return "Critical";
};

const safeSeconds = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
};

const getSafeTimestamp = (status) => {
  if (status.lastSyncTimestamp != null) return status.lastSyncTimestamp;
  if (status.lastSyncSeconds != null)
    return nowMs() - status.lastSyncSeconds * 1000;
  return nowMs();
};

// ------------------------------------------------------------
// PulseBand v6 — Engine State (NERVOUS SYSTEM STATE)
// ------------------------------------------------------------
export const pulseband = {
  listeners: {},

  gpu: {
    ready: false,
    packages: null
  },

  engine: {
    initialized: false,
    pageEnabled: true,
    globalEnabled: true
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

    // Flat mirror — nervous system summary
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

  // ------------------------------------------------------------
  // GPU Brain Init — Motor Cortex Warmup
  // ------------------------------------------------------------
  async initGraphics(rawAssets) {
    window.PULSE_LOG("PulseBand → initGraphics() called");
    nervousLog("GPU_INIT_CALLED");

    try {
      const input = new PulseGPU.BrainInput({
        rawTextures: rawAssets.textures || [],
        rawMeshes: rawAssets.meshes || [],
        rawAnimations: rawAssets.animations || [],
        rawShaders: rawAssets.shaders || [],
        rawScenes: rawAssets.scenes || []
      });

      const packages = PulseGPU.PulseGPUBrainExport.buildAndStore(input);

      window.PULSE_LOG("PulseBand → GPU Brain ready");
      console.log("[PulseBand] GPU Brain ready:", packages);

      this.gpu.packages = packages;
      this.gpu.ready = !!packages;

      nervousLog("GPU_INIT_READY", { gpuReady: this.gpu.ready });

    } catch (err) {
      window.PULSE_LOG("PulseBand → GPU Brain FAILED");
      console.error("[PulseBand] GPU Brain failed:", err);
      this.gpu.ready = false;

      nervousLog("GPU_INIT_FAILED", { error: String(err) });
    }
  },

  // ------------------------------------------------------------
  // Engine Init — Nervous System Boot
  // ------------------------------------------------------------
  async initEngine() {
    if (this.engine.initialized) {
      window.PULSE_LOG("PulseBand → initEngine() skipped (already initialized)");
      nervousLog("ENGINE_INIT_SKIPPED", { initialized: true });
      return;
    }

    window.PULSE_LOG("PulseBand → Initializing engine…");
    nervousLog("ENGINE_INIT_START");
    this.engine.initialized = true;

    this.setStatus({
      live: {
        latency: 1,
        networkHealth: "Excellent",
        latencyClass: "Excellent",
        state: "Warm",
        route: "Pulse"
      }
    });

    window.PULSE_LOG("PulseBand → Engine ready");
    nervousLog("ENGINE_INIT_READY", { initialized: true });
  },

  // ------------------------------------------------------------
  // Page Toggle — Local Nervous System Enable/Disable
  // ------------------------------------------------------------
  enableForPage() {
    window.PULSE_LOG("PulseBand → Page enabled");
    nervousLog("PAGE_ENABLE");
    this.engine.pageEnabled = true;
    this.emit("page-toggle", { pageEnabled: true });
  },

  disableForPage() {
    window.PULSE_LOG("PulseBand → Page disabled");
    nervousLog("PAGE_DISABLE");
    this.engine.pageEnabled = false;
    this.emit("page-toggle", { pageEnabled: false });
  },

  isPageEnabled() {
    return !!this.engine.pageEnabled;
  },

  // ------------------------------------------------------------
  // Status API — Nervous System Snapshot
  // ------------------------------------------------------------
  getStatus() {
    const status = {
      ...this.state,
      live: { ...this.state.live },
      snapshot: { ...this.state.snapshot }
    };

    status.safeTimestamp = getSafeTimestamp(status);
    status.gpuReady = this.gpu.ready;
    status.gpuPerformance = { ...this.state.gpuPerformance };
    status.engine = { ...this.engine };

    return status;
  },
  // ------------------------------------------------------------
  // IMPULSE FIRING — Nervous System → Impulse Traveler
  // ------------------------------------------------------------
  fireImpulse(intent, payload = {}) {
    nervousLog("IMPULSE_FIRE", { intent });

    // Create the traveler
    const impulse = Impulse.create(intent, payload);

    // Route to first layer (PulseNet or whichever is first)
    if (window.PulseNet?.onImpulse) {
      window.PulseNet.onImpulse(impulse);
    }

    return impulse;
  },

  // ------------------------------------------------------------
  // IMPULSE RETURN — Traveler → Nervous System
  // ------------------------------------------------------------
  receiveImpulseReturn(impulse) {
    nervousLog("IMPULSE_RETURN_RECEIVED", {
      tickId: impulse.tickId,
      hops: impulse.path.length
    });

    // Emit event so UI or miner can react
    this.emit("impulse-return", impulse);
  },
  // ------------------------------------------------------------
  // setStatus — NERVOUS SYSTEM PULSE
  // ------------------------------------------------------------
  setStatus(newState) {
    window.PULSE_LOG("PulseBand → setStatus()");
    nervousLog("SET_STATUS_CALLED");

    const now = nowMs();
    const clean = {};

    for (const k in newState) {
      if (newState[k] !== undefined && newState[k] !== null) clean[k] = newState[k];
    }

    // GPU auto-init
    if (!this.gpu.ready && clean.gpuAssets) {
      window.PULSE_LOG("PulseBand → GPU auto-init triggered");
      nervousLog("GPU_AUTO_INIT");
      this.initGraphics(clean.gpuAssets);
    }

    // LIVE merge — sensory input
    if (clean.live) {
      window.PULSE_LOG("PulseBand → LIVE merge");
      nervousLog("LIVE_MERGE", { keys: Object.keys(clean.live || {}) });

      const L = clean.live;
      const latency = L.latency ?? this.state.live.latency ?? 0;

      this.state.live = {
        ...this.state.live,
        ...L,
        latency,
        networkHealth: computeNetworkHealthFromLatency(latency),
        latencyClass:
          latency <= 0 ? "Unknown" :
          latency < 80 ? "Excellent" :
          latency < 150 ? "Good" :
          latency < 300 ? "Weak" : "Critical",
        microWindowActive:
          L.microWindowActive ??
          (now - (this.state.live.lastUpdateTimestamp || 0) < 5000),
        lastUpdateTimestamp: now
      };
    }

    // SNAPSHOT merge — short-term memory
    if (clean.snapshot) {
      window.PULSE_LOG("PulseBand → SNAPSHOT merge");
      nervousLog("SNAPSHOT_MERGE", { keys: Object.keys(clean.snapshot || {}) });

      this.state.snapshot = {
        ...this.state.snapshot,
        ...clean.snapshot,
        lastUpdateTimestamp: now
      };
    }

    // Flat mirror update — nervous system summary
    window.PULSE_LOG("PulseBand → Flat mirror update");

    const L = this.state.live;
    const S = this.state.snapshot;

    this.state.latency = L.latency;
    this.state.latencyClass = L.latencyClass;
    this.state.networkHealth = L.networkHealth;
    this.state.microWindowActive = L.microWindowActive;

    this.state.lastSyncTimestamp = L.lastSyncTimestamp;
    this.state.lastSyncSeconds =
      L.lastSyncTimestamp ? Math.floor((now - L.lastSyncTimestamp) / 1000) : 0;

    this.state.route = L.route;
    this.state.state = L.state;
    this.state.efficiency = L.efficiency;
    this.state.efficiencyMode = L.efficiencyMode;
    this.state.phoneKbps = L.phoneKbps;
    this.state.appKbps = L.appKbps;

    this.state.pulsebandBars = L.pulsebandBars;
    this.state.phoneBars = L.phoneBars;

    this.state.advantage = S.advantage;
    this.state.timeSaved = S.timeSaved;

    this.state.gpuReady = this.gpu.ready;
    this.state.gpuPerformance.warm = this.gpu.ready;

    window.PULSE_LOG("PulseBand → emit(update)");
    nervousLog("EMIT_UPDATE");
    this.emit("update", this.getStatus());
  },

  // ------------------------------------------------------------
  // Events — Neural Firing
  // ------------------------------------------------------------
  on(event, callback) {
    window.PULSE_LOG(`PulseBand → on(${event})`);
    nervousLog("EVENT_SUBSCRIBE", { event });
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    window.PULSE_LOG(`PulseBand → emit(${event})`);
    nervousLog("EVENT_EMIT", { event });
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  },

  // ------------------------------------------------------------
  // PulseCache Request Helper — Signal Request/Response
  // ------------------------------------------------------------
  _request(type, extra = {}) {
    window.PULSE_LOG(`PulseBand → _request(${type})`);
    nervousLog("REQUEST_START", { type });

    return new Promise((resolve, reject) => {
      try {
        const sessionId = type + "_" + Date.now();
        this.emit("request", { type, sessionId, ...extra });
        this.on("response:" + sessionId, (payload) => {
          nervousLog("RESPONSE_RECEIVED", { type, sessionId });
          resolve(payload);
        });
      } catch (err) {
        window.PULSE_LOG("PulseBand → _request FAILED");
        nervousLog("REQUEST_FAILED", { type, error: String(err) });
        reject(err);
      }
    });
  }
};

// ------------------------------------------------------------
// GPU + Engine Warmup — Nervous System Boot on DOM Ready
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  window.PULSE_LOG("PulseBand → DOM ready — warming up…");
  nervousLog("DOM_READY");

  await pulseband.initGraphics({
    textures: [],
    meshes: [],
    animations: [],
    shaders: [],
    scenes: []
  });

  await pulseband.initEngine();

  window.PULSE_LOG("PulseBand → Warmup complete");
  nervousLog("WARMUP_COMPLETE");
});
