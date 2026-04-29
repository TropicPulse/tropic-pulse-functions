// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseOSBrain-v12.4-Spine.js
// PULSE OS BRAIN — v12.4-SPINE-DUALBAND-PRESENCE
// “THE REAL CNS / ORGANISM-WIDE IDENTITY + INTELLIGENCE KERNEL”
// ============================================================================
//
// LAWS (UNCHANGED):
//   • Brain may import ONLY:
//       - PulseIQMap        (design + logging + long-term memory)
//       - PulseOrganismMap  (organ layout + organs + lineage)
//       - PulseOSBrainCortex (Cortex boot wiring)
//   • Brain NEVER executes binary payloads.
//   • Brain is binary-aware, dualband, but symbolic-primary.
//   • Binary is always post-render, handled by GPU / Send / Binary organs.
//   • Brain is the CNS identity + contract kernel, not a router, not a GPU.
//   • No presence/mesh/gpu imports — awareness is metadata-only.
// ============================================================================

export const PulseOSBrainMeta = Object.freeze({
  layer: "PulseOSBrain",
  role: "CNS_BRAIN_ORGAN",
  version: "v12.4-SPINE-DUALBAND-PRESENCE",
  identity: "PulseOSBrain-v12.4-SPINE-DUALBAND-PRESENCE",

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
    importsCortexBootOnly: true,

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
      "CNSPresenceDescriptors",   // presence + mesh descriptors (metadata-only)
      "CNSChunkingProfiles"       // chunk/prewarm profiles (metadata-only)
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12.4-SPINE",
    parent: "PulseOS-v12.3-SPINE",
    ancestry: [
      "PulseOSBrain-v9",
      "PulseOSBrain-v10",
      "PulseOSBrain-v11",
      "PulseOSBrain-v11-Evo",
      "PulseOSBrain-v11-EVO-BINARY-MAX",
      "PulseOSBrain-v12.3-SPINE-DUALBAND-PRESENCE",
      "PulseOSBrain-v12.4-SPINE-DUALBAND-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic"],
    default: "symbolic",
    behavior: "organism-brain"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "CNS identity + contract kernel (symbolic-primary, dualband-aware)",
    adaptive:
      "binary-aware overlays via GPU/Send/Binary organs + presence/mesh + chunk/prewarm metadata surfaces",
    return:
      "online CNS identity + contracts + boot signatures + presence/chunking descriptors"
  })
});


// ============================================================================
//  IMPORTS — LAW: BRAIN MAY IMPORT ONLY PULSEIQ + ORGANISM + CORTEX
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { createPulseOSCortex as cortexAPI } from "./PulseOSBrainCortex.js";


