// ============================================================================
// [pulse:mesh] PULSE_MESH_ENVIRONMENTAL_FIELD v15-EVO-IMMORTAL // teal
// Internal Weather System • Metadata-Only • Stabilization + Pressure Signals
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof • Advantage-Aware
// ============================================================================
//
// IDENTITY — THE ENVIRONMENTAL FIELD (v15-EVO-IMMORTAL):
// ------------------------------------------------------
// • The organism’s internal “weather system.”
// • Aggregates friction, noise, stability, resonance, drift, load, and pressure.
// • Holds system-pressure indicators for Flow, Aura, Reflex, Mesh, Factoring,
//   Binary vs Symbolic mode pressure, and Presence-band pressure.
// • Exposes feedback-ready pressure snapshots for Cortex, Aura, Flow, Endocrine,
//   Echo, Halo, Cognition, Mesh Awareness, Binary Mesh.
// • Read-only to all organs except trusted CNS Brain writers.
// • Pure metadata-only stabilization layer — zero routing, zero payload access.
// • NOT blood pressure — this is atmospheric/system pressure.
//
// SAFETY CONTRACT (v15):
// ----------------------
// • No payload access.
// • No routing.
// • No autonomy.
// • No imports.
// • Deterministic-field: same inputs → same field state.
// • Unified-advantage-field: inherits all safe systemic advantages.
// • Drift-proof, multi-instance-ready, factoring-aware, mesh-pressure-aware,
//   binary-aware, dual-band-ready, presence-aware, advantage-aware.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshEnvironmentalField",
  version: "v14.9-MESH-ENVIRONMENTAL-IMMORTAL",
  layer: "mesh",
  role: "mesh_internal_weather_system",
  lineage: "PulseMesh-v14",

  evo: {
    environmentalField: true,
    metadataOnly: true,
    deterministic: true,
    driftProof: true,
    presenceAware: true,
    meshAware: true,
    binaryAware: true,
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
export function createPulseField({ log, warn, error } = {}) {

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

    // Presence-band pressure
    presenceSymbolicPressure: 0,
    presenceBinaryPressure: 0,
    presenceDualPressure: 0,

    // v15: derived advantage / survival pressures
    advantagePressure: 0,          // overall advantage field tension
    survivalStress: 0,             // flow + mesh + factoring + aura tension
    meshStormRisk: 0,              // meshStormPressure + throttleRate
    binaryPreference: 0,           // bias toward binary routes
    presenceLoad: 0,               // how hard presence bands are being used

    meta: {
      layer: "PulseField",
      role: "ENVIRONMENTAL_FIELD",
      version: "15-EVO-IMMORTAL",
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

    // Presence-band pressure
    setPresenceSymbolicPressure(v) { FieldState.presenceSymbolicPressure = clamp01(v); },
    setPresenceBinaryPressure(v) { FieldState.presenceBinaryPressure = clamp01(v); },
    setPresenceDualPressure(v) { FieldState.presenceDualPressure = clamp01(v); },

    // v15: derived pressures (usually set via deriveFromDiagnostics)
    setAdvantagePressure(v) { FieldState.advantagePressure = clamp01(v); },
    setSurvivalStress(v) { FieldState.survivalStress = clamp01(v); },
    setMeshStormRisk(v) { FieldState.meshStormRisk = clamp01(v); },
    setBinaryPreference(v) { FieldState.binaryPreference = clamp01(v); },
    setPresenceLoad(v) { FieldState.presenceLoad = clamp01(v); },

    // Bulk update from PulseEnvironment or system pressure snapshot
    applyEnvironmentSnapshot(env = {}) {
      for (const key in env) {
        if (key in FieldState) {
          const setter = this[`set${key[0].toUpperCase()}${key.slice(1)}`];
          if (typeof setter === "function") setter.call(this, env[key]);
        }
      }
    },

    // v15: derive pressures from Halo + Echo + Cognition snapshots
    deriveFromDiagnostics({ halo, echo, cognition } = {}) {
      try {
        if (halo) applyHaloToField(FieldState, halo);
        if (echo) applyEchoToField(FieldState, echo);
        if (cognition) applyCognitionToField(FieldState, cognition);
        recomputeDerivedPressures(FieldState);
      } catch (e) {
        warn?.("[PulseField] deriveFromDiagnostics failed", e?.message || e);
      }
    }
  };


  // -----------------------------------------------------------
  // FIELD READ API (feedback-aware, metadata-only)
// -----------------------------------------------------------
  const PulseField = {
    snapshot() { return { ...FieldState, meta: { ...FieldState.meta, evo: { ...FieldState.meta.evo } } }; },

    // Raw scalar getters
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

    getAdvantagePressure() { return FieldState.advantagePressure; },
    getSurvivalStress() { return FieldState.survivalStress; },
    getMeshStormRisk() { return FieldState.meshStormRisk; },
    getBinaryPreference() { return FieldState.binaryPreference; },
    getPresenceLoad() { return FieldState.presenceLoad; },

    // v15: feedback snapshots for other organs (metadata-only hints)
    buildFlowHints() {
      return {
        flow_pressure: FieldState.flowPressure,
        throttle_rate: FieldState.throttleRate,
        mesh_storm_risk: FieldState.meshStormRisk,
        survival_stress: FieldState.survivalStress
      };
    },

    buildAuraHints() {
      return {
        aura_tension: FieldState.auraTension,
        drift_pressure: FieldState.driftPressure,
        factoring_pressure: FieldState.factoringPressure,
        binary_preference: FieldState.binaryPreference,
        presence_band_pressure: {
          symbolic: FieldState.presenceSymbolicPressure,
          binary: FieldState.presenceBinaryPressure,
          dual: FieldState.presenceDualPressure
        }
      };
    },

    buildCortexHints() {
      return {
        globalLoad: FieldState.loadWave,
        flowPressure: FieldState.flowPressure,
        recentThrottleRate: FieldState.throttleRate,
        factoringBias: FieldState.factoringPressure,
        driftPressure: FieldState.driftPressure,
        binaryBias: FieldState.binaryPreference,
        externalHeat: FieldState.externalHeat,
        externalStorm: FieldState.externalStorm
      };
    },

    buildEndocrineHints() {
      return {
        stability: FieldState.stability,
        resonance: FieldState.resonance,
        friction: FieldState.friction,
        noise: FieldState.noise,
        survivalStress: FieldState.survivalStress,
        advantagePressure: FieldState.advantagePressure
      };
    },

    getMeta() { return FieldState.meta; }
  };


  // -----------------------------------------------------------
  // INTERNAL: DIAGNOSTIC DERIVATION (metadata-only)
// -----------------------------------------------------------
  function applyHaloToField(state, halo) {
    const impulses = halo.impulses_total || 0;
    const throttles = halo.flow_throttles || halo.flow?.throttles || 0;
    const anomalyRate = halo.safety?.anomaly_rate ?? 0;

    state.flowPressure = clamp01(halo.flow?.throttle_rate ?? state.flowPressure);
    state.throttleRate = clamp01(halo.flow?.throttle_rate ?? state.throttleRate);
    state.meshStormPressure = clamp01(impulses > 0 ? throttles / impulses : state.meshStormPressure);
    state.reflexDropRate = clamp01(
      impulses > 0
        ? (halo.safety?.reflex_drops || 0) / impulses
        : state.reflexDropRate
    );
    state.stability = clamp01(halo.health?.stability ?? state.stability);
    state.driftPressure = clamp01(halo.health?.drift_risk ?? state.driftPressure);
    state.advantagePressure = clamp01(
      halo.advantage?.events
        ? Math.min(1, halo.advantage.events / (impulses || 1))
        : state.advantagePressure
    );
  }

  function applyEchoToField(state, echo) {
    if (!echo) return;

    // Flow / mesh
    if (echo.flow?.throttled) {
      state.flowPressure = clamp01(Math.max(state.flowPressure, 0.4));
      state.throttleRate = clamp01(Math.max(state.throttleRate, 0.2));
    }

    if (typeof echo.mesh?.hops === "number") {
      const hops = echo.mesh.hops;
      const storm = hops > 15 ? 1 : hops > 8 ? 0.6 : hops > 3 ? 0.3 : 0.1;
      state.meshStormPressure = clamp01(Math.max(state.meshStormPressure, storm));
    }

    // Aura
    if (echo.aura?.systemUnderTension) {
      state.auraTension = clamp01(Math.max(state.auraTension, 0.6));
    }
    if (echo.aura?.inLoop) {
      state.driftPressure = clamp01(Math.max(state.driftPressure, 0.4));
    }

    // Presence band
    const band = echo.presence?.band || "symbolic";
    if (band === "binary") {
      state.presenceBinaryPressure = clamp01(Math.max(state.presenceBinaryPressure, 0.4));
    } else if (band === "dual") {
      state.presenceDualPressure = clamp01(Math.max(state.presenceDualPressure, 0.3));
    } else {
      state.presenceSymbolicPressure = clamp01(Math.max(state.presenceSymbolicPressure, 0.3));
    }

    // Mode pressure
    if (echo.mode?.binary) {
      state.binaryModePressure = clamp01(Math.max(state.binaryModePressure, 0.4));
    }
    if (echo.mode?.dual) {
      state.dualModeResonance = clamp01(Math.max(state.dualModeResonance, 0.3));
    }
  }

  function applyCognitionToField(state, cognition) {
    if (!cognition) return;

    const mesh = cognition.mesh || {};
    const advantage = cognition.advantage || {};
    const presence = cognition.presence || {};
    const mode = cognition.mode || {};
    const band = cognition.band || {};

    // Mesh pressure from cognition
    const hopsDensity = mesh.hopsCount || 0;
    const stalls = mesh.stallsCount || 0;
    const drops = mesh.dropsCount || 0;
    const factoringEvents = mesh.factoringEvents || 0;

    const meshPressure = clamp01(
      (hopsDensity > 0 ? 0.1 : 0) +
      (stalls > 0 ? 0.2 : 0) +
      (drops > 0 ? 0.2 : 0) +
      (factoringEvents > 0 ? 0.2 : 0)
    );

    state.meshStormPressure = clamp01(Math.max(state.meshStormPressure, meshPressure));
    state.factoringPressure = clamp01(
      Math.max(
        state.factoringPressure,
        mesh.factoringBiasSamples > 0 ? 0.4 : 0
      )
    );

    // Advantage / binary preference
    const binaryPrefSamples = advantage.binaryPreferenceSamples || 0;
    const factoredPaths = advantage.factoredPaths || 0;
    const advEvents = advantage.events || 0;

    const advPressure = clamp01(
      (binaryPrefSamples > 0 ? 0.3 : 0) +
      (factoredPaths > 0 ? 0.3 : 0) +
      (advEvents > 0 ? 0.2 : 0)
    );

    state.advantagePressure = clamp01(Math.max(state.advantagePressure, advPressure));
    state.binaryPreference = clamp01(
      binaryPrefSamples > 0 ? 0.5 : state.binaryPreference
    );

    // Presence load
    const presenceTotal = presence.total || 0;
    state.presenceLoad = clamp01(
      presenceTotal > 0 ? Math.min(1, presenceTotal / 100) : state.presenceLoad
    );

    // Mode pressure from cognition
    const totalMode = (mode.binary || 0) + (mode.symbolic || 0) + (mode.dual || 0) || 1;
    state.binaryModePressure = clamp01(
      Math.max(
        state.binaryModePressure,
        (mode.binary || 0) / totalMode
      )
    );
    state.symbolicModePressure = clamp01(
      Math.max(
        state.symbolicModePressure,
        (mode.symbolic || 0) / totalMode
      )
    );
    state.dualModeResonance = clamp01(
      Math.max(
        state.dualModeResonance,
        (mode.dual || 0) / totalMode
      )
    );
  }

  function recomputeDerivedPressures(state) {
    // Survival stress: flow + mesh + factoring + aura
    const survival =
      state.flowPressure * 0.3 +
      state.meshStormPressure * 0.3 +
      state.factoringPressure * 0.2 +
      state.auraTension * 0.2;

    state.survivalStress = clamp01(survival);

    // Mesh storm risk: mesh storm + throttle
    const stormRisk =
      state.meshStormPressure * 0.6 +
      state.throttleRate * 0.4;

    state.meshStormRisk = clamp01(stormRisk);

    // Advantage pressure: advantage + binary preference + presence load
    const adv =
      state.advantagePressure * 0.5 +
      state.binaryPreference * 0.3 +
      state.presenceLoad * 0.2;

    state.advantagePressure = clamp01(adv);
  }


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

export default {
  createPulseField
};
