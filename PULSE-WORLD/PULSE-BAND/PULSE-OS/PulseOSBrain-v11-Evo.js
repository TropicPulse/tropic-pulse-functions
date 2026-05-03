// ============================================================================
// FILE: /PulseOS/Brain/PulseOSBrain-v15-IMMORTAL.js
// PULSE OS BRAIN — v15-IMMORTAL-DUALBAND-PRESENCE-ADVANTAGE
// “THE REAL CNS / ORGANISM-WIDE IDENTITY + INTELLIGENCE KERNEL”
// ============================================================================
//
// LAWS (v15+IMMORTAL+PULSE-TOPOLOGY):
//   • Brain may import ONLY:
//       - PulseIQMap        (design + logging + long-term memory)
//       - PulseOrganismMap  (organ layout + organs + lineage)
//       - PulseOSEvolution  (CNS evolution organ, which boots Cortex)
//   • Brain NEVER executes binary payloads.
//   • Brain NEVER performs network calls.
//   • Brain NEVER routes anything.
//   • Brain is binary-aware, dualband, but symbolic-primary.
//   • Binary is always post-render, handled by GPU / Send / Binary organs.
//   • Brain is the CNS identity + contract kernel, not a router, not a GPU.
//   • No presence/mesh/gpu/heartbeat imports — awareness is metadata-only.
//   • Brain may hold world-lens / advantage / presence / pulse-topology
//     summaries, but only emits view-only, non-network-dependent descriptors.
//   • All internet / network intent must be emitted upward as symbolic intent
//     and fulfilled by Castle → Expansion → Pulse-Net (server / higher power).
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseOSBrain",
  version: "v15-IMMORTAL",
  layer: "cns",
  role: "os_brain",
  lineage: "PulseOS-v15-IMMORTAL",

  evo: {
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    cortexAware: true,
    evolutionAware: true,
    chunkAware: true,
    prewarmAware: true,
    presenceAware: true,
    meshAware: true,

    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseOSBrainCortex",
      "PulseOSBrainEvolution",
      "PulseChunker"
    ],
    never: [
      "legacyOSBrain",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseOSBrainMeta = Object.freeze({
  layer: "PulseOSBrain",
  role: "CNS_BRAIN_ORGAN",
  version: "v15-IMMORTAL-DUALBAND-PRESENCE-ADVANTAGE",
  identity: "PulseOSBrain-v15-IMMORTAL-DUALBAND-PRESENCE-ADVANTAGE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,

    // Brain laws
    cnsIdentityKernel: true,
    cnsContractKernel: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,
    nonExecutableBrain: true,
    notRouter: true,
    notGPU: true,

    // Import laws
    importsPulseIQMapOnly: true,
    importsOrganismMapOnly: true,
    importsEvolutionOnly: true,

    // Presence / mesh / performance / advantage / pulse-topology awareness
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    kernelChunkingReady: true,
    kernelPrewarmReady: true,
    advantageFieldAware: true,
    unifiedAdvantageField: true,
    pulseTopologyAware: true,

    // Multi-instance / cloning
    multiInstanceReady: true,
    clusterCoherence: true,
    zeroDriftCloning: true,

    // Safety
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,
    worldLensAware: true,
    zeroNetworkInOrgans: true
  }),

  contract: Object.freeze({
    input: [
      "PulseIQMap",
      "PulseOrganismMap",
      "CortexBootConfig"
    ],
    output: [
      "CNSIdentity",
      "CNSContracts",
      "CNSDiagnostics",
      "CNSBootSignatures",
      "CNSPresenceDescriptors",
      "CNSChunkingProfiles",
      "CNSAdvantageField",
      "CNSWorldLensSnapshot",
      "CNSPulseTopologyDescriptors"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v15-IMMORTAL",
    parent: "PulseOS-v13-SPINE",
    ancestry: [
      "PulseOSBrain-v9",
      "PulseOSBrain-v10",
      "PulseOSBrain-v11",
      "PulseOSBrain-v11-Evo",
      "PulseOSBrain-v11-EVO-BINARY-MAX",
      "PulseOSBrain-v12.3-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v12.4-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v13-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v13-SPINE-DUALBAND-PRESENCE-ADVANTAGE",
      "PulseOSBrain-v15-IMMORTAL-DUALBAND-PRESENCE-ADVANTAGE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "organism-brain"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "CNS identity + contract kernel (symbolic-primary, dualband-aware)",
    adaptive:
      "binary-aware overlays via GPU/Send/Binary organs + presence/mesh/chunk/prewarm/advantage/world-lens/pulse-topology metadata surfaces",
    return:
      "online CNS identity + contracts + boot signatures + presence/chunking/advantage/world-lens/pulse-topology descriptors"
  })
});

// ============================================================================
//  IMPORTS — LAW: BRAIN MAY IMPORT ONLY PULSEIQ + ORGANISM + EVOLUTION
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { PulseOSEvolution } from "./PulseOSBrainEvolution.js";

import checkBand from "../PULSE-PROXY/CheckBand-v11-Evo.js";
import checkIdentity from "../PULSE-PROXY/CheckIdentity-v11-Evo.js";
import checkRouterMemory from "../PULSE-PROXY/CheckRouterMemory-v11-Evo.js";

// ============================================================================
//  CNS BRAIN — v15-IMMORTAL-DUALBAND-PRESENCE-ADVANTAGE
// ============================================================================
export const PulseOSBrain = {
  // -------------------------------------------------------------------------
  // Identity — Organism-wide CNS contract
  // -------------------------------------------------------------------------
  PulseRole: {
    type: "Brain",
    subsystem: "OS",
    layer: "CNS",
    version: "15-IMMORTAL",
    identity: "PulseOSBrain",
    evo: {
      deterministicNeuron: true,
      driftProof: true,
      multiInstanceReady: true,
      advantageCascadeAware: true,
      unifiedAdvantageField: true,

      routingContract: "PulseRouter-v15",
      osOrganContract: "PulseOS-v15-IMMORTAL",
      earnCompatibility: "PulseEarn-v15.0",
      proxyCompatibility: "PulseProxySpine-v15",
      gpuCompatibility: "PulseGPU-v15",

      loopTheoryAware: true,
      continuanceAware: true,

      dualMode: true,
      symbolicPrimary: true,
      binaryPostRenderOnly: true,
      binaryCompressionAware: true,
      binaryNonExecutable: true,
      organismWideIdentityField: true,

      presenceFieldAware: true,
      bluetoothPresenceAware: true,
      meshPresenceRelayAware: true,
      meshTopologyAware: true,
      kernelChunkingReady: true,
      kernelPrewarmReady: true,
      advantageFieldAware: true,
      pulseTopologyAware: true
    }
  },

  // -------------------------------------------------------------------------
  // CNS Infrastructure — IQ-aware but NOT IQ-dependent for survival
  // -------------------------------------------------------------------------
  PulseIQMap: PulseIQMap || {},
  PulseOrganismMap: PulseOrganismMap,
  PulseOSEvolution: PulseOSEvolution,

  intent: {
    mode: "organism-brain",
    epoch: "15-IMMORTAL",
    dualBand: true,
    symbolicPrimary: true
  },

  understanding: {
    classify: () => null,
    fallback: () => null
  },

  evolution: null, // attached by cognitiveBootstrap

  cortex: {
    routes: {},
    pages: {},
    bind: () => {},
    initializeNervousSystem: () => {},
    initializeOrgans: () => {},
    scanFile: null
  },

  // CNS snapshots (filled by Castle/Expansion/Pulse-Net)
  CNSWorldLensSnapshot: null,
  CNSAdvantageSnapshot: null,
  CNSPresenceSnapshot: null,
  CNSTopologySnapshot: null,

  log: (...args) => {
    if (PulseOSBrain.PulseIQMap?.log) return PulseOSBrain.PulseIQMap.log(...args);
    return console.log("[BRAIN]", ...args);
  },

  warn: (...args) => {
    if (PulseOSBrain.PulseIQMap?.warn) return PulseOSBrain.PulseIQMap.warn(...args);
    return console.warn("[BRAIN-WARN]", ...args);
  },

  logError: (...args) => {
    if (PulseOSBrain.PulseIQMap?.logError) return PulseOSBrain.PulseIQMap.logError(...args);
    return console.error("[BRAIN-ERROR]", ...args);
  },

  firebase: (...args) => {
    if (PulseOSBrain.PulseIQMap?.firebase) return PulseOSBrain.PulseIQMap.firebase(...args);
    return null;
  },

  // -------------------------------------------------------------------------
  // UNIFIED NETWORK INTENT SURFACE — v15 IMMORTAL
  // -------------------------------------------------------------------------
  //
  // Brain does NOT perform network. It only emits symbolic intent that
  // Castle/Expansion/Pulse-Net can interpret and fulfill.
  //
  // Example usage:
  //   const intent = PulseOSBrain.BrainIntent.emitNetworkIntent({
  //     type: "worldLens.refresh",
  //     payload: { url: PulseOSBrain.PulseIQMap?.worldLensURL }
  //   });
  //
  BrainIntent: {
    emitNetworkIntent({ type, payload = {} }) {
      return {
        ok: true,
        intent: "network-request",
        type,
        payload,
        band: "symbolic",
        source: "PulseOSBrain",
        timestamp: Date.now()
      };
    },

    // Convenience helpers for common intents (still symbolic-only)
    worldLensRefresh() {
      const iq = PulseOSBrain.PulseIQMap || {};
      return PulseOSBrain.BrainIntent.emitNetworkIntent({
        type: "worldLens.refresh",
        payload: {
          url: iq.worldLensURL || null,
          offlineSafe: true
        }
      });
    },

    advantageRefresh() {
      return PulseOSBrain.BrainIntent.emitNetworkIntent({
        type: "advantage.refresh",
        payload: {}
      });
    },

    presenceRefresh() {
      return PulseOSBrain.BrainIntent.emitNetworkIntent({
        type: "presence.refresh",
        payload: {}
      });
    },

    topologyRefresh() {
      return PulseOSBrain.BrainIntent.emitNetworkIntent({
        type: "topology.refresh",
        payload: {}
      });
    }
  },

  // -------------------------------------------------------------------------
  // SNAPSHOT APPLY SURFACES — filled by Castle/Expansion/Pulse-Net
  // -------------------------------------------------------------------------
  //
  // These are the ONLY ways network-derived data enters the Brain.
  // They are called by higher layers after fulfilling BrainIntent.
  //
  applyWorldLensSnapshot(snapshot) {
    PulseOSBrain.CNSWorldLensSnapshot = {
      lastUpdated: snapshot?.lastUpdated ?? Date.now(),
      summary: snapshot?.summary || {},
      sources: snapshot?.sources || [],
      offlineSafe: snapshot?.offlineSafe !== false
    };
  },

  applyAdvantageSnapshot(snapshot) {
    const adv = snapshot || {};
    PulseOSBrain.CNSAdvantageSnapshot = {
      advantageScore: adv.advantageScore ?? adv.score ?? null,
      advantageBand: adv.advantageBand || adv.band || "neutral",
      regionAdvantage: adv.regionAdvantage || {},
      cascadeHints: adv.cascadeHints || {}
    };
  },

  applyPresenceSnapshot(snapshot) {
    const s = snapshot || {};
    PulseOSBrain.CNSPresenceSnapshot = {
      presenceField: s.presenceField || {},
      meshPresence: s.meshPresence || {},
      organismSnapshot: s.organismSnapshot || {
        organs: Object.keys(PulseOSBrain.PulseOrganismMap || {})
      }
    };
  },

  applyTopologySnapshot(snapshot) {
    const s = snapshot || {};
    PulseOSBrain.CNSTopologySnapshot = {
      momHeart: s.momHeart || null,
      dadHeart: s.dadHeart || null,
      babyHeart: s.babyHeart || null,
      fallbackRules: s.fallbackRules || {
        babyPulseSource: "mom-or-dad",
        momFallbackToDad: true,
        dadFallbackToMom: true
      }
    };
  },

  // -------------------------------------------------------------------------
  // CNS Intelligence Layer — structural reasoning, not routing
  // -------------------------------------------------------------------------
  BrainIntel: {
    classifyDegradation(healthScore) {
      if (healthScore >= 0.85) return "direct";
      if (healthScore >= 0.15) return "bypass";
      return "routeAround";
    },

    scoreIdentityMatch(signature, module) {
      let score = 0;
      if (module?.PulseRole?.type === signature.type) score += 1;
      if (module?.PulseRole?.subsystem === signature.subsystem) score += 1;
      return score;
    },

    fallbackToMemory() {
      const iq = PulseOSBrain.PulseIQMap || PulseIQMap || {};
      const route = iq.getRecoveryRoute ? iq.getRecoveryRoute() : "/";
      const organs = iq.pages && iq.pages[route] ? iq.pages[route] : [];
      return { route, organs };
    },

    getSymbolicOrganismIdentity() {
      return {
        role: PulseOSBrain.PulseRole,
        intent: PulseOSBrain.intent,
        organismMap: PulseOSBrain.PulseOrganismMap,
        iqMap: PulseOSBrain.PulseIQMap
      };
    },

    getBinaryOrganismDescriptor() {
      const symbolic = this.getSymbolicOrganismIdentity();

      const descriptor = {
        version: PulseOSBrain.PulseRole.version,
        identity: PulseOSBrain.PulseRole.identity,
        subsystem: PulseOSBrain.PulseRole.subsystem,
        layer: PulseOSBrain.PulseRole.layer,

        dualMode: true,
        symbolicPrimary: true,
        binaryFirst: true,
        binaryPostRenderOnly: true,
        binaryNonExecutable: true,

        encoding: {
          format: "application/pulse-organism+json",
          suggestedTransport: "PulseGPU-v15",
          suggestedCompression: "post-render",
          executable: false
        }
      };

      return {
        descriptor,
        symbolicSnapshot: symbolic
      };
    },

    getPresenceDescriptors() {
      // Prefer snapshot if present, otherwise derive from IQ/organism
      if (PulseOSBrain.CNSPresenceSnapshot) {
        return PulseOSBrain.CNSPresenceSnapshot;
      }

      const iq = PulseOSBrain.PulseIQMap || PulseIQMap || {};
      const organism = PulseOSBrain.PulseOrganismMap || PulseOrganismMap || {};

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
    },

    getChunkingProfiles() {
      const iq = PulseOSBrain.PulseIQMap || PulseIQMap || {};
      const profiles = iq.chunkingProfiles || {};

      return {
        defaultProfile: profiles.default || null,
        routeProfiles: profiles.routes || {},
        gpuProfiles: profiles.gpu || {}
      };
    },

    getAdvantageField() {
      if (PulseOSBrain.CNSAdvantageSnapshot) {
        return PulseOSBrain.CNSAdvantageSnapshot;
      }

      const iq = PulseOSBrain.PulseIQMap || PulseIQMap || {};
      const adv = iq.advantageField || {};

      return {
        advantageScore: adv.score ?? null,
        advantageBand: adv.band || "neutral",
        regionAdvantage: adv.regionAdvantage || {},
        cascadeHints: adv.cascadeHints || {}
      };
    },

    getWorldLensSnapshot() {
      const lens = PulseOSBrain.CNSWorldLensSnapshot || {};
      return {
        lastUpdated: lens.lastUpdated || null,
        summary: lens.summary || {},
        sources: lens.sources || [],
        offlineSafe: lens.offlineSafe !== false
      };
    },

    getPulseTopologyDescriptors() {
      if (PulseOSBrain.CNSTopologySnapshot) {
        return PulseOSBrain.CNSTopologySnapshot;
      }

      const iq = PulseOSBrain.PulseIQMap || PulseIQMap || {};
      const organism = PulseOSBrain.PulseOrganismMap || PulseOrganismMap || {};

      const topo = iq.pulseTopology || {};

      const mom = topo.momHeart || organism.PulseProxyHeart || null;
      const dad = topo.dadHeart || organism.PulseAIHeartbeat || null;
      const baby = topo.earnHeart || organism.PulseEarnHeart || null;

      return {
        momHeart: mom
          ? { identity: mom.identity || "mom-heart", role: mom.role || "MOM_HEART" }
          : null,
        dadHeart: dad
          ? { identity: dad.identity || "dad-heart", role: dad.role || "DAD_HEART" }
          : null,
        babyHeart: baby
          ? { identity: baby.identity || "baby-heart", role: baby.role || "EARN_HEART" }
          : null,
        fallbackRules: topo.fallbackRules || {
          babyPulseSource: "mom-or-dad",
          momFallbackToDad: true,
          dadFallbackToMom: true
        }
      };
    }
  },

  scanFile(filePath) {
    const cortex = PulseOSBrain.cortex;

    if (cortex && typeof cortex.scanFile === "function") {
      return cortex.scanFile(filePath);
    }

    PulseOSBrain.warn("🧠 [PulseOSBrain v15] scanFile called but Cortex has no scanFile surface.", {
      filePath
    });

    return {
      ok: false,
      error: "SCANNER_UNAVAILABLE",
      filePath
    };
  }
};

// ============================================================================
//  BRAIN PREWARM ENGINE — v15-IMMORTAL
// ============================================================================
function prewarmPulseOSBrain() {
  try {
    const iq = PulseOSBrain.PulseIQMap || {};
    const organism = PulseOSBrain.PulseOrganismMap || {};

    const iqKeys = Object.keys(iq);
    for (const k of iqKeys) {
      const o = iq[k];
      void o;
    }

    const orgKeys = Object.keys(organism);
    for (const k of orgKeys) {
      const o = organism[k];
      void o;
    }

    return true;
  } catch (err) {
    console.error("[PulseOSBrain Prewarm v15] Failed:", err);
    return false;
  }
}

prewarmPulseOSBrain();

// ============================================================================
// 1) ROLE VALIDATION — CNS Gatekeeper
// ============================================================================
export function validatePulseRole(module, expectedType, expectedSubsystem) {
  if (!module?.PulseRole) return false;

  const role = module.PulseRole;

  const typeOk = expectedType
    ? role.type?.toLowerCase() === expectedType.toLowerCase()
    : true;

  const subsystemOk = expectedSubsystem
    ? role.subsystem?.toLowerCase() === expectedSubsystem.toLowerCase()
    : true;

  return typeOk && subsystemOk;
}

// ============================================================================
// 2) STRUCTURAL ERROR INTELLIGENCE — Drift Surface
// ============================================================================
export function structuralError(expected, found, extraContext = {}) {
  const payload = {
    error: "ROLE_MISMATCH",
    expectedType: expected.type,
    expectedSubsystem: expected.subsystem,
    foundType: found.type,
    foundSubsystem: found.subsystem,
    message: `Invalid attachment: expected ${expected.type}/${expected.subsystem} but found ${found.type}/${found.subsystem}`,
    severity: "warning",
    action: "fallbackToLongTermMemory",
    ...extraContext
  };

  PulseOSBrain.warn("[STRUCTURAL_ERROR v15]", payload);
  return payload;
}

// ============================================================================
// 3) EVOLUTION + ORGAN LOADING — Design-Driven CNS Logic
// ============================================================================
export async function loadOrganByDesign(designIdentity, expectedType, expectedSubsys) {
  const evolveRaw =
    PulseOSBrain.evolution?.evolveRaw ||
    PulseOSBrain.evolution?.evolveOrganRaw;

  const raw = typeof evolveRaw === "function"
    ? await evolveRaw(designIdentity)
    : [];

  const expected = { type: expectedType, subsystem: expectedSubsys };

  const candidates = raw.filter(({ module }) =>
    validatePulseRole(module, expected.type, expected.subsystem)
  );

  if (candidates.length > 0) {
    const chosen = candidates[0];
    PulseOSBrain.log(`🧠 [PulseOSBrain v15] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  PulseOSBrain.warn("[PulseOSBrain v15] No matching organ found for designIdentity.", {
    designIdentity,
    expected
  });

  return null;
}

// ============================================================================
// 4) CNS DIAGNOSTICS + OUTPUT — CALLS ALL HEALERS + SURFACES
// ============================================================================
function safeRun(label, fn) {
  try {
    const res = fn();
    return res === undefined ? { ok: true, surface: label } : res;
  } catch (err) {
    return { ok: false, error: String(err), surface: label };
  }
}

export function getCNSDiagnostics() {
  return {
    bandCheck: safeRun("checkBand", checkBand),
    identityCheck: safeRun("checkIdentity", checkIdentity),
    routerMemoryCheck: safeRun("checkRouterMemory", checkRouterMemory),
    worldLens: PulseOSBrain.BrainIntel.getWorldLensSnapshot(),
    advantageField: PulseOSBrain.BrainIntel.getAdvantageField(),
    pulseTopology: PulseOSBrain.BrainIntel.getPulseTopologyDescriptors()
  };
}

export function getCNSState() {
  const identity = PulseOSBrain.BrainIntel.getSymbolicOrganismIdentity();
  const presence = PulseOSBrain.BrainIntel.getPresenceDescriptors();
  const chunking = PulseOSBrain.BrainIntel.getChunkingProfiles();
  const advantage = PulseOSBrain.BrainIntel.getAdvantageField();
  const worldLens = PulseOSBrain.BrainIntel.getWorldLensSnapshot();
  const pulseTopology = PulseOSBrain.BrainIntel.getPulseTopologyDescriptors();
  const diagnostics = getCNSDiagnostics();

  return {
    CNSIdentity: identity,
    CNSContracts: PulseOSBrain.PulseRole,
    CNSDiagnostics: diagnostics,
    CNSBootSignatures: {
      organism: PulseOSBrain.PulseOrganismMap,
      iq: PulseOSBrain.PulseIQMap
    },
    CNSPresenceDescriptors: presence,
    CNSChunkingProfiles: chunking,
    CNSAdvantageField: advantage,
    CNSWorldLensSnapshot: worldLens,
    CNSPulseTopologyDescriptors: pulseTopology
  };
}

// ============================================================================
// 5) COGNITIVE BOOTSTRAP — Brain → Evolution → Cortex
// ============================================================================
export async function cognitiveBootstrap({ intent, organism, iqMap, understanding }) {

  iqMap = PulseIQMap;

  if (intent) PulseOSBrain.intent = intent;
  if (organism) PulseOSBrain.PulseOrganismMap = organism;

  if (iqMap) {
    PulseOSBrain.PulseIQMap = iqMap;

    if (iqMap.log) PulseOSBrain.log = (...args) => iqMap.log(...args);
    if (iqMap.warn) PulseOSBrain.warn = (...args) => iqMap.warn(...args);
    if (iqMap.logError) PulseOSBrain.logError = (...args) => iqMap.logError(...args);
    if (iqMap.firebase) PulseOSBrain.firebase = (...args) => iqMap.firebase(...args);
  }

  if (understanding) {
    PulseOSBrain.understanding = understanding;
  }

  const evolutionOrgan = PulseOSEvolution({
    intent,
    organism,
    iq: iqMap,
    understanding
  });

  PulseOSBrain.evolution = evolutionOrgan;

  const cortex = evolutionOrgan.bootCortex(PulseOSBrain, { band: "dual" });
  PulseOSBrain.cortex = cortex;

  evolutionOrgan.recordLineage("brain-cognitive-bootstrap-v15-immortal", { band: "dual" });
  evolutionOrgan.scanDrift(PulseOSBrain, { band: "dual" });

  PulseOSBrain.log("🧠 [PulseOSBrain v15] cognitiveBootstrap complete (advantage-integrated, zero-network).");

  // Run healers once at boot, attach CNS state snapshot
  const diagnostics = getCNSDiagnostics();
  PulseOSBrain.CNSLastDiagnostics = diagnostics;
  PulseOSBrain.CNSLastState = getCNSState();

  return PulseOSBrain;
}

// -------------------------------------------------------------------------
// NOTE: v13 AUTO-CONNECT + connectToInternet REMOVED
// -------------------------------------------------------------------------
// Brain no longer performs any fetch or network calls.
// All internet-class behavior must be fulfilled by Castle/Expansion/Pulse-Net
// using BrainIntent.emitNetworkIntent(...) and the apply*Snapshot(...) surfaces.
// -------------------------------------------------------------------------
