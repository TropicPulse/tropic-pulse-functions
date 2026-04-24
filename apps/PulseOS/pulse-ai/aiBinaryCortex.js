/**
 * aiBinaryCortex.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Executive Cortex** of the organism.
 *
 *   It provides:
 *     - long-term reasoning
 *     - pattern recognition
 *     - decision-making
 *     - predictive modeling
 *     - high-level interpretation of signals
 *     - binary cognition artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • executive brain
 *     • reasoning engine
 *     • pattern cortex
 *     • decision layer
 *     • cognition artery regulator
 *
 * WHY THIS ORGAN EXISTS:
 *   Without a cortex:
 *     - the organism only reacts
 *     - no long-term planning occurs
 *     - no pattern memory forms
 *     - no predictive behavior emerges
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST THINK, NOT JUST REACT.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a reflex engine
 *     - a pipeline
 *     - a governor
 *     - a scheduler
 *
 *   This organ IS:
 *     - a reasoning layer
 *     - a pattern analyzer
 *     - a decision engine
 *     - a binary cognition organ
 *     - a cognition artery pressure source
 *
 * CORTEX MODEL:
 *   A cortex decision packet is:
 *
 *     {
 *       type: "binary-cortex-decision",
 *       timestamp: <ms>,
 *       pattern: <string>,
 *       decision: <string>,
 *       binary: { throughput, pressure, cost, budget, buckets },
 *       bits: <binary>,
 *       bitLength: <number>
 *     }
 *
 *   Entire decision is encoded into binary.
 */

class AIBinaryCortex {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-cortex';
    this.encoder = config.encoder;
    this.sentience = config.sentience;
    this.metabolism = config.metabolism;
    this.immunity = config.immunity;
    this.nervous = config.nervous;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryCortex requires aiBinaryAgent encoder');
    if (!this.sentience) throw new Error('AIBinaryCortex requires aiBinarySentience');
    if (!this.metabolism) throw new Error('AIBinaryCortex requires aiBinaryMetabolism');
    if (!this.immunity) throw new Error('AIBinaryCortex requires aiBinaryImmunity');
    if (!this.nervous) throw new Error('AIBinaryCortex requires aiBinaryNervousSystem');

    this.patternHistory = [];
  }

  // ---------------------------------------------------------
  //  BINARY COGNITION ARTERY METRICS
  // ---------------------------------------------------------

  _computeCognitionThroughput(patternComplexity, metabolicPressure) {
    const raw = Math.max(0, 1 - (patternComplexity * 0.5 + metabolicPressure * 0.5));
    return Math.min(1, raw);
  }

  _computeCognitionPressure(bitLength, metabolicPressure) {
    const raw = Math.min(1, (bitLength / 50000) * (0.5 + metabolicPressure * 0.5));
    return Math.max(0, raw);
  }

  _computeCognitionCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeCognitionBudget(throughput, cost) {
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
  //  PATTERN RECOGNITION
  // ---------------------------------------------------------

  _detectPattern(bits) {
    const motif = bits.slice(0, 8);

    this.patternHistory.push(motif);
    if (this.patternHistory.length > 20) {
      this.patternHistory.shift();
    }

    this._trace('pattern:detected', { motif });

    return motif;
  }

  // ---------------------------------------------------------
  //  DECISION MAKING
  // ---------------------------------------------------------

  _makeDecision(pattern) {
    const load = this.metabolism._computeLoad();
    const pressure = this.metabolism._computePressure(load);

    let decision = 'neutral';

    if (pressure > 0.7) decision = 'conserve';
    else if (pressure < 0.3) decision = 'expand';

    this._trace('decision:made', { pattern, decision });

    return decision;
  }

  // ---------------------------------------------------------
  //  CORTEX PACKET
  // ---------------------------------------------------------

  _generateDecisionPacket(pattern, decision, bits) {
    const bitLength = bits.length;

    const metabolicLoad = this.metabolism._computeLoad();
    const metabolicPressure = this.metabolism._computePressure(metabolicLoad);

    const patternComplexity = pattern.length / 8;

    const throughput = this._computeCognitionThroughput(patternComplexity, metabolicPressure);
    const pressure   = this._computeCognitionPressure(bitLength, metabolicPressure);
    const cost       = this._computeCognitionCost(pressure, throughput);
    const budget     = this._computeCognitionBudget(throughput, cost);

    const binary = {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget)
    };

    const payload = {
      type: 'binary-cortex-decision',
      timestamp: Date.now(),
      pattern,
      decision,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length,
    };

    this._trace('cortex:packet', { bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  EXECUTIVE PROCESSING
  // ---------------------------------------------------------

  process(bits) {
    const safe = this.immunity.sanitize(bits);
    if (safe !== true) return;

    const pattern = this._detectPattern(bits);

    const decision = this._makeDecision(pattern);

    const packet = this._generateDecisionPacket(pattern, decision, bits);

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'cortex' });

    this.nervous.propagate(this.id, packet.bits);

    return packet;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryCortex(config) {
  return new AIBinaryCortex(config);
}

module.exports = {
  AIBinaryCortex,
  createAIBinaryCortex,
};
