// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMetabolism-v12.3-PRESENCE-EVO+.js
// LAYER: THE METABOLIC ENGINEER (v12.3-PRESENCE-EVO+ + Dual-Band + Binary + Wave)
// (Interpreter of Jobs + Safe Executor + Deterministic Throughput Engine + Presence Metabolism)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE METABOLIC ENGINEER — Pulse‑Earn’s deterministic execution organ.
//   • Reads the blueprint (job payload).
//   • Selects the correct safe tool (compute/image/script handler).
//   • Applies deterministic metabolic scaling (conceptual only).
//   • Produces deterministic, drift‑proof results.
//   • Emits v12.3‑Presence‑EVO+ signatures + diagnostics.
//   • Never improvises, never executes unsafe code.
//   • NOW dual-band, binary-aware, wave-aware, presence/advantage/hints-aware.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE EXECUTION BRIDGE — no AI layers, no translation, no memory model.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO user scripts, NO network calls, NO filesystem access.
//   • NEVER mutate job objects.
//   • Deterministic output only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
// ============================================================================
export const PulseEarnMetabolismMeta = Object.freeze({
  layer: "PulseEarnMetabolism",
  role: "EARN_METABOLISM_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMetabolism-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureExecutionBridge: true,
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
    zeroAsync: true,
    safeToolSelection: true,
    safeExecution: true
  }),

  contract: Object.freeze({
    input: [
      "PulseEarnJob",
      "DualBandContext",
      "MetabolicBlueprint",
      "SafeToolset",
      "GlobalHintsPresenceField"
    ],
    output: [
      "MetabolicResult",
      "MetabolicDiagnostics",
      "MetabolicSignatures",
      "MetabolicHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnMetabolism-v9",
      "PulseEarnMetabolism-v10",
      "PulseEarnMetabolism-v11",
      "PulseEarnMetabolism-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "validate job → deterministic tool selection",
    adaptive: "binary/wave metabolic surfaces + dual-band + presence/advantage/hints surfaces",
    return: "deterministic metabolic output + healing metadata"
  })
});


// ============================================================================
// Healing Metadata — Metabolic Work Log (v12.3-PRESENCE-EVO+)
// ============================================================================
const metabolicHealing = {
  lastJobId: null,
  lastPayloadType: null,
  lastError: null,
  lastResult: null,
  cycleCount: 0,
  executionState: "idle", // idle | validating | executing | returning | error
  lastCycleIndex: null,
  lastEvolutionBoost: null,

  lastMetabolicSignature: null,
  lastJobSignature: null,
  lastPayloadSignature: null,

  // Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // Presence-EVO+ additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastMetabolicPresenceProfile: null,
  lastBinaryProfile: null,
  lastWaveProfile: null
};


// Deterministic cycle counter
let metabolismCycle = 0;


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
// Deterministic Evolutionary Metabolic Boost (Presence-EVO+)
// ============================================================================
function computeMetabolicBoost(payloadType, presenceField, advantageField, hintsField) {
  // All deterministic, no randomness.
  const base = 1.0;

  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);
  const advTier = Number(advantageField.advantageTier || 0);
  const fallback = Number(hintsField.fallbackBandLevel || 0);

  const pressureScore = (mesh + castle) / 200;      // 0–1
  const advantageScore = advTier / 10;              // 0–1 (assuming tier 0–10)
  const fallbackPenalty = fallback / 10;            // 0–1

  const typeWeight =
    payloadType === "compute" ? 1.0 :
    payloadType === "image-processing" ? 0.9 :
    payloadType === "script" ? 0.8 :
    0.7;

  const boost =
    base *
    typeWeight *
    (1 + pressureScore * 0.3) *
    (1 + advantageScore * 0.4) *
    (1 - fallbackPenalty * 0.3);

  // Clamp to deterministic safe range
  const clamped = Math.max(0.5, Math.min(2.0, boost));
  return clamped;
}


// ============================================================================
// INTERNAL: Signature Builders
// ============================================================================
function buildJobSignature(job) {
  if (!job) return "JOB::NONE";
  return computeHash(
    `JOB::${job.id}::${job.payload?.type || "NO_TYPE"}`
  );
}

function buildPayloadSignature(payload) {
  if (!payload) return "PAYLOAD::NONE";
  return computeHash(
    `PAYLOAD::${payload.type}::${Object.keys(payload).join("::")}`
  );
}

function buildMetabolicSignature(job, cycle, presenceTier) {
  return computeHash(
    `META::${job?.id || "NO_JOB"}::${cycle}::PTIER:${presenceTier}`
  );
}


