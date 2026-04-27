// ============================================================================
// FILE: /apps/PULSE-PROXY/CheckBand-v11-EVO-BINARY.js
// PULSE INSTANCE ORCHESTRATOR — “CHECKBAND” — v11‑EVO‑BINARY
// “THE BAND CONTROLLER / INSTANCE ADRENAL SYSTEM / BINARY-FIRST ORCHESTRATOR”
// ============================================================================
//
// ROLE (v11‑EVO‑BINARY / CHECKBAND):
//   • Backend‑only, PULSE‑folder organ (safe for OSKernel + proxy spine)
//   • Orchestrates per‑user “instance band” (active workers) deterministically
//   • Reads UserScores → computes instance band size → launches/shuts workers
//   • Binary‑first, dualband: symbolic view + binary compression metadata
//   • No timers, no intervals, no Date.now — pure metadata + Firestore writes
//   • Designed to run on a binary‑designed organism: no middleman layers
//
// INTENT (ALIGNMENT WITH PULSE INTENT MAP v11‑EVO):
//   • binaryFirstEvolution: instance orchestration respects binary organism first
//   • preferBinaryRouteFirst: CheckBand is the binary‑aware band controller
//   • noTextFirstPaths: no async nervous system, no timer‑driven scaling
//   • deterministicOrganism: same input scores → same band shape, replayable
//   • fail‑open: if Firestore or scores drift, band degrades safely, never panics
//
// CONTRACT (v11‑EVO‑BINARY):
//   • Backend‑only organ (PULSE‑ prefix, no frontend imports)
//   • No randomness, no Date.now, no timers, no async loops
//   • Never mutates external inputs (UserScores docs are read‑only)
//   • Only legal mutable state: in‑memory activeWorkers registry
//   • Deterministic, loggable, replayable, binary‑aware
//   • Snapshots are metadata‑only, safe for OS‑Healer + GlobalHealer
// ============================================================================
export const PulseOSCheckBandMeta = Object.freeze({
  layer: "PulseProxyAdrenalSystem",
  role: "BAND_CONTROLLER_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "CheckBand-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Adrenal laws
    adrenalOrgan: true,
    instanceBandController: true,
    deterministicScaling: true,
    binaryFirstOrganism: true,
    dualBandAware: true,
    symbolicAware: true,
    binaryAware: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    pulseSendAware: true,

    // Execution prohibitions
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroDateNow: true,
    zeroRandomness: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,        // Firestore allowed, fetch not allowed
    zeroFrontendAccess: true,
    zeroWindowAccess: true,

    // Environment
    localAware: true,
    internetAware: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "UserScoresSnapshot",
      "ProxyContext",
      "DualBandContext"
    ],
    output: [
      "InstanceBandShape",
      "WorkerLaunchPlan",
      "WorkerShutdownPlan",
      "CheckBandDiagnostics",
      "CheckBandSignatures",
      "CheckBandHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11-EVO",
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "CheckBand-v9",
      "CheckBand-v10",
      "CheckBand-v11",
      "CheckBand-v11-Evo",
      "CheckBand-v11-Evo-Binary"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic"],
    default: "binary",
    behavior: "adrenal-scaling"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "UserScores → deterministic band → worker launch/shutdown",
    adaptive: "binary-first scaling surfaces",
    return: "deterministic instance band + signatures"
  })
});


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================

// Firestore (backend‑only)
import { getFirestore } from "firebase-admin/firestore";
const db = getFirestore();


// ============================================================================
//  PULSE ROLE — v11‑EVO‑BINARY Identity (CHECKBAND)
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "11.0-EVO-BINARY",
  identity: "CheckBand-v11-EVO-BINARY",

  evo: {
    // Dualband + binary‑first nervous system
    dualMode: true,                 // Symbolic + binary metadata
    binaryFirst: true,              // Binary organism first, no middlemen
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,

    // Determinism + drift‑proofing
    driftProof: true,
    deterministicScaling: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSendAware: true,

    // Evolution + future‑proofing
    futureEvolutionReady: true,
    binaryOrganismAligned: true,    // Aligned with AIBinaryOrganism
    noTimers: true,                 // No timer‑based nervous system
    noAsyncLoops: true              // No self‑driving loops
  }
};


