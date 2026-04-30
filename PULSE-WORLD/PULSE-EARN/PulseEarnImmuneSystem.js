// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnImmuneSystem-v12.3-PRESENCE-EVO+.js
// LAYER: THE IMMUNE SYSTEM (v12.3-PRESENCE-EVO+ + Dual-Band + Binary-First + Wave)
// (Subsystem Doctor + Drift Diagnostician + Deterministic Repair Engine + Presence Telemetry)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE IMMUNE SYSTEM — Pulse‑Earn’s subsystem physician.
//   • Reads vitals across all Earn subsystems (immune surveillance).
//   • Detects drift, errors, inconsistencies (pathogen detection).
//   • Prescribes deterministic repairs (immune response).
//   • Maintains subsystem health records (immune memory).
//   • Emits v12.3‑Presence‑EVO+ signatures + diagnostics + presence surfaces.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE HEALING — no AI layers, no translation, no LLM inference.
//   • READ‑ONLY except deterministic repair actions.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO timestamps, NO async.
//   • Deterministic drift detection only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
//   • Binary-first: binary field is the primary immune surface, wave is secondary.
// ============================================================================
export const PulseEarnImmuneSystemMeta = Object.freeze({
  layer: "PulseEarnImmuneSystem",
  role: "EARN_IMMUNE_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnImmuneSystem-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureHealing: true,
    driftDetectionOnly: true,
    dualBandAware: true,
    binaryAware: true,
    binaryFirst: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
    meshAware: true,
    castleAware: true,
    regionAware: true,
    worldLensAware: false,
    zeroAI: true,
    zeroUserCode: true,
    zeroAsync: true
  }),

  contract: Object.freeze({
    input: [
      "EarnSubsystemHealingStates",
      "DualBandContext",
      "BinaryField",
      "WaveField",
      "GlobalHintsPresenceField"
    ],
    output: [
      "ImmuneDiagnostics",
      "ImmuneSignatures",
      "DeterministicRepairActions",
      "ImmuneHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnImmuneSystem-v9",
      "PulseEarnImmuneSystem-v10",
      "PulseEarnImmuneSystem-v11",
      "PulseEarnImmuneSystem-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "binary",
    behavior: "metadata-only",
    priority: "binary-first"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic drift detection across Earn subsystems",
    adaptive: "binary-first immune surfaces + wave + presence/advantage/hints metadata",
    return: "deterministic repair actions + immune diagnostics"
  })
});


// ============================================================================
// IMMUNE CONTEXT METADATA (v12.3-PRESENCE-EVO+ + Dual-Band + Binary-First)
// ============================================================================
export const PULSE_EARN_IMMUNE_CONTEXT = Object.freeze({
  layer: "PulseEarnImmuneSystem-v12.3-PRESENCE-EVO+",
  role: "IMMUNE_PHYSICIAN",
  purpose: "Diagnose and repair drift across Earn subsystems",
  context: "Immune surveillance + deterministic healing",
  band: "dualband",
  highway: "binary_first_dualband",
  intent: "pulse_earn_subsystem_healing",
  evo: Object.freeze({
    dualMode: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    localAware: true,
    internetAware: true,

    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    healerStackAware: true,
    loopTheoryAware: true,
    fpinTheoryAware: true,
    intentFieldAware: true,
    futureEvolutionReady: true,
    multiInstanceReady: true,

    zeroNetwork: true,
    zeroBackend: true,
    zeroTiming: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true
  })
});


// ============================================================================
// Imports — subsystem vitals (healing state providers)
// (still v11-Evo filenames; presence fields are optional, metadata-only)
// ============================================================================
import { getEarnEngineHealingState } from "./PulseEarnMuscleSystem.js";
import { getPulseEarnHeartHealingState } from "./PulseEarnHeart.js";

import { getPulseEarnMetabolismHealingState } from "./PulseEarnMetabolism.js";
import { getPulseEarnLymphHealingState } from "./PulseEarnLymphNodes.js";

import {
  getPulseEarnGeneticMemoryHealingState,
  synthesizePulseEarnGene,
  writePulseEarnGene
} from "./PulseEarnGeneticMemory.js";

import { getPulseEarnCellHealingState } from "./PulseEarnCell.js";
import { getPulseEarnNervousSystemHealingState } from "./PulseEarnNervousSystem.js";


