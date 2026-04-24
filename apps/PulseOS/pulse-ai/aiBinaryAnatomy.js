/**
 * aiBinaryAnatomy.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Anatomy Map** of the organism.
 *
 *   It defines:
 *     - organ topology
 *     - structural connections
 *     - directional flows
 *     - organ adjacency
 *     - organism blueprint
 *     - binary structural artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • circulatory diagram
 *     • wiring map
 *     • structural skeleton
 *     • connectivity truth source
 */

class AIBinaryAnatomy {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-anatomy';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryAnatomy requires aiBinaryAgent encoder');
    if (!this.memory) throw new Error('AIBinaryAnatomy requires aiBinaryMemory');

    this.topology = new Map();
  }

  // ---------------------------------------------------------
  //  BINARY STRUCTURAL ARTERY METRICS
  // ---------------------------------------------------------

  _computeStructuralThroughput(organCount, connectionCount) {
    const organFactor = Math.min(1, organCount / 100);
    const connFactor = Math.min(1, connectionCount / 200);
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
  //  STRUCTURAL ARTERY SNAPSHOT
  // ---------------------------------------------------------

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

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      organCount,
      connectionCount
    };
  }

  // ---------------------------------------------------------
  //  TOPOLOGY REGISTRATION
  // ---------------------------------------------------------

  registerOrgan(organId) {
    if (!this.topology.has(organId)) {
      this.topology.set(organId, {
        inputs: [],
        outputs: [],
        bidirectional: [],
      });

      const artery = this._computeStructuralArtery();
      this._trace('registerOrgan', { organId, artery });
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
    this._trace('connect', { from, to, artery });
  }

  link(a, b) {
    this.registerOrgan(a);
    this.registerOrgan(b);

    const A = this.topology.get(a);
    const B = this.topology.get(b);

    if (!A.bidirectional.includes(b)) A.bidirectional.push(b);
    if (!B.bidirectional.includes(a)) B.bidirectional.push(a);

    const artery = this._computeStructuralArtery();
    this._trace('link', { a, b, artery });
  }

  // ---------------------------------------------------------
  //  ANATOMY SNAPSHOT
  // ---------------------------------------------------------

  snapshot() {
    const obj = {};

    for (const [organId, data] of this.topology.entries()) {
      obj[organId] = data;
    }

    const artery = this._computeStructuralArtery();

    const payload = {
      type: 'binary-anatomy',
      timestamp: Date.now(),
      topology: obj,
      artery
    };

    const json = JSON.stringify(payload);
    const binary = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: binary,
      bitLength: binary.length,
    };

    this._trace('snapshot', {
      organs: Object.keys(obj).length,
      artery
    });

    return packet;
  }

  // ---------------------------------------------------------
  //  ANATOMY STORAGE
  // ---------------------------------------------------------

  store() {
    const snap = this.snapshot();

    const key = this.encoder.encode('anatomy:current');
    const value = snap.bits;

    this.memory.write(key, value);

    this._trace('store', { bits: value.length });

    return snap;
  }

  load() {
    const key = this.encoder.encode('anatomy:current');
    const binary = this.memory.read(key);

    if (!binary) {
      this._trace('load:none', {});
      return null;
    }

    const json = this.encoder.decode(binary, 'string');
    const topology = JSON.parse(json);

    this._trace('load', {
      organs: Object.keys(topology.topology).length,
      artery: topology.artery
    });

    return topology;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryAnatomy(config) {
  return new AIBinaryAnatomy(config);
}

module.exports = {
  AIBinaryAnatomy,
  createAIBinaryAnatomy,
};
