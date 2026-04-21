// ============================================================================
// [pulse:mesh] PULSE_MESH_ENVIRONMENTAL_FIELD v9.2  // teal
// Internal Weather System • Metadata-Only • Stabilization + Pressure Signals
// ============================================================================
//
// IDENTITY — THE ENVIRONMENTAL FIELD (v9.2):
// ------------------------------------------
// • The organism’s internal “weather system.”
// • Aggregates friction, noise, stability, resonance, drift, load, and pressure.
// • Holds system-pressure indicators for Flow, Aura, Reflex, Mesh, and Factoring.
// • Read-only to all organs except trusted CNS Brain writers.
// • Pure metadata-only stabilization layer — zero compute, zero routing.
// • NOT blood pressure — this is atmospheric/system pressure.
//
// SAFETY CONTRACT (v9.2):
// • No payload access.
// • No compute.
// • No routing.
// • No autonomy.
// • No imports.
// • Deterministic-field: same inputs → same field state.
// • Unified-advantage-field: inherits all safe systemic advantages.
// • Drift-proof, multi-instance-ready, factoring-aware, mesh-pressure-aware.
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
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

    // System pressure (v9.2)
    flowPressure: 0,
    throttleRate: 0,
    auraTension: 0,
    reflexDropRate: 0,
    meshStormPressure: 0,

    // NEW v9.2 — factoring pressure (mesh signal factoring awareness)
    factoringPressure: 0,

    // External influence markers
    externalHeat: 0,
    externalStorm: 0,
    externalSignal: 0,

    meta: {
      layer: "PulseField",
      role: "ENVIRONMENTAL_FIELD",
      version: 9.2,
      target: "full-mesh",
      selfRepairable: true,
      evo: {
        dualMode: true,
        localAware: true,
        internetAware: true,

        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,

        unifiedAdvantageField: true,
        deterministicField: true,
        futureEvolutionReady: true,

        // NEW v9.2 awareness fields
        signalFactoringAware: true,
        meshPressureAware: true,
        auraPressureAware: true
      }
    }
  };


  // -----------------------------------------------------------
  // FIELD UPDATE API (trusted writers only)
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

    // NEW v9.2
    setFactoringPressure(v) { FieldState.factoringPressure = clamp01(v); },

    setExternalHeat(v) { FieldState.externalHeat = clamp01(v); },
    setExternalStorm(v) { FieldState.externalStorm = clamp01(v); },
    setExternalSignal(v) { FieldState.externalSignal = clamp01(v); },

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

    // NEW v9.2
    getFactoringPressure() { return FieldState.factoringPressure; },

    getExternalHeat() { return FieldState.externalHeat; },
    getExternalStorm() { return FieldState.externalStorm; },
    getExternalSignal() { return FieldState.externalSignal; },

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
