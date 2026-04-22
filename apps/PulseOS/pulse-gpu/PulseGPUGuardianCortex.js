// ============================================================================
// FILE: /apps/organs/gpu/PulseGPUGuardianCortex.js
// [pulse:gpu] PULSE_GPU_GUARDIAN_CORTEX v9.2  // blue-gold
// GPU Permission Cortex • Deterministic Policy Engine • Zero Imports
// ============================================================================
//
// IDENTITY — THE GPU GUARDIAN CORTEX:
//  ----------------------------------
//  • The decision-making cortex of the GPU subsystem.
//  • Determines when GPU actions may auto-apply vs require confirmation.
//  • Pure logic: deterministic, stateless, zero-entropy, zero randomness.
//  • Reads advisor severity + user preferences + plan type.
//  • Produces a final decision object (mode + reason + plan).
//  • PulseSend‑2.0‑ready: decisions can be routed by the compute router.
//
// ROLE (v9.2):
//  • Permission arbiter for GPU healing + optimization.
//  • Safety cortex for GPU actions.
//  • Policy cortex for auto-apply vs confirmation.
//  • Guardian lineage: protects GPU stability + user intent.
//
// SAFETY CONTRACT:
//  • No imports (DI only).
//  • No async.
//  • No randomness.
//  • No timestamps.
//  • No GPU calls.
//  • No routing.
//  • No mutation outside instance.
//  • Deterministic: same inputs → same decision.
//
// THEME:
//  • Color: Blue-Gold (guardian + cortex).
//  • Subtheme: Permission, safety, deterministic policy.
//
// ADVANTAGE CASCADE (conceptual only):
//  • Inherits ANY advantage from ANY GPU organ automatically.
//  • Zero-entropy decision surface.
//  • Multi-instance ready.
//  • PulseSend contract: routingContract: "PulseSend-v2"
// ============================================================================

// ============================================================================
//  Utility: build decision — Guardian lineage + nervous-system metadata
// ============================================================================
function buildDecision({ mode, reason, plan }) {
  return {
    mode,
    reason,
    plan: plan || null,
    meta: {
      layer: "PulseGPUGuardianCortex",
      version: 9.2,
      target: "full-gpu",

      // Evolutionary metadata (no logic impact)
      lineage: "guardian-core",
      multiInstanceReady: true,
      deterministicPolicy: true,
      parallelSafe: true,
      statelessCore: true,
      zeroEntropy: true,

      // Nervous-system hints (purely descriptive)
      neuralRole: "policy-cortex",
      subsystem: "gpu-healing",
      instanceBehavior: "predictable",
      decisionSurface: "severity × preference × plan",
      driftResistance: "high",
      mutationRisk: "none",

      // v9.2 unified advantage + PulseSend‑2.0 identity
      unifiedAdvantageField: true,
      pulseSend2Ready: true,

      // PulseSend / Earn contracts (conceptual only)
      routingContract: "PulseSend-v2",
      gpuOrganContract: "PulseGPU-v9.2",
      earnCompatibility: "PulseEarn-v9"
    }
  };
}

// ============================================================================
//  Severity ranking helper — Guardian’s Risk Map
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

  return highest;
}

// ============================================================================
//  PulseGPUGuardianCortex v9.2 — GPU Permission Cortex
// ============================================================================
class PulseGPUGuardianCortex {
  constructor(userPreferences, instanceId) {
    this.userPreferences = userPreferences || {};
    this.instanceId = instanceId || "guardian-instance";
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
  // Restore plan policy — Regression Healer
  // ----------------------------------------------------
  decideForRestore(plan, severity, prefs) {
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
  // Apply-optimal plan policy — Optimization Reflex
  // ----------------------------------------------------
  decideForApplyOptimal(plan, severity, prefs) {
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
  // Tier upgrade plan policy — Tier Ascent Logic
  // ----------------------------------------------------
  decideForTierUpgrade(plan, severity, prefs) {
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
  PulseGPUGuardianCortex,
  buildDecision
};
