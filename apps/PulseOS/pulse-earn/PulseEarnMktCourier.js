// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnMktCourier-v11-Evo.js
// LAYER: THE COURIER (v11‑Evo A‑B‑A)
// (Deterministic Spheron Receptor + A‑B‑A Band Surfaces)
// ============================================================================
//
// ROLE (v11‑Evo A‑B‑A):
//   THE COURIER — Pulse‑Earn’s deterministic Spheron marketplace receptor.
//   • Represents Spheron compute jobs as stable receptor DNA.
//   • Normalizes raw Spheron tasks into Pulse‑Earn job schema.
//   • Emits bandSignature + binaryField + waveField.
//   • Provides deterministic ping(), fetchJobs(), submitResult().
//   • Maintains healing metadata + v11‑Evo signatures.
//
// CONTRACT:
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO network, NO async, NO randomness, NO timestamps.
//   • READ‑ONLY except healing metadata.
// ============================================================================


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
  return computeHash(`COURIER_BAND::${normalizeBand(band)}`);
}


// ============================================================================
// A‑B‑A Binary + Wave Surfaces
// ============================================================================
function buildBinaryField(cycle, gpuFlag) {
  const patternLen = gpuFlag ? 14 : 10;
  const density = patternLen + (gpuFlag ? 20 : 5) + cycle;

  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BCOURIER::${surface}`),
    binarySurfaceSignature: computeHash(`BCOURIER_SURF::${surface}`),
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
  const amplitude = (cycle + 1) * (band === "binary" ? 12 : 6);
  const wavelength = amplitude + 4;
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
  return computeHash(`PING::SPHERON::${latency}`);
}

function buildFetchSignature(count) {
  return computeHash(`FETCH::SPHERON::${count}`);
}

function buildNormalizationSignature(jobId) {
  return computeHash(`NORM::SPHERON::${jobId || "NONE"}`);
}

function buildSubmitSignature(jobId) {
  return computeHash(`SUBMIT::SPHERON::${jobId || "NONE"}`);
}

function buildCourierCycleSignature(cycle) {
  return computeHash(`COURIER_CYCLE::${cycle}`);
}


// ============================================================================
// Healing Metadata — Courier Interaction Log (A‑B‑A)
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

  lastPayloadVersion: "11-spheron-dna",
  lastJobType: null,
  lastResourceShape: null,
  lastGpuFlag: null,
  liquidityScore: 0,
  payoutVolatility: 0,

  cycleCount: 0,
  lastCycleIndex: null,

  // v11‑Evo signatures
  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,
  lastCourierCycleSignature: null,

  // A‑B‑A surfaces
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null
};

let courierCycle = 0;


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
// Deterministic Spheron Receptor DNA (v11‑Evo)
// ============================================================================
const SPHERON_RECEPTOR_DNA = {
  pingLatency: 42,
  jobs: [
    {
      id: "spheron-001",
      payout: 0.05,
      cpu: 2,
      memory: 2048,
      estimatedSeconds: 300,
      gpu: false,
      type: "compute"
    },
    {
      id: "spheron-002",
      payout: 0.12,
      cpu: 4,
      memory: 4096,
      estimatedSeconds: 600,
      gpu: true,
      type: "compute"
    }
  ],
  version: "11-Evo",
  lineage: "Courier-Spheron-v11-Evo",
  phenotype: "MarketplaceReceptor"
};


// ============================================================================
// COURIER CLIENT — Deterministic Spheron Interface (A‑B‑A)
// ============================================================================
export const PulseEarnMktCourier = {
  id: "spheron",
  name: "Spheron Compute",
  version: "11-Evo",
  lineage: "Courier-Spheron-v11-Evo",

  // -------------------------------------------------------------------------
  // Ping — Deterministic courier route latency + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  ping() {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const latency = SPHERON_RECEPTOR_DNA.pingLatency;

    const band = "symbolic"; // ping is always symbolic
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(courierCycle, false);
    const waveField = buildWaveField(courierCycle, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    healingState.lastPingMs = latency;
    healingState.lastPingError = null;
    healingState.lastPingSignature = buildPingSignature(latency);
    healingState.lastCourierCycleSignature = buildCourierCycleSignature(courierCycle);

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField
    };
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — Deterministic compute task retrieval + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  fetchJobs() {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    try {
      const data = { jobs: SPHERON_RECEPTOR_DNA.jobs };
      healingState.lastPayloadVersion = "11-spheron-dna";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        healingState.lastFetchSignature = buildFetchSignature(0);
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      // deterministic volatility
      const count = jobs.length;
      const payouts = jobs.map(j => j.payout);

      healingState.liquidityScore = Math.abs(
        count - (healingState.lastFetchCount || 0)
      );

      if (payouts.length > 1) {
        const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
        const variance =
          payouts.reduce((a, b) => a + (b - avg) * (b - avg), 0) /
          payouts.length;
        healingState.payoutVolatility = variance;
      }

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.lastFetchSignature = buildFetchSignature(jobs.length);
      healingState.lastCourierCycleSignature = buildCourierCycleSignature(courierCycle);

      // A‑B‑A surfaces for fetch
      const band = "symbolic"; // fetch is symbolic
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(courierCycle, false);
      const waveField = buildWaveField(courierCycle, band);

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
  // Submit Result — Deterministic delivery + A‑B‑A surfaces
  // -------------------------------------------------------------------------
  submitResult(job, result) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const jobId = job?.id ?? null;

    const band = "symbolic"; // submissions are symbolic
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(courierCycle, false);
    const waveField = buildWaveField(courierCycle, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.lastSubmitSignature = buildSubmitSignature(jobId);
    healingState.lastCourierCycleSignature = buildCourierCycleSignature(courierCycle);

    return {
      ok: true,
      marketplace: "spheron",
      jobId,
      cycleIndex: courierCycle,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      note: "Spheron submission simulated deterministically (v11‑Evo A‑B‑A).",
      result
    };
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Spheron job → Pulse‑Earn job schema + A‑B‑A band
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

      const payout = Number(raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 1);
      const memoryRequired = Number(raw.memory ?? 1024);
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

      const gpuFlag = !!raw.gpu;
      healingState.lastGpuFlag = gpuFlag ? "gpu" : "cpu";

      // Dynamic band assignment
      const band = gpuFlag ? "binary" : "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(courierCycle, gpuFlag);
      const waveField = buildWaveField(courierCycle, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "spheron",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuFlag ? 300 : 100,
        bandwidthNeededMbps: 5,

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
// Healing State Export — Courier Interaction Log
// ---------------------------------------------------------------------------
export function getPulseEarnMktCourierHealingState() {
  return { ...healingState };
}
