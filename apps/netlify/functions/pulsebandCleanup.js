// ============================================================================
// FILE: /apps/netlify/functions/pulsebandCleanup.js
// PULSEBAND CLEANUP — VERSION 6.3
// “THE SANITY LAYER / PURIFIER / ORDER‑KEEPER”
// ============================================================================
//
// PAGE INDEX (v6.3 Source of Truth)
// ---------------------------------
// ROLE:
//   pulsebandCleanup is the **SANITY LAYER** of the PulseBand subsystem.
//   It is the **PURIFIER / ORDER‑KEEPER** — the subsystem that prevents
//   chaos, clutter, and corruption by removing expired sessions, chunks,
//   errors, and redownload logs.
//
//   • Clears old data before it becomes a problem
//   • Maintains structural integrity of PulseBand storage
//   • Ensures deterministic, stable, predictable behavior
//   • Runs automatically via heartbeat (timer.js)
//
// WHAT THIS FILE *IS*:
//   • A deterministic cleanup engine
//   • A pure backend maintenance function
//   • A stability + order enforcement layer
//
// WHAT THIS FILE *IS NOT*:
//   • NOT a renderer
//   • NOT a GPU subsystem
//   • NOT a business logic module
//   • NOT a user-facing endpoint
//
// SAFETY CONTRACT (v6.3):
//   • Fail-open: errors are logged, not fatal
//   • No randomness in cleanup logic
//   • No mutation outside intended collections
//   • Always logs actions for traceability
//   • No external side effects beyond Firestore writes
//
// STRUCTURE RULES:
//   • Cleanup order must remain deterministic
//   • No new collections may be added without architectural approval
//   • No cross-subsystem mutations allowed
//
// VERSION TAG:
//   version: 6.3
//
// ============================================================================
// ⭐ v6.3 COMMENT LOG
// ---------------------------------------------------------------------------
// • Added full v6.3 PAGE INDEX
// • Added metaphor layer (SANITY LAYER / PURIFIER / ORDER‑KEEPER)
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
const CLEANUP_CONTEXT = {
  label: "PULSEBAND_CLEANUP",
  layer: "D‑Layer",
  role: "Sanity Layer / Purifier",
  purpose: "Pulseband Session + Error Cleanup",
  context: "Deletes expired sessions, chunks, errors, and redownload logs",
  version: "6.3"
};

// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT)
// ============================================================================
export async function pulsebandCleanup() {
  const runId = `PB_CLEANUP_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  console.log(
    `%c🧹 START SANITY CLEANUP → ${runId}`,
    "color:#03A9F4; font-weight:bold;"
  );

  try {
    // ---------------------------------------------------------
    // ⭐ CLEANUP: pulseband_sessions older than 24h
    // ---------------------------------------------------------
    const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
    const sessionsSnap = await db.collection("pulseband_sessions").get();

    for (const s of sessionsSnap.docs) {
      const data = s.data() || {};
      const createdAt = data.createdAt?.toMillis?.() || 0;

      if (createdAt < cutoff24h) {
        console.log(
          `%c🟨 DELETE SESSION → ${s.id}`,
          "color:#FFC107; font-weight:bold;"
        );

        const chunksSnap = await s.ref.collection("chunks").get();
        for (const c of chunksSnap.docs) {
          await c.ref.delete();
        }

        await s.ref.delete();
      }
    }

    // ---------------------------------------------------------
    // ⭐ CLEANUP: pulseband_errors older than 7 days
    // ---------------------------------------------------------
    const cutoff7d = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const errorsSnap = await db.collection("pulseband_errors").get();

    for (const e of errorsSnap.docs) {
      const createdAt = e.data()?.createdAt?.toMillis?.() || 0;

      if (createdAt < cutoff7d) {
        console.log(
          `%c🟨 DELETE ERROR → ${e.id}`,
          "color:#FFC107; font-weight:bold;"
        );
        await e.ref.delete();
      }
    }

    // ---------------------------------------------------------
    // ⭐ CLEANUP: pulseband_redownloads older than 7 days
    // ---------------------------------------------------------
    const redlSnap = await db.collection("pulseband_redownloads").get();

    for (const r of redlSnap.docs) {
      const createdAt = r.data()?.createdAt?.toMillis?.() || 0;

      if (createdAt < cutoff7d) {
        console.log(
          `%c🟨 DELETE REDOWNLOAD → ${r.id}`,
          "color:#FFC107; font-weight:bold;"
        );
        await r.ref.delete();
      }
    }

    // ---------------------------------------------------------
    // ⭐ TIMER LOG
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(runId).set({
      fn: "pulsebandCleanup",
      runId,
      ...CLEANUP_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(
      `%c🟩 SANITY CLEANUP COMPLETE → ${runId}`,
      "color:#4CAF50; font-weight:bold;"
    );

    return { ok: true, runId, ...CLEANUP_CONTEXT };

  } catch (err) {
    console.error(
      `%c🟥 SANITY CLEANUP ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );

    await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}FATAL`).set({
      fn: "pulsebandCleanup",
      stage: "fatal",
      error: String(err),
      runId,
      ...CLEANUP_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ok: false, runId, error: String(err), ...CLEANUP_CONTEXT };
  }
}
