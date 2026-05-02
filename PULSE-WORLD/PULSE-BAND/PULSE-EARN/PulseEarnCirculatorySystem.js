// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnCirculatorySystem-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE CIRCULATORY SYSTEM (v13.0-PRESENCE-IMMORTAL)
// (Deterministic Reflex + Routing + Weighting + Presence + Advantage-C + Multi-Instance)
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL):
//   THE CIRCULATORY SYSTEM — Pulse‑Earn’s autonomic routing center.
//   • Deterministically evaluates marketplaces (no real ping).
//   • Filters unhealthy ones using deterministic healthScore.
//   • Fetches jobs deterministically (no async, no network).
//   • Applies reputation weighting (synaptic strength).
//   • Applies presence/mesh/castle/expansion/globalHints advantage.
//   • Applies multi-instance + factoring-aware routing.
//   • Selects the best job for the device (autonomic prioritization).
//   • Emits v13‑Presence‑IMMORTAL routing signatures + loop/wave fields.
//   • Supports dual-band routing (symbolic + binary) as metadata-only.
//   • Uses ONLY provided capabilityModel; no internal device constants.
//
// PURPOSE (v13.0-PRESENCE-IMMORTAL):
//   • Provide deterministic, drift‑proof job routing.
//   • Guarantee safe multi‑marketplace discovery.
//   • Maintain healing metadata for the Immune System.
//   • Preserve autonomic routing + synaptic weighting.
//   • Expose routing loop/wave fields + presence/advantage/compute surfaces.
//   • Remain pure: no hardcoded device profile, no internal baseline.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE ROUTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO randomness, NO async.
//   • Deterministic job selection only.
//   • Dual-band is metadata-only (no non-deterministic branching).
//   • Presence/advantage/globalHints/capabilityModel are metadata-only.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnCirculatorySystem",
  version: "v14-IMMORTAL",
  layer: "earn_circulatory",
  role: "earn_circulation_and_flow",
  lineage: "PulseEarnCirculatorySystem-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    earnCirculation: true,
    jobFlow: true,
    nutrientFlow: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseEarn",
      "PulseEarnCell",
      "PulseEarnEndocrineSystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnCirculatorySystemMeta = Object.freeze({
  layer: "PulseEarnCirculatorySystem",
  role: "CIRCULATORY_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnCirculatorySystem-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureRouter: true,
    dualBandAware: true,
    binaryAware: true,
    evolutionAware: true,
    healingMetadataAware: true,
    loopFieldAware: true,
    waveFieldAware: true,

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

    // v13 IMMORTAL additions
    capabilityModelAware: true,
    performanceRatioAware: true
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceList",
      "MarketplaceHealth",
      "DualBandContext",
      "ReputationWeights",
      "RoutingCycleState",
      "GlobalHintsPresenceField",
      "CapabilityModel" // { cpuCores, memoryMB, gpuScore, performanceRatio } provided by caller
    ],
    output: [
      "BestJobSelection",
      "RoutingDiagnostics",
      "RoutingSignatures",
      "RoutingPresenceField",
      "RoutingAdvantageField",
      "RoutingComputeProfile"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v13.0-PRESENCE-IMMORTAL",
    ancestry: [
      "PulseEarnCirculatorySystem-v10",
      "PulseEarnCirculatorySystem-v11",
      "PulseEarnCirculatorySystem-v11-Evo",
      "PulseEarnCirculatorySystem-v12.3-PRESENCE-EVO+"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic routing + health evaluation (pure, capabilityModel-driven)",
    adaptive: "presence/advantage-aware weighting + multi-instance factoring + capabilityModel scaling",
    return: "deterministic best-job selection"
  })
});

// ============================================================================
// Dual-Band Constants — Symbolic + Binary (metadata-only)
// ============================================================================
const CIRC_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

function normalizeBand(band) {
  const b = String(band || CIRC_BANDS.SYMBOLIC).toLowerCase();
  return b === CIRC_BANDS.BINARY ? CIRC_BANDS.BINARY : CIRC_BANDS.SYMBOLIC;
}

// ============================================================================
// Healing Metadata — Circulatory Reflex Log (v13.0-PRESENCE-IMMORTAL)
// ============================================================================
const circulatoryHealing = {
  lastHealthError: null,
  lastFetchError: null,
  lastSelectionError: null,

  lastHealthyMarketplaces: [],
  lastJobsFetched: 0,
  lastBestJobId: null,

  cycleCount: 0,

  lastHealthSignature: null,
  lastJobListSignature: null,
  lastSelectionSignature: null,
  lastRoutingCycleSignature: null,

  lastBand: CIRC_BANDS.SYMBOLIC,
  lastLoopField: null,
  lastWaveField: null,
  lastAdvantageField: null,

  lastPresenceField: null,
  lastAdvantagePresenceField: null,
  lastHintsField: null,
  lastComputeProfile: null,

  // v13 capability + performance surfaces
  lastCapabilityModel: null,
  lastPerformanceRatio: 1
};

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

