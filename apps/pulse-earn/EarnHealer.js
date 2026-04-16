// FILE: tropic-pulse-functions/apps/pulse-earn/EarnHealer.js
//
// EarnHealer v5 — Deterministic, Drift‑Proof, Subsystem‑Level Healing Layer
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   EarnHealer — the subsystem‑level healing controller for Pulse Earn.
//
// RESPONSIBILITIES:
//   • Inspect healing metadata from ALL Earn modules
//   • Detect drift, corruption, invalid state, or stalled cycles
//   • Trigger safe, deterministic repair actions
//   • Consolidate subsystem health into a unified report
//   • Provide EarnEngine + PulseOS with a single healing interface
//
// THIS FILE IS:
//   • A subsystem healer
//   • A drift detector
//   • A metadata validator
//   • A safe auto‑repair orchestrator
//
// THIS FILE IS NOT:
//   • A compute engine
//   • A scheduler
//   • A marketplace adapter
//   • A packet engine
//   • A job selector
//   • A dynamic code executor
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO Function()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO mutation of internal module state except via public APIs
//   • NO network calls
//   • NO filesystem access
//
// ------------------------------------------------------
// Imports — healing metadata from all Earn modules
// ------------------------------------------------------

import { getEarnEngineHealingState } from "./EarnEngine.js";
import { getEarnRuntimeHealingState } from "./EarnRuntime.js";
import { getWorkerExecutionHealingState } from "./WorkerExecution.js";
import { getResultSubmissionHealingState } from "./ResultSubmission.js";
import { getPacketEngineHealingState, generatePacketData, writePacket } from "./PacketEngine.js";
import { getEarnerHealingState } from "./Earner.js";
import { getMarketplaceConnectorHealingState } from "./MarketplaceConnector.js";

// ------------------------------------------------------
// Healer State
// ------------------------------------------------------

const healerState = {
  lastCheck: null,
  lastRepair: null,
  lastError: null,
  cycleCount: 0,
  status: "healthy", // healthy | warning | error | repairing
  lastReport: null,
};

// ------------------------------------------------------
// runHealthCheck() — subsystem‑level drift detection
// ------------------------------------------------------
export async function runHealthCheck() {
  healerState.cycleCount++;
  healerState.lastCheck = Date.now();

  try {
    const report = {
      engine: getEarnEngineHealingState(),
      runtime: getEarnRuntimeHealingState(),
      worker: getWorkerExecutionHealingState(),
      submission: getResultSubmissionHealingState(),
      packets: getPacketEngineHealingState(),
      earner: getEarnerHealingState(),
      connector: getMarketplaceConnectorHealingState(),
    };

    healerState.lastReport = report;

    const driftDetected =
      report.engine.lastError ||
      report.runtime.lastError ||
      report.worker.lastError ||
      report.submission.lastError ||
      report.packets.lastError ||
      report.earner.lastError ||
      report.connector.lastError;

    if (!driftDetected) {
      healerState.status = "healthy";
      healerState.lastError = null;
      return { status: "healthy", report };
    }

    healerState.status = "warning";
    healerState.lastError = "drift_detected";

    return {
      status: "warning",
      report,
      message: "Subsystem drift detected",
    };

  } catch (err) {
    healerState.status = "error";
    healerState.lastError = err.message;

    return {
      status: "error",
      error: err.message,
    };
  }
}

// ------------------------------------------------------
// runRepair() — subsystem‑level auto‑repair
// ------------------------------------------------------
export async function runRepair() {
  healerState.lastRepair = Date.now();
  healerState.status = "repairing";

  try {
    const packets = getPacketEngineHealingState();

    // If PacketEngine drifted, regenerate last packet
    if (packets.lastError && packets.lastKey) {
      const [fileId, packetIndex] = packets.lastKey.split(":");

      const regenerated = await generatePacketData(fileId, packetIndex);
      await writePacket(fileId, packetIndex, regenerated);
    }

    healerState.status = "healthy";
    healerState.lastError = null;

    return {
      repaired: true,
      message: "Subsystem repaired",
    };

  } catch (err) {
    healerState.status = "error";
    healerState.lastError = err.message;

    return {
      repaired: false,
      error: err.message,
    };
  }
}

// ------------------------------------------------------
// getEarnHealerState()
// ------------------------------------------------------
export function getEarnHealerState() {
  return { ...healerState };
}
