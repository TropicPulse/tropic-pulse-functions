// ============================================================================
//  PULSE GPU EVENT EMITTER v11-Evo — THE SYNAPSE LAYER
//  Deterministic, Fail‑Open, Zero‑Side‑Effects Signal Relay
// ============================================================================
//
// IDENTITY — THE SYNAPSE LAYER (v11-Evo):
//  --------------------------------------
//  • Electrical junctions of the GPU organism.
//  • Pure deterministic relay between GPU subsystems.
//  • Binary-aware, dual-mode-aware, dispatch-aware (metadata only).
//  • No randomness, no async, no timestamps, no GPU calls.
//  • Fail‑open: a bad handler never breaks the relay.
//  • PulseSend‑v11‑ready: impulses routable by compute router.
//  • Earn‑v3‑ready.
//
// SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No randomness
//  • No timestamps
//  • No async
//  • No DOM
//  • No GPU calls
//  • No environment access
//  • No mutation outside internal listener map
//  • Deterministic: same impulses → same order → same results
// ============================================================================

const PULSE_GPU_EVENT_EMITTER_META_V11 = {
  layer: "PulseGPUEventEmitter",
  version: "11.0-Evo-binary",
  target: "full-gpu+binary",
  description: "Synaptic signal relay for GPU subsystem communication.",

  selfRepairable: true,
  unifiedAdvantageField: true,
  pulseSend11Ready: true,

  // v11-Evo awareness
  evo: {
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

    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,

    // NEW v11-Evo
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,

    // Contracts (conceptual only)
    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v11-Evo",
    binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
    earnCompatibility: "Earn-v3",

    // Legacy compatibility
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};

class PulseGPUEventEmitter {
  constructor() {
    this.listeners = {};
    this.meta = { ...PULSE_GPU_EVENT_EMITTER_META_V11 };

    log(
      "synapse",
      "PulseGPUEventEmitter v11-Evo — synaptic junction layer active (binary-aware, dual-mode, PulseSend‑v11‑ready)."
    );
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