// ============================================================================
// Signature Builders
// ============================================================================
function buildHealthSignature(list) {
  return computeHash(`HEALTH::${list.join(",")}`);
}

function buildJobListSignature(count) {
  return computeHash(`JOBS::${count}`);
}

function buildSelectionSignature(jobId) {
  return computeHash(`SELECT::${jobId || "NONE"}`);
}

function buildRoutingCycleSignature(cycle, band) {
  return computeHash(`ROUTE_CYCLE::${cycle}::${normalizeBand(band)}`);
}

// ============================================================================
// Loop / Wave / Advantage Fields (Routing-Level)
// ============================================================================
function buildLoopField(jobs, band) {
  const count = Array.isArray(jobs) ? jobs.length : 0;
  const b = normalizeBand(band);

  return {
    loopDepth: count,
    closedLoop: count > 0,
    loopStrength: count * (b === CIRC_BANDS.BINARY ? 2 : 1),
    band: b
  };
}

function buildWaveField(jobs, band) {
  const count = Array.isArray(jobs) ? jobs.length : 0;
  const b = normalizeBand(band);

  return {
    wavelength: count || 1,
    amplitude: (count * 3) % 11,
    phase: (count * 5) % 16,
    band: b,
    mode: b === CIRC_BANDS.BINARY ? "compression-wave" : "symbolic-wave"
  };
}

function buildAdvantageFieldForRouting(jobs, band) {
  const count = Array.isArray(jobs) ? jobs.length : 0;
  const b = normalizeBand(band);

  return {
    jobCount: count,
    band: b,
    symbolicPlanningBias: b === CIRC_BANDS.SYMBOLIC ? 1 : 0,
    binaryCompressionBias: b === CIRC_BANDS.BINARY ? 1 : 0
  };
}

