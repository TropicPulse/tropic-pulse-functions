// ============================================================================
// [pulse:mesh] COMMUNITY_SPINE_LAYER v8.0  // teal
// Distributed Routing Spine • Reflex + Cortex + Tendons • Metadata-Only
// ============================================================================
//
// IDENTITY — THE SPINE:
//  ---------------------
//  • Routes impulses between nodes (devices, services, earners).
//  • Applies 1/0 reflex at each hop (instinct-style filtering).
//  • Applies cortex shaping (risk, novelty, cooperation, load).
//  • Applies tendon shaping (intent, routeHint, energy shaping).
//  • Accumulates mesh metadata: hops, score, energy, routeHint.
//  • Emits drift + flow signals to GlobalHealer.
//  • NEVER mutates payload data, NEVER performs compute.
//
// THEME:
//  • Color: Teal (conduction, routing, distributed coherence).
//  • Subtheme: Flow, traversal, organism-wide conduction.
//
// SAFETY CONTRACT:
//  • Metadata-only.
//  • No payload access.
//  • No compute.
//  • No autonomy.
//  • Deterministic, drift-proof routing behavior.
//
// ADVANTAGE CASCADE:
//  • Inherits ANY advantage from ANY organ automatically.
//  • Unified-advantage-field: ALL advantages ON unless unsafe.
// ============================================================================

import { createCommunityReflex } from "./CommunityReflex.js";
import { applyPulseCortex } from "./PulseCortex.js";
import { applyTendons } from "./Tendons.js";
import { recordMeshDriftEvent } from "./GlobalHealer.js";

// ============================================================================
// MeshMemory — lineage + drift + flow (metadata-only)
// ============================================================================
export const MeshMemory = {
  drift: [],
  flow: [],
  lineage: [],
  hops: [],
  trust: [],
  load: []
};

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
      version: 8.0,
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
    load: nodeConfig.load ?? 0.0
  });

  return mesh;
}

// ============================================================================
// Flow Recorder (metadata-only)
// ============================================================================
function recordFlow(mesh, from, to) {
  MeshMemory.flow.push({
    ts: Date.now(),
    from,
    to
  });
}

// ============================================================================
// Routing Entry Point
// ============================================================================
export async function routeImpulse(mesh, impulse, entryNodeId, context = {}) {
  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_meta = mesh.meta;

  const visited = new Set();
  let currentNodeId = entryNodeId;

  while (currentNodeId) {
    const node = mesh.nodes.get(currentNodeId);

    // -------------------------------------------------------
    // DRIFT: Missing node
    // -------------------------------------------------------
    if (!node) {
      await recordMeshDriftEvent({
        driftType: "missing_node",
        severity: "warning",
        meshNodeId: currentNodeId,
        note: "Mesh node missing during routing",
        fileName: "PulseMesh.js",
        functionName: "routeImpulse",
        fieldName: "nodes"
      });

      MeshMemory.drift.push({ ts: Date.now(), type: "missing_node", node: currentNodeId });
      break;
    }

    visited.add(currentNodeId);

    // update hops
    impulse.hops = (impulse.hops || 0) + 1;
    MeshMemory.hops.push({ ts: Date.now(), node: node.id });

    // -------------------------------------------------------
    // 1. REFLEX (1/0 instinct)
    // -------------------------------------------------------
    const decision = node.reflex(impulse, node);
    if (decision === 0) {
      impulse.flags[`reflex_drop_at_${node.id}`] = true;

      await recordMeshDriftEvent({
        driftType: "reflex_drop",
        severity: "info",
        meshNodeId: node.id,
        note: "Reflex dropped impulse",
        fileName: "PulseMesh.js",
        functionName: "routeImpulse",
        fieldName: "reflex"
      });

      MeshMemory.drift.push({ ts: Date.now(), type: "reflex_drop", node: node.id });
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
    applyTendons(impulse);

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
    // 5. Earner delivery check
    // -------------------------------------------------------
    if (node.kind === "earner" && shouldDeliverToEarner(impulse, node)) {
      impulse.flags[`delivered_to_${node.id}`] = true;
      break;
    }

    // -------------------------------------------------------
    // 6. Next hop selection
    // -------------------------------------------------------
    const nextId = node.neighbors.find((n) => !visited.has(n));

    // DRIFT: Routing stall
    if (!nextId) {
      impulse.flags[`stalled_at_${node.id}`] = true;

      await recordMeshDriftEvent({
        driftType: "routing_stall",
        severity: "warning",
        meshNodeId: node.id,
        note: "Mesh routing stalled — no available neighbors",
        fileName: "PulseMesh.js",
        functionName: "routeImpulse",
        fieldName: "neighbors"
      });

      MeshMemory.drift.push({ ts: Date.now(), type: "routing_stall", node: node.id });
      break;
    }

    // record flow
    recordFlow(mesh, currentNodeId, nextId);

    currentNodeId = nextId;
  }

  return impulse;
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

  return {
    layer: mesh.meta.layer,
    role: mesh.meta.role,
    version: mesh.meta.version,
    nodeCount,
    avgDegree,
    reach: { estimatedHops, estimatedMeters, mode }
  };
}
