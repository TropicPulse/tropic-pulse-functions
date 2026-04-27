// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnMktAuctioneer-v11-Evo.js
// LAYER: MARKETPLACE AUCTIONEER (v11‑Evo A‑B‑A)
// Vast.ai Deterministic Adapter
// ============================================================================
//
// ROLE (v11‑Evo A‑B‑A):
//   • Deterministic Vast.ai → Pulse‑Earn adapter.
//   • Pure receptor phenotype: ping(), fetchJobs(), normalizeJob(), submitResult().
//   • Emits A‑B‑A bandSignature + binaryField + waveField surfaces.
//   • Emits deterministic volatility + healing metadata.
//   • Zero async, zero randomness, zero timestamps.
//
// CONTRACT:
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO network, NO fetch, NO async, NO randomness.
//   • NEVER mutate external objects.
// ============================================================================
export const PulseEarnMktAuctioneerMeta = Object.freeze({
  layer: "PulseEarnMktAuctioneer",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v11.2-EVO",
  identity: "PulseEarnMktAuctioneer-v11.2-EVO",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReceptor: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    volatilityDeterministic: true
  }),

  contract: Object.freeze({
    input: [
      "VastAIDNA",
      "DualBandContext",
      "ReceptorNormalizationRules"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures",
      "AuctioneerHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
    ancestry: [
      "PulseEarnMktAuctioneer-v9",
      "PulseEarnMktAuctioneer-v10",
      "PulseEarnMktAuctioneer-v11",
      "PulseEarnMktAuctioneer-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Vast.ai receptor phenotype",
    adaptive: "binary/wave surfaces + volatility inference",
    return: "deterministic ping/fetchJobs/normalizeJob/submitResult"
  })
});


