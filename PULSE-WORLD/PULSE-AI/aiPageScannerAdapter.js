/**
 * aiPageScannerAdapter.js — Pulse OS v12‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Adapter for PageScanner**.
 *
 *   It is the membrane between:
 *     • PageScanner (A2 sensory organ, symbolic)
 *     • Binary Evolution Layer (machine-facing)
 *
 *   v12‑EVO UPGRADE:
 *     • Added Drift‑Intelligence Layer (read‑only)
 *     • Added lineage drift detection
 *     • Added naming drift detection
 *     • Added module‑mode drift detection
 *     • Added export drift detection
 *     • Added enriched membrane packets
 *
 *   It NEVER:
 *     • mutates PageScanner events
 *     • rewrites pages
 *     • interprets symbolic meaning
 *     • generates symbolic state
 *
 *   It ONLY:
 *     • observes drift patterns
 *     • emits drift‑intelligence metadata
 *     • encodes packets deterministically
 *     • forwards to pipeline / reflex / logger
 */

// ---------------------------------------------------------
//  META BLOCK — v12‑EVO
// ---------------------------------------------------------

const PageScannerAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "PAGESCANNER_ADAPTER",
  version: "12.0-EVO",
  identity: "aiPageScannerAdapter-v12-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    membraneAware: true,
    binaryAware: true,
    pipelineAware: true,
    reflexAware: true,
    readOnly: true,
    packetAware: true,
    driftIntelAware: true,
    multiInstanceReady: true,
    epoch: "v12-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic, read-only, binary-safe membrane between PageScanner and the organism, enriched with drift-intelligence metadata.",

    never: Object.freeze([
      "mutate PageScanner events",
      "rewrite pages",
      "interpret symbolic meaning",
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
      "emit drift-intelligence metadata",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v12‑EVO COMPLETE
// ---------------------------------------------------------

class AIBinaryPageScannerAdapter {
  constructor(config = {}) {
    this.id = config.id || PageScannerAdapterMeta.identity;
    this.encoder = config.encoder;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIBinaryPageScannerAdapter requires aiBinaryAgent encoder");
    }
  }

  attach(scanner) {
    if (!scanner || typeof scanner.onEvent !== "function") {
      throw new Error("attach expects a PageScanner with .onEvent()");
    }

    scanner.onEvent((event) => {
      this._handleScannerEvent(event);
    });

    this._trace("attach", { scanner: scanner.id || "PageScanner" });
  }

  // ---------------------------------------------------------
  //  v12‑EVO DRIFT‑INTELLIGENCE LAYER (READ‑ONLY)
  // ---------------------------------------------------------

  _analyzeDrift(event) {
    const srcA = event?.pageA || "";
    const srcB = event?.pageB || "";

    // Extract variables
    const extractVars = (src) =>
      [...src.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_]+)/g)]
        .map(m => m[1]);

    const varsA = extractVars(srcA);
    const varsB = extractVars(srcB);

    // Normalize names
    const normalize = (name) =>
      name
        .replace(/[\d_]+$/, "")
        .replace(/(Field|State|Mode)$/i, "")
        .toLowerCase();

    // Detect lineage drift
    const lineage = [];
    for (const a of varsA) {
      const normA = normalize(a);
      for (const b of varsB) {
        const normB = normalize(b);
        if (normA === normB && a !== b) {
          lineage.push({ canonical: a, drifted: b });
        }
      }
    }

    // Module mode drift
    const esmA = /import\s+.*from\s+['"]/.test(srcA);
    const cjsA = /require\s*\(/.test(srcA);
    const esmB = /import\s+.*from\s+['"]/.test(srcB);
    const cjsB = /require\s*\(/.test(srcB);

    const moduleMode = {
      pageA: { esm: esmA, cjs: cjsA, mixed: esmA && cjsA },
      pageB: { esm: esmB, cjs: cjsB, mixed: esmB && cjsB }
    };

    // Export drift
    const hasESMExportB = /export\s+/.test(srcB);
    const hasCJSExportB = /module\.exports/.test(srcB);

    const exportDrift = {
      missingESM: !hasESMExportB,
      missingCJS: !hasCJSExportB,
      vars: varsB
    };

    return Object.freeze({
      lineage,
      moduleMode,
      exportDrift
    });
  }

  // ---------------------------------------------------------
  //  PACKET BUILDER
  // ---------------------------------------------------------

  _buildPacket(event, binary, driftIntel) {
    return Object.freeze({
      type: "pagescanner-event",
      source: "PageScanner",
      bits: binary,
      bitLength: binary.length,
      timestamp: Date.now(),
      driftIntel,
      meta: Object.freeze({
        eventType: event.type || "unknown",
        route: event.route || null,
        file: event.file || null,
        line: event.line || null
      })
    });
  }

  // ---------------------------------------------------------
  //  EVENT HANDLER — v12‑EVO (ENRICHED)
  // ---------------------------------------------------------

  _handleScannerEvent(event) {
    // ⭐ NEW: drift-intelligence (read-only)
    const driftIntel = this._analyzeDrift(event);

    const json = JSON.stringify({ event, driftIntel });
    const binary = this.encoder.encode(json);

    const packet = this._buildPacket(event, binary, driftIntel);

    this._trace("event:received", {
      bitLength: packet.bitLength,
      eventType: packet.meta.eventType,
      driftIntel
    });

    this.logger?.logBinary(binary, packet.meta);
    this.pipeline?.run(binary);
    this.reflex?.run(binary);
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY
// ---------------------------------------------------------

function createAIBinaryPageScannerAdapter(config) {
  return new AIBinaryPageScannerAdapter(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS
// ---------------------------------------------------------

export {
  AIBinaryPageScannerAdapter,
  createAIBinaryPageScannerAdapter,
  PageScannerAdapterMeta
};

module.exports = {
  AIBinaryPageScannerAdapter,
  createAIBinaryPageScannerAdapter,
  PageScannerAdapterMeta
};
