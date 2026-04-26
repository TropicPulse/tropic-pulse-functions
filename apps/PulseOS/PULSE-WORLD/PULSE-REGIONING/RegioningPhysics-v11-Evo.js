/**
 * META {
 *   organ: "RegioningPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "regioning-physics",
 *   version: "v11-EVO",
 *
 *   role: "Defines the spatial world of Pulse OS. Regions, boundaries, affinities, and stability.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     schemaAware: true,
 *     regionGraphReversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "RegionDescriptor[]",
 *       "RegionAffinityRules",
 *       "RegionStabilitySignals"
 *     ],
 *     output: [
 *       "RegionGraph",
 *       "RegionStabilityMap",
 *       "RegionAffinityMap"
 *     ]
 *   },
 *
 *   upstream: [
 *     "PulseSchema",
 *     "PulseOmniHosting"
 *   ],
 *
 *   downstream: [
 *     "RegionMeshRouting",
 *     "PulseContinuance",
 *     "EnvironmentPhysics",
 *     "DeploymentPhysics"
 *   ],
 *
 *   notes: [
 *     "Regioning Physics defines the world the organism lives in.",
 *     "Regions are symbolic, not geographic.",
 *     "RegionGraph is deterministic and reversible.",
 *     "Region stability feeds directly into Continuance Physics.",
 *     "Region affinities determine movement cost and routing preference."
 *   ]
 * }
 */

/**
 * RegioningPhysics-v11-Evo.js
 * PULSE-WORLD / PULSE-REGIONING
 *
 * ROLE:
 *   Defines the symbolic world map for Pulse OS.
 *   Regions, boundaries, affinities, stability, and relationships.
 *
 * NEVER:
 *   - Never use real geography.
 *   - Never embed host-specific logic.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always produce reversible region graphs.
 */

// -------------------------
// Region Descriptor
// -------------------------

/**
 * RegionDescriptor
 *
 * regionId: string
 * label: human-friendly name
 * meta: free-form metadata
 */
export class RegionDescriptor {
  constructor({ regionId, label = "", meta = {} }) {
    this.regionId = regionId;
    this.label = label;
    this.meta = meta;
  }
}

// -------------------------
// Region Affinity Rules
// -------------------------

/**
 * RegionAffinityRules
 *
 * Defines symbolic "distance" or "cost" between regions.
 *
 * Example:
 * {
 *   "us-west": { "us-east": 0.3, "eu-central": 0.7 },
 *   "us-east": { "us-west": 0.3, "eu-central": 0.5 }
 * }
 */
export class RegionAffinityRules {
  constructor(rules = {}) {
    this.rules = rules;
  }
}

// -------------------------
// Region Stability Signals
// -------------------------

/**
 * RegionStabilitySignal
 *
 * regionId: string
 * instability: number (0.0 - 1.0)
 * trend: "rising" | "falling" | "stable"
 */
export class RegionStabilitySignal {
  constructor({ regionId, instability = 0, trend = "stable" }) {
    this.regionId = regionId;
    this.instability = clamp01(instability);
    this.trend = trend;
  }
}

// -------------------------
// Region Graph
// -------------------------

/**
 * RegionGraph
 *
 * nodes: regionIds
 * edges: adjacency list with affinity weights
 */
export class RegionGraph {
  constructor({ nodes = [], edges = {} }) {
    this.nodes = nodes;
    this.edges = edges;
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

// -------------------------
// Region Graph Builder
// -------------------------

/**
 * buildRegionGraph
 *
 * Input:
 *   - regionDescriptors: RegionDescriptor[]
 *   - affinityRules: RegionAffinityRules
 *
 * Output:
 *   - RegionGraph
 *
 * Logic:
 *   - Every region becomes a node.
 *   - Affinity rules define weighted edges.
 *   - Missing edges default to weight = 1.0 (max cost).
 */
export function buildRegionGraph(regionDescriptors, affinityRules) {
  const nodes = regionDescriptors.map((r) => r.regionId);
  const edges = {};

  for (const region of nodes) {
    edges[region] = {};

    for (const other of nodes) {
      if (region === other) continue;

      const weight =
        affinityRules.rules?.[region]?.[other] !== undefined
          ? affinityRules.rules[region][other]
          : 1.0;

      edges[region][other] = clamp01(weight);
    }
  }

  return new RegionGraph({ nodes, edges });
}

// -------------------------
// Region Stability Map
// -------------------------

/**
 * buildRegionStabilityMap
 *
 * Input:
 *   - stabilitySignals: RegionStabilitySignal[]
 *
 * Output:
 *   - { [regionId: string]: number }
 */
export function buildRegionStabilityMap(stabilitySignals) {
  const map = {};

  for (const sig of stabilitySignals) {
    const trendWeight =
      sig.trend === "rising" ? 0.5 :
      sig.trend === "stable" ? 0.3 :
      0.2;

    const score = clamp01(sig.instability * trendWeight);
    map[sig.regionId] = score;
  }

  return map;
}

// -------------------------
// Region Affinity Map
// -------------------------

/**
 * buildRegionAffinityMap
 *
 * Input:
 *   - regionGraph: RegionGraph
 *
 * Output:
 *   - { [regionId: string]: { [otherRegionId: string]: number } }
 *
 * This is just a normalized view of the graph edges.
 */
export function buildRegionAffinityMap(regionGraph) {
  return regionGraph.edges;
}

// -------------------------
// Exported API
// -------------------------

const RegioningPhysicsAPI = {
  RegionDescriptor,
  RegionAffinityRules,
  RegionStabilitySignal,
  RegionGraph,
  buildRegionGraph,
  buildRegionStabilityMap,
  buildRegionAffinityMap
};

export default RegioningPhysicsAPI;
