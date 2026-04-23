// ============================================================================
// FILE: PulseMeshSpine.js
// PULSE OS — v11-ready
// COMMUNITY_SPINE_LAYER  // teal
// Distributed Routing Spine • Reflex + Cortex + Tendons + Signal Factoring
// Metadata-Only • Deterministic • Drift-Proof • Local-First
// ============================================================================
//
// IDENTITY — THE SPINE:
// ---------------------
// • Routes impulses between nodes (devices, services, earners).
// • Applies 1/0 reflex at each hop (instinct-style filtering).
// • Applies cortex shaping (risk, novelty, cooperation, load).
// • Applies tendon shaping (intent, routeHint, energy shaping).
// • Applies SIGNAL FACTORING (progressive 1/0 branch reduction).
// • Accumulates mesh metadata: hops, score, energy, routeHint.
// • Emits drift + flow + factoring signals to Mesh Immune / GlobalHealer.
// • NEVER mutates payload data, NEVER performs compute.
// • Deterministic-field, mesh-pressure-aware, aura-pressure-aware.
//
// SAFETY CONTRACT (v11-ready):
// • Metadata-only.
// • No payload access.
// • No compute.
// • No autonomy.
// • No async, no timestamps, no randomness.
// • Deterministic, drift-proof routing behavior.
// • Local-first; internet paths are explicit, not default.
// • Healing only via routed healers / directives, never inline.
// ============================================================================

import { createCommunityReflex } from "./CommunityReflex.js";
import { applyPulseCortex } from "./PulseMeshCortex.js";
import { applyPulseMeshTendons } from "./PulseMeshTendons.js";
import { applyMeshSignalFactoring } from "./PulseMeshSignalFactoring.js";
import { recordMeshDriftEvent } from "./GlobalHealer.js";
import "./MeshScanner.js";

// ============================================================================
// MeshMemory — lineage + drift + flow + factoring (metadata-only)
// ============================================================================
export const MeshMemory = {
  drift: [],
  flow: [],
  lineage: [],
  hops: [],
  trust: [],
  load: [],
  factoring: [],
  factoringDepth: [],
  factoringBias: []
};

// Deterministic cycle counter (replaces timestamps)
let meshCycle = 0;

// ============================================================================
// Mesh Factory
// ============================================================================
export function createPulseMesh() {
  return {
    nodes: new Map(),
    reflex: createCommunityReflex(),
    meta: {
      layer: "PulseMeshSpine",
      role: "ROUTING_SPINE",
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
      },
      reach: {
        estimatedHops: 0,
        estimatedMeters: 0,
        mode: "direct"
      }
    }
  };
}

// ============================================================================
// Node Registration
// ============================================================================
export function registerMeshNode(mesh, nodeConfig) {
  if (!nodeConfig?.id) {
    throw new Error("[pulse:mesh] nodeConfig.id required");
  }

  mesh.nodes.set(nodeConfig.id, {
    id: nodeConfig.id,
    kind: nodeConfig.kind || "service",
    neighbors: nodeConfig.neighbors || [],
    reflex: nodeConfig.reflex || mesh.reflex,
    trustLevel: nodeConfig.trustLevel ?? 0.5,
    load: nodeConfig.load ?? 0.0,
    locality: nodeConfig.locality || "local" // "local" | "edge" | "internet"
  });

  return mesh;
}

// ============================================================================
// Flow Recorder (metadata-only, deterministic)
// ============================================================================
function recordFlow(mesh, from, to) {
  MeshMemory.flow.push({
    cycle: meshCycle,
    from,
    to
  });
}

// ============================================================================
// Factoring Recorder (metadata-only, deterministic)
// ============================================================================
function recordFactoring(impulse) {
  const flags = impulse.flags || {};
  const depth = flags.mesh_factor_depth || 0;
  const bias = flags.mesh_factor_bias || 0;
  const factored = !!flags.mesh_factored;

  if (!factored && depth === 0 && bias === 0) return;

  MeshMemory.factoring.push({
    cycle: meshCycle,
    depth,
    bias,
    factored
  });

  MeshMemory.factoringDepth.push({
    cycle: meshCycle,
    depth
  });

  MeshMemory.factoringBias.push({
    cycle: meshCycle,
    bias
  });
}

