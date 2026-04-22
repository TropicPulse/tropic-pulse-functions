// ============================================================================
// FILE: /apps/netlify/functions/pulseHistoryRepair.js
// PULSE HISTORY REPAIR — VERSION 9.3
// “THE SHORT‑TERM MEMORY LAYER++ / WORKING MEMORY REPAIR ENGINE++”
// ============================================================================
//
// ROLE (v9.3):
//   pulseHistoryRepair is the **SHORT‑TERM MEMORY LAYER** of PulseOS.
//   It is the **WORKING MEMORY REPAIR ENGINE++** — the organ responsible for
//   keeping recent history coherent, normalized, lineage‑safe, and evolution‑safe.
//
//   • Repairs missing or malformed fields in recent history
//   • Prunes expired or dead entries older than 30 days
//   • Ensures deterministic lineage for scoring + insights
//   • Runs automatically via heartbeat (Heart.js / OSKernel)
//   • Fully aligned with PulseOS v9.3 evolutionary memory contracts
//
// SAFETY CONTRACT (v9.3):
//   • Fail‑open: errors logged, never fatal
//   • No randomness in repair logic
//   • No mutation outside intended collections
//   • Always logs repairs + deletions for traceability
//   • No cross‑subsystem writes
//   • Deterministic cleanup + repair order
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ------------------------------------------------------------
// HUMAN‑READABLE CONTEXT MAP (v9.3)
// ------------------------------------------------------------
const REPAIR_CONTEXT = {
  label: "PULSE_HISTORY_REPAIR",
  layer: "D‑Layer",
  role: "Short‑Term Memory Repair",
  purpose: "Pulse History Normalization + Cleanup",
  context: "Repairs missing fields, prunes dead entries, ensures deterministic lineage",
  version: "9.3"
};

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

    // ---------------------------------------------------------
    // ⭐ REPAIR: pulse_history (normalize + prune)
// ---------------------------------------------------------
    const histSnap = await db.collection("pulse_history").get();

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
        // ⭐ NORMALIZE MISSING FIELDS (v9.3 evolutionary repair)
// ---------------------------------------------------------

        // v9.3 identity unification
        if (!data.userId && data.uid) {
          updates.userId = data.uid;
        }

        // v9.3 status contract
        if (!data.status) {
          updates.status = "unknown";
        }

        // v9.3 source contract
        if (!data.source) {
          updates.source = "legacy";
        }

        // v9.3 lineage contract
        if (!data.lineage || typeof data.lineage !== "object") {
          updates.lineage = {
            version: "9.3",
            repairedBy: "pulseHistoryRepair",
            repairRunId: runId
          };
        }

        // v9.3 timestamp contract
        if (!data.timestamp) {
          updates.timestamp = admin.firestore.FieldValue.serverTimestamp();
        }

        // v9.3 drift markers
        if (!data.drift) {
          updates.drift = { repaired: true, version: "9.3" };
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
