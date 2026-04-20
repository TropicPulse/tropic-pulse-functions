// ============================================================================
//  PULSE GPU v7.3 — THE ASTRAL NERVOUS SYSTEM
//  GPU-SUBSYSTEM (OS-FACING BRIDGE / SUBCONSCIOUS NEURAL LAYER)
//  The hidden power grid beneath the OS.
//  PURE HEALING. PURE REFLEX. NO MARKETPLACE. NO BACKEND.
// ============================================================================
//
// IDENTITY — THE ASTRAL NERVOUS SYSTEM:
//  ------------------------------------
//  • The subconscious GPU brain beneath Pulse Earn.
//  • The autonomic neural layer powering visuals + compute.
//  • The silent orchestrator of GPU sessions, healing, and reflex loops.
//  • The fail-open guardian that never blocks the OS (reflex arc).
//  • The astral field that keeps PulseBand + PulseNet alive.
//  • The evolutionary + systemic performance amplifier (conceptual only).
//
// EVOLUTIONARY + SYSTEM ADVANTAGE (conceptual only):
//  -------------------------------------------------
//  • GPU efficiency scales with organism stability (metabolic).
//  • Runtime smoothness benefits from metabolic + stability boosts.
//  • Engine throughput conceptually increases with uptime + instance count.
//  • Orchestrator reflexes improve with session history + cluster coherence.
//  • Multi-instance, parallel-safe, zero-drift, deterministic cloning.
//  • ZERO logic changes — purely identity + conceptual evolution.
//
// SAFETY CONTRACT:
//  ----------------
//  • No Node APIs.
//  • No randomness.
//  • No timestamps (except metrics counters).
//  • Fail-open: GPU unavailable → no crash.
//  • Deterministic: no hidden side effects.
//  • ESM-only.
// ============================================================================

// ============================================================================
//  IMPORTS — RAW NEURAL SUBSYSTEMS
// ============================================================================
import { PulseVersion, PulseRoles, makeTelemetryPacket, log, warn, error } from "./PulseLogger.js";
import {
  BrainInput,
  PulseGPUBrainExport
} from "./PulseGPUBrain.js";

import { PulseGPURuntime } from "./PulseGPURuntime.js";
import { PulseGPUEngine } from "./PulseGPUEngine.js";
import { PulseGPUOrchestrator } from "./PulseGPUOrchestrator.js";

import { PulseGPUSettingsMemory } from "./PulseGPUSettingsMemory.js";
import { PulseGPUPerformanceAdvisor } from "./PulseGPUPerformanceAdvisor.js";
import { PulseGPUSettingsRestorer } from "./PulseGPUSettingsRestorer.js";
import { PulseGPUSessionTracer } from "./PulseGPUSessionTracer.js";
import { PulseGPUInsightsEngine } from "./PulseGPUInsightsEngine.js";
import { PulseGPUEventEmitter } from "./PulseGPUEventEmitter.js";
import { PulseGPUUXBridge } from "./PulseGPUUXBridge.js";
import { PulseGPUAutoOptimize } from "./PulseGPUAutoOptimize.js";
import { PulseGPUHealer } from "./PulseGPUHealer.js";

