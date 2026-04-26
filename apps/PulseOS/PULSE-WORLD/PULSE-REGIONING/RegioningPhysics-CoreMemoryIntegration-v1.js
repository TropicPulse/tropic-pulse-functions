/**
 * RegioningPhysics-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-REGIONING + CORE MEMORY
 *
 * ROLE:
 *   Wraps RegioningPhysics with PulseCoreMemory hot caching.
 *   - Caches last region descriptors, affinity rules, stability signals
 *   - Caches last RegionGraph, StabilityMap, AffinityMap
 *   - Tracks hot regions (loop-theory friendly)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import RegioningPhysicsAPI from "./RegioningPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "regioning-global";

const KEY_LAST_DESCRIPTORS = "last-region-descriptors";
const KEY_LAST_AFFINITY_RULES = "last-region-affinity-rules";
const KEY_LAST_STABILITY_SIGNALS = "last-region-stability-signals";

const KEY_LAST_GRAPH = "last-region-graph";
const KEY_LAST_STABILITY_MAP = "last-region-stability-map";
const KEY_LAST_AFFINITY_MAP = "last-region-affinity-map";

const KEY_HOT_REGIONS = "hot-regions";

// -------------------------
// Internal helpers
// -------------------------

function trackRegionUsage(regionIds) {
  if (!Array.isArray(regionIds)) return;

  const hot = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};

  for (const id of regionIds) {
    hot[id] = (hot[id] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hot);
}

// -------------------------
// Wrapped API
// -------------------------

export function buildRegionGraphWithMemory(regionDescriptors, affinityRules) {
  CoreMemory.prewarm();

  const graph = buildRegionGraph(regionDescriptors, affinityRules);

  CoreMemory.set(ROUTE, KEY_LAST_DESCRIPTORS, regionDescriptors);
  CoreMemory.set(ROUTE, KEY_LAST_AFFINITY_RULES, affinityRules);
  CoreMemory.set(ROUTE, KEY_LAST_GRAPH, graph);

  trackRegionUsage(graph.nodes);

  return graph;
}

export function buildRegionStabilityMapWithMemory(stabilitySignals) {
  CoreMemory.prewarm();

  const stabilityMap = buildRegionStabilityMap(stabilitySignals);

  CoreMemory.set(ROUTE, KEY_LAST_STABILITY_SIGNALS, stabilitySignals);
  CoreMemory.set(ROUTE, KEY_LAST_STABILITY_MAP, stabilityMap);

  trackRegionUsage(Object.keys(stabilityMap || {}));

  return stabilityMap;
}

export function buildRegionAffinityMapWithMemory(regionGraph) {
  CoreMemory.prewarm();

  const affinityMap = buildRegionAffinityMap(regionGraph);

  CoreMemory.set(ROUTE, KEY_LAST_AFFINITY_MAP, affinityMap);
  trackRegionUsage(regionGraph.nodes || []);

  return affinityMap;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastRegioningState() {
  CoreMemory.prewarm();

  return {
    regionDescriptors: CoreMemory.get(ROUTE, KEY_LAST_DESCRIPTORS),
    affinityRules: CoreMemory.get(ROUTE, KEY_LAST_AFFINITY_RULES),
    stabilitySignals: CoreMemory.get(ROUTE, KEY_LAST_STABILITY_SIGNALS),

    regionGraph: CoreMemory.get(ROUTE, KEY_LAST_GRAPH),
    regionStabilityMap: CoreMemory.get(ROUTE, KEY_LAST_STABILITY_MAP),
    regionAffinityMap: CoreMemory.get(ROUTE, KEY_LAST_AFFINITY_MAP),

    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const RegioningPhysicsCoreMemory = {
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

export default RegioningPhysicsCoreMemory;
