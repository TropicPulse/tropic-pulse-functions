// ============================================================================
//  aiGovernorAdapter.js — Pulse OS v11.2‑EVO Organ
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
  version: "11.2-EVO",
  identity: "aiGovernorAdapter-v11.2-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,

    packetAware: true,        // ⭐ NEW
    evolutionAware: true,     // ⭐ NEW
    windowAware: true,        // ⭐ NEW (safe artery snapshots)
    bluetoothReady: true,     // ⭐ placeholder for future binary channels

    binaryAware: true,
    governorAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    organismAware: true,

    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO"
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
      "auto-connect bluetooth" // ⭐ NEW
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap packets deterministically",
      "forward packets without interpretation",
      "remain pure and minimal",
      "act as a safe membrane between layers",
      "expose membrane artery metrics",
      "prepare for future binary membrane channels" // ⭐ NEW
    ])
  })
});

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.2‑EVO
// ============================================================================
export class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    this.id = config.id || "governor-adapter";

    this.encoder  = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;

    // Future: Bluetooth binary membrane (not active)
    this.bluetooth = config.bluetooth || null; // ⭐ placeholder only

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
      snapshot: () => Object.freeze({
        packetsIn: this.artery.packetsIn,
        packetsOut: this.artery.packetsOut,
        lastPacketBits: this.artery.lastPacketBits
      })
    };
  }

  // ---------------------------------------------------------------------------
  //  FORWARD BINARY → GOVERNOR (pure membrane)
  // ---------------------------------------------------------------------------
  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = {
      type: "binary-event",
      bits: binaryStr,
      bitLength: binaryStr.length,
      timestamp: Date.now(),

      // ⭐ Future: Bluetooth membrane metadata
      bluetooth: {
        ready: !!this.bluetooth,
        channel: null
      }
    };

    this._trace("forwardBinaryToGovernor", packet);

    this.artery.packetsIn++;
    this.artery.lastPacketBits = packet.bitLength;

    this.governor.handle(packet);
  }

  // ---------------------------------------------------------------------------
  //  FORWARD GOVERNOR DECISION → BINARY PIPELINE
  // ---------------------------------------------------------------------------
  forwardGovernorDecision(decisionObj) {
    const json = JSON.stringify(decisionObj);
    const binary = this.encoder.encode(json);

    this._trace("forwardGovernorDecision", {
      decision: decisionObj,
      bits: binary.length
    });

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

      if (result !== null) {
        this.forwardBinaryToGovernor(result);
      }

      return result;
    };

    this._trace("attachToReflex", { reflex: reflex.id });
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

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  GovernorAdapterMeta
};

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryGovernorAdapter,
    createAIBinaryGovernorAdapter,
    GovernorAdapterMeta
  };
}
