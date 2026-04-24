/**
 * aiBinaryGovernorAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary ↔ Governor Adapter**.
 *
 *   It is the membrane between:
 *     - The Binary Evolution Layer (binary-first compute)
 *     - The Governor (OS-level authority organ)
 *
 *   The Governor:
 *     • enforces rules
 *     • coordinates organs
 *     • manages permissions
 *     • handles escalation
 *     • resolves conflicts
 *
 *   The Binary Layer:
 *     • computes in binary
 *     • stores in binary
 *     • reacts in binary
 *     • evolves in binary
 *
 *   These two worlds must NEVER directly touch.
 *
 * WHY THIS ORGAN EXISTS:
 *   The Governor speaks in:
 *     - objects
 *     - rules
 *     - decisions
 *     - human-readable logs
 *
 *   The Binary Layer speaks in:
 *     - raw binary
 *
 *   This adapter:
 *     - converts Governor decisions → binary packets
 *     - converts binary events → Governor packets
 *     - forwards both without interpretation
 *
 *   It is a **pure membrane**, not a decision-maker.
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a governor
 *     - a router
 *     - a rule engine
 *     - a policy interpreter
 *
 *   This organ IS:
 *     - a binary adapter
 *     - a safe transport layer
 *     - a deterministic translator
 *
 * PACKET MODELS:
 *
 *   Binary → Governor:
 *     {
 *       type: "binary-event",
 *       bits: <binary>,
 *       bitLength: <number>,
 *       timestamp: <ms>
 *     }
 *
 *   Governor → Binary:
 *     {
 *       type: "governor-decision",
 *       decision: <string>,
 *       meta: <object>
 *     }
 *
 *   Both are encoded into binary before crossing the membrane.
 */

class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id         → for ProofLogger / CNS attendance
     *   encoder    → aiBinaryAgent instance (required)
     *   governor   → Governor organ instance (required)
     *   pipeline   → aiBinaryPipeline instance (optional)
     *   reflex     → aiBinaryReflex instance (optional)
     *   logger     → aiBinaryLoggerAdapter instance (optional)
     *   trace      → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-governor-adapter';
    this.encoder = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.logger = config.logger || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryGovernorAdapter requires aiBinaryAgent encoder');
    }
    if (!this.governor || typeof this.governor.handle !== 'function') {
      throw new Error('AIBinaryGovernorAdapter requires a Governor organ with .handle()');
    }
  }

  // ---------------------------------------------------------
  //  BINARY → GOVERNOR
  // ---------------------------------------------------------

  /**
   * forwardBinaryToGovernor(binaryStr)
   * ----------------------------------
   * Sends a binary event to the Governor.
   *
   * DESIGN NOTES:
   *   - Does NOT decode binary.
   *   - Does NOT interpret binary.
   *   - Wraps binary in a structured packet.
   */
  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = {
      type: 'binary-event',
      bits: binaryStr,
      bitLength: binaryStr.length,
      timestamp: Date.now(),
    };

    this._trace('forwardBinaryToGovernor', packet);

    this.governor.handle(packet);
  }

  // ---------------------------------------------------------
  //  GOVERNOR → BINARY
  // ---------------------------------------------------------

  /**
   * forwardGovernorDecision(decisionObj)
   * ------------------------------------
   * Converts a Governor decision → binary → forwards to:
   *   - pipeline
   *   - reflex
   *   - logger
   */
  forwardGovernorDecision(decisionObj) {
    const json = JSON.stringify(decisionObj);
    const binary = this.encoder.encode(json);

    this._trace('forwardGovernorDecision', {
      decision: decisionObj,
      bits: binary.length,
    });

    // Forward to pipeline
    if (this.pipeline) {
      this.pipeline.run(binary);
    }

    // Forward to reflex
    if (this.reflex) {
      this.reflex.run(binary);
    }

    // Forward to logger
    if (this.logger) {
      this.logger.logBinary(binary, { source: 'Governor' });
    }

    return binary;
  }

  // ---------------------------------------------------------
  //  ATTACHMENT HOOKS
  // ---------------------------------------------------------

  /**
   * attachToPipeline(pipeline)
   * --------------------------
   * When pipeline produces output, forward to Governor.
   */
  attachToPipeline(pipeline) {
    pipeline.addObserver(({ output }) => {
      this.forwardBinaryToGovernor(output);
    });

    this._trace('attachToPipeline', { pipeline: pipeline.id });
  }

  /**
   * attachToReflex(reflex)
   * ----------------------
   * When reflex fires, forward to Governor.
   */
  attachToReflex(reflex) {
    const originalRun = reflex.run.bind(reflex);

    reflex.run = (binaryInput) => {
      const result = originalRun(binaryInput);

      if (result !== null) {
        this.forwardBinaryToGovernor(result);
      }

      return result;
    };

    this._trace('attachToReflex', { reflex: reflex.id });
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

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIBinaryGovernorAdapter(config) {
  return new AIBinaryGovernorAdapter(config);
}

module.exports = {
  AIBinaryGovernorAdapter,
  createAIBinaryGovernorAdapter,
};
