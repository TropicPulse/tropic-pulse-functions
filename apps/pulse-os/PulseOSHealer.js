// FILE: pulse-os/PulseOSHealer.js
//
// PulseOSHealer v6 — Deterministic OS-Level Drift & Misconfiguration Healer
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE HEALING COORDINATION.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseOSHealer watches OS-level + subsystem logs and emits
//   healing hints for the midnight compiler.
//
// RESPONSIBILITIES:
//   • Watch OSEvents (PulseOS → global events)
//   • Watch SubsystemHealerLogs (Proxy, Band, Net, Client)
//   • Detect cross-subsystem contradictions
//   • Emit FUNCTION_LOGS healing hints
//   • Emit OSHealerLogs for admin visibility
//
// SAFETY RULES:
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO compute execution
//   • NO GPU work
//   • NO marketplace calls
//   • NO AI model calls
//
// ------------------------------------------------------
// 🔧 CONFIGURABLE COLLECTIONS
// ------------------------------------------------------
// FILE: pulse-os/PulseOSHealer.js
//
// PulseOSHealer v6.1 — Minimal Upgrade: hintCode + drift signatures
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE HEALING COORDINATION.
//

export const OS_EVENTS_COLLECTION = "OSEvents";
export const SUBSYSTEM_HEALER_COLLECTION = "SubsystemHealerLogs";
export const OS_HEALER_LOGS_COLLECTION = "OSHealerLogs";
export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";

export const OS_EVENTS_SCAN_INTERVAL_MS = 45_000;
export const SUBSYSTEM_SCAN_INTERVAL_MS = 45_000;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { recordDriftSignature } from "./PulseOSMemory.js";

const db = getFirestore();

// ------------------------------------------------------
// writeOSHealerLog()
// ------------------------------------------------------
async function writeOSHealerLog(entry) {
  try {
    await db.collection(OS_HEALER_LOGS_COLLECTION).add({
      ts: Date.now(),
      ...entry
    });
  } catch (err) {
    console.error("[PulseOSHealer] Failed to write OSHealer log:", err);
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
    console.error("[PulseOSHealer] Failed to emit FUNCTION_LOG hint:", err);
  }
}

// ------------------------------------------------------
// scanOSEventsForHints()
// ------------------------------------------------------
async function scanOSEventsForHints() {
  const snap = await db
    .collection(OS_EVENTS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(100)
    .get();

  if (snap.empty) return;

  for (const doc of snap.docs) {
    const ev = doc.data();

    if (ev.type === "function_log_ingested") {
      await writeOSHealerLog({
        source: "OSEvents",
        eventId: doc.id,
        type: "function_log_seen",
        subsystem: ev.subsystem ?? null,
        fileName: ev.fileName ?? null,
        functionName: ev.functionName ?? null,
        note: ev.note ?? null
      });
    }
  }
}

// ------------------------------------------------------
// scanSubsystemHealerLogs()
// ------------------------------------------------------
async function scanSubsystemHealerLogs() {
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
      await writeOSHealerLog({
        source: "PulseBand",
        eventId: doc.id,
        type: "latency_bar_mismatch_seen",
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
      await writeOSHealerLog({
        source: "PulseNet",
        eventId: doc.id,
        type: "unstable_signal_slope_seen",
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
      await writeOSHealerLog({
        source: "PulseClient",
        eventId: doc.id,
        type: "fallback_spike_seen",
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
      await writeOSHealerLog({
        source: "Proxy",
        eventId: doc.id,
        type: "instance_out_of_bounds_seen",
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
        note: "Instance count outside sane bounds; review allocation formula."
      });
    }
  }
}

// ------------------------------------------------------
// PUBLIC: startPulseOSHealer()
// ------------------------------------------------------
export default function startPulseOSHealer() {
  setInterval(() => {
    scanOSEventsForHints().catch((err) => {
      console.error("[PulseOSHealer] OSEvents scan error:", err);
    });
  }, OS_EVENTS_SCAN_INTERVAL_MS);

  setInterval(() => {
    scanSubsystemHealerLogs().catch((err) => {
      console.error("[PulseOSHealer] Subsystem scan error:", err);
    });
  }, SUBSYSTEM_SCAN_INTERVAL_MS);

  console.log("[PulseOSHealer] v6.1 OS-level healer started.");
}

export {
  writeOSHealerLog,
  emitFunctionLogHint,
  scanOSEventsForHints,
  scanSubsystemHealerLogs
};
