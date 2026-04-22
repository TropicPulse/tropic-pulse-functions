// ============================================================================
//  PULSE GPU ORCHESTRATOR v9.2 — THE BRAINSTEM
//  Autonomic Command Spine • Deterministic • Zero Compute • Zero Mutation
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
// SAFETY CONTRACT (v7.7):
//  -----------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: missing subsystems never crash the brainstem
//  • Self-repair-ready: all outputs include metadata
//
// ============================================================================


import { PulseGPUSettingsMemory } from "./PulseGPUSurvivalInstincts.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUDriveCenter.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUCognitiveLayer.js";
import { PulseGPUSessionTracer } from "./PulseGPUNervousSystem.js";
import { PulseGPUEventEmitter } from "./PulseGPUSynapses.js";
import { PulseGPUUXBridge } from "./PulseGPUCognitiveIntelligence.js";
import { PulseGPUAutoOptimize } from "./PulseGPUGuardianCortex.js";
import { PulseGPUHealer } from "./PulseGPULymphNodes.js";
import { PulseGPUInsightsEngine } from "./PulseGPUWisdomCortex.js";

// ============================================================================
//  ORCHESTRATOR — BRAINSTEM (v9.2)
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

    // -----------------------------------------------------------------------
    // v9.2 BRAINSTEM IDENTITY
    // -----------------------------------------------------------------------
    this.meta = {
      layer: "PulseGPUOrchestrator",
      role: "BRAINSTEM",
      version: 9.2,
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,
        unifiedAdvantageField: true,
        pulseSend2Ready: true,

        routingContract: "PulseSend-v2",
        gpuOrganContract: "PulseGPU-v9.2",
        earnCompatibility: "PulseEarn-v9"
      }
    };

    log(
      "gpu",
      "[Brainstem] Command spine online — autonomic coordination active (v9.2).",
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
    } catch {}

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
        version: 9.2,
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
