// ============================================================================
//  aiGenome.js — Pulse OS v11.2‑EVO Organ
//  Binary Genome • Organ Lineage • Fingerprint Engine • Packet‑Ready
// ============================================================================
//
//  CANONICAL ROLE:
//    This organ is the **Binary Genome** of the organism.
//    It defines identity, lineage, signatures, and the organism fingerprint.
// ============================================================================

export const GenomeMeta = Object.freeze({
  layer: "BinaryGenetics",
  role: "BINARY_GENOME",
  version: "11.2-EVO",
  identity: "aiBinaryGenome-v11.2-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    dualband: true,            // ⭐ NEW
    packetAware: true,         // ⭐ NEW
    evolutionAware: true,      // ⭐ NEW
    lineageAware: true,        // ⭐ NEW
    ancestryAware: true,
    memoryAware: true,
    registryAware: true,

    bluetoothReady: true,      // ⭐ placeholder for future binary genome sync
    windowAware: true,         // ⭐ safe genome summaries for UI

    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.2-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Define the organism’s immutable binary genome, including organ lineage, signatures, canonical order, and organism fingerprint.",

    never: Object.freeze([
      "mutate organ code",
      "override evolution engine",
      "interpret symbolic meaning",
      "introduce randomness",
      "modify registry state",
      "modify memory outside genome key",
      "auto-sync bluetooth genome" // ⭐ NEW
    ]),

    always: Object.freeze([
      "compute genome deterministically",
      "encode genome in binary",
      "store genome immutably",
      "compute fingerprint deterministically",
      "treat signatures as binary-only",
      "remain pure and minimal",
      "prepare for future binary genome channels" // ⭐ NEW
    ])
  })
});

// ============================================================================
//  CONSTANTS
// ============================================================================
const GENOME_ORGANISM_ID = "pulse-os-binary-organism";
const GENOME_VERSION = "v11.2-EVO";
const GENOME_KEY = "genome:current";

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.2‑EVO
// ============================================================================
export class AIBinaryGenome {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-genome";

