// ============================================================================
//  PULSE GPU EVENT EMITTER v7.7 — THE SYNAPSE LAYER
//  Deterministic, Fail‑Open, Zero‑Side‑Effects Signal Relay
// ============================================================================
//
// IDENTITY — THE SYNAPSE LAYER:
//  -----------------------------
//  • The electrical junctions of the GPU organism.
//  • Where impulses jump between subsystems.
//  • Ordered, calm, deterministic — no chaos, no randomness.
//  • The layer that lets the organism communicate internally.
//  • Dual‑mode evolved: biological + system‑level advantage active together.
//
// SAFETY CONTRACT (v7.7):
//  -----------------------
//  • No randomness
//  • No timestamps
//  • No async
//  • No DOM
//  • No GPU calls
//  • Fail‑open: no handler may break the relay
//  • Deterministic: same impulses → same order → same results
// ============================================================================

const PULSE_GPU_EVENT_EMITTER_META = {
  layer: "PulseGPUEventEmitter",
  version: 7.7,
  target: "full-gpu",
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
    unifiedAdvantageField: true
  }
};

class PulseGPUEventEmitter {
  constructor() {
    this.listeners = {};
    this.meta = { ...PULSE_GPU_EVENT_EMITTER_META };

    log(
      "synapse",
      "Online — electrical junction layer active (v7.7, dual‑mode evolution)."
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

    // Deterministic ordering: handlers are invoked in registration order
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      try {
        handler(payload);
      } catch {
        // fail‑open: synapse never breaks from a bad neuron
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