log(
  "%c🟦 PulseGPU v7.3 online — ASTRAL NERVOUS SYSTEM activated (dual-mode evolutionary/system advantage).",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  INTERNAL SINGLETONS — Astral Neural Core
// ============================================================================
log("%c[AstralNervousSystem] Initializing GPU Runtime…", "color:#9C27B0;");
const gpuRuntime = new PulseGPURuntime();

log("%c[AstralNervousSystem] Initializing GPU Engine…", "color:#9C27B0;");
const gpuEngine = new PulseGPUEngine(gpuRuntime);

log("%c[AstralNervousSystem] Initializing GPU Orchestrator…", "color:#9C27B0;");
const gpuOrchestrator = new PulseGPUOrchestrator();

// ============================================================================
//  GPU OS STATE SNAPSHOT — Astral Memory
// ============================================================================
const gpuState = {
  layer: "PulseGPU",
  version: 7.3,
  ready: false,
  brainReady: false,
  runtimeReady: false,
  engineReady: false,
  lastError: null,

  // Evolutionary + System-Level metrics (conceptual only)
  evo: {
    // Biological / mental / organism-level
    metabolicBoost: 1.0,        // conceptual GPU efficiency multiplier
    neuralReflexBoost: 1.0,     // conceptual orchestrator reflex speed
    stabilityBoost: 1.0,        // conceptual runtime smoothness scaling

    // System / physical / architectural
    multiInstanceReady: true,   // safe to conceptually run 1 → 1000 instances
    deterministicNeuron: true,  // identical inputs → identical outputs across clones
    parallelSafe: true,         // conceptual parallel neuron safety
    fanOutScaling: 1.0,         // conceptual throughput scaling factor
    clusterCoherence: true,     // conceptual synchronization across instances
    zeroDriftCloning: true,     // conceptual no-drift replication
    reflexPropagation: 1.0,     // conceptual reflex amplification across instances

    // Fusion — BOTH mental + physical, evolution + system
    dualModeEvolution: true,    // biological + system evolution active together
    organismClusterBoost: 1.0,  // conceptual boost when many instances run
    cognitiveComputeLink: true, // conceptual link between mental + compute gains
    unifiedAdvantageField: true // “no OR” — both advantage layers always on
  },

  metrics: {
    framesRendered: 0,
    gpuLoad: null,
    cpuLoad: null,
    smoothness: null,
    memoryMB: null
  }
};

// ============================================================================
//  INTERNAL HELPERS — Neural Reflex Logic
// ============================================================================

// Conceptual evolutionary + system scaling (NO logic changes)
function updateEvolutionaryBoosts() {
  // These values DO NOT affect logic — conceptual only.
  gpuState.evo.metabolicBoost = 1.0;
  gpuState.evo.neuralReflexBoost = 1.0;
  gpuState.evo.stabilityBoost = 1.0;

  gpuState.evo.fanOutScaling = 1.0;
  gpuState.evo.reflexPropagation = 1.0;
  gpuState.evo.organismClusterBoost = 1.0;
}

function updateReadyFlags() {
  const ctx = gpuRuntime.getGPUContext();

  gpuState.runtimeReady = !!ctx?.ready;
  gpuState.engineReady = !!gpuEngine;
  gpuState.brainReady = !!PulseGPUBrainExport;

  gpuState.ready =
    gpuState.runtimeReady &&
    gpuState.engineReady &&
    gpuState.brainReady;

  updateEvolutionaryBoosts();

  log(
    `%c[AstralNervousSystem] ReadyFlags → brain=${gpuState.brainReady} | runtime=${gpuState.runtimeReady} | engine=${gpuState.engineReady} | ready=${gpuState.ready}`,
    "color:#4CAF50; font-weight:bold;"
  );
}

function safeSetError(err) {
  gpuState.lastError = err ? String(err) : null;
  error(
    `%c[AstralNervousSystem ERROR] ${gpuState.lastError}`,
    "color:#FF5252; font-weight:bold;"
  );
}

// ============================================================================
//  PUBLIC OS-FACING API — Astral Interface
// ============================================================================
async function init(canvas) {
  log("%c[AstralNervousSystem] init() called.", "color:#03A9F4;");

  try {
    await gpuRuntime.init(canvas);
    updateReadyFlags();

    if (gpuState.ready) {
      log("%c[AstralNervousSystem] GPU READY.", "color:#4CAF50; font-weight:bold;");
    } else {
      warn("%c[AstralNervousSystem] GPU NOT READY (fail-open).", "color:#FFC107;");
    }

    return gpuState.ready;

  } catch (err) {
    safeSetError(err);
    updateReadyFlags();
    return false;
  }
}

function renderFrame(frameContext) {
  if (!gpuState.ready || !gpuEngine || typeof gpuEngine.render !== "function") {
    return;
  }

  try {
    gpuEngine.render(frameContext);
    gpuState.metrics.framesRendered += 1;

    if (gpuState.metrics.framesRendered % 60 === 0) {
      log(
        `%c[AstralNervousSystem] FramesRendered=${gpuState.metrics.framesRendered}`,
        "color:#8BC34A;"
      );
    }

  } catch (err) {
    safeSetError(err);
  }
}

function getStatus() {
  updateReadyFlags();
  return {
    ...gpuState,
    metrics: { ...gpuState.metrics }
  };
}

function getRuntime() {
  return gpuRuntime;
}

function getEngine() {
  return gpuEngine;
}

function getOrchestrator() {
  return gpuOrchestrator;
}

function attachToWindowDebug() {
  if (typeof window === "undefined") return;

  window.PulseGPU = {
    getStatus,
    getRuntime,
    getEngine,
    getOrchestrator
  };

  log(
    "%c[AstralNervousSystem] Debug handle attached to window.PulseGPU",
    "color:#03A9F4; font-weight:bold;"
  );
}

// ============================================================================
//  EXPORTS — Astral Nervous System Surface
// ============================================================================
const PulseGPU = {
  init,
  renderFrame,
  getStatus,
  getRuntime,
  getEngine,
  getOrchestrator,
  attachToWindowDebug
};

export { PulseGPU };

// Raw building blocks (unchanged)
export {
  BrainInput,
  PulseGPUBrainExport,
  PulseGPURuntime,
  PulseGPUEngine,
  PulseGPUOrchestrator,
  PulseGPUSettingsMemory,
  PulseGPUPerformanceAdvisor,
  PulseGPUSettingsRestorer,
  PulseGPUSessionTracer,
  PulseGPUInsightsEngine,
  PulseGPUEventEmitter,
  PulseGPUUXBridge,
  PulseGPUAutoOptimize,
  PulseGPUHealer
};
