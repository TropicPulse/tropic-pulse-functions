// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnImmuneSystem-v11-Evo.js
// LAYER: THE IMMUNE SYSTEM (v11-Evo + Dual-Band + Binary + Wave)
// (Subsystem Doctor + Drift Diagnostician + Deterministic Repair Engine)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE IMMUNE SYSTEM — Pulse‑Earn’s subsystem physician.
//   • Reads vitals across all Earn subsystems (immune surveillance).
//   • Detects drift, errors, inconsistencies (pathogen detection).
//   • Prescribes deterministic repairs (immune response).
//   • Maintains subsystem health records (immune memory).
//   • Emits v11‑Evo signatures + diagnostics.
//
// CONTRACT (v11-Evo):
//   • PURE HEALING — no AI layers, no translation, no memory model.
//   • READ‑ONLY except deterministic repair actions.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO async.
//   • Deterministic drift detection only.
//   • Dual-band + binary + wave metadata are structural-only.
// ============================================================================


// ============================================================================
// IMMUNE CONTEXT METADATA (v11-Evo)
// ============================================================================
const PULSE_EARN_IMMUNE_CONTEXT = {
  layer: "PulseEarnImmuneSystem-v11-Evo",
  role: "IMMUNE_PHYSICIAN",
  purpose: "Diagnose and repair drift across Earn subsystems",
  context: "Immune surveillance + deterministic healing"
};


// ============================================================================
// Imports — subsystem vitals (v11-Evo healing state providers)
// ============================================================================
import { getEarnEngineHealingState } from "./EarnEngine-v11-Evo.js";
import { getPulseEarnHeartHealingState } from "./PulseEarnHeart-v11-Evo.js";

import { getPulseEarnMetabolismHealingState } from "./PulseEarnMetabolism-v11-Evo.js";
import { getPulseEarnLymphHealingState } from "./PulseEarnLymphNodes-v11-Evo.js";

import {
  getPulseEarnGeneticMemoryHealingState,
  synthesizePulseEarnGene,
  writePulseEarnGene
} from "./PulseEarnGeneticMemory-v11-Evo.js";

import { getPulseEarnCellHealingState } from "./PulseEarnCell-v11-Evo.js";
import { getPulseEarnNervousSystemHealingState } from "./PulseEarnNervousSystem-v11-Evo.js";


// ============================================================================
// Immune State — medical chart (v11-Evo immune memory)
// ============================================================================
const immuneState = {
  lastCheck: null,
  lastRepair: null,
  lastError: null,
  cycleCount: 0,
  status: "healthy", // healthy | warning | error | repairing
  lastReport: null,
  lastCycleIndex: null,

  lastImmuneSignature: null,
  lastDriftSignature: null,
  lastRepairSignature: null,

  // v11+ Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  ...PULSE_EARN_IMMUNE_CONTEXT
};

// Deterministic immune cycle counter
let immuneCycle = 0;


// ============================================================================
// Deterministic Hash Helper — v11-Evo
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ============================================================================
// Signature Builders — v11-Evo
// ============================================================================
function buildImmuneSignature(cycle) {
  return computeHash(`IMMUNE::${cycle}`);
}

function buildDriftSignature(report) {
  return computeHash(
    `DRIFT::${report.engine.lastError || "OK"}::${report.worker?.lastError || "OK"}`
  );
}

function buildRepairSignature(key, cycle) {
  return computeHash(`REPAIR::${key || "NONE"}::${cycle}`);
}


