// ============================================================================
//  PULSE OS v12‑EVO+ — PAGE SCANNER ADAPTER ORGAN
//  Binary Membrane • Drift‑Intelligence Layer • Deterministic Packet Adapter
//  PURE MEMBRANE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const PageScannerAdapterMeta = Object.freeze({
  type: "Binary",
  subsystem: "aiPageScannerAdapter",
  layer: "OrganismMembrane",
  role: "PAGESCANNER_ADAPTER",
  version: "12.0-EVO+",
  identity: "aiPageScannerAdapter-v12-EVO+",

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
    epoch: "12.0-EVO+"
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
  }),

  boundaryReflex() {
    return "PageScannerAdapter is a read-only membrane — it never mutates events or symbolic state.";
  }
});

// ============================================================================
//  ORGAN IMPLEMENTATION — v12‑EVO+
// ============================================================================

export class AIBinaryPageScannerAdapter {
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

  // ========================================================================
  //  v12‑EVO+ DRIFT‑INTELLIGENCE LAYER (READ‑ONLY)
  // ========================================================================

  _analyzeDrift(event) {
    const srcA = event?.pageA || "";
    const srcB = event?.pageB || "";

    const extractVars = (src) =>
      [...src.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_]+)/g)]
        .map(m => m[1]);

    const varsA = extractVars(srcA);
    const varsB = extractVars(srcB);

    const normalize = (name) =>
      name
        .replace(/[\d_]+$/, "")
        .replace(/(Field|State|Mode)$/i, "")
        .toLowerCase();

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

    const esmA = /import\s+.*from\s+['"]/.test(srcA);
    const cjsA = /require\s*\(/.test(srcA);
    const esmB = /import\s+.*from\s+['"]/.test(srcB);
    const cjsB = /require\s*\(/.test(srcB);

    const moduleMode = {
      pageA: { esm: esmA, cjs: cjsA, mixed: esmA && cjsA },
      pageB: { esm: esmB, cjs: cjsB, mixed: esmB && cjsB }
    };

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

  // ========================================================================
  //  PACKET BUILDER
  // ========================================================================

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

  // ========================================================================
  //  EVENT HANDLER — v12‑EVO+ (ENRICHED)
  // ========================================================================

  _handleScannerEvent(event) {
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

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryPageScannerAdapter(config) {
  return new AIBinaryPageScannerAdapter(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS — v12‑EVO+
// ============================================================================
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PageScannerAdapterMeta,
    AIBinaryPageScannerAdapter,
    createAIBinaryPageScannerAdapter
  };
}
