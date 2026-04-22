// ============================================================================
// FILE: /apps/organs/senses/PulseMeshSenses.js
// [pulse:senses] PULSE_MESH_SENSES v9.2  // white-silver
// Unified Sensory Cortex • Metadata-Only • System Awareness Brain
// ============================================================================
//
// IDENTITY — THE SENSES CORTEX (v9.2):
// ------------------------------------
// • The organism’s unified sensory cortex.
// • Reads from:
//      - PulseHalo (counters + safety + mesh metrics)
//      - PulseField (internal weather + pressure signals)
//      - PulseEcho (diagnostic reflection sonar)
//      - PulseClinician (endocrine + mesh interpretation)
// • Produces a unified awareness model for:
//      - Awareness Page
//      - Backend AI
//      - Clinician
//      - Mesh Immune System
//
// SAFETY CONTRACT (v9.2):
// ------------------------
// • Metadata-only.
// • Read-only — NEVER mutates impulses.
// • No routing, no hormones, no memory writes.
// • Deterministic-field: same system → same awareness snapshot.
// • Zero imports — all dependencies injected by CNS Brain.
//
// NEW IN v9.2:
// ------------
// • Mesh-storm-aware
// • Factoring-pressure-aware
// • Aura-pressure-aware
// • Drift-pressure-aware
// • Unified-advantage-field
// • Multi-instance-ready
// • Narrative engine upgraded for v9.2 pressure semantics
// ============================================================================

export function createPulseSenses({
  PulseHalo,
  PulseFieldRead,
  PulseEcho,
  PulseClinician,
  log,
  warn,
  error
}) {

  const sensesMeta = {
    layer: "PulseSenses",
    role: "AWARENESS_CORTEX",
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

      signalFactoringAware: true,
      meshPressureAware: true,
      auraPressureAware: true
    }
  };

  const Senses = {
    meta: sensesMeta,

    // -------------------------------------------------------
    // SNAPSHOT (alias)
    // -------------------------------------------------------
    snapshot(entryNodeId, context = {}) {
      return this.status(entryNodeId, context);
    },

    // -------------------------------------------------------
    // STATUS — Unified Sensory Model (v9.2)
    // -------------------------------------------------------
    status(entryNodeId, context = {}) {
      const halo = PulseHalo.status();
      const field = PulseFieldRead.snapshot();
      const echoReflection = PulseEcho.sendEcho(entryNodeId, context);
      const clinicianView = PulseClinician.examineSystem(entryNodeId, context);

      return buildUnifiedAwareness({
        meta: sensesMeta,
        halo,
        field,
        echo: echoReflection,
        clinician: clinicianView
      });
    },

    // -------------------------------------------------------
    // AWARENESS PAGE VIEW (v9.2)
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
        narrative: unified.narrative_for_you
      };
    },

    // -------------------------------------------------------
    // AI VIEW (v9.2)
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
        narrative_for_ai: unified.narrative_for_ai
      };
    },

    // -------------------------------------------------------
    // CLINICIAN VIEW (v9.2)
    // -------------------------------------------------------
    forClinician(entryNodeId, context = {}) {
      return this.status(entryNodeId, context).clinician_view;
    }
  };

  return Senses;
}


// ============================================================================
// UNIFIED AWARENESS BUILDER (v9.2)
// ============================================================================
function buildUnifiedAwareness({ meta, halo, field, echo, clinician }) {
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
    friction: { value: field.friction, label: "Friction" },
    noise: { value: field.noise, label: "Noise" },
    load_wave: { value: field.loadWave, label: "Load Wave" },
    external_heat: { value: field.externalHeat, label: "External Heat" },
    external_storm: { value: field.externalStorm, label: "External Storm" },
    external_signal: { value: field.externalSignal, label: "External Signal" },

    // v9.2 pressure signals
    flow_pressure: field.flowPressure,
    throttle_rate: field.throttleRate,
    aura_tension: field.auraTension,
    reflex_drop_rate: field.reflexDropRate,
    mesh_storm_pressure: field.meshStormPressure,
    drift_pressure: field.driftPressure,
    resonance: field.resonance
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

  const narrative_for_you = buildNarrativeForYou({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura
  });

  const narrative_for_ai = buildNarrativeForAI({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura
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
    clinician_view: clinician,
    narrative_for_you,
    narrative_for_ai
  };
}


// ============================================================================
// NARRATIVE + PERFORMANCE HINTS (v9.2)
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
  aura
}) {
  const perf = performancePercent.toFixed(1);
  const parts = [];

  parts.push(`We are at ${perf}% performance.`);

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

  return parts.join(" ");
}

function buildNarrativeForAI({
  performancePercent,
  stability,
  drift,
  environment,
  safety,
  hormones,
  aura
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
    aura_syncs: aura.syncs
  };
}
