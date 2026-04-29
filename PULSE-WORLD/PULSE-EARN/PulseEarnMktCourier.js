// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnMktCourier-v12.3-PRESENCE-EVO+.js
// LAYER: THE COURIER (v12.3 Presence + Advantage‑C + Prewarm)
// ============================================================================

export const PulseEarnMktCourierMeta = Object.freeze({
  layer: "PulseEarnMktCourier",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMktCourier-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReceptor: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true
  }),

  contract: Object.freeze({
    input: [
      "SpheronTaskDNA",
      "DualBandContext",
      "ReceptorNormalizationRules",
      "DevicePhenotypePresence"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures",
      "CourierHealingState",
      "CourierPresenceField",
      "CourierAdvantageField",
      "CourierChunkPrewarmPlan"
    ]
  })
});

// ============================================================================
// Deterministic Hash Helper — v12.3‑EVO
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
  return computeHash(`AMBASSADOR_BAND::${normalizeBand(band)}`);
}


// ============================================================================
// A‑B‑A Binary + Wave Surfaces
// ============================================================================
function buildBinaryField(cycle, hasGpu, presenceField) {
  const patternLen = hasGpu ? 16 : 10;
  const baseDensity = patternLen + cycle + (hasGpu ? 25 : 8);
  const mesh = Number(presenceField?.meshPressureIndex || 0);
  const castle = Number(presenceField?.castleLoadLevel || 0);
  const density = baseDensity + mesh + castle;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BAKASH::${surface}`),
    binarySurfaceSignature: computeHash(`BAKASH_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      meshPressureIndex: mesh,
      castleLoadLevel: castle,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(cycle, band, presenceField) {
  const mesh = Number(presenceField?.meshStrength || 0);
  const amplitude = (cycle + 1) * (band === "binary" ? 14 : 7) + mesh;
  const wavelength = amplitude + 5;
  const phase = (amplitude + (presenceField?.meshPressureIndex || 0)) % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}


// ============================================================================
// Signature Builders — v12.3‑EVO
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

function buildAmbassadorCycleSignature(cycle, presenceTier) {
  return computeHash(`AMBASSADOR_CYCLE::${cycle}::PTIER:${presenceTier}`);
}


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

const VALID_LEASE_STATES = new Set([
  "active",
  "open",
  "insufficient_funds",
  "closed",
  "unknown"
]);


// ============================================================================
// Presence Field (v12.3)
// ============================================================================
function buildPresenceField(jobOrRaw, device, cycle) {
  const idLen = (jobOrRaw?.id || "").length;
  const typeLen = (jobOrRaw?.type || "").length;
  const stability = device?.stabilityScore || 0.7;

  const composite =
    idLen * 0.001 +
    typeLen * 0.001 +
    stability * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    idLen,
    typeLen,
    stability,
    cycle,
    presenceSignature: computeHash(
      `COURIER_PRESENCE::${presenceTier}::${idLen}::${typeLen}::${cycle}`
    )
  };
}

// ============================================================================
// Advantage‑C Field (v12.3)
// ============================================================================
function buildAdvantageField(jobOrRaw, device, bandPack, presenceField) {
  const gpuScore = device?.gpuScore || 0;
  const bandwidth = device?.bandwidthMbps || 0;
  const density = bandPack.binaryField.binarySurface.density;
  const amplitude = bandPack.waveField.amplitude;

  const advantageScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0);

  return {
    advantageVersion: "C",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan (v12.3)
// ============================================================================
function buildChunkPrewarmPlan(jobOrRaw, device, presenceField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const gpuBoost = (device?.gpuScore || 0) > 600 ? 1 : 0;
  const priority = basePriority + gpuBoost;

  return {
    planVersion: "v12.3-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      receptorEnvelope: true,
      normalizationBlueprint: true
    },
    cache: {
      deviceProfile: true,
      courierDiagnostics: true
    },
    prewarm: {
      nervousSystem: presenceField.presenceTier !== "presence_low",
      muscleSystem: presenceField.presenceTier !== "presence_low",
      lymphNodes: presenceField.presenceTier !== "presence_low"
    }
  };
}

// ============================================================================
// Healing Metadata — Courier Interaction Log
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

  lastPayloadVersion: "12.3-spheron-dna",
  lastJobType: null,
  lastResourceShape: null,
  lastGpuFlag: null,
  liquidityScore: 0,
  payoutVolatility: 0,

  cycleCount: 0,
  lastCycleIndex: null,

  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,
  lastCourierCycleSignature: null,

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null
};

