// [pulse:mesh] COMMUNITY_CORTEX_LAYER  // blue
// - high-level decision layer for impulses
// - applies survival-pattern instincts: risk, novelty, cooperation, resource budgeting
// - sets strategic priority + intent, but NEVER computes payloads
// - sits above Tendons, below Earners (EarnEngine)

// -----------------------------------------------------------
// Cortex Instinct Pack
// -----------------------------------------------------------

export const PulseCortex = {
  // [pulse:mesh] CORTEX_RISK  // red
  // - risk instinct: down-rank impulses that look expensive or unsafe
  risk(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const cost = context.estimatedCost || 0.0;   // 0–1
    const threat = context.threatLevel || 0.0;   // 0–1

    const penalty = (cost * 0.3) + (threat * 0.7);
    return clamp01(base - penalty);
  },

  // [pulse:mesh] CORTEX_NOVELTY  // purple
  // - curiosity instinct: up-rank novel / rare impulses
  novelty(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const seen = context.frequency || 0.0; // 0 = never, 1 = very common

    const boost = (1 - seen) * 0.3;
    return clamp01(base + boost);
  },

  // [pulse:mesh] CORTEX_COOPERATION  // teal
  // - cooperation instinct: prefer impulses that benefit many nodes
  cooperation(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const reach = context.impactRadius || 0.0; // 0–1

    const boost = reach * 0.25;
    return clamp01(base + boost);
  },

  // [pulse:mesh] CORTEX_RESOURCE_BUDGET  // amber
  // - resource instinct: throttle low-value impulses under load
  resourceBudget(impulse, context = {}) {
    const base = impulse.score || 0.5;
    const load = context.globalLoad || 0.0; // 0–1

    if (load < 0.5) return base;
    const penalty = (load - 0.5) * 0.4;
    return clamp01(base - penalty);
  },

  // [pulse:mesh] CORTEX_ANOMALY  // magenta
  // - anomaly instinct: flag weird impulses for special handling
  anomaly(impulse, context = {}) {
    const weird = context.anomalyScore || 0.0; // 0–1
    if (weird >= 0.8) {
      impulse.flags = impulse.flags || {};
      impulse.flags['cortex_anomaly'] = true;
    }
    return impulse;
  },
};

// -----------------------------------------------------------
// Cortex Engine
// -----------------------------------------------------------

export function applyPulseCortex(impulse, context = {}) {
  // [pulse:mesh] CORTEX_ENGINE  // blue
  // - combines survival instincts into a final strategic score + intent
  // - does NOT compute payloads, only shapes metadata

  let score = impulse.score ?? 0.5;

  score = PulseCortex.risk({ ...impulse, score }, context);
  score = PulseCortex.novelty({ ...impulse, score }, context);
  score = PulseCortex.cooperation({ ...impulse, score }, context);
  score = PulseCortex.resourceBudget({ ...impulse, score }, context);

  impulse.score = score;

  PulseCortex.anomaly(impulse, context);

  // strategic intent tag
  impulse.flags = impulse.flags || {};
  impulse.flags['cortex_intent'] = classifyIntent(score, context);

  return impulse;
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function classifyIntent(score, context) {
  // [pulse:mesh] CORTEX_INTENT_CLASS  // blue
  // - simple strategic intent classification
  const load = context.globalLoad || 0.0;

  if (score >= 0.85 && load < 0.7) return 'push_hard';
  if (score >= 0.5) return 'normal';
  if (score < 0.3) return 'defer_or_drop';
  return 'cautious';
}
