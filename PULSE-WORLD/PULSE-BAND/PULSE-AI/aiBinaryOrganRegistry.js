/**
 * aiBinaryOrganRegistry.js — Pulse OS v12.3‑Presence Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   Binary Organ Registry (identity ledger)
 *   Stores organ identity, signatures, timestamps, and type.
 *   Presence‑aware, drift‑proof, deterministic.
 */

// ---------------------------------------------------------
//  META BLOCK — v12.3‑Presence
// ---------------------------------------------------------

export const OrganRegistryMeta = Object.freeze({
  layer: "OrganismIdentity",
  role: "BINARY_ORGAN_REGISTRY",
  version: "12.3-Presence",
  identity: "aiOrganRegistry-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    memoryAware: true,
    evolutionAware: true,
    identityAware: true,
    arteryAware: true,

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    dualBandSafe: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence"
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
  }),

  presence: Object.freeze({
    organId: "BinaryOrganRegistry",
    organKind: "Identity",
    physiologyBand: "Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "registerOrgan",
        "getOrganRecord",
        "getOrganRecord:notFound",
        "listOrgans",
        "evolveOrgan",
        "prewarm",
        "prewarm-error"
      ]
    }
  })
});

// ---------------------------------------------------------
//  PACKET EMITTER — deterministic, identity-scoped
// ---------------------------------------------------------
function emitRegistryPacket(type, payload) {
  return Object.freeze({
    meta: OrganRegistryMeta,
    packetType: `registry-${type}`,
    timestamp: Date.now(),
    epoch: OrganRegistryMeta.evo.epoch,
    layer: OrganRegistryMeta.layer,
    role: OrganRegistryMeta.role,
    identity: OrganRegistryMeta.identity,
    ...payload
  });
}

// ---------------------------------------------------------
//  PREWARM ENGINE — v12.3‑Presence
// ---------------------------------------------------------
export function prewarmAIBinaryOrganRegistry(config = {}) {
  try {
    const { encoder, memory, evolution, trace } = config;

    if (!encoder?.encode || !memory?.write || !memory?.read) {
      return false;
    }

    const warmJson = JSON.stringify({
      id: "prewarm-organ",
      type: "Prewarm",
      signatureBits: 0,
      timestamp: 0
    });

    const warmKey = encoder.encode("organ:prewarm");
    const warmVal = encoder.encode(warmJson);

    memory.write(warmKey, warmVal);
    const read = memory.read(warmKey);

    if (read) encoder.decode(read, "string");

    if (typeof memory.listKeys === "function") {
      const keys = memory.listKeys();
      for (const k of keys) encoder.decode(k, "string");
    }

    if (evolution?.generateSignature) {
      evolution.generateSignature({
        id: "prewarm-organ",
        constructor: { name: "PrewarmOrgan" }
      });
    }

    if (trace) console.log("[aiBinaryOrganRegistry] prewarm");

    return emitRegistryPacket("prewarm", {
      message: "Binary Organ Registry prewarmed."
    });
  } catch (err) {
    return emitRegistryPacket("prewarm-error", {
      error: String(err),
      message: "Binary Organ Registry prewarm failed."
    });
  }
}

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v12.3‑Presence
// ---------------------------------------------------------

export class AIBinaryOrganRegistry {
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

  // ---------------------------------------------------------
  //  REGISTER ORGAN
  // ---------------------------------------------------------
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

    return emitRegistryPacket("register", record);
  }

  // ---------------------------------------------------------
  //  LOOKUP ORGAN
  // ---------------------------------------------------------
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

    return emitRegistryPacket("lookup", record);
  }

  // ---------------------------------------------------------
  //  LIST ORGANS
  // ---------------------------------------------------------
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

    return emitRegistryPacket("list", { organIds });
  }

  // ---------------------------------------------------------
  //  EVOLVE ORGAN
  // ---------------------------------------------------------
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

    return emitRegistryPacket("evolve", result);
  }

  // ---------------------------------------------------------
  //  TRACE
  // ---------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
//  FACTORY — v12.3‑Presence
// ---------------------------------------------------------

export function createAIBinaryOrganRegistry(config = {}) {
  prewarmAIBinaryOrganRegistry(config);
  return new AIBinaryOrganRegistry(config);
}

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    OrganRegistryMeta,
    AIBinaryOrganRegistry,
    createAIBinaryOrganRegistry,
    prewarmAIBinaryOrganRegistry
  };
}
