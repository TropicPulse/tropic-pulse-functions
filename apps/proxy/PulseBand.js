// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseBand.js
// LAYER: NERVOUS SYSTEM (PULSEBAND v7.1+)
// ============================================================================
//
// ROLE (v7.1+):
//   THE NERVOUS SYSTEM — Sensorimotor Integration Layer
//   • Senses: latency, network health, GPU readiness, pacing, stalls
//   • Integrates: live + snapshot + GPU performance into a unified neural mirror
//   • Fires: impulses + reflex events to the rest of the OS
//   • Controls: GPU warmup, engine init, micro-window activity
//   • Adapts: online/local connectivity modes
//
// CONTRACT (v7.1+):
//   • No backend calls
//   • No routing logic
//   • No persistence
//   • Pure in-memory nervous system state + events
//   • Fully AND-architecture compliant
//
// SAFETY (v7.1+):
//   • v7.1+ upgrade is COMMENTAL + ENV-SAFETY ONLY — NO LOGIC REMOVALS
//   • All prior behavior remains intact; only additive capabilities
//   • Explicit support for LOCAL-ONLY / OFFLINE nervous operation
// ============================================================================

import { Impulse } from "./Impulse.js";

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
const NERVOUS_LAYER_ROLE = "Sensorimotor Integration Layer";

let logger = {
  log: () => {},
  warn: () => {},
  error: () => {}
};

const NERVOUS_DIAGNOSTICS_ENABLED =
  (typeof window !== "undefined" && window?.PULSE_NERVOUS_DIAGNOSTICS === true) ||
  (typeof window !== "undefined" && window?.PULSE_DIAGNOSTICS === true);

