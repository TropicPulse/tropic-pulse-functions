// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUSettingsRestorer.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUSettingsRestorer — consumes:
//       • PulseGPUPerformanceAdvisor advice objects
//       • PulseGPUSettingsMemory entries
//   and produces deterministic "restoration plans":
//       • which settings to restore
//       • which settings to apply
//       • which settings to upgrade
//       • which settings to revert
//
//   This file IS:
//     • A pure logic module
//     • A deterministic planner for GPU settings restoration
//     • A bridge between advisor insights and actionable changes
//     • v5-ready: plans are compatible with the self-healing layer
//
//   This file IS NOT:
//     • A renderer
//     • A GPU runtime
//     • A WebGPU/WebGL interface
//     • A persistence layer
//     • A UI or notification system
//     • A backend module
//
// DEPLOYMENT:
//   Lives in /apps/pulse-gpu as part of the GPU subsystem.
//   Must remain ESM-only and side-effect-free.
//   Must be safe to run in both browser and server environments.
//
// SAFETY RULES:
//   • NO WebGPU/WebGL APIs
//   • NO DOM APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • NO mutation of external state
//   • FAIL-OPEN: malformed advice must not break planning
//   • SELF-REPAIR READY: plans must be reconstructable and validateable
//
// INTERNAL LOGIC SUMMARY:
//   • Consumes advice objects from PulseGPUPerformanceAdvisor
//   • Produces "restoration plans":
//       {
//         action: "restore" | "apply-optimal" | "upgrade-tier" | "noop",
//         reason: string,
//         targetSettings: object | null,
//         baselineSettings: object | null,
//         extra: object | null,
//         meta: {
//           layer: "PulseGPUSettingsRestorer",
//           version: 4,
//           target: "full-gpu",
//           selfRepairable: true
//         }
//       }
//   • Core operations:
//       - buildRestorePlan(adviceList)
//       - buildRestorePlanForRegression(advice)
//       - buildRestorePlanForImprovement(advice)
//       - buildRestorePlanForSuboptimal(advice)
//       - buildRestorePlanForTierUpgrade(advice)
//       - validatePlan(plan)
//
// ------------------------------------------------------
// Restoration plan builder (v5-ready)
// ------------------------------------------------------

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
    meta: {
      layer: "PulseGPUSettingsRestorer",
      version: 4,
      target: "full-gpu",
      selfRepairable: true
    }
  };
}

// ------------------------------------------------------
// Plan validation (for healing layer)
// ------------------------------------------------------

function validatePlan(plan) {
  if (!plan || typeof plan !== "object") return false;
  if (typeof plan.action !== "string") return false;
  if (typeof plan.reason !== "string") return false;
  if (!plan.meta || plan.meta.layer !== "PulseGPUSettingsRestorer") {
    return false;
  }
  return true;
}

// ------------------------------------------------------
// PulseGPUSettingsRestorer
// ------------------------------------------------------

class PulseGPUSettingsRestorer {
  constructor() {}

  // Static metadata for self-healing layer
  static meta = {
    layer: "PulseGPUSettingsRestorer",
    version: 4,
    target: "full-gpu",
    selfRepairable: true
  };

  // ----------------------------------------------------
  // Main entry point:
  //   Takes an array of advice objects → returns a plan.
  // ----------------------------------------------------
  //
  // If multiple advice objects exist, we choose the highest severity.
  // Fail-open: invalid or missing advice → noop plan.
  //
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
        repairHint: advice.extra?.repairHint || "restore-baseline-settings"
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
        repairHint: advice.extra?.repairHint || "suggest-baseline-settings"
      }
    });
  }

  // ----------------------------------------------------
  // Tier upgrade opportunity → apply new-tier optimal settings
  // ----------------------------------------------------
  buildRestorePlanForTierUpgrade(advice) {
    return buildPlan({
      action: "upgrade-tier",
      reason: "A higher tier configuration has historically delivered better performance.",
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
        repairHint: advice.extra?.repairHint || "promote-current-to-baseline"
      }
    });
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUSettingsRestorer,
  buildPlan,
  validatePlan
};
