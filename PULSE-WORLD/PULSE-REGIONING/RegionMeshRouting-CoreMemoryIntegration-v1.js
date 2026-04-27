/**
 * RegionMeshRouting-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / REGION-MESH + CORE MEMORY
 *
 * ROLE:
 *   Wraps RegionMeshRouting with PulseCoreMemory hot caching.
 *   - Caches last route inputs/outputs
 *   - Caches last ranked candidates
 *   - Tracks hot regions and hot paths (loop-theory friendly)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import RegionMeshRoutingAPI from "./RegionMeshRouting-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

const {
  RegionRoute,
  RankedRegionCandidate,
  computeRegionRoute,
  rankRegionsForPlacement
} = RegionMeshRoutingAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "region-mesh-global";

const KEY_LAST_GRAPH = "last-region-graph";
const KEY_LAST_STABILITY_MAP = "last-stability-map";
const KEY_LAST_AFFINITY_MAP = "last-affinity-map";

const KEY_LAST_SOURCE = "last-source-region";
const KEY_LAST_TARGET = "last-target-region";

const KEY_LAST_ROUTE = "last-region-route";
const KEY_LAST_ROUTE_SCORE = "last-region-route-score";

const KEY_LAST_RANKED = "last-ranked-region-candidates";

const KEY_HOT_REGIONS = "hot-regions";
const KEY_HOT_PATHS = "hot-paths";

// -------------------------
// Internal helpers
// -------------------------

function trackRegions(regionIds) {
  if (!Array.isArray(regionIds)) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  for (const id of regionIds) {
    hot[id] = (hot[id] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hot);
}

function trackPath(path) {
  if (!Array.isArray(path) || path.length === 0) return;
  const key = path.join("->");
  const hotPaths = CoreMemory.get(ROUTE, KEY_HOT_PATHS) || {};
  hotPaths[key] = (hotPaths[key] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_PATHS, hotPaths);
}

// -------------------------
// Wrapped API
// -------------------------

export function computeRegionRouteWithMemory(
  regionGraph,
  stabilityMap,
  sourceRegionId,
  targetRegionId
) {
  CoreMemory.prewarm();

  const route = computeRegionRoute(
    regionGraph,
    stabilityMap,
    sourceRegionId,
    targetRegionId
  );

  CoreMemory.set(ROUTE, KEY_LAST_GRAPH, regionGraph);
  CoreMemory.set(ROUTE, KEY_LAST_STABILITY_MAP, stabilityMap);
  CoreMemory.set(ROUTE, KEY_LAST_SOURCE, sourceRegionId);
  CoreMemory.set(ROUTE, KEY_LAST_TARGET, targetRegionId);
  CoreMemory.set(ROUTE, KEY_LAST_ROUTE, route);
  CoreMemory.set(ROUTE, KEY_LAST_ROUTE_SCORE, route.totalCost);

  trackRegions(route.path || []);
  trackPath(route.path || []);

  return route;
}

export function rankRegionsForPlacementWithMemory(
  regionGraph,
  stabilityMap,
  sourceRegionId
) {
  CoreMemory.prewarm();

  const ranked = rankRegionsForPlacement(
    regionGraph,
    stabilityMap,
    sourceRegionId
  );

  CoreMemory.set(ROUTE, KEY_LAST_GRAPH, regionGraph);
  CoreMemory.set(ROUTE, KEY_LAST_STABILITY_MAP, stabilityMap);
  CoreMemory.set(ROUTE, KEY_LAST_SOURCE, sourceRegionId);
  CoreMemory.set(ROUTE, KEY_LAST_RANKED, ranked);

  trackRegions(ranked.map((c) => c.regionId));

  return ranked;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastRegionMeshState() {
  CoreMemory.prewarm();

  return {
    regionGraph: CoreMemory.get(ROUTE, KEY_LAST_GRAPH),
    stabilityMap: CoreMemory.get(ROUTE, KEY_LAST_STABILITY_MAP),
    affinityMap: CoreMemory.get(ROUTE, KEY_LAST_AFFINITY_MAP), // optional if you store it elsewhere
    sourceRegionId: CoreMemory.get(ROUTE, KEY_LAST_SOURCE),
    targetRegionId: CoreMemory.get(ROUTE, KEY_LAST_TARGET),
    lastRoute: CoreMemory.get(ROUTE, KEY_LAST_ROUTE),
    lastRouteScore: CoreMemory.get(ROUTE, KEY_LAST_ROUTE_SCORE),
    lastRankedCandidates: CoreMemory.get(ROUTE, KEY_LAST_RANKED),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotPaths: CoreMemory.get(ROUTE, KEY_HOT_PATHS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const RegionMeshRoutingCoreMemory = {
  RegionRoute,
  RankedRegionCandidate,
  computeRegionRouteWithMemory,
  rankRegionsForPlacementWithMemory,
  getLastRegionMeshState,
  CoreMemory
};

export default RegionMeshRoutingCoreMemory;
