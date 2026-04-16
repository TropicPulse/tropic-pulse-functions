// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUAutoOptimize.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT;
// if I am unsure of intent, I will ask you for the full INTENT paragraph.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUAutoOptimize — decides WHEN Pulse-GPU should auto-apply settings vs
//   WHEN it should wait for explicit user confirmation.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A policy engine over restore plans + advice
//     • A deterministic decider for auto vs manual optimization
//     • Trust-first: prefers confirmation unless user explicitly opts into auto
//     • Fail-open: bad/missing context never breaks anything, just falls back to safe modes
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
//   • FAIL-OPEN: invalid plans/advice → ignore or require confirmation, never auto-apply by surprise
//
// INTERNAL LOGIC SUMMARY (v4/v5-ready):
//   • Input: restore plan + optional advisor/advice context
//   • Output: auto-opt decision:
//       {
//         mode: "auto-apply" | "require-confirmation" | "ignore",
//         reason: string,
//         plan: plan | null,
//         meta: { layer, version, target } // v5 healing metadata
//       }
//
//   • Default policy (can be extended by caller):
//       - Minor regressions → suggest, but require confirmation
//       - Medium/high regressions → require confirmation, can auto if user explicitly allows
//       - Critical regressions → auto-apply only if user preference says so
//       - Suboptimal (non-regression) → suggest only, no auto-apply by default
//       - Tier upgrades → always require confirmation unless explicitly allowed
//
// ------------------------------------------------------
// Utility: build decision (v5-ready)
// ------------------------------------------------------

function buildDecision({ mode, reason, plan }) {
  return {
    mode,
    reason,
    plan: plan || null,
    meta: {
      layer: "PulseGPUAutoOptimize",
      version: 4,
      target: "full-gpu"
    }
  };
}

// ------------------------------------------------------
// Severity ranking helper
// ------------------------------------------------------

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

  return highest;
}

// ------------------------------------------------------
// PulseGPUAutoOptimize (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUAutoOptimize {
  constructor(userPreferences) {
    // userPreferences is an optional object that can shape policy:
    //
    // {
    //   allowAutoFixCriticalRegressions: boolean,
    //   allowAutoFixMediumRegressions: boolean,
    //   allowAutoFixLowRegressions: boolean,
    //   allowAutoFixHighRegressions: boolean,
    //   allowAutoApplyOptimalSettings: boolean,
    //   allowAutoTierChanges: boolean
    // }
    //
    this.userPreferences = userPreferences || {};
  }

  // ----------------------------------------------------
  // Main entry point:
  //   decide(plan, context) → decision
  // ----------------------------------------------------
  decide(plan, context = {}) {
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
    const allowLow = !!prefs.allowAutoFixLowRegressions;
    const allowMedium = !!prefs.allowAutoFixMediumRegressions;
    const allowHigh = !!prefs.allowAutoFixHighRegressions;
    const allowCritical = !!prefs.allowAutoFixCriticalRegressions;

    if (severity === "low") {
      if (allowLow) {
        return buildDecision({
          mode: "auto-apply",
          reason: "Auto-fix enabled for low severity regressions.",
          plan
        });
      }
      return buildDecision({
        mode: "require-confirmation",
        reason: "Low severity regression; confirmation required.",
        plan
      });
    }

    if (severity === "medium") {
      if (allowMedium) {
        return buildDecision({
          mode: "auto-apply",
          reason: "Auto-fix enabled for medium severity regressions.",
          plan
        });
      }
      return buildDecision({
        mode: "require-confirmation",
        reason: "Medium severity regression; confirmation required.",
        plan
      });
    }

    if (severity === "high") {
      if (allowHigh) {
        return buildDecision({
          mode: "auto-apply",
          reason: "Auto-fix enabled for high severity regressions.",
          plan
        });
      }
      return buildDecision({
        mode: "require-confirmation",
        reason: "High severity regression; confirmation required.",
        plan
      });
    }

    if (allowCritical) {
      return buildDecision({
        mode: "auto-apply",
        reason: "Auto-fix enabled for critical regressions.",
        plan
      });
    }

    return buildDecision({
      mode: "require-confirmation",
      reason: "Critical regression; confirmation required by default.",
      plan
    });
  }

  // ----------------------------------------------------
  // Apply-optimal plan policy
  // ----------------------------------------------------
  decideForApplyOptimal(plan, severity, prefs) {
    const allowAuto = !!prefs.allowAutoApplyOptimalSettings;

    if (allowAuto) {
      return buildDecision({
        mode: "auto-apply",
        reason: "Auto-apply enabled for optimal settings.",
        plan
      });
    }

    return buildDecision({
      mode: "require-confirmation",
      reason: "Optimal settings available; confirmation required.",
      plan
    });
  }

  // ----------------------------------------------------
  // Tier upgrade plan policy
  // ----------------------------------------------------
  decideForTierUpgrade(plan, severity, prefs) {
    const allowAutoTier = !!prefs.allowAutoTierChanges;

    if (allowAutoTier) {
      return buildDecision({
        mode: "auto-apply",
        reason: "Auto-apply enabled for tier changes.",
        plan
      });
    }

    return buildDecision({
      mode: "require-confirmation",
      reason: "Tier upgrade opportunity; confirmation required.",
      plan
    });
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUAutoOptimize,
  buildDecision
};
