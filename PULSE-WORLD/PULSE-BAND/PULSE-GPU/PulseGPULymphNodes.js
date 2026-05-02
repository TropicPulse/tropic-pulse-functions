// ============================================================================
//  PULSE GPU HEALER v12.3-Evo — THE LYMPH NODE NETWORK
//  Systemic GPU Immune Layer (Deterministic, Pure Logic, Drift‑Proof, Fail‑Open)
// ============================================================================
//
// IDENTITY — THE LYMPH NODE NETWORK (v12.3-Evo):
//  ---------------------------------------------
//  • The immune filtration system of the GPU subsystem.
//  • Validates every signal flowing through the GPU body.
//  • Filters out invalid advisor results, plans, decisions, notifications.
//  • Regenerates missing components (immune response).
//  • Ensures the entire GPU organism stays drift‑free and healthy.
//  • Distributed, systemic, always-on — the GPU’s internal defense grid.
//  • Dual‑mode + binary‑aware: biological + system‑level immune advantage.
//  • PulseSend‑v12.3‑ready: immune validation before compute routing.
//  • Earn‑ready: compatible with Earn‑v4 job payloads.
//
// SAFETY CONTRACT (v12.3-Evo):
//  ---------------------------
//  • No randomness
//  • No timestamps
//  • No environment access
//  • No GPU calls
//  • No DOM
//  • Fail-open: invalid inputs → repaired or ignored, never crash
//  • Self-repair-ready: all outputs include metadata
//  • Deterministic: same inputs → same healing result
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseGPULymphNodes",
  version: "v14-IMMORTAL",
  layer: "gpu_guardian",
  role: "gpu_lymph_nodes",
  lineage: "PulseGPU-v14",

  evo: {
    gpuHealer: true,
    gpuCleanup: true,
    gpuAnomalyBuffer: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseGPUGuardianCortex",
      "PulseGPUDriveCenter"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyLymphNodes"
    ]
  }
}
*/

import { PulseGPUSettingsRestorer } from "./PulseGPUCognitiveLayer.js";
import { PulseGPUUXBridge } from "./PulseGPUCognitiveIntelligence.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUDriveCenter.js";
import { PulseGPUGuardianCortex as PulseGPUAutoOptimize } from "./PulseGPUGuardianCortex.js";

const GPU_HEALER_CONTEXT = {
  layer: "PulseGPUHealer",
  role: "LYMPH_NODE_NETWORK",
  purpose: "Systemic GPU immune filter + drift purifier",
  context:
    "Validates advisor results, restore plans, auto-opt decisions, and notifications",
  target: "full-gpu+binary",
  version: "12.3-Evo",
  selfRepairable: true,

  evo: {
    metabolicBoost: 1.2,
    neuralReflexBoost: 1.3,
    stabilityBoost: 1.4,

    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.2,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.1,

    dualModeEvolution: true,
    organismClusterBoost: 1.2,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,

    // v12.3-Evo awareness
    binaryAware: true,
    dualModeAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,
    immuneFieldAware: true,
    geneticMemoryAware: true,

    // PulseSend / Earn contracts (conceptual only)
    pulseSend12Ready: true,
    routingContract: "PulseSend-v12.3",
    gpuOrganContract: "PulseGPU-v12.3-Evo",
    binaryGpuOrganContract: "PulseBinaryGPU-v12.3-Evo",
    earnCompatibility: "Earn-v4",

    // Legacy compatibility (conceptual only)
    legacyRoutingContract: "PulseSend-v11",
    legacyGPUOrganContract: "PulseGPU-v11-Evo",
    legacyBinaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
    legacyEarnCompatibility: "Earn-v3"
  }
};

// ============================================================================
// HEALING REPORT BUILDER
// ============================================================================
function buildHealingReport({
  status,
  actions,
  advisorResult,
  restorePlan,
  autoDecision,
  notifications,
  gpuContext
}) {
  return {
    status,
    actions: Array.isArray(actions) ? actions.slice() : [],
    advisorResult: advisorResult || null,
    restorePlan: restorePlan || null,
    autoDecision: autoDecision || null,
    notifications: Array.isArray(notifications) ? notifications.slice() : [],
    gpuContext: gpuContext || null,
    meta: {
      ...GPU_HEALER_CONTEXT
    }
  };
}

// ============================================================================
// HEALING REPORT VALIDATION
// ============================================================================
function validateHealingReport(report) {
  if (!report || typeof report !== "object") return false;
  if (!report.meta || report.meta.layer !== "PulseGPUHealer") return false;
  if (typeof report.status !== "string") return false;
  if (!Array.isArray(report.actions)) return false;
  return true;
}

