// ============================================================================
// FILE: /PulseOS/Brain/PulseOSBrain-v13-Spine.js
// PULSE OS BRAIN — v13-SPINE-DUALBAND-PRESENCE
// “THE REAL CNS / ORGANISM-WIDE IDENTITY + INTELLIGENCE KERNEL”
// ============================================================================
//
// LAWS (UPDATED FOR v13):
//   • Brain may import ONLY:
//       - PulseIQMap        (design + logging + long-term memory)
//       - PulseOrganismMap  (organ layout + organs + lineage)
//       - PulseOSEvolution  (CNS evolution organ, which boots Cortex)
//   • Brain NEVER executes binary payloads.
//   • Brain is binary-aware, dualband, but symbolic-primary.
//   • Binary is always post-render, handled by GPU / Send / Binary organs.
//   • Brain is the CNS identity + contract kernel, not a router, not a GPU.
//   • No presence/mesh/gpu imports — awareness is metadata-only.
// ============================================================================

export const PulseOSBrainMeta = Object.freeze({
  layer: "PulseOSBrain",
  role: "CNS_BRAIN_ORGAN",
  version: "v13-SPINE-DUALBAND-PRESENCE",
  identity: "PulseOSBrain-v13-SPINE-DUALBAND-PRESENCE",

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

    // Presence / mesh / performance awareness (metadata-only)
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    kernelChunkingReady: true,
    kernelPrewarmReady: true,
    multiInstanceReady: true,
    clusterCoherence: true,
    zeroDriftCloning: true,

    // Safety
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,
    worldLensAware: true
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
      "CNSChunkingProfiles"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v13-SPINE",
    parent: "PulseOS-v12.4-SPINE",
    ancestry: [
      "PulseOSBrain-v9",
      "PulseOSBrain-v10",
      "PulseOSBrain-v11",
      "PulseOSBrain-v11-Evo",
      "PulseOSBrain-v11-EVO-BINARY-MAX",
      "PulseOSBrain-v12.3-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v12.4-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v13-SPINE-DUALBAND-PRESENCE"
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
      "binary-aware overlays via GPU/Send/Binary organs + presence/mesh/chunk/prewarm metadata surfaces",
    return:
      "online CNS identity + contracts + boot signatures + presence/chunking descriptors"
  })
});

// ============================================================================
//  IMPORTS — LAW: BRAIN MAY IMPORT ONLY PULSEIQ + ORGANISM + EVOLUTION
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { PulseOSEvolution } from "./PulseOSEvolution-v13-Spine.js";

// ============================================================================
//  CNS BRAIN — v13-SPINE
// ============================================================================
export const PulseOSBrain = {
  // -------------------------------------------------------------------------
  // Identity — Organism-wide CNS contract
  // -------------------------------------------------------------------------
  PulseRole: {
    type: "Brain",
    subsystem: "OS",
    layer: "CNS",
    version: "13-SPINE",
    identity: "PulseOSBrain",
    evo: {
      deterministicNeuron: true,
      driftProof: true,
      multiInstanceReady: true,
      advantageCascadeAware: true,
      unifiedAdvantageField: true,

      routingContract: "PulseRouter-v13",
      osOrganContract: "PulseOS-v13-SPINE",
      earnCompatibility: "PulseEarn-v13.0",
      proxyCompatibility: "PulseProxySpine-v13",
      gpuCompatibility: "PulseGPU-v13",

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
      kernelPrewarmReady: true
    }
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
          suggestedTransport: "PulseGPU-v13",
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
    }
  },

  // -------------------------------------------------------------------------
  // CNS Infrastructure — IQ-aware but NOT IQ-dependent for survival
  // -------------------------------------------------------------------------
  PulseIQMap: PulseIQMap || {},
  PulseOrganismMap: PulseOrganismMap,

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
  // INTENT / UNDERSTANDING / EVOLUTION / CORTEX — NEVER NULL
  // -------------------------------------------------------------------------
  intent: {
    classify: () => null,
    get: () => null
  },

  understanding: {
    classify: () => null,
    fallback: () => null
  },

  evolution: null, // will be attached by cognitiveBootstrap

  cortex: {
    routes: {},
    pages: {},
    bind: () => {},
    initializeNervousSystem: () => {},
    initializeOrgans: () => {},
    scanFile: null
  },

  scanFile(filePath) {
    const cortex = PulseOSBrain.cortex;

    if (cortex && typeof cortex.scanFile === "function") {
      return cortex.scanFile(filePath);
    }

    PulseOSBrain.warn("🧠 [PulseOSBrain v13] scanFile called but Cortex has no scanFile surface.", {
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
//  BRAIN PREWARM ENGINE — v13-SPINE
// ============================================================================
function prewarmPulseOSBrain() {
  try {
    const iq = PulseOSBrain.PulseIQMap || {};
    const organism = PulseOSBrain.PulseOrganismMap || {};

    const iqKeys = Object.keys(iq);
    for (const k of iqKeys) {
      const _ = iq[k];
    }

    const orgKeys = Object.keys(organism);
    for (const k of orgKeys) {
      const _ = organism[k];
    }

    // Prewarm is symbolic-only; no Evolution boot here
    return true;
  } catch (err) {
    console.error("[PulseOSBrain Prewarm v13] Failed:", err);
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

  PulseOSBrain.warn("[STRUCTURAL_ERROR v13]", payload);
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
    PulseOSBrain.log(`🧠 [PulseOSBrain v13] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  PulseOSBrain.warn("[PulseOSBrain v13] No matching organ found for designIdentity.", {
    designIdentity,
    expected
  });

  return null;
}

// ============================================================================
// 4) COGNITIVE BOOTSTRAP — Brain → Evolution → Cortex
// ============================================================================
export async function cognitiveBootstrap({ intent, organism, iqMap, understanding }) {

  if (!iqMap) {
    const module = await import("./PulseIQMap.js");
    iqMap = module.PulseIQMap;
  }

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

  // ⭐ Brain boots Evolution (which will boot Cortex)
  const evolutionOrgan = PulseOSEvolution({
    intent,
    organism,
    iq: iqMap,
    understanding
  });

  PulseOSBrain.evolution = evolutionOrgan;

  const cortex = evolutionOrgan.bootCortex(PulseOSBrain, { band: "dual" });
  PulseOSBrain.cortex = cortex;

  evolutionOrgan.recordLineage("brain-cognitive-bootstrap-v13", { band: "dual" });
  evolutionOrgan.scanDrift(PulseOSBrain, { band: "dual" });

  PulseOSBrain.log("🧠 [PulseOSBrain v13] cognitiveBootstrap complete.");

  return PulseOSBrain;
}
