// ============================================================================
//  PULSE GPU AUTO OPTIMIZE v6.3 — THE GUARDIAN
//  GPU POLICY ENGINE (PURE LOGIC, ZERO SIDE EFFECTS)
//  Determines WHEN Pulse-GPU should auto-apply settings vs require confirmation.
//  PURE HEALING. NO GPU. NO DOM. NO NODE. NO MARKETPLACE.
// ============================================================================
//
// WHAT THIS FILE IS:
//  -------------------
//  • The GPU subsystem’s policy engine.
//  • The decider for auto-apply vs require-confirmation vs ignore.
//  • A deterministic evaluator of restore plans + advisor context.
//  • A trust-first, fail-open safety layer.
//  • A pure logic module safe for browser + server.
//  • The permission guardian for GPU behavior.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer.
//  • NOT a GPU runtime.
//  • NOT a WebGPU/WebGL interface.
//  • NOT a persistence layer.
//  • NOT a UI system.
//  • NOT a backend module.
//  • NOT a place for randomness or timestamps.
//
// SAFETY CONTRACT:
//  ----------------
//  • No WebGPU/WebGL APIs.
//  • No DOM APIs.
//  • No Node APIs.
//  • No filesystem or network access.
//  • No randomness.
//  • No timestamps.
//  • Fail-open: invalid plans/advice → require confirmation or ignore.
// ============================================================================

