// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnImmuneSystem.js
// LAYER: THE IMMUNE SYSTEM (v10.4)
// (Subsystem Doctor + Drift Diagnostician)
// ============================================================================
//
// ROLE (v10.4):
//   THE IMMUNE SYSTEM — Pulse‑Earn’s subsystem physician.
//   • Checks vitals across all Earn subsystems (immune surveillance).
//   • Detects drift, errors, and inconsistencies (pathogen detection).
//   • Prescribes deterministic repairs (immune response).
//   • Maintains subsystem health records (immune memory).
//
// CONTRACT (v10.4):
//   • PURE HEALING — no AI layers, no translation, no memory model.
//   • READ‑ONLY except deterministic repair actions.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO async.
//   • Deterministic drift detection only.
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
import { getPulseEarnHeartHealingState } from "./PulseEarnHeart.js";

// Worker + Submission
import { getWorkerExecutionHealingState } from "./PulseEarnMetabolism.js";
import { getResultSubmissionHealingState } from "./PulseEarnLymphNodes.js";

// Packet Engine (repair target)
import { getPulseEarnGeneticMemoryHealingState, synthesizePulseEarnGene, writePulseEarnGene} from "./PulseEarnGeneticMemory.js";

// Cell
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
  lastCycleIndex: null,
  ...PULSE_EARN_IMMUNE_CONTEXT
};

// Deterministic immune cycle counter
let immuneCycle = 0;


// ------------------------------------------------------------
// runHealthCheck() — immune surveillance scan (deterministic)
// ------------------------------------------------------------
export function runHealthCheck() {
  immuneCycle++;
  immuneState.cycleCount++;
  immuneState.lastCycleIndex = immuneCycle;

  try {
    const report = {
      engine: getEarnEngineHealingState(),
      runtime: getPulseEarnHeartHealingState(),
      worker: getWorkerExecutionHealingState(),
      submission: getResultSubmissionHealingState(),
      packets: getPulseEarnGeneticMemoryHealingState(),
      cell: getPulseEarnCellHealingState(),
      connector: getMarketplaceConnectorHealingState(),
      cycleIndex: immuneCycle,
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
        cycleIndex: immuneCycle,
        ...PULSE_EARN_IMMUNE_CONTEXT
      };
    }

    immuneState.status = "warning";
    immuneState.lastError = "drift_detected";

    return {
      status: "warning",
      report,
      message: "Subsystem drift detected",
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

  } catch (err) {
    immuneState.status = "error";
    immuneState.lastError = err.message;

    return {
      status: "error",
      error: err.message,
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };
  }
}


// ------------------------------------------------------------
// runRepair() — immune response (deterministic)
// ------------------------------------------------------------
export function runRepair() {
  immuneCycle++;
  immuneState.lastCycleIndex = immuneCycle;
  immuneState.status = "repairing";

  try {
    const packets = getPulseEarnGeneticMemoryHealingState();

    // If PacketEngine drifted, regenerate last packet deterministically
    if (packets.lastError && packets.lastKey) {
      const [fileId, packetIndex] = packets.lastKey.split(":");

      const regenerated = synthesizePulseEarnGene(fileId, packetIndex);
      writePulseEarnGene(fileId, packetIndex, regenerated);
    }

    immuneState.status = "healthy";
    immuneState.lastError = null;

    return {
      repaired: true,
      message: "Subsystem repaired",
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

  } catch (err) {
    immuneState.status = "error";
    immuneState.lastError = err.message;

    return {
      repaired: false,
      error: err.message,
      cycleIndex: immuneCycle,
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
