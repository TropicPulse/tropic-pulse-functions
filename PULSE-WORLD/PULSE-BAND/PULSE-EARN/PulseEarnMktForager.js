// ============================================================================
//  PulseEarnMktForager-v12.3-PRESENCE-EVO+.js
//  THE FORAGER — Salad Marketplace Receptor (v12.3 Presence + Advantage‑C)
//  Deterministic receptor DNA + A‑B‑A + Presence + Chunk/Prewarm
// ============================================================================

export const PulseEarnMktForagerMeta = Object.freeze({
  layer: "PulseEarnMktForager",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMktForager-v12.3-PRESENCE-EVO+",

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
      "SaladTaskDNA",
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
      "ForagerHealingState",
      "ForagerPresenceField",
      "ForagerAdvantageField",
      "ForagerChunkPrewarmPlan"
    ]
  })
});

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function normalizeBand(b) {
  const x = String(b || "symbolic").toLowerCase();
  return x === "binary" ? "binary" : "symbolic";
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
      `FORAGER_PRESENCE::${presenceTier}::${idLen}::${typeLen}::${cycle}`
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
      foragerDiagnostics: true
    },
    prewarm: {
      nervousSystem: presenceField.presenceTier !== "presence_low",
      survivalInstincts: presenceField.presenceTier !== "presence_low",
      lymphNodes: presenceField.presenceTier !== "presence_low"
    }
  };
}

// ============================================================================
// Healing Metadata
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

  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null
};

// ============================================================================
// Safe Getter
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
// Deterministic Salad Receptor DNA
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
// FORAGER CLIENT — v12.3 Presence + Advantage‑C
// ============================================================================
export const PulseEarnMktForager = {
  id: "salad",
  name: "Salad Marketplace",
  version: "12.3-PRESENCE-EVO+",
  lineage: "Forager-Salad-v12.3-PRESENCE-EVO+",

  // -------------------------------------------------------------------------
  // Ping — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  ping(deviceProfile = {}) {
    const latency = SALAD_RECEPTOR_DNA.pingLatency;

    healingState.cycleCount++;
    healingState.lastPingMs = latency;
    healingState.lastPingError = null;
    healingState.lastPingSignature = computeHash(`PING::SALAD::${latency}`);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(healingState.cycleCount, "low");
    const waveField = buildWaveField(healingState.cycleCount, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    const presenceField = buildPresenceField(null, deviceProfile, healingState.cycleCount);
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
    try {
      const data = { jobs: SALAD_RECEPTOR_DNA.jobs };
      healingState.lastPayloadVersion = "12.3-salad-dna";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        healingState.lastFetchSignature = computeHash(`FETCH::SALAD::0`);
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw, deviceProfile))
        .filter(j => j !== null);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      healingState.lastFetchSignature = computeHash(`FETCH::SALAD::${jobs.length}`);

      const band = "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(healingState.cycleCount, "low");
      const waveField = buildWaveField(healingState.cycleCount, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const presenceField = buildPresenceField(null, deviceProfile, healingState.cycleCount);
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
      healingState.lastFetchSignature = computeHash(`FETCH::SALAD::0`);
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — deterministic + Presence + Advantage‑C
  // -------------------------------------------------------------------------
  submitResult(job, result, deviceProfile = {}) {
    const jobId = job?.id ?? null;

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.cycleCount++;
    healingState.lastSubmitSignature = computeHash(`SUBMIT::SALAD::${jobId}`);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const binaryField = buildBinaryField(healingState.cycleCount, "low");
    const waveField = buildWaveField(healingState.cycleCount, band);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;

    const presenceField = buildPresenceField(job, deviceProfile, healingState.cycleCount);
    const advantageField = buildAdvantageField(job, deviceProfile, { band, binaryField, waveField }, presenceField);
    const chunkPlan = buildChunkPrewarmPlan(job, deviceProfile, presenceField);

    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      ok: true,
      marketplace: "salad",
      jobId,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan,
      note: "Salad submission simulated deterministically (v12.3-PRESENCE-EVO+).",
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
        healingState.lastNormalizationSignature = computeHash(`NORM::SALAD::NONE`);
        return null;
      }
      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        healingState.lastNormalizationSignature = computeHash(`NORM::SALAD::NONE`);
        return null;
      }

      healingState.lastJobType = safeGet(raw, "type", "unknown");

      const payout = Number(raw.reward ?? raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        healingState.lastNormalizationSignature = computeHash(`NORM::SALAD::NONE`);
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
        healingState.lastNormalizationSignature = computeHash(`NORM::SALAD::NONE`);
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

      const band = gpuTier === "high" ? "binary" : "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const binaryField = buildBinaryField(healingState.cycleCount, gpuTier);
      const waveField = buildWaveField(healingState.cycleCount, band);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;

      const presenceField = buildPresenceField(raw, deviceProfile, healingState.cycleCount);
      const advantageField = buildAdvantageField(raw, deviceProfile, { band, binaryField, waveField }, presenceField);
      const chunkPlan = buildChunkPrewarmPlan(raw, deviceProfile, presenceField);

            healingState.lastPresenceField = presenceField;
      healingState.lastAdvantageField = advantageField;
      healingState.lastChunkPrewarmPlan = chunkPlan;

      healingState.lastNormalizedJobId = raw.id;
      healingState.lastNormalizationError = null;
      healingState.lastNormalizationSignature =
        computeHash(`NORM::SALAD::${raw.id}`);

      return {
        id: String(raw.id),
        marketplaceId: "salad",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore,
        bandwidthNeededMbps,

        // A‑B‑A hints for Consulate / Survival Instincts
        _abaBand: band,
        _abaBinaryDensity: binaryField.binarySurface.density,
        _abaWaveAmplitude: waveField.amplitude,

        // Presence + Advantage‑C + Chunk/Prewarm
        presenceField,
        advantageField,
        chunkPlan
      };

    } catch (err) {
      healingState.lastNormalizationError = err.message;
      healingState.lastNormalizationSignature =
        computeHash(`NORM::SALAD::NONE`);
      return null;
    }
  }
};

// ---------------------------------------------------------------------------
// Healing State Export — Forager Interaction Log (v12.3-PRESENCE-EVO+)
// ---------------------------------------------------------------------------
export function getPulseEarnMktForagerHealingState() {
  return { ...healingState };
}
