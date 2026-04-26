/**
 * aiPageScannerAdapter.js — Pulse OS v11‑EVO Organ
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
/**
 * aiPageScannerAdapter.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **PageScanner Adapter** (dualband).
 *
 *   PageScanner is an A2 sensory organ:
 *     - detects routes
 *     - detects errors
 *     - detects missing imports
 *     - detects environment mismatches
 *     - detects recursion / hydra roots
 *     - emits human-readable logs
 *
 *   The organism’s compute layer is machine-facing:
 *     - raw binary
 *     - deterministic compute
 *     - no human formatting
 *     - no interpretation
 *
 *   These two worlds must NEVER directly touch.
 *
 *   This adapter is the **membrane** between them.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

export const PageScannerAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "PAGESCANNER_ADAPTER",
  version: "11.0-EVO",
  identity: "aiPageScannerAdapter-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    membraneAware: true,
    binaryAware: true,
    pipelineAware: true,
    reflexAware: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic, non-interpreting, binary-safe membrane between PageScanner (A2 sensory organ) and the organism.",

    never: Object.freeze([
      "interpret PageScanner events",
      "mutate PageScanner events",
      "format PageScanner events",
      "generate symbolic state",
      "introduce randomness",
      "override pipeline decisions",
      "override reflex decisions",
      "block the organism"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "encode PageScanner events deterministically",
      "emit binary-only packets",
      "forward packets without interpretation",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (LOGIC UNCHANGED)
// ---------------------------------------------------------

class AIBinaryPageScannerAdapter {
  constructor(config = {}) {
    this.id = config.id || 'pagescanner-adapter';
    this.encoder = config.encoder;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryPageScannerAdapter requires aiBinaryAgent encoder');
    }
  }

  attach(scanner) {
    if (!scanner || typeof scanner.onEvent !== 'function') {
      throw new Error('attach expects a PageScanner with .onEvent()');
    }

    scanner.onEvent((event) => {
      this._handleScannerEvent(event);
    });

    this._trace('attach', { scanner: scanner.id || 'PageScanner' });
  }

  _handleScannerEvent(event) {
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

    if (this.logger) {
      this.logger.logBinary(binary, packet.meta);
    }

    if (this.pipeline) {
      this.pipeline.run(binary);
    }

    if (this.reflex) {
      this.reflex.run(binary);
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY EXPORT (UNCHANGED)
// ---------------------------------------------------------

function createAIBinaryPageScannerAdapter(config) {
  return new AIBinaryPageScannerAdapter(config);
}

module.exports = {
  AIBinaryPageScannerAdapter,
  createAIBinaryPageScannerAdapter,
  PageScannerAdapterMeta
};
