/**
 * SnapshotPhysics-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-SNAPSHOT + CORE MEMORY
 *
 * ROLE:
 *   Wraps SnapshotPhysics with PulseCoreMemory hot caching.
 *   - Caches last snapshot per instance
 *   - Caches last projected snapshot for Delta
 *   - Tracks hot instances (loop-theory friendly)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import SnapshotPhysicsAPI from "./SnapshotPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

const {
  SnapshotHeader,
  SnapshotStateView,
  SnapshotRecord,
  buildSnapshotFromInstanceState,
  cloneSnapshot,
  projectSnapshotForDelta
} = SnapshotPhysicsAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "snapshot-global";

const KEY_LAST_SNAPSHOT_PREFIX = "last-snapshot:";
const KEY_LAST_PROJECTED_PREFIX = "last-projected:";
const KEY_HOT_INSTANCES = "hot-instances";

// -------------------------
// Internal helpers
// -------------------------

function snapshotKey(instanceId) {
  return `${KEY_LAST_SNAPSHOT_PREFIX}${instanceId}`;
}

function projectedKey(instanceId) {
  return `${KEY_LAST_PROJECTED_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  if (!instanceId) return;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

// -------------------------
// Wrapped API
// -------------------------

export function buildSnapshotFromInstanceStateWithMemory(args) {
  CoreMemory.prewarm();

  const snapshot = buildSnapshotFromInstanceState(args);
  const instanceId = snapshot.header.instanceId;

  CoreMemory.set(ROUTE, snapshotKey(instanceId), snapshot);
  trackInstance(instanceId);

  return snapshot;
}

export function cloneSnapshotWithMemory(snapshotRecord) {
  CoreMemory.prewarm();

  const cloned = cloneSnapshot(snapshotRecord);
  const instanceId = cloned.header.instanceId;

  CoreMemory.set(ROUTE, snapshotKey(instanceId), cloned);
  trackInstance(instanceId);

  return cloned;
}

export function projectSnapshotForDeltaWithMemory(snapshotRecord) {
  CoreMemory.prewarm();

  const projected = projectSnapshotForDelta(snapshotRecord);
  const instanceId = projected.header.instanceId;

  CoreMemory.set(ROUTE, projectedKey(instanceId), projected);
  trackInstance(instanceId);

  return projected;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastSnapshotForInstance(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, snapshotKey(instanceId));
}

export function getLastProjectedSnapshotForInstance(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, projectedKey(instanceId));
}

export function getSnapshotMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const SnapshotPhysicsCoreMemory = {
  SnapshotHeader,
  SnapshotStateView,
  SnapshotRecord,

  buildSnapshotFromInstanceStateWithMemory,
  cloneSnapshotWithMemory,
  projectSnapshotForDeltaWithMemory,

  getLastSnapshotForInstance,
  getLastProjectedSnapshotForInstance,
  getSnapshotMemoryState,

  CoreMemory
};

export default SnapshotPhysicsCoreMemory;