// ============================================================================
//  CNS BRAIN — v12.4-SPINE
// ============================================================================
export const PulseOSBrain = {
  // -------------------------------------------------------------------------
  // Identity — Organism-wide CNS contract
  // -------------------------------------------------------------------------
  PulseRole: {
    type: "Brain",
    subsystem: "OS",
    layer: "CNS",
    version: "12.4-SPINE",
    identity: "PulseOSBrain",
    evo: {
      deterministicNeuron: true,
      driftProof: true,
      multiInstanceReady: true,
      advantageCascadeAware: true,
      unifiedAdvantageField: true,

      routingContract: "PulseRouter-v12.4",
      osOrganContract: "PulseOS-v12.4-SPINE",
      earnCompatibility: "PulseEarn-v12.0",
      proxyCompatibility: "PulseProxySpine-v12.4",
      gpuCompatibility: "PulseGPU-v12.4",

      loopTheoryAware: true,
      continuanceAware: true,

      dualMode: true,
      symbolicPrimary: true,
      binaryPostRenderOnly: true,
      binaryCompressionAware: true,
      binaryNonExecutable: true,
      organismWideIdentityField: true,

      // Presence / mesh / performance awareness (metadata-only)
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

    // -----------------------------------------------------------------------
    // Symbolic + Binary organism identity surfaces
    // -----------------------------------------------------------------------
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
          suggestedTransport: "PulseGPU-v12.4",
          suggestedCompression: "post-render",
          executable: false
        }
      };

      return {
        descriptor,
        symbolicSnapshot: symbolic
      };
    },

    // -----------------------------------------------------------------------
    // Presence / Mesh descriptors (metadata-only, IQ/Organism-driven)
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // Chunking / prewarm profiles (metadata-only, IQ-driven)
    // -----------------------------------------------------------------------
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
  PulseIQMap: PulseIQMap || {},       // never null
  PulseOrganismMap: PulseOrganismMap, // required genome

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
    // Fallback: no firebase yet, safe no-op
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

  evolution: {
    version: "v12.4-SPINE",
    lineage: [],
    recordLineage: (tag) => {
      PulseOSBrain.evolution.lineage.push(tag);
    },
    scanDrift: (_brain) => {
      // drift scan hook — no-op by default
    },
    evolveRaw: async () => [],
    evolveOrganRaw: async () => []
  },

  cortex: {
    routes: {},
    pages: {},
    bind: () => {},
    initializeNervousSystem: () => {},
    initializeOrgans: () => {},
    scanFile: null
  },

  // -------------------------------------------------------------------------
  // ⭐ CNS → Scanner Delegation Surface (symbolic-only)
  // -------------------------------------------------------------------------
  scanFile(filePath) {
    const cortex = PulseOSBrain.cortex;

    if (cortex && typeof cortex.scanFile === "function") {
      return cortex.scanFile(filePath);
    }

    PulseOSBrain.warn("🧠 [PulseOSBrain v12.4] scanFile called but Cortex has no scanFile surface.", {
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
//  BRAIN PREWARM ENGINE — v12.4-SPINE
// ============================================================================
function prewarmPulseOSBrain() {
  try {
    const iq = PulseOSBrain.PulseIQMap || {};
    const organism = PulseOSBrain.PulseOrganismMap || {};

    // Touch IQ map entries (design + logging + long-term memory)
    const iqKeys = Object.keys(iq);
    for (const k of iqKeys) {
      const _ = iq[k];
    }

    // Touch organism map entries (organ layout + lineage)
    const orgKeys = Object.keys(organism);
    for (const k of orgKeys) {
      const _ = organism[k];
    }

    // Prewarm Cortex boot wiring with a minimal synthetic config
    const syntheticBootConfig = {
      mode: "prewarm",
      identityKind: "none",
      sceneType: "cns-prewarm",
      workloadClass: "brain-prewarm",
      dispatchSignature: "PulseOSBrain.prewarm.v12.4",
      shapeSignature: "CNS-SPINE-A1"
    };

    try {
      cortexAPI.boot({
        Brain: PulseOSBrain,
        PulseIQMap: iq,
        PulseOrganismMap: organism,
        ...syntheticBootConfig
      });

    } catch (err) {
      console.error("[PulseOSBrain Prewarm v12.4] bootCortex prewarm failed:", err);
    }

    return true;
  } catch (err) {
    console.error("[PulseOSBrain Prewarm v12.4] Failed:", err);
    return false;
  }
}


// One-time CNS brain prewarm at module load
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

  PulseOSBrain.warn("[STRUCTURAL_ERROR v12.4]", payload);
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
    PulseOSBrain.log(`🧠 [PulseOSBrain v12.4] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  return structuralError(expected, { type: null, subsystem: null }, { designIdentity });
}


// ============================================================================
// 4) COGNITIVE BOOTSTRAP — Evolution → PulseOSBrain → Cortex
// ============================================================================
export async function cognitiveBootstrap({ intent, organism, iqMap, understanding }) {

  // Dynamically import IQ Map if not provided
  if (!iqMap) {
    const module = await import("./PulseIQMap.js");
    iqMap = module.PulseIQMap;
  }

  if (intent) {
    PulseOSBrain.intent = intent;
  }

  if (organism) {
    PulseOSBrain.PulseOrganismMap = organism;
  }

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

  // Boot Cortex with PulseOSBrain as CNS parent
  PulseOSBrain.cortex = cortexAPI.boot({ Brain: PulseOSBrain }) || PulseOSBrain.cortex;

  // Let Cortex initialize Nervous System + organs if it exposes hooks
  PulseOSBrain.cortex?.initializeNervousSystem?.();
  PulseOSBrain.cortex?.initializeOrgans?.();

  // Evolution may observe boot, but is not required
  PulseOSBrain.evolution?.recordLineage?.("brain-cognitive-bootstrap-v12.4");
  PulseOSBrain.evolution?.scanDrift?.(PulseOSBrain);

  PulseOSBrain.log("🧠 [PulseOSBrain v12.4] cognitiveBootstrap complete.");

  return PulseOSBrain;
}
