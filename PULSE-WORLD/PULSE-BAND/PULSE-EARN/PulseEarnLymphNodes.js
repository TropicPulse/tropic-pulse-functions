// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnLymphNodes-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE LYMPHATIC HANDSHAKE NODES (v13.0-PRESENCE-IMMORTAL)
// (Finalizer of Jobs + Immune-Safe Dispatch + Certified Marketplace Exchange)
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL):
//   THE LYMPHATIC HANDSHAKE NODES — Pulse‑Earn’s immune‑safe finalizers.
//   • Validate job + marketplace identity (immune recognition).
//   • Locate the correct marketplace receptor (antigen matching).
//   • Ensure submitResult() exists (immune compatibility).
//   • Perform deterministic Earn → Marketplace handshake.
//   • Record certified submission outcome (immune memory + signatures).
//   • Emit v13‑Presence‑IMMORTAL presence/advantage/hints surfaces.
//   • Emit binary-first + wave surfaces.
//   • Emit lymphComputeProfile (metadata-only).
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE RESULT DISPATCHER — no AI layers, no translation, no memory model.
//   • NO async, NO timestamps, NO nondeterministic behavior.
//   • NEVER mutate job objects.
//   • Deterministic identity verification + dispatch only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
//   • NO speed, NO baseline, NO governor, NO performance assumptions.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnLymphNodes",
  version: "v14-IMMORTAL",
  layer: "earn_immune",
  role: "earn_lymph_nodes",
  lineage: "PulseEarnLymphNodes-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    lymphNodes: true,
    immuneBuffer: true,
    anomalyQuarantine: true,
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
      "PulseEarnImmuneSystem",
      "PulseEarnHeart",
      "PulseEarnMetabolism"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnLymphNodesMeta = Object.freeze({
  layer: "PulseEarnLymphNodes",
  role: "EARN_LYMPHATIC_HANDSHAKE_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnLymphNodes-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureResultDispatcher: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
    meshAware: true,
    castleAware: true,
    regionAware: true,
    worldLensAware: false,
    zeroAI: true,
    zeroUserCode: true,
    zeroAsync: true
  }),

  contract: Object.freeze({
    input: [
      "EarnJob",
      "EarnJobResult",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "MarketplaceSubmissionResult",
      "LymphaticDiagnostics",
      "LymphaticSignatures",
      "LymphaticHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v13.0-PRESENCE-IMMORTAL",
    ancestry: [
      "PulseEarnLymphNodes-v9",
      "PulseEarnLymphNodes-v10",
      "PulseEarnLymphNodes-v11",
      "PulseEarnLymphNodes-v11-Evo",
      "PulseEarnLymphNodes-v12.3-PRESENCE-EVO+"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Earn → Marketplace handshake",
    adaptive: "binary/wave + presence/advantage/hints surfaces",
    return: "deterministic submission result + lymphatic diagnostics"
  })
});

// ============================================================================
// ROLE CONTEXT — v13 IMMORTAL
// ============================================================================

export const PulseRole = {
  type: "ImmuneDispatch",
  subsystem: "PulseEarnLymphNodes",
  layer: "C2-LymphaticHandshake",
  version: "13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnLymphNodes-v13.0-PRESENCE-IMMORTAL",

  evo: {
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    immuneDispatch: true,
    immuneSafeFinalizer: true,
    immuneRecognition: true,
    antigenMatching: true,
    certifiedHandshake: true,
    deterministicHandshake: true,

    zeroAsync: true,
    zeroTiming: true,
    zeroRandomness: true,
    zeroMutation: true,
    zeroRouting: true,
    zeroSending: false,
    zeroCompute: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    waveAware: true,
    bandNormalizationAware: true,

    earnFinalizer: true,
    earnMarketplaceBridge: true,
    immuneMemoryRecorder: true,

    environmentAgnostic: true,
    multiInstanceReady: true
  }
};

// ============================================================================
// Imports
// ============================================================================

