// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnReceptor-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE STANDARD RECEPTOR (Marketplace Protocol + Universal Adapter)
// PULSE EARN — v13.0-PRESENCE-IMMORTAL A‑B‑A
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL A‑B‑A):
//   THE STANDARD RECEPTOR — Pulse‑Earn’s canonical marketplace interface.
//   • Deterministic sensory receptor for marketplace signals.
//   • Pure adapter: ping(), fetchJobs(), submitResult(), normalizeJob().
//   • Configurable receptor DNA (no network).
//   • Emits receptorPattern, receptorSignature, endpointSignature.
//   • Emits unified v13 presence/advantage/chunk surfaces.
//   • Emits A‑B‑A bandSignature + binaryField + waveField.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO async, NO network, NO randomness, NO timestamps.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • READ‑ONLY except deterministic config override.
//   • NEVER mutate job objects.
//   • Unified Earn v13 presence/advantage/chunk schema.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnReceptorMkt",
  version: "v14-IMMORTAL",
  layer: "earn_receptor",
  role: "earn_market_receptor",
  lineage: "PulseEarnReceptorMkt-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    receptor: true,
    marketSignalIntake: true,
    jobTypeDetection: true,
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
      "PulseEarnNervousSystem",
      "PulseEarnReflexRouter",
      "PulseEarnMktAmbassador"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnReceptorMeta = Object.freeze({
  layer: "PulseEarnReceptor",
  role: "EARN_STANDARD_RECEPTOR",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnReceptor-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
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
    hintsAware: true,
    healingMetadataAware: false,

    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    deterministicConfigOverride: true,
    neverMutateJobObjects: true
  }),

  contract: Object.freeze({
    input: [
      "ReceptorConfigDNA",
      "DualBandContext",
      "MarketplaceSignal",
      "ReceptorNormalizationRules",
      "GlobalHintsPresenceField"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures",
      "ReceptorHealingState"
    ]
  })
});

// ============================================================================
// INTERNAL STATE — deterministic, drift-proof
// ============================================================================
let receptorConfig = {
  id: "A",
  name: "PulseEarn Receptor A",
  healthScore: 1.0,

  // A‑B‑A band identity
  band: "symbolic", // symbolic | binary

  endpoints: {
    pingSignal: "PING_OK",
    jobs: [],              // deterministic job list
    submitStatus: "SUBMIT_OK"
  }
};

let receptorCycle = 0;

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

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

// ============================================================================
// Unified v13 Presence Field
// ============================================================================
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

