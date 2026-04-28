// ============================================================================
//  aiBinaryHeartbeat.js — Pulse OS v11.3‑EVO Organ
//  Binary Heartbeat • Liveness Rhythm • Artery Metrics • Packet‑Ready
// ============================================================================
//
//  CANONICAL ROLE:
//    This organ is the **Binary Heartbeat** of the organism.
//    Emits deterministic binary pulses for liveness, rhythm, and sync.
// ============================================================================

export const HeartbeatMeta = Object.freeze({
  layer: "BinaryRhythm",
  role: "BINARY_HEARTBEAT",
  version: "11.3-EVO",
  identity: "aiBinaryHeartbeat-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    livenessAware: true,
    reflexAware: true,
    pipelineAware: true,
    arteryAware: true,

    dualband: true,        // ⭐ NEW
    packetAware: true,     // ⭐ NEW
    windowAware: true,     // ⭐ NEW (safe artery snapshot)
    bluetoothReady: true,  // ⭐ NEW (future rhythm channels)

    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.3-EVO"
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
      "depend on intervals",
      "auto-connect bluetooth"
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

// ============================================================================
//  PACKET EMITTER — deterministic, heartbeat-scoped
// ============================================================================
function emitHeartbeatPacket(type, payload) {
  return Object.freeze({
    meta: HeartbeatMeta,
    packetType: `heartbeat-${type}`,
    timestamp: Date.now(),
    epoch: HeartbeatMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — optional, dualband-aware
// ============================================================================
export function prewarmBinaryHeartbeat(dualBand = null, { trace = false } = {}) {
  try {
    const pressure = dualBand?.binary?.metabolic?.pressure ?? 0;

    const packet = emitHeartbeatPacket("prewarm", {
      message: "Binary heartbeat prewarmed and rhythm metrics aligned.",
      binaryPressure: pressure
    });

    if (trace) console.log("[aiBinaryHeartbeat] prewarm", packet);
    return packet;
  } catch (err) {
    return emitHeartbeatPacket("prewarm-error", {
      error: String(err),
      message: "Binary heartbeat prewarm failed."
    });
  }
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIBinaryHeartbeat {
  constructor(config = {}) {
    this.id       = config.id || "ai-binary-heartbeat";
    this.encoder  = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;
    this.trace    = !!config.trace;

    // Future: Bluetooth rhythm channel (not active)
    this.bluetooth = config.bluetooth || null;

    if (!this.encoder?.encode) {
      throw new Error("AIBinaryHeartbeat requires aiBinaryAgent encoder");
    }

    this.artery = {
      pulses: 0,
      lastBits: 0,
      lastEntropy: 0,
      snapshot: () => Object.freeze(this._snapshotArtery())
    };
  }

  // ---------------------------------------------------------------------------
  //  ARTERY SNAPSHOT — window-safe
  // ---------------------------------------------------------------------------
  _snapshotArtery() {
    const { pulses, lastBits, lastEntropy } = this.artery;
    const load = Math.min(1, pulses / 1000);

    return {
      pulses,
      lastBits,
      lastEntropy,
      load,
      loadBucket: this._bucketLoad(load),
      entropyBucket: this._bucketEntropy(lastEntropy)
    };
  }

  _bucketLoad(v) {
    if (v >= 0.9) return "saturated";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "idle";
  }

  _bucketEntropy(v) {
    if (v >= 0.9) return "chaotic";
    if (v >= 0.7) return "rich";
    if (v >= 0.4) return "balanced";
    if (v > 0)   return "sparse";
    return "flat";
  }

  // ---------------------------------------------------------------------------
  //  ENTROPY
  // ---------------------------------------------------------------------------
  _computeEntropy(bits) {
    if (!bits || bits.length === 0) return 0;
    let ones = 0;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === "1") ones++;
    }
    return ones / bits.length;
  }

  // ---------------------------------------------------------------------------
  //  PULSE GENERATION — deterministic
  // ---------------------------------------------------------------------------
  _generatePulse() {
    const payload = {
      type: "binary-heartbeat",
      timestamp: Date.now(),
      bluetooth: {
        ready: !!this.bluetooth,
        channel: null
      }
    };

    const json = JSON.stringify(payload);
    const bits = this.encoder.encode(json);
    const entropy = this._computeEntropy(bits);

    this.artery.pulses++;
    this.artery.lastBits = bits.length;
    this.artery.lastEntropy = entropy;

    return emitHeartbeatPacket("pulse", {
      bits,
      bitLength: bits.length,
      entropy,
      bluetooth: payload.bluetooth
    });
  }

  // ---------------------------------------------------------------------------
  //  EMIT — binary-only
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  //  TRACE
  // ---------------------------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryHeartbeat(config) {
  return new AIBinaryHeartbeat(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  HeartbeatMeta
};

if (typeof module !== "undefined") {
  module.exports = {
    HeartbeatMeta,
    AIBinaryHeartbeat,
    createAIBinaryHeartbeat,
    prewarmBinaryHeartbeat
  };
}
