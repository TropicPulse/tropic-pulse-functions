// ============================================================================
//  PULSE GPU EVENT EMITTER v12.3-Evo-binary-Spine — THE SYNAPSE LAYER
//  Deterministic, Fail‑Open, Zero‑Side‑Effects Signal Relay
// ============================================================================
//
// IDENTITY — THE SYNAPSE LAYER (v12.3-Evo-binary-Spine):
//  -----------------------------------------------------
//  • Electrical junctions of the GPU organism.
//  • Pure deterministic relay between GPU subsystems.
//  • Spine-aware: tuned for Orchestrator v12.3+
//  • Dual-band-aware: binary + symbolic pathways (metadata only)
//  • Chunking-aware + prewarm-ready
//  • No randomness, no async, no timestamps, no GPU calls.
//  • Fail‑open: a bad handler never breaks the relay.
//  • PulseSend‑v12.3‑ready: impulses routable by compute router.
//  • Earn‑v4‑ready.
//
// SAFETY CONTRACT (v12.3):
//  ------------------------
//  • No randomness
//  • No timestamps
//  • No async
//  • No DOM
//  • No GPU calls
//  • No environment access
//  • No mutation outside internal listener map
//  • Deterministic: same impulses → same order → same results
// ============================================================================

const PULSE_GPU_EVENT_EMITTER_META_V12 = {
  layer: "PulseGPUEventEmitter",
  version: "12.3-Evo-binary-Spine",
  target: "full-gpu+binary+spine",
  description: "Synaptic signal relay for GPU subsystem communication.",

  selfRepairable: true,
  unifiedAdvantageField: true,
  pulseSend12Ready: true,

  evo: {
    // deterministic nervous system traits
    metabolicBoost: 1.0,
    neuralReflexBoost: 1.0,
    stabilityBoost: 1.0,

    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,

    // v12.3 spine + dual-band + chunking
    gpuSpineReady: true,
    dualBandReady: true,
    chunkingReady: true,
    prewarmReady: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,

    // awareness flags (metadata only)
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,

    // Contracts (conceptual only)
    routingContract: "PulseSend-v12.3",
    gpuOrganContract: "PulseGPU-v12.3-Spine",
    binaryGpuOrganContract: "PulseBinaryGPU-v12.3-Spine",
    earnCompatibility: "Earn-v4",

    // Legacy compatibility
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};

class PulseGPUEventEmitter {
  constructor(logger) {
    this.listeners = {};
    this.meta = { ...PULSE_GPU_EVENT_EMITTER_META_V12 };
    this.logger = typeof logger === "function" ? logger : null;

    if (this.logger) {
      this.logger(
        "synapse",
        "PulseGPUEventEmitter v12.3 — synaptic junction layer active (spine-ready, dual-band, chunking-prewarm)."
      );
    }
  }

  // ------------------------------------------------------------------------
  // REGISTER — A neuron connects to this synapse
  // ------------------------------------------------------------------------
  on(signalName, handler) {
    if (!signalName || typeof handler !== "function") return;

    if (!this.listeners[signalName]) {
      this.listeners[signalName] = [];
    }

    this.listeners[signalName].push(handler);
  }

  // ------------------------------------------------------------------------
  // DISCONNECT — A neuron detaches from this synapse
  // ------------------------------------------------------------------------
  off(signalName, handler) {
    if (!this.listeners[signalName]) return;

    if (!handler) {
      this.listeners[signalName] = [];
      return;
    }

    this.listeners[signalName] = this.listeners[signalName].filter(
      (h) => h !== handler
    );
  }

  // ------------------------------------------------------------------------
  // EMIT — An electrical impulse jumps across the junction
  // ------------------------------------------------------------------------
  emit(signalName, payload) {
    const handlers = this.listeners[signalName];
    if (!handlers || handlers.length === 0) return;

    // Deterministic ordering: handlers invoked in registration order
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      try {
        handler(payload);
      } catch {
        // fail‑open: synapse never breaks
      }
    }
  }

  // ------------------------------------------------------------------------
  // PREWARM — Pre-create listener buckets for hot signals
  // ------------------------------------------------------------------------
  prewarm(signalNames) {
    if (!Array.isArray(signalNames)) return;

    for (let i = 0; i < signalNames.length; i++) {
      const name = signalNames[i];
      if (!name) continue;
      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }
    }
  }

  // ------------------------------------------------------------------------
  // CLEAR — The junction resets
  // ------------------------------------------------------------------------
  clearAll() {
    this.listeners = {};
  }
}

// ============================================================================
//  EXPORTS
// ============================================================================
export { PulseGPUEventEmitter };
