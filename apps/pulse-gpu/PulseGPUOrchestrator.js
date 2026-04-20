// ============================================================================
//  PULSE GPU ORCHESTRATOR v7.3 — THE BRAINSTEM
//  Autonomic Command Spine of the GPU Subsystem
//  Deterministic, Pure Logic, Full-GPU Coordination Layer
// ============================================================================
//
// IDENTITY — THE BRAINSTEM:
//  -------------------------
//  • The autonomic command center of the GPU organism.
//  • Routes signals between all GPU subsystems.
//  • Ensures survival-level coordination and continuity.
//  • Issues orders; never performs the work itself.
//  • The spine every subsystem reports into.
//  • Advantage‑cascade aware: any systemic advantage is inherited automatically.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Analyst        → Intelligence Division
//  • Nerve Network  → Runtime Memory
//  • Motor Hall     → Execution Cortex
//  • Guardian       → Permission Gate
//  • Lymph Network  → Immune Filter
//  • Wisdom Cortex  → Insight + Interpretation
//  • Brainstem      → Command + Coordination
//
// WHAT THIS FILE IS:
//  -------------------
//  • A pure logic coordinator (API-agnostic, full GPU)
//  • The wiring layer for all Pulse-GPU components
//  • The single entrypoint for “run a session through the GPU body”
//  • A deterministic, fail-open, self-repair-ready command spine
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer
//  • NOT a GPU runtime
//  • NOT a WebGPU/WebGL interface
//  • NOT a persistence layer
//  • NOT a backend module
//  • NOT a UI system
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: missing subsystems never crash the brainstem
//  • Self-repair-ready: all outputs include metadata
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • If pulses become faster → command routing conceptually accelerates.
//  • If system collapses 1000 pulses into 1 → orchestration inherits that gain.
//  • If any organ evolves → the brainstem routes the advantage to all others.
//  • No OR — all advantages are inherited automatically.
// ============================================================================
import { PulseGPUSettingsMemory } from "./PulseGPUSettingsMemory.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUPerformanceAdvisor.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUSettingsRestorer.js";
import { PulseGPUSessionTracer } from "./PulseGPUSessionTracer.js";

import { PulseGPUEventEmitter } from "./PulseGPUEventEmitter.js";
import { PulseGPUUXBridge } from "./PulseGPUUXBridge.js";
import { PulseGPUAutoOptimize } from "./PulseGPUAutoOptimize.js";

// ============================================================================
//  PULSE GPU ORCHESTRATOR — THE BRAINSTEM
// ============================================================================
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

    this.uxBridge =
      options.uxBridge || new PulseGPUUXBridge();

    this.autoOptimize =
      options.autoOptimize ||
      new PulseGPUAutoOptimize(options.userPreferences);

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

    this.meta = {
      layer: "PulseGPUOrchestrator",
      role: "BRAINSTEM",
      version: 7.3,
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true
      }
    };

    log(
      "%c[Brainstem] Command spine online — autonomic coordination active (v7.3).",
      "color:#03A9F4; font-weight:bold;"
    );
  }

  // ========================================================================
  // SESSION LIFECYCLE — AUTONOMIC COMMAND SIGNALS
  // ========================================================================
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

  // ========================================================================
  // END SESSION — FULL AUTONOMIC COMMAND PIPELINE
  // ========================================================================
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

    // MEMORY → ADVISOR → RESTORER → AUTO-OPT → NOTIFICATIONS → HEALER
    // (the full autonomic reflex arc)

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
    } catch {}

    this.eventEmitter.emit("performance-advice", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      advisorResult
    });

    let restorePlan = { action: "noop" };
    try {
      restorePlan = this.settingsRestorer.buildRestorePlan(
        advisorResult.advice || []
      );
    } catch {}

    this.eventEmitter.emit("settings-restore-plan", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      restorePlan
    });

    let autoDecision = {
      mode: "require-confirmation",
      reason: "Auto-optimize decision unavailable; defaulting to confirmation.",
      plan: restorePlan,
      meta: {
        layer: "PulseGPUAutoOptimize",
        version: 7.3,
        target: "full-gpu"
      }
    };

    try {
      autoDecision = this.autoOptimize.decide(restorePlan, {
        adviceList: advisorResult.advice || []
      });
    } catch {}

    this.eventEmitter.emit("auto-optimize-decision", {
      sessionId,
      gameProfile: safeGameProfile,
      hardwareProfile: safeHardwareProfile,
      tierProfile: safeTierProfile,
      decision: autoDecision
    });

    let advisorNotifications = [];
    let planNotification = null;

    try {
      advisorNotifications = this.uxBridge.fromAdvisorResult(advisorResult) || [];
    } catch {}

    try {
      planNotification = this.uxBridge.fromRestorePlan(restorePlan) || null;
    } catch {}

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

    let healingReport = null;

    try {
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
    } catch {}

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

  // ========================================================================
  // INSIGHTS PIPELINE — BRAINSTEM CONSULTS THE WISDOM CORTEX
  // ========================================================================
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
    } catch {}

    this.eventEmitter.emit("insights-available", {
      gameId,
      gpuModel,
      insights
    });

    let notifications = [];
    try {
      notifications = this.uxBridge.fromInsights(insights) || [];
    } catch {}

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

// ============================================================================
// EXPORTS
// ============================================================================
export { PulseGPUOrchestrator };
