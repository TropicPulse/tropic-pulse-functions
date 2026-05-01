// ============================================================================
//  PULSE OS v12.3‑EVO+ — ANATOMY ORGAN
//  Structural Map • Connectivity Skeleton • Organism Blueprint
//  PURE STRUCTURE. ZERO ROUTING. ZERO COMPUTE.
// ============================================================================

export const AnatomyMeta = Object.freeze({
  layer: "Anatomy",
  role: "STRUCTURAL_MAP",
  version: "12.3-EVO+",
  identity: "aiAnatomy-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    structuralAware: true,
    topologyAware: true,
    memoryAware: true,
    coreMemoryAware: true,   // works with PulseCoreMemory-backed organs
    binaryEncoding: true,    // emits binary packets, not binary-first compute
    anatomyArteryAware: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic structural map of the organism, defining topology and connections.",

    never: Object.freeze([
      "mutate organ behavior",
      "interpret binary meaning",
      "introduce randomness",
      "modify organ state",
      "perform routing",
      "perform computation"
    ]),

    always: Object.freeze([
      "record topology deterministically",
      "encode snapshots in binary",
      "store structural maps in memory",
      "remain pure and minimal",
      "return frozen structural packets"
    ])
  })
});

// ============================================================================
// HELPERS — PRESSURE + BUCKETS
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0)   return "low";
  return "none";
}

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0)    return "negligible";
  return "none";
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v12.3‑EVO+
// ============================================================================
export class AIAnatomy {
  constructor(config = {}) {
    this.id = config.id || AnatomyMeta.identity;
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== "function") {
      throw new Error("AIAnatomy requires aiBinaryAgent encoder");
    }
    if (
      !this.memory ||
      typeof this.memory.write !== "function" ||
      typeof this.memory.read !== "function"
    ) {
      throw new Error("AIAnatomy requires a binary memory organ with write/read");
    }

    this.topology = new Map();
  }

  prewarm() {
    return true;
  }

  // ---------------------------------------------------------
  //  STRUCTURAL ARTERY METRICS
  // ---------------------------------------------------------

  _computeStructuralThroughput(organCount, connectionCount) {
    const organFactor = Math.min(1, organCount / 100);
    const connFactor  = Math.min(1, connectionCount / 200);
    const raw = Math.max(0, 1 - (organFactor * 0.5 + connFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeStructuralPressure(connectionCount, organCount) {
    const density = organCount > 0 ? connectionCount / organCount : 0;
    const raw = Math.min(1, density / 10);
    return Math.max(0, raw);
  }

  _computeStructuralCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeStructuralBudget(throughput, cost) {
    const raw = throughput - cost;
    return Math.max(0, Math.min(1, raw));
  }

  _computeStructuralArtery() {
    const organIds = Array.from(this.topology.keys());
    const organCount = organIds.length;

    let connectionCount = 0;

    for (const data of this.topology.values()) {
      connectionCount += data.inputs.length;
      connectionCount += data.outputs.length;
      connectionCount += data.bidirectional.length;
    }

    const throughput = this._computeStructuralThroughput(organCount, connectionCount);
    const pressure   = this._computeStructuralPressure(connectionCount, organCount);
    const cost       = this._computeStructuralCost(pressure, throughput);
    const budget     = this._computeStructuralBudget(throughput, cost);

    return Object.freeze({
      throughput,
      throughputBucket: bucketLevel(throughput),

      pressure,
      pressureBucket: bucketPressure(pressure),

      cost,
      costBucket: bucketCost(cost),

      budget,
      budgetBucket: bucketLevel(budget),

      organCount,
      connectionCount
    });
  }

  // ---------------------------------------------------------
  //  TOPOLOGY REGISTRATION
  // ---------------------------------------------------------

  registerOrgan(organId) {
    if (!this.topology.has(organId)) {
      this.topology.set(organId, {
        inputs: [],
        outputs: [],
        bidirectional: []
      });

      const artery = this._computeStructuralArtery();
      this._trace("registerOrgan", { organId, artery });
    }
  }

  connect(from, to) {
    this.registerOrgan(from);
    this.registerOrgan(to);

    const node = this.topology.get(from);
    if (!node.outputs.includes(to)) node.outputs.push(to);

    const target = this.topology.get(to);
    if (!target.inputs.includes(from)) target.inputs.push(from);

    const artery = this._computeStructuralArtery();
    this._trace("connect", { from, to, artery });
  }

  link(a, b) {
    this.registerOrgan(a);
    this.registerOrgan(b);

    const A = this.topology.get(a);
    const B = this.topology.get(b);

    if (!A.bidirectional.includes(b)) A.bidirectional.push(b);
    if (!B.bidirectional.includes(a)) B.bidirectional.push(a);

    const artery = this._computeStructuralArtery();
    this._trace("link", { a, b, artery });
  }

  // ---------------------------------------------------------
  //  ANATOMY SNAPSHOT (binary‑encoded)
//  - optionally binary‑pressure‑aware (for logging only)
// ---------------------------------------------------------
  snapshot(binaryVitals = {}) {
    const obj = {};

    for (const [organId, data] of this.topology.entries()) {
      obj[organId] = {
        inputs: [...data.inputs],
        outputs: [...data.outputs],
        bidirectional: [...data.bidirectional]
      };
    }

    const artery = this._computeStructuralArtery();
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const payload = {
      type: "anatomy-snapshot",
      timestamp: Date.now(),
      topology: obj,
      artery,
      pressure: binaryPressure
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = Object.freeze({
      ...payload,
      bits: binary,
      bitLength: binary.length,
      pressureBucket: bucketPressure(binaryPressure)
    });

    this._trace("snapshot", {
      organs: Object.keys(obj).length,
      artery,
      pressure: binaryPressure
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  ANATOMY STORAGE
  // ---------------------------------------------------------

  store(binaryVitals = {}) {
    const snap = this.snapshot(binaryVitals);

    const key = this.encoder.encode("anatomy:current");
    const value = snap.bits;

    this.memory.write(key, value);

    this._trace("store", { bits: value.length });

    return snap;
  }

  load() {
    const key = this.encoder.encode("anatomy:current");
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace("load:none", {});
      return null;
    }

    const json = this.encoder.decode(binary, "string");
    const topology = JSON.parse(json);

    this._trace("load", {
      organs: Object.keys(topology.topology || {}).length,
      artery: topology.artery
    });

    return Object.freeze(topology);
  }

  // ---------------------------------------------------------
  //  ANATOMY ARTERY v3 — symbolic-only, deterministic
  // ---------------------------------------------------------
  anatomyArtery({ binaryVitals = {} } = {}) {
    const artery = this._computeStructuralArtery();
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const localPressure =
      (artery.pressure || 0) * 0.6 +
      (artery.cost || 0) * 0.4;

    const pressure = Math.max(
      0,
      Math.min(1, 0.6 * localPressure + 0.4 * binaryPressure)
    );

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      anatomy: {
        throughput: artery.throughput,
        pressure: artery.pressure,
        cost: artery.cost,
        budget: artery.budget,
        organCount: artery.organCount,
        connectionCount: artery.connectionCount
      }
    };
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
// FACTORY EXPORT (ESM + CommonJS)
// ---------------------------------------------------------

export function createAIAnatomy(config) {
  return new AIAnatomy(config);
}

if (typeof module !== "undefined") {
  module.exports = {
    AIAnatomy,
    createAIAnatomy,
    AnatomyMeta
  };
}
