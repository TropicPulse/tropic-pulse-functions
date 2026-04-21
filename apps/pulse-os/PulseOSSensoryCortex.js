// ============================================================================
// FILE: /apps/PulseOS/Organs/Senses/PulseOSSensoryCortex.js
// PULSE OS — v9.2
// “THE SENSORY CORTEX / NERVE MAP ENGINE”
// LIVING PATHWAY • DRIFT SENTINEL • DIRECTIONAL MAPPER
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Sensory Cortex (Diagnostics / Perception)
//   • Layer: Sensory Layer (S‑Layer)
//   • Biological Analog: Cortical sensory interpretation of nerve signals
//   • System Role: Interpret Impulse.path as a living nervous pathway
//
// PURPOSE:
//   ✔ Compute health, efficiency, degradation per hop
//   ✔ Build forward + return directional nerve maps
//   ✔ Compare forward vs return efficiency (repair insight)
//   ✔ Detect version drift across layers
//   ✔ Produce UI‑ready nerve chains for diagnostics
//   ✔ NEVER mutate the impulse
//
// SAFETY CONTRACT (v9.2):
//   • Pure diagnostics — metadata only
//   • No business logic
//   • No network, no fetch, no backend
//   • No timers, no external stimuli
//   • No hardcoded pages — pathway is the truth
//   • No mutation of impulse or hops
// ============================================================================


// ============================================================================
// NERVE SCORING PACK (unchanged logic, v9.2 identity)
// ============================================================================
export const Nerves = {

  healthScore(hop) {
    const s = hop?.state || {};
    let score = 0.8;

    if (s.health === "Excellent") score = 0.95;
    if (s.health === "Good")      score = 0.85;
    if (s.health === "Weak")      score = 0.55;
    if (s.health === "Critical")  score = 0.25;

    if (s.latency > 300) score -= 0.25;
    else if (s.latency > 200) score -= 0.15;
    else if (s.latency > 150) score -= 0.05;

    if (s.stability > 90) score += 0.05;
    if (s.stability < 50) score -= 0.15;

    return Math.max(0, Math.min(1, score));
  },

  efficiency(impulse, hopIndex) {
    const expected = Math.pow(0.5, hopIndex);
    if (expected <= 0) return 0;

    const ratio = (impulse.energy || 1) / expected;
    return Math.max(0, Math.min(1, ratio / 2));
  },

  visual(health, efficiency) {
    const combined = (health * 0.7) + (efficiency * 0.3);

    if (combined < 0.3)  return { color: "red",    icons: 3 };
    if (combined < 0.5)  return { color: "orange", icons: 2 };
    if (combined < 0.7)  return { color: "yellow", icons: 1 };
    if (combined < 0.9)  return { color: "green",  icons: 1 };
    if (combined < 1.05) return { color: "green",  icons: 2 };
    return { color: "green", icons: 3 };
  },

  connection(prevHealth, currentHealth) {
    if (prevHealth !== null && prevHealth < 0.3) return "X";
    if (currentHealth < 0.2) return "X";
    return "|";
  }
};


// ============================================================================
// INTERNAL: BUILD A SINGLE DIRECTIONAL MAP
// ============================================================================
function buildDirectionalMap(impulse, hops, directionLabel) {
  const nerves = [];
  let prevHealth = null;

  hops.forEach((hop, index) => {
    const health = Nerves.healthScore(hop);
    const efficiency = Nerves.efficiency(impulse, index);
    const visual = Nerves.visual(health, efficiency);
    const connection = Nerves.connection(prevHealth, health);

    nerves.push({
      nerve: `Nerve${index + 1}`,
      index: index + 1,
      direction: directionLabel,

      connection,
      color: visual.color,
      icons: visual.icons,

      healthScore: health,
      efficiencyScore: efficiency,

      layerId: hop?.id || null,
      layerName: hop?.name || null,
      layerVersion: hop?.version || null,

      page: hop?.page || impulse?.page?.name || "UNKNOWN_PAGE",
      identityHealth: hop?.identityHealth || impulse?.identityHealth || null,

      rawState: hop?.state || {},
      rawDelta: hop?.delta || null,
      timestamp: hop?.timestamp || null
    });

    prevHealth = health;
  });

  return nerves;
}


// ============================================================================
// SENSORY CORTEX ENGINE — v9.2
// ============================================================================
export const PulseOSSensoryCortex = {

  meta: {
    organ: "PulseOSSensoryCortex",
    layer: "S-Layer",
    role: "Sensory Cortex / Diagnostics",
    version: "9.2",
    generation: "v9",
    evo: {
      driftProof: true,
      deterministicNeuron: true,
      unifiedAdvantageField: true,
      multiInstanceReady: true,
      zeroNetwork: true,
      zeroMutation: true,
      zeroTiming: true
    }
  },

  buildForward(impulse) {
    const path = Array.isArray(impulse?.path) ? impulse.path : [];
    return buildDirectionalMap(impulse, path, "forward");
  },

  buildReturn(impulse) {
    const path = Array.isArray(impulse?.path) ? impulse.path : [];
    const reversed = [...path].reverse();
    return buildDirectionalMap(impulse, reversed, "return");
  },

  buildFull(impulse) {
    const forward = this.buildForward(impulse);
    const reverse = this.buildReturn(impulse);

    const comparison = forward.map((f, idx) => {
      const r = reverse[reverse.length - 1 - idx];

      if (!r) {
        return {
          nerve: f.nerve,
          forwardEfficiency: f.efficiencyScore,
          returnEfficiency: null,
          delta: null
        };
      }

      const delta = (r.efficiencyScore ?? 0) - (f.efficiencyScore ?? 0);

      return {
        nerve: f.nerve,
        forwardEfficiency: f.efficiencyScore,
        returnEfficiency: r.efficiencyScore,
        delta
      };
    });

    return { forward, reverse, comparison };
  },

  detectVersionDrift(impulse) {
    const versions = {};

    for (const hop of impulse.path) {
      if (!hop?.id) continue;
      const v = hop.version || null;

      if (!versions[hop.id]) versions[hop.id] = new Set();
      if (v) versions[hop.id].add(v);
    }

    const drift = [];

    for (const id of Object.keys(versions)) {
      const set = versions[id];
      if (set.size > 1) {
        drift.push({
          layerId: id,
          versions: Array.from(set)
        });
      }
    }

    return {
      hasDrift: drift.length > 0,
      drift
    };
  }
};
