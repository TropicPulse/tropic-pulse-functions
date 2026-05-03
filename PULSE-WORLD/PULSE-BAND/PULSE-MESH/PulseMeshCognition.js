// ============================================================================
// FILE: PulseMeshCognition-v15-EVO-IMMORTAL.js
// PULSE MESH COGNITION — META MEMORY / PATTERN-OF-PATTERNS
// System-wide Mesh Cognition • Route / Earner / Organ / Reflex Patterns
// Metadata-only • Zero Payload Mutation • Presence + Band + Advantage Aware
// ============================================================================
//
// IDENTITY — THE COGNITION FIELD (v15-EVO-IMMORTAL):
//  -------------------------------------------------
//  • Meta-memory for the mesh: patterns-of-patterns, not raw payloads.
//  • Tracks routes, earners, organs, reflexes, mesh pressure, factoring,
//    presence bands, and advantage fields — all as metadata only.
//  • Dual-band aware: symbolic / binary / dual mode + band classification.
//  • Presence-aware: counts presence tags, never stores identity payloads.
//  • Advantage-aware: binary preference, factored paths, advantage events.
//  • Feeds dashboards, AI views, and long-horizon mesh tuning (offline).
//  • Fully deterministic: same impulse sequence → same CognitionStore state.
//  • Zero randomness, zero timestamps, zero async, zero network, zero FS.
//
// SAFETY CONTRACT (v15):
//  ----------------------
//  • No randomness
//  • No timestamps
//  • No payload mutation (flags-only, counters, and arrays of scalars/labels)
//  • No async
//  • No network, no filesystem, no env access
//  • Fail-open: missing fields → safe defaults
//  • Deterministic: same impulses → same cognition patterns
//  • Presence-aware and band-aware only via metadata
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshCognition",
  version: "v14.9-MESH-COGNITION",
  layer: "mesh",
  role: "mesh_memory_and_pattern_engine",
  lineage: "PulseMesh-v14",

  evo: {
    cognition: true,                // This IS the cognition organ
    metadataOnly: true,             // Never mutates payloads
    binaryAware: true,              // Binary tags + binary patterns
    symbolicAware: true,            // Symbolic tags + patterns
    dualBand: true,                 // Dual-mode cognition
    deterministic: true,            // No randomness in cognition
    driftProof: true,               // No drift in memory patterns
    zeroMutationOfInput: true,      // Never mutate impulses
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshCortex"
    ],
    never: [
      "legacyMeshCognition",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshCognition",
  version: "v14.9-MESH-COGNITION-IMMORTAL",
  layer: "mesh",
  role: "mesh_cognition_engine",
  lineage: "PulseMesh-v14",

  evo: {
    meshCognition: true,            // This IS the mesh cognition organ
    presenceAware: true,            // Reads presence band + tags (metadata-only)
    meshAware: true,                // Reads mesh pressure + factoring flags
    binaryAware: true,              // Binary artery + binary mesh bias
    advantageAware: true,           // Advantage cascade fields
    chunkPrewarmReady: true,        // Chunk/prewarm integration
    deterministic: true,            // No randomness
    driftProof: true,               // No drift in cognition fields
    zeroRandomness: true,
    zeroAsync: true,
    zeroMutationOfInput: true,      // Never mutate impulses beyond flags
    zeroNetworkFetch: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshPresenceRelay",
      "PulseMeshAura",
      "PulseHalo"
    ],
    never: [
      "legacyMeshCognition",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// -----------------------------------------------------------
// Cognition Store (metadata-only)
//   • All structures are meta-memory only.
//   • No payload storage, no identity registry.
// -----------------------------------------------------------
export const CognitionStore = {
  routes: new Map(),   // key: "entry->delivered", value: { success, fail, lastScore }
  earners: new Map(),  // key: earnerId, value: { success, fail, avgScore }
  organs: new Map(),   // key: organId, value: { count, anomalyCount }
  reflexes: new Map(), // key: reflex_flag, value: { triggered, drops }

  // v15: dual-band + presence cognition (mode vs band)
  mode: {
    symbolic: 0,
    binary: 0,
    dual: 0
  },

  band: {
    symbolic: 0,
    binary: 0,
    dual: 0
  },

  presence: {
    tags: new Map(), // counts only, no identity registry
    total: 0
  },

  mesh: {
    hops: [],
    stalls: [],
    drops: [],
    missingNodes: [],
    factoringEvents: [],
    factoringBias: [],
    auraTension: [],
    flowPressure: [],
    driftPressure: [],
    throttlePressure: []
  },

  advantage: {
    binaryPreference: [],
    factoredPaths: 0,
    events: 0
  },

  meta: {
    layer: "PulseMeshCognition",
    role: "META_MEMORY",
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
      auraPressureAware: true,
      meshPressureAware: true,

      presenceAware: true,
      bandAware: true,

      zeroCompute: true,   // no heavy compute, only simple aggregation
      zeroMutation: true   // never mutates external objects
    }
  }
};


// -----------------------------------------------------------
// Helpers
// -----------------------------------------------------------
function getOrInit(map, key, init) {
  if (!map.has(key)) map.set(key, { ...init });
  return map.get(key);
}

function classifyMode(impulse) {
  const m = impulse?.mode;
  if (!m) return;
  if (m === "binary") CognitionStore.mode.binary++;
  else if (m === "symbolic") CognitionStore.mode.symbolic++;
  else if (m === "dual") CognitionStore.mode.dual++;
}

function classifyBand(impulse) {
  const b = impulse?.band;
  if (!b) return;
  if (b === "binary") CognitionStore.band.binary++;
  else if (b === "symbolic") CognitionStore.band.symbolic++;
  else if (b === "dual") CognitionStore.band.dual++;
}

function recordPresenceTag(impulse) {
  const tag = impulse?.flags?.aura_presence_tag;
  if (!tag) return;
  CognitionStore.presence.total++;
  const count = CognitionStore.presence.tags.get(tag) || 0;
  CognitionStore.presence.tags.set(tag, count + 1);
}


// -----------------------------------------------------------
// Cognition Pack — pattern-of-patterns (v15)
//   • Each method is metadata-only, no payload storage.
//   • Reads impulse flags + scalar fields, updates meta-memory.
// -----------------------------------------------------------
export const PulseMeshCognition = {

  // Route-level patterns: entry → delivered.
  recordRoutePattern(impulse) {
    classifyMode(impulse);
    classifyBand(impulse);
    recordPresenceTag(impulse);

    const entry = impulse.entryNodeId ?? "unknown";
    const delivered = impulse.flags?.delivered_to ?? "none";
    const key = `${entry}->${delivered}`;

    const mem = getOrInit(CognitionStore.routes, key, {
      success: 0,
      fail: 0,
      lastScore: 0
    });

    if (impulse.flags?.delivered_to) mem.success++;
    else mem.fail++;

    mem.lastScore = impulse.score || 0;
  },

  // Earner-level patterns: success/fail + score smoothing.
  recordEarnerPattern(impulse) {
    const earnerId = impulse.flags?.delivered_to;
    if (!earnerId) return;

    const mem = getOrInit(CognitionStore.earners, earnerId, {
      success: 0,
      fail: 0,
      avgScore: 0
    });

    mem.success++;
    mem.avgScore = (mem.avgScore + (impulse.score || 0)) / 2;
  },

  // Organ-level patterns: usage + anomaly counts.
  recordOrganPattern(impulse) {
    const organs = impulse.organs || [];
    for (const organId of organs) {
      const mem = getOrInit(CognitionStore.organs, organId, {
        count: 0,
        anomalyCount: 0
      });

      mem.count++;
      if (impulse.flags?.cortex_anomaly) mem.anomalyCount++;
    }
  },

  // Reflex-level patterns: reflex_* flags + drops.
  recordReflexPattern(impulse) {
    const flags = impulse.flags || {};
    for (const key of Object.keys(flags)) {
      if (!key.startsWith("reflex_")) continue;

      const mem = getOrInit(CognitionStore.reflexes, key, {
        triggered: 0,
        drops: 0
      });

      mem.triggered++;
      if (key.endsWith("_drop")) mem.drops++;
    }
  },

  // ---------------------------------------------------------
  // v15 — Mesh Pressure + Factoring + Presence Cognition
  // ---------------------------------------------------------
  recordMeshPattern(impulse) {
    const flags = impulse.flags || {};

    // Hops (scalar)
    if (typeof impulse.hops === "number") {
      CognitionStore.mesh.hops.push({ hops: impulse.hops });
    }

    // Node-level events (stalls, drops, missing nodes)
    Object.keys(flags).forEach((k) => {
      if (k.startsWith("stalled_at_")) {
        CognitionStore.mesh.stalls.push({ node: k.replace("stalled_at_", "") });
      }
      if (k.startsWith("reflex_drop_at_")) {
        CognitionStore.mesh.drops.push({ node: k.replace("reflex_drop_at_", "") });
      }
      if (k.startsWith("missing_node_")) {
        CognitionStore.mesh.missingNodes.push({ node: k.replace("missing_node_", "") });
      }
    });

    // Factoring events
    if (flags.mesh_factored) {
      CognitionStore.mesh.factoringEvents.push({
        depth: flags.mesh_factor_depth ?? 0
      });
      CognitionStore.advantage.factoredPaths++;
      CognitionStore.advantage.events++;
    }

    // Factoring bias (from Aura)
    if (flags.aura_factoring_bias !== undefined) {
      CognitionStore.mesh.factoringBias.push(flags.aura_factoring_bias);
    }

    // Aura tension
    if (flags.aura_system_under_tension) {
      CognitionStore.mesh.auraTension.push(true);
    }

    // Mesh pressure fields
    if (flags.flow_pressure !== undefined) {
      CognitionStore.mesh.flowPressure.push(flags.flow_pressure);
    }

    if (flags.drift_pressure !== undefined) {
      CognitionStore.mesh.driftPressure.push(flags.drift_pressure);
    }

    if (flags.recent_throttle_rate !== undefined) {
      CognitionStore.mesh.throttlePressure.push(flags.recent_throttle_rate);
    }

    // Advantage: binary mesh bias
    if (flags.aura_binary_mesh_bias !== undefined) {
      CognitionStore.advantage.binaryPreference.push(flags.aura_binary_mesh_bias);
      CognitionStore.advantage.events++;
    }
  }
};


// -----------------------------------------------------------
// Cognition Engine (v15)
//   • Single entrypoint for the organism.
//   • Attaches cognition_meta + records all cognition patterns.
// -----------------------------------------------------------
export function applyPulseMeshCognition(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.flags.cognition_meta = CognitionStore.meta;

  PulseMeshCognition.recordRoutePattern(impulse);
  PulseMeshCognition.recordEarnerPattern(impulse);
  PulseMeshCognition.recordOrganPattern(impulse);
  PulseMeshCognition.recordReflexPattern(impulse);
  PulseMeshCognition.recordMeshPattern(impulse);

  impulse.flags.cognition_recorded = true;

  return impulse;
}


// -----------------------------------------------------------
// Snapshot — read-only meta-memory view
//   • Aggregated counts only, no raw arrays exposed.
// -----------------------------------------------------------
export function getCognitionSnapshot() {
  return {
    meta: CognitionStore.meta,
    routes: CognitionStore.routes.size,
    earners: CognitionStore.earners.size,
    organs: CognitionStore.organs.size,
    reflexes: CognitionStore.reflexes.size,

    mode: { ...CognitionStore.mode },
    band: { ...CognitionStore.band },

    presence: {
      total: CognitionStore.presence.total,
      tags: CognitionStore.presence.tags.size
    },

    mesh: {
      hopsCount: CognitionStore.mesh.hops.length,
      stallsCount: CognitionStore.mesh.stalls.length,
      dropsCount: CognitionStore.mesh.drops.length,
      missingNodesCount: CognitionStore.mesh.missingNodes.length,
      factoringEvents: CognitionStore.mesh.factoringEvents.length,
      factoringBiasSamples: CognitionStore.mesh.factoringBias.length,
      auraTensionSamples: CognitionStore.mesh.auraTension.length,
      flowPressureSamples: CognitionStore.mesh.flowPressure.length,
      driftPressureSamples: CognitionStore.mesh.driftPressure.length,
      throttlePressureSamples: CognitionStore.mesh.throttlePressure.length
    },

    advantage: {
      events: CognitionStore.advantage.events,
      binaryPreferenceSamples: CognitionStore.advantage.binaryPreference.length,
      factoredPaths: CognitionStore.advantage.factoredPaths
    }
  };
}
