/**
 * LineageEngine-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-LINEAGE + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware lineage + state membrane.
 *
 *   Wraps LineageEngine with PulseCoreMemory hot caching:
 *     - Caches lineage per universe/timeline/branch/instance
 *     - Caches current state per universe/timeline/branch/instance
 *     - Caches lineage summary per universe/timeline/branch/instance
 *     - Caches compacted lineage per universe/timeline/branch/instance
 *     - Tracks hot instances, regions, hosts, universes, timelines
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import LineageEngineAPI from "./LineageEngine-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  LineageEventType,
  LineageEvent,
  LineageRecord,
  CurrentInstanceState,
  LineageSummary,
  createLineageRoot,
  appendLineageEvent,
  computeCurrentInstanceState,
  summarizeLineage,
  compactLineage
} = LineageEngineAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "lineage-cosmos-multiverse";

const KEY_LINEAGE_PREFIX = "lineage:";
const KEY_STATE_PREFIX = "state:";
const KEY_SUMMARY_PREFIX = "summary:";
const KEY_COMPACT_PREFIX = "compact:";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_REGIONS = "hot-regions";
const KEY_HOT_HOSTS = "hot-hosts";
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

function cosmosKey(prefix, instanceId, cosmos) {
  return [
    prefix,
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");
}

function lineageKey(instanceId, cosmos) {
  return cosmosKey(KEY_LINEAGE_PREFIX, instanceId, cosmos);
}

function stateKey(instanceId, cosmos) {
  return cosmosKey(KEY_STATE_PREFIX, instanceId, cosmos);
}

function summaryKey(instanceId, cosmos) {
  return cosmosKey(KEY_SUMMARY_PREFIX, instanceId, cosmos);
}

function compactKey(instanceId, cosmos) {
  return cosmosKey(KEY_COMPACT_PREFIX, instanceId, cosmos);
}

// -------------------------
// Hot tracking
// -------------------------

function trackInstance(instanceId, cosmos) {
  if (!instanceId) return;

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const key = `${cosmos.universeId}|${cosmos.timelineId}|${instanceId}`;
  hotInstances[key] = (hotInstances[key] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hotInstances);

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);
}

function trackRegionHostFromState(state, cosmos) {
  if (!state) return;

  const regions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hosts = CoreMemory.get(ROUTE, KEY_HOT_HOSTS) || {};

  if (state.currentRegionId) {
    const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${state.currentRegionId}`;
    regions[rKey] = (regions[rKey] || 0) + 1;
  }

  if (state.currentHostName) {
    const hKey = `${cosmos.universeId}|${cosmos.timelineId}|${state.currentHostName}`;
    hosts[hKey] = (hosts[hKey] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, regions);
  CoreMemory.set(ROUTE, KEY_HOT_HOSTS, hosts);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

export function createLineageRootWithMemory(args, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const record = createLineageRoot(args);
  const instanceId = record.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), record);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(record);
  const summary = summarizeLineage(record);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return record;
}

export function appendLineageEventWithMemory(lineageRecord, event, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const updated = appendLineageEvent(lineageRecord, event);
  const instanceId = updated.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), updated);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(updated);
  const summary = summarizeLineage(updated);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return updated;
}

export function computeCurrentInstanceStateWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const state = computeCurrentInstanceState(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  trackInstance(instanceId, cosmos);
  trackRegionHostFromState(state, cosmos);

  return state;
}

export function summarizeLineageWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const summary = summarizeLineage(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackInstance(instanceId, cosmos);

  return summary;
}

export function compactLineageWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const compacted = compactLineage(lineageRecord);
  const instanceId = compacted.instanceId;

  CoreMemory.set(ROUTE, compactKey(instanceId, cosmos), compacted);
  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), compacted);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(compacted);
  const summary = summarizeLineage(compacted);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return compacted;
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
// -------------------------

export function getLastLineageRecord(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, lineageKey(instanceId, cosmos));
}

export function getLastCurrentState(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, stateKey(instanceId, cosmos));
}

export function getLastLineageSummary(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, summaryKey(instanceId, cosmos));
}

export function getLastCompactedLineage(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, compactKey(instanceId, cosmos));
}

export function getLineageMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotHosts: CoreMemory.get(ROUTE, KEY_HOT_HOSTS),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const LineageEngineCosmosMultiverse = {
  LineageEventType,
  LineageEvent,
  LineageRecord,
  CurrentInstanceState,
  LineageSummary,

  createLineageRootWithMemory,
  appendLineageEventWithMemory,
  computeCurrentInstanceStateWithMemory,
  summarizeLineageWithMemory,
  compactLineageWithMemory,

  getLastLineageRecord,
  getLastCurrentState,
  getLastLineageSummary,
  getLastCompactedLineage,
  getLineageMemoryState,

  CoreMemory
};

export default LineageEngineCosmosMultiverse;
