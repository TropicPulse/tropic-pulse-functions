// ============================================================================
// FILE: /apps/PulseOS/core/PulseLoopScanner-v11-EVO.js
// PULSE OS — v11-EVO
// GENERIC LOOP ORGAN — NON-BINARY, DETERMINISTIC, MULTI-SPIN, ZERO-DRIFT
// ============================================================================
// ROLE:
//   - Convert ANY numeric signal → deterministic loop indices.
//   - Drive sweep lines for ALL PulseOS layers (body/home/town/node).
//   - Zero randomness, zero timestamps, zero mutation.
//   - Multi-spin aware (phase-offset loop paths).
//   - Designed to pair with ANY scanner (Behavior, Binary, NodeAdmin, UI).
//
// LOOP PERSONALITIES (v11-EVO):
//   • nextIndex       → standard loop index (fast, responsive)
//   • nextIndexDeep   → slower, deeper, stable sweep
//   • nextIndexMulti  → 3-phase multi-spin loop indices
//   • nextIndexEdge   → edge-biased sweep (outline emphasis)
//   • nextIndexFlat   → low-variance, stable sweep
//
// NOTES:
//   - This is the GENERIC version (NOT binary).
//   - Accepts ANY numeric array or scalar signal.
//   - No binary validation.
//   - No bit restrictions.
// ============================================================================

export function createLoopScanner({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // CORE: SIGNAL → NUMBER (GENERIC)
  // ---------------------------------------------------------------------------
  function signalToNumber(signal) {
    if (Array.isArray(signal)) {
      // Sum + weighted index → stable number
      let n = 0;
      for (let i = 0; i < signal.length; i++) {
        n += (signal[i] || 0) * (i + 1);
      }
      return Math.abs(Math.floor(n));
    }

    // Scalar fallback
    return Math.abs(Math.floor(signal || 0));
  }

  // ========================================================================
  // MODE 1 — STANDARD LOOP INDEX (FAST, RESPONSIVE)
  // ========================================================================
  function nextIndex(signal, max, spinPhase = 0) {
    const base = signalToNumber(signal);
    const idx = Math.abs(base + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner-GENERIC] STANDARD:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 2 — DEEP LOOP INDEX (SLOW, STABLE, MRI-LIKE)
  // ========================================================================
  function nextIndexDeep(signal, max, spinPhase = 0) {
    const base = Math.floor(signalToNumber(signal) * 0.25);
    const idx = Math.abs(base + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner-GENERIC] DEEP:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 3 — MULTI LOOP INDEX (3-PHASE MULTI-SPIN)
  // ========================================================================
  function nextIndexMulti(signal, max) {
    const base = signalToNumber(signal);

    const indices = [0, 1, 2].map(i => {
      const phase = (Math.PI * 2 * i) / 3;
      const idx = Math.abs(base + Math.floor(phase * 10)) % max;
      return idx;
    });

    if (trace) console.log("[LoopScanner-GENERIC] MULTI:", indices);
    return indices;
  }

  // ========================================================================
  // MODE 4 — EDGE LOOP INDEX (OUTLINE EMPHASIS)
  // ========================================================================
  function nextIndexEdge(signal, max, spinPhase = 0) {
    const base = signalToNumber(signal);

    // Even → left/top edge, Odd → right/bottom edge
    const edgeBias = (base % 2 === 0) ? 0 : max - 1;

    const idx = Math.abs(edgeBias + Math.floor(spinPhase)) % max;

    if (trace) console.log("[LoopScanner-GENERIC] EDGE:", idx);
    return idx;
  }

  // ========================================================================
  // MODE 5 — FLAT LOOP INDEX (LOW-VARIANCE, CALMING)
  // ========================================================================
  function nextIndexFlat(signal, max) {
    const base = signalToNumber(signal);

    // Flatten movement: only 10% of normal range
    const idx = Math.floor((base % max) * 0.1);

    if (trace) console.log("[LoopScanner-GENERIC] FLAT:", idx);
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