const nervousLog = (stage, details = {}) => {
  if (!NERVOUS_DIAGNOSTICS_ENABLED) return;

  logger.log(
    JSON.stringify({
      pulseLayer: NERVOUS_LAYER_ID,
      pulseName: NERVOUS_LAYER_NAME,
      pulseRole: NERVOUS_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

export function initPulseBand(options = {}) {
  if (options.logger) {
    logger = options.logger;
  }

  nervousLog("NERVOUS_INIT", {});  // NOW SAFE
}


// ============================================================================
// GLOBAL DEBUG HOOK (SAFE)
// ============================================================================
if (typeof window !== "undefined") {
  window.PULSE_LOG = function (...args) {
    try {
      logger.log("[PULSE]", ...args);
    } catch (err) {
      logger.error("PULSE_LOG failed:", err);
    }
  };
}


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
// PulseBand v7 — Engine State (NERVOUS SYSTEM STATE)
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

  // NEW v7.0: explicit connectivity + mode (online/local/auto)
  connectivity: {
    mode: "auto",          // "auto" | "online" | "local"
    online: true,          // last known online/offline flag
    source: "unknown"      // "browser", "manual", "inferred"
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
    timeSaved: 0,

    // NEW v7.0: connectivity mirror
    connectivityMode: "auto", // mirrors connectivity.mode
    online: true              // mirrors connectivity.online
  },

  // ------------------------------------------------------------
  // GPU Brain Init — Motor Cortex Warmup
  // ------------------------------------------------------------
  async initGraphics(rawAssets) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → initGraphics() called");
    }
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

      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU Brain ready");
      }
      log("[PulseBand] GPU Brain ready:", packages);

      this.gpu.packages = packages;
      this.gpu.ready = !!packages;

      nervousLog("GPU_INIT_READY", { gpuReady: this.gpu.ready });

    } catch (err) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU Brain FAILED");
      }
      error("[PulseBand] GPU Brain failed:", err);
      this.gpu.ready = false;

      nervousLog("GPU_INIT_FAILED", { error: String(err) });
    }
  },

  // ------------------------------------------------------------
  // Engine Init — Nervous System Boot
  // ------------------------------------------------------------
  async initEngine() {
    if (this.engine.initialized) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → initEngine() skipped (already initialized)");
      }
      nervousLog("ENGINE_INIT_SKIPPED", { initialized: true });
      return;
    }

    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Initializing engine…");
    }
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

    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Engine ready");
    }
    nervousLog("ENGINE_INIT_READY", { initialized: true });
  },
  // ------------------------------------------------------------
  // Page Toggle — Local Nervous System Enable/Disable
  // ------------------------------------------------------------
  enableForPage() {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Page enabled");
    }
    nervousLog("PAGE_ENABLE");
    this.engine.pageEnabled = true;
    this.emit("page-toggle", { pageEnabled: true });
  },

  disableForPage() {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Page disabled");
    }
    nervousLog("PAGE_DISABLE");
    this.engine.pageEnabled = false;
    this.emit("page-toggle", { pageEnabled: false });
  },

  isPageEnabled() {
    return !!this.engine.pageEnabled;
  },

  // ------------------------------------------------------------
  // NEW v7.0 — Connectivity Mode + Local/Online Awareness
  // ------------------------------------------------------------
  setConnectivityMode(mode) {
    // mode: "auto" | "online" | "local"
    if (!["auto", "online", "local"].includes(mode)) return;

    this.connectivity.mode = mode;
    this.state.connectivityMode = mode;

    nervousLog("CONNECTIVITY_MODE_SET", { mode });
    this.emit("connectivity-mode-change", { mode });
  },

  setConnectivity({ online, source = "manual" } = {}) {
    if (typeof online !== "boolean") return;

    this.connectivity.online = online;
    this.connectivity.source = source;
    this.state.online = online;

    nervousLog("CONNECTIVITY_STATE_SET", {
      online,
      source
    });

    this.emit("connectivity-change", {
      online,
      source,
      mode: this.connectivity.mode
    });
  },

  inferConnectivityFromBrowser() {
    if (typeof navigator === "undefined") return;

    const online = !!navigator.onLine;
    this.setConnectivity({ online, source: "browser" });
  },

  isLocalOnly() {
    return this.connectivity.mode === "local";
  },

  // ------------------------------------------------------------
  // v7.4 — PulseNet + Mesh Integration (Pulse-Once Organ)
  // ------------------------------------------------------------
  pulseStatus: {
    lastPulseTs: null,
    lastPulseOk: false,
    lastError: null
  },

  onPulseSuccess(payload = {}) {
    this.pulseStatus.lastPulseTs = Date.now();
    this.pulseStatus.lastPulseOk = true;
    this.pulseStatus.lastError = null;

    // A successful pulse means we had some path online
    this.setConnectivity({ online: true, source: "pulse" });

    this.emit("pulse-success", {
      ts: this.pulseStatus.lastPulseTs,
      payload
    });
  },

  onPulseFailure(reason = "unknown") {
    this.pulseStatus.lastPulseTs = Date.now();
    this.pulseStatus.lastPulseOk = false;
    this.pulseStatus.lastError = reason;

    // Do NOT force offline; mesh / cached path may still exist
    this.emit("pulse-failure", {
      ts: this.pulseStatus.lastPulseTs,
      reason
    });
  },

  estimateMeshReach() {
    // Placeholder for native / PulseMesh integration
    return {
      hops: 0,
      estimatedMeters: 0,
      mode: "direct"
    };
  },

  async requestPulse(deviceId) {
    if (!window?.PulseNet?.pulseOnce) {
      warn("[PulseBand] PulseNet not available");
      return { ok: false, reason: "no-pulsenet" };
    }

    const res = await window.PulseNet.pulseOnce(deviceId);

    if (res.ok) {
      this.onPulseSuccess(res.payload);
    } else {
      this.onPulseFailure(res.error || res.reason);
    }

    return res;
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

    // v7.0: expose connectivity mirror
    status.connectivity = {
      mode: this.connectivity.mode,
      online: this.connectivity.online,
      source: this.connectivity.source
    };

    // v7.4: expose pulse status
    status.pulseStatus = { ...this.pulseStatus };

    return status;
  },

  // ------------------------------------------------------------
  // IMPULSE FIRING — Nervous System → Impulse Traveler
  // ------------------------------------------------------------
  fireImpulse(intent, payload = {}) {
    nervousLog("IMPULSE_FIRE", { intent });

    const impulse = Impulse.create(intent, payload);

    if (typeof window !== "undefined" && window.PulseNet?.onImpulse) {
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

    this.emit("impulse-return", impulse);
  },

  // ------------------------------------------------------------
  // setStatus — NERVOUS SYSTEM PULSE
  // ------------------------------------------------------------
  setStatus(newState) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → setStatus()");
    }
    nervousLog("SET_STATUS_CALLED");

    const now = nowMs();
    const clean = {};

    for (const k in newState) {
      if (newState[k] !== undefined && newState[k] !== null) clean[k] = newState[k];
    }

    // GPU auto-init
    if (!this.gpu.ready && clean.gpuAssets) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU auto-init triggered");
      }
      nervousLog("GPU_AUTO_INIT");
      this.initGraphics(clean.gpuAssets);
    }

    // LIVE merge — sensory input
    if (clean.live) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → LIVE merge");
      }
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
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → SNAPSHOT merge");
      }
      nervousLog("SNAPSHOT_MERGE", { keys: Object.keys(clean.snapshot || {}) });

      this.state.snapshot = {
        ...this.state.snapshot,
        ...clean.snapshot,
        lastUpdateTimestamp: now
      };
    }

    // Flat mirror update — nervous system summary
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Flat mirror update");
    }

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

    // v7.0: keep connectivity mirror in sync
    this.state.connectivityMode = this.connectivity.mode;
    this.state.online = this.connectivity.online;

    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → emit(update)");
    }
    nervousLog("EMIT_UPDATE");
    this.emit("update", this.getStatus());
  },


  // ------------------------------------------------------------
  // Events — Neural Firing
  // ------------------------------------------------------------
  on(event, callback) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG(`PulseBand → on(${event})`);
    }
    nervousLog("EVENT_SUBSCRIBE", { event });
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG(`PulseBand → emit(${event})`);
    }
    nervousLog("EVENT_EMIT", { event });
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  },

  // ------------------------------------------------------------
  // PulseCache Request Helper — Signal Request/Response
  // ------------------------------------------------------------
  _request(type, extra = {}) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG(`PulseBand → _request(${type})`);
    }
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
        if (typeof window !== "undefined" && window.PULSE_LOG) {
          window.PULSE_LOG("PulseBand → _request FAILED");
        }
        nervousLog("REQUEST_FAILED", { type, error: String(err) });
        reject(err);
      }
    });
  }
};

// ------------------------------------------------------------
// GPU + Engine Warmup — Nervous System Boot on DOM Ready
// ------------------------------------------------------------
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → DOM ready — warming up…");
    }
    nervousLog("DOM_READY");

    // v7.0: infer connectivity once at boot (optional, non-blocking)
    if (typeof navigator !== "undefined") {
      pulseband.inferConnectivityFromBrowser();
    }

    await pulseband.initGraphics({
      textures: [],
      meshes: [],
      animations: [],
      shaders: [],
      scenes: []
    });

    await pulseband.initEngine();

    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → Warmup complete");
    }
    nervousLog("WARMUP_COMPLETE");
  });
}
