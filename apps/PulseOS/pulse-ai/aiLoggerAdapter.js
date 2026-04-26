/**
 * aiLoggerAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Logger Adapter** for Pulse OS.
 *
 *   It connects the Binary Evolution Layer to ProofLogger
 *   WITHOUT breaking purity, WITHOUT converting to human formats,
 *   and WITHOUT introducing drift or recursion.
 *
 * WHY THIS ORGAN EXISTS:
 *   ProofLogger is a human-facing organ:
 *     - timestamps
 *     - subsystem names
 *     - human-readable messages
 *     - structured logs
 *
 *   The Binary Evolution Layer is machine-facing:
 *     - raw binary
 *     - deterministic compute
 *     - no human formatting
 *     - no interpretation
 *
 *   These two worlds must NEVER directly touch.
 *
 *   This adapter is the **membrane** between them.
 *
 * ARCHITECTURAL INTENT:
 *   This organ:
 *     - Accepts binary input
 *     - Wraps it in a structured log packet
 *     - Sends it to ProofLogger
 *
 *   This organ does NOT:
 *     - decode binary
 *     - interpret binary
 *     - mutate binary
 *     - format binary
 *     - project binary to human-readable form
 *
 *   It simply transports binary safely across the membrane.
 *
 * PACKET MODEL:
 *   {
 *     type: "binary-event",
 *     source: "aiBinaryLoggerAdapter",
 *     bits: <binary string>,
 *     bitLength: <number>,
 *     timestamp: <ms>,
 *     meta: { ...optional metadata }
 *   }
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - binary deltas
 *     - binary snapshots
 *     - binary organ signatures
 *     - binary reflex traces
 *     - binary pipeline traces
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------
/**
 * aiLoggerAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Logger Adapter** for Pulse OS (dualband).
 *
 *   It connects the Evolution Layer to ProofLogger
 *   WITHOUT breaking purity, WITHOUT converting to human formats,
 *   and WITHOUT introducing drift or recursion.
 *
 * WHY THIS ORGAN EXISTS:
 *   ProofLogger is a human-facing organ:
 *     - timestamps
 *     - subsystem names
 *     - human-readable messages
 *     - structured logs
 *
 *   The Evolution Layer is machine-facing:
 *     - raw binary
 *     - deterministic compute
 *     - no human formatting
 *     - no interpretation
 *
 *   These two worlds must NEVER directly touch.
 *
 *   This adapter is the **membrane** between them.
 *
 * ARCHITECTURAL INTENT:
 *   This organ:
 *     - Accepts binary input
 *     - Wraps it in a structured log packet
 *     - Sends it to ProofLogger
 *
 *   This organ does NOT:
 *     - decode binary
 *     - interpret binary
 *     - mutate binary
 *     - format binary
 *     - project binary to human-readable form
 *
 *   It simply transports binary safely across the membrane.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

export const LoggerAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "LOGGER_ADAPTER",
  version: "11.0-EVO",
  identity: "aiLoggerAdapter-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,
    loggerAware: true,
    pipelineAware: true,
    reflexAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Transport binary packets safely from the organism to ProofLogger without decoding or interpreting.",

    never: Object.freeze([
      "decode binary",
      "interpret binary",
      "mutate binary",
      "format binary",
      "project binary to human-readable form",
      "modify pipeline or reflex behavior"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap binary in structured packets",
      "forward packets to ProofLogger",
      "remain pure and minimal",
      "act as a safe membrane"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (LOGIC UNCHANGED)
// ---------------------------------------------------------

class AIBinaryLoggerAdapter {
  constructor(config = {}) {
    this.id = config.id || 'logger-adapter';
    this.logger = config.logger;
    this.trace = !!config.trace;

    if (!this.logger || typeof this.logger.log !== 'function') {
      throw new Error(
        'AIBinaryLoggerAdapter requires a ProofLogger-like object with .log()'
      );
    }
  }

  logBinary(binaryStr, meta = {}) {
    this._assertBinary(binaryStr);

    const packet = {
      type: 'binary-event',
      source: this.id,
      bits: binaryStr,
      bitLength: binaryStr.length,
      timestamp: Date.now(),
      meta: meta || {},
    };

    this._trace('logBinary:packet', packet);

    this.logger.log(packet);
  }

  attachToPipeline(pipeline) {
    if (!pipeline || typeof pipeline.addObserver !== 'function') {
      throw new Error('attachToPipeline expects a pipeline organ');
    }

    pipeline.addObserver(({ stageIndex, input, output }) => {
      this.logBinary(output, {
        stageIndex,
        inputBits: input.length,
        outputBits: output.length,
      });
    });

    this._trace('attachToPipeline', { pipeline: pipeline.id });
  }

  attachToReflex(reflex) {
    if (!reflex || typeof reflex.run !== 'function') {
      throw new Error('attachToReflex expects a reflex organ');
    }

    const originalRun = reflex.run.bind(reflex);

    reflex.run = (binaryInput) => {
      const result = originalRun(binaryInput);

      if (result !== null) {
        this.logBinary(result, {
          reflexFired: true,
          inputBits: binaryInput.length,
          outputBits: result.length,
        });
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

function createAIBinaryLoggerAdapter(config) {
  return new AIBinaryLoggerAdapter(config);
}

module.exports = {
  AIBinaryLoggerAdapter,
  createAIBinaryLoggerAdapter,
  LoggerAdapterMeta
};
