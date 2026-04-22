// ============================================================================
//  PULSE OS v9.2 — SURVIVAL ORGANS LAYER  // orange
//  “Functional Organ Map of the Mesh Body”
//  Capability Signatures • Pressure-Aware Organ Matching • Metadata-Only
// ============================================================================
//
//  IDENTITY (v9.2):
//  ----------------
//  • Maps impulses to functional organs (storage, routing, security, earnPrep).
//  • Pure metadata-only classification — zero payload mutation.
//  • Pressure-aware: avoids heavy organs when the system is under tension.
//  • Factoring-aware: avoids deep-path organs when factoring pressure is high.
//  • Deterministic-field, drift-proof, AND-architecture aligned.
//  • Multi-instance-ready, unified-advantage-field, future-evolution-ready.
//
//  ROLE IN THE DIGITAL BODY (v9.2):
//  --------------------------------
//  • Organ Map → assigns impulses to the correct functional organ.
//  • Pressure Guard → avoids heavy organs under stress.
//  • Mesh Body Layer → sits between Reflex (skin) and Earners (muscles).
//  • Zero Compute → classification only, no transformation.
//
//  NEW IN v9.2:
//  -------------
//  • Organ matching considers:
//      - flowPressure
//      - driftPressure
//      - throttleRate
//      - auraTension
//      - factoringPressure
//      - hormoneStabilityTag
//      - meshStormPressure (v9.2)
//  • Deterministic-field: same snapshot → same organ match.
//  • Unified-advantage-field: inherits all safe advantages automatically.
// ============================================================================

export function createPulseOrgans({ getPressureSnapshot }) {

  // -------------------------------------------------------
  // ORGAN DEFINITIONS (v9.2)
  // -------------------------------------------------------
  const PulseOrgans = {

    // -------------------------------------------------------
    // STORAGE ORGAN — safe under most conditions
    // -------------------------------------------------------
    storage: {
      id: "organ-storage",
      capabilities: ["store", "retrieve", "index"],
      match(impulse, field) {
        if (field.flowPressure > 0.7) return false;
        if (field.factoringPressure > 0.6) return false;
        if (field.meshStormPressure > 0.4) return false;
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
        if (field.auraTension > 0.4) return false;
        if (field.factoringPressure > 0.5) return false;
        if (field.meshStormPressure > 0.4) return false;
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
        if (impulse.flags?.cortex_factoring_anomaly) return true;
        if (field.throttleRate > 0.3) return false;
        if (field.meshStormPressure > 0.4) return false;
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
        if (field.factoringPressure > 0.5) return false;
        if (field.meshStormPressure > 0.4) return false;
        return impulse.routeHint?.startsWith("earner-");
      }
    }
  };


  // ========================================================================
  // ORGAN ENGINE (v9.2)
  // “Attach functional organ identity to the impulse”
  // ========================================================================
  function applyPulseOrgans(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.organs = impulse.organs || [];

    const field = getPressureSnapshot() || {};

    // attach v9.2 organ meta
    impulse.flags.organ_meta = {
      layer: "PulseOrgans",
      role: "FUNCTIONAL_ORGAN_MAP",
      version: 9.2,
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
        deterministicField: true,
        futureEvolutionReady: true,
        signalFactoringAware: true,
        meshPressureAware: true,
        auraPressureAware: true
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

  return {
    apply: applyPulseOrgans,
    organs: PulseOrgans
  };
}
