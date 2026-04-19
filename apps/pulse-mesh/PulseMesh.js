// [pulse:mesh] COMMUNITY_SPINE_LAYER  // teal
// - routes impulses between nodes (devices, services, earners)
// - applies 1/0 reflex at each hop (instinct-style filtering)
// - applies cortex shaping (risk, novelty, cooperation, load)
// - applies tendon shaping (intent, routeHint, energy shaping)
// - accumulates mesh metadata: hops, score, energy, routeHint
// - NEVER mutates payload data, NEVER performs compute

import { createCommunityReflex } from './CommunityReflex.js';
import { applyPulseCortex } from './PulseCortex.js';
import { applyTendons } from './Tendons.js';

// -----------------------------------------------------------
// Mesh Factory
// -----------------------------------------------------------

export function createPulseMesh() {
  // [pulse:mesh] MESH_STATE  // teal
  return {
    nodes: new Map(),              // id -> MeshNode
    reflex: createCommunityReflex() // shared reflex engine
  };
}

// -----------------------------------------------------------
// Node Registration
// -----------------------------------------------------------

export function registerMeshNode(mesh, nodeConfig) {
  // [pulse:mesh] REGISTER_NODE  // teal

  if (!nodeConfig?.id) {
    throw new Error('[pulse:mesh] nodeConfig.id required');
  }

  mesh.nodes.set(nodeConfig.id, {
    id: nodeConfig.id,
    kind: nodeConfig.kind || 'service',
    neighbors: nodeConfig.neighbors || [],
    reflex: nodeConfig.reflex || mesh.reflex,
    trustLevel: nodeConfig.trustLevel ?? 0.5,
    load: nodeConfig.load ?? 0.0,
  });

  return mesh;
}

// -----------------------------------------------------------
// Routing Entry Point
// -----------------------------------------------------------

export function routeImpulse(mesh, impulse, entryNodeId, context = {}) {
  // [pulse:mesh] ROUTE_IMPULSE  // teal

  const visited = new Set();
  let currentNodeId = entryNodeId;

  while (currentNodeId) {
    const node = mesh.nodes.get(currentNodeId);
    if (!node) break;

    visited.add(currentNodeId);

    // update hops
    impulse.hops = (impulse.hops || 0) + 1;

    // -------------------------------------------------------
    // 1. REFLEX (1/0 instinct)
    // -------------------------------------------------------
    const decision = node.reflex(impulse, node);
    if (decision === 0) {
      impulse.flags = impulse.flags || {};
      impulse.flags[`reflex_drop_at_${node.id}`] = true;
      break;
    }

    // -------------------------------------------------------
    // 2. CORTEX (strategic shaping)
    // -------------------------------------------------------
    applyPulseCortex(impulse, {
      ...context,
      globalLoad: node.load,
      trustLevel: node.trustLevel,
    });

    // -------------------------------------------------------
    // 3. TENDONS (intent + routeHint + energy shaping)
    // -------------------------------------------------------
    applyTendons(impulse);

    // -------------------------------------------------------
    // 4. Energy decay (instinctive fatigue)
    // -------------------------------------------------------
    impulse.energy = typeof impulse.energy === 'number'
      ? impulse.energy * 0.9
      : 0.9;

    if (impulse.energy <= 0.05) {
      impulse.flags = impulse.flags || {};
      impulse.flags['mesh_energy_exhausted'] = true;
      break;
    }

    // -------------------------------------------------------
    // 5. Earner delivery check
    // -------------------------------------------------------
    if (node.kind === 'earner' && shouldDeliverToEarner(impulse, node)) {
      impulse.flags = impulse.flags || {};
      impulse.flags[`delivered_to_${node.id}`] = true;
      break;
    }

    // -------------------------------------------------------
    // 6. Next hop selection
    // -------------------------------------------------------
    const nextId = node.neighbors.find(n => !visited.has(n));

    if (!nextId) {
      impulse.flags = impulse.flags || {};
      impulse.flags[`stalled_at_${node.id}`] = true;
      break;
    }

    currentNodeId = nextId;
  }

  return impulse;
}

// -----------------------------------------------------------
// Earner Targeting Helper
// -----------------------------------------------------------

function shouldDeliverToEarner(impulse, node) {
  // [pulse:mesh] EARNER_TARGETING  // purple
  const hint = impulse.routeHint;
  if (!hint) return true;

  if (hint === node.id) return true;
  if (hint === node.kind) return true;

  return false;
}
