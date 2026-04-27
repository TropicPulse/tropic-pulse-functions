/**
 * META {
 *   organ: "RegionMeshRouting",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "region-mesh-routing",
 *   version: "v11-EVO",
 *
 *   role: "Builds the routing mesh between regions. Determines preferred paths and target regions.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     regionGraphReversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "RegionGraph",
 *       "RegionStabilityMap",
 *       "RegionAffinityMap",
 *       "SourceRegionId",
 *       "TargetRegionId"
 *     ],
 *     output: [
 *       "RegionRoute",
 *       "RegionRouteScore",
 *       "RankedRegionCandidates"
 *     ]
 *   },
 *
 *   upstream: [
 *     "RegioningPhysics",
 *     "PulseSchema",
 *     "PulseOmniHosting"
 *   ],
 *
 *   downstream: [
 *     "PulseContinuance",
 *     "DeploymentPhysics",
 *     "MultiOrganismSupport"
 *   ],
 *
 *   notes: [
 *     "RegionMeshRouting operates purely on symbolic graphs and scores.",
 *     "No real networking, no host calls, no geography.",
 *     "Routing is deterministic: same inputs → same route.",
 *     "Stability and affinity both influence route cost."
 *   ]
 * }
 */

/**
 * RegionMeshRouting-v11-Evo.js
 * PULSE-WORLD / PULSE-MESH
 *
 * ROLE:
 *   Builds a symbolic routing mesh between regions.
 *   Computes preferred paths and ranked region candidates for placement/movement.
 *
 * NEVER:
 *   - Never use real network topology.
 *   - Never introduce randomness.
 *   - Never mutate RegionGraph or stability maps.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always produce reversible routes.
 */

// -------------------------
// Types
// -------------------------

/**
 * RegionRoute
 *
 * path: string[]          // ordered list of regionIds
 * totalCost: number       // 0.0 - 1.0 (normalized)
 */
export class RegionRoute {
  constructor({ path = [], totalCost = 0 }) {
    this.path = path;
    this.totalCost = clamp01(totalCost);
  }
}

/**
 * RankedRegionCandidate
 *
 * regionId: string
 * score: number           // 0.0 - 1.0 (higher = better)
 */
export class RankedRegionCandidate {
  constructor({ regionId, score = 0 }) {
    this.regionId = regionId;
    this.score = clamp01(score);
  }
}

// -------------------------
// Helpers
// -------------------------

function clamp01(v) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

/**
 * getEdgeCost
 *
 * Combines affinity + stability into a single edge cost.
 *
 * affinity: 0.0 - 1.0 (0 = close, 1 = far)
 * stability: 0.0 - 1.0 (0 = stable, 1 = unstable)
 *
 * We want:
 *   - lower affinity → lower cost
 *   - lower stability (more unstable) → higher cost
 */
function getEdgeCost(affinity, stability) {
  const a = clamp01(affinity);
  const s = clamp01(stability);
  // Weighted combination: affinity dominates, instability penalizes
  const cost = a * 0.7 + s * 0.3;
  return clamp01(cost);
}

// -------------------------
// Routing (Dijkstra-like, deterministic)
// -------------------------

/**
 * computeRegionRoute
 *
 * Input:
 *   - regionGraph: RegionGraph
 *   - stabilityMap: { [regionId: string]: number }
 *   - sourceRegionId: string
 *   - targetRegionId: string
 *
 * Output:
 *   - RegionRoute
 *
 * Logic:
 *   - Deterministic Dijkstra-like shortest path using edge cost from affinity + stability.
 */
export function computeRegionRoute(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  targetRegionId
) {
  const nodes = regionGraph.nodes || [];
  const edges = regionGraph.edges || {};

  if (!nodes.includes(sourceRegionId) || !nodes.includes(targetRegionId)) {
    return new RegionRoute({ path: [], totalCost: 1 });
  }

  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const n of nodes) {
    dist[n] = n === sourceRegionId ? 0 : Infinity;
    prev[n] = null;
  }

  while (visited.size < nodes.length) {
    // Pick unvisited node with smallest dist (deterministic tie-breaker: regionId)
    let current = null;
    let bestDist = Infinity;

    for (const n of nodes) {
      if (visited.has(n)) continue;
      if (dist[n] < bestDist || (dist[n] === bestDist && n < current)) {
        current = n;
        bestDist = dist[n];
      }
    }

    if (current === null || bestDist === Infinity) break;
    if (current === targetRegionId) break;

    visited.add(current);

    const neighbors = edges[current] || {};
    for (const [neighbor, affinity] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;

      const stability = stabilityMap[neighbor] || 0;
      const edgeCost = getEdgeCost(affinity, stability);
      const alt = dist[current] + edgeCost;

      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
      }
    }
  }

  // Reconstruct path
  const path = [];
  let u = targetRegionId;
  if (prev[u] !== null || u === sourceRegionId) {
    while (u !== null) {
      path.unshift(u);
      u = prev[u];
    }
  }

  if (path.length === 0) {
    return new RegionRoute({ path: [], totalCost: 1 });
  }

  // Normalize cost to 0..1 by dividing by max possible hops (nodes.length - 1)
  const rawCost = dist[targetRegionId];
  const maxHops = Math.max(nodes.length - 1, 1);
  const normalizedCost = clamp01(rawCost / maxHops);

  return new RegionRoute({ path, totalCost: normalizedCost });
}

// -------------------------
// Region Candidate Ranking
// -------------------------

/**
 * rankRegionsForPlacement
 *
 * Input:
 *   - regionGraph: RegionGraph
 *   - stabilityMap: { [regionId: string]: number }
 *   - sourceRegionId: string
 *
 * Output:
 *   - RankedRegionCandidate[]
 *
 * Logic:
 *   - For each region, compute a score based on:
 *       - inverse of stability (more stable = higher score)
 *       - inverse of average affinity distance from source
 *   - Higher score = better candidate.
 */
export function rankRegionsForPlacement(
  regionGraph,
  stabilityMap,
  sourceRegionId
) {
  const nodes = regionGraph.nodes || [];
  const edges = regionGraph.edges || {};

  if (!nodes.includes(sourceRegionId)) return [];

  const candidates = [];

  for (const regionId of nodes) {
    const stability = stabilityMap[regionId] || 0;
    const stabilityScore = 1 - clamp01(stability); // more stable → closer to 1

    const neighbors = edges[sourceRegionId] || {};
    const affinity = neighbors[regionId] !== undefined ? neighbors[regionId] : 1.0;
    const affinityScore = 1 - clamp01(affinity); // closer → higher

    const score = clamp01(stabilityScore * 0.6 + affinityScore * 0.4);

    candidates.push(
      new RankedRegionCandidate({
        regionId,
        score
      })
    );
  }

  // Deterministic sort: highest score first, tie-breaker by regionId
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
