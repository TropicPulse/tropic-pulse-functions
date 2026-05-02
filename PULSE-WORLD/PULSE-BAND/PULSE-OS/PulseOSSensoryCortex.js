// ============================================================================
// FILE: /PulseOS/Organs/Senses/PulseOSSensoryCortex.js
// PULSE OS — v12.3-Presence
// “THE SENSORY CORTEX / NERVE MAP ENGINE”
// DUAL-BAND NERVE MAP • DRIFT SENTINEL • EXECUTION CONTEXT VISUALIZER
// CHUNK/PREWARM-AWARE • MULTI-PRESENCE DIAGNOSTICS • CACHE SURFACE MAPPER
// ============================================================================
//
// ORGAN IDENTITY (v12.3-Presence):
//   • Organ Type: Sensory Cortex (Diagnostics / Perception)
//   • Layer: Sensory Layer (S‑Layer)
//   • Biological Analog: Cortical sensory interpretation of nerve signals
//   • System Role: Interpret Impulse.path as a living nervous pathway,
//                  now dual-band (binary + symbolic), executionContext-aware,
//                  chunk/prewarm/cache-surface aware, and multi-presence aware.
//
// PURPOSE (v12.3-Presence):
//   ✔ Compute health, efficiency, degradation per hop
//   ✔ Build forward + return directional nerve maps
//   ✔ Compare forward vs return efficiency (repair insight)
//   ✔ Detect version drift across layers
//   ✔ Surface binary/symbolic mode + executionContext + pressureSnapshot
//   ✔ Surface chunk/cache/prewarm hints per hop (no IO, metadata only)
//   ✔ Surface presence identity (multi-presence, multi-instance overlays)
//   ✔ Produce UI‑ready nerve chains for diagnostics + cache planning
//   ✔ NEVER mutate the impulse or hops
//
// SAFETY CONTRACT (v12.3-Presence):
//   • Pure diagnostics — metadata only
//   • No business logic
//   • No network, no fetch, no backend
//   • No timers, no external stimuli
//   • No hardcoded pages — pathway is the truth
//   • No mutation of impulse or hops
//   • No timestamps generated here (may pass through existing hop timestamps)
//   • No cache writes, no prewarm execution — hints only
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSSensoryCortex",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_sensory_cortex",
  lineage: "PulseOS-v14",

  evo: {
    sensoryCortex: true,
    sensoryIntegration: true,
    sensoryAwareness: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    presenceAware: true,
    meshAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSNervousSystem",
      "PulseOSBrain",
      "PulseChunker"
    ],
    never: [
      "legacySensoryCortex",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseOSSensoryCortexMeta = Object.freeze({
  layer: "PulseOSSensoryCortex",
  role: "SENSORY_CORTEX_ORGAN",
  version: "v12.3-PRESENCE-CHUNK",
  identity: "PulseOSSensoryCortex-v12.3-PRESENCE-CHUNK",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    multiPresenceReady: true,

    // Sensory cortex laws
    sensoryCortexOrgan: true,
    pureDiagnostics: true,
    perceptionOnly: true,
    executionContextVisualizer: true,
    dualBandNerveMap: true,
    forwardReturnMapping: true,
    driftSentinel: true,
    versionDriftDetector: true,
    pressureSnapshotAware: true,
    executionContextAware: true,

    // Chunk/cache/presence laws
    chunkAware: true,
    prewarmAware: true,
    cacheSurfaceBuilder: true,
    presenceAware: true,
    multiPresenceOverlay: true,
    gpuPressureAware: true,

    // Safety prohibitions
    zeroNetwork: true,
    zeroBackend: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroMutation: true,
    zeroExternalMutation: true,
    zeroCompute: true,
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "Impulse",
      "ImpulsePath",
      "DualBandContext",
      "ExecutionContext",
      "PressureSnapshot",
      "ChunkContext",
      "CacheContext",
      "PresenceContext"
    ],
    output: [
      "NerveMapForward",
      "NerveMapReturn",
      "NerveMapDiagnostics",
      "NerveMapSignatures",
      "NerveChunkPlan",
      "NervePrewarmPlan",
      "SensoryHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-Presence",
    parent: "PulseOS-v12.3-Presence",
    ancestry: [
      "PulseOSSensoryCortex-v9",
      "PulseOSSensoryCortex-v10",
      "PulseOSSensoryCortex-v11",
      "PulseOSSensoryCortex-v11-Evo",
      "PulseOSSensoryCortex-v11-Evo-Prime",
      "PulseOSSensoryCortex-v12-Presence"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "sensory-diagnostics"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "impulse.path → nerve scoring → forward/return maps",
    adaptive: "binary-tagged pathways + executionContext + chunk/presence overlays",
    return: "UI-ready nerve chains + signatures + chunk/prewarm hints"
  })
});


