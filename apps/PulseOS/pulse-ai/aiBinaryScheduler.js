/**
 * aiBinaryScheduler.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Scheduler** of Pulse OS.
 *
 *   It schedules:
 *     - binary tasks
 *     - binary pulses
 *     - binary jobs
 *     - binary reflex triggers
 *
 *   It now includes:
 *     - binary temporal throughput
 *     - binary temporal pressure
 *     - binary temporal cost
 *     - binary temporal budget
 *     - descriptive buckets
 *     - task-density temporal arteries
 */

class AIBinaryScheduler {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-scheduler';
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryScheduler requires aiBinaryAgent encoder');
    }

    this.tasks = new Map();

    this._timer = null;
    this._tickInterval = config.tickInterval || 250; // deterministic tick
  }

  // ---------------------------------------------------------
  //  BINARY TEMPORAL ARTERY METRICS
  // ---------------------------------------------------------

  _computeTemporalThroughput(taskCount, avgInterval) {
    const countFactor = Math.min(1, taskCount / 50);
    const intervalFactor = Math.min(1, 1000 / (avgInterval || 1));
    const raw = Math.max(0, 1 - (countFactor * 0.5 + intervalFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeTemporalPressure(taskCount, tightIntervals) {
    const density = taskCount + tightIntervals;
    const raw = Math.min(1, density / 50);
    return Math.max(0, raw);
  }

  _computeTemporalCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeTemporalBudget(throughput, cost) {
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
  //  TEMPORAL ARTERY SNAPSHOT
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

    const throughput = this._computeTemporalThroughput(taskCount, avgInterval);
    const pressure   = this._computeTemporalPressure(taskCount, tightIntervals);
    const cost       = this._computeTemporalCost(pressure, throughput);
    const budget     = this._computeTemporalBudget(throughput, cost);

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      taskCount,
      avgInterval,
      tightIntervals
    };
  }

  // ---------------------------------------------------------
  //  TASK REGISTRATION
  // ---------------------------------------------------------

  scheduleTask({ id, intervalMs, payload, action }) {
    if (!id || typeof id !== 'string') {
      throw new Error('scheduleTask requires an id');
    }
    if (typeof intervalMs !== 'number' || intervalMs <= 0) {
      throw new Error('scheduleTask requires a positive intervalMs');
    }
    if (typeof action !== 'function') {
      throw new Error('scheduleTask requires an action function');
    }

    const binaryPayload = this.encoder.encode(payload);

    const task = {
      id,
      intervalMs,
      nextRun: Date.now() + intervalMs,
      binaryPayload,
      action,
    };

    this.tasks.set(id, task);

    const artery = this._computeTemporalArtery();
    this._trace('task:scheduled', {
      id,
      intervalMs,
      payloadBits: binaryPayload.length,
      artery
    });

    return task;
  }

  cancelTask(id) {
    const existed = this.tasks.delete(id);
    const artery = this._computeTemporalArtery();
    this._trace('task:cancelled', { id, existed, artery });
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
    this._trace('scheduler:start', { tickInterval: this._tickInterval, artery });
  }

  stop() {
    if (!this._timer) return;

    clearInterval(this._timer);
    this._timer = null;

    const artery = this._computeTemporalArtery();
    this._trace('scheduler:stop', { artery });
  }

  // ---------------------------------------------------------
  //  TICK EXECUTION
  // ---------------------------------------------------------

  _tick() {
    const now = Date.now();

    for (const task of this.tasks.values()) {
      if (now >= task.nextRun) {
        this._executeTask(task);
        task.nextRun = now + task.intervalMs;
      }
    }
  }

  _executeTask(task) {
    const output = task.action(task.binaryPayload);

    this._assertBinary(output);

    const artery = this._computeTemporalArtery();
    this._trace('task:executed', {
      id: task.id,
      outputBits: output.length,
      artery
    });

    if (this.pipeline) this.pipeline.run(output);
    if (this.reflex) this.reflex.run(output);
    if (this.logger) this.logger.logBinary(output, { source: 'scheduler', taskId: task.id });
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

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

function createAIBinaryScheduler(config) {
  return new AIBinaryScheduler(config);
}

module.exports = {
  AIBinaryScheduler,
  createAIBinaryScheduler,
};
