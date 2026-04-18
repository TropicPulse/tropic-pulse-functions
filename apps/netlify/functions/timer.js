// ============================================================================
// FILE: /apps/netlify/functions/timer.js
// PULSE HEARTBEAT ENGINE — v6.3
// “THE HEART / PULSE OS HEARTBEAT ENGINE”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE HEART / PULSE OS HEARTBEAT ENGINE”
// - ROLE: Central rhythm generator + scheduled executor
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (DOM-visible inspector compatible)
// - Added explicit STAGE markers for beat/run/skip/fatal
// - ZERO logic changes to task scheduling or execution
//
// ============================================================================
// PERSONALITY + ROLE — “THE HEART”
// ----------------------------------------------------------------------------
// timer.js is the **HEART** of the Pulse OS.
// It is the **HEARTBEAT ENGINE** — the subsystem that keeps the entire OS
// alive by generating a consistent rhythm and circulating tasks.
//
//   • Beats every X minutes
//   • Pumps tasks through the system
//   • Maintains rhythm + timing
//   • Detects stagnation
//   • Ensures circulation of cleanup, scoring, security, and environment refresh
//   • Writes heartbeat logs for lineage + diagnostics
//
// If the heart stops beating, the OS collapses.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A scheduled heartbeat executor
//   ✔ A deterministic task circulator
//   ✔ A rhythm generator for the OS
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a frontend file
//   ✘ NOT a router
//   ✘ NOT a business logic layer
//   ✘ NOT a database writer (except logs)
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Never mutate frontend files
//   • Never run tasks out of order
//   • Never skip logging
//   • Always record heartbeat lineage
//   • Fail-open: one task failing does NOT stop the heart
//
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

// ---- TASK MODULES ----------------------------------------------------------
import { timerLogout } from "./timerLogout.js";
import { securitySweep } from "./securitySweep.js";
import { scheduledUserScoring } from "./scheduledUserScoring.js";
import { refreshEnvironmentSmart } from "./refreshEnvironmentSmart.js";
import { pulsebandCleanup } from "./pulsebandCleanup.js";
import { pulseHistoryRepair } from "./pulseHistoryRepair.js";
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
const LAYER_ROLE = "PULSE OS HEARTBEAT ENGINE";

const HEART_DIAGNOSTICS_ENABLED =
  process.env.PULSE_HEART_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logHeart = (stage, details = {}) => {
  if (!HEART_DIAGNOSTICS_ENABLED) return;

  console.log(
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
  context: "Runs periodic backend tasks and writes logs"
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
  await ref.set(
    {
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...TIMER_CONTEXT
    },
    { merge: true }
  );
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

        await db.collection("FUNCTION_ERRORS").doc(`ERR_${runId}_${task.key}`).set({
          fn: "timer",
          task: task.key,
          label: task.label,
          error: String(err),
          runId,
          ...TIMER_CONTEXT,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }

      results.tasks[task.key] = taskResult;
    }

    await updateState(stateRef, { lastRuns });

    await db.collection("TIMER_LOGS").doc(`HEARTBEAT_${runId}`).set({
      fn: "timer",
      runId,
      tasks: results.tasks,
      ...TIMER_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logHeart("BEAT_COMPLETE", { runId });

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };

  } catch (err) {
    logHeart("FATAL_ERROR", { message: String(err) });

    await db.collection("FUNCTION_ERRORS").doc(`ERR_${runId}_FATAL`).set({
      fn: "timer",
      stage: "fatal",
      error: String(err),
      runId,
      ...TIMER_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

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
