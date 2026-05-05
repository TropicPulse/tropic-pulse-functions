/*
===============================================================================
FILE: /PULSE-WORLD/DeltaEngine-v16.js
LAYER: PULSE-WORLD SUBSTRATE — SYMBOLIC DELTA ENGINE
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.DeltaEngine",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "organism_delta_engine",
  lineage: "DeltaEngine-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    hostAgnostic: true,
    regionAware: true,
    multiverseAware: true,
    reversible: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    coreMemoryAware: true,
    schemaVersioned: true,
    envelopeAware: false,
    integrityAware: false,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "SnapshotRecord(before)",
      "SnapshotRecord(after)",
      "CosmosContext { universeId, timelineId, branchId }"
    ],
    output: [
      "DeltaRecord",
      "DeltaSummary",
      "DeltaPatch"
    ]
  },

  upstream: [
    "SnapshotPhysics",
    "LineageEngine-v16"
  ],

  downstream: [
    "DeploymentPhysics-v16",
    "MultiOrganismSupport-v16",
    "PulseContinuance",
    "DeltaEngine-CosmosMultiverse-v16"
  ],

  notes: [
    "DeltaEngine v16 is multiverse-aware, region-aware, and physics-pure.",
    "Cosmos context is metadata-only; no behavioral drift.",
    "Delta patches remain reversible across universes and timelines.",
    "CoreMemory integration is write-only, deterministic, and multiverse keyed."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.DeltaEngine",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "SnapshotRecord(before)",
    "SnapshotRecord(after)",
    "CosmosContext"
  ],

  produces: [
    "DeltaRecord",
    "DeltaSummary",
    "DeltaPatch"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const DELTA_ENGINE_VERSION = "16.0-Immortal";
const DELTA_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

// -------------------------
// Types
// -------------------------

export class DeltaFieldChange {
  constructor({ field, before, after }) {
    this.field = field;
    this.before = before;
    this.after = after;
  }
}

export class DeltaRecord {
  constructor({
    instanceId,
    snapshotBeforeId,
    snapshotAfterId,
    cosmos,
    changes = [],
    region = null
  }) {
    this.instanceId = instanceId;
    this.snapshotBeforeId = snapshotBeforeId;
    this.snapshotAfterId = snapshotAfterId;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.region = region; // { regionId? } optional, symbolic
    this.changes = changes;

    this.schemaVersion = DELTA_SCHEMA_VERSION;
    this.engineVersion = DELTA_ENGINE_VERSION;
  }
}

export class DeltaSummary {
  constructor({ instanceId, cosmos, region, totalChanges, changedFields }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.region = region;
    this.totalChanges = totalChanges;
    this.changedFields = changedFields;

    this.schemaVersion = DELTA_SCHEMA_VERSION;
    this.engineVersion = DELTA_ENGINE_VERSION;
  }
}

export class DeltaPatch {
  constructor({ cosmos, region = null, patch = {} }) {
    this.cosmos = cosmos;
    this.region = region;
    this.patch = patch;

    this.schemaVersion = DELTA_SCHEMA_VERSION;
    this.engineVersion = DELTA_ENGINE_VERSION;
  }
}

// -------------------------
// Helpers
// -------------------------

function shallowEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

function normalizeRegionContext(state = {}) {
  // state may be snapshot.state or a separate region context
  const regionId =
    state.regionId ||
    state.currentRegionId ||
    (state.region && state.region.regionId) ||
    "r:global";

  return { regionId };
}

// -------------------------
// Core Delta Logic (v16)
// -------------------------

/**
 * computeDelta
 *
 * Input:
 *   - beforeSnapshot: SnapshotRecord
 *   - afterSnapshot: SnapshotRecord
 *   - cosmosContext: { universeId?, timelineId?, branchId? }
 *
 * Output:
 *   - DeltaRecord (multiverse-aware)
 */
export function computeDelta(beforeSnapshot, afterSnapshot, cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const before = beforeSnapshot.state || {};
  const after = afterSnapshot.state || {};

  // v16: keep substrate fields symbolic + minimal, but region-aware
  const fields = [
    "regionId",
    "hostName",
    "configVersion",
    "role",
    "mode",
    "healthFlags",
    "meta"
  ];

  const changes = [];

  for (const field of fields) {
    const beforeVal = clone(before[field]);
    const afterVal = clone(after[field]);

    if (!shallowEqual(beforeVal, afterVal)) {
      changes.push(
        new DeltaFieldChange({
          field,
          before: beforeVal,
          after: afterVal
        })
      );
    }
  }

  const region = normalizeRegionContext(after || before || {});

  return new DeltaRecord({
    instanceId: beforeSnapshot.header.instanceId,
    snapshotBeforeId: beforeSnapshot.header.snapshotId,
    snapshotAfterId: afterSnapshot.header.snapshotId,
    cosmos,
    region,
    changes
  });
}

/**
 * summarizeDelta
 *
 * Produces a compact summary of the delta.
 */
export function summarizeDelta(deltaRecord) {
  const changedFields = deltaRecord.changes.map((c) => c.field);

  return new DeltaSummary({
    instanceId: deltaRecord.instanceId,
    cosmos: deltaRecord.cosmos,
    region: deltaRecord.region,
    totalChanges: deltaRecord.changes.length,
    changedFields
  });
}

