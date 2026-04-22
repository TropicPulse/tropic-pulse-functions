// ============================================================================
// FILE: /apps/pulse-proxy/pulsebandCleanup.js
// PULSEBAND CLEANUP — VERSION 9.3
// “THE PURIFIER / SANITY LAYER / ORDER‑KEEPER”
// ============================================================================
//
// ROLE (v9.3):
//   pulsebandCleanup is the PURIFIER of the PulseBand subsystem.
//   It is the SANITY LAYER / ORDER‑KEEPER — the organ that removes
//   expired sessions, chunks, errors, and redownload logs before they
//   accumulate into systemic drift.
//
// SAFETY CONTRACT (v9.3):
//   • Fail-open: errors are logged, never fatal
//   • No randomness in cleanup logic
//   • No mutation outside intended collections
//   • Always logs actions for traceability
//   • No external side effects beyond Firestore writes
//   • Deterministic cleanup order
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ============================================================================
// ORGAN IDENTITY — v9.3
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "PulseBandPurifier",
  version: "9.3",
  identity: "PulseBandCleanup",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    pulseBandAware: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
// HUMAN‑READABLE CONTEXT MAP (v9.3)
// ============================================================================
const CLEANUP_CONTEXT = {
  label: "PULSEBAND_CLEANUP",
  layer: PulseRole.layer,
  role: "Purifier / Sanity Layer / Order‑Keeper",
  purpose: "PulseBand Session + Error Cleanup",
  context: "Removes expired sessions, chunks, errors, and redownload logs",
  version: PulseRole.version,
  evo: PulseRole.evo
};

const CLEANUP_DIAGNOSTICS_ENABLED =
  process.env.PULSE_BAND_CLEANUP_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logCleanup = (stage, details = {}) => {
  if (!CLEANUP_DIAGNOSTICS_ENABLED) return;

  log(
    `[PULSEBAND_CLEANUP] ${stage} :: ${JSON.stringify({
      ...CLEANUP_CONTEXT,
      ...details
    })}`
  );
};

// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT / OSKernel)
// ============================================================================
export async function pulsebandCleanup() {
  const runId = `PB_CLEANUP_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  log(
    `%c🧹 START PURIFIER CLEANUP → ${runId}`,
    "color:#03A9F4; font-weight:bold;"
  );
  logCleanup("START", { runId });

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
        logCleanup("DELETE_SESSION", { sessionId: s.id });

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
        logCleanup("DELETE_ERROR", { errorId: e.id });
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
        logCleanup("DELETE_REDOWNLOAD", { redownloadId: r.id });
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
    logCleanup("COMPLETE", { runId });

    return { ok: true, runId, ...CLEANUP_CONTEXT };

  } catch (err) {
    error(
      `%c🟥 PURIFIER CLEANUP ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
    logCleanup("FATAL_ERROR", { runId, error: String(err) });

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
