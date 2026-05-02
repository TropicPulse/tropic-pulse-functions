// ============================================================================
//  PULSE OS v12.3‑PRESENCE‑EVO+ — POWER‑PRIME RISK ENGINE
//  Predictive Risk Vector • Artery Fusion • Drift‑Aware • Deterministic
//  Presence • Advantage • Fallback Bands • Chunk/Cache/Prewarm Hints
//  PURE COMPUTE. ZERO MUTATION. ZERO RANDOMNESS. ZERO I/O.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "powerRiskEngine",
  version: "v14-IMMORTAL",
  layer: "pulsegrid_compute",
  role: "risk_compute_engine",
  lineage: "PowerPrime-v14",

  evo: {
    riskEngine: true,               // Computes risk vectors
    arteryFusion: true,             // Fuses artery signals
    outageLikelihood: true,         // Predicts outage probability
    driftRisk: true,                // Computes drift risk
    continuanceAware: true,         // Integrates continuance metrics
    advantageAware: true,           // Integrates advantage context

    deterministic: true,            // Pure math, no randomness
    driftProof: true,               // Outputs must never drift
    pureCompute: true,              // No side effects
    zeroMutationOfInput: true,      // Never mutate incoming data
    zeroNetwork: true,              // No fetch, no external calls
    zeroFilesystem: true,           // No disk access
    zeroAsync: true,                // Fully synchronous
    binarySafe: true,               // Safe for binary artery inputs
    symbolicSafe: true,             // Safe for symbolic inputs
    dualBandAware: true,            // Accepts both, but does not generate symbolic AI output

    safeRouteFree: true             // Must never use safeRoute
  },

  contract: {
    always: [
      "powerContinuanceEngine",     // Risk engine depends on continuance metrics
      "aiPowerPrime"                // AI organ consumes risk vectors
    ],
    never: [
      "legacyRiskEngine",
      "safeRoute",
      "fetchViaCNS",
      "aiInference",                // No AI allowed inside compute engine
      "meshAwareness",              // Not a mesh organ
      "presenceAwareness"           // Not a presence organ
    ]
  }
}
*/

export const PowerRiskEngineMeta = Object.freeze({
  layer: "PulseAIPowerPrime",
  role: "POWER_RISK_ENGINE",
  version: "12.3-PRESENCE-EVO+",
  identity: "powerRiskEngine-v12.3-PRESENCE-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    arteryFusionAware: true,
    continuanceAware: true,
    outageAware: true,
    fluctuationAware: true,
    hormoneAware: true,
    personaAware: true,
    memoryAware: true,
    evolutionAware: true,
    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    readOnly: true,
    epoch: "12.3-PRESENCE-EVO+"
  }),

  guarantees: Object.freeze({
    pureCompute: true,
    zeroMutation: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroDateNow: true,
    zeroIO: true,
    zeroNetwork: true,
    zeroSideEffects: true
  }),

  contract: Object.freeze({
    input: [
      "PowerHistorySnapshot",
      "FusedArteriesSnapshot",
      "ContinuanceSnapshot",
      "PresenceContext",
      "AdvantageContext"
    ],
    output: [
      "PowerRiskVector",
      "PowerRiskSummary",
      "PowerBeaconSignals",
      "PowerRiskPresencePlan"
    ]
  })
});

// ============================================================================
//  INTERNAL HELPERS — SAFE NORMALIZATION
// ============================================================================

