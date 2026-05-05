/*
===============================================================================
FILE: /PULSE-WORLD/LineageEngine-v16.js
LAYER: PULSE-WORLD / PULSE-LINEAGE + CORE MEMORY + MULTIVERSE COSMOS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.LineageEngine",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "multiverse_lineage_membrane",
  lineage: "LineageEngine-v11-Evo → LineageEngine-CosmosMultiverse-v13 → v16-Immortal",

  evo: {
    deterministic: true,
    driftProof: true,
    pureCompute: true,

    multiverseAware: true,
    regionAware: true,
    hostAware: true,
    lineageMembrane: true,
    coreMemoryAware: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "LineageRootArgs",
      "LineageEvent",
      "CosmosContext { universeId, timelineId, branchId }"
    ],
    output: [
      "LineageRecord",
      "CurrentInstanceState",
      "LineageSummary",
      "CompactedLineage",
      "LineageMemoryState"
    ]
  },

  upstream: [],
  downstream: [
    "DeltaEngine-v16",
    "DeploymentPhysics-v16",
    "ExecutionPhysics-v16",
    "MultiOrganismSupport-v16"
  ],

  notes: [
    "v16 is self-contained: physics + multiverse + CoreMemory in one organ.",
    "No imports except PulseProofBridge for CoreMemory.",
    "Physics remains deterministic and symbolic."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.LineageEngine",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "LineageRootArgs",
    "LineageEvent",
    "CosmosContext"
  ],

  produces: [
    "LineageRecord",
    "CurrentInstanceState",
    "LineageSummary",
    "CompactedLineage",
    "LineageMemoryState"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

// ---------------------------------------------------------------------------
// Lineage Physics (self-contained v16)
// ---------------------------------------------------------------------------

export const LineageEventType = Object.freeze({
  ROOT: "ROOT",
  MOVE_REGION: "MOVE_REGION",
  MOVE_HOST: "MOVE_HOST",
  MERGE_INTO: "MERGE_INTO",
  RETIRE: "RETIRE",
  CUSTOM: "CUSTOM"
});

export class LineageEvent {
  constructor({
    type,
    ts = Date.now(),
    payload = {}
  }) {
    this.type = type;
    this.ts = ts;
    this.payload = payload;
  }
}

export class LineageRecord {
  constructor({
    instanceId,
    createdAt = Date.now(),
    events = []
  }) {
    this.instanceId = instanceId;
    this.createdAt = createdAt;
    this.events = events;
  }
}

export class CurrentInstanceState {
  constructor({
    instanceId,
    active = true,
    currentRegionId = null,
    currentHostName = null,
    mergedInto = null,
    universeId = "u:default",
    timelineId = "t:main",
    branchId = "b:root"
  }) {
    this.instanceId = instanceId;
    this.active = active;
    this.currentRegionId = currentRegionId;
    this.currentHostName = currentHostName;
    this.mergedInto = mergedInto;
    this.universeId = universeId;
    this.timelineId = timelineId;
    this.branchId = branchId;
  }
}

export class LineageSummary {
  constructor({
    instanceId,
    totalEvents,
    firstEventAt,
    lastEventAt,
    lastEventType
  }) {
    this.instanceId = instanceId;
    this.totalEvents = totalEvents;
    this.firstEventAt = firstEventAt;
    this.lastEventAt = lastEventAt;
    this.lastEventType = lastEventType;
  }
}

// Create a new lineage root
export function createLineageRoot({
  instanceId,
  universeId = "u:default",
  timelineId = "t:main",
  branchId = "b:root",
  regionId = null,
  hostName = null
}) {
  const rootEvent = new LineageEvent({
    type: LineageEventType.ROOT,
    payload: {
      universeId,
      timelineId,
      branchId,
      regionId,
      hostName
    }
  });

  return new LineageRecord({
    instanceId,
    createdAt: Date.now(),
    events: [rootEvent]
  });
}

// Append a lineage event (pure)
export function appendLineageEvent(lineageRecord, event) {
  const events = Array.isArray(lineageRecord.events)
    ? lineageRecord.events.slice()
    : [];

  events.push(event);

  return new LineageRecord({
    instanceId: lineageRecord.instanceId,
    createdAt: lineageRecord.createdAt,
    events
  });
}

// Compute current instance state from lineage
export function computeCurrentInstanceState(lineageRecord) {
  const instanceId = lineageRecord.instanceId;
  let state = new CurrentInstanceState({ instanceId });

  for (const ev of lineageRecord.events) {
    const p = ev.payload || {};

    switch (ev.type) {
      case LineageEventType.ROOT:
        state.universeId = p.universeId || state.universeId;
        state.timelineId = p.timelineId || state.timelineId;
        state.branchId = p.branchId || state.branchId;
        state.currentRegionId = p.regionId || state.currentRegionId;
        state.currentHostName = p.hostName || state.currentHostName;
        break;

      case LineageEventType.MOVE_REGION:
        if (p.regionId) state.currentRegionId = p.regionId;
        break;

      case LineageEventType.MOVE_HOST:
        if (p.hostName) state.currentHostName = p.hostName;
        break;

      case LineageEventType.MERGE_INTO:
        if (p.targetInstanceId) state.mergedInto = p.targetInstanceId;
        break;

      case LineageEventType.RETIRE:
        state.active = false;
        break;

      case LineageEventType.CUSTOM:
      default:
        // CUSTOM is intentionally physics-neutral here
        break;
    }
  }

  return state;
}

// Summarize lineage
export function summarizeLineage(lineageRecord) {
  const events = lineageRecord.events || [];
  const totalEvents = events.length;

  if (totalEvents === 0) {
    return new LineageSummary({
      instanceId: lineageRecord.instanceId,
      totalEvents: 0,
      firstEventAt: null,
      lastEventAt: null,
      lastEventType: null
    });
  }

  const first = events[0];
  const last = events[events.length - 1];

  return new LineageSummary({
    instanceId: lineageRecord.instanceId,
    totalEvents,
    firstEventAt: first.ts,
    lastEventAt: last.ts,
    lastEventType: last.type
  });
}

// Compact lineage (simple v16: keep root + last N events)
export function compactLineage(lineageRecord, maxEvents = 32) {
  const events = lineageRecord.events || [];
  if (events.length <= maxEvents) return lineageRecord;

  const root = events[0];
  const tail = events.slice(-Math.max(1, maxEvents - 1));
  const compactedEvents = [root, ...tail];

  return new LineageRecord({
    instanceId: lineageRecord.instanceId,
    createdAt: lineageRecord.createdAt,
    events: compactedEvents
  });
}

// ---------------------------------------------------------------------------
// Multiverse + CoreMemory integration (v16, consolidated)
// ---------------------------------------------------------------------------

const ROUTE = "lineage-cosmos-multiverse-v16";

const KEY_LINEAGE_PREFIX  = "lineage:";
const KEY_STATE_PREFIX    = "state:";
const KEY_SUMMARY_PREFIX  = "summary:";
const KEY_COMPACT_PREFIX  = "compact:";

const KEY_HOT_INSTANCES   = "hot-instances";
const KEY_HOT_REGIONS     = "hot-regions";
const KEY_HOT_HOSTS       = "hot-hosts";
const KEY_HOT_UNIVERSES   = "hot-universes";
const KEY_HOT_TIMELINES   = "hot-timelines";

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

function cosmosKey(prefix, instanceId, cosmos) {
  return [
    prefix,
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");
}

function lineageKey(instanceId, cosmos) {
  return cosmosKey(KEY_LINEAGE_PREFIX, instanceId, cosmos);
}

function stateKey(instanceId, cosmos) {
  return cosmosKey(KEY_STATE_PREFIX, instanceId, cosmos);
}

function summaryKey(instanceId, cosmos) {
  return cosmosKey(KEY_SUMMARY_PREFIX, instanceId, cosmos);
}

function compactKey(instanceId, cosmos) {
  return cosmosKey(KEY_COMPACT_PREFIX, instanceId, cosmos);
}

// Hot tracking

function trackInstance(instanceId, cosmos) {
  if (!instanceId) return;

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const key = `${cosmos.universeId}|${cosmos.timelineId}|${instanceId}`;
  hotInstances[key] = (hotInstances[key] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hotInstances);

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);
}

function trackRegionHostFromState(state, cosmos) {
  if (!state) return;

  const regions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hosts = CoreMemory.get(ROUTE, KEY_HOT_HOSTS) || {};

  if (state.currentRegionId) {
    const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${state.currentRegionId}`;
    regions[rKey] = (regions[rKey] || 0) + 1;
  }

  if (state.currentHostName) {
    const hKey = `${cosmos.universeId}|${cosmos.timelineId}|${state.currentHostName}`;
    hosts[hKey] = (hosts[hKey] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, regions);
  CoreMemory.set(ROUTE, KEY_HOT_HOSTS, hosts);
}

// Wrapped API (multiverse-aware, but same physics)

export function createLineageRootWithMemory(args, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const record = createLineageRoot(args);
  const instanceId = record.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), record);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(record);
  const summary = summarizeLineage(record);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return record;
}

export function appendLineageEventWithMemory(lineageRecord, event, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const updated = appendLineageEvent(lineageRecord, event);
  const instanceId = updated.instanceId;

  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), updated);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(updated);
  const summary = summarizeLineage(updated);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return updated;
}

export function computeCurrentInstanceStateWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const state = computeCurrentInstanceState(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  trackInstance(instanceId, cosmos);
  trackRegionHostFromState(state, cosmos);

  return state;
}

export function summarizeLineageWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const summary = summarizeLineage(lineageRecord);
  const instanceId = lineageRecord.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackInstance(instanceId, cosmos);

  return summary;
}

export function compactLineageWithMemory(lineageRecord, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const compacted = compactLineage(lineageRecord);
  const instanceId = compacted.instanceId;

  CoreMemory.set(ROUTE, compactKey(instanceId, cosmos), compacted);
  CoreMemory.set(ROUTE, lineageKey(instanceId, cosmos), compacted);
  trackInstance(instanceId, cosmos);

  const state = computeCurrentInstanceState(compacted);
  const summary = summarizeLineage(compacted);

  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), state);
  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), summary);
  trackRegionHostFromState(state, cosmos);

  return compacted;
}

// Hot Memory Accessors

export function getLastLineageRecord(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, lineageKey(instanceId, cosmos));
}

export function getLastCurrentState(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, stateKey(instanceId, cosmos));
}

export function getLastLineageSummary(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, summaryKey(instanceId, cosmos));
}

export function getLastCompactedLineage(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, compactKey(instanceId, cosmos));
}

export function getLineageMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotHosts: CoreMemory.get(ROUTE, KEY_HOT_HOSTS),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// Consolidated export

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
  compactLineage,

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

  CoreMemory,
  ROUTE
};

export default LineageEngineAPI;
