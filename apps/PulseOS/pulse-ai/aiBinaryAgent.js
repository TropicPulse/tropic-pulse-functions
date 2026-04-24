/**
 * aiBinaryAgent.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Compute Cortex** of the organism.
 *
 *   It now includes:
 *     - binary compute throughput
 *     - binary compute pressure
 *     - binary compute cost
 *     - binary compute budget
 *     - descriptive buckets
 *     - compute artery scoring
 */

class AIBinaryAgent {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-agent';
    this.maxBits = config.maxBits || 64;
    this.trace = !!config.trace;
  }

  // ---------------------------------------------------------
  //  BINARY COMPUTE ARTERY METRICS
  // ---------------------------------------------------------

  _computeComputeThroughput(inputCount, avgBits) {
    const countFactor = Math.min(1, inputCount / 20);
    const sizeFactor  = Math.min(1, avgBits / this.maxBits);
    const raw = Math.max(0, 1 - (countFactor * 0.5 + sizeFactor * 0.5));
    return Math.min(1, raw);
  }

  _computeComputePressure(inputCount, totalBits) {
    const density = inputCount + totalBits / this.maxBits;
    const raw = Math.min(1, density / 30);
    return Math.max(0, raw);
  }

  _computeComputeCost(pressure, throughput) {
    const raw = pressure * (1 - throughput);
    return Math.max(0, Math.min(1, raw));
  }

  _computeComputeBudget(throughput, cost) {
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

  _computeArtery(binaryInputs) {
    const inputCount = binaryInputs.length;

    let totalBits = 0;
    for (const b of binaryInputs) totalBits += b.length;

    const avgBits = inputCount > 0 ? totalBits / inputCount : 0;

    const throughput = this._computeComputeThroughput(inputCount, avgBits);
    const pressure   = this._computeComputePressure(inputCount, totalBits);
    const cost       = this._computeComputeCost(pressure, throughput);
    const budget     = this._computeComputeBudget(throughput, cost);

    return {
      throughput,
      throughputBucket: this._bucketLevel(throughput),

      pressure,
      pressureBucket: this._bucketPressure(pressure),

      cost,
      costBucket: this._bucketCost(cost),

      budget,
      budgetBucket: this._bucketLevel(budget),

      inputCount,
      totalBits,
      avgBits
    };
  }

  // ---------------------------------------------------------
  //  BINARY ENCODING / DECODING
  // ---------------------------------------------------------

  encodeNumber(value) {
    if (typeof value === 'bigint') return value.toString(2);
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError('encodeNumber expects a finite number or bigint');
    }
    return Math.trunc(value).toString(2);
  }

  decodeNumber(binaryStr) {
    if (!/^[01]+$/.test(binaryStr)) {
      throw new TypeError('decodeNumber expects a binary string');
    }
    if (binaryStr.length > 53) {
      return BigInt('0b' + binaryStr);
    }
    return parseInt(binaryStr, 2);
  }

  encode(value) {
    if (typeof value === 'number' || typeof value === 'bigint') {
      return this.encodeNumber(value);
    }
    if (typeof value === 'string') {
      const bytes = Buffer.from(value, 'utf8');
      return this._bytesToBinary(bytes);
    }
    if (value instanceof Uint8Array || Buffer.isBuffer(value)) {
      return this._bytesToBinary(value);
    }
    throw new TypeError('encode: unsupported type');
  }

  decode(binaryStr, type = 'number') {
    switch (type) {
      case 'number': return this.decodeNumber(binaryStr);
      case 'bigint': return BigInt('0b' + binaryStr);
      case 'string': {
        const bytes = this._binaryToBytes(binaryStr);
        return Buffer.from(bytes).toString('utf8');
      }
      case 'bytes': return this._binaryToBytes(binaryStr);
      default: throw new TypeError(`decode: unsupported target type "${type}"`);
    }
  }

  // ---------------------------------------------------------
  //  BINARY COMPUTE SURFACE
  // ---------------------------------------------------------

  computeBinary(fn, ...inputs) {
    if (typeof fn !== 'function') {
      throw new TypeError('computeBinary expects a function');
    }

    const binaryInputs = inputs.map((v) => this.encode(v));
    const artery = this._computeArtery(binaryInputs);

    this._trace('computeBinary:inputs', { binaryInputs, artery });

    const result = fn(binaryInputs);

    this._trace('computeBinary:rawResult', result);

    if (Array.isArray(result)) {
      result.forEach((r) => this._assertBinary(r));
    } else {
      this._assertBinary(result);
    }

    return result;
  }

  computeAndProject(fn, projector, ...inputs) {
    const binaryResult = this.computeBinary(fn, ...inputs);

    if (Array.isArray(binaryResult)) {
      const projected = binaryResult.map((b) => projector(b));
      this._trace('computeAndProject:projected', projected);
      return projected;
    }

    const projected = projector(binaryResult);
    this._trace('computeAndProject:projected', projected);
    return projected;
  }

  // ---------------------------------------------------------
  //  EXAMPLE BINARY OPS
  // ---------------------------------------------------------

  addBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const a = BigInt('0b' + aBin);
    const b = BigInt('0b' + bBin);
    const sum = a + b;

    const out = sum.toString(2);
    this._trace('addBinary', { aBin, bBin, out });
    return out;
  }

  andBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const len = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(len, '0');
    const b = bBin.padStart(len, '0');

    let out = '';
    for (let i = 0; i < len; i++) {
      out += a[i] === '1' && b[i] === '1' ? '1' : '0';
    }

    this._trace('andBinary', { a, b, out });
    return out.replace(/^0+(?=\d)/, '');
  }

  orBinary(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const len = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(len, '0');
    const b = bBin.padStart(len, '0');

    let out = '';
    for (let i = 0; i < len; i++) {
      out += a[i] === '1' || b[i] === '1' ? '1' : '0';
    }

    this._trace('orBinary', { a, b, out });
    return out.replace(/^0+(?=\d)/, '');
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _bytesToBinary(bytes) {
    let out = '';
    for (const byte of bytes) {
      out += byte.toString(2).padStart(8, '0');
    }

    if (out.length > this.maxBits && this.maxBits > 0) {
      this._trace('bytesToBinary:truncated', { originalBits: out.length });
      return out.slice(-this.maxBits);
    }

    return out;
  }

  _binaryToBytes(binaryStr) {
    this._assertBinary(binaryStr);

    const padded = binaryStr.padStart(
      Math.ceil(binaryStr.length / 8) * 8,
      '0'
    );

    const bytes = [];
    for (let i = 0; i < padded.length; i += 8) {
      bytes.push(parseInt(padded.slice(i, i + 8), 2));
    }

    return Uint8Array.from(bytes);
  }

  _assertBinary(str) {
    if (typeof str !== 'string' || !/^[01]+$/.test(str)) {
      throw new TypeError('expected binary string');
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

function createAIBinaryAgent(config) {
  return new AIBinaryAgent(config);
}

module.exports = {
  AIBinaryAgent,
  createAIBinaryAgent,
};
