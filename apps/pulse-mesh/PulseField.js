// ============================================================================
// [pulse:mesh] PULSE_MESH_ENVIRONMENTAL_FIELD v7.4  // teal
// Internal Weather System • Metadata-Only • Stabilization + Pressure Signals
// ============================================================================
//
// NEW IN v7.4:
//  • Field now absorbs system-level pressure signals:
//      - flowPressure (0–1)
//      - recentThrottleRate (0–1)
//      - auraTension (0–1)
//      - reflexDropRate (0–1)
//      - meshStormPressure (0–1)
//  • Still metadata-only, deterministic, read-only to organs.
// ============================================================================

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

  // NEW v7.4: system pressure
  flowPressure: 0,          // from FlowGuard
  throttleRate: 0,          // from Halo
  auraTension: 0,           // from Aura
  reflexDropRate: 0,        // from Halo reflex_drops / impulses
  meshStormPressure: 0,     // from mesh hops / storms

  // External influence markers
  externalHeat: 0,
  externalStorm: 0,
  externalSignal: 0,

  meta: {
    layer: "PulseField",
    role: "ENVIRONMENTAL_FIELD",
    version: 7.4,
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
      futureEvolutionReady: true
    }
  }
};

// -----------------------------------------------------------
// FIELD UPDATE API (trusted writers only)
// -----------------------------------------------------------

export const PulseFieldControl = {
  setFriction(v) { FieldState.friction = clamp01(v); },
  setNoise(v) { FieldState.noise = clamp01(v); },
  setStability(v) { FieldState.stability = clamp01(v); },
  setResonance(v) { FieldState.resonance = clamp01(v); },
  setLoadWave(v) { FieldState.loadWave = clamp01(v); },
  setDriftPressure(v) { FieldState.driftPressure = clamp01(v); },

  // NEW v7.4: system pressure setters
  setFlowPressure(v) { FieldState.flowPressure = clamp01(v); },
  setThrottleRate(v) { FieldState.throttleRate = clamp01(v); },
  setAuraTension(v) { FieldState.auraTension = clamp01(v); },
  setReflexDropRate(v) { FieldState.reflexDropRate = clamp01(v); },
  setMeshStormPressure(v) { FieldState.meshStormPressure = clamp01(v); },

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

export const PulseField = {
  snapshot() { return { ...FieldState }; },

  getFriction() { return FieldState.friction; },
  getNoise() { return FieldState.noise; },
  getStability() { return FieldState.stability; },
  getResonance() { return FieldState.resonance; },
  getLoadWave() { return FieldState.loadWave; },
  getDriftPressure() { return FieldState.driftPressure; },

  // NEW v7.4
  getFlowPressure() { return FieldState.flowPressure; },
  getThrottleRate() { return FieldState.throttleRate; },
  getAuraTension() { return FieldState.auraTension; },
  getReflexDropRate() { return FieldState.reflexDropRate; },
  getMeshStormPressure() { return FieldState.meshStormPressure; },

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
