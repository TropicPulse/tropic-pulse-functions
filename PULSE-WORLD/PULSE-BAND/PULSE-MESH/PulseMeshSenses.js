// ============================================================================
// FILE: /organs/senses/PulseMeshSenses.js
// [pulse:senses] PULSE_MESH_SENSES v12.3-Presence  // white-silver
// Unified Sensory Cortex • Metadata-Only • System Awareness Brain
// ============================================================================
//
// IDENTITY — THE SENSES CORTEX (v12.3-Presence):
// ---------------------------------------
// • Unified sensory cortex for the organism.
// • Reads from:
//      - PulseHalo (counters + safety + mesh metrics)
//      - PulseField (internal weather + pressure signals)
//      - PulseEcho (diagnostic reflection sonar)
//      - PulseClinician (endocrine + mesh interpretation)
//      - SDN context (v12.3-Presence nervous system)
// • Produces a deterministic unified awareness model for:
//      - Awareness Page
//      - Backend AI
//      - Clinician
//      - Immune Commander
//
// SAFETY CONTRACT (v12.3-Presence):
// ---------------------------
// • Metadata-only.
// • Read-only — NEVER mutates impulses.
// • No routing, no hormones, no memory writes.
// • Deterministic-field: same system → same awareness snapshot.
// • Zero imports — all dependencies injected by CNS Brain.
// • Binary-aware, dual-mode-ready, drift-proof.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshSenses",
  version: "v14.9-MESH-SENSES",
  layer: "mesh",
  role: "mesh_sensory_engine",
  lineage: "PulseMesh-v14",

  evo: {
    senses: true,                   // This IS the sensory organ
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Reads mesh topology
    binaryAware: true,              // Binary sensory packets
    symbolicAware: true,            // Symbolic sensory packets
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshAwareness",
      "PulseMeshFlow",
      "PulseMeshCognition"
    ],
    never: [
      "legacyMeshSenses",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseSenses({
  PulseHalo,
  PulseFieldRead,
  PulseEcho,
  PulseClinician,
  SDN,
  log,
  warn,
  error
}) {

  const sensesMeta = {
    layer: "PulseSenses",
    role: "AWARENESS_CORTEX",
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

  const Senses = {
    meta: sensesMeta,

    snapshot(entryNodeId, context = {}) {
      return this.status(entryNodeId, context);
    },

    // -------------------------------------------------------
    // STATUS — Unified Sensory Model (v12.3)
    // -------------------------------------------------------
    status(entryNodeId, context = {}) {
      const halo = PulseHalo.status();
      const field = PulseFieldRead.snapshot();
      const echoReflection = PulseEcho.sendEcho(entryNodeId, context);
      const clinicianView = PulseClinician.examineSystem(entryNodeId, context);
      const sdnView = SDN.snapshot?.() ?? {};

      return buildUnifiedAwareness({
        meta: sensesMeta,
        halo,
        field,
        echo: echoReflection,
        clinician: clinicianView,
        sdn: sdnView
      });
    },

    // -------------------------------------------------------
    // AWARENESS PAGE VIEW (v12.3)
    // -------------------------------------------------------
    forAwarenessPage(entryNodeId, context = {}) {
      const unified = this.status(entryNodeId, context);

      return {
        performance: unified.performance,
        stability: unified.stability,
        drift: unified.drift,
        environment: unified.environment,
        safety: unified.safety,
        hormones: unified.hormones,
        aura: unified.aura,
        mesh: unified.mesh,
        sdn: unified.sdn,
        mode: unified.mode,
        presence: unified.presence,
        narrative: unified.narrative_for_you
      };
    },

    // -------------------------------------------------------
    // AI VIEW (v12.3)
    // -------------------------------------------------------
    forAI(entryNodeId, context = {}) {
      const unified = this.status(entryNodeId, context);

      return {
        performance_percent: unified.performance.percent,
        performance_hint: unified.performance.hint,
        stability: unified.stability.value,
        drift_risk: unified.drift.value,
        environment: unified.environment,
        safety: unified.safety,
        hormones: unified.hormones,
        aura: unified.aura,
        mesh: unified.mesh,
        sdn: unified.sdn,
        mode: unified.mode,
        presence: unified.presence,
        narrative_for_ai: unified.narrative_for_ai
      };
    },

    // -------------------------------------------------------
    // CLINICIAN VIEW (v12.3)
    // -------------------------------------------------------
    forClinician(entryNodeId, context = {}) {
      return this.status(entryNodeId, context).clinician_view;
    }
  };

  return Senses;
}


// ============================================================================
// UNIFIED AWARENESS BUILDER (v12.3)
// ============================================================================
function buildUnifiedAwareness({ meta, halo, field, echo, clinician, sdn }) {
  const performancePercent = clinician.performancePercent ?? 100;
  const performanceHint = estimatePerformanceHint(performancePercent, field, echo);

  const stability = {
    value: field.stability ?? halo.health?.stability ?? 1,
    label: "Internal Stability"
  };

  const drift = {
    value: field.driftPressure ?? halo.health?.drift_risk ?? 0,
    label: "Drift Pressure"
  };

  const environment = {
    friction: field.friction,
    noise: field.noise,
    load_wave: field.loadWave,
    external_heat: field.externalHeat,
    external_storm: field.externalStorm,
    external_signal: field.externalSignal,

    flow_pressure: field.flowPressure,
    throttle_rate: field.throttleRate,
    aura_tension: field.auraTension,
    reflex_drop_rate: field.reflexDropRate,
    mesh_storm_pressure: field.meshStormPressure,
    drift_pressure: field.driftPressure,
    resonance: field.resonance,

    // v12.3 mode pressures
    binary_mode_pressure: field.binaryModePressure,
    symbolic_mode_pressure: field.symbolicModePressure,
    dual_mode_resonance: field.dualModeResonance,

    // v12.3 presence-band pressures
    presence_binary_pressure: field.presenceBinaryPressure,
    presence_symbolic_pressure: field.presenceSymbolicPressure,
    presence_dual_pressure: field.presenceDualPressure
  };

  const safety = {
    reflex_drops: halo.safety?.reflex_drops ?? 0,
    immune_quarantines: halo.safety?.immune_quarantines ?? 0,
    anomaly_rate: halo.safety?.anomaly_rate ?? 0
  };

  const hormones = {
    boosts: halo.hormones?.boosts ?? 0,
    damps: halo.hormones?.damps ?? 0,
    modulation_events: halo.hormones?.modulation_events ?? 0,
    tone: halo.hormones?.tone ?? null
  };

  const aura = {
    loops: halo.aura?.loops ?? 0,
    syncs: halo.aura?.syncs ?? 0
  };

  const mesh = {
    hops: halo.mesh?.hops ?? 0,
    avg_hops: halo.mesh?.avg_hops ?? 0
  };

  const sdnView = {
    active_impulses: sdn.activeImpulses ?? 0,
    queued: sdn.queued ?? 0,
    mode: sdn.mode ?? "normal"
  };

  // v12.3: mode + presence-band awareness
  const mode = {
    binary: echo.mode?.binary ?? false,
    symbolic: !echo.mode?.binary,
    dual: echo.mode?.dual ?? false
  };

  const presence = {
    band: echo.mode?.binary ? "binary" :
          echo.mode?.dual ? "dual" : "symbolic",
    binary_pressure: field.presenceBinaryPressure,
    symbolic_pressure: field.presenceSymbolicPressure,
    dual_pressure: field.presenceDualPressure
  };

  const narrative_for_you = buildNarrativeForYou({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
    sdn: sdnView,
    mode,
    presence
  });

  const narrative_for_ai = buildNarrativeForAI({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
    sdn: sdnView,
    mode,
    presence
  });

  return {
    meta,
    performance: { percent: performancePercent, hint: performanceHint },
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
    mesh,
    sdn: sdnView,
    mode,
    presence,
    clinician_view: clinician,
    narrative_for_you,
    narrative_for_ai
  };
}


// ============================================================================
// NARRATIVE + PERFORMANCE HINTS (v12.3)
// ============================================================================
function estimatePerformanceHint(perf, field, echo) {
  if (perf > 100) return "overperforming_compensated";
  if (perf > 95) return "stable_optimal";
  if (perf > 85) return "stable_compensating";
  if (field.driftPressure > 0.4 || echo.aura?.loop) return "drift_rising";
  if (field.meshStormPressure > 0.4) return "routing_turbulence";
  return "mixed_state";
}

function buildNarrativeForYou({
  performancePercent,
  stability,
  drift,
  environment,
  safety,
  hormones,
  aura,
  sdn,
  mode,
  presence
}) {
  const perf = performancePercent.toFixed(1);
  const parts = [];

  parts.push(`We are at ${perf}% performance.`);

  if (mode.binary) parts.push("Binary Mode is active — reflex pathways are optimized.");
  if (mode.dual) parts.push("Dual Mode resonance detected — hybrid pathways engaged.");

  if (presence.band === "binary") parts.push("Presence-Band: Binary — system tuned for precision.");
  if (presence.band === "dual") parts.push("Presence-Band: Dual — system balancing symbolic and binary.");
  if (presence.band === "symbolic") parts.push("Presence-Band: Symbolic — system tuned for semantic clarity.");

  if (stability.value > 0.85) parts.push("Stability is strong and holding.");
  else if (stability.value > 0.6) parts.push("Stability is okay but should be watched.");
  else parts.push("Stability is low — system is working harder to stay balanced.");

  if (drift.value > 0.4) parts.push("Drift Pressure is elevated — patterns may be drifting.");

  if (environment.flow_pressure > 0.5) parts.push("Flow Pressure is high — the organism is under tension.");
  if (environment.throttle_rate > 0.3) parts.push("Throttle Rate is elevated — the system is braking frequently.");
  if (environment.aura_tension > 0.4) parts.push("Aura Tension is active — stabilization loops are engaged.");
  if (environment.mesh_storm_pressure > 0.4) parts.push("Mesh Storm Pressure is rising — routing turbulence detected.");

  if (aura.loops > 0) parts.push("Aura Loops are active — some patterns may be cycling.");
  if (aura.syncs > 0) parts.push("Aura Sync events are helping stabilize the system.");

  if (hormones.modulation_events > 0) parts.push("Hormone Modulation is active — system is compensating.");

  if (safety.immune_quarantines > 0 || safety.reflex_drops > 0) {
    parts.push("Safety systems are isolating unsafe impulses.");
  }

  if (sdn.active_impulses > 1000) {
    parts.push("SDN load is elevated — impulse traffic is high.");
  }

  return parts.join(" ");
}

function buildNarrativeForAI({
  performancePercent,
  stability,
  drift,
  environment,
  safety,
  hormones,
  aura,
  sdn,
  mode,
  presence
}) {
  return {
    performance_percent: performancePercent,
    stability: stability.value,
    drift_pressure: drift.value,
    ...environment,
    reflex_drops: safety.reflex_drops,
    immune_quarantines: safety.immune_quarantines,
    hormone_events: hormones.modulation_events,
    hormone_tone: hormones.tone,
    aura_loops: aura.loops,
    aura_syncs: aura.syncs,
    sdn_active_impulses: sdn.active_impulses,
    sdn_mode: sdn.mode,
    binary_mode: mode.binary,
    dual_mode: mode.dual,
    presence_band: presence.band,
    presence_binary_pressure: presence.binary_pressure,
    presence_symbolic_pressure: presence.symbolic_pressure,
    presence_dual_pressure: presence.dual_pressure
  };
}
