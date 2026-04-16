// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUOrchestrator.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUOrchestrator — coordinates all Pulse-GPU subsystems into a single,
//   deterministic flow for sessions, memory, advice, restoration, auto-opt, insights,
//   events, and UX notifications.
//
//   This file IS:
//     • A pure logic coordinator (full GPU, API-agnostic)
//     • A wiring layer for Pulse-GPU components
//     • A single entrypoint for "run a session through the brain"
//     • v5-ready: emits structured, self-healing-friendly events + results
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
//   Must remain ESM-only and side-effect-free (no globals).
//   Must be safe to run in both browser and server environments.
//
// SAFETY RULES:
//   • NO WebGPU/WebGL APIs
//   • NO DOM APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • FAIL-OPEN: missing subsystems or partial failures must not crash the orchestrator
//   • SELF-REPAIR READY: outputs + events must contain enough metadata for healing/replay
//
// HIGH-LEVEL FLOW (v4/v5-ready):
//
//   1. startSession(...) → tracer session + "session-started" event
//   2. recordStep(...)   → tracer step + "session-step-recorded" event
//   3. endSession(...)   →
//        - tracer returns SessionTrace
//        - memory.recordSession(...)
//        - advisor.analyzeCurrentSession(...)
//        - restorer.buildRestorePlan(...)
//        - autoOptimize.decide(...)
//        - uxBridge.fromAdvisorResult(...)
//        - uxBridge.fromRestorePlan(...)
//        - healer.healSessionFlow(...)
//        - events emitted for advice/plan/decision/notifications/healing
//
//   4. analyzeInsights(...) → insights + notifications + events
//
// ------------------------------------------------------
// IMPORTS
// ------------------------------------------------------

import { PulseGPUSettingsMemory } from "./PulseGPUSettingsMemory.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUPerformanceAdvisor.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUSettingsRestorer.js";
import { PulseGPUSessionTracer } from "./PulseGPUSessionTracer.js";
import { PulseGPUInsightsEngine } from "./PulseGPUInsightsEngine.js";
import { PulseGPUEventEmitter } from "./PulseGPUEventEmitter.js";
import { PulseGPUUXBridge } from "./PulseGPUUXBridge.js";
import { PulseGPUAutoOptimize } from "./PulseGPUAutoOptimize.js";
import { PulseGPUHealer } from "./PulseGPUHealer.js";

