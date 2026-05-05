/*
===============================================================================
FILE: /PULSE-WORLD/SnapshotPhysics-v16.js
LAYER: PULSE-WORLD SUBSTRATE — SYMBOLIC SNAPSHOT PHYSICS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.SnapshotPhysics",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "organism_snapshot_physics",
  lineage: "SnapshotPhysics-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    reversible: true,
    multiverseAware: true,
    regionAware: true,
    hostAware: true,
    deltaFriendly: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    coreMemoryAware: true,
    schemaVersioned: true,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "InstanceId",
      "CurrentInstanceState",
      "ConfigDescriptor",
      "CosmosContext",
      "LogicalClockToken"
    ],
    output: [
      "SnapshotRecord",
      "SnapshotHeader",
      "SnapshotStateView"
    ]
  }
}
===============================================================================
*/

const SNAPSHOT_ENGINE_VERSION = "16.0-Immortal";
const SNAPSHOT_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

// ---------------------------------------------------------------------------
// Cosmos Context
// ---------------------------------------------------------------------------

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

    this.schemaVersion = SNAPSHOT_SCHEMA_VERSION;
    this.engineVersion = SNAPSHOT_ENGINE_VERSION;
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

    this.schemaVersion = SNAPSHOT_SCHEMA_VERSION;
    this.engineVersion = SNAPSHOT_ENGINE_VERSION;
  }
}

export class SnapshotRecord {
  constructor({ header, state }) {
    this.header = header;
    this.state = state;

    this.schemaVersion = SNAPSHOT_SCHEMA_VERSION;
    this.engineVersion = SNAPSHOT_ENGINE_VERSION;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Core Snapshot Logic (v16 IMMORTAL)
// ---------------------------------------------------------------------------

export function buildSnapshotFromInstanceState({
  instanceId,
  currentInstanceState,
  configDescriptor = {},
  cosmosContext = {},
  logicalClock,
  lineageRootId = null
}) {
  CoreMemory.prewarm();

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

  const record = new SnapshotRecord({
    header,
    state: stateView
  });

  // Write to CoreMemory
  const key = `snapshot:${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}|${instanceId}|${snapshotId}`;
  CoreMemory.set("snapshot-physics-v16", key, record);

  return record;
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
 * Produces a minimal, stable, deterministic surface for DeltaEngine-v16.
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

// ---------------------------------------------------------------------------
// CoreMemory Accessors
// ---------------------------------------------------------------------------

export function getLastSnapshot(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const prefix = `snapshot:${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}|${instanceId}`;

  const all = CoreMemory.getNamespace("snapshot-physics-v16") || {};
  const keys = Object.keys(all).filter((k) => k.startsWith(prefix));

  if (keys.length === 0) return null;

  keys.sort(); // deterministic
  return all[keys[keys.length - 1]];
}

export function getSnapshotMemoryState() {
  CoreMemory.prewarm();
  return CoreMemory.getNamespace("snapshot-physics-v16");
}

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------

const SnapshotPhysicsAPI = {
  SnapshotHeader,
  SnapshotStateView,
  SnapshotRecord,

  buildSnapshotFromInstanceState,
  cloneSnapshot,
  projectSnapshotForDelta,

  getLastSnapshot,
  getSnapshotMemoryState,

  CoreMemory,
  SNAPSHOT_ENGINE_VERSION,
  SNAPSHOT_SCHEMA_VERSION
};

export default SnapshotPhysicsAPI;
