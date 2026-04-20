// ============================================================================
// FILE: /apps/netlify/functions/refreshEnvironmentSmart.js
// PULSE ENVIRONMENT SENSOR — VERSION 7.1+
// “THE SENSORY PERCEPTION LAYER / ENVIRONMENTAL SENSE ORGAN”
// ============================================================================
//
// ROLE (v7.1+):
//   refreshEnvironmentSmart is the **SENSORY PERCEPTION LAYER** of PulseOS.
//   It is the **ENVIRONMENTAL SENSE ORGAN** — the subsystem that samples,
//   interprets, and updates the organism’s understanding of the outside world.
//
//   • Reads external environmental signals (weather, waves, storms, wildlife…)
//   • Determines whether to refresh or skip based on timing + drift
//   • Updates the environment collection with fresh perception data
//   • Logs perception events for lineage + diagnostics
//   • Runs automatically via heartbeat (Heart.js)
//
// WHAT THIS FILE *IS* (v7.1+):
//   • A deterministic sensory organ
//   • A perception + sampling layer for external environment
//   • A biological analog to peripheral sensory receptors
//   • A zero‑drift, zero‑ambiguity subsystem
//
// WHAT THIS FILE *IS NOT*:
//   • NOT memory (RouterMemory, pulseHistoryRepair)
//   • NOT identity (CheckIdentity)
//   • NOT purification (pulsebandCleanup)
//   • NOT routing (endpoint.js)
//
// SAFETY CONTRACT (v7.1+):
//   • Fail‑open: errors logged, never fatal
//   • No randomness in perception logic
//   • No mutation outside intended collections
//   • Always logs perception + failures for traceability
//   • No cross‑subsystem writes
//
// STRUCTURE RULES (v7.1+):
//   • Perceive → Validate → Update → Log
//   • No new sensors without architectural approval
//   • No drift from environment storage contract
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

// ============================================================================
// NETLIFY ENTRY POINT (single-run perception)
// ============================================================================
export const handler = async () => {
  const result = await refreshEnvironmentSmart();
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

// ============================================================================
// CORE SENSORY ORGAN LOGIC (heartbeat-driven)
// ============================================================================
export async function refreshEnvironmentSmart() {
  const runId = Date.now();
  const logId = `ENV_${runId}`;
  const errorPrefix = `ERR_${runId}_`;

  const envRef = db.collection("environment");
  const nowTs = admin.firestore.Timestamp.now();
  const nowMs = nowTs.toMillis();

  const refreshed = [];
  const skipped = [];
  const failed = [];

  // ---------------------------------------------------------
  // ⭐ SAFE WRAPPER (v7.1+)
// ---------------------------------------------------------
  async function safeMaybeUpdate(docName, intervalMs, fn) {
    try {
      await maybeUpdate(docName, intervalMs, fn);
    } catch (err) {
      failed.push(docName);

      await db.collection("FUNCTION_ERRORS")
        .doc(`${errorPrefix}${docName}_outer`)
        .set({
          fn: "refreshEnvironmentSmart",
          stage: "maybeUpdate_outer",
          docName,
          error: String(err),
          runId,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

      try {
        await envRef.doc(docName).set(
          {
            updatedAt: nowTs,
            success: false,
            raw: { error: "Outer failure: " + err.message },
            runId
          },
          { merge: true }
        );
      } catch (_) {}
    }
  }

  // ---------------------------------------------------------
  // ⭐ CORE PERCEPTION LOGIC (v7.1+)
// ---------------------------------------------------------
  async function maybeUpdate(docName, intervalMs, fn) {
    const snap = await envRef.doc(docName).get();
    const data = snap.data() || {};

    let last = 0;
    const rawUpdated = data.updatedAt;

    if (typeof rawUpdated === "number") last = rawUpdated;
    else if (rawUpdated?.toMillis) last = rawUpdated.toMillis();

    const force =
      !data.success ||
      data.raw?.error ||
      !rawUpdated ||
      last > nowMs ||
      Object.keys(data.raw || {}).length === 0;

    // Skip if interval not reached and no drift
    if (!force && nowMs - last < intervalMs) {
      skipped.push(docName);
      return;
    }

    try {
      // ⭐ CALL INTERNAL SENSOR FUNCTION DIRECTLY
      await fn(); // fetchWeather(), fetchWaves(), etc.

      refreshed.push(docName);

    } catch (err) {
      failed.push(docName);

      await db.collection("FUNCTION_ERRORS")
        .doc(`${errorPrefix}${docName}`)
        .set({
          fn: "refreshEnvironmentSmart",
          stage: "update_error",
          docName,
          error: String(err),
          runId,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

      await envRef.doc(docName).set(
        {
          updatedAt: nowTs,
          success: false,
          raw: { error: err.message },
          runId
        },
        { merge: true }
      );
    }
  }

  // ---------------------------------------------------------
  // ⭐ CALL ALL SENSOR SUB‑ORGANS (v7.1+)
// ---------------------------------------------------------
  await safeMaybeUpdate("weather",       30 * 60 * 1000, fetchWeather);
  await safeMaybeUpdate("heatIndex",     30 * 60 * 1000, fetchHeatIndex);
  await safeMaybeUpdate("waves",          2 * 60 * 60 * 1000, fetchWaves);
  await safeMaybeUpdate("sargassum",      6 * 60 * 60 * 1000, fetchSargassum);
  await safeMaybeUpdate("moon",          24 * 60 * 60 * 1000, fetchMoonPhase);
  await safeMaybeUpdate("wildlife",      24 * 60 * 60 * 1000, fetchWildlife);
  await safeMaybeUpdate("storms",         1 * 60 * 60 * 1000, fetchStorms);
  await safeMaybeUpdate("powerUpdates",   5 * 60 * 1000, updateSanPedroPower);
  await safeMaybeUpdate("power",         15 * 60 * 1000, fetchPowerOutages);

  // ---------------------------------------------------------
  // ⭐ TIMER LOG (v7.1+)
// ---------------------------------------------------------
  try {
    await db.collection("TIMER_LOGS").doc(logId).set({
      fn: "refreshEnvironmentSmart",
      runId,
      refreshed,
      skipped,
      failed,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}timerlog`).set({
      fn: "refreshEnvironmentSmart",
      stage: "timer_log",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return {
    ok: true,
    runId,
    refreshed,
    skipped,
    failed
  };
}
