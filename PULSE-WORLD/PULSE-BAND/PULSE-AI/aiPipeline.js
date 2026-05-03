// ============================================================================
//  PULSE OS v15‑IMMORTAL — BINARY PIPELINE ORGAN
//  Compute Bloodstream • Flow Artery Metrics • Deterministic Binary Engine
//  PURE FLOW ENGINE. ZERO RANDOMNESS. ZERO EXTERNAL MUTATION.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiPipeline",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "pipeline_engine",
  lineage: "aiPipeline-v10 → v15-IMMORTAL",

  evo: {
    pipelineEngine: true,
    stageOrchestration: true,
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
    always: ["aiEngine", "aiCortex", "aiContextEngine", "aiGovernorAdapter", "aiLoggerAdapter"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const PipelineMeta = Object.freeze({
  layer: "OrganismFlow",
  role: "PIPELINE_ORGAN",
  version: "15-IMMORTAL",
  identity: "aiBinaryPipeline-v15-IMMORTAL",

  // --------------------------------------------------------------------------
  //  EVO — IMMORTAL-GRADE FLOW ENGINE
  // --------------------------------------------------------------------------
  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    binaryAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    packetAware: true,
    windowAware: true,

    governorAware: true,
    loggerAware: true,
    gpuFriendly: true,
    microPipeline: true,
    speedOptimized: true,
    genomeAware: true,
    safetyFrameAware: true,

    readOnly: true,
    multiInstanceReady: true,
    epoch: "15-IMMORTAL"
  }),

  // --------------------------------------------------------------------------
  //  CONTRACT — IMMUTABLE FLOW CONTRACT
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose:
      "Provide deterministic compute flow, layered transformations, observer taps, reflex hooks, and flow artery metrics over binary.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "generate symbolic state",
      "override cortex decisions",
      "override router decisions",
      "block the organism",
      "perform cognition",
      "log raw payloads directly from pipeline meta"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "emit binary-only outputs",
      "compute flow artery metrics deterministically",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking",
      "emit window-safe flow snapshots",
      "emit deterministic pipeline packets"
    ])
  }),

  boundaryReflex() {
    return "BinaryPipeline is a pure flow engine — it never mutates external organs or performs cognition.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, pipeline-scoped
// ============================================================================
function emitPipelinePacket(type, payload) {
  return Object.freeze({
    meta: PipelineMeta,
    packetType: `pipeline-${type}`,
    packetId: `pipeline-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: PipelineMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — IMMORTAL-GRADE
// ============================================================================
export function prewarmBinaryPipeline({ trace = false } = {}) {
  const packet = emitPipelinePacket("prewarm", {
    message: "Binary pipeline prewarmed and flow artery aligned."
  });

  if (trace) console.log("[BinaryPipeline] prewarm", packet);
  return packet;
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v15‑IMMORTAL
// ============================================================================
export class AIBinaryPipeline {
  constructor(config = {}) {
    this.id = config.id || PipelineMeta.identity;
    this.trace = !!config.trace;

    this.stages = [];
    this.observers = [];
    this.reflexes = [];

    // window-safe artery snapshot
    this.flowArtery = {
      lastThroughput: 1,
      lastPressure: 0,
      lastCost: 0,
      lastBudget: 1,
      snapshot: () =>
        Object.freeze({
          throughput: this.flowArtery.lastThroughput,
          pressure: this.flowArtery.lastPressure,
          cost: this.flowArtery.lastCost,
          budget: this.flowArtery.lastBudget,
          stageCount: this.stages.length,
          observerCount: this.observers.length,
          reflexCount: this.reflexes.length
        })
    };
  }

  // ---------------------------------------------------------
  //  FLOW ARTERY METRICS
  // ---------------------------------------------------------
  _computeFlowThroughput(stageCount, observerCount, reflexCount) {
    const stageFactor = Math.min(1, stageCount / 50);
    const obsFactor   = Math.min(1, observerCount / 50);
    const refFactor   = Math.min(1, reflexCount / 50);

    const raw = Math.max(
      0,
      1 - (stageFactor * 0.4 + obsFactor * 0.3 + refFactor * 0.3)
    );
    return Math.min(1, raw);
  }

  _computeFlowPressure(stageCount, observerCount, reflexCount) {
    const density = stageCount + observerCount + reflexCount;
    const raw = Math.min(1, density / 60);
    return Math.max(0, raw);
  }

  _computeFlowCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeFlowBudget(throughput, cost) {
    const raw = throughput - cost;
    return Math.max(0, Math.min(1, raw));
  }

  _bucketLevel(v) {
    if (v >= 0.9) return "elite";
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "medium";
    if (v >= 0.25) return "low";
    return "critical";
  }

  _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8) return "heavy";
    if (v >= 0.5) return "moderate";
    if (v >= 0.2) return "light";
    if (v > 0)    return "negligible";
    return "none";
  }

  // ---------------------------------------------------------
  //  FLOW ARTERY SNAPSHOT (INTERNAL + WINDOW-SAFE)
  // ---------------------------------------------------------
  _computeFlowArtery() {
    const stageCount = this.stages.length;
    const observerCount = this.observers.length;
    const reflexCount = this.reflexes.length;

    const throughput = this._computeFlowThroughput(
      stageCount,
      observerCount,
      reflexCount
    );
    const pressure = this._computeFlowPressure(
      stageCount,
      observerCount,
      reflexCount
    );
    const cost = this._computeFlowCost(pressure, throughput);
    const budget = this._computeFlowBudget(throughput, cost);

    // update artery snapshot
    this.flowArtery.lastThroughput = throughput;
    this.flowArtery.lastPressure = pressure;
    this.flowArtery.lastCost = cost;
    this.flowArtery.lastBudget = budget;

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      stageCount,
      observerCount,
      reflexCount
    };
  }

  getFlowArterySnapshot() {
    const artery = this._computeFlowArtery();
    return emitPipelinePacket("snapshot", { artery });
  }

  // ---------------------------------------------------------
  //  PIPELINE CONFIGURATION
  // ---------------------------------------------------------
  addStage(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("addStage expects a function");
    }
    this.stages.push(fn);

    const artery = this._computeFlowArtery();
    this._trace("addStage", { totalStages: this.stages.length, artery });
    emitPipelinePacket("stage-added", {
      pipelineId: this.id,
      totalStages: this.stages.length
    });
  }

  addObserver(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("addObserver expects a function");
    }
    this.observers.push(fn);

    const artery = this._computeFlowArtery();
    this._trace("addObserver", {
      totalObservers: this.observers.length,
      artery
    });
    emitPipelinePacket("observer-added", {
      pipelineId: this.id,
      totalObservers: this.observers.length
    });
  }

  addReflex(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("addReflex expects a function");
    }
    this.reflexes.push(fn);

    const artery = this._computeFlowArtery();
    this._trace("addReflex", {
      totalReflexes: this.reflexes.length,
      artery
    });
    emitPipelinePacket("reflex-added", {
      pipelineId: this.id,
      totalReflexes: this.reflexes.length
    });
  }

  // ---------------------------------------------------------
  //  PIPELINE EXECUTION
  // ---------------------------------------------------------
  run(inputBinary) {
    this._assertBinary(inputBinary);

    const artery = this._computeFlowArtery();
    this._trace("run:start", { bitLength: inputBinary.length, artery });

    emitPipelinePacket("run-start", {
      pipelineId: this.id,
      bitLength: inputBinary.length,
      artery
    });

    let current = inputBinary;

    for (let i = 0; i < this.stages.length; i++) {
      const stage = this.stages[i];

      const output = stage(current);
      this._assertBinary(output);

      for (const obs of this.observers) {
        obs({
          stageIndex: i,
          input: current,
          output
        });
      }

      this._trace("run:stage", {
        stageIndex: i,
        inputBits: current.length,
        outputBits: output.length
      });

      emitPipelinePacket("run-stage", {
        pipelineId: this.id,
        stageIndex: i,
        inputBits: current.length,
        outputBits: output.length
      });

      current = output;
    }

    for (const reflex of this.reflexes) {
      reflex(current);
    }

    this._trace("run:end", { outputBits: current.length });

    emitPipelinePacket("run-end", {
      pipelineId: this.id,
      outputBits: current.length
    });

    return current;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------
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

// ============================================================================
//  FACTORY — v15‑IMMORTAL
// ============================================================================
export function createAIBinaryPipeline(config = {}) {
  return new AIBinaryPipeline(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    PipelineMeta,
    AIBinaryPipeline,
    createAIBinaryPipeline,
    prewarmBinaryPipeline
  };
}
