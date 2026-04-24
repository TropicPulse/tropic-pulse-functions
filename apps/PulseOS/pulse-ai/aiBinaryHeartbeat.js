/**
 * aiBinaryHeartbeat.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Heartbeat** of the organism.
 *
 *   It emits:
 *     - binary pulses
 *     - liveness signals
 *     - organism health ticks
 *
 *   It keeps the organism:
 *     - warm
 *     - synchronized
 *     - drift-free
 *     - reactive
 *     - alive
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today uses:
 *     - timers
 *     - intervals
 *     - event loops
 *     - async churn
 *
 *   These create:
 *     • nondeterminism
 *     • drift
 *     • race conditions
 *     • unpredictable ordering
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE HEARTBEAT MUST BE DETERMINISTIC AND BINARY.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a scheduler
 *     - a timer
 *     - a loop
 *     - a router
 *
 *   This organ IS:
 *     - a binary pulse generator
 *     - a liveness signal
 *     - a health indicator
 *     - a reflex trigger
 *
 * HEARTBEAT MODEL:
 *   A heartbeat is a binary packet:
 *
 *     {
 *       type: "binary-heartbeat",
 *       timestamp: <ms>,
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   The heartbeat is:
 *     - encoded by aiBinaryAgent
 *     - optionally fed into pipeline
 *     - optionally fed into reflex
 *     - optionally logged
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - binary health scoring
 *     - binary anomaly detection
 *     - binary rhythm adaptation
 *     - multi-heartbeat organisms
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

class AIBinaryHeartbeat {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id         → for ProofLogger / CNS attendance
     *   encoder    → aiBinaryAgent instance (required)
     *   pipeline   → aiBinaryPipeline instance (optional)
     *   reflex     → aiBinaryReflex instance (optional)
     *   logger     → aiBinaryLoggerAdapter instance (optional)
     *   intervalMs → heartbeat interval (default: 1000ms)
     *   trace      → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-heartbeat';
    this.encoder = config.encoder;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.intervalMs = config.intervalMs || 1000;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryHeartbeat requires aiBinaryAgent encoder');
    }

    this._timer = null;
  }

  // ---------------------------------------------------------
  //  HEARTBEAT GENERATION
  // ---------------------------------------------------------

  /**
   * _generatePulse()
   * ----------------
   * Creates a binary heartbeat packet.
   */
  _generatePulse() {
    const payload = {
      type: 'binary-heartbeat',
      timestamp: Date.now(),
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('pulse:generated', packet);

    return packet;
  }

  // ---------------------------------------------------------
  //  HEARTBEAT EMISSION
  // ---------------------------------------------------------

  /**
   * _emitPulse()
   * ------------
   * Emits a heartbeat into:
   *   - pipeline
   *   - reflex
   *   - logger
   */
  _emitPulse() {
    const pulse = this._generatePulse();

    // Pipeline
    if (this.pipeline) {
      this.pipeline.run(pulse.bits);
    }

    // Reflex
    if (this.reflex) {
      this.reflex.run(pulse.bits);
    }

    // Logger
    if (this.logger) {
      this.logger.logBinary(pulse.bits, { source: 'heartbeat' });
    }

    this._trace('pulse:emitted', {
      bits: pulse.bitLength,
    });
  }

  // ---------------------------------------------------------
  //  HEARTBEAT CONTROL
  // ---------------------------------------------------------

  /**
   * start()
   * -------
   * Starts the deterministic heartbeat loop.
   */
  start() {
    if (this._timer) return;

    this._timer = setInterval(() => {
      this._emitPulse();
    }, this.intervalMs);

    this._trace('heartbeat:start', { intervalMs: this.intervalMs });
  }

  /**
   * stop()
   * ------
   * Stops the heartbeat loop.
   */
  stop() {
    if (!this._timer) return;

    clearInterval(this._timer);
    this._timer = null;

    this._trace('heartbeat:stop', {});
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

function createAIBinaryHeartbeat(config) {
  return new AIBinaryHeartbeat(config);
}

module.exports = {
  AIBinaryHeartbeat,
  createAIBinaryHeartbeat,
};
