/**
 * META {
 *   organ: "DeltaEngine",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-delta",
 *   version: "v11-EVO",
 *
 *   role: "Computes symbolic diffs between snapshots. Produces minimal change pulses.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     noRandomness: true,
 *     reversible: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "SnapshotRecord(before)",
 *       "SnapshotRecord(after)"
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
 *     "PulseContinuance"
 *   ],
 *
 *   notes: [
 *     "DeltaEngine produces symbolic patches, not byte-level diffs.",
 *     "Delta patches are reversible: apply(before, delta) = after.",
 *     "DeltaEngine is the core of Pulse-based minimal updates."
 *   ]
 * }
 */

/**
 * DeltaEngine-v11-Evo.js
 * PULSE-WORLD / PULSE-DELTA
 *
 * ROLE:
 *   Compare two snapshots and produce:
 *     - minimal symbolic delta
 *     - summary of changes
 *     - reversible patch
 *
 * NEVER:
 *   - Never diff heavy payloads.
 *   - Never depend on real time.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always be reversible.
 */

// -------------------------
// Types
// -------------------------

/**
 * DeltaFieldChange
 *
 * field: string
 * before: any
 * after: any
 */
export class DeltaFieldChange {
  constructor({ field, before, after }) {
    this.field = field;
    this.before = before;
    this.after = after;
  }
}

/**
 * DeltaRecord
 *
 * instanceId: string
 * snapshotBeforeId: string
 * snapshotAfterId: string
 * changes: DeltaFieldChange[]
 */
export class DeltaRecord {
  constructor({
    instanceId,
    snapshotBeforeId,
    snapshotAfterId,
    changes = []
  }) {
    this.instanceId = instanceId;
    this.snapshotBeforeId = snapshotBeforeId;
    this.snapshotAfterId = snapshotAfterId;
    this.changes = changes;
  }
}

/**
 * DeltaSummary
 *
 * instanceId: string
 * totalChanges: number
 * changedFields: string[]
 */
export class DeltaSummary {
  constructor({ instanceId, totalChanges, changedFields }) {
    this.instanceId = instanceId;
    this.totalChanges = totalChanges;
    this.changedFields = changedFields;
  }
}

/**
 * DeltaPatch
 *
 * A reversible patch:
 *   - applyPatch(before, patch) → after
 *   - applyPatch(after, reverse(patch)) → before
 *
 * patch: { [field: string]: any }
 */
export class DeltaPatch {
  constructor({ patch = {} }) {
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

// -------------------------
// Core Delta Logic
// -------------------------

/**
 * computeDelta
 *
 * Input:
 *   - beforeSnapshot: SnapshotRecord
 *   - afterSnapshot: SnapshotRecord
 *
 * Output:
 *   - DeltaRecord
 */
export function computeDelta(beforeSnapshot, afterSnapshot) {
  const before = beforeSnapshot.state;
  const after = afterSnapshot.state;

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

  return new DeltaPatch({ patch });
}

/**
 * applyDeltaPatch
 *
 * Applies a patch to a snapshot state.
 * Returns a NEW SnapshotStateView.
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
