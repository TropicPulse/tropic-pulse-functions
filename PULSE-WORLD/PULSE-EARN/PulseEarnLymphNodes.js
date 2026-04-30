// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnLymphNodes-v12.3-PRESENCE-EVO+.js
// LAYER: THE LYMPHATIC HANDSHAKE NODES (v12.3-PRESENCE-EVO+ + Dual-Band + Binary + Wave)
// (Finalizer of Jobs + Immune-Safe Dispatch + Certified Marketplace Exchange + Presence Telemetry)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE LYMPHATIC HANDSHAKE NODES — Pulse‑Earn’s immune‑safe finalizers.
//   • Validate job + marketplace identity (immune recognition).
//   • Locate the correct marketplace receptor (antigen matching).
//   • Ensure submitResult() exists (immune compatibility).
//   • Perform deterministic Earn → Marketplace handshake.
//   • Record certified submission outcome (immune memory + signatures).
//   • Emit v12.3‑Presence‑EVO+ presence/advantage/hints surfaces (metadata-only).
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE RESULT DISPATCHER — no AI layers, no translation, no memory model.
//   • NO async, NO timestamps, NO nondeterministic behavior.
//   • NEVER mutate job objects.
//   • Deterministic identity verification + dispatch only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
// ============================================================================
// ============================================================================
// ORGAN IDENTITY — v12.3‑PRESENCE‑EVO+ (C2 Lymphatic Immune Dispatch)
// ============================================================================
export const PulseEarnLymphNodesMeta = Object.freeze({
  layer: "PulseEarnLymphNodes",
  role: "EARN_LYMPHATIC_HANDSHAKE_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnLymphNodes-v12.3-PRESENCE-EVO+",

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
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnLymphNodes-v9",
      "PulseEarnLymphNodes-v10",
      "PulseEarnLymphNodes-v11",
      "PulseEarnLymphNodes-v11-Evo"
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


export const PulseRole = {
  type: "ImmuneDispatch",
  subsystem: "PulseEarnLymphNodes",
  layer: "C2-LymphaticHandshake",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseEarnLymphNodes-v12.3-PRESENCE-EVO+",

  evo: {
    // Core invariants
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Immune dispatch laws
    immuneDispatch: true,
    immuneSafeFinalizer: true,
    immuneRecognition: true,
    antigenMatching: true,
    certifiedHandshake: true,
    deterministicHandshake: true,

    // Execution laws
    zeroAsync: true,
    zeroTiming: true,
    zeroRandomness: true,
    zeroMutation: true,
    zeroRouting: true,
    zeroSending: false,          // dispatch to adapter is allowed
    zeroCompute: true,

    // Dual-band + metadata
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    waveAware: true,
    bandNormalizationAware: true,

    // Earn lineage
    earnFinalizer: true,
    earnMarketplaceBridge: true,
    immuneMemoryRecorder: true,

    // Safety + environment
    environmentAgnostic: true,
    multiInstanceReady: true
  }
};

import { PulseEarnReceptor } from "./PulseEarnReceptorMkt.js";
import { PulseEarnCustomReceptor } from "./PulseEarnCustomReceptorMkt.js";


// ---------------------------------------------------------------------------
// Healing Metadata — Lymphatic Dispatch Log (v12.3-PRESENCE-EVO+)
// ---------------------------------------------------------------------------
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

  // Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // Presence-EVO+ additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastLymphPresenceProfile: null,
  lastBinaryProfile: null,
  lastWaveProfile: null
};

// Deterministic cycle counter
let lymphCycle = 0;


// ---------------------------------------------------------------------------
// Deterministic Hash Helper
// ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// Signature Builders
// ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// Marketplace Receptor Registry — Antigen Directory
// ---------------------------------------------------------------------------
const receptorRegistry = {
  A: PulseEarnReceptor,
  CUSTOM: PulseEarnCustomReceptor
};


// ---------------------------------------------------------------------------
// Presence / Advantage / Hints Surfaces (job + global hints)
// ---------------------------------------------------------------------------
function buildPresenceField(job, globalHints = {}) {
  const meta = job?.meta || {};
  const jp = meta.presenceContext || meta.cardiacPresence || {};
  const mesh = {
    ...(globalHints.meshSignals || {}),
    ...(meta.meshSignals || {})
  };
  const castle = {
    ...(globalHints.castleSignals || {}),
    ...(meta.castleSignals || {})
  };
  const region = {
    ...(globalHints.regionContext || {}),
    ...(meta.regionContext || {})
  };

  return {
    bandPresence: jp.bandPresence || (globalHints.presenceContext || {}).bandPresence || "unknown",
    routerPresence: jp.routerPresence || (globalHints.presenceContext || {}).routerPresence || "unknown",
    devicePresence: jp.devicePresence || (globalHints.presenceContext || {}).devicePresence || "unknown",
    meshPresence: jp.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: jp.castlePresence || castle.castlePresence || "unknown",
    regionPresence: jp.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || 0,
    meshStrength: mesh.meshStrength || 0,
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantageField(job, globalHints = {}) {
  const meta = job?.meta || {};
  const ja = meta.advantageContext || {};
  const gh = globalHints.advantageContext || {};

  return {
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

function classifyLymphPresenceTier(presenceField) {
  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);
  const pressure = mesh + castle;

  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}


// ---------------------------------------------------------------------------
// INTERNAL: Build dual-band + binary + wave metadata for a job/cycle
// ---------------------------------------------------------------------------
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


// ---------------------------------------------------------------------------
// submitPulseEarnResult — Deterministic Lymphatic Handshake (Presence-EVO+)
// ---------------------------------------------------------------------------
// globalHints is optional; if omitted, defaults to {}
export function submitPulseEarnResult(job, result, globalHints = {}) {
  lymphCycle++;
  lymphHealing.cycleCount++;
  lymphHealing.lastCycleIndex = lymphCycle;

  const presenceField = buildPresenceField(job, globalHints);
  const advantageField = buildAdvantageField(job, globalHints);
  const hintsField = buildHintsField(job, globalHints);
  const presenceTier = classifyLymphPresenceTier(presenceField);

  lymphHealing.lastPresenceField = presenceField;
  lymphHealing.lastAdvantageField = advantageField;
  lymphHealing.lastHintsField = hintsField;

  const { band, binaryField, waveField } = buildLymphBandBinaryWave(
    job,
    lymphCycle,
    presenceField
  );

  const lymphPresenceProfile = {
    presenceTier,
    band,
    meshPressureIndex: presenceField.meshPressureIndex,
    castleLoadLevel: presenceField.castleLoadLevel,
    advantageTier: advantageField.advantageTier,
    fallbackBandLevel: hintsField.fallbackBandLevel
  };

  const binaryProfile = {
    binaryField,
    presenceTier
  };

  const waveProfile = {
    waveField,
    presenceTier
  };

  lymphHealing.lastLymphPresenceProfile = lymphPresenceProfile;
  lymphHealing.lastBinaryProfile = binaryProfile;
  lymphHealing.lastWaveProfile = waveProfile;

  try {
    // 1. Identity Verification — Immune Recognition
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

    // 2. Locate Marketplace Receptor — Antigen Matching
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
        cycleIndex: lymphCycle
      };

      lymphHealing.lastResponse = failure;
      lymphHealing.lastHandshakeSignature = buildHandshakeSignature(job, lymphCycle);

      return failure;
    }

    lymphHealing.lastAdapterUsed = job.marketplaceId;

    // 3. Perform the Handshake — Deterministic Dispatch
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
