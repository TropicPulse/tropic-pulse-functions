/**
 * aiBinaryEvolution.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Evolution Engine** of Pulse OS.
 *
 *   It is the first organ that:
 *     • observes other organs
 *     • generates binary signatures
 *     • detects drift
 *     • detects mutation
 *     • detects structural changes
 *     • enforces organism identity
 *
 *   This is the “genetic layer” of Pulse OS.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const EvolutionMeta = Object.freeze({
  layer: "BinaryEvolution",
  role: "BINARY_EVOLUTION_ENGINE",
  version: "11.0-EVO",
  identity: "aiBinaryEvolution-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    registryAware: true,
    memoryAware: true,
    signatureAware: true,
    mutationDetection: true,
    structuralAudit: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Generate deterministic binary signatures for organs, detect drift, and enforce organism identity.",

    never: Object.freeze([
      "mutate organ code",
      "modify organ state",
      "interpret symbolic meaning",
      "introduce randomness",
      "rewrite signatures nondeterministically",
      "perform cognition",
      "perform routing"
    ]),

    always: Object.freeze([
      "encode signatures deterministically",
      "compare signatures without interpretation",
      "store signatures in binary memory",
      "detect drift safely",
      "remain pure and minimal",
      "return frozen results"
    ])
  })
});
// ---------------------------------------------------------
//  BINARY EVOLUTION PREWARM ENGINE — v11-EVO
//  - Warms encoder + memory + signature paths.
//  - No cognition, no routing, no mutation of organs.
// ---------------------------------------------------------
export function prewarmAIBinaryEvolution(config = {}) {
  try {
    const { encoder, memory } = config;

    if (!encoder || typeof encoder.encode !== "function") {
      return false;
    }
    if (!memory || typeof memory.write !== "function" || typeof memory.read !== "function") {
      return false;
    }

    // Warm encoder with small deterministic payloads
    const warmJson = JSON.stringify({ id: "prewarm", keys: ["id", "keys", "type"] });
    const warmBits = encoder.encode(warmJson);
    const warmKey = encoder.encode("signature:prewarm-organ");

    // Warm memory write/read path
    memory.write(warmKey, warmBits);
    const _stored = memory.read(warmKey);

    return true;
  } catch (err) {
    console.error("[AIBinaryEvolution Prewarm] Failed:", err);
    return false;
  }
}

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

class AIBinaryEvolution {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-evolution';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryEvolution requires aiBinaryAgent encoder');
    }
    if (!this.memory || typeof this.memory.write !== 'function') {
      throw new Error('AIBinaryEvolution requires aiBinaryMemory');
    }
  }

  // ---------------------------------------------------------
  //  ORGAN SIGNATURE GENERATION
  // ---------------------------------------------------------

  generateSignature(organ) {
    const json = JSON.stringify({
      id: organ.id || null,
      keys: Object.keys(organ),
      type: organ.constructor.name,
    });

    const binary = this.encoder.encode(json);

    this._trace('generateSignature', {
      organ: organ.id,
      bits: binary.length
    });

    return binary;
  }

  // ---------------------------------------------------------
  //  SIGNATURE STORAGE
  // ---------------------------------------------------------

  storeSignature(organ) {
    const signature = this.generateSignature(organ);
    const key = this.encoder.encode(`signature:${organ.id}`);

    this.memory.write(key, signature);

    this._trace('storeSignature', {
      organ: organ.id,
      bits: signature.length,
    });

    return signature;
  }

  loadSignature(organ) {
    const key = this.encoder.encode(`signature:${organ.id}`);
    const stored = this.memory.read(key);

    this._trace('loadSignature', {
      organ: organ.id,
      storedBits: stored?.length
    });

    return stored || null;
  }

  // ---------------------------------------------------------
  //  DRIFT DETECTION
  // ---------------------------------------------------------

  detectDrift(organ) {
    const oldSig = this.loadSignature(organ);
    const newSig = this.generateSignature(organ);

    if (!oldSig) {
      this._trace('detectDrift:firstSignature', { organ: organ.id });
      return { oldSig: null, newSig };
    }

    if (oldSig === newSig) {
      this._trace('detectDrift:noDrift', { organ: organ.id });
      return null;
    }

    this._trace('detectDrift:driftDetected', {
      organ: organ.id,
      oldBits: oldSig.length,
      newBits: newSig.length,
    });

    return { oldSig, newSig };
  }

  // ---------------------------------------------------------
  //  EVOLUTION UPDATE
  // ---------------------------------------------------------

  evolve(organ) {
    const drift = this.detectDrift(organ);

    if (!drift) {
      return Object.freeze({
        evolved: false,
        message: 'No drift detected',
      });
    }

    this.storeSignature(organ);

    return Object.freeze({
      evolved: true,
      oldSignature: drift.oldSig,
      newSignature: drift.newSig,
    });
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

export function createAIBinaryEvolution(config) {
  // One-time binary evolution prewarm for this encoder/memory pair
  prewarmAIBinaryEvolution(config);
  return new AIBinaryEvolution(config);
}


// ⭐ Add missing ESM export:
export { AIBinaryEvolution };

// ---------------------------------------------------------
//  COMMONJS FALLBACK EXPORT (Dual‑Mode)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryEvolution,
    createAIBinaryEvolution,
    EvolutionMeta
  };
}
