// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnHeart-v12.3-PRESENCE-EVO+.js
// LAYER: THE HEART (v12.3-PRESENCE-EVO+ + Dual-Band + Binary + Wave + Presence)
// (Deterministic Heartbeat Cycle + Circulatory Pump + Presence Telemetry)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE HEART — Pulse‑Earn’s deterministic rhythmic engine.
//   • Performs ONE cardiac cycle per invocation.
//   • Pulls jobs from the Nervous System.
//   • Executes jobs via injected Metabolism or PulseSendSystem.
//   • Submits results via Lymph Nodes.
//   • Emits v12.3‑Presence‑EVO+ signatures + cardiac + presence diagnostics.
//
// PURPOSE (v12.3-PRESENCE-EVO+):
//   • Provide a deterministic, drift‑proof execution cycle.
//   • Guarantee safe job → compute → submit flow.
//   • Maintain healing metadata for the Immune System.
//   • Preserve cardiac rhythm (conceptual only).
//   • Expose full organism presence/advantage/hints telemetry (metadata-only).
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE RUNTIME — no AI layers, no translation, no memory model.
//   • NO async, NO timers, NO timestamps.
//   • Deterministic cycle only.
//   • PulseSendSystem + Metabolism are injected, not imported.
//   • Dual-band + binary + wave + presence metadata are structural-only,
//     NO behavior change to fetch/execute/submit.
// ============================================================================
export const PulseEarnHeartMeta = Object.freeze({
  layer: "PulseEarnHeart",
  role: "EARN_HEART_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnHeart-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureRuntime: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
    worldLensAware: false,
    metabolismInjected: true,
    lymphNodesInjected: true,
    nervousSystemInjected: true
  }),

  contract: Object.freeze({
    input: [
      "NextMarketplaceJob",
      "MetabolismExecutor",
      "LymphNodeSubmitter",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "CardiacCycleResult",
      "CardiacDiagnostics",
      "CardiacSignatures",
      "HeartHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnHeart-v9",
      "PulseEarnHeart-v10",
      "PulseEarnHeart-v11",
      "PulseEarnHeart-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic cardiac cycle (pull → execute → submit)",
    adaptive: "binary/wave surfaces + dual-band + presence/advantage/hints surfaces",
    return: "deterministic cardiac result + healing metadata"
  })
});

import { getNextMarketplaceJob } from "./PulseEarnNervousSystem.js";
import { executePulseEarnJob } from "./PulseEarnMetabolism.js";
import { submitPulseEarnResult } from "./PulseEarnLymphNodes.js";


// ============================================================================
// Healing Metadata — Cardiac Rhythm Log (v12.3-PRESENCE-EVO+)
// ============================================================================
const heartHealing = {
  cycles: 0,
  lastJob: null,
  lastResult: null,
  lastSubmission: null,
  lastError: null,
  lastExitReason: null,
  lastCycleIndex: null,

  lastHeartSignature: null,
  lastJobSignature: null,
  lastResultSignature: null,
  lastSubmissionSignature: null,

  // Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // Presence-EVO+ additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastCardiacPresenceProfile: null,
  lastCardiacBinaryProfile: null,
  lastCardiacWaveProfile: null
};

// Deterministic cycle counter
let heartCycle = 0;


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
function buildHeartSignature(cycle, band, presenceTier, meshPressure, castleLoad) {
  return computeHash(
    `HEART::${cycle}::${band}::PTIER:${presenceTier}::MESH:${meshPressure}::CASTLE:${castleLoad}`
  );
}

function buildJobSignature(job) {
  if (!job) return "JOB::NONE";
  return computeHash(`JOB::${job.id}::${job.marketplace}`);
}

function buildResultSignature(result) {
  if (!result) return "RESULT::NONE";
  return computeHash(`RESULT::${result.success ? "OK" : "FAIL"}`);
}

function buildSubmissionSignature(submission) {
  if (!submission) return "SUBMIT::NONE";
  return computeHash(`SUBMIT::${submission.success ? "OK" : "FAIL"}`);
}


