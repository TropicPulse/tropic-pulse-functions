// ============================================================================
//  PULSE GPU v6.3 — THE SHADOW ENGINE
//  GPU-SUBSYSTEM (OS-FACING BRIDGE / GPU SUBCONSCIOUS LAYER)
//  The hidden power grid beneath the OS.
//  PURE HEALING. NO AI. NO MARKETPLACE. NO BACKEND.
// ============================================================================
//
// IDENTITY — THE SHADOW ENGINE:
//  -----------------------------
//  • The invisible compute layer beneath Pulse Earn.
//  • The subconscious GPU brain that powers visuals + compute.
//  • The silent orchestrator of GPU sessions, healing, and optimization.
//  • The fail-open guardian that never blocks the OS.
//  • The hidden force that keeps PulseBand + PulseNet alive.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The OS-facing GPU bridge.
//  • The unified surface for Brain + Runtime + Engine + Orchestrator.
//  • The GPU readiness reporter.
//  • The GPU metrics reporter.
//  • The fail-open GPU coordinator.
//  • The GPU OS layer for PulseBand / PulseNet / dashboards.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer by itself.
//  • NOT a backend module.
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a place for business logic.
//  • NOT a place for globals (window attach is explicit).
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

console.log(
  "%c🟦 PulseGPU v6.3 online — SHADOW ENGINE activated.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  IMPORTS — RAW SUBSYSTEMS (Shadow Components)
// ============================================================================
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

// ============================================================================
//  INTERNAL SINGLETONS — Shadow Engine Core
// ============================================================================
console.log("%c[ShadowEngine] Initializing GPU Runtime…", "color:#9C27B0;");
const gpuRuntime = new PulseGPURuntime();

console.log("%c[ShadowEngine] Initializing GPU Engine…", "color:#9C27B0;");
const gpuEngine = new PulseGPUEngine(gpuRuntime);

console.log("%c[ShadowEngine] Initializing GPU Orchestrator…", "color:#9C27B0;");
const gpuOrchestrator = new PulseGPUOrchestrator();

// ============================================================================
//  GPU OS STATE SNAPSHOT — Shadow Memory
// ============================================================================
const gpuState = {
  layer: "PulseGPU",
  version: 6.3,
  ready: false,
  brainReady: false,
  runtimeReady: false,
  engineReady: false,
  lastError: null,
  metrics: {
    framesRendered: 0,
    gpuLoad: null,
    cpuLoad: null,
    smoothness: null,
    memoryMB: null
  }
};

// ============================================================================
//  INTERNAL HELPERS — Shadow Logic
// ============================================================================
function updateReadyFlags() {
  const ctx = gpuRuntime.getGPUContext();

  gpuState.runtimeReady = !!ctx?.ready;
  gpuState.engineReady = !!gpuEngine;
  gpuState.brainReady = !!PulseGPUBrainExport;

  gpuState.ready =
    gpuState.runtimeReady &&
    gpuState.engineReady &&
    gpuState.brainReady;

  console.log(
    `%c[ShadowEngine] ReadyFlags → brain=${gpuState.brainReady} | runtime=${gpuState.runtimeReady} | engine=${gpuState.engineReady} | ready=${gpuState.ready}`,
    "color:#4CAF50; font-weight:bold;"
  );
}

function safeSetError(err) {
  gpuState.lastError = err ? String(err) : null;
  console.error(
    `%c[ShadowEngine ERROR] ${gpuState.lastError}`,
    "color:#FF5252; font-weight:bold;"
  );
}

// ============================================================================
//  PUBLIC OS-FACING API — Shadow Interface
// ============================================================================
async function init(canvas) {
  console.log("%c[ShadowEngine] init() called.", "color:#03A9F4;");

  try {
    await gpuRuntime.init(canvas);
    updateReadyFlags();

    if (gpuState.ready) {
      console.log("%c[ShadowEngine] GPU READY.", "color:#4CAF50; font-weight:bold;");
    } else {
      console.warn("%c[ShadowEngine] GPU NOT READY (fail-open).", "color:#FFC107;");
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
      console.log(
        `%c[ShadowEngine] FramesRendered=${gpuState.metrics.framesRendered}`,
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

  console.log(
    "%c[ShadowEngine] Debug handle attached to window.PulseGPU",
    "color:#03A9F4; font-weight:bold;"
  );
}

// ============================================================================
//  EXPORTS — Shadow Engine Surface
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
