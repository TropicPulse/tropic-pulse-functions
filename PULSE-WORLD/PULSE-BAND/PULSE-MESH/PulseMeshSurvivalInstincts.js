// ============================================================================
//  PULSE OS v12.3+ — SURVIVAL INSTINCTS LAYER  // amber
//  “Skin-Level Reflex Arc / Local Survival Gate”
//  Deterministic Survival Arc • Fast Instinct Engine • Pure 1/0 Decisions
//  Full Advantage Stack: Presence-Aware • Unified-Advantage-Field-Aligned
// ============================================================================
//
//  IDENTITY (v12.3+):
//  ------------------
//  • Lowest-level survival organ (skin-level reflex).
//  • Pure 1/0 instinct engine — no compute, no routing, no shaping.
//  • Drops or keeps impulses instantly based on local state + anomaly flags.
//  • Zero payload mutation — metadata-only.
//  • Deterministic, drift-proof, AND-architecture aligned.
//  • Binary-aware, dual-mode-ready, presence-band-aware.
//  • No pressure gating, no internet-mode logic, no factoring pressure.
//  • Unified-advantage-field compliant (tags only, no side effects).
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshSurvivalInstincts",
  version: "v14.9-MESH-SURVIVAL",
  layer: "mesh",
  role: "mesh_survival_and_threat_engine",
  lineage: "PulseMesh-v14",

  evo: {
    survival: true,                 // This IS the survival organ
    threatDetection: true,          // Detects mesh-level threats
    reflexPriority: true,           // Prioritizes reflex impulses
    binaryAware: true,              // Binary threat flags
    symbolicAware: true,            // Symbolic threat signals
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,             // No routing, no compute
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshImmuneSystem",
      "PulseMeshEcho",
      "PulseMeshFlow",
      "PulseMeshAwareness"
    ],
    never: [
      "legacyMeshSurvival",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// -----------------------------------------------------------
//  Presence-Band Helper (v12.3+)
// -----------------------------------------------------------
function classifyPresenceBand(impulse) {
  const f = impulse.flags || {};
  if (f.binary_mode && f.dual_mode) return "dual";
  if (f.binary_mode) return "binary";
  if (f.dual_mode) return "dual";
  return "symbolic";
}


// -----------------------------------------------------------
//  Instinct Pack (v12.3+)
// -----------------------------------------------------------

export const SurvivalInstincts = {

  // [pulse:mesh] INSTINCT_ENERGY  // amber
  // Drop when impulse is out of energy.
  energy(impulse) {
    if (typeof impulse.energy !== "number") return 1;
    if (impulse.energy <= 0.05) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_HOPS  // amber
  // Drop when hop count is too high (runaway prevention).
  hops(impulse) {
    if ((impulse.hops || 0) > 64) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_TRUST  // teal
  // Drop when node trust is too low.
  trust(impulse, node) {
    if (!node || typeof node.trustLevel !== "number") return 1;
    if (node.trustLevel >= 0.5) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_ANOMALY_FLAG  // magenta
  // Drop when cortex has flagged anomaly.
  anomaly(impulse) {
    if (impulse.flags?.cortex_anomaly) return 0;
    if (impulse.flags?.cortex_factoring_anomaly) return 0;
    if (impulse.flags?.cortex_flow_anomaly) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_EARNER_TARGETING  // purple
  // Drop when earner targeting is clearly wrong.
  earnerTargeting(impulse, node) {
    if (!node || node.kind !== "earner") return 1;
    if (!impulse.routeHint) return 1;
    if (impulse.routeHint === node.id) return 1;
    if (impulse.routeHint === node.kind) return 1;
    return 0;
  },

  // [pulse:mesh] INSTINCT_BINARY_MODE  // cyan
  // v12.3+: binary-mode reflex tightening
  binaryMode(impulse) {
    if (!impulse.flags?.binary_mode) return 1;
    // binary mode requires higher structural integrity
    if (impulse.energy <= 0.1) return 0;
    if ((impulse.hops || 0) > 48) return 0;
    return 1;
  },

  // [pulse:mesh] INSTINCT_DUAL_MODE  // blue
  // v12.3+: dual-mode reflex softening
  dualMode(impulse) {
    if (!impulse.flags?.dual_mode) return 1;
    // dual mode tolerates slightly higher hop count
    if ((impulse.hops || 0) > 72) return 0;
    return 1;
  }
};


// -----------------------------------------------------------
//  Combined Survival Instinct Engine (v12.3+)
//  Presence-band aware, unified-advantage-field aligned
// -----------------------------------------------------------

export function createSurvivalInstincts() {

  const instinctFns = [
    SurvivalInstincts.energy,
    SurvivalInstincts.hops,
    SurvivalInstincts.trust,
    SurvivalInstincts.anomaly,
    SurvivalInstincts.earnerTargeting,
    SurvivalInstincts.binaryMode,
    SurvivalInstincts.dualMode
  ];

  const meta = {
    layer: "SurvivalInstincts",
    role: "SURVIVAL_REFLEX",
    version: "12.3+",
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

      // v12.3+ advantage flags (tags only)
      prewarmAware: true,
      chunkAware: true,
      cacheAware: true,
      presenceAware: true,
      dualBandReady: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    }
  };

  return function survivalInstinctEngine(impulse, node) {
    impulse.meta = impulse.meta || {};
    impulse.meta.reflex = meta;
    impulse.flags = impulse.flags || {};

    // v12.3+: presence-band tagging (metadata-only)
    const presenceBand = classifyPresenceBand(impulse);
    impulse.flags.survival_presence_band = presenceBand;
    impulse.flags.survival_advantage_meta = {
      prewarm_surface: true,
      chunk_surface: true,
      cache_surface: true,
      presence_band: presenceBand
    };

    for (const fn of instinctFns) {
      const decision = fn(impulse, node);
      if (decision === 0) {
        impulse.flags[`instinct_${fn.name}_drop`] = true;
        return 0;
      }
    }

    return 1;
  };
}
