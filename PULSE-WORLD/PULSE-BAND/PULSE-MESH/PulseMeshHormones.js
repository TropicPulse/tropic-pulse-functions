// ============================================================================
// [pulse:mesh] COMMUNITY_HORMONE_LAYER v12.3-PRESENCE-EVO-MAX-PRIME  // pink
// Global Modulation Layer • Metadata-Only • Deterministic Influence Tags
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof
// ============================================================================
//
// IDENTITY — HORMONES (v12.3):
// ----------------------------
// • Pure metadata-only modulation layer.
// • Reads system pressure (Field + SDN context) and emits deterministic tags.
// • NEVER mutates payloads.
// • NEVER mutates score or energy.
// • NEVER computes or synthesizes dynamic state.
// • No internal hormone state — pure reflection.
// • Other organs MAY interpret tags; hormones never enforce behavior.
// • Presence-aware, binary-aware, dual-band-ready, deterministic-field.
//
// SAFETY CONTRACT (v12.3):
// -------------------------
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
  // META — v12.3 identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseHormones",
    role: "GLOBAL_MODULATION",
    version: "12.3-PRESENCE-EVO-MAX-PRIME",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
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
  // HORMONE ENGINE (v12.3)
  // Pure reflection: no internal state, no synthesis, no mutation.
  // ---------------------------------------------------------------------------
  function applyPulseHormones(impulse, context = {}) {
    impulse.flags = impulse.flags || {};
    impulse.flags.hormone_meta = meta;

    // Read system pressure from Field (v12.3)
    const field = PulseFieldRead.snapshot();

    const p  = field.flowPressure ?? 0;
    const t  = field.throttleRate ?? 0;
    const d  = field.driftPressure ?? 0;
    const a  = field.auraTension ?? 0;
    const m  = field.meshStormPressure ?? 0;
    const f  = field.factoringPressure ?? 0;

    // Mode pressure
    const bp = field.binaryModePressure ?? 0;
    const sp = field.symbolicModePressure ?? 0;
    const dr = field.dualModeResonance ?? 0;

    // Presence-band pressure (v12.3)
    const pb = field.presenceBinaryPressure ?? 0;
    const ps = field.presenceSymbolicPressure ?? 0;
    const pd = field.presenceDualPressure ?? 0;


    // -------------------------------------------------------------------------
    // Deterministic hormone tags (v12.3)
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
    // v12.3: Binary-Aware + Presence-Aware Hormone Reflection
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

    // Presence-band pressures
    if (pb > 0.3) {
      impulse.flags.hormone_presence_binary = pb;
      impulse.flags.hormone_prefers_presence_binary = true;
    }

    if (ps > 0.3) {
      impulse.flags.hormone_presence_symbolic = ps;
      impulse.flags.hormone_prefers_presence_symbolic = true;
    }

    if (pd > 0.2) {
      impulse.flags.hormone_presence_dual = pd;
      impulse.flags.hormone_prefers_presence_dual = true;
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
