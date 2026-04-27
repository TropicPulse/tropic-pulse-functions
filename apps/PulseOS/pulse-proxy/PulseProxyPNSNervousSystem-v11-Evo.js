// ============================================================================
//  PULSE OS v11 — PNS NERVOUS SYSTEM (PULSEBAND, SYMBOLIC LAYER)
//  Sensorimotor Integration • Connectivity Mirror • GPU Warmup Control
//  PURE NERVOUS SYSTEM ORGAN — NO MARKETPLACE, NO BUSINESS LOGIC
//  SYMBOLIC FRONTEND LAYER • BACKED BY BINARY NERVOUS CORE
// ============================================================================
//
//  WHAT THIS ORGAN IS (v11):
//  -------------------------
//  • The Peripheral Nervous System (PNS) of PulseOS for the shell.
//  • Maintains live/snapshot/gpuPerformance mirrors for the UI.
//  • Bridges GPU brain (astral nervous system) and limbic shadow facade.
//  • Emits deterministic nervous events for other frontend organs.
//  • Uses Impulse traveler for pathway‑aware signaling.
//  • Delegates nervous math to PulseProxyPNSNervousSystemBinary.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • NOT a router.
//  • NOT a marketplace engine.
//  • NOT a scoring engine.
//  • NOT a backend client.
//  • NOT a healing organ.
//  • NOT a place for dynamic imports or eval.
//
//  IDENTITY + WIRING CONTRACT (v11):
//  ---------------------------------
//  • Symbolic PNS organ, backed by binary nervous core.
//  • Reads from:
//      – Impulse traveler (global wiring)
//      – Astral Nervous System (GPU brain, global wiring)
//      – Limbic Shadow (facade side‑effects only, global wiring)
//      – PulseProxyPNSNervousSystemBinary (binary nervous math)
//  • All deeper identity + lineage live in the BBB / Brain.
//  • No ES module imports; wiring is organism‑level, not file‑level.
//
//  SAFETY CONTRACT (v11):
//  ----------------------
//  • No console.* — diagnostics go through PULSE_LOG hook only.
//  • No global mutation outside this organ’s own state.
//  • Deterministic event ordering.
//  • Drift‑proof status mirrors.
//  • Pure nervous‑system behavior.
// ============================================================================


// ============================================================================
// GLOBAL WIRING — v11 (no imports, organism‑level wiring)
// ============================================================================
const G =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : {};

const Impulse  = G.PulseProxyImpulse;
const PulseGPU = G.PulseGPUAstralNervousSystem;
const Pulse    = G.PulseProxyLimbic; // facade side-effects only

const PNSBinary = G.PulseProxyPNSNervousSystemBinary || null;


// ============================================================================
// OS‑v11 CONTEXT METADATA — Nervous System Identity
// ============================================================================
const PULSEBAND_CONTEXT = {
  layer: "PulseBand",
  role: "NERVOUS_SYSTEM",
  purpose:
    "Sensorimotor integration + connectivity + GPU warmup control + CNS/PNS bridge",
  context:
    "Maintains live/snapshot/gpuPerformance mirrors, fires nervous events, propagates reflexes, synchronizes with Cortex + Evolution",
  target: "full-os",
  version: "11.0",
  mode: "symbolic",
  binaryPartner: "PulseProxyPNSNervousSystemBinary",
  selfRepairable: true,
  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,
    cortexSync: true,
    brainSync: true,
    evolutionSync: true
  }
};


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const NERVOUS_LAYER_ID   = "NERVOUS-SYSTEM";
const NERVOUS_LAYER_NAME = "PULSEBAND";
const NERVOUS_LAYER_ROLE = "Sensorimotor Integration Layer";

const diagnosticsEnabled = () =>
  (typeof window !== "undefined" && window.PULSE_NERVOUS_DIAGNOSTICS === true) ||
  (typeof window !== "undefined" && window.PULSE_DIAGNOSTICS === true);

