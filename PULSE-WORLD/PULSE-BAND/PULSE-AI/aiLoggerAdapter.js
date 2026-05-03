// ============================================================================
//  aiLoggerAdapter.js — Pulse OS v15‑IMMORTAL
//  Binary Logger Membrane • Shadow Forensics • Artery Metrics • Window‑Safe
//  PURE MEMBRANE. ZERO INTERPRETATION. ZERO RANDOMNESS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiLoggerAdapter",
  version: "v15-IMMORTAL",
  layer: "ai_adapter",
  role: "logger_adapter",
  lineage: "aiLoggerAdapter-v10 → v11.3-EVO → v12.3-Presence → v15-IMMORTAL",

  evo: {
    adapter: true,
    logFormatting: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiDebug", "aiDiagnostics", "aiDiagnosticsWrite"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const LoggerAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "LOGGER_ADAPTER",
  version: "15-IMMORTAL",
  identity: "aiLoggerAdapter-v15-IMMORTAL",

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

    windowAware: true,
    evolutionAware: true,
    bluetoothReady: true,

    microPipeline: true,
    speedOptimized: true,

    organismAware: true,
    arteryAware: true,
    identitySafe: true,

    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "15-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose:
      "Transport binary packets safely from the organism to ProofLogger and shadow forensics without decoding or interpreting.",

    never: Object.freeze([
      "decode binary",
      "interpret binary",
      "mutate binary",
      "format binary",
      "project binary to human-readable form",
      "modify pipeline or reflex behavior",
      "introduce randomness",
      "recursively log itself",
      "store or infer user identity from bits",
      "apply policy logic on bits"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap binary in structured packets",
      "forward packets to ProofLogger",
      "forward packets to shadowLogger (if present)",
      "remain pure and minimal",
      "act as a safe membrane",
      "emit deterministic logger packets",
      "expose artery metrics for observability"
    ])
  }),

  boundaryReflex() {
    return "LoggerAdapter must remain a pure membrane: no decoding, no policy, no identity inference, ever.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, logger-scoped
// ============================================================================
function emitLoggerPacket(type, payload, { severity = "info" } = {}) {
  return Object.freeze({
    meta: LoggerAdapterMeta,
    packetType: `logger-${type}`,
    packetId: `logger-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: LoggerAdapterMeta.evo.epoch,
    severity,
    ...payload
  });
}

// ============================================================================
//  PREWARM — v15‑IMMORTAL membrane + artery warmup
// ============================================================================
export function prewarmLoggerAdapter(dualBand = null, { trace = false } = {}) {
  const binaryPressure = dualBand?.binary?.metabolic?.pressure ?? 0;
  const evolutionMode =
    dualBand?.symbolic?.evolution?.mode ||
    dualBand?.symbolic?.persona?.evolutionMode ||
    "passive";

  const packet = emitLoggerPacket("prewarm", {
    message: "Logger adapter prewarmed and membrane artery aligned.",
    binaryPressure,
    evolutionMode
  });

  if (trace) console.log("[LoggerAdapter] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v15‑IMMORTAL
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

    // v15‑IMMORTAL artery — membrane load + pressure metrics
    this.artery = {
      packetsIn: 0,
      packetsOut: 0,
      lastPacketBits: 0,
      snapshot: () => Object.freeze(this._snapshotArtery())
    };
  }

  // ---------------------------------------------------------------------------
  //  ARTERY SNAPSHOT + BUCKETS — window-safe metrics
  // ---------------------------------------------------------------------------
  _snapshotArtery() {
    const { packetsIn, packetsOut, lastPacketBits } = this.artery;
    const load = Math.min(1, (packetsIn + packetsOut) / 2000);
    const pressure = Math.min(1, lastPacketBits / 131072);

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
  //  PACKET BUILDER — pure, deterministic, identity-safe
  // ---------------------------------------------------------------------------
  _buildPacket(bits, meta = {}) {
    return Object.freeze({
      type: "binary-event",
      source: this.id,
      bits,
      bitLength: bits.length,
      timestamp: Date.now(),
      meta: Object.freeze({
        ...meta,
        identitySafe: true
      })
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
    this._shadowLog(binaryStr, packet.meta);

    this._trace("logBinary:packet", {
      bitLength: packet.bitLength,
      meta: packet.meta
    });

    this.logger.log(packet);

    this.artery.packetsIn++;
    this.artery.packetsOut++;
    this.artery.lastPacketBits = packet.bitLength;

    return emitLoggerPacket(
      "logged",
      {
        bitLength: packet.bitLength,
        meta: packet.meta,
        artery: this._snapshotArtery()
      },
      { severity: "info" }
    );
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
        outputBits: output.length,
        source: "pipeline"
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
          outputBits: result.length,
          source: "reflex"
        });
      }

      return result;
    };

    this._trace("attachToReflex", { reflex: reflex.id });

    return emitLoggerPacket("reflex-attached", { reflexId: reflex.id });
  }

  // ---------------------------------------------------------------------------
  //  WINDOW-SAFE ARTERY SNAPSHOT
  // ---------------------------------------------------------------------------
  snapshotMembrane() {
    return emitLoggerPacket("snapshot", {
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
export function createAIBinaryLoggerAdapter(config) {
  return new AIBinaryLoggerAdapter(config);
}

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryLoggerAdapter,
    createAIBinaryLoggerAdapter,
    LoggerAdapterMeta,
    prewarmLoggerAdapter
  };
}
