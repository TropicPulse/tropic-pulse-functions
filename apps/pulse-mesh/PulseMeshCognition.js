// ============================================================================
//  PULSE OS v9.2 — COGNITION LAYER  // yellow
//  “PulseMeshCognition / Meta‑Memory / Evolution Brain”
// ============================================================================
//
//  IDENTITY — COGNITION (v9.2):
//  -----------------------------
//  • Organizes long‑term and short‑term memory into patterns.
//  • Stores metadata-only “pattern‑of‑patterns” for evolution.
//  • Supports Cortex, Tendons, Organs, Mesh, Immune, Aura, Spine.
//  • NEVER computes payloads, NEVER mutates data.
//  • Pure cognition — system-wide learning.
//  • v9.2: deterministic-field, unified-advantage-field, factoring-aware,
//          aura-aware, mesh-pressure-aware, multi-instance-ready.
//
//  SAFETY CONTRACT (v9.2):
//  ------------------------
//  • Metadata-only.
//  • No payload access.
//  • No routing override.
//  • No autonomy, no sentience.
//  • Deterministic, drift-proof cognition.
// ============================================================================


// -----------------------------------------------------------
// Cognition Store (metadata-only)
// -----------------------------------------------------------
export const CognitionStore = {
  routes: new Map(),
  earners: new Map(),
  organs: new Map(),
  reflexes: new Map(),

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

  meta: {
    layer: "PulseMeshCognition",
    role: "META_MEMORY",
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
      auraPressureAware: true,
      meshPressureAware: true
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


// -----------------------------------------------------------
// Cognition Pack — pattern-of-patterns (v9.2)
// -----------------------------------------------------------
export const PulseMeshCognition = {

  recordRoutePattern(impulse) {
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
  // v9.2 — Mesh Pressure + Factoring Cognition
  // ---------------------------------------------------------
  recordMeshPattern(impulse) {
    const flags = impulse.flags || {};

    if (typeof impulse.hops === "number") {
      CognitionStore.mesh.hops.push({ hops: impulse.hops });
    }

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

    if (flags.mesh_factored) {
      CognitionStore.mesh.factoringEvents.push({
        depth: flags.mesh_factor_depth ?? 0
      });
    }

    if (flags.aura_factoring_bias !== undefined) {
      CognitionStore.mesh.factoringBias.push(flags.aura_factoring_bias);
    }

    if (flags.aura_system_under_tension) {
      CognitionStore.mesh.auraTension.push(true);
    }

    if (flags.flow_pressure !== undefined) {
      CognitionStore.mesh.flowPressure.push(flags.flow_pressure);
    }

    if (flags.drift_pressure !== undefined) {
      CognitionStore.mesh.driftPressure.push(flags.drift_pressure);
    }

    if (flags.recent_throttle_rate !== undefined) {
      CognitionStore.mesh.throttlePressure.push(flags.recent_throttle_rate);
    }
  }
};


// -----------------------------------------------------------
// Cognition Engine (v9.2)
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
// -----------------------------------------------------------
export function getCognitionSnapshot() {
  return {
    meta: CognitionStore.meta,
    routes: CognitionStore.routes.size,
    earners: CognitionStore.earners.size,
    organs: CognitionStore.organs.size,
    reflexes: CognitionStore.reflexes.size,
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
    }
  };
}
