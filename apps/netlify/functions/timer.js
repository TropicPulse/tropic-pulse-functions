// ============================================================================
// FILE: /apps/netlify/functions/timer.js
// PULSE HEARTBEAT ENGINE — v7.1+
// “THE HEART / CARDIAC PACEMAKER ENGINE”
// ============================================================================
//
// ROLE (v7.1+):
//   timer.js is the **HEART** of PulseOS.
//   It is the **CARDIAC PACEMAKER ENGINE** — the subsystem that generates
//   the organism’s rhythm and circulates tasks through the entire system.
//
//   • Beats every X minutes (SA node)
//   • Pumps tasks through the OS (systemic circulation)
//   • Maintains deterministic rhythm + timing
//   • Detects stagnation (arrhythmia detection)
//   • Ensures circulation of cleanup, scoring, security, and environment refresh
//   • Writes heartbeat logs for lineage + diagnostics
//
//   If the heart stops, the organism collapses.
//
// WHAT THIS FILE *IS* (v7.1+):
//   ✔ A scheduled heartbeat executor
//   ✔ A deterministic task circulator
//   ✔ A resilient cardiac organ aligned with the v7.1+ organism
//
// WHAT THIS FILE *IS NOT*:
//   ✘ NOT a router
//   ✘ NOT business logic
//   ✘ NOT a database writer (except logs)
//   ✘ NOT a frontend file
//
// SAFETY CONTRACT (v7.1+):
//   • Never mutate frontend files
//   • Never run tasks out of order
//   • Never skip logging intentionally (best‑effort only)
//   • Fail‑open: one task failing does NOT stop the heart
//   • Logging failures must not kill the heartbeat
//   • Deterministic task order + intervals
//
// VERSION TAG:
//   version: 7.1+
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { pulsebandCleanup } from "./pulsebandCleanup.js";
import { pulseHistoryRepair } from "./pulseHistoryRepair.js";
import * as timers4 from "./timers4.js";

// ---- TASK MODULES ----------------------------------------------------------



// ---------------------------------------------------------------------------

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "HEART-LAYER";
const LAYER_NAME = "THE HEART";
const LAYER_ROLE = "CARDIAC PACEMAKER ENGINE";

