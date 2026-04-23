// ⭐ Universal global resolver — works in browser + node + workers
const G = typeof globalThis !== "undefined"
  ? globalThis
  : typeof window !== "undefined"
  ? window
  : typeof global !== "undefined"
  ? global
  : {};

// ⭐ Safe fallbacks — never break the page
const db    = G.db;
const log   = G.log   || console.log;
const error = G.error || console.error;


// ============================================================================
// ⭐ OS‑v10.3 CONTEXT METADATA — Synapse Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseNet",
  layer: "Synapse",
  version: "10.3",
  identity: "PulseNetSynapse",

  evo: {
    driftProof: true,
    deterministic: true,
    synapticIntegrity: true,
    deterministicImpulseFlow: true,
    offlineFirst: true,
    tinySyncReady: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
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

// ============================================================================
// DIAGNOSTICS — unchanged
// ============================================================================
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

// ============================================================================
// CORE PURE HELPERS — unchanged
// ============================================================================
function normalizeSignal(rawValue, opts = {}) {
  const { min = 0, max = 100, clamp = true } = opts;

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

function computeSlope(prevValue, nextValue, opts = {}) {
  const { epsilon = 1e-6 } = opts;

  if (prevValue == null || nextValue == null) return 0;

  const a = Number(prevValue);
  const b = Number(nextValue);

  const delta = b - a;
  if (Math.abs(delta) < epsilon) return 0;

  return delta;
}

function classifyRouteHealth(signalScore, signalSlope) {
  const score = Number(signalScore ?? 0);
  const slope = Number(signalSlope ?? 0);

  if (score >= 0.8 && slope >= 0) return "healthy";
  if (score >= 0.5 && slope >= -0.1) return "stable";
  if (score >= 0.3 && slope >= -0.3) return "degrading";
  if (score < 0.3 && slope < -0.1) return "critical";

  return "unknown";
}

function buildPulseUpdate({ rawSignal, previousSignal, meta = {} } = {}) {
  const signalScore = normalizeSignal(rawSignal, meta.normalize || {});
  const signalSlope = computeSlope(previousSignal, rawSignal, meta.slope || {});
  const routeHealth = classifyRouteHealth(signalScore, signalSlope);

  const update = {
    layerId: PULSE_LAYER_ID,
    layerName: PULSE_LAYER_NAME,
    layerRole: PULSE_LAYER_ROLE,

    rawSignal: rawSignal ?? null,
    previousSignal: previousSignal ?? null,

    signalScore,
    signalSlope,
    routeHealth,

    meta: { ...meta, context: PULSENET_CONTEXT },

    ts: new Date().toISOString()
  };

  pulseLog("SYNAPSE_PULSE_UPDATE", {
    routeHealth,
    signalScore,
    signalSlope,
    meta
  });

  return update;
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
    version: "10.3", // ⭐ upgraded
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
// PULSE‑ONCE CONNECTIVITY ORGAN — unchanged
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
          localStorage.setItem("tp_identity_v9", JSON.stringify(payload.identity));
        }
        if (payload.config) {
          localStorage.setItem("tp_earn_config_v9", JSON.stringify(payload.config));
        }
        if (payload.jobs) {
          localStorage.setItem("tp_jobs_seed_v9", JSON.stringify(payload.jobs));
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
// EXPORTED SYNAPSE + PULSE‑ONCE API — v10.3
// ============================================================================
export const PulseNet = {
  PULSE_LAYER_ID,
  PULSE_LAYER_NAME,
  PULSE_LAYER_ROLE,

  PULSE_DIAGNOSTICS_ENABLED,
  pulseLog,

  normalizeSignal,
  computeSlope,
  classifyRouteHealth,

  buildPulseUpdate,
  processPulseSignal,
  buildPulseNetSnapshot,

  pulseOnce,
  getPulseNetState,

  meta: { ...PULSENET_CONTEXT }
};
