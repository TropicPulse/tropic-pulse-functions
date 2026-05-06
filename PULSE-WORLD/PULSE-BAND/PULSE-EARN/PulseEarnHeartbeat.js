// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseHeartbeat-v16-Immortal-INTEL.js
// PULSE OS — v16-Immortal-INTEL
// “THE BABY HEART / METABOLIC CELL + HEARTBEAT ENGINE”
// Formerly: PulseEarnCell-v16-Immortal-INTEL
// ============================================================================
//
// ROLE (v16-Immortal-INTEL):
//   THE EARN HEARTBEAT — Pulse‑Earn’s deterministic metabolic heart/cell organ.
//   • Acts as the Earn Heartbeat (Baby Heart) in the tri-heart mesh.
//   • Executes small, sandboxed, deterministic cell operations (computeWork).
//   • Emits v16‑IMMORTAL presence/advantage/hints/compute/speed/experience surfaces.
//   • Emits cell compute + GPU profile (metadata-only).
//   • Emits loop + wave + band/binary fields as structural metadata.
//   • Heartbeat wrapper (pulseEarnHeartbeat) advances cycles + surfaces.
//
// CONTRACT (v16-Immortal-INTEL):
//   • PURE COMPUTE + HEARTBEAT — no AI layers, no translation, no memory model.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO user scripts, NO network calls, NO filesystem access.
//   • NEVER mutate job objects.
//   • Deterministic output only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
//   • Heartbeat is metadata-only, no external side effects beyond globals.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnHeartbeat",
  version: "v16-Immortal-INTEL",
  layer: "earn_heart",
  role: "earn_metabolic_heartbeat",
  lineage: {
    root: "PulseOS-v16-Immortal-INTEL",
    parent: "PulseEarn-v16-Immortal-INTEL",
    ancestry: [
      "PulseEarnCell-v10",
      "PulseEarnCell-v11",
      "PulseEarnCell-v11-Evo",
      "PulseEarnCell-v12.3-Presence-Evo+",
      "PulseEarnCell-v13.0-Presence-Immortal",
      "PulseEarnHeartbeat-v16-Immortal-INTEL"
    ]
  },

  evo: {
    earnCell: true,
    earnHeartbeat: true,
    metabolicUnit: true,
    metabolicPacemaker: true,
    jobExecutor: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    pureHeartbeat: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroRandomness: true,

    // v16 IMMORTAL-INTEL
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    hotStateAware: true,
    factoringAware: true,
    gpuAware: true,
    minerAware: true,
    offlineAware: true,
    computeTierAware: true,
    pulseIntelligenceReady: true,

    // tri-heart
    triHeartAware: true,
    momHeartAware: true,
    dadHeartAware: true,
    babyHeartAware: true,
    presenceAware: true,
    advantageAware: true,
    speedAware: true,
    experienceAware: true,
    healingMetadataAware: true
  },

  contract: {
    input: [
      "EarnCellJob",
      "DualBandContext",
      "GlobalHintsPresenceField",
      "HeartbeatContext",
      "TriHeartContext"
    ],
    output: [
      "EarnCellResult",
      "EarnCellDiagnostics",
      "EarnCellSignatures",
      "EarnCellPresenceField",
      "EarnCellAdvantageField",
      "EarnCellComputeProfile",
      "EarnCellIntelligentPlan",
      "EarnHeartbeatBeat",
      "EarnHeartbeatDiagnostics",
      "EarnHeartbeatHealingState",
      "EarnHeartbeatSpeedField",
      "EarnHeartbeatAdvantageField",
      "EarnHeartbeatPresenceField",
      "EarnHeartbeatExperienceField",
      "TriHeartLivenessField",
      "TriHeartAdvantageField",
      "TriHeartSpeedField",
      "TriHeartPresenceField"
    ]
  },

  experience: {
    description:
      "The v16 Immortal Earn Heartbeat organ acts as both the deterministic cell worker " +
      "and the Baby Heart of the Earn subsystem. It executes safe, sandboxed compute jobs " +
      "and emits presence/advantage/speed/experience surfaces, while also participating " +
      "in a tri-heart mesh with Mom (Proxy Heart) and Dad (AI Heart).",
    aiUsageHint:
      "Use the EarnCell* fields to reason about deterministic compute behavior, and the " +
      "EarnHeartbeat* fields to reason about Earn's metabolic tempo, advantage, and load " +
      "relative to the rest of the organism."
  }
};
*/