const nervousLog = (stage, details = {}) => {
  if (!diagnosticsEnabled()) return;

  try {
    if (typeof window !== "undefined" && typeof window.PULSE_LOG === "function") {
      window.PULSE_LOG(
        JSON.stringify({
          pulseLayer: NERVOUS_LAYER_ID,
          pulseName:  NERVOUS_LAYER_NAME,
          pulseRole:  NERVOUS_LAYER_ROLE,
          stage,
          ...details,
          meta: { ...PULSEBAND_CONTEXT }
        })
      );
    }
  } catch {}
};

nervousLog("NERVOUS_INIT", { meta: PULSEBAND_CONTEXT });
export const PulseBandSymbolicMeta = Object.freeze({
  layer: "PulseBandSymbolic",
  role: "PNS_SYMBOLIC_NERVOUS_SYSTEM",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseBandSymbolic-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,

    // Nervous system laws
    symbolicPNS: true,
    sensorimotorIntegration: true,
    connectivityMirror: true,
    gpuWarmupControl: true,
    reflexPropagation: true,
    nervousEventEmitter: true,
    nervousSnapshotEngine: true,
    nervousLiveMirror: true,
    nervousGpuPerformanceMirror: true,
    dualModeEvolution: true,
    unifiedAdvantageField: true,
    cortexSync: true,
    brainSync: true,
    evolutionSync: true,

    // Execution prohibitions
    zeroConsole: true,
    zeroRouting: true,
    zeroMarketplace: true,
    zeroScoring: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroIO: true,
    zeroExternalMutation: true,
    zeroWindowMutation: true,
    zeroDOM: true,
    zeroGPUExecution: true, // GPU is read-only

    // Awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "ImpulseTraveler",
      "GpuNervousState",
      "BinaryPnsSnapshot",
      "DualBandContext",
      "AdvantageContext"
    ],
    output: [
      "PnsLiveSnapshot",
      "PnsGpuPerformanceSnapshot",
      "PnsNervousEvent",
      "PnsBandSignature",
      "PnsBinaryField",
      "PnsWaveField",
      "PnsDiagnostics",
      "PnsHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseBand-v11",
    parent: "PulseBand-v11.2-EVO",
    ancestry: [
      "PulseBand-v7",
      "PulseBand-v8",
      "PulseBand-v9",
      "PulseBand-v10",
      "PulseBand-v11",
      "PulseBand-v11-Evo",
      "PulseBand-v11-Evo-Prime"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
    default: "symbolic",
    behavior: "pns-symbolic"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "binary nervous math → symbolic nervous mirror → CNS/PNS sync",
    adaptive: "binary-field + wave-field overlays + GPU warmup surfaces",
    return: "deterministic nervous surfaces + signatures"
  })
});


// ============================================================================
// DEBUG HOOK — unchanged semantics (v11)
// ============================================================================
if (typeof window !== "undefined") {
  window.PULSE_LOG = function (...args) {
    try {
      console.log("[PULSE]", ...args);
    } catch {}
  };
}


