/**
 * aiGovernorAdapter.js — Pulse OS v11.1‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Governor Adapter** (dualband).
 */

// ---------------------------------------------------------
//  META BLOCK — v11.1‑EVO
// ---------------------------------------------------------

const GovernorAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "GOVERNOR_ADAPTER",
  version: "11.1-EVO",
  identity: "aiGovernorAdapter-v11.1-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,

    binaryAware: true,
    governorAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    organismAware: true,

    identitySafe: true,
    readOnly: true,

    multiInstanceReady: true,
    epoch: "v11.1-EVO"
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
      "inject symbolic metadata"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap packets deterministically",
      "forward packets without interpretation",
      "remain pure and minimal",
      "act as a safe membrane between layers",
      "expose membrane artery metrics"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v11.1‑EVO
// ---------------------------------------------------------

class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    this.id = config.id || "governor-adapter";

    this.encoder  = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;

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

  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = {
      type: "binary-event",
      bits: binaryStr,
      bitLength: binaryStr.length,
      timestamp: Date.now()
    };

    this._trace("forwardBinaryToGovernor", packet);

    this.artery.packetsIn++;
    this.artery.lastPacketBits = packet.bitLength;

    this.governor.handle(packet);
  }

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

  attachToPipeline(pipeline) {
    pipeline.addObserver(({ output }) => {
      this.forwardBinaryToGovernor(output);
    });

    this._trace("attachToPipeline", { pipeline: pipeline.id });
  }

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

  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY
// ---------------------------------------------------------

function createAIBinaryGovernorAdapter(config) {
  return new AIBinaryGovernorAdapter(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

// ESM
export {
  AIBinaryGovernorAdapter,
  createAIBinaryGovernorAdapter,
  GovernorAdapterMeta
};

// CommonJS
module.exports = {
  AIBinaryGovernorAdapter,
  createAIBinaryGovernorAdapter,
  GovernorAdapterMeta
};