import { PulseEarnReceptor } from "./PulseEarnReceptorMkt.js";
import { PulseEarnCustomReceptor } from "./PulseEarnCustomReceptorMkt.js";

// ============================================================================
// Healing Metadata — v13 IMMORTAL
// ============================================================================

const lymphHealing = {
  lastJobId: null,
  lastMarketplaceId: null,
  lastAdapterUsed: null,
  lastError: null,
  lastResponse: null,
  cycleCount: 0,
  lastCycleIndex: null,

  lastHandshakeSignature: null,
  lastJobSignature: null,
  lastMarketplaceSignature: null,

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastLymphPresenceProfile: null,
  lastBinaryProfile: null,
  lastWaveProfile: null,
  lastLymphComputeProfile: null
};

let lymphCycle = 0;

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
// Signature Builders
// ============================================================================

function buildJobSignature(job) {
  if (!job) return "JOB::NONE";
  return computeHash(`JOB::${job.id}::${job.marketplaceId || "NO_MKT"}`);
}

function buildMarketplaceSignature(marketplaceId) {
  return computeHash(`MKT::${marketplaceId || "NO_MKT"}`);
}

function buildHandshakeSignature(job, cycleIndex) {
  return computeHash(
    `HS::${job?.id || "NO_JOB"}::${job?.marketplaceId || "NO_MKT"}::${cycleIndex}`
  );
}

// ============================================================================
// Receptor Registry
// ============================================================================

const receptorRegistry = {
  A: PulseEarnReceptor,
  CUSTOM: PulseEarnCustomReceptor
};

// ============================================================================
// Presence / Advantage / Hints — v13 IMMORTAL
// ============================================================================

