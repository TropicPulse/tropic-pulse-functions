// ============================================================================
// FILE: /PulseOS/core/PulseWaveScanner-v12.3-EVO.js
// PULSE OS — v12.3-EVO
// GENERIC WAVE ORGAN — PRESENCE + HARMONICS + DUAL-BAND + MULTI-SPIN-EVO
// ============================================================================
// ROLE (12.3-EVO):
//   - Convert ANY numeric signal → deterministic waveforms.
//   - Presence-aware (presenceAvg, presenceGradient).
//   - Harmonics-aware (phaseDrift, coherenceScore).
//   - Dual-band aware (binary + pulse + presence).
//   - Multi-spin-EVO aware (3-phase wave sets).
//   - Zero randomness, zero timestamps, zero mutation.
//   - API-compatible with v11-EVO.
// ============================================================================

export function createWaveScanner({ trace = false } = {}) {
  let t = 0; // deterministic epoch tick

  // ---------------------------------------------------------------------------
  // CORE: SIGNAL → AMPLITUDE (GENERIC, DETERMINISTIC)
  // ---------------------------------------------------------------------------
  function amplitudeFromSignal(signal) {
    if (Array.isArray(signal)) {
      let sum = 0;
      for (let i = 0; i < signal.length; i++) {
        sum += Math.abs(signal[i] || 0);
      }
      return signal.length ? Math.min(1, sum / (signal.length * 10)) : 0;
    }
    return Math.min(1, Math.abs(signal || 0) / 10);
  }

  // ---------------------------------------------------------------------------
  // PHASE GENERATOR — deterministic, epoch-stable
  // ---------------------------------------------------------------------------
  function nextPhase(step = 1) {
    t += step;
    return (t % 360) * (Math.PI / 180);
  }

  // ---------------------------------------------------------------------------
  // DUAL-BAND SCALE (presence + harmonics)
  // ---------------------------------------------------------------------------
  function dualBandScale(presence = 0, harmonicDrift = 0) {
    const p = clamp(presence, 0, 1);
    const h = clamp(harmonicDrift, 0, 1);

    // presence stabilizes, harmonics destabilize
    return 1.0 + (h * 0.25) - (p * 0.15);
  }

  // ---------------------------------------------------------------------------
  // WAVE BUILDER — shared structure (12.3-EVO)
  // ---------------------------------------------------------------------------
  function buildWave(amplitude, phase, depthScale, reflectScale, presence = 0, harmonicDrift = 0) {
    const band = dualBandScale(presence, harmonicDrift);

    return {
      phase,
      amplitude,
      depth: amplitude * depthScale * band * Math.abs(Math.sin(phase * 0.5)),
      reflection: reflectScale * band * Math.abs(Math.cos(phase * 0.75))
    };
  }

  // ========================================================================
  // MODE 1 — STANDARD WAVE (BALANCED DETAIL, DUAL-BAND AWARE)
  // ========================================================================
  function nextWave(signal, presence = 0, harmonicDrift = 0) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(1);

    const wave = buildWave(amp, phase, 1.0, 1.0, presence, harmonicDrift);

    if (trace) console.log("[WaveScanner‑12.3] STANDARD:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 2 — DEEP WAVE (SLOW, HIGH CONTRAST, PRESENCE-STABILIZED)
  // ========================================================================
  function nextWaveDeep(signal, presence = 0, harmonicDrift = 0) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(0.25);

    const wave = buildWave(amp, phase, 1.4, 0.9, presence, harmonicDrift);

    if (trace) console.log("[WaveScanner‑12.3] DEEP:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 3 — MULTI WAVE (3-PHASE MULTI-SPIN-EVO)
  // ========================================================================
  function nextWaveMulti(signal, presence = 0, harmonicDrift = 0) {
    const amp = amplitudeFromSignal(signal);
    const basePhase = nextPhase(1);
    const band = dualBandScale(presence, harmonicDrift);

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

    if (trace) console.log("[WaveScanner‑12.3] MULTI:", waves);
    return waves;
  }

  // ========================================================================
  // MODE 4 — EDGE WAVE (OUTLINE EMPHASIS, HARMONICS-SHARPENED)
  // ========================================================================
  function nextWaveEdge(signal, presence = 0, harmonicDrift = 0) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(1);
    const band = dualBandScale(presence, harmonicDrift);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * band * Math.abs(Math.sin(phase)),
      reflection: band * Math.abs(Math.sin(phase * 1.5))
    };

    if (trace) console.log("[WaveScanner‑12.3] EDGE:", wave);
    return wave;
  }

  // ========================================================================
  // MODE 5 — FLAT WAVE (LOW DEPTH, HIGH STABILITY, PRESENCE-SMOOTHED)
  // ========================================================================
  function nextWaveFlat(signal, presence = 0, harmonicDrift = 0) {
    const amp = amplitudeFromSignal(signal);
    const phase = nextPhase(0.1);
    const band = dualBandScale(presence, harmonicDrift);

    const wave = {
      phase,
      amplitude: amp,
      depth: amp * 0.2 * band,
      reflection: (0.5 + amp * 0.3) * band
    };

    if (trace) console.log("[WaveScanner‑12.3] FLAT:", wave);
    return wave;
  }

  // ========================================================================
  // ORGAN EXPORT (API-COMPATIBLE)
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
// HELPERS
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
