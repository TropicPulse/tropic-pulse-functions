// ============================================================================
//  PULSE OS v8.1 — COGNITION LAYER  // yellow
//  “PulseMeshCognition / Meta‑Memory / Evolution Brain”
// ============================================================================
//
//  IDENTITY — COGNITION (v8.1):
//  -----------------------------
//  • Organizes long‑term and short‑term memory into patterns.
//  • Stores metadata-only “pattern‑of‑patterns” for evolution.
//  • Supports Cortex, Tendons, Organs, Mesh, Immune.
//  • NEVER computes payloads, NEVER mutates data.
//  • Pure cognition — system-wide learning.
//
//  ROLE IN THE DIGITAL BODY (v8.1):
//  --------------------------------
//  • Cognition → the brain’s pattern integrator.
//  • Meta‑Memory → remembers what the system has learned.
//  • Evolution Engine → supports adaptive improvement.
//  • Mesh Cognition → remembers mesh-wide behavior.
//  • Reflex Cognition → remembers reflex patterns.
//  • Organ Cognition → remembers organ usage patterns.
//
//  SAFETY CONTRACT:
//  ----------------
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
    missingNodes: []
  },

  meta: {
    layer: "PulseMeshCognition",
    role: "META_MEMORY",
    version: 8.1,
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
      futureEvolutionReady: true
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
// Cognition Pack — pattern-of-patterns
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

  recordMeshPattern(impulse) {
    const flags = impulse.flags || {};

    if (typeof impulse.hops === "number") {
      CognitionStore.mesh.hops.push({
        ts: Date.now(),
        hops: impulse.hops
      });
    }

    Object.keys(flags).forEach((k) => {
      if (k.startsWith("stalled_at_")) {
        CognitionStore.mesh.stalls.push({
          ts: Date.now(),
          node: k.replace("stalled_at_", "")
        });
      }
      if (k.startsWith("reflex_drop_at_")) {
        CognitionStore.mesh.drops.push({
          ts: Date.now(),
          node: k.replace("reflex_drop_at_", "")
        });
      }
      if (k.startsWith("missing_node_")) {
        CognitionStore.mesh.missingNodes.push({
          ts: Date.now(),
          node: k.replace("missing_node_", "")
        });
      }
    });
  }
};


// -----------------------------------------------------------
// Cognition Engine
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
      missingNodesCount: CognitionStore.mesh.missingNodes.length
    }
  };
}
