// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUSettingsRestorer.js
// PULSE GPU SETTINGS RESTORER v11-Evo
// “COGNITIVE RECOGNITION LAYER / RESTORATION PLANNER”
// ============================================================================
//
// PERSONALITY + ROLE:
//   PulseGPUSettingsRestorer is the **COGNITIVE RECOGNITION LAYER**.
//   It is the **RESTORATION PLANNER** — the subsystem that reads advice
//   and recognizes what concrete action should be taken.
//
//   • Consumes advisor insights (Drive Center) + memory entries (Evolution Core)
//   • Can also consume GPU dispatch/memory hints (Brain/Spine/History)
//   • Recognizes whether to restore, apply optimal, upgrade tier, or noop
//   • Produces deterministic restoration plans for the Healer + Orchestrator
//   • PulseSend‑v11‑ready: plans can be routed by the compute router
//   • Earn‑ready: compatible with Earn-v3 job payloads
//   • Binary-aware, symbolic-aware, dispatch-aware, memory-aware
//
// SAFETY CONTRACT (v11-Evo):
//   • No randomness
//   • No timestamps
//   • No GPU calls
//   • No DOM
//   • No Node APIs
//   • No network or filesystem access
//   • Fail-open: invalid advice → noop plan
//   • Self-repair-ready: plans include OS metadata
//   • Deterministic: same advice → same plan
// ============================================================================

// ------------------------------------------------------------
// ⭐ OS‑v11-Evo CONTEXT METADATA
// ------------------------------------------------------------
const RESTORER_CONTEXT = {
  layer: "PulseGPUSettingsRestorer",
  role: "GPU_SETTINGS_RESTORER",
  purpose: "Deterministic planner for GPU settings restoration",
  context:
    "Consumes advisor insights + memory entries + GPU hints to produce restoration plans",
  target: "full-gpu",
  version: "11.0-Evo",
  selfRepairable: true,

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    // v11-Evo awareness
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

// ------------------------------------------------------------
// Restoration plan builder (v11-Evo + OS‑v11-Evo metadata)
// ------------------------------------------------------------
function buildPlan({
  action,
  reason,
  targetSettings = null,
  baselineSettings = null,
  extra = null,
  gpuContext = null
}) {
  return {
    action,
    reason,
    targetSettings,
    baselineSettings,
    extra,
    gpuContext: gpuContext || null,
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
// PulseGPUSettingsRestorer v11-Evo — Cognitive Recognition Layer
// ------------------------------------------------------------
class PulseGPUSettingsRestorer {
  constructor() {}

  static meta = { ...RESTORER_CONTEXT };

  // ----------------------------------------------------
  // Main entry point:
  //   Takes an array of advice objects → returns a plan.
  //   Optionally includes GPU context (dispatch/memory/advantage).
  // ----------------------------------------------------
  buildRestorePlan(adviceList = [], gpuContext = null) {
    if (!Array.isArray(adviceList) || adviceList.length === 0) {
      return buildPlan({
        action: "noop",
        reason: "No advice available.",
        gpuContext
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
        reason: "No valid advice available.",
        gpuContext
      });
    }

    const top = sorted[0];

    switch (top.type) {
      case "regression":
        return this.buildRestorePlanForRegression(top, gpuContext);

      case "suboptimal":
        return this.buildRestorePlanForSuboptimal(top, gpuContext);

      case "tier-upgrade-opportunity":
        return this.buildRestorePlanForTierUpgrade(top, gpuContext);

      case "improvement":
        return this.buildRestorePlanForImprovement(top, gpuContext);

      default:
        return buildPlan({
          action: "noop",
          reason: "Advice type not recognized.",
          gpuContext
        });
    }
  }

  // ----------------------------------------------------
  // Regression → restore baseline settings
  // ----------------------------------------------------
  buildRestorePlanForRegression(advice, gpuContext) {
    const gpuCtx = this._buildGpuContextFromAdvice(advice, gpuContext);

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
      },
      gpuContext: gpuCtx
    });
  }

  // ----------------------------------------------------
  // Suboptimal → apply optimal baseline settings
  // ----------------------------------------------------
  buildRestorePlanForSuboptimal(advice, gpuContext) {
    const gpuCtx = this._buildGpuContextFromAdvice(advice, gpuContext);

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
      },
      gpuContext: gpuCtx
    });
  }

  // ----------------------------------------------------
  // Tier upgrade opportunity → apply new-tier optimal settings
  // ----------------------------------------------------
  buildRestorePlanForTierUpgrade(advice, gpuContext) {
    const gpuCtx = this._buildGpuContextFromAdvice(advice, gpuContext);

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
      },
      gpuContext: gpuCtx
    });
  }

  // ----------------------------------------------------
  // Improvement → no action needed
  // ----------------------------------------------------
  buildRestorePlanForImprovement(advice, gpuContext) {
    const gpuCtx = this._buildGpuContextFromAdvice(advice, gpuContext);

    return buildPlan({
      action: "noop",
      reason: "Performance improved; no restoration needed.",
      targetSettings: null,
      baselineSettings: advice.baselineSettings || null,
      extra: {
        deltaPercent: advice.deltaPercent,
        repairHint:
          advice.extra?.repairHint || "promote-current-to-baseline"
      },
      gpuContext: gpuCtx
    });
  }

  // ----------------------------------------------------
  // Internal: build GPU context snapshot from advice + external gpuContext
  // ----------------------------------------------------
  _buildGpuContextFromAdvice(advice, gpuContext) {
    const base = gpuContext && typeof gpuContext === "object"
      ? { ...gpuContext }
      : {};

    return {
      ...base,
      gpuPattern: advice.gpuPattern || base.gpuPattern || null,
      gpuShapeSignature:
        advice.gpuShapeSignature || base.gpuShapeSignature || null,
      binaryModeObserved:
        typeof advice.binaryModeObserved === "boolean"
          ? advice.binaryModeObserved
          : base.binaryModeObserved || false,
      symbolicModeObserved:
        typeof advice.symbolicModeObserved === "boolean"
          ? advice.symbolicModeObserved
          : base.symbolicModeObserved || false
    };
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