console.log(
  "%c🟦 PulseGPUAutoOptimize v6.3 online — GUARDIAN policy engine active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  Utility: build decision (v6-ready)
// ============================================================================
function buildDecision({ mode, reason, plan }) {
  console.log(
    `%c[Guardian] Decision → mode=${mode} | reason=${reason}`,
    "color:#4CAF50; font-weight:bold;"
  );

  return {
    mode,
    reason,
    plan: plan || null,
    meta: {
      layer: "PulseGPUAutoOptimize",
      version: 6.3,
      target: "full-gpu"
    }
  };
}

// ============================================================================
//  Severity ranking helper
// ============================================================================
const SEVERITY_RANK = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

function getHighestSeverity(adviceList = []) {
  let highest = null;

  adviceList.forEach((a) => {
    if (!a || typeof a !== "object") return;
    const rank = SEVERITY_RANK[a.severity] || 0;
    if (!highest || rank > (SEVERITY_RANK[highest.severity] || 0)) {
      highest = a;
    }
  });

  if (highest) {
    console.log(
      `%c[Guardian] Highest severity advice → ${highest.severity}`,
      "color:#FFC107; font-weight:bold;"
    );
  } else {
    console.log(
      "%c[Guardian] No advisor severity found.",
      "color:#FFC107;"
    );
  }

  return highest;
}

// ============================================================================
//  PulseGPUAutoOptimize (v6.3)
// ============================================================================
class PulseGPUAutoOptimize {
  constructor(userPreferences) {
    this.userPreferences = userPreferences || {};

    console.log(
      "%c[Guardian] User preferences loaded.",
      "color:#9C27B0;"
    );
  }

  // ----------------------------------------------------
  // Main entry point:
  //   decide(plan, context) → decision
  // ----------------------------------------------------
  decide(plan, context = {}) {
    console.log(
      "%c[Guardian] decide() called.",
      "color:#03A9F4;"
    );

    if (!plan || typeof plan !== "object") {
      return buildDecision({
        mode: "ignore",
        reason: "No plan provided.",
        plan: null
      });
    }

    const mergedPrefs = {
      ...this.userPreferences,
      ...(context.userPreferences || {})
    };

    console.log(
      "%c[Guardian] Merged preferences:",
      "color:#9C27B0;",
      mergedPrefs
    );

    const adviceList = Array.isArray(context.adviceList)
      ? context.adviceList
      : [];

    const topAdvice = getHighestSeverity(adviceList);

    if (!topAdvice) {
      if (plan.action === "noop") {
        return buildDecision({
          mode: "ignore",
          reason: "No action required.",
          plan: null
        });
      }

      return buildDecision({
        mode: "require-confirmation",
        reason: "No advisor context; require confirmation for safety.",
        plan
      });
    }

    const severity = topAdvice.severity || "low";

    console.log(
      `%c[Guardian] Plan action=${plan.action} | severity=${severity}`,
      "color:#8BC34A;"
    );

    if (plan.action === "restore") {
      return this.decideForRestore(plan, severity, mergedPrefs);
    }

    if (plan.action === "apply-optimal") {
      return this.decideForApplyOptimal(plan, severity, mergedPrefs);
    }

    if (plan.action === "upgrade-tier") {
      return this.decideForTierUpgrade(plan, severity, mergedPrefs);
    }

    if (plan.action === "noop") {
      return buildDecision({
        mode: "ignore",
        reason: "No action required.",
        plan: null
      });
    }

    return buildDecision({
      mode: "require-confirmation",
      reason: "Unknown plan action; require confirmation.",
      plan
    });
  }

  // ----------------------------------------------------
  // Restore plan policy
  // ----------------------------------------------------
  decideForRestore(plan, severity, prefs) {
    console.log(
      `%c[Guardian] decideForRestore() severity=${severity}`,
      "color:#03A9F4;"
    );

    const allowLow = !!prefs.allowAutoFixLowRegressions;
    const allowMedium = !!prefs.allowAutoFixMediumRegressions;
    const allowHigh = !!prefs.allowAutoFixHighRegressions;
    const allowCritical = !!prefs.allowAutoFixCriticalRegressions;

    if (severity === "low") {
      return allowLow
        ? buildDecision({
            mode: "auto-apply",
            reason: "Auto-fix enabled for low severity regressions.",
            plan
          })
        : buildDecision({
            mode: "require-confirmation",
            reason: "Low severity regression; confirmation required.",
            plan
          });
    }

    if (severity === "medium") {
      return allowMedium
        ? buildDecision({
            mode: "auto-apply",
            reason: "Auto-fix enabled for medium severity regressions.",
            plan
          })
        : buildDecision({
            mode: "require-confirmation",
            reason: "Medium severity regression; confirmation required.",
            plan
          });
    }

    if (severity === "high") {
      return allowHigh
        ? buildDecision({
            mode: "auto-apply",
            reason: "Auto-fix enabled for high severity regressions.",
            plan
          })
        : buildDecision({
            mode: "require-confirmation",
            reason: "High severity regression; confirmation required.",
            plan
          });
    }

    return allowCritical
      ? buildDecision({
          mode: "auto-apply",
          reason: "Auto-fix enabled for critical regressions.",
          plan
        })
      : buildDecision({
          mode: "require-confirmation",
          reason: "Critical regression; confirmation required by default.",
          plan
        });
  }

  // ----------------------------------------------------
  // Apply-optimal plan policy
  // ----------------------------------------------------
  decideForApplyOptimal(plan, severity, prefs) {
    console.log(
      "%c[Guardian] decideForApplyOptimal()",
      "color:#03A9F4;"
    );

    const allowAuto = !!prefs.allowAutoApplyOptimalSettings;

    return allowAuto
      ? buildDecision({
          mode: "auto-apply",
          reason: "Auto-apply enabled for optimal settings.",
          plan
        })
      : buildDecision({
          mode: "require-confirmation",
          reason: "Optimal settings available; confirmation required.",
          plan
        });
  }

  // ----------------------------------------------------
  // Tier upgrade plan policy
  // ----------------------------------------------------
  decideForTierUpgrade(plan, severity, prefs) {
    console.log(
      "%c[Guardian] decideForTierUpgrade()",
      "color:#03A9F4;"
    );

    const allowAutoTier = !!prefs.allowAutoTierChanges;

    return allowAutoTier
      ? buildDecision({
          mode: "auto-apply",
          reason: "Auto-apply enabled for tier changes.",
          plan
        })
      : buildDecision({
          mode: "require-confirmation",
          reason: "Tier upgrade opportunity; confirmation required.",
          plan
        });
  }
}

// ============================================================================
//  EXPORTS
// ============================================================================
export {
  PulseGPUAutoOptimize,
  buildDecision
};
