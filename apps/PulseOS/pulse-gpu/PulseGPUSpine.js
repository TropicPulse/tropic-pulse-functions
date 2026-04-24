// ============================================================================
//  PULSE GPU ORCHESTRATOR v11-Evo-Prime — THE SPINE / BRAINSTEM
//  Autonomic Nervous System • Reflex Router • Pressure Regulator
//  Dual-Mode (Binary + Symbolic) • Dispatch-Aware • Memory-Aware
//  Deterministic • Fail-Open • Zero Side Effects
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The GPU organism’s BRAINSTEM + SPINAL CORD.
//  • Routes signals between all GPU organs (Brain, Engine, Healer, Advisor).
//  • Maintains life-support loops: pressure, load, mode, reflex arcs.
//  • Starts/ends sessions, records sensory input, emits impulses.
//  • Feeds GeneticMemory, InsightsEngine, SurvivalInstincts, UXBridge.
//  • Binary + symbolic mode coordinator.
//  • Pure metadata: no GPU calls, no async, no randomness.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not the Brain (no planning).
//  • Not the Engine (no execution).
//  • Not the Router (no network).
//  • Not the Healer (no correction).
//  • Not the Advisor (no analysis).
//  • Not the Memory (no storage).
//
//  SAFETY CONTRACT (v11-Evo-Prime):
//  --------------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM / Node / FS / Network
//  • No side effects outside eventEmitter
//  • Deterministic: same input → same output
//  • Fail-open: invalid input → safe empty results
// ============================================================================

import { PulseGPUEventEmitter } from "./PulseGPUSynapses.js";
import { PulseGPUInsightsEngine } from "./PulseGPUWisdomCortex.js";
import { PulseGPUSessionTracer } from "./PulseGPUSessionTracer.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUPerformanceAdvisor.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUSettingsRestorer.js";
import { PulseGPUGuardianCortex } from "./PulseGPUGuardianCortex.js";
import { PulseGPUHealer } from "./PulseGPUHealer.js";
import { PulseGPUUXBridge } from "./PulseGPUUXBridge.js";
import { DEFAULT_USER_PREFERENCES } from "./PulseGPUConfig.js";

