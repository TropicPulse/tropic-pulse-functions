// ============================================================================
// FILE: /apps/PulseOS/PULSE-TOOLS/PulseBinaryWaveScanner-v11-EVO.js
// PULSE OS — v11-EVO
// PURE BINARY WAVE ORGAN — ZERO DRIFT, MULTI-SPIN, HIGH-CONTRAST
// ============================================================================
// ROLE:
//   - Convert binary pulses → deterministic waveforms.
//   - Drive contrast, depth, “see-through”, edge emphasis for all layers.
//   - Zero randomness, zero timestamps, zero mutation.
//   - Multi-spin aware (3-phase wave sets).
//   - Pairs with BinaryPulse-v11-EVO + PulseBinaryLoopScanner-v11-EVO.
//
// WAVE MODES (v11-EVO):
//   • nextWave       → standard wave (balanced detail)
//   • nextWaveDeep   → slower, deeper, high-contrast wave
//   • nextWaveMulti  → 3-phase multi-spin wave set
//   • nextWaveEdge   → edge/outline emphasis
//   • nextWaveFlat   → low-depth, high-stability baseline
//
// NOTES:
//   - 100% binary-only. Requires pure 0/1 arrays.
//   - Deterministic tick (t) ensures stable evolution.
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

  function buildWave(amplitude, phase, depthScale, reflectScale) {
    return {
      phase,
      amplitude,
      depth: amplitude * depthScale * Math.abs(Math.sin(phase * 0.5)),
      reflection: reflectScale * Math.abs(Math.cos(phase * 0.75))
    };
  }

  // ========================================================================
  // MODE 1 — STANDARD WAVE (BALANCED DETAIL)
  // ========================================================================
  function nextWave(bits) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner] non-binary bits passed to nextWave");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(1);

    const wave = buildWave(amp, phase, 1.0, 1.0);

    if (trace) console.log("[BinaryWaveScanner] STANDARD:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 2 — DEEP WAVE (SLOW, HIGH CONTRAST, MRI-LIKE)
  // ========================================================================
  function nextWaveDeep(bits) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner] non-binary bits passed to nextWaveDeep");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(0.25);

    const wave = buildWave(amp, phase, 1.4, 0.9);

    if (trace) console.log("[BinaryWaveScanner] DEEP:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 3 — MULTI WAVE (3-PHASE MULTI-SPIN)
  // ========================================================================
  function nextWaveMulti(bits) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner] non-binary bits passed to nextWaveMulti");
    }

    const amp = amplitudeFromBits(bits);
    const basePhase = nextPhase(1);

    const waves = [0, 1, 2].map(i => {
      const phase = basePhase + (Math.PI * 2 * i) / 3;
      return {
        phase,
        amplitude: amp,
        depth: amp * Math.abs(Math.sin(phase * 0.5)),
        reflection: Math.abs(Math.cos(phase * 0.75)),
        spinIndex: i
      };
    });

    if (trace) console.log("[BinaryWaveScanner] MULTI:", waves);
    return waves;
  }

  // ========================================================================
  // MODE 4 — EDGE WAVE (OUTLINE EMPHASIS)
  // ========================================================================
  function nextWaveEdge(bits) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner] non-binary bits passed to nextWaveEdge");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(1);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * Math.abs(Math.sin(phase)),          // sharper depth
      reflection: Math.abs(Math.sin(phase * 1.5))      // edge-like reflection
    };

    if (trace) console.log("[BinaryWaveScanner] EDGE:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 5 — FLAT WAVE (LOW DEPTH, HIGH STABILITY)
  // ========================================================================
  function nextWaveFlat(bits) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryWaveScanner] non-binary bits passed to nextWaveFlat");
    }

    const amp = amplitudeFromBits(bits);
    const phase = nextPhase(0.1);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * 0.2,                 // very shallow
      reflection: 0.5 + amp * 0.3       // stable reflection band
    };

    if (trace) console.log("[BinaryWaveScanner] FLAT:", wave);
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
