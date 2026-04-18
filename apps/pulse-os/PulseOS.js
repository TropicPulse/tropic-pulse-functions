// ======================================================
//  PULSE OS v3.2 — THE THYMUS
//  Immune Command Organ • Integrity Sentinel • Root Healing Authority
//  PURE HEALING. NO AI. NO COMPUTE. NO MARKETPLACE.
// ======================================================
//
// IDENTITY — THE THYMUS:
//  ----------------------
//  • The root immune organ of the Pulse ecosystem.
//  • Trains the healing system by ingesting FUNCTION_LOGS.
//  • Defines “self” vs “drift” through signature recording.
//  • Maintains the OS heartbeat (vital signs).
//  • Generates restore points (immune memory).
//  • Supervises every subsystem from above.
//  • The first organ to activate, the last to shut down.
//
// ROLE IN THE DIGITAL BODY:
//  --------------------------
//  • Sensory Archive → Perception
//  • Analyst → Intelligence
//  • Momentum Network → Forward Motion
//  • Motor Hall → Execution
//  • Guardian → Permission Gate
//  • Lymph Node Network → Immune Filter
//  • Wisdom Cortex → Insight
//  • Brainstem → Command
//  • Evolution Core → Identity + Adaptation
//  • **Thymus → Immune Command + Integrity Sentinel**
//
// WHAT THIS FILE IS:
//  -------------------
//  • The OS kernel of Tropic Pulse.
//  • The global supervisor for all subsystems.
//  • The FUNCTION_LOG ingestion engine.
//  • The drift signature recorder.
//  • The snapshot + restore-point generator.
//  • The OS heartbeat + health reporter.
//  • The root of all healing.
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
//  • Deterministic, drift-proof OS behavior only.
//
// ======================================================
//  CONFIG — Thymus Constants
// ======================================================

export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";
export const OS_HEALTH_COLLECTION = "OSHealth";
export const OS_EVENTS_COLLECTION = "OSEvents";

export const OS_HEARTBEAT_INTERVAL_MS = 30_000;
export const FUNCTION_LOG_SCAN_INTERVAL_MS = 60_000;

export const PULSE_OS_ID = "PulseOS-v3.2";
export const PULSE_OS_ROLE = "immune_command_organ";

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  saveSnapshot,
  recordDriftSignature,
  createRestorePoint
} from "./PulseOSMemory.js";

const db = getFirestore();

console.log("[Thymus BOOT] PulseOS v3.2 immune kernel online.");
console.log("[Thymus BOOT] Heartbeat interval:", OS_HEARTBEAT_INTERVAL_MS, "ms");
console.log("[Thymus BOOT] FUNCTION_LOG scan interval:", FUNCTION_LOG_SCAN_INTERVAL_MS, "ms");

// ======================================================
//  writeOSEvent() — Immune Signal Emitter
// ======================================================
async function writeOSEvent(entry) {
  try {
    console.log(
      `[Thymus] ImmuneSignal | type=${entry.type} | hintCode=${entry.hintCode ?? "UNSPECIFIED_HINT"}`
    );

    await db.collection(OS_EVENTS_COLLECTION).add({
      osId: PULSE_OS_ID,
      role: PULSE_OS_ROLE,
      ts: Date.now(),
      hintCode: entry.hintCode ?? "UNSPECIFIED_HINT",
      ...entry
    });
  } catch (err) {
    console.error("[Thymus] Failed to emit immune signal:", err);
  }
}

// ======================================================
//  updateOSHealth() — Vital Signs + Immune Snapshot
// ======================================================
async function updateOSHealth(extra = {}) {
  try {
    const now = Timestamp.now();

    console.log("[Thymus] Heartbeat emitted.");

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
    console.error("[Thymus] Failed to update vital signs:", err);
  }
}

// ======================================================
//  processFunctionLogs() — Immune Training + Drift Detection
// ======================================================
async function processFunctionLogs() {
  console.log("[Thymus] Scanning FUNCTION_LOGS…");

  const snap = await db
    .collection(FUNCTION_LOGS_COLLECTION)
    .where("processed", "==", false)
    .limit(100)
    .get();

  if (snap.empty) {
    console.log("[Thymus] No new immune stimuli.");
    return;
  }

  console.log(`[Thymus] Ingesting ${snap.size} FUNCTION_LOGS…`);

  const batch = db.batch();

  for (const doc of snap.docs) {
    const log = doc.data();

    console.log(
      `[Thymus] Ingest | id=${doc.id} | subsystem=${log.subsystem ?? "unknown"} | severity=${log.severity ?? "info"}`
    );

    // Emit immune signal
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

    // Drift detection → immune response
    if (log.severity === "error" || log.severity === "critical") {
      console.warn(
        `[Thymus] Drift signature recorded | subsystem=${log.subsystem ?? "unknown"}`
      );

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

  console.log("[Thymus] FUNCTION_LOG ingestion complete.");

  // Immune memory rule
  if (snap.size >= 50) {
    console.warn("[Thymus] Large immune stimulus — creating restore point.");
    await createRestorePoint("auto_after_large_ingest", ["OS"]);
  }
}

// ======================================================
//  PUBLIC: startPulseOS() — Activate Immune Organ
// ======================================================
export default function startPulseOS() {
  console.log("[Thymus] Starting immune supervisor loops…");

  // Heartbeat loop
  setInterval(() => {
    updateOSHealth().catch((err) => {
      console.error("[Thymus] Heartbeat loop error:", err);
    });
  }, OS_HEARTBEAT_INTERVAL_MS);

  // FUNCTION_LOG ingestion loop
  setInterval(() => {
    processFunctionLogs().catch((err) => {
      console.error("[Thymus] FUNCTION_LOGS loop error:", err);
    });
  }, FUNCTION_LOG_SCAN_INTERVAL_MS);

  console.log("[Thymus] v3.2 immune kernel active.");
}

export { updateOSHealth, processFunctionLogs, writeOSEvent };
