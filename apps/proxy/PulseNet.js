// ============================================================================
// FILE: /apps/lib/Connectors/PulseNet.js
// LAYER: THE SYNAPSE (Neural Signal Routing Layer) — v7.1+
// ============================================================================
//
// ROLE (v7.1+):
//   THE SYNAPSE — Neural Signal Routing Layer
//   • Receives electrical signal from Nervous System (PulseBand)
//   • Computes signalScore + signalSlope (signal strength + trend)
//   • Classifies route health (neural path integrity)
//   • Emits pulse updates to the OS (neural firing)
//
// CONTRACT (v7.1+):
//   • No PulseBand imports
//   • No PulseClient imports
//   • No PulseUpdate imports
//   • Pure subsystem module
//
// SAFETY (v7.1+):
//   • v7.1+ upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v7.1 PulseNet (where behavior existed)
//   • If you wire new callers, do so via these exported pure functions only.
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const PULSE_LAYER_ID = "SYNAPSE-LAYER";
const PULSE_LAYER_NAME = "THE SYNAPSE";
const PULSE_LAYER_ROLE = "Neural Signal Routing Layer";

const PULSE_DIAGNOSTICS_ENABLED =
  (typeof window !== "undefined" &&
    (window.PULSE_PULSE_DIAGNOSTICS === true ||
     window.PULSE_DIAGNOSTICS === true)) ||
  false;

const pulseLog = (stage, details = {}) => {
  if (!PULSE_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: PULSE_LAYER_ID,
      pulseName: PULSE_LAYER_NAME,
      pulseRole: PULSE_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

pulseLog("SYNAPSE_INIT", {});

// ============================================================================
// CORE PURE HELPERS (NO IMPORTS, NO SIDE EFFECTS EXCEPT OPTIONAL LOGGING)
// ============================================================================

/**
 * Normalize a raw numeric signal into a bounded [0,1] score.
 * This is intentionally simple + deterministic.
 */
function normalizeSignal(rawValue, opts = {}) {
  const {
    min = 0,
    max = 100,
    clamp = true
  } = opts;

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

/**
 * Compute slope between two samples (trend).
 * Returns a signed value: positive = rising, negative = falling.
 */
function computeSlope(prevValue, nextValue, opts = {}) {
  const { epsilon = 1e-6 } = opts;

  if (prevValue == null || nextValue == null) return 0;

  const a = Number(prevValue);
  const b = Number(nextValue);

  const delta = b - a;
  if (Math.abs(delta) < epsilon) return 0;

  return delta;
}

/**
 * Classify route health based on score + slope.
 * This is the "neural path integrity" classifier.
 */
function classifyRouteHealth(signalScore, signalSlope) {
  const score = Number(signalScore ?? 0);
  const slope = Number(signalSlope ?? 0);

  // You can tune these thresholds; they are symmetric and simple.
  if (score >= 0.8 && slope >= 0) return "healthy";
  if (score >= 0.5 && slope >= -0.1) return "stable";
  if (score >= 0.3 && slope >= -0.3) return "degrading";
  if (score < 0.3 && slope < -0.1) return "critical";

  return "unknown";
}

/**
 * Build a pure "pulse update" object that the OS / higher layers can consume.
 * This is the only thing PulseNet "emits".
 */
function buildPulseUpdate({
  rawSignal,
  previousSignal,
  meta = {}
} = {}) {
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

    // Optional metadata passthrough (device id, route id, etc.)
    meta: {
      ...meta
    },

    // Timestamp for lineage / debugging
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

/**
 * High-level "process" function:
 *   • Takes a raw nervous-system signal + previous sample
 *   • Returns a full PulseNet update object
 */
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

/**
 * Optional: build a small diagnostic snapshot for dashboards.
 * This is read-only, derived from the same logic.
 */
function buildPulseNetSnapshot(rawSignal, previousSignal, meta = {}) {
  const update = buildPulseUpdate({ rawSignal, previousSignal, meta });

  return {
    version: "7.1",
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
// EXPORTED SYNAPSE API (WHAT OTHER LAYERS SHOULD IMPORT)
// ============================================================================

export const PulseNet = {
  // Identity
  PULSE_LAYER_ID,
  PULSE_LAYER_NAME,
  PULSE_LAYER_ROLE,

  // Diagnostics
  PULSE_DIAGNOSTICS_ENABLED,
  pulseLog,

  // Core math / classification
  normalizeSignal,
  computeSlope,
  classifyRouteHealth,

  // Main routing primitives
  buildPulseUpdate,
  processPulseSignal,
  buildPulseNetSnapshot
};
