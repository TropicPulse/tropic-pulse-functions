/**
 * aiBinaryHeartbeat.js — Pulse OS v11.1‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Heartbeat** of the organism.
 */

// ---------------------------------------------------------
//  META BLOCK — v11.1‑EVO
// ---------------------------------------------------------

const HeartbeatMeta = Object.freeze({
  layer: "BinaryRhythm",
  role: "BINARY_HEARTBEAT",
  version: "11.1-EVO",
  identity: "aiBinaryHeartbeat-v11.1-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    livenessAware: true,
    reflexAware: true,
    pipelineAware: true,
    arteryAware: true,
    multiInstanceReady: true,
    epoch: "v11.1-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Emit deterministic binary pulses that maintain organism liveness, rhythm, and internal synchronization.",

    never: Object.freeze([
      "interpret symbolic state",
      "introduce randomness",
      "act as a scheduler",
      "act as a router",
      "mutate external organs",
      "depend on timers",
      "depend on intervals"
    ]),

    always: Object.freeze([
      "generate binary heartbeat packets",
      "emit pulses deterministically",
      "remain pure and minimal",
      "treat all outputs as binary-only",
      "maintain artery metrics",
      "stay drift-proof"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v11.1‑EVO
// ---------------------------------------------------------

class AIBinaryHeartbeat {
  constructor(config = {}) {
    this.id       = config.id || "ai-binary-heartbeat";
    this.encoder  = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;
    this.trace    = !!config.trace;

    if (!this.encoder?.encode) {
      throw new Error("AIBinaryHeartbeat requires aiBinaryAgent encoder");
    }

    this.artery = {
      pulses: 0,
      lastBits: 0,
      lastEntropy: 0,
      snapshot: () => Object.freeze({
        pulses: this.artery.pulses,
        lastBits: this.artery.lastBits,
        lastEntropy: this.artery.lastEntropy
      })
    };
  }

  _computeEntropy(bits) {
    const ones = [...bits].filter(b => b === "1").length;
    return ones / Math.max(1, bits.length);
  }

  _generatePulse() {
    const payload = {
      type: "binary-heartbeat",
      timestamp: Date.now()
    };

    const json = JSON.stringify(payload);
    const bits = this.encoder.encode(json);

    const entropy = this._computeEntropy(bits);

    const packet = {
      ...payload,
      bits,
      bitLength: bits.length,
      entropy
    };

    this.artery.pulses++;
    this.artery.lastBits = bits.length;
    this.artery.lastEntropy = entropy;

    this._trace("pulse:generated", packet);

    return packet;
  }

  emit() {
    const pulse = this._generatePulse();

    if (this.pipeline) this.pipeline.run(pulse.bits);
    if (this.reflex)   this.reflex.run(pulse.bits);
    if (this.logger)   this.logger.logBinary(pulse.bits, { source: "binary-heartbeat" });

    this._trace("pulse:emitted", {
      bits: pulse.bitLength,
      entropy: pulse.entropy
    });

    return pulse;
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY
// ---------------------------------------------------------

function createAIBinaryHeartbeat(config) {
  return new AIBinaryHeartbeat(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

// ESM
export {
  HeartbeatMeta,
  AIBinaryHeartbeat,
  createAIBinaryHeartbeat
};

// CommonJS
module.exports = {
  HeartbeatMeta,
  AIBinaryHeartbeat,
  createAIBinaryHeartbeat
};
