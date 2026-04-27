// ============================================================================
// FILE: /apps/PulseOS/core/PulseWaveScanner-v11-EVO.js
// PULSE OS — v11-EVO
// GENERIC WAVE ORGAN — NON-BINARY, DETERMINISTIC, MULTI-SPIN, ZERO-DRIFT
// ============================================================================
// ROLE:
//   - Convert ANY numeric signal → deterministic waveforms.
//   - Drive contrast, depth, “see-through”, edge emphasis for all layers.
//   - Zero randomness, zero timestamps, zero mutation.
//   - Multi-spin aware (3-phase wave sets).
//   - Designed to pair with ANY scanner (Behavior, Binary, NodeAdmin, UI).
//
// WAVE MODES (v11-EVO):
//   • nextWave       → standard wave (balanced detail)
//   • nextWaveDeep   → slower, deeper, high-contrast wave
//   • nextWaveMulti  → 3-phase multi-spin wave set
//   • nextWaveEdge   → edge/outline emphasis
//   • nextWaveFlat   → low-depth, high-stability baseline
//
// NOTES:
//   - This is the GENERIC version (NOT binary).
//   - Accepts ANY numeric array or scalar.
//   - No binary validation.
//   - No bit restrictions.
// ============================================================================

export function createWaveScanner({ trace = false } = {}) {
  let t = 0; // deterministic tick

  // ---------------------------------------------------------------------------
  // CORE: SIGNAL → AMPLITUDE (GENERIC)
  // ---------------------------------------------------------------------------
  function amplitudeFromSignal(signal) {
    if (Array.isArray(signal)) {
      let sum = 0;
      for (let i = 0; i < signal.length; i++) {
        sum += Math.abs(signal[i] || 0);
      }
      return signal.length ? Math.min(1, sum / (signal.length * 10)) : 0;
    }

    // Scalar fallback
    return Math.min(1, Math.abs(signal || 0) / 10);
  }

  // ---------------------------------------------------------------------------
  // PHASE GENERATOR — deterministic, zero drift
  // ---------------------------------------------------------------------------
  function nextPhase(step = 1) {
    t += step;
    return (t % 360) * (Math.PI / 180);
  }

  // ---------------------------------------------------------------------------
  // WAVE BUILDER — shared structure
  // ---------------------------------------------------------------------------
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
  function nextWave(signal) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(1);

    const wave = buildWave(amp, phase, 1.0, 1.0);

    if (trace) console.log("[WaveScanner-GENERIC] STANDARD:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 2 — DEEP WAVE (SLOW, HIGH CONTRAST)
  // ========================================================================
  function nextWaveDeep(signal) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(0.25);

    const wave = buildWave(amp, phase, 1.4, 0.9);

    if (trace) console.log("[WaveScanner-GENERIC] DEEP:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 3 — MULTI WAVE (3-PHASE MULTI-SPIN)
  // ========================================================================
  function nextWaveMulti(signal) {
    const amp = amplitudeFromSignal(signal);
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

    if (trace) console.log("[WaveScanner-GENERIC] MULTI:", waves);
    return waves;
  }

  // ========================================================================
  // MODE 4 — EDGE WAVE (OUTLINE EMPHASIS)
  // ========================================================================
  function nextWaveEdge(signal) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(1);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * Math.abs(Math.sin(phase)),          // sharper depth
      reflection: Math.abs(Math.sin(phase * 1.5))      // edge-like reflection
    };

    if (trace) console.log("[WaveScanner-GENERIC] EDGE:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 5 — FLAT WAVE (LOW DEPTH, HIGH STABILITY)
  // ========================================================================
  function nextWaveFlat(signal) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(0.1);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * 0.2,                 // very shallow
      reflection: 0.5 + amp * 0.3       // stable reflection band
    };

    if (trace) console.log("[WaveScanner-GENERIC] FLAT:", wave);
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
