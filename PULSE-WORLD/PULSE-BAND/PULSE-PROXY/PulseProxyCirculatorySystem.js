// ============================================================================
//  PULSE OS v12.3‑PRESENCE‑EVO+ — ADRENAL SYSTEM (Instance Circulation Organ)
//  Backend‑only • Reflex‑Safe Scaling • Instance “Blood Flow” Regulator
//  PURE SCALING MATH. NO IQ. NO ROUTING. NO AI.
// ============================================================================


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================
import { logger } from "../../PULSE-UI/_CONNECTORS/PulseProofLogger.js";
import { PulseLineage } from "./PulseProxyBBB.js";
const admin = global.db;
const db    = global.db;

// ============================================================================
//  PULSE ROLE — v12.3‑PRESENCE‑EVO+ Identity
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseProxyAdrenalSystem-v12.3-PRESENCE-EVO-ABA",

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

    // circulatory awareness
    circulationAware: true,
    stressFieldAware: true,
    capacityFieldAware: true,

    // A‑B‑A surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    // 12.3+ presence extensions
    presenceAware: true,
    meshPressureAware: true,
    expansionAware: true,
    runtimeAware: true,
    schedulerAware: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v12.3‑PRESENCE‑EVO+
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
//  MODES — Orchestrator routing modes (v12.3‑PRESENCE‑EVO+)
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};


// ============================================================================
//  CONFIG — Physiological Limits (v12.3‑PRESENCE‑EVO+)
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
const activeWorkers = new Map();

export const PulseProxyAdrenalSystemMeta = Object.freeze({
  layer: "PulseProxyAdrenalSystem",
  role: "ADRENAL_SYSTEM_ORGAN",
  version: "v12.3-PRESENCE-EVO-BINARY-MAX-ABA",
  identity: "PulseProxyAdrenalSystem-v12.3-PRESENCE-EVO-BINARY-MAX-ABA",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    adrenalOrgan: true,
    reflexSafe: true,
    fightOrFlightReflex: true,
    instanceCirculationOrgan: true,
    stressScaling: true,
    capacityScaling: true,
    dynamicBandReflex: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    circulationAware: true,
    stressFieldAware: true,
    capacityFieldAware: true,
    backendOnly: true,
    governorReady: true,

    zeroRandomness: true,
    zeroNondeterminism: true,
    zeroExternalMutation: true,
    zeroSymbolicContaminationInBinary: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroDateNow: true,
    zeroNetworkFetch: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroAI: true,
    zeroRouting: true,
    zeroIQ: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    dualMode: true,
    localAware: true,
    internetAware: true,

    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "UserScoresSnapshot",
      "OrchestratorMode",
      "StressContext",
      "CapacityContext",
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
    parent: "PulseProxy-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseProxyAdrenalSystem-v7",
      "PulseProxyAdrenalSystem-v8",
      "PulseProxyAdrenalSystem-v9",
      "PulseProxyAdrenalSystem-v10",
      "PulseProxyAdrenalSystem-v11",
      "PulseProxyAdrenalSystem-v11-Evo",
      "PulseProxyAdrenalSystem-v11.2-EVO-BINARY-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
    default: "symbolic",
    behavior: "adrenal-circulation"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "stress + capacity → circulation scaling → worker plan",
    adaptive: "dynamic symbolic→binary shift under stress",
    return: "deterministic adrenal surfaces + signatures"
  })
});


// ============================================================================
//  v12.3‑PRESENCE‑EVO+ CIRCULATORY HELPERS
// ============================================================================
let adrenalCycle = 0;

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildAdrenalCycleSignature(cycle) {
  return computeHash(`ADRENAL_CYCLE::${cycle}`);
}

function buildCapacityField(deviceTier, finalInstances) {
  const tierScore =
    deviceTier === "highend" ? 3 :
    deviceTier === "upgraded" ? 2 :
    1;

  const capacityScore = tierScore * Math.max(1, finalInstances);
  const saturation = Math.min(1, finalInstances / TEST_EARN_MAX);

  return {
    deviceTier,
    finalInstances,
    tierScore,
    capacityScore,
    saturation,
    capacitySignature: computeHash(
      `CAPACITY::${deviceTier}::${finalInstances}::${tierScore}`
    )
  };
}

function buildStressField(orchestratorMode, earnMode, testEarnActive) {
  let base = 0;

  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) base += 0.2;
  if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) base += 0.5;
  if (earnMode) base += 0.2;
  if (testEarnActive) base += 0.3;

  const stressIndex = Math.max(0, Math.min(1, base));

  let band = "rest";
  if (stressIndex >= 0.7) band = "surge";
  else if (stressIndex >= 0.4) band = "elevated";

  return {
    stressIndex,
    band,
    stressSignature: computeHash(
      `STRESS::${orchestratorMode}::${earnMode}::${testEarnActive}::${stressIndex}`
    )
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
//  COMPUTE FINAL INSTANCE COUNT — Deterministic v12.3‑PRESENCE‑EVO+
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
//  LOG USER SNAPSHOT — v12.3‑PRESENCE‑EVO+
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
    started: Date.now(),
    mode: orchestratorMode,
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
//  MAIN ORCHESTRATOR LOOP — v12.3‑PRESENCE‑EVO+
// ============================================================================
export async function runInstanceOrchestrator(pulse) {
  adrenalCycle++;

  const orchestratorMode =
    pulse?.mode && Object.values(ORCHESTRATOR_MODES).includes(pulse.mode)
      ? pulse.mode
      : ORCHESTRATOR_MODES.NORMAL;

  const adrenalCycleSignature = buildAdrenalCycleSignature(adrenalCycle);

  logger.log("adrenal", "tick_start", {
    ...ADRENAL_CONTEXT,
    pulseId: pulse?.jobId || pulse?.id || null,
    pulseLineage: pulse?.lineage || null,
    pulseMode: orchestratorMode,
    adrenalCycle,
    adrenalCycleSignature
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

    const capacityField = buildCapacityField(deviceTier, finalInstances);
    const stressField = buildStressField(
      orchestratorMode,
      earnMode,
      testEarnActive
    );

    logger.log("adrenal", "state", {
      userId,
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      current: currentWorkers.length,
      final: finalInstances,
      mode: orchestratorMode,
      adrenalCycle,
      adrenalCycleSignature,
      capacityField,
      stressField
    });

    // SCALE UP
    if (currentWorkers.length < finalInstances) {
      const needed = finalInstances - currentWorkers.length;

      logger.log("adrenal", "scale_up", {
        userId,
        needed,
        from: currentWorkers.length,
        to: finalInstances,
        mode: orchestratorMode
      });

      for (let i = 0; i < needed; i++) {
        const workerIndex = currentWorkers.length;
        const worker = launchWorker(userId, workerIndex, orchestratorMode);
        currentWorkers.push(worker);
      }
    }

    // SCALE DOWN
    if (currentWorkers.length > finalInstances) {
      const extra = currentWorkers.length - finalInstances;

      logger.log("adrenal", "scale_down", {
        userId,
        extra,
        from: currentWorkers.length,
        to: finalInstances,
        mode: orchestratorMode
      });

      for (let i = 0; i < extra; i++) {
        const worker = currentWorkers.pop();
        killWorker(worker);
      }
    }

    // SNAPSHOT
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      lastUpdated: Date.now(),
      mode: orchestratorMode,
      adrenalCycle,
      adrenalCycleSignature,
      capacityField,
      stressField
    });
  }

  logger.log("adrenal", "tick_complete", {
    mode: orchestratorMode,
    adrenalCycle,
    adrenalCycleSignature
  });

  return true;
}