// ============================================================================
// Immune State — medical chart (immune memory)
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

  // Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // Presence-EVO+ additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastImmunePressureProfile: null,
  lastBinaryProfile: null,
  lastWaveProfile: null,

  ...PULSE_EARN_IMMUNE_CONTEXT
};

// Deterministic immune cycle counter
let immuneCycle = 0;


// ============================================================================
// Deterministic Hash Helper
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
// Signature Builders
// ============================================================================
function buildImmuneSignature(cycle, band, pressureTier, errorCount) {
  return computeHash(
    `IMMUNE::${cycle}::${band}::PTIER:${pressureTier}::ERRS:${errorCount}`
  );
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
// Presence / Advantage / Hints Surfaces (aggregated across subsystems + global)
// ============================================================================
function safePresenceFrom(subsystem) {
  return (
    subsystem?.lastPresenceField ||
    subsystem?.presenceField ||
    {}
  );
}

function safeAdvantageFrom(subsystem) {
  return (
    subsystem?.lastAdvantageField ||
    subsystem?.advantageField ||
    {}
  );
}

function safeHintsFrom(subsystem) {
  return (
    subsystem?.lastHintsField ||
    subsystem?.hintsField ||
    {}
  );
}

function buildPresenceField(report, globalHints = {}) {
  const engineP = safePresenceFrom(report.engine);
  const runtimeP = safePresenceFrom(report.runtime);
  const workerP = safePresenceFrom(report.worker);
  const submissionP = safePresenceFrom(report.submission);
  const packetsP = safePresenceFrom(report.packets);
  const cellP = safePresenceFrom(report.cell);
  const connectorP = safePresenceFrom(report.connector);
  const gh = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshPressureIndex =
    engineP.meshPressureIndex ||
    runtimeP.meshPressureIndex ||
    workerP.meshPressureIndex ||
    submissionP.meshPressureIndex ||
    packetsP.meshPressureIndex ||
    cellP.meshPressureIndex ||
    connectorP.meshPressureIndex ||
    mesh.meshPressureIndex ||
    0;

  const castleLoadLevel =
    engineP.castleLoadLevel ||
    runtimeP.castleLoadLevel ||
    workerP.castleLoadLevel ||
    submissionP.castleLoadLevel ||
    packetsP.castleLoadLevel ||
    cellP.castleLoadLevel ||
    connectorP.castleLoadLevel ||
    castle.loadLevel ||
    0;

  return {
    bandPresence:
      engineP.bandPresence ||
      runtimeP.bandPresence ||
      workerP.bandPresence ||
      submissionP.bandPresence ||
      packetsP.bandPresence ||
      cellP.bandPresence ||
      connectorP.bandPresence ||
      gh.bandPresence ||
      "unknown",
    routerPresence:
      engineP.routerPresence ||
      runtimeP.routerPresence ||
      workerP.routerPresence ||
      submissionP.routerPresence ||
      packetsP.routerPresence ||
      cellP.routerPresence ||
      connectorP.routerPresence ||
      gh.routerPresence ||
      "unknown",
    devicePresence:
      engineP.devicePresence ||
      runtimeP.devicePresence ||
      workerP.devicePresence ||
      submissionP.devicePresence ||
      packetsP.devicePresence ||
      cellP.devicePresence ||
      connectorP.devicePresence ||
      gh.devicePresence ||
      "unknown",
    meshPresence:
      engineP.meshPresence ||
      runtimeP.meshPresence ||
      workerP.meshPresence ||
      submissionP.meshPresence ||
      packetsP.meshPresence ||
      cellP.meshPresence ||
      connectorP.meshPresence ||
      mesh.meshStrength ||
      "unknown",
    castlePresence:
      engineP.castlePresence ||
      runtimeP.castlePresence ||
      workerP.castlePresence ||
      submissionP.castlePresence ||
      packetsP.castlePresence ||
      cellP.castlePresence ||
      connectorP.castlePresence ||
      castle.castlePresence ||
      "unknown",
    regionPresence:
      engineP.regionPresence ||
      runtimeP.regionPresence ||
      workerP.regionPresence ||
      submissionP.regionPresence ||
      packetsP.regionPresence ||
      cellP.regionPresence ||
      connectorP.regionPresence ||
      region.regionTag ||
      "unknown",
    regionId:
      engineP.regionId ||
      runtimeP.regionId ||
      workerP.regionId ||
      submissionP.regionId ||
      packetsP.regionId ||
      cellP.regionId ||
      connectorP.regionId ||
      region.regionId ||
      "unknown-region",
    castleId:
      engineP.castleId ||
      runtimeP.castleId ||
      workerP.castleId ||
      submissionP.castleId ||
      packetsP.castleId ||
      cellP.castleId ||
      connectorP.castleId ||
      castle.castleId ||
      "unknown-castle",
    castleLoadLevel,
    meshStrength:
      engineP.meshStrength ||
      runtimeP.meshStrength ||
      workerP.meshStrength ||
      submissionP.meshStrength ||
      packetsP.meshStrength ||
      cellP.meshStrength ||
      connectorP.meshStrength ||
      mesh.meshStrength ||
      0,
    meshPressureIndex
  };
}

function buildAdvantageField(report, globalHints = {}) {
  const engineA = safeAdvantageFrom(report.engine);
  const runtimeA = safeAdvantageFrom(report.runtime);
  const workerA = safeAdvantageFrom(report.worker);
  const submissionA = safeAdvantageFrom(report.submission);
  const packetsA = safeAdvantageFrom(report.packets);
  const cellA = safeAdvantageFrom(report.cell);
  const connectorA = safeAdvantageFrom(report.connector);
  const ghAdv = globalHints.advantageContext || {};

  return {
    advantageScore:
      engineA.advantageScore ??
      runtimeA.advantageScore ??
      workerA.advantageScore ??
      submissionA.advantageScore ??
      packetsA.advantageScore ??
      cellA.advantageScore ??
      connectorA.advantageScore ??
      ghAdv.score ??
      0,
    advantageBand:
      engineA.advantageBand ??
      runtimeA.advantageBand ??
      workerA.advantageBand ??
      submissionA.advantageBand ??
      packetsA.advantageBand ??
      cellA.advantageBand ??
      connectorA.advantageBand ??
      ghAdv.band ??
      "neutral",
    advantageTier:
      engineA.advantageTier ??
      runtimeA.advantageTier ??
      workerA.advantageTier ??
      submissionA.advantageTier ??
      packetsA.advantageTier ??
      cellA.advantageTier ??
      connectorA.advantageTier ??
      ghAdv.tier ??
      0
  };
}

function buildHintsField(report, globalHints = {}) {
  const engineH = safeHintsFrom(report.engine);
  const runtimeH = safeHintsFrom(report.runtime);
  const workerH = safeHintsFrom(report.worker);
  const submissionH = safeHintsFrom(report.submission);
  const packetsH = safeHintsFrom(report.packets);
  const cellH = safeHintsFrom(report.cell);
  const connectorH = safeHintsFrom(report.connector);

  const gh = {
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0,
    chunkHints: globalHints.chunkHints || {},
    cacheHints: globalHints.cacheHints || {},
    prewarmHints: globalHints.prewarmHints || {},
    coldStartHints: globalHints.coldStartHints || {}
  };

  return {
    fallbackBandLevel:
      engineH.fallbackBandLevel ??
      runtimeH.fallbackBandLevel ??
      workerH.fallbackBandLevel ??
      submissionH.fallbackBandLevel ??
      packetsH.fallbackBandLevel ??
      cellH.fallbackBandLevel ??
      connectorH.fallbackBandLevel ??
      gh.fallbackBandLevel ??
      0,
    chunkHints: {
      ...gh.chunkHints,
      ...(engineH.chunkHints || {}),
      ...(runtimeH.chunkHints || {}),
      ...(workerH.chunkHints || {}),
      ...(submissionH.chunkHints || {}),
      ...(packetsH.chunkHints || {}),
      ...(cellH.chunkHints || {}),
      ...(connectorH.chunkHints || {})
    },
    cacheHints: {
      ...gh.cacheHints,
      ...(engineH.cacheHints || {}),
      ...(runtimeH.cacheHints || {}),
      ...(workerH.cacheHints || {}),
      ...(submissionH.cacheHints || {}),
      ...(packetsH.cacheHints || {}),
      ...(cellH.cacheHints || {}),
      ...(connectorH.cacheHints || {})
    },
    prewarmHints: {
      ...gh.prewarmHints,
      ...(engineH.prewarmHints || {}),
      ...(runtimeH.prewarmHints || {}),
      ...(workerH.prewarmHints || {}),
      ...(submissionH.prewarmHints || {}),
      ...(packetsH.prewarmHints || {}),
      ...(cellH.prewarmHints || {}),
      ...(connectorH.prewarmHints || {})
    },
    coldStartHints: {
      ...gh.coldStartHints,
      ...(engineH.coldStartHints || {}),
      ...(runtimeH.coldStartHints || {}),
      ...(workerH.coldStartHints || {}),
      ...(submissionH.coldStartHints || {}),
      ...(packetsH.coldStartHints || {}),
      ...(cellH.coldStartHints || {}),
      ...(connectorH.coldStartHints || {})
    }
  };
}

function classifyPressureTier(presenceField, errorCount) {
  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);
  const pressure = mesh + castle + errorCount * 20; // deterministic composite

  if (pressure >= 180) return "critical";
  if (pressure >= 120) return "high";
  if (pressure >= 60) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}


