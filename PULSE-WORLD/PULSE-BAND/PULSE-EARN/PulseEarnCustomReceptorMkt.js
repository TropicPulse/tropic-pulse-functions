// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnCustomReceptor-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE GENETIC REGULATOR (v13.0-PRESENCE-IMMORTAL A‑B‑A)
// (Deterministic Marketplace Interpreter + Receptor Builder + v13 Surfaces)
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL A‑B‑A):
//   THE GENETIC REGULATOR — deterministic marketplace interpreter.
//   • Reads receptor DNA from static deterministic config (no network).
//   • Expresses that DNA into a functional v13 receptor phenotype.
//   • Enforces the universal interface (ping, fetchJobs, submitResult, normalizeJob).
//   • Emits v13 presence/advantage/chunk surfaces.
//   • Emits A‑B‑A bandSignature + binaryField + waveField.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO async, NO network, NO randomness, NO timestamps.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NEVER mutate job objects.
//   • READ‑ONLY except deterministic DNA caching.
//   • Unified Earn v13 presence/advantage/chunk schema.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnCustomReceptorMkt",
  version: "v14-IMMORTAL",
  layer: "earn_receptor",
  role: "earn_market_receptor",
  lineage: "PulseEarnCustomReceptorMkt-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    customReceptor: true,
    marketAware: true,
    jobTypeDetection: true,
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
      "PulseEarnCirculatorySystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnCustomReceptorMeta = Object.freeze({
  layer: "PulseEarnCustomReceptor",
  role: "EARN_RECEPTOR_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnCustomReceptor-v13.0-PRESENCE-IMMORTAL",

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

    evolutionAware: true,
    hintsAware: true,
    worldLensAware: false,

    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    deterministicConfigOverride: false,
    neverMutateJobObjects: true
  }),

  contract: Object.freeze({
    input: [
      "DeterministicMarketplaceConfig",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures"
    ]
  })
});

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
// Deterministic Genetic DNA
// ============================================================================
const DETERMINISTIC_RECEPTOR_DNA = {
  id: "CUSTOM",
  name: "Custom Marketplace",
  version: "13.0-PRESENCE-IMMORTAL",
  healthScore: 1.0,

  band: "symbolic", // symbolic | binary

  endpoints: {
    ping: "PING_OK",
    jobs: [],
    submit: "SUBMIT_OK"
  },

  headers: {},

  lineage: "Receptor-GeneticRegulator-v13.0-PRESENCE-IMMORTAL",
  phenotype: "MarketplaceReceptor"
};

// ============================================================================
// Genetic Cache — deterministic, no async
// ============================================================================
let cachedDNA = null;
let customReceptorCycle = 0;