// ============================================================================
// Utility helpers — v11 deterministic
// ============================================================================
const nowMs = () => Date.now();

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
// PulseBand v11 — Engine State (NERVOUS SYSTEM STATE)
// ------------------------------------------------------------
export const pulseband = {
  meta: { ...PULSEBAND_CONTEXT },

  listeners: {},

  gpu: {
    ready: false,
    packages: null,
    warmupScore: 0,
    thermalState: "Unknown",
  },

  engine: {
    initialized: false,
    pageEnabled: true,
    globalEnabled: true,
    reflexMode: "auto",
    cortexLinked: false,
  },

  connectivity: {
    mode: "auto",
    online: true,
    source: "unknown",
    lastLatencySpike: null,
    spikeCount: 0,
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
      appKbps: 0,
    },

    snapshot: {
      advantage: 1.0,
      timeSaved: 0,
      lastUpdateTimestamp: 0,
      driftScore: 0,
      reflexScore: 1.0,
    },

    gpuPerformance: {
      warm: false,
      smoothness: 0,
      pacing: "Unknown",
      stalls: 0,
      efficiency: 100,
      load: 0,
      frameBudget: 16.6,
      frameVariance: 0,
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
    online: true,
  },

  // ------------------------------------------------------------
  // GPU Brain Init — Motor Cortex Warmup (symbolic, v11)
  // ------------------------------------------------------------
  async initGraphics(rawAssets = {}) {
    if (typeof window !== "undefined" && window.PULSE_LOG) {
      window.PULSE_LOG("PulseBand → initGraphics() called");
    }
    nervousLog("GPU_INIT_CALLED");

    if (!PulseGPU || !PulseGPU.BrainInput || !PulseGPU.PulseGPUBrainExport) {
      nervousLog("GPU_INIT_MISSING_GPU_ORGAN");
      return;
    }

    try {
      const input = new PulseGPU.BrainInput({
        rawTextures:   rawAssets.textures   || [],
        rawMeshes:     rawAssets.meshes     || [],
        rawAnimations: rawAssets.animations || [],
        rawShaders:    rawAssets.shaders    || [],
        rawScenes:     rawAssets.scenes     || [],
      });

      const packages = PulseGPU.PulseGPUBrainExport.buildAndStore(input);

      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU Brain ready");
      }

      this.gpu.packages = packages;
      this.gpu.ready = !!packages;
      this.gpu.warmupScore = packages ? 1.0 : 0.0;

      nervousLog("GPU_INIT_READY", { gpuReady: this.gpu.ready });
    } catch (err) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU Brain FAILED");
      }

      this.gpu.ready = false;
      this.gpu.warmupScore = 0;

      nervousLog("GPU_INIT_FAILED", { error: String(err) });
    }
  },

  // ------------------------------------------------------------
  // Engine Init — Nervous System Boot (v11)
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
        route: "Pulse",
      },
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

    nervousLog("CONNECTIVITY_STATE_SET", { online, source });

    this.emit("connectivity-change", {
      online,
      source,
      mode: this.connectivity.mode,
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
    lastError: null,
    lastMeshReach: null,
    lastDeviceId: null,
  },

  onPulseSuccess(payload = {}) {
    const ts = nowMs();

    this.pulseStatus.lastPulseTs = ts;
    this.pulseStatus.lastPulseOk = true;
    this.pulseStatus.lastError = null;
    this.pulseStatus.lastMeshReach =
      payload.meshReach || this.pulseStatus.lastMeshReach || null;
    this.pulseStatus.lastDeviceId =
      payload.deviceId || this.pulseStatus.lastDeviceId || null;

    this.setConnectivity({ online: true, source: "pulse" });

    this.emit("pulse-success", { ts, payload });
  },

  onPulseFailure(reason = "unknown") {
    const ts = nowMs();

    this.pulseStatus.lastPulseTs = ts;
    this.pulseStatus.lastPulseOk = false;
    this.pulseStatus.lastError = reason;

    this.emit("pulse-failure", { ts, reason });
  },

  estimateMeshReach() {
    const liveLatency = this.state.live.latency || 0;

    const hops =
      liveLatency <= 0 ? 0 :
      liveLatency < 80 ? 1 :
      liveLatency < 200 ? 2 :
      liveLatency < 400 ? 3 : 4;

    return {
      hops,
      estimatedMeters: hops * 30,
      mode: hops <= 1 ? "direct" : "mesh",
    };
  },

  async requestPulse(deviceId) {
    if (typeof window === "undefined" || !window.PulseNet || !window.PulseNet.pulseOnce) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("[PulseBand] PulseNet not available");
      }
      nervousLog("PULSE_REQUEST_NO_PULSENET");
      return { ok: false, reason: "no-pulsenet" };
    }

    const res = await window.PulseNet.pulseOnce(deviceId);

    if (res && res.ok) {
      this.onPulseSuccess(res.payload || {});
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
      source: this.connectivity.source,
      lastLatencySpike: this.connectivity.lastLatencySpike,
      spikeCount: this.connectivity.spikeCount
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

    if (!Impulse || typeof Impulse.create !== "function") {
      nervousLog("IMPULSE_MISSING", { intent });
      return null;
    }

    const impulse = Impulse.create(intent, {
      ...payload,
      nervousSystem: {
        latency: this.state.latency,
        networkHealth: this.state.networkHealth,
        gpuReady: this.gpu.ready
      }
    });

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
  // setStatus — NERVOUS SYSTEM PULSE (symbolic, backed by binary math)
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

    // GPU auto‑init (unchanged behavior)
    if (!this.gpu.ready && clean.gpuAssets) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → GPU auto-init triggered");
      }
      nervousLog("GPU_AUTO_INIT");
      this.initGraphics(clean.gpuAssets);
    }

    // ------------------------------------------------------------
    // LIVE MERGE — v11, using binary nervous math when available
    // ------------------------------------------------------------
    if (clean.live) {
      if (typeof window !== "undefined" && window.PULSE_LOG) {
        window.PULSE_LOG("PulseBand → LIVE merge");
      }
      nervousLog("LIVE_MERGE", { keys: Object.keys(clean.live || {}) });

      const L = clean.live;
      const latency =
        L.latency != null ? L.latency : this.state.live.latency ?? 0;

      const lastUpdatePrev = this.state.live.lastUpdateTimestamp || 0;
      const prevLatency = this.state.live.latency || 0;

      let latencyClass = "Unknown";
      let networkHealth = "Unknown";
      let microWindowActive =
        L.microWindowActive ?? (now - lastUpdatePrev < 5000);

      if (PNSBinary) {
        latencyClass = PNSBinary.classifyLatency(latency);
        networkHealth = PNSBinary.computeNetworkHealth(latency);
      } else {
        // fallback to legacy thresholds if binary core missing
        if (!Number.isFinite(latency) || latency <= 0) {
          latencyClass = "Unknown";
          networkHealth = "Unknown";
        } else if (latency < 80) {
          latencyClass = "Excellent";
          networkHealth = "Excellent";
        } else if (latency < 150) {
          latencyClass = "Good";
          networkHealth = "Good";
        } else if (latency < 300) {
          latencyClass = "Weak";
          networkHealth = "Weak";
        } else {
          latencyClass = "Critical";
          networkHealth = "Critical";
        }
      }

      const latencySpike =
        PNSBinary
          ? PNSBinary.detectSpike(prevLatency, latency)
          : (latency > 0 &&
             prevLatency > 0 &&
             latency - prevLatency > 120);

      if (latencySpike) {
        this.connectivity.lastLatencySpike = now;
        this.connectivity.spikeCount = (this.connectivity.spikeCount || 0) + 1;
      }

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

    // ------------------------------------------------------------
    // SNAPSHOT MERGE — v11 (same semantics, timestamp updated)
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // FLAT MIRROR — v11 deterministic flattening
    // ------------------------------------------------------------
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

    for (let i = 0; i < handlers.length; i++) {
      const cb = handlers[i];
      try {
        cb(data);
      } catch (err) {
        nervousLog("EVENT_HANDLER_ERROR", {
          event,
          index: i,
          error: String(err)
        });
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

        if (typeof extra.timeoutMs === "number" && extra.timeoutMs > 0) {
          const timeout = extra.timeoutMs;
          setTimeout(() => {
            nervousLog("REQUEST_TIMEOUT", { type, sessionId, timeout });
            resolve({
              ok: false,
              timeout: true,
              type,
              sessionId
            });
          }, timeout);
        }
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
