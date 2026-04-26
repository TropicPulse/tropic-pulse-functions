```js
/**
 * META {
 *   organ: "LineageEngine",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-lineage",
 *   version: "v11-EVO",
 *
 *   role: "Symbolic memory of organism instances: births, moves, merges, retirements, and evolution.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     noRandomness: true,
 *     reversibleHistory: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "InstanceId",
 *       "RegionId",
 *       "HostName",
 *       "LineageEvent[]"
 *     ],
 *     output: [
 *       "LineageRecord",
 *       "LineageTimeline",
 *       "CurrentInstanceState",
 *       "LineageSummary"
 *     ]
 *   },
 *
 *   upstream: [
 *     "PulseSchema",
 *     "PulseOmniHosting",
 *     "PulseContinuance",
 *     "RegioningPhysics",
 *     "RegionMeshRouting"
 *   ],
 *
 *   downstream: [
 *     "SnapshotPhysics",
 *     "DeltaEngine",
 *     "DeploymentPhysics",
 *     "MultiOrganismSupport"
 *   ],
 *
 *   notes: [
 *     "LineageEngine is symbolic: it tracks what happened, not how it was executed.",
 *     "Each instance has ONE root and a sequence of events.",
 *     "History is reversible and compact.",
 *     "Lineage is for reasoning, not for storage-heavy logging."
 *   ]
 * }
 */

/**
 * LineageEngine-v11-Evo.js
 * PULSE-WORLD / PULSE-LINEAGE
 *
 * ROLE:
 *   Track the life of an organism instance:
 *   - birth
 *   - moves (region/host)
 *   - merges/splits
 *   - retirements
 *
 * NEVER:
 *   - Never store heavy payloads.
 *   - Never introduce randomness.
 *   - Never depend on real time or clocks.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always be reversible from events.
 */

// -------------------------
// Types
// -------------------------

export const LineageEventType = Object.freeze({
  BIRTH: "BIRTH",
  MOVE_REGION: "MOVE_REGION",
  MOVE_HOST: "MOVE_HOST",
  MERGE_INTO: "MERGE_INTO",
  MERGE_FROM: "MERGE_FROM",
  RETIRE: "RETIRE",
  SNAPSHOT: "SNAPSHOT"
});

/**
 * LineageEvent
 *
 * type: LineageEventType
 * instanceId: string
 * regionId?: string
 * hostName?: string
 * relatedInstanceId?: string   // for merges
 * meta?: object                // symbolic metadata only
 * seq: number                  // deterministic sequence index
 */
export class LineageEvent {
  constructor({
    type,
    instanceId,
    regionId = null,
    hostName = null,
    relatedInstanceId = null,
    meta = {},
    seq
  }) {
    this.type = type;
    this.instanceId = instanceId;
    this.regionId = regionId;
    this.hostName = hostName;
    this.relatedInstanceId = relatedInstanceId;
    this.meta = meta;
    this.seq = seq; // must be deterministic, caller-controlled
  }
}

/**
 * LineageRecord
 *
 * instanceId: string
 * rootRegionId: string
 * rootHostName: string
 * events: LineageEvent[]
 */
export class LineageRecord {
  constructor({ instanceId, rootRegionId, rootHostName, events = [] }) {
    this.instanceId = instanceId;
    this.rootRegionId = rootRegionId;
    this.rootHostName = rootHostName;
    this.events = events.slice().sort((a, b) => a.seq - b.seq);
  }
}

/**
 * CurrentInstanceState
 *
 * instanceId: string
 * active: boolean
 * currentRegionId: string | null
 * currentHostName: string | null
 * mergedInto: string | null
 */
export class CurrentInstanceState {
  constructor({
    instanceId,
    active = true,
    currentRegionId = null,
    currentHostName = null,
    mergedInto = null
  }) {
    this.instanceId = instanceId;
    this.active = active;
    this.currentRegionId = currentRegionId;
    this.currentHostName = currentHostName;
    this.mergedInto = mergedInto;
  }
}

/**
 * LineageSummary
 *
 * instanceId: string
 * totalMoves: number
 * totalRegionMoves: number
 * totalHostMoves: number
 * totalMerges: number
 * retired: boolean
 */
export class LineageSummary {
  constructor({
    instanceId,
    totalMoves = 0,
    totalRegionMoves = 0,
    totalHostMoves = 0,
    totalMerges = 0,
    retired = false
  }) {
    this.instanceId = instanceId;
    this.totalMoves = totalMoves;
    this.totalRegionMoves = totalRegionMoves;
    this.totalHostMoves = totalHostMoves;
    this.totalMerges = totalMerges;
    this.retired = retired;
  }
}

// -------------------------
// Helpers
// -------------------------

function cloneEvents(events = []) {
  return events.slice().sort((a, b) => a.seq - b.seq);
}

// -------------------------
// Builders
// -------------------------

/**
 * createLineageRoot
 *
 * Creates the initial lineage record for an instance.
 */
export function createLineageRoot({
  instanceId,
  regionId,
  hostName,
  meta = {},
  seq = 0
}) {
  const birthEvent = new LineageEvent({
    type: LineageEventType.BIRTH,
    instanceId,
    regionId,
    hostName,
    meta,
    seq
  });

  return new LineageRecord({
    instanceId,
    rootRegionId: regionId,
    rootHostName: hostName,
    events: [birthEvent]
  });
}

/**
 * appendLineageEvent
 *
 * Returns a NEW LineageRecord with the event appended.
 * Does not mutate the original.
 */
export function appendLineageEvent(lineageRecord, event) {
  const events = cloneEvents(lineageRecord.events);
  events.push(event);
  return new LineageRecord({
    instanceId: lineageRecord.instanceId,
    rootRegionId: lineageRecord.rootRegionId,
    rootHostName: lineageRecord.rootHostName,
    events
  });
}

// -------------------------
// State Reconstruction
// -------------------------

/**
 * computeCurrentInstanceState
 *
 * Replays events to derive current state.
 */
export function computeCurrentInstanceState(lineageRecord) {
  let active = false;
  let currentRegionId = null;
  let currentHostName = null;
  let mergedInto = null;

  const events = cloneEvents(lineageRecord.events);

  for (const ev of events) {
    switch (ev.type) {
      case LineageEventType.BIRTH:
        active = true;
        currentRegionId = ev.regionId;
        currentHostName = ev.hostName;
        break;

      case LineageEventType.MOVE_REGION:
        if (active) currentRegionId = ev.regionId;
        break;

      case LineageEventType.MOVE_HOST:
        if (active) currentHostName = ev.hostName;
        break;

      case LineageEventType.MERGE_INTO:
        active = false;
        mergedInto = ev.relatedInstanceId;
        break;

      case LineageEventType.RETIRE:
        active = false;
        break;

      default:
        // SNAPSHOT or unknown types do not change core state
        break;
    }
  }

  return new CurrentInstanceState({
    instanceId: lineageRecord.instanceId,
    active,
    currentRegionId,
    currentHostName,
    mergedInto
  });
}

/**
 * summarizeLineage
 *
 * Produces a compact summary of movement and lifecycle.
 */
export function summarizeLineage(lineageRecord) {
  const events = cloneEvents(lineageRecord.events);

  let totalRegionMoves = 0;
  let totalHostMoves = 0;
  let totalMerges = 0;
  let retired = false;

  for (const ev of events) {
    if (ev.type === LineageEventType.MOVE_REGION) totalRegionMoves++;
    if (ev.type === LineageEventType.MOVE_HOST) totalHostMoves++;
    if (ev.type === LineageEventType.MERGE_INTO) totalMerges++;
    if (ev.type === LineageEventType.RETIRE) retired = true;
  }

  const totalMoves = totalRegionMoves + totalHostMoves;

  return new LineageSummary({
    instanceId: lineageRecord.instanceId,
    totalMoves,
    totalRegionMoves,
    totalHostMoves,
    totalMerges,
    retired
  });
}

// -------------------------
// Compaction
// -------------------------

/**
 * compactLineage
 *
 * Produces a compacted lineage record by:
 *   - keeping BIRTH
 *   - keeping last MOVE_REGION
 *   - keeping last MOVE_HOST
 *   - keeping last MERGE_INTO (if any)
 *   - keeping RETIRE (if any)
 *   - dropping intermediate moves that don't affect final state reasoning
 *
 * This keeps lineage symbolic and small.
 */
export function compactLineage(lineageRecord) {
  const events = cloneEvents(lineageRecord.events);

  let birth = null;
  let lastRegionMove = null;
  let lastHostMove = null;
  let lastMergeInto = null;
  let retire = null;
  const snapshots = [];

  for (const ev of events) {
    switch (ev.type) {
      case LineageEventType.BIRTH:
        birth = ev;
        break;
      case LineageEventType.MOVE_REGION:
        lastRegionMove = ev;
        break;
      case LineageEventType.MOVE_HOST:
        lastHostMove = ev;
        break;
      case LineageEventType.MERGE_INTO:
        lastMergeInto = ev;
        break;
      case LineageEventType.RETIRE:
        retire = ev;
        break;
      case LineageEventType.SNAPSHOT:
        snapshots.push(ev);
        break;
      default:
        break;
    }
  }

  const compactEvents = [];
  if (birth) compactEvents.push(birth);
  if (lastRegionMove) compactEvents.push(lastRegionMove);
  if (lastHostMove) compactEvents.push(lastHostMove);
  if (lastMergeInto) compactEvents.push(lastMergeInto);
  if (retire) compactEvents.push(retire);
  // keep snapshots if you want mid-history anchors
  for (const s of snapshots) compactEvents.push(s);

  compactEvents.sort((a, b) => a.seq - b.seq);

  return new LineageRecord({
    instanceId: lineageRecord.instanceId,
    rootRegionId: lineageRecord.rootRegionId,
    rootHostName: lineageRecord.rootHostName,
    events: compactEvents
  });
}

// -------------------------
// Exported API
// -------------------------

const LineageEngineAPI = {
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
};

export default LineageEngineAPI;
```