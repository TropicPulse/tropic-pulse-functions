// ============================================================================
// FILE: /PulseOS/Brain/PulseOSEvolution-v13-Spine.js
// PULSE OS — v13-SPINE-DUALBAND-PRESENCE
// “THE EVOLUTION ENGINE — ORGANISM-WIDE CNS GROWTH + DRIFT INTELLIGENCE”
// ============================================================================
//
// ROLE IN THE ORGANISM (v13):
// ---------------------------
// • Brain → Evolution → Cortex (final architecture)
// • Evolution is the FIRST organ Brain boots
// • Evolution attaches maps + understanding to Brain
// • Evolution attaches itself to Brain.evolution
// • Evolution boots Cortex (Brain no longer boots Cortex)
// • Provides drift detection + lineage + organism health
// • Pure symbolic-primary, deterministic, zero network, zero filesystem
// ============================================================================

export const PulseRole = {
  type: "Evolution",
  subsystem: "OS",
  layer: "CNS",
  version: "13-Spine",
  identity: "PulseOSEvolution-v13-SPINE-DUALBAND-PRESENCE",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    loopTheoryAware: true,
    continuanceAware: true,

    routingContract: "PulseRouter-v13",
    osOrganContract: "PulseOS-v13-SPINE",
    earnCompatibility: "PulseEarn-v13",
    gpuCompatibility: "PulseGPU-v13",
    sendCompatibility: "PulseSendSystem-v13",

    dualMode: true,
    symbolicPrimary: true,
    binaryAware: true,
    binaryNonExecutable: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true,

    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true
  }
};

export const PulseOSEvolutionMeta = Object.freeze({
  layer: "PulseOSEvolution",
  role: "CNS_EVOLUTION_ORGAN",
  version: "v13-SPINE-DUALBAND-PRESENCE",
  identity: "PulseOSEvolution-v13-SPINE-DUALBAND-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    cnsEvolutionEngine: true,
    organismEvolutionEngine: true,
    organEvolutionEngine: true,
    lineageTracker: true,
    driftScanner: true,
    structuralDriftAware: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,
    binaryNonExecutable: true,
    futureEvolutionReady: true,

    attachesIntentToBrain: true,
    attachesOrganismMapToBrain: true,
    attachesIQMapToBrain: true,
    attachesEvolutionToBrain: true,
    bootsCortex: true,

    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroDateNow: true,
    zeroUserCode: true,
    worldLensAware: true,

    loopTheoryAware: true,
    continuanceAware: true
  })
});

// Cortex is ONLY imported here — NOT in Brain
import { createPulseOSCortex } from "./PulseOSBrainCortex.js";

// ============================================================================
//  EVOLUTION ENGINE — v13
// ============================================================================
export function PulseOSEvolution({ intent, organism, iq, understanding }) {

  let seq = 0;
  const nextSeq = () => ++seq;

  // --------------------------------------------------------------------------
  // Presence + chunking metadata
  // --------------------------------------------------------------------------
  function computePresenceDescriptors() {
    const presenceConfig = iq?.presenceConfig || {};
    const meshConfig = iq?.meshPresenceConfig || {};

    return {
      presenceField: {
        enabled: !!presenceConfig.enabled,
        bluetoothPreferred: !!presenceConfig.bluetoothPreferred,
        routes: presenceConfig.routes || []
      },
      meshPresence: {
        enabled: !!meshConfig.enabled,
        topology: meshConfig.topology || "none",
        routes: meshConfig.routes || []
      },
      organismSnapshot: {
        organs: organism ? Object.keys(organism) : []
      }
    };
  }

  function computeChunkingProfiles() {
    const profiles = iq?.chunkingProfiles || {};
    return {
      defaultProfile: profiles.default || null,
      routeProfiles: profiles.routes || {},
      gpuProfiles: profiles.gpu || {}
    };
  }

  // --------------------------------------------------------------------------
  // Drift + lineage state
  // --------------------------------------------------------------------------
  const DriftState = {
    lineage: [],
    driftEvents: [],
    organHealth: {},
    organismHealth: 1.0,
    lastScanSeq: null,
    lastScanBand: "dual",
    binaryDescriptor: null,
    presenceDescriptors: computePresenceDescriptors(),
    chunkingProfiles: computeChunkingProfiles()
  };

  function normalizeBand(band) {
    return (band === "binary" || band === "symbolic" || band === "dual")
      ? band
      : "dual";
  }

  // --------------------------------------------------------------------------
  // DRIFT SCANNER
  // --------------------------------------------------------------------------
  function scanDrift(Brain, { band = "dual", dnaTag = null } = {}) {
    const normBand = normalizeBand(band);
    const drift = [];

    if (!Brain.intent) drift.push("missing-intent-map");
    if (!Brain.PulseOrganismMap) drift.push("missing-organism-map");
    if (!Brain.PulseIQMap) drift.push("missing-iq-map");

    const descriptor = Brain.BrainIntel?.getBinaryOrganismDescriptor?.();
    DriftState.binaryDescriptor = descriptor || null;

    DriftState.presenceDescriptors = computePresenceDescriptors();
    DriftState.chunkingProfiles = computeChunkingProfiles();

    DriftState.lastScanSeq = nextSeq();
    DriftState.lastScanBand = normBand;
    DriftState.driftEvents.push(...drift);

    DriftState.lineage.push({
      seq: DriftState.lastScanSeq,
      band: normBand,
      dnaTag,
      event: "drift-scan"
    });

    return drift;
  }

  // --------------------------------------------------------------------------
  // LINEAGE ENGINE
  // --------------------------------------------------------------------------
  function recordLineage(event, { band = "dual", dnaTag = null } = {}) {
    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event
    });
  }

  // --------------------------------------------------------------------------
  // ORGAN HEALTH ENGINE
  // --------------------------------------------------------------------------
  function updateOrganHealth(organName, score, { band = "dual", dnaTag = null } = {}) {
    DriftState.organHealth[organName] = score;

    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event: `organ-health-update:${organName}`
    });
  }

  function computeOrganismHealth({ band = "dual", dnaTag = null } = {}) {
    const values = Object.values(DriftState.organHealth);
    DriftState.organismHealth =
      values.length === 0 ? 1.0 : values.reduce((a, b) => a + b, 0) / values.length;

    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event: "organism-health-computed"
    });

    return DriftState.organismHealth;
  }

  // --------------------------------------------------------------------------
  // EVOLUTION → CORTEX BOOTSTRAP (v13)
  // --------------------------------------------------------------------------
  function bootCortex(Brain, { band = "dual", dnaTag = null } = {}) {
    const normBand = normalizeBand(band);

    // Attach maps + understanding + evolution to Brain
    Brain.intent           = intent;
    Brain.PulseOrganismMap = organism;
    Brain.PulseIQMap       = iq;
    Brain.understanding    = understanding;
    Brain.evolution        = Evolution;

    recordLineage("cortex-boot", { band: normBand, dnaTag });

    const cortex = createPulseOSCortex({ Brain });

    cortex.boot({ band: normBand });

    Brain.cortex = cortex;

    scanDrift(Brain, { band: normBand, dnaTag });

    return cortex;
  }

  // --------------------------------------------------------------------------
  // PUBLIC EVOLUTION ORGAN SURFACE
  // --------------------------------------------------------------------------
  const Evolution = {
    PulseRole,
    DriftState,
    scanDrift,
    recordLineage,
    updateOrganHealth,
    computeOrganismHealth,
    bootCortex,
    getPresenceDescriptors: () => DriftState.presenceDescriptors,
    getChunkingProfiles: () => DriftState.chunkingProfiles
  };

  return Evolution;
}
