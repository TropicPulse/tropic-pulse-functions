/**
 * RegioningPhysics-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-REGIONING + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware regioning membrane.
 *
 *   Wraps RegioningPhysics with PulseCoreMemory hot caching:
 *     - Caches region descriptors, affinity rules, stability signals
 *       per universe/timeline/branch
 *     - Caches RegionGraph, StabilityMap, AffinityMap
 *       per universe/timeline/branch
 *     - Tracks hot regions, hot universes, hot timelines
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import RegioningPhysicsAPI from "./RegioningPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  RegionDescriptor,
  RegionAffinityRules,
  RegionStabilitySignal,
  RegionGraph,
  buildRegionGraph,
  buildRegionStabilityMap,
  buildRegionAffinityMap
} = RegioningPhysicsAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "regioning-cosmos-multiverse";

const KEY_LAST_DESCRIPTORS = "last-region-descriptors";
const KEY_LAST_AFFINITY_RULES = "last-region-affinity-rules";
const KEY_LAST_STABILITY_SIGNALS = "last-region-stability-signals";

const KEY_LAST_GRAPH = "last-region-graph";
const KEY_LAST_STABILITY_MAP = "last-region-stability-map";
const KEY_LAST_AFFINITY_MAP = "last-region-affinity-map";

const KEY_HOT_REGIONS = "hot-regions";
const KEY_HOT_UNIVERSES = "hot-universes";
const KEY_HOT_TIMELINES = "hot-timelines";

// -------------------------
// Multiverse helpers
// -------------------------

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

function cosmosKey(prefix, cosmos) {
  return `${prefix}|${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}`;
}

function keyDescriptors(cosmos) {
  return cosmosKey(KEY_LAST_DESCRIPTORS, cosmos);
}

function keyAffinityRules(cosmos) {
  return cosmosKey(KEY_LAST_AFFINITY_RULES, cosmos);
}

function keyStabilitySignals(cosmos) {
  return cosmosKey(KEY_LAST_STABILITY_SIGNALS, cosmos);
}

function keyGraph(cosmos) {
  return cosmosKey(KEY_LAST_GRAPH, cosmos);
}

function keyStabilityMap(cosmos) {
  return cosmosKey(KEY_LAST_STABILITY_MAP, cosmos);
}

function keyAffinityMap(cosmos) {
  return cosmosKey(KEY_LAST_AFFINITY_MAP, cosmos);
}

// -------------------------
// Hot tracking
// -------------------------

function trackRegionUsage(regionIds, cosmos) {
  if (!Array.isArray(regionIds)) return;

  const hotRegions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};

  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;

  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;

  for (const id of regionIds) {
    const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${id}`;
    hotRegions[rKey] = (hotRegions[rKey] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hotRegions);
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

export function buildRegionGraphWithMemory(regionDescriptors, affinityRules, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const graph = buildRegionGraph(regionDescriptors, affinityRules);

  CoreMemory.set(ROUTE, keyDescriptors(cosmos), regionDescriptors);
  CoreMemory.set(ROUTE, keyAffinityRules(cosmos), affinityRules);
  CoreMemory.set(ROUTE, keyGraph(cosmos), graph);

  trackRegionUsage(graph.nodes || [], cosmos);

  return graph;
}

export function buildRegionStabilityMapWithMemory(stabilitySignals, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const stabilityMap = buildRegionStabilityMap(stabilitySignals);

  CoreMemory.set(ROUTE, keyStabilitySignals(cosmos), stabilitySignals);
  CoreMemory.set(ROUTE, keyStabilityMap(cosmos), stabilityMap);

  trackRegionUsage(Object.keys(stabilityMap || {}), cosmos);

  return stabilityMap;
}

export function buildRegionAffinityMapWithMemory(regionGraph, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const affinityMap = buildRegionAffinityMap(regionGraph);

  CoreMemory.set(ROUTE, keyAffinityMap(cosmos), affinityMap);

  trackRegionUsage(regionGraph.nodes || [], cosmos);

  return affinityMap;
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
// -------------------------

export function getLastRegioningState(cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);

  return {
    cosmos,
    regionDescriptors: CoreMemory.get(ROUTE, keyDescriptors(cosmos)),
    affinityRules: CoreMemory.get(ROUTE, keyAffinityRules(cosmos)),
    stabilitySignals: CoreMemory.get(ROUTE, keyStabilitySignals(cosmos)),

    regionGraph: CoreMemory.get(ROUTE, keyGraph(cosmos)),
    regionStabilityMap: CoreMemory.get(ROUTE, keyStabilityMap(cosmos)),
    regionAffinityMap: CoreMemory.get(ROUTE, keyAffinityMap(cosmos)),

    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const RegioningPhysicsCosmosMultiverse = {
  RegionDescriptor,
  RegionAffinityRules,
  RegionStabilitySignal,
  RegionGraph,

  buildRegionGraphWithMemory,
  buildRegionStabilityMapWithMemory,
  buildRegionAffinityMapWithMemory,

  getLastRegioningState,
  CoreMemory
};

export default RegioningPhysicsCosmosMultiverse;
