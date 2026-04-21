// ============================================================================
//  PULSE OS v9.1 — THE HEART
//  PulseProxyHeart — Cardiac Pacemaker Engine
//  ONE IMPORT ONLY (Pacemaker / SA Node)
//  Backend‑Only • Deterministic • Drift‑Proof • No IQ
// ============================================================================
//
// ROLE:
//   • Beats when the platform calls `handler`
//   • Circulates backend tasks through the body (via globals)
//   • Maintains deterministic rhythm + timing via state doc
//   • Writes heartbeat logs + task results only
//
// CONTRACT:
//   • ONE import allowed: pacemaker definition (heartbeat.js)
//   • No firebase-admin imports
//   • No @netlify/functions imports
//   • No direct task imports (logout, security, env, scoring)
//   • All tasks resolved from globals wired by OSKernel / route
// ============================================================================


import * as heartbeat from "./PulseProxyHeartBeat.js";

// ============================================================================
// GLOBAL WIRING — provided by OSKernel / bootstrap
// ============================================================================
const admin  = global.admin;
const db     = global.db;
const log    = global.log    || console.log;
const error  = global.error  || console.error;

// Tasks (organs) — wired into globals by OSKernel
const timerLogout             = global.timerLogout;
const securitySweep           = global.securitySweep;
const refreshEnvironmentSmart = global.refreshEnvironmentSmart;
const runUserScoring          = global.runUserScoring;

// ============================================================================
// HEART IDENTITY — v9.1
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "Heart",
  version: "9.1",
  identity: "PulseProxyHeart",

  evo: {
    driftProof: true,
    deterministic: true,
    pacemakerOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    backendOnly: true,
    multiInstanceReady: true,
    futureEvolutionReady: true
  }
};

const HEART_CONTEXT = {
  layer: PulseRole.layer,
  role: "CARDIAC_PACEMAKER_ENGINE",
  version: PulseRole.version,
  pacemaker: {
    source: "heartbeat.js",
    version: heartbeat?.VERSION || "9.1",
    label: heartbeat?.LABEL || "HEARTBEAT_PACEMAKER"
  },
  evo: PulseRole.evo
};

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "HEART-LAYER";
const LAYER_NAME = "THE HEART";
const LAYER_ROLE = "CARDIAC PACEMAKER ENGINE";

global.PULSE_LAYER_STATE = global.PULSE_LAYER_STATE || {};
global.PULSE_LAYER_STATE[3] = { name: "Heart", ok: true };

// Sequence counter for heartbeat events
let HEART_EVENT_SEQ = 0;

// ============================================================================
// HEART LOGGER — logs only, no control
// ============================================================================
async function logHeart(stage, details = {}) {
  HEART_EVENT_SEQ++;

  const payload = {
    seq: HEART_EVENT_SEQ,
    pulseLayer: LAYER_ID,
    pulseName: LAYER_NAME,
    pulseRole: LAYER_ROLE,
    stage,
    ts: Date.now(),
    ...details,
    ...HEART_CONTEXT
  };

  try {
    log("heart", "HEART_EVENT", payload);
  } catch (_) {}

  if (!db) return;

  try {
    await db.collection("HEART_LOGS").add(payload);
  } catch (err) {
    error("heart", "HEART_LOG_WRITE_FAILURE", String(err));
  }
}

// ============================================================================
// HUMAN‑READABLE CONTEXT MAP — v9.1
// ============================================================================
const TIMER_CONTEXT = {
  label: "HEARTBEAT",
  layer: "D‑Layer",
  purpose: "Scheduled Executor",
  context: "Runs periodic backend tasks and writes logs",
  version: PulseRole.version
};

const STATE_DOC = "PULSE_OS_TIMER_STATE";

// ============================================================================
// TASK DEFINITIONS — pure metadata, runners resolved at runtime
// ============================================================================
const TASKS = Object.freeze([
  {
    key: "timerLogout",
    label: "Timer Logout + PulseHistory Fix",
    purpose: "Logout stale users and repair missing snapshots",
    context: "Security + loyalty integrity",
    intervalMs: 5 * 60 * 1000
  },
  {
    key: "securitySweep",
    label: "Security Sweep",
    purpose: "Identity rotation + security flags",
    context: "Vault / JWT / IP / device integrity",
    intervalMs: 24 * 60 * 60 * 1000
  },
  {
    key: "refreshEnvironmentSmart",
    label: "Environment Refresh",
    purpose: "Weather / power / environment refresh",
    context: "Smart environment sync",
    intervalMs: 30 * 60 * 1000
  },
  {
    key: "runUserScoring",
    label: "User Scoring",
    purpose: "Homeostasis scoring pass",
    context: "Trust / mesh / phase / instances",
    intervalMs: 5 * 60 * 1000
  }
]);

