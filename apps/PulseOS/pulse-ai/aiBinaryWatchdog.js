/**
 * aiBinaryWatchdog.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Watchdog** of the organism.
 *
 *   It monitors:
 *     - heartbeat pulses
 *     - pipeline activity
 *     - reflex activity
 *     - scheduler ticks
 *     - binary liveness
 *
 *   It detects:
 *     - stalls
 *     - freezes
 *     - missing pulses
 *     - reflex failures
 *     - pipeline deadlocks
 *     - timing drift
 *
 *   It emits:
 *     - binary watchdog alerts
 *     - binary anomaly packets
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today has:
 *     - no reflex failure detection
 *     - no pipeline stall detection
 *     - no heartbeat gap detection
 *     - no binary anomaly alerts
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST NEVER GO SILENT.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a scheduler
 *     - a heartbeat
 *     - a logger
 *     - a governor
 *
 *   This organ IS:
 *     - a binary watchdog
 *     - a liveness enforcer
 *     - a stall detector
 *     - an anomaly generator
 *
 * WATCHDOG MODEL:
 *   A watchdog alert is:
 *
 *     {
 *       type: "binary-watchdog-alert",
 *       timestamp: <ms>,
 *       anomaly: <string>,
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   All alerts are encoded into binary.
 */

class AIBinaryWatchdog {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id          → for ProofLogger / CNS attendance
     *   encoder     → aiBinaryAgent instance (required)
     *   heartbeat   → aiBinaryHeartbeat instance (optional)
     *   pipeline    → aiBinaryPipeline instance (optional)
     *   reflex      → aiBinaryReflex instance (optional)
     *   scheduler   → aiBinaryScheduler instance (optional)
     *   logger      → aiBinaryLoggerAdapter instance (optional)
     *   intervalMs  → watchdog check interval (default: 500ms)
     *   timeoutMs   → max allowed silence before alert (default: 2000ms)
     *   trace       → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-watchdog';
    this.encoder = config.encoder;
    this.heartbeat = config.heartbeat || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.scheduler = config.scheduler || null;
    this.logger = config.logger || null;
    this.intervalMs = config.intervalMs || 500;
    this.timeoutMs = config.timeoutMs || 2000;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryWatchdog requires aiBinaryAgent encoder');

    this._timer = null;

    // Liveness timestamps
    this.lastHeartbeat = Date.now();
    this.lastPipelineActivity = Date.now();
    this.lastReflexActivity = Date.now();
    this.lastSchedulerTick = Date.now();

    // Attach observers if available
    this._attachObservers();
  }

  // ---------------------------------------------------------
  //  OBSERVER ATTACHMENT
  // ---------------------------------------------------------

  _attachObservers() {
    if (this.pipeline) {
      this.pipeline.addObserver(() => {
        this.lastPipelineActivity = Date.now();
      });
    }

    if (this.reflex) {
      const originalRun = this.reflex.run.bind(this.reflex);
      this.reflex.run = (binary) => {
        this.lastReflexActivity = Date.now();
        return originalRun(binary);
      };
    }

    if (this.heartbeat) {
      const originalEmit = this.heartbeat._emitPulse.bind(this.heartbeat);
      this.heartbeat._emitPulse = () => {
        this.lastHeartbeat = Date.now();
        return originalEmit();
      };
    }

    if (this.scheduler) {
      const originalTick = this.scheduler._tick.bind(this.scheduler);
      this.scheduler._tick = () => {
        this.lastSchedulerTick = Date.now();
        return originalTick();
      };
    }
  }

  // ---------------------------------------------------------
  //  WATCHDOG ALERT GENERATION
  // ---------------------------------------------------------

  _generateAlert(anomaly) {
    const payload = {
      type: 'binary-watchdog-alert',
      timestamp: Date.now(),
      anomaly,
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('alert:generated', packet);

    return packet;
  }

  _emitAlert(anomaly) {
    const alert = this._generateAlert(anomaly);

    if (this.pipeline) {
      this.pipeline.run(alert.bits);
    }

    if (this.reflex) {
      this.reflex.run(alert.bits);
    }

    if (this.logger) {
      this.logger.logBinary(alert.bits, { source: 'watchdog', anomaly });
    }

    this._trace('alert:emitted', { anomaly });

    return alert;
  }

  // ---------------------------------------------------------
  //  WATCHDOG CHECKS
  // ---------------------------------------------------------

  _check() {
    const now = Date.now();

    if (now - this.lastHeartbeat > this.timeoutMs) {
      this._emitAlert('heartbeat-missing');
      this.lastHeartbeat = now;
    }

    if (now - this.lastPipelineActivity > this.timeoutMs) {
      this._emitAlert('pipeline-stall');
      this.lastPipelineActivity = now;
    }

    if (now - this.lastReflexActivity > this.timeoutMs) {
      this._emitAlert('reflex-silence');
      this.lastReflexActivity = now;
    }

    if (now - this.lastSchedulerTick > this.timeoutMs) {
      this._emitAlert('scheduler-drift');
      this.lastSchedulerTick = now;
    }
  }

  // ---------------------------------------------------------
  //  WATCHDOG CONTROL
  // ---------------------------------------------------------

  start() {
    if (this._timer) return;

    this._timer = setInterval(() => {
      this._check();
    }, this.intervalMs);

    this._trace('watchdog:start', { intervalMs: this.intervalMs });
  }

  stop() {
    if (!this._timer) return;

    clearInterval(this._timer);
    this._timer = null;

    this._trace('watchdog:stop', {});
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIBinaryWatchdog(config) {
  return new AIBinaryWatchdog(config);
}

module.exports = {
  AIBinaryWatchdog,
  createAIBinaryWatchdog,
};
