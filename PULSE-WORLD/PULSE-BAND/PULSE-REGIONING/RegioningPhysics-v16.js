/*
===============================================================================
FILE: /PULSE-WORLD/RegioningPhysics-v16.js
LAYER: PULSE-WORLD SUBSTRATE — REGIONING PHYSICS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.RegioningPhysics",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "regioning_physics",
  lineage: "RegioningPhysics-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    multiverseAware: true,
    schemaAware: true,
    regionGraphReversible: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    coreMemoryAware: true,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "RegionDescriptor[]",
      "RegionAffinityRules",
      "RegionStabilitySignals",
      "CosmosContext { universeId, timelineId, branchId }"
    ],
    output: [
      "RegionGraph",
      "RegionStabilityMap",
      "RegionAffinityMap"
    ]
  },

  upstream: [
    "PulseSchema",
    "PulseOmniHosting"
  ],

  downstream: [
    "RegionMeshRouting-v16",
    "PulseContinuance-v16",
    "EnvironmentPhysics-v16",
    "DeploymentPhysics-v16"
  ],

  notes: [
    "Regioning Physics defines the multiverse world the organism lives in.",
    "Regions are symbolic sectors, not geographic.",
    "RegionGraph is deterministic and reversible across universes.",
    "Stability feeds cosmic turbulence into Continuance Physics.",
    "Affinities determine gravitational routing preference.",
    "CoreMemory integration is write-only, multiverse keyed, and drift-proof."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.RegioningPhysics",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "RegionDescriptor[]",
    "RegionAffinityRules",
    "RegionStabilitySignals",
    "CosmosContext"
  ],

  produces: [
    "RegionGraph",
    "RegionStabilityMap",
    "RegionAffinityMap"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const REGIONING_ENGINE_VERSION = "16.0-Immortal";
const REGIONING_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

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

    this.schemaVersion = REGIONING_SCHEMA_VERSION;
    this.engineVersion = REGIONING_ENGINE_VERSION;
  }
}

// -------------------------
// Helpers
// -------------------------

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// -------------------------
// Region Graph Builder (v16 Multiverse)
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
// Region Stability Map (v16 Multiverse)
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
    map,
    schemaVersion: REGIONING_SCHEMA_VERSION,
    engineVersion: REGIONING_ENGINE_VERSION
  };
}

// -------------------------
// Region Affinity Map (v16 Multiverse)
// -------------------------

export function buildRegionAffinityMap(regionGraph, cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  return {
    cosmos,
    affinities: regionGraph.edges,
    schemaVersion: REGIONING_SCHEMA_VERSION,
    engineVersion: REGIONING_ENGINE_VERSION
  };
}

// ---------------------------------------------------------------------------
// CoreMemory + Multiverse Regioning Caching (v16)
// ---------------------------------------------------------------------------

const ROUTE = "regioning-physics-v16";

const KEY_GRAPH_PREFIX     = "graph:";
const KEY_STABILITY_PREFIX = "stability:";
const KEY_AFFINITY_PREFIX  = "affinity:";

const KEY_HOT_REGIONS     = "hot-regions";
const KEY_HOT_EDGES       = "hot-edges";
const KEY_HOT_UNIVERSES   = "hot-universes";
const KEY_HOT_TIMELINES   = "hot-timelines";
const KEY_HOT_INSTABILITY = "hot-instability";

function cosmosKey(prefix, cosmos) {
  return [
    prefix,
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId
  ].join("|");
}

function graphKey(cosmos) {
  return cosmosKey(KEY_GRAPH_PREFIX, cosmos);
}

function stabilityKey(cosmos) {
  return cosmosKey(KEY_STABILITY_PREFIX, cosmos);
}

function affinityKey(cosmos) {
  return cosmosKey(KEY_AFFINITY_PREFIX, cosmos);
}

function trackRegioningHot(regionGraph, stabilityMap, affinityMap) {
  const cosmos = regionGraph.cosmos || stabilityMap.cosmos || affinityMap.cosmos;
  if (!cosmos) return;

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);

  const hotRegions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  for (const regionId of regionGraph.nodes || []) {
    const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${regionId}`;
    hotRegions[rKey] = (hotRegions[rKey] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hotRegions);

  const hotEdges = CoreMemory.get(ROUTE, KEY_HOT_EDGES) || {};
  for (const from of Object.keys(regionGraph.edges || {})) {
    for (const to of Object.keys(regionGraph.edges[from] || {})) {
      const eKey = `${cosmos.universeId}|${cosmos.timelineId}|${from}->${to}`;
      hotEdges[eKey] = (hotEdges[eKey] || 0) + 1;
    }
  }
  CoreMemory.set(ROUTE, KEY_HOT_EDGES, hotEdges);

  const hotInstability = CoreMemory.get(ROUTE, KEY_HOT_INSTABILITY) || {};
  const stability = stabilityMap.map || {};
  for (const [regionId, score] of Object.entries(stability)) {
    const sKey = `${cosmos.universeId}|${cosmos.timelineId}|${regionId}`;
    hotInstability[sKey] = (hotInstability[sKey] || 0) + score;
  }
  CoreMemory.set(ROUTE, KEY_HOT_INSTABILITY, hotInstability);
}

// ---------------------------------------------------------------------------
// Wrapped API with CoreMemory
// ---------------------------------------------------------------------------

export function buildRegionGraphWithMemory(regionDescriptors, affinityRules, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const graph = buildRegionGraph(regionDescriptors, affinityRules, cosmos);

  const kGraph = graphKey(cosmos);
  CoreMemory.set(ROUTE, kGraph, graph);

  // We don't yet have stability/affinity maps here; they will be written by their own wrappers.
  return graph;
}

export function buildRegionStabilityMapWithMemory(stabilitySignals, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const stability = buildRegionStabilityMap(stabilitySignals, cosmos);

  const kStability = stabilityKey(cosmos);
  CoreMemory.set(ROUTE, kStability, stability);

  // Try to read graph + affinity to track hot metrics if present
  const graph = CoreMemory.get(ROUTE, graphKey(cosmos)) || new RegionGraph({ cosmos, nodes: [], edges: {} });
  const affinity = CoreMemory.get(ROUTE, affinityKey(cosmos)) || { cosmos, affinities: {} };

  trackRegioningHot(graph, stability, affinity);

  return stability;
}

export function buildRegionAffinityMapWithMemory(regionGraph, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext || regionGraph.cosmos || {});
  const affinity = buildRegionAffinityMap(regionGraph, cosmos);

  const kAffinity = affinityKey(cosmos);
  CoreMemory.set(ROUTE, kAffinity, affinity);

  // Try to read stability to track hot metrics if present
  const stability = CoreMemory.get(ROUTE, stabilityKey(cosmos)) || {
    cosmos,
    map: {},
    schemaVersion: REGIONING_SCHEMA_VERSION,
    engineVersion: REGIONING_ENGINE_VERSION
  };

  trackRegioningHot(regionGraph, stability, affinity);

  return affinity;
}

// -------------------------
// CoreMemory Accessors
// -------------------------

export function getLastRegionGraph(cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, graphKey(cosmos));
}

export function getLastRegionStabilityMap(cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, stabilityKey(cosmos));
}

export function getLastRegionAffinityMap(cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, affinityKey(cosmos));
}

export function getRegioningMemoryState() {
  CoreMemory.prewarm();

  return {
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotEdges: CoreMemory.get(ROUTE, KEY_HOT_EDGES),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES),
    hotInstability: CoreMemory.get(ROUTE, KEY_HOT_INSTABILITY)
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
  buildRegionAffinityMap,

  buildRegionGraphWithMemory,
  buildRegionStabilityMapWithMemory,
  buildRegionAffinityMapWithMemory,

  getLastRegionGraph,
  getLastRegionStabilityMap,
  getLastRegionAffinityMap,
  getRegioningMemoryState,

  CoreMemory,
  ROUTE,
  REGIONING_ENGINE_VERSION,
  REGIONING_SCHEMA_VERSION
};

export default RegioningPhysicsAPI;
