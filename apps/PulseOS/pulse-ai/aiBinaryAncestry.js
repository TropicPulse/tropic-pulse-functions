/**
 * aiBinaryAncestry.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Ancestry System** of the organism.
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
 *
 * WHY THIS ORGAN EXISTS:
 *   Without ancestry:
 *     - reproduction has no memory
 *     - lineage is lost
 *     - evolution cannot be traced
 *     - multi-organism systems become chaotic
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST REMEMBER ITS BLOODLINE.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a reproduction engine
 *     - a genome generator
 *     - a cortex
 *
 *   This organ IS:
 *     - a lineage recorder
 *     - a genealogical map
 *     - a historical archive
 *     - a binary ancestry engine
 *
 * ANCESTRY MODEL:
 *   A lineage record is:
 *
 *     {
 *       parentId: <string>,
 *       childId: <string>,
 *       genomeFingerprint: <binary>,
 *       timestamp: <ms>
 *     }
 *
 *   Entire ancestry is encoded into binary.
 */

class AIBinaryAncestry {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id          → for ProofLogger / CNS attendance
     *   encoder     → aiBinaryAgent instance (required)
     *   memory      → aiBinaryMemory instance (required)
     *   logger      → aiBinaryLoggerAdapter instance (optional)
     *   pipeline    → aiBinaryPipeline instance (optional)
     *   reflex      → aiBinaryReflex instance (optional)
     *   trace       → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-ancestry';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryAncestry requires aiBinaryAgent encoder');
    if (!this.memory) throw new Error('AIBinaryAncestry requires aiBinaryMemory');

    /**
     * INTERNAL STATE:
     *   lineage: Array<lineageRecord>
     */
    this.lineage = [];
  }

  // ---------------------------------------------------------
  //  RECORDING
  // ---------------------------------------------------------

  /**
   * recordReproduction(record)
   * --------------------------
   * Stores a parent → child lineage record.
   */
  recordReproduction(record) {
    this.lineage.push(record);

    this._trace('ancestry:recorded', record);

    // Emit ancestry packet
    const packet = this._generateAncestryPacket(record);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'ancestry' });

    return packet;
  }

  // ---------------------------------------------------------
  //  ANCESTRY PACKET
  // ---------------------------------------------------------

  _generateAncestryPacket(record) {
    const payload = {
      type: 'binary-ancestry',
      timestamp: Date.now(),
      record,
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('ancestry:packet', { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  STORAGE
  // ---------------------------------------------------------

  store() {
    const json = JSON.stringify(this.lineage);
    const binary = this.encoder.encode(json);

    const key = this.encoder.encode('ancestry:records');
    this.memory.write(key, binary);

    this._trace('ancestry:stored', { count: this.lineage.length });

    return binary;
  }

  load() {
    const key = this.encoder.encode('ancestry:records');
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace('ancestry:load:none', {});
      return [];
    }

    const json = this.encoder.decode(binary, 'string');
    this.lineage = JSON.parse(json);

    this._trace('ancestry:loaded', { count: this.lineage.length });

    return this.lineage;
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

function createAIBinaryAncestry(config) {
  return new AIBinaryAnetry(config);
}

module.exports = {
  AIBinaryAncestry,
  createAIBinaryAncestry,
};
