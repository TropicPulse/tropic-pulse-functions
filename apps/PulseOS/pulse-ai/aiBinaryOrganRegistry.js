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
 *   This file must remain pure.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (UPGRADED)
// ---------------------------------------------------------

export const OrganRegistryMeta = Object.freeze({
  layer: "OrganismIdentity",
  role: "BINARY_ORGAN_REGISTRY",
  version: "11.0-EVO",
  identity: "aiOrganRegistry-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    memoryAware: true,
    evolutionAware: true,
    identityAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Store and retrieve organ identity records in binary memory. Provide a minimal, pure, deterministic registry for organ identity.",

    never: Object.freeze([
      "auto-discover organs",
      "interpret metadata",
      "mutate external organs",
      "perform routing",
      "perform scanning",
      "perform governance",
      "perform linter behavior"
    ]),

    always: Object.freeze([
      "encode all keys and values in binary",
      "register only when explicitly called",
      "store only id/type/signature/timestamp",
      "remain pure and minimal",
      "treat organ records as read-only data"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION (unchanged)
// ---------------------------------------------------------

class AIBinaryOrganRegistry {
  constructor(config = {}) {
    this.id = config.id || 'organ-registry';
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

  listOrgans() {
    const keys = this.memory.listKeys();

    const organKeys = keys.filter((k) => {
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
  OrganRegistryMeta
};
