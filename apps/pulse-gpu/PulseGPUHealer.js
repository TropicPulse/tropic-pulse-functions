// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUHealer.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUHealer — deterministic self-healing layer for the Pulse-GPU brain.
//   Validates and repairs advisor results, restoration plans, auto-opt decisions,
//   and UX notifications by re-running the underlying logic in a safe, replayable way.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A self-healing coordinator over Advisor, Restorer, AutoOptimize, UXBridge
//     • A generator of "healing reports" describing what was repaired or confirmed
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
//   • FAIL-OPEN: corrupted inputs must not break healing
//   • SELF-REPAIR READY: reports must be reconstructable and validateable
//
// INPUT MODEL (healing target):
//   {
//     advisorResult?: {
//       currentScore: number | null,
//       baselineScore: number | null,
//       deltaPercent: number | null,
//       advice: Advice[]
//     },
//     restorePlan?: Plan,
//     autoDecision?: {
//       mode: "auto-apply" | "require-confirmation" | "ignore",
//       reason: string,
//       plan: Plan | null
//     },
//     notifications?: Notification[],
//     context: {
//       gameProfile?: object,
//       hardwareProfile?: object,
//       tierProfile?: object,
//       settings?: object,
//       metrics?: object,
//       userPreferences?: object
//     }
//   }
//
// OUTPUT MODEL (healing report):
//   {
//     status: "healthy" | "repaired" | "degraded",
//     actions: { type: string, description: string }[],
//     advisorResult: object | null,
//     restorePlan: object | null,
//     autoDecision: object | null,
//     notifications: object[],
//     meta: {
//       layer: "PulseGPUHealer",
//       version: 1,
//       target: "full-gpu",
//       selfRepairable: true
//     }
//   }
//
// ------------------------------------------------------
// IMPORTS
// ------------------------------------------------------

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

// ------------------------------------------------------
// Healing report builder
// ------------------------------------------------------

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
      layer: "PulseGPUHealer",
      version: 1,
      target: "full-gpu",
      selfRepairable: true
    }
  };
}

// ------------------------------------------------------
// Healing report validation (for higher layers)
// ------------------------------------------------------

function validateHealingReport(report) {
  if (!report || typeof report !== "object") return false;
  if (!report.meta || report.meta.layer !== "PulseGPUHealer") return false;
  if (typeof report.status !== "string") return false;
  if (!Array.isArray(report.actions)) return false;
  return true;
}

// ------------------------------------------------------
// Internal helpers
// ------------------------------------------------------

function isAdvisorResultValid(result) {
  if (!result || typeof result !== "object") return false;
  if (!Array.isArray(result.advice)) return false;
  return true;
}

function isAutoDecisionValid(decision) {
  if (!decision || typeof decision !== "object") return false;
  if (typeof decision.mode !== "string") return false;
  if (typeof decision.reason !== "string") return false;
  return true;
}

function filterValidNotifications(notifications) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter((n) => validateNotification(n));
}

// ------------------------------------------------------
// PulseGPUHealer
// ------------------------------------------------------

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

  // Static metadata for discovery
  static meta = {
    layer: "PulseGPUHealer",
    version: 1,
    target: "full-gpu",
    selfRepairable: true
  };

  // ----------------------------------------------------
  // healSessionFlow
  // ----------------------------------------------------
  //
  // Input:
  //   {
  //     advisorResult?,
  //     restorePlan?,
  //     autoDecision?,
  //     notifications?,
  //     context: {
  //       gameProfile,
  //       hardwareProfile,
  //       tierProfile,
  //       settings,
  //       metrics,
  //       userPreferences
  //     }
  //   }
  //
  // Output: HealingReport
  //
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
    // 1) Heal advisorResult
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
        description: "Advisor result was invalid or missing; recomputed from context."
      });
    }

    // --------------------------------------------------
    // 2) Heal restorePlan
    // --------------------------------------------------
    let healedPlan = restorePlan;

    if (!healedPlan || !validatePlan(healedPlan)) {
      healedPlan = this.restorer.buildRestorePlan(healedAdvisor.advice);

      actions.push({
        type: "recomputed-restore-plan",
        description: "Restore plan was invalid or missing; recomputed from advisor advice."
      });
    }

    // --------------------------------------------------
    // 3) Heal autoDecision
    // --------------------------------------------------
    let healedDecision = autoDecision;

    const mergedPrefs = {
      ...(userPreferences || {})
    };

    if (!isAutoDecisionValid(healedDecision)) {
      healedDecision = this.autoOptimize.decide(healedPlan, {
        adviceList: healedAdvisor.advice,
        userPreferences: mergedPrefs
      });

      actions.push({
        type: "recomputed-auto-decision",
        description: "Auto-opt decision was invalid or missing; recomputed from plan and advice."
      });
    }

    // --------------------------------------------------
    // 4) Heal notifications
    // --------------------------------------------------
    let healedNotifications = filterValidNotifications(notifications);

    const needAdvisorNotifs =
      healedAdvisor && Array.isArray(healedAdvisor.advice) && healedAdvisor.advice.length > 0;
    const needPlanNotif = healedPlan && healedPlan.action && healedPlan.action !== "noop";

    if (healedNotifications.length === 0 && (needAdvisorNotifs || needPlanNotif)) {
      const advisorNotifs = this.uxBridge.fromAdvisorResult(healedAdvisor);
      const planNotif = this.uxBridge.fromRestorePlan(healedPlan);

      healedNotifications = advisorNotifs.slice();
      if (planNotif) {
        healedNotifications.push(planNotif);
      }

      healedNotifications = filterValidNotifications(healedNotifications);

      actions.push({
        type: "regenerated-notifications",
        description: "Notifications were missing or invalid; regenerated from advisor and plan."
      });
    }

    // --------------------------------------------------
    // 5) Determine overall status
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

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUHealer,
  buildHealingReport,
  validateHealingReport
};