    this.encoder = config.encoder;
    this.registry = config.registry;
    this.evolution = config.evolution;
    this.memory = config.memory;

    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinaryGenome requires aiBinaryAgent encoder");
    if (!this.registry) throw new Error("AIBinaryGenome requires aiBinaryOrganRegistry");
    if (!this.evolution) throw new Error("AIBinaryGenome requires aiBinaryEvolution");
    if (!this.memory) throw new Error("AIBinaryGenome requires aiBinaryMemory");
  }

  // ---------------------------------------------------------------------------
  //  GENETIC ARTERY METRICS — deterministic, drift-proof
  // ---------------------------------------------------------------------------
  _computeGeneticThroughput(organCount, driftCount) {
    const driftFactor = Math.min(1, driftCount / Math.max(organCount, 1));
    return Math.max(0, 1 - driftFactor);
  }

  _computeGeneticPressure(organCount, signatureBits) {
    const organFactor = Math.min(1, organCount / 100);
    const sigFactor = Math.min(1, signatureBits / 50000);
    return Math.min(1, organFactor * 0.5 + sigFactor * 0.5);
  }

  _computeGeneticCost(pressure, throughput) {
    return Math.max(0, Math.min(1, pressure * (1 - throughput)));
  }

  _computeGeneticBudget(throughput, cost) {
    return Math.max(0, Math.min(1, throughput - cost));
  }

  // ---------------------------------------------------------------------------
  //  BUCKETS — stable categorical mapping
  // ---------------------------------------------------------------------------
  _bucketLevel(v) {
    if (v >= 0.9) return "elite";
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "medium";
    if (v >= 0.25) return "low";
    return "critical";
  }

  _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "none";
  }

  _bucketCost(v) {
    if (v >= 0.8) return "heavy";
    if (v >= 0.5) return "moderate";
    if (v >= 0.2) return "light";
    if (v > 0)    return "negligible";
    return "none";
  }

  // ---------------------------------------------------------------------------
  //  GENOME GENERATION — pure binary, deterministic
  // ---------------------------------------------------------------------------
  generateGenome() {
    const organIds = Array.isArray(this.registry.listOrgans?.())
      ? this.registry.listOrgans()
      : [];

    const signatures = Object.create(null);
    let driftCount = 0;
    let signatureBits = 0;

    for (const id of organIds) {
      const stored = this.evolution.loadSignature({ id }) || "0";
      const current = stored;

      signatures[id] = current;
      signatureBits += current.length;

      if (stored !== current) driftCount++;
    }

    const throughput = this._computeGeneticThroughput(organIds.length, driftCount);
    const pressure   = this._computeGeneticPressure(organIds.length, signatureBits);
    const cost       = this._computeGeneticCost(pressure, throughput);
    const budget     = this._computeGeneticBudget(throughput, cost);

    const artery = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget)
    };

    const genomeObject = {
      organismId: GENOME_ORGANISM_ID,
      version: GENOME_VERSION,
      organIds,
      signatures,
      artery,
      timestamp: Date.now(),

      // ⭐ Future: Bluetooth genome sync metadata (no identifiers)
      bluetooth: {
        ready: false,
        channel: null
      }
    };

    const json = JSON.stringify(genomeObject);
    const binary = this.encoder.encode(json);
    const fingerprint = this._computeFingerprint(binary);

    const genome = {
      ...genomeObject,
      fingerprint,
      fingerprintBits: fingerprint.length,
      genomeBinary: binary,
      genomeBits: binary.length
    };

    this._trace("genome:generated", {
      organCount: organIds.length,
      bits: binary.length,
      artery
    });

    return genome;
  }

  // ---------------------------------------------------------------------------
  //  STORE GENOME — immutable binary write
  // ---------------------------------------------------------------------------
  storeGenome() {
    const genome = this.generateGenome();

    const key = this.encoder.encode(GENOME_KEY);
    const value = genome.genomeBinary;

    this.memory.write(key, value);

    this._trace("genome:stored", {
      bits: value.length,
      fingerprintBits: genome.fingerprintBits
    });

    return genome;
  }

  // ---------------------------------------------------------------------------
  //  LOAD GENOME — binary-only, no symbolic interpretation
  // ---------------------------------------------------------------------------
  loadGenome() {
    const key = this.encoder.encode(GENOME_KEY);
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace("genome:load:none", {});
      return null;
    }

    const json = this.encoder.decode(binary, "string");
    const genome = JSON.parse(json);

    this._trace("genome:loaded", {
      organCount: Array.isArray(genome.organIds) ? genome.organIds.length : 0,
      bits: binary.length
    });

    return genome;
  }

  // ---------------------------------------------------------------------------
  //  SNAPSHOT METRICS — window-safe
  // ---------------------------------------------------------------------------
  snapshotMetrics() {
    const genome = this.loadGenome();
    if (!genome) {
      return {
        hasGenome: false,
        artery: null
      };
    }

    return {
      hasGenome: true,
      artery: genome.artery,
      throughputBucket: genome.artery.throughputBucket,
      pressureBucket: genome.artery.pressureBucket,
      costBucket: genome.artery.costBucket,
      budgetBucket: genome.artery.budgetBucket
    };
  }

  // ---------------------------------------------------------------------------
  //  FINGERPRINT — deterministic binary-only
  // ---------------------------------------------------------------------------
  _computeFingerprint(binary) {
    let out = "";

    for (let i = 0; i < binary.length; i++) {
      const bit = binary[i];
      const prev = out[out.length - 1] || "0";
      out += bit === prev ? "0" : "1";
    }

    this._trace("fingerprint:computed", { bits: out.length });

    return out;
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryGenome(config) {
  return new AIBinaryGenome(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  GenomeMeta
};

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryGenome,
    createAIBinaryGenome,
    GenomeMeta
  };
}