// ------------------------------------------------------
// PulseGPUOrchestrator (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUOrchestrator {
  constructor(options = {}) {
    this.settingsMemory =
      options.settingsMemory || new PulseGPUSettingsMemory();
    this.performanceAdvisor =
      options.performanceAdvisor ||
      new PulseGPUPerformanceAdvisor(this.settingsMemory);
    this.settingsRestorer =
      options.settingsRestorer || new PulseGPUSettingsRestorer();
    this.sessionTracer =
      options.sessionTracer || new PulseGPUSessionTracer();
    this.insightsEngine =
      options.insightsEngine || new PulseGPUInsightsEngine();
    this.eventEmitter =
      options.eventEmitter || new PulseGPUEventEmitter();
    this.uxBridge = options.uxBridge || new PulseGPUUXBridge();
    this.autoOptimize =
      options.autoOptimize || new PulseGPUAutoOptimize(options.userPreferences);
    this.healer =
      options.healer ||
      new PulseGPUHealer({
        advisor: this.performanceAdvisor,
        restorer: this.settingsRestorer,
        autoOptimize: this.autoOptimize,
        uxBridge: this.uxBridge,
        settingsMemory: this.settingsMemory,
        userPreferences: options.userPreferences
      });
  }

  // ----------------------------------------------------
  // Session lifecycle
  // ----------------------------------------------------

  startSession({ sessionId, gameProfile, hardwareProfile, tierProfile }) {
    const trace = this.sessionTracer.startSession({
      sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile
    });

    this.eventEmitter.emit("session-started", {
      sessionId: trace?.sessionId || sessionId,
      gameProfile: trace?.gameProfile || gameProfile || {},
      hardwareProfile: trace?.hardwareProfile || hardwareProfile || {},
      tierProfile: trace?.tierProfile || tierProfile || {}
    });

    return trace;
  }

  recordStep(sessionId, step) {
    const trace = this.sessionTracer.recordStep(sessionId, step);

    if (trace) {
      this.eventEmitter.emit("session-step-recorded", {
        sessionId: trace.sessionId,
        step
      });
    }

    return trace;
  }

  // ----------------------------------------------------
  // End session → full pipeline (fail-open, v5-ready)
  // ----------------------------------------------------
  endSession({
    sessionId,
    gameProfile,
    hardwareProfile,
    tierProfile,
    settings,
    metrics
  }) {
    const safeGameProfile = gameProfile || {};
    const safeHardwareProfile = hardwareProfile || {};
    const safeTierProfile = tierProfile || {};
    const safeSettings = settings || {};
    const safeMetrics = metrics || {};

    const trace = this.sessionTracer.endSession(sessionId);

    this.eventEmitter.emit("session-ended", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      metrics: safeMetrics,
      trace
    });

    // 1) Memory (fail-open)
    let memoryEntry = null;
    try {
      memoryEntry = this.settingsMemory.recordSession({
        gameProfile: safeGameProfile,
        hardwareProfile: safeHardwareProfile,
        tierProfile: safeTierProfile,
        settings: safeSettings,
        metrics: safeMetrics,
        trace: trace ? trace.steps : null
      });
    } catch {
      memoryEntry = null;
    }

    // 2) Advisor
    let advisorResult = {
      currentScore: 0,
      baselineScore: null,
      deltaPercent: null,
      advice: []
    };
    try {
      advisorResult = this.performanceAdvisor.analyzeCurrentSession({
        gameProfile: safeGameProfile,
        hardwareProfile: safeHardwareProfile,
        tierProfile: safeTierProfile,
        settings: safeSettings,
        metrics: safeMetrics
      });
    } catch {
      advisorResult = {
        currentScore: 0,
        baselineScore: null,
        deltaPercent: null,
        advice: []
      };
    }

    this.eventEmitter.emit("performance-advice", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      advisorResult
    });

    // 3) Restorer
    let restorePlan = { action: "noop" };
    try {
      restorePlan = this.settingsRestorer.buildRestorePlan(
        advisorResult.advice || []
      );
    } catch {
      restorePlan = { action: "noop" };
    }

    this.eventEmitter.emit("settings-restore-plan", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      restorePlan
    });

    // 4) AutoOptimize
    let autoDecision = {
      mode: "require-confirmation",
      reason: "Auto-optimize decision unavailable; defaulting to confirmation.",
      plan: restorePlan,
      meta: {
        layer: "PulseGPUAutoOptimize",
        version: 4,
        target: "full-gpu"
      }
    };

    try {
      autoDecision = this.autoOptimize.decide(restorePlan, {
        adviceList: advisorResult.advice || []
      });
    } catch {
      // keep default
    }

    this.eventEmitter.emit("auto-optimize-decision", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      decision: autoDecision
    });

    // 5) UXBridge
    let advisorNotifications = [];
    let planNotification = null;

    try {
      advisorNotifications = this.uxBridge.fromAdvisorResult(advisorResult) || [];
    } catch {
      advisorNotifications = [];
    }

    try {
      planNotification = this.uxBridge.fromRestorePlan(restorePlan) || null;
    } catch {
      planNotification = null;
    }

    let notifications = advisorNotifications.slice();
    if (planNotification) notifications.push(planNotification);

    if (notifications.length > 0) {
      this.eventEmitter.emit("notifications", {
        sessionId,
        gameProfile: safeGameProfile,
        hardwareProfile: safeHardwareProfile,
        tierProfile: safeTierProfile,
        notifications
      });
    }

    // 6) Healer post-pass (fail-open, v5-ready)
    let healingReport = null;
    try {
      if (this.healer) {
        healingReport = this.healer.healSessionFlow({
          advisorResult,
          restorePlan,
          autoDecision,
          notifications,
          context: {
            gameProfile: safeGameProfile,
            hardwareProfile: safeHardwareProfile,
            tierProfile: safeTierProfile,
            settings: safeSettings,
            metrics: safeMetrics,
            userPreferences: this.autoOptimize?.userPreferences || {}
          }
        });

        this.eventEmitter.emit("healing-report", {
          sessionId,
          gameProfile: safeGameProfile,
          hardwareProfile: safeHardwareProfile,
          tierProfile: safeTierProfile,
          healingReport
        });

        if (healingReport && healingReport.status === "repaired") {
          advisorResult = healingReport.advisorResult || advisorResult;
          restorePlan = healingReport.restorePlan || restorePlan;
          autoDecision = healingReport.autoDecision || autoDecision;
          notifications = Array.isArray(healingReport.notifications)
            ? healingReport.notifications
            : notifications;
        }
      }
    } catch {
      healingReport = null;
    }

    return {
      trace,
      memoryEntry,
      advisorResult,
      restorePlan,
      autoDecision,
      notifications,
      healingReport
    };
  }

  // ----------------------------------------------------
  // Insights pipeline (fail-open, v5-ready)
  // ----------------------------------------------------
  analyzeInsights({
    baselineTraces = [],
    currentTraces = [],
    gameId,
    gpuModel
  }) {
    let insights = [];
    try {
      insights =
        this.insightsEngine.analyzeStepDurationsForGameAndHardware({
          baselineTraces,
          currentTraces,
          gameId,
          gpuModel
        }) || [];
    } catch {
      insights = [];
    }

    this.eventEmitter.emit("insights-available", {
      gameId,
      gpuModel,
      insights
    });

    let notifications = [];
    try {
      notifications = this.uxBridge.fromInsights(insights) || [];
    } catch {
      notifications = [];
    }

    if (notifications.length > 0) {
      this.eventEmitter.emit("notifications", {
        gameId,
        gpuModel,
        notifications
      });
    }

    return {
      insights,
      notifications
    };
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUOrchestrator
};
