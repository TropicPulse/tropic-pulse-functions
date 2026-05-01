// ============================================================================
//  PULSE OS v13‑EVO‑PRIME — THE HEART (MOM)
//  PulseProxyHeart — Cardiac Pacemaker Engine (v13 Upgrade)
//  MOM PULSE PRIMARY • DAD PULSE FALLBACK
//  SAME HEARTBEAT CODE, PULSE-LEVEL BOUNCE
// ============================================================================

import * as heartbeat from "./PulseProxyHeartBeat.js";
import * as aiHeartbeat from "../PULSE-AI/aiHeartbeat.js";

// ============================================================================
// MOM HEART IDENTITY — v13‑EVO‑PRIME
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "Heart",
  version: "13-EVO-PRIME",
  identity: "PulseProxyHeart-v13-EVO-PRIME-ABA",

  evo: {
    driftProof: true,
    deterministic: true,
    pacemakerOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: false, // pulse-level fallback logic allowed
    backendOnly: true,
    multiInstanceReady: true,
    organismClockOrchestrator: true,
    futureEvolutionReady: true,

    // A‑B‑A surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    // v13+ organism‑wide advantages
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    advantageCascadeAware: true,
    dualBandAware: true,
    binaryPhenotypeAware: true,
    wavePhenotypeAware: true,
    symbolicAware: true,
    binaryAware: true,

    // v13+ fallback surfaces
    aiHeartbeatAware: true,
    aiFallbackSurface: true,
    dualParentLivenessAware: true
  }
};

