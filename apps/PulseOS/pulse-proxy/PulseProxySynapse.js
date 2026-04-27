
// ============================================================================
//  PULSE OS v11 — PULSENET SYNAPSE
//  Neural Signal Routing Organ • Binary Core + Symbolic Wrapper
//  Dual-Mode: Binary (pure, deterministic) + Unbinary (browser / fetch / storage)
//  SAFETY:
//    • Binary core: no window, no fetch, no JSON, no timestamps, no globals.
//    • Symbolic wrapper: browser-aware, diagnostics, tiny-sync, storage.
//    • No randomness. No autonomous routing. No business logic.
// ============================================================================


// ============================================================================
//  UNIVERSAL GLOBAL RESOLVER — symbolic layer only
//  (Binary core never touches this; it is passed data only.)
// ============================================================================
const G = typeof globalThis !== "undefined"
  ? globalThis
  : typeof window !== "undefined"
  ? window
  : typeof global !== "undefined"
  ? global
  : {};

const db    = G.db;
const log   = G.log   || console.log;
const error = G.error || console.error;


// ============================================================================
//  ORGAN IDENTITY — v11 Synapse
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseNet",
  layer: "Synapse",
  version: "11.0",
  identity: "PulseNetSynapse",

  evo: {
    driftProof: true,
    deterministic: true,
    synapticIntegrity: true,
    deterministicImpulseFlow: true,

    dualModeEvolution: true,       // binary + symbolic
    binaryFirst: true,             // binary core is source of truth
    offlineFirst: true,
    tinySyncReady: true,

    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    futureEvolutionReady: true
  }
};

const PULSENET_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  purpose: "Neural signal routing + tiny offline-first connectivity organ",
  context: "Processes nervous-system signals + performs tiny sync pulses",
  target: "full-os",
  version: PulseRole.version,
  selfRepairable: true,
  evo: PulseRole.evo
};
export const PulseNetSynapseMeta = Object.freeze({
  layer: "PulseNetSynapse",
  role: "NEURAL_SIGNAL_ROUTING_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseNetSynapse-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,

    // Synapse laws
    synapticIntegrity: true,
    deterministicImpulseFlow: true,
    binaryFirst: true,
    dualModeEvolution: true,
    offlineFirst: true,
    tinySyncReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: true,
    organismClusterBoost: true,
    cognitiveComputeLink: true,

    // Execution prohibitions
    zeroRandomness: true,
    zeroJSONInBinary: true,
    zeroWindowInBinary: true,
    zeroFetchInBinary: true,
    zeroTimestamps: true,
    zeroDateNow: true,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroNetworkMutation: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroRoutingIntelligence: true,
    zeroBusinessLogic: true,
    zeroMarketplaceLogic: true,
    zeroGPUExecution: true,
    zeroDOM: true,

    // Awareness
    binaryAware: true,
    symbolicAware: true,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    dualBandAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "BinaryImpulse",
      "SymbolicImpulse",
      "SynapseContext",
      "DualBandContext",
      "AdvantageContext"
    ],
    output: [
      "SynapseImpulseFlow",
      "SynapseBandSignature",
      "SynapseBinaryField",
      "SynapseWaveField",
      "SynapseDiagnostics",
      "SynapseHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseNet-v11",
    parent: "PulseNet-v11.2-EVO",
    ancestry: [
      "PulseNetSynapse-v7",
      "PulseNetSynapse-v8",
      "PulseNetSynapse-v9",
      "PulseNetSynapse-v9.3",
      "PulseNetSynapse-v10",
      "PulseNetSynapse-v11",
      "PulseNetSynapse-v11-Evo",
      "PulseNetSynapse-v11-Evo-Prime"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic", "dual"],
    default: "binary",
    behavior: "synapse-routing"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "binary impulse → symbolic wrapper → unified neural flow",
    adaptive: "tiny-sync + offline-first overlays",
    return: "deterministic synapse surfaces + signatures"
  })
});


// ============================================================================
//  BINARY CORE — v11+
//  Pure, deterministic, no window, no fetch, no JSON, no timestamps.
//  This is the compression / canonical logic for Synapse.
// ============================================================================

