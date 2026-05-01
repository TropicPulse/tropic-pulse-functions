/**
 * aiBinaryEvolution.js — Pulse OS v12.3‑Presence Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Evolution Engine** of Pulse OS.
 *
 *   It:
 *     • observes other organs
 *     • generates binary signatures
 *     • detects drift and mutation
 *     • detects structural changes
 *     • enforces organism identity
 *
 *   This is the “genetic layer” of Pulse OS.
 */

// ---------------------------------------------------------
//  META BLOCK — v12.3‑Presence
// ---------------------------------------------------------

export const EvolutionMeta = Object.freeze({
  layer: "BinaryEvolution",
  role: "BINARY_EVOLUTION_ENGINE",
  version: "12.3-Presence",
  identity: "aiBinaryEvolution-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    registryAware: true,
    memoryAware: true,
    signatureAware: true,
    mutationDetection: true,
    structuralAudit: true,

    longTermMemoryAware: true,
    repairAware: true,
    identityEnforcement: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence",

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    dualBandSafe: true,      // can live in dualband, stays binary‑only
    sideEffectFree: true
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
  }),

  presence: Object.freeze({
    organId: "BinaryEvolutionEngine",
    organKind: "Genetic",
    physiologyBand: "Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "generateSignature",
        "storeSignature",
        "loadSignature",
        "detectDrift:firstSignature",
        "detectDrift:noDrift",
        "detectDrift:driftDetected",
        "evolve:noDrift",
        "evolve:evolved",
        "prewarm:success",
        "prewarm:failure"
      ]
    }
  })
});

// ---------------------------------------------------------
//  PREWARM ENGINE — v12.3‑Presence
//  - Warms encoder + memory + signature paths.
// ---------------------------------------------------------
export function prewarmAIBinaryEvolution(config = {}) {
  try {
    const { encoder, memory, trace } = config;

    if (!encoder || typeof encoder.encode !== "function") {
      if (trace) {
        console.warn("[AIBinaryEvolution Prewarm] Missing encoder");
      }
      return false;
    }
    if (
      !memory ||
      typeof memory.write !== "function" ||
      typeof memory.read !== "function"
    ) {
      if (trace) {
        console.warn("[AIBinaryEvolution Prewarm] Missing memory adapter");
      }
      return false;
    }

    const warmJson = JSON.stringify({
      id: "prewarm",
      keys: ["id", "keys", "type"],
      type: "organ-signature"
    });
    const warmBits = encoder.encode(warmJson);
    const warmKey = encoder.encode("signature:prewarm-organ");

    memory.write(warmKey, warmBits);
    const stored = memory.read(warmKey);

    if (trace) {
      console.log("[AIBinaryEvolution Prewarm] success", {
        bits: warmBits.length,
        storedBits: stored?.length ?? 0
      });
    }

    return true;
  } catch (err) {
    console.error("[AIBinaryEvolution Prewarm] Failed:", err);
    return false;
  }
}

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION — v12.3‑Presence
// ---------------------------------------------------------

class AIBinaryEvolution {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-evolution";
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIBinaryEvolution requires aiBinaryAgent encoder");
    }
    if (!this.memory || typeof this.memory.write !== "function") {
      throw new Error("AIBinaryEvolution requires aiBinaryMemory");
    }

    // optional presence / performance hints
    this.maxSignatureBits = config.maxSignatureBits || 0; // 0 = unlimited
  }

  // ---------------------------------------------------------
  //  ORGAN SIGNATURE GENERATION
  // ---------------------------------------------------------

  generateSignature(organ) {
    const json = JSON.stringify({
      id: organ.id || null,
      keys: Object.keys(organ),
      type: organ.constructor?.name || "UnknownOrgan"
    });

    let binary = this.encoder.encode(json);

    if (this.maxSignatureBits > 0 && binary.length > this.maxSignatureBits) {
      // allow truncation for presence‑aware, bounded signatures
      binary = binary.slice(-this.maxSignatureBits);
      this._trace("generateSignature:truncated", {
        organ: organ.id,
        originalBits: binary.length,
        maxSignatureBits: this.maxSignatureBits
      });
    }

    this._trace("generateSignature", {
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

    this._trace("storeSignature", {
      organ: organ.id,
      bits: signature.length
    });

    return signature;
  }

  loadSignature(organ) {
    const key = this.encoder.encode(`signature:${organ.id}`);
    const stored = this.memory.read(key);

    this._trace("loadSignature", {
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
      this._trace("detectDrift:firstSignature", { organ: organ.id });
      return { oldSig: null, newSig };
    }

    if (oldSig === newSig) {
      this._trace("detectDrift:noDrift", { organ: organ.id });
      return null;
    }

    this._trace("detectDrift:driftDetected", {
      organ: organ.id,
      oldBits: oldSig.length,
      newBits: newSig.length
    });

    return { oldSig, newSig };
  }

  // ---------------------------------------------------------
  //  EVOLUTION UPDATE
  // ---------------------------------------------------------

  evolve(organ) {
    const drift = this.detectDrift(organ);

    if (!drift) {
      const result = Object.freeze({
        evolved: false,
        message: "No drift detected"
      });
      this._trace("evolve:noDrift", { organ: organ.id });
      return result;
    }

    this.storeSignature(organ);

    const result = Object.freeze({
      evolved: true,
      oldSignature: drift.oldSig,
      newSignature: drift.newSig
    });

    this._trace("evolve:evolved", { organ: organ.id });
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
// FACTORY EXPORT — v12.3‑Presence
// ---------------------------------------------------------

export function createAIBinaryEvolution(config = {}) {
  prewarmAIBinaryEvolution(config);
  return new AIBinaryEvolution(config);
}

// direct class export for advanced callers
export { AIBinaryEvolution };

// ---------------------------------------------------------
//  COMMONJS FALLBACK EXPORT (Dual‑Mode)
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryEvolution,
    createAIBinaryEvolution,
    EvolutionMeta,
    prewarmAIBinaryEvolution
  };
}
