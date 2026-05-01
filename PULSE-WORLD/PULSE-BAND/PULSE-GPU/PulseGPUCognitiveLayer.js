// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-GPU/PulseGPUSettingsRestorer.js
// PULSE GPU SETTINGS RESTORER v12-Evo-Presence-Max
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
//   • PulseSend‑v12‑ready: plans can be routed by the compute router
//   • Earn‑v4‑Presence‑ready
//   • Binary-aware, symbolic-aware, dispatch-aware, memory-aware, presence-aware
//
// SAFETY CONTRACT (v12-Evo-Presence-Max):
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
// ⭐ OS‑v12-Evo-Presence-Max CONTEXT METADATA
// ------------------------------------------------------------
const RESTORER_CONTEXT = {
  layer: "PulseGPUSettingsRestorer",
  role: "GPU_SETTINGS_RESTORER",
  purpose: "Deterministic planner for GPU settings restoration",
  context:
    "Consumes advisor insights + memory entries + GPU hints to produce restoration plans",
  target: "full-gpu",
  version: "12.0-Evo-Presence-Max",
  selfRepairable: true,

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend12Ready: true,

    // v12 Presence Evolution
    presenceAware: true,
    dnaAware: true,
    versionAware: true,
    instanceAware: true,

    // GPU awareness
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,

    // PulseSend / Earn contracts (conceptual only)
    routingContract: "PulseSend-v12",
    gpuOrganContract: "PulseGPU-v12-Evo-Presence-Max",
    binaryGpuOrganContract: "PulseBinaryGPU-v12-Evo-Presence-Max",
    earnCompatibility: "Earn-v4-Presence"
  }
};

// ------------------------------------------------------------
// Restoration plan builder (v12-Evo-Presence-Max + OS metadata)
// ------------------------------------------------------------
function buildPlan({
  action,
  reason,
  targetSettings = null,
  baselineSettings = null,
  extra = null,
  gpuContext = null,
  dnaTag = "default-dna",
  instanceId = "",
  version = "12.0-Evo-Presence-Max"
}) {
  return {
    action,
    reason,
    targetSettings,
    baselineSettings,
    extra,
    gpuContext: gpuContext || null,
    meta: {
      ...RESTORER_CONTEXT,
      dnaTag,
      instanceId,
      version
    }
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
// PulseGPUSettingsRestorer v12-Evo-Presence-Max — Cognitive Recognition Layer
// ------------------------------------------------------------
class PulseGPUSettingsRestorer {
  constructor() {}

  static meta = { ...RESTORER_CONTEXT };

  // ----------------------------------------------------
  // Main entry point:
  //   Takes an array of advice objects → returns a plan.
  //   Optionally includes GPU context + presence identity.
// ----------------------------------------------------
  buildRestorePlan(
    adviceList = [],
    gpuContext = null,
    { dnaTag = "default-dna", instanceId = "", version = "12.0-Evo-Presence-Max" } = {}
  ) {
    if (!Array.isArray(adviceList) || adviceList.length === 0) {
      return buildPlan({
        action: "noop",
        reason: "No advice available.",
        gpuContext,
        dnaTag,
        instanceId,
        version
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
        gpuContext,
        dnaTag,
        instanceId,
        version
      });
    }

    const top = sorted[0];

    switch (top.type) {
      case "regression":
        return this.buildRestorePlanForRegression(top, gpuContext, {
          dnaTag,
          instanceId,
          version
        });

      case "suboptimal":
        return this.buildRestorePlanForSuboptimal(top, gpuContext, {
          dnaTag,
          instanceId,
          version
        });

      case "tier-upgrade-opportunity":
        return this.buildRestorePlanForTierUpgrade(top, gpuContext, {
          dnaTag,
          instanceId,
          version
        });

      case "improvement":
        return this.buildRestorePlanForImprovement(top, gpuContext, {
          dnaTag,
          instanceId,
          version
        });

      default:
        return buildPlan({
          action: "noop",
          reason: "Advice type not recognized.",
          gpuContext,
          dnaTag,
          instanceId,
          version
        });
    }
  }

  // ----------------------------------------------------
  // Regression → restore baseline settings
  // ----------------------------------------------------
  buildRestorePlanForRegression(advice, gpuContext, presence = {}) {
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
      gpuContext: gpuCtx,
      ...presence
    });
  }

  // ----------------------------------------------------
  // Suboptimal → apply optimal baseline settings
  // ----------------------------------------------------
  buildRestorePlanForSuboptimal(advice, gpuContext, presence = {}) {
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
      gpuContext: gpuCtx,
      ...presence
    });
  }

  // ----------------------------------------------------
  // Tier upgrade opportunity → apply new-tier optimal settings
  // ----------------------------------------------------
  buildRestorePlanForTierUpgrade(advice, gpuContext, presence = {}) {
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
      gpuContext: gpuCtx,
      ...presence
    });
  }

  // ----------------------------------------------------
  // Improvement → no action needed
  // ----------------------------------------------------
  buildRestorePlanForImprovement(advice, gpuContext, presence = {}) {
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
      gpuContext: gpuCtx,
      ...presence
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
          : base.symbolicModeObserved || false,
      advantageScore:
        typeof advice.advantageScore === "number"
          ? advice.advantageScore
          : base.advantageScore || 0
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