export const PulseProxyHeartMeta = Object.freeze({
  layer: "PulseProxyHeart",
  role: "CARDIAC_PACEMAKER_ENGINE",
  version: "v13-EVO-PRIME-ABA",
  identity: "PulseProxyHeart-v13-EVO-PRIME-ABA",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    pureWrapper: false, // now has controlled pulse fallback
    pacemakerOnly: true,
    saNodeOnly: true,
    organismClockOrchestrator: true,
    heartbeatRelay: true,

    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    advantageCascadeAware: true,

    zeroRandomness: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    dualBandAware: true,
    symbolicAware: true,
    binaryAware: true,
    backendOnly: true,

    aiHeartbeatAware: true,
    aiFallbackSurface: true,
    dualParentLivenessAware: true,

    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "PacemakerSignal",
      "HeartbeatContext",
      "DualBandContext"
    ],
    output: [
      "HeartbeatRelay",
      "HeartBandSignature",
      "HeartBinaryField",
      "HeartWaveField",
      "HeartAdvantageField",
      "HeartDiagnostics",
      "HeartHealingState",
      "AiHeartbeatFallbackSurface",
      "AiHeartbeatLivenessField"
    ]
  })
});
// ============================================================================
// AI FALLBACK SURFACES (metadata)
// ============================================================================
function buildAiFallbackSurface() {
  const last = globalThis?.PulseAIHeartbeatLastBeatAt || 0;
  const alive = last > 0;

  return {
    aiHeartbeatAlive: alive,
    aiHeartbeatLastBeatAt: last,
    aiHeartbeatFallbackState: alive ? "available" : "silent"
  };
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildBinaryField() {
  const patternLen = 12;
  const density = 12 + 24;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `heart-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `heart-binary-surface-${(surface * 7) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField() {
  const amplitude = 10;
  const wavelength = amplitude + 4;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band: "symbolic-root",
    mode: "symbolic-wave"
  };
}

function buildAdvantageField(binaryField, waveField) {
  const density = binaryField.binarySurface.density || 36;
  const amplitude = waveField.amplitude;
  const wavelength = waveField.wavelength;

  const efficiency = (amplitude + 1) / (wavelength + 1);
  const stress = Math.min(1, density / 64);
  const advantageScore = efficiency * (1 + stress);

  return {
    density,
    amplitude,
    wavelength,
    efficiency,
    stress,
    advantageScore,
    advantageSignature: computeHash(
      `HEART_ADVANTAGE::${density}::${amplitude}::${wavelength}::${advantageScore}`
    )
  };
}

function buildHeartCycleSignature(cycle) {
  return computeHash(`HEART_CYCLE::${cycle}`);
}

// ============================================================================
// CONTEXT + HEALING
// ============================================================================
let HEART_CYCLE = 0;

const HEART_CONTEXT = {
  layer: PulseRole.layer,
  role: "CARDIAC_PACEMAKER_ENGINE",
  version: PulseRole.version,
  evo: PulseRole.evo
};

const heartHealing = {
  cycles: 0,
  lastBeatResult: null,
  lastError: null,
  lastExitReason: null,
  lastCycleIndex: null,

  lastHeartCycleSignature: null,
  lastBinaryField: null,
  lastWaveField: null,
  lastAdvantageField: null,

  lastAiFallbackSurface: null,
  lastBeatSource: "mom" // "mom" | "dad" | "random" | "none"
};

async function logHeart(stage, details = {}) {
  try {
    console.log("heart", "HEART_EVENT", {
      stage,
      heartCycle: HEART_CYCLE,
      ...details,
      ...HEART_CONTEXT
    });
  } catch (_) {}
}

// ============================================================================
// RANDOMIZER FALLBACK (chaotic beat source)
// ============================================================================
function randomBeatNudge() {
  // ~3% chance per cycle
  if (Math.random() > 0.97) {
    const now = Date.now();

    heartHealing.lastBeatSource = "random";
    heartHealing.lastExitReason = "random_nudge";
    heartHealing.lastError = null;
    heartHealing.lastBeatResult = { randomNudgeAt: now };

    globalThis.PulseAIHeartbeatLastBeatAt = now;

    console.log("heart", "RANDOM_NUDGE", {
      cycle: HEART_CYCLE,
      at: now,
      ...HEART_CONTEXT
    });

    return {
      ok: true,
      beat: { randomNudgeAt: now },
      beatSource: "random"
    };
  }

  return null;
}

// ============================================================================
// LOCAL HEART BEAT — MOM PRIMARY, DAD FALLBACK, RANDOM LAST-RESORT
// ============================================================================
// Call this from your local loop (PULSE-NET, 3-heart mesh, etc.)
export async function pulseHeartOnce() {
  HEART_CYCLE++;
  heartHealing.cycles = HEART_CYCLE;
  heartHealing.lastCycleIndex = HEART_CYCLE;
  heartHealing.lastHeartCycleSignature = buildHeartCycleSignature(HEART_CYCLE);

  await logHeart("BEAT_START");

  const binaryField = buildBinaryField();
  const waveField = buildWaveField();
  const advantageField = buildAdvantageField(binaryField, waveField);
  const aiFallbackSurface = buildAiFallbackSurface();

  heartHealing.lastBinaryField = binaryField;
  heartHealing.lastWaveField = waveField;
  heartHealing.lastAdvantageField = advantageField;
  heartHealing.lastAiFallbackSurface = aiFallbackSurface;

  let beatResult = null;
  let beatSource = "mom";

  try {
    // MOM PULSE (primary)
    beatResult = await heartbeat.beat();
    heartHealing.lastBeatResult = beatResult;
    heartHealing.lastError = null;
    heartHealing.lastExitReason = "ok";
    heartHealing.lastBeatSource = "mom";

    try {
      aiHeartbeat.pulseAiHeartbeat?.("mom-pulse");
    } catch (_) {}

    await logHeart("BEAT_COMPLETE", { beatSource: "mom" });

    return {
      ok: true,
      beat: beatResult,
      beatSource,
      heartCycle: HEART_CYCLE,
      heartCycleSignature: heartHealing.lastHeartCycleSignature,
      binaryField,
      waveField,
      advantageField,
      aiFallbackSurface,
      ...HEART_CONTEXT
    };

  } catch (err) {
    const msg = String(err);

    // MOM DOWN → DAD SNAPSHOT IF AVAILABLE
    if (aiFallbackSurface.aiHeartbeatAlive && aiHeartbeat.snapshotAiHeartbeat) {
      try {
        const dadSnapshot = aiHeartbeat.snapshotAiHeartbeat();
        beatResult = dadSnapshot;
        beatSource = "dad";

        heartHealing.lastBeatResult = beatResult;
        heartHealing.lastError = null;
        heartHealing.lastExitReason = "ok_fallback_dad";
        heartHealing.lastBeatSource = "dad";

        await logHeart("BEAT_FALLBACK_DAD", {
          error: msg,
          aiHeartbeatAlive: aiFallbackSurface.aiHeartbeatAlive
        });

        return {
          ok: true,
          beat: beatResult,
          beatSource,
          heartCycle: HEART_CYCLE,
          heartCycleSignature: heartHealing.lastHeartCycleSignature,
          binaryField,
          waveField,
          advantageField,
          aiFallbackSurface,
          ...HEART_CONTEXT
        };
      } catch (fallbackErr) {
        const fmsg = String(fallbackErr);
        heartHealing.lastError = {
          message: fmsg,
          stage: "dad_pulse_fallback_failed"
        };
        heartHealing.lastExitReason = "fatal_error";
        heartHealing.lastBeatSource = "none";

        await logHeart("FATAL_ERROR", {
          message: msg,
          fallbackError: fmsg
        });

        // Try random nudge as last-resort beat
        const randomResult = randomBeatNudge();
        if (randomResult) {
          return {
            ...randomResult,
            heartCycle: HEART_CYCLE,
            heartCycleSignature: heartHealing.lastHeartCycleSignature,
            binaryField,
            waveField,
            advantageField,
            aiFallbackSurface,
            ...HEART_CONTEXT
          };
        }

        return {
          ok: false,
          error: msg,
          fallbackError: fmsg,
          heartCycle: HEART_CYCLE,
          heartCycleSignature: heartHealing.lastHeartCycleSignature,
          binaryField,
          waveField,
          advantageField,
          aiFallbackSurface,
          beatSource: "none",
          ...HEART_CONTEXT
        };
      }
    }

    // MOM DOWN, DAD NOT AVAILABLE → RANDOM LAST-RESORT
    heartHealing.lastError = {
      message: msg,
      stage: "mom_pulse_failed_no_dad"
    };
    heartHealing.lastExitReason = "fatal_error";
    heartHealing.lastBeatSource = "none";

    await logHeart("FATAL_ERROR", {
      message: msg,
      aiHeartbeatAlive: aiFallbackSurface.aiHeartbeatAlive
    });

    const randomResult = randomBeatNudge();
    if (randomResult) {
      return {
        ...randomResult,
        heartCycle: HEART_CYCLE,
        heartCycleSignature: heartHealing.lastHeartCycleSignature,
        binaryField,
        waveField,
        advantageField,
        aiFallbackSurface,
        ...HEART_CONTEXT
      };
    }

    return {
      ok: false,
      error: msg,
      heartCycle: HEART_CYCLE,
      heartCycleSignature: heartHealing.lastHeartCycleSignature,
      binaryField,
      waveField,
      advantageField,
      aiFallbackSurface,
      beatSource: "none",
      ...HEART_CONTEXT
    };
  }
}

// ============================================================================
// DIAGNOSTICS
// ============================================================================
export function getPulseProxyHeartHealingState() {
  return { ...heartHealing };
}

export function getPulseProxyHeartDiagnostics() {
  return {
    cycles: heartHealing.cycles,
    lastBeatResult: heartHealing.lastBeatResult,
    lastError: heartHealing.lastError,
    lastExitReason: heartHealing.lastExitReason,
    lastCycleIndex: heartHealing.lastCycleIndex,
    lastHeartCycleSignature: heartHealing.lastHeartCycleSignature,
    lastBinaryField: heartHealing.lastBinaryField,
    lastWaveField: heartHealing.lastWaveField,
    lastAdvantageField: heartHealing.lastAdvantageField,
    lastAiFallbackSurface: heartHealing.lastAiFallbackSurface,
    lastBeatSource: heartHealing.lastBeatSource
  };
}
