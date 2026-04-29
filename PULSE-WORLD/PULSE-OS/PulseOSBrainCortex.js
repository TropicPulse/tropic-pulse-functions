// ============================================================================
// FILE: /apps/PULSE-OS/PulseOSCortex-v12.4-Spine.js
// PULSE OS — v12.4-SPINE-DUALBAND-PRESENCE
// “THE CORTEX ORGAN — HIGH‑LEVEL COGNITION + ORGAN SUPERVISOR”
// ============================================================================
//
// ROLE (v12.4-SPINE-DUALBAND-PRESENCE):
// -------------------------------------
// • Receives PulseOSBrain (CNS) directly
// • Reads intent, IQ, OrganismMap from Brain
// • Reads Evolution from Brain.evolution
// • Initializes Nervous System + Organs (delegated to CNS Brain)
// • Maintains OS-level conscious state (symbolic-primary)
// • Reports lineage + drift to Evolution (band-tagged)
// • Pure frontend, deterministic, zero timing, zero backend
// • Continuance-aware (never halts organism)
// • Dual-band aware (symbolic | binary | dual) — tagging only
// • Binary-aware but NEVER executes binary logic
// • Symbolic-primary: Cortex always thinks in symbolic mode
// • Presence-aware + mesh-aware + chunk/prewarm-aware (metadata-only)
// ============================================================================

export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "Cortex",
  version: "12.4-Spine",
  identity: "PulseOSCortex",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,
    continuanceAware: true,

    // v12.4 organism-wide contracts
    routingContract: "PulseRouter-v12.4",
    gpuCompatibility: "PulseGPU-v12.4",
    sdnCompatibility: "PulseSDN-v12.4",
    earnCompatibility: "PulseEarn-v12.0",
    sendCompatibility: "PulseSendSystem-v12.4",
    osOrganContract: "PulseOS-v12.4-SPINE",

    // Dual-band CNS
    dualMode: true,
    symbolicAware: true,
    binaryAware: true,
    symbolicPrimary: true,
    binaryNonExecutable: true,

    // Presence / mesh / chunking awareness (metadata-only)
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true
  }
};

export const PulseOSCortexMeta = Object.freeze({
  layer: "PulseOSCortex",
  role: "CORTEX_ORGAN",
  version: "v12.4-SPINE-DUALBAND-PRESENCE",
  identity: "PulseOSCortex-v12.4-SPINE-DUALBAND-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    highLevelCognition: true,
    organSupervisor: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,
    binaryNonExecutable: true,
    continuanceAware: true,
    loopTheoryAware: true,

    readsBrainDirectly: true,
    readsIntentIQOrganismMap: true,
    readsEvolutionFromBrain: true,
    reportsDriftToEvolution: true,
    reportsLineageToEvolution: true,

    // Presence / mesh / chunking (metadata-only)
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true,

    zeroBackend: true,
    zeroNetwork: true,
    zeroTiming: true,          // no Date.now()
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,
    worldLensAware: true
  }),

  contract: Object.freeze({
    input: [
      "PulseOSBrain",
      "PulseIQMap",
      "PulseOrganismMap",
      "EvolutionState",
      "DualBandContext"
    ],
    output: [
      "CortexState",
      "CortexDiagnostics",
      "CortexSignatures",
      "CortexHealingState",
      "CortexPresenceDescriptors", // presence + mesh (metadata-only)
      "CortexChunkingProfiles"     // chunk/prewarm (metadata-only)
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12.4-SPINE",
    parent: "PulseOS-v12.3-SPINE",
    ancestry: [
      "PulseOSCortex-v9",
      "PulseOSCortex-v10",
      "PulseOSCortex-v11",
      "PulseOSCortex-v11-Evo",
      "PulseOSCortex-v11-Evo-BinaryMax",
      "PulseOSCortex-v12.3-SPINE-DUALBAND-PRESENCE",
      "PulseOSCortex-v12.4-SPINE-DUALBAND-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "cortex-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "symbolic cognition → organ supervision → drift reporting",
    adaptive:
      "binary-aware tagging + dual-band metadata + presence/mesh/chunking descriptors",
    return: "deterministic cortex state + signatures + presence/chunking metadata"
  })
});

import { PulseOSEvolution as Evolution } from "./PulseOSBrainEvolution.js";

// ============================================================================
//  BOOT SURFACE — v12.4‑EVO
//  Brain calls: bootCortex({ Brain, ...options })
// ============================================================================
export function bootCortex({ Brain, ...options } = {}) {
  if (!Brain) {
    throw new Error("PulseOSCortex v12.4: Missing CNS Brain injection.");
  }

  const cortex = createPulseOSCortex({ Brain });
  return cortex.boot(options);
}