// ============================================================================
// Healing Metadata — deterministic receptor log (v11-Evo A‑B‑A)
// ============================================================================
const healingState = {
  lastPingMs: null,
  lastPingError: null,

  lastFetchCount: 0,
  lastFetchError: null,

  lastSubmitJobId: null,
  lastSubmitError: null,

  lastNormalizedJobId: null,
  lastNormalizationError: null,

  lastPayloadVersion: "11-Evo",
  lastJobType: null,
  lastGpuScore: null,
  lastResourceShape: null,
  lastBandwidthInference: null,

  priceVolatility: 0,
  listingVolatility: 0,

  cycleCount: 0,

  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,
  lastAuctioneerCycleSignature: null,

  // A‑B‑A surfaces
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
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

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ============================================================================
// Signature Builders — v11-Evo
// ============================================================================
function buildPingSignature(latency) {
  return computeHash(`PING::${latency}`);
}

function buildFetchSignature(count) {
  return computeHash(`FETCH::${count}`);
}

function buildNormalizationSignature(jobId) {
  return computeHash(`NORM::${jobId || "NONE"}`);
}

function buildSubmitSignature(jobId) {
  return computeHash(`SUBMIT::${jobId || "NONE"}`);
}

function buildAuctioneerCycleSignature(cycle) {
  return computeHash(`AUCTIONEER_CYCLE::${cycle}`);
}

function buildBandSignature(band) {
  return computeHash(`AUCTIONEER_BAND::${normalizeBand(band)}`);
}


// ============================================================================
// SAFE GET — deterministic path reader
// ============================================================================
function safeGet(obj, path, fallback = null) {
  try {
    return path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}


// ============================================================================
// A‑B‑A Binary + Wave Surfaces (v11‑Evo)
// ============================================================================
function buildBinaryField() {
  const patternLen = 8; // deterministic constant
  const density =
    patternLen +
    healingState.lastFetchCount +
    (healingState.lastPingMs || 0);

  const surface = density + patternLen;

  const field = {
    binaryPhenotypeSignature: computeHash(`BAUCTIONEER::${surface}`),
    binarySurfaceSignature: computeHash(`BAUCTIONEER_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  healingState.lastBinaryField = field;
  return field;
}

function buildWaveField(band) {
  const amplitude = (healingState.lastFetchCount || 1) * 10;
  const wavelength = (healingState.lastPingMs || 10) + 1;
  const phase = amplitude % 16;

  const field = {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  healingState.lastWaveField = field;
  return field;
}


// ============================================================================
// DETERMINISTIC VAST.AI DNA — v11-Evo
// ============================================================================
const VAST_RECEPTOR_DNA = {
  pingLatency: 42,

  band: "symbolic",

  offers: [
    {
      id: "vast-001",
      dph_total: 0.12,
      cpu_cores: 4,
      ram_gb: 8,
      gpu_ram: 8,
      net_up: 50
    },
    {
      id: "vast-002",
      dph_total: 0.20,
      cpu_cores: 8,
      ram_gb: 16,
      gpu_ram: 16,
      net_up: 100
    }
  ],

  version: "11-Evo",
  lineage: "Auctioneer-Vast-v11-Evo",
  phenotype: "MarketplaceAuctioneer"
};


// ============================================================================
// Deterministic Cycle Counter
// ============================================================================
let auctioneerCycle = 0;


// ============================================================================
// VOLATILITY — deterministic
// ============================================================================
function updateVolatility(jobs) {
  const count = jobs.length;

  healingState.listingVolatility = Math.abs(
    count - (healingState.lastFetchCount || 0)
  );

  const payouts = jobs.map(j => j.payout);
  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance =
      payouts.reduce((a, b) => a + (b - avg) * (b - avg), 0) / payouts.length;
    healingState.priceVolatility = variance;
  }
}


// ============================================================================
// AUCTIONEER — Vast.ai Marketplace Adapter (v11-Evo A‑B‑A)
// ============================================================================
export const PulseEarnMktAuctioneer = {
  id: "vast",
  name: "Vast.ai",
  version: "11-Evo",
  lineage: "Auctioneer-Vast-v11-Evo",

  // -------------------------------------------------------------------------
  // PING — deterministic latency + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  ping() {
    auctioneerCycle++;
    healingState.cycleCount++;

    const latency = VAST_RECEPTOR_DNA.pingLatency;
    const band = normalizeBand(VAST_RECEPTOR_DNA.band);

    healingState.lastBand = band;
    healingState.lastPingMs = latency;
    healingState.lastPingError = null;

    healingState.lastPingSignature = buildPingSignature(latency);
    healingState.lastBandSignature = buildBandSignature(band);
    healingState.lastAuctioneerCycleSignature =
      buildAuctioneerCycleSignature(auctioneerCycle);

    const binaryField = buildBinaryField();
    const waveField = buildWaveField(band);

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField
    };
  },

  // -------------------------------------------------------------------------
  // FETCH JOBS — deterministic offers + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  fetchJobs() {
    auctioneerCycle++;
    healingState.cycleCount++;

    const band = normalizeBand(VAST_RECEPTOR_DNA.band);
    healingState.lastBand = band;

    try {
      const offers = VAST_RECEPTOR_DNA.offers || [];

      const jobs = offers
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      updateVolatility(jobs);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.lastFetchSignature = buildFetchSignature(jobs.length);
      healingState.lastBandSignature = buildBandSignature(band);
      healingState.lastAuctioneerCycleSignature =
        buildAuctioneerCycleSignature(auctioneerCycle);

      const binaryField = buildBinaryField();
      const waveField = buildWaveField(band);

      return {
        jobs,
        signature: healingState.lastFetchSignature,
        bandSignature: healingState.lastBandSignature,
        binaryField,
        waveField
      };

    } catch (err) {
      healingState.lastFetchError = err?.message || String(err);
      healingState.lastFetchCount = 0;
      healingState.lastFetchSignature = buildFetchSignature(0);
      return {
        jobs: [],
        signature: healingState.lastFetchSignature
      };
    }
  },

  // -------------------------------------------------------------------------
  // SUBMIT RESULT — Vast.ai does NOT accept compute results
  // -------------------------------------------------------------------------
  submitResult(job, result) {
    auctioneerCycle++;
    healingState.cycleCount++;

    const jobId = job?.id ?? null;
    const band = normalizeBand(VAST_RECEPTOR_DNA.band);

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.lastSubmitSignature = buildSubmitSignature(jobId);
    healingState.lastBandSignature = buildBandSignature(band);
    healingState.lastAuctioneerCycleSignature =
      buildAuctioneerCycleSignature(auctioneerCycle);

    const binaryField = buildBinaryField();
    const waveField = buildWaveField(band);

    return {
      ok: true,
      marketplace: "vast",
      jobId,
      result,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      note: "Vast.ai does not accept compute results (v11-Evo deterministic)."
    };
  },

  // -------------------------------------------------------------------------
  // NORMALIZE JOB — Vast → Pulse‑Earn schema (deterministic)
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_job";
        healingState.lastNormalizationSignature =
          buildNormalizationSignature(null);
        return null;
      }

      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        healingState.lastNormalizationSignature =
          buildNormalizationSignature(null);
        return null;
      }

      healingState.lastJobType = safeGet(raw, "type", "offer");

      const payout = Number(raw.dph_total ?? raw.price_per_hour ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        healingState.lastNormalizationSignature =
          buildNormalizationSignature(null);
        return null;
      }

      const cpuRequired = Number(raw.cpu_cores ?? 1);
      const memoryRequired = Number(raw.ram_gb ?? 1) * 1024;
      const estimatedSeconds = 3600;

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      const gpuScore = Number(raw.gpu_ram ?? 8) * 10;
      healingState.lastGpuScore = gpuScore;

      const bandwidth = Number(raw.net_up ?? 5);
      healingState.lastBandwidthInference = bandwidth;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "vast",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuScore,
        bandwidthNeededMbps: bandwidth
      };

      healingState.lastNormalizedJobId = normalized.id;
      healingState.lastNormalizationError = null;
      healingState.lastNormalizationSignature =
        buildNormalizationSignature(normalized.id);

      return normalized;

    } catch (err) {
      healingState.lastNormalizationError = err.message;
      healingState.lastNormalizationSignature =
        buildNormalizationSignature(null);
      return null;
    }
  }
};


// ============================================================================
// HEALING STATE EXPORT — v11-Evo A‑B‑A
// ============================================================================
export function getPulseEarnMktAuctioneerHealingState() {
  return { ...healingState };
}
