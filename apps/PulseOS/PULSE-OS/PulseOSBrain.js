// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseOSBrain.js
// PULSE OS — v10.0
// “THE CNS BRAIN / CENTRAL NERVOUS SYSTEM / INTELLIGENCE LAYER 1”
// ============================================================================
//
//  ORGAN IDENTITY (v10.0):
//  ------------------------
//  • Organ Type: Brain / CNS
//  • Layer: BRAINSTEM + LOW CORTEX
//  • Biological Analog: Medulla + Pons + Thalamus (NOT Neocortex)
//  • System Role:
//      - Attach IQ (PulseIQMap.js)
//      - Validate organ identity
//      - Route CNS-level decisions
//      - Provide evolution access
//      - Provide memory access
//      - Provide kernel access
//      - Provide Firebase access
//      - Provide BBB access
//      - Provide deterministic CNS intelligence
//
//  PURPOSE (v10.0):
//  ----------------
//  ✔ Attach PulseIQ (the full import warehouse)
//  ✔ Provide CNS-level intelligence (NOT full IQ)
//  ✔ Validate PulseRole identity for all organs
//  ✔ Provide structural error intelligence
//  ✔ Provide deterministic organ loading via evolution
//  ✔ Provide safe access to Kernel, Memory, Firebase, BBB
//  ✔ Expose a clean CNS surface for the entire organism
//  ✔ Guarantee all organs import ONLY from Brain
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  ✔ The CNS brainstem + low cortex
//  ✔ The router of intelligence (NOT the intelligence itself)
//  ✔ The identity validator
//  ✔ The structural integrity guardian
//  ✔ The evolution orchestrator
//  ✔ The memory + kernel + Firebase access point
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  ✘ NOT the IQ cortex (PulseIQMap.js is the cortex)
//  ✘ NOT a reflex layer
//  ✘ NOT a membrane
//  ✘ NOT a GPU organ
//  ✘ NOT a Mesh organ
//  ✘ NOT a backend organ
//  ✘ NOT a state machine
//  ✘ NOT a scheduler
//
//  SAFETY CONTRACT (v10.0):
//  -------------------------
//  • This file may import ONLY PulseIQMap.js
//  • All other imports must live inside PulseIQMap.js
//  • Never mutate IQ modules
//  • Never expose raw IQ modules directly to organs
//  • Always validate PulseRole identity
//  • Always remain deterministic and drift-proof
//  • Always route CNS decisions through IQ
//
// ============================================================================
//  IMPORTS — v10 LAW: BRAIN MAY IMPORT ONLY PULSEIQ
import { boot } from "./PulseOSBrainCortex.js";

// ============================================================================
PulseOSBrain.PulseIntentMap = PulseIntentMap;
PulseOSBrain.PulseIQMap = PulseIQMap;
PulseOSBrain.PulseOrganismMap = PulseOrganismMap;

// ============================================================================
// 0) BRAIN IDENTITY (PulseRole) — v10.0
// ============================================================================
export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "CNS",
  version: "10.0",
  identity: "PulseOSBrain",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,

    routingContract: "PulseSend-v10",
    osOrganContract: "PulseOS-v10",
    earnCompatibility: "PulseEarn-v10",
    proxyCompatibility: "PulseProxySpine-v10",
    gpuCompatibility: "PulseGPU-v10"
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

  PulseIQ.warn("[STRUCTURAL_ERROR]", payload);
  return payload;
}


// ============================================================================
// 3) CNS INTELLIGENCE LAYER — “IQ-lite”
//    (Brain-level intelligence, NOT full IQ)
// ============================================================================
export const BrainIntel = {
  // Lightweight CNS reasoning (NOT full IQ)
  classifyDegradation(healthScore) {
    if (healthScore >= 0.85) return "direct";
    if (healthScore >= 0.15) return "bypass";
    return "routeAround";
  },

  // CNS-level identity scoring
  scoreIdentityMatch(signature, module) {
    let score = 0;

    if (module?.PulseRole?.type === signature.type) score += 1;
    if (module?.PulseRole?.subsystem === signature.subsystem) score += 1;

    return score;
  },

  // CNS-level fallback logic
  fallbackToMemory() {
    return PulseIQ.LongTermMemory;
  }
};


// ============================================================================
// 4) EVOLUTION + ORGAN LOADING — Design-Driven CNS Logic
// ============================================================================
export async function loadOrganByDesign(designIdentity, expectedType, expectedSubsys) {
  const raw = await PulseIQ.evolveRaw(designIdentity);
  const expected = { type: expectedType, subsystem: expectedSubsys };

  const candidates = raw.filter(({ module }) =>
    validatePulseRole(module, expected.type, expected.subsystem)
  );

  if (candidates.length > 0) {
    const chosen = candidates[0];
    PulseIQ.log(`🧠 [PulseOSBrain] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  return structuralError(expected, { type: null, subsystem: null }, { designIdentity });
}


// ============================================================================
// 5) EXPORT EVERYTHING THE BODY NEEDS — CNS Surface (NOT Kernel)
// ============================================================================
export const Brain = {
  // Logging
  log: PulseIQ.log,
  warn: PulseIQ.warn,
  logError: PulseIQ.logError,

  // Core infrastructure
  firebase: PulseIQ.firebase,
  BBB: PulseIQ.BBB,
  PulseKernel: PulseIQ.PulseKernel,
  LongTermMemory: PulseIQ.LongTermMemory,
  evolveRaw: PulseIQ.evolveRaw,
  loadOrganByDesign,

  // CNS Intelligence Layer
  BrainIntel,

  // Identity
  PulseRole
};