function norm(v) {
  if (typeof v !== "number" || isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function safeLen(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

function safeNum(v, d = 0) {
  return typeof v === "number" && !isNaN(v) ? v : d;
}

function safeObj(v, d = {}) {
  return v && typeof v === "object" ? v : d;
}

function safeBool(v, d = false) {
  return typeof v === "boolean" ? v : d;
}

// ============================================================================
//  ARTERY FUSION — BUILD RISK VECTOR INPUTS
// ============================================================================

function fuseArteryWeights(fusedArteries) {
  const {
    metabolic = {},
    nervous = {},
    immune = {},
    hormones = {},
    pipeline = {},
    scanner = {},
    personalFrame = {},
    personality = {},
    memory = {},
    evolution = {}
  } = fusedArteries || {};

  return Object.freeze({
    metabolicPressure: norm(metabolic.pressure),
    metabolicLoad: norm(metabolic.load),

    routingPressure: norm(nervous.routingPressure),
    routingCost: norm(nervous.cost),

    immuneRisk: norm(immune.risk),
    immuneDrift: norm(immune.drift),

    hormoneStress: norm(hormones.stress),
    hormoneStability: norm(hormones.stability),

    pipelinePressure: norm(pipeline.pressure),
    pipelineCost: norm(pipeline.cost),

    scannerDrift: norm(scanner.driftScore),

    toneWarmth: norm(personality.warmth),
    toneClarity: norm(personality.clarity),
    toneHumility: norm(personality.humility),

    abstractionLevel:
      personalFrame.abstraction === "high"
        ? 0.2
        : personalFrame.abstraction === "low"
        ? 0.8
        : 0.5,

    memoryStability: norm(memory.stability),
    memoryDrift: norm(memory.drift),

    evolutionSchemaDrift: norm(evolution.schemaDrift),
    evolutionFileDrift: norm(evolution.fileDrift),
    evolutionRouteDrift: norm(evolution.routeDrift)
  });
}

// ============================================================================
//  POWER‑RISK VECTOR — CORE COMPUTATION
// ============================================================================

export function computePowerRiskVector({
  power,
  history,
  fusedArteries,
  continuance,
  settings = {}
}) {
  const latest = power?.[0] || null;
  const fused = fuseArteryWeights(fusedArteries);

  // --------------------------------------------------------------------------
  // 1. GRID INSTABILITY SCORE (history-based)
  // --------------------------------------------------------------------------
  let instability = 0;
  if (Array.isArray(history) && history.length > 3) {
    let jumps = 0;
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      if (!prev || !curr || prev.value === 0) continue;
      const diff = Math.abs(curr.value - prev.value);
      const pct = (diff / prev.value) * 100;
      if (pct >= 20) jumps++;
    }
    instability = norm(jumps / history.length);
  }

  // --------------------------------------------------------------------------
  // 2. OUTAGE‑LIKELIHOOD SCORE (predictive)
// --------------------------------------------------------------------------
  const outageLikelihood = norm(
    0.4 * instability +
      0.2 * fused.metabolicPressure +
      0.2 * fused.routingPressure +
      0.2 * fused.pipelinePressure
  );

  // --------------------------------------------------------------------------
  // 3. DRIFT‑RISK SCORE (schema + file + route + scanner)
  // --------------------------------------------------------------------------
  const driftRisk = norm(
    0.25 * fused.scannerDrift +
      0.25 * fused.evolutionSchemaDrift +
      0.25 * fused.evolutionFileDrift +
      0.25 * fused.evolutionRouteDrift
  );

  // --------------------------------------------------------------------------
  // 4. ORGANISM PRESSURE SCORE (metabolic + nervous + pipeline + immune)
  // --------------------------------------------------------------------------
  const organismPressure = norm(
    0.3 * fused.metabolicPressure +
      0.25 * fused.routingPressure +
      0.25 * fused.pipelinePressure +
      0.2 * fused.immuneRisk
  );

  // --------------------------------------------------------------------------
  // 5. HORMONE‑MODULATED RISK (stress ↑, stability ↓)
  // --------------------------------------------------------------------------
  const hormoneMod = norm(
    0.6 * fused.hormoneStress + 0.4 * (1 - fused.hormoneStability)
  );

  // --------------------------------------------------------------------------
  // 6. MEMORY‑STABILITY MODULATION (unstable memory increases risk)
  // --------------------------------------------------------------------------
  const memoryMod = norm(
    0.5 * (1 - fused.memoryStability) + 0.5 * fused.memoryDrift
  );

  // --------------------------------------------------------------------------
  // 7. CONTINUANCE‑AWARE RISK (low continuance → higher risk)
  // --------------------------------------------------------------------------
  const cont = continuance?.continuanceScore ?? 0;
  const continuanceMod = norm(1 - cont);

  // --------------------------------------------------------------------------
  // 8. FINAL POWER‑RISK SCORE (weighted fusion)
  // --------------------------------------------------------------------------
  const riskScore = norm(
    0.25 * organismPressure +
      0.2 * outageLikelihood +
      0.2 * instability +
      0.15 * driftRisk +
      0.1 * hormoneMod +
      0.05 * memoryMod +
      0.05 * continuanceMod
  );

  return Object.freeze({
    riskScore,
    instability,
    outageLikelihood,
    driftRisk,
    organismPressure,
    hormoneMod,
    memoryMod,
    continuanceMod,
    fusedArteries: fused,
    latestPower: latest
  });
}

// ============================================================================
//  RISK SUMMARY — HUMAN‑READABLE LEVELS
// ============================================================================

export function buildPowerRiskSummary({ riskVector, continuance }) {
  const r = riskVector.riskScore;

  const level =
    r >= 0.85
      ? "critical"
      : r >= 0.65
      ? "high"
      : r >= 0.4
      ? "medium"
      : r >= 0.2
      ? "low"
      : "minimal";

  return Object.freeze({
    level,
    score: r,
    instability: riskVector.instability,
    outageLikelihood: riskVector.outageLikelihood,
    driftRisk: riskVector.driftRisk,
    organismPressure: riskVector.organismPressure,
    continuance: continuance || null
  });
}

// ============================================================================
//  BEACON SIGNALS — OVERMIND‑PRIME EARLY WARNINGS
// ============================================================================

export function buildPowerBeaconSignals({ riskVector, continuance, fusedArteries }) {
  const beacons = [];

  if (riskVector.riskScore >= 0.85) {
    beacons.push({
      type: "power-critical",
      severity: "critical",
      message: "Critical power risk detected — prepare fallback pathways."
    });
  }

  if (riskVector.outageLikelihood >= 0.7) {
    beacons.push({
      type: "power-outage-likely",
      severity: "high",
      message: "Outage likelihood elevated — pre-buffer content."
    });
  }

  if (riskVector.driftRisk >= 0.6) {
    beacons.push({
      type: "power-drift",
      severity: "medium",
      message: "Power schema or file drift detected — review grid ingestion."
    });
  }

  if (continuance?.continuanceScore <= 0.25) {
    beacons.push({
      type: "power-continuance-low",
      severity: "medium",
      message: "Continuance window shrinking — reduce load."
    });
  }

  return Object.freeze(beacons);
}

// ============================================================================
//  FULL 12.3+ PRESENCE / ADVANTAGE / FALLBACK / CHUNK PLAN
//  “Backbone for PulseBand / CheckBand / RouterMemory / Identity”
// ============================================================================

export function buildPowerRiskPresencePlan({
  power,
  history,
  fusedArteries,
  continuance,
  presenceContext = {},
  advantageContext = {},
  settings = {}
}) {
  const riskVector = computePowerRiskVector({
    power,
    history,
    fusedArteries,
    continuance,
    settings
  });

  const summary = buildPowerRiskSummary({ riskVector, continuance });
  const beacons = buildPowerBeaconSignals({
    riskVector,
    continuance,
    fusedArteries
  });

  const risk = riskVector.riskScore;
  const contScore = continuance?.continuanceScore ?? 0;

  // Fallback band ladder (0–3)
  let fallbackBandLevel = 0;
  if (risk >= 0.85 || contScore <= 0.2) {
    fallbackBandLevel = 3;
  } else if (risk >= 0.65 || contScore <= 0.35) {
    fallbackBandLevel = 2;
  } else if (risk >= 0.4 || contScore <= 0.5) {
    fallbackBandLevel = 1;
  }

  // PulseBand aggression (0–1, inverse of risk)
  const pulseBandAggression = norm(1 - risk);

  // Presence field
  const bandPresence = {
    band: presenceContext.band || "pulseband",
    deviceId: presenceContext.deviceId || null,
    hydraNodeId: presenceContext.hydraNodeId || null,
    route: presenceContext.route || "/"
  };

  const routerPresence = {
    routerHealthy: safeBool(presenceContext.routerHealthy, true),
    proxyHealthy: safeBool(presenceContext.proxyHealthy, true)
  };

  // Advantage field
  const advantage = {
    advantageScore: safeNum(advantageContext.advantageScore, 1.0),
    cascadeLevel: safeNum(advantageContext.cascadeLevel, 0),
    timeSavedMs: safeNum(advantageContext.timeSavedMs, 0),
    field: advantageContext.field || "power-risk"
  };

  // Chunk / cache / prewarm hints
  const route = bandPresence.route;

  const prewarmHints = {
    shouldPrewarm: risk >= 0.4 || contScore <= 0.5,
    targetRoutes: [route],
    targetBands: ["pulseband"],
    reason:
      risk >= 0.65
        ? "high_risk"
        : risk >= 0.4
        ? "medium_risk"
        : contScore <= 0.5
        ? "continuance_low"
        : "steady_state"
  };

  const cacheHints = {
    keepHot: risk >= 0.4 || contScore <= 0.5,
    priority:
      risk >= 0.85
        ? "critical"
        : risk >= 0.65
        ? "high"
        : risk >= 0.4
        ? "medium"
        : "normal",
    advantageScore: advantage.advantageScore
  };

  const chunkHints = {
    chunkAggression: pulseBandAggression,
    preferBinaryChunks: true,
    preferPresenceChunks: risk >= 0.4 || contScore <= 0.5
  };

  return Object.freeze({
    meta: {
      ...PowerRiskEngineMeta,
      mode: "presence-plan-12.3+"
    },
    riskVector,
    summary,
    beacons,
    fallbackBandLevel,
    pulseBandAggression,
    presenceField: {
      bandPresence,
      routerPresence
    },
    advantage,
    prewarmHints,
    cacheHints,
    chunkHints
  });
}