export const PulseEarnHeartbeatMeta = Object.freeze({
  layer: "PulseEarnHeartbeat",
  role: "CELL_WORKER_HEARTBEAT",
  version: "v16-Immortal-INTEL",
  identity: "PulseEarnHeartbeat-v16-Immortal-INTEL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureCompute: true,
    pureHeartbeat: true,
    safeSandbox: true,
    dualBandAware: true,
    binaryAware: true,
    evolutionAware: true,
    healingMetadataAware: true,
    waveFieldAware: true,
    loopFieldAware: true,
    worldLensAware: false,

    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    expansionAware: true,
    meshAware: true,
    castleAware: true,
    regionAware: true,
    dualbandSafe: true,

    // v16 IMMORTAL-INTEL
    gpuAware: true,
    minerAware: true,
    offlineAware: true,
    computeTierAware: true,
    pulseIntelligenceReady: true,

    // tri-heart
    triHeartAware: true,
    momHeartAware: true,
    dadHeartAware: true,
    babyHeartAware: true,
    speedAware: true,
    experienceAware: true
  }),

  contract: Object.freeze({
    input: [
      "EarnCellJob",
      "DualBandContext",
      "GlobalHintsPresenceField",
      "HeartbeatContext",
      "TriHeartContext"
    ],
    output: [
      "EarnCellResult",
      "EarnCellDiagnostics",
      "EarnCellSignatures",
      "EarnCellPresenceField",
      "EarnCellAdvantageField",
      "EarnCellComputeProfile",
      "EarnCellIntelligentPlan",
      "EarnHeartbeatBeat",
      "EarnHeartbeatDiagnostics",
      "EarnHeartbeatHealingState",
      "EarnHeartbeatSpeedField",
      "EarnHeartbeatAdvantageField",
      "EarnHeartbeatPresenceField",
      "EarnHeartbeatExperienceField",
      "TriHeartLivenessField",
      "TriHeartAdvantageField",
      "TriHeartSpeedField",
      "TriHeartPresenceField"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v16-Immortal-INTEL",
    parent: "PulseEarn-v16-Immortal-INTEL",
    ancestry: [
      "PulseEarnCell-v10",
      "PulseEarnCell-v11",
      "PulseEarnCell-v11-Evo",
      "PulseEarnCell-v12.3-Presence-Evo+",
      "PulseEarnCell-v13.0-Presence-Immortal",
      "PulseEarnHeartbeat-v16-Immortal-INTEL"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only + deterministic compute"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic compute → metadata surfaces → unified return",
    adaptive: "healing metadata + advantage surfaces + presence/hints/compute surfaces + intelligent plan + heartbeat overlays",
    return: "deterministic structured output + heartbeat surfaces"
  })
});

// ============================================================================
// CELL / HEART CONTEXT METADATA
// ============================================================================
const EARN_HEART_CONTEXT = {
  layer: "PulseEarnHeartbeat-v16-Immortal-INTEL",
  role: "CELL_WORKER_HEARTBEAT",
  purpose: "Execute deterministic, sandboxed compute operations for Earn jobs and emit heartbeat surfaces",
  context: "Safe compute participant + healing metadata (cell + heart health)",
  version: "16-Immortal-INTEL"
};

// ============================================================================
// Dual-band constants (symbolic + binary) — metadata-only
// ============================================================================
const CELL_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

function normalizeBand(band) {
  const b = String(band || CELL_BANDS.SYMBOLIC).toLowerCase();
  return b === CELL_BANDS.BINARY ? CELL_BANDS.BINARY : CELL_BANDS.SYMBOLIC;
}

// ============================================================================
// Healing Metadata — Cell Health Log + Advantage Memory + Heartbeat
// ============================================================================
const MAX_ADV_HISTORY = 32;

const healingState = {
  lastJobType: null,
  lastError: null,
  lastOutput: null,
  continuanceFallback: false,

  cycleCount: 0,
  lastCycleIndex: 0,
  executionState: "idle", // idle | dispatching | executing | returning | error

  lastCellSignature: null,
  lastJobSignature: null,
  lastOutputSignature: null,

  lastHealthScore: 1.0,
  lastTier: "microDegrade",
  lastBand: CELL_BANDS.SYMBOLIC,
  lastAdvantageField: null,
  lastDiagnostics: null,
  lastLoopField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastPresenceAdvantageField: null,
  lastHintsField: null,
  lastComputeProfile: null,

  // v16: local advantage memory
  totalJobs: 0,
  successfulJobs: 0,
  failedJobs: 0,
  cumulativeAdvantageScore: 0,
  lastAdvantageHistory: [], // array of { jobType, advantageScore, advantageTier, band }

  // heartbeat overlays
  heartbeatCycles: 0,
  lastHeartbeatSpeedField: null,
  lastHeartbeatAdvantageField: null,
  lastHeartbeatPresenceField: null,
  lastHeartbeatExperienceField: null,
  lastHeartbeatCycleSignature: null,

  triHeartLiveness: null,
  triHeartAdvantage: null,
  triHeartSpeed: null,
  triHeartPresence: null,

  ...EARN_HEART_CONTEXT
};

function recordAdvantageMemory(jobType, band, advantageField) {
  const score = advantageField?.advantageScore ?? 0;
  const tier = advantageField?.advantageTier ?? 0;

  healingState.totalJobs += 1;
  healingState.cumulativeAdvantageScore += score;

  const entry = {
    jobType: jobType || "unknown",
    band: normalizeBand(band),
    advantageScore: score,
    advantageTier: tier
  };

  healingState.lastAdvantageHistory.push(entry);
  if (healingState.lastAdvantageHistory.length > MAX_ADV_HISTORY) {
    healingState.lastAdvantageHistory.shift();
  }
}

// ============================================================================
// Deterministic Hash Helper
// ============================================================================

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// Primary INTEL hash — deterministic, structure-aware, no IO, no time.
function computeHashIntelligence(payload) {
  const base = JSON.stringify(payload || "");
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    const c = base.charCodeAt(i);
    h = (h * 131 + c * (i + 7)) % 1000000007;
  }
  return `HINTEL_${h}`;
}

function buildDualHashSignature(label, intelPayload, classicString) {
  const intelBase = {
    label,
    intel: intelPayload || {},
    classic: classicString || ""
  };
  const intelHash = computeHashIntelligence(intelBase);
  const classicHash = computeHash(
    `${label}::${classicString || ""}`
  );
  return {
    intel: intelHash,
    classic: classicHash
  };
}

// ============================================================================
// Signature Builders
// ============================================================================
function buildCellSignature(cycle, band) {
  return buildDualHashSignature(`CELL::${cycle}::${normalizeBand(band)}`);
}

