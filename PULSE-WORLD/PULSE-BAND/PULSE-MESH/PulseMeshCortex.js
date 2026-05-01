// ============================================================================
// [pulse:mesh] COMMUNITY_CORTEX_LAYER v12.3-PRESENCE-EVO-MAX-PRIME  // blue
// Strategic Decision Layer • Survival-Pattern Instincts • Metadata-Only
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof
// ============================================================================
//
// IDENTITY — THE MESH CORTEX (v12.3):
// -----------------------------------
// • High-level decision layer for impulses.
// • Applies survival-pattern instincts: risk, novelty, cooperation, budgeting.
// • Sets strategic priority + intent, NEVER computes payloads.
// • Sits above Tendons, below Earners.
// • Deterministic-field, unified-advantage-field,
//   factoring-aware, flow-aware, drift-aware, aura-aware,
//   binary-aware, dual-band-ready, presence-aware,
//   multi-instance-ready.
//
// SAFETY CONTRACT (v12.3):
// -------------------------
// • No randomness
// • No timestamps
// • No payload mutation
// • No async
// • Deterministic: same impulse → same strategic score
// • Fail-open: missing context → safe defaults
// • Metadata-only shaping
// ============================================================================


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// (Cortex MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseMeshCortex({ log, warn, error }) {

  // -----------------------------------------------------------
  // Cortex Instinct Pack (v12.3, presence-aware, binary-aware)
  // -----------------------------------------------------------
  const PulseCortex = {

    // [pulse:mesh] CORTEX_RISK  // red
    risk(impulse, context = {}) {
      const base = impulse.score ?? 0.5;
      const cost = context.estimatedCost ?? 0.0;
      const threat = context.threatLevel ?? 0.0;

      const penalty = (cost * 0.3) + (threat * 0.7);
      return clamp01(base - penalty);
    },

    // [pulse:mesh] CORTEX_NOVELTY  // purple
    novelty(impulse, context = {}) {
      const base = impulse.score ?? 0.5;
      const seen = context.frequency ?? 0.0;

      const boost = (1 - seen) * 0.3;
      return clamp01(base + boost);
    },

    // [pulse:mesh] CORTEX_COOPERATION  // teal
    cooperation(impulse, context = {}) {
      const base = impulse.score ?? 0.5;
      const reach = context.impactRadius ?? 0.0;

      const boost = reach * 0.25;
      return clamp01(base + boost);
    },

    // [pulse:mesh] CORTEX_RESOURCE_BUDGET  // amber
    resourceBudget(impulse, context = {}) {
      const base = impulse.score ?? 0.5;

      const load = context.globalLoad ?? 0.0;
      const flowPressure = context.flowPressure ?? 0.0;
      const recentThrottleRate = context.recentThrottleRate ?? 0.0;
      const factoringBias = impulse.flags?.aura_factoring_bias ?? 0.0;

      let penalty = 0;

      if (load >= 0.5) penalty += (load - 0.5) * 0.4;
      if (flowPressure > 0.3) penalty += flowPressure * 0.4;
      if (recentThrottleRate > 0.0) penalty += recentThrottleRate * 0.5;

      // v12.3: factoring pressure reduces budget more aggressively
      if (factoringBias > 0.0) penalty += factoringBias * 0.4;

      return clamp01(base - penalty);
    },

    // [pulse:mesh] CORTEX_BINARY_AWARENESS  // cyan
    binaryAwareness(impulse, context = {}) {
      const binaryBias = context.binaryBias ?? 0.0;
      const base = impulse.score ?? 0.5;

      if (binaryBias <= 0) return base;

      // binary preference gently boosts score
      return clamp01(base + (binaryBias * 0.15));
    },

    // [pulse:mesh] CORTEX_PRESENCE_AWARENESS  // white
    presenceAwareness(impulse, context = {}) {
      const band = impulse.band ?? "symbolic";
      const base = impulse.score ?? 0.5;

      if (band === "binary") return clamp01(base + 0.05);
      if (band === "dual") return clamp01(base + 0.03);

      return base;
    },

    // [pulse:mesh] CORTEX_ANOMALY  // magenta
    anomaly(impulse, context = {}) {
      const weird = context.anomalyScore ?? 0.0;

      if (weird >= 0.8) {
        impulse.flags = impulse.flags || {};
        impulse.flags["cortex_anomaly"] = true;
      }

      if (impulse.flags?.flow_throttled) {
        impulse.flags["cortex_flow_anomaly"] = true;
      }

      if (impulse.flags?.aura_prefers_factored_paths) {
        impulse.flags["cortex_factoring_anomaly"] = true;
      }

      return impulse;
    }
  };


  // -----------------------------------------------------------
  // Cortex Engine (v12.3)
  // -----------------------------------------------------------
  function applyPulseCortex(impulse, context = {}) {
    impulse.meta = impulse.meta || {};
    impulse.meta.cortex = {
      layer: "PulseCortex",
      role: "MESH_STRATEGIC_LAYER",
      version: "12.3-PRESENCE-EVO-MAX-PRIME",
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
        signalFactoringAware: true,
        flowAware: true,
        driftAware: true,
        presenceAware: true,
        bandAware: true
      }
    };

    let score = impulse.score ?? 0.5;

    score = PulseCortex.risk({ ...impulse, score }, context);
    score = PulseCortex.novelty({ ...impulse, score }, context);
    score = PulseCortex.cooperation({ ...impulse, score }, context);
    score = PulseCortex.resourceBudget({ ...impulse, score }, context);
    score = PulseCortex.binaryAwareness({ ...impulse, score }, context);
    score = PulseCortex.presenceAwareness({ ...impulse, score }, context);

    impulse.score = score;

    PulseCortex.anomaly(impulse, context);

    impulse.flags = impulse.flags || {};
    impulse.flags["cortex_intent"] = classifyIntent(score, context, impulse);

    return impulse;
  }


  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function classifyIntent(score, context, impulse) {
    const load = context.globalLoad ?? 0.0;
    const flowPressure = context.flowPressure ?? 0.0;
    const recentThrottleRate = context.recentThrottleRate ?? 0.0;
    const factoringBias = impulse.flags?.aura_factoring_bias ?? 0.0;

    const environmentHot =
      flowPressure > 0.5 ||
      recentThrottleRate > 0.2 ||
      load > 0.8 ||
      factoringBias > 0.5;

    // v12.3: NEVER push_hard under pressure
    if (score >= 0.85 && !environmentHot) return "push_hard";
    if (score >= 0.5) return "normal";
    if (score < 0.3) return "defer_or_drop";
    return "cautious";
  }


  // -----------------------------------------------------------
  // PUBLIC INTERFACE
  // -----------------------------------------------------------
  return {
    apply: applyPulseCortex,
    instincts: PulseCortex
  };
}