// ============================================================================
// runHealthCheck() — immune surveillance scan (presence-aware, binary-first)
// ============================================================================
export function runHealthCheck(globalHints = {}) {
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

    // Binary-first error surface
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

    // Presence / Advantage / Hints aggregation
    const presenceField = buildPresenceField(report, globalHints);
    const advantageField = buildAdvantageField(report, globalHints);
    const hintsField = buildHintsField(report, globalHints);

    const pressureTier = classifyPressureTier(presenceField, errorCount);

    immuneState.lastPresenceField = presenceField;
    immuneState.lastAdvantageField = advantageField;
    immuneState.lastHintsField = hintsField;

    // Binary surface (binary-first, presence-aware)
    const surface =
      errorCount * 100 +
      immuneCycle +
      (presenceField.meshPressureIndex || 0) +
      (presenceField.castleLoadLevel || 0);

    const binaryField = {
      binaryImmuneSignature: computeHash(`BIMMUNE::${surface}`),
      binarySurfaceSignature: computeHash(`BSURF_IMMUNE::${surface}`),
      binarySurface: {
        errorCount,
        cycle: immuneCycle,
        meshPressureIndex: presenceField.meshPressureIndex,
        castleLoadLevel: presenceField.castleLoadLevel,
        surface
      },
      parity: surface % 2 === 0 ? 0 : 1,
      density: errorCount,
      shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
    };
    immuneState.lastBinaryField = binaryField;

    // Wave-Theory Metadata (secondary structural field, presence-aware)
    const waveField = {
      amplitude: errorCount + (presenceField.meshStrength || 0),
      wavelength: immuneCycle,
      phase:
        (errorCount +
          immuneCycle +
          (presenceField.meshPressureIndex || 0)) % 8,
      band: derivedBand,
      mode: derivedBand === "binary" ? "compression-wave" : "symbolic-wave"
    };
    immuneState.lastWaveField = waveField;

    // Presence-aware immune profiles
    const immunePressureProfile = {
      pressureTier,
      errorCount,
      band: derivedBand,
      meshPressureIndex: presenceField.meshPressureIndex,
      castleLoadLevel: presenceField.castleLoadLevel,
      advantageTier: advantageField.advantageTier,
      fallbackBandLevel: hintsField.fallbackBandLevel
    };

    const binaryProfile = {
      binaryField,
      pressureTier
    };

    const waveProfile = {
      waveField,
      pressureTier
    };

    immuneState.lastImmunePressureProfile = immunePressureProfile;
    immuneState.lastBinaryProfile = binaryProfile;
    immuneState.lastWaveProfile = waveProfile;

    immuneState.lastImmuneSignature = buildImmuneSignature(
      immuneCycle,
      derivedBand,
      pressureTier,
      errorCount
    );
    immuneState.lastDriftSignature = buildDriftSignature(report);

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
        pressureTier,
        presenceField,
        advantageField,
        hintsField,
        immunePressureProfile,
        binaryProfile,
        waveProfile,
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
      pressureTier,
      presenceField,
      advantageField,
      hintsField,
      immunePressureProfile,
      binaryProfile,
      waveProfile,
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
      immuneSignature: buildImmuneSignature(
        immuneCycle,
        derivedBand,
        "error",
        1
      ),
      band: derivedBand,
      binaryField,
      waveField,
      cycleIndex: immuneCycle,
      ...PULSE_EARN_IMMUNE_CONTEXT
    };
  }
}


// ============================================================================
// runRepair() — immune response (dual-band aware genetic repair)
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
// getPulseEarnImmuneState() — immune memory export
// ============================================================================
export function getPulseEarnImmuneState() {
  return { ...immuneState };
}
