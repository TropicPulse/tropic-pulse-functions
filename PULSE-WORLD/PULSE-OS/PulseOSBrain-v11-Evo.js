// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseOSBrain.js
// PULSE OS BRAIN — v11‑EVO‑BINARY‑MAX
// “THE REAL CNS / ORGANISM-WIDE IDENTITY + INTELLIGENCE KERNEL”
// ============================================================================
//
// LAWS:
//   • Brain may import ONLY:
//       - PulseIQMap        (design + logging + long-term memory)
//       - PulseOrganismMap  (organ layout + organs + lineage)
//       - PulseOSBrainCortex (Cortex boot wiring)
//   • Brain NEVER executes binary payloads.
//   • Brain is binary‑aware, dualband, but symbolic‑primary.
//   • Binary is always post‑render, handled by GPU / Send / Binary organs.
//   • Brain is the CNS identity + contract kernel, not a router, not a GPU.
// ============================================================================

export const PulseOSBrainMeta = Object.freeze({
  layer: "PulseOSBrain",
  role: "CNS_BRAIN_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseOSBrain-v11.2-EVO-BINARY-MAX",

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
      "CNSBootSignatures"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseOS-v11.2-EVO",
    ancestry: [
      "PulseOSBrain-v9",
      "PulseOSBrain-v10",
      "PulseOSBrain-v11",
      "PulseOSBrain-v11-Evo",
      "PulseOSBrain-v11-EVO-BINARY-MAX"
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
    adaptive: "binary-aware overlays via GPU/Send/Binary organs",
    return: "online CNS identity + contracts + boot signatures"
  })
});


// ============================================================================
//  IMPORTS — LAW: BRAIN MAY IMPORT ONLY PULSEIQ (+ Cortex wiring)
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { bootCortex } from "./PulseOSBrainCortex.js";

// ============================================================================
//  BRAIN PREWARM ENGINE — v11-EVO-BINARY-MAX
//  - Prewarm CNS identity + contracts + cortex boot signatures.
//  - Touches ONLY PulseIQMap, PulseOrganismMap, bootCortex (law-compliant).
//  - No binary execution, no external mutation, no randomness.
// ============================================================================
function prewarmPulseOSBrain() {
  try {
    // Touch IQ map entries (design + logging + long-term memory)
    const iqKeys = Object.keys(PulseIQMap || {});
    for (const k of iqKeys) {
      const _ = PulseIQMap[k];
    }

    // Touch organism map entries (organ layout + lineage)
    const orgKeys = Object.keys(PulseOrganismMap || {});
    for (const k of orgKeys) {
      const _ = PulseOrganismMap[k];
    }

    // Prewarm Cortex boot wiring with a minimal synthetic config
    // (no real routes, no external mutation)
    const syntheticBootConfig = {
      mode: "prewarm",
      identityKind: "none",
      sceneType: "cns-prewarm",
      workloadClass: "brain-prewarm",
      dispatchSignature: "PulseOSBrain.prewarm",
      shapeSignature: "CNS-A1"
    };

    try {
      // bootCortex is allowed by law; we call it with a harmless config
      bootCortex(syntheticBootConfig, {
        PulseIQMap,
        PulseOrganismMap
      });
    } catch (err) {
      // Cortex boot prewarm is best-effort only
      console.error("[PulseOSBrain Prewarm] bootCortex prewarm failed:", err);
    }

    return true;
  } catch (err) {
    console.error("[PulseOSBrain Prewarm] Failed:", err);
    return false;
  }
}

// ============================================================================
// 0) THE REAL CNS BRAIN — EXPORTED AS PulseOSBrain
// ============================================================================

// One-time CNS brain prewarm at module load
prewarmPulseOSBrain();