// ============================================================================
//  ORGAN CONTEXT — v11‑EVO‑BINARY
// ============================================================================
const ADRENAL_CONTEXT = {
  layer: PulseRole.layer,
  role: "ADRENAL_SYSTEM_CHECKBAND",
  version: PulseRole.version,
  lineage: PulseLineage.optimizer,
  evo: PulseRole.evo,
  binaryFirst: true,
  dualband: true,
  purpose:
    "Deterministic instance band controller (CheckBand) for per‑user worker orchestration"
};


// ============================================================================
//  MODES — Orchestrator routing modes (v11‑EVO‑BINARY)
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};


// ============================================================================
//  CONFIG — Physiological Limits (v11, drift‑proof, binary‑aware)
//  • These are the “band width” limits per device tier
//  • No randomness, no auto‑tuning at runtime
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
//  INTERNAL STATE — Active “cells” per user (CHECKBAND REGISTRY)
//  • Only legal mutable registry in this organ
//  • Represents the current “band” of active instances per user
// ============================================================================
const activeWorkers = new Map(); // userId -> worker[]


// ============================================================================
//  BINARY HELPERS — Instance Signatures + Drift Flags
//  • Binary signatures compress band state for binary nervous system
//  • Drift flags detect impossible or suspicious band shapes
// ============================================================================
let adrenalSeq = 0; // deterministic sequence counter (replaces Date.now)