// ============================================================================
// runHealthCheck() — immune surveillance scan (v11-Evo + Dual-Band + Binary + Wave)
// ============================================================================
export function runHealthCheck() {
  immuneCycle++;
  immuneState.cycleCount++;
  immuneState.lastCycleIndex = immuneCycle;

  try {
    const report = {
      engine: getEarnEngineHealingState(),
      runtime: getPulseEarnHeartHealingState(),
      worker: getPulseEarnMetabolismHealingState(),
      submission: getPulseEarnLymphHealingState(),
      packets: getPulseEarnGeneticMemoryHealingState(),
      cell: getPulseEarnCellHealingState(),
      connector: getPulseEarnNervousSystemHealingState(),
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

    // A — Dual-Band Awareness (derive band from runtime/packets, default symbolic)
    const derivedBand = normalizeBand(
      report.runtime.lastBand ||
      report.packets.lastBand ||
      "symbolic"
    );
    immuneState.lastBand = derivedBand;
    immuneState.lastBandSignature = computeHash(`BAND::${derivedBand}`);

    immuneState.lastImmuneSignature = buildImmuneSignature(immuneCycle);
    immuneState.lastDriftSignature = buildDriftSignature(report);

    // B — Binary Surfaces (structural only)
    const errorFlags = [
      report.engine.lastError,
      report.runtime.lastError,
      report.worker.lastError,
      report.submission.lastError,
      report.packets.lastError,
      report.cell.lastError,
      report.connector.lastError
    ];
    const errorCount = errorFlags.reduce(
      (acc, e) => acc + (e ? 1 : 0),
      0
    );
    const surface = errorCount * 100 + immuneCycle;

    const binaryField = {
      binaryImmuneSignature: computeHash(`BIMMUNE::${surface}`),
      binarySurfaceSignature: computeHash(`BSURF_IMMUNE::${surface}`),
      binarySurface: {
        errorCount,
        cycle: immuneCycle,
        surface
      },
      parity: surface % 2 === 0 ? 0 : 1,
      density: errorCount,
      shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
    };
    immuneState.lastBinaryField = binaryField;

    // A — Wave-Theory Metadata (structural only)
    const waveField = {
      amplitude: errorCount,
      wavelength: immuneCycle,
      phase: (errorCount + immuneCycle) % 8,
      band: derivedBand,
      mode: derivedBand === "binary" ? "compression-wave" : "symbolic-wave"
    };
    immuneState.lastWaveField = waveField;

    if (!driftDetected) {
      immuneState.status = "healthy";
      immuneState.lastError = null;

      return {
        status: "healthy",
        report,
        immuneSignature: immuneState.lastImmuneSignature,
        driftSignature: immuneState.lastDriftSignature,
        band: derivedBand,
        binaryField,
        waveField,
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
      immuneSignature: immuneState.lastImmuneSignature,
      driftSignature: immuneState.lastDriftSignature,
      band: derivedBand,
      binaryField,
      waveField,
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };

  } catch (err) {
    immuneState.status = "error";
    immuneState.lastError = err.message;

    const derivedBand = normalizeBand(immuneState.lastBand);

    const surface = immuneCycle;
    const binaryField = {
      binaryImmuneSignature: computeHash(`BIMMUNE_ERR::${surface}`),
      binarySurfaceSignature: computeHash(`BSURF_IMMUNE_ERR::${surface}`),
      binarySurface: {
        errorCount: 1,
        cycle: immuneCycle,
        surface
      },
      parity: surface % 2 === 0 ? 0 : 1,
      density: 1,
      shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
    };
    immuneState.lastBinaryField = binaryField;

    const waveField = {
      amplitude: 1,
      wavelength: immuneCycle,
      phase: (1 + immuneCycle) % 8,
      band: derivedBand,
      mode: derivedBand === "binary" ? "compression-wave" : "symbolic-wave"
    };
    immuneState.lastWaveField = waveField;

    return {
      status: "error",
      error: err.message,
      immuneSignature: buildImmuneSignature(immuneCycle),
      band: derivedBand,
      binaryField,
      waveField,
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };
  }
}


// ============================================================================
// runRepair() — immune response (v11-Evo + dual-band aware genetic repair)
// ============================================================================
export function runRepair() {
  immuneCycle++;
  immuneState.lastCycleIndex = immuneCycle;
  immuneState.status = "repairing";

  try {
    const packets = getPulseEarnGeneticMemoryHealingState();

    let repairedKey = null;

    // If PacketEngine drifted, regenerate last packet deterministically
    if (packets.lastError && packets.lastKey) {
      const parts = String(packets.lastKey).split(":");
      const fileId = parts[0];
      const packetIndex = parts[1];
      const bandRaw = parts[2];
      const band = normalizeBand(bandRaw);

      const regenerated = synthesizePulseEarnGene(fileId, packetIndex, band);
      writePulseEarnGene(fileId, packetIndex, regenerated, band);

      repairedKey = packets.lastKey;
    }

    immuneState.status = "healthy";
    immuneState.lastError = null;
    immuneState.lastRepairSignature = buildRepairSignature(
      repairedKey,
      immuneCycle
    );

    return {
      repaired: true,
      repairedKey,
      repairSignature: immuneState.lastRepairSignature,
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


// ============================================================================
// getPulseEarnImmuneState() — immune memory export (v11-Evo)
// ============================================================================
export function getPulseEarnImmuneState() {
  return { ...immuneState };
}