// ============================================================================
// STATE HELPERS
// ============================================================================
async function loadState() {
  if (!db) return { ref: null, data: {} };

  const ref = db.collection("TIMER_LOGS").doc(STATE_DOC);
  const snap = await ref.get().catch(err => {
    error("heart", "HEART_STATE_LOAD_ERROR", String(err));
    return { exists: false, data: () => ({}) };
  });

  return { ref, data: snap && snap.exists ? snap.data() : {} };
}

async function updateState(ref, updates) {
  if (!ref || !admin || !admin.firestore) return;

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
    error("heart", "HEART_STATE_UPDATE_ERROR", String(err));
  }
}

// ============================================================================
// SHOULD RUN? — deterministic interval check
// ============================================================================
function shouldRunTask(nowMs, state, task) {
  const lastRuns = state?.lastRuns || {};
  const last = lastRuns[task.key] ?? 0;
  if (!last) return true;
  return nowMs - last >= task.intervalMs;
}

// ============================================================================
// RESOLVE TASK RUNNER FROM GLOBALS
// ============================================================================
async function runTask(taskKey) {
  switch (taskKey) {
    case "timerLogout":             return timerLogout?.();
    case "securitySweep":           return securitySweep?.();
    case "refreshEnvironmentSmart": return refreshEnvironmentSmart?.();
    case "runUserScoring":          return runUserScoring?.();
  }

  const fn = global[taskKey];
  if (typeof fn !== "function") {
    throw new Error(`Task runner not found for key='${taskKey}'`);
  }
  return fn();
}

// ============================================================================
// MAIN HANDLER — “THE HEARTBEAT”
// ============================================================================
export const handler = async () => {
  const runId = `HB_${Date.now()}`;

  await logHeart("BEAT_START", { runId });

  const now = Date.now();
  const results = {
    runId,
    startedAt: now,
    tasks: {},
    ...TIMER_CONTEXT
  };

  try {
    const { ref: stateRef, data: state } = await loadState();
    const lastRuns = { ...(state.lastRuns || {}) };

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
          await logHeart("BEAT_SKIP", { runId, task: task.key });
          results.tasks[task.key] = taskResult;
          continue;
        }

        await runTask(task.key);
        taskResult.ran = true;
        lastRuns[task.key] = now;

        await logHeart("BEAT_RUN", { runId, task: task.key });

      } catch (err) {
        const msg = String(err);
        taskResult.error = msg;

        await logHeart("BEAT_ERROR", {
          runId,
          task: task.key,
          message: msg
        });

        if (db && admin && admin.firestore) {
          try {
            await db
              .collection("FUNCTION_ERRORS")
              .doc(`ERR_${runId}_${task.key}`)
              .set({
                fn: "heart",
                task: task.key,
                label: task.label,
                error: msg,
                runId,
                ...TIMER_CONTEXT,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
          } catch (logErr) {
            error("heart", "HEART_TASK_ERROR_LOG_FAILURE", String(logErr));
          }
        }
      }

      results.tasks[task.key] = taskResult;
    }

    await updateState(stateRef, { lastRuns });

    if (db && admin && admin.firestore) {
      try {
        await db
          .collection("TIMER_LOGS")
          .doc(`HEARTBEAT_${runId}`)
          .set({
            fn: "heart",
            runId,
            tasks: results.tasks,
            ...TIMER_CONTEXT,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
      } catch (logErr) {
        error("heart", "HEARTBEAT_LOG_WRITE_ERROR", String(logErr));
      }
    }

    await logHeart("BEAT_COMPLETE", { runId });

    return {
      statusCode: 200,
      body: JSON.stringify(results)
    };

  } catch (err) {
    const msg = String(err);
    await logHeart("FATAL_ERROR", { runId, message: msg });

    if (db && admin && admin.firestore) {
      try {
        await db
          .collection("FUNCTION_ERRORS")
          .doc(`ERR_${runId}_FATAL`)
          .set({
            fn: "heart",
            stage: "fatal",
            error: msg,
            runId,
            ...TIMER_CONTEXT,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
      } catch (logErr) {
        error("heart", "HEART_FATAL_LOG_WRITE_ERROR", String(logErr));
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        runId,
        error: msg,
        ...TIMER_CONTEXT
      })
    };
  }
};
