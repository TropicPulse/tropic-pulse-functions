/**
 * aiBinaryOrganRegistry.js — Pulse OS v11.1‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Binary Organ Registry (identity ledger)
 */

// ---------------------------------------------------------
//  META BLOCK — v11.1‑EVO
// ---------------------------------------------------------

const OrganRegistryMeta = Object.freeze({
  layer: "OrganismIdentity",
  role: "BINARY_ORGAN_REGISTRY",
  version: "11.1-EVO",
  identity: "aiOrganRegistry-v11.1-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    memoryAware: true,
    evolutionAware: true,
    identityAware: true,
    arteryAware: true,

    multiInstanceReady: true,
    epoch: "v11.1-EVO"
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
      "perform linter behavior",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "encode all keys and values in binary",
      "register only when explicitly called",
      "store only id/type/signature/timestamp",
      "remain pure and minimal",
      "treat organ records as read-only data",
      "maintain registry artery metrics"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v11.1‑EVO
// ---------------------------------------------------------

class AIBinaryOrganRegistry {
  constructor(config = {}) {
    this.id        = config.id || "organ-registry";
    this.encoder   = config.encoder;
    this.memory    = config.memory;
    this.evolution = config.evolution || null;
    this.trace     = !!config.trace;

    if (!this.encoder?.encode) {
      throw new Error("AIBinaryOrganRegistry requires aiBinaryAgent encoder");
    }
    if (!this.memory?.write) {
      throw new Error("AIBinaryOrganRegistry requires aiBinaryMemory");
    }

    this.artery = {
      registrations: 0,
      lookups: 0,
      lists: 0,
      lastBits: 0,
      snapshot: () => Object.freeze({
        registrations: this.artery.registrations,
        lookups: this.artery.lookups,
        lists: this.artery.lists,
        lastBits: this.artery.lastBits
      })
    };
  }

  registerOrgan(organ) {
    const signature = this.evolution
      ? this.evolution.generateSignature(organ)
      : this.encoder.encode("nosig");

    const record = {
      id: organ.id || null,
      type: organ.constructor.name,
      signatureBits: signature.length,
      timestamp: Date.now()
    };

    const json  = JSON.stringify(record);
    const key   = this.encoder.encode(`organ:${record.id}`);
    const value = this.encoder.encode(json);

    this.memory.write(key, value);

    this.artery.registrations++;
    this.artery.lastBits = value.length;

    this._trace("registerOrgan", {
      organ: record.id,
      type: record.type,
      bits: value.length
    });

    return record;
  }

  getOrganRecord(organId) {
    const key = this.encoder.encode(`organ:${organId}`);
    const binary = this.memory.read(key);

    this.artery.lookups++;

    if (!binary) {
      this._trace("getOrganRecord:notFound", { organId });
      return null;
    }

    const json = this.encoder.decode(binary, "string");
    const record = JSON.parse(json);

    this.artery.lastBits = binary.length;

    this._trace("getOrganRecord", { organId, record });

    return record;
  }

  listOrgans() {
    const keys = this.memory.listKeys();

    const organKeys = keys.filter((k) => {
      const decoded = this.encoder.decode(k, "string");
      return decoded.startsWith("organ:");
    });

    const organIds = organKeys.map((k) => {
      const decoded = this.encoder.decode(k, "string");
      return decoded.replace("organ:", "");
    });

    this.artery.lists++;
    this.artery.lastBits = organIds.length;

    this._trace("listOrgans", { count: organIds.length });

    return organIds;
  }

  evolveOrgan(organ) {
    if (!this.evolution) {
      throw new Error("evolution engine not provided");
    }

    const result = this.evolution.evolve(organ);

    if (result.evolved) {
      this.registerOrgan(organ);
    }

    this._trace("evolveOrgan", {
      organ: organ.id,
      evolved: result.evolved
    });

    return result;
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY
// ---------------------------------------------------------

function createAIBinaryOrganRegistry(config) {
  return new AIBinaryOrganRegistry(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

// ESM
export {
  OrganRegistryMeta,
  AIBinaryOrganRegistry,
  createAIBinaryOrganRegistry
};

// CommonJS
module.exports = {
  OrganRegistryMeta,
  AIBinaryOrganRegistry,
  createAIBinaryOrganRegistry
};
