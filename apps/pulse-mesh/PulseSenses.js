// -----------------------------------------------------------
// [pulse:senses] PULSE_OS_AWARENESS_BRAIN  // white
// -----------------------------------------------------------
// ROLE:
//   - Awareness Brain / Bodily Translator
//   - Reads Halo, Field, Echo, Clinician
//   - Produces unified "sensed" view of the organism
//   - Feeds Awareness Page, backendAI, your AI, Clinician
//   - NEVER mutates impulses, NEVER routes, NEVER computes payloads
//
// THEME:
//   - Color: White (awareness, reflection, non-interference)
//   - Subtheme: Sensing, interpretation, clarity
//
// SAFETY CONTRACT:
//   - Read-only, metadata-only
//   - No loops, no hormones, no memory writes
//   - No autonomy, no sentience, no self-model
//   - Backend-safe, frontend-safe, global-safe
// -----------------------------------------------------------

import { PulseHalo } from './PulseHalo.js';
import { PulseField } from './PulseField.js';
import { createPulseEcho } from './PulseEcho.js';
import { PulseFlow } from './PulseFlow.js';
import { createPulseClinician } from './PulseClinician.js';

// -----------------------------------------------------------
// Factory
// -----------------------------------------------------------

export function createPulseSenses(mesh) {
  const flow = PulseFlow(mesh);
  const echo = createPulseEcho(mesh, flow);
  const clinician = createPulseClinician(mesh);

  return {
    // -------------------------------------------------------
    // [pulse:senses] SNAPSHOT  // white
    // -------------------------------------------------------
    // Raw sensed state from all awareness sources
    // -------------------------------------------------------
    snapshot(entryNodeId, context = {}) {
      const halo = PulseHalo.status();
      const field = PulseField.snapshot();
      const echoReflection = echo.sendEcho(entryNodeId, context);
      const clinicianView = clinician.examineSystem(entryNodeId, context);

      return {
        halo,
        field,
        echo: echoReflection,
        clinician: clinicianView,
      };
    },

    // -------------------------------------------------------
    // [pulse:senses] STATUS  // white
    // -------------------------------------------------------
    // Unified semantic awareness model
    // -------------------------------------------------------
    status(entryNodeId, context = {}) {
      const halo = PulseHalo.status();
      const field = PulseField.snapshot();
      const echoReflection = echo.sendEcho(entryNodeId, context);
      const clinicianView = clinician.examineSystem(entryNodeId, context);

      return buildUnifiedAwareness({
        halo,
        field,
        echo: echoReflection,
        clinician: clinicianView,
      });
    },

    // -------------------------------------------------------
    // [pulse:senses] AWARENESS PAGE VIEW  // white
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
        narrative: unified.narrative_for_you,
      };
    },

    // -------------------------------------------------------
    // [pulse:senses] AI VIEW  // white
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
        narrative_for_ai: unified.narrative_for_ai,
      };
    },

    // -------------------------------------------------------
    // [pulse:senses] CLINICIAN VIEW  // white
    // -------------------------------------------------------
    forClinician(entryNodeId, context = {}) {
      const unified = this.status(entryNodeId, context);
      return unified.clinician_view;
    },
  };
}

// -----------------------------------------------------------
// Unified Awareness Builder
// -----------------------------------------------------------

