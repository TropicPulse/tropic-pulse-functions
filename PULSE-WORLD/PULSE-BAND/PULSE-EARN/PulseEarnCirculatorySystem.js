// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnCirculatorySystem-v12.3-PRESENCE-EVO+.js
// LAYER: THE CIRCULATORY SYSTEM (v12.3-PRESENCE-EVO+)
// (Deterministic Reflex + Routing + Weighting + Presence + Advantage + Multi-Instance)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE CIRCULATORY SYSTEM — Pulse‑Earn’s autonomic routing center.
//   • Deterministically evaluates marketplaces (no real ping).
//   • Filters unhealthy ones using deterministic healthScore.
//   • Fetches jobs deterministically (no async, no network).
//   • Applies reputation weighting (synaptic strength).
//   • Applies presence/mesh/castle/expansion/globalHints advantage.
//   • Applies multi-instance + factoring-aware routing.
//   • Selects the best job for the device (autonomic prioritization).
//   • Emits v12.3‑Presence‑EVO+ routing signatures + loop/wave fields.
//   • Supports dual-band routing (symbolic + binary) as metadata-only.
//
// PURPOSE (v12.3-PRESENCE-EVO+):
//   • Provide deterministic, drift‑proof job routing.
//   • Guarantee safe multi‑marketplace discovery.
//   • Maintain healing metadata for the Immune System.
//   • Preserve autonomic routing + synaptic weighting.
//   • Expose routing loop/wave fields + presence/advantage surfaces.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE ROUTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO randomness, NO async.
//   • Deterministic job selection only.
//   • Dual-band is metadata-only (no non-deterministic branching).
//   • Presence/advantage/globalHints are metadata-only.
// ============================================================================

