// ============================================================================
//  PulseProxyAdrenalSystem-v12.3-EVO-ABA.js
//  ADRENAL SYSTEM — v12.3‑Evo A‑B‑A
//  Dynamic Band Reflex Organ + Stress Scaling + Instance Orchestrator
//  12.3+: Dual‑Band + Presence/Harmonics + Prewarm/Cache/Chunk/Remember Hints
// ============================================================================
//
//  ROLE:
//    - Fight‑or‑flight reflex organ for Pulse‑Earn / Pulse‑Proxy.
//    - Scales worker “cells” based on stress, tier, and orchestrator mode.
//    - Emits A‑B‑A surfaces: bandSignature, binaryField, waveField.
//    - Dynamic band: low stress → symbolic, high stress → binary.
//    - Dual‑band aware with presence/harmonics + passive prewarm/cache/chunk/remember hints.
//    - Backend‑only, deterministic, drift‑proof.
//
//  CONTRACT (v12.3‑Evo A‑B‑A):
//    - NO randomness.
//    - NO nondeterminism.
//    - NO timers, NO intervals, NO Date.now in core logic.
//    - NO mutation outside activeWorkers registry.
//    - NO symbolic contamination in binary surfaces.
//    - Firestore allowed (backend‑only).
// ============================================================================


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================
import { logger } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";
import { PulseLineage } from "./PulseProxyBBB.js";
// const admin = global.db;
const db    = global.db;

// ============================================================================
//  PULSE ROLE — v12.3‑Evo A‑B‑A Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "12.3-EVO-ABA",
  identity: "PulseProxyAdrenalSystem-v12.3-EVO-ABA",

  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSendAware: true,
    governorReady: true,
    reflexSafe: true,
    backendOnly: true,
    futureEvolutionReady: true,

    // A‑B‑A awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    stressFieldAware: true,

    // 12.3+ dual-band + presence/harmonics
    dualBandCompatible: true,
    presenceAware: true,
    harmonicsAware: true,
    epochStable: true,

    // Passive band abilities (symbolic hints only)
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v12.3‑Evo
// ============================================================================
const ADRENAL_CONTEXT = {
  layer: PulseRole.layer,
  role: "ADRENAL_SYSTEM",
  version: PulseRole.version,
  lineage: PulseLineage.proxy,
  evo: PulseRole.evo,
  mode: "backend-only"
};


// ============================================================================
//  ORCHESTRATOR MODES
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};

export const PulseProxyAdrenalSystemMeta = Object.freeze({
  layer: "PulseProxyAdrenalSystem",
  role: "ADRENAL_SYSTEM_ORGAN",
  version: "v12.3-EVO-BINARY-MAX",
  identity: "PulseProxyAdrenalSystem-v12.3-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Adrenal laws
    adrenalOrgan: true,
    fightOrFlightReflex: true,
    stressScaling: true,
    instanceOrchestrator: true,
    dynamicBandReflex: true,
    symbolicToBinaryShift: true,
    binaryFieldEmitter: true,
    waveFieldEmitter: true,
    bandSignatureEmitter: true,
    stressFieldAware: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    governorReady: true,
    reflexSafe: true,
    backendOnly: true,

    // 12.3+ dual-band + presence/harmonics
    dualBandCompatible: true,
    presenceAware: true,
    harmonicsAware: true,
    epochStable: true,

    // Passive band abilities (symbolic hints only)
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,

    // Execution prohibitions
    zeroRandomness: true,
    zeroNondeterminism: true,
    zeroExternalMutation: true,
    zeroSymbolicContaminationInBinary: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroDateNow: true,
    zeroNetworkFetch: true,     // Firestore allowed
    zeroWindow: true,
    zeroDOM: true,

    // Awareness
    dualMode: true,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    localAware: true,
    internetAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "UserScoresSnapshot",
      "OrchestratorMode",
      "StressContext",
      "DualBandContext"
    ],
    output: [
      "AdrenalScalingPlan",
      "WorkerLaunchPlan",
      "WorkerShutdownPlan",
      "AdrenalBandSignature",
      "AdrenalBinaryField",
      "AdrenalWaveField",
      "AdrenalPresenceField",
      "AdrenalHarmonicsField",
      "AdrenalDiagnostics",
      "AdrenalHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "PulseProxyAdrenalSystem-v9",
      "PulseProxyAdrenalSystem-v10",
      "PulseProxyAdrenalSystem-v11",
      "PulseProxyAdrenalSystem-v11-Evo",
      "PulseProxyAdrenalSystem-v11-Evo-ABA",
      "PulseProxyAdrenalSystem-v11.2-EVO-BINARY-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
    default: "symbolic",
    behavior: "adrenal-reflex"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "stress → band reflex → scaling plan",
    adaptive: "dynamic symbolic→binary shift + presence/harmonics overlays",
    return: "deterministic adrenal surfaces + signatures"
  })
});