let courierCycle = 0;


// ============================================================================
// Deterministic Spheron Receptor DNA
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
  version: "12.3-PRESENCE",
  lineage: "Courier-Spheron-v12.3-PRESENCE",
  phenotype: "MarketplaceReceptor"
};
export function buildCourierCycleSignature(courierCycle = 0) {
  const cycle = Number(courierCycle) || 0;

  return {
    cycle,
    cycleMod2: cycle % 2,
    cycleMod4: cycle % 4,
    cycleMod8: cycle % 8,
    parity: cycle % 2 === 0 ? "even" : "odd",
    tierHint:
      cycle % 8 === 0 ? "alpha" :
      cycle % 4 === 0 ? "beta" :
      cycle % 2 === 0 ? "gamma" :
      "delta",
    stamp: `courier-cycle-${cycle}`
  };
}

// ============================================================================
// COURIER CLIENT — v12.3 Presence + Advantage‑C
// ============================================================================
export const PulseEarnMktCourier = {
  id: "spheron",
  name: "Spheron Compute",
  version: "12.3-PRESENCE-EVO+",
  lineage: "Courier-Spheron-v12.3-PRESENCE-EVO+",

  // -------------------------------------------------------------------------
  // Ping — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  ping(deviceProfile = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const latency = SPHERON_RECEPTOR_DNA.pingLatency;

    const band = "symbolic";
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

    const presenceField = buildPresenceField(null, deviceProfile, courierCycle);
    const advantageField = buildAdvantageField(null, deviceProfile, { band, binaryField, waveField }, presenceField);
    const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField);

    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan
    };
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  fetchJobs(deviceProfile = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    try {
      const data = { jobs: SPHERON_RECEPTOR_DNA.jobs };
      healingState.lastPayloadVersion = "12.3-spheron-dna";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        healingState.lastFetchSignature = buildFetchSignature(0);
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw, deviceProfile))
        .filter(j => j !== null);

      const payouts = jobs.map(j => j.payout);
      const count = jobs.length;

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

      const band = "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(courierCycle, false);
      const waveField = buildWaveField(courierCycle, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const presenceField = buildPresenceField(null, deviceProfile, courierCycle);
      const advantageField = buildAdvantageField(null, deviceProfile, { band, binaryField, waveField }, presenceField);
      const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField);

      healingState.lastPresenceField = presenceField;
      healingState.lastAdvantageField = advantageField;
      healingState.lastChunkPrewarmPlan = chunkPlan;

      return {
        jobs,
        signature: healingState.lastFetchSignature,
        bandSignature: healingState.lastBandSignature,
        binaryField,
        waveField,
        presenceField,
        advantageField,
        chunkPlan
      };

    } catch (err) {
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      healingState.lastFetchSignature = buildFetchSignature(0);
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  submitResult(job, result, deviceProfile = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const jobId = job?.id ?? null;

    const band = "symbolic";
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

    const presenceField = buildPresenceField(job, deviceProfile, courierCycle);
    const advantageField = buildAdvantageField(job, deviceProfile, { band, binaryField, waveField }, presenceField);
    const chunkPlan = buildChunkPrewarmPlan(job, deviceProfile, presenceField);

    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      ok: true,
      marketplace: "spheron",
      jobId,
      cycleIndex: courierCycle,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan,
      note: "Spheron submission simulated deterministically (v12.3-PRESENCE-EVO+).",
      result
    };
  },

  // -------------------------------------------------------------------------
  // Normalize Job — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  normalizeJob(raw, deviceProfile = {}) {
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

      const band = gpuFlag ? "binary" : "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(courierCycle, gpuFlag);
      const waveField = buildWaveField(courierCycle, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const presenceField = buildPresenceField(raw, deviceProfile, courierCycle);
      const advantageField = buildAdvantageField(raw, deviceProfile, { band, binaryField, waveField }, presenceField);
      const chunkPlan = buildChunkPrewarmPlan(raw, deviceProfile, presenceField);

      healingState.lastPresenceField = presenceField;
      healingState.lastAdvantageField = advantageField;
      healingState.lastChunkPrewarmPlan = chunkPlan;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "spheron",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuFlag ? 300 : 100,
        bandwidthNeededMbps: 5,

        _abaBand: band,
        _abaBinaryDensity: binaryField.binarySurface.density,
        _abaWaveAmplitude: waveField.amplitude,

        // Presence + Advantage‑C + Chunk/Prewarm
        presenceField,
        advantageField,
        chunkPlan
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
