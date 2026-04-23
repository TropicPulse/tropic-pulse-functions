// ============================================================================
// FILE: /apps/pulse-proxy/pulseHistoryRepair.js
// PULSE HISTORY REPAIR — VERSION 11.0
// “THE SHORT‑TERM MEMORY LAYER++ / WORKING MEMORY REPAIR ENGINE++”
// ============================================================================
//
// ROLE (v11.0):
//   pulseHistoryRepair is the SHORT‑TERM MEMORY LAYER of PulseProxy.
//   It is the WORKING MEMORY REPAIR ENGINE — responsible for keeping
//   recent history coherent, normalized, lineage‑safe, and drift‑safe.
//
// SAFETY CONTRACT (v11.0):
//   • Fail‑open: errors logged, never fatal
//   • No randomness in repair logic
//   • No mutation outside intended collections
//   • Always logs repairs + deletions for traceability
//   • No cross‑subsystem writes
//   • Deterministic cleanup + repair order
//   • Bounded scans for multi‑instance safety
//   • No IQ, no routing, no OS imports
// ============================================================================

// import * as admin from "firebase-admin";
// import { getFirestore } from "firebase-admin/firestore";

// if (!admin.apps.length) {
//   admin.initializeApp();
// }
// const db = getFirestore();

// ============================================================================
// ORGAN IDENTITY — v11.0
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "ShortTermMemory",
  version: "11.0",
  identity: "PulseHistoryRepair",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    memoryRepairEngine: true,
    lineageSafe: true,
    futureEvolutionReady: true,
    boundedScan: true,
    timerSafe: true
  }
};

// ------------------------------------------------------------
// HUMAN‑READABLE CONTEXT MAP (v11.0)
// ------------------------------------------------------------
const REPAIR_CONTEXT = {
  label: "PULSE_HISTORY_REPAIR",
  layer: PulseRole.layer,
  role: "Short‑Term Memory Repair",
  purpose: "Pulse History Normalization + Cleanup",
  context: "Repairs missing fields, prunes dead entries, ensures deterministic lineage",
  version: PulseRole.version,
  evo: PulseRole.evo
};

const MAX_BATCH = 500;

// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT / OSKernel)
// ============================================================================
export async function pulseHistoryRepair() {
  const runId = `PB_REPAIR_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  log(
    `%c🧠 START SHORT‑TERM MEMORY REPAIR → ${runId}`,
    "color:#03A9F4; font-weight:bold;"
  );

  const repairedDocs = [];
  const deletedDocs = [];

  try {
    const cutoff30d = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let lastDoc = null;

    // ---------------------------------------------------------
    // ⭐ BOUNDED SCAN: pulse_history (v11.0)
    // ---------------------------------------------------------
    while (true) {
      let query = db
        .collection("pulse_history")
        .orderBy("createdAt", "asc")
        .limit(MAX_BATCH);

      if (lastDoc) query = query.startAfter(lastDoc);

      const histSnap = await query.get();
      if (histSnap.empty) break;

      for (const h of histSnap.docs) {
        const id = h.id;

        try {
          const data = h.data() || {};
          const createdAt = data.createdAt?.toMillis?.() || 0;

          // ---------------------------------------------------------
          // ⭐ DELETE: expired + dead entries
          // ---------------------------------------------------------
          if (createdAt && createdAt < cutoff30d && data.status === "dead") {
            await h.ref.delete();
            deletedDocs.push(id);

            log(
              `%c🟨 PRUNED (expired memory) → ${id}`,
              "color:#FFC107; font-weight:bold;"
            );

            continue;
          }

          const updates = {};

          // ---------------------------------------------------------
          // ⭐ NORMALIZE MISSING FIELDS (v11.0 deterministic repair)
          // ---------------------------------------------------------

          if (!data.userId && data.uid) {
            updates.userId = data.uid;
          }

          if (!data.status) {
            updates.status = "unknown";
          }

          if (!data.source) {
            updates.source = "legacy";
          }

          if (!data.lineage || typeof data.lineage !== "object") {
            updates.lineage = {
              version: "11.0",
              repairedBy: "pulseHistoryRepair",
              repairRunId: runId
            };
          }

          if (!data.timestamp) {
            updates.timestamp = admin.firestore.FieldValue.serverTimestamp();
          }

          if (!data.drift) {
            updates.drift = { repaired: true, version: "11.0" };
          }

          if (Object.keys(updates).length > 0) {
            updates.repairedAt = admin.firestore.FieldValue.serverTimestamp();
            updates.repairRunId = runId;

            await h.ref.set(updates, { merge: true });
            repairedDocs.push(id);

            log(
              `%c🟩 REPAIRED MEMORY → ${id}`,
              "color:#4CAF50; font-weight:bold;"
            );
          }

        } catch (err) {
          error(
            `%c🟥 MEMORY ERROR (doc) → ${id}`,
            "color:#FF5252; font-weight:bold;",
            err
          );

          await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${id}`).set({
            fn: "pulseHistoryRepair",
            stage: "history_doc",
            docId: id,
            error: String(err),
            runId,
            ...REPAIR_CONTEXT,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

      lastDoc = histSnap.docs[histSnap.docs.length - 1];
      if (histSnap.size < MAX_BATCH) break;
    }

    // ---------------------------------------------------------
    // ⭐ TIMER LOG
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(runId).set({
      fn: "pulseHistoryRepair",
      runId,
      repairedCount: repairedDocs.length,
      deletedCount: deletedDocs.length,
      repairedDocs,
      deletedDocs,
      ...REPAIR_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    log(
      `%c🟩 SHORT‑TERM MEMORY REPAIR COMPLETE → ${runId}`,
      "color:#4CAF50; font-weight:bold;"
    );

    return {
      ok: true,
      runId,
      repairedDocs,
      deletedDocs,
      ...REPAIR_CONTEXT
    };

  } catch (err) {
    error(
      `%c🟥 FATAL SHORT‑TERM MEMORY ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );

    await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}FATAL`).set({
      fn: "pulseHistoryRepair",
      stage: "fatal",
      error: String(err),
      runId,
      ...REPAIR_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ok: false, runId, error: String(err), ...REPAIR_CONTEXT };
  }
}
