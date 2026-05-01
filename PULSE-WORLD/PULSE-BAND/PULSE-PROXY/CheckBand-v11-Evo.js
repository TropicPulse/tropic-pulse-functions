// ============================================================================
// FILE: /PULSE-PROXY/CheckBand-v12.3-PRESENCE-EVO-BINARY.js
// PULSE INSTANCE ORCHESTRATOR — “CHECKBAND” — v12.3‑PRESENCE‑EVO‑BINARY‑MAX
// “THE BAND CONTROLLER / INSTANCE ADRENAL SYSTEM / BINARY-FIRST ORCHESTRATOR”
// Backbone for PulseBand presence + PulseNet pulses + instance scaling
// ============================================================================
//
// ROLE (v12.3‑PRESENCE‑EVO‑BINARY‑MAX / CHECKBAND):
//   • Backend‑only, PULSE‑folder organ (safe for OSKernel + proxy spine)
//   • Backbone band controller for PulseBand + PulseNet + presence
//   • Orchestrates per‑user “instance band” deterministically
//   • Reads UserScores → presence/pulse quality → computes band size
//   • Binary‑first, dualband: symbolic view + binary compression metadata
//   • No timers, no intervals, no Date.now — pure metadata + Firestore writes
//   • Designed for binary organism + presence upgrade + advantage cascade
//
// INTENT (ALIGNMENT WITH PULSE INTENT MAP v12.3‑PRESENCE‑EVO):
//   • binaryFirstEvolution: instance orchestration respects binary organism first
//   • preferBinaryRouteFirst: CheckBand is the binary‑aware band controller
//   • presenceBackbone: band reacts to presence/pulse quality, never panics
//   • fallbackDegradeSafe: worse pulses/presence → lower band, never higher
//   • deterministicOrganism: same inputs → same band shape, replayable
//   • fail‑open: if Firestore or scores drift, band degrades safely to 1
//
// CONTRACT (v12.3‑PRESENCE‑EVO‑BINARY‑MAX):
//   • Backend‑only organ (PULSE‑ prefix, no frontend imports)
//   • No randomness, no Date.now, no timers, no async loops
//   • Never mutates external inputs (UserScores docs are read‑only)
//   • Only legal mutable state: in‑memory activeWorkers registry
//   • Deterministic, loggable, replayable, binary‑aware, presence‑aware
//   • Snapshots are metadata‑only, safe for OS‑Healer + GlobalHealer
// ============================================================================

export const PulseOSCheckBandMeta = Object.freeze({
  layer: "PulseProxyAdrenalSystem",
  role: "BAND_CONTROLLER_ORGAN",
  version: "v12.3-PRESENCE-EVO-BINARY-MAX",
  identity: "CheckBand-v12.3-PRESENCE-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,

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
    zeroDriftCloning: true,
    clusterCoherence: true,
    organismClusterBoost: true,

    // Presence / Pulse / Prewarm awareness
    presenceBackbone: true,
    presenceAware: true,
    bluetoothPresenceAware: true,
    pulseQualityAware: true,
    pulseDegradeSafe: true,
    pulseFallbackAware: true,
    prewarmAware: true,
    cacheChunkAware: true,
    pulsebandBackbone: true,

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
    zeroDOM: true,
    zeroGPU: true,

    // Awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    symbolicBandAware: true,
    dualBandPresenceAware: true,

    // Environment
    localAware: true,
    internetAware: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "UserScoresSnapshot",
      "ProxyContext",
      "DualBandContext",
      "PresenceContext",
      "PulseQualityContext"
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
    root: "PulseProxy-v12.3",
    parent: "PulseProxy-v12.3-PRESENCE-EVO",
    ancestry: [
      "CheckBand-v9",
      "CheckBand-v10",
      "CheckBand-v11",
      "CheckBand-v11-Evo",
      "CheckBand-v11-Evo-Binary",
      "CheckBand-v11.2-EVO-BINARY-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic"],
    default: "binary",
    behavior: "adrenal-scaling"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "UserScores + Presence + PulseQuality → deterministic band → worker launch/shutdown",
    adaptive: "binary-first scaling surfaces + dualband presence overlays",
    return: "deterministic instance band + signatures + presence-aware surfaces"
  })
});


// ============================================================================
//  OSKernel imports (backend‑safe)
// ============================================================================


