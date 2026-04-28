// ============================================================================
//  aiLoggerAdapter.js — Pulse OS v11.3‑EVO Organ
//  Binary Logger Adapter + Shadow Logger (always-on forensic logger)
// ============================================================================

export const LoggerAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "LOGGER_ADAPTER",
  version: "11.3-EVO",
  identity: "aiLoggerAdapter-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,
    loggerAware: true,
    pipelineAware: true,
    reflexAware: true,
    packetAware: true,
    shadowLoggerAware: true,
    windowAware: true,       // ⭐ NEW
    evolutionAware: true,    // ⭐ NEW
    bluetoothReady: true,    // ⭐ NEW
    microPipeline: true,     // ⭐ NEW
    speedOptimized: true,    // ⭐ NEW
    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.3-EVO"
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
      "modify pipeline or reflex behavior",
      "introduce randomness",
      "recursively log itself"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap binary in structured packets",
      "forward packets to ProofLogger",
      "forward packets to shadowLogger (if present)",
      "remain pure and minimal",
      "act as a safe membrane",
      "emit deterministic logger packets"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, logger-scoped
// ============================================================================
function emitLoggerPacket(type, payload) {
  return Object.freeze({
    meta: LoggerAdapterMeta,
    packetType: `logger-${type}`,
    timestamp: Date.now(),
    epoch: LoggerAdapterMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms membrane + packet builder
// ============================================================================
export function prewarmLoggerAdapter({ trace = false } = {}) {
  const packet = emitLoggerPacket("prewarm", {
    message: "Logger adapter prewarmed and membrane aligned."
  });

  if (trace) console.log("[LoggerAdapter] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIBinaryLoggerAdapter {
  constructor(config = {}) {
    this.id = config.id || LoggerAdapterMeta.identity;

    this.logger = config.logger;
    this.shadowLogger = config.shadowLogger || null;
    this.trace = !!config.trace;

    if (!this.logger || typeof this.logger.log !== "function") {
      throw new Error("AIBinaryLoggerAdapter requires a ProofLogger-like object with .log()");
    }

    if (this.shadowLogger && typeof this.shadowLogger.logRaw !== "function") {
      throw new Error("shadowLogger must implement .logRaw(binaryString, meta)");
    }
  }

  // ---------------------------------------------------------------------------
  //  PACKET BUILDER — pure, deterministic
  // ---------------------------------------------------------------------------
  _buildPacket(bits, meta = {}) {
    return Object.freeze({
      type: "binary-event",
      source: this.id,
      bits,
      bitLength: bits.length,
      timestamp: Date.now(),
      meta: Object.freeze(meta)
    });
  }

  // ---------------------------------------------------------------------------
  //  ALWAYS-ON SHADOW LOGGER — non-blocking, non-recursive
  // ---------------------------------------------------------------------------
  _shadowLog(bits, meta) {
    if (!this.shadowLogger) return;

    try {
      this.shadowLogger.logRaw(bits, meta);
    } catch (_) {
      // shadow logger must NEVER break the organism
    }
  }

  // ---------------------------------------------------------------------------
  //  PRIMARY LOGGING — ProofLogger (human-facing)
  // ---------------------------------------------------------------------------
  logBinary(binaryStr, meta = {}) {
    this._assertBinary(binaryStr);

    const packet = this._buildPacket(binaryStr, meta);

    // Shadow logger ALWAYS fires first
    this._shadowLog(binaryStr, meta);

    this._trace("logBinary:packet", {
      bitLength: packet.bitLength,
      meta: packet.meta
    });

    this.logger.log(packet);

    return emitLoggerPacket("logged", {
      bitLength: packet.bitLength,
      meta: packet.meta
    });
  }

  // ---------------------------------------------------------------------------
  //  PIPELINE ATTACHMENT — logs every stage output
  // ---------------------------------------------------------------------------
  attachToPipeline(pipeline) {
    if (!pipeline || typeof pipeline.addObserver !== "function") {
      throw new Error("attachToPipeline expects a pipeline organ");
    }

    pipeline.addObserver(({ stageIndex, input, output }) => {
      this.logBinary(output, {
        stageIndex,
        inputBits: input.length,
        outputBits: output.length
      });
    });

    this._trace("attachToPipeline", { pipeline: pipeline.id });

    return emitLoggerPacket("pipeline-attached", { pipelineId: pipeline.id });
  }

  // ---------------------------------------------------------------------------
  //  REFLEX ATTACHMENT — logs every reflex output
  // ---------------------------------------------------------------------------
  attachToReflex(reflex) {
    if (!reflex || typeof reflex.run !== "function") {
      throw new Error("attachToReflex expects a reflex organ");
    }

    const originalRun = reflex.run.bind(reflex);

    reflex.run = (binaryInput) => {
      const result = originalRun(binaryInput);

      if (result !== null && result !== undefined) {
        this.logBinary(result, {
          reflexFired: true,
          inputBits: binaryInput.length,
          outputBits: result.length
        });
      }

      return result;
    };

    this._trace("attachToReflex", { reflex: reflex.id });

    return emitLoggerPacket("reflex-attached", { reflexId: reflex.id });
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
export function createAIBinaryLoggerAdapter(config) {
  return new AIBinaryLoggerAdapter(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
export { LoggerAdapterMeta };

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryLoggerAdapter,
    createAIBinaryLoggerAdapter,
    LoggerAdapterMeta,
    prewarmLoggerAdapter
  };
}
