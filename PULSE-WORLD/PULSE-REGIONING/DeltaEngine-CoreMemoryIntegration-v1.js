/**
 * DeltaEngine-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-DELTA + CORE MEMORY
 *
 * ROLE:
 *   Wraps DeltaEngine with PulseCoreMemory hot caching.
 *   - Caches last delta per instance
 *   - Caches last delta summary per instance
 *   - Caches last delta patch per instance
 *   - Tracks hot fields and hot instances
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import DeltaEngineAPI from "./DeltaEngine-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "delta-global";

const KEY_DELTA_PREFIX = "delta-record:";
const KEY_SUMMARY_PREFIX = "delta-summary:";
const KEY_PATCH_PREFIX = "delta-patch:";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_FIELDS = "hot-fields";

// -------------------------
// Internal helpers
// -------------------------

function deltaKey(instanceId) {
  return `${KEY_DELTA_PREFIX}${instanceId}`;
}

function summaryKey(instanceId) {
  return `${KEY_SUMMARY_PREFIX}${instanceId}`;
}

function patchKey(instanceId) {
  return `${KEY_PATCH_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  if (!instanceId) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackFields(deltaRecord) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  for (const change of deltaRecord.changes || []) {
    hot[change.field] = (hot[change.field] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_FIELDS, hot);
}

// -------------------------
// Wrapped API
// -------------------------

export function computeDeltaWithMemory(beforeSnapshot, afterSnapshot) {
  CoreMemory.prewarm();

  const delta = computeDelta(beforeSnapshot, afterSnapshot);
  const instanceId = delta.instanceId;

  CoreMemory.set(ROUTE, deltaKey(instanceId), delta);
  trackInstance(instanceId);
  trackFields(delta);

  return delta;
}

export function summarizeDeltaWithMemory(deltaRecord) {
  CoreMemory.prewarm();

  const summary = summarizeDelta(deltaRecord);
  const instanceId = deltaRecord.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackInstance(instanceId);

  return summary;
}

export function buildDeltaPatchWithMemory(deltaRecord) {
  CoreMemory.prewarm();

  const patch = buildDeltaPatch(deltaRecord);
  const instanceId = deltaRecord.instanceId;

  CoreMemory.set(ROUTE, patchKey(instanceId), patch);
  trackInstance(instanceId);

  return patch;
}

export function applyDeltaPatchWithMemory(snapshotRecord, deltaPatch) {
  CoreMemory.prewarm();
  // no extra tracking needed; this is just a helper
  return applyDeltaPatch(snapshotRecord, deltaPatch);
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastDeltaRecord(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, deltaKey(instanceId));
}

export function getLastDeltaSummary(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, summaryKey(instanceId));
}

export function getLastDeltaPatch(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, patchKey(instanceId));
}

export function getDeltaMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotFields: CoreMemory.get(ROUTE, KEY_HOT_FIELDS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const DeltaEngineCoreMemory = {
  DeltaFieldChange,
  DeltaRecord,
  DeltaSummary,
  DeltaPatch,

  computeDeltaWithMemory,
  summarizeDeltaWithMemory,
  buildDeltaPatchWithMemory,
  applyDeltaPatchWithMemory,

  getLastDeltaRecord,
  getLastDeltaSummary,
  getLastDeltaPatch,
  getDeltaMemoryState,

  CoreMemory
};

export default DeltaEngineCoreMemory;
