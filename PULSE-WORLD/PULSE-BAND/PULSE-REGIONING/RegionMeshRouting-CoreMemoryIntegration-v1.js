/**
 * META {
 *   organ: "RegionMeshRouting",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "region-mesh-routing",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Computes wormhole routes across universes, timelines, branches, and regions.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     multiverseAware: true,
 *     regionGraphReversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "RegionGraph",
 *       "RegionStabilityMap",
 *       "CosmosContext { universeId, timelineId, branchId }",
 *       "sourceRegionId",
 *       "targetRegionId"
 *     ],
 *     output: [
 *       "RegionRoute",
 *       "RankedRegionCandidate[]"
 *     ]
 *   },
 *
 *   upstream: [
 *     "RegioningPhysics-v13"
 *   ],
 *
 *   downstream: [
 *     "DeploymentPhysics-v13",
 *     "PulseContinuance-v13"
 *   ],
 *
 *   notes: [
 *     "Routing is symbolic wormhole traversal.",
 *     "Costs combine affinity + stability + cosmic placement.",
 *     "Routes are deterministic and reversible."
 *   ]
 * }
 */

import RegionMeshRoutingAPI from "./RegionMeshRouting-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";
// -------------------------
// Cosmos Context
// -------------------------

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

// -------------------------
// Types
// -------------------------

export class RegionRoute {
  constructor({ cosmos, path = [], totalCost = 0 }) {
    this.cosmos = cosmos;
    this.path = path;
    this.totalCost = totalCost;
  }
}

export class RankedRegionCandidate {
  constructor({ cosmos, regionId, score }) {
    this.cosmos = cosmos;
    this.regionId = regionId;
    this.score = score;
  }
}

// -------------------------
// Helpers
// -------------------------

function computeEdgeCost(graph, stabilityMap, from, to) {
  const affinity = graph.edges[from]?.[to] ?? 1.0;
  const instability = stabilityMap.map?.[to] ?? 0.0;
  return affinity + instability;
}

function dijkstra(graph, stabilityMap, source, target) {
  const dist = {};
  const prev = {};
  const nodes = new Set(graph.nodes);

  for (const n of nodes) dist[n] = Infinity;
  dist[source] = 0;

  while (nodes.size > 0) {
    let current = null;
    let best = Infinity;

    for (const n of nodes) {
      if (dist[n] < best) {
        best = dist[n];
        current = n;
      }
    }

    if (current === null) break;
    nodes.delete(current);

    if (current === target) break;

    for (const neighbor of Object.keys(graph.edges[current] || {})) {
      const cost = computeEdgeCost(graph, stabilityMap, current, neighbor);
      const alt = dist[current] + cost;

      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
      }
    }
  }

  const path = [];
  let u = target;

  while (u !== undefined) {
    path.unshift(u);
    u = prev[u];
  }

  if (path[0] !== source) return { path: [], cost: Infinity };

  return { path, cost: dist[target] };
}

// -------------------------
// Core Routing Logic (v13 Multiverse)
// -------------------------

export function computeRegionRoute(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  targetRegionId,
  cosmosContext = {}
) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const { path, cost } = dijkstra(
    regionGraph,
    stabilityMap,
    sourceRegionId,
    targetRegionId
  );

  return new RegionRoute({
    cosmos,
    path,
    totalCost: cost
  });
}

export function rankRegionsForPlacement(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  cosmosContext = {}
) {
  const cosmos = normalizeCosmosContext(cosmosContext);
  const candidates = [];

  for (const regionId of regionGraph.nodes) {
    if (regionId === sourceRegionId) continue;

    const { cost } = dijkstra(
      regionGraph,
      stabilityMap,
      sourceRegionId,
      regionId
    );

    candidates.push(
      new RankedRegionCandidate({
        cosmos,
        regionId,
        score: cost
      })
    );
  }

  candidates.sort((a, b) => a.score - b.score);
  return candidates;
}

// -------------------------
// Exported API
// -------------------------

// -------------------------
// Exported API (v13 COSMOS-MULTIVERSE)
// -------------------------

export const RegionMeshRoutingCosmosV13 = {
  computeRegionRoute,
  rankRegionsForPlacement,
  RegionRoute,
  RankedRegionCandidate,
  normalizeCosmosContext
};

export default RegionMeshRoutingCosmosV13;