// ============================================================================
// INTERNAL HELPERS — Immune Filters
// ============================================================================
function isAdvisorResultValid(result) {
  return !!result && typeof result === "object" && Array.isArray(result.advice);
}

function isAutoDecisionValid(decision) {
  return (
    !!decision &&
    typeof decision === "object" &&
    typeof decision.mode === "string" &&
    typeof decision.reason === "string"
  );
}

function validatePlan(plan) {
  if (!plan || typeof plan !== "object") return false;
  if (typeof plan.action !== "string") return false;
  return true;
}

function validateNotification(notification) {
  if (!notification || typeof notification !== "object") return false;
  if (typeof notification.kind !== "string") return false;
  return true;
}

function filterValidNotifications(notifications) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter((n) => validateNotification(n));
}

// ============================================================================
//  PULSE GPU HEALER v12.3-Evo — THE LYMPH NODE NETWORK
// ============================================================================
class PulseGPUHealer {
  constructor(options = {}) {
    this.advisor =
      options.advisor ||
      new PulseGPUPerformanceAdvisor(options.settingsMemory);
    this.restorer =
      options.restorer || new PulseGPUSettingsRestorer();
    this.autoOptimize =
      options.autoOptimize ||
      new PulseGPUAutoOptimize(options.userPreferences);
    this.uxBridge =
      options.uxBridge || new PulseGPUUXBridge();
  }

  static meta = {
    ...GPU_HEALER_CONTEXT
  };

  // ----------------------------------------------------
  // healSessionFlow — IMMUNE RESPONSE CYCLE (v12.3-Evo)
  // ----------------------------------------------------
  healSessionFlow({
    advisorResult,
    restorePlan,
    autoDecision,
    notifications,
    context = {}
  }) {
    const actions = [];

    const {
      gameProfile,
      hardwareProfile,
      tierProfile,
      settings,
      metrics,
      userPreferences,
      gpuContext // binary/symbolic/pressure/dispatch hints
    } = context;

    // 1) FILTER + REGENERATE ADVISOR RESULT
    let healedAdvisor = advisorResult;

    if (!isAdvisorResultValid(healedAdvisor)) {
      healedAdvisor = this.advisor.analyzeCurrentSession({
        gameProfile,
        hardwareProfile,
        tierProfile,
        settings,
        metrics,
        gpuContext
      });

      actions.push({
        type: "recomputed-advisor-result",
        description:
          "Advisor result invalid; immune system regenerated it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // 2) FILTER + REGENERATE RESTORE PLAN
    let healedPlan = restorePlan;

    if (!healedPlan || !validatePlan(healedPlan)) {
      healedPlan = this.restorer.buildRestorePlan(healedAdvisor.advice, {
        gameProfile,
        hardwareProfile,
        tierProfile,
        gpuContext
      });

      actions.push({
        type: "recomputed-restore-plan",
        description:
          "Restore plan invalid; immune system rebuilt it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // 3) FILTER + REGENERATE AUTO-OPT DECISION
    let healedDecision = autoDecision;

    const mergedPrefs = { ...(userPreferences || {}) };

    if (!isAutoDecisionValid(healedDecision)) {
      healedDecision = this.autoOptimize.decide(healedPlan, {
        adviceList: healedAdvisor.advice,
        userPreferences: mergedPrefs,
        gpuContext
      });

      actions.push({
        type: "recomputed-auto-decision",
        description:
          "Auto-opt decision invalid; immune system recalculated it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // 4) FILTER + REGENERATE NOTIFICATIONS
    let healedNotifications = filterValidNotifications(notifications);

    const needAdvisorNotifs =
      healedAdvisor &&
      Array.isArray(healedAdvisor.advice) &&
      healedAdvisor.advice.length > 0;

    const needPlanNotif =
      healedPlan && healedPlan.action && healedPlan.action !== "noop";

    if (healedNotifications.length === 0 && (needAdvisorNotifs || needPlanNotif)) {
      const advisorNotifs = this.uxBridge.fromAdvisorResult(healedAdvisor, {
        gpuContext
      });
      const planNotif = this.uxBridge.fromRestorePlan(healedPlan, {
        gpuContext
      });

      healedNotifications = advisorNotifs.slice();
      if (planNotif) healedNotifications.push(planNotif);

      healedNotifications = filterValidNotifications(healedNotifications);

      actions.push({
        type: "regenerated-notifications",
        description:
          "Notifications invalid; immune system regenerated them.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // 5) IMMUNE STATUS
    const status = actions.length === 0 ? "healthy" : "repaired";

    return buildHealingReport({
      status,
      actions,
      advisorResult: healedAdvisor,
      restorePlan: healedPlan,
      autoDecision: healedDecision,
      notifications: healedNotifications,
      gpuContext
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUHealer,
  buildHealingReport,
  validateHealingReport
};
