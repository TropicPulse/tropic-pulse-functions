// ============================================================================
//  aiGovernorAdapter.js — Pulse OS v11.3‑EVO Organ
//  Dualband Membrane • Packet Router • Evolution‑Safe Adapter
// ============================================================================
//
//  CANONICAL ROLE:
//    This organ is the **Governor Adapter** — the deterministic membrane
//    between the Evolution Layer and the Governor.
// ============================================================================

export const GovernorAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "GOVERNOR_ADAPTER",
  version: "11.3-EVO",
  identity: "aiGovernorAdapter-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,

    packetAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    binaryAware: true,
    governorAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    organismAware: true,

    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic membrane between the evolution layer and the Governor, without interpreting or mutating packets.",

    never: Object.freeze([
      "decode binary",
      "interpret binary",
      "mutate binary",
      "apply policy logic",
      "override Governor decisions",
      "modify pipeline or reflex behavior",
      "introduce randomness",
      "alter packet meaning",
      "inject symbolic metadata",
      "auto-connect bluetooth"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap packets deterministically",
      "forward packets without interpretation",
      "remain pure and minimal",
      "act as a safe membrane between layers",
      "expose membrane artery metrics",
      "prepare for future binary membrane channels"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, membrane-scoped
// ============================================================================
function emitGovernorAdapterPacket(type, payload) {
  return Object.freeze({
    meta: GovernorAdapterMeta,
    packetType: `gov-adapter-${type}`,
    timestamp: Date.now(),
    epoch: GovernorAdapterMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — optional, dualband-aware
// ============================================================================
export function prewarmGovernorAdapter(dualBand = null, { trace = false } = {}) {
  try {
    const pressure = dualBand?.binary?.metabolic?.pressure ?? 0;

    const packet = emitGovernorAdapterPacket("prewarm", {
      message: "Governor adapter prewarmed and membrane artery aligned.",
      binaryPressure: pressure
    });

    if (trace) console.log("[aiGovernorAdapter] prewarm", packet);
    return packet;
  } catch (err) {
    return emitGovernorAdapterPacket("prewarm-error", {
      error: String(err),
      message: "Governor adapter prewarm failed."
    });
  }
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    this.id = config.id || "governor-adapter";

    this.encoder  = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;

    this.bluetooth = config.bluetooth || null;
    this.trace = !!config.trace;

    if (!this.encoder?.encode) {
      throw new Error("AIBinaryGovernorAdapter requires aiBinaryAgent encoder");
    }
    if (!this.governor?.handle) {
      throw new Error("AIBinaryGovernorAdapter requires a Governor organ with .handle()");
    }

    this.artery = {
      packetsIn: 0,
      packetsOut: 0,
      lastPacketBits: 0,
      snapshot: () => Object.freeze(this._snapshotArtery())
    };
  }

  // ---------------------------------------------------------------------------
  //  ARTERY SNAPSHOT + BUCKETS
  // ---------------------------------------------------------------------------
  _snapshotArtery() {
    const { packetsIn, packetsOut, lastPacketBits } = this.artery;
    const load = Math.min(1, (packetsIn + packetsOut) / 1000);
    const pressure = Math.min(1, lastPacketBits / 65536);

    return {
      packetsIn,
      packetsOut,
      lastPacketBits,
      load,
      loadBucket: this._bucketLoad(load),
      pressure,
      pressureBucket: this._bucketPressure(pressure)
    };
  }

  _bucketLoad(v) {
    if (v >= 0.9) return "saturated";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "idle";
  }

  _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "none";
  }

  // ---------------------------------------------------------------------------
  //  FORWARD BINARY → GOVERNOR (pure membrane)
// ---------------------------------------------------------------------------
  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = emitGovernorAdapterPacket("forward-in", {
      bits: binaryStr,
      bitLength: binaryStr.length,
      bluetooth: {
        ready: !!this.bluetooth,
        channel: null
      }
    });

    this._trace("forwardBinaryToGovernor", packet);

    this.artery.packetsIn++;
    this.artery.lastPacketBits = packet.bitLength;

    this.governor.handle({
      type: "binary-event",
      bits: packet.bits,
      bitLength: packet.bitLength,
      timestamp: packet.timestamp,
      bluetooth: packet.bluetooth
    });
  }

  // ---------------------------------------------------------------------------
  //  FORWARD GOVERNOR DECISION → BINARY PIPELINE
// ---------------------------------------------------------------------------
  forwardGovernorDecision(decisionObj) {
    const json = JSON.stringify(decisionObj);
    const binary = this.encoder.encode(json);

    const packet = emitGovernorAdapterPacket("forward-out", {
      decision: decisionObj,
      bits: binary,
      bitLength: binary.length
    });

    this._trace("forwardGovernorDecision", packet);

    this.artery.packetsOut++;
    this.artery.lastPacketBits = binary.length;

    if (this.pipeline) this.pipeline.run(binary);
    if (this.reflex)   this.reflex.run(binary);
    if (this.logger)   this.logger.logBinary(binary, { source: "Governor" });

    return binary;
  }

  // ---------------------------------------------------------------------------
  //  PIPELINE ATTACHMENT — binary-only observer
// ---------------------------------------------------------------------------
  attachToPipeline(pipeline) {
    pipeline.addObserver(({ output }) => {
      this.forwardBinaryToGovernor(output);
    });

    this._trace("attachToPipeline", { pipeline: pipeline.id });
  }

  // ---------------------------------------------------------------------------
  //  REFLEX ATTACHMENT — binary-only observer
// ---------------------------------------------------------------------------
  attachToReflex(reflex) {
    const originalRun = reflex.run.bind(reflex);

    reflex.run = (binaryInput) => {
      const result = originalRun(binaryInput);

      if (result !== null && typeof result === "string") {
        this.forwardBinaryToGovernor(result);
      }

      return result;
    };

    this._trace("attachToReflex", { reflex: reflex.id });
  }

  // ---------------------------------------------------------------------------
  //  WINDOW-SAFE ARTERY SNAPSHOT
// ---------------------------------------------------------------------------
  snapshotMembrane() {
    return emitGovernorAdapterPacket("snapshot", {
      artery: this._snapshotArtery()
    });
  }

  // ---------------------------------------------------------------------------
  //  VALIDATION
// ---------------------------------------------------------------------------
  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
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
export function createAIBinaryGovernorAdapter(config) {
  return new AIBinaryGovernorAdapter(config);
}


if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryGovernorAdapter,
    createAIBinaryGovernorAdapter,
    GovernorAdapterMeta,
    prewarmGovernorAdapter
  };
}
