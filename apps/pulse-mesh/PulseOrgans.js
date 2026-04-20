// ============================================================================
// [pulse:mesh] COMMUNITY_ORGAN_LAYER v7.4  // orange
// Functional Identity Map • Capability Signatures • Metadata-Only
// ============================================================================
//
// NEW IN v7.4:
//  • Organ matching now considers system pressure signals:
//      - flowPressure
//      - driftPressure
//      - throttleRate
//      - auraTension
//      - hormoneStability
//  • Organ Layer avoids heavy organs when system is stressed.
//  • Still metadata-only, deterministic, zero payload mutation.
// ============================================================================

import { PulseField } from "./PulseField.js";

export const PulseOrgans = {
  storage: {
    id: "organ-storage",
    capabilities: ["store", "retrieve", "index"],
    match(impulse, field) {
      // storage is safe under most conditions
      if (field.flowPressure > 0.7) return false;
      return impulse.flags?.cortex_intent === "normal";
    }
  },

  routing: {
    id: "organ-routing",
    capabilities: ["route", "shape", "classify"],
    match(impulse, field) {
      // routing is expensive → avoid under pressure
      if (field.flowPressure > 0.5) return false;
      if (field.driftPressure > 0.4) return false;
      return impulse.score >= 0.5;
    }
  },

  security: {
    id: "organ-security",
    capabilities: ["validate", "verify", "protect"],
    match(impulse, field) {
      // security should ALWAYS activate on anomalies
      if (impulse.flags?.cortex_anomaly) return true;

      // but avoid unnecessary security checks under heavy load
      if (field.throttleRate > 0.3) return false;

      return false;
    }
  },

  earnPrep: {
    id: "organ-earnprep",
    capabilities: ["prepare", "shape_intent", "assign_earner"],
    match(impulse, field) {
      // earnPrep is heavy → avoid under tension
      if (field.flowPressure > 0.4) return false;
      if (field.auraTension > 0.4) return false;

      return impulse.routeHint?.startsWith("earner-");
    }
  }
};

// -----------------------------------------------------------
// Organ Engine (v7.4)
// -----------------------------------------------------------

export function applyPulseOrgans(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.organs = impulse.organs || [];

  const field = PulseField.snapshot();

  // attach v7.4 organ meta
  impulse.flags.organ_meta = {
    layer: "PulseOrgans",
    role: "FUNCTIONAL_ORGAN_MAP",
    version: 7.4,
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
