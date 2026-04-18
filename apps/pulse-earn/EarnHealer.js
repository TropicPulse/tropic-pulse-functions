// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/EarnHealer.js
// LAYER: THE PHYSICIAN (Subsystem Doctor + Drift Diagnostician)
// ============================================================================
//
// ROLE:
//   THE PHYSICIAN — Pulse‑Earn’s subsystem doctor.
//   • Checks vitals across all Earn subsystems
//   • Detects drift, errors, and inconsistencies
//   • Prescribes deterministic repairs
//   • Maintains subsystem health records
//
// WHY “PHYSICIAN”?:
//   • Performs diagnostic evaluations (runHealthCheck)
//   • Prescribes treatment (runRepair)
//   • Monitors vitals (healing metadata)
//   • Maintains medical history (reports, timestamps)
//   • Protects the health of the Earn organism
//
// PURPOSE:
//   • Provide deterministic, drift‑proof subsystem healing
//   • Guarantee safe repair of PacketEngine + related modules
//   • Maintain OS‑v5 healing metadata for Earn healers
//
// CONTRACT:
//   • PURE HEALING — no AI layers, no translation, no memory model
//   • READ‑ONLY except for deterministic repair actions
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic drift detection only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 EarnHealer
// ============================================================================

// ------------------------------------------------------------
// PHYSICIAN CONTEXT METADATA
// ------------------------------------------------------------
const EARN_HEALER_CONTEXT = {
  layer: "EarnHealer",
  role: "PHYSICIAN",
  purpose: "Diagnose and repair drift across Earn subsystems",
  context: "Subsystem doctor + deterministic healing"
};

// ------------------------------------------------------------
// Imports — subsystem vitals
// ------------------------------------------------------------
import { getEarnEngineHealingState } from "./EarnEngine.js";
import { getEarnRuntimeHealingState } from "./EarnRuntime.js";
import { getWorkerExecutionHealingState } from "./WorkerExecution.js";
import { getResultSubmissionHealingState } from "./ResultSubmission.js";
import {
  getPacketEngineHealingState,
  generatePacketData,
  writePacket
} from "./PacketEngine.js";
import { getEarnerHealingState } from "./Earner.js";
import { getMarketplaceConnectorHealingState } from "./MarketplaceConnector.js";

// ------------------------------------------------------------
// Physician State — medical chart
// ------------------------------------------------------------
const healerState = {
  lastCheck: null,
  lastRepair: null,
  lastError: null,
  cycleCount: 0,
  status: "healthy", // healthy | warning | error | repairing
  lastReport: null,
  ...EARN_HEALER_CONTEXT
};

// ------------------------------------------------------------
// runHealthCheck() — diagnostic exam
// ------------------------------------------------------------
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
      ...EARN_HEALER_CONTEXT
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

      return {
        status: "healthy",
        report,
        ...EARN_HEALER_CONTEXT
      };
    }

    healerState.status = "warning";
    healerState.lastError = "drift_detected";

    return {
      status: "warning",
      report,
      message: "Subsystem drift detected",
      ...EARN_HEALER_CONTEXT
    };

  } catch (err) {
    healerState.status = "error";
    healerState.lastError = err.message;

    return {
      status: "error",
      error: err.message,
      ...EARN_HEALER_CONTEXT
    };
  }
}

// ------------------------------------------------------------
// runRepair() — prescribed treatment
// ------------------------------------------------------------
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
      ...EARN_HEALER_CONTEXT
    };

  } catch (err) {
    healerState.status = "error";
    healerState.lastError = err.message;

    return {
      repaired: false,
      error: err.message,
      ...EARN_HEALER_CONTEXT
    };
  }
}

// ------------------------------------------------------------
// getEarnHealerState() — medical chart export
// ------------------------------------------------------------
export function getEarnHealerState() {
  return { ...healerState };
}
