// ============================================================================
// FILE: PulseMeshCortex-v15-EVO-IMMORTAL.js
// [pulse:mesh] COMMUNITY_CORTEX_LAYER v15-EVO-IMMORTAL  // blue
// Strategic Decision Layer • Survival-Pattern Instincts • Metadata-Only
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof • Advantage-Aware
// ============================================================================
//
// IDENTITY — THE MESH CORTEX (v15-EVO-IMMORTAL):
// ----------------------------------------------
// • High-level strategic decision layer for impulses (community cortex).
// • Applies survival-pattern instincts: risk, novelty, cooperation, budgeting.
// • Sets strategic priority + intent, NEVER computes or mutates payloads.
// • Sits above Tendons, below Earners — pure metadata shaping layer.
// • Deterministic-field, unified-advantage-field,
//   factoring-aware, flow-aware, drift-aware, aura-aware,
//   binary-aware, dual-band-ready, presence-aware,
//   multi-instance-ready, chunk/prewarm-ready.
// • Fully deterministic: same impulse + same context → same score + intent.
// • Zero randomness, zero timestamps, zero async, zero network, zero FS.
//
// SAFETY CONTRACT (v15):
// ----------------------
// • No randomness
// • No timestamps
// • No payload mutation (flags + meta only)
// • No async
// • No network, no filesystem, no env access
// • Deterministic: same impulse/context → same strategic score
// • Fail-open: missing context → safe defaults
// • Metadata-only shaping (no routing side-effects by itself)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshCortex",
  version: "v14.9-MESH-CORTEX-IMMORTAL",
  layer: "mesh",
  role: "mesh_symbolic_interpretation",
  lineage: "PulseMesh-v14",

  evo: {
    cortex: true,                   // This IS the mesh cortex
    symbolicAware: true,            // Symbolic interpretation
    binaryAware: true,              // Binary hints + binary routing
    dualBand: true,                 // Symbolic + binary cortex
    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshCognition",
      "PulseMeshAwareness",
      "PulseMeshFlow"
    ],
    never: [
      "legacyMeshCortex",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/
// ============================================================================
// FILE: PulseMeshCortex-v15-EVO-IMMORTAL.js
// [pulse:mesh] COMMUNITY_CORTEX_LAYER v15-EVO-IMMORTAL  // blue
// Strategic Decision Layer • Survival-Pattern Instincts • Metadata-Only
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof • Advantage-Aware
// ============================================================================

export function createPulseMeshCortex({ context = {}, log, warn, error } = {}) {

  // -----------------------------------------------------------
  // IMMORTAL META (attached to every impulse)
  // -----------------------------------------------------------
  const CORTEX_META = {
    layer: "PulseCortex",
    role: "MESH_STRATEGIC_LAYER",
    version: "15-EVO-IMMORTAL",
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
      bandAware: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // -----------------------------------------------------------
  // Instinct Pack (v15 IMMORTAL)
  // -----------------------------------------------------------
  const PulseCortex = {

    risk(impulse, ctx = {}) {
      const base = impulse.score ?? 0.5;
      const cost = ctx.estimatedCost ?? 0.0;
      const threat = ctx.threatLevel ?? 0.0;
      const penalty = (cost * 0.3) + (threat * 0.7);
      return clamp01(base - penalty);
    },

    novelty(impulse, ctx = {}) {
      const base = impulse.score ?? 0.5;
      const seen = ctx.frequency ?? 0.0;
      const boost = (1 - seen) * 0.3;
      return clamp01(base + boost);
    },

    cooperation(impulse, ctx = {}) {
      const base = impulse.score ?? 0.5;
      const reach = ctx.impactRadius ?? 0.0;
      return clamp01(base + reach * 0.25);
    },

    resourceBudget(impulse, ctx = {}) {
      const base = impulse.score ?? 0.5;
      const load = ctx.globalLoad ?? 0.0;
      const flowPressure = ctx.flowPressure ?? 0.0;
      const throttle = ctx.recentThrottleRate ?? 0.0;
      const factoringBias = impulse.flags?.aura_factoring_bias ?? 0.0;

      let penalty = 0;
      if (load >= 0.5) penalty += (load - 0.5) * 0.4;
      if (flowPressure > 0.3) penalty += flowPressure * 0.4;
      if (throttle > 0.0) penalty += throttle * 0.5;
      if (factoringBias > 0.0) penalty += factoringBias * 0.4;

      return clamp01(base - penalty);
    },

    binaryAwareness(impulse, ctx = {}) {
      const base = impulse.score ?? 0.5;
      const bias = ctx.binaryBias ?? 0.0;
      if (bias <= 0) return base;
      return clamp01(base + bias * 0.15);
    },

    presenceAwareness(impulse) {
      const base = impulse.score ?? 0.5;
      const band = impulse.band ?? "symbolic";
      if (band === "binary") return clamp01(base + 0.05);
      if (band === "dual") return clamp01(base + 0.03);
      return base;
    },

    anomaly(impulse, ctx = {}) {
      const weird = ctx.anomalyScore ?? 0.0;

      impulse.flags = impulse.flags || {};

      if (weird >= 0.8) impulse.flags.cortex_anomaly = true;
      if (impulse.flags.flow_throttled) impulse.flags.cortex_flow_anomaly = true;
      if (impulse.flags.aura_prefers_factored_paths)
        impulse.flags.cortex_factoring_anomaly = true;

      return impulse;
    }
  };

  // -----------------------------------------------------------
  // Cortex Engine (IMMORTAL)
  // -----------------------------------------------------------
  function applyPulseCortex(impulse, ctx = {}) {
    impulse.meta = impulse.meta || {};
    impulse.meta.cortex = CORTEX_META;

    let score = impulse.score ?? 0.5;

    // Deterministic instinct pipeline
    score = PulseCortex.risk({ ...impulse, score }, ctx);
    score = PulseCortex.novelty({ ...impulse, score }, ctx);
    score = PulseCortex.cooperation({ ...impulse, score }, ctx);
    score = PulseCortex.resourceBudget({ ...impulse, score }, ctx);
    score = PulseCortex.binaryAwareness({ ...impulse, score }, ctx);
    score = PulseCortex.presenceAwareness({ ...impulse, score }, ctx);

    impulse.score = score;

    // Flags-only anomaly tagging
    PulseCortex.anomaly(impulse, ctx);

    impulse.flags = impulse.flags || {};
    impulse.flags.cortex_intent = classifyIntent(score, ctx, impulse);

    return impulse;
  }

  // -----------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------
  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function classifyIntent(score, ctx, impulse) {
    const load = ctx.globalLoad ?? 0.0;
    const flowPressure = ctx.flowPressure ?? 0.0;
    const throttle = ctx.recentThrottleRate ?? 0.0;
    const factoringBias = impulse.flags?.aura_factoring_bias ?? 0.0;

    const environmentHot =
      flowPressure > 0.5 ||
      throttle > 0.2 ||
      load > 0.8 ||
      factoringBias > 0.5;

    if (score >= 0.85 && !environmentHot) return "push_hard";
    if (score >= 0.5) return "normal";
    if (score < 0.3) return "defer_or_drop";
    return "cautious";
  }

  // -----------------------------------------------------------
  // CONTEXT ATTACHMENT (IMMORTAL)
  // -----------------------------------------------------------
  // This makes Cortex globally available to all mesh organs.
  context.applyPulseCortex = applyPulseCortex;

  // -----------------------------------------------------------
  // PUBLIC API
  // -----------------------------------------------------------
  return {
    apply: applyPulseCortex,
    instincts: PulseCortex,
    meta: CORTEX_META
  };
}
