/**
 * aiReflex.js — Pulse OS v11.2‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Reflex Engine** of Pulse OS (dualband).
 *
 *   It defines:
 *     • reflex rules
 *     • reflex triggers
 *     • reflex actions
 *     • reflex arteries (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • CNS lightning arc
 *     • instant reaction layer
 *     • deterministic reflex engine
 *
 *  v11.2‑EVO UPGRADE:
 *    • Dual‑mode exports (ESM + CommonJS)
 *    • Fully dualband‑declared meta
 *    • Drift‑proof, deterministic reflex artery metrics
 */

// ---------------------------------------------------------
//  META BLOCK — v11.2‑EVO (DUALBAND)
// ---------------------------------------------------------

export const ReflexMeta = Object.freeze({
  layer: "OrganismReflex",
  role: "REFLEX_ENGINE",
  version: "11.2-EVO",
  identity: "aiReflex-v11.2-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    reflexAware: true,
    arteryAware: true,
    pipelineAware: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic reflex triggers, actions, and reflex artery metrics for the v11.2‑EVO organism.",

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
      "emit binary-only reflex outputs",
      "compute reflex artery metrics",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (LOGIC UNCHANGED)
// ---------------------------------------------------------

export class AIBinaryReflex {
  constructor(config = {}) {
    this.id = config.id || "reflex";
    this.trace = !!config.trace;

    this.reflexes = [];
  }

  // ---------------------------------------------------------
  //  REFLEX ARTERY METRICS
  // ---------------------------------------------------------

  _computeReflexThroughput(reflexCount, avgTriggerCost) {
    const countFactor = Math.min(1, reflexCount / 50);
    const costFactor = Math.min(1, avgTriggerCost / 64);
    const raw = Math.max(0, 1 - (countFactor * 0.5 + costFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeReflexPressure(reflexCount, tightTriggers) {
    const density = reflexCount + tightTriggers;
    const raw = Math.min(1, density / 40);
    return Math.max(0, raw);
  }

  _computeReflexCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeReflexBudget(throughput, cost) {
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
    if (v > 0) return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8) return "heavy";
    if (v >= 0.5) return "moderate";
    if (v >= 0.2) return "light";
    if (v > 0) return "negligible";
    return "none";
  }

  // ---------------------------------------------------------
  //  REFLEX ARTERY SNAPSHOT
  // ---------------------------------------------------------

  _computeReflexArtery() {
    const reflexCount = this.reflexes.length;

    let totalTriggerCost = 0;
    let tightTriggers = 0;

    for (const r of this.reflexes) {
      const cost = r.trigger.length || 1;
      totalTriggerCost += cost;
      if (cost < 32) tightTriggers++;
    }

    const avgTriggerCost = reflexCount > 0 ? totalTriggerCost / reflexCount : 0;

    const throughput = this._computeReflexThroughput(
      reflexCount,
      avgTriggerCost
    );
    const pressure = this._computeReflexPressure(reflexCount, tightTriggers);
    const cost = this._computeReflexCost(pressure, throughput);
    const budget = this._computeReflexBudget(throughput, cost);

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      reflexCount,
      avgTriggerCost,
      tightTriggers
    };
  }

  // ---------------------------------------------------------
  //  REFLEX CONFIGURATION
  // ---------------------------------------------------------

  addReflex(triggerFn, actionFn) {
    if (typeof triggerFn !== "function") {
      throw new TypeError("addReflex: trigger must be a function");
    }
    if (typeof actionFn !== "function") {
      throw new TypeError("addReflex: action must be a function");
    }

    this.reflexes.push({ trigger: triggerFn, action: actionFn });

    const artery = this._computeReflexArtery();
    this._trace("addReflex", { totalReflexes: this.reflexes.length, artery });
  }

  // ---------------------------------------------------------
  //  REFLEX EXECUTION
  // ---------------------------------------------------------

  run(binaryInput) {
    this._assertBinary(binaryInput);

    const artery = this._computeReflexArtery();
    this._trace("run:start", { binaryInput, artery });

    for (let i = 0; i < this.reflexes.length; i++) {
      const { trigger, action } = this.reflexes[i];

      const shouldFire = trigger(binaryInput);
      this._trace("run:triggerCheck", { index: i, shouldFire });

      if (shouldFire) {
        const output = action(binaryInput);
        this._assertBinary(output);

        const artery = this._computeReflexArtery();
        this._trace("run:reflexFired", {
          index: i,
          input: binaryInput,
          output,
          artery
        });

        return output;
      }
    }

    this._trace("run:noReflexFired", { binaryInput });
    return null;
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
//  FACTORY — v11.2‑EVO STYLE
// ---------------------------------------------------------

export function createAIBinaryReflex(config) {
  return new AIBinaryReflex(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    ReflexMeta,
    AIBinaryReflex,
    createAIBinaryReflex
  };
}