function buildUnifiedAwareness({ halo, field, echo, clinician }) {
  const performancePercent = clinician.performancePercent ?? 100;
  const performanceHint = estimatePerformanceHint(performancePercent, field, echo);

  const stability = {
    value: field.stability ?? halo.health?.stability ?? 1,
    label: 'Internal Stability (blood pressure)',
  };

  const drift = {
    value: field.driftPressure ?? halo.health?.drift_risk ?? 0,
    label: 'Drift Pressure (systemic stress)',
  };

  const environment = {
    friction: {
      value: field.friction ?? 0,
      label: 'Friction (inflammation / resistance)',
    },
    noise: {
      value: field.noise ?? 0,
      label: 'Noise (sensory overload)',
    },
    load_wave: {
      value: field.loadWave ?? 0,
      label: 'Load Wave (circulatory surge / metabolic demand)',
    },
    external_heat: {
      value: field.externalHeat ?? 0,
      label: 'External Heat (world heat influence)',
    },
    external_storm: {
      value: field.externalStorm ?? 0,
      label: 'External Storm (world turbulence)',
    },
    external_signal: {
      value: field.externalSignal ?? 0,
      label: 'External Signal (world clarity)',
    },
  };

  const safety = {
    reflex_drops: halo.safety?.reflex_drops ?? 0,
    immune_quarantines: halo.safety?.immune_quarantines ?? 0,
    anomaly_rate: halo.safety?.anomaly_rate ?? 0,
    labels: {
      reflex_drops: 'Reflex Drop (instinctive rejection)',
      immune_quarantines: 'Immune Quarantine (infection isolation)',
    },
  };

  const hormones = {
    boosts: halo.hormones?.boosts ?? 0,
    damps: halo.hormones?.damps ?? 0,
    modulation_events: halo.hormones?.modulation_events ?? 0,
    label: 'Hormone Modulation (adrenaline / cortisol)',
  };

  const aura = {
    loops: halo.aura?.loops ?? 0,
    syncs: halo.aura?.syncs ?? 0,
    label: 'Aura Loop / Aura Sync (feedback loop / grounding)',
  };

  const mesh = {
    hops: halo.mesh?.hops ?? 0,
    avg_hops: halo.mesh?.avg_hops ?? 0,
    label: 'Mesh Hops (neural routing distance)',
  };

  const narrative_for_you = buildNarrativeForYou({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
  });

  const narrative_for_ai = buildNarrativeForAI({
    performancePercent,
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
  });

  return {
    performance: {
      percent: performancePercent,
      hint: performanceHint,
    },
    stability,
    drift,
    environment,
    safety,
    hormones,
    aura,
    mesh,
    clinician_view: clinician,
    narrative_for_you,
    narrative_for_ai,
  };
}

// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------

function estimatePerformanceHint(perf, field, echo) {
  if (perf > 100) return 'overperforming_compensated';
  if (perf > 95) return 'stable_optimal';
  if (perf > 85) return 'stable_compensating';
  if (field.driftPressure > 0.4 || echo.aura?.loop) return 'drift_rising';
  return 'mixed_state';
}

function buildNarrativeForYou({
  performancePercent,
  stability,
  drift,
  environment,
  safety,
  hormones,
  aura,
}) {
  const perf = performancePercent.toFixed(1);
  const parts = [];

  parts.push(`We are at ${perf}% performance.`);

  if (stability.value > 0.85) {
    parts.push(`${stability.label} is strong and holding.`);
  } else if (stability.value > 0.6) {
    parts.push(`${stability.label} is okay but should be watched.`);
  } else {
    parts.push(`${stability.label} is low — system is working harder to stay balanced.`);
  }

  if (drift.value > 0.4) {
    parts.push(`${drift.label} is elevated — patterns may be drifting.`);
  }

  if (environment.friction.value > 0.5) {
    parts.push('Friction (inflammation) is elevated inside the system.');
  }
  if (environment.noise.value > 0.5) {
    parts.push('Noise (sensory overload) is high — signals may feel chaotic.');
  }
  if (aura.loops > 0) {
    parts.push('Aura Loops (feedback loops) are active — some patterns may be cycling.');
  }
  if (aura.syncs > 0) {
    parts.push('Aura Sync (grounding) events are helping stabilize the system.');
  }
  if (hormones.modulation_events > 0) {
    parts.push('Hormone Modulation (adrenaline/cortisol) is active — system is compensating for load or stress.');
  }

  if (safety.immune_quarantines > 0 || safety.reflex_drops > 0) {
    parts.push('Safety systems (Reflex + Immune) are catching and isolating unsafe impulses.');
  }

  return parts.join(' ');
}

function buildNarrativeForAI({
  performancePercent,
  stability,
  drift,
  environment,
  safety,
  hormones,
  aura,
}) {
  return {
    performance_percent: performancePercent,
    stability: stability.value,
    drift_pressure: drift.value,
    friction: environment.friction.value,
    noise: environment.noise.value,
    load_wave: environment.load_wave.value,
    external_heat: environment.external_heat.value,
    external_storm: environment.external_storm.value,
    external_signal: environment.external_signal.value,
    reflex_drops: safety.reflex_drops,
    immune_quarantines: safety.immune_quarantines,
    hormone_events: hormones.modulation_events,
    aura_loops: aura.loops,
    aura_syncs: aura.syncs,
  };
}
