// ============================================================================
//  GLOBAL HEALER v6.3
//  C‑LAYER (TOP‑LEVEL IMMUNE SYSTEM)
//  Deterministic, Drift‑Aware, OS‑Level Healing Coordinator
//  PURE HEALING. NO AI. NO COMPUTE. NO MARKETPLACE.
// ============================================================================
//
// WHAT THIS FILE IS:
//  -------------------
//  • The top-level immune system of Tropic Pulse.
//  • The global healer that watches all subsystem healers.
//  • The cross‑OS drift detector.
//  • The contradiction detector.
//  • The global FUNCTION_LOG hint emitter.
//  • The GlobalHealerLogs emitter.
//  • The commander of the OS healing layer.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a scheduler.
//  • NOT a runtime.
//  • NOT a marketplace adapter.
//  • NOT a blockchain client.
//  • NOT a wallet.
//  • NOT a place for user-provided logic.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No eval().
//  • No dynamic imports.
//  • No arbitrary code execution.
//  • No compute.
//  • No GPU work.
//  • No marketplace calls.
//  • Deterministic, drift-proof global healing only.
//
// ============================================================================
//  OS‑v6 CONTEXT MAP
// ============================================================================
const GLOBAL_HEALER_CONTEXT = {
  layer: "C‑Layer",
  role: "GLOBAL_HEALER",
  purpose: "Cross‑OS drift detection + global healing coordination",
  context: "Watches OSHealerLogs + SubsystemHealerLogs and emits FUNCTION_LOG hints",
  version: 6.3
};

