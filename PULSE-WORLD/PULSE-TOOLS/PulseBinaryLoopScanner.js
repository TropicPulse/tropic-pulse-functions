// ============================================================================
// FILE: /apps/PulseOS/PULSE-TOOLS/PulseBinaryLoopScanner.js
// PULSE OS — v11-EVO
// MAIN LOOP ORGAN — PURE BINARY, DETERMINISTIC, MULTI-SPIN, ZERO-DRIFT
// ============================================================================
// ROLE:
//   - Convert binary pulses → deterministic loop indices.
//   - Drive sweep lines for ALL PulseOS layers (body/home/town/node).
//   - Provide multiple loop “personalities” (standard/deep/multi/edge/flat).
//   - Multi-spin aware: phase offsets alter loop paths without randomness.
//   - Zero randomness, zero timestamps, zero mutation.
//   - Pairs with BinaryPulse-v11-EVO + BinaryWaveScanner-v11-EVO.
// ---------------------------------------------------------------------------
// LOOP MODES (v11-EVO):
//   • nextIndex       → standard loop index (fast, responsive)
//   • nextIndexDeep   → slower, deeper, stable sweep (MRI-like)
//   • nextIndexMulti  → 3-phase multi-spin loop indices
//   • nextIndexEdge   → edge-biased sweep (outline emphasis)
//   • nextIndexFlat   → low-variance, stable sweep (calming mode)
// ============================================================================

export function createBinaryLoopScanner({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // SAFETY: PURE BINARY ONLY
  // ---------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // CORE: BINARY → NUMBER (DETERMINISTIC)
  // ---------------------------------------------------------------------------
  function bitsToNumber(bits) {
    let n = 0;
    for (let i = 0; i < bits.length; i++) {
      n = (n << 1) | bits[i];
    }
    return n >>> 0;
  }

  // ========================================================================
  // MODE 1 — STANDARD LOOP INDEX (FAST, RESPONSIVE)
  // ========================================================================
  function nextIndex(bits, max, spinPhase = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner] non-binary bits passed to nextIndex");
    }

    const base = bitsToNumber(bits);
    const idx = Math.abs(base + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner] STANDARD:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 2 — DEEP LOOP INDEX (SLOW, STABLE, MRI-LIKE)
  // ========================================================================
  function nextIndexDeep(bits, max, spinPhase = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner] non-binary bits passed to nextIndexDeep");
    }

    const base = Math.floor(bitsToNumber(bits) * 0.25); // slow down movement
    const idx = Math.abs(base + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner] DEEP:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 3 — MULTI LOOP INDEX (3-PHASE MULTI-SPIN)
  // ========================================================================
  function nextIndexMulti(bits, max) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner] non-binary bits passed to nextIndexMulti");
    }

    const base = bitsToNumber(bits);

    const indices = [0, 1, 2].map(i => {
      const phase = (Math.PI * 2 * i) / 3;
      const idx = Math.abs(base + Math.floor(phase * 10)) % max;
      return idx;
    });

    if (trace) console.log("[LoopScanner] MULTI:", indices);
    return indices;
  }

  // ========================================================================
  // MODE 4 — EDGE LOOP INDEX (OUTLINE EMPHASIS)
  // ========================================================================
  function nextIndexEdge(bits, max, spinPhase = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner] non-binary bits passed to nextIndexEdge");
    }

    const base = bitsToNumber(bits);

    // Even → left/top edge, Odd → right/bottom edge
    const edgeBias = (base % 2 === 0) ? 0 : max - 1;

    const idx = Math.abs(edgeBias + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner] EDGE:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 5 — FLAT LOOP INDEX (LOW-VARIANCE, CALMING)
  // ========================================================================
  function nextIndexFlat(bits, max) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner] non-binary bits passed to nextIndexFlat");
    }

    const base = bitsToNumber(bits);

    // Flatten movement: only 10% of normal range
    const idx = Math.floor((base % max) * 0.1);

    if (trace) console.log("[LoopScanner] FLAT:", idx);
    return idx;
  }

  // ========================================================================
  // ORGAN EXPORT
  // ========================================================================
  return {
    nextIndex,
    nextIndexDeep,
    nextIndexMulti,
    nextIndexEdge,
    nextIndexFlat
  };
}
