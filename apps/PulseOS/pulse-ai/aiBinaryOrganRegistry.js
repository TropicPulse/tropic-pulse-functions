/**
 * aiBinaryOrganRegistry.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Organ Registry** of Pulse OS.
 *
 *   It is the organism’s:
 *     • organ map
 *     • identity ledger
 *     • canonical registry
 *     • structural overview
 *
 *   It tracks:
 *     - organ IDs
 *     - organ types
 *     - organ signatures (binary)
 *     - organ metadata
 *
 *   It stores everything in **binary memory**.
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today has:
 *     - no organ map
 *     - no identity ledger
 *     - no structural registry
 *     - no canonical list of subsystems
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST KNOW ITS ORGANS.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a router
 *     - a scanner
 *     - a governor
 *     - a linter
 *
 *   This organ IS:
 *     - a binary registry
 *     - a canonical organ index
 *     - a structural identity map
 *     - a binary-first metadata store
 *
 * REGISTRY MODEL:
 *   Each organ is stored as:
 *
 *     key:   encode(`organ:${organ.id}`)
 *     value: encode(JSON.stringify({
 *               id,
 *               type,
 *               signatureBits,
 *               timestamp
 *             }))
 *
 *   All keys and values are binary.
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - organ lineage
 *     - organ ancestry
 *     - organ deltas
 *     - organ dependency graphs
 *     - organ health checks
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

class AIBinaryOrganRegistry {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id        → for ProofLogger / CNS attendance
     *   encoder   → aiBinaryAgent instance (required)
     *   memory    → aiBinaryMemory instance (required)
     *   evolution → aiBinaryEvolution instance (optional)
     *   trace     → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-organ-registry';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.evolution = config.evolution || null;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryOrganRegistry requires aiBinaryAgent encoder');
    }
    if (!this.memory || typeof this.memory.write !== 'function') {
      throw new Error('AIBinaryOrganRegistry requires aiBinaryMemory');
    }
  }

  // ---------------------------------------------------------
  //  ORGAN REGISTRATION
  // ---------------------------------------------------------

  /**
   * registerOrgan(organ)
   * --------------------
   * Registers an organ in binary memory.
   *
   * Stores:
   *   - id
   *   - type
   *   - signature (if evolution engine provided)
   *   - timestamp
   */
  registerOrgan(organ) {
    const signature = this.evolution
      ? this.evolution.generateSignature(organ)
      : this.encoder.encode('nosig');

    const record = {
      id: organ.id || null,
      type: organ.constructor.name,
      signatureBits: signature.length,
      timestamp: Date.now(),
    };

    const json = JSON.stringify(record);
    const key = this.encoder.encode(`organ:${record.id}`);
    const value = this.encoder.encode(json);

    this.memory.write(key, value);

    this._trace('registerOrgan', {
      organ: record.id,
      type: record.type,
      bits: value.length,
    });

    return record;
  }

  // ---------------------------------------------------------
  //  ORGAN LOOKUP
  // ---------------------------------------------------------

  /**
   * getOrganRecord(organId)
   * -----------------------
   * Loads the binary record for an organ.
   */
  getOrganRecord(organId) {
    const key = this.encoder.encode(`organ:${organId}`);
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace('getOrganRecord:notFound', { organId });
      return null;
    }

    const json = this.encoder.decode(binary, 'string');
    const record = JSON.parse(json);

    this._trace('getOrganRecord', { organId, record });

    return record;
  }

  /**
   * listOrgans()
   * ------------
   * Returns a list of all registered organ IDs.
   */
  listOrgans() {
    const keys = this.memory.listKeys();

    const organKeys = keys.filter((k) => {
      // decode key to check prefix
      const decoded = this.encoder.decode(k, 'string');
      return decoded.startsWith('organ:');
    });

    const organIds = organKeys.map((k) => {
      const decoded = this.encoder.decode(k, 'string');
      return decoded.replace('organ:', '');
    });

    this._trace('listOrgans', { count: organIds.length });

    return organIds;
  }

  // ---------------------------------------------------------
  //  EVOLUTION INTEGRATION
  // ---------------------------------------------------------

  /**
   * evolveOrgan(organ)
   * ------------------
   * Runs evolution engine on organ + updates registry.
   */
  evolveOrgan(organ) {
    if (!this.evolution) {
      throw new Error('evolution engine not provided');
    }

    const result = this.evolution.evolve(organ);

    if (result.evolved) {
      this.registerOrgan(organ);
    }

    this._trace('evolveOrgan', {
      organ: organ.id,
      evolved: result.evolved,
    });

    return result;
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

function createAIBinaryOrganRegistry(config) {
  return new AIBinaryOrganRegistry(config);
}

module.exports = {
  AIBinaryOrganRegistry,
  createAIBinaryOrganRegistry,
};
