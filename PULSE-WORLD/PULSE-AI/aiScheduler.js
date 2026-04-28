/**
 * aiScheduler.js — Pulse OS v12.3‑EVO+ Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Binary Scheduler of Pulse OS.
 *
 *   Schedules:
 *     - binary tasks
 *     - binary pulses
 *     - binary jobs
 *     - binary reflex triggers
 *
 *   Provides:
 *     - temporal throughput
 *     - temporal pressure
 *     - temporal cost
 *     - temporal budget
 *     - descriptive buckets
 *     - task-density temporal arteries v3
 *     - multi-instance harmony + soft spiral warnings (non-blocking)
 *     - task-level prewarm + binary chunk awareness
 */

export const SchedulerMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "BINARY_SCHEDULER_ORGAN",
  version: "12.3-EVO+",
  identity: "aiBinaryScheduler-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    temporalAware: true,
    arteryAware: true,
    reflexAware: true,
    pipelineAware: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic binary scheduling of tasks, pulses, jobs, and reflex triggers with temporal artery metrics v3.",

    never: Object.freeze([
      "introduce randomness",
      "mutate external organs",
      "override pipeline decisions",
      "override reflex decisions",
      "block the organism",
      "generate symbolic state",
      "perform cognition"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "emit binary-only outputs",
      "compute temporal artery metrics v3",
      "maintain deterministic tick timing",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

// ============================================================================
//  ARTERY HELPERS — v3 (PURE, STATELESS)
// ============================================================================

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================================

export class AIBinaryScheduler {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-scheduler";
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIBinaryScheduler requires aiBinaryAgent encoder");
    }

    this.tasks = new Map();

    this._timer = null;
    this._tickInterval = config.tickInterval || 250; // deterministic tick

    // temporal window for artery v3
    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowExecutions = 0;
    this._windowTightExecutions = 0;
    this._totalExecutions = 0;

    // chunk + prewarm configuration
    this._chunkSize =
      typeof config.chunkSize === "number" && config.chunkSize > 0
        ? config.chunkSize
        : 4096;
    this._autoPrewarm = !!config.autoPrewarm;

    // multi-instance identity
    this.instanceIndex = AIBinaryScheduler._registerInstance();
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------

  static _registerInstance() {
    if (typeof AIBinaryScheduler._instanceCount !== "number") {
      AIBinaryScheduler._instanceCount = 0;
    }
    const index = AIBinaryScheduler._instanceCount;
    AIBinaryScheduler._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AIBinaryScheduler._instanceCount === "number"
      ? AIBinaryScheduler._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  WINDOW ROLLING
  // ---------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowExecutions = 0;
      this._windowTightExecutions = 0;
    }
  }

  // ---------------------------------------------------------
  //  BINARY CHUNKING (PAYLOAD-LEVEL, PURE BINARY)
// ---------------------------------------------------------

  _chunkBinary(binary) {
    if (typeof binary !== "string") return [];
    const size = this._chunkSize;
    const chunks = [];
    for (let i = 0; i < binary.length; i += size) {
      chunks.push(binary.slice(i, i + size));
    }
    return chunks;
  }

  // ---------------------------------------------------------
  //  TEMPORAL ARTERY SNAPSHOT v3
  // ---------------------------------------------------------

  _computeTemporalArtery() {
    const tasks = Array.from(this.tasks.values());
    const taskCount = tasks.length;

    let totalInterval = 0;
    let tightIntervals = 0;

    for (const t of tasks) {
      totalInterval += t.intervalMs;
      if (t.intervalMs < 500) tightIntervals++;
    }

    const avgInterval = taskCount > 0 ? totalInterval / taskCount : 0;

    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const execRatePerMs = this._windowExecutions / elapsedMs;
    const execRatePerSec = execRatePerMs * 1000;

    const instanceCount = AIBinaryScheduler.getInstanceCount();
    const harmonicLoad =
      instanceCount > 0 ? execRatePerSec / instanceCount : execRatePerSec;

    const taskDensity = Math.min(1, taskCount / 64);
    const intervalFactor =
      avgInterval > 0 ? Math.min(1, 1000 / avgInterval) : 0;
    const loadFactor = Math.min(1, harmonicLoad / 128);

    const pressureBase = Math.max(
      0,
      Math.min(1, (taskDensity + intervalFactor + loadFactor) / 3)
    );
    const pressure = pressureBase;

    const throughputBase = Math.max(0, 1 - pressure);
    const throughput = Math.max(0, Math.min(1, throughputBase));

    const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const artery = {
      instanceIndex: this.instanceIndex,
      instanceCount,

      taskCount,
      avgInterval,
      tightIntervals,

      windowMs: this.windowMs,
      windowExecutions: this._windowExecutions,
      windowTightExecutions: this._windowTightExecutions,
      totalExecutions: this._totalExecutions,
      execRatePerSec,
      harmonicLoad,

      throughput,
      pressure,
      cost,
      budget,

      throughputBucket: bucketLevel(throughput),
      pressureBucket: bucketPressure(pressure),
      costBucket: bucketCost(cost),
      budgetBucket: bucketLevel(budget)
    };

    return artery;
  }

  getTemporalArtery() {
    return this._computeTemporalArtery();
  }

  // ---------------------------------------------------------
  //  TASK REGISTRATION
  // ---------------------------------------------------------

  scheduleTask({ id, intervalMs, payload, action }) {
    if (!id || typeof id !== "string") {
      throw new Error("scheduleTask requires an id");
    }
    if (typeof intervalMs !== "number" || intervalMs <= 0) {
      throw new Error("scheduleTask requires a positive intervalMs");
    }
    if (typeof action !== "function") {
      throw new Error("scheduleTask requires an action function");
    }

    const binaryPayload = this.encoder.encode(payload);
    const chunks = this._chunkBinary(binaryPayload);

    const task = {
      id,
      intervalMs,
      nextRun: Date.now() + intervalMs,
      binaryPayload,
      chunks,
      prewarmed: false,
      action
    };

    this.tasks.set(id, task);

    if (this._autoPrewarm) {
      this.prewarmTask(id);
    }

    const artery = this._computeTemporalArtery();
    this._trace("task:scheduled", {
      id,
      intervalMs,
      payloadBits: binaryPayload.length,
      chunkCount: task.chunks.length,
      artery
    });

    return task;
  }

  cancelTask(id) {
    const existed = this.tasks.delete(id);
    const artery = this._computeTemporalArtery();
    this._trace("task:cancelled", { id, existed, artery });
  }

  // ---------------------------------------------------------
  //  PREWARM + TASK SNAPSHOTS
  // ---------------------------------------------------------

  prewarmTask(id) {
    const task = this.tasks.get(id);
    if (!task) return null;

    if (!task.chunks || task.chunks.length === 0) {
      task.chunks = this._chunkBinary(task.binaryPayload);
    }

    task.prewarmed = true;

    const artery = this._computeTemporalArtery();
    this._trace("task:prewarm", {
      id: task.id,
      payloadBits: task.binaryPayload.length,
      chunkCount: task.chunks.length,
      artery
    });

    return task;
  }

  prewarmAllTasks() {
    const results = [];
    for (const id of this.tasks.keys()) {
      const t = this.prewarmTask(id);
      if (t) results.push(t);
    }
    return results;
  }

  getTaskSnapshot(id) {
    const task = this.tasks.get(id);
    if (!task) return null;

    return Object.freeze({
      id: task.id,
      intervalMs: task.intervalMs,
      payloadBits: task.binaryPayload.length,
      chunkCount: task.chunks ? task.chunks.length : 0,
      prewarmed: !!task.prewarmed
    });
  }

  // ---------------------------------------------------------
  //  SCHEDULER LOOP
  // ---------------------------------------------------------

  start() {
    if (this._timer) return;

    this._timer = setInterval(() => {
      this._tick();
    }, this._tickInterval);

    const artery = this._computeTemporalArtery();
    this._trace("scheduler:start", {
      tickInterval: this._tickInterval,
      artery
    });
  }

  stop() {
    if (!this._timer) return;

    clearInterval(this._timer);
    this._timer = null;

    const artery = this._computeTemporalArtery();
    this._trace("scheduler:stop", { artery });
  }

  // ---------------------------------------------------------
  //  TICK EXECUTION
  // ---------------------------------------------------------

  _tick() {
    const now = Date.now();

    for (const task of this.tasks.values()) {
      if (now >= task.nextRun) {
        this._executeTask(task, now);
        task.nextRun = now + task.intervalMs;
      }
    }
  }

  _executeTask(task, now) {
    const output = task.action(task.binaryPayload);

    this._assertBinary(output);

    this._rollWindow(now);
    this._totalExecutions += 1;
    this._windowExecutions += 1;
    if (task.intervalMs < 500) this._windowTightExecutions += 1;

    const artery = this._computeTemporalArtery();

    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      this._trace("scheduler:spiral-warning", {
        id: task.id,
        pressure: artery.pressure,
        pressureBucket: artery.pressureBucket,
        budget: artery.budget,
        budgetBucket: artery.budgetBucket
      });
    }

    this._trace("task:executed", {
      id: task.id,
      outputBits: output.length,
      artery
    });

    if (this.pipeline) this.pipeline.run(output);
    if (this.reflex) this.reflex.run(output);
    if (this.logger && typeof this.logger.logBinary === "function") {
      this.logger.logBinary(output, { source: "scheduler", taskId: task.id });
    }
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
    console.log(
      `[${this.id}#${this.instanceIndex}] ${event}`,
      payload
    );
  }
}

// ============================================================================
//  FACTORY — v12.3‑EVO+
// ============================================================================

export function createAIBinaryScheduler(config) {
  return new AIBinaryScheduler(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    SchedulerMeta,
    AIBinaryScheduler,
    createAIBinaryScheduler
  };
}
