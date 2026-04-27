// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnMktForager-v11-Evo.js
// LAYER: THE FORAGER (v11‑Evo A‑B‑A)
// (Deterministic Salad Marketplace Receptor + A‑B‑A Band Surfaces)
// ============================================================================
//
// ROLE (v11‑Evo A‑B‑A):
//   THE FORAGER — deterministic Salad marketplace receptor.
//   • Represents Salad compute jobs as stable receptor DNA.
//   • Normalizes raw Salad tasks into Pulse‑Earn job schema.
//   • Emits bandSignature + binaryField + waveField.
//   • Provides deterministic ping(), fetchJobs(), submitResult().
//   • Maintains healing metadata + v11‑Evo signatures.
//
// CONTRACT:
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO network, NO async, NO randomness, NO timestamps.
//   • READ‑ONLY except healing metadata.
// ============================================================================
export const PulseEarnMktForagerMeta = Object.freeze({
  layer: "PulseEarnMktForager",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v11.2-EVO",
  identity: "PulseEarnMktForager-v11.2-EVO",

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
    zeroUserCode: true
  }),

  contract: Object.freeze({
    input: [
      "SaladTaskDNA",
      "DualBandContext",
      "ReceptorNormalizationRules"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures",
      "ForagerHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
    ancestry: [
      "PulseEarnMktForager-v9",
      "PulseEarnMktForager-v10",
      "PulseEarnMktForager-v11",
      "PulseEarnMktForager-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Salad receptor phenotype",
    adaptive: "binary/wave surfaces + band signatures",
    return: "deterministic ping/fetchJobs/submitResult"
  })
});


// ============================================================================
// Deterministic Hash Helper — v11‑Evo
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

function buildBandSignature(band) {
  return computeHash(`FORAGER_BAND::${normalizeBand(band)}`);
}


// ============================================================================
// A‑B‑A Binary + Wave Surfaces
// ============================================================================
function buildBinaryField(cycle, gpuTier) {
  const tierWeight =
    gpuTier === "high" ? 20 :
    gpuTier === "mid"  ? 12 :
    gpuTier === "low"  ? 8  : 5;

  const patternLen = tierWeight;
  const density = patternLen + cycle + (tierWeight * 2);
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BFORAGER::${surface}`),
    binarySurfaceSignature: computeHash(`BFORAGER_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(cycle, band) {
  const amplitude = (cycle + 1) * (band === "binary" ? 10 : 5);
  const wavelength = amplitude + 3;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}


// ============================================================================
// Signature Builders — v11‑Evo
// ============================================================================
function buildPingSignature(latency) {
  return computeHash(`PING::SALAD::${latency}`);
}

function buildFetchSignature(count) {
  return computeHash(`FETCH::SALAD::${count}`);
}

function buildNormalizationSignature(jobId) {
  return computeHash(`NORM::SALAD::${jobId || "NONE"}`);
}

function buildSubmitSignature(jobId) {
  return computeHash(`SUBMIT::SALAD::${jobId || "NONE"}`);
}


// ============================================================================
// Healing Metadata — Forager Interaction Log (A‑B‑A)
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

  lastPayloadVersion: "11-salad-dna",
  lastJobType: null,
  lastGpuTier: null,
  lastResourceShape: null,
  payoutVolatility: 0,
  liquidityScore: 0,
  cycleCount: 0,

  // v11‑Evo signatures
  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,

  // A‑B‑A surfaces
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
};


// ============================================================================
// INTERNAL — Safe Getter
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
// Deterministic Salad Receptor DNA (v11‑Evo)
// ============================================================================
const SALAD_RECEPTOR_DNA = {
  pingLatency: 55,
  jobs: [
    {
      id: "salad-001",
      reward: 0.08,
      cpu: 4,
      memory: 4096,
      estimatedSeconds: 900,
      gpuTier: "mid",
      bandwidth: 20,
      type: "generic-compute"
    },
    {
      id: "salad-002",
      reward: 0.15,
      cpu: 8,
      memory: 8192,
      estimatedSeconds: 1800,
      gpuTier: "high",
      bandwidth: 50,
      type: "ai-task"
    }
  ],
  version: "11-Evo",
  lineage: "Forager-Salad-v11-Evo",
  phenotype: "MarketplaceReceptor"
};