function buildJobSignature(type, band) {
  return buildDualHashSignature(`JOBTYPE::${normalizeBand(band)}::${type}`);
}

function buildOutputSignature(output, band) {
  return buildDualHashSignature(
    `OUTPUT::${normalizeBand(band)}::${JSON.stringify(output).length}`
  );
}

function buildHeartbeatCycleSignature(cycle) {
  return buildDualHashSignature(`EARN_HEARTBEAT_CYCLE::${cycle}`);
}

// ============================================================================
// Health / Tier
// ============================================================================
function computeHealthScore() {
  return 1.0;
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

// ============================================================================
// Presence / Advantage / Hints / Compute Profile from globalHints/context
// ============================================================================
function cwClamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function cwNormalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function buildPresenceFieldFromContext(context = {}) {
  const gh = context.globalHints || {};
  const pf = context.presenceField || {};
  const mesh = context.meshSignals || {};
  const castle = context.castleSignals || {};
  const region = gh.regionContext || {};

  const meshPressureIndex = mesh.meshPressureIndex || 0;
  const castleLoadLevel = castle.loadLevel || 0;
  const meshStrength = mesh.meshStrength || 0;

  const pressure = meshPressureIndex + castleLoadLevel;
  let presenceTier = "idle";
  if (pressure >= 150) presenceTier = "critical";
  else if (pressure >= 100) presenceTier = "high";
  else if (pressure >= 50) presenceTier = "elevated";
  else if (pressure > 0) presenceTier = "soft";

  const presenceSignature = buildDualHashSignature(
    `CELL_PRESENCE_V16::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
  );

  return Object.freeze({
    presenceVersion: "v16-Immortal-INTEL",
    presenceTier,
    presenceSignature,

    bandPresence: pf.bandPresence || gh.presenceContext?.bandPresence || "unknown",
    routerPresence: pf.routerPresence || gh.presenceContext?.routerPresence || "unknown",
    devicePresence: pf.devicePresence || gh.presenceContext?.devicePresence || "unknown",
    meshPresence: pf.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: pf.castlePresence || castle.castlePresence || "unknown",
    regionPresence: pf.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel,
    meshStrength,
    meshPressureIndex
  });
}

function buildAdvantageFieldFromHints(context = {}) {
  const gh = context.globalHints || {};
  const adv = gh.advantageContext || {};
  const compute = gh.computeContext || {};
  const gpu = compute.gpu || {};
  const miner = compute.miner || {};
  const offline = compute.offline || {};

  return Object.freeze({
    advantageVersion: "C-16.0",
    advantageScore: adv.score ?? 0,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? 0,

    gpuEligible: !!gpu.eligible,
    gpuPreferred: !!gpu.preferred,
    gpuTier: gpu.tier || "unknown",

    minerEligible: !!miner.eligible,
    minerTier: miner.tier || "unknown",

    offlineEligible: !!offline.eligible,
    offlineTier: offline.tier || "unknown"
  });
}

function buildHintsFieldFromHints(context = {}) {
  const gh = context.globalHints || {};
  return Object.freeze({
    fallbackBandLevel: gh.fallbackBandLevel ?? 0,
    chunkHints: gh.chunkHints || {},
    cacheHints: gh.cacheHints || {},
    prewarmHints: gh.prewarmHints || {},
    coldStartHints: gh.coldStartHints || {},
    computeHints: gh.computeHints || {}
  });
}

function deriveFactoringSignal({
  meshPressureIndex = 0,
  cachePriority = "normal",
  prewarmNeeded = false
}) {
  const pressure = cwClamp01(meshPressureIndex / 100);
  const highPressure = pressure >= 0.7;
  const criticalCache = cachePriority === "critical";
  if (criticalCache || prewarmNeeded) return 1;
  if (highPressure) return 1;
  return 0;
}

function buildComputeProfile({ band, context = {} }) {
  const b = normalizeBand(band);
  const hintsField = buildHintsFieldFromHints(context);
  const cachePriority = cwNormalizeCachePriority(hintsField.cacheHints.priority);
  const prewarmNeeded = !!hintsField.prewarmHints.shouldPrewarm;
  const meshPressureIndex =
    (context.meshSignals && context.meshSignals.meshPressureIndex) || 0;

  const factoringSignal = deriveFactoringSignal({
    meshPressureIndex,
    cachePriority,
    prewarmNeeded
  });

  const serverHints = context.serverAdvantageHints || {};
  const computeHints = hintsField.computeHints || {};
  const gpuHints = computeHints.gpu || {};
  const minerHints = computeHints.miner || {};
  const offlineHints = computeHints.offline || {};

  const gpuEligible = !!gpuHints.eligible;
  const gpuPreferred = !!gpuHints.preferred;
  const gpuTier = gpuHints.tier || "unknown";

  const minerEligible = !!minerHints.eligible;
  const minerTier = minerHints.tier || "unknown";

  const offlineEligible = !!offlineHints.eligible;
  const offlineTier = offlineHints.tier || "unknown";

  const computeTierHint = computeHints.computeTier || "normal";

  return Object.freeze({
    routeBand: b,
    fallbackBandLevel: hintsField.fallbackBandLevel,
    chunkAggression: hintsField.chunkAggression ?? hintsField.chunkHints.chunkAggression ?? 0,
    cachePriority,
    prewarmNeeded,
    binaryPreferred: b === CELL_BANDS.BINARY,
    symbolicPreferred: b === CELL_BANDS.SYMBOLIC,
    factoringSignal,

    hotStateReuse: serverHints.hotStateReuse ?? true,
    multiInstanceBatching: serverHints.multiInstanceBatching ?? true,
    serverPlanCache: serverHints.planCache ?? true,
    serverBinaryReuse: serverHints.binaryReuse ?? true,

    gpuEligible,
    gpuPreferred,
    gpuTier,
    minerEligible,
    minerTier,
    offlineEligible,
    offlineTier,
    computeTierHint
  });
}

// ============================================================================
// Advantage / Diagnostics / Loop / Wave
// ============================================================================
function buildAdvantageField(jobType, band, { computeProfile, presenceAdvantageField } = {}) {
  const b = normalizeBand(band);
  const cp = computeProfile || {};
  const pa = presenceAdvantageField || {};

  return Object.freeze({
    advantageVersion: "C-16.0",
    jobType,
    band: b,

    symbolicPlanningBias: b === CELL_BANDS.SYMBOLIC ? 1 : 0,
    binaryCompressionBias: b === CELL_BANDS.BINARY ? 1 : 0,

    // Presence / global advantage
    advantageScore: pa.advantageScore ?? 0,
    advantageBand: pa.advantageBand ?? "neutral",
    advantageTier: pa.advantageTier ?? 0,

    // Chunk / cache / prewarm / factoring / hot state
    chunkAggression: cp.chunkAggression ?? 0,
    cachePriority: cp.cachePriority || "normal",
    prewarmNeeded: !!cp.prewarmNeeded,
    factoringSignal: cp.factoringSignal ?? 0,
    hotStateReuse: cp.hotStateReuse ?? true,
    multiInstanceBatching: cp.multiInstanceBatching ?? true,
    serverPlanCache: cp.serverPlanCache ?? true,
    serverBinaryReuse: cp.serverBinaryReuse ?? true,

    // Band preferences
    binaryPreferred: !!cp.binaryPreferred,
    symbolicPreferred: !!cp.symbolicPreferred,

    // GPU / miner / offline / compute tier
    gpuEligible: !!cp.gpuEligible,
    gpuPreferred: !!cp.gpuPreferred,
    gpuTier: cp.gpuTier || "unknown",
    minerEligible: !!cp.minerEligible,
    minerTier: cp.minerTier || "unknown",
    offlineEligible: !!cp.offlineEligible,
    offlineTier: cp.offlineTier || "unknown",
    computeTierHint: cp.computeTierHint || "normal"
  });
}

function buildDiagnostics(jobType, band, healthScore, tier) {
  const b = normalizeBand(band);

  return {
    jobType,
    band: b,
    healthScore,
    tier,
    bandMode:
      b === CELL_BANDS.BINARY ? "binary-compression" : "symbolic-planning"
  };
}

function buildLoopField(cycle, band) {
  const b = normalizeBand(band);
  return {
    cycle,
    closedLoop: cycle > 0,
    loopStrength: cycle * (b === CELL_BANDS.BINARY ? 2 : 1),
    band: b
  };
}

function buildWaveField(jobType, band) {
  const len = String(jobType || "").length;
  const b = normalizeBand(band);

  return {
    wavelength: len,
    amplitude: len % 7,
    phase: (len * 3) % 8,
    band: b,
    mode: b === CELL_BANDS.BINARY ? "compression-wave" : "symbolic-wave"
  };
}

// ============================================================================
// ⭐ Pulse Intelligence (logic-only, IMMORTAL-safe)
// ============================================================================
function computePulseIntelligence({
  advantageField,
  presenceField,
  factoringSignal,
  band
}) {
  const advantageScore = advantageField.advantageScore || 0;
  const advantageTier = advantageField.advantageTier || 0;

  const presenceTier = presenceField.presenceTier || "idle";
  const presenceWeight =
    presenceTier === "critical"
      ? 1.0
      : presenceTier === "high"
      ? 0.8
      : presenceTier === "elevated"
      ? 0.6
      : presenceTier === "soft"
      ? 0.4
      : 0.2;

  const factoring = factoringSignal ? 1 : 0;
  const bandIsBinary = band === "binary" ? 1 : 0;

  const solvednessScore = Math.max(
    0,
    Math.min(
      advantageScore * 10 * 0.5 + presenceWeight * 0.3 + factoring * 0.2,
      1
    )
  );

  const computeTier =
    solvednessScore >= 0.9
      ? "nearSolution"
      : solvednessScore >= 0.7
      ? "highValue"
      : solvednessScore >= 0.4
      ? "normal"
      : solvednessScore >= 0.2
      ? "lowPriority"
      : "avoidCompute";

  const readinessScore = Math.max(
    0,
    Math.min(
      solvednessScore * 0.6 +
        (bandIsBinary ? 0.2 : 0) +
        (advantageTier >= 2 ? 0.2 : advantageTier === 1 ? 0.1 : 0),
      1
    )
  );

  return {
    solvednessScore,
    factoringSignal: factoring ? "high" : "low",
    computeTier,
    readinessScore,
    band,
    advantageTier
  };
}

// ============================================================================
// ⭐ Intelligent Compute Plan (pure, deterministic)
// ============================================================================
function buildIntelligentComputePlan({
  job,
  band,
  presenceField,
  presenceAdvantageField,
  computeProfile
}) {
  const jobType = job?.type || "unknown";
  const b = normalizeBand(band);

  const baseAdvantage = {
    advantageScore: presenceAdvantageField.advantageScore ?? 0,
    advantageTier: presenceAdvantageField.advantageTier ?? 0
  };

  const avgAdvantage =
    healingState.totalJobs > 0
      ? healingState.cumulativeAdvantageScore / healingState.totalJobs
      : 0;

  const pressureTier = presenceField.presenceTier || "idle";
  const highPressure =
    pressureTier === "critical" || pressureTier === "high";

  const preferBinary =
    computeProfile.binaryPreferred ||
    (highPressure && computeProfile.gpuEligible);

  const preferGPU =
    computeProfile.gpuEligible &&
    (computeProfile.gpuPreferred || baseAdvantage.advantageTier >= 2);

  const preferMiner =
    computeProfile.minerEligible &&
    !preferGPU &&
    (pressureTier === "elevated" || pressureTier === "high");

  const preferOffline =
    computeProfile.offlineEligible &&
    !preferGPU &&
    !preferMiner &&
    pressureTier === "soft";

  let refinedComputeTier = computeProfile.computeTierHint || "normal";
  if (avgAdvantage >= 0.8 && baseAdvantage.advantageTier >= 2) {
    refinedComputeTier = "highValue";
  } else if (avgAdvantage <= 0.2 && !highPressure) {
    refinedComputeTier = "lowPriority";
  }

  const plan = {
    planVersion: "CELL-INTEL-16.0",
    jobType,
    band: b,

    // routing
    routeBand: preferBinary ? CELL_BANDS.BINARY : CELL_BANDS.SYMBOLIC,

    // compute placement
    useGPU: preferGPU,
    useMiner: preferMiner,
    useOffline: preferOffline,

    // tiering
    computeTier: refinedComputeTier,

    // prewarm / cache / chunk
    shouldPrewarm: !!computeProfile.prewarmNeeded,
    cachePriority: computeProfile.cachePriority,
    chunkAggression: computeProfile.chunkAggression,

    // factoring / hot state
    factoringSignal: computeProfile.factoringSignal,
    hotStateReuse: computeProfile.hotStateReuse,
    multiInstanceBatching: computeProfile.multiInstanceBatching,
    serverPlanCache: computeProfile.serverPlanCache,
    serverBinaryReuse: computeProfile.serverBinaryReuse,

    // local advantage memory snapshot
    localAdvantageMemory: {
      totalJobs: healingState.totalJobs,
      successfulJobs: healingState.successfulJobs,
      failedJobs: healingState.failedJobs,
      averageAdvantageScore: avgAdvantage
    }
  };

  return Object.freeze(plan);
}

// ============================================================================
// Deterministic Cell Workloads
// ============================================================================
function textTransform({ text = "", mode = "upper" }) {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "reverse":
      return text.split("").reverse().join("");
    default:
      throw new Error(`Unknown text mode: ${mode}`);
  }
}

function mathCompute({ operation, values = [] }) {
  const nums = Array.isArray(values)
    ? values.map((v) => Number(v)).filter((v) => Number.isFinite(v))
    : [];
  switch (operation) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.length
        ? nums.reduce((a, b) => a + b, 0) / nums.length
        : 0;
    case "max":
      return nums.length ? Math.max(...nums) : -Infinity;
    case "min":
      return nums.length ? Math.min(...nums) : Infinity;
    default:
      throw new Error(`Unknown math operation: ${operation}`);
  }
}

function dataAggregate({ items = [], field }) {
  if (!field) throw new Error("Missing field for data.aggregate");
  return items.map((item) => item[field]);
}

function jsonTransform({ json, pick }) {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON payload");
  }

  if (!pick) return json;

  const out = {};
  for (const key of pick) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      out[key] = json[key];
    }
  }
  return out;
}

// ============================================================================
// computeWork — v16 IMMORTAL-INTEL Cell Execution
// ============================================================================
export function computeWork(job, context = {}) {
  healingState.cycleCount++;
  healingState.lastCycleIndex = healingState.cycleCount;
  healingState.executionState = "dispatching";

  const band = normalizeBand(job && job.band);
  healingState.lastBand = band;

  const presenceField = buildPresenceFieldFromContext(context);
  const presenceAdvantageField = buildAdvantageFieldFromHints(context);
  const hintsField = buildHintsFieldFromHints(context);
  const computeProfile = buildComputeProfile({ band, context });

  const intelligentPlan = buildIntelligentComputePlan({
    job,
    band,
    presenceField,
    presenceAdvantageField,
    computeProfile
  });

  healingState.lastPresenceField = presenceField;
  healingState.lastPresenceAdvantageField = presenceAdvantageField;
  healingState.lastHintsField = hintsField;
  healingState.lastComputeProfile = computeProfile;

  try {
    if (!job || !job.type || !job.payload) {
      healingState.lastError = "invalid_job_structure";
      healingState.executionState = "error";
      healingState.continuanceFallback = true;
      healingState.failedJobs += 1;

      const healthScore = computeHealthScore();
      const tier = classifyDegradationTier(healthScore);
      const advantageField = buildAdvantageField("invalid", band, {
        computeProfile,
        presenceAdvantageField
      });
      const diagnostics = buildDiagnostics("invalid", band, healthScore, tier);
      const loopField = buildLoopField(healingState.cycleCount, band);
      const waveField = buildWaveField("invalid", band);

      const pulseIntelligence = computePulseIntelligence({
        advantageField,
        presenceField,
        factoringSignal: computeProfile.factoringSignal,
        band
      });

      healingState.lastHealthScore = healthScore;
      healingState.lastTier = tier;
      healingState.lastAdvantageField = advantageField;
      healingState.lastDiagnostics = diagnostics;
      healingState.lastLoopField = loopField;
      healingState.lastWaveField = waveField;

      healingState.lastCellSignature = buildCellSignature(
        healingState.cycleCount,
        band
      );

      recordAdvantageMemory("invalid", band, advantageField);

      return {
        success: false,
        error: "Invalid job structure",
        durationCycles: healingState.cycleCount,
        band,
        healthScore,
        tier,
        advantageField,
        diagnostics,
        loopField,
        waveField,
        cellSignature: healingState.lastCellSignature,
        continuanceFallback: true,
        presenceField,
        presenceAdvantageField,
        hintsField,
        computeProfile,
        intelligentPlan,

        pulseIntelligence,
        pulseIntelligenceSignature: buildDualHashSignature(
          JSON.stringify(pulseIntelligence)
        ),

        ...EARN_HEART_CONTEXT
      };
    }

    const { type, payload } = job;
    healingState.lastJobType = type;
    healingState.lastJobSignature = buildJobSignature(type, band);

    healingState.executionState = "executing";
    healingState.continuanceFallback = false;

    let output;

    switch (type) {
      case "text.transform":
        output = textTransform(payload);
        break;

      case "math.compute":
        output = mathCompute(payload);
        break;

      case "data.aggregate":
        output = dataAggregate(payload);
        break;

      case "json.transform":
        output = jsonTransform(payload);
        break;

      default: {
        healingState.lastError = "unknown_job_type";
        healingState.executionState = "error";
        healingState.continuanceFallback = true;
        healingState.failedJobs += 1;

        const uHealthScore = computeHealthScore();
        const uTier = classifyDegradationTier(uHealthScore);
        const uAdvantageField = buildAdvantageField(type, band, {
          computeProfile,
          presenceAdvantageField
        });
        const uDiagnostics = buildDiagnostics(
          type,
          band,
          uHealthScore,
          uTier
        );
        const uLoopField = buildLoopField(healingState.cycleCount, band);
        const uWaveField = buildWaveField(type, band);

        const uPulseIntelligence = computePulseIntelligence({
          advantageField: uAdvantageField,
          presenceField,
          factoringSignal: computeProfile.factoringSignal,
          band
        });

        healingState.lastHealthScore = uHealthScore;
        healingState.lastTier = uTier;
        healingState.lastAdvantageField = uAdvantageField;
        healingState.lastDiagnostics = uDiagnostics;
        healingState.lastLoopField = uLoopField;
        healingState.lastWaveField = uWaveField;

        healingState.lastCellSignature = buildCellSignature(
          healingState.cycleCount,
          band
        );

        recordAdvantageMemory(type, band, uAdvantageField);

        return {
          success: false,
          error: `Unknown job type: ${type}`,
          durationCycles: healingState.cycleCount,
          band,
          healthScore: uHealthScore,
          tier: uTier,
          advantageField: uAdvantageField,
          diagnostics: uDiagnostics,
          loopField: uLoopField,
          waveField: uWaveField,
          cellSignature: healingState.lastCellSignature,
          continuanceFallback: true,
          presenceField,
          presenceAdvantageField,
          hintsField,
          computeProfile,
          intelligentPlan,

          pulseIntelligence: uPulseIntelligence,
          pulseIntelligenceSignature: buildDualHashSignature(
            JSON.stringify(uPulseIntelligence)
          ),

          ...EARN_HEART_CONTEXT
        };
      }
    }

    healingState.lastOutput = output;
    healingState.lastOutputSignature = buildOutputSignature(output, band);
    healingState.lastError = null;
    healingState.executionState = "returning";
    healingState.successfulJobs += 1;

    const healthScore = computeHealthScore();
    const tier = classifyDegradationTier(healthScore);
    const advantageField = buildAdvantageField(type, band, {
      computeProfile,
      presenceAdvantageField
    });
    const diagnostics = buildDiagnostics(type, band, healthScore, tier);
    const loopField = buildLoopField(healingState.cycleCount, band);
    const waveField = buildWaveField(type, band);

    const pulseIntelligence = computePulseIntelligence({
      advantageField,
      presenceField,
      factoringSignal: computeProfile.factoringSignal,
      band
    });

    healingState.lastHealthScore = healthScore;
    healingState.lastTier = tier;
    healingState.lastAdvantageField = advantageField;
    healingState.lastDiagnostics = diagnostics;
    healingState.lastLoopField = loopField;
    healingState.lastWaveField = waveField;

    healingState.lastCellSignature = buildCellSignature(
      healingState.cycleCount,
      band
    );

    recordAdvantageMemory(type, band, advantageField);

    return {
      success: true,
      output,
      durationCycles: healingState.cycleCount,
      band,
      healthScore,
      tier,
      advantageField,
      diagnostics,
      loopField,
      waveField,
      cellSignature: healingState.lastCellSignature,
      continuanceFallback: false,
      presenceField,
      presenceAdvantageField,
      hintsField,
      computeProfile,
      intelligentPlan,

      pulseIntelligence,
      pulseIntelligenceSignature: buildDualHashSignature(
        JSON.stringify(pulseIntelligence)
      ),

      ...EARN_HEART_CONTEXT
    };
  } catch (err) {
    const msg = String(err || "unknown_error");

    healingState.lastError = msg;
    healingState.executionState = "error";
    healingState.continuanceFallback = true;
    healingState.failedJobs += 1;

    const healthScore = computeHealthScore();
    const tier = classifyDegradationTier(healthScore);
    const advantageField = buildAdvantageField(
      healingState.lastJobType || "unknown",
      band,
      {
        computeProfile,
        presenceAdvantageField
      }
    );
    const diagnostics = buildDiagnostics(
      healingState.lastJobType || "unknown",
      band,
      healthScore,
      tier
    );
    const loopField = buildLoopField(healingState.cycleCount, band);
    const waveField = buildWaveField(
      healingState.lastJobType || "unknown",
      band
    );

    const pulseIntelligence = computePulseIntelligence({
      advantageField,
      presenceField,
      factoringSignal: computeProfile.factoringSignal,
      band
    });

    healingState.lastHealthScore = healthScore;
    healingState.lastTier = tier;
    healingState.lastAdvantageField = advantageField;
    healingState.lastDiagnostics = diagnostics;
    healingState.lastLoopField = loopField;
    healingState.lastWaveField = waveField;

    healingState.lastCellSignature = buildCellSignature(
      healingState.cycleCount,
      band
    );

    recordAdvantageMemory(
      healingState.lastJobType || "unknown",
      band,
      advantageField
    );

    return {
      success: false,
      error: msg,
      durationCycles: healingState.cycleCount,
      band,
      healthScore,
      tier,
      advantageField,
      diagnostics,
      loopField,
      waveField,
      cellSignature: healingState.lastCellSignature,
      continuanceFallback: true,
      presenceField,
      presenceAdvantageField,
      hintsField,
      computeProfile,
      intelligentPlan,

      pulseIntelligence,
      pulseIntelligenceSignature: buildDualHashSignature(
        JSON.stringify(pulseIntelligence)
      ),

      ...EARN_HEART_CONTEXT
    };
  }
}

// ============================================================================
// TRI-HEART FIELDS (MOM / DAD / BABY) FOR HEARTBEAT
// ============================================================================
function triHeartLiveness() {
  return {
    momAlive: (globalThis.PulseMomHeartbeatLastBeatAt || 0) > 0,
    dadAlive: (globalThis.PulseAIHeartbeatLastBeatAt || 0) > 0,
    babyAlive: true,
    triHeartSignature: buildDualHashSignature(
      `TRI_HEART_LIVE::${globalThis.PulseMomHeartbeatLastBeatAt || 0}::${globalThis.PulseAIHeartbeatLastBeatAt || 0}`
    )
  };
}

function triHeartAdvantage() {
  return {
    mom: globalThis.PulseMomAdvantageField || null,
    dad: globalThis.PulseAIAdvantageField || null,
    baby: healingState.lastHeartbeatAdvantageField || null
  };
}

function triHeartSpeed() {
  return {
    mom: globalThis.PulseMomSpeedField || null,
    dad: globalThis.PulseAISpeedField || null,
    baby: healingState.lastHeartbeatSpeedField || null
  };
}

function triHeartPresence() {
  return {
    mom: globalThis.PulseMomPresenceField || null,
    dad: globalThis.PulseAIPresenceField || null,
    baby: healingState.lastHeartbeatPresenceField || null
  };
}

// ============================================================================
// HEARTBEAT SURFACES (SPEED / ADVANTAGE / PRESENCE / EXPERIENCE)
// ============================================================================
function buildHeartbeatSpeedField({ cycle, triLive }) {
  const base = 0.4 + Math.min(0.2, cycle / 1000);
  const momBoost = triLive.momAlive ? 0.1 : 0;
  const dadBoost = triLive.dadAlive ? 0.1 : 0;
  const speedScore = Math.max(0, Math.min(1, base + momBoost + dadBoost));

  let speedBand = "steady";
  if (speedScore < 0.3) speedBand = "slow";
  else if (speedScore > 0.7) speedBand = "quickened";

  return {
    speedVersion: "EARN-HEART-16.0",
    speedScore,
    speedBand,
    speedSignature: buildDualHashSignature(
      `EARN_HEART_SPEED::${cycle}::${speedScore}::${speedBand}`
    )
  };
}

function buildHeartbeatAdvantageField({ cycle, speedField }) {
  const s = speedField.speedScore || 0;
  const baseAdv = 0.3 + s * 0.5;
  const advantageScore = Math.max(0, Math.min(1, baseAdv));

  let advantageTier = 0;
  if (advantageScore >= 0.8) advantageTier = 3;
  else if (advantageScore >= 0.6) advantageTier = 2;
  else if (advantageScore >= 0.4) advantageTier = 1;

  return {
    advantageVersion: "EARN-HEART-16.0",
    advantageScore,
    advantageTier,
    advantageBand: advantageScore >= 0.7 ? "high" : "normal",
    advantageSignature: buildDualHashSignature(
      `EARN_HEART_ADV::${cycle}::${advantageScore}::${advantageTier}`
    )
  };
}

function buildHeartbeatPresenceField({ cycle, triLive }) {
  const pressure =
    (triLive.momAlive ? 1 : 0) +
    (triLive.dadAlive ? 1 : 0) +
    (triLive.babyAlive ? 1 : 0);

  let presenceTier = "idle";
  if (pressure === 1) presenceTier = "soft";
  else if (pressure === 2) presenceTier = "elevated";
  else if (pressure === 3) presenceTier = "high";

  return {
    presenceVersion: "EARN-HEART-16.0",
    presenceTier,
    presenceSignature: buildDualHashSignature(
      `EARN_HEART_PRESENCE::${cycle}::${presenceTier}::${pressure}`
    ),
    triHeartPressure: pressure
  };
}

function buildHeartbeatExperienceField({ cycle, speedField, advantageField, presenceField }) {
  const load =
    presenceField.presenceTier === "high"
      ? "heavy"
      : presenceField.presenceTier === "elevated"
      ? "moderate"
      : presenceField.presenceTier === "soft"
      ? "light"
      : "idle";

  const experienceScore = Math.max(
    0,
    Math.min(
      (speedField.speedScore * 0.4) +
        (advantageField.advantageScore * 0.4) +
        (presenceField.triHeartPressure * 0.2) / 3,
      1
    )
  );

  return {
    experienceVersion: "EARN-HEART-16.0",
    load,
    experienceScore,
    experienceSignature: buildDualHashSignature(
      `EARN_HEART_EXPERIENCE::${cycle}::${load}::${experienceScore}`
    )
  };
}

// ============================================================================
// HEARTBEAT ENTRY — ONE CALL = ONE EARN HEART BEAT
// ============================================================================
export function pulseEarnHeartbeat(heartbeatContext = {}, triHeartContext = {}) {
  healingState.heartbeatCycles += 1;
  const cycle = healingState.heartbeatCycles;

  // Deterministic cycle signature
  healingState.lastHeartbeatCycleSignature = buildHeartbeatCycleSignature(cycle);

  // Tri-heart liveness (mom + dad + baby)
  const triLive = triHeartLiveness();

  // Speed field (Earn = job-driven pacer)
  const speedField = buildHeartbeatSpeedField({
    cycle,
    triLive
  });

  // Advantage field (Earn = metabolic + job pressure)
  const advantageField = buildHeartbeatAdvantageField({
    cycle,
    speedField
  });

  // Presence field (Earn = job presence + tri-heart context)
  const presenceField = buildHeartbeatPresenceField({
    cycle,
    triLive
  });

  // Experience field (Earn = combined presence + speed + advantage)
  const experienceField = buildHeartbeatExperienceField({
    cycle,
    speedField,
    advantageField,
    presenceField
  });

  // Store last heartbeat surfaces
  healingState.lastHeartbeatSpeedField = speedField;
  healingState.lastHeartbeatAdvantageField = advantageField;
  healingState.lastHeartbeatPresenceField = presenceField;
  healingState.lastHeartbeatExperienceField = experienceField;

  // Tri-heart surfaces (Earn’s perspective)
  healingState.triHeartLiveness = triLive;
  healingState.triHeartAdvantage = triHeartAdvantage();
  healingState.triHeartSpeed = triHeartSpeed();
  healingState.triHeartPresence = triHeartPresence();

  // Global liveness surfaces for Mom + Dad hearts
  globalThis.PulseEarnHeartbeatLastBeatAt = Date.now();
  globalThis.PulseEarnAdvantageField = advantageField;
  globalThis.PulseEarnSpeedField = speedField;
  globalThis.PulseEarnPresenceField = presenceField;
  globalThis.PulseEarnExperienceField = experienceField;

  // Return Earn heartbeat packet
  const beat = {
    ok: true,
    cycle,
    heartbeatCycleSignature: healingState.lastHeartbeatCycleSignature,

    speedField,
    advantageField,
    presenceField,
    experienceField,

    triHeartLiveness: healingState.triHeartLiveness,
    triHeartAdvantage: healingState.triHeartAdvantage,
    triHeartSpeed: healingState.triHeartSpeed,
    triHeartPresence: healingState.triHeartPresence,

    heartbeatContext,
    triHeartContext,
    ...EARN_HEART_CONTEXT
  };

  return beat;
}

// ============================================================================
// HEALING STATE + DIAGNOSTICS
// ============================================================================
export function getPulseEarnHeartbeatHealingState() {
  return { ...healingState };
}

export function getPulseEarnHeartbeatDiagnostics() {
  return {
    cycles: healingState.cycleCount,
    heartbeatCycles: healingState.heartbeatCycles,

    lastJobType: healingState.lastJobType,
    lastError: healingState.lastError,
    lastOutput: healingState.lastOutput,
    lastExitReason: healingState.executionState,

    lastCellSignature: healingState.lastCellSignature,
    lastJobSignature: healingState.lastJobSignature,
    lastOutputSignature: healingState.lastOutputSignature,

    lastHealthScore: healingState.lastHealthScore,
    lastTier: healingState.lastTier,
    lastBand: healingState.lastBand,

    lastAdvantageField: healingState.lastAdvantageField,
    lastDiagnostics: healingState.lastDiagnostics,
    lastLoopField: healingState.lastLoopField,
    lastWaveField: healingState.lastWaveField,
    lastPresenceField: healingState.lastPresenceField,
    lastPresenceAdvantageField: healingState.lastPresenceAdvantageField,
    lastHintsField: healingState.lastHintsField,
    lastComputeProfile: healingState.lastComputeProfile,
    lastAdvantageHistory: healingState.lastAdvantageHistory,

    // Heartbeat surfaces
    lastHeartbeatSpeedField: healingState.lastHeartbeatSpeedField,
    lastHeartbeatAdvantageField: healingState.lastHeartbeatAdvantageField,
    lastHeartbeatPresenceField: healingState.lastHeartbeatPresenceField,
    lastHeartbeatExperienceField: healingState.lastHeartbeatExperienceField,
    lastHeartbeatCycleSignature: healingState.lastHeartbeatCycleSignature,

    // Tri-heart surfaces
    triHeartLiveness: healingState.triHeartLiveness,
    triHeartAdvantage: healingState.triHeartAdvantage,
    triHeartSpeed: healingState.triHeartSpeed,
    triHeartPresence: healingState.triHeartPresence,

    ...EARN_HEART_CONTEXT
  };
}
