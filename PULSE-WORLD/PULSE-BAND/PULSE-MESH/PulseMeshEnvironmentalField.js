// ============================================================================
// [pulse:mesh] PULSE_MESH_ENVIRONMENTAL_FIELD v12.3-PRESENCE-EVO-MAX-PRIME // teal
// Internal Weather System • Metadata-Only • Stabilization + Pressure Signals
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof
// ============================================================================
//
// IDENTITY — THE ENVIRONMENTAL FIELD (v12.3):
// -------------------------------------------
// • The organism’s internal “weather system.”
// • Aggregates friction, noise, stability, resonance, drift, load, and pressure.
// • Holds system-pressure indicators for Flow, Aura, Reflex, Mesh, Factoring,
//   Binary vs Symbolic mode pressure, and Presence-band pressure.
// • Read-only to all organs except trusted CNS Brain writers.
// • Pure metadata-only stabilization layer — zero compute, zero routing.
// • NOT blood pressure — this is atmospheric/system pressure.
//
// SAFETY CONTRACT (v12.3):
// -------------------------
// • No payload access.
// • No compute.
// • No routing.
// • No autonomy.
// • No imports.
// • Deterministic-field: same inputs → same field state.
// • Unified-advantage-field: inherits all safe systemic advantages.
// • Drift-proof, multi-instance-ready, factoring-aware, mesh-pressure-aware,
//   binary-aware, dual-band-ready, presence-aware.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshEnvironmentalField",
  version: "v14.9-MESH-ENVIRONMENTAL",
  layer: "mesh",
  role: "mesh_internal_weather_system",
  lineage: "PulseMesh-v14",

  evo: {
    environmentalField: true,       // This IS the internal weather organ
    metadataOnly: true,             // No compute, no routing, no autonomy
    deterministic: true,            // Must be stable
    driftProof: true,               // No drift in pressure/tension fields
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Reads mesh topology
    binaryAware: true,              // Binary pressure/tension hints
    dualBand: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshAwareness",
      "PulseMeshAura",
      "PulseMeshFlow"
    ],
    never: [
      "legacyEnvironmentalField",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// ============================================================================
export function createPulseField({ log, warn, error }) {

  // -----------------------------------------------------------
  // INTERNAL FIELD STATE (metadata-only)
  // -----------------------------------------------------------
  const FieldState = {
    // Global "weather"
    friction: 0,
    noise: 0,
    stability: 1,
    resonance: 0,

    // Pressure + load
    loadWave: 0,
    driftPressure: 0,

    // System pressure
    flowPressure: 0,
    throttleRate: 0,
    auraTension: 0,
    reflexDropRate: 0,
    meshStormPressure: 0,

    // Factoring pressure
    factoringPressure: 0,

    // External influence markers
    externalHeat: 0,
    externalStorm: 0,
    externalSignal: 0,

    // Mode pressure (binary vs symbolic vs dual)
    binaryModePressure: 0,
    symbolicModePressure: 0,
    dualModeResonance: 0,

    // Presence-band pressure (v12.3)
    presenceSymbolicPressure: 0,
    presenceBinaryPressure: 0,
    presenceDualPressure: 0,

    meta: {
      layer: "PulseField",
      role: "ENVIRONMENTAL_FIELD",
      version: "12.3-PRESENCE-EVO-MAX-PRIME",
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

        presenceAware: true,
        bandAware: true,

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true
      }
    }
  };


  // -----------------------------------------------------------
  // FIELD UPDATE API (trusted CNS writers only)
  // -----------------------------------------------------------
  const PulseFieldControl = {
    setFriction(v) { FieldState.friction = clamp01(v); },
    setNoise(v) { FieldState.noise = clamp01(v); },
    setStability(v) { FieldState.stability = clamp01(v); },
    setResonance(v) { FieldState.resonance = clamp01(v); },
    setLoadWave(v) { FieldState.loadWave = clamp01(v); },
    setDriftPressure(v) { FieldState.driftPressure = clamp01(v); },

    // System pressure setters
    setFlowPressure(v) { FieldState.flowPressure = clamp01(v); },
    setThrottleRate(v) { FieldState.throttleRate = clamp01(v); },
    setAuraTension(v) { FieldState.auraTension = clamp01(v); },
    setReflexDropRate(v) { FieldState.reflexDropRate = clamp01(v); },
    setMeshStormPressure(v) { FieldState.meshStormPressure = clamp01(v); },

    // Factoring pressure
    setFactoringPressure(v) { FieldState.factoringPressure = clamp01(v); },

    // External environment
    setExternalHeat(v) { FieldState.externalHeat = clamp01(v); },
    setExternalStorm(v) { FieldState.externalStorm = clamp01(v); },
    setExternalSignal(v) { FieldState.externalSignal = clamp01(v); },

    // Mode pressure
    setBinaryModePressure(v) { FieldState.binaryModePressure = clamp01(v); },
    setSymbolicModePressure(v) { FieldState.symbolicModePressure = clamp01(v); },
    setDualModeResonance(v) { FieldState.dualModeResonance = clamp01(v); },

    // Presence-band pressure (v12.3)
    setPresenceSymbolicPressure(v) { FieldState.presenceSymbolicPressure = clamp01(v); },
    setPresenceBinaryPressure(v) { FieldState.presenceBinaryPressure = clamp01(v); },
    setPresenceDualPressure(v) { FieldState.presenceDualPressure = clamp01(v); },

    // Bulk update from PulseEnvironment or system pressure snapshot
    applyEnvironmentSnapshot(env = {}) {
      for (const key in env) {
        if (key in FieldState) {
          const setter = this[`set${key[0].toUpperCase()}${key.slice(1)}`];
          if (setter) setter.call(this, env[key]);
        }
      }
    }
  };


  // -----------------------------------------------------------
  // FIELD READ API
  // -----------------------------------------------------------
  const PulseField = {
    snapshot() { return { ...FieldState }; },

    getFriction() { return FieldState.friction; },
    getNoise() { return FieldState.noise; },
    getStability() { return FieldState.stability; },
    getResonance() { return FieldState.resonance; },
    getLoadWave() { return FieldState.loadWave; },
    getDriftPressure() { return FieldState.driftPressure; },

    getFlowPressure() { return FieldState.flowPressure; },
    getThrottleRate() { return FieldState.throttleRate; },
    getAuraTension() { return FieldState.auraTension; },
    getReflexDropRate() { return FieldState.reflexDropRate; },
    getMeshStormPressure() { return FieldState.meshStormPressure; },

    getFactoringPressure() { return FieldState.factoringPressure; },

    getExternalHeat() { return FieldState.externalHeat; },
    getExternalStorm() { return FieldState.externalStorm; },
    getExternalSignal() { return FieldState.externalSignal; },

    getBinaryModePressure() { return FieldState.binaryModePressure; },
    getSymbolicModePressure() { return FieldState.symbolicModePressure; },
    getDualModeResonance() { return FieldState.dualModeResonance; },

    getPresenceSymbolicPressure() { return FieldState.presenceSymbolicPressure; },
    getPresenceBinaryPressure() { return FieldState.presenceBinaryPressure; },
    getPresenceDualPressure() { return FieldState.presenceDualPressure; },

    getMeta() { return FieldState.meta; }
  };


  // -----------------------------------------------------------
  // Helper
  // -----------------------------------------------------------
  function clamp01(v) {
    if (typeof v !== "number" || Number.isNaN(v)) return 0;
    return Math.max(0, Math.min(1, v));
  }


  // -----------------------------------------------------------
  // PUBLIC INTERFACE
  // -----------------------------------------------------------
  return {
    control: PulseFieldControl,
    read: PulseField,
    meta: FieldState.meta
  };
}
