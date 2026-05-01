// ============================================================================
// FILE: /PulseOS/PULSE-TOOLS/PulseBinaryLoopScanner.js
// PULSE OS — v12.3-EVO
// MAIN LOOP ORGAN — PURE BINARY, DUAL-BAND-AWARE, ZERO-DRIFT
// ============================================================================
// ROLE (12.3-EVO):
//   - Convert binary pulses → deterministic loop indices.
//   - Drive sweep lines for ALL PulseOS layers (body/home/town/node).
//   - Provide multiple loop “personalities” (standard/deep/multi/edge/flat).
//   - Multi-spin aware: phase offsets alter loop paths without randomness.
//   - Dual-band aware: optional presence/harmonics can bias paths, still deterministic.
//   - Zero randomness, zero timestamps, zero mutation of inputs.
//   - Pairs with BinaryPulse‑v12.3‑EVO + BinaryWaveScanner‑v12.3‑EVO.
// ---------------------------------------------------------------------------
// LOOP MODES (v12.3-EVO, API-COMPATIBLE):
//   • nextIndex       → standard loop index (fast, responsive, dual-band aware)
//   • nextIndexDeep   → slower, deeper, stable sweep (MRI-like)
//   • nextIndexMulti  → 3-phase multi-spin loop indices
//   • nextIndexEdge   → edge-biased sweep (outline emphasis)
//   • nextIndexFlat   → low-variance, stable sweep (calming mode)
// ---------------------------------------------------------------------------
// NOTE:
//   - Signature kept v11-compatible. Extra influence comes via optional params:
//       nextIndex(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexDeep(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexMulti(bits, max, presence = 0, harmonicBias = 0)
//       nextIndexEdge(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexFlat(bits, max, presence = 0, harmonicBias = 0)
//   - Callers that ignore presence/harmonicBias get pure v11 behavior.
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

  // ---------------------------------------------------------------------------
  // DUAL-BAND BIAS (PRESENCE + HARMONICS) — PURE, DETERMINISTIC
  // ---------------------------------------------------------------------------
  function dualBandOffset(max, presence = 0, harmonicBias = 0) {
    // presence, harmonicBias expected in [0,1], but we clamp anyway
    const p = clamp(presence, 0, 1);
    const h = clamp(harmonicBias, 0, 1);

    // small, bounded offset: at most ~10% of max
    const combined = (p * 0.6 + h * 0.4); // 0..1
    const offset = Math.floor(combined * max * 0.1);

    return offset;
  }

  // ========================================================================
  // MODE 1 — STANDARD LOOP INDEX (FAST, RESPONSIVE, DUAL-BAND AWARE)
// ========================================================================
  function nextIndex(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑12.3] non-binary bits passed to nextIndex");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const idx = Math.abs(base + Math.floor(spinPhase) + bandOffset) % max;

    if (trace) console.log("[LoopScanner‑12.3] STANDARD:", { idx, presence, harmonicBias });
    return idx;
  }

  // ========================================================================
  // MODE 2 — DEEP LOOP INDEX (SLOW, STABLE, MRI-LIKE)
// ========================================================================
  function nextIndexDeep(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑12.3] non-binary bits passed to nextIndexDeep");
    }

    const base = Math.floor(bitsToNumber(bits) * 0.25); // slow down movement
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const idx = Math.abs(base + Math.floor(spinPhase) + bandOffset) % max;

    if (trace) console.log("[LoopScanner‑12.3] DEEP:", { idx, presence, harmonicBias });
    return idx;
  }

  // ========================================================================
  // MODE 3 — MULTI LOOP INDEX (3-PHASE MULTI-SPIN, DUAL-BAND AWARE)
// ========================================================================
  function nextIndexMulti(bits, max, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑12.3] non-binary bits passed to nextIndexMulti");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const indices = [0, 1, 2].map(i => {
      const phase = (Math.PI * 2 * i) / 3;
      const idx = Math.abs(base + Math.floor(phase * 10) + bandOffset) % max;
      return idx;
    });

    if (trace) console.log("[LoopScanner‑12.3] MULTI:", { indices, presence, harmonicBias });
    return indices;
  }

  // ========================================================================
  // MODE 4 — EDGE LOOP INDEX (OUTLINE EMPHASIS, DUAL-BAND AWARE)
// ========================================================================
  function nextIndexEdge(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑12.3] non-binary bits passed to nextIndexEdge");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    // Even → left/top edge, Odd → right/bottom edge
    const edgeBias = (base % 2 === 0) ? 0 : max - 1;

    const idx = Math.abs(edgeBias + Math.floor(spinPhase) + bandOffset) % max;

    if (trace) console.log("[LoopScanner‑12.3] EDGE:", { idx, presence, harmonicBias });
    return idx;
  }

  // ========================================================================
  // MODE 5 — FLAT LOOP INDEX (LOW-VARIANCE, CALMING, DUAL-BAND AWARE)
// ========================================================================
  function nextIndexFlat(bits, max, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑12.3] non-binary bits passed to nextIndexFlat");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    // Flatten movement: only 10% of normal range, then dual-band offset
    const flatBase = Math.floor((base % max) * 0.1);
    const idx = (flatBase + bandOffset) % max;

    if (trace) console.log("[LoopScanner‑12.3] FLAT:", { idx, presence, harmonicBias });
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

// ---------------------------------------------------------------------------
// UTIL
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
