/**
 * DeltaEngine-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-DELTA + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse delta physics organ for Pulse-World.
 *
 *   Wraps DeltaEngine with PulseCoreMemory hot caching and multiverse semantics:
 *     - Universes (universeId)
 *     - Timelines (timelineId)
 *     - Branches (branchId)
 *
 *   Provides:
 *     - Cached last delta / summary / patch per instance
 *     - Multiverse-aware keys (universe/timeline/branch)
 *     - Hot instances, hot fields, hot universes, hot timelines
 *     - Cosmic state snapshots (delta heatmaps)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import DeltaEngineAPI from "./DeltaEngine-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  DeltaFieldChange,
  DeltaRecord,
  DeltaSummary,
  DeltaPatch,
  computeDelta,
  summarizeDelta,
  buildDeltaPatch,
  applyDeltaPatch
} = DeltaEngineAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

// Single logical route for all multiverse delta state.
const ROUTE = "delta-cosmos-multiverse";

// Key prefixes
const KEY_DELTA_PREFIX = "delta-record:";
const KEY_SUMMARY_PREFIX = "delta-summary:";
const KEY_PATCH_PREFIX = "delta-patch:";

// Hot maps
const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_FIELDS = "hot-fields";
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
  // universe/timeline/branch/instance scoping
  return [
    prefix,
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");
}

function deltaKey(instanceId, cosmos) {
  return cosmosKey(KEY_DELTA_PREFIX, instanceId, cosmos);
}

function summaryKey(instanceId, cosmos) {
  return cosmosKey(KEY_SUMMARY_PREFIX, instanceId, cosmos);
}

function patchKey(instanceId, cosmos) {
  return cosmosKey(KEY_PATCH_PREFIX, instanceId, cosmos);
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

function trackFields(deltaRecord, cosmos) {
  const hotFields = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  for (const change of deltaRecord.changes || []) {
    const fieldKey = `${cosmos.universeId}|${cosmos.timelineId}|${change.field}`;
    hotFields[fieldKey] = (hotFields[fieldKey] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_FIELDS, hotFields);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

/**
 * computeDeltaWithMemory
 *   beforeSnapshot, afterSnapshot: same as DeltaEngine
 *   cosmosContext: { universeId?, timelineId?, branchId? }
 */
export function computeDeltaWithMemory(beforeSnapshot, afterSnapshot, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const delta = computeDelta(beforeSnapshot, afterSnapshot);
  const instanceId = delta.instanceId;

  CoreMemory.set(ROUTE, deltaKey(instanceId, cosmos), {
    ...delta,
    cosmos
  });

  trackInstance(instanceId, cosmos);
  trackFields(delta, cosmos);

  return delta;
}

/**
 * summarizeDeltaWithMemory
 *   deltaRecord: DeltaRecord
 *   cosmosContext: { universeId?, timelineId?, branchId? }
 */
export function summarizeDeltaWithMemory(deltaRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const summary = summarizeDelta(deltaRecord);
  const instanceId = deltaRecord.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), {
    ...summary,
    cosmos
  });

  trackInstance(instanceId, cosmos);

  return summary;
}

/**
 * buildDeltaPatchWithMemory
 *   deltaRecord: DeltaRecord
 *   cosmosContext: { universeId?, timelineId?, branchId? }
 */
export function buildDeltaPatchWithMemory(deltaRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const patch = buildDeltaPatch(deltaRecord);
  const instanceId = deltaRecord.instanceId;

  CoreMemory.set(ROUTE, patchKey(instanceId, cosmos), {
    ...patch,
    cosmos
  });

  trackInstance(instanceId, cosmos);

  return patch;
}

/**
 * applyDeltaPatchWithMemory
 *   snapshotRecord, deltaPatch: same as DeltaEngine
 *   cosmosContext is accepted but not used (physics is unchanged).
 */
export function applyDeltaPatchWithMemory(snapshotRecord, deltaPatch, cosmosContext = {}) {
  CoreMemory.prewarm();
  return applyDeltaPatch(snapshotRecord, deltaPatch);
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
// -------------------------

export function getLastDeltaRecord(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, deltaKey(instanceId, cosmos));
}

export function getLastDeltaSummary(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, summaryKey(instanceId, cosmos));
}

