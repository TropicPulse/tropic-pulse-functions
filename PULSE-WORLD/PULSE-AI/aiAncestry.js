/**
 * aiAncestry.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Ancestry System** of the organism.
 *
 *   It provides:
 *     - lineage tracking
 *     - reproduction history
 *     - parent/child graph
 *     - evolutionary timeline
 *     - ancestry queries
 *
 *   It is the organism’s:
 *     • genealogical archive
 *     • lineage ledger
 *     • reproduction historian
 *     • ancestry graph engine
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const AncestryMeta = Object.freeze({
  layer: "Ancestry",
  role: "ANCESTRY_SYSTEM",
  version: "11.0-EVO",
  identity: "aiAncestry-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryAware: true,
    memoryAware: true,
    lineageAware: true,
    reproductionAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
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

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

export class AIAncestry {
  constructor(config = {}) {
    this.id = config.id || AncestryMeta.identity;
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIAncestry requires aiBinaryAgent encoder");
    }
    if (!this.memory || typeof this.memory.write !== "function") {
      throw new Error("AIAncestry requires aiBinaryMemory");
    }

    this.lineage = [];
  }

  // ---------------------------------------------------------
  //  RECORDING
  // ---------------------------------------------------------

  recordReproduction(record) {
    const frozenRecord = Object.freeze({ ...record });

    this.lineage.push(frozenRecord);
    this._trace("ancestry:recorded", frozenRecord);

    const packet = this._generateAncestryPacket(frozenRecord);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: "ancestry" });

    return packet;
  }

  // ---------------------------------------------------------
  //  ANCESTRY PACKET
  // ---------------------------------------------------------

  _generateAncestryPacket(record) {
    const payload = {
      type: "ancestry-event",
      timestamp: Date.now(),
      record
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = Object.freeze({
      ...payload,
      bits: binary,
      bitLength: binary.length
    });

    this._trace("ancestry:packet", { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  STORAGE
  // ---------------------------------------------------------

  store() {
    const json = JSON.stringify(this.lineage);
    const binary = this.encoder.encode(json);

    const key = this.encoder.encode("ancestry:records");
    this.memory.write(key, binary);

    this._trace("ancestry:stored", { count: this.lineage.length });

    return binary;
  }

  load() {
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

    this._trace("ancestry:loaded", { count: this.lineage.length });

    return Object.freeze([...this.lineage]);
  }

  // ---------------------------------------------------------
  //  QUERIES
  // ---------------------------------------------------------

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

export function createAIAncestry(config) {
  return new AIAncestry(config);
}
