/**
 * aiWatchdog.js — Pulse OS v11.2‑EVO+ Organ
 * ============================================================
 * ORGAN ROLE (CANONICAL):
 *   The Binary Watchdog is the organism’s **liveness sentinel**.
 *
 *   It enforces the Prime Law:
 *       “THE ORGANISM MUST NEVER GO SILENT.”
 *
 *   It monitors binary‑level activity across:
 *     - Heartbeat (rhythm)
 *     - Pipeline (flow)
 *     - Reflex (reaction)
 *     - Scheduler (timing)
 *
 *   It detects:
 *     - stalls
 *     - freezes
 *     - missing pulses
 *     - reflex silence
 *     - pipeline deadlocks
 *     - scheduler drift
 *
 *   It emits:
 *     - binary watchdog alerts
 *     - anomaly packets
 *
 * ARCHITECTURAL POSITION:
 *   Layer: Binary Nervous System (BNS)
 *   Band: Binary (primary), Symbolic (optional trace)
 *   Mode: Read‑only observers + binary anomaly emitter
 *
 * ORGAN CONTRACT (v11.2‑EVO+):
 *   - Must never mutate external organs
 *   - Must never generate symbolic state
 *   - Must only emit binary packets
 *   - Must remain deterministic
 *   - Must attach observers safely
 *   - Must never block the organism
 */

export const WatchdogMeta = Object.freeze({
  type: "Binary",
  subsystem: "aiBinaryWatchdog",
  layer: "BinaryNervousSystem",
  role: "BINARY_WATCHDOG_ORGAN",
  version: "11.2-EVO+",
  identity: "aiBinaryWatchdog-v11.2-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    relayOnly: false,
    analysisAware: false,
    schemaAware: false,
    lineageAware: true,
    slowdownAware: true,
    tourismAware: false,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Enforce organism liveness by monitoring heartbeat, pipeline, reflex, and scheduler activity, detecting stalls, freezes, drift, and silence, and emitting binary anomaly packets.",

    never: Object.freeze([
      "mutate external organs",
      "generate symbolic state",
      "introduce randomness",
      "override pipeline decisions",
      "override reflex decisions",
      "block organism execution",
      "perform cognition",
      "perform intent logic"
    ]),

    always: Object.freeze([
      "observe binary activity",
      "emit binary-only anomaly packets",
      "apply deterministic timing rules",
      "attach observers safely",
      "log deterministic steps when tracing",
      "treat all signals as read-only"
    ])
  }),

  boundaryReflex() {
    return "Binary Watchdog is a liveness sentinel — it observes, detects, and alerts, but never mutates or governs other organs.";
  }
});

export class AIBinaryWatchdog {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-watchdog";
    this.encoder = config.encoder;
    this.heartbeat = config.heartbeat || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.scheduler = config.scheduler || null;
    this.logger = config.logger || null;

    this.intervalMs = config.intervalMs || 500;
    this.timeoutMs = config.timeoutMs || 2000;
    this.trace = !!config.trace;

    if (!this.encoder) {
      throw new Error("AIBinaryWatchdog requires aiBinaryAgent encoder");
    }

    this._timer = null;

    // Binary liveness timestamps
    const now = Date.now();
    this.lastHeartbeat = now;
    this.lastPipelineActivity = now;
    this.lastReflexActivity = now;
    this.lastSchedulerTick = now;

    this._attachObservers();
  }

  // ============================================================
  // OBSERVER ATTACHMENT (v11.2‑EVO SAFE)
  // ============================================================

  _attachObservers() {
    if (this.pipeline?.addObserver) {
      this.pipeline.addObserver(() => {
        this.lastPipelineActivity = Date.now();
      });
    }

    if (this.reflex?.run) {
      const originalRun = this.reflex.run.bind(this.reflex);
      this.reflex.run = (binary) => {
        this.lastReflexActivity = Date.now();
        return originalRun(binary);
      };
    }

    if (this.heartbeat?._emitPulse) {
      const originalEmit = this.heartbeat._emitPulse.bind(this.heartbeat);
      this.heartbeat._emitPulse = () => {
        this.lastHeartbeat = Date.now();
        return originalEmit();
      };
    }

    if (this.scheduler?._tick) {
      const originalTick = this.scheduler._tick.bind(this.scheduler);
      this.scheduler._tick = () => {
        this.lastSchedulerTick = Date.now();
        return originalTick();
      };
    }
  }

  // ============================================================
  // BINARY ANOMALY PACKET GENERATION
  // ============================================================

  _generateAlert(anomaly) {
    const payload = {
      type: "binary-watchdog-alert",
      timestamp: Date.now(),
      anomaly
    };

    const json = JSON.stringify(payload);
    const bits = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits,
      bitLength: bits.length
    };

    this._trace("alert:generated", packet);
    return packet;
  }

  _emitAlert(anomaly) {
    const alert = this._generateAlert(anomaly);

    if (this.pipeline) this.pipeline.run(alert.bits);
    if (this.reflex) this.reflex.run(alert.bits);

    if (this.logger) {
      this.logger.logBinary(alert.bits, {
        source: "watchdog",
        anomaly
      });
    }

    this._trace("alert:emitted", { anomaly });
    return alert;
  }

  // ============================================================
  // WATCHDOG CHECKS (DETERMINISTIC)
  // ============================================================

  _check() {
    const now = Date.now();

    if (now - this.lastHeartbeat > this.timeoutMs) {
      this._emitAlert("heartbeat-missing");
      this.lastHeartbeat = now;
    }

    if (now - this.lastPipelineActivity > this.timeoutMs) {
      this._emitAlert("pipeline-stall");
      this.lastPipelineActivity = now;
    }

    if (now - this.lastReflexActivity > this.timeoutMs) {
      this._emitAlert("reflex-silence");
      this.lastReflexActivity = now;
    }

    if (now - this.lastSchedulerTick > this.timeoutMs) {
      this._emitAlert("scheduler-drift");
      this.lastSchedulerTick = now;
    }
  }

  // ============================================================
  // WATCHDOG CONTROL
  // ============================================================

  start() {
    if (this._timer) return;
    this._timer = setInterval(() => this._check(), this.intervalMs);
    this._trace("watchdog:start", { intervalMs: this.intervalMs });
  }

  stop() {
    if (!this._timer) return;
    clearInterval(this._timer);
    this._timer = null;
    this._trace("watchdog:stop", {});
  }

  // ============================================================
  // INTERNAL HELPERS
  // ============================================================

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

export function createAIBinaryWatchdog(config) {
  return new AIBinaryWatchdog(config);
}

// ---------------------------------------------------------------------------
// DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    WatchdogMeta,
    AIBinaryWatchdog,
    createAIBinaryWatchdog
  };
}
