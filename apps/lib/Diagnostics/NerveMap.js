// ============================================================================
// FILE: /apps/lib/Diagnostics/NerveMap.js
// LAYER: NERVE MAP (Pathway Discovery + Health Scanner + Directional Mapper)
// ============================================================================
//
// ROLE:
//   NERVE MAP — Interprets the Impulse's living pathway as Nerves
//   • Discovers pathway length dynamically (0..N nerves)
//   • Computes health, efficiency, degradation per hop
//   • Computes forward + return pathways
//   • Compares forward vs return efficiency (evolution / repair insight)
//   • Produces clean, UI-ready chains for diagnostics
//   • NEVER mutates the impulse
//
// VERSION: v7.0 (LIVING + DIRECTIONAL)
//   • v6.5: unbounded pathway semantics (0..N hops)
//   • v7.0: adds forward/return mapping + comparison
//
// CONTRACT:
//   • Pure diagnostics — metadata only
//   • No business logic, no payload computation
//   • Safe for evolving organisms (layers may grow/shrink)
// ============================================================================


// -----------------------------------------------------------
// Nerve Scoring Pack
// -----------------------------------------------------------
export const Nerves = {

  // [pulse:nerves] NERVE_HEALTH_SCORE  // green
  // - compute normalized health score (0..1)
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

  // [pulse:nerves] NERVE_EFFICIENCY  // teal
  // - compute efficiency relative to expected energy
  efficiency(impulse, hopIndex) {
    const expected = Math.pow(0.5, hopIndex);
    if (expected <= 0) return 0;

    const ratio = (impulse.energy || 1) / expected;
    return Math.max(0, Math.min(1, ratio / 2));
  },

  // [pulse:nerves] NERVE_VISUAL  // amber
  // - map scores to color + icon count
  visual(health, efficiency) {
    const combined = (health * 0.7) + (efficiency * 0.3);

    if (combined < 0.3)  return { color: "red",    icons: 3 };
    if (combined < 0.5)  return { color: "orange", icons: 2 };
    if (combined < 0.7)  return { color: "yellow", icons: 1 };
    if (combined < 0.9)  return { color: "green",  icons: 1 };
    if (combined < 1.05) return { color: "green",  icons: 2 };
    return { color: "green", icons: 3 };
  },

  // [pulse:nerves] NERVE_CONNECTION  // purple
  // - determine if connection is alive ("|") or broken ("X")
  connection(prevHealth, currentHealth) {
    if (prevHealth !== null && prevHealth < 0.3) return "X";
    if (currentHealth < 0.2) return "X";
    return "|";
  }
};


// -----------------------------------------------------------
// Internal: build a single directional map
// -----------------------------------------------------------
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
      direction: directionLabel,          // "forward" | "return"
      connection,                         // "|" or "X"
      color: visual.color,                // "green" | "yellow" | "orange" | "red"
      icons: visual.icons,                // 1–3
      healthScore: health,                // 0–1
      efficiencyScore: efficiency,        // 0–1
      layerId: hop?.id || null,
      layerName: hop?.name || null,
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


// -----------------------------------------------------------
// Nerve Engine v7.0
// -----------------------------------------------------------

export const NerveMap = {

  // Build forward-only map (Impulse.path as-is)
  buildForward(impulse) {
    const path = Array.isArray(impulse?.path) ? impulse.path : [];
    return buildDirectionalMap(impulse, path, "forward");
  },

  // Build return-only map (Impulse.path reversed)
  buildReturn(impulse) {
    const path = Array.isArray(impulse?.path) ? impulse.path : [];
    const reversed = [...path].reverse();
    return buildDirectionalMap(impulse, reversed, "return");
  },

  // Build both + comparison
  buildFull(impulse) {
    const forward = this.buildForward(impulse);
    const reverse = this.buildReturn(impulse);

    const comparison = forward.map((f, idx) => {
      const r = reverse[reverse.length - 1 - idx]; // align Nerve1↔Nerve1, etc.

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
        delta // positive = improved on return, negative = degraded
      };
    });

    return { forward, reverse, comparison };
  }
};