// ============================================================================
// Routing Entry Point (v11-ready)
// Metadata-only • Deterministic • Local-first
// ============================================================================
export function routeImpulse(mesh, impulse, entryNodeId, context = {}) {
  meshCycle++;

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_meta = mesh.meta;
  impulse.flags.mesh_route_started = true;

  const visited = new Set();
  let currentNodeId = entryNodeId;

  const MAX_HOPS = context.maxHops ?? 256;

  while (currentNodeId) {
    const node = mesh.nodes.get(currentNodeId);

    // -------------------------------------------------------
    // DRIFT: Missing node
    // -------------------------------------------------------
    if (!node) {
      recordMeshDriftEvent({
        driftType: "missing_node",
        severity: "warning",
        meshNodeId: currentNodeId,
        note: "Mesh node missing during routing",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "nodes"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "missing_node",
        node: currentNodeId
      });

      impulse.flags.mesh_missing_node = true;
      break;
    }

    visited.add(currentNodeId);

    // -------------------------------------------------------
    // HOPS + LINEAGE
    // -------------------------------------------------------
    impulse.hops = (impulse.hops || 0) + 1;

    MeshMemory.hops.push({ cycle: meshCycle, node: node.id });

    MeshMemory.lineage.push({
      cycle: meshCycle,
      node: node.id,
      trust: node.trustLevel ?? 0.5,
      load: node.load ?? 0.0
    });

    MeshMemory.trust.push({
      cycle: meshCycle,
      node: node.id,
      trust: node.trustLevel ?? 0.5
    });

    MeshMemory.load.push({
      cycle: meshCycle,
      node: node.id,
      load: node.load ?? 0.0
    });

    if (impulse.hops > MAX_HOPS) {
      impulse.flags.mesh_max_hops_exceeded = true;

      recordMeshDriftEvent({
        driftType: "routing_stall",
        severity: "warning",
        meshNodeId: node.id,
        note: "Mesh routing exceeded max hops — safety stop",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "hops"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "routing_stall",
        node: node.id
      });

      break;
    }

    // -------------------------------------------------------
    // 0. SIGNAL PRESSURE SURFACE (factoring + aura hints)
    // -------------------------------------------------------
    impulse.flags = impulse.flags || {};
    const factorDepth = impulse.flags.mesh_factor_depth || 0;
    const factorBias = impulse.flags.mesh_factor_bias || 0;
    const auraBias = impulse.flags.aura_factoring_bias || 0;

    impulse.flags.mesh_factor_pressure =
      factorDepth + factorBias + auraBias;

    // -------------------------------------------------------
    // 1. REFLEX (1/0 instinct)
    // -------------------------------------------------------
    const decision = node.reflex(impulse, node);

    if (decision === 0) {
      impulse.flags[`reflex_drop_at_${node.id}`] = true;

      recordMeshDriftEvent({
        driftType: "reflex_drop",
        severity: "info",
        meshNodeId: node.id,
        note: "Reflex dropped impulse",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "reflex"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "reflex_drop",
        node: node.id
      });

      break;
    }

    // -------------------------------------------------------
    // 2. CORTEX (strategic shaping)
    // -------------------------------------------------------
    applyPulseCortex(impulse, {
      ...context,
      globalLoad: node.load,
      trustLevel: node.trustLevel
    });

    // -------------------------------------------------------
    // 3. TENDONS (intent + routeHint + energy shaping)
    // -------------------------------------------------------
    applyPulseMeshTendons(impulse);

    // -------------------------------------------------------
    // 4. Energy decay (instinctive fatigue)
    // -------------------------------------------------------
    impulse.energy =
      typeof impulse.energy === "number" ? impulse.energy * 0.9 : 0.9;

    if (impulse.energy <= 0.05) {
      impulse.flags.mesh_energy_exhausted = true;
      break;
    }

    // -------------------------------------------------------
    // 4.5 SIGNAL FACTORING (1/0, metadata-only)
    // -------------------------------------------------------
    applyMeshSignalFactoring(impulse);
    recordFactoring(impulse);

    // -------------------------------------------------------
    // 5. Earner delivery check
    // -------------------------------------------------------
    if (node.kind === "earner" && shouldDeliverToEarner(impulse, node)) {
      impulse.flags[`delivered_to_${node.id}`] = true;
      impulse.flags.reached_earn_engine = true;
      break;
    }

    // -------------------------------------------------------
    // 6. Next hop selection (factoring + load + locality aware)
    // -------------------------------------------------------
    const nextId = selectNextHop(mesh, node, visited, impulse);

    // DRIFT: Routing stall
    if (!nextId) {
      impulse.flags[`stalled_at_${node.id}`] = true;

      recordMeshDriftEvent({
        driftType: "routing_stall",
        severity: "warning",
        meshNodeId: node.id,
        note: "Mesh routing stalled — no available neighbors",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "neighbors"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "routing_stall",
        node: node.id
      });

      break;
    }

    recordFlow(mesh, currentNodeId, nextId);
    currentNodeId = nextId;
  }

  impulse.flags.mesh_route_completed = true;
  return impulse;
}

