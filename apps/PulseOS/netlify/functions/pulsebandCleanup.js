// ============================================================================
// FILE: /apps/netlify/functions/pulsebandCleanup.js
// PULSEBAND CLEANUP — VERSION 7.1+
// “THE PURIFIER / SANITY LAYER / ORDER‑KEEPER”
// ============================================================================
//
// ROLE (v7.1+):
//   pulsebandCleanup is the **PURIFIER** of the PulseBand subsystem.
//   It is the **SANITY LAYER / ORDER‑KEEPER** — the organ that removes
//   expired sessions, chunks, errors, and redownload logs before they
//   accumulate into systemic drift.
//
//   • Eliminates stale or expired kinetic data
//   • Maintains structural integrity of PulseBand storage
//   • Ensures deterministic, stable, predictable behavior
//   • Runs automatically via heartbeat (Heart.js)
//   • Fully aligned with PulseOS v7.1+ stability + organism contracts
//
// WHAT THIS FILE *IS* (v7.1+):
//   • A deterministic cleanup organ
//   • A backend purification + waste‑removal layer
//   • A zero‑drift, zero‑ambiguity subsystem
//   • A biological “liver/kidney” analog for PulseBand
//
// WHAT THIS FILE *IS NOT*:
//   • NOT business logic
//   • NOT a renderer
//   • NOT a GPU subsystem
//   • NOT a user-facing endpoint
//   • NOT a dynamic or self‑modifying subsystem
//
// SAFETY CONTRACT (v7.1+):
//   • Fail-open: errors are logged, never fatal
//   • No randomness in cleanup logic
//   • No mutation outside intended collections
//   • Always logs actions for traceability
//   • No external side effects beyond Firestore writes
//   • No cross-subsystem mutations
//   • Deterministic cleanup order
//
// STRUCTURE RULES (v7.1+):
//   • Cleanup order must remain deterministic
//   • No new collections without architectural approval
//   • No drift from the PulseBand storage contract
//
// VERSION TAG:
//   version: 7.1+
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ------------------------------------------------------------
// ⭐ HUMAN‑READABLE CONTEXT MAP (v7.1+)
// ------------------------------------------------------------
const CLEANUP_CONTEXT = {
  label: "PULSEBAND_CLEANUP",
  layer: "D‑Layer",
  role: "Purifier / Sanity Layer / Order‑Keeper",
  purpose: "PulseBand Session + Error Cleanup",
  context: "Removes expired sessions, chunks, errors, and redownload logs",
  version: "7.1+"
};

// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT)
// ============================================================================
export async function pulsebandCleanup() {
  const runId = `PB_CLEANUP_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  log(
    `%c🧹 START PURIFIER CLEANUP → ${runId}`,
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
        log(
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
        log(
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
        log(
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

    log(
      `%c🟩 PURIFIER CLEANUP COMPLETE → ${runId}`,
      "color:#4CAF50; font-weight:bold;"
    );

    return { ok: true, runId, ...CLEANUP_CONTEXT };

  } catch (err) {
    error(
      `%c🟥 PURIFIER CLEANUP ERROR`,
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