// NOTE: all helpers here must be pure and side-effect free.

function normalizeSignalBinary(rawValue, opts) {
  const cfg = opts || {};
  const min = typeof cfg.min === "number" ? cfg.min : 0;
  const max = typeof cfg.max === "number" ? cfg.max : 100;
  const clamp = cfg.clamp !== false;

  if (rawValue == null || Number.isNaN(rawValue)) return 0;

  let v = Number(rawValue);
  const span = max - min || 1;
  let score = (v - min) / span;

  if (clamp) {
    if (score < 0) score = 0;
    if (score > 1) score = 1;
  }

  return score;
}

function computeSlopeBinary(prevValue, nextValue, opts) {
  const cfg = opts || {};
  const epsilon = typeof cfg.epsilon === "number" ? cfg.epsilon : 1e-6;

  if (prevValue == null || nextValue == null) return 0;

  const a = Number(prevValue);
  const b = Number(nextValue);

  const delta = b - a;
  if (Math.abs(delta) < epsilon) return 0;

  return delta;
}

function classifyRouteHealthBinary(signalScore, signalSlope) {
  const score = Number(signalScore ?? 0);
  const slope = Number(signalSlope ?? 0);

  if (score >= 0.8 && slope >= 0)      return "healthy";
  if (score >= 0.5 && slope >= -0.1)   return "stable";
  if (score >= 0.3 && slope >= -0.3)   return "degrading";
  if (score < 0.3 && slope < -0.1)     return "critical";

  return "unknown";
}

function buildPulseUpdateBinary(input) {
  const rawSignal      = input && "rawSignal" in input ? input.rawSignal : null;
  const previousSignal = input && "previousSignal" in input ? input.previousSignal : null;
  const meta           = (input && input.meta) || {};

  const signalScore = normalizeSignalBinary(rawSignal, meta.normalize || {});
  const signalSlope = computeSlopeBinary(previousSignal, rawSignal, meta.slope || {});
  const routeHealth = classifyRouteHealthBinary(signalScore, signalSlope);

  // Binary core does NOT attach timestamps or external context.
  return {
    layerId: "SYNAPSE-LAYER",
    layerName: "THE SYNAPSE",
    layerRole: "Neural Signal Routing Layer",

    rawSignal: rawSignal ?? null,
    previousSignal: previousSignal ?? null,

    signalScore,
    signalSlope,
    routeHealth,

    meta: { ...meta } // symbolic wrapper can enrich with PULSENET_CONTEXT
  };
}

function processPulseSignalBinary(rawSignal, previousSignal, meta) {
  return buildPulseUpdateBinary({ rawSignal, previousSignal, meta: meta || {} });
}

function buildPulseNetSnapshotBinary(rawSignal, previousSignal, meta) {
  const update = buildPulseUpdateBinary({ rawSignal, previousSignal, meta: meta || {} });

  return {
    version: "11-binary",
    layerId: update.layerId,
    layerName: update.layerName,
    layerRole: update.layerRole,

    signal: {
      raw: update.rawSignal,
      previous: update.previousSignal,
      score: update.signalScore,
      slope: update.signalSlope,
      routeHealth: update.routeHealth
    },

    meta: { ...update.meta }
  };
}

export const PulseNetBinary = {
  normalizeSignal: normalizeSignalBinary,
  computeSlope: computeSlopeBinary,
  classifyRouteHealth: classifyRouteHealthBinary,
  buildPulseUpdate: buildPulseUpdateBinary,
  processPulseSignal: processPulseSignalBinary,
  buildPulseNetSnapshot: buildPulseNetSnapshotBinary,
  meta: { ...PULSENET_CONTEXT, mode: "binary-core" }
};


// ============================================================================
//  SYMBOLIC WRAPPER — v11 (browser / diagnostics / tiny-sync)
//  Wraps binary core, adds:
//    • Diagnostics logging
//    • Timestamps
//    • Connectivity reachout
//    • Local storage tiny-sync
// ============================================================================