// ============================================================================
// Presence / Advantage / Hints Surfaces (merge NervousSystem + Job + Global)
// ============================================================================
function buildPresenceField({ job, nervousPresence = {}, globalHints = {} }) {
  const jobMeta = job?.meta || {};
  const jobPresence = jobMeta.presenceContext || jobMeta.cardiacPresence || {};
  const ghPresence = globalHints.presenceContext || {};
  const mesh = {
    ...(globalHints.meshSignals || {}),
    ...(jobMeta.meshSignals || {}),
    ...(nervousPresence.meshSignals || {})
  };
  const castle = {
    ...(globalHints.castleSignals || {}),
    ...(jobMeta.castleSignals || {}),
    ...(nervousPresence.castleSignals || {})
  };
  const region = {
    ...(globalHints.regionContext || {}),
    ...(jobMeta.regionContext || {}),
    ...(nervousPresence.regionContext || {})
  };

  return {
    bandPresence:
      jobPresence.bandPresence ||
      ghPresence.bandPresence ||
      nervousPresence.bandPresence ||
      "unknown",
    routerPresence:
      jobPresence.routerPresence ||
      ghPresence.routerPresence ||
      nervousPresence.routerPresence ||
      "unknown",
    devicePresence:
      jobPresence.devicePresence ||
      ghPresence.devicePresence ||
      nervousPresence.devicePresence ||
      "unknown",
    meshPresence: mesh.meshStrength || "unknown",
    castlePresence: castle.castlePresence || "unknown",
    regionPresence: region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || 0,
    meshStrength: mesh.meshStrength || 0,
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantageField({ job, nervousAdvantage = {}, globalHints = {} }) {
  const jobMeta = job?.meta || {};
  const jobAdv = jobMeta.advantageContext || {};
  const ghAdv = globalHints.advantageContext || {};

  return {
    advantageScore:
      jobAdv.score ??
      ghAdv.score ??
      nervousAdvantage.score ??
      0,
    advantageBand:
      jobAdv.band ??
      ghAdv.band ??
      nervousAdvantage.band ??
      "neutral",
    advantageTier:
      jobAdv.tier ??
      ghAdv.tier ??
      nervousAdvantage.tier ??
      0
  };
}

function buildHintsField({ job, nervousHints = {}, globalHints = {} }) {
  const jobMeta = job?.meta || {};
  const jobHints = jobMeta.hintsContext || {};
  return {
    fallbackBandLevel:
      jobHints.fallbackBandLevel ??
      globalHints.fallbackBandLevel ??
      nervousHints.fallbackBandLevel ??
      0,
    chunkHints: {
      ...(globalHints.chunkHints || {}),
      ...(jobHints.chunkHints || {}),
      ...(nervousHints.chunkHints || {})
    },
    cacheHints: {
      ...(globalHints.cacheHints || {}),
      ...(jobHints.cacheHints || {}),
      ...(nervousHints.cacheHints || {})
    },
    prewarmHints: {
      ...(globalHints.prewarmHints || {}),
      ...(jobHints.prewarmHints || {}),
      ...(nervousHints.prewarmHints || {})
    },
    coldStartHints: {
      ...(globalHints.coldStartHints || {}),
      ...(jobHints.coldStartHints || {}),
      ...(nervousHints.coldStartHints || {})
    }
  };
}

function classifyPresenceTier(presenceField) {
  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);

  const pressure = mesh + castle; // 0–200
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}


// ============================================================================
// FACTORY — createPulseEarnHeart (v12.3-PRESENCE-EVO+)
// ============================================================================
export function createPulseEarnHeart({
  pulseSendSystem,   // optional: injected PulseSendSystem (compute override)
  log = console.log  // deterministic logger
} = {}) {

  const heart = {

    // -----------------------------------------------------------------------
    // ONE deterministic heartbeat
    // globalHints is optional; if omitted, defaults to {}
    // nervousPresence/advantage/hints are expected to be carried on engineRef
    // or embedded in jobs; we treat them as optional metadata.
// -----------------------------------------------------------------------
    cycle(workerId, engineRef, globalHints = {}) {
      heartCycle++;
      heartHealing.cycles++;
      heartHealing.lastCycleIndex = heartCycle;

      if (!engineRef.running) {
        heartHealing.lastExitReason = "engine_not_running";
        return null;
      }

      try {
        // ------------------------------------------------------
        // 1. FETCH — Systole: Heart contracts, pulling in blood
        // ------------------------------------------------------
        const job = getNextMarketplaceJob(workerId);

        if (!job) {
          log("earn:heart_no_job", { workerId, cycleIndex: heartCycle });
          return null;
        }

        heartHealing.lastJob = job;
        heartHealing.lastJobSignature = buildJobSignature(job);

        // A — Dual-Band Awareness
        const band = normalizeBand(job.band || job.meta?.band || "symbolic");
        heartHealing.lastBand = band;
        heartHealing.lastBandSignature = computeHash(`BAND::${band}`);

        // Nervous-system-level presence/advantage/hints (optional)
        const nervousPresence = engineRef?.presenceContext || {};
        const nervousAdvantage = engineRef?.advantageContext || {};
        const nervousHints = engineRef?.hintsContext || {};

        // Presence surfaces (merged: NervousSystem + Job + Global)
        const presenceField = buildPresenceField({
          job,
          nervousPresence,
          globalHints
        });

        const advantageField = buildAdvantageField({
          job,
          nervousAdvantage,
          globalHints
        });

        const hintsField = buildHintsField({
          job,
          nervousHints,
          globalHints
        });

        const presenceTier = classifyPresenceTier(presenceField);

        // B — Binary Surfaces (structural only, presence-aware)
        const jobIdLength = (job.id || "").length;
        const marketplaceLength = (job.marketplace || "").length;
        const binarySurfaceValue =
          jobIdLength +
          marketplaceLength +
          heartCycle +
          (presenceField.meshPressureIndex || 0) +
          (presenceField.castleLoadLevel || 0);

        const binaryField = {
          binaryHeartSignature: computeHash(`BHEART::${binarySurfaceValue}`),
          binarySurfaceSignature: computeHash(`BSURF_HEART::${binarySurfaceValue}`),
          binarySurface: {
            jobIdLength,
            marketplaceLength,
            cycle: heartCycle,
            meshPressureIndex: presenceField.meshPressureIndex,
            castleLoadLevel: presenceField.castleLoadLevel,
            surface: binarySurfaceValue
          },
          parity: binarySurfaceValue % 2 === 0 ? 0 : 1,
          density: jobIdLength,
          shiftDepth: Math.max(0, Math.floor(Math.log2(binarySurfaceValue || 1)))
        };

        heartHealing.lastBinaryField = binaryField;

        // C — Wave-Theory Metadata (structural only, presence-aware)
        const waveField = {
          amplitude: jobIdLength + (presenceField.meshStrength || 0),
          wavelength: heartCycle,
          phase:
            (jobIdLength +
              heartCycle +
              (presenceField.meshPressureIndex || 0)) % 8,
          band,
          mode: band === "binary" ? "compression-wave" : "symbolic-wave"
        };

        heartHealing.lastWaveField = waveField;

        // Cardiac presence/binary/wave profiles (for diagnostics)
        const cardiacPresenceProfile = {
          presenceTier,
          band,
          meshPressureIndex: presenceField.meshPressureIndex,
          castleLoadLevel: presenceField.castleLoadLevel,
          advantageTier: advantageField.advantageTier,
          fallbackBandLevel: hintsField.fallbackBandLevel
        };

        const cardiacBinaryProfile = {
          binaryField,
          presenceTier
        };

        const cardiacWaveProfile = {
          waveField,
          presenceTier
        };

        heartHealing.lastPresenceField = presenceField;
        heartHealing.lastAdvantageField = advantageField;
        heartHealing.lastHintsField = hintsField;
        heartHealing.lastCardiacPresenceProfile = cardiacPresenceProfile;
        heartHealing.lastCardiacBinaryProfile = cardiacBinaryProfile;
        heartHealing.lastCardiacWaveProfile = cardiacWaveProfile;

        log("earn:heart_job_selected", {
          workerId,
          jobId: job.id,
          cycleIndex: heartCycle,
          band,
          presenceTier,
          meshPressureIndex: presenceField.meshPressureIndex,
          castleLoadLevel: presenceField.castleLoadLevel
        });

        // ------------------------------------------------------
        // 2. EXECUTE — Cardiac output: Heart pumps
        // ------------------------------------------------------
        let result;

        if (pulseSendSystem && typeof pulseSendSystem.compute === "function") {
          // PulseSendSystem override path
          result = pulseSendSystem.compute(job, {});
        } else {
          // Default metabolic execution path
          result = executePulseEarnJob(job);
        }

        heartHealing.lastResult = result;
        heartHealing.lastResultSignature = buildResultSignature(result);

        log("earn:heart_job_executed", {
          workerId,
          jobId: job.id,
          success: result.success,
          cycleIndex: heartCycle,
          band,
          presenceTier
        });

        // ------------------------------------------------------
        // 3. SUBMIT — Venous return: Blood flows back
        // ------------------------------------------------------
        const submission = submitPulseEarnResult(job, result);
        heartHealing.lastSubmission = submission;
        heartHealing.lastSubmissionSignature = buildSubmissionSignature(submission);

        log("earn:heart_job_submitted", {
          workerId,
          jobId: job.id,
          submission,
          cycleIndex: heartCycle,
          band,
          presenceTier
        });

        // ------------------------------------------------------
        // 4. Heartbeat Signature (presence-aware, deterministic)
// ------------------------------------------------------
        const heartSignature = buildHeartSignature(
          heartCycle,
          band,
          presenceTier,
          presenceField.meshPressureIndex || 0,
          presenceField.castleLoadLevel || 0
        );
        heartHealing.lastHeartSignature = heartSignature;

        return {
          job,
          result,
          submission,
          heartSignature,
          band,
          binaryField,
          waveField,
          presenceField,
          advantageField,
          hintsField,
          cardiacPresenceProfile,
          cardiacBinaryProfile,
          cardiacWaveProfile
        };

      } catch (err) {
        heartHealing.lastError = {
          message: err.message,
          workerId,
          cycleIndex: heartCycle
        };

        log("earn:heart_error", {
          workerId,
          error: err.message,
          cycleIndex: heartCycle
        });

        if (engineRef.stopOnError) {
          heartHealing.lastExitReason = "hardStop";
          engineRef.hardStop(err.message);
        }

        return null;
      }
    },

    // -----------------------------------------------------------------------
    // stop — no-op (engine owns lifecycle)
// -----------------------------------------------------------------------
    stop() {},

    // -----------------------------------------------------------------------
    // diagnostics — v12.3-PRESENCE-EVO+ cardiac telemetry
// -----------------------------------------------------------------------
    diagnostics() {
      return {
        cycles: heartHealing.cycles,
        lastJob: heartHealing.lastJob,
        lastResult: heartHealing.lastResult,
        lastSubmission: heartHealing.lastSubmission,
        lastError: heartHealing.lastError,
        lastExitReason: heartHealing.lastExitReason,
        lastCycleIndex: heartHealing.lastCycleIndex,

        lastHeartSignature: heartHealing.lastHeartSignature,
        lastJobSignature: heartHealing.lastJobSignature,
        lastResultSignature: heartHealing.lastResultSignature,
        lastSubmissionSignature: heartHealing.lastSubmissionSignature,

        lastBand: heartHealing.lastBand,
        lastBandSignature: heartHealing.lastBandSignature,
        lastBinaryField: heartHealing.lastBinaryField,
        lastWaveField: heartHealing.lastWaveField,

        lastPresenceField: heartHealing.lastPresenceField,
        lastAdvantageField: heartHealing.lastAdvantageField,
        lastHintsField: heartHealing.lastHintsField,
        lastCardiacPresenceProfile: heartHealing.lastCardiacPresenceProfile,
        lastCardiacBinaryProfile: heartHealing.lastCardiacBinaryProfile,
        lastCardiacWaveProfile: heartHealing.lastCardiacWaveProfile
      };
    }
  };

  return heart;
}


// ============================================================================
// Export healing metadata — Cardiac Rhythm Report (v12.3-PRESENCE-EVO+)
// ============================================================================
export function getPulseEarnHeartHealingState() {
  return { ...heartHealing };
}
