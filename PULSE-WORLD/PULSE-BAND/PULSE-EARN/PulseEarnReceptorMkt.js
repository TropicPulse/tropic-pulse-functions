// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnReceptor-v12.3-PRESENCE-EVO+.js
// LAYER: THE STANDARD RECEPTOR (Marketplace Protocol + Universal Adapter)
// PULSE EARN — v12.3-PRESENCE-EVO+ A‑B‑A
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+ A‑B‑A):
//   THE STANDARD RECEPTOR — Pulse‑Earn’s canonical marketplace interface.
//   • Deterministic sensory receptor for marketplace signals.
//   • Pure adapter: ping(), fetchJobs(), submitResult().
//   • Configurable receptor DNA (no network).
//   • Emits receptorPattern, receptorSignature, endpointSignature.
//   • Emits A‑B‑A bandSignature + binaryField + waveField + presence surfaces.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO async, NO network, NO randomness, NO timestamps.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • READ‑ONLY except deterministic config override.
//   • NEVER mutate job objects.
//   • Presence/advantage/hints are metadata-only.
// ============================================================================
export const PulseEarnReceptorMeta = Object.freeze({
  layer: "PulseEarnReceptor",
  role: "EARN_STANDARD_RECEPTOR",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnReceptor-v12.3-PRESENCE-EVO+",

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
    healingMetadataAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
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
      "ReceptorSignatures",
      "ReceptorHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnReceptor-v9",
      "PulseEarnReceptor-v10",
      "PulseEarnReceptor-v11",
      "PulseEarnReceptor-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic receptor DNA → stable phenotype",
    adaptive: "binary/wave surfaces + band + presence/advantage surfaces",
    return: "deterministic ping/fetchJobs/submitResult"
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
// Presence / Advantage / Hints Surfaces (metadata-only)
// ============================================================================
function buildPresenceField(globalHints = {}) {
  const gh = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  return {
    bandPresence: gh.bandPresence || "unknown",
    routerPresence: gh.routerPresence || "unknown",
    devicePresence: gh.devicePresence || "unknown",
    meshPresence: mesh.meshStrength || "unknown",
    castlePresence: castle.castlePresence || "unknown",
    regionPresence: region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || "unknown",
    meshStrength: mesh.meshStrength || "unknown",
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantagePresenceField(globalHints = {}) {
  const adv = globalHints.advantageContext || {};
  return {
    advantageScore: adv.score ?? null,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? "unknown"
  };
}

function buildHintsField(globalHints = {}) {
  return {
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0,
    chunkHints: globalHints.chunkHints || {},
    cacheHints: globalHints.cacheHints || {},
    prewarmHints: globalHints.prewarmHints || {},
    coldStartHints: globalHints.coldStartHints || {}
  };
}

// ============================================================================
// A‑B‑A Binary + Wave Surfaces
// ============================================================================
function buildBinaryField(cfg) {
  const patternLen =
    String(cfg.id).length + String(cfg.name).length;

  const density =
    patternLen +
    (cfg.endpoints.jobs?.length || 0) +
    (cfg.healthScore * 100);

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

function buildWaveField(cfg) {
  const amplitude = (cfg.healthScore || 1) * 100;
  const wavelength = (cfg.endpoints.jobs?.length || 0) + 1;
  const phase = (cfg.id.charCodeAt(0) || 1) % 16;
  const band = normalizeBand(cfg.band);

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
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
// Sensory Functions — ping(), fetchJobs(), submitResult()
// PURE deterministic behavior, now presence-aware as metadata.
// ============================================================================
function ping(globalHints = {}) {
  const tier = classifyHealth(receptorConfig.healthScore);

  let latency;
  if (tier === "healthy") latency = 10;
  else if (tier === "soft") latency = 50;
  else if (tier === "mid") latency = 150;
  else if (tier === "hard") latency = 300;
  else latency = null; // critical → no signal

  const presenceField = buildPresenceField(globalHints);
  const advantagePresenceField = buildAdvantagePresenceField(globalHints);
  const hintsField = buildHintsField(globalHints);

  return {
    latency,
    receptorId: receptorConfig.id,
    signature: computeHash(`PING::${latency}`),
    bandSignature: buildBandSignature(receptorConfig),
    binaryField: buildBinaryField(receptorConfig),
    waveField: buildWaveField(receptorConfig),
    presenceField,
    advantagePresenceField,
    hintsField
  };
}

function fetchJobs(globalHints = {}) {
  const jobs = receptorConfig.endpoints.jobs;
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  const expressed = safeJobs.map(j => ({
    ...j,
    marketplaceId: receptorConfig.id
  }));

  const presenceField = buildPresenceField(globalHints);
  const advantagePresenceField = buildAdvantagePresenceField(globalHints);
  const hintsField = buildHintsField(globalHints);

  return {
    jobs: expressed,
    receptorId: receptorConfig.id,
    signature: computeHash(`JOBS::${expressed.length}`),
    bandSignature: buildBandSignature(receptorConfig),
    binaryField: buildBinaryField(receptorConfig),
    waveField: buildWaveField(receptorConfig),
    presenceField,
    advantagePresenceField,
    hintsField
  };
}

function submitResult(job, result, globalHints = {}) {
  const presenceField = buildPresenceField(globalHints);
  const advantagePresenceField = buildAdvantagePresenceField(globalHints);
  const hintsField = buildHintsField(globalHints);

  if (!job || !job.id) {
    return {
      success: false,
      error: "invalid_job",
      receptorId: receptorConfig.id,
      signature: computeHash(`SUBMIT::NONE::INVALID`),
      bandSignature: buildBandSignature(receptorConfig),
      binaryField: buildBinaryField(receptorConfig),
      waveField: buildWaveField(receptorConfig),
      presenceField,
      advantagePresenceField,
      hintsField
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
    binaryField: buildBinaryField(receptorConfig),
    waveField: buildWaveField(receptorConfig),
    presenceField,
    advantagePresenceField,
    hintsField
  };
}

// ============================================================================
// PUBLIC EXPORT — PulseEarnReceptor v12.3-PRESENCE-EVO+ A‑B‑A
// ============================================================================
export const PulseEarnReceptor = {
  id: () => receptorConfig.id,
  name: () => receptorConfig.name,

  receptorSignature: () => buildReceptorSignature(receptorConfig),
  endpointSignature: () => buildEndpointSignature(receptorConfig),
  receptorPattern: () => buildReceptorPattern(receptorConfig),
  bandSignature: () => buildBandSignature(receptorConfig),

  binaryField: () => buildBinaryField(receptorConfig),
  waveField: () => buildWaveField(receptorConfig),

  ping,
  fetchJobs,
  submitResult,

  diagnostics(globalHints = {}) {
    const presenceField = buildPresenceField(globalHints);
    const advantagePresenceField = buildAdvantagePresenceField(globalHints);
    const hintsField = buildHintsField(globalHints);

    return {
      id: receptorConfig.id,
      name: receptorConfig.name,
      healthScore: receptorConfig.healthScore,
      healthTier: classifyHealth(receptorConfig.healthScore),

      band: normalizeBand(receptorConfig.band),
      bandSignature: buildBandSignature(receptorConfig),

      receptorSignature: buildReceptorSignature(receptorConfig),
      endpointSignature: buildEndpointSignature(receptorConfig),
      receptorPattern: buildReceptorPattern(receptorConfig),

      binaryField: buildBinaryField(receptorConfig),
      waveField: buildWaveField(receptorConfig),

      jobCount: Array.isArray(receptorConfig.endpoints.jobs)
        ? receptorConfig.endpoints.jobs.length
        : 0,

      presenceField,
      advantagePresenceField,
      hintsField
    };
  }
};
