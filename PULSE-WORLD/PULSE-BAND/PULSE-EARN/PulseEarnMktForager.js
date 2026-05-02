// ============================================================================
//  PulseEarnMktForager-v13.0-PRESENCE-IMMORTAL.js
//  THE FORAGER — Salad Marketplace Receptor (v13.0 Presence + Advantage‑C‑13.0)
//  Deterministic receptor DNA + A‑B‑A + Unified Presence + Chunk/Prewarm v13
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnMktForager",
  version: "v14-IMMORTAL",
  layer: "earn_market",
  role: "market_forager",
  lineage: "PulseEarnMktForager-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    marketForager: true,
    jobDiscovery: true,
    jobHarvesting: true,
    jobNormalization: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseEarnMktCourier",
      "PulseEarnMktEmbassyLedger",
      "PulseEarnMktBroker"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnMktForagerMeta = Object.freeze({
  layer: "PulseEarnMktForager",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnMktForager-v13.0-PRESENCE-IMMORTAL",

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
// A‑B‑A Binary + Wave Surfaces (v13 unified)
// ============================================================================
function buildBinaryField(cycle, gpuTier, presenceField) {
  const tierWeight =
    gpuTier === "high" ? 20 :
    gpuTier === "mid"  ? 12 :
    gpuTier === "low"  ? 8  : 5;

  const mesh = Number(presenceField?.meshPressureIndex || 0);
  const castle = Number(presenceField?.castleLoadLevel || 0);

  const patternLen = tierWeight;
  const density = patternLen + cycle + (tierWeight * 2) + mesh + castle;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BFORAGER::${surface}`),
    binarySurfaceSignature: computeHash(`BFORAGER_SURF::${surface}`),
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
  const amplitude = (cycle + 1) * (band === "binary" ? 10 : 5) + mesh;
  const wavelength = amplitude + 3;
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
// Unified Earn v13 Presence Tier
// ============================================================================
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

// ============================================================================
// Unified v13 Presence Field
// ============================================================================
function buildPresenceField(jobOrRaw, deviceProfile, cycle, globalHints = {}) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  // Forager internal signal: job complexity
  const idLen = (jobOrRaw?.id || "").length;
  const typeLen = (jobOrRaw?.type || "").length;
  const stability = deviceProfile?.stabilityScore || 0.7;

  const internalComposite =
    idLen * 0.001 +
    typeLen * 0.001 +
    stability * 0.01;

  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || "symbolic",
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "forager",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "forager-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "forager-region",
    castleId: castle.castleId || "forager-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    idLen,
    typeLen,
    stability,
    cycle,

    presenceSignature: computeHash(
      `FORAGER_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  };
}

// ============================================================================
// Advantage‑C v13
// ============================================================================
function buildAdvantageField(jobOrRaw, deviceProfile, bandPack, presenceField, globalHints = {}) {
  const gpuScore = deviceProfile?.gpuScore || 0;
  const bandwidth = deviceProfile?.bandwidthMbps || 0;

  const density = bandPack.binaryField.binarySurface.density;
  const amplitude = bandPack.waveField.amplitude;

  const baseScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001;

  const presenceBoost =
    presenceField.presenceTier === "critical" ? 0.02 :
    presenceField.presenceTier === "high" ? 0.015 :
    presenceField.presenceTier === "elevated" ? 0.01 :
    presenceField.presenceTier === "soft" ? 0.005 :
    0;

  const advantageScore = baseScore + presenceBoost;

  let advantageTier = 0;
  if (advantageScore >= 0.05) advantageTier = 3;
  else if (advantageScore >= 0.02) advantageTier = 2;
  else if (advantageScore > 0) advantageTier = 1;

  const fallbackBandLevel = globalHints.fallbackBandLevel ?? 0;

  return {
    advantageVersion: "C-13.0",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore,
    advantageTier,
    fallbackBandLevel
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan v13
// ============================================================================
function buildChunkPrewarmPlan(jobOrRaw, deviceProfile, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "critical"
      ? 4
      : presenceField.presenceTier === "high"
      ? 3
      : presenceField.presenceTier === "elevated"
      ? 2
      : presenceField.presenceTier === "soft"
      ? 1
      : 0;

  const advantageBoost =
    advantageField.advantageTier >= 3 ? 2 :
    advantageField.advantageTier === 2 ? 1 :
    0;

  const priority = basePriority + advantageBoost;

  return {
    planVersion: "v13.0-Forager-AdvantageC",
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
      nervousSystem: true,
      survivalInstincts: true,
      lymphNodes: true
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

  lastPayloadVersion: "13-salad-dna",
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
// Deterministic Salad Receptor DNA (unchanged payload)
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
  version: "13.0-PRESENCE-IMMORTAL",
  lineage: "Forager-Salad-v13.0-PRESENCE-IMMORTAL",
  phenotype: "MarketplaceReceptor"
};

// ============================================================================
// FORAGER CLIENT — v13.0 Presence + Advantage‑C‑13.0
// ============================================================================
export const PulseEarnMktForager = {
  id: "salad",
  name: "Salad Marketplace",
  version: "v13.0-PRESENCE-IMMORTAL",
  lineage: "Forager-Salad-v13.0-PRESENCE-IMMORTAL",

  // -------------------------------------------------------------------------
  // Ping — unified v13 presence
  // -------------------------------------------------------------------------
  ping(deviceProfile = {}, globalHints = {}) {
    const latency = SALAD_RECEPTOR_DNA.pingLatency;

    healingState.cycleCount++;
    healingState.lastPingMs = latency;
    healingState.lastPingError = null;
    healingState.lastPingSignature = computeHash(`PING::SALAD::${latency}`);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const presenceField = buildPresenceField(null, deviceProfile, healingState.cycleCount, globalHints);
    const binaryField = buildBinaryField(healingState.cycleCount, "low", presenceField);
    const waveField = buildWaveField(healingState.cycleCount, band, presenceField);

    const advantageField = buildAdvantageField(
      null,
      deviceProfile,
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField, advantageField);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
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
  // Fetch Jobs — unified v13 presence
  // -------------------------------------------------------------------------
  fetchJobs(deviceProfile = {}, globalHints = {}) {
    try {
      const data = { jobs: SALAD_RECEPTOR_DNA.jobs };
      healingState.lastPayloadVersion = "13-salad-dna";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        healingState.lastFetchSignature = computeHash(`FETCH::SALAD::0`);
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw, deviceProfile, globalHints))
        .filter(j => j !== null);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      healingState.lastFetchSignature = computeHash(`FETCH::SALAD::${jobs.length}`);

      const band = "symbolic";
      healingState.lastBand = band;
      healingState.lastBandSignature = buildBandSignature(band);

      const presenceField = buildPresenceField(null, deviceProfile, healingState.cycleCount, globalHints);
      const binaryField = buildBinaryField(healingState.cycleCount, "low", presenceField);
      const waveField = buildWaveField(healingState.cycleCount, band, presenceField);

      const advantageField = buildAdvantageField(
        null,
        deviceProfile,
        { band, binaryField, waveField },
        presenceField,
        globalHints
      );

      const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField, advantageField);

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;
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
  // Submit Result — unified v13 presence
  // -------------------------------------------------------------------------
  submitResult(job, result, deviceProfile = {}, globalHints = {}) {
    const jobId = job?.id ?? null;

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.cycleCount++;
    healingState.lastSubmitSignature = computeHash(`SUBMIT::SALAD::${jobId}`);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const presenceField = buildPresenceField(job, deviceProfile, healingState.cycleCount, globalHints);
    const binaryField = buildBinaryField(healingState.cycleCount, "low", presenceField);
    const waveField = buildWaveField(healingState.cycleCount, band, presenceField);

    const advantageField = buildAdvantageField(
      job,
      deviceProfile,
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(job, deviceProfile, presenceField, advantageField);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
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
      result
    };
  },
  
  // -------------------------------------------------------------------------
  // Normalize Job — unified v13 presence
  // -------------------------------------------------------------------------
  normalizeJob(raw, deviceProfile = {}, globalHints = {}) {
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

      const presenceField = buildPresenceField(
        raw,
        deviceProfile,
        healingState.cycleCount,
        globalHints
      );
      const binaryField = buildBinaryField(healingState.cycleCount, gpuTier, presenceField);
      const waveField = buildWaveField(healingState.cycleCount, band, presenceField);

      const advantageField = buildAdvantageField(
        raw,
        deviceProfile,
        { band, binaryField, waveField },
        presenceField,
        globalHints
      );

      const chunkPlan = buildChunkPrewarmPlan(
        raw,
        deviceProfile,
        presenceField,
        advantageField
      );

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;
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

        _abaBand: band,
        _abaBinaryDensity: binaryField.binarySurface.density,
        _abaWaveAmplitude: waveField.amplitude,

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
// Healing State Export — Forager Interaction Log (v13.0-PRESENCE-IMMORTAL)
// ---------------------------------------------------------------------------
export function getPulseEarnMktForagerHealingState() {
  return { ...healingState };
}