// ============================================================================
// FORAGER CLIENT — Salad Marketplace Interface (A‑B‑A)
// ============================================================================
export const PulseEarnMktForager = {
  id: "salad",
  name: "Salad Marketplace",
  version: "11-Evo",
  lineage: "Forager-Salad-v11-Evo",

  // -------------------------------------------------------------------------
  // Ping — deterministic + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  ping() {
    const latency = SALAD_RECEPTOR_DNA.pingLatency;

    healingState.cycleCount++;
    healingState.lastPingMs = latency;
    healingState.lastPingError = null;
    healingState.lastPingSignature = buildPingSignature(latency);

    // Ping is symbolic band
    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(healingState.cycleCount, "low");
    const waveField = buildWaveField(healingState.cycleCount, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField
    };
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — deterministic + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  fetchJobs() {
    try {
      const data = { jobs: SALAD_RECEPTOR_DNA.jobs };
      healingState.lastPayloadVersion = "11-salad-dna";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        healingState.lastFetchSignature = buildFetchSignature(0);
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      updateVolatility(jobs);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      healingState.lastFetchSignature = buildFetchSignature(jobs.length);

      // Fetch is symbolic band
      const band = "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(healingState.cycleCount, "low");
      const waveField = buildWaveField(healingState.cycleCount, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      return {
        jobs,
        signature: healingState.lastFetchSignature,
        bandSignature: healingState.lastBandSignature,
        binaryField,
        waveField
      };

    } catch (err) {
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      healingState.lastFetchSignature = buildFetchSignature(0);
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — deterministic + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  submitResult(job, result) {
    const jobId = job?.id ?? null;

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.cycleCount++;
    healingState.lastSubmitSignature = buildSubmitSignature(jobId);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(healingState.cycleCount, "low");
    const waveField = buildWaveField(healingState.cycleCount, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    return {
      ok: true,
      marketplace: "salad",
      jobId,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      note: "Salad submission simulated deterministically (v11‑Evo A‑B‑A).",
      result
    };
  },

  // -------------------------------------------------------------------------
  // Normalize Job — deterministic + dynamic A‑B‑A band
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_job";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }
      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      healingState.lastJobType = safeGet(raw, "type", "unknown");

      const payout = Number(raw.reward ?? raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 2);
      const memoryRequired = Number(raw.memory ?? 2048);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 600);

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      const gpuTier = raw.gpuTier ?? "mid";
      healingState.lastGpuTier = gpuTier;

      const minGpuScore =
        gpuTier === "high"
          ? 600
          : gpuTier === "mid"
          ? 400
          : gpuTier === "low"
          ? 250
          : 150;

      const bandwidthNeededMbps = Number(raw.bandwidth ?? 10);

      // Dynamic band assignment
      const band = gpuTier === "high" ? "binary" : "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(healingState.cycleCount, gpuTier);
      const waveField = buildWaveField(healingState.cycleCount, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "salad",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore,
        bandwidthNeededMbps,

        // A‑B‑A hints for Consulate
        _abaBand: band,
        _abaBinaryDensity: binaryField.binarySurface.density,
        _abaWaveAmplitude: waveField.amplitude
      };

      healingState.lastNormalizedJobId = normalized.id;
      healingState.lastNormalizationError = null;
      healingState.lastNormalizationSignature =
        buildNormalizationSignature(normalized.id);

      return normalized;

    } catch (err) {
      healingState.lastNormalizationError = err.message;
      healingState.lastNormalizationSignature = buildNormalizationSignature(null);
      return null;
    }
  }
};


// ---------------------------------------------------------------------------
// Healing State Export — Forager Interaction Log
// ---------------------------------------------------------------------------
export function getPulseEarnMktForagerHealingState() {
  return { ...healingState };
}