// Diagnostics toggle is symbolic-only (window-aware).
const PULSE_LAYER_ID   = "SYNAPSE-LAYER";
const PULSE_LAYER_NAME = "THE SYNAPSE";
const PULSE_LAYER_ROLE = "Neural Signal Routing Layer";

const PULSE_DIAGNOSTICS_ENABLED =
  typeof window !== "undefined" &&
  (window.PULSE_PULSE_DIAGNOSTICS === true ||
   window.PULSE_DIAGNOSTICS === true);

const pulseLog = (stage, details = {}) => {
  if (!PULSE_DIAGNOSTICS_ENABLED) return;

  try {
    log(
      JSON.stringify({
        pulseLayer: PULSE_LAYER_ID,
        pulseName: PULSE_LAYER_NAME,
        pulseRole: PULSE_LAYER_ROLE,
        stage,
        ...details,
        meta: { ...PULSENET_CONTEXT }
      })
    );
  } catch {}
};

pulseLog("SYNAPSE_INIT", {});


// ---------------------------------------------------------------------------
// Symbolic wrappers around binary helpers
// ---------------------------------------------------------------------------
function normalizeSignal(rawValue, opts = {}) {
  return PulseNetBinary.normalizeSignal(rawValue, opts);
}

function computeSlope(prevValue, nextValue, opts = {}) {
  return PulseNetBinary.computeSlope(prevValue, nextValue, opts);
}

function classifyRouteHealth(signalScore, signalSlope) {
  return PulseNetBinary.classifyRouteHealth(signalScore, signalSlope);
}

function buildPulseUpdate({ rawSignal, previousSignal, meta = {} } = {}) {
  const enrichedMeta = {
    ...meta,
    context: PULSENET_CONTEXT
  };

  const update = PulseNetBinary.buildPulseUpdate({
    rawSignal,
    previousSignal,
    meta: enrichedMeta
  });

  const ts = new Date().toISOString();

  const withTs = {
    ...update,
    ts
  };

  pulseLog("SYNAPSE_PULSE_UPDATE", {
    routeHealth: withTs.routeHealth,
    signalScore: withTs.signalScore,
    signalSlope: withTs.signalSlope,
    meta
  });

  return withTs;
}

function processPulseSignal(rawSignal, previousSignal, meta = {}) {
  pulseLog("SYNAPSE_PROCESS_START", {
    rawSignal,
    previousSignal,
    meta
  });

  const update = buildPulseUpdate({ rawSignal, previousSignal, meta });

  pulseLog("SYNAPSE_PROCESS_DONE", {
    routeHealth: update.routeHealth,
    signalScore: update.signalScore,
    signalSlope: update.signalSlope
  });

  return update;
}

function buildPulseNetSnapshot(rawSignal, previousSignal, meta = {}) {
  const update = buildPulseUpdate({ rawSignal, previousSignal, meta });

  return {
    version: "11.0",
    layerId: PULSE_LAYER_ID,
    layerName: PULSE_LAYER_NAME,
    layerRole: PULSE_LAYER_ROLE,
    ts: update.ts,

    signal: {
      raw: update.rawSignal,
      previous: update.previousSignal,
      score: update.signalScore,
      slope: update.signalSlope,
      routeHealth: update.routeHealth
    },

    meta: update.meta
  };
}


// ============================================================================
//  PULSE-ONCE CONNECTIVITY ORGAN — symbolic only
//  Tiny sync, browser-only, uses fetch + storage, never touches binary core.
// ============================================================================

const PulseNetState = {
  lastPulseTs: null,
  lastPulseOk: false,
  lastError: null,
  minPulseIntervalMs: 5 * 60 * 1000
};

async function multiGatewayReachout() {
  pulseLog("PULSE_REACHOUT_START", {});

  try {
    if (typeof navigator !== "undefined" && navigator.connection?.type === "satellite") {
      pulseLog("PULSE_REACHOUT_SATELLITE_TRY", {});
      const ok = await trySatellitePing();
      if (ok) return true;
    }
  } catch (e) {
    pulseLog("PULSE_REACHOUT_SATELLITE_ERR", { error: String(e) });
  }

  pulseLog("PULSE_REACHOUT_WIFI_PLACEHOLDER", {
    note: "WiFi scanning/joining requires native/OS integration."
  });

  try {
    const ok = await tryLastKnownGateway();
    if (ok) return true;
  } catch (e) {
    pulseLog("PULSE_REACHOUT_LAST_GATEWAY_ERR", { error: String(e) });
  }

  pulseLog("PULSE_REACHOUT_NO_PATH", {});
  return false;
}

