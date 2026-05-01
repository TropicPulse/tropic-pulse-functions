/**
 * SnapshotPhysics-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-SNAPSHOT
 *
 * ROLE:
 *   Capture a symbolic, deterministic, multiverse-aware snapshot of an organism instance.
 *
 *   - Universe-aware
 *   - Timeline-aware
 *   - Branch-aware
 *   - Region-aware
 *   - Host-aware
 *   - Delta-friendly
 *
 *   ZERO randomness.
 *   ZERO mutation.
 *   PURE symbolic snapshotting.
 */

/**
 * META {
 *   organ: "SnapshotPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-snapshot",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Captures symbolic snapshots across universes, timelines, branches, and regions.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     reversible: true,
 *     multiverseAware: true,
 *     regionAware: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "InstanceId",
 *       "CurrentInstanceState",
 *       "ConfigDescriptor",
 *       "CosmosContext",
 *       "LogicalClockToken"
 *     ],
 *     output: [
 *       "SnapshotRecord",
 *       "SnapshotHeader",
 *       "SnapshotStateView"
 *     ]
 *   }
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
  constructor({
    snapshotId,
    instanceId,
    lineageRootId = null,
    logicalClock,
    cosmos
  }) {
    this.snapshotId = snapshotId;
    this.instanceId = instanceId;
    this.lineageRootId = lineageRootId;
    this.logicalClock = logicalClock;
    this.cosmos = cosmos;
  }
}

export class SnapshotStateView {
  constructor({
    regionId = null,
    hostName = null,
    configVersion = null,
    role = null,
    mode = null,
    healthFlags = [],
    meta = {},
    cosmos
  }) {
    this.regionId = regionId;
    this.hostName = hostName;
    this.configVersion = configVersion;
    this.role = role;
    this.mode = mode;
    this.healthFlags = Array.isArray(healthFlags)
      ? healthFlags.slice().sort()
      : [];
    this.meta = meta;

    // multiverse placement
    this.universeId = cosmos.universeId;
    this.timelineId = cosmos.timelineId;
    this.branchId = cosmos.branchId;
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

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deterministicSnapshotId(instanceId, cosmos, logicalClock, state) {
  const payload = JSON.stringify({
    instanceId,
    cosmos,
    logicalClock,
    state
  });

  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 31 + payload.charCodeAt(i)) >>> 0;
  }

  return `snap-${instanceId}-${hash.toString(16)}`;
}

// -------------------------
// Core Snapshot Logic (v13 Multiverse)
// -------------------------

export function buildSnapshotFromInstanceState({
  instanceId,
  currentInstanceState,
  configDescriptor = {},
  cosmosContext = {},
  logicalClock,
  lineageRootId = null
}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const stateView = new SnapshotStateView({
    regionId: currentInstanceState.currentRegionId,
    hostName: currentInstanceState.currentHostName,
    configVersion: configDescriptor.configVersion || null,
    role: configDescriptor.role || null,
    mode: configDescriptor.mode || null,
    healthFlags: configDescriptor.healthFlags || [],
    meta: configDescriptor.meta || {},
    cosmos
  });

  const snapshotId = deterministicSnapshotId(
    instanceId,
    cosmos,
    logicalClock,
    stateView
  );

  const header = new SnapshotHeader({
    snapshotId,
    instanceId,
    lineageRootId,
    logicalClock,
    cosmos
  });

  return new SnapshotRecord({
    header,
    state: stateView
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
 * Produces a minimal, stable, deterministic surface for DeltaEngine-v13.
 * Removes fields that should not influence diffs.
 */
export function projectSnapshotForDelta(snapshotRecord) {
  const s = snapshotRecord.state;

  return {
    header: clone(snapshotRecord.header),
    state: {
      regionId: s.regionId,
      hostName: s.hostName,
      configVersion: s.configVersion,
      role: s.role,
      mode: s.mode,
      healthFlags: s.healthFlags.slice().sort(),
      meta: clone(s.meta),

      universeId: s.universeId,
      timelineId: s.timelineId,
      branchId: s.branchId
    }
  };
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
