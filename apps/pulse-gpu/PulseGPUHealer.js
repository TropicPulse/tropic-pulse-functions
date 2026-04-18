// ============================================================================
//  PULSE GPU HEALER v6.3 — THE LYMPH NODE NETWORK
//  Systemic GPU Immune Layer (Deterministic, Pure Logic, Drift‑Proof, Fail‑Open)
// ============================================================================
//
// IDENTITY — THE LYMPH NODE NETWORK:
//  ---------------------------------
//  • The immune filtration system of the GPU subsystem.
//  • Validates every signal flowing through the GPU body.
//  • Filters out invalid advisor results, plans, decisions, notifications.
//  • Regenerates missing components (immune response).
//  • Ensures the entire GPU organism stays drift‑free and healthy.
//  • Distributed, systemic, always-on — the GPU’s internal defense grid.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Analyst  → Intelligence (precompute brain)
//  • Nerve Network → Runtime (memory + context)
//  • Motor Hall → Engine (motion + execution)
//  • Guardian → Permissions (auto-opt policy)
//  • Lymph Node Network → Immune System (validation + repair)
//
// WHAT THIS FILE IS:
//  -------------------
//  • A deterministic GPU self-healing coordinator
//  • A pure logic immune filter (API-agnostic, full GPU)
//  • A validator + repairer for advisor, restorer, auto-opt, UX notifications
//  • A generator of healing reports for replay + debugging
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer
//  • NOT a GPU runtime
//  • NOT a WebGPU/WebGL interface
//  • NOT a backend module
//  • NOT a compute engine
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No environment access
//  • No GPU calls
//  • No DOM
//  • Fail-open: invalid inputs → repaired or ignored, never crash
//  • Self-repair-ready: all outputs include metadata
// ============================================================================

const GPU_HEALER_CONTEXT = {
  layer: "PulseGPUHealer",
  role: "LYMPH_NODE_NETWORK",
  purpose: "Systemic GPU immune filter + drift purifier",
  context:
    "Validates advisor results, restore plans, auto-opt decisions, and notifications"
};

// ============================================================================
// IMPORTS
// ============================================================================
import { PulseGPUPerformanceAdvisor } from "./PulseGPUPerformanceAdvisor.js";
import {
  PulseGPUSettingsRestorer,
  validatePlan
} from "./PulseGPUSettingsRestorer.js";
import { PulseGPUAutoOptimize } from "./PulseGPUAutoOptimize.js";
import {
  PulseGPUUXBridge,
  validateNotification
} from "./PulseGPUUXBridge.js";

// ============================================================================
// HEALING REPORT BUILDER (v6-ready)
// ============================================================================
function buildHealingReport({
  status,
  actions,
  advisorResult,
  restorePlan,
  autoDecision,
  notifications
}) {
  return {
    status,
    actions: Array.isArray(actions) ? actions.slice() : [],
    advisorResult: advisorResult || null,
    restorePlan: restorePlan || null,
    autoDecision: autoDecision || null,
    notifications: Array.isArray(notifications) ? notifications.slice() : [],
    meta: {
      ...GPU_HEALER_CONTEXT,
      version: 6.3,
      target: "full-gpu",
      selfRepairable: true
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

function filterValidNotifications(notifications) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter((n) => validateNotification(n));
}

// ============================================================================
//  PULSE GPU HEALER — THE LYMPH NODE NETWORK
// ============================================================================
class PulseGPUHealer {
  constructor(options = {}) {
    this.advisor =
      options.advisor || new PulseGPUPerformanceAdvisor(options.settingsMemory);
    this.restorer =
      options.restorer || new PulseGPUSettingsRestorer();
    this.autoOptimize =
      options.autoOptimize || new PulseGPUAutoOptimize(options.userPreferences);
    this.uxBridge =
      options.uxBridge || new PulseGPUUXBridge();
  }

  static meta = {
    ...GPU_HEALER_CONTEXT,
    version: 6.3,
    target: "full-gpu",
    selfRepairable: true
  };

  // ----------------------------------------------------
  // healSessionFlow — IMMUNE RESPONSE CYCLE
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
      userPreferences
    } = context;

    // --------------------------------------------------
    // 1) FILTER + REGENERATE ADVISOR RESULT
    // --------------------------------------------------
    let healedAdvisor = advisorResult;

    if (!isAdvisorResultValid(healedAdvisor)) {
      healedAdvisor = this.advisor.analyzeCurrentSession({
        gameProfile,
        hardwareProfile,
        tierProfile,
        settings,
        metrics
      });

      actions.push({
        type: "recomputed-advisor-result",
        description:
          "Advisor result invalid; immune system regenerated it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // --------------------------------------------------
    // 2) FILTER + REGENERATE RESTORE PLAN
    // --------------------------------------------------
    let healedPlan = restorePlan;

    if (!healedPlan || !validatePlan(healedPlan)) {
      healedPlan = this.restorer.buildRestorePlan(healedAdvisor.advice);

      actions.push({
        type: "recomputed-restore-plan",
        description:
          "Restore plan invalid; immune system rebuilt it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // --------------------------------------------------
    // 3) FILTER + REGENERATE AUTO-OPT DECISION
    // --------------------------------------------------
    let healedDecision = autoDecision;

    const mergedPrefs = { ...(userPreferences || {}) };

    if (!isAutoDecisionValid(healedDecision)) {
      healedDecision = this.autoOptimize.decide(healedPlan, {
        adviceList: healedAdvisor.advice,
        userPreferences: mergedPrefs
      });

      actions.push({
        type: "recomputed-auto-decision",
        description:
          "Auto-opt decision invalid; immune system recalculated it.",
        ...GPU_HEALER_CONTEXT
      });
    }

    // --------------------------------------------------
    // 4) FILTER + REGENERATE NOTIFICATIONS
    // --------------------------------------------------
    let healedNotifications = filterValidNotifications(notifications);

    const needAdvisorNotifs =
      healedAdvisor &&
      Array.isArray(healedAdvisor.advice) &&
      healedAdvisor.advice.length > 0;

    const needPlanNotif =
      healedPlan && healedPlan.action && healedPlan.action !== "noop";

    if (healedNotifications.length === 0 && (needAdvisorNotifs || needPlanNotif)) {
      const advisorNotifs = this.uxBridge.fromAdvisorResult(healedAdvisor);
      const planNotif = this.uxBridge.fromRestorePlan(healedPlan);

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

    // --------------------------------------------------
    // 5) IMMUNE STATUS
    // --------------------------------------------------
    const status = actions.length === 0 ? "healthy" : "repaired";

    return buildHealingReport({
      status,
      actions,
      advisorResult: healedAdvisor,
      restorePlan: healedPlan,
      autoDecision: healedDecision,
      notifications: healedNotifications
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