const HEART_DIAGNOSTICS_ENABLED =
  process.env.PULSE_HEART_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logHeart = (stage, details = {}) => {
  if (!HEART_DIAGNOSTICS_ENABLED) return;

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
// HUMAN‑READABLE CONTEXT MAP
// ============================================================================
const TIMER_CONTEXT = {
  label: "HEARTBEAT",
  layer: "D‑Layer",
  purpose: "Scheduled Executor",
  context: "Runs periodic backend tasks and writes logs",
  version: "7.1+"
};

// ============================================================================
// INTERNAL: TASK DEFINITIONS
// ============================================================================
const TASKS = [
  {
    key: "logoutSweep",
    label: "Logout Sweep",
    purpose: "Expire inactive sessions",
    context: "Ensures security + session hygiene",
    intervalMs: 5 * 60 * 1000,
    runner: timerLogout
  },
  {
    key: "userScoring",
    label: "User Scoring",
    purpose: "Recalculate user scores",
    context: "Maintains deterministic scoring",
    intervalMs: 5 * 60 * 1000,
    runner: scheduledUserScoring
  },
  {
    key: "refreshEnvironmentSmart",
    label: "Environment Refresh",
    purpose: "Refresh environment data",
    context: "Ensures environment freshness",
    intervalMs: 30 * 60 * 1000,
    runner: refreshEnvironmentSmart
  },
  {
    key: "securitySweep",
    label: "Security Sweep",
    purpose: "Scan for anomalies",
    context: "Detects suspicious activity",
    intervalMs: 24 * 60 * 60 * 1000,
    runner: securitySweep
  },
  {
    key: "pulsebandCleanup",
    label: "Pulseband Cleanup",
    purpose: "Clean expired Pulseband entries",
    context: "Maintains badge integrity",
    intervalMs: 24 * 60 * 60 * 1000,
    runner: pulsebandCleanup
  },
  {
    key: "pulseHistoryRepair",
    label: "Pulse History Repair",
    purpose: "Repair missing snapshots",
    context: "Ensures deterministic lineage",
    intervalMs: 60 * 60 * 1000,
    runner: pulseHistoryRepair
  }
];

const STATE_DOC = "PULSE_OS_TIMER_STATE";

// ============================================================================
// INTERNAL: LOAD / UPDATE STATE
// ============================================================================
async function loadState() {
  const ref = db.collection("TIMER_LOGS").doc(STATE_DOC);
  const snap = await ref.get();
  return { ref, data: snap.exists ? snap.data() : {} };
}

async function updateState(ref, updates) {
  try {
    await ref.set(
      {
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...TIMER_CONTEXT
      },
      { merge: true }
    );
  } catch (err) {
    error("HEART_STATE_UPDATE_ERROR", String(err));
  }
}

// ============================================================================
// INTERNAL: SHOULD RUN?
// ============================================================================
function shouldRunTask(nowMs, state, task) {
  const last = state?.lastRuns?.[task.key] ?? 0;
  if (!last) return true;
  return nowMs - last >= task.intervalMs;
}

// ============================================================================
// MAIN HANDLER — “THE HEARTBEAT”
// ============================================================================
export const handler = async () => {
  const runId = `HB_${Date.now()}`;

  logHeart("BEAT_START", { runId });

  const now = Date.now();
  const results = {
    runId,
    startedAt: now,
    tasks: {},
    ...TIMER_CONTEXT
  };

  try {
    const { ref: stateRef, data: state } = await loadState();
    const lastRuns = state.lastRuns || {};

    for (const task of TASKS) {
      const taskResult = {
        ran: false,
        skipped: false,
        error: null,
        label: task.label,
        purpose: task.purpose,
        context: task.context
      };

      try {
        if (!shouldRunTask(now, state, task)) {
          taskResult.skipped = true;

          logHeart("BEAT_SKIP", { task: task.key });

          results.tasks[task.key] = taskResult;
          continue;
        }

        await task.runner();
        taskResult.ran = true;
        lastRuns[task.key] = now;

        logHeart("BEAT_RUN", { task: task.key });

      } catch (err) {
        taskResult.error = String(err);

        logHeart("BEAT_ERROR", {
          task: task.key,
          message: String(err)
        });

        try {
          await db.collection("FUNCTION_ERRORS").doc(`ERR_${runId}_${task.key}`).set({
            fn: "timer",
            task: task.key,
            label: task.label,
            error: String(err),
            runId,
            ...TIMER_CONTEXT,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (logErr) {
          error("HEART_TASK_ERROR_LOG_FAILURE", String(logErr));
        }
      }

      results.tasks[task.key] = taskResult;
    }

    await updateState(stateRef, { lastRuns });

    try {
      await db.collection("TIMER_LOGS").doc(`HEARTBEAT_${runId}`).set({
        fn: "timer",
        runId,
        tasks: results.tasks,
        ...TIMER_CONTEXT,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logErr) {
      error("HEARTBEAT_LOG_WRITE_ERROR", String(logErr));
    }

    logHeart("BEAT_COMPLETE", { runId });

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };

  } catch (err) {
    logHeart("FATAL_ERROR", { message: String(err) });

    try {
      await db.collection("FUNCTION_ERRORS").doc(`ERR_${runId}_FATAL`).set({
        fn: "timer",
        stage: "fatal",
        error: String(err),
        runId,
        ...TIMER_CONTEXT,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logErr) {
      error("HEART_FATAL_LOG_WRITE_ERROR", String(logErr));
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        runId,
        error: String(err),
        ...TIMER_CONTEXT
      })
    };
  }
};
