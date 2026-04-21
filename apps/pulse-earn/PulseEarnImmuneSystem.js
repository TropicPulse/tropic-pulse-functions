// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnImmuneSystem.js
// LAYER: THE IMMUNE SYSTEM (Subsystem Doctor + Drift Diagnostician)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE IMMUNE SYSTEM — Pulse‑Earn’s subsystem physician.
//   • Checks vitals across all Earn subsystems (immune surveillance).
//   • Detects drift, errors, and inconsistencies (pathogen detection).
//   • Prescribes deterministic repairs (immune response).
//   • Maintains subsystem health records (immune memory).
//
// WHY “IMMUNE SYSTEM”?:
//   • Performs diagnostic evaluations (runHealthCheck = immune scan).
//   • Prescribes treatment (runRepair = immune response).
//   • Monitors vitals (healing metadata = cell health).
//   • Maintains medical history (reports = immune memory).
//   • Protects the health of the Earn organism (homeostasis).
//
// PURPOSE (v9.2):
//   • Provide deterministic, drift‑proof subsystem healing.
//   • Guarantee safe repair of PacketEngine + related modules.
//   • Maintain OS‑v5 healing metadata for Earn healers.
//   • Preserve immune lineage + subsystem health (conceptual only).
//
// CONTRACT (unchanged):
//   • PURE HEALING — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for deterministic repair actions.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic drift detection only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v9.2 EarnHealer.
// ============================================================================


// ------------------------------------------------------------
// IMMUNE CONTEXT METADATA
// ------------------------------------------------------------
const PULSE_EARN_IMMUNE_CONTEXT = {
  layer: "PulseEarnImmuneSystem",
  role: "IMMUNE_PHYSICIAN",
  purpose: "Diagnose and repair drift across Earn subsystems",
  context: "Immune surveillance + deterministic healing"
};


// ------------------------------------------------------------
// Imports — subsystem vitals (immune scan targets)
// ------------------------------------------------------------

// Engine + Runtime
import { getEarnEngineHealingState } from "./EarnEngine.js";
import { getEarnRuntimeHealingState } from "./PulseEarnHeart.js";

// Worker + Submission
import { getWorkerExecutionHealingState } from "./PulseEarnMetabolism.js";
import { getResultSubmissionHealingState } from "./PulseEarnLymphNodes.js";

// Packet Engine (repair target)
import {
  getPacketEngineHealingState,
  generatePacketData,
  writePacket
} from "./PulseEarnGeneticMemory.js";

// Cell (formerly Earner.js)
import { getPulseEarnCellHealingState } from "./PulseEarnCell.js";

// Marketplace Connector
import { getMarketplaceConnectorHealingState } from "./PulseEarnNervousSystem.js";


// ------------------------------------------------------------
// Immune State — medical chart (immune memory)
// ------------------------------------------------------------
const immuneState = {
  lastCheck: null,
  lastRepair: null,
  lastError: null,
  cycleCount: 0,
  status: "healthy", // healthy | warning | error | repairing
  lastReport: null,
  ...PULSE_EARN_IMMUNE_CONTEXT
};


// ------------------------------------------------------------
// runHealthCheck() — immune surveillance scan
// ------------------------------------------------------------
export async function runHealthCheck() {
  immuneState.cycleCount++;
  immuneState.lastCheck = Date.now();

  try {
    const report = {
      engine: getEarnEngineHealingState(),
      runtime: getEarnRuntimeHealingState(),
      worker: getWorkerExecutionHealingState(),
      submission: getResultSubmissionHealingState(),
      packets: getPacketEngineHealingState(),
      cell: getPulseEarnCellHealingState(),
      connector: getMarketplaceConnectorHealingState(),
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

    immuneState.lastReport = report;

    const driftDetected =
      report.engine.lastError ||
      report.runtime.lastError ||
      report.worker.lastError ||
      report.submission.lastError ||
      report.packets.lastError ||
      report.cell.lastError ||
      report.connector.lastError;

    if (!driftDetected) {
      immuneState.status = "healthy";
      immuneState.lastError = null;

      return {
        status: "healthy",
        report,
        ...PULSE_EARN_IMMUNE_CONTEXT
      };
    }

    immuneState.status = "warning";
    immuneState.lastError = "drift_detected";

    return {
      status: "warning",
      report,
      message: "Subsystem drift detected",
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

  } catch (err) {
    immuneState.status = "error";
    immuneState.lastError = err.message;

    return {
      status: "error",
      error: err.message,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };
  }
}


// ------------------------------------------------------------
// runRepair() — immune response
// ------------------------------------------------------------
export async function runRepair() {
  immuneState.lastRepair = Date.now();
  immuneState.status = "repairing";

  try {
    const packets = getPacketEngineHealingState();

    // If PacketEngine drifted, regenerate last packet
    if (packets.lastError && packets.lastKey) {
      const [fileId, packetIndex] = packets.lastKey.split(":");

      const regenerated = await generatePacketData(fileId, packetIndex);
      await writePacket(fileId, packetIndex, regenerated);
    }

    immuneState.status = "healthy";
    immuneState.lastError = null;

    return {
      repaired: true,
      message: "Subsystem repaired",
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

  } catch (err) {
    immuneState.status = "error";
    immuneState.lastError = err.message;

    return {
      repaired: false,
      error: err.message,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };
  }
}


// ------------------------------------------------------------
// getPulseEarnImmuneState() — immune memory export
// ------------------------------------------------------------
export function getPulseEarnImmuneState() {
  return { ...immuneState };
}
