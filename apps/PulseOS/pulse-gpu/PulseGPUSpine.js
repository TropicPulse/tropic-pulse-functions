// ============================================================================
//  PULSE GPU ORCHESTRATOR v9.2 — MINIMAL BRAINSTEM
//  Autonomic Command Spine • Deterministic • Zero Compute • Zero Mutation
// ============================================================================
//
//  WHAT THIS IS:
//    • The pure autonomic command spine of the GPU organism.
//    • Routes signals between GPU subsystems.
//    • Emits deterministic neural events.
//    • Consults the Wisdom Cortex for insights.
//    • Fail‑open, drift‑proof, self‑repair‑ready.
//
//  WHAT THIS IS NOT:
//    • Not a renderer
//    • Not a GPU runtime
//    • Not a memory organ
//    • Not an advisor, healer, optimizer, or tracer
// ============================================================================

import { PulseGPUEventEmitter } from "./PulseGPUSynapses.js";
import { PulseGPUInsightsEngine } from "./PulseGPUWisdomCortex.js";

// ============================================================================
//  ORCHESTRATOR — MINIMAL BRAINSTEM (v9.2)
// ============================================================================
class PulseGPUOrchestrator {
  constructor() {
    // Synapses = neural firing system
    this.eventEmitter = new PulseGPUEventEmitter();

    // Wisdom Cortex = insight interpreter
    this.insightsEngine = new PulseGPUInsightsEngine();

    // Identity metadata
    this.meta = {
      layer: "PulseGPUOrchestrator",
      role: "BRAINSTEM",
      version: 9.2,
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        driftProof: true,
        unifiedAdvantageField: true,
        advantageCascadeAware: true
      }
    };
  }

  // ========================================================================
  // SESSION SIGNALS — PURE AUTONOMIC ROUTING
  // ========================================================================
  startSession(payload = {}) {
    this.eventEmitter.emit("session-started", payload);
  }

  recordStep(sessionId, step) {
    this.eventEmitter.emit("session-step-recorded", { sessionId, step });
  }

  endSession(payload = {}) {
    this.eventEmitter.emit("session-ended", payload);
  }

  // ========================================================================
  // INSIGHTS — CONSULT WISDOM CORTEX
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
    } catch {
      // fail-open
    }

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
export { PulseGPUOrchestrator };
