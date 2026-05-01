// ============================================================================
// FILE: /PulseOS/PULSE-TOOLS/PulseBinaryWaveScanner.js
// PULSE OS — v12.3-EVO
// PURE BINARY WAVE ORGAN — ZERO DRIFT, MULTI-SPIN, PRESENCE/HARMONICS-AWARE
// ============================================================================
// ROLE (12.3-EVO):
//   - Convert binary pulses → deterministic waveforms.
//   - Drive contrast, depth, “see-through”, edge emphasis for all layers.
//   - Zero randomness, zero timestamps, zero mutation.
//   - Multi-spin aware (3-phase wave sets).
//   - Dual-band aware: optional presence/harmonics bias depth/contrast, still deterministic.
//   - Pairs with BinaryPulse‑v12.3‑EVO + PulseBinaryLoopScanner‑v12.3‑EVO.
//
// WAVE MODES (v12.3-EVO, API-COMPATIBLE):
//   • nextWave       → standard wave (balanced detail)
//   • nextWaveDeep   → slower, deeper, high-contrast wave
//   • nextWaveMulti  → 3-phase multi-spin wave set
//   • nextWaveEdge   → edge/outline emphasis
//   • nextWaveFlat   → low-depth, high-stability baseline
//
// NOTE:
//   - Signatures accept optional dual-band scalars but remain v11-safe:
//       nextWave(bits, presence = 0, harmonicBias = 0)
//       nextWaveDeep(bits, presence = 0, harmonicBias = 0)
//       nextWaveMulti(bits, presence = 0, harmonicBias = 0)
//       nextWaveEdge(bits, presence = 0, harmonicBias = 0)
//       nextWaveFlat(bits, presence = 0, harmonicBias = 0)
//   - Callers that pass only (bits) get pure v11 behavior.
// ============================================================================

export function createBinaryWaveScanner({ trace = false } = {}) {
  let t = 0; // deterministic tick counter

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
  // CORE METRICS
  // ---------------------------------------------------------------------------
  function amplitudeFromBits(bits) {
    let ones = 0;
    for (let i = 0; i < bits.length; i++) ones += bits[i];
    return bits.length ? ones / bits.length : 0; // 0..1
  }

  function nextPhase(step = 1) {
    t += step;
    return (t % 360) * (Math.PI / 180); // radians
  }

  function dualBandScale(presence = 0, harmonicBias = 0) {
    const p = clamp(presence, 0, 1);
    const h = clamp(harmonicBias, 0, 1);
    // 0.8–1.2 range: subtle but real influence
    return 0.8 + (p * 0.15 + h * 0.25);
  }

  function buildWave(amplitude, phase, depthScale, reflectScale, presence = 0, harmonicBias = 0) {
    const band = dualBandScale(presence, harmonicBias);
    return {
      phase,
      amplitude,
      depth: amplitude * depthScale * band * Math.abs(Math.sin(phase * 0.5)),
      reflection: reflectScale * band * Math.abs(Math.cos(phase * 0.75))
    };
  }

  // ========================================================================
  // MODE 1 — STANDARD WAVE (BALANCED DETAIL)
// ========================================================================
  function nextWave(bits, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner‑12.3] non-binary bits passed to nextWave");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(1);

    const wave = buildWave(amp, phase, 1.0, 1.0, presence, harmonicBias);

    if (trace) console.log("[BinaryWaveScanner‑12.3] STANDARD:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 2 — DEEP WAVE (SLOW, HIGH CONTRAST, MRI-LIKE)
// ========================================================================
  function nextWaveDeep(bits, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner‑12.3] non-binary bits passed to nextWaveDeep");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(0.25);

    const wave = buildWave(amp, phase, 1.4, 0.9, presence, harmonicBias);

    if (trace) console.log("[BinaryWaveScanner‑12.3] DEEP:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 3 — MULTI WAVE (3-PHASE MULTI-SPIN)
// ========================================================================
  function nextWaveMulti(bits, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner‑12.3] non-binary bits passed to nextWaveMulti");
    }

    const amp = amplitudeFromBits(bits);
    const basePhase = nextPhase(1);
    const band = dualBandScale(presence, harmonicBias);

    const waves = [0, 1, 2].map(i => {
      const phase = basePhase + (Math.PI * 2 * i) / 3;
      return {
        phase,
        amplitude: amp,
        depth: amp * band * Math.abs(Math.sin(phase * 0.5)),
        reflection: band * Math.abs(Math.cos(phase * 0.75)),
        spinIndex: i
      };
    });

    if (trace) console.log("[BinaryWaveScanner‑12.3] MULTI:", waves);
    return waves;
  }

  // ========================================================================
  // MODE 4 — EDGE WAVE (OUTLINE EMPHASIS)
// ========================================================================
  function nextWaveEdge(bits, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner‑12.3] non-binary bits passed to nextWaveEdge");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(1);
    const band = dualBandScale(presence, harmonicBias);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * band * Math.abs(Math.sin(phase)),      // sharper depth
      reflection: band * Math.abs(Math.sin(phase * 1.5))  // edge-like reflection
    };

    if (trace) console.log("[BinaryWaveScanner‑12.3] EDGE:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 5 — FLAT WAVE (LOW DEPTH, HIGH STABILITY)
// ========================================================================
  function nextWaveFlat(bits, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner‑12.3] non-binary bits passed to nextWaveFlat");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(0.1);
    const band = dualBandScale(presence, harmonicBias);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * 0.2 * band,           // very shallow, slightly band-shaped
      reflection: (0.5 + amp * 0.3) * band
    };

    if (trace) console.log("[BinaryWaveScanner‑12.3] FLAT:", wave);
    return wave;
  }

  // ========================================================================
  // ORGAN EXPORT
  // ========================================================================
  return {
    nextWave,
    nextWaveDeep,
    nextWaveMulti,
    nextWaveEdge,
    nextWaveFlat
  };
}

// ---------------------------------------------------------------------------
// UTIL
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