function buildPresenceField(globalHints = {}, cycle) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  const internalComposite = cycle * 0.0001;
  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || normalizeBand(receptorConfig.band),
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "standard-receptor",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "receptor-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "receptor-region",
    castleId: castle.castleId || "receptor-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    cycle,

    presenceSignature: computeHash(
      `RECEPTOR_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  };
}

// ============================================================================
// Advantage‑C v13
// ============================================================================
function buildAdvantageField(bandPack, presenceField, globalHints = {}) {
  const density = bandPack.binaryField.binarySurface.density;
  const amplitude = bandPack.waveField.amplitude;

  const baseScore =
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
    advantageScore,
    advantageTier,
    fallbackBandLevel
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan v13
// ============================================================================
function buildChunkPrewarmPlan(presenceField, advantageField) {
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
    planVersion: "v13.0-StandardReceptor-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      receptorEnvelope: true,
      normalizationBlueprint: true
    },
    cache: {
      receptorDiagnostics: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      lymphNodes: true
    }
  };
}

// ============================================================================
// A‑B‑A Binary + Wave Surfaces (v13)
// ============================================================================
function buildBinaryField(cfg, cycle) {
  const patternLen =
    String(cfg.id).length + String(cfg.name).length;

  const density =
    patternLen +
    (cfg.endpoints.jobs?.length || 0) +
    (cfg.healthScore * 100) +
    cycle;

  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BRECEPTOR::${surface}`),
    binarySurfaceSignature: computeHash(`BRECEPTOR_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(cfg, cycle, band) {
  const amplitude = (cfg.healthScore || 1) * 100 + cycle;
  const wavelength = (cfg.endpoints.jobs?.length || 0) + 1;
  const phase = (cfg.id.charCodeAt(0) || 1) % 16;
  const b = normalizeBand(band || cfg.band);

  return {
    amplitude,
    wavelength,
    phase,
    band: b,
    mode: b === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

// ============================================================================
// Signature Builders
// ============================================================================
function buildReceptorPattern(cfg) {
  return (
    `RECEPTOR::${cfg.id}` +
    `::name:${cfg.name}` +
    `::health:${cfg.healthScore}` +
    `::jobs:${Array.isArray(cfg.endpoints.jobs) ? cfg.endpoints.jobs.length : 0}` +
    `::submit:${cfg.endpoints.submitStatus}` +
    `::band:${normalizeBand(cfg.band)}`
  );
}

function buildReceptorSignature(cfg) {
  return computeHash(
    `${cfg.id}::${cfg.name}::${cfg.healthScore}::${cfg.endpoints.submitStatus}::${normalizeBand(cfg.band)}`
  );
}

function buildEndpointSignature(cfg) {
  return computeHash(
    `ENDPOINTS::jobs:${Array.isArray(cfg.endpoints.jobs) ? cfg.endpoints.jobs.length : 0}` +
    `::submit:${cfg.endpoints.submitStatus}` +
    `::band:${normalizeBand(cfg.band)}`
  );
}

function buildBandSignature(cfg) {
  return computeHash(`RECEPTOR_BAND::${normalizeBand(cfg.band)}::${cfg.id}`);
}

// ============================================================================
// Health Tier
// ============================================================================
function classifyHealth(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "healthy";
  if (h >= 0.85) return "soft";
  if (h >= 0.50) return "mid";
  if (h >= 0.15) return "hard";
  return "critical";
}

// ============================================================================
// CONFIG OVERRIDE — deterministic only
// ============================================================================
export function configurePulseEarnReceptor(config) {
  receptorConfig = {
    ...receptorConfig,
    ...config,
    band: normalizeBand(config?.band ?? receptorConfig.band),
    endpoints: {
      ...receptorConfig.endpoints,
      ...(config?.endpoints || {})
    }
  };
}

// ============================================================================
// normalizeJob — strict unified v13 job schema
// ============================================================================
function normalizeJob(raw, globalHints = {}) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  if (!raw.id) {
    return null;
  }

  const payout = Number(raw.payout ?? raw.reward ?? 0);
  if (!Number.isFinite(payout) || payout <= 0) {
    return null;
  }

  const cpuRequired = Number(raw.cpu ?? 1);
  const memoryRequired = Number(raw.memory ?? 1024);
  const estimatedSeconds = Number(raw.estimatedSeconds ?? 600);

  if (
    !Number.isFinite(cpuRequired) || cpuRequired <= 0 ||
    !Number.isFinite(memoryRequired) || memoryRequired <= 0 ||
    !Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0
  ) {
    return null;
  }

  const gpuTierRaw = raw.gpuTier ?? (raw.gpu ? "high" : "low");
  const gpuTier =
    gpuTierRaw === "high" ? "high" :
    gpuTierRaw === "mid" ? "mid" :
    gpuTierRaw === "low" ? "low" :
    "low";

  const minGpuScore =
    gpuTier === "high"
      ? 600
      : gpuTier === "mid"
      ? 400
      : gpuTier === "low"
      ? 250
      : 150;

  const bandwidthNeededMbps = Number(raw.bandwidth ?? 5);

  const band = gpuTier === "high" ? "binary" : normalizeBand(receptorConfig.band);

  const presenceField = buildPresenceField(globalHints, receptorCycle);
  const binaryField = buildBinaryField(receptorConfig, receptorCycle);
  const waveField = buildWaveField(receptorConfig, receptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    id: String(raw.id),
    marketplaceId: receptorConfig.id,

    payout,
    cpuRequired,
    memoryRequired,
    estimatedSeconds,

    minGpuScore,
    bandwidthNeededMbps,

    // A‑B‑A hints
    _abaBand: band,
    _abaBinaryDensity: binaryField.binarySurface.density,
    _abaWaveAmplitude: waveField.amplitude,

    // Unified v13 presence/advantage/chunk
    presenceField,
    advantageField,
    chunkPlan
  };
}

// ============================================================================
// Sensory Functions — ping(), fetchJobs(), submitResult()
// PURE deterministic behavior, unified v13 presence surfaces.
// ============================================================================
function ping(globalHints = {}) {
  receptorCycle++;

  const tier = classifyHealth(receptorConfig.healthScore);

  let latency;
  if (tier === "healthy") latency = 10;
  else if (tier === "soft") latency = 50;
  else if (tier === "mid") latency = 150;
  else if (tier === "hard") latency = 300;
  else latency = null; // critical → no signal

  const presenceField = buildPresenceField(globalHints, receptorCycle);
  const band = normalizeBand(receptorConfig.band);
  const binaryField = buildBinaryField(receptorConfig, receptorCycle);
  const waveField = buildWaveField(receptorConfig, receptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    latency,
    receptorId: receptorConfig.id,
    signature: computeHash(`PING::${latency}`),
    bandSignature: buildBandSignature(receptorConfig),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

function fetchJobs(globalHints = {}) {
  receptorCycle++;

  const jobs = receptorConfig.endpoints.jobs;
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const normalizedJobs = safeJobs
    .map(j => normalizeJob(j, globalHints))
    .filter(j => j !== null);

  const presenceField = buildPresenceField(globalHints, receptorCycle);
  const band = normalizeBand(receptorConfig.band);
  const binaryField = buildBinaryField(receptorConfig, receptorCycle);
  const waveField = buildWaveField(receptorConfig, receptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    jobs: normalizedJobs,
    receptorId: receptorConfig.id,
    signature: computeHash(`JOBS::${normalizedJobs.length}`),
    bandSignature: buildBandSignature(receptorConfig),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

function submitResult(job, result, globalHints = {}) {
  receptorCycle++;

  const presenceField = buildPresenceField(globalHints, receptorCycle);
  const band = normalizeBand(receptorConfig.band);
  const binaryField = buildBinaryField(receptorConfig, receptorCycle);
  const waveField = buildWaveField(receptorConfig, receptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  if (!job || !job.id) {
    return {
      success: false,
      error: "invalid_job",
      receptorId: receptorConfig.id,
      signature: computeHash(`SUBMIT::NONE::INVALID`),
      bandSignature: buildBandSignature(receptorConfig),
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan
    };
  }

  const status = receptorConfig.endpoints.submitStatus;

  return {
    success: true,
    receptorId: receptorConfig.id,
    jobId: job.id,
    result,
    status,
    signature: computeHash(`SUBMIT::${job.id}::${status}`),
    bandSignature: buildBandSignature(receptorConfig),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

// ============================================================================
// PUBLIC EXPORT — PulseEarnReceptor v13.0-PRESENCE-IMMORTAL A‑B‑A
// ============================================================================
export const PulseEarnReceptor = {
  id: () => receptorConfig.id,
  name: () => receptorConfig.name,

  receptorSignature: () => buildReceptorSignature(receptorConfig),
  endpointSignature: () => buildEndpointSignature(receptorConfig),
  receptorPattern: () => buildReceptorPattern(receptorConfig),
  bandSignature: () => buildBandSignature(receptorConfig),

  binaryField: () => buildBinaryField(receptorConfig, receptorCycle),
  waveField: () => buildWaveField(receptorConfig, receptorCycle, receptorConfig.band),

  ping,
  fetchJobs,
  submitResult,
  normalizeJob,

  diagnostics(globalHints = {}) {
    const presenceField = buildPresenceField(globalHints, receptorCycle);
    const band = normalizeBand(receptorConfig.band);
    const binaryField = buildBinaryField(receptorConfig, receptorCycle);
    const waveField = buildWaveField(receptorConfig, receptorCycle, band);

    const advantageField = buildAdvantageField(
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

    return {
      id: receptorConfig.id,
      name: receptorConfig.name,
      healthScore: receptorConfig.healthScore,
      healthTier: classifyHealth(receptorConfig.healthScore),

      band,
      bandSignature: buildBandSignature(receptorConfig),

      receptorSignature: buildReceptorSignature(receptorConfig),
      endpointSignature: buildEndpointSignature(receptorConfig),
      receptorPattern: buildReceptorPattern(receptorConfig),

      binaryField,
      waveField,

      jobCount: Array.isArray(receptorConfig.endpoints.jobs)
        ? receptorConfig.endpoints.jobs.length
        : 0,

      presenceField,
      advantageField,
      chunkPlan
    };
  }
};
