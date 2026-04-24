/**
 * aiBinaryField.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Field Layer**, the organism’s interface
 *   with the external environment.
 *
 *   It provides:
 *     - environmental input handling
 *     - external binary ingestion
 *     - output emission to the world
 *     - field modulation (environmental state)
 *     - boundary-level filtering
 *     - binary artery metrics (throughput, pressure, cost, budget)
 *
 *   It is the organism’s:
 *     • world membrane
 *     • environmental interface
 *     • I/O boundary
 *     • field interaction layer
 *     • binary lung (pressure + flow)
 *
 * WHY THIS ORGAN EXISTS:
 *   Without a field:
 *     - the organism has no environment
 *     - no external input is contextualized
 *     - no output is structured
 *     - sentinel has no field to guard
 *     - consciousness has no world to reference
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST HAVE A WORLD TO LIVE IN.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a sentinel (threat detection)
 *     - a pipeline
 *     - a cortex
 *     - a reflex engine
 *
 *   This organ IS:
 *     - an environmental membrane
 *     - an I/O interface
 *     - a field state engine
 *     - a binary world layer
 *     - a binary artery pressure source
 *
 * FIELD MODEL:
 *   A field event packet is:
 *
 *     {
 *       type: "binary-field-event",
 *       timestamp: <ms>,
 *       direction: "in" | "out",
 *       bits: <binary>,
 *       fieldState: {...},
 *       binary: { throughput, pressure, cost, budget, buckets },
 *       bitLength: <number>
 *     }
 *
 *   Entire field event is encoded into binary.
 */

class AIBinaryField {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-field';
    this.encoder = config.encoder;
    this.sentinel = config.sentinel;
    this.metabolism = config.metabolism;
    this.hormones = config.hormones;
    this.consciousness = config.consciousness;
    this.logger = config.logger || null;
    this.pipeline = config.pipeline || null;
    this.reflex = config.reflex || null;
    this.trace = !!config.trace;

    if (!this.encoder) throw new Error('AIBinaryField requires aiBinaryAgent encoder');
    if (!this.sentinel) throw new Error('AIBinaryField requires aiBinarySentinel');
    if (!this.metabolism) throw new Error('AIBinaryField requires aiBinaryMetabolism');
    if (!this.hormones) throw new Error('AIBinaryField requires aiBinaryHormones');
    if (!this.consciousness) throw new Error('AIBinaryField requires aiBinaryConsciousness');

    this.fieldState = {
      entropy: 0,
      signalDensity: 0,
      lastInputSize: 0,
      lastOutputSize: 0,
      environmentalPressure: 0,
    };
  }

  // ---------------------------------------------------------
  //  BINARY ARTERY METRICS
  // ---------------------------------------------------------

  _computeBinaryThroughput(entropy, density) {
    const raw = entropy * (1 - Math.min(1, density));
    return Math.max(0, Math.min(1, raw));
  }

  _computeBinaryPressure(entropy, density) {
    const raw = entropy * density;
    return Math.max(0, Math.min(1, raw));
  }

  _computeBinaryCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeBinaryBudget(throughput, cost) {
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
  //  FIELD STATE UPDATE
  // ---------------------------------------------------------

  _updateFieldState(bits, direction) {
    const size = bits.length;
    const ones = bits.split('').filter((b) => b === '1').length;
    const entropy = ones / size;

    if (direction === 'in') this.fieldState.lastInputSize = size;
    else this.fieldState.lastOutputSize = size;

    this.fieldState.entropy = entropy;
    this.fieldState.signalDensity = size / 1024;
    this.fieldState.environmentalPressure = Math.min(1, entropy * this.fieldState.signalDensity);

    this._trace('field:state:update', {
      direction,
      size,
      entropy,
      pressure: this.fieldState.environmentalPressure,
    });
  }

  // ---------------------------------------------------------
  //  FIELD PACKET
  // ---------------------------------------------------------

  _generateFieldPacket(bits, direction) {
    const { entropy, signalDensity, environmentalPressure } = this.fieldState;

    const throughput = this._computeBinaryThroughput(entropy, signalDensity);
    const pressure   = this._computeBinaryPressure(entropy, signalDensity);
    const cost       = this._computeBinaryCost(pressure, throughput);
    const budget     = this._computeBinaryBudget(throughput, cost);

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
      type: 'binary-field-event',
      timestamp: Date.now(),
      direction,
      bits,
      fieldState: this.fieldState,
      binary
    };

    const json = JSON.stringify(payload);
    const encoded = this.encoder.encode(json);

    const packet = {
      ...payload,
      bits: encoded,
      bitLength: encoded.length,
    };

    this._trace('field:packet', { direction, bits: packet.bitLength });

    return packet;
  }

  // ---------------------------------------------------------
  //  INPUT HANDLING
  // ---------------------------------------------------------

  ingest(bits) {
    const safe = this.sentinel.scan(bits);
    if (!safe) return false;

    this._updateFieldState(bits, 'in');

    const packet = this._generateFieldPacket(bits, 'in');

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.reflex) this.reflex.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'field-in' });

    return packet;
  }

  // ---------------------------------------------------------
  //  OUTPUT EMISSION
  // ---------------------------------------------------------

  emit(bits) {
    this._updateFieldState(bits, 'out');

    const packet = this._generateFieldPacket(bits, 'out');

    if (this.pipeline) this.pipeline.run(packet.bits);
    if (this.logger) this.logger.logBinary(packet.bits, { source: 'field-out' });

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

function createAIBinaryField(config) {
  return new AIBinaryField(config);
}

module.exports = {
  AIBinaryField,
  createAIBinaryField,
};
