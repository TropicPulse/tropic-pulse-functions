// ============================================================================
//  PULSE OS v12.3‑EVO+ — ANCESTRY ORGAN
//  Genealogical Archive • Lineage Ledger • Reproduction Historian
//  PURE BINARY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const AncestryMeta = Object.freeze({
  layer: "Ancestry",
  role: "ANCESTRY_SYSTEM",
  version: "12.3-EVO+",
  identity: "aiAncestry-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryAware: true,
    memoryAware: true,
    lineageAware: true,
    reproductionAware: true,
    binaryEventAware: true,
    pipelineAware: true,
    reflexAware: true,
    loggerAware: true,
    ancestryArteryAware: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Record lineage events, maintain genealogical history, and emit deterministic ancestry packets.",

    never: Object.freeze([
      "mutate external organs",
      "interpret symbolic meaning",
      "introduce randomness",
      "modify genome",
      "perform reproduction",
      "override evolution"
    ]),

    always: Object.freeze([
      "record lineage deterministically",
      "encode ancestry packets in binary",
      "store ancestry in memory",
      "remain pure and minimal",
      "return frozen lineage structures"
    ])
  })
});

// ============================================================================
// HELPERS — PRESSURE + BUCKETS
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================================
export class AIAncestry {
  constructor(config = {}) {
    this.id = config.id || AncestryMeta.identity;
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder?.encode) {
      throw new Error("AIAncestry requires aiBinaryAgent encoder");
    }
    if (!this.memory?.write || !this.memory?.read) {
      throw new Error("AIAncestry requires a binary memory organ with write/read");
    }

    this.lineage = [];
  }

  prewarm() {
    return true;
  }

  // ========================================================================
  //  RECORDING — deterministic, binary‑safe
  // ========================================================================
  recordReproduction(record, binaryVitals = {}) {
    const frozenRecord = Object.freeze({ ...record });

    this.lineage.push(frozenRecord);
    this._trace("ancestry:recorded", frozenRecord);

    const packet = this._generateAncestryPacket(frozenRecord, binaryVitals);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: "ancestry" });

    return packet;
  }

  // ========================================================================
  //  ANCESTRY PACKET v3 — binary‑aware, deterministic
  // ========================================================================
  _generateAncestryPacket(record, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const payload = {
      type: "ancestry-event",
      timestamp: Date.now(),
      record,
      pressure: binaryPressure
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = Object.freeze({
      ...payload,
      bits: binary,
      bitLength: binary.length,
      pressureBucket: bucketPressure(binaryPressure)
    });

    this._trace("ancestry:packet", { bits: packet.bitLength });

    return packet;
  }

  // ========================================================================
  //  STORAGE v3 — binary‑safe, deterministic
  // ========================================================================
  store(binaryVitals = {}) {
    const json = JSON.stringify(this.lineage);
    const binary = this.encoder.encode(json);

    const key = this.encoder.encode("ancestry:records");
    this.memory.write(key, binary);

    this._trace("ancestry:stored", {
      count: this.lineage.length,
      pressure: extractBinaryPressure(binaryVitals)
    });

    return binary;
  }

  load(binaryVitals = {}) {
    const key = this.encoder.encode("ancestry:records");
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace("ancestry:load:none", {});
      this.lineage = [];
      return Object.freeze([]);
    }

    const json = this.encoder.decode(binary, "string");
    const parsed = JSON.parse(json);

    this.lineage = parsed.map((r) => Object.freeze({ ...r }));

    this._trace("ancestry:loaded", {
      count: this.lineage.length,
      pressure: extractBinaryPressure(binaryVitals)
    });

    return Object.freeze([...this.lineage]);
  }

  // ========================================================================
  //  QUERIES — deterministic lineage graph
  // ========================================================================
  getChildren(parentId) {
    return this.lineage.filter((r) => r.parentId === parentId);
  }

  getParent(childId) {
    return this.lineage.find((r) => r.childId === childId) || null;
  }

  getSiblings(childId) {
    const parent = this.getParent(childId);
    if (!parent) return [];
    return this.lineage
      .filter((r) => r.parentId === parent.parentId && r.childId !== childId)
      .map((r) => r.childId);
  }

  getLineageTree(rootId) {
    const tree = { id: rootId, children: [] };

    const build = (node) => {
      const kids = this.getChildren(node.id);
      for (const child of kids) {
        const childNode = { id: child.childId, children: [] };
        node.children.push(childNode);
        build(childNode);
      }
    };

    build(tree);
    return tree;
  }

  // ========================================================================
  //  ANCESTRY ARTERY v3 — symbolic-only, deterministic
  // ========================================================================
  ancestryArtery({ binaryVitals = {} } = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const eventCount = this.lineage.length;
    const parentCount = new Set(this.lineage.map((r) => r.parentId)).size;
    const childCount = new Set(this.lineage.map((r) => r.childId)).size;

    const localPressure =
      (eventCount > 50 ? 0.3 : 0) +
      (parentCount > 20 ? 0.3 : 0) +
      (childCount > 20 ? 0.3 : 0);

    const pressure = Math.max(
      0,
      Math.min(1, 0.6 * localPressure + 0.4 * binaryPressure)
    );

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      lineage: {
        events: eventCount,
        parents: parentCount,
        children: childCount
      }
    };
  }

  // ========================================================================
  //  INTERNAL TRACE
  // ========================================================================
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
// FACTORY EXPORT (ESM + CommonJS)
// ============================================================================
export function createAIAncestry(config) {
  return new AIAncestry(config);
}

if (typeof module !== "undefined") {
  module.exports = {
    AIAncestry,
    createAIAncestry,
    AncestryMeta
  };
}
