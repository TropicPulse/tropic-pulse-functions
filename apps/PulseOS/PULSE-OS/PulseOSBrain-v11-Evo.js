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


// ============================================================================
//  IMPORTS — LAW: BRAIN MAY IMPORT ONLY PULSEIQ (+ Cortex wiring)
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { bootCortex } from "./PulseOSBrainCortex.js";


// ============================================================================
// 0) THE REAL CNS BRAIN — EXPORTED AS PulseOSBrain
//    • Symbolic-primary CNS kernel
//    • Binary-aware, dualband, non-executable
// ============================================================================
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

      // Contracts — organism-wide
      routingContract: "PulseRouter-v11.0",
      osOrganContract: "PulseOS-v11.0",
      earnCompatibility: "PulseEarn-v11.0",
      proxyCompatibility: "PulseProxySpine-v11.0",
      gpuCompatibility: "PulseGPU-v11.0",

      // Continuance / loop-theory awareness (conceptual only)
      loopTheoryAware: true,
      continuanceAware: true,

      // v11‑EVO‑BINARY‑MAX — dualband CNS
      dualMode: true,                 // symbolic + binary surfaces
      symbolicPrimary: true,          // SYMBOLIC is source of truth
      binaryPostRenderOnly: true,     // binary only after render
      binaryCompressionAware: true,   // knows compression contracts
      binaryNonExecutable: true,      // NEVER executes binary
      organismWideIdentityField: true // single CNS identity field
    }
  },

  // -------------------------------------------------------------------------
  // CNS Intelligence Layer — structural reasoning, not routing
  // -------------------------------------------------------------------------
  BrainIntel: {
    // Degradation classifier → how CNS should route around damage
    classifyDegradation(healthScore) {
      if (healthScore >= 0.85) return "direct";
      if (healthScore >= 0.15) return "bypass";
      return "routeAround";
    },

    // Identity scoring for design-loaded organs
    scoreIdentityMatch(signature, module) {
      let score = 0;
      if (module?.PulseRole?.type === signature.type) score += 1;
      if (module?.PulseRole?.subsystem === signature.subsystem) score += 1;
      return score;
    },

    // Fallback to long-term memory (v11: TEXT/DESIGN hint via IQ)
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
    // v11 DUAL-MODE SURFACES (SYMBOLIC + BINARY VIEW)
    // -----------------------------------------------------------------------

    // Symbolic view of organism identity (source of truth)
    getSymbolicOrganismIdentity() {
      return {
        role: PulseOSBrain.PulseRole,
        intent: PulseOSBrain.PulseIntentMap,
        organismMap: PulseOSBrain.PulseOrganismMap,
        iqMap: PulseOSBrain.PulseIQMap
      };
    },

    // Binary view — NON-EXECUTABLE, post-render compression surface
    // This is intentionally descriptive only:
    //   • Brain does NOT encode bytes
    //   • Brain does NOT send packets
    //   • Brain only describes what GPU/Send/Binary organs may compress.
    getBinaryOrganismDescriptor() {
      const symbolic = this.getSymbolicOrganismIdentity();

      // Deterministic, metadata-only descriptor
      const descriptor = {
        version: PulseOSBrain.PulseRole.version,
        identity: PulseOSBrain.PulseRole.identity,
        subsystem: PulseOSBrain.PulseRole.subsystem,
        layer: PulseOSBrain.PulseRole.layer,

        // Dualband CNS flags
        dualMode: true,
        symbolicPrimary: true,
        binaryFirst: true,          // binary-first transport in the organism
        binaryPostRenderOnly: true, // but only after symbolic render
        binaryNonExecutable: true,

        // We do NOT compute bytes here; we just describe the shape.
        encoding: {
          format: "application/pulse-organism+json",
          suggestedTransport: "PulseGPU-v11.0",
          suggestedCompression: "post-render",
          executable: false
        }
      };

      return {
        descriptor,
        // Symbolic snapshot is included so GPU/Send/Binary can compress it later.
        symbolicSnapshot: symbolic
      };
    }
  },

  // -------------------------------------------------------------------------
  // CNS Infrastructure (wired from IQ — TEXT + LOGGING + APPENDAGES)
  // -------------------------------------------------------------------------
  log: PulseIQMap.log,
  warn: PulseIQMap.warn,
  logError: PulseIQMap.logError,
  firebase: PulseIQMap.firebase,

  // ⭐ MAP EXPORTS
  PulseIntentMap: null,                 // filled by Evolution / cognitiveBootstrap
  PulseIQMap: PulseIQMap,               // IQ lives in Brain (design + logging)
  PulseOrganismMap: PulseOrganismMap,   // default; Evolution may override

  // ⭐ Cognitive wiring
  intent: null,
  understanding: null,
  evolution: null,   // attached by Evolution
  cortex: null
};


// ============================================================================
// 1) ROLE VALIDATION — CNS Gatekeeper
//    Ensures only correct organs attach to CNS surfaces.
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
//    CNS-level structural mismatch reporting (non-fatal, drift-aware).
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
//    v11‑EVO: Evolution decides which organs to attach; Brain validates.
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
//    • Evolution calls this (NOT Understanding).
//    • Boots Cortex with Brain as CNS parent.
//    • Initializes Nervous System + organs.
//    • Records lineage + scans drift.
// ============================================================================
export function cognitiveBootstrap({ intent, organism, iqMap, understanding }) {

  // Attach intent + understanding to Brain surface
  if (intent) {
    PulseOSBrain.intent = intent;
    PulseOSBrain.PulseIntentMap = intent;
  }

  if (organism) {
    PulseOSBrain.PulseOrganismMap = organism;
  }

  if (iqMap) {
    PulseOSBrain.PulseIQMap = iqMap;

    // v11: rewire CNS infrastructure to injected IQ
    if (iqMap.log) PulseOSBrain.log = iqMap.log;
    if (iqMap.warn) PulseOSBrain.warn = iqMap.warn;
    if (iqMap.logError) PulseOSBrain.logError = iqMap.logError;
    if (iqMap.firebase) PulseOSBrain.firebase = iqMap.firebase;
  }

  PulseOSBrain.understanding = understanding;

  // Evolution is attached by PulseOSEvolution before this is called:
  // PulseOSBrain.evolution = Evolution;

  // Boot Cortex with PulseOSBrain as CNS parent
  PulseOSBrain.cortex = bootCortex({ Brain: PulseOSBrain });

  // Let Cortex initialize Nervous System + organs if it exposes hooks
  PulseOSBrain.cortex?.initializeNervousSystem?.();
  PulseOSBrain.cortex?.initializeOrgans?.();

  // Let Evolution observe the boot + scan drift + record lineage
  PulseOSBrain.evolution?.recordLineage?.("brain-cognitive-bootstrap");
  PulseOSBrain.evolution?.scanDrift?.(PulseOSBrain);

  const logFn = PulseOSBrain.log || PulseIQMap.log;
  logFn("🧠 [PulseOSBrain] cognitiveBootstrap complete.");
  return PulseOSBrain;
}