export const PulseEarnCirculatorySystemMeta = Object.freeze({
  layer: "PulseEarnCirculatorySystem",
  role: "CIRCULATORY_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnCirculatorySystem-v12.3-PRESENCE-EVO+",

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

    // Presence-EVO+ advantages
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
    dualbandSafe: true
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceList",
      "MarketplaceHealth",
      "DualBandContext",
      "ReputationWeights",
      "RoutingCycleState",
      "GlobalHintsPresenceField"
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
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnCirculatorySystem-v10",
      "PulseEarnCirculatorySystem-v11",
      "PulseEarnCirculatorySystem-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic routing + health evaluation",
    adaptive: "presence/advantage-aware weighting + multi-instance factoring",
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
// Healing Metadata — Circulatory Reflex Log (v12.3-PRESENCE-EVO+)
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

  // Presence-EVO+ additions
  lastPresenceField: null,
  lastAdvantagePresenceField: null,
  lastHintsField: null,
  lastComputeProfile: null
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
// Presence / Advantage / Hints / Compute Profile (v12.3)
// ============================================================================
function buildPresenceField(context = {}) {
  const gh = context.globalHints || {};
  const pf = context.presenceField || {};
  const mesh = context.meshSignals || {};
  const castle = context.castleSignals || {};
  const region = gh.regionContext || {};

  return Object.freeze({
    bandPresence: pf.bandPresence || gh.presenceContext?.bandPresence || "unknown",
    routerPresence: pf.routerPresence || gh.presenceContext?.routerPresence || "unknown",
    devicePresence: pf.devicePresence || gh.presenceContext?.devicePresence || "unknown",
    meshPresence: pf.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: pf.castlePresence || castle.castlePresence || "unknown",
    regionPresence: pf.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || "unknown",
    meshStrength: mesh.meshStrength || "unknown",
    meshPressureIndex: mesh.meshPressureIndex || 0
  });
}

function buildAdvantagePresenceField(context = {}) {
  const gh = context.globalHints || {};
  const adv = gh.advantageContext || {};

  return Object.freeze({
    advantageScore: adv.score ?? null,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? "unknown"
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

function buildComputeProfile({ band, context = {} }) {
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

  return Object.freeze({
    routeBand: b,
    fallbackBandLevel: hintsField.fallbackBandLevel,
    chunkAggression: hintsField.chunkHints.chunkAggression ?? 0,
    cachePriority,
    prewarmNeeded,
    binaryPreferred: b === CIRC_BANDS.BINARY,
    symbolicPreferred: b === CIRC_BANDS.SYMBOLIC,
    factoringSignal,
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
// INTERNAL: Deterministic Device Profile
// ============================================================================
function getDeviceProfile() {
  return {
    cpuCores: 8,
    memoryMB: 16384,
    gpuScore: 600
  };
}

// ============================================================================
// INTERNAL: Deterministic Job Capability Scoring
// ============================================================================
function scoreJobForDevice(job, device) {
  const cpu = job.cpuRequired ?? 0;
  const mem = job.memoryRequired ?? 0;

  const cpuScore = device.cpuCores >= cpu ? 1 : 0.2;
  const memScore = device.memoryMB >= mem ? 1 : 0.2;

  return (cpuScore + memScore) / 2;
}

// ============================================================================
// INTERNAL: Deterministic Band-Aware Job Score
// ============================================================================
function scoreJobWithBand(job, device, band, context = {}) {
  const baseCapability = scoreJobForDevice(job, device);
  const rep = job.reputationWeight ?? 0.5;

  const b = normalizeBand(band);
  const bandBias = b === CIRC_BANDS.BINARY ? 1.1 : 1.0;

  // Presence-EVO+ advantage multipliers
  const presenceField = buildPresenceField(context);
  const meshPressure = presenceField.meshPressureIndex || 0;
  const fallbackBandLevel = (context.globalHints && context.globalHints.fallbackBandLevel) || 0;

  const pressureBias = 1 + (meshPressure / 300); // small deterministic bias
  const fallbackBias = 1 - (fallbackBandLevel * 0.05);

  return baseCapability * (0.5 + rep) * bandBias * pressureBias * fallbackBias;
}

// ============================================================================
// 3. selectBestJob — Deterministic Autonomic Prioritization (Presence-EVO+)
// ============================================================================
export function selectBestJob(jobs, band = CIRC_BANDS.SYMBOLIC, context = {}) {
  try {
    const device = getDeviceProfile();
    const normalizedBand = normalizeBand(band);

    let bestJob = null;
    let bestScore = -Infinity;

    for (const job of jobs) {
      if (!job.id || !job.marketplaceId) continue;

      const finalScore = scoreJobWithBand(job, device, normalizedBand, context);

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
// 4. getNextJob — Full Autonomic Routing Cycle (Presence-EVO+)
// ============================================================================
export function getNextJob(allMarketplaces, getMarketplaceReputation, band = CIRC_BANDS.SYMBOLIC, context = {}) {
  const normalizedBand = normalizeBand(band);
  circulatoryHealing.lastBand = normalizedBand;

  try {
    const presenceField = buildPresenceField(context);
    const advantagePresenceField = buildAdvantagePresenceField(context);
    const hintsField = buildHintsField(context);
    const computeProfile = buildComputeProfile({ band: normalizedBand, context });

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

    // --- Presence‑EVO+ Autonomic Prioritization ---
    const best = selectBestJob(weightedJobs, normalizedBand, context);

    // loop/wave/advantage fields for this routing cycle
    const loopField = buildLoopField(weightedJobs, normalizedBand);
    const waveField = buildWaveField(weightedJobs, normalizedBand);
    const advantageField = buildAdvantageFieldForRouting(weightedJobs, normalizedBand);

    // store presence‑EVO+ surfaces
    circulatoryHealing.lastLoopField = loopField;
    circulatoryHealing.lastWaveField = waveField;
    circulatoryHealing.lastAdvantageField = advantageField;

    circulatoryHealing.lastPresenceField = presenceField;
    circulatoryHealing.lastAdvantagePresenceField = advantagePresenceField;
    circulatoryHealing.lastHintsField = hintsField;
    circulatoryHealing.lastComputeProfile = computeProfile;

    // routing cycle signature
    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

    return best;

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;

    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

    // preserve presence‑EVO+ surfaces even on failure
    circulatoryHealing.lastPresenceField = buildPresenceField(context);
    circulatoryHealing.lastAdvantagePresenceField = buildAdvantagePresenceField(context);
    circulatoryHealing.lastHintsField = buildHintsField(context);
    circulatoryHealing.lastComputeProfile = buildComputeProfile({ band: normalizedBand, context });

    return null;
  }
}
// ============================================================================
// Export Healing Metadata — Circulatory Reflex Report (v12.3-PRESENCE-EVO+)
// ============================================================================
export function getPulseEarnCirculatorySystemHealingState() {
  return { ...circulatoryHealing };
}
