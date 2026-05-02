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
/*
AI_EXPERIENCE_META = {
  identity: "PulseGPUSpine",
  version: "v14-IMMORTAL",
  layer: "gpu_runtime",
  role: "gpu_spine",
  lineage: "PulseGPU-v14",

  evo: {
    gpuSpine: true,
    gpuOrchestrator: true,
    gpuBackbone: true,

    gpuCompute: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseGPUNervousSystem",
      "PulseGPUDriveCenter",
      "PulseGPUDrive"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyGPUSpine"
    ]
  }
}
*/

import { PulseGPUEventEmitter } from "./PulseGPUSynapses.js";
import { PulseGPUInsightsEngine } from "./PulseGPUWisdomCortex.js";
import { PulseGPUSessionTracer } from "./PulseGPUNervousSystem.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUDriveCenter.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUCognitiveLayer.js";
import { PulseGPUGuardianCortex } from "./PulseGPUGuardianCortex.js";
import { PulseGPUHealer } from "./PulseGPULymphNodes.js";
import { PulseGPUUXBridge } from "./PulseGPUCognitiveIntelligence.js";
import { PulseGPUGeneticMemory } from "./PulseGPUGeneticMemory.js";
import { DEFAULT_USER_PREFERENCES } from "./PulseGPUCommandments.js";