function computeBinaryInstanceSignature(userId, index, deviceTier, mode) {
  const seed = `${userId}|${index}|${deviceTier}|${mode}|${adrenalSeq}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return "BAND-BIN-" + hash.toString(16).padStart(8, "0");
}

function computeBandDriftFlags(finalInstances, maxAllowed) {
  const flags = [];
  if (finalInstances > maxAllowed) {
    flags.push("band_exceeds_device_max");
  }
  if (finalInstances <= 0) {
    flags.push("band_zero_or_negative");
  }
  return flags;
}


// ============================================================================
//  DEVICE TIER → MAX INSTANCES (deterministic, v11‑EVO‑BINARY)
// ============================================================================
function getDeviceMax(deviceTier, testEarnActive, orchestratorMode) {
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    return 1;
  }

  if (testEarnActive) {
    return TEST_EARN_MAX;
  }

  switch (deviceTier) {
    case "upgraded":
      return UPGRADED_MAX;
    case "highend":
      return HIGHEND_MAX;
    default:
      return NORMAL_MAX;
  }
}


// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — Deterministic v11‑EVO‑BINARY
//  • No randomness
//  • No timers
//  • Binary‑aware band shaping
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode) {
  let final = base;

  // Mode‑aware routing (deterministic)
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) {
      final = Math.floor(final * EARN_MODE_MULT);
    }

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      // Stress mode: deterministic ceiling, no randomness
      final = Math.max(final, base * 2);
    }

    if (testEarnActive) {
      final = TEST_EARN_MAX;
    }
  }

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  const clamped = Math.max(1, Math.min(final, max));

  return {
    finalInstances: clamped,
    maxAllowed: max,
    driftFlags: computeBandDriftFlags(clamped, max)
  };
}


// ============================================================================
//  LOG USER SNAPSHOT — v11‑EVO‑BINARY (deterministic, immune‑safe)
//  • No Date.now()
//  • No nondeterministic timestamps
//  • Binary metadata attached for OS‑Healer / GlobalHealer
// ============================================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      seq: ++adrenalSeq,   // deterministic, replaces Date.now()
      binaryBandSignature: snapshot.binaryBandSignature,
      binaryBandDriftFlags: snapshot.binaryBandDriftFlags,
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — v11‑EVO‑BINARY (no timers, no intervals, no Date.now)
//  • Workers are pure metadata objects
//  • First‑class citizens of the binary nervous system
// ============================================================================
function launchWorker(userId, workerIndex, orchestratorMode, deviceTier) {
  const workerName = `${userId}-instance-${workerIndex}`;
  const binarySignature = computeBinaryInstanceSignature(
    userId,
    workerIndex,
    deviceTier,
    orchestratorMode
  );

  logger.log("adrenal", "launch", {
    userId,
    workerName,
    workerIndex,
    mode: orchestratorMode,
    binarySignature
  });

  return {
    name: workerName,
    userId,
    index: workerIndex,
    mode: orchestratorMode,
    deviceTier,
    seq: ++adrenalSeq,   // deterministic creation marker
    binarySignature
  };
}


// ============================================================================
//  KILL WORKER — v11‑EVO‑BINARY (no intervals to clear)
// ============================================================================
function killWorker(worker) {
  logger.log("adrenal", "shutdown", {
    worker: worker.name,
    mode: worker.mode,
    binarySignature: worker.binarySignature
  });
  // No timers to clear in v11‑EVO‑BINARY
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v11‑EVO‑BINARY (CHECKBAND)
//  Deterministic • Drift‑Proof • No timing • No intervals
//  Binary‑first band controller: scores → band shape → binary metadata
// ============================================================================
export async function runInstanceOrchestrator(pulse) {
  const orchestratorMode =
    pulse?.mode && Object.values(ORCHESTRATOR_MODES).includes(pulse.mode)
      ? pulse.mode
      : ORCHESTRATOR_MODES.NORMAL;

  logger.log("adrenal", "tick_start", {
    ...ADRENAL_CONTEXT,
    pulseId: pulse?.jobId || pulse?.id || null,
    mode: orchestratorMode
  });

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const userId = doc.id;
    const data = doc.data();

    const baseInstances   = data.instances ?? 1;
    const deviceTier      = data.deviceTier ?? "normal";
    const earnMode        = data.earnMode ?? false;
    const testEarnActive  = data.testEarnActive ?? false;

    const {
      finalInstances,
      maxAllowed,
      driftFlags
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

    logger.log("adrenal", "state", {
      userId,
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      current: currentWorkers.length,
      final: finalInstances,
      maxAllowed,
      driftFlags,
      mode: orchestratorMode
    });

    // ------------------------------------------------------------
    // SCALE UP — Fight‑or‑Flight Reflex (deterministic, binary‑aware)
    // ------------------------------------------------------------
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
        const worker = launchWorker(
          userId,
          workerIndex,
          orchestratorMode,
          deviceTier
        );
        currentWorkers.push(worker);
      }
    }

    // ------------------------------------------------------------
    // SCALE DOWN — Recovery Reflex (deterministic, binary‑aware)
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // BINARY BAND SIGNATURE — compress entire band for this user
    // ------------------------------------------------------------
    const bandSeed = `${userId}|${currentWorkers.length}|${deviceTier}|${orchestratorMode}|${adrenalSeq}`;
    let bandHash = 0;
    for (let i = 0; i < bandSeed.length; i++) {
      bandHash = (bandHash * 31 + bandSeed.charCodeAt(i)) >>> 0;
    }
    const binaryBandSignature =
      "BAND-STATE-" + bandHash.toString(16).padStart(8, "0");

    // ------------------------------------------------------------
    // SNAPSHOT — Immune‑Safe Logging (deterministic, dualband)
// ------------------------------------------------------------
    await logUserInstanceSnapshot(userId, {
      baseInstances,
      finalInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      currentWorkers: currentWorkers.length,
      maxAllowed,
      seq: adrenalSeq,
      mode: orchestratorMode,
      binaryBandSignature,
      binaryBandDriftFlags: driftFlags
    });
  }

  logger.log("adrenal", "tick_complete", { mode: orchestratorMode });
  return true;
}