// ============================================================================
//  ORCHESTRATOR META — Brainstem Identity (v11-Evo-Prime)
// ============================================================================
const PULSE_GPU_ORCHESTRATOR_META_V11 = {
  layer: "PulseGPUOrchestrator",
  role: "BRAINSTEM",
  version: "11.0-Evo-Prime",
  target: "full-gpu+binary",
  selfRepairable: true,

  evo: {
    driftProof: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,

    // Dual-mode awareness
    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,

    // Dispatch + memory awareness
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,

    // Routing + organism contracts
    pulseSend11Ready: true,
    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v11-Evo-Prime",
    earnCompatibility: "Earn-v3",

    // Legacy metadata
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};

// ============================================================================
//  PRESSURE SNAPSHOT BUILDER — Sensory → Reflex Pressure Map
// ============================================================================
function buildPressureSnapshotFromStep(step = {}) {
  const gpuLoad = typeof step.gpuLoad === "number" ? step.gpuLoad / 100 : 0;
  const cpuLoad = typeof step.cpuLoad === "number" ? step.cpuLoad / 100 : 0;
  const stutters = typeof step.stutters === "number" ? step.stutters : 0;
  const vram = typeof step.vramUsageMB === "number" ? step.vramUsageMB : 0;

  const gpuLoadPressure = Math.max(0, Math.min(1, gpuLoad));
  const thermalPressure = gpuLoadPressure; // deterministic proxy
  const memoryPressure = vram > 0 ? Math.max(0, Math.min(1, vram / 4_000_000)) : 0;
  const meshStormPressure = stutters > 0 ? Math.max(0, Math.min(1, stutters / 1000)) : 0;
  const auraTension = Math.max(0, Math.min(1, (gpuLoad + cpuLoad) / 2));

  return {
    gpuLoadPressure,
    thermalPressure,
    memoryPressure,
    meshStormPressure,
    auraTension
  };
}

// ============================================================================
//  PULSE GPU ORCHESTRATOR v11-Evo-Prime — THE SPINE / BRAINSTEM
// ============================================================================
class PulseGPUOrchestrator {
  constructor(options = {}) {
    // Synapses — electrical junctions
    this.eventEmitter = new PulseGPUEventEmitter();

    // Wisdom Cortex — insights interpreter
    this.insightsEngine = new PulseGPUInsightsEngine();

    // Sensory Archive — afferent nervous system
    this.sessionTracer = options.sessionTracer || new PulseGPUSessionTracer();

    // Cognitive + Immune Cluster
    this.performanceAdvisor =
      options.performanceAdvisor ||
      new PulseGPUPerformanceAdvisor(options.settingsMemory);

    this.settingsRestorer =
      options.settingsRestorer || new PulseGPUSettingsRestorer();

    this.guardianCortex =
      options.guardianCortex ||
      new PulseGPUGuardianCortex(
        options.userPreferences || DEFAULT_USER_PREFERENCES
      );

    this.healer =
      options.healer ||
      new PulseGPUHealer({
        advisor: this.performanceAdvisor,
        restorer: this.settingsRestorer,
        userPreferences: options.userPreferences || DEFAULT_USER_PREFERENCES
      });

    this.uxBridge = options.uxBridge || new PulseGPUUXBridge();

    // Identity metadata
    this.meta = { ...PULSE_GPU_ORCHESTRATOR_META_V11 };
  }

  // ========================================================================
  // SESSION START — Reflex Boot + Sensory Activation
  // ========================================================================
  startSession(payload = {}) {
    const { sessionId, gameProfile, hardwareProfile, tierProfile } = payload;

    const trace = this.sessionTracer.startSession({
      sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile
    });

    this.eventEmitter.emit("session-started", {
      sessionId: trace.sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile
    });

    return { sessionId: trace.sessionId };
  }

  // ========================================================================
  // STEP RECORD — Sensory Input → Reflex Pressure Update
  // ========================================================================
  recordStep(sessionId, step) {
    const trace = this.sessionTracer.recordStep(sessionId, step || {});
    if (!trace) return;

    const normalizedStep = trace.steps[trace.steps.length - 1] || step || {};
    const pressureSnapshot = buildPressureSnapshotFromStep(normalizedStep);

    this.eventEmitter.emit("session-step-recorded", {
      sessionId,
      step: normalizedStep,
      pressureSnapshot
    });

    this.eventEmitter.emit("pressure-updated", {
      sessionId,
      pressureSnapshot
    });

    return { pressureSnapshot };
  }

  // ========================================================================
  // SESSION END — Reflex Arc: Insights → Advisor → Guardian → Healer → UX
  // ========================================================================
  endSession(payload = {}) {
    const {
      sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile,
      metrics,
      settings,
      userPreferences
    } = payload;

    const trace = this.sessionTracer.endSession(sessionId);
    const summary = trace ? trace.getSummary() : null;

    this.eventEmitter.emit("session-ended", { sessionId, summary });

    // INSIGHTS — Wisdom Cortex
    const baselineTraces = [];
    const currentTraces = trace ? [trace] : [];

    let insights = [];
    try {
      insights =
        this.insightsEngine.analyzeStepDurationsForGameAndHardware({
          baselineTraces,
          currentTraces,
          gameId: gameProfile?.gameId,
          gpuModel: hardwareProfile?.gpuModel
        }) || [];
    } catch {
      insights = [];
    }

    this.eventEmitter.emit("insights-available", {
      gameId: gameProfile?.gameId,
      gpuModel: hardwareProfile?.gpuModel,
      insights
    });

    // ADVISOR — Cognitive Drive Center
    const advisorResult = this.performanceAdvisor.safeAnalyzeCurrentSession({
      gameProfile,
      hardwareProfile,
      tierProfile,
      settings,
      metrics
    });

    this.eventEmitter.emit("advisor-result", {
      sessionId,
      advisorResult
    });

    // RESTORER — Cognitive Recognition Layer
    const restorePlan = this.settingsRestorer.buildRestorePlan(
      advisorResult.advice
    );

    this.eventEmitter.emit("restore-plan", {
      sessionId,
      restorePlan
    });

    // GUARDIAN — Permission Cortex
    const guardianDecision = this.guardianCortex.decide(restorePlan, {
      adviceList: advisorResult.advice,
      userPreferences: userPreferences || DEFAULT_USER_PREFERENCES
    });

    this.eventEmitter.emit("guardian-decision", {
      sessionId,
      decision: guardianDecision
    });

    // HEALER — Immune System
    const healingReport = this.healer.healSessionFlow({
      advisorResult,
      restorePlan,
      autoDecision: guardianDecision,
      notifications: [],
      context: {
        gameProfile,
        hardwareProfile,
        tierProfile,
        settings,
        metrics,
        userPreferences: userPreferences || DEFAULT_USER_PREFERENCES
      }
    });

    this.eventEmitter.emit("healing-report", {
      sessionId,
      healingReport
    });

    // UX BRIDGE — Cognitive Communication Layer
    const advisorNotifications = this.uxBridge.fromAdvisorResult(advisorResult);
    const planNotification = this.uxBridge.fromRestorePlan(restorePlan);
    const insightNotifications = this.uxBridge.fromInsights(insights);

    const notifications = [
      ...advisorNotifications,
      ...(planNotification ? [planNotification] : []),
      ...insightNotifications
    ];

    this.eventEmitter.emit("notifications-available", {
      sessionId,
      notifications
    });

    return {
      insights,
      advisorResult,
      restorePlan,
      guardianDecision,
      healingReport,
      notifications
    };
  }

  // ========================================================================
  // INSIGHTS ONLY — Explicit Call
  // ========================================================================
  analyzeInsights({ baselineTraces = [], currentTraces = [], gameId, gpuModel }) {
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

    return { insights };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================
export { PulseGPUOrchestrator, PULSE_GPU_ORCHESTRATOR_META_V11 };
