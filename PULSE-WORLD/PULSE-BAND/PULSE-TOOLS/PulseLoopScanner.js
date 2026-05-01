// ============================================================================
// FILE: /PulseOS/core/PulseLoopScanner-v12.3-EVO.js
// PULSE OS — v12.3-EVO
// GENERIC LOOP ORGAN — PRESENCE + HARMONICS + DUAL-BAND + MULTI-SPIN-EVO
// ============================================================================
// ROLE (12.3-EVO):
//   - Convert ANY numeric signal → deterministic loop indices.
//   - Presence-aware (presenceAvg, presenceGradient).
//   - Harmonics-aware (phaseDrift, coherenceScore).
//   - Dual-band aware (binary + pulse + presence).
//   - Multi-spin-EVO aware (phase-offset loop paths).
//   - Zero randomness, zero timestamps, zero mutation.
//   - API-compatible with v11-EVO.
// ============================================================================

export function createLoopScanner({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // CORE: SIGNAL → NUMBER (GENERIC, DETERMINISTIC)
  // ---------------------------------------------------------------------------
  function signalToNumber(signal) {
    if (Array.isArray(signal)) {
      let n = 0;
      for (let i = 0; i < signal.length; i++) {
        n += (signal[i] || 0) * (i + 1);
      }
      return Math.abs(Math.floor(n));
    }
    return Math.abs(Math.floor(signal || 0));
  }

  // ---------------------------------------------------------------------------
  // DUAL-BAND OFFSET (presence + harmonics)
  // ---------------------------------------------------------------------------
  function dualBandOffset(max, presence = 0, harmonicDrift = 0) {
    const p = clamp(presence, 0, 1);
    const h = clamp(harmonicDrift, 0, 1);

    // presence stabilizes, harmonics destabilize
    const combined = (h * 0.6) - (p * 0.3);

    // bounded offset: ±10% of max
    return Math.floor(combined * max * 0.1);
  }

  // ========================================================================
  // MODE 1 — STANDARD LOOP INDEX (FAST, RESPONSIVE, DUAL-BAND AWARE)
  // ========================================================================
  function nextIndex(signal, max, spinPhase = 0, presence = 0, harmonicDrift = 0) {
    const base = signalToNumber(signal);
    const band = dualBandOffset(max, presence, harmonicDrift);

    const idx = Math.abs(base + Math.floor(spinPhase) + band) % max;

    if (trace) console.log("[LoopScanner‑12.3] STANDARD:", { idx, presence, harmonicDrift });
    return idx;
  }

  // ========================================================================
  // MODE 2 — DEEP LOOP INDEX (SLOW, STABLE, MRI-LIKE)
  // ========================================================================
  function nextIndexDeep(signal, max, spinPhase = 0, presence = 0, harmonicDrift = 0) {
    const base = Math.floor(signalToNumber(signal) * 0.25);
    const band = dualBandOffset(max, presence, harmonicDrift);

    const idx = Math.abs(base + Math.floor(spinPhase) + band) % max;

    if (trace) console.log("[LoopScanner‑12.3] DEEP:", { idx, presence, harmonicDrift });
    return idx;
  }

  // ========================================================================
  // MODE 3 — MULTI LOOP INDEX (3-PHASE MULTI-SPIN-EVO)
  // ========================================================================
  function nextIndexMulti(signal, max, presence = 0, harmonicDrift = 0) {
    const base = signalToNumber(signal);
    const band = dualBandOffset(max, presence, harmonicDrift);

    const indices = [0, 1, 2].map(i => {
      const phase = (Math.PI * 2 * i) / 3;
      return Math.abs(base + Math.floor(phase * 10) + band) % max;
    });

    if (trace) console.log("[LoopScanner‑12.3] MULTI:", { indices, presence, harmonicDrift });
    return indices;
  }

  // ========================================================================
  // MODE 4 — EDGE LOOP INDEX (OUTLINE EMPHASIS)
  // ========================================================================
  function nextIndexEdge(signal, max, spinPhase = 0, presence = 0, harmonicDrift = 0) {
    const base = signalToNumber(signal);
    const band = dualBandOffset(max, presence, harmonicDrift);

    const edgeBias = (base % 2 === 0) ? 0 : max - 1;

    const idx = Math.abs(edgeBias + Math.floor(spinPhase) + band) % max;

    if (trace) console.log("[LoopScanner‑12.3] EDGE:", { idx, presence, harmonicDrift });
    return idx;
  }

  // ========================================================================
  // MODE 5 — FLAT LOOP INDEX (LOW-VARIANCE, CALMING)
  // ========================================================================
  function nextIndexFlat(signal, max, presence = 0, harmonicDrift = 0) {
    const base = signalToNumber(signal);
    const band = dualBandOffset(max, presence, harmonicDrift);

    const flatBase = Math.floor((base % max) * 0.1);
    const idx = (flatBase + band) % max;

    if (trace) console.log("[LoopScanner‑12.3] FLAT:", { idx, presence, harmonicDrift });
    return idx;
  }

  // ========================================================================
  // ORGAN EXPORT (API-COMPATIBLE)
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
// HELPERS
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
