// ============================================================================
// FILE: /apps/netlify/functions/scheduledUserScoring.js
// PULSE USER SCORING ENGINE — v7.1+
// “THE METACOGNITIVE CORTEX / INTERNAL SELF‑EVALUATION ORGAN”
// ============================================================================
//
// ROLE (v7.1+):
//   scheduledUserScoring is the **METACOGNITIVE CORTEX** of PulseOS.
//   It is the **INTERNAL SELF‑EVALUATION ORGAN** — the subsystem that
//   introspects the network, evaluates each user’s behavior, computes
//   trust + mesh strength, assigns phases, detects hubs, and allocates
//   internal resources.
//
//   • Loads all UserMetrics (introspective sampling)
//   • Computes trustScore + meshScore (self‑evaluation)
//   • Assigns phase (self‑classification)
//   • Detects hubs (self‑structure awareness)
//   • Allocates instances (self‑resource distribution)
//   • Writes results to UserScores (self‑recording)
//
// WHAT THIS FILE *IS* (v7.1+):
//   • A deterministic metacognitive organ
//   • A complete internal evaluator
//   • A scheduled introspection + classification system
//
// WHAT THIS FILE *IS NOT*:
//   • NOT routing
//   • NOT cleanup
//   • NOT memory
//   • NOT identity
//
// SAFETY CONTRACT (v7.1+):
//   • No randomness in scoring
//   • Fail‑open: errors logged per‑user
//   • No external imports except Firebase Admin
//   • Deterministic scoring rules only
//   • Must not mutate unrelated collections
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
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "SCORE-LAYER";
const LAYER_NAME = "METACOGNITIVE CORTEX";
const LAYER_ROLE = "INTERNAL SELF-EVALUATION ORGAN";

const SCORING_DIAGNOSTICS_ENABLED =
  process.env.PULSE_SCORING_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logScoring = (stage, details = {}) => {
  if (!SCORING_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};

// ============================================================================
// BACKEND ENTRY POINT — THE METACOGNITIVE CORTEX
// ============================================================================
export async function scheduledUserScoring() {
  const runId = `SCORE_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  logScoring("RUN_START", { runId });

  try {
    // ---------------------------------------------------------
    // ⭐ INTROSPECTION: LOAD ALL USER METRICS
    // ---------------------------------------------------------
    const metricsSnap = await db.collection("UserMetrics").get();
    const results = {};

    logScoring("METRICS_LOADED", {
      runId,
      userCount: metricsSnap.size
    });

    for (const doc of metricsSnap.docs) {
      const uid = doc.id;
      const m = doc.data() || {};

      try {
        // ---------------------------------------------------------
        // ⭐ SELF‑EVALUATION: COMPUTE SCORES
        // ---------------------------------------------------------
        const trustScore =
          (m.loginSuccesses || 0) * 2 -
          (m.loginFailures || 0) * 3 +
          (m.identityChecks || 0) * 1;

        const meshScore =
          (m.deliveryCount || 0) * 5 +
          (m.fastDeliveries || 0) * 10 -
          (m.lateDeliveries || 0) * 8;

        // ---------------------------------------------------------
        // ⭐ SELF‑CLASSIFICATION: PHASE
        // ---------------------------------------------------------
        const phase =
          trustScore > 50 && meshScore > 100 ? "alpha" :
          trustScore > 20 && meshScore > 50 ? "beta" :
          "gamma";

        // ---------------------------------------------------------
        // ⭐ SELF‑STRUCTURE AWARENESS: HUB DETECTION
        // ---------------------------------------------------------
        const hubFlag = meshScore > 200;

        // ---------------------------------------------------------
        // ⭐ SELF‑RESOURCE ALLOCATION
        // ---------------------------------------------------------
        const instances = hubFlag ? 3 : phase === "alpha" ? 2 : 1;

        // ---------------------------------------------------------
        // ⭐ SELF‑RECORDING: WRITE TO UserScores
        // ---------------------------------------------------------
        await db.collection("UserScores").doc(uid).set(
          {
            trustScore,
            meshScore,
            phase,
            hubFlag,
            instances,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            runId
          },
          { merge: true }
        );

        results[uid] = { trustScore, meshScore, phase, hubFlag, instances };

        logScoring("USER_SCORED", {
          runId,
          uid,
          trustScore,
          meshScore,
          phase,
          hubFlag,
          instances
        });

      } catch (err) {
        logScoring("USER_ERROR", {
          runId,
          uid,
          message: String(err)
        });

        await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
          fn: "scheduledUserScoring",
          stage: "user_scoring",
          uid,
          error: String(err),
          runId,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }

    // ---------------------------------------------------------
    // ⭐ TIMER LOG
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(runId).set({
      fn: "scheduledUserScoring",
      runId,
      results,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logScoring("RUN_COMPLETE", {
      runId,
      scoredUsers: Object.keys(results).length
    });

    return { ok: true, runId, results };

  } catch (err) {
    logScoring("RUN_FATAL", {
      runId,
      message: String(err)
    });

    await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}FATAL`).set({
      fn: "scheduledUserScoring",
      stage: "fatal",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ok: false, runId, error: String(err) };
  }
}
