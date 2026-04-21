// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseBand.js
// LAYER: NERVOUS SYSTEM (PULSEBAND v7.7)
// ============================================================================
//
// ROLE (v7.7):
//   THE NERVOUS SYSTEM — Sensorimotor Integration Layer
//   • Senses: latency, network health, GPU readiness, pacing, stalls
//   • Integrates: live + snapshot + GPU performance into a unified neural mirror
//   • Fires: impulses + reflex events to the rest of the OS
//   • Controls: GPU warmup, engine init, micro-window activity
//   • Adapts: online/local connectivity modes
//
// CONTRACT (v7.7):
//   • No backend calls
//   • No routing logic
//   • No persistence
//   • Pure in-memory nervous system state + events
//   • Fully AND-architecture compliant
//
// SAFETY (v7.7):
//   • Environment-aware, fail-open guards around window/navigator/PulseNet
//   • No required DOM for core nervous logic
//   • All external integrations are optional and guarded
//   • Deterministic state transitions for same inputs
// ============================================================================

import { Impulse } from "./PulseProxyImpulse.js";

// ============================================================================
// NERVOUS SYSTEM — CORE GPU + SHADOWLAYER IMPORTS
// ============================================================================
import * as PulseGPU from "../pulse-gpu/PulseGPUAstralNervousSystem.js";
import * as Pulse from "./PulseProxyLimbic.js"; // SHADOWLAYER side-effects only

// ============================================================================
// OS‑v7 CONTEXT METADATA — Nervous System Identity
// ============================================================================
const PULSEBAND_CONTEXT = {
  layer: "PulseBand",
  role: "NERVOUS_SYSTEM",
  purpose: "Sensorimotor integration + connectivity + GPU warmup control",
  context:
    "Maintains live/snapshot/gpuPerformance mirrors and fires nervous events",
  target: "full-os",
  version: 7.7,
  selfRepairable: true,
  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true
  }
};

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const NERVOUS_LAYER_ID = "NERVOUS-SYSTEM";
const NERVOUS_LAYER_NAME = "PULSEBAND";
const NERVOUS_LAYER_ROLE = "Sensorimotor Integration Layer";

// Diagnostics must be DYNAMIC — not frozen at load
const diagnosticsEnabled = () =>
  (typeof window !== "undefined" && window.PULSE_NERVOUS_DIAGNOSTICS === true) ||
  (typeof window !== "undefined" && window.PULSE_DIAGNOSTICS === true);

const nervousLog = (stage, details = {}) => {
  if (!diagnosticsEnabled()) return;

  try {
    log(
      JSON.stringify({
        pulseLayer: NERVOUS_LAYER_ID,
        pulseName: NERVOUS_LAYER_NAME,
        pulseRole: NERVOUS_LAYER_ROLE,
        stage,
        ...details
      })
    );
  } catch {
    // diagnostics must never break the nervous system
  }
};

// ============================================================================
// AUTO-START (NO INIT NEEDED) — DIAGNOSTIC ONLY
// ============================================================================
nervousLog("NERVOUS_INIT", { meta: PULSEBAND_CONTEXT });

