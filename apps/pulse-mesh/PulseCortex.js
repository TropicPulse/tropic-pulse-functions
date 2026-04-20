// ============================================================================
// [pulse:mesh] COMMUNITY_CORTEX_LAYER v7.4  // blue
// Strategic Decision Layer • Survival-Pattern Instincts • Metadata-Only
// ============================================================================
//
// IDENTITY — THE MESH CORTEX:
//  ---------------------------
//  • High-level decision layer for impulses.
//  • Applies survival-pattern instincts: risk, novelty, cooperation, budgeting.
//  • Sets strategic priority + intent, NEVER computes payloads.
//  • Sits above Tendons, below Earners (EarnEngine).
//
// DUAL-MODE ADVANTAGE (conceptual only):
//  --------------------------------------
//  • mental-mode: pattern clarity, instinct sharpening
//  • system-mode: faster evaluation, cheaper scoring
//  • unified-mode: both advantages ALWAYS active (AND-architecture)
//
// LOCAL + INTERNET ADVANTAGE (conceptual only):
//  ---------------------------------------------
//  • local: node-level context, load, trust, anomaly
//  • internet: cluster-wide resonance, cross-instance patterns
//  • unified: cortex inherits BOTH (no OR)
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • If ANY layer evolves → cortex inherits the advantage
//  • If pulses collapse 1000→1 → cortex inherits the gain
//  • If runtime accelerates → cortex accelerates
//  • If aura stabilizes → cortex stabilizes
//  • If reflex sharpens → cortex sharpens
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No payload mutation
//  • No async
//  • Deterministic: same impulse → same strategic score
//  • Fail-open: missing context → safe defaults
// ============================================================================


// -----------------------------------------------------------
// Cortex Instinct Pack (logic upgraded with flow-awareness)
// -----------------------------------------------------------

export const PulseCortex = {
  // [pulse:mesh] CORTEX_RISK  // red
  risk(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const cost = context.estimatedCost || 0.0;
    const threat = context.threatLevel || 0.0;

    const penalty = (cost * 0.3) + (threat * 0.7);
    return clamp01(base - penalty);
  },

  // [pulse:mesh] CORTEX_NOVELTY  // purple
  novelty(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const seen = context.frequency || 0.0;

    const boost = (1 - seen) * 0.3;
    return clamp01(base + boost);
  },

  // [pulse:mesh] CORTEX_COOPERATION  // teal
  cooperation(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const reach = context.impactRadius || 0.0;

    const boost = reach * 0.25;
    return clamp01(base + boost);
  },

  // [pulse:mesh] CORTEX_RESOURCE_BUDGET  // amber
  //
  // Now aware of:
  //  • globalLoad          — normal system load
  //  • flowPressure        — how close Flow is to throttling (0–1)
  //  • recentThrottleRate  — fraction of impulses recently throttled (0–1)
  //
  resourceBudget(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const load = context.globalLoad || 0.0;
    const flowPressure = context.flowPressure || 0.0;        // from Halo/Flow
    const recentThrottleRate = context.recentThrottleRate || 0.0; // from Halo

    // Start with classic load penalty.
    let penalty = 0;
    if (load >= 0.5) {
      penalty += (load - 0.5) * 0.4;
    }

    // If Flow is under pressure, add extra caution.
    // High flowPressure means we're near the guard.
    if (flowPressure > 0.3) {
      penalty += flowPressure * 0.4;
    }

    // If we’ve actually been throttling recently, be even more conservative.
    if (recentThrottleRate > 0.0) {
      penalty += recentThrottleRate * 0.5;
    }

    return clamp01(base - penalty);
  },

  // [pulse:mesh] CORTEX_ANOMALY  // magenta
  anomaly(impulse, context = {}) {
    const weird = context.anomalyScore || 0.0;
    if (weird >= 0.8) {
      impulse.flags = impulse.flags || {};
      impulse.flags["cortex_anomaly"] = true;
    }

    // If Flow had to throttle this impulse, tag that as a structural anomaly.
    if (impulse.flags?.flow_throttled) {
      impulse.flags = impulse.flags || {};
      impulse.flags["cortex_flow_anomaly"] = true;
    }

    return impulse;
  }
};


// -----------------------------------------------------------
// Cortex Engine (logic upgraded, metadata upgraded)
// -----------------------------------------------------------

export function applyPulseCortex(impulse, context = {}) {
  // attach v7.4 meta
  impulse.meta = impulse.meta || {};
  impulse.meta.cortex = {
    layer: "PulseCortex",
    role: "MESH_STRATEGIC_LAYER",
    version: 7.4,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,                 // mental + system
      localAware: true,               // node-level context
      internetAware: true,            // cluster-level context
      advantageCascadeAware: true,    // inherits ANY advantage
      pulseEfficiencyAware: true,     // 1-pulse collapse
      driftProof: true,
      multiInstanceReady: true
    }
  };

  // strategic scoring pipeline
  let score = impulse.score ?? 0.5;

  score = PulseCortex.risk({ ...impulse, score }, context);
  score = PulseCortex.novelty({ ...impulse, score }, context);
  score = PulseCortex.cooperation({ ...impulse, score }, context);
  score = PulseCortex.resourceBudget({ ...impulse, score }, context);

  impulse.score = score;

  // anomaly tagging (now includes flow-throttle anomalies)
  PulseCortex.anomaly(impulse, context);

  // strategic intent
  impulse.flags = impulse.flags || {};
  impulse.flags["cortex_intent"] = classifyIntent(score, context);

  return impulse;
}


// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function classifyIntent(score, context) {
  const load = context.globalLoad || 0.0;
  const flowPressure = context.flowPressure || 0.0;
  const recentThrottleRate = context.recentThrottleRate || 0.0;

  // If Flow is under heavy pressure or we’re throttling a lot,
  // never "push_hard" even with a high score.
  const environmentHot =
    flowPressure > 0.5 || recentThrottleRate > 0.2 || load > 0.8;

  if (score >= 0.85 && !environmentHot) return "push_hard";
  if (score >= 0.5) return "normal";
  if (score < 0.3) return "defer_or_drop";
  return "cautious";
}