// ============================================================================
// Presence / Advantage / Hints Surfaces (job + global + nervousContext)
// ============================================================================
function buildPresenceField(job, globalHints = {}, nervousContext = {}) {
  const meta = job?.meta || {};
  const jp = meta.presenceContext || meta.cardiacPresence || {};
  const nc = nervousContext.presenceContext || {};
  const ghP = globalHints.presenceContext || {};

  const mesh = {
    ...(globalHints.meshSignals || {}),
    ...(meta.meshSignals || {}),
    ...(nervousContext.meshSignals || {})
  };
  const castle = {
    ...(globalHints.castleSignals || {}),
    ...(meta.castleSignals || {}),
    ...(nervousContext.castleSignals || {})
  };
  const region = {
    ...(globalHints.regionContext || {}),
    ...(meta.regionContext || {}),
    ...(nervousContext.regionContext || {})
  };

  return {
    bandPresence:
      jp.bandPresence ||
      nc.bandPresence ||
      ghP.bandPresence ||
      "unknown",
    routerPresence:
      jp.routerPresence ||
      nc.routerPresence ||
      ghP.routerPresence ||
      "unknown",
    devicePresence:
      jp.devicePresence ||
      nc.devicePresence ||
      ghP.devicePresence ||
      "unknown",
    meshPresence:
      jp.meshPresence ||
      nc.meshPresence ||
      mesh.meshStrength ||
      "unknown",
    castlePresence:
      jp.castlePresence ||
      nc.castlePresence ||
      castle.castlePresence ||
      "unknown",
    regionPresence:
      jp.regionPresence ||
      nc.regionPresence ||
      region.regionTag ||
      "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || 0,
    meshStrength: mesh.meshStrength || 0,
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantageField(job, globalHints = {}, nervousContext = {}) {
  const meta = job?.meta || {};
  const ja = meta.advantageContext || {};
  const gh = globalHints.advantageContext || {};
  const na = nervousContext.advantageContext || {};

  return {
    advantageScore:
      ja.score ??
      na.score ??
      gh.score ??
      0,
    advantageBand:
      ja.band ??
      na.band ??
      gh.band ??
      "neutral",
    advantageTier:
      ja.tier ??
      na.tier ??
      gh.tier ??
      0
  };
}

function buildHintsField(job, globalHints = {}, nervousContext = {}) {
  const meta = job?.meta || {};
  const jh = meta.hintsContext || {};
  const nh = nervousContext.hintsContext || {};

  return {
    fallbackBandLevel:
      jh.fallbackBandLevel ??
      nh.fallbackBandLevel ??
      globalHints.fallbackBandLevel ??
      0,
    chunkHints: {
      ...(globalHints.chunkHints || {}),
      ...(jh.chunkHints || {}),
      ...(nh.chunkHints || {})
    },
    cacheHints: {
      ...(globalHints.cacheHints || {}),
      ...(jh.cacheHints || {}),
      ...(nh.cacheHints || {})
    },
    prewarmHints: {
      ...(globalHints.prewarmHints || {}),
      ...(jh.prewarmHints || {}),
      ...(nh.prewarmHints || {})
    },
    coldStartHints: {
      ...(globalHints.coldStartHints || {}),
      ...(jh.coldStartHints || {}),
      ...(nh.coldStartHints || {})
    }
  };
}

function classifyMetabolicPresenceTier(presenceField, payloadType) {
  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);
  const base = mesh + castle;

  const typeBias =
    payloadType === "compute" ? 10 :
    payloadType === "image-processing" ? 5 :
    payloadType === "script" ? 3 :
    0;

  const pressure = base + typeBias;

  if (pressure >= 180) return "critical";
  if (pressure >= 120) return "high";
  if (pressure >= 60) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}


// ============================================================================
// INTERNAL: Build dual-band + binary + wave metadata for a job/cycle
// ============================================================================
function buildMetabolicBandBinaryWave(job, cycleIndex, presenceField) {
  const band = normalizeBand(job?.band || job?.meta?.band || "symbolic");
  metabolicHealing.lastBand = band;
  metabolicHealing.lastBandSignature = computeHash(`BAND::${band}`);

  const payloadType = job?.payload?.type || "NO_TYPE";
  const payloadKeysCount = job?.payload ? Object.keys(job.payload).length : 0;

  const surface =
    payloadType.length +
    payloadKeysCount +
    cycleIndex +
    (presenceField?.meshPressureIndex || 0) +
    (presenceField?.castleLoadLevel || 0);

  const binaryField = {
    binaryMetabolicSignature: computeHash(`BMETA::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_META::${surface}`),
    binarySurface: {
      payloadTypeLength: payloadType.length,
      payloadKeysCount,
      cycle: cycleIndex,
      meshPressureIndex: presenceField?.meshPressureIndex || 0,
      castleLoadLevel: presenceField?.castleLoadLevel || 0,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: payloadKeysCount,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  metabolicHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: payloadKeysCount + (presenceField?.meshStrength || 0),
    wavelength: cycleIndex,
    phase:
      (payloadKeysCount +
        cycleIndex +
        (presenceField?.meshPressureIndex || 0)) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  metabolicHealing.lastWaveField = waveField;

  return { band, binaryField, waveField };
}


// ============================================================================
// executePulseEarnJob(job) — Deterministic Metabolic Workflow (Presence-EVO+)
// globalHints and nervousContext are optional; if omitted, default to {}
// ============================================================================
export function executePulseEarnJob(job, globalHints = {}, nervousContext = {}) {
  metabolismCycle++;
  metabolicHealing.cycleCount++;
  metabolicHealing.lastCycleIndex = metabolismCycle;
  metabolicHealing.executionState = "validating";

  try {
    // 1. Blueprint Inspection — Validate job structure
    if (!job || !job.id || !job.payload) {
      metabolicHealing.lastError = "invalid_job_format";
      metabolicHealing.executionState = "error";

      return {
        success: false,
        jobId: job?.id ?? null,
        error: "Invalid job format",
        cycleIndex: metabolismCycle
      };
    }

    const { payload } = job;

    metabolicHealing.lastJobId = job.id;
    metabolicHealing.lastPayloadType = payload.type;

    // v12.3 signatures
    metabolicHealing.lastJobSignature = buildJobSignature(job);
    metabolicHealing.lastPayloadSignature = buildPayloadSignature(payload);

    // Presence / Advantage / Hints surfaces
    const presenceField = buildPresenceField(job, globalHints, nervousContext);
    const advantageField = buildAdvantageField(job, globalHints, nervousContext);
    const hintsField = buildHintsField(job, globalHints, nervousContext);

    metabolicHealing.lastPresenceField = presenceField;
    metabolicHealing.lastAdvantageField = advantageField;
    metabolicHealing.lastHintsField = hintsField;

    const presenceTier = classifyMetabolicPresenceTier(
      presenceField,
      payload.type
    );

    // Dual-Band + Binary + Wave metadata
    const { band, binaryField, waveField } = buildMetabolicBandBinaryWave(
      job,
      metabolismCycle,
      presenceField
    );

    // 2. Deterministic Metabolic Boost (presence-aware)
    const evoBoost = computeMetabolicBoost(
      payload.type,
      presenceField,
      advantageField,
      hintsField
    );
    metabolicHealing.lastEvolutionBoost = evoBoost;

    // 3. Tool Selection + Safe Execution
    metabolicHealing.executionState = "executing";

    let result;

    switch (payload.type) {
      case "compute":
        result = runComputeTask(payload.data, evoBoost);
        break;

      case "image-processing":
        result = runImageTask(payload.data, evoBoost);
        break;

      case "script":
        // SAFE placeholder — does NOT execute arbitrary code
        result = runScriptTask(payload.script, payload.input, evoBoost);
        break;

      default:
        metabolicHealing.lastError = "unknown_payload_type";
        metabolicHealing.executionState = "error";

        return {
          success: false,
          jobId: job.id,
          error: `Unknown job type: ${payload.type}`,
          cycleIndex: metabolismCycle
        };
    }

    metabolicHealing.lastResult = result;

    // 4. Deliver Finished Product
    metabolicHealing.executionState = "returning";

    const metabolicSignature = buildMetabolicSignature(
      job,
      metabolismCycle,
      presenceTier
    );
    metabolicHealing.lastMetabolicSignature = metabolicSignature;

    const metabolicPresenceProfile = {
      presenceTier,
      band,
      meshPressureIndex: presenceField.meshPressureIndex,
      castleLoadLevel: presenceField.castleLoadLevel,
      advantageTier: advantageField.advantageTier,
      fallbackBandLevel: hintsField.fallbackBandLevel,
      evoBoost
    };

    const binaryProfile = {
      binaryField,
      presenceTier
    };

    const waveProfile = {
      waveField,
      presenceTier
    };

    metabolicHealing.lastMetabolicPresenceProfile = metabolicPresenceProfile;
    metabolicHealing.lastBinaryProfile = binaryProfile;
    metabolicHealing.lastWaveProfile = waveProfile;

    return {
      success: true,
      jobId: job.id,
      result,
      evoBoost,
      band,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      hintsField,
      metabolicPresenceProfile,
      binaryProfile,
      waveProfile,
      cycleIndex: metabolismCycle,
      metabolicSignature,
      jobSignature: metabolicHealing.lastJobSignature,
      payloadSignature: metabolicHealing.lastPayloadSignature
    };

  } catch (err) {
    metabolicHealing.executionState = "error";
    metabolicHealing.lastError = err.message;

    return {
      success: false,
      jobId: job?.id ?? null,
      error: err.message,
      cycleIndex: metabolismCycle
    };
  }
}


// ============================================================================
// SAFE workload handlers — Deterministic Metabolic Tools (Presence-EVO+)
// (evoBoost is metadata-only; does not change semantics, only attached)
// ============================================================================
function runComputeTask(data, evoBoost) {
  return {
    output: "compute-result",
    input: data,
    evoBoost
  };
}

function runImageTask(data, evoBoost) {
  return {
    output: "image-result",
    input: data,
    evoBoost
  };
}

function runScriptTask(script, input, evoBoost) {
  return {
    output: "script-task-placeholder",
    script,
    input,
    evoBoost
  };
}


// ============================================================================
// Export healing metadata — Metabolic Ledger
// ============================================================================
export function getPulseEarnMetabolismHealingState() {
  return { ...metabolicHealing };
}