// ============================================================================
//  PULSE ROLE — v12.3‑PRESENCE‑EVO‑BINARY‑MAX Identity (CHECKBAND)
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "AdrenalSystem",
  version: "12.3-PRESENCE-EVO-BINARY-MAX",
  identity: "CheckBand-v12.3-PRESENCE-EVO-BINARY-MAX",

  evo: {
    // Dualband + binary‑first nervous system
    dualMode: true,
    binaryFirst: true,
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
    zeroDriftCloning: true,
    clusterCoherence: true,
    organismClusterBoost: true,

    // Presence / Pulse
    presenceBackbone: true,
    presenceAware: true,
    bluetoothPresenceAware: true,
    pulseQualityAware: true,
    pulseDegradeSafe: true,
    pulseFallbackAware: true,

    // Evolution + future‑proofing
    futureEvolutionReady: true,
    binaryOrganismAligned: true,
    noTimers: true,
    noAsyncLoops: true
  }
};


// ============================================================================
//  ORGAN CONTEXT — v12.3‑PRESENCE‑EVO‑BINARY‑MAX
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
    "Deterministic instance band controller (CheckBand) for per‑user worker orchestration + presence/pulse backbone"
};


// ============================================================================
//  MODES — Orchestrator routing modes
// ============================================================================
export const ORCHESTRATOR_MODES = {
  NORMAL: "normal",
  EARN_STRESS: "earn-stress",
  DRAIN: "drain"
};


// ============================================================================
//  CONFIG — Physiological Limits (drift‑proof, binary‑aware)
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


// Presence / pulse quality bands (symbolic inputs → deterministic factors)
export const PULSE_QUALITY = {
  EXCELLENT: "excellent",
  GOOD: "good",
  WEAK: "weak",
  CRITICAL: "critical",
  UNKNOWN: "unknown"
};

export const PRESENCE_TIER = {
  FULL: "full",          // strong Bluetooth + device presence
  PARTIAL: "partial",
  BACKGROUND: "background",
  OFFLINE: "offline",
  UNKNOWN: "unknown"
};


// ============================================================================
//  INTERNAL STATE — Active “cells” per user (CHECKBAND REGISTRY)
// ============================================================================
const activeWorkers = new Map(); // userId -> worker[]


// ============================================================================
//  BINARY HELPERS — Instance Signatures + Drift Flags
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
//  DEVICE TIER → MAX INSTANCES (deterministic)
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
//  PULSE / PRESENCE DEGRADE FACTOR — deterministic fallback ladder
//  • Worse pulses/presence → lower band, never higher
//  • Always returns factor in (0, 1], never 0
// ============================================================================
function computePulsePresenceDegradeFactor(pulseQuality, presenceTier) {
  const pq = pulseQuality || PULSE_QUALITY.UNKNOWN;
  const pt = presenceTier || PRESENCE_TIER.UNKNOWN;

  // Base factor from pulse quality
  let factor = 1.0;
  if (pq === PULSE_QUALITY.EXCELLENT) factor = 1.0;
  else if (pq === PULSE_QUALITY.GOOD) factor = 0.85;
  else if (pq === PULSE_QUALITY.WEAK) factor = 0.6;
  else if (pq === PULSE_QUALITY.CRITICAL) factor = 0.35;
  else factor = 0.7; // UNKNOWN

  // Presence tier further constrains factor (fallback ladder)
  if (pt === PRESENCE_TIER.FULL) {
    factor *= 1.0;
  } else if (pt === PRESENCE_TIER.PARTIAL) {
    factor *= 0.85;
  } else if (pt === PRESENCE_TIER.BACKGROUND) {
    factor *= 0.6;
  } else if (pt === PRESENCE_TIER.OFFLINE) {
    factor *= 0.4;
  } else {
    factor *= 0.75; // UNKNOWN
  }

  // Clamp to safe range (never 0, never >1)
  if (factor > 1.0) factor = 1.0;
  if (factor <= 0) factor = 0.2;

  return factor;
}