console.log(
  "%c🟦 GlobalHealer v6.3 online — Top‑Level Immune System Activated.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  COLLECTIONS
// ============================================================================
export const OS_HEALER_LOGS_COLLECTION = "OSHealerLogs";
export const SUBSYSTEM_HEALER_COLLECTION = "SubsystemHealerLogs";
export const GLOBAL_HEALER_LOGS_COLLECTION = "GlobalHealerLogs";
export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";

export const OS_HEALER_SCAN_INTERVAL_MS = 60_000;
export const SUBSYSTEM_SCAN_INTERVAL_MS = 60_000;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { recordDriftSignature } from "./PulseOSMemory.js";

const db = getFirestore();

/* ============================================================================
   LOGGING HELPERS
   ============================================================================ */

// ------------------------------------------------------------
// writeGlobalHealerLog() — GlobalHealerLogs emitter
// ------------------------------------------------------------
async function writeGlobalHealerLog(entry) {
  try {
    await db.collection(GLOBAL_HEALER_LOGS_COLLECTION).add({
      ts: Date.now(),
      ...GLOBAL_HEALER_CONTEXT,
      ...entry
    });

    console.log(
      `%c🟩 GLOBAL_HEALER LOG → ${entry.type}`,
      "color:#4CAF50; font-weight:bold;"
    );

  } catch (err) {
    console.error(
      `%c🟥 GLOBAL_HEALER LOG ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

// ------------------------------------------------------------
// emitFunctionLogHint() — FUNCTION_LOGS emitter
// ------------------------------------------------------------
async function emitFunctionLogHint(entry) {
  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...GLOBAL_HEALER_CONTEXT,
      ...entry,
      createdAt: Timestamp.now(),
      processed: false,
      subsystem: entry.subsystem ?? "unknown",
      severity: entry.severity ?? "info",
      hintCode: entry.hintCode ?? "UNSPECIFIED_HINT"
    });

    console.log(
      `%c🟦 GLOBAL HINT EMITTED → ${entry.hintCode}`,
      "color:#03A9F4; font-weight:bold;"
    );

  } catch (err) {
    console.error(
      `%c🟥 GLOBAL HINT EMIT ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

/* ============================================================================
   OS HEALER LOG SCAN — watches OSHealerLogs
   ============================================================================ */

async function scanOSHealerLogsForGlobalHints() {
  console.log(
    "%c🟪 Scanning OSHealerLogs…",
    "color:#9C27B0; font-weight:bold;"
  );

  const snap = await db
    .collection(OS_HEALER_LOGS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(100)
    .get();

  if (snap.empty) {
    console.log("[GlobalHealer] No OSHealerLogs found.");
    return;
  }

  for (const doc of snap.docs) {
    const log = doc.data();

    console.log(
      `%c🟨 OS_HEALER EVENT → ${log.type}`,
      "color:#FFC107; font-weight:bold;"
    );

    if (log.type === "function_log_seen") {
      await writeGlobalHealerLog({
        source: "OSHealerLogs",
        eventId: doc.id,
        type: "function_log_seen_global",
        subsystem: log.subsystem ?? null,
        fileName: log.fileName ?? null,
        functionName: log.functionName ?? null,
        note: log.note ?? null
      });
    }
  }
}

/* ============================================================================
   SUBSYSTEM HEALER LOG SCAN — watches SubsystemHealerLogs
   ============================================================================ */

async function scanSubsystemHealerLogsForGlobalHints() {
  console.log(
    "%c🟪 Scanning SubsystemHealerLogs…",
    "color:#9C27B0; font-weight:bold;"
  );

  const snap = await db
    .collection(SUBSYSTEM_HEALER_COLLECTION)
    .orderBy("ts", "desc")
    .limit(100)
    .get();

  if (snap.empty) {
    console.log("[GlobalHealer] No SubsystemHealerLogs found.");
    return;
  }

  for (const doc of snap.docs) {
    const log = doc.data();
    const subsystem = log.subsystem ?? "unknown";
    const type = log.type ?? "unknown";

    console.log(
      `%c🟨 SUBSYSTEM DRIFT → ${subsystem} / ${type}`,
      "color:#FFC107; font-weight:bold;"
    );

    // ------------------------------------------------------
    // PulseBand → latency/bar mismatch
    // ------------------------------------------------------
    if (subsystem === "PulseBand" && type === "latency_bar_mismatch") {
      await writeGlobalHealerLog({
        source: "PulseBand",
        eventId: doc.id,
        type: "global_latency_bar_mismatch",
        latency: log.latency,
        bars: log.bars
      });

      await recordDriftSignature("PulseBand", {
        type: "latency_bar_mismatch",
        severity: "warning",
        details: { latency: log.latency, bars: log.bars }
      });

      await emitFunctionLogHint({
        hintCode: "PB_LATENCY_BAR_MISMATCH",
        subsystem: "PulseBand",
        fileName: "PulseBand.js",
        functionName: "setStatus",
        fieldName: "latencyClass",
        note: "Latency and bar count mismatch; review thresholds."
      });
    }

    // ------------------------------------------------------
    // PulseNet → unstable signal slope
    // ------------------------------------------------------
    if (subsystem === "PulseNet" && type === "unstable_signal_slope") {
      await writeGlobalHealerLog({
        source: "PulseNet",
        eventId: doc.id,
        type: "global_unstable_signal_slope",
        slope: log.slope,
        score: log.score
      });

      await recordDriftSignature("PulseNet", {
        type: "unstable_signal_slope",
        severity: "warning",
        details: { slope: log.slope, score: log.score }
      });

      await emitFunctionLogHint({
        hintCode: "PN_UNSTABLE_SIGNAL_SLOPE",
        subsystem: "PulseNet",
        fileName: "PulseNet.js",
        functionName: "updateSignalFromPulseBand",
        fieldName: "signalSlope",
        note: "Unstable signal slope; consider smoothing window."
      });
    }

    // ------------------------------------------------------
    // PulseClient → fallback spike
    // ------------------------------------------------------
    if (subsystem === "PulseClient" && type === "fallback_spike") {
      await writeGlobalHealerLog({
        source: "PulseClient",
        eventId: doc.id,
        type: "global_fallback_spike",
        count: log.count
      });

      await recordDriftSignature("PulseClient", {
        type: "fallback_spike",
        severity: "warning",
        details: { count: log.count }
      });

      await emitFunctionLogHint({
        hintCode: "PC_FALLBACK_SPIKE",
        subsystem: "PulseClient",
        fileName: "PulseClient.js",
        functionName: "pulseFetch",
        fieldName: "route",
        note: "Frequent fallback to phone route; review proxy timeouts."
      });
    }

    // ------------------------------------------------------
    // Proxy → instance out-of-bounds
    // ------------------------------------------------------
    if (subsystem === "Proxy" && type === "instance_out_of_bounds") {
      await writeGlobalHealerLog({
        source: "Proxy",
        eventId: doc.id,
        type: "global_instance_out_of_bounds",
        userId: log.userId,
        instances: log.instances
      });

      await recordDriftSignature("Proxy", {
        type: "instance_out_of_bounds",
        severity: "critical",
        details: { userId: log.userId, instances: log.instances }
      });

      await emitFunctionLogHint({
        hintCode: "PX_INSTANCE_OUT_OF_BOUNDS",
        subsystem: "Proxy",
        fileName: "PulseUserScoring.js",
        functionName: "allocateInstances",
        fieldName: "instances",
        note: "Instance count outside sane bounds; review global scaling law."
      });
    }
  }
}

/* ============================================================================
   PUBLIC: startGlobalHealer()
   ============================================================================ */

export default function startGlobalHealer() {
  console.log(
    "%c🟦 GlobalHealer v6.3 started — Global immune system active.",
    "color:#03A9F4; font-weight:bold;"
  );

  setInterval(() => {
    scanOSHealerLogsForGlobalHints().catch((err) => {
      console.error(
        "%c🟥 OSHealerLogs scan error",
        "color:#FF5252; font-weight:bold;",
        err
      );
    });
  }, OS_HEALER_SCAN_INTERVAL_MS);

  setInterval(() => {
    scanSubsystemHealerLogsForGlobalHints().catch((err) => {
      console.error(
        "%c🟥 SubsystemHealerLogs scan error",
        "color:#FF5252; font-weight:bold;",
        err
      );
    });
  }, SUBSYSTEM_SCAN_INTERVAL_MS);
}

export {
  writeGlobalHealerLog,
  emitFunctionLogHint,
  scanOSHealerLogsForGlobalHints,
  scanSubsystemHealerLogsForGlobalHints
};