// ============================================================================
// GLOBAL DEBUG HOOK (SAFE)
// ============================================================================
if (typeof window !== "undefined") {
  window.PULSE_LOG = function (...args) {
    try {
      log("[PULSE]", ...args);
    } catch (err) {
      try {
        error("PULSE_LOG failed:", err);
      } catch {
        // fail-open
      }
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
// PulseBand v7.7 — Engine State (NERVOUS SYSTEM STATE)
// ------------------------------------------------------------
export const pulseband = {
  meta: { ...PULSEBAND_CONTEXT },

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

  connectivity: {
    mode: "auto",
    online: true,
    source: "unknown"
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

    connectivityMode: "auto",
    online: true
  },

  // ------------------------------------------------------------
  // GPU Brain Init — Motor Cortex Warmup
  // ------------------------------------------------------------
  async initGraphics(rawAssets = {}) {
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
      try {
        error("[PulseBand] GPU Brain failed:", err);
      } catch {
        // fail-open
      }
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
  // Connectivity Mode + Local/Online Awareness
  // ------------------------------------------------------------
  setConnectivityMode(mode) {
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
  // PulseNet + Mesh Integration (Pulse-Once Organ)
  // ------------------------------------------------------------
  pulseStatus: {
    lastPulseTs: null,
    lastPulseOk: false,
    lastError: null
  },

  onPulseSuccess(payload = {}) {
    const ts = nowMs();
    this.pulseStatus.lastPulseTs = ts;
    this.pulseStatus.lastPulseOk = true;
    this.pulseStatus.lastError = null;

    this.setConnectivity({ online: true, source: "pulse" });

    this.emit("pulse-success", {
      ts,
      payload
    });
  },

  onPulseFailure(reason = "unknown") {
    const ts = nowMs();
    this.pulseStatus.lastPulseTs = ts;
    this.pulseStatus.lastPulseOk = false;
    this.pulseStatus.lastError = reason;

    this.emit("pulse-failure", {
      ts,
      reason
    });
  },

  estimateMeshReach() {
    return {
      hops: 0,
      estimatedMeters: 0,
      mode: "direct"
    };
  },

  async requestPulse(deviceId) {
    if (typeof window === "undefined" || !window.PulseNet || !window.PulseNet.pulseOnce) {
      try {
        warn("[PulseBand] PulseNet not available");
      } catch {
        // fail-open
      }
      return { ok: false, reason: "no-pulsenet" };
    }

    const res = await window.PulseNet.pulseOnce(deviceId);

    if (res && res.ok) {
      this.onPulseSuccess(res.payload);
    } else {
      this.onPulseFailure(res?.error || res?.reason || "unknown");
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

    status.connectivity = {
      mode: this.connectivity.mode,
      online: this.connectivity.online,
      source: this.connectivity.source
    };

    status.pulseStatus = { ...this.pulseStatus };
    status.meta = { ...PULSEBAND_CONTEXT };

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
    if (!impulse || typeof impulse !== "object") return;

    nervousLog("IMPULSE_RETURN_RECEIVED", {
      tickId: impulse.tickId,
      hops: Array.isArray(impulse.path) ? impulse.path.length : 0
    });

    this.emit("impulse-return", impulse);
  },

  // ------------------------------------------------------------
  // setStatus — NERVOUS SYSTEM PULSE
  // ------------------------------------------------------------
  setStatus(newState = {}) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → setStatus()");
    }
    nervousLog("SET_STATUS_CALLED");

    const now = nowMs();
    const clean = {};

    for (const k in newState) {
      if (Object.prototype.hasOwnProperty.call(newState, k)) {
        if (newState[k] !== undefined && newState[k] !== null) {
          clean[k] = newState[k];
        }
      }
    }

    if (!this.gpu.ready && clean.gpuAssets) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU auto-init triggered");
      }
      nervousLog("GPU_AUTO_INIT");
      this.initGraphics(clean.gpuAssets);
    }

    if (clean.live) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → LIVE merge");
      }
      nervousLog("LIVE_MERGE", { keys: Object.keys(clean.live || {}) });

      const L = clean.live;
      const latency =
        L.latency != null ? L.latency : this.state.live.latency ?? 0;

      const lastUpdatePrev = this.state.live.lastUpdateTimestamp || 0;

      this.state.live = {
        ...this.state.live,
        ...L,
        latency,
        networkHealth: computeNetworkHealthFromLatency(latency),
        latencyClass:
          latency <= 0
            ? "Unknown"
            : latency < 80
            ? "Excellent"
            : latency < 150
            ? "Good"
            : latency < 300
            ? "Weak"
            : "Critical",
        microWindowActive:
          L.microWindowActive ??
          (now - lastUpdatePrev < 5000),
        lastUpdateTimestamp: now
      };
    }

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
      L.lastSyncTimestamp ? safeSeconds((now - L.lastSyncTimestamp) / 1000) : 0;

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
    if (typeof callback !== "function") return;

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

    const handlers = this.listeners[event];
    if (!handlers || handlers.length === 0) return;

    // Deterministic ordering: handlers are invoked in registration order
    for (let i = 0; i < handlers.length; i++) {
      const cb = handlers[i];
      try {
        cb(data);
      } catch {
        // fail-open: nervous system never breaks from a bad listener
      }
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
        const sessionId = type + "_" + nowMs();
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

// NOTE: v7.7 — DOMContentLoaded warmup removed.
// OSKernel v7.7 is now responsible for calling:
//   - pulseband.inferConnectivityFromBrowser()
//   - pulseband.initGraphics(...)
//   - pulseband.initEngine()
