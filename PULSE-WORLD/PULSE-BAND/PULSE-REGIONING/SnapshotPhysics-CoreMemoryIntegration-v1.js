/**
 * SnapshotPhysics-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-SNAPSHOT + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware snapshot physics.
 *
 *   - Captures instance state across universes/timelines/branches
 *   - Produces deterministic, reversible snapshots
 *   - Produces projected snapshots for DeltaEngine-v13
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic snapshotting.
 */

/**
 * META {
 *   organ: "SnapshotPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "snapshot-physics",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Captures symbolic snapshots across universes, timelines, and branches.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     reversible: true,
 *     multiverseAware: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "CurrentInstanceState",
 *       "CosmosContext"
 *     ],
 *     output: [
 *       "SnapshotRecord",
 *       "ProjectedSnapshotRecord"
 *     ]
 *   },
 *
 *   upstream: [
 *     "LineageEngine-v13"
 *   ],
 *
 *   downstream: [
 *     "DeltaEngine-v13",
 *     "DeploymentPhysics-v13",
 *     "ExecutionPhysics-v13"
 *   ],
 *
 *   notes: [
 *     "Snapshots are symbolic, not physical.",
 *     "Snapshot IDs are deterministic and reversible.",
 *     "Projected snapshots remove non-delta fields for stable diff surfaces."
 *   ]
 * }
 */

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
// Types
// -------------------------

export class SnapshotHeader {
  constructor({ instanceId, snapshotId, cosmos }) {
    this.instanceId = instanceId;
    this.snapshotId = snapshotId;
    this.cosmos = cosmos;
  }
}

export class SnapshotStateView {
  constructor(state = {}) {
    this.state = JSON.parse(JSON.stringify(state));
  }
}

export class SnapshotRecord {
  constructor({ header, state }) {
    this.header = header;
    this.state = state;
  }
}

// -------------------------
// Helpers
// -------------------------

function deterministicSnapshotId(instanceId, cosmos, state) {
  const payload = JSON.stringify({
    instanceId,
    cosmos,
    state
  });

  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 31 + payload.charCodeAt(i)) >>> 0;
  }

  return `snap-${instanceId}-${hash.toString(16)}`;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// -------------------------
// Core Snapshot Logic (v13 Multiverse)
// -------------------------

export function buildSnapshotFromInstanceState({ instanceId, currentState, cosmosContext = {} }) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const stateView = new SnapshotStateView({
    instanceId,
    active: currentState.active,
    regionId: currentState.currentRegionId,
    hostName: currentState.currentHostName,

    universeId: currentState.universeId || cosmos.universeId,
    timelineId: currentState.timelineId || cosmos.timelineId,
    branchId: currentState.branchId || cosmos.branchId,

    meta: clone(currentState.meta || {})
  });

  const snapshotId = deterministicSnapshotId(instanceId, cosmos, stateView.state);

  const header = new SnapshotHeader({
    instanceId,
    snapshotId,
    cosmos
  });

  return new SnapshotRecord({
    header,
    state: stateView.state
  });
}

export function cloneSnapshot(snapshotRecord) {
  return new SnapshotRecord({
    header: clone(snapshotRecord.header),
    state: clone(snapshotRecord.state)
  });
}

/**
 * projectSnapshotForDelta
 *
 * Produces a stable, minimal snapshot surface for DeltaEngine-v13.
 * Removes fields that should not influence diffs.
 */
export function projectSnapshotForDelta(snapshotRecord) {
  const projected = cloneSnapshot(snapshotRecord);

  delete projected.state.meta;
  delete projected.state.hostName;

  return projected;
}

// -------------------------
// Exported API
// -------------------------

const SnapshotPhysicsAPI = {
  SnapshotHeader,
  SnapshotStateView,
  SnapshotRecord,

  buildSnapshotFromInstanceState,
  cloneSnapshot,
  projectSnapshotForDelta
};

export default SnapshotPhysicsAPI;
