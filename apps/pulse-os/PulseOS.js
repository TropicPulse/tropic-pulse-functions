// FILE: pulse-os/PulseOS.js
//
// PulseOS v3 — Supervisor + Memory Integration + Restore Points
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE HEALING COORDINATION.
//
// ------------------------------------------------------
// ROLE:
//   • OS heartbeat
//   • FUNCTION_LOG ingestion
//   • Emit OSEvents
//   • Save snapshots (PulseOSMemory)
//   • Create restore points on major changes
//   • Record drift signatures
//
// SAFETY:
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO compute / GPU / marketplace / AI
// ------------------------------------------------------

// ------------------------------------------------------
// CONFIG
// ------------------------------------------------------
// FILE: pulse-os/PulseOS.js
//
// PulseOS v3.1 — Supervisor + Memory Integration + hintCode parity
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE HEALING COORDINATION.
//

export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";
export const OS_HEALTH_COLLECTION = "OSHealth";
export const OS_EVENTS_COLLECTION = "OSEvents";

export const OS_HEARTBEAT_INTERVAL_MS = 30_000;
export const FUNCTION_LOG_SCAN_INTERVAL_MS = 60_000;

export const PULSE_OS_ID = "PulseOS-v3.1";
export const PULSE_OS_ROLE = "global_supervisor";

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  saveSnapshot,
  recordDriftSignature,
  createRestorePoint
} from "./PulseOSMemory.js";

const db = getFirestore();

// ------------------------------------------------------
// writeOSEvent() — now supports hintCode
// ------------------------------------------------------
async function writeOSEvent(entry) {
  try {
    await db.collection(OS_EVENTS_COLLECTION).add({
      osId: PULSE_OS_ID,
      role: PULSE_OS_ROLE,
      ts: Date.now(),
      hintCode: entry.hintCode ?? "UNSPECIFIED_HINT",
      ...entry
    });
  } catch (err) {
    console.error("[PulseOS] Failed to write OS event:", err);
  }
}

// ------------------------------------------------------
// updateOSHealth() — heartbeat + snapshot
// ------------------------------------------------------
async function updateOSHealth(extra = {}) {
  try {
    const now = Timestamp.now();

    await db.collection(OS_HEALTH_COLLECTION).doc(PULSE_OS_ID).set(
      {
        osId: PULSE_OS_ID,
        role: PULSE_OS_ROLE,
        heartbeatAt: now,
        ...extra
      },
      { merge: true }
    );

    await saveSnapshot("OS", {
      heartbeatAt: now.toMillis(),
      role: PULSE_OS_ROLE,
      ...extra
    });

  } catch (err) {
    console.error("[PulseOS] Failed to update OS health:", err);
  }
}

// ------------------------------------------------------
// processFunctionLogs() — now emits hintCode + drift parity
// ------------------------------------------------------
async function processFunctionLogs() {
  const snap = await db
    .collection(FUNCTION_LOGS_COLLECTION)
    .where("processed", "==", false)
    .limit(100)
    .get();

  if (snap.empty) return;

  const batch = db.batch();

  for (const doc of snap.docs) {
    const log = doc.data();

    // Emit OS-level event with hintCode
    await writeOSEvent({
      type: "function_log_ingested",
      hintCode: log.hintCode ?? "FUNCTION_LOG_INGESTED",
      functionLogId: doc.id,
      subsystem: log.subsystem ?? null,
      fileName: log.fileName ?? null,
      functionName: log.functionName ?? null,
      fieldName: log.fieldName ?? null,
      note: log.note ?? null,
      severity: log.severity ?? "info"
    });

    // Save subsystem snapshot
    if (log.subsystem) {
      await saveSnapshot(log.subsystem, {
        fileName: log.fileName,
        functionName: log.functionName,
        fieldName: log.fieldName,
        note: log.note,
        severity: log.severity
      });
    }

    // Drift signature parity with healers
    if (log.severity === "error" || log.severity === "critical") {
      await recordDriftSignature(log.subsystem ?? "unknown", {
        type: "function_error",
        severity: log.severity,
        details: {
          fileName: log.fileName,
          functionName: log.functionName,
          fieldName: log.fieldName,
          note: log.note
        }
      });
    }

    batch.update(doc.ref, {
      processed: true,
      processedAt: Timestamp.now()
    });
  }

  await batch.commit();

  // Existing restore rule stays untouched
  if (snap.size >= 50) {
    await createRestorePoint("auto_after_large_ingest", ["OS"]);
  }
}

// ------------------------------------------------------
// PUBLIC: startPulseOS()
// ------------------------------------------------------
export default function startPulseOS() {
  setInterval(() => {
    updateOSHealth().catch((err) => {
      console.error("[PulseOS] Heartbeat loop error:", err);
    });
  }, OS_HEARTBEAT_INTERVAL_MS);

  setInterval(() => {
    processFunctionLogs().catch((err) => {
      console.error("[PulseOS] FUNCTION_LOGS loop error:", err);
    });
  }, FUNCTION_LOG_SCAN_INTERVAL_MS);

  console.log("[PulseOS] v3.1 supervisor + memory parity started.");
}

export { updateOSHealth, processFunctionLogs, writeOSEvent };