// ============================================================================
// Presence / Advantage / Hints / Compute Profile (v13 IMMORTAL)
// ============================================================================
function buildPresenceField(context = {}) {
  const gh = context.globalHints || {};
  const pf = context.presenceField || {};
  const mesh = context.meshSignals || {};
  const castle = context.castleSignals || {};
  const region = gh.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureIndex = Number(mesh.meshPressureIndex || 0);
  const castleLoadLevel = Number(castle.loadLevel || 0);

  const pressure = meshPressureIndex + castleLoadLevel;
  let presenceTier = "idle";
  if (pressure >= 150) presenceTier = "critical";
  else if (pressure >= 100) presenceTier = "high";
  else if (pressure >= 50) presenceTier = "elevated";
  else if (pressure > 0) presenceTier = "soft";

  return Object.freeze({
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: pf.bandPresence || gh.presenceContext?.bandPresence || "unknown",
    routerPresence: pf.routerPresence || gh.presenceContext?.routerPresence || "unknown",
    devicePresence: pf.devicePresence || gh.presenceContext?.devicePresence || "unknown",

    meshPresence: pf.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: pf.castlePresence || castle.castlePresence || "unknown",
    regionPresence: pf.regionPresence || region.regionTag || "unknown",

    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    presenceSignature: computeHash(
      `PRESENCE_V13::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  });
}

function buildAdvantagePresenceField(context = {}) {
  const gh = context.globalHints || {};
  const adv = gh.advantageContext || {};

  return Object.freeze({
    advantageVersion: "C-13.0",
    advantageScore: adv.score ?? 0,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? 0
  });
}

function buildHintsField(context = {}) {
  const gh = context.globalHints || {};
  return Object.freeze({
    fallbackBandLevel: gh.fallbackBandLevel ?? 0,
    chunkHints: gh.chunkHints || {},
    cacheHints: gh.cacheHints || {},
    prewarmHints: gh.prewarmHints || {},
    coldStartHints: gh.coldStartHints || {}
  });
}

function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function normalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function deriveFactoringSignal({ meshPressureIndex = 0, cachePriority = "normal", prewarmNeeded = false }) {
  const pressure = clamp01(meshPressureIndex / 100);
  const highPressure = pressure >= 0.7;
  const criticalCache = cachePriority === "critical";
  if (criticalCache || prewarmNeeded) return 1;
  if (highPressure) return 1;
  return 0;
}

function buildComputeProfile({ band, context = {}, capabilityModel = {} }) {
  const b = normalizeBand(band);
  const hintsField = buildHintsField(context);
  const cachePriority = normalizeCachePriority(hintsField.cacheHints.priority);
  const prewarmNeeded = !!hintsField.prewarmHints.shouldPrewarm;
  const meshPressureIndex = (context.meshSignals && context.meshSignals.meshPressureIndex) || 0;

  const factoringSignal = deriveFactoringSignal({
    meshPressureIndex,
    cachePriority,
    prewarmNeeded
  });

  const serverHints = context.serverAdvantageHints || {};
  const performanceRatio = capabilityModel.performanceRatio ?? 1;

  return Object.freeze({
    routeBand: b,
    fallbackBandLevel: hintsField.fallbackBandLevel,
    chunkAggression: hintsField.chunkHints.chunkAggression ?? 0,
    cachePriority,
    prewarmNeeded,
    binaryPreferred: b === CIRC_BANDS.BINARY,
    symbolicPreferred: b === CIRC_BANDS.SYMBOLIC,
    factoringSignal,
    performanceRatio,
    hotStateReuse: serverHints.hotStateReuse ?? true,
    multiInstanceBatching: serverHints.multiInstanceBatching ?? true,
    serverPlanCache: serverHints.planCache ?? true,
    serverBinaryReuse: serverHints.binaryReuse ?? true
  });
}

// ============================================================================
// Deterministic Marketplace Health Evaluation
// ============================================================================
function evaluateMarketplaceHealth(marketplace) {
  const h = typeof marketplace.healthScore === "number"
    ? marketplace.healthScore
    : 1.0;

  if (h >= 0.95) return "healthy";
  if (h >= 0.85) return "soft";
  if (h >= 0.50) return "mid";
  if (h >= 0.15) return "hard";
  return "critical";
}

// ============================================================================
// 1. discoverHealthyMarketplaces — Deterministic Sensory Reflex
// ============================================================================
export function discoverHealthyMarketplaces(marketplaces) {
  circulatoryHealing.cycleCount++;

  try {
    const healthy = [];

    for (const m of marketplaces) {
      const tier = evaluateMarketplaceHealth(m);
      if (tier === "healthy" || tier === "soft") {
        healthy.push(m);
      }
    }

    const ids = healthy.map(m => m.id);
    circulatoryHealing.lastHealthyMarketplaces = ids;
    circulatoryHealing.lastHealthSignature = buildHealthSignature(ids);

    return healthy;

  } catch (err) {
    circulatoryHealing.lastHealthError = err.message;
    return [];
  }
}

// ============================================================================
// 2. fetchJobsFromMarketplaces — Deterministic Intake
// ============================================================================
export function fetchJobsFromMarketplaces(marketplaces) {
  try {
    const allJobs = [];

    for (const m of marketplaces) {
      const jobs = Array.isArray(m.jobs) ? m.jobs : [];

      for (const j of jobs) {
        allJobs.push({
          ...j,
          marketplaceId: m.id
        });
      }
    }

    circulatoryHealing.lastJobsFetched = allJobs.length;
    circulatoryHealing.lastJobListSignature = buildJobListSignature(allJobs.length);

    return allJobs;

  } catch (err) {
    circulatoryHealing.lastFetchError = err.message;
    return [];
  }
}

// ============================================================================
// INTERNAL: Deterministic Job Capability Scoring (capabilityModel-driven)
// ============================================================================
function scoreJobForCapability(job, capabilityModel = {}) {
  const cpuRequired = job.cpuRequired ?? 0;
  const memRequired = job.memoryRequired ?? 0;
  const gpuRequired = job.gpuRequired ?? 0;

  const cpuCores = capabilityModel.cpuCores ?? 0;
  const memoryMB = capabilityModel.memoryMB ?? 0;
  const gpuScore = capabilityModel.gpuScore ?? 0;

  const cpuScore = cpuCores <= 0 ? 0 : (cpuCores >= cpuRequired ? 1 : 0.2);
  const memScore = memoryMB <= 0 ? 0 : (memoryMB >= memRequired ? 1 : 0.2);
  const gpuScoreNorm = gpuScore <= 0 ? 0 : (gpuScore >= gpuRequired ? 1 : 0.2);

  return (cpuScore + memScore + gpuScoreNorm) / 3;
}

// ============================================================================
// INTERNAL: Deterministic Band-Aware Job Score (v13 + capabilityModel)
// ============================================================================
function scoreJobWithBand(job, capabilityModel, band, context = {}) {
  const baseCapability = scoreJobForCapability(job, capabilityModel);
  const rep = job.reputationWeight ?? 0.5;

  const b = normalizeBand(band);
  const bandBias = b === CIRC_BANDS.BINARY ? 1.1 : 1.0;

  const presenceField = buildPresenceField(context);
  const meshPressure = presenceField.meshPressureIndex || 0;
  const hintsField = buildHintsField(context);
  const fallbackBandLevel = hintsField.fallbackBandLevel || 0;

  const pressureBias = 1 + (meshPressure / 300);
  const fallbackBias = 1 - (fallbackBandLevel * 0.05);

  const performanceRatio = capabilityModel.performanceRatio ?? 1;

  return baseCapability
    * (0.5 + rep)
    * bandBias
    * pressureBias
    * fallbackBias
    * performanceRatio;
}

// ============================================================================
// 3. selectBestJob — Deterministic Autonomic Prioritization (v13 IMMORTAL)
// ============================================================================
export function selectBestJob(jobs, band = CIRC_BANDS.SYMBOLIC, context = {}, capabilityModel = {}) {
  try {
    const normalizedBand = normalizeBand(band);

    let bestJob = null;
    let bestScore = -Infinity;

    for (const job of jobs) {
      if (!job.id || !job.marketplaceId) continue;

      const finalScore = scoreJobWithBand(job, capabilityModel, normalizedBand, context);

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestJob = job;
      }
    }

    if (bestJob) {
      circulatoryHealing.lastBestJobId = bestJob.id;
      circulatoryHealing.lastSelectionSignature = buildSelectionSignature(bestJob.id);
    }

    return bestJob;

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;
    return null;
  }
}

// ============================================================================
// 4. getNextJob — Full Autonomic Routing Cycle (v13 IMMORTAL)
// ============================================================================
// capabilityModel is REQUIRED for strict purity: no internal device assumptions.
export function getNextJob(
  allMarketplaces,
  getMarketplaceReputation,
  band = CIRC_BANDS.SYMBOLIC,
  context = {},
  capabilityModel = {}
) {
  const normalizedBand = normalizeBand(band);
  circulatoryHealing.lastBand = normalizedBand;
  circulatoryHealing.lastCapabilityModel = { ...capabilityModel };
  circulatoryHealing.lastPerformanceRatio = capabilityModel.performanceRatio ?? 1;

  try {
    const presenceField = buildPresenceField(context);
    const advantagePresenceField = buildAdvantagePresenceField(context);
    const hintsField = buildHintsField(context);
    const computeProfile = buildComputeProfile({ band: normalizedBand, context, capabilityModel });

    const healthy = discoverHealthyMarketplaces(allMarketplaces);
    if (healthy.length === 0) {
      circulatoryHealing.lastRoutingCycleSignature =
        buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

      circulatoryHealing.lastPresenceField = presenceField;
      circulatoryHealing.lastAdvantagePresenceField = advantagePresenceField;
      circulatoryHealing.lastHintsField = hintsField;
      circulatoryHealing.lastComputeProfile = computeProfile;

      return null;
    }

    const jobs = fetchJobsFromMarketplaces(healthy);
    if (jobs.length === 0) {
      circulatoryHealing.lastRoutingCycleSignature =
        buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

      circulatoryHealing.lastPresenceField = presenceField;
      circulatoryHealing.lastAdvantagePresenceField = advantagePresenceField;
      circulatoryHealing.lastHintsField = hintsField;
      circulatoryHealing.lastComputeProfile = computeProfile;

      return null;
    }

    const weightedJobs = jobs.map(job => {
      const rep = getMarketplaceReputation(job.marketplaceId);
      return { ...job, reputationWeight: rep };
    });

    const best = selectBestJob(weightedJobs, normalizedBand, context, capabilityModel);

    const loopField = buildLoopField(weightedJobs, normalizedBand);
    const waveField = buildWaveField(weightedJobs, normalizedBand);
    const advantageField = buildAdvantageFieldForRouting(weightedJobs, normalizedBand);

    circulatoryHealing.lastLoopField = loopField;
    circulatoryHealing.lastWaveField = waveField;
    circulatoryHealing.lastAdvantageField = advantageField;

    circulatoryHealing.lastPresenceField = presenceField;
    circulatoryHealing.lastAdvantagePresenceField = advantagePresenceField;
    circulatoryHealing.lastHintsField = hintsField;
    circulatoryHealing.lastComputeProfile = computeProfile;

    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

    return best;

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;

    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

    circulatoryHealing.lastPresenceField = buildPresenceField(context);
    circulatoryHealing.lastAdvantagePresenceField = buildAdvantagePresenceField(context);
    circulatoryHealing.lastHintsField = buildHintsField(context);
    circulatoryHealing.lastComputeProfile = buildComputeProfile({ band: normalizedBand, context, capabilityModel });

    return null;
  }
}

// ============================================================================
// Export Healing Metadata — Circulatory Reflex Report (v13.0-PRESENCE-IMMORTAL)
// ============================================================================
export function getPulseEarnCirculatorySystemHealingState() {
  return { ...circulatoryHealing };
}