// ============================================================================
// NERVE SCORING PACK (logic preserved, v12.3 identity)
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
  },

  // v12.3-Presence: chunk/cache/prewarm hint builder (pure metadata)
  chunkHint(impulse, hop, index) {
    const chunkContext   = impulse?.chunkContext   || {};
    const cacheContext   = impulse?.cacheContext   || {};
    const presence       = impulse?.presence       || {};
    const presenceId     = presence.id            || presence.presenceId || null;
    const presenceBand   = presence.band          || presence.modeKind   || impulse?.modeKind || "symbolic";
    const presenceSlot   = presence.slot          || null;

    const baseKeyParts = [
      impulse?.id || "IMPULSE",
      hop?.id || `HOP${index}`,
      hop?.name || "LAYER",
      presenceId || "NO_PRESENCE"
    ];

    const chunkKey = baseKeyParts.join("::");

    const cacheTier =
      cacheContext.preferredTier ||
      hop?.cacheTier ||
      "L2-shared";

    const prewarmBand =
      chunkContext.prewarmBand ||
      presenceBand ||
      "symbolic";

    const multiPresence =
      Array.isArray(presence.instances) ? presence.instances.length : null;

    return {
      chunkKey,
      cacheTier,
      prewarmBand,
      presenceId,
      presenceBand,
      presenceSlot,
      multiPresenceCount: multiPresence
    };
  }
};


// ============================================================================
// INTERNAL: BUILD A SINGLE DIRECTIONAL MAP (dual-band + context + chunk/presence)
// ============================================================================
function buildDirectionalMap(impulse, hops, directionLabel) {
  const nerves = [];
  let prevHealth = null;

  const modeKind         = impulse?.modeKind         || "symbolic"; // "binary" | "symbolic" | "dual"
  const executionContext = impulse?.executionContext || {};
  const pressureSnapshot = impulse?.pressureSnapshot || {};
  const presence         = impulse?.presence         || {};
  const presenceId       = presence.id              || presence.presenceId || null;
  const presenceBand     = presence.band            || presence.modeKind   || modeKind;
  const presenceInstance = presence.instanceId      || null;

  hops.forEach((hop, index) => {
    const health     = Nerves.healthScore(hop);
    const efficiency = Nerves.efficiency(impulse, index);
    const visual     = Nerves.visual(health, efficiency);
    const connection = Nerves.connection(prevHealth, health);

    const chunkMeta = Nerves.chunkHint(impulse, hop, index);

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

      // v12.3-Presence: dual-band + execution context + pressure + presence
      modeKind,
      executionContext,
      pressureSnapshot,

      presenceId,
      presenceBand,
      presenceInstance,

      // v12.3-Presence: chunk/cache/prewarm hints (metadata only)
      chunkKey: chunkMeta.chunkKey,
      cacheTier: chunkMeta.cacheTier,
      prewarmBand: chunkMeta.prewarmBand,
      presenceSlot: chunkMeta.presenceSlot || null,
      multiPresenceCount: chunkMeta.multiPresenceCount,

      rawState: hop?.state || {},
      rawDelta: hop?.delta || null,
      // Pass-through only; no timestamps generated here
      timestamp: hop?.timestamp ?? null
    });

    prevHealth = health;
  });

  return nerves;
}


// ============================================================================
// SENSORY CORTEX ENGINE — v12.3-Presence
// ============================================================================
export const PulseOSSensoryCortex = {

  meta: {
    organ: "PulseOSSensoryCortex",
    layer: "S-Layer",
    role: "Sensory Cortex / Diagnostics",
    version: "12.3-Presence",
    generation: "v12",
    evo: {
      driftProof: true,
      deterministicNeuron: true,
      unifiedAdvantageField: true,
      multiInstanceReady: true,
      multiPresenceReady: true,
      zeroNetwork: true,
      zeroMutation: true,
      zeroTiming: true,

      binaryAware: true,
      symbolicAware: true,
      dualModeAware: true,
      executionContextAware: true,
      pressureAware: true,

      chunkAware: true,
      cacheAware: true,
      prewarmAware: true,
      presenceAware: true
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
    const path = Array.isArray(impulse?.path) ? impulse.path : [];

    for (const hop of path) {
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

// ============================================================================
// END OF FILE — SENSORY CORTEX / NERVE MAP ENGINE  [v12.3-Presence]
// ============================================================================
