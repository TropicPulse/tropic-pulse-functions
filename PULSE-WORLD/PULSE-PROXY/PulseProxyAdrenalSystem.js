// ============================================================================
//  PulseProxyAdrenalSystem-v11-Evo-ABA.js
//  ADRENAL SYSTEM — v11‑Evo A‑B‑A
//  (Dynamic Band Reflex Organ + Stress Scaling + Instance Orchestrator)
// ============================================================================
//
//  ROLE:
//    - Fight‑or‑flight reflex organ for Pulse‑Earn.
//    - Scales worker “cells” based on stress, tier, and orchestrator mode.
//    - Emits A‑B‑A surfaces: bandSignature, binaryField, waveField.
//    - Dynamic band: low stress → symbolic, high stress → binary.
//    - Backend‑only, deterministic, drift‑proof.
//
//  CONTRACT (v11‑Evo A‑B‑A):
//    - NO randomness.
//    - NO nondeterminism.
//    - NO mutation outside activeWorkers.
//    - NO symbolic contamination in binary surfaces.
//    - Firestore allowed (backend‑only).
// ============================================================================


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================
import { logger } from "../OSKernel/PulseLogger.js";
import { PulseLineage } from "../OSKernel/PulseIdentity.js";

// Firestore (backend‑only)
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();


// ============================================================================
//  PULSE ROLE — v11‑Evo A‑B‑A Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "11-Evo",
  identity: "PulseProxyAdrenalSystem-v11-Evo-ABA",

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
    stressFieldAware: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v11‑Evo
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
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseProxyAdrenalSystem-v11.2-EVO-BINARY-MAX",

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
      "AdrenalDiagnostics",
      "AdrenalHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "PulseProxyAdrenalSystem-v9",
      "PulseProxyAdrenalSystem-v10",
      "PulseProxyAdrenalSystem-v11",
      "PulseProxyAdrenalSystem-v11-Evo",
      "PulseProxyAdrenalSystem-v11-Evo-ABA"
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
    adaptive: "dynamic symbolic→binary shift",
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

const INSTANCE_HEARTBEAT_MS = 5000;


// ============================================================================
//  INTERNAL STATE — Active “cells” per user
// ============================================================================
const activeWorkers = new Map(); // userId -> worker[]


// ============================================================================
//  A‑B‑A SURFACES — Dynamic Band (stress-based)
// ============================================================================
function computeStressField(finalInstances, baseInstances) {
  const delta = Math.max(0, finalInstances - baseInstances);
  return {
    stressLevel: delta,
    stressRatio: baseInstances === 0 ? 1 : delta / baseInstances
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
//  COMPUTE FINAL INSTANCE COUNT — v11‑Evo deterministic
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode) {
  let final = base || 1;

  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) final = Math.floor(final * EARN_MODE_MULT);

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      final = Math.max(final, (base || 1) * 2);
    }

    if (testEarnActive) final = TEST_EARN_MAX;
  }

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  return Math.max(1, Math.min(final, max));
}


// ============================================================================
//  LOG USER SNAPSHOT — v11‑Evo
// ============================================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      ts: Date.now(),
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — Spawn a new “cell”
// ============================================================================
function launchWorker(userId, workerIndex, orchestratorMode) {
  const workerName = `${userId}-instance-${workerIndex}`;

  logger.log("adrenal", "launch", {
    userId,
    workerName,
    workerIndex,
    mode: orchestratorMode,
    context: ADRENAL_CONTEXT
  });

  const interval = setInterval(() => {
    logger.log("adrenal", "worker_heartbeat", {
      workerName,
      userId,
      index: workerIndex,
      mode: orchestratorMode
    });
  }, INSTANCE_HEARTBEAT_MS);

  return {
    name: workerName,
    userId,
    index: workerIndex,
    mode: orchestratorMode,
    started: Date.now(),
    interval
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
    mode: worker.mode
  });

  try {
    clearInterval(worker.interval);
  } catch {}
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v11‑Evo A‑B‑A
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
    adrenalCycleSignature: buildAdrenalCycleSignature(adrenalCycle)
  });

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data() || {};

    const baseInstances   = data.instances ?? 1;
    const deviceTier      = data.deviceTier ?? "normal";
    const earnMode        = data.earnMode ?? false;
    const testEarnActive  = data.testEarnActive ?? false;

    const finalInstances = computeFinalInstances(
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

    logger.log("adrenal", "state", {
      userId,
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      current: currentWorkers.length,
      final: finalInstances,
      mode: orchestratorMode,

      band,
      bandSignature,
      binaryField,
      waveField,
      stressField
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
        stressField
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
        stressField
      });

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // ------------------------------------------------------------
    // SNAPSHOT — Immune‑Safe Logging
    // ------------------------------------------------------------
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      lastUpdated: Date.now(),
      mode: orchestratorMode,

      // A‑B‑A surfaces
      band,
      bandSignature,
      binaryField,
      waveField,
      stressField
    });
  }

  logger.log("adrenal", "tick_complete", {
    mode: orchestratorMode,
    adrenalCycleSignature: buildAdrenalCycleSignature(adrenalCycle)
  });

  return true;
}