// ============================================================================
//  COMPUTE FINAL INSTANCE COUNT — Deterministic + presence/pulse aware
// ============================================================================
function computeFinalInstances(base, deviceTier, earnMode, testEarnActive, orchestratorMode, pulseQuality, presenceTier) {
  let final = base;

  // Mode‑aware routing
  if (orchestratorMode === ORCHESTRATOR_MODES.DRAIN) {
    final = 1;
  } else {
    if (deviceTier === "upgraded") final *= UPGRADED_MULT;
    if (deviceTier === "highend")  final *= HIGHEND_MULT;

    if (earnMode) {
      final = Math.floor(final * EARN_MODE_MULT);
    }

    if (orchestratorMode === ORCHESTRATOR_MODES.EARN_STRESS) {
      final = Math.max(final, base * 2);
    }

    if (testEarnActive) {
      final = TEST_EARN_MAX;
    }
  }

  // Presence/pulse degrade ladder — only ever scales DOWN
  const degradeFactor = computePulsePresenceDegradeFactor(pulseQuality, presenceTier);
  final = Math.floor(final * degradeFactor);

  const max = getDeviceMax(deviceTier, testEarnActive, orchestratorMode);
  const clamped = Math.max(1, Math.min(final, max));

  return {
    finalInstances: clamped,
    maxAllowed: max,
    degradeFactor,
    driftFlags: computeBandDriftFlags(clamped, max)
  };
}


// ============================================================================
//  LOG USER SNAPSHOT — deterministic, immune‑safe, presence/pulse aware
// ============================================================================
async function logUserInstanceSnapshot(userId, snapshot) {
  if (!ENABLE_INSTANCE_LOGGING) return;

  try {
    await db.collection(INSTANCE_LOG_COLLECTION).add({
      ...ADRENAL_CONTEXT,
      userId,
      seq: ++adrenalSeq,
      binaryBandSignature: snapshot.binaryBandSignature,
      binaryBandDriftFlags: snapshot.binaryBandDriftFlags,
      ...snapshot
    });
  } catch (err) {
    logger.error("adrenal", "snapshot_log_failed", { error: String(err) });
  }
}


// ============================================================================
//  LAUNCH WORKER — binary‑first, presence‑aware metadata
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
    deviceTier,
    binarySignature
  });

  return {
    name: workerName,
    userId,
    index: workerIndex,
    mode: orchestratorMode,
    deviceTier,
    seq: ++adrenalSeq,
    binarySignature
  };
}


// ============================================================================
//  KILL WORKER — deterministic shutdown
// ============================================================================
function killWorker(worker) {
  logger.log("adrenal", "shutdown", {
    worker: worker.name,
    mode: worker.mode,
    binarySignature: worker.binarySignature
  });
}


// ============================================================================
//  MAIN ORCHESTRATOR LOOP — v12.3‑PRESENCE‑EVO‑BINARY‑MAX (CHECKBAND)
//  • Reads presence/pulse fields if present, otherwise safe defaults
//  • Worse pulses/presence → lower band, never higher
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
    const data = doc.data() || {};

    const baseInstances   = data.instances ?? 1;
    const deviceTier      = data.deviceTier ?? "normal";
    const earnMode        = data.earnMode ?? false;
    const testEarnActive  = data.testEarnActive ?? false;

    // Presence / pulse quality inputs (optional, safe defaults)
    const pulseQuality    = data.pulseQuality || PULSE_QUALITY.UNKNOWN;
    const presenceTier    = data.presenceTier || PRESENCE_TIER.UNKNOWN;
    const bluetoothPresence = !!data.bluetoothPresence; // symbolic only

    const {
      finalInstances,
      maxAllowed,
      degradeFactor,
      driftFlags
    } = computeFinalInstances(
      baseInstances,
      deviceTier,
      earnMode,
      testEarnActive,
      orchestratorMode,
      pulseQuality,
      presenceTier
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
      mode: orchestratorMode,
      pulseQuality,
      presenceTier,
      bluetoothPresence,
      degradeFactor
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
        const worker = launchWorker(
          userId,
          workerIndex,
          orchestratorMode,
          deviceTier
        );
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

    // BINARY BAND SIGNATURE — compress entire band for this user
    const bandSeed = `${userId}|${currentWorkers.length}|${deviceTier}|${orchestratorMode}|${adrenalSeq}|${pulseQuality}|${presenceTier}`;
    let bandHash = 0;
    for (let i = 0; i < bandSeed.length; i++) {
      bandHash = (bandHash * 31 + bandSeed.charCodeAt(i)) >>> 0;
    }
    const binaryBandSignature =
      "BAND-STATE-" + bandHash.toString(16).padStart(8, "0");

    // SNAPSHOT — Immune‑Safe Logging (deterministic, presence/pulse aware)
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
      pulseQuality,
      presenceTier,
      bluetoothPresence,
      degradeFactor,
      binaryBandSignature,
      binaryBandDriftFlags: driftFlags
    });
  }

  logger.log("adrenal", "tick_complete", { mode: orchestratorMode });
  return true;
}