export const PulseOSBrain = {
   // -------------------------------------------------------------------------
  // Identity — Organism-wide CNS contract
  // -------------------------------------------------------------------------
  PulseRole: {
    type: "Brain",
    subsystem: "OS",
    layer: "CNS",
    version: "11.0",
    identity: "PulseOSBrain",
    evo: {
      deterministicNeuron: true,
      driftProof: true,
      multiInstanceReady: true,
      advantageCascadeAware: true,
      unifiedAdvantageField: true,

      routingContract: "PulseRouter-v11.0",
      osOrganContract: "PulseOS-v11.0",
      earnCompatibility: "PulseEarn-v11.0",
      proxyCompatibility: "PulseProxySpine-v11.0",
      gpuCompatibility: "PulseGPU-v11.0",

      loopTheoryAware: true,
      continuanceAware: true,

      dualMode: true,
      symbolicPrimary: true,
      binaryPostRenderOnly: true,
      binaryCompressionAware: true,
      binaryNonExecutable: true,
      organismWideIdentityField: true
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
      const iq = PulseOSBrain.PulseIQMap || PulseIQMap;
      const route = iq.getRecoveryRoute
        ? iq.getRecoveryRoute()
        : "/";
      const organs = iq.pages && iq.pages[route]
        ? iq.pages[route]
        : [];
      return { route, organs };
    },

    // -----------------------------------------------------------------------
    // Symbolic + Binary organism identity surfaces
    // -----------------------------------------------------------------------
    getSymbolicOrganismIdentity() {
      return {
        role: PulseOSBrain.PulseRole,
        intent: PulseOSBrain.PulseIntentMap,
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
          suggestedTransport: "PulseGPU-v11.0",
          suggestedCompression: "post-render",
          executable: false
        }
      };

      return {
        descriptor,
        symbolicSnapshot: symbolic
      };
    }
  },

  // -------------------------------------------------------------------------
  // CNS Infrastructure (wired from IQ)
  // -------------------------------------------------------------------------
  log: PulseIQMap.log,
  warn: PulseIQMap.warn,
  logError: PulseIQMap.logError,
  firebase: PulseIQMap.firebase,

  PulseIntentMap: null,
  PulseIQMap: PulseIQMap,
  PulseOrganismMap: PulseOrganismMap,

  intent: null,
  understanding: null,
  evolution: null,
  cortex: null,

  // -------------------------------------------------------------------------
  // ⭐ CNS → Scanner Delegation Surface (symbolic-only)
  //    • Brain does NOT import scanner
  //    • Brain does NOT execute scanner
  //    • Brain delegates to Cortex if Cortex exposes scanFile
  //    • Evolution MAY enhance Cortex later, but is not required
  // -------------------------------------------------------------------------
  scanFile(filePath) {
    const cortex = PulseOSBrain.cortex;

    if (cortex && typeof cortex.scanFile === "function") {
      return cortex.scanFile(filePath);
    }

    const warnFn = PulseOSBrain.warn || PulseIQMap.warn;
    warnFn("🧠 [PulseOSBrain] scanFile called but Cortex has no scanFile surface.", {
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

  const warnFn = PulseOSBrain.warn || PulseIQMap.warn;
  warnFn("[STRUCTURAL_ERROR]", payload);
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
    const logFn = PulseOSBrain.log || PulseIQMap.log;
    logFn(`🧠 [PulseOSBrain] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  return structuralError(expected, { type: null, subsystem: null }, { designIdentity });
}


// ============================================================================
// 4) COGNITIVE BOOTSTRAP — Evolution → PulseOSBrain → Cortex
// ============================================================================
export function cognitiveBootstrap({ intent, organism, iqMap, understanding }) {

  if (intent) {
    PulseOSBrain.intent = intent;
    PulseOSBrain.PulseIntentMap = intent;
  }

  if (organism) {
    PulseOSBrain.PulseOrganismMap = organism;
  }

  if (iqMap) {
    PulseOSBrain.PulseIQMap = iqMap;

    if (iqMap.log) PulseOSBrain.log = iqMap.log;
    if (iqMap.warn) PulseOSBrain.warn = iqMap.warn;
    if (iqMap.logError) PulseOSBrain.logError = iqMap.logError;
    if (iqMap.firebase) PulseOSBrain.firebase = iqMap.firebase;
  }

  PulseOSBrain.understanding = understanding;

  // Boot Cortex with PulseOSBrain as CNS parent
  PulseOSBrain.cortex = bootCortex({ Brain: PulseOSBrain });

  // Let Cortex initialize Nervous System + organs if it exposes hooks
  PulseOSBrain.cortex?.initializeNervousSystem?.();
  PulseOSBrain.cortex?.initializeOrgans?.();

  // Evolution may observe boot, but is not required
  PulseOSBrain.evolution?.recordLineage?.("brain-cognitive-bootstrap");
  PulseOSBrain.evolution?.scanDrift?.(PulseOSBrain);

  const logFn = PulseOSBrain.log || PulseIQMap.log;
  logFn("🧠 [PulseOSBrain] cognitiveBootstrap complete.");
  return PulseOSBrain;
}
