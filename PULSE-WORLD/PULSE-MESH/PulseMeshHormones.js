// ============================================================================
// [pulse:mesh] COMMUNITY_HORMONE_LAYER v11-Evo  // pink
// Global Modulation Layer • Metadata-Only • Deterministic Influence Tags
// ============================================================================
//
// IDENTITY — HORMONES (v11-Evo):
// ------------------------------
// • Pure metadata-only modulation layer.
// • Reads system pressure (Field + SDN context) and emits deterministic tags.
// • NEVER mutates payloads.
// • NEVER mutates score or energy.
// • NEVER computes or synthesizes dynamic state.
// • No internal hormone state — pure reflection.
// • Other organs MAY interpret tags; hormones never enforce behavior.
// • v11-Evo: binary-aware, dual-mode-ready, deterministic-field,
//            unified-advantage-field, drift-aware, mesh-pressure-aware.
//
// SAFETY CONTRACT (v11-Evo):
// ---------------------------
// • No payload access.
// • No score/energy mutation.
// • No routing override.
// • No autonomy.
// • No internal state mutation.
// • Deterministic-field, drift-proof.
// • Unified-advantage-field, multi-instance-ready.
// ============================================================================

export function createPulseMeshHormones({ PulseFieldRead, log, warn, error }) {

  // ---------------------------------------------------------------------------
  // META — v11-Evo identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseHormones",
    role: "GLOBAL_MODULATION",
    version: "11.0-Evo",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      localAware: true,
      internetAware: true,

      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,

      unifiedAdvantageField: true,
      deterministicField: true,
      futureEvolutionReady: true,

      signalFactoringAware: true,
      meshPressureAware: true,
      auraPressureAware: true,
      flowAware: true,
      driftAware: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    }
  };

  // ---------------------------------------------------------------------------
  // HORMONE ENGINE (v11-Evo)
  // Pure reflection: no internal state, no synthesis, no mutation.
  // ---------------------------------------------------------------------------
  function applyPulseHormones(impulse, context = {}) {
    impulse.flags = impulse.flags || {};
    impulse.flags.hormone_meta = meta;

    // Read system pressure from Field (v11-Evo)
    const field = PulseFieldRead.snapshot();

    const p = field.flowPressure ?? 0;
    const t = field.throttleRate ?? 0;
    const d = field.driftPressure ?? 0;
    const a = field.auraTension ?? 0;
    const m = field.meshStormPressure ?? 0;
    const f = field.factoringPressure ?? 0;

    // v11-Evo: binary vs symbolic mode pressure
    const bp = field.binaryModePressure ?? 0;
    const sp = field.symbolicModePressure ?? 0;
    const dr = field.dualModeResonance ?? 0;

    // -------------------------------------------------------------------------
    // Deterministic hormone tags (v11-Evo)
    // No synthesis. No internal state. Pure reflection.
    // -------------------------------------------------------------------------

    // Calm → boost + stability
    if (p < 0.2 && d < 0.2 && a < 0.2 && f < 0.2) {
      impulse.flags.hormone_event = "boost";
      impulse.flags.hormone_boost = true;
      impulse.flags.hormone_stabilized = true;
    }

    // Moderate pressure → cooling + stability
    if (p >= 0.2 || d >= 0.2 || a >= 0.2 || f >= 0.2) {
      impulse.flags.hormone_cooling = true;
      impulse.flags.hormone_stabilized = true;
    }

    // High pressure → damp + cooling + stability
    if (p > 0.5 || t > 0.2 || d > 0.4 || m > 0.4 || f > 0.4) {
      impulse.flags.hormone_event = "damp";
      impulse.flags.hormone_damp = true;
      impulse.flags.hormone_cooling = true;
      impulse.flags.hormone_stabilized = true;
    }

    // Emergency → urgency + hard damp + hard cooling
    if (p > 0.7 || t > 0.3 || f > 0.6) {
      impulse.flags.hormone_event = "damp";
      impulse.flags.hormone_damp = true;
      impulse.flags.hormone_cooling = true;
      impulse.flags.hormone_stabilized = true;
      impulse.flags.hormone_urgency = true;
    }

    // -------------------------------------------------------------------------
    // v11-Evo: Binary-Aware Hormone Reflection
    // -------------------------------------------------------------------------

    // Binary mode pressure → binary preference tag
    if (bp > 0.3) {
      impulse.flags.hormone_binary_bias = bp;
      impulse.flags.hormone_prefers_binary = true;
    }

    // Symbolic mode pressure → symbolic preference tag
    if (sp > 0.3) {
      impulse.flags.hormone_symbolic_bias = sp;
      impulse.flags.hormone_prefers_symbolic = true;
    }

    // Dual-mode resonance → dual-mode optimization tag
    if (dr > 0.2) {
      impulse.flags.hormone_dual_mode_resonance = dr;
      impulse.flags.hormone_dual_mode_ready = true;
    }

    impulse.flags.hormones_applied = true;
    return impulse;
  }

  // ---------------------------------------------------------------------------
  // PUBLIC INTERFACE
  // ---------------------------------------------------------------------------
  return {
    meta,
    apply: applyPulseHormones
  };
}
