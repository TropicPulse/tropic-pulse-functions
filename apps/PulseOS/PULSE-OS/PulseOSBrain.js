// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseOSBrain.js
// PULSE OS — v10.0
// “THE CNS BRAIN / CENTRAL NERVOUS SYSTEM / INTELLIGENCE LAYER 1”
// ============================================================================


// ============================================================================
//  IMPORTS — v10 LAW: BRAIN MAY IMPORT ONLY PULSEIQ (+ Cortex wiring)
// ============================================================================
import { PulseIQMap } from "./PULSE-OS/PulseIQMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { boot } from "./PulseOSBrainCortex.js";


// ============================================================================
// 0) THE REAL CNS BRAIN — EXPORTED AS PulseOSBrain
// ============================================================================
export const PulseOSBrain = {

  // Identity
  PulseRole: {
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
  },

  // CNS Intelligence Layer
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
      return PulseIQMap.LongTermMemory;
    }
  },

  // CNS Infrastructure
  log: PulseIQMap.log,
  warn: PulseIQMap.warn,
  logError: PulseIQMap.logError,
  firebase: PulseIQMap.firebase,
  BBB: PulseIQMap.BBB,
  PulseKernel: PulseIQMap.PulseKernel,
  LongTermMemory: PulseIQMap.LongTermMemory,
  evolveRaw: PulseIQMap.evolveRaw,

  // ⭐ MAP EXPORTS
  PulseIntentMap: null,                 // filled by Evolution / cognitiveBootstrap
  PulseIQMap: PulseIQMap,               // IQ lives in Brain
  PulseOrganismMap: PulseOrganismMap,   // default; Evolution may override

  // ⭐ Cognitive wiring
  intent: null,
  understanding: null,
  evolution: null,   // attached by Evolution
  cortex: null
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

  PulseIQMap.warn("[STRUCTURAL_ERROR]", payload);
  return payload;
}


// ============================================================================
/* 3) EVOLUTION + ORGAN LOADING — Design-Driven CNS Logic (still uses IQMap) */
// ============================================================================
export async function loadOrganByDesign(designIdentity, expectedType, expectedSubsys) {
  const raw = await PulseIQMap.evolveRaw(designIdentity);
  const expected = { type: expectedType, subsystem: expectedSubsys };

  const candidates = raw.filter(({ module }) =>
    validatePulseRole(module, expected.type, expected.subsystem)
  );

  if (candidates.length > 0) {
    const chosen = candidates[0];
    PulseIQMap.log(`🧠 [PulseOSBrain] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  return structuralError(expected, { type: null, subsystem: null }, { designIdentity });
}


// ============================================================================
// 4) COGNITIVE BOOTSTRAP — Evolution → PulseOSBrain → Cortex
//    (Evolution calls this; Understanding never does directly)
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
  }

  PulseOSBrain.understanding = understanding;

  // Evolution is attached by PulseOSEvolution before this is called:
  // PulseOSBrain.evolution = Evolution;

  // Boot Cortex with PulseOSBrain as CNS parent
  PulseOSBrain.cortex = boot({ Brain: PulseOSBrain });

  // Let Cortex initialize Nervous System + organs if it exposes hooks
  PulseOSBrain.cortex?.initializeNervousSystem?.();
  PulseOSBrain.cortex?.initializeOrgans?.();

  // Let Evolution observe the boot + scan drift + record lineage
  PulseOSBrain.evolution?.recordLineage?.("brain-cognitive-bootstrap");
  PulseOSBrain.evolution?.scanDrift?.(PulseOSBrain);

  PulseIQMap.log("🧠 [PulseOSBrain] cognitiveBootstrap complete.");
  return PulseOSBrain;
}
