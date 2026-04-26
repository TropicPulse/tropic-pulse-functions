/**
 * aiGenome.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Genome** of the organism.
 *
 *   It defines:
 *     - organism DNA
 *     - organ lineage
 *     - organ signatures
 *     - canonical organ order
 *     - organism fingerprint
 *     - binary genetic artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • immutable identity
 *     • structural blueprint
 *     • genetic scripture
 *     • lineage record
 *     • arterial DNA source
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const GenomeMeta = Object.freeze({
  layer: "BinaryGenetics",
  role: "BINARY_GENOME",
  version: "11.0-EVO",
  identity: "aiBinaryGenome-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    registryAware: true,
    evolutionAware: true,
    memoryAware: true,
    lineageReady: true,
    ancestryReady: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
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
      "modify memory outside genome key"
    ]),

    always: Object.freeze([
      "compute genome deterministically",
      "encode genome in binary",
      "store genome immutably",
      "compute fingerprint deterministically",
      "treat signatures as binary-only",
      "remain pure and minimal"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

class AIBinaryGenome {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-genome';
    this.encoder = config.encoder;
    this.registry = config.registry;
    this.evolution = config.evolution;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryGenome requires aiBinaryAgent encoder');
    if (!this.registry) throw new Error('AIBinaryGenome requires aiBinaryOrganRegistry');
    if (!this.evolution) throw new Error('AIBinaryGenome requires aiBinaryEvolution');
    if (!this.memory) throw new Error('AIBinaryGenome requires aiBinaryMemory');
  }

  // ---------------------------------------------------------
  //  BINARY GENETIC ARTERY METRICS
  // ---------------------------------------------------------

  _computeGeneticThroughput(organCount, driftCount) {
    const driftFactor = Math.min(1, driftCount / Math.max(organCount, 1));
    const raw = Math.max(0, 1 - driftFactor);
    return Math.min(1, raw);
  }

  _computeGeneticPressure(organCount, signatureBits) {
    const organFactor = Math.min(1, organCount / 100);
    const sigFactor = Math.min(1, signatureBits / 50000);
    const raw = Math.min(1, organFactor * 0.5 + sigFactor * 0.5);
    return Math.max(0, raw);
  }

  _computeGeneticCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeGeneticBudget(throughput, cost) {
    const raw = throughput - cost;
    return Math.max(0, Math.min(1, raw));
  }

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

  // ---------------------------------------------------------
  //  GENOME GENERATION
  // ---------------------------------------------------------

  generateGenome() {
    const organIds = this.registry.listOrgans();

    const signatures = {};
    let driftCount = 0;
    let signatureBits = 0;

    for (const id of organIds) {
      const stored = this.evolution.loadSignature({ id }) || '0';
      const current = stored; // deterministic, no mutation

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
      organismId: 'pulse-os-binary-organism',
      version: 'v11-EVO',
      organIds,
      signatures,
      artery,
      timestamp: Date.now(),
    };

    const json = JSON.stringify(genomeObject);
    const binary = this.encoder.encode(json);

    const fingerprint = this._computeFingerprint(binary);

    const genome = {
      ...genomeObject,
      fingerprint,
      fingerprintBits: fingerprint.length,
      genomeBinary: binary,
      genomeBits: binary.length,
    };

    this._trace('genome:generated', {
      organCount: organIds.length,
      bits: binary.length,
      artery
    });

    return genome;
  }

  // ---------------------------------------------------------
  //  GENOME STORAGE
  // ---------------------------------------------------------

  storeGenome() {
    const genome = this.generateGenome();

    const key = this.encoder.encode('genome:current');
    const value = genome.genomeBinary;

    this.memory.write(key, value);

    this._trace('genome:stored', {
      bits: value.length,
      fingerprintBits: genome.fingerprintBits,
    });

    return genome;
  }

  // ---------------------------------------------------------
  //  GENOME LOADING
  // ---------------------------------------------------------

  loadGenome() {
    const key = this.encoder.encode('genome:current');
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace('genome:load:none', {});
      return null;
    }

    const json = this.encoder.decode(binary, 'string');
    const genome = JSON.parse(json);

    this._trace('genome:loaded', {
      organCount: genome.organIds.length,
      bits: binary.length,
    });

    return genome;
  }

  // ---------------------------------------------------------
  //  FINGERPRINTING
  // ---------------------------------------------------------

  _computeFingerprint(binary) {
    let out = '';

    for (let i = 0; i < binary.length; i++) {
      const bit = binary[i];
      const prev = out[out.length - 1] || '0';
      out += bit === prev ? '0' : '1';
    }

    this._trace('fingerprint:computed', { bits: out.length });

    return out;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryGenome(config) {
  return new AIBinaryGenome(config);
}

module.exports = {
  AIBinaryGenome,
  createAIBinaryGenome,
  GenomeMeta
};
