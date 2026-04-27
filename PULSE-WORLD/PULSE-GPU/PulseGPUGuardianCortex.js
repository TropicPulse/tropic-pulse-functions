// ============================================================================
// FILE: /apps/organs/gpu/PulseGPUGuardianCortex.js
// [pulse:gpu] PULSE_GPU_GUARDIAN_CORTEX v11-Evo  // blue-gold
// GPU Permission Cortex • Deterministic Policy Engine • Zero Imports
// ============================================================================
//
// IDENTITY — THE GPU GUARDIAN CORTEX (v11-Evo):
//  --------------------------------------------
//  • The decision-making cortex of the GPU subsystem.
//  • Determines when GPU actions may auto-apply vs require confirmation.
//  • Pure logic: deterministic, stateless, zero-entropy, zero randomness.
//  • Reads advisor severity + user preferences + plan type + GPU context.
//  • Produces a final decision object (mode + reason + plan).
//  • PulseSend‑v11‑ready: decisions can be routed by the compute router.
//  • Binary-aware, symbolic-aware, dispatch-aware, memory-aware.
//
// SAFETY CONTRACT (v11-Evo):
//  • No imports (DI only).
//  • No async.
//  • No randomness.
//  • No timestamps.
//  • No GPU calls.
//  • No routing.
//  • No mutation outside instance.
//  • Deterministic: same inputs → same decision.
// ============================================================================


// ============================================================================
//  Utility: build decision — Guardian lineage + nervous-system metadata
// ============================================================================
function buildDecision({ mode, reason, plan, gpuContext }) {
  return {
    mode,
    reason,
    plan: plan || null,
    gpuContext: gpuContext || null,
    meta: {
      layer: "PulseGPUGuardianCortex",
      version: "11.0-Evo",
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
      decisionSurface: "severity × preference × plan × gpuContext",
      driftResistance: "high",
      mutationRisk: "none",

      // v11-Evo unified advantage + PulseSend‑v11 identity
      unifiedAdvantageField: true,
      pulseSend11Ready: true,

      // NEW v11-Evo awareness
      binaryAware: true,
      symbolicAware: true,
      gpuDispatchAware: true,
      gpuMemoryAware: true,
      gpuAdvantageAware: true,

      // PulseSend / Earn contracts (conceptual only)
      routingContract: "PulseSend-v11",
      gpuOrganContract: "PulseGPU-v11-Evo",
      binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
      earnCompatibility: "Earn-v3"
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
//  PulseGPUGuardianCortex v11-Evo — GPU Permission Cortex
// ============================================================================
class PulseGPUGuardianCortex {
  constructor(userPreferences, instanceId) {
    this.userPreferences = userPreferences || {};
    this.instanceId = instanceId || "guardian-instance";
  }

  // ----------------------------------------------------
  // Main entry point:
  //   decide(plan, context) → decision
  //   context may include:
  //     • adviceList
  //     • userPreferences
  //     • gpuContext (binary/symbolic/dispatch/memory hints)
  // ----------------------------------------------------
  decide(plan, context = {}) {
    if (!plan || typeof plan !== "object") {
      return buildDecision({
        mode: "ignore",
        reason: "No plan provided.",
        plan: null,
        gpuContext: context.gpuContext || null
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

    // No advisor context
    if (!topAdvice) {
      if (plan.action === "noop") {
        return buildDecision({
          mode: "ignore",
          reason: "No action required.",
          plan: null,
          gpuContext: context.gpuContext
        });
      }

      return buildDecision({
        mode: "require-confirmation",
        reason: "No advisor context; confirmation required.",
        plan,
        gpuContext: context.gpuContext
      });
    }

    const severity = topAdvice.severity || "low";

    // Dispatch to specific handlers
    if (plan.action === "restore") {
      return this.decideForRestore(plan, severity, mergedPrefs, context.gpuContext);
    }

    if (plan.action === "apply-optimal") {
      return this.decideForApplyOptimal(plan, severity, mergedPrefs, context.gpuContext);
    }

    if (plan.action === "upgrade-tier") {
      return this.decideForTierUpgrade(plan, severity, mergedPrefs, context.gpuContext);
    }

    if (plan.action === "noop") {
      return buildDecision({
        mode: "ignore",
        reason: "No action required.",
        plan: null,
        gpuContext: context.gpuContext
      });
    }

    return buildDecision({
      mode: "require-confirmation",
      reason: "Unknown plan action; confirmation required.",
      plan,
      gpuContext: context.gpuContext
    });
  }

  // ----------------------------------------------------
  // Restore plan policy — Regression Healer (v11-Evo)
  // ----------------------------------------------------
  decideForRestore(plan, severity, prefs, gpuContext) {
    const allowLow = !!prefs.allowAutoFixLowRegressions;
    const allowMedium = !!prefs.allowAutoFixMediumRegressions;
    const allowHigh = !!prefs.allowAutoFixHighRegressions;
    const allowCritical = !!prefs.allowAutoFixCriticalRegressions;

    // v11-Evo: binary regressions get extra caution
    const binaryPenalty =
      gpuContext?.binaryModeObserved && severity !== "low";

    function decision(auto, reason) {
      return buildDecision({
        mode: auto ? "auto-apply" : "require-confirmation",
        reason,
        plan,
        gpuContext
      });
    }

    if (severity === "low") {
      return allowLow
        ? decision(true, "Auto-fix enabled for low severity regressions.")
        : decision(false, "Low severity regression; confirmation required.");
    }

    if (severity === "medium") {
      return allowMedium && !binaryPenalty
        ? decision(true, "Auto-fix enabled for medium severity regressions.")
        : decision(false, "Medium severity regression; confirmation required.");
    }

    if (severity === "high") {
      return allowHigh && !binaryPenalty
        ? decision(true, "Auto-fix enabled for high severity regressions.")
        : decision(false, "High severity regression; confirmation required.");
    }

    return allowCritical && !binaryPenalty
      ? decision(true, "Auto-fix enabled for critical regressions.")
      : decision(false, "Critical regression; confirmation required.");
  }

  // ----------------------------------------------------
  // Apply-optimal plan policy — Optimization Reflex (v11-Evo)
  // ----------------------------------------------------
  decideForApplyOptimal(plan, severity, prefs, gpuContext) {
    const allowAuto = !!prefs.allowAutoApplyOptimalSettings;

    return buildDecision({
      mode: allowAuto ? "auto-apply" : "require-confirmation",
      reason: allowAuto
        ? "Auto-apply enabled for optimal settings."
        : "Optimal settings available; confirmation required.",
      plan,
      gpuContext
    });
  }

  // ----------------------------------------------------
  // Tier upgrade plan policy — Tier Ascent Logic (v11-Evo)
  // ----------------------------------------------------
  decideForTierUpgrade(plan, severity, prefs, gpuContext) {
    const allowAutoTier = !!prefs.allowAutoTierChanges;

    return buildDecision({
      mode: allowAutoTier ? "auto-apply" : "require-confirmation",
      reason: allowAutoTier
        ? "Auto-apply enabled for tier changes."
        : "Tier upgrade opportunity; confirmation required.",
      plan,
      gpuContext
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
