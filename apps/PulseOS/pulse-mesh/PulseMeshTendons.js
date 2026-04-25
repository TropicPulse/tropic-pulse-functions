// ============================================================================
// FILE: PulseMeshTendons.js
// PULSE OS — v11-Evo
// CONNECTIVE TISSUE ORGAN — “PulseMeshTendons”
// Intent Translation • Earn-Ready Metadata • Deterministic Connective Tissue
// ============================================================================
//
// IDENTITY — THE TENDON ORGAN (v11-Evo):
// --------------------------------------
// • Translates Cortex intent into earn-ready metadata.
// • Classifies impulses (heavy/medium/light) deterministically.
// • Shapes routeHint based on class + mode (symbolic/PULSE-TOOLS/dual).
// • Stabilizes energy deterministically (v11-Evo contract).
// • Attaches volatility + earn-context for EarnEngine.
// • Pure metadata-only — zero payload mutation.
// • Deterministic, drift-proof, connective tissue.
// • Binary-aware, dual-mode-ready.
// ============================================================================

export function createPulseMeshTendons({ log, warn, error }) {

  const tendonMeta = {
    layer: "PulseMeshTendons",
    role: "INTENT_TRANSLATION",
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

  // ========================================================================
  // Tendon Pack (v11-Evo)
  // ========================================================================
  const PulseMeshTendons = {

    // -------------------------------------------------------
    // CLASSIFY — heavy / medium / light (deterministic)
    // -------------------------------------------------------
    classify(impulse) {
      const score = impulse.score ?? 0.5;

      if (score >= 0.85) return "heavy";
      if (score >= 0.45) return "medium";
      return "light";
    },

    // -------------------------------------------------------
    // ROUTE HINT — v11-Evo (class + mode)
    // -------------------------------------------------------
    routeHint(impulse, cls) {
      impulse.flags = impulse.flags || {};

      const binary = impulse.flags.binary_mode;
      const dual = impulse.flags.dual_mode;

      if (binary) {
        impulse.routeHint = `earner-binary-${cls}`;
        return impulse;
      }

      if (dual) {
        impulse.routeHint = `earner-dual-${cls}`;
        return impulse;
      }

      // symbolic default
      impulse.routeHint = `earner-${cls}`;
      return impulse;
    },

    // -------------------------------------------------------
    // SHAPE ENERGY — deterministic stabilization (v11-Evo)
    // -------------------------------------------------------
    shapeEnergy(impulse, cls) {
      impulse.flags = impulse.flags || {};

      let e = impulse.energy ?? 1;

      if (cls === "heavy") e *= 1.05;
      if (cls === "light") e *= 0.95;

      // v11-Evo: binary mode slightly boosts stability
      if (impulse.flags.binary_mode) e *= 1.02;

      impulse.energy = e;
      impulse.flags.tendon_energy_shaped = true;
      return impulse;
    },

    // -------------------------------------------------------
    // NORMALIZE EARN ENERGY — clamp to safe range (v11-Evo)
    // -------------------------------------------------------
    normalizeEarnEnergy(impulse) {
      impulse.flags = impulse.flags || {};

      const e = impulse.energy ?? 1;
      impulse.energy = Math.max(0.1, Math.min(e, 1.2));

      impulse.flags.tendon_energy_normalized = true;
      return impulse;
    },

    // -------------------------------------------------------
    // ATTACH VOLATILITY — deterministic (v11-Evo)
    // -------------------------------------------------------
    attachVolatility(impulse) {
      impulse.flags = impulse.flags || {};

      // v11-Evo: volatility is mode-aware but deterministic
      if (impulse.flags.binary_mode) {
        impulse.flags.earner_volatility = 0.1;
      } else if (impulse.flags.dual_mode) {
        impulse.flags.earner_volatility = 0.05;
      } else {
        impulse.flags.earner_volatility = 0;
      }

      return impulse;
    },

    // -------------------------------------------------------
    // ATTACH EARN CONTEXT — deterministic earn metadata
    // -------------------------------------------------------
    attachEarnContext(impulse, cls) {
      impulse.flags = impulse.flags || {};

      impulse.flags.earner_context = {
        class: cls,
        urgency: impulse.energy ?? 1,
        stability_hint: 1,
        volatility: impulse.flags.earner_volatility ?? 0,
        route_hint: impulse.routeHint,
        mode: impulse.flags.binary_mode
          ? "binary"
          : impulse.flags.dual_mode
          ? "dual"
          : "symbolic"
      };

      return impulse;
    },

    // -------------------------------------------------------
    // TAG CLASS — explicit tendon class flags
    // -------------------------------------------------------
    tag(impulse, cls) {
      impulse.flags = impulse.flags || {};
      impulse.flags[`tendon_class_${cls}`] = true;
      return impulse;
    }
  };

  // ========================================================================
  // Tendon Engine (v11-Evo)
  // “Apply connective tissue shaping for Mesh → EarnEngine”
  // ========================================================================
  function applyPulseMeshTendons(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.tendon_meta = tendonMeta;

    const cls = PulseMeshTendons.classify(impulse);

    PulseMeshTendons.routeHint(impulse, cls);
    PulseMeshTendons.shapeEnergy(impulse, cls);
    PulseMeshTendons.normalizeEarnEnergy(impulse);
    PulseMeshTendons.attachVolatility(impulse);
    PulseMeshTendons.attachEarnContext(impulse, cls);
    PulseMeshTendons.tag(impulse, cls);

    impulse.flags.tendon_applied = true;

    return impulse;
  }

  return {
    meta: tendonMeta,
    apply: applyPulseMeshTendons,
    tendons: PulseMeshTendons
  };
}
