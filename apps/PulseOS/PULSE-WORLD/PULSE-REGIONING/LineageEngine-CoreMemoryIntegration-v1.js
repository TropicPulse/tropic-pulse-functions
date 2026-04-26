/**
 * LineageEngine-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-LINEAGE + CORE MEMORY
 *
 * ROLE:
 *   Wraps LineageEngine with PulseCoreMemory hot caching.
 *   - Caches lineage per instance
 *   - Caches current state per instance
 *   - Caches lineage summary per instance
 *   - Caches compacted lineage per instance
 *   - Tracks hot instances + hot regions/hosts (loop-theory friendly)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import LineageEngineAPI from "./LineageEngine-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "lineage-global";

const KEY_LINEAGE_PREFIX = "lineage:";
const KEY_STATE_PREFIX = "state:";
const KEY_SUMMARY_PREFIX = "summary:";
const KEY_COMPACT_PREFIX = "compact:";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_REGIONS = "hot-regions";
const KEY_HOT_HOSTS = "hot-hosts";

// -------------------------
// Internal helpers
// -------------------------

function lineageKey(instanceId) {
  return `${KEY_LINEAGE_PREFIX}${instanceId}`;
}

function stateKey(instanceId) {
  return `${KEY_STATE_PREFIX}${instanceId}`;
}

function summaryKey(instanceId) {
  return `${KEY_SUMMARY_PREFIX}${instanceId}`;
}

function compactKey(instanceId) {
  return `${KEY_COMPACT_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  if (!instanceId) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackRegionHostFromState(state) {
  if (!state) return;
  const regions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hosts = CoreMemory.get(ROUTE, KEY_HOT_HOSTS) || {};

  if (state.currentRegionId) {
    regions[state.currentRegionId] = (regions[state.currentRegionId] || 0) + 1;
  }
  if (state.currentHostName) {
    hosts[state.currentHostName] = (hosts[state.currentHostName] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, regions);
  CoreMemory.set(ROUTE, KEY_HOT_HOSTS, hosts);
}

// -------------------------
// Wrapped API
// -------------------------

export function createLineageRootWithMemory(args) {
  CoreMemory.prewarm();

  const record = createLineageRoot(args);
  const instanceId = record.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId), record);
  trackInstance(instanceId);

  // Precompute and cache state + summary
  const state = computeCurrentInstanceState(record);
  const summary = summarizeLineage(record);

  CoreMemory.set(ROUTE, stateKey(instanceId), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackRegionHostFromState(state);

  return record;
}

export function appendLineageEventWithMemory(lineageRecord, event) {
  CoreMemory.prewarm();

  const updated = appendLineageEvent(lineageRecord, event);
  const instanceId = updated.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId), updated);
  trackInstance(instanceId);

  const state = computeCurrentInstanceState(updated);
  const summary = summarizeLineage(updated);

  CoreMemory.set(ROUTE, stateKey(instanceId), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackRegionHostFromState(state);

  return updated;
}

export function computeCurrentInstanceStateWithMemory(lineageRecord) {
  CoreMemory.prewarm();

  const state = computeCurrentInstanceState(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, stateKey(instanceId), state);
  trackInstance(instanceId);
  trackRegionHostFromState(state);

  return state;
}

export function summarizeLineageWithMemory(lineageRecord) {
  CoreMemory.prewarm();

  const summary = summarizeLineage(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackInstance(instanceId);

  return summary;
}

export function compactLineageWithMemory(lineageRecord) {
  CoreMemory.prewarm();

  const compacted = compactLineage(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, compactKey(instanceId), compacted);
  CoreMemory.set(ROUTE, lineageKey(instanceId), compacted);
  trackInstance(instanceId);

  const state = computeCurrentInstanceState(compacted);
  const summary = summarizeLineage(compacted);

  CoreMemory.set(ROUTE, stateKey(instanceId), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackRegionHostFromState(state);

  return compacted;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastLineageRecord(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, lineageKey(instanceId));
}

export function getLastCurrentState(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, stateKey(instanceId));
}

export function getLastLineageSummary(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, summaryKey(instanceId));
}

export function getLastCompactedLineage(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, compactKey(instanceId));
}

export function getLineageMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotHosts: CoreMemory.get(ROUTE, KEY_HOT_HOSTS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const LineageEngineCoreMemory = {
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

export default LineageEngineCoreMemory;
