/**
 * aiGovernorAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Governor Adapter** (dualband).
 *
 *   It is the membrane between:
 *     - The Evolution Layer (binary-first compute)
 *     - The Governor (OS-level authority organ)
 *
 *   The Governor:
 *     • enforces rules
 *     • coordinates organs
 *     • manages permissions
 *     • handles escalation
 *     • resolves conflicts
 *
 *   The compute layer:
 *     • computes in binary
 *     • stores in binary
 *     • reacts in binary
 *     • evolves in binary
 *
 *   These two worlds must NEVER directly touch.
 *
 *   This adapter:
 *     - converts Governor decisions → binary packets
 *     - converts binary events → Governor packets
 *     - forwards both without interpretation
 *
 *   It is a **pure membrane**, not a decision-maker.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

export const GovernorAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "GOVERNOR_ADAPTER",
  version: "11.0-EVO",
  identity: "aiGovernorAdapter-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,
    binaryAware: true,
    governorAware: true,
    pipelineAware: true,
    reflexAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
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
      "introduce randomness"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap packets deterministically",
      "forward packets without interpretation",
      "remain pure and minimal",
      "act as a safe membrane between layers"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (LOGIC UNCHANGED)
// ---------------------------------------------------------

class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    this.id = config.id || 'governor-adapter';
    this.encoder = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryGovernorAdapter requires aiBinaryAgent encoder');
    }
    if (!this.governor || typeof this.governor.handle !== 'function') {
      throw new Error('AIBinaryGovernorAdapter requires a Governor organ with .handle()');
    }
  }

  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = {
      type: 'binary-event',
      bits: binaryStr,
      bitLength: binaryStr.length,
      timestamp: Date.now(),
    };

    this._trace('forwardBinaryToGovernor', packet);

    this.governor.handle(packet);
  }

  forwardGovernorDecision(decisionObj) {
    const json = JSON.stringify(decisionObj);
    const binary = this.encoder.encode(json);

    this._trace('forwardGovernorDecision', {
      decision: decisionObj,
      bits: binary.length,
    });

    if (this.pipeline) this.pipeline.run(binary);
    if (this.reflex) this.reflex.run(binary);
    if (this.logger) this.logger.logBinary(binary, { source: 'Governor' });

    return binary;
  }

  attachToPipeline(pipeline) {
    pipeline.addObserver(({ output }) => {
      this.forwardBinaryToGovernor(output);
    });

    this._trace('attachToPipeline', { pipeline: pipeline.id });
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

    this._trace('attachToReflex', { reflex: reflex.id });
  }

  _assertBinary(str) {
    if (typeof str !== 'string' || !/^[01]+$/.test(str)) {
      throw new TypeError('expected binary string');
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY EXPORT (UNCHANGED)
// ---------------------------------------------------------

function createAIBinaryGovernorAdapter(config) {
  return new AIBinaryGovernorAdapter(config);
}

module.exports = {
  AIBinaryGovernorAdapter,
  createAIBinaryGovernorAdapter,
  GovernorAdapterMeta
};
