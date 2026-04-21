// ============================================================================
//  PULSE OS v7.7 — SURVIVAL ORGANS LAYER  // orange
//  “Functional Organ Map of the Mesh Body”
//  Capability Signatures • Pressure-Aware Organ Matching • Metadata-Only
// ============================================================================
//
//  IDENTITY (v7.7):
//  ----------------
//  • Maps impulses to functional organs (storage, routing, security, earnPrep).
//  • Pure metadata-only classification — zero payload mutation.
//  • Pressure-aware: avoids heavy organs when the system is under tension.
//  • Deterministic, drift-proof, AND-architecture aligned.
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//  • Organ Map → assigns impulses to the correct functional organ.
//  • Pressure Guard → avoids heavy organs under stress.
//  • Mesh Body Layer → sits between Reflex (skin) and Earners (muscles).
//  • Zero Compute → classification only, no transformation.
//
//  NEW IN v7.7+:
//  -------------
//  • Organ matching considers:
//      - flowPressure
//      - driftPressure
//      - throttleRate
//      - auraTension
//      - hormoneStability
//  • Avoids heavy organs when system is stressed.
//  • Still metadata-only, deterministic, zero payload mutation.
// ============================================================================

import { PulseField } from "./PulseMeshEnvironmentalField.js";

export const PulseOrgans = {

  // -------------------------------------------------------
  // STORAGE ORGAN — safe under most conditions
  // -------------------------------------------------------
  storage: {
    id: "organ-storage",
    capabilities: ["store", "retrieve", "index"],
    match(impulse, field) {
      if (field.flowPressure > 0.7) return false;
      return impulse.flags?.cortex_intent === "normal";
    }
  },

  // -------------------------------------------------------
  // ROUTING ORGAN — expensive, avoid under pressure
  // -------------------------------------------------------
  routing: {
    id: "organ-routing",
    capabilities: ["route", "shape", "classify"],
    match(impulse, field) {
      if (field.flowPressure > 0.5) return false;
      if (field.driftPressure > 0.4) return false;
      return impulse.score >= 0.5;
    }
  },

  // -------------------------------------------------------
  // SECURITY ORGAN — anomaly-first, but avoid heavy checks
  // -------------------------------------------------------
  security: {
    id: "organ-security",
    capabilities: ["validate", "verify", "protect"],
    match(impulse, field) {
      if (impulse.flags?.cortex_anomaly) return true;
      if (field.throttleRate > 0.3) return false;
      return false;
    }
  },

  // -------------------------------------------------------
  // EARN PREP ORGAN — heavy, avoid under tension
  // -------------------------------------------------------
  earnPrep: {
    id: "organ-earnprep",
    capabilities: ["prepare", "shape_intent", "assign_earner"],
    match(impulse, field) {
      if (field.flowPressure > 0.4) return false;
      if (field.auraTension > 0.4) return false;
      return impulse.routeHint?.startsWith("earner-");
    }
  }
};


// ============================================================================
//  ORGAN ENGINE (v7.7)
//  “Attach functional organ identity to the impulse”
// ============================================================================
export function applyPulseOrgans(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.organs = impulse.organs || [];

  const field = PulseField.snapshot();

  // attach v7.7 organ meta
  impulse.flags.organ_meta = {
    layer: "PulseOrgans",
    role: "FUNCTIONAL_ORGAN_MAP",
    version: 7.7,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      localAware: true,
      internetAware: true,
      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,
      unifiedAdvantageField: true,
      futureEvolutionReady: true
    }
  };

  for (const key of Object.keys(PulseOrgans)) {
    const organ = PulseOrgans[key];
    if (organ.match(impulse, field)) {
      impulse.organs.push(organ.id);
      impulse.flags[`organ_${organ.id}`] = true;
    }
  }

  return impulse;
}