function buildPresenceField(job, globalHints = {}) {
  const meta = job?.meta || {};
  const jp = meta.presenceContext || meta.cardiacPresence || {};

  const mesh = { ...(globalHints.meshSignals || {}), ...(meta.meshSignals || {}) };
  const castle = { ...(globalHints.castleSignals || {}), ...(meta.castleSignals || {}) };
  const region = { ...(globalHints.regionContext || {}), ...(meta.regionContext || {}) };

  const meshPressureIndex = mesh.meshPressureIndex || 0;
  const castleLoadLevel = castle.loadLevel || 0;
  const meshStrength = mesh.meshStrength || 0;

  const pressure = meshPressureIndex + castleLoadLevel;
  let presenceTier = "idle";
  if (pressure >= 150) presenceTier = "critical";
  else if (pressure >= 100) presenceTier = "high";
  else if (pressure >= 50) presenceTier = "elevated";
  else if (pressure > 0) presenceTier = "soft";

  const presenceSignature = computeHash(
    `LYMPH_PRESENCE_V13::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
  );

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,
    presenceSignature,

    bandPresence: jp.bandPresence || (globalHints.presenceContext || {}).bandPresence || "unknown",
    routerPresence: jp.routerPresence || (globalHints.presenceContext || {}).routerPresence || "unknown",
    devicePresence: jp.devicePresence || (globalHints.presenceContext || {}).devicePresence || "unknown",

    meshPresence: jp.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: jp.castlePresence || castle.castlePresence || "unknown",
    regionPresence: jp.regionPresence || region.regionTag || "unknown",

    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",

    castleLoadLevel,
    meshStrength,
    meshPressureIndex
  };
}

function buildAdvantageField(job, globalHints = {}) {
  const meta = job?.meta || {};
  const ja = meta.advantageContext || {};
  const gh = globalHints.advantageContext || {};

  return {
    advantageVersion: "C-13.0",
    advantageScore: ja.score ?? gh.score ?? 0,
    advantageBand: ja.band ?? gh.band ?? "neutral",
    advantageTier: ja.tier ?? gh.tier ?? 0
  };
}

function buildHintsField(job, globalHints = {}) {
  const meta = job?.meta || {};
  const jh = meta.hintsContext || {};

  return {
    fallbackBandLevel:
      jh.fallbackBandLevel ??
      globalHints.fallbackBandLevel ??
      0,

    chunkHints: {
      ...(globalHints.chunkHints || {}),
      ...(jh.chunkHints || {})
    },

    cacheHints: {
      ...(globalHints.cacheHints || {}),
      ...(jh.cacheHints || {})
    },

    prewarmHints: {
      ...(globalHints.prewarmHints || {}),
      ...(jh.prewarmHints || {})
    },

    coldStartHints: {
      ...(globalHints.coldStartHints || {}),
      ...(jh.coldStartHints || {})
    }
  };
}

// ============================================================================
// Lymph Compute Profile (metadata-only)
// ============================================================================

function normalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function buildLymphComputeProfile(band, hintsField) {
  return {
    routeBand: band,
    fallbackBandLevel: hintsField.fallbackBandLevel,
    chunkAggression: hintsField.chunkHints.chunkAggression ?? 0,
    prewarmNeeded: !!hintsField.prewarmHints.shouldPrewarm,
    cachePriority: normalizeCachePriority(hintsField.cacheHints.priority),
    coldStartRisk: !!hintsField.coldStartHints.coldStartRisk
  };
}

// ============================================================================
// Binary + Wave Surfaces
// ============================================================================

function buildLymphBandBinaryWave(job, cycleIndex, presenceField) {
  const band = normalizeBand(job?.band || job?.meta?.band || "symbolic");
  lymphHealing.lastBand = band;
  lymphHealing.lastBandSignature = computeHash(`BAND::${band}`);

  const jobIdLength = (job?.id || "").length;
  const marketplaceLength = (job?.marketplaceId || "").length;

  const surface =
    jobIdLength +
    marketplaceLength +
    cycleIndex +
    (presenceField?.meshPressureIndex || 0) +
    (presenceField?.castleLoadLevel || 0);

  const binaryField = {
    binaryLymphSignature: computeHash(`BLYMPH::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_LYMPH::${surface}`),
    binarySurface: {
      jobIdLength,
      marketplaceLength,
      cycle: cycleIndex,
      meshPressureIndex: presenceField?.meshPressureIndex || 0,
      castleLoadLevel: presenceField?.castleLoadLevel || 0,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: jobIdLength,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  lymphHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: jobIdLength + (presenceField?.meshStrength || 0),
    wavelength: cycleIndex,
    phase:
      (jobIdLength +
        cycleIndex +
        (presenceField?.meshPressureIndex || 0)) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  lymphHealing.lastWaveField = waveField;

  return { band, binaryField, waveField };
}

// ============================================================================
// submitPulseEarnResult — Deterministic Lymphatic Handshake (v13 IMMORTAL)
// ============================================================================

export function submitPulseEarnResult(job, result, globalHints = {}) {
  lymphCycle++;
  lymphHealing.cycleCount++;
  lymphHealing.lastCycleIndex = lymphCycle;

  const presenceField = buildPresenceField(job, globalHints);
  const advantageField = buildAdvantageField(job, globalHints);
  const hintsField = buildHintsField(job, globalHints);
  const presenceTier = presenceField.presenceTier;

  lymphHealing.lastPresenceField = presenceField;
  lymphHealing.lastAdvantageField = advantageField;
  lymphHealing.lastHintsField = hintsField;

  const { band, binaryField, waveField } = buildLymphBandBinaryWave(
    job,
    lymphCycle,
    presenceField
  );

  const lymphComputeProfile = buildLymphComputeProfile(band, hintsField);

  const lymphPresenceProfile = {
    presenceTier,
    band,
    meshPressureIndex: presenceField.meshPressureIndex,
    castleLoadLevel: presenceField.castleLoadLevel,
    advantageTier: advantageField.advantageTier,
    fallbackBandLevel: hintsField.fallbackBandLevel
  };

  const binaryProfile = { binaryField, presenceTier };
  const waveProfile = { waveField, presenceTier };

  lymphHealing.lastLymphPresenceProfile = lymphPresenceProfile;
  lymphHealing.lastBinaryProfile = binaryProfile;
  lymphHealing.lastWaveProfile = waveProfile;
  lymphHealing.lastLymphComputeProfile = lymphComputeProfile;

  try {
    if (!job || !job.marketplaceId) {
      lymphHealing.lastError = "missing_marketplaceId";
      lymphHealing.lastJobId = job?.id ?? null;
      lymphHealing.lastMarketplaceId = job?.marketplaceId ?? null;

      const failure = {
        success: false,
        error: "Job missing marketplaceId",
        jobId: job?.id ?? null,
        marketplaceId: job?.marketplaceId ?? null,
        band,
        binaryField,
        waveField,
        presenceField,
        advantageField,
        hintsField,
        lymphPresenceProfile,
        binaryProfile,
        waveProfile,
        lymphComputeProfile,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastJobSignature = buildJobSignature(job);
      lymphHealing.lastMarketplaceSignature = buildMarketplaceSignature(
        job?.marketplaceId
      );
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    lymphHealing.lastJobId = job.id;
    lymphHealing.lastMarketplaceId = job.marketplaceId;

    lymphHealing.lastJobSignature = buildJobSignature(job);
    lymphHealing.lastMarketplaceSignature = buildMarketplaceSignature(
      job.marketplaceId
    );

    const adapter = receptorRegistry[job.marketplaceId];

    if (!adapter) {
      lymphHealing.lastError = "unknown_marketplace";

      const failure = {
        success: false,
        error: `Unknown marketplace: ${job.marketplaceId}`,
        jobId: job.id,
        marketplaceId: job.marketplaceId,
        band,
        binaryField,
        waveField,
        presenceField,
        advantageField,
        hintsField,
        lymphPresenceProfile,
        binaryProfile,
        waveProfile,
        lymphComputeProfile,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    if (typeof adapter.submitResult !== "function") {
      lymphHealing.lastError = "adapter_missing_submitResult";

      const failure = {
        success: false,
        error: `Marketplace ${job.marketplaceId} does not support result submission`,
        jobId: job.id,
        marketplaceId: job.marketplaceId,
        band,
        binaryField,
        waveField,
        presenceField,
        advantageField,
        hintsField,
        lymphPresenceProfile,
        binaryProfile,
        waveProfile,
        lymphComputeProfile,
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    lymphHealing.lastAdapterUsed = job.marketplaceId;

    const response = adapter.submitResult(job, result);

    lymphHealing.lastResponse = response;
    lymphHealing.lastError = null;
    lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

    return {
      ...response,
      band,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      hintsField,
      lymphPresenceProfile,
      binaryProfile,
      waveProfile,
      lymphComputeProfile,   // ← THIS WAS MISSING
      cycleIndex: lymphCycle
    };


  } catch (err) {
    lymphHealing.lastError = err.message;

    const failure = {
      success: false,
      error: err.message,
      jobId: job?.id ?? null,
      marketplaceId: job?.marketplaceId ?? null,
      band,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      hintsField,
      lymphPresenceProfile,
      binaryProfile,
      waveProfile,
      lymphComputeProfile,   // ← ALSO MUST BE INCLUDED HERE
      cycleIndex: lymphCycle
    };


    lymphHealing.lastResponse = failure;
    lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

    return failure;
  }
}


// ---------------------------------------------------------------------------
// sendResultToMarketplace — alias for Nervous System (backwards compatible)
// ---------------------------------------------------------------------------
export function sendResultToMarketplace(job, result, globalHints) {
  return submitPulseEarnResult(job, result, globalHints);
}


// ---------------------------------------------------------------------------
// Export Healing Metadata — Lymphatic Dispatch Report
// ---------------------------------------------------------------------------
export function getPulseEarnLymphHealingState() {
  return { ...lymphHealing };
}
