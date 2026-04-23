// ============================================================================
// FILE: /apps/pulse-proxy/pulsebandCleanup.js
// PULSEBAND CLEANUP — VERSION 10.4
// “THE PURIFIER / SANITY LAYER / ORDER‑KEEPER”
// ============================================================================
//
// ROLE (v10.4):
//   pulsebandCleanup is the PURIFIER of the PulseBand subsystem.
//   It is the SANITY LAYER / ORDER‑KEEPER — the organ that removes
//   expired sessions, chunks, errors, and redownload logs before they
//   accumulate into systemic drift.
//
// SAFETY CONTRACT (v10.4):
//   • Fail-open: errors are logged, never fatal
//   • No randomness in cleanup logic
//   • No mutation outside intended collections
//   • Always logs actions for traceability
//   • No external side effects beyond Firestore writes
//   • Deterministic cleanup order
//   • Bounded scans via indexed queries where possible
//   • Multi-instance safe
//   • No IQ, no routing, no OS imports
// ============================================================================

// import * as admin from "firebase-admin";
// import { getFirestore } from "firebase-admin/firestore";

// if (!admin.apps.length) {
//   admin.initializeApp();
// }
// const db = getFirestore();

// ============================================================================
// ORGAN IDENTITY — v10.4
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "PulseBandPurifier",
  version: "10.4",
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
    futureEvolutionReady: true,
    boundedScan: true,
    timerSafe: true
  }
};

// ============================================================================
// HUMAN‑READABLE CONTEXT MAP (v10.4)
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
// INTERNAL CONSTANTS (v10.4)
// ============================================================================
const MAX_BATCH = 500;

// ============================================================================
// INTERNAL HELPERS (bounded, deterministic, no IQ)
// ============================================================================
async function cleanupSessionsBefore(cutoffMs, runId, errorPrefix) {
  let deletedCount = 0;
  let lastDoc = null;

  while (true) {
    let query = db
      .collection("pulseband_sessions")
      .where("createdAt", "<", new Date(cutoffMs))
      .orderBy("createdAt", "asc")
      .limit(MAX_BATCH);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    if (snap.empty) break;

    for (const s of snap.docs) {
      const id = s.id;
      try {
        const data = s.data() || {};
        const createdAt = data.createdAt?.toMillis?.() || 0;

        if (createdAt < cutoffMs) {
          log(
            `%c🟨 DELETE SESSION → ${id}`,
            "color:#FFC107; font-weight:bold;"
          );
          logCleanup("DELETE_SESSION", { sessionId: id, runId });

          const chunksSnap = await s.ref.collection("chunks").get();
          for (const c of chunksSnap.docs) {
            await c.ref.delete();
          }

          await s.ref.delete();
          deletedCount += 1;
        }
      } catch (err) {
        error(
          `%c🟥 SESSION CLEANUP ERROR → ${id}`,
          "color:#FF5252; font-weight:bold;",
          err
        );

        await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}SESSION_${id}`).set({
          fn: "pulsebandCleanup",
          stage: "session_doc",
          docId: id,
          error: String(err),
          runId,
          ...CLEANUP_CONTEXT,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < MAX_BATCH) break;
  }

  return deletedCount;
}
async function cleanupErrorsBefore(cutoffMs, runId, errorPrefix) {
  let deletedCount = 0;
  let lastDoc = null;

  while (true) {
    let query = db
      .collection("pulseband_errors")
      .where("createdAt", "<", new Date(cutoffMs))
      .orderBy("createdAt", "asc")
      .limit(MAX_BATCH);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    if (snap.empty) break;

    for (const e of snap.docs) {
      const id = e.id;
      try {
        const createdAt = e.data()?.createdAt?.toMillis?.() || 0;

        if (createdAt < cutoffMs) {
          log(
            `%c🟨 DELETE ERROR → ${id}`,
            "color:#FFC107; font-weight:bold;"
          );
          logCleanup("DELETE_ERROR", { errorId: id, runId });

          await e.ref.delete();
          deletedCount += 1;
        }
      } catch (err) {
        error(
          `%c🟥 ERROR CLEANUP ERROR → ${id}`,
          "color:#FF5252; font-weight:bold;",
          err
        );

        await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}ERROR_${id}`).set({
          fn: "pulsebandCleanup",
          stage: "error_doc",
          docId: id,
          error: String(err),
          runId,
          ...CLEANUP_CONTEXT,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < MAX_BATCH) break;
  }

  return deletedCount;
}

async function cleanupRedownloadsBefore(cutoffMs, runId, errorPrefix) {
  let deletedCount = 0;
  let lastDoc = null;

  while (true) {
    let query = db
      .collection("pulseband_redownloads")
      .where("createdAt", "<", new Date(cutoffMs))
      .orderBy("createdAt", "asc")
      .limit(MAX_BATCH);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snap = await query.get();
    if (snap.empty) break;

    for (const r of snap.docs) {
      const id = r.id;
      try {
        const createdAt = r.data()?.createdAt?.toMillis?.() || 0;

        if (createdAt < cutoffMs) {
          log(
            `%c🟨 DELETE REDOWNLOAD → ${id}`,
            "color:#FFC107; font-weight:bold;"
          );
          logCleanup("DELETE_REDOWNLOAD", { redownloadId: id, runId });

          await r.ref.delete();
          deletedCount += 1;
        }
      } catch (err) {
        error(
          `%c🟥 REDOWNLOAD CLEANUP ERROR → ${id}`,
          "color:#FF5252; font-weight:bold;",
          err
        );

        await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}REDL_${id}`).set({
          fn: "pulsebandCleanup",
          stage: "redownload_doc",
          docId: id,
          error: String(err),
          runId,
          ...CLEANUP_CONTEXT,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < MAX_BATCH) break;
  }

  return deletedCount;
}

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
    const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
    const cutoff7d = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const deletedSessions = await cleanupSessionsBefore(
      cutoff24h,
      runId,
      errorPrefix
    );

    const deletedErrors = await cleanupErrorsBefore(
      cutoff7d,
      runId,
      errorPrefix
    );

    const deletedRedownloads = await cleanupRedownloadsBefore(
      cutoff7d,
      runId,
      errorPrefix
    );

    // ---------------------------------------------------------
    // ⭐ TIMER LOG
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(runId).set({
      fn: "pulsebandCleanup",
      runId,
      deletedSessions,
      deletedErrors,
      deletedRedownloads,
      ...CLEANUP_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    log(
      `%c🟩 PURIFIER CLEANUP COMPLETE → ${runId}`,
      "color:#4CAF50; font-weight:bold;"
    );
    logCleanup("COMPLETE", {
      runId,
      deletedSessions,
      deletedErrors,
      deletedRedownloads
    });

    return {
      ok: true,
      runId,
      deletedSessions,
      deletedErrors,
      deletedRedownloads,
      ...CLEANUP_CONTEXT
    };

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