function loadMarketplaceDNA() {
  if (cachedDNA) return cachedDNA;

  cachedDNA = {
    ...DETERMINISTIC_RECEPTOR_DNA,
    band: normalizeBand(DETERMINISTIC_RECEPTOR_DNA.band),
    endpoints: { ...DETERMINISTIC_RECEPTOR_DNA.endpoints }
  };

  return cachedDNA;
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

  const dna = loadMarketplaceDNA();

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || normalizeBand(dna.band),
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "custom-receptor",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "custom-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "custom-region",
    castleId: castle.castleId || "custom-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    cycle,

    presenceSignature: computeHash(
      `CUSTOM_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
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
    planVersion: "v13.0-CustomReceptor-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      receptorEnvelope: true,
      normalizationBlueprint: true
    },
    cache: {
      customReceptorDiagnostics: true
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
function buildBinaryField(dna, cycle) {
  const patternLen =
    String(dna.id).length + String(dna.name).length;

  const density =
    patternLen +
    (dna.endpoints.jobs?.length || 0) +
    (dna.healthScore * 100) +
    cycle;

  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`BCUSTOM::${surface}`),
    binarySurfaceSignature: computeHash(`BCUSTOM_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(dna, cycle, band) {
  const amplitude = (dna.healthScore || 1) * 100 + cycle;
  const wavelength = (dna.endpoints.jobs?.length || 0) + 1;
  const phase = (dna.id.charCodeAt(0) || 1) % 16;
  const b = normalizeBand(band || dna.band);

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
function buildReceptorSignature(dna) {
  return computeHash(
    `RECEPTOR::${dna.id}::${dna.version}::${normalizeBand(dna.band)}`
  );
}

function buildPingSignature(latency) {
  return computeHash(`PING::CUSTOM::${latency}`);
}

function buildJobListSignature(count) {
  return computeHash(`JOBS::CUSTOM::${count}`);
}

function buildSubmissionSignature(jobId, status) {
  return computeHash(`SUBMIT::CUSTOM::${jobId}::${status}`);
}

function buildBandSignature(dna) {
  return computeHash(`RECEPTOR_BAND::${normalizeBand(dna.band)}::${dna.id}`);
}

// ============================================================================
// normalizeJob — strict unified v13 job schema
// ============================================================================
function normalizeJob(raw, globalHints = {}) {
  const dna = loadMarketplaceDNA();

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

  const band = gpuTier === "high" ? "binary" : normalizeBand(dna.band);

  const presenceField = buildPresenceField(globalHints, customReceptorCycle);
  const binaryField = buildBinaryField(dna, customReceptorCycle);
  const waveField = buildWaveField(dna, customReceptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    id: String(raw.id),
    marketplaceId: dna.id,

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

    // Unified v13 surfaces
    presenceField,
    advantageField,
    chunkPlan
  };
}

// ============================================================================
// Receptor Expression — ping(), fetchJobs(), submitResult()
// Unified v13 presence/advantage/chunk surfaces.
// ============================================================================
function ping(globalHints = {}) {
  customReceptorCycle++;

  const dna = loadMarketplaceDNA();

  let latency;
  if (dna.healthScore >= 0.85) latency = 10;
  else if (dna.healthScore >= 0.50) latency = 50;
  else if (dna.healthScore >= 0.15) latency = 150;
  else latency = null;

  const presenceField = buildPresenceField(globalHints, customReceptorCycle);
  const band = normalizeBand(dna.band);
  const binaryField = buildBinaryField(dna, customReceptorCycle);
  const waveField = buildWaveField(dna, customReceptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    latency,
    receptorId: dna.id,
    signature: buildPingSignature(latency),
    bandSignature: buildBandSignature(dna),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

function fetchJobs(globalHints = {}) {
  customReceptorCycle++;

  const dna = loadMarketplaceDNA();
  const jobs = Array.isArray(dna.endpoints.jobs) ? dna.endpoints.jobs : [];

  const normalizedJobs = jobs
    .map(j => normalizeJob(j, globalHints))
    .filter(j => j !== null);

  const presenceField = buildPresenceField(globalHints, customReceptorCycle);
  const band = normalizeBand(dna.band);
  const binaryField = buildBinaryField(dna, customReceptorCycle);
  const waveField = buildWaveField(dna, customReceptorCycle, band);

  const advantageField = buildAdvantageField(
    { band, binaryField, waveField },
    presenceField,
    globalHints
  );

  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  return {
    jobs: normalizedJobs,
    receptorId: dna.id,
    signature: buildJobListSignature(normalizedJobs.length),
    bandSignature: buildBandSignature(dna),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

function submitResult(job, result, globalHints = {}) {
  customReceptorCycle++;

  const dna = loadMarketplaceDNA();

  const presenceField = buildPresenceField(globalHints, customReceptorCycle);
  const band = normalizeBand(dna.band);
  const binaryField = buildBinaryField(dna, customReceptorCycle);
  const waveField = buildWaveField(dna, customReceptorCycle, band);

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
      receptorId: dna.id,
      signature: buildSubmissionSignature("NONE", "INVALID"),
      bandSignature: buildBandSignature(dna),
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan
    };
  }

  const status = dna.endpoints.submit;

  return {
    success: true,
    receptorId: dna.id,
    jobId: job.id,
    result,
    status,
    signature: buildSubmissionSignature(job.id, status),
    bandSignature: buildBandSignature(dna),
    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan
  };
}

// ============================================================================
// Export — The Genetic Regulator Organ (v13.0-PRESENCE-IMMORTAL A‑B‑A)
// ============================================================================
export const PulseEarnCustomReceptor = {
  id: "CUSTOM",
  name: "Custom Marketplace",
  version: "13.0-PRESENCE-IMMORTAL",
  lineage: "Receptor-GeneticRegulator-v13.0-PRESENCE-IMMORTAL",

  receptorSignature: () => buildReceptorSignature(loadMarketplaceDNA()),
  bandSignature: () => buildBandSignature(loadMarketplaceDNA()),

  binaryField: () => buildBinaryField(loadMarketplaceDNA(), customReceptorCycle),
  waveField: () => buildWaveField(loadMarketplaceDNA(), customReceptorCycle, loadMarketplaceDNA().band),

  ping,
  fetchJobs,
  submitResult,
  normalizeJob
};
