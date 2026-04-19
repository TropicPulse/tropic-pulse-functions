// -----------------------------------------------------------
// [pulse:field] PULSE_OS_ENVIRONMENTAL_FIELD  // teal
// -----------------------------------------------------------
// ROLE:
//   - Internal "weather system" of the organism
//   - Holds global environmental metadata that influences interpretation
//   - NEVER computes payloads
//   - NEVER mutates impulses directly
//   - Provides read-only field values to other organs
//
// THEME:
//   - Color: Teal (environment, currents, subtle forces)
//   - Subtheme: Pressure, friction, resonance, stability
//
// SAFETY CONTRACT:
//   - Metadata-only
//   - No routing control
//   - No direct hormone/memory writes
//   - No loops, no sync, no autonomy
//   - Can be updated by trusted external sources (e.g. PulseEnvironment)
// -----------------------------------------------------------

// -----------------------------------------------------------
// INTERNAL FIELD STATE (metadata-only)
// -----------------------------------------------------------

const FieldState = {
  // Global "weather"
  friction: 0,        // 0–1: how much resistance the system feels
  noise: 0,           // 0–1: how noisy inputs/conditions are
  stability: 1,       // 0–1: how stable the organism is overall
  resonance: 0,       // 0–1: how aligned flows are

  // Pressure + load
  loadWave: 0,        // 0–1: global load wave intensity
  driftPressure: 0,   // 0–1: tendency toward drift

  // External influence markers (fed by PulseEnvironment)
  externalHeat: 0,    // 0–1
  externalStorm: 0,   // 0–1
  externalSignal: 0,  // 0–1: strength of external "world" signal
};

// -----------------------------------------------------------
// FIELD UPDATE API (trusted writers only)
// -----------------------------------------------------------
// These are the ONLY ways to change the field.
// Intended for: PulseEnvironment, admin tools, controlled systems.

export const PulseFieldControl = {
  setFriction(value) {
    FieldState.friction = clamp01(value);
  },
  setNoise(value) {
    FieldState.noise = clamp01(value);
  },
  setStability(value) {
    FieldState.stability = clamp01(value);
  },
  setResonance(value) {
    FieldState.resonance = clamp01(value);
  },
  setLoadWave(value) {
    FieldState.loadWave = clamp01(value);
  },
  setDriftPressure(value) {
    FieldState.driftPressure = clamp01(value);
  },
  setExternalHeat(value) {
    FieldState.externalHeat = clamp01(value);
  },
  setExternalStorm(value) {
    FieldState.externalStorm = clamp01(value);
  },
  setExternalSignal(value) {
    FieldState.externalSignal = clamp01(value);
  },

  // Bulk update from PulseEnvironment-style object
  applyEnvironmentSnapshot(env = {}) {
    if ('friction' in env) this.setFriction(env.friction);
    if ('noise' in env) this.setNoise(env.noise);
    if ('stability' in env) this.setStability(env.stability);
    if ('resonance' in env) this.setResonance(env.resonance);
    if ('loadWave' in env) this.setLoadWave(env.loadWave);
    if ('driftPressure' in env) this.setDriftPressure(env.driftPressure);
    if ('externalHeat' in env) this.setExternalHeat(env.externalHeat);
    if ('externalStorm' in env) this.setExternalStorm(env.externalStorm);
    if ('externalSignal' in env) this.setExternalSignal(env.externalSignal);
  },
};

// -----------------------------------------------------------
// FIELD READ API (organs + flow can read, never write)
// -----------------------------------------------------------

export const PulseField = {
  snapshot() {
    return { ...FieldState };
  },

  // Convenience accessors
  getFriction() {
    return FieldState.friction;
  },
  getNoise() {
    return FieldState.noise;
  },
  getStability() {
    return FieldState.stability;
  },
  getResonance() {
    return FieldState.resonance;
  },
  getLoadWave() {
    return FieldState.loadWave;
  },
  getDriftPressure() {
    return FieldState.driftPressure;
  },
  getExternalHeat() {
    return FieldState.externalHeat;
  },
  getExternalStorm() {
    return FieldState.externalStorm;
  },
  getExternalSignal() {
    return FieldState.externalSignal;
  },
};

// -----------------------------------------------------------
// Helper
// -----------------------------------------------------------

function clamp01(v) {
  if (typeof v !== 'number' || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
