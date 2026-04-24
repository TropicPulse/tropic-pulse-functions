// ============================================================================
//  PULSE OS v11-Evo — SURVIVAL ORGANS LAYER  // orange
//  “Functional Organ Map of the Mesh Body”
//  Capability Signatures • Deterministic Organ Matching • Metadata-Only
// ============================================================================
//
// IDENTITY (v11-Evo):
// -------------------
// • Maps impulses to functional organs (storage, routing, security, earnPrep).
// • Pure metadata-only classification — zero payload mutation.
// • Deterministic-field, drift-proof, SDN-aligned.
// • No pressure gating.
// • Multi-instance-ready, unified-advantage-field, binary-aware, dual-mode-ready.
// ============================================================================

export function createPulseOrgans() {

  // -------------------------------------------------------
  // ORGAN DEFINITIONS (v11-Evo)
  // Deterministic, pressure-free, SDN-aligned.
  // -------------------------------------------------------
  const PulseOrgans = {

    // -------------------------------------------------------
    // STORAGE ORGAN — deterministic, safe default
    // -------------------------------------------------------
    storage: {
      id: "organ-storage",
      capabilities: ["store", "retrieve", "index"],
      match(impulse) {
        return impulse.flags?.cortex_intent === "normal";
      }
    },

    // -------------------------------------------------------
    // ROUTING ORGAN — deterministic, based on intent + score
    // -------------------------------------------------------
    routing: {
      id: "organ-routing",
      capabilities: ["route", "shape", "classify"],
      match(impulse) {
        return impulse.flags?.cortex_intent === "push_hard" ||
               impulse.score >= 0.7;
      }
    },

    // -------------------------------------------------------
    // SECURITY ORGAN — anomaly-first
    // -------------------------------------------------------
    security: {
      id: "organ-security",
      capabilities: ["validate", "verify", "protect"],
      match(impulse) {
        return impulse.flags?.cortex_anomaly ||
               impulse.flags?.cortex_factoring_anomaly ||
               impulse.flags?.cortex_flow_anomaly;
      }
    },

    // -------------------------------------------------------
    // EARN PREP ORGAN — deterministic, based on routeHint
    // -------------------------------------------------------
    earnPrep: {
      id: "organ-earnprep",
      capabilities: ["prepare", "shape_intent", "assign_earner"],
      match(impulse) {
        return typeof impulse.routeHint === "string" &&
               impulse.routeHint.startsWith("earner-");
      }
    },

    // -------------------------------------------------------
    // NEW v11-Evo — BINARY PREP ORGAN
    // Activated when binary mode is active
    // -------------------------------------------------------
    binaryPrep: {
      id: "organ-binaryprep",
      capabilities: ["binary_prepare", "binary_shape", "binary_assign"],
      match(impulse) {
        return impulse.flags?.binary_mode === true;
      }
    },

    // -------------------------------------------------------
    // NEW v11-Evo — MESH SIGNAL ORGAN
    // Activated when mesh-level signals are present
    // -------------------------------------------------------
    meshSignal: {
      id: "organ-meshsignal",
      capabilities: ["mesh_signal", "mesh_factor", "mesh_trace"],
      match(impulse) {
        return impulse.flags?.aura_prefers_factored_paths ||
               impulse.flags?.mesh_signal ||
               impulse.flags?.aura_system_under_tension;
      }
    }
  };


  // ========================================================================
  // ORGAN ENGINE (v11-Evo)
  // “Attach functional organ identity to the impulse”
  // ========================================================================
  function applyPulseOrgans(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.organs = impulse.organs || [];

    // attach v11-Evo organ meta
    impulse.flags.organ_meta = {
      layer: "PulseOrgans",
      role: "FUNCTIONAL_ORGAN_MAP",
      version: "11.0-Evo",
      target: "full-mesh",
      selfRepairable: true,
      evo: {
        dualMode: true,
        binaryAware: true,
        symbolicAware: true,
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
        auraPressureAware: true,
        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true
      }
    };

    // deterministic organ matching (no pressure)
    for (const key of Object.keys(PulseOrgans)) {
      const organ = PulseOrgans[key];
      if (organ.match(impulse)) {
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
