// ============================================================================
// FILE: PULSE-WORLD/PULSE-EARN/PulseEarnHeart-v14-EVO-IMMORTAL.js
// LAYER: THE HEART (v14-EVO-IMMORTAL + Dual-Band + Binary + Wave + Presence)
// BABY HEART — NO HEARTBEAT, NO TIMERS, NO TIMESTAMPS
// Baby runs off Mom/Dad pulse surfaces + soft random nudge until its own beat exists.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnHeart",
  version: "v14-IMMORTAL",
  layer: "earn_heart",
  role: "earn_pulse_driver",
  lineage: "PulseEarnHeart-v10.4 → v11-Evo → v14-IMMORTAL",

  evo: {
    earnPulse: true,
    jobPump: true,
    metabolicPulse: true,
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
      "PulseEarnCirculatorySystem",
      "PulseEarnMetabolism",
      "PulseEarnGenome"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnHeartMeta = Object.freeze({
  layer: "PulseEarnHeart",
  role: "EARN_HEART_ORGAN",
  version: "v14-EVO-IMMORTAL",
  identity: "PulseEarnHeart-v14-EVO-IMMORTAL",

  guarantees: Object.freeze({
    deterministicCore: true,
    softRandomNudgeInternal: true,
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
    nervousSystemInjected: true,

    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    dualParentPulseAware: true
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
// Healing Metadata — Baby Heart Log (v14-EVO-IMMORTAL)
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
  lastActivePulseSource: "none", // "mom" | "dad" | "random" | "none"

  // Chunk / cache / prewarm plans
  lastChunkPlan: null,
  lastCachePlan: null,
  lastPrewarmPlan: null,

  // Random nudge metadata (no time, just cycle index)
  lastRandomNudgeCycle: null,
  lastRandomNudgeReason: null
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
// Soft Random Nudge — baby-only, no time, no IO, internal only
// ============================================================================
function randomBabyPulseNudge(currentSource, reason = "none") {
  // Only consider random nudge if no parent pulse is visible
  if (currentSource !== "none") {
    return { activeSource: currentSource, randomFired: false };
  }

  // ~3% chance per cycle to mark a "random" pulse source
  if (Math.random() > 0.97) {
    heartHealing.lastRandomNudgeCycle = heartCycle;
    heartHealing.lastRandomNudgeReason = reason;
    return { activeSource: "random", randomFired: true };
  }

  return { activeSource: currentSource, randomFired: false };
}

// ============================================================================
// Chunk / Cache / Prewarm Plans (symbolic only, no IO)
// ============================================================================
function buildChunkPlan(hintsField, job) {
  const hints = hintsField.chunkHints || {};
  const enabled = Object.keys(hints).length > 0;
  return {
    enabled,
    strategy: hints.strategy || "default",
    target: hints.target || "job",
    key: hints.key || job?.id || "unknown-job"
  };
}

function buildCachePlan(hintsField, job) {
  const hints = hintsField.cacheHints || {};
  const enabled = Object.keys(hints).length > 0;
  return {
    enabled,
    strategy: hints.strategy || "default",
    scope: hints.scope || "session",
    key: hints.key || job?.id || "unknown-job"
  };
}

function buildPrewarmPlan(hintsField, job) {
  const hints = hintsField.prewarmHints || {};
  const enabled = Object.keys(hints).length > 0;
  return {
    enabled,
    strategy: hints.strategy || "default",
    band: hints.band || (job?.band || job?.meta?.band || "symbolic")
  };
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
        let activePulseSource = selectActivePulseSource(momPulseSurface, dadPulseSurface);

        // Soft random nudge if both parents are silent
        const randomNudge = randomBabyPulseNudge(activePulseSource, "no_parent_pulse");
        activePulseSource = randomNudge.activeSource;

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

        // Chunk / Cache / Prewarm plans (symbolic only)
        const chunkPlan = buildChunkPlan(hintsField, job);
        const cachePlan = buildCachePlan(hintsField, job);
        const prewarmPlan = buildPrewarmPlan(hintsField, job);

        heartHealing.lastChunkPlan = chunkPlan;
        heartHealing.lastCachePlan = cachePlan;
        heartHealing.lastPrewarmPlan = prewarmPlan;

        // Optional: invoke pulseSendSystem hooks (still pure runtime)
        if (pulseSendSystem) {
          try {
            if (prewarmPlan.enabled && typeof pulseSendSystem.prewarm === "function") {
              pulseSendSystem.prewarm(job, prewarmPlan);
            }
            if (chunkPlan.enabled && typeof pulseSendSystem.chunk === "function") {
              pulseSendSystem.chunk(job, chunkPlan);
            }
            if (cachePlan.enabled && typeof pulseSendSystem.cache === "function") {
              pulseSendSystem.cache(job, cachePlan);
            }
          } catch (_) {
            // Baby heart never throws from optimization hooks
          }
        }

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
          result = pulseSendSystem.compute(job, {
            band,
            presenceField,
            advantageField,
            hintsField,
            chunkPlan,
            cachePlan,
            prewarmPlan,
            activePulseSource
          });
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
          activePulseSource,
          chunkPlan,
          cachePlan,
          prewarmPlan
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
        lastActivePulseSource: heartHealing.lastActivePulseSource,

        lastChunkPlan: heartHealing.lastChunkPlan,
        lastCachePlan: heartHealing.lastCachePlan,
        lastPrewarmPlan: heartHealing.lastPrewarmPlan,

        lastRandomNudgeCycle: heartHealing.lastRandomNudgeCycle,
        lastRandomNudgeReason: heartHealing.lastRandomNudgeReason
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
