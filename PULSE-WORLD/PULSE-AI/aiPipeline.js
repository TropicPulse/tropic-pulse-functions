/**
 * aiPipeline.js — Pulse OS v11.2‑EVO+ Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Compute Pipeline** of Pulse OS (dualband).
 *
 *   It defines:
 *     • compute flow
 *     • layered transformations
 *     • observer taps
 *     • reflex hooks
 *     • flow arteries (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • compute bloodstream
 *     • deterministic flow engine
 *     • reflex chain executor
 *
 *   v11.2‑EVO+ UPGRADE:
 *     • Dual‑mode exports (ESM + CommonJS)
 *     • Canonical v11.2‑EVO+ meta + epoch
 *     • Explicit artery snapshot exposure
 */

// ---------------------------------------------------------
//  META BLOCK — v11.2‑EVO+ (DUALBAND)
// ---------------------------------------------------------

export const PipelineMeta = Object.freeze({
  layer: "OrganismFlow",
  role: "PIPELINE_ORGAN",
  version: "11.2-EVO",
  identity: "aiPipeline-v11.2-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic compute flow, layered transformations, observer taps, reflex hooks, and flow artery metrics.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "generate symbolic state",
      "override cortex decisions",
      "override router decisions",
      "block the organism",
      "perform cognition"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "emit binary-only outputs",
      "compute flow artery metrics",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v11.2‑EVO+ (LOGIC PRESERVED)
// ---------------------------------------------------------

export class AIBinaryPipeline {
  constructor(config = {}) {
    this.id = config.id || "pipeline";
    this.trace = !!config.trace;

    this.stages = [];
    this.observers = [];
    this.reflexes = [];
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
  //  FLOW ARTERY SNAPSHOT (EXPOSED FOR METRICS)
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
    return this._computeFlowArtery();
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
  }

  // ---------------------------------------------------------
  //  PIPELINE EXECUTION
  // ---------------------------------------------------------

  run(inputBinary) {
    this._assertBinary(inputBinary);

    const artery = this._computeFlowArtery();
    this._trace("run:start", { inputBinary, artery });

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
        input: current,
        output
      });

      current = output;
    }

    for (const reflex of this.reflexes) {
      reflex(current);
    }

    this._trace("run:end", { outputBinary: current });
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

// ---------------------------------------------------------
//  FACTORY — v11.2‑EVO+
// ---------------------------------------------------------

export function createAIBinaryPipeline(config = {}) {
  return new AIBinaryPipeline(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    PipelineMeta,
    AIBinaryPipeline,
    createAIBinaryPipeline
  };
}
