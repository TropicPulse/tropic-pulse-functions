// ============================================================================
//  PULSE OS v12.3‑EVO — PAGE SCANNER ADAPTER ORGAN
//  Binary Membrane • Drift‑Intelligence Layer • Routing Artery Metrics
//  PURE MEMBRANE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const PageScannerAdapterMeta = Object.freeze({
  type: "Binary",
  subsystem: "aiPageScannerAdapter",
  layer: "OrganismMembrane",
  role: "PAGESCANNER_ADAPTER",
  version: "12.3-EVO",
  identity: "aiPageScannerAdapter-v12.3-EVO",

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
    arteryAware: true,
    windowAware: true,
    beaconAware: true,
    overmindAware: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic, read-only, binary-safe membrane between PageScanner and the organism, enriched with drift-intelligence and routing-artery metadata.",

    never: Object.freeze([
      "mutate PageScanner events",
      "rewrite pages",
      "interpret symbolic meaning",
      "introduce randomness",
      "override pipeline decisions",
      "override reflex decisions",
      "block the organism",
      "directly control Overmind or beacon"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "encode PageScanner events deterministically",
      "emit binary-only packets",
      "forward packets without interpretation",
      "emit drift-intelligence metadata",
      "emit routing-artery metrics",
      "remain deterministic",
      "remain drift-proof",
      "remain non-blocking",
      "expose window-safe artery snapshots"
    ])
  }),

  boundaryReflex() {
    return "PageScannerAdapter is a read-only membrane — it never mutates events or symbolic state.";
  }
});

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO
// ============================================================================

export class AIBinaryPageScannerAdapter {
  constructor(config = {}) {
    this.id = config.id || PageScannerAdapterMeta.identity;
    this.encoder = config.encoder;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;

    // Optional: crown-layer hooks
    this.beacon = config.beacon || null;       // function(beaconEvent)
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIBinaryPageScannerAdapter requires aiBinaryAgent encoder");
    }

    // Window-safe artery snapshot (no source code, no raw events)
    this.scannerArtery = {
      lastEventType: null,
      lastFile: null,
      lastRoute: null,
      lastBits: 0,
      lastDriftScore: 0,
      snapshot: () => Object.freeze({
        lastEventType: this.scannerArtery.lastEventType,
        lastFile: this.scannerArtery.lastFile,
        lastRoute: this.scannerArtery.lastRoute,
        lastBits: this.scannerArtery.lastBits,
        lastDriftScore: this.scannerArtery.lastDriftScore
      })
    };
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

    const driftScore =
      (lineage.length ? 0.4 : 0) +
      ((moduleMode.pageA.mixed || moduleMode.pageB.mixed) ? 0.3 : 0) +
      ((exportDrift.missingESM || exportDrift.missingCJS) ? 0.3 : 0);

    return Object.freeze({
      lineage,
      moduleMode,
      exportDrift,
      driftScore: Math.min(1, driftScore)
    });
  }

  // ========================================================================
  //  ARTERY METRICS — bounded [0,1]
// ========================================================================

  _computeThroughput(bitLength, driftScore) {
    const sizeFactor = Math.min(1, bitLength / 50000);
    const raw = 1 - (sizeFactor * 0.5 + driftScore * 0.5);
    return Math.max(0, Math.min(1, raw));
  }

  _computePressure(bitLength, driftScore) {
    const raw = Math.min(1, (bitLength / 50000) * (0.5 + driftScore * 0.5));
    return Math.max(0, raw);
  }

  _computeCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeBudget(throughput, cost) {
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

  _buildArtery(bitLength, driftScore) {
    const throughput = this._computeThroughput(bitLength, driftScore);
    const pressure   = this._computePressure(bitLength, driftScore);
    const cost       = this._computeCost(pressure, throughput);
    const budget     = this._computeBudget(throughput, cost);

    return Object.freeze({
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget)
    });
  }

  // ========================================================================
  //  PACKET BUILDER
  // ========================================================================

  _buildPacket(event, binary, driftIntel, artery) {
    return Object.freeze({
      type: "pagescanner-event",
      source: "PageScanner",
      bits: binary,
      bitLength: binary.length,
      timestamp: Date.now(),
      driftIntel,
      artery,
      meta: Object.freeze({
        eventType: event.type || "unknown",
        route: event.route || null,
        file: event.file || null,
        line: event.line || null
      })
    });
  }

  // ========================================================================
  //  BEACON EMISSION (READ-ONLY SUGGESTION TO OVERMIND)
// ========================================================================

  _emitBeacon(packet) {
    if (!this.beacon) return;

    const severity =
      packet.driftIntel.driftScore >= 0.8 ? "high" :
      packet.driftIntel.driftScore >= 0.4 ? "medium" :
      "low";

    const beaconEvent = Object.freeze({
      eventType: "pagescanner-drift",
      severity,
      file: packet.meta.file,
      route: packet.meta.route,
      driftScore: packet.driftIntel.driftScore,
      lineageCount: packet.driftIntel.lineage.length,
      moduleMode: packet.driftIntel.moduleMode
    });

    try {
      this.beacon(beaconEvent);
    } catch {
      // never break the organism
    }
  }

  // ========================================================================
  //  EVENT HANDLER — v12.3‑EVO (ENRICHED)
// ========================================================================

  _handleScannerEvent(event) {
    const driftIntel = this._analyzeDrift(event);

    const json = JSON.stringify({ event, driftIntel });
    const binary = this.encoder.encode(json);

    const artery = this._buildArtery(binary.length, driftIntel.driftScore);
    const packet = this._buildPacket(event, binary, driftIntel, artery);

    // update window-safe artery snapshot
    this.scannerArtery.lastEventType = packet.meta.eventType;
    this.scannerArtery.lastFile = packet.meta.file;
    this.scannerArtery.lastRoute = packet.meta.route;
    this.scannerArtery.lastBits = packet.bitLength;
    this.scannerArtery.lastDriftScore = driftIntel.driftScore;

    this._trace("event:received", {
      bitLength: packet.bitLength,
      eventType: packet.meta.eventType,
      driftScore: driftIntel.driftScore,
      artery
    });

    // optional beacon to Overmind / beacon mesh
    this._emitBeacon(packet);

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
//  DUAL‑MODE EXPORTS — v12.3‑EVO
// ============================================================================
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PageScannerAdapterMeta,
    AIBinaryPageScannerAdapter,
    createAIBinaryPageScannerAdapter
  };
}
