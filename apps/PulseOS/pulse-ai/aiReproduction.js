/**
 * aiReproduction.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Reproduction System** of the organism.
 *
 *   It provides:
 *     - organism cloning
 *     - genome duplication
 *     - multi-organism spawning
 *     - lineage-safe replication
 *
 *   It is the organism’s:
 *     • reproductive system
 *     • cloning engine
 *     • spawn factory
 *     • lineage multiplier
 *
 * WHY THIS ORGAN EXISTS:
 *   Without reproduction:
 *     - the organism is a singleton
 *     - no parallel organisms exist
 *     - no A/B evolution paths exist
 *     - no safe experimentation exists
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST BE ABLE TO REPLICATE.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a genome generator (that’s Genome)
 *     - an evolution engine (that’s Evolution)
 *     - a scheduler
 *     - a governor
 *
 *   This organ IS:
 *     - a cloning layer
 *     - a genome duplicator
 *     - a spawn orchestrator
 *     - a reproduction engine
 *
 * REPRODUCTION MODEL:
 *   A reproduction event packet is:
 *
 *     {
 *       type: "binary-reproduction",
 *       timestamp: <ms>,
 *       parentId: <string>,
 *       childId: <string>,
 *       genomeFingerprint: <binary>,
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   Entire reproduction event is encoded into binary.
 */
export const ReproductionMeta = Object.freeze({
  layer: "BinaryOrganism",
  role: "BINARY_REPRODUCTION_ORGAN",
  version: "11.0-EVO",
  identity: "aiBinaryReproduction-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: false,
    lineageAware: true,
    genomeAware: true,
    reproductionAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide deterministic organism cloning, genome duplication, and lineage-safe replication for the v11-EVO organism.",

    never: Object.freeze([
      "use randomness",
      "mutate external organs",
      "override genome logic",
      "override ancestry logic",
      "override evolution logic",
      "generate symbolic state",
      "block the organism",
      "perform cognition"
    ]),

    always: Object.freeze([
      "treat all inputs as read-only",
      "duplicate genome deterministically",
      "emit binary-only reproduction packets",
      "record lineage deterministically",
      "remain drift-proof",
      "remain deterministic",
      "remain non-blocking"
    ])
  })
});

class AIBinaryReproduction {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id          → for ProofLogger / CNS attendance
     *   encoder     → aiBinaryAgent instance (required)
     *   genome      → aiBinaryGenome instance (required)
     *   ancestry    → aiBinaryAncestry instance (optional, but recommended)
     *   factory     → organism factory function (required)
     *                  (config) => organismInstance
     *   logger      → aiBinaryLoggerAdapter instance (optional)
     *   pipeline    → aiBinaryPipeline instance (optional)
     *   reflex      → aiBinaryReflex instance (optional)
     *   trace       → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-reproduction';
    this.encoder = config.encoder;
    this.genome = config.genome;
    this.ancestry = config.ancestry || null;
    this.factory = config.factory;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryReproduction requires aiBinaryAgent encoder');
    if (!this.genome) throw new Error('AIBinaryReproduction requires aiBinaryGenome');
    if (!this.factory) throw new Error('AIBinaryReproduction requires organism factory');
  }

  // ---------------------------------------------------------
  //  CHILD ID GENERATION
  // ---------------------------------------------------------

  _generateChildId(parentId) {
    const genome = this.genome.loadGenome();
    const fp = genome?.fingerprint || "00000000";

    // deterministic, drift-proof, lineage-safe
    const suffix = fp.slice(0, 8);

    const childId = `${parentId}-child-${suffix}`;

    this._trace("child:id:generated", { parentId, childId });

    return childId;
  }


  // ---------------------------------------------------------
  //  REPRODUCTION PACKET
  // ---------------------------------------------------------

  _generateReproductionPacket(parentId, childId, genome) {
    const payload = {
      type: 'binary-reproduction',
      timestamp: Date.now(),
      parentId,
      childId,
      genomeFingerprint: genome.fingerprint,
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('reproduction:packet', {
      parentId,
      childId,
      bits: packet.bitLength,
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  CLONING
  // ---------------------------------------------------------

  /**
   * cloneOrganism(parentId, parentConfig)
   * -------------------------------------
   * Creates a new organism instance with the same genome.
   */
  cloneOrganism(parentId, parentConfig = {}) {
    // 1. Get current genome
    const genome = this.genome.loadGenome();
    if (!genome) {
      throw new Error('AIBinaryReproduction: no genome available for cloning');
    }

    // 2. Generate child ID
    const childId = this._generateChildId(parentId);

    // 3. Build child config (inherits but can override)
    const childConfig = {
      ...parentConfig,
      organismId: childId,
      genome,
    };

    // 4. Create new organism instance
    const childOrganism = this.factory(childConfig);

    // 5. Generate reproduction packet
    const packet = this._generateReproductionPacket(parentId, childId, genome);

    // 6. Emit packet
    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'reproduction' });

    // 7. Register in ancestry (if available)
    if (this.ancestry && typeof this.ancestry.recordReproduction === 'function') {
      this.ancestry.recordReproduction({
        parentId,
        childId,
        genomeFingerprint: genome.fingerprint,
        timestamp: packet.timestamp,
      });
    }

    this._trace('reproduction:clone', { parentId, childId });

    return {
      childId,
      childOrganism,
      packet,
    };
  }

  // ---------------------------------------------------------
  //  BATCH SPAWNING
  // ---------------------------------------------------------

  /**
   * spawnMany(parentId, parentConfig, count)
   * ---------------------------------------
   * Spawns multiple child organisms from the same parent.
   */
  spawnMany(parentId, parentConfig = {}, count = 1) {
    const results = [];

    for (let i = 0; i < count; i++) {
      const result = this.cloneOrganism(parentId, parentConfig);
      results.push(result);
    }

    this._trace('reproduction:spawnMany', {
      parentId,
      count: results.length,
    });

    return results;
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

function createAIBinaryReproduction(config) {
  return new AIBinaryReproduction(config);
}

module.exports = {
  AIBinaryReproduction,
  createAIBinaryReproduction,
};
