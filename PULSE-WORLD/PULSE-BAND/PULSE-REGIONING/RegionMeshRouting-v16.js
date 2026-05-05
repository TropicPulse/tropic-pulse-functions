/*
===============================================================================
FILE: /PULSE-WORLD/RegionMeshRouting-v16-Immortal.js
LAYER: PULSE-WORLD SUBSTRATE — REGION MESH ROUTING PHYSICS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.RegionMeshRouting",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "region_mesh_routing",
  lineage: "RegionMeshRouting-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    multiverseAware: true,
    regionGraphReversible: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    coreMemoryAware: true,
    schemaVersioned: true,
    advantageAware: true,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "RegionGraph",
      "RegionStabilityMap",
      "RegionAffinityMap",
      "CosmosContext",
      "SourceRegionId",
      "TargetRegionId"
    ],
    output: [
      "RegionRoute",
      "RankedRegionCandidate[]",
      "RegionRouteEnvelope"
    ]
  },

  upstream: [
    "RegioningPhysics-v16",
    "PulseSchema",
    "PulseOmniHosting"
  ],

  downstream: [
    "PulseContinuance-v16",
    "DeploymentPhysics-v16",
    "MultiOrganismSupport-v16"
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.RegionMeshRouting",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "RegionGraph",
    "RegionStabilityMap",
    "RegionAffinityMap",
    "CosmosContext",
    "SourceRegionId",
    "TargetRegionId"
  ],

  produces: [
    "RegionRoute",
    "RankedRegionCandidate[]",
    "RegionRouteEnvelope"
  ],

  sideEffects: "none",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const REGION_MESH_ENGINE_VERSION = "16.0-Immortal";
const REGION_MESH_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// Imports — Regioning + CoreMemory bridge
// ---------------------------------------------------------------------------

import RegioningPhysicsAPI from "./RegioningPhysics-v16-Immortal.js";
import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const {
  RegionDescriptor,
  RegionAffinityRules,
  RegionStabilitySignal,
  RegionGraph
} = RegioningPhysicsAPI;

const CoreMemory = PulseProofBridge.coreMemory;

// ---------------------------------------------------------------------------
// Cosmos Context
// ---------------------------------------------------------------------------

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export class RegionRoute {
  constructor({ cosmos, path = [], totalCost = 0, advantage = 0 }) {
    this.cosmos = cosmos;
    this.path = path;
    this.totalCost = clamp01(totalCost);
    this.advantage = clamp01(advantage);

    this.schemaVersion = REGION_MESH_SCHEMA_VERSION;
    this.engineVersion = REGION_MESH_ENGINE_VERSION;
  }
}

export class RankedRegionCandidate {
  constructor({ cosmos, regionId, score }) {
    this.cosmos = cosmos;
    this.regionId = regionId;
    this.score = clamp01(score);

    this.schemaVersion = REGION_MESH_SCHEMA_VERSION;
    this.engineVersion = REGION_MESH_ENGINE_VERSION;
  }
}

export class RegionRouteEnvelope {
  constructor({
    schemaVersion,
    engineVersion,
    cosmos,
    sourceRegionId,
    targetRegionId,
    route,
    candidates,
    integrity
  }) {
    this.schemaVersion = schemaVersion;
    this.engineVersion = engineVersion;
    this.cosmos = cosmos;
    this.sourceRegionId = sourceRegionId;
    this.targetRegionId = targetRegionId;
    this.route = route;
    this.candidates = candidates;
    this.integrity = integrity;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function computeEdgeCost(affinity, stability) {
  const a = clamp01(affinity);
  const s = clamp01(stability);
  return clamp01(a * 0.7 + s * 0.3);
}

function computeRouteAdvantage(path, totalCost) {
  if (!Array.isArray(path) || path.length === 0) return 0;
  const hops = path.length - 1;
  const hopScore = hops === 0 ? 1 : clamp01(1 / (1 + hops));
  const costScore = clamp01(1 - totalCost);
  return clamp01(0.6 * costScore + 0.4 * hopScore);
}

function computeIntegrityHash(payload) {
  const json = JSON.stringify(payload || {});
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0;
  }
  return "REGION_MESH_INTEGRITY_" + hash.toString(16).padStart(8, "0");
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
      if (dist[n] < best || (dist[n] === best && (current === null || n < current))) {
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

// ---------------------------------------------------------------------------
// Core Routing Logic (v16 IMMORTAL)
// ---------------------------------------------------------------------------

export function computeRegionRoute(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  targetRegionId,
  cosmosContext = {}
) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);

  const { path, cost } = dijkstra(
    regionGraph,
    stabilityMap,
    sourceRegionId,
    targetRegionId
  );

  const advantage = computeRouteAdvantage(path, cost);

  const route = new RegionRoute({
    cosmos,
    path,
    totalCost: cost,
    advantage
  });

  const key = [
    "route",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    sourceRegionId,
    targetRegionId
  ].join("|");

  CoreMemory.set("region-mesh-routing-v16", key, route);

  return route;
}

export function rankRegionsForPlacement(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  cosmosContext = {}
) {
  CoreMemory.prewarm();

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

  const key = [
    "rank",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    sourceRegionId
  ].join("|");

  CoreMemory.set("region-mesh-routing-v16", key, candidates);

  return candidates;
}

// ---------------------------------------------------------------------------
 // Envelope Builder (v16 IMMORTAL)
// ---------------------------------------------------------------------------

export function buildRegionRouteEnvelope({
  regionGraph,
  stabilityMap,
  sourceRegionId,
  targetRegionId,
  cosmosContext = {}
}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const route = computeRegionRoute(
    regionGraph,
    stabilityMap,
    sourceRegionId,
    targetRegionId,
    cosmos
  );

  const candidates = rankRegionsForPlacement(
    regionGraph,
    stabilityMap,
    sourceRegionId,
    cosmos
  );

  const basePayload = {
    schemaVersion: REGION_MESH_SCHEMA_VERSION,
    engineVersion: REGION_MESH_ENGINE_VERSION,
    cosmos,
    sourceRegionId,
    targetRegionId,
    route,
    candidates
  };

  const integrity = {
    hash: computeIntegrityHash(basePayload),
    schemaVersion: REGION_MESH_SCHEMA_VERSION
  };

  return new RegionRouteEnvelope({
    ...basePayload,
    integrity
  });
}

// ---------------------------------------------------------------------------
// CoreMemory Accessors
// ---------------------------------------------------------------------------

export function getLastRoute(sourceRegionId, targetRegionId, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const key = [
    "route",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    sourceRegionId,
    targetRegionId
  ].join("|");

  return CoreMemory.get("region-mesh-routing-v16", key);
}

export function getLastRankings(sourceRegionId, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const key = [
    "rank",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    sourceRegionId
  ].join("|");

  return CoreMemory.get("region-mesh-routing-v16", key);
}

export function getRegionMeshMemoryState() {
  CoreMemory.prewarm();
  return CoreMemory.getNamespace("region-mesh-routing-v16");
}

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------

const RegionMeshRoutingAPI = {
  RegionDescriptor,
  RegionAffinityRules,
  RegionStabilitySignal,
  RegionGraph,

  RegionRoute,
  RankedRegionCandidate,
  RegionRouteEnvelope,

  computeRegionRoute,
  rankRegionsForPlacement,
  buildRegionRouteEnvelope,

  getLastRoute,
  getLastRankings,
  getRegionMeshMemoryState,

  CoreMemory,
  REGION_MESH_ENGINE_VERSION,
  REGION_MESH_SCHEMA_VERSION
};

export default RegionMeshRoutingAPI;
