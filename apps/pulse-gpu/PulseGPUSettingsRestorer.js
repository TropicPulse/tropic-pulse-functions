// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUSettingsRestorer.js
// PULSE GPU SETTINGS RESTORER v7.7
// “COGNITIVE RECOGNITION LAYER / RESTORATION PLANNER”
// ============================================================================
//
// PERSONALITY + ROLE:
//   PulseGPUSettingsRestorer is the **COGNITIVE RECOGNITION LAYER**.
//   It is the **RESTORATION PLANNER** — the subsystem that reads advice
//   and recognizes what concrete action should be taken.
//
//   • Consumes advisor insights (Drive Center) + memory entries (Evolution Core)
//   • Recognizes whether to restore, apply optimal, upgrade tier, or noop
//   • Produces deterministic restoration plans for the Healer + Orchestrator
//
// SAFETY CONTRACT (v7.7):
//   • No randomness
//   • No timestamps
//   • No GPU calls
//   • No DOM
//   • No Node APIs
//   • No network or filesystem access
//   • Fail-open: invalid advice → noop plan
//   • Self-repair-ready: plans include OS metadata
// ============================================================================

// ------------------------------------------------------------
// ⭐ OS‑v7 CONTEXT METADATA
// ------------------------------------------------------------
const RESTORER_CONTEXT = {
  layer: "PulseGPUSettingsRestorer",
  role: "GPU_SETTINGS_RESTORER",
  purpose: "Deterministic planner for GPU settings restoration",
  context:
    "Consumes advisor insights + memory entries to produce restoration plans",
  target: "full-gpu",
  version: 7.7,
  selfRepairable: true,
  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true
  }
};

// ------------------------------------------------------------
// Restoration plan builder (v7.7 + OS‑v7 metadata)
// ------------------------------------------------------------
function buildPlan({
  action,
  reason,
  targetSettings = null,
  baselineSettings = null,
  extra = null
}) {
  return {
    action,
    reason,
    targetSettings,
    baselineSettings,
    extra,
    meta: { ...RESTORER_CONTEXT }
  };
}

// ------------------------------------------------------------
// Plan validation (for healing layer)
// ------------------------------------------------------------
function validatePlan(plan) {
  if (!plan || typeof plan !== "object") return false;
  if (typeof plan.action !== "string") return false;
  if (typeof plan.reason !== "string") return false;
  if (!plan.meta || plan.meta.layer !== "PulseGPUSettingsRestorer") return false;
  return true;
}

// ------------------------------------------------------------
// PulseGPUSettingsRestorer v7.7 — Cognitive Recognition Layer
// ------------------------------------------------------------
class PulseGPUSettingsRestorer {
  constructor() {}

  static meta = { ...RESTORER_CONTEXT };

  // ----------------------------------------------------
  // Main entry point:
  //   Takes an array of advice objects → returns a plan.
  // ----------------------------------------------------
  buildRestorePlan(adviceList = []) {
    if (!Array.isArray(adviceList) || adviceList.length === 0) {
      return buildPlan({
        action: "noop",
        reason: "No advice available."
      });
    }

    const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };

    const sorted = adviceList
      .filter((a) => a && typeof a === "object")
      .slice()
      .sort((a, b) => {
        const sa = severityRank[a.severity] || 0;
        const sb = severityRank[b.severity] || 0;
        return sb - sa;
      });

    if (sorted.length === 0) {
      return buildPlan({
        action: "noop",
        reason: "No valid advice available."
      });
    }

    const top = sorted[0];

    switch (top.type) {
      case "regression":
        return this.buildRestorePlanForRegression(top);

      case "suboptimal":
        return this.buildRestorePlanForSuboptimal(top);

      case "tier-upgrade-opportunity":
        return this.buildRestorePlanForTierUpgrade(top);

      case "improvement":
        return this.buildRestorePlanForImprovement(top);

      default:
        return buildPlan({
          action: "noop",
          reason: "Advice type not recognized."
        });
    }
  }

  // ----------------------------------------------------
  // Regression → restore baseline settings
  // ----------------------------------------------------
  buildRestorePlanForRegression(advice) {
    return buildPlan({
      action: "restore",
      reason: "Performance regressed compared to best-known configuration.",
      targetSettings: advice.baselineSettings || null,
      baselineSettings: advice.baselineSettings || null,
      extra: {
        deltaPercent: advice.deltaPercent,
        baselineMetrics: advice.extra?.baselineMetrics,
        repairHint:
          advice.extra?.repairHint || "restore-baseline-settings"
      }
    });
  }

  // ----------------------------------------------------
  // Suboptimal → apply optimal baseline settings
  // ----------------------------------------------------
  buildRestorePlanForSuboptimal(advice) {
    return buildPlan({
      action: "apply-optimal",
      reason: "Current settings are below best-known performance.",
      targetSettings: advice.baselineSettings || null,
      baselineSettings: advice.baselineSettings || null,
      extra: {
        deltaPercent: advice.deltaPercent,
        baselineMetrics: advice.extra?.baselineMetrics,
        repairHint:
          advice.extra?.repairHint || "suggest-baseline-settings"
      }
    });
  }

  // ----------------------------------------------------
  // Tier upgrade opportunity → apply new-tier optimal settings
  // ----------------------------------------------------
  buildRestorePlanForTierUpgrade(advice) {
    return buildPlan({
      action: "upgrade-tier",
      reason:
        "A higher tier configuration has historically delivered better performance.",
      targetSettings: advice.baselineSettings || null,
      baselineSettings: advice.baselineSettings || null,
      extra: {
        deltaPercent: advice.deltaPercent,
        oldTierProfile: advice.extra?.oldTierProfile,
        newTierProfile: advice.extra?.newTierProfile,
        newTierMetrics: advice.extra?.newTierMetrics,
        repairHint: advice.extra?.repairHint || "upgrade-tier"
      }
    });
  }

  // ----------------------------------------------------
  // Improvement → no action needed
  // ----------------------------------------------------
  buildRestorePlanForImprovement(advice) {
    return buildPlan({
      action: "noop",
      reason: "Performance improved; no restoration needed.",
      targetSettings: null,
      baselineSettings: advice.baselineSettings || null,
      extra: {
        deltaPercent: advice.deltaPercent,
        repairHint:
          advice.extra?.repairHint || "promote-current-to-baseline"
      }
    });
  }
}

// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseGPUSettingsRestorer,
  buildPlan,
  validatePlan
};
