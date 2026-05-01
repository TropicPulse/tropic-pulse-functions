/**
 * META {
 *   organ: "RegioningPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "regioning-physics",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Defines the multiverse spatial world of Pulse OS: universes, timelines, branches, regions, affinities, stability.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     multiverseAware: true,
 *     schemaAware: true,
 *     regionGraphReversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "RegionDescriptor[]",
 *       "RegionAffinityRules",
 *       "RegionStabilitySignals",
 *       "CosmosContext { universeId, timelineId, branchId }"
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
 *     "RegionMeshRouting-v13",
 *     "PulseContinuance-v13",
 *     "EnvironmentPhysics",
 *     "DeploymentPhysics-v13"
 *   ],
 *
 *   notes: [
 *     "Regioning Physics defines the multiverse world the organism lives in.",
 *     "Regions are symbolic sectors, not geographic.",
 *     "RegionGraph is deterministic and reversible across universes.",
 *     "Stability feeds cosmic turbulence into Continuance Physics.",
 *     "Affinities determine gravitational routing preference."
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
// Region Descriptor
// -------------------------

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

export class RegionAffinityRules {
  constructor(rules = {}) {
    this.rules = rules;
  }
}

// -------------------------
// Region Stability Signals
// -------------------------

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

export class RegionGraph {
  constructor({ cosmos, nodes = [], edges = {} }) {
    this.cosmos = cosmos; // multiverse placement
    this.nodes = nodes;
    this.edges = edges;
  }
}

// -------------------------
// Helpers
// -------------------------

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// -------------------------
// Region Graph Builder (v13 Multiverse)
// -------------------------

export function buildRegionGraph(regionDescriptors, affinityRules, cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

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

  return new RegionGraph({ cosmos, nodes, edges });
}

// -------------------------
// Region Stability Map (v13 Multiverse)
// -------------------------

export function buildRegionStabilityMap(stabilitySignals, cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);
  const map = {};

  for (const sig of stabilitySignals) {
    const trendWeight =
      sig.trend === "rising" ? 0.5 :
      sig.trend === "stable" ? 0.3 :
      0.2;

    const score = clamp01(sig.instability * trendWeight);
    map[sig.regionId] = score;
  }

  return {
    cosmos,
    map
  };
}

// -------------------------
// Region Affinity Map (v13 Multiverse)
// -------------------------

export function buildRegionAffinityMap(regionGraph, cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  return {
    cosmos,
    affinities: regionGraph.edges
  };
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
