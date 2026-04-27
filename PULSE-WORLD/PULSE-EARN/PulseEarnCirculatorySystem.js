// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnCirculatorySystem-v11-Evo.js
// LAYER: THE CIRCULATORY SYSTEM (v11-Evo)
// (Deterministic Reflex + Routing + Weighting + Dual-Band + Loop/Wave Fields)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE CIRCULATORY SYSTEM — Pulse‑Earn’s autonomic routing center.
//   • Evaluates marketplaces deterministically (no real ping).
//   • Filters unhealthy ones using deterministic healthScore.
//   • Fetches jobs deterministically (no async, no network).
//   • Applies reputation weighting (synaptic strength).
//   • Selects the best job for the device (autonomic prioritization).
//   • Emits v11‑Evo routing signatures + loop/wave fields.
//   • Supports dual-band routing (symbolic + binary) as metadata-only.
//
// PURPOSE (v11-Evo):
//   • Provide deterministic, drift‑proof job routing.
//   • Guarantee safe multi‑marketplace discovery.
//   • Maintain healing metadata for the Immune System.
//   • Preserve autonomic routing + synaptic weighting.
//   • Expose routing loop/wave fields + band-aware advantage.
//
// CONTRACT (v11-Evo):
//   • PURE ROUTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO randomness, NO async.
//   • Deterministic job selection only.
//   • Dual-band is metadata-only (no non-deterministic branching).
// ============================================================================
export const PulseEarnCirculatorySystemMeta = Object.freeze({
  layer: "PulseEarnCirculatorySystem",
  role: "CIRCULATORY_ORGAN",
  version: "v11.2-EVO",
  identity: "PulseEarnCirculatorySystem-v11.2-EVO",

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
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceList",
      "MarketplaceHealth",
      "DualBandContext",
      "ReputationWeights",
      "RoutingCycleState"
    ],
    output: [
      "BestJobSelection",
      "RoutingDiagnostics",
      "RoutingSignatures"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
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
    adaptive: "reputation weighting + advantage surfaces",
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
// Healing Metadata — Circulatory Reflex Log (v11-Evo)
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

  // v11-Evo+ — band + loop/wave/advantage fields
  lastBand: CIRC_BANDS.SYMBOLIC,
  lastLoopField: null,
  lastWaveField: null,
  lastAdvantageField: null
};


// ============================================================================
// Deterministic Hash Helper — v11-Evo
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
// Signature Builders — v11-Evo
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
// Deterministic Marketplace Health Evaluation (NO NETWORK)
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
// INTERNAL: Deterministic Device Profile (v11-Evo)
// ============================================================================
function getDeviceProfile() {
  return {
    cpuCores: 8,
    memoryMB: 16384,
    gpuScore: 600
  };
}


// ============================================================================
// INTERNAL: Deterministic Job Capability Scoring (v11-Evo)
// ============================================================================
function scoreJobForDevice(job, device) {
  const cpu = job.cpuRequired ?? 0;
  const mem = job.memoryRequired ?? 0;

  const cpuScore = device.cpuCores >= cpu ? 1 : 0.2;
  const memScore = device.memoryMB >= mem ? 1 : 0.2;

  return (cpuScore + memScore) / 2;
}


// ============================================================================
// INTERNAL: Deterministic Band-Aware Job Score (v11-Evo)
// ============================================================================
function scoreJobWithBand(job, device, band) {
  const baseCapability = scoreJobForDevice(job, device);
  const rep = job.reputationWeight ?? 0.5;

  const b = normalizeBand(band);
  const bandBias = b === CIRC_BANDS.BINARY ? 1.1 : 1.0;

  // deterministic, multiplicative advantage field
  return baseCapability * (0.5 + rep) * bandBias;
}


// ============================================================================
// 3. selectBestJob — Deterministic Autonomic Prioritization (Band-Aware)
// ============================================================================
export function selectBestJob(jobs, band = CIRC_BANDS.SYMBOLIC) {
  try {
    const device = getDeviceProfile();
    const normalizedBand = normalizeBand(band);

    let bestJob = null;
    let bestScore = -Infinity;

    for (const job of jobs) {
      if (!job.id || !job.marketplaceId) continue;

      const finalScore = scoreJobWithBand(job, device, normalizedBand);

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
// 4. getNextJob — Full Autonomic Routing Cycle (Deterministic + Dual-Band)
// ============================================================================
//
// band parameter:
//   • "symbolic" — planning-first routing
//   • "binary"   — compression-first routing (metadata-only bias)
//
export function getNextJob(allMarketplaces, getMarketplaceReputation, band = CIRC_BANDS.SYMBOLIC) {
  const normalizedBand = normalizeBand(band);
  circulatoryHealing.lastBand = normalizedBand;

  try {
    const healthy = discoverHealthyMarketplaces(allMarketplaces);
    if (healthy.length === 0) {
      circulatoryHealing.lastRoutingCycleSignature =
        buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);
      return null;
    }

    const jobs = fetchJobsFromMarketplaces(healthy);
    if (jobs.length === 0) {
      circulatoryHealing.lastRoutingCycleSignature =
        buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);
      return null;
    }

    const weightedJobs = jobs.map(job => {
      const rep = getMarketplaceReputation(job.marketplaceId);
      return { ...job, reputationWeight: rep };
    });

    const best = selectBestJob(weightedJobs, normalizedBand);

    // loop/wave/advantage fields for this routing cycle
    const loopField = buildLoopField(weightedJobs, normalizedBand);
    const waveField = buildWaveField(weightedJobs, normalizedBand);
    const advantageField = buildAdvantageFieldForRouting(weightedJobs, normalizedBand);

    circulatoryHealing.lastLoopField = loopField;
    circulatoryHealing.lastWaveField = waveField;
    circulatoryHealing.lastAdvantageField = advantageField;

    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);

    return best;

  } catch (err) {
    circulatoryHealing.lastSelectionError = err.message;
    circulatoryHealing.lastRoutingCycleSignature =
      buildRoutingCycleSignature(circulatoryHealing.cycleCount, normalizedBand);
    return null;
  }
}


// ============================================================================
// Export Healing Metadata — Circulatory Reflex Report (v11-Evo)
// ============================================================================
export function getPulseEarnCirculatorySystemHealingState() {
  return { ...circulatoryHealing };
}
