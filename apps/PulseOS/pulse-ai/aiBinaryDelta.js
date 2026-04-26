/**
 * aiBinaryDelta.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Delta Engine** of Pulse OS.
 *
 *   It computes:
 *     • binary diffs
 *     • binary deltas
 *     • binary change maps
 *     • binary segment comparisons
 *
 *   It is the organism’s:
 *     - change detector
 *     - diff engine
 *     - binary comparator
 *     - temporal awareness layer
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO
// ---------------------------------------------------------

export const DeltaMeta = Object.freeze({
  layer: "BinaryDelta",
  role: "BINARY_DELTA_ENGINE",
  version: "11.0-EVO",
  identity: "aiBinaryDelta-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,
    diffAware: true,
    changeAware: true,
    temporalAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Compute deterministic binary diffs, deltas, and change maps without symbolic interpretation.",

    never: Object.freeze([
      "interpret symbolic meaning",
      "mutate inputs",
      "apply patches automatically",
      "perform merges",
      "introduce randomness",
      "modify pipeline or reflex behavior"
    ]),

    always: Object.freeze([
      "validate binary inputs",
      "compute diffs deterministically",
      "return pure binary delta structures",
      "remain pure and minimal",
      "produce frozen results"
    ])
  })
});

// ---------------------------------------------------------
//  ORGAN IMPLEMENTATION
// ---------------------------------------------------------

class AIBinaryDelta {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-delta';
    this.trace = !!config.trace;
  }

  // ---------------------------------------------------------
  //  BINARY DIFF CORE
  // ---------------------------------------------------------

  diff(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const maxLen = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(maxLen, '0');
    const b = bBin.padStart(maxLen, '0');

    let added = '';
    let removed = '';
    let unchanged = '';

    for (let i = 0; i < maxLen; i++) {
      const bitA = a[i];
      const bitB = b[i];

      if (bitA === bitB) {
        unchanged += bitA;
      } else if (bitA === '0' && bitB === '1') {
        added += '1';
      } else if (bitA === '1' && bitB === '0') {
        removed += '1';
      }
    }

    const delta = Object.freeze({
      type: 'binary-delta',
      addedBits: added || '0',
      removedBits: removed || '0',
      unchangedBits: unchanged || '0',
      addedCount: added.length,
      removedCount: removed.length,
      unchangedCount: unchanged.length,
    });

    this._trace('diff', {
      aBits: aBin.length,
      bBits: bBin.length,
      delta,
    });

    return delta;
  }

  // ---------------------------------------------------------
  //  DELTA COMPRESSION (FUTURE HOOK)
  // ---------------------------------------------------------

  compressDelta(delta) {
    this._trace('compressDelta', { delta });
    return delta;
  }

  // ---------------------------------------------------------
  //  DELTA APPLICATION (FUTURE HOOK)
  // ---------------------------------------------------------

  applyDelta(aBin, delta) {
    this._assertBinary(aBin);
    this._trace('applyDelta', { aBin, delta });
    return aBin;
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

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

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIBinaryDelta(config) {
  return new AIBinaryDelta(config);
}

module.exports = {
  AIBinaryDelta,
  createAIBinaryDelta,
  DeltaMeta
};
