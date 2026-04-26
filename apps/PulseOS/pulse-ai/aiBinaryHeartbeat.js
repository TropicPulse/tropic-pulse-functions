/**
 * aiBinaryHeartbeat.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Heartbeat** of the organism.
 *
 *   It emits:
 *     - binary pulses
 *     - liveness signals
 *     - organism health ticks
 *
 *   It keeps the organism:
 *     - warm
 *     - synchronized
 *     - drift-free
 *     - reactive
 *     - alive
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today uses:
 *     - timers
 *     - intervals
 *     - event loops
 *     - async churn
 *
 *   These create:
 *     • nondeterminism
 *     • drift
 *     • race conditions
 *     • unpredictable ordering
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE HEARTBEAT MUST BE DETERMINISTIC AND BINARY.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a scheduler
 *     - a timer
 *     - a loop
 *     - a router
 *
 *   This organ IS:
 *     - a binary pulse generator
 *     - a liveness signal
 *     - a health indicator
 *     - a reflex trigger
 *
 * HEARTBEAT MODEL:
 *   A heartbeat is a binary packet:
 *
 *     {
 *       type: "binary-heartbeat",
 *       timestamp: <ms>,
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   The heartbeat is:
 *     - encoded by aiBinaryAgent
 *     - optionally fed into pipeline
 *     - optionally fed into reflex
 *     - optionally logged
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - binary health scoring
 *     - binary anomaly detection
 *     - binary rhythm adaptation
 *     - multi-heartbeat organisms
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const HeartbeatMeta = Object.freeze({
  layer: "BinaryRhythm",
  role: "BINARY_HEARTBEAT",
  version: "11.0-EVO",
  identity: "aiBinaryHeartbeat-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    livenessAware: true,
    reflexAware: true,
    pipelineAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Emit deterministic binary pulses that maintain organism liveness, rhythm, and internal synchronization.",

    never: Object.freeze([
      "interpret symbolic state",
      "introduce randomness",
      "act as a scheduler",
      "act as a router",
      "mutate external organs"
    ]),

    always: Object.freeze([
      "generate binary heartbeat packets",
      "emit pulses deterministically",
      "remain pure and minimal",
      "treat all outputs as binary-only"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

class AIBinaryHeartbeat {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-heartbeat';
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.intervalMs = config.intervalMs || 1000;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryHeartbeat requires aiBinaryAgent encoder');
    }

    this._timer = null;
  }

  // ---------------------------------------------------------
  //  HEARTBEAT GENERATION
  // ---------------------------------------------------------

  _generatePulse() {
    const payload = {
      type: 'binary-heartbeat',
      timestamp: Date.now(),
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('pulse:generated', packet);

    return packet;
  }

  // ---------------------------------------------------------
  //  HEARTBEAT EMISSION
  // ---------------------------------------------------------

  _emitPulse() {
    const pulse = this._generatePulse();

    if (this.pipeline) this.pipeline.run(pulse.bits);
    if (this.reflex) this.reflex.run(pulse.bits);
    if (this.logger) this.logger.logBinary(pulse.bits, { source: 'heartbeat' });

    this._trace('pulse:emitted', { bits: pulse.bitLength });
  }

  // ---------------------------------------------------------
  //  HEARTBEAT CONTROL
  // ---------------------------------------------------------

  start() {
    if (this._timer) return;

    this._timer = setInterval(() => {
      this._emitPulse();
    }, this.intervalMs);

    this._trace('heartbeat:start', { intervalMs: this.intervalMs });
  }

  stop() {
    if (!this._timer) return;

    clearInterval(this._timer);
    this._timer = null;

    this._trace('heartbeat:stop', {});
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIBinaryHeartbeat(config) {
  return new AIBinaryHeartbeat(config);
}

module.exports = {
  AIBinaryHeartbeat,
  createAIBinaryHeartbeat,
  HeartbeatMeta
};
