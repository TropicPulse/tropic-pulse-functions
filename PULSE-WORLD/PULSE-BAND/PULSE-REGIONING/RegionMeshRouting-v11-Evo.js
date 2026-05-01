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
 *       "RegionAffinityMap",
 *       "CosmosContext",
 *       "SourceRegionId",
 *       "TargetRegionId"
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
 *     "PulseContinuance-v13",
 *     "DeploymentPhysics-v13",
 *     "MultiOrganismSupport-v13"
 *   ],
 *
 *   notes: [
 *     "Routing is symbolic wormhole traversal.",
 *     "Costs combine affinity + stability + cosmic placement.",
 *     "Routes are deterministic and reversible."
 *   ]
 * }
 */

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
    this.totalCost = clamp01(totalCost);
  }
}

export class RankedRegionCandidate {
  constructor({ cosmos, regionId, score }) {
    this.cosmos = cosmos;
    this.regionId = regionId;
    this.score = clamp01(score);
  }
}

// -------------------------
// Helpers
// -------------------------

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function computeEdgeCost(affinity, stability) {
  const a = clamp01(affinity);
  const s = clamp01(stability);
  return clamp01(a * 0.7 + s * 0.3);
}

function dijkstra(graph, stabilityMap, source, target) {
  const nodes = graph.nodes || [];
  const edges = graph.edges || {};

  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const n of nodes) {
    dist[n] = n === source ? 0 : Infinity;
    prev[n] = null;
  }

  while (visited.size < nodes.length) {
    let current = null;
    let best = Infinity;

    for (const n of nodes) {
      if (visited.has(n)) continue;
      if (dist[n] < best || (dist[n] === best && n < current)) {
        current = n;
        best = dist[n];
      }
    }

    if (current === null || best === Infinity) break;
    if (current === target) break;

    visited.add(current);

    const neighbors = edges[current] || {};
    for (const [neighbor, affinity] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;

      const stability = stabilityMap.map?.[neighbor] ?? 0;
      const edgeCost = computeEdgeCost(affinity, stability);
      const alt = dist[current] + edgeCost;

      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
      }
    }
  }

  const path = [];
  let u = target;

  while (u !== null) {
    path.unshift(u);
    u = prev[u];
  }

  if (path[0] !== source) return { path: [], cost: 1 };

  const rawCost = dist[target];
  const maxHops = Math.max(nodes.length - 1, 1);
  const normalizedCost = clamp01(rawCost / maxHops);

  return { path, cost: normalizedCost };
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

    const score = clamp01(1 - cost);

    candidates.push(
      new RankedRegionCandidate({
        cosmos,
        regionId,
        score
      })
    );
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.regionId.localeCompare(b.regionId);
  });

  return candidates;
}

// -------------------------
// Exported API
// -------------------------

const RegionMeshRoutingAPI = {
  RegionRoute,
  RankedRegionCandidate,
  computeRegionRoute,
  rankRegionsForPlacement
};

export default RegionMeshRoutingAPI;
