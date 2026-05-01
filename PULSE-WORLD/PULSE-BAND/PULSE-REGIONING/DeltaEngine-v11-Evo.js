/**
 * META {
 *   organ: "DeltaEngine",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-delta",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Computes symbolic diffs between snapshots across universes, timelines, and branches.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     multiverseAware: true,
 *     reversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "SnapshotRecord(before)",
 *       "SnapshotRecord(after)",
 *       "CosmosContext { universeId, timelineId, branchId }"
 *     ],
 *     output: [
 *       "DeltaRecord",
 *       "DeltaSummary",
 *       "DeltaPatch"
 *     ]
 *   },
 *
 *   upstream: [
 *     "SnapshotPhysics",
 *     "LineageEngine"
 *   ],
 *
 *   downstream: [
 *     "DeploymentPhysics",
 *     "MultiOrganismSupport",
 *     "PulseContinuance",
 *     "DeltaEngine-CosmosMultiverse"
 *   ],
 *
 *   notes: [
 *     "DeltaEngine v13 is multiverse-aware but physics-pure.",
 *     "Cosmos context is metadata-only; no behavioral drift.",
 *     "Delta patches remain reversible across universes."
 *   ]
 * }
 */

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
    changes = []
  }) {
    this.instanceId = instanceId;
    this.snapshotBeforeId = snapshotBeforeId;
    this.snapshotAfterId = snapshotAfterId;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.changes = changes;
  }
}

export class DeltaSummary {
  constructor({ instanceId, cosmos, totalChanges, changedFields }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.totalChanges = totalChanges;
    this.changedFields = changedFields;
  }
}

export class DeltaPatch {
  constructor({ cosmos, patch = {} }) {
    this.cosmos = cosmos;
    this.patch = patch;
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

// -------------------------
// Core Delta Logic (v13)
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

  const before = beforeSnapshot.state;
  const after = afterSnapshot.state;

  // v13: substrate fields remain symbolic + minimal
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

  return new DeltaRecord({
    instanceId: beforeSnapshot.header.instanceId,
    snapshotBeforeId: beforeSnapshot.header.snapshotId,
    snapshotAfterId: afterSnapshot.header.snapshotId,
    cosmos,
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
  const newState = clone(snapshotRecord.state);

  for (const [field, value] of Object.entries(deltaPatch.patch)) {
    newState[field] = clone(value);
  }

  return newState;
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
  applyDeltaPatch
};

export default DeltaEngineAPI;
