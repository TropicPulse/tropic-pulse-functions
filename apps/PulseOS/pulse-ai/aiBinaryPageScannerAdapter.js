/**
 * aiBinaryPageScannerAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Adapter for PageScanner**.
 *
 *   PageScanner is an A2 sensory organ:
 *     - detects routes
 *     - detects errors
 *     - detects missing imports
 *     - detects environment mismatches
 *     - detects recursion / hydra roots
 *     - emits human-readable logs
 *
 *   The Binary Evolution Layer is machine-facing:
 *     - raw binary
 *     - deterministic compute
 *     - no human formatting
 *     - no interpretation
 *
 *   These two worlds must NEVER directly touch.
 *
 *   This adapter is the **membrane** between them.
 *
 * WHY THIS ORGAN EXISTS:
 *   PageScanner emits:
 *     - strings
 *     - objects
 *     - stack traces
 *     - route paths
 *     - error messages
 *
 *   The Binary Evolution Layer accepts:
 *     - ONLY binary
 *
 *   This organ:
 *     - captures PageScanner events
 *     - encodes them into binary
 *     - forwards them to:
 *         • aiBinaryPipeline
 *         • aiBinaryReflex
 *         • aiBinaryLoggerAdapter
 *         • aiBinaryMemory
 *
 *   WITHOUT:
 *     - interpreting meaning
 *     - mutating data
 *     - projecting to human formats
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a scanner
 *     - a logger
 *     - a router
 *     - an interpreter
 *
 *   This organ IS:
 *     - a binary adapter
 *     - a safe membrane
 *     - a deterministic translator
 *
 * PACKET MODEL:
 *   {
 *     type: "pagescanner-event",
 *     source: "PageScanner",
 *     bits: <binary>,
 *     bitLength: <number>,
 *     timestamp: <ms>,
 *     meta: {
 *       eventType: "route" | "error" | "import" | "scan",
 *       route: <optional>,
 *       file: <optional>,
 *       line: <optional>
 *     }
 *   }
 *
 *   The adapter does NOT interpret these fields.
 *   It simply transports them.
 */

class AIBinaryPageScannerAdapter {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id        → for ProofLogger / CNS attendance
     *   encoder   → aiBinaryAgent instance (required)
     *   logger    → aiBinaryLoggerAdapter instance (optional)
     *   pipeline  → aiBinaryPipeline instance (optional)
     *   reflex    → aiBinaryReflex instance (optional)
     *   trace     → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-pagescanner-adapter';
    this.encoder = config.encoder;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryPageScannerAdapter requires aiBinaryAgent encoder');
    }
  }

  // ---------------------------------------------------------
  //  ATTACH TO PAGESCANNER
  // ---------------------------------------------------------

  /**
   * attach(PageScanner)
   * -------------------
   * Hooks into PageScanner's event system.
   *
   * DESIGN NOTES:
   *   - PageScanner must expose an onEvent(fn) or similar hook.
   *   - This adapter does NOT modify PageScanner behavior.
   *   - It only listens.
   */
  attach(scanner) {
    if (!scanner || typeof scanner.onEvent !== 'function') {
      throw new Error('attach expects a PageScanner with .onEvent()');
    }

    scanner.onEvent((event) => {
      this._handleScannerEvent(event);
    });

    this._trace('attach', { scanner: scanner.id || 'PageScanner' });
  }

  // ---------------------------------------------------------
  //  EVENT HANDLING
  // ---------------------------------------------------------

  /**
   * _handleScannerEvent(event)
   * --------------------------
   * Converts PageScanner event → binary packet → forwards to:
   *   - pipeline (if provided)
   *   - reflex (if provided)
   *   - logger (if provided)
   */
  _handleScannerEvent(event) {
    // Convert event object → JSON → binary
    const json = JSON.stringify(event);
    const binary = this.encoder.encode(json);

    const packet = {
      type: 'pagescanner-event',
      source: 'PageScanner',
      bits: binary,
      bitLength: binary.length,
      timestamp: Date.now(),
      meta: {
        eventType: event.type || 'unknown',
        route: event.route || null,
        file: event.file || null,
        line: event.line || null,
      },
    };

    this._trace('event:received', packet);

    // Forward to logger
    if (this.logger) {
      this.logger.logBinary(binary, packet.meta);
    }

    // Forward to pipeline
    if (this.pipeline) {
      this.pipeline.run(binary);
    }

    // Forward to reflex
    if (this.reflex) {
      this.reflex.run(binary);
    }
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

function createAIBinaryPageScannerAdapter(config) {
  return new AIBinaryPageScannerAdapter(config);
}

module.exports = {
  AIBinaryPageScannerAdapter,
  createAIBinaryPageScannerAdapter,
};
