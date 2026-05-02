// ============================================================================
// FILE: /PULSE-OS/PulseOSCortex-v13-Spine.js
// PULSE OS — v13-SPINE-DUALBAND-PRESENCE
// “THE CORTEX ORGAN — HIGH‑LEVEL COGNITION + ORGAN SUPERVISOR”
// ============================================================================
//
// ROLE (v13-SPINE-DUALBAND-PRESENCE):
// -------------------------------------
// • Receives PulseOSBrain (CNS) directly
// • Reads intent, IQ, OrganismMap from Brain
// • Reads Evolution from Brain.evolution (optional, non-blocking)
// • Initializes Nervous System + Organs (delegated to CNS Brain)
// • Maintains OS-level conscious state (symbolic-primary)
// • Reports lineage + drift to Evolution (band-tagged, optional)
// • Pure frontend, deterministic, zero timing, zero backend
// • Continuance-aware (never halts organism)
// • Dual-band aware (symbolic | binary | dual) — tagging only
// • Binary-aware but NEVER executes binary logic
// • Symbolic-primary: Cortex always thinks in symbolic mode
// • Presence-aware + mesh-aware + chunk/prewarm-aware (metadata-only)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSBrainCortex",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_cortex",
  lineage: "PulseOS-v14",

  evo: {
    cortex: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    chunkAware: true,
    prewarmAware: true,
    presenceAware: true,
    meshAware: true,

    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseOSBrain",
      "PulseOSBrainEvolution",
      "PulseChunker"
    ],
    never: [
      "legacyOSBrainCortex",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseRole = {
  type: "Cortex",            // FIXED (was incorrectly "Brain")
  subsystem: "OS",
  layer: "Cortex",
  version: "13-Spine",
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

    // v13 organism-wide contracts
    routingContract: "PulseRouter-v13",
    gpuCompatibility: "PulseGPU-v13",
    sdnCompatibility: "PulseSDN-v13",
    earnCompatibility: "PulseEarn-v13",
    sendCompatibility: "PulseSendSystem-v13",
    osOrganContract: "PulseOS-v13-SPINE",

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
  version: "v13-SPINE-DUALBAND-PRESENCE",
  identity: "PulseOSCortex-v13-SPINE-DUALBAND-PRESENCE",

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
    zeroTiming: true,
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
      "CortexPresenceDescriptors",
      "CortexChunkingProfiles"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v13-SPINE",
    parent: "PulseOS-v12.4-SPINE",
    ancestry: [
      "PulseOSCortex-v9",
      "PulseOSCortex-v10",
      "PulseOSCortex-v11",
      "PulseOSCortex-v11-Evo",
      "PulseOSCortex-v11-Evo-BinaryMax",
      "PulseOSCortex-v12.3-SPINE-DUALBAND-PRESENCE",
      "PulseOSCortex-v12.4-SPINE-DUALBAND-PRESENCE",
      "PulseOSCortex-v13-SPINE-DUALBAND-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
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



// ============================================================================
//  BOOT SURFACE — v13
// ============================================================================
export function bootCortex({ Brain, ...options } = {}) {
  if (!Brain) {
    throw new Error("PulseOSCortex v13: Missing CNS Brain injection.");
  }

  const cortex = createPulseOSCortex({ Brain });
  return cortex.boot(options);
}


// ============================================================================
//  FACTORY — Cortex receives the CNS Brain directly (v13)
// ============================================================================
export function createPulseOSCortex({ Brain }) {
  if (!Brain) {
    throw new Error("PulseOSCortex v13: Missing CNS Brain injection.");
  }

  // ⭐ The ONLY correct way Cortex sees Evolution
  const Evolution = Brain.evolution || null;

  function normalizeBand(band) {
    return (band === "binary" || band === "symbolic" || band === "dual")
      ? band
      : "dual";
  }

  function computePresenceDescriptors() {
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

  function computeChunkingProfiles() {
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

    lastScan: null,

    presenceDescriptors: computePresenceDescriptors(),
    chunkingProfiles: computeChunkingProfiles()
  };


  // ========================================================================
  //  BOOT — v13
  // ========================================================================
  function bootCortexFn({ band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    if (!CortexState.booted) {
      CortexState.booted = true;
    }

    CortexState.presenceDescriptors = computePresenceDescriptors();
    CortexState.chunkingProfiles = computeChunkingProfiles();

    // ⭐ Evolution is now correctly referenced
    Evolution?.recordLineage?.("cortex-boot-v13", { band: normBand });
    Evolution?.scanDrift?.(Brain, { band: normBand });

    Brain.log?.("[Cortex v13-SPINE] Boot complete", { CortexState });
    return CortexState;
  }


  // ========================================================================
  //  UPDATE — v13
  // ========================================================================
  function updateCortex(ctx = {}, { band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    CortexState.routeName   = ctx.routeName   ?? CortexState.routeName;
    CortexState.hasIdentity = ctx.hasIdentity ?? CortexState.hasIdentity;

    CortexState.presenceDescriptors = computePresenceDescriptors();
    CortexState.chunkingProfiles = computeChunkingProfiles();

    Evolution?.recordLineage?.("cortex-update-v13", {
      band: normBand,
      routeName: CortexState.routeName,
      hasIdentity: CortexState.hasIdentity
    });

    return CortexState;
  }


  // ========================================================================
  //  FILE SCANNING — v13
  // ========================================================================
  function scanFile(filePath) {
    const scanner =
      Brain.understanding?.fileScanner ||
      Brain.understanding?.PulseFileScanner ||
      Brain.understanding?.scanner ||
      null;

    if (!scanner || typeof scanner.scanFile !== "function") {
      Brain.warn?.("⚠️ [Cortex v13] scanFile requested but no scanner organ available.", {
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
    };

    Evolution?.recordLineage?.("cortex-scan-file-v13", { filePath });
    Evolution?.scanDrift?.(Brain, { band: CortexState.band });

    return result;
  }


  // ========================================================================
  //  PUBLIC API — v13
  // ========================================================================
  const cortexAPI = {
    boot: bootCortexFn,
    update: updateCortex,
    state: CortexState,
    isReady: () => CortexState.booted,

    scanFile,

    initializeNervousSystem() {},
    initializeOrgans() {}
  };

  return cortexAPI;
}
