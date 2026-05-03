// ============================================================================
// [pulse:mesh] COMMUNITY_HORMONE_LAYER v15-EVO-IMMORTAL  // pink
// Global Modulation Layer • Metadata-Only • Deterministic Influence Tags
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof • Advantage-Aware
// ============================================================================
//
// IDENTITY — HORMONES (v15-EVO-IMMORTAL):
// --------------------------------------
// • Pure metadata-only modulation layer.
// • Reads system pressure (Field + SDN context) and emits deterministic tags.
// • NEVER mutates payloads.
// • NEVER mutates score or energy.
// • NEVER computes or synthesizes dynamic state.
// • No internal hormone state — pure reflection.
// • Other organs MAY interpret tags; hormones never enforce behavior.
// • Presence-aware, binary-aware, dual-band-ready, deterministic-field,
//   unified-advantage-field, mesh-pressure-aware, flow-aware, drift-aware,
//   advantage-aware, chunk/prewarm-ready.
//
// SAFETY CONTRACT (v15):
// ----------------------
// • No payload access.
// • No score/energy mutation.
// • No routing override.
// • No autonomy.
// • No internal state mutation.
// • Deterministic-field, drift-proof.
// • Unified-advantage-field, multi-instance-ready.
// • Zero imports — all dependencies injected by CNS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshHormones",
  version: "v15-EVO-IMMORTAL",
  layer: "mesh",
  role: "mesh_hormone_signal_generator",
  lineage: "PulseMesh-v15",

  evo: {
    hormones: true,
    endocrineAware: true,
    binaryAware: true,
    symbolicAware: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true,
    chunkPrewarmReady: true,
    advantageAware: true,
    meshPressureAware: true,
    auraPressureAware: true,
    flowAware: true,
    driftAware: true,
    presenceAware: true,
    bandAware: true
  },

  contract: {
    always: [
      "PulseMeshEndocrineSystem",
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshEnvironmentalField"
    ],
    never: [
      "legacyMeshHormones",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseMeshHormones({ PulseFieldRead, log, warn, error }) {

  // ---------------------------------------------------------------------------
  // META — v15-EVO-IMMORTAL identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseHormones",
    role: "GLOBAL_MODULATION",
    version: "15-EVO-IMMORTAL",
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
      zeroRoutingInfluence: true,
      chunkPrewarmReady: true,
      advantageAware: true
    }
  };


  // ---------------------------------------------------------------------------
  // HORMONE ENGINE (v15)
  // Pure reflection: no internal state, no synthesis, no mutation.
  // ---------------------------------------------------------------------------
  function applyPulseHormones(impulse, context = {}) {
    impulse.flags = impulse.flags || {};
    impulse.flags.hormone_meta = meta;

    // Read system pressure from Field
    const field = PulseFieldRead.snapshot();

    // Core pressures
    const friction       = field.friction ?? 0;
    const noise          = field.noise ?? 0;
    const stability      = field.stability ?? 1;
    const resonance      = field.resonance ?? 0;

    const loadWave       = field.loadWave ?? 0;
    const driftPressure  = field.driftPressure ?? 0;

    const flowPressure   = field.flowPressure ?? 0;
    const throttleRate   = field.throttleRate ?? 0;
    const auraTension    = field.auraTension ?? 0;
    const reflexDropRate = field.reflexDropRate ?? 0;
    const meshStorm      = field.meshStormPressure ?? 0;

    const factoring      = field.factoringPressure ?? 0;

    // External environment
    const externalHeat   = field.externalHeat ?? 0;
    const externalStorm  = field.externalStorm ?? 0;
    const externalSignal = field.externalSignal ?? 0;

    // Mode pressure
    const binaryModePressure   = field.binaryModePressure ?? 0;
    const symbolicModePressure = field.symbolicModePressure ?? 0;
    const dualModeResonance    = field.dualModeResonance ?? 0;

    // Presence-band pressure
    const presenceSymbolic = field.presenceSymbolicPressure ?? 0;
    const presenceBinary   = field.presenceBinaryPressure ?? 0;
    const presenceDual     = field.presenceDualPressure ?? 0;

    // Context hints (SDN / caller)
    const globalLoad   = context.globalLoad ?? 0;
    const trustLevel   = context.trustLevel ?? 1;
    const echoMode     = !!context.echoMode;
    const binaryMode   = !!context.binaryMode;
    const presenceBand = context.presenceBand || impulse.band || "symbolic";


    // -------------------------------------------------------------------------
    // BASELINE HORMONE EVENT CLASSIFICATION
    // -------------------------------------------------------------------------
    // We never touch payload/score; we only tag the situation.

    const highPressure =
      flowPressure   > 0.5 ||
      throttleRate   > 0.2 ||
      driftPressure  > 0.4 ||
      meshStorm      > 0.4 ||
      factoring      > 0.4 ||
      reflexDropRate > 0.3;

    const emergencyPressure =
      flowPressure  > 0.7 ||
      throttleRate  > 0.3 ||
      factoring     > 0.6 ||
      meshStorm     > 0.6;

    const calmEnvironment =
      flowPressure   < 0.2 &&
      driftPressure  < 0.2 &&
      auraTension    < 0.2 &&
      factoring      < 0.2 &&
      meshStorm      < 0.2 &&
      friction       < 0.4 &&
      noise          < 0.4;

    // Reset any prior hormone_event (we don't rely on previous runs)
    delete impulse.flags.hormone_event;

    if (calmEnvironment) {
      impulse.flags.hormone_event       = "boost";
      impulse.flags.hormone_boost       = true;
      impulse.flags.hormone_stabilized  = true;
      impulse.flags.hormone_calm_field  = true;
    }

    if (!calmEnvironment && !highPressure) {
      impulse.flags.hormone_event          = impulse.flags.hormone_event || "stabilize";
      impulse.flags.hormone_cooling        = true;
      impulse.flags.hormone_stabilized     = true;
      impulse.flags.hormone_moderate_field = true;
    }

    if (highPressure) {
      impulse.flags.hormone_event          = "damp";
      impulse.flags.hormone_damp           = true;
      impulse.flags.hormone_cooling        = true;
      impulse.flags.hormone_stabilized     = true;
      impulse.flags.hormone_high_pressure  = true;
    }

    if (emergencyPressure) {
      impulse.flags.hormone_event             = "damp";
      impulse.flags.hormone_damp              = true;
      impulse.flags.hormone_cooling           = true;
      impulse.flags.hormone_stabilized        = true;
      impulse.flags.hormone_urgency           = true;
      impulse.flags.hormone_emergency_braking = true;
    }

    // Low stability + high drift → alert without changing event type
    if (stability < 0.6 && driftPressure > 0.3) {
      impulse.flags.hormone_drift_alert = true;
    }

    // High friction/noise → friction/noise alerts
    if (friction > 0.5) {
      impulse.flags.hormone_friction_alert = true;
    }
    if (noise > 0.5) {
      impulse.flags.hormone_noise_alert = true;
    }

    // External environment shaping
    if (externalHeat > 0.5) {
      impulse.flags.hormone_external_heat = true;
    }
    if (externalStorm > 0.5) {
      impulse.flags.hormone_external_storm = true;
    }
    if (externalSignal > 0.5) {
      impulse.flags.hormone_external_signal = true;
    }


    // -------------------------------------------------------------------------
    // BINARY / SYMBOLIC / DUAL-MODE HORMONE REFLECTION
    // -------------------------------------------------------------------------
    if (binaryModePressure > 0.3) {
      impulse.flags.hormone_binary_bias        = binaryModePressure;
      impulse.flags.hormone_prefers_binary     = true;
      impulse.flags.hormone_binary_pressure    = true;
    }

    if (symbolicModePressure > 0.3) {
      impulse.flags.hormone_symbolic_bias      = symbolicModePressure;
      impulse.flags.hormone_prefers_symbolic   = true;
      impulse.flags.hormone_symbolic_pressure  = true;
    }

    if (dualModeResonance > 0.2) {
      impulse.flags.hormone_dual_mode_resonance = dualModeResonance;
      impulse.flags.hormone_dual_mode_ready     = true;
      impulse.flags.hormone_dual_mode_sweetspot = true;
    }

    // Presence-band pressures
    if (presenceBinary > 0.3) {
      impulse.flags.hormone_presence_binary              = presenceBinary;
      impulse.flags.hormone_prefers_presence_binary      = true;
      impulse.flags.hormone_presence_binary_pressure     = true;
    }

    if (presenceSymbolic > 0.3) {
      impulse.flags.hormone_presence_symbolic            = presenceSymbolic;
      impulse.flags.hormone_prefers_presence_symbolic    = true;
      impulse.flags.hormone_presence_symbolic_pressure   = true;
    }

    if (presenceDual > 0.2) {
      impulse.flags.hormone_presence_dual                = presenceDual;
      impulse.flags.hormone_prefers_presence_dual        = true;
      impulse.flags.hormone_presence_dual_pressure       = true;
    }

    // Tag the band we are actually in for downstream interpretation
    impulse.flags.hormone_presence_band = presenceBand;
    if (binaryMode) {
      impulse.flags.hormone_binary_mode_active = true;
    }


    // -------------------------------------------------------------------------
    // ADVANTAGE / FACTORING / MESH-PRESSURE AWARENESS
    // -------------------------------------------------------------------------
    if (factoring > 0.3) {
      impulse.flags.hormone_factoring_pressure      = factoring;
      impulse.flags.hormone_prefers_factored_paths  = true;
      impulse.flags.hormone_advantage_factoring     = true;
    }

    if (meshStorm > 0.3) {
      impulse.flags.hormone_mesh_storm_pressure = meshStorm;
      impulse.flags.hormone_mesh_storm_alert    = true;
    }

    if (auraTension > 0.3) {
      impulse.flags.hormone_aura_tension_pressure = auraTension;
      impulse.flags.hormone_aura_tension_alert    = true;
    }

    if (reflexDropRate > 0.2) {
      impulse.flags.hormone_reflex_drop_pressure = reflexDropRate;
      impulse.flags.hormone_reflex_guard_alert   = true;
    }

    // Advantage cascade hint: high binary pressure + factoring + mesh storm
    if (binaryModePressure > 0.4 && factoring > 0.3 && meshStorm > 0.3) {
      impulse.flags.hormone_advantage_cascade_hotspot = true;
    }

    // Global load + trust shaping (still metadata-only)
    if (globalLoad > 0.7) {
      impulse.flags.hormone_global_load_high = true;
    }
    if (trustLevel < 0.5) {
      impulse.flags.hormone_low_trust_context = true;
    }

    // Echo mode: mark as diagnostic-only modulation
    if (echoMode) {
      impulse.flags.hormone_echo_mode = true;
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