export function getLastDeltaPatch(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, patchKey(instanceId, cosmos));
}

/**
 * getDeltaMemoryState
 *   Returns global multiverse heatmaps:
 *     - hotInstances: per universe/timeline/instance
 *     - hotFields: per universe/timeline/field
 *     - hotUniverses: per universe
 *     - hotTimelines: per universe/timeline
 */
export function getDeltaMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {},
    hotFields: CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {},
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {},
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {}
  };
}

// -------------------------
// Cosmic State Helpers
// -------------------------

/**
 * getUniverseHeatmap(universeId)
 *   Returns a snapshot of activity for a given universe:
 *     - instanceHits
 *     - fieldHits
 *     - timelineHits
 */
export function getUniverseHeatmap(universeId) {
  CoreMemory.prewarm();

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const hotFields = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};

  const instanceHits = {};
  const fieldHits = {};
  const timelineHits = {};

  const universePrefix = `${universeId}|`;

  for (const key in hotInstances) {
    if (key.startsWith(universePrefix)) {
      instanceHits[key] = hotInstances[key];
    }
  }

  for (const key in hotFields) {
    if (key.startsWith(universePrefix)) {
      fieldHits[key] = hotFields[key];
    }
  }

  for (const key in hotTimelines) {
    if (key.startsWith(universePrefix)) {
      timelineHits[key] = hotTimelines[key];
    }
  }

  return {
    universeId,
    instanceHits,
    fieldHits,
    timelineHits
  };
}

/**
 * getTimelineHeatmap(universeId, timelineId)
 *   Returns activity for a specific universe+timeline pair.
 */
export function getTimelineHeatmap(universeId, timelineId) {
  CoreMemory.prewarm();

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const hotFields = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};

  const instanceHits = {};
  const fieldHits = {};
  const timelineKey = `${universeId}|${timelineId}`;
  const timelineHits = {
    [timelineKey]: hotTimelines[timelineKey] || 0
  };

  const prefix = `${universeId}|${timelineId}|`;

  for (const key in hotInstances) {
    if (key.startsWith(prefix)) {
      instanceHits[key] = hotInstances[key];
    }
  }

  for (const key in hotFields) {
    if (key.startsWith(prefix)) {
      fieldHits[key] = hotFields[key];
    }
  }

  return {
    universeId,
    timelineId,
    instanceHits,
    fieldHits,
    timelineHits
  };
}

/**
 * getCosmicStateSnapshot()
 *   High-level multiverse snapshot for Overmind / NodeAdmin:
 *     - universeCount
 *     - timelineCount
 *     - hottestUniverseId
 *     - hottestTimelineKey
 */
export function getCosmicStateSnapshot() {
  CoreMemory.prewarm();

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};

  let hottestUniverseId = null;
  let hottestUniverseScore = -1;

  for (const uid in hotUniverses) {
    const score = hotUniverses[uid];
    if (score > hottestUniverseScore) {
      hottestUniverseScore = score;
      hottestUniverseId = uid;
    }
  }

  let hottestTimelineKey = null;
  let hottestTimelineScore = -1;

  for (const key in hotTimelines) {
    const score = hotTimelines[key];
    if (score > hottestTimelineScore) {
      hottestTimelineScore = score;
      hottestTimelineKey = key;
    }
  }

  const universeCount = Object.keys(hotUniverses).length;
  const timelineCount = Object.keys(hotTimelines).length;

  return {
    universeCount,
    timelineCount,
    hottestUniverseId,
    hottestTimelineKey
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const DeltaEngineCosmosMultiverse = {
  // raw types
  DeltaFieldChange,
  DeltaRecord,
  DeltaSummary,
  DeltaPatch,

  // multiverse-aware wrapped ops
  computeDeltaWithMemory,
  summarizeDeltaWithMemory,
  buildDeltaPatchWithMemory,
  applyDeltaPatchWithMemory,

  // hot accessors
  getLastDeltaRecord,
  getLastDeltaSummary,
  getLastDeltaPatch,
  getDeltaMemoryState,

  // cosmic helpers
  getUniverseHeatmap,
  getTimelineHeatmap,
  getCosmicStateSnapshot,

  // core memory (for advanced wiring)
  CoreMemory
};

export default DeltaEngineCosmosMultiverse;