// ============================================================================
// Next Hop Selection (factoring-aware, load-aware, locality-aware, metadata-only)
// ============================================================================
function selectNextHop(mesh, node, visited, impulse) {
  const neighbors = node.neighbors || [];
  if (!neighbors.length) return null;

  const factorPressure = impulse.flags?.mesh_factor_pressure || 0;
  const prefersStableRoutes = !!impulse.flags?.aura_prefers_stable_routes;

  const candidates = neighbors
    .filter((n) => !visited.has(n))
    .map((id) => {
      const n = mesh.nodes.get(id);

      if (!n) {
        return {
          id,
          load: 1,
          trust: 0,
          locality: "unknown",
          penalty: 1
        };
      }

      const load = typeof n.load === "number" ? n.load : 0;
      const trust = typeof n.trustLevel === "number" ? n.trustLevel : 0.5;
      const locality = n.locality || "local";

      let penalty = 0;

      // higher load → higher penalty
      if (load > 0.5) penalty += (load - 0.5) * 0.6;

      // lower trust → higher penalty
      if (trust < 0.5) penalty += (0.5 - trust) * 0.5;

      // factoring pressure → prefer shorter / more stable paths
      if (factorPressure > 0) {
        penalty += factorPressure * 0.3;
      }

      // aura stable-route hint → extra penalty for high-load nodes
      if (prefersStableRoutes && load > 0.3) {
        penalty += (load - 0.3) * 0.4;
      }

      // locality preference: local < edge < internet
      if (locality === "edge") penalty += 0.05;
      if (locality === "internet") penalty += 0.15;

      return {
        id,
        load,
        trust,
        locality,
        penalty
      };
    })
    .sort((a, b) => {
      if (a.penalty !== b.penalty) return a.penalty - b.penalty;
      // deterministic tie-breaker: id lexicographic
      return String(a.id).localeCompare(String(b.id));
    });

  const best = candidates[0];
  return best ? best.id : null;
}

// ============================================================================
// Earner Targeting Helper
// ============================================================================
function shouldDeliverToEarner(impulse, node) {
  const hint = impulse.routeHint;
  if (!hint) return true;
  if (hint === node.id) return true;
  if (hint === node.kind) return true;

  return false;
}

// ============================================================================
// Mesh Reach Snapshot (Metadata-Only)
// ============================================================================
export function getMeshReachSnapshot(mesh) {
  const nodeCount = mesh.nodes.size;

  const avgDegree =
    nodeCount === 0
      ? 0
      : Array.from(mesh.nodes.values()).reduce(
          (sum, n) => sum + (n.neighbors?.length || 0),
          0
        ) / nodeCount;

  const estimatedHops = Math.max(1, Math.round(avgDegree || 1));
  const estimatedMeters = estimatedHops * 30;

  let mode = "direct";
  if (estimatedHops >= 3 && estimatedHops < 6) mode = "cluster";
  if (estimatedHops >= 6) mode = "wide";

  const locals = Array.from(mesh.nodes.values()).filter(
    (n) => (n.locality || "local") === "local"
  ).length;

  const localityRatio = nodeCount === 0 ? 1 : locals / nodeCount;
  const localityMode =
    localityRatio > 0.7 ? "local-first" : localityRatio < 0.3 ? "internet-mixed" : "hybrid";

  return {
    layer: mesh.meta.layer,
    role: mesh.meta.role,
    version: mesh.meta.version,
    nodeCount,
    avgDegree,
    reach: { estimatedHops, estimatedMeters, mode, localityMode }
  };
}
