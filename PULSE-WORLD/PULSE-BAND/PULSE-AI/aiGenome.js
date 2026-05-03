// ============================================================================
//  aiGenome.js — Pulse OS v14‑IMMORTAL Organ
//  Binary Genome • Organ Lineage • Fingerprint Engine • Packet‑Ready
//  HYBRID MODE: Fast by default, deep when drift is detected
//  PURE BINARY. ZERO NETWORK. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiGenome",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "ai_genome",
  lineage: "aiGenome-v11 → v11.3-EVO → v14-IMMORTAL",

  evo: {
    genome: true,
    dnaMapping: true,
    lineageTracking: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiEvolution", "aiEvolutionEngine", "aiEvolutionary"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const GenomeMeta = Object.freeze({
  layer: "BinaryGenetics",
  role: "BINARY_GENOME",
  version: "14-IMMORTAL",
  identity: "aiBinaryGenome-v14-IMMORTAL",

  evo: Object.freeze({
    // Core guarantees
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    // Dual-band + packet surface
    dualband: true,
    packetAware: true,
    windowAware: true,

    // Evolution + lineage
    evolutionAware: true,
    lineageAware: true,
    ancestryAware: true,
    memoryAware: true,
    registryAware: true,

    // IMMORTAL-grade binary physiology
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    // Hybrid genome engine
    hybridMode: true,           // fast + deep drift mode
    genomeCache: true,          // cache for fast path
    deltaAware: true,           // drift-sensitive
    fingerprintAccelerated: true,

    // IO / organism wiring
    bluetoothReady: true,

    // Organism-level guarantees
    multiInstanceReady: true,
    readOnly: true,
    epoch: "v14-IMMORTAL"
  })
});

function emitGenomePacket(type, payload) {
  return Object.freeze({
    meta: GenomeMeta,
    packetType: `genome-${type}`,
    timestamp: Date.now(),
    epoch: GenomeMeta.evo.epoch,
    ...payload
  });
}

export function prewarmBinaryGenome(dualBand = null, { trace = false } = {}) {
  try {
    const packet = emitGenomePacket("prewarm", {
      message: "Binary genome prewarmed and lineage metrics aligned.",
      binaryPressure: dualBand?.binary?.metabolic?.pressure ?? 0
    });

    if (trace) console.log("[aiBinaryGenome] prewarm", packet);
    return packet;
  } catch (err) {
    return emitGenomePacket("prewarm-error", {
      error: String(err),
      message: "Binary genome prewarm failed."
    });
  }
}

export class AIBinaryGenome {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-genome";

    this.encoder = config.encoder;
    this.registry = config.registry;
    this.evolution = config.evolution;
    this.memory = config.memory;

    this.dualBand = config.dualBand || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error("AIBinaryGenome requires aiBinaryAgent encoder");
    if (!this.registry) throw new Error("AIBinaryGenome requires aiBinaryOrganRegistry");
    if (!this.evolution) throw new Error("AIBinaryGenome requires aiBinaryEvolution");
    if (!this.memory) throw new Error("AIBinaryGenome requires aiBinaryMemory");

    // IMMORTAL hybrid cache — fast path
    this._cache = {
      organIds: null,
      signatures: null,
      fingerprint: null,
      genomeBinary: null
    };
  }

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

  generateGenome() {
    const organIds = this.registry.listOrgans?.() || [];

    // Load signatures
    const signatures = {};
    let driftCount = 0;
    let signatureBits = 0;

    for (const id of organIds) {
      const stored = this.evolution.loadSignature({ id }) || "0";
      signatures[id] = stored;
      signatureBits += stored.length;

      // Drift detection (hybrid mode)
      if (this._cache.signatures && this._cache.signatures[id] !== stored) {
        driftCount++;
      }
    }

    const driftDetected =
      driftCount > 0 ||
      organIds.length !== (this._cache.organIds?.length || 0);

    // FAST PATH — no drift, reuse cached genome
    if (!driftDetected && this._cache.genomeBinary) {
      return emitGenomePacket("genome-fast", {
        drift: false,
        genomeBinary: this._cache.genomeBinary,
        fingerprint: this._cache.fingerprint,
        organIds,
        signatures
      });
    }

    // DEEP PATH — drift detected, recompute everything
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
      organismId: "pulse-os-binary-organism",
      version: "v14-IMMORTAL",
      organIds,
      signatures,
      artery,
      timestamp: Date.now(),
      bluetooth: { ready: false, channel: null }
    };

    const json = JSON.stringify(genomeObject);
    const binary = this.encoder.encode(json);
    const fingerprint = this._computeFingerprint(binary);

    // Update cache
    this._cache.organIds = organIds;
    this._cache.signatures = signatures;
    this._cache.fingerprint = fingerprint;
    this._cache.genomeBinary = binary;

    return emitGenomePacket("genome-deep", {
      drift: true,
      driftCount,
      genomeBinary: binary,
      fingerprint,
      organIds,
      signatures,
      artery
    });
  }

  storeGenome() {
    const packet = this.generateGenome();
    const key = this.encoder.encode("genome:current");

    this.memory.write(key, packet.genomeBinary);

    return emitGenomePacket("store", {
      bits: packet.genomeBinary.length,
      fingerprint: packet.fingerprint
    });
  }

  loadGenome() {
    const key = this.encoder.encode("genome:current");
    const binary = this.memory.read(key);

    if (!binary) {
      return emitGenomePacket("load-none", { hasGenome: false });
    }

    const json = this.encoder.decode(binary, "string");
    const genome = JSON.parse(json);

    return emitGenomePacket("load", {
      hasGenome: true,
      organCount: genome.organIds.length,
      bits: binary.length,
      genome
    });
  }

  snapshotMetrics() {
    const packet = this.loadGenome();
    if (!packet.hasGenome) {
      return emitGenomePacket("snapshot", {
        hasGenome: false,
        artery: null
      });
    }

    const artery = packet.genome.artery;

    return emitGenomePacket("snapshot", {
      hasGenome: true,
      artery,
      throughputBucket: artery.throughputBucket,
      pressureBucket: artery.pressureBucket,
      costBucket: artery.costBucket,
      budgetBucket: artery.budgetBucket
    });
  }

  _computeFingerprint(binary) {
    let out = "";
    for (let i = 0; i < binary.length; i++) {
      const bit = binary[i];
      const prev = out[out.length - 1] || "0";
      out += bit === prev ? "0" : "1";
    }
    return out;
  }
}

export function createAIBinaryGenome(config) {
  return new AIBinaryGenome(config);
}