/**
 * buildDeltaPatch
 *
 * Produces a reversible patch object.
 */
export function buildDeltaPatch(deltaRecord) {
  const patch = {};

  for (const change of deltaRecord.changes) {
    patch[change.field] = change.after;
  }

  return new DeltaPatch({
    cosmos: deltaRecord.cosmos,
    region: deltaRecord.region,
    patch
  });
}

/**
 * applyDeltaPatch
 *
 * Applies a patch to a snapshot state.
 * Returns a NEW SnapshotStateView.
 *
 * Cosmos context is preserved but not used in physics.
 */
export function applyDeltaPatch(snapshotRecord, deltaPatch) {
  const newState = clone(snapshotRecord.state || {});

  for (const [field, value] of Object.entries(deltaPatch.patch || {})) {
    newState[field] = clone(value);
  }

  return newState;
}

// ---------------------------------------------------------------------------
// CoreMemory + Multiverse Delta Caching (v16)
// ---------------------------------------------------------------------------

const ROUTE = "delta-engine-v16";

const KEY_DELTA_PREFIX   = "delta:";
const KEY_SUMMARY_PREFIX = "summary:";
const KEY_PATCH_PREFIX   = "patch:";

const KEY_HOT_FIELDS      = "hot-fields";
const KEY_HOT_INSTANCES   = "hot-instances";
const KEY_HOT_UNIVERSES   = "hot-universes";
const KEY_HOT_TIMELINES   = "hot-timelines";
const KEY_HOT_REGIONS     = "hot-regions";
const KEY_HOT_CHANGECOUNT = "hot-change-count";

function cosmosKey(prefix, instanceId, cosmos) {
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

function trackDeltaHot(deltaRecord, deltaSummary, deltaPatch) {
  const { instanceId, cosmos, region } = deltaRecord;
  if (!instanceId) return;

  const regionId = (region && region.regionId) || "r:global";

  // Fields
  const hotFields = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  for (const change of deltaRecord.changes) {
    const f = change.field;
    if (!f) continue;
    hotFields[f] = (hotFields[f] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_FIELDS, hotFields);

  // Instances
  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const instKey = `${cosmos.universeId}|${cosmos.timelineId}|${instanceId}`;
  hotInstances[instKey] = (hotInstances[instKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hotInstances);

  // Universes
  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  // Timelines
  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);

  // Regions
  const hotRegions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${regionId}`;
  hotRegions[rKey] = (hotRegions[rKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hotRegions);

  // Change counts
  const hotChangeCount = CoreMemory.get(ROUTE, KEY_HOT_CHANGECOUNT) || {};
  hotChangeCount[instKey] =
    (hotChangeCount[instKey] || 0) + (deltaSummary.totalChanges || 0);
  CoreMemory.set(ROUTE, KEY_HOT_CHANGECOUNT, hotChangeCount);
}

// ---------------------------------------------------------------------------
// Wrapped API with CoreMemory
// ---------------------------------------------------------------------------

export function computeDeltaWithMemory(beforeSnapshot, afterSnapshot, cosmosContext = {}) {
  CoreMemory.prewarm();

  const deltaRecord = computeDelta(beforeSnapshot, afterSnapshot, cosmosContext);
  const deltaSummary = summarizeDelta(deltaRecord);
  const deltaPatch = buildDeltaPatch(deltaRecord);

  const cosmos = normalizeCosmosContext(deltaRecord.cosmos || {});
  const instanceId = deltaRecord.instanceId;

  const kDelta = deltaKey(instanceId, cosmos);
  const kSummary = summaryKey(instanceId, cosmos);
  const kPatch = patchKey(instanceId, cosmos);

  CoreMemory.set(ROUTE, kDelta, deltaRecord);
  CoreMemory.set(ROUTE, kSummary, deltaSummary);
  CoreMemory.set(ROUTE, kPatch, deltaPatch);

  trackDeltaHot(deltaRecord, deltaSummary, deltaPatch);

  return { deltaRecord, deltaSummary, deltaPatch };
}

// -------------------------
// CoreMemory Accessors
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

export function getDeltaMemoryState() {
  CoreMemory.prewarm();

  return {
    hotFields: CoreMemory.get(ROUTE, KEY_HOT_FIELDS),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotChangeCount: CoreMemory.get(ROUTE, KEY_HOT_CHANGECOUNT)
  };
}

// -------------------------
// Exported API
// -------------------------

const DeltaEngineAPI = {
  DeltaFieldChange,
  DeltaRecord,
  DeltaSummary,
  DeltaPatch,

  computeDelta,
  summarizeDelta,
  buildDeltaPatch,
  applyDeltaPatch,

  computeDeltaWithMemory,
  getLastDeltaRecord,
  getLastDeltaSummary,
  getLastDeltaPatch,
  getDeltaMemoryState,

  CoreMemory,
  ROUTE,
  DELTA_ENGINE_VERSION,
  DELTA_SCHEMA_VERSION
};

export default DeltaEngineAPI;
