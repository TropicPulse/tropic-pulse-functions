// FILE: pulse-os/GlobalHealer.js
//
// GlobalHealer v6.1 — Minimal Upgrade: hintCode + drift signatures
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE HEALING COORDINATION.
//

export const OS_HEALER_LOGS_COLLECTION = "OSHealerLogs";
export const SUBSYSTEM_HEALER_COLLECTION = "SubsystemHealerLogs";
export const GLOBAL_HEALER_LOGS_COLLECTION = "GlobalHealerLogs";
export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";

export const OS_HEALER_SCAN_INTERVAL_MS = 60_000;
export const SUBSYSTEM_SCAN_INTERVAL_MS = 60_000;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { recordDriftSignature } from "./PulseOSMemory.js";

const db = getFirestore();

// ------------------------------------------------------
// writeGlobalHealerLog()
// ------------------------------------------------------
async function writeGlobalHealerLog(entry) {
  try {
    await db.collection(GLOBAL_HEALER_LOGS_COLLECTION).add({
      ts: Date.now(),
      ...entry
    });
  } catch (err) {
    console.error("[GlobalHealer] Failed to write GlobalHealer log:", err);
  }
}

// ------------------------------------------------------
// emitFunctionLogHint() — now includes hintCode
// ------------------------------------------------------
async function emitFunctionLogHint(entry) {
  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...entry,
      createdAt: Timestamp.now(),
      processed: false,
      subsystem: entry.subsystem ?? "unknown",
      severity: entry.severity ?? "info",
      hintCode: entry.hintCode ?? "UNSPECIFIED_HINT"
    });
  } catch (err) {
    console.error("[GlobalHealer] Failed to emit FUNCTION_LOG hint:", err);
  }
}

// ------------------------------------------------------
// scanOSHealerLogsForGlobalHints()
// ------------------------------------------------------
async function scanOSHealerLogsForGlobalHints() {
  const snap = await db
    .collection(OS_HEALER_LOGS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(100)
    .get();

  if (snap.empty) return;

  for (const doc of snap.docs) {
    const log = doc.data();

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

// ------------------------------------------------------
// scanSubsystemHealerLogsForGlobalHints()
// ------------------------------------------------------
async function scanSubsystemHealerLogsForGlobalHints() {
  const snap = await db
    .collection(SUBSYSTEM_HEALER_COLLECTION)
    .orderBy("ts", "desc")
    .limit(100)
    .get();

  if (snap.empty) return;

  for (const doc of snap.docs) {
    const log = doc.data();
    const subsystem = log.subsystem ?? "unknown";
    const type = log.type ?? "unknown";

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

      // NEW: drift signature
      await recordDriftSignature("PulseBand", {
        type: "latency_bar_mismatch",
        severity: "warning",
        details: { latency: log.latency, bars: log.bars }
      });

      // NEW: hintCode
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

// ------------------------------------------------------
// PUBLIC: startGlobalHealer()
// ------------------------------------------------------
export default function startGlobalHealer() {
  setInterval(() => {
    scanOSHealerLogsForGlobalHints().catch((err) => {
      console.error("[GlobalHealer] OSHealerLogs scan error:", err);
    });
  }, OS_HEALER_SCAN_INTERVAL_MS);

  setInterval(() => {
    scanSubsystemHealerLogsForGlobalHints().catch((err) => {
      console.error("[GlobalHealer] SubsystemHealerLogs scan error:", err);
    });
  }, SUBSYSTEM_SCAN_INTERVAL_MS);

  console.log("[GlobalHealer] v6.1 global healer started.");
}

export {
  writeGlobalHealerLog,
  emitFunctionLogHint,
  scanOSHealerLogsForGlobalHints,
  scanSubsystemHealerLogsForGlobalHints
};
