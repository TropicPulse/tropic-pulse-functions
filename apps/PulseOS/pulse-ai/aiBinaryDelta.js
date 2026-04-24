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
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today computes diffs in:
 *     - strings
 *     - objects
 *     - JSON
 *     - ASTs
 *     - human-readable formats
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “DIFF IN BINARY. UNDERSTAND CHANGE IN BINARY.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a patch engine
 *     - a merge tool
 *     - a version control system
 *
 *   This organ IS:
 *     - a binary diff calculator
 *     - a delta generator
 *     - a structural change detector
 *
 * DELTA MODEL:
 *   A delta is a binary structure:
 *
 *     {
 *       type: "binary-delta",
 *       addedBits: <binary>,
 *       removedBits: <binary>,
 *       unchangedBits: <binary>,
 *       addedCount: <number>,
 *       removedCount: <number>,
 *       unchangedCount: <number>
 *     }
 *
 *   All fields except counts are binary strings.
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - binary patch generation
 *     - binary merge strategies
 *     - binary lineage diffs
 *     - binary memory deltas
 *     - binary organ deltas
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

class AIBinaryDelta {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id        → for ProofLogger / CNS attendance
     *   trace     → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-delta';
    this.trace = !!config.trace;
  }

  // ---------------------------------------------------------
  //  BINARY DIFF CORE
  // ---------------------------------------------------------

  /**
   * diff(aBin, bBin)
   * ----------------
   * Computes a binary diff between two binary strings.
   *
   * RETURNS:
   *   delta object (binary fields)
   */
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

    const delta = {
      type: 'binary-delta',
      addedBits: added || '0',
      removedBits: removed || '0',
      unchangedBits: unchanged || '0',
      addedCount: added.length,
      removedCount: removed.length,
      unchangedCount: unchanged.length,
    };

    this._trace('diff', {
      aBits: aBin.length,
      bBits: bBin.length,
      delta,
    });

    return delta;
  }

  // ---------------------------------------------------------
  //  DELTA COMPRESSION (FUTURE-PROOF HOOK)
  // ---------------------------------------------------------

  /**
   * compressDelta(delta)
   * --------------------
   * Placeholder for future binary delta compression.
   *
   * For now, returns delta unchanged.
   */
  compressDelta(delta) {
    this._trace('compressDelta', { delta });
    return delta;
  }

  // ---------------------------------------------------------
  //  DELTA APPLICATION (FUTURE-PROOF HOOK)
  // ---------------------------------------------------------

  /**
   * applyDelta(aBin, delta)
   * -----------------------
   * Placeholder for future binary patching.
   *
   * For now, returns original input unchanged.
   */
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
};
