// ============================================================================
// FILE: /apps/netlify/functions/pulseHistoryRepair.js
// PULSE HISTORY REPAIR — VERSION 6.3
// “THE SHORT‑TERM MEMORY LAYER / WORKING MEMORY REPAIR ENGINE”
// ============================================================================
//
// PAGE INDEX (v6.3 Source of Truth)
// ---------------------------------
// ROLE:
//   pulseHistoryRepair is the **SHORT‑TERM MEMORY LAYER** of the Pulse OS.
//   It is the **WORKING MEMORY REPAIR ENGINE** — responsible for keeping
//   recent history coherent, normalized, and free of drift.
//
//   • Repairs missing or malformed fields in recent history
//   • Prunes dead or expired entries older than 30 days
//   • Ensures deterministic lineage for scoring + insights
//   • Runs automatically via heartbeat (timer.js)
//
// WHAT THIS FILE *IS*:
//   • A deterministic short‑term memory repair engine
//   • A cleanup + normalization layer for active history
//   • A stability mechanism for scoring + insights
//
// WHAT THIS FILE *IS NOT*:
//   • NOT long‑term memory (that’s index.js)
//   • NOT personality (SettingsMemory)
//   • NOT identity (CheckIdentity)
//   • NOT sanity cleanup (pulsebandCleanup)
//
// SAFETY CONTRACT (v6.3):
//   • Fail‑open: errors logged, not fatal
//   • No randomness in repair logic
//   • No mutation outside intended collections
//   • Always logs repairs + deletions for traceability
//   • No cross‑subsystem writes
//
// STRUCTURE RULES:
//   • Repair → Normalize → Prune → Log
//   • No new fields added without architectural approval
//   • No reclassification logic inside this file
//
// VERSION TAG:
//   version: 6.3
//
// ============================================================================
// ⭐ v6.3 COMMENT LOG
// ---------------------------------------------------------------------------
// • Added full v6.3 PAGE INDEX
// • Added metaphor layer (SHORT‑TERM MEMORY / WORKING MEMORY REPAIR ENGINE)
// • Added safety contract + structure rules
// • Added v6.3 context map
// • No logic changes
// • No renames
// • No behavior drift
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ------------------------------------------------------------
// ⭐ HUMAN‑READABLE CONTEXT MAP (v6.3)
// ------------------------------------------------------------
const REPAIR_CONTEXT = {
  label: "PULSE_HISTORY_REPAIR",
  layer: "D‑Layer",
  role: "Short‑Term Memory Repair",
  purpose: "Pulse History Normalization + Cleanup",
  context: "Repairs missing fields, prunes dead entries, ensures deterministic lineage",
  version: "6.3"
};

// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT)
// ============================================================================
export async function pulseHistoryRepair() {
  const runId = `PB_REPAIR_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  console.log(
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
        // ⭐ DELETE: very old + dead
        // ---------------------------------------------------------
        if (createdAt && createdAt < cutoff30d && data.status === "dead") {
          await h.ref.delete();
          deletedDocs.push(id);

          console.log(
            `%c🟨 FORGOT (expired) → ${id}`,
            "color:#FFC107; font-weight:bold;"
          );

          continue;
        }

        const updates = {};

        // ---------------------------------------------------------
        // ⭐ NORMALIZE MISSING FIELDS
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

        if (Object.keys(updates).length > 0) {
          updates.repairedAt = admin.firestore.FieldValue.serverTimestamp();
          updates.repairRunId = runId;

          await h.ref.set(updates, { merge: true });
          repairedDocs.push(id);

          console.log(
            `%c🟩 REPAIRED MEMORY → ${id}`,
            "color:#4CAF50; font-weight:bold;"
          );
        }

      } catch (err) {
        console.error(
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

    console.log(
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
    console.error(
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