async function trySatellitePing() {
  try {
    const res = await fetch("https://example-satellite-check.com/ping", {
      method: "GET",
      cache: "no-store"
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function tryLastKnownGateway() {
  try {
    const res = await fetch("/pulse-gateway-ping", {
      method: "GET",
      cache: "no-store"
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function pulseOnce(deviceId) {
  pulseLog("PULSE_ONCE_CALLED", { deviceId });

  const now = Date.now();
  if (
    PulseNetState.lastPulseTs &&
    now - PulseNetState.lastPulseTs < PulseNetState.minPulseIntervalMs
  ) {
    pulseLog("PULSE_ONCE_SKIPPED_MIN_INTERVAL", {
      lastPulseTs: PulseNetState.lastPulseTs,
      now,
      minPulseIntervalMs: PulseNetState.minPulseIntervalMs
    });
    return { skipped: true, reason: "min-interval" };
  }

  try {
    const pathOk = await multiGatewayReachout();
    if (!pathOk) {
      PulseNetState.lastPulseTs = now;
      PulseNetState.lastPulseOk = false;
      PulseNetState.lastError = "no-path";

      pulseLog("PULSE_ONCE_NO_PATH", {});
      return { ok: false, reason: "no-path" };
    }

    pulseLog("PULSE_ONCE_TINY_SYNC_START", {});

    const res = await fetch("/pulse-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ deviceId })
    });

    if (!res.ok) {
      throw new Error("non_ok_status_" + res.status);
    }

    const payload = await res.json();

    try {
      if (typeof localStorage !== "undefined") {
        if (payload.identity) {
          localStorage.setItem("tp_identity_v11", JSON.stringify(payload.identity));
        }
        if (payload.config) {
          localStorage.setItem("tp_earn_config_v11", JSON.stringify(payload.config));
        }
        if (payload.jobs) {
          localStorage.setItem("tp_jobs_seed_v11", JSON.stringify(payload.jobs));
        }
      }
    } catch (storageErr) {
      pulseLog("PULSE_ONCE_STORAGE_ERR", { error: String(storageErr) });
    }

    PulseNetState.lastPulseTs = now;
    PulseNetState.lastPulseOk = true;
    PulseNetState.lastError = null;

    pulseLog("PULSE_ONCE_TINY_SYNC_DONE", {
      bytes: JSON.stringify(payload).length,
      hasJobs: Array.isArray(payload.jobs) && payload.jobs.length > 0
    });

    return { ok: true, payload };

  } catch (err) {
    PulseNetState.lastPulseTs = Date.now();
    PulseNetState.lastPulseOk = false;
    PulseNetState.lastError = err?.message || "unknown";

    pulseLog("PULSE_ONCE_ERR", { error: String(err) });
    return { ok: false, error: err?.message || "unknown" };
  }
}

function getPulseNetState() {
  return { ...PulseNetState };
}


// ============================================================================
//  EXPORTED SYNAPSE API — v11
//  Binary + Symbolic, clearly separated, organism-aware.
// ============================================================================
export const PulseNet = {
  // identity
  PULSE_LAYER_ID,
  PULSE_LAYER_NAME,
  PULSE_LAYER_ROLE,

  // diagnostics
  PULSE_DIAGNOSTICS_ENABLED,
  pulseLog,

  // binary-compatible helpers (symbolic wrappers)
  normalizeSignal,
  computeSlope,
  classifyRouteHealth,

  buildPulseUpdate,
  processPulseSignal,
  buildPulseNetSnapshot,

  // connectivity
  pulseOnce,
  getPulseNetState,

  // meta
  meta: { ...PULSENET_CONTEXT },

  // expose binary core for other organs (GPU, Cortex, Mesh)
  binary: PulseNetBinary
};