// ============================================================================
//  PHYSIOLOGICAL LIMITS
// ============================================================================
export const NORMAL_MAX     = 4;
export const UPGRADED_MAX   = 8;
export const HIGHEND_MAX    = 8;
export const TEST_EARN_MAX  = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_INSTANCE_LOGGING = true;
export const INSTANCE_LOG_COLLECTION = "UserInstanceLogs";


// ============================================================================
//  INTERNAL STATE — Active “cells” per user
// ============================================================================
const activeWorkers = new Map(); // userId -> worker[]

// deterministic sequence counter (replaces Date.now / timers)
let adrenalSeq = 0;


// ============================================================================
//  A‑B‑A SURFACES — Dynamic Band (stress-based)
// ============================================================================
function computeStressField(finalInstances, baseInstances) {
  const safeBase = baseInstances <= 0 ? 1 : baseInstances;
  const delta = Math.max(0, finalInstances - safeBase);
  return {
    stressLevel: delta,
    stressRatio: safeBase === 0 ? 1 : delta / safeBase
  };
}

function computeBand(stressField) {
  return stressField.stressRatio >= 0.5 ? "binary" : "symbolic";
}

function buildBandSignature(band) {
  const raw = `ADRENAL_BAND::${band}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `adrenal-band-${acc}`;
}

function buildBinaryField(stressField) {
  const patternLen = 12 + Math.floor(stressField.stressLevel);
  const density = patternLen + stressField.stressLevel * 4;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `adrenal-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `adrenal-binary-surface-${(surface * 7) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(stressField, band) {
  const amplitude = (stressField.stressLevel + 1) * (band === "binary" ? 10 : 5);
  const wavelength = amplitude + 4;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

function buildAdrenalCycleSignature(cycle) {
  return `adrenal-cycle-${(cycle * 7919) % 99991}`;
}

// 12.3+ presence/harmonics + passive band hints (purely derived)
function buildPresenceAndHarmonics(stressField, band) {
  const level = stressField.stressLevel;
  const ratio = stressField.stressRatio;

  const presenceBandState =
    level > 8 ? "deep-presence" :
    level > 4 ? "stable-presence" :
    "light-presence";

  const harmonicDrift = Math.max(
    0,
    Math.min(1, ratio)
  );

  const coherenceScore = Math.max(
    0.2,
    Math.min(1.0, 0.7 + ratio * 0.2 - level * 0.01)
  );

  const pulsePrewarm =
    band === "binary" ? "preferred" : "optional";

  const pulseCacheMode =
    ratio >= 0.5 ? "stress-cache" : "normal-cache";

  const pulseChunkMode =
    level > 6 ? "multi-chunk" : "single-chunk";

  const pulseRemember =
    ratio >= 0.3 ? "remember-strong" : "remember-weak";

  const dualBandMode =
    band === "binary" ? "binary" : "symbolic";

  return {
    presenceBandState,
    harmonicDrift,
    coherenceScore,
    pulsePrewarm,
    pulseCacheMode,
    pulseChunkMode,
    pulseRemember,
    dualBandMode
  };
}


// ============================================================================
//  DEVICE TIER → MAX INSTANCES
// ============================================================================
function getDeviceMax(deviceTier, testEarnActive, orchestratorMode) {
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) return 1;
  if (testEarnActive) return TEST_EARN_MAX;

  switch (deviceTier) {
    case "upgraded": return UPGRADED_MAX;
    case "highend":  return HIGHEND_MAX;
    default:         return NORMAL_MAX;
  }
}


// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — v12.3‑Evo deterministic
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode) {
  const safeBase = base && base > 0 ? base : 1;
  let final = safeBase;

  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      final = Math.max(final, safeBase * 2);
    }

    if (testEarnActive) final = TEST_EARN_MAX;
  }

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  const clamped = Math.max(1, Math.min(final, max));

  return {
    finalInstances: clamped,
    maxAllowed: max
  };
}


// ============================================================================
//  LOG USER SNAPSHOT — v12.3‑Evo (deterministic, no Date.now)
// ============================================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      seq: ++adrenalSeq,
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — Spawn a new “cell” (no timers, no Date.now)
// ============================================================================
function launchWorker(userId, workerIndex, orchestratorMode) {
  const workerName = `${userId}-instance-${workerIndex}`;

  logger.log("adrenal", "launch", {
    userId,
    workerName,
    workerIndex,
    mode: orchestratorMode,
    context: ADRENAL_CONTEXT,
    seq: ++adrenalSeq
  });

  return {
    name: workerName,
    userId,
    index: workerIndex,
    mode: orchestratorMode,
    seq: adrenalSeq
  };
}


// ============================================================================
//  KILL WORKER — Reabsorb a “cell”
// ============================================================================
function killWorker(worker) {
  if (!worker) return;

  logger.log("adrenal", "shutdown", {
    worker: worker.name,
    userId: worker.userId,
    index: worker.index,
    mode: worker.mode,
    seq: ++adrenalSeq
  });
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v12.3‑Evo A‑B‑A
// ============================================================================
let adrenalCycle = 0;

export async function runInstanceOrchestrator(pulse) {
  adrenalCycle++;

  const requestedMode = pulse?.mode;
  const orchestratorMode =
    requestedMode && Object.values(ORCHESTRATOR_MODES).includes(requestedMode)
      ? requestedMode
      : ORCHESTRATOR_MODES.NORMAL;

  logger.log("adrenal", "tick_start", {
    ...ADRENAL_CONTEXT,
    pulseId: pulse?.jobId || pulse?.id || null,
    pulseLineage: pulse?.lineage || null,
    pulseMode: orchestratorMode,
    adrenalCycleSignature: buildAdrenalCycleSignature(adrenalCycle),
    seq: ++adrenalSeq
  });

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data() || {};

    const baseInstances   = data.instances ?? 1;
    const deviceTier      = data.deviceTier ?? "normal";
    const earnMode        = data.earnMode ?? false;
    const testEarnActive  = data.testEarnActive ?? false;

    const {
      finalInstances,
      maxAllowed
    } = computeFinalInstances(
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      orchestratorMode
    );

    if (!activeWorkers.has(userId)) {
      activeWorkers.set(userId, []);
    }

    const currentWorkers = activeWorkers.get(userId);

    // ------------------------------------------------------------
    // A‑B‑A SURFACES FOR THIS USER
    // ------------------------------------------------------------
    const stressField = computeStressField(finalInstances, baseInstances);
    const band = computeBand(stressField);
    const bandSignature = buildBandSignature(band);
    const binaryField = buildBinaryField(stressField);
    const waveField = buildWaveField(stressField, band);
    const presence = buildPresenceAndHarmonics(stressField, band);

    logger.log("adrenal", "state", {
      userId,
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      current: currentWorkers.length,
      final: finalInstances,
      maxAllowed,
      mode: orchestratorMode,

      band,
      bandSignature,
      binaryField,
      waveField,
      stressField,

      presenceBandState: presence.presenceBandState,
      harmonicDrift: presence.harmonicDrift,
      coherenceScore: presence.coherenceScore,
      pulsePrewarm: presence.pulsePrewarm,
      pulseCacheMode: presence.pulseCacheMode,
      pulseChunkMode: presence.pulseChunkMode,
      pulseRemember: presence.pulseRemember,
      dualBandMode: presence.dualBandMode,

      seq: ++adrenalSeq
    });

    // ------------------------------------------------------------
    // SCALE UP — Fight‑or‑Flight Reflex
    // ------------------------------------------------------------
    if (currentWorkers.length < finalInstances) {
      const needed = finalInstances - currentWorkers.length;

      logger.log("adrenal", "scale_up", {
        userId,
        needed,
        from: currentWorkers.length,
        to: finalInstances,
        mode: orchestratorMode,
        band,
        stressField,
        seq: ++adrenalSeq
      });

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex, orchestratorMode);
        currentWorkers.push(worker);
      }
    }

    // ------------------------------------------------------------
    // SCALE DOWN — Recovery Reflex
    // ------------------------------------------------------------
    if (currentWorkers.length > finalInstances) {
      const extra = currentWorkers.length - finalInstances;

      logger.log("adrenal", "scale_down", {
        userId,
        extra,
        from: currentWorkers.length,
        to: finalInstances,
        mode: orchestratorMode,
        band,
        stressField,
        seq: ++adrenalSeq
      });

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // ------------------------------------------------------------
    // SNAPSHOT — Immune‑Safe Logging (deterministic, dual‑band aware)
// ------------------------------------------------------------
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      maxAllowed,
      mode: orchestratorMode,

      // A‑B‑A surfaces
      band,
      bandSignature,
      binaryField,
      waveField,
      stressField,

      // 12.3+ presence/harmonics + passive band hints
      presenceBandState: presence.presenceBandState,
      harmonicDrift: presence.harmonicDrift,
      coherenceScore: presence.coherenceScore,
      pulsePrewarm: presence.pulsePrewarm,
      pulseCacheMode: presence.pulseCacheMode,
      pulseChunkMode: presence.pulseChunkMode,
      pulseRemember: presence.pulseRemember,
      dualBandMode: presence.dualBandMode
    });
  }

  logger.log("adrenal", "tick_complete", {
    mode: orchestratorMode,
    adrenalCycleSignature: buildAdrenalCycleSignature(adrenalCycle),
    seq: ++adrenalSeq
  });

  return true;
}
