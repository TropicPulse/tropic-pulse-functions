// ============================================================================
// FILE: PULSE-WORLD/PULSE-EARN/PulseEarnHeart-v13-EVO-PRIME.js
// LAYER: THE HEART (v13-EVO-PRIME + Dual-Band + Binary + Wave + Presence)
// BABY HEART — NO HEARTBEAT, NO TIMERS, NO TIMESTAMPS
// Baby runs off Mom/Dad pulse surfaces until its own beat exists.
// ============================================================================

export const PulseEarnHeartMeta = Object.freeze({
  layer: "PulseEarnHeart",
  role: "EARN_HEART_ORGAN",
  version: "v13-EVO-PRIME",
  identity: "PulseEarnHeart-v13-EVO-PRIME",

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
  })
});

import { getNextMarketplaceJob } from "./PulseEarnNervousSystem.js";
import { executePulseEarnJob } from "./PulseEarnMetabolism.js";
import { submitPulseEarnResult } from "./PulseEarnLymphNodes.js";

// ============================================================================
// Healing Metadata — Baby Heart Log (v13-EVO-PRIME)
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

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastCardiacPresenceProfile: null,
  lastCardiacBinaryProfile: null,
  lastCardiacWaveProfile: null,

  // Dual-parent pulse surfaces
  lastMomPulseSurface: null,
  lastDadPulseSurface: null,
  lastActivePulseSource: "none"
};

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
// Presence / Advantage / Hints Surfaces
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
  const pressure = mesh + castle;

  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

// ============================================================================
// Dual-Parent Pulse Surfaces (baby has no beat yet, only pulses)
// ============================================================================
const MOM_PULSE_KEY = "PulseProxyHeartbeatLastBeatAt";
const DAD_PULSE_KEY = "PulseAIHeartbeatLastBeatAt";

function buildMomPulseSurface() {
  let last = 0;
  try {
    last = globalThis?.[MOM_PULSE_KEY] || 0;
  } catch (_) {
    last = 0;
  }
  const alive = !!last;
  return {
    momPulseAlive: alive,
    momPulseLastBeatAt: last,
    momPulseFallbackState: alive ? "available" : "silent"
  };
}

function buildDadPulseSurface() {
  let last = 0;
  try {
    last = globalThis?.[DAD_PULSE_KEY] || 0;
  } catch (_) {
    last = 0;
  }
  const alive = !!last;
  return {
    dadPulseAlive: alive,
    dadPulseLastBeatAt: last,
    dadPulseFallbackState: alive ? "available" : "silent"
  };
}

function selectActivePulseSource(momPulseSurface, dadPulseSurface) {
  if (momPulseSurface.momPulseAlive) return "mom";
  if (dadPulseSurface.dadPulseAlive) return "dad";
  return "none";
}

// ============================================================================
// MAIN CARDIAC ENGINE — createPulseEarnHeart (baby, no own heartbeat)
// ============================================================================
export function createPulseEarnHeart({
  pulseSendSystem,
  log = console.log
} = {}) {

  const heart = {

    cycle(workerId, engineRef = {}, globalHints = {}) {
      heartCycle++;
      heartHealing.cycles++;
      heartHealing.lastCycleIndex = heartCycle;

      const runningFlag =
        engineRef.forceRun === true
          ? true
          : engineRef.running !== false;

      if (!runningFlag) {
        heartHealing.lastExitReason = "engine_not_running";
        return null;
      }

      try {
        // -------------------------------------------------------------------
        // Dual‑parent pulse surfaces (baby has no beat yet, only pulses)
        // -------------------------------------------------------------------
        const momPulseSurface = buildMomPulseSurface();
        const dadPulseSurface = buildDadPulseSurface();
        const activePulseSource = selectActivePulseSource(momPulseSurface, dadPulseSurface);

        heartHealing.lastMomPulseSurface = momPulseSurface;
        heartHealing.lastDadPulseSurface = dadPulseSurface;
        heartHealing.lastActivePulseSource = activePulseSource;

        // ------------------------------------------------------
        // 1. FETCH — Systole
        // ------------------------------------------------------
        const job = getNextMarketplaceJob(workerId);

        if (!job) {
          heartHealing.lastExitReason = "no_job";
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

        // Presence surfaces
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

        // B — Binary Surfaces
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

        // C — Wave-Theory Metadata
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

        // Profiles
        const cardiacPresenceProfile = {
          presenceTier,
          band,
          meshPressureIndex: presenceField.meshPressureIndex,
          castleLoadLevel: presenceField.castleLoadLevel,
          advantageTier: advantageField.advantageTier,
          fallbackBandLevel: hintsField.fallbackBandLevel,
          activePulseSource
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

        // ------------------------------------------------------
        // 2. EXECUTE — Cardiac Output
        // ------------------------------------------------------
        let result;

        if (pulseSendSystem && typeof pulseSendSystem.compute === "function") {
          result = pulseSendSystem.compute(job, {});
        } else {
          result = executePulseEarnJob(job);
        }

        heartHealing.lastResult = result;
        heartHealing.lastResultSignature = buildResultSignature(result);

        // ------------------------------------------------------
        // 3. SUBMIT — Venous Return
        // ------------------------------------------------------
        const submission = submitPulseEarnResult(job, result);
        heartHealing.lastSubmission = submission;
        heartHealing.lastSubmissionSignature = buildSubmissionSignature(submission);

        // ------------------------------------------------------
        // 4. Heart Signature (Baby has no beat; this is cycle signature only)
        // ------------------------------------------------------
        const heartSignature = buildHeartSignature(
          heartCycle,
          band,
          presenceTier,
          presenceField.meshPressureIndex || 0,
          presenceField.castleLoadLevel || 0
        );

        heartHealing.lastHeartSignature = heartSignature;
        heartHealing.lastExitReason = "ok";

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
          cardiacWaveProfile,
          momPulseSurface,
          dadPulseSurface,
          activePulseSource
        };

      } catch (err) {
        heartHealing.lastError = {
          message: err.message,
          workerId,
          cycleIndex: heartCycle
        };

        if (engineRef.stopOnError) {
          heartHealing.lastExitReason = "hardStop";
          engineRef.hardStop(err.message);
        }

        return null;
      }
    },

    stop() {},

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
        lastCardiacWaveProfile: heartHealing.lastCardiacWaveProfile,

        lastMomPulseSurface: heartHealing.lastMomPulseSurface,
        lastDadPulseSurface: heartHealing.lastDadPulseSurface,
        lastActivePulseSource: heartHealing.lastActivePulseSource
      };
    }
  };

  return heart;
}

const earnHeartSingleton = createPulseEarnHeart();

export function pulseEarnFromHeartbeat(source = "unknown", engineRef = {}, globalHints = {}) {
  return earnHeartSingleton.cycle(source, engineRef, globalHints);
}

export function getPulseEarnHeartHealingState() {
  return { ...heartHealing };
}