// ============================================================================
//  ORCHESTRATOR META — Brainstem Identity (v12.3-Evo-Spine)
// ============================================================================
const PULSE_GPU_ORCHESTRATOR_META_V12_3 = {
  layer: "PulseGPUOrchestrator",
  role: "BRAINSTEM",
  version: "12.3-Evo-Spine",
  target: "full-gpu+binary+presence",
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

    // Spine + organism loader awareness
    gpuSpineReady: true,
    organismLoaderReady: true,
    sessionTracerAware: true,
    geneticMemoryAware: true,

    // Prewarm / chunking / cache awareness (no actual IO here)
    prewarmReady: true,
    warmPathAware: true,
    coldPathSafe: true,
    chunkingReady: true,
    dualBandAware: true,

    // Routing + organism contracts
    pulseSend11Ready: true,
    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v12.3-Evo-Spine",
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
  const memoryPressure =
    vram > 0 ? Math.max(0, Math.min(1, vram / 4_000_000)) : 0;
  const meshStormPressure =
    stutters > 0 ? Math.max(0, Math.min(1, stutters / 1000)) : 0;
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
//  EXECUTION CONTEXT BUILDER — For Genetic Memory v12.3+
// ============================================================================
function buildExecutionContextFromSession({ metrics = {}, summary = {}, gpuContext = null } = {}) {
  const binaryMode =
    typeof metrics.binaryMode === "string"
      ? metrics.binaryMode
      : gpuContext?.binaryMode || "auto";

  const pipelineId = metrics.pipelineId || gpuContext?.pipelineId || "";
  const sceneType = metrics.sceneType || gpuContext?.sceneType || "";
  const workloadClass = metrics.workloadClass || gpuContext?.workloadClass || "";
  const resolution = metrics.resolution || gpuContext?.resolution || "";
  const refreshRate = metrics.refreshRate || gpuContext?.refreshRate || 0;

  const dispatchSignature =
    metrics.dispatchSignature ||
    gpuContext?.dispatchSignature ||
    summary.gpuContext?.dispatchSignature ||
    "";

  const shapeSignature =
    metrics.shapeSignature ||
    gpuContext?.shapeSignature ||
    summary.gpuContext?.shapeSignature ||
    "";

  return {
    binaryMode,
    pipelineId,
    sceneType,
    workloadClass,
    resolution,
    refreshRate,
    dispatchSignature,
    shapeSignature
  };
}

// ============================================================================
//  TRACE SUMMARY → GENETIC MEMORY TRACE SNAPSHOT
// ============================================================================
function buildTraceSummaryForGeneticMemory({ summary = {}, pressureSnapshot = null } = {}) {
  return {
    totalDurationMs: summary.totalDurationMs || 0,
    totalWarnings: summary.totalWarnings || 0,
    totalErrors: summary.totalErrors || 0,
    totalStutters: summary.totalStutters || 0,
    stepCount: summary.stepCount || 0,
    binaryStepCount: summary.binaryStepCount || 0,
    symbolicStepCount: summary.symbolicStepCount || 0,
    pressureSnapshot: pressureSnapshot || null
  };
}

// ============================================================================
//  PULSE GPU ORCHESTRATOR v12.3-Evo-Spine — THE SPINE / BRAINSTEM
// ============================================================================
class PulseGPUOrchestrator {
  constructor(options = {}) {
    // Synapses — electrical junctions
    this.eventEmitter = options.eventEmitter || new PulseGPUEventEmitter();

    // Wisdom Cortex — insights interpreter
    this.insightsEngine =
      options.insightsEngine || new PulseGPUInsightsEngine();

    // Sensory Archive — afferent nervous system
    this.sessionTracer =
      options.sessionTracer || new PulseGPUSessionTracer();

    // Genetic Memory — long-horizon pattern archive
    this.geneticMemory =
      options.geneticMemory || new PulseGPUGeneticMemory();

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
    this.meta = { ...PULSE_GPU_ORCHESTRATOR_META_V12_3 };
  }

  // ========================================================================
  // PREWARM — Deterministic Warm Path Priming (v12.3+)
  // ========================================================================
  prewarm() {
    const dummyGameProfile = { gameId: "prewarm-game" };
    const dummyHardwareProfile = { gpuModel: "prewarm-gpu" };
    const dummyTierProfile = { tierId: "prewarm-tier" };
    const dummySettings = {};
    const dummyMetrics = {};
    const dummyPrefs = { ...DEFAULT_USER_PREFERENCES };
    const dummyGpuContext = {
      binaryMode: "auto",
      pipelineId: "prewarm-pipeline",
      sceneType: "prewarm-scene",
      workloadClass: "prewarm-workload"
    };

    // Sensory + trace
    const trace = this.sessionTracer.startSession({
      sessionId: "prewarm-session",
      gameProfile: dummyGameProfile,
      hardwareProfile: dummyHardwareProfile,
      tierProfile: dummyTierProfile,
      gpuContext: dummyGpuContext
    });
    this.sessionTracer.recordStep("prewarm-session", {
      stepId: "prewarm-step",
      durationMs: 0
    });
    this.sessionTracer.endSession("prewarm-session");

    // Advisor + restorer + guardian + healer
    const advisorResult =
      this.performanceAdvisor.safeAnalyzeCurrentSession({
        gameProfile: dummyGameProfile,
        hardwareProfile: dummyHardwareProfile,
        tierProfile: dummyTierProfile,
        settings: dummySettings,
        metrics: dummyMetrics
      });

    const restorePlan = this.settingsRestorer.buildRestorePlan(
      advisorResult.advice || []
    );

    const guardianDecision = this.guardianCortex.decide(restorePlan, {
      adviceList: advisorResult.advice || [],
      userPreferences: dummyPrefs,
      gpuContext: dummyGpuContext
    });

    this.healer.healSessionFlow({
      advisorResult,
      restorePlan,
      autoDecision: guardianDecision,
      notifications: [],
      context: {
        gameProfile: dummyGameProfile,
        hardwareProfile: dummyHardwareProfile,
        tierProfile: dummyTierProfile,
        settings: dummySettings,
        metrics: dummyMetrics,
        userPreferences: dummyPrefs,
        gpuContext: dummyGpuContext
      }
    });

    // Insights + UX + Genetic Memory
    this.insightsEngine.analyzeStepDurationsForGameAndHardware({
      baselineTraces: [],
      currentTraces: [],
      gameId: dummyGameProfile.gameId,
      gpuModel: dummyHardwareProfile.gpuModel
    });

    this.uxBridge.fromAdvisorResult(advisorResult);
    this.uxBridge.fromRestorePlan(restorePlan);
    this.uxBridge.fromInsights([]);

    this.geneticMemory.recordObservation({
      gameProfile: dummyGameProfile,
      hardwareProfile: dummyHardwareProfile,
      tierProfile: dummyTierProfile,
      executionContext: buildExecutionContextFromSession({
        metrics: dummyMetrics,
        summary: {},
        gpuContext: dummyGpuContext
      }),
      metrics: {},
      traceSummary: buildTraceSummaryForGeneticMemory({
        summary: {},
        pressureSnapshot: null
      })
    });

    return { prewarmed: true, meta: this.meta };
  }

  // ========================================================================
  // SESSION START — Reflex Boot + Sensory Activation
  // ========================================================================
  startSession(payload = {}) {
    const {
      sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile,
      gpuContext
    } = payload;

    const trace = this.sessionTracer.startSession({
      sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile,
      gpuContext: gpuContext || null
    });

    this.eventEmitter.emit("session-started", {
      sessionId: trace.sessionId,
      gameProfile,
      hardwareProfile,
      tierProfile,
      gpuContext: gpuContext || null
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
      userPreferences,
      gpuContext
    } = payload;

    const trace = this.sessionTracer.endSession(sessionId);
    const summary = trace ? trace.getSummary() : null;

    // Session-level pressure snapshot (deterministic proxy from metrics or summary)
    const pressureSnapshot =
      summary && summary.stepCount > 0
        ? buildPressureSnapshotFromStep({
            gpuLoad: metrics?.gpuLoad,
            cpuLoad: metrics?.cpuLoad,
            stutters: summary.totalStutters,
            vramUsageMB: metrics?.vramUsageMB
          })
        : buildPressureSnapshotFromStep({
            gpuLoad: metrics?.gpuLoad,
            cpuLoad: metrics?.cpuLoad,
            stutters: metrics?.stutters,
            vramUsageMB: metrics?.vramUsageMB
          });

    this.eventEmitter.emit("session-ended", {
      sessionId,
      summary,
      pressureSnapshot
    });

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
      userPreferences: userPreferences || DEFAULT_USER_PREFERENCES,
      gpuContext: gpuContext || null
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
        userPreferences: userPreferences || DEFAULT_USER_PREFERENCES,
        gpuContext: gpuContext || null
      }
    });

    this.eventEmitter.emit("healing-report", {
      sessionId,
      healingReport
    });

    // GENETIC MEMORY — Long-Horizon Pattern Archive
    const executionContext = buildExecutionContextFromSession({
      metrics,
      summary: summary || {},
      gpuContext: gpuContext || null
    });

    const traceSummary = buildTraceSummaryForGeneticMemory({
      summary: summary || {},
      pressureSnapshot
    });

    const geneticMemoryEntry = this.geneticMemory.recordObservation({
      gameProfile,
      hardwareProfile,
      tierProfile,
      executionContext,
      metrics: metrics || {},
      traceSummary
    });

    this.eventEmitter.emit("genetic-memory-updated", {
      sessionId,
      geneticMemoryEntry
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
      geneticMemoryEntry,
      notifications,
      pressureSnapshot
    };
  }

  // ========================================================================
  // INSIGHTS ONLY — Explicit Call
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

    return { insights };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUOrchestrator,
  PULSE_GPU_ORCHESTRATOR_META_V12_3
};