// ============================================================================
//  FACTORY — Cortex receives the CNS Brain directly (v12.4‑EVO)
// ============================================================================
export function createPulseOSCortex({ Brain }) {
  if (!Brain) {
    throw new Error("PulseOSCortex v12.4: Missing CNS Brain injection.");
  }

  // Band normalizer
  function normalizeBand(band) {
    return (band === "binary" || band === "symbolic" || band === "dual")
      ? band
      : "dual";
  }

  // Presence descriptors (IQMap → metadata)
  function computePresenceDescriptors() {
    // BrainIntel override (if present)
    if (Brain.BrainIntel?.getPresenceDescriptors) {
      return Brain.BrainIntel.getPresenceDescriptors();
    }

    const iq = Brain.PulseIQMap || {};
    const organism = Brain.PulseOrganismMap || {};

    const presenceConfig = iq.presenceConfig || {};
    const meshConfig = iq.meshPresenceConfig || {};

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
        organs: Object.keys(organism || {})
      }
    };
  }

  // Chunking profiles (IQMap → metadata)
  function computeChunkingProfiles() {
    // BrainIntel override (if present)
    if (Brain.BrainIntel?.getChunkingProfiles) {
      return Brain.BrainIntel.getChunkingProfiles();
    }

    const iq = Brain.PulseIQMap || {};
    const profiles = iq.chunkingProfiles || {};

    return {
      defaultProfile: profiles.default || null,
      routeProfiles: profiles.routes || {},
      gpuProfiles: profiles.gpu || {}
    };
  }

  // --------------------------------------------------------------------------
  // Cortex State (zero timing, zero backend)
  // --------------------------------------------------------------------------
  const CortexState = {
    booted: false,
    routeName: "main",
    hasIdentity: false,

    IntentMap: Brain.intent || null,
    IQMap: Brain.PulseIQMap || {},
    OrganismMap: Brain.PulseOrganismMap || {},

    understanding: Brain.understanding || null,

    band: "dual",
    symbolicPrimary: true,
    binaryAware: true,

    // Scanner results (symbolic-only, no timestamps)
    lastScan: null,

    // Presence / mesh / chunking (metadata-only snapshots)
    presenceDescriptors: computePresenceDescriptors(),
    chunkingProfiles: computeChunkingProfiles()
  };


  // ========================================================================
  //  BOOT — Cortex comes online AFTER PulseOSBrain (v12.4‑EVO)
  // ========================================================================
  function bootCortexFn({ band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    if (!CortexState.booted) {
      CortexState.booted = true;
    }

    // Refresh presence + chunking snapshots on boot
    CortexState.presenceDescriptors = computePresenceDescriptors();
    CortexState.chunkingProfiles = computeChunkingProfiles();

    Evolution?.recordLineage?.("cortex-boot-v12.4", { band: normBand });
    Evolution?.scanDrift?.(Brain, { band: normBand });

    Brain.log?.("[Cortex v12.4-SPINE] Boot complete", { CortexState });
    return CortexState;
  }


  // ========================================================================
  //  UPDATE — Route or identity changed (band-tagged)
  // ========================================================================
  function updateCortex(ctx = {}, { band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    CortexState.routeName   = ctx.routeName   ?? CortexState.routeName;
    CortexState.hasIdentity = ctx.hasIdentity ?? CortexState.hasIdentity;

    // Refresh presence + chunking snapshots on significant context change
    CortexState.presenceDescriptors = computePresenceDescriptors();
    CortexState.chunkingProfiles = computeChunkingProfiles();

    Evolution?.recordLineage?.("cortex-update-v12.4", {
      band: normBand,
      routeName: CortexState.routeName,
      hasIdentity: CortexState.hasIdentity
    });

    return CortexState;
  }


  // ========================================================================
  //  ⭐ FILE SCANNING — Symbolic-only, delegated to scanner organ
  //  (no Date.now, no timing; zeroTiming contract)
// ========================================================================
  function scanFile(filePath) {
    const scanner =
      Brain.understanding?.fileScanner ||
      Brain.understanding?.PulseFileScanner ||
      Brain.understanding?.scanner ||
      null;

    if (!scanner || typeof scanner.scanFile !== "function") {
      Brain.warn?.("⚠️ [Cortex v12.4] scanFile requested but no scanner organ available.", {
        filePath
      });
      return {
        ok: false,
        error: "SCANNER_NOT_AVAILABLE",
        filePath
      };
    }

    const result = scanner.scanFile(filePath);

    CortexState.lastScan = {
      filePath,
      result
      // no timestamp — zeroTiming:true
    };

    Evolution?.recordLineage?.("cortex-scan-file-v12.4", { filePath });
    Evolution?.scanDrift?.(Brain, { band: CortexState.band });

    return result;
  }


  // ========================================================================
  //  PUBLIC API
  // ========================================================================
  const cortexAPI = {
    boot: bootCortexFn,
    update: updateCortex,
    state: CortexState,
    isReady: () => CortexState.booted,

    // Symbolic-only scanner surface
    scanFile,

    // Optional hooks for Brain.cognitiveBootstrap (no-ops by default)
    initializeNervousSystem() {
      // Intentionally empty — real wiring lives in organs/Brain if needed
    },
    initializeOrgans() {
      // Intentionally empty — real wiring lives in organs/Brain if needed
    }
  };

  return cortexAPI;
}
