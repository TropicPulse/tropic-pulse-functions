// ============================================================================
// FILE: /apps/PulseOS/PULSE-OS/PulseOSBrain.js
// PULSE OS — v10.4 → v11 DESIGN UPGRADE
// “THE CNS BRAIN / CENTRAL NERVOUS SYSTEM / INTELLIGENCE LAYER 1”
// ============================================================================
//
//  ORGAN IDENTITY (v10.4):
//  ------------------------
//  • Organ Type: Brain / CNS Core
//  • Layer: CENTRAL NERVOUS SYSTEM (CNS)
//  • Biological Analog: Brain + Executive Cortex
//  • System Role: Attach IQ, load organs by design, boot Cortex, govern CNS.
//
//  PURPOSE (v10.4 → v11 DESIGN):
//  -----------------------------
//  ✔ Attach PulseIQ (TEXT + DESIGN ONLY) to the organism.
//  ✔ Interpret PulseOrganismMap as the genome-level truth.
//  ✔ Load organs by design identity via Evolution (not IQ).
//  ✔ Boot the Cortex and initialize nervous system + organs.
//  ✔ Classify degradation and route around damage (continuance).
//  ✔ Provide structural error intelligence (drift surface).
//
//  SAFETY CONTRACT (v10.4):
//  -------------------------
//  • May import ONLY:
//      - PulseIQMap (IQ cortex / design + logging + appendages)
//      - PulseOrganismMap (genome map)
//      - Cortex boot (PulseOSBrainCortex)
//  • No dynamic imports, no eval, no Function.
//  • No network law here — network is handled by other organs.
//  • Deterministic behavior only.
//  • No mutation of external modules (IQ, OrganismMap).
// ============================================================================


// ============================================================================
//  IMPORTS — v10.4 LAW: BRAIN MAY IMPORT ONLY PULSEIQ (+ Cortex wiring)
// ============================================================================
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap.js";
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
    version: "10.4",
    identity: "PulseOSBrain",
    evo: {
      deterministicNeuron: true,
      driftProof: true,
      multiInstanceReady: true,
      advantageCascadeAware: true,
      unifiedAdvantageField: true,

      // Contracts — v10.4 organism-wide
      routingContract: "PulseRouter-v10.4",
      osOrganContract: "PulseOS-v10.4",
      earnCompatibility: "PulseEarn-v10.4",
      proxyCompatibility: "PulseProxySpine-v10.4",
      gpuCompatibility: "PulseGPU-v10.4",

      // Continuance / loop-theory awareness (conceptual only)
      loopTheoryAware: true,
      continuanceAware: true
    }
  },

  // CNS Intelligence Layer
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
    }
  },

  // CNS Infrastructure (wired from IQ — TEXT + LOGGING + APPENDAGES)
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
// 3) EVOLUTION + ORGAN LOADING — Design-Driven CNS Logic (v11: via Evolution)
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
//    (Evolution calls this; Understanding does NOT boot Brain directly)
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
  PulseOSBrain.cortex = boot({ Brain: PulseOSBrain });

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
