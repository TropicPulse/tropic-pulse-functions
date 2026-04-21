// ============================================================================
// FILE: PulseMeshTendons.js
// PULSE OS — v9.2
// CONNECTIVE TISSUE ORGAN — “PulseMeshTendons”
// Intent Translation • Earn-Ready Shaping • Pressure + Route-Mode Aware
// ============================================================================
//
// IDENTITY — THE TENDON ORGAN (v9.2):
// -----------------------------------
// • Translates Cortex intent into earn-ready metadata.
// • Classifies impulses (heavy/medium/light).
// • Shapes routeHint based on class + system pressure + factoring pressure.
// • Stabilizes energy under drift/tension.
// • Attaches volatility + earn-context for EarnEngine.
// • Pure metadata-only — zero payload mutation.
// • Deterministic, drift-proof, connective tissue.
// • Aware of Aura factoring bias + mesh factoring pressure (metadata-only).
// • Route-mode aware: local / cluster / internet (metadata-only).
// • Local-first: prefers local/cluster earners over internet earners.
// • Internet-limited: can discourage or block internet paths under pressure.
//
// ROLE IN THE DIGITAL BODY (v9.2):
// --------------------------------
// • Tendons = connective tissue between Cortex → Mesh → EarnEngine.
// • Intent Translator → shapes class + routeHint.
// • Pressure-Aware → downgrades heavy class under tension.
// • Factoring-Aware → prefers factored / cheaper paths under pressure.
// • Route-Mode Aware → biases toward local/cluster under stress.
// • Energy Stabilizer → prevents runaway impulses.
// • Earn Context Provider → gives EarnEngine a full context snapshot.
//
// SAFETY CONTRACT:
// ----------------
// • No routing, no compute, no payload mutation.
// • Metadata-only, reversible, safe.
// • No autonomy, no sentience.
// ============================================================================


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// Tendons MUST HAVE ZERO IMPORTS
// Expected injected deps:
//   • getPressureSnapshot → () => FieldState-like snapshot
// ============================================================================
export function createPulseMeshTendons({ getPressureSnapshot, log, warn, error }) {

  const tendonMeta = {
    layer: "PulseMeshTendons",
    role: "INTENT_TRANSLATION",
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
      futureEvolutionReady: true,
      signalFactoringAware: true
    }
  };

  // ========================================================================
  // Tendon Pack (v9.2)
  // ========================================================================
  const PulseMeshTendons = {

    // -------------------------------------------------------
    // CLASSIFY — heavy / medium / light (pressure + factoring aware)
    // -------------------------------------------------------
    classify(impulse, field) {
      let score = impulse.score || 0;

      const tension =
        (field.driftPressure || 0) * 0.4 +
        (field.auraTension || 0) * 0.3 +
        (field.flowPressure || 0) * 0.3;

      const factoringBias = impulse.flags?.aura_factoring_bias || 0;

      // factoring pressure slightly reduces effective score
      score = score - tension * 0.2 - factoringBias * 0.1;

      if (score >= 0.85) return "heavy";
      if (score >= 0.45) return "medium";
      return "light";
    },

    // -------------------------------------------------------
    // ROUTE HINT — earn class + route mode (local-first, internet-limited)
// -------------------------------------------------------
    routeHint(impulse, cls, field) {
      impulse.flags = impulse.flags || {};

      const flow = field.flowPressure || 0;
      const drift = field.driftPressure || 0;
      const auraTension = field.auraTension || 0;
      const factoringPreferred = !!impulse.flags.aura_prefers_factored_paths;

      const pressureScore =
        flow * 0.4 +
        drift * 0.3 +
        auraTension * 0.3;

      // Base earn class (preserve v9.1 contract)
      switch (cls) {
        case "heavy":
          impulse.routeHint = "earner-heavy";
          break;
        case "medium":
          impulse.routeHint = "earner-medium";
          break;
        default:
          impulse.routeHint = "earner-light";
      }

      // Route mode (metadata-only, for mesh + earners):
      //   local / cluster / internet
      let routeMode = "local";

      // Low pressure → allow cluster; internet only if explicitly hinted
      if (pressureScore < 0.25) {
        routeMode = impulse.flags.route_mode_hint || "cluster";
      }

      // Moderate pressure → prefer local, discourage internet
      if (pressureScore >= 0.25 && pressureScore < 0.5) {
        routeMode = "local";
        impulse.flags.tendon_internet_discouraged = true;
      }

      // High pressure or factoring preference → hard local-first
      if (pressureScore >= 0.5 || factoringPreferred) {
        routeMode = "local";
        impulse.flags.tendon_internet_blocked = true;
      }

      impulse.flags.tendon_route_mode = routeMode;

      // Under high pressure + factoring preference, bias heavy toward cheaper earners
      if (cls === "heavy" && (flow > 0.5 || factoringPreferred)) {
        impulse.routeHint = "earner-medium";
        impulse.flags.tendon_pressure_downgrade = true;
      }

      return impulse;
    },

    // -------------------------------------------------------
    // SHAPE ENERGY — stabilize under tension + factoring
    // -------------------------------------------------------
    shapeEnergy(impulse, cls, field) {
      impulse.flags = impulse.flags || {};

      const tension =
        (field.driftPressure || 0) * 0.5 +
        (field.meshStormPressure || 0) * 0.3 +
        (field.throttleRate || 0) * 0.2;

      const factoringBias = impulse.flags.aura_factoring_bias || 0;

      const combinedTension = tension + factoringBias * 0.3;

      if (combinedTension > 0.4) {
        impulse.flags.tendon_energy_stabilized = true;
        return impulse;
      }

      if (cls === "heavy") impulse.energy *= 1.1;
      if (cls === "light") impulse.energy *= 0.9;

      return impulse;
    },

    // -------------------------------------------------------
    // STABILIZE EARN CLASS — downgrade heavy under drift/factoring
    // -------------------------------------------------------
    stabilizeEarnClass(impulse, cls, field) {
      impulse.flags = impulse.flags || {};

      const drift = field.driftPressure || 0;
      const factoringBias = impulse.flags.aura_factoring_bias || 0;

      if (
        cls === "heavy" &&
        (drift > 0.45 || factoringBias > 0.5)
      ) {
        impulse.flags.tendon_heavy_stabilized = true;
        return "medium";
      }
      return cls;
    },

    // -------------------------------------------------------
    // NORMALIZE EARN ENERGY — clamp under high tension
    // -------------------------------------------------------
    normalizeEarnEnergy(impulse, field) {
      impulse.flags = impulse.flags || {};

      const tension =
        (field.driftPressure || 0) * 0.4 +
        (field.meshStormPressure || 0) * 0.4 +
        (field.throttleRate || 0) * 0.2;

      const factoringBias = impulse.flags.aura_factoring_bias || 0;

      const combinedTension = tension + factoringBias * 0.3;

      if (combinedTension > 0.5) {
        impulse.flags.tendon_energy_normalized = true;
        const e = impulse.energy ?? 1;
        impulse.energy = Math.max(0.1, Math.min(e, 1));
      }

      return impulse;
    },

    // -------------------------------------------------------
    // ATTACH VOLATILITY — for EarnEngine risk view
    // -------------------------------------------------------
    attachVolatility(impulse, field) {
      impulse.flags = impulse.flags || {};

      const volatility =
        (field.noise || 0) * 0.4 +
        (field.friction || 0) * 0.3 +
        (field.meshStormPressure || 0) * 0.3;

      impulse.flags.earner_volatility = volatility;

      return impulse;
    },

    // -------------------------------------------------------
    // ATTACH EARN CONTEXT — full context snapshot for EarnEngine
    // -------------------------------------------------------
    attachEarnContext(impulse, cls, field) {
      impulse.flags = impulse.flags || {};

      const factoringBias = impulse.flags.aura_factoring_bias || 0;
      const prefersFactored = !!impulse.flags.aura_prefers_factored_paths;

      impulse.flags.earner_context = {
        class: cls,
        expected_load: field.flowPressure ?? 0,
        expected_drift: field.driftPressure ?? 0,
        expected_noise: field.noise ?? 0,
        expected_friction: field.friction ?? 0,
        urgency: impulse.energy ?? 1,
        stability_hint: field.stability ?? 1,
        aura_tension: field.auraTension ?? 0,
        mesh_storm: field.meshStormPressure ?? 0,
        factoring_bias: factoringBias,
        prefers_factored_paths: prefersFactored,
        route_mode: impulse.flags.tendon_route_mode || "local"
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
  // Tendon Engine (v9.2)
  // “Apply connective tissue shaping for Mesh → EarnEngine”
  // ========================================================================
  function applyPulseMeshTendons(impulse) {
    impulse.flags = impulse.flags || {};

    const field = getPressureSnapshot() || {};

    impulse.flags.tendon_meta = tendonMeta;

    let cls = PulseMeshTendons.classify(impulse, field);

    cls = PulseMeshTendons.stabilizeEarnClass(impulse, cls, field);

    PulseMeshTendons.routeHint(impulse, cls, field);

    PulseMeshTendons.shapeEnergy(impulse, cls, field);

    PulseMeshTendons.normalizeEarnEnergy(impulse, field);

    PulseMeshTendons.attachVolatility(impulse, field);

    PulseMeshTendons.attachEarnContext(impulse, cls, field);

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
