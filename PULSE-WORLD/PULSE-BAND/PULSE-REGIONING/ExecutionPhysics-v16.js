/*
===============================================================================
FILE: /PULSE-WORLD/ExecutionPhysics-v16-Immortal.js
LAYER: PULSE-WORLD SUBSTRATE — SYMBOLIC EXECUTION PHYSICS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.ExecutionPhysics",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "symbolic_execution_physics",
  lineage: "ExecutionPhysics-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    multiverseAware: true,
    regionAware: true,
    hostAgnostic: true,
    reversible: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    unifiedAdvantageField: true,
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    historyAware: true,
    coreMemoryAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "DeploymentPlan (multiverse + region aware)",
      "CurrentInstanceState",
      "OrganismContext? { organismId }"
    ],
    output: [
      "ExecutionResult",
      "ExecutionLogEntry[]",
      "ExecutionEnvelope"
    ]
  },

  upstream: [
    "DeploymentPhysics-v16",
    "MultiOrganismSupport-v16",
    "LineageEngine-v16",
    "SnapshotPhysics"
  ],

  downstream: [
    "anything that wants new state or logs",
    "OrganismPlacementViewer",
    "ContinuanceDash"
  ],

  notes: [
    "ExecutionPhysics v16 is symbolic only; no real infra calls.",
    "It applies actions to state and emits logs + envelopes.",
    "Multiverse + region aware, physics-pure, binary-packable.",
    "CoreMemory integration is write-only and deterministic."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.ExecutionPhysics",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "DeploymentPlan",
    "CurrentInstanceState",
    "OrganismContext"
  ],

  produces: [
    "ExecutionResult",
    "ExecutionLogEntry[]",
    "ExecutionEnvelope"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const EXECUTION_ENGINE_VERSION = "16.0-Immortal";
const EXECUTION_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

// ---------------------------------------------------------------------------
// Local substrate types (no external imports)
// ---------------------------------------------------------------------------

// Mirror of DeploymentActionType from DeploymentPhysics-v16
export const DeploymentActionType = Object.freeze({
  APPLY_DELTA: "APPLY_DELTA",
  MOVE_UNIVERSE: "MOVE_UNIVERSE",
  MOVE_TIMELINE: "MOVE_TIMELINE",
  MOVE_BRANCH: "MOVE_BRANCH",
  MOVE_REGION: "MOVE_REGION",
  MOVE_HOST: "MOVE_HOST",
  RESTART_INSTANCE: "RESTART_INSTANCE",
  SPAWN_INSTANCE: "SPAWN_INSTANCE",
  RETIRE_INSTANCE: "RETIRE_INSTANCE",
  NO_OP: "NO_OP"
});

// Minimal CurrentInstanceState compatible with LineageEngine-v16
export class CurrentInstanceState {
  constructor({
    instanceId,
    active = true,
    currentRegionId = null,
    currentHostName = null,
    mergedInto = null,
    universeId = "u:default",
    timelineId = "t:main",
    branchId = "b:root",
    organismId = null
  }) {
    this.instanceId = instanceId;
    this.active = active;
    this.currentRegionId = currentRegionId;
    this.currentHostName = currentHostName;
    this.mergedInto = mergedInto;
    this.universeId = universeId;
    this.timelineId = timelineId;
    this.branchId = branchId;
    this.organismId = organismId;
  }
}

// Minimal MultiOrganismPlan shape
export class MultiOrganismPlan {
  constructor({ cosmos, instances = [] }) {
    this.cosmos = cosmos;
    this.instances = instances;
  }
}

// -------------------------
// Types
// -------------------------

export class ExecutionLogEntry {
  constructor({ instanceId, actionType, cosmos, region, organismId = null, details = {} }) {
    this.instanceId = instanceId;
    this.actionType = actionType;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.region = region; // { regionId }
    this.organismId = organismId;
    this.details = details;
  }
}

export class ExecutionResult {
  constructor({ instanceId, cosmos, region, organismId = null, newState, logs = [] }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.region = region;
    this.organismId = organismId;
    this.newState = newState;
    this.logs = logs;
  }
}

export class ExecutionEnvelope {
  constructor({
    schemaVersion,
    engineVersion,
    role,
    instanceId,
    cosmos,
    region,
    organismId,
    result,
    advantage,
    integrity
  }) {
    this.schemaVersion = schemaVersion;
    this.engineVersion = engineVersion;
    this.role = role;
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.region = region;
    this.organismId = organismId;
    this.result = result;
    this.advantage = advantage; // unifiedAdvantageField
    this.integrity = integrity;
  }
}

// -------------------------
// Helpers
// -------------------------

function normalizeCosmosContext(context = {}) {
  return {
    universeId: context.universeId || "u:default",
    timelineId: context.timelineId || "t:main",
    branchId: context.branchId || "b:root"
  };
}

function normalizeRegionContext(region = {}) {
  return {
    regionId: region.regionId || "r:global"
  };
}

function computeAdvantageFromLogs(logs = []) {
  const n = Array.isArray(logs) ? logs.length : 0;
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 7) return 3;
  return 4;
}

function computeIntegrityHash(payload) {
  const json = JSON.stringify(payload || {});
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0;
  }
  return "EXECUTION_INTEGRITY_" + hash.toString(16).padStart(8, "0");
}

// ---------------------------------------------------------------------------
// Core Execution Logic (v16 Multiverse + Region)
// ---------------------------------------------------------------------------

export function applyDeploymentActionToState(currentState, action, cosmos, region) {
  const base = new CurrentInstanceState({
    instanceId: currentState.instanceId,
    active: currentState.active,
    currentRegionId: currentState.currentRegionId,
    currentHostName: currentState.currentHostName,
    mergedInto: currentState.mergedInto,

    universeId: currentState.universeId || "u:default",
    timelineId: currentState.timelineId || "t:main",
    branchId: currentState.branchId || "b:root",

    organismId: currentState.organismId || null
  });

  switch (action.type) {
    case DeploymentActionType.MOVE_UNIVERSE:
      base.universeId = action.universeId;
      return base;

    case DeploymentActionType.MOVE_TIMELINE:
      base.timelineId = action.timelineId;
      return base;

    case DeploymentActionType.MOVE_BRANCH:
      base.branchId = action.branchId;
      return base;

    case DeploymentActionType.MOVE_REGION:
      base.currentRegionId = action.regionId;
      return base;

    case DeploymentActionType.MOVE_HOST:
      base.currentHostName = action.hostName;
      return base;

    case DeploymentActionType.RESTART_INSTANCE:
      return base;

    case DeploymentActionType.SPAWN_INSTANCE:
      return base;

    case DeploymentActionType.RETIRE_INSTANCE:
      base.active = false;
      return base;

    case DeploymentActionType.APPLY_DELTA:
      // Symbolic only: we assume delta already applied at SnapshotPhysics layer.
      return base;

    case DeploymentActionType.NO_OP:
    default:
      return base;
  }
}

export function executeDeploymentPlan(plan, currentState, organismContext = {}) {
  const cosmos = normalizeCosmosContext(plan.cosmos || {});
  const region = normalizeRegionContext(plan.region || {});
  const organismId =
    organismContext.organismId ||
    plan.organismId ||
    currentState.organismId ||
    null;

  let state = currentState;
  const logs = [];

  for (const action of plan.actions) {
    const newState = applyDeploymentActionToState(state, action, cosmos, region);

    logs.push(
      new ExecutionLogEntry({
        instanceId: state.instanceId,
        actionType: action.type,
        cosmos,
        region,
        organismId,
        details: {
          universeId: action.universeId ?? null,
          timelineId: action.timelineId ?? null,
          branchId: action.branchId ?? null,
          regionId: action.regionId ?? null,
          hostName: action.hostName ?? null,
          meta: action.meta ?? null
        }
      })
    );

    state = newState;
  }

  return new ExecutionResult({
    instanceId: state.instanceId,
    cosmos,
    region,
    organismId,
    newState: state,
    logs
  });
}

// -------------------------
// Multi-Organism Execution (v16 Multiverse + Region)
// -------------------------

export function executeMultiOrganismPlan(multiPlan, currentStatesById, organismContextById = {}) {
  if (!(multiPlan instanceof MultiOrganismPlan)) {
    throw new Error("executeMultiOrganismPlan: expected MultiOrganismPlan");
  }

  const cosmos = normalizeCosmosContext(multiPlan.cosmos || {});
  const results = {};

  for (const bundle of multiPlan.instances) {
    const instanceId = bundle.instanceId;
    const currentState = currentStatesById[instanceId];

    if (!currentState) continue;

    const organismContext = organismContextById[instanceId] || {};
    const execResult = executeDeploymentPlan(
      bundle.deploymentPlan,
      currentState,
      organismContext
    );

    // Force cosmos normalization on result for consistency
    execResult.cosmos = cosmos;
    results[instanceId] = execResult;
  }

  return results;
}

// -------------------------
// Execution Envelope (v16 IMMORTAL)
// -------------------------

export function buildExecutionEnvelope(executionResult) {
  const advantage = computeAdvantageFromLogs(executionResult.logs);

  const basePayload = {
    schemaVersion: EXECUTION_SCHEMA_VERSION,
    engineVersion: EXECUTION_ENGINE_VERSION,
    role: "PulseWorld.ExecutionPhysics",
    instanceId: executionResult.instanceId,
    cosmos: executionResult.cosmos,
    region: executionResult.region,
    organismId: executionResult.organismId,
    result: executionResult,
    advantage
  };

  const integrity = {
    hash: computeIntegrityHash(basePayload),
    schemaVersion: EXECUTION_SCHEMA_VERSION
  };

  return new ExecutionEnvelope({
    ...basePayload,
    integrity
  });
}

// ---------------------------------------------------------------------------
// CoreMemory + Multiverse Execution Caching (v16)
// ---------------------------------------------------------------------------

const ROUTE = "execution-physics-v16";

const KEY_RESULT_PREFIX   = "result:";
const KEY_ENVELOPE_PREFIX = "envelope:";

const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_INSTANCES    = "hot-instances";
const KEY_HOT_ORGANISMS    = "hot-organisms";
const KEY_HOT_UNIVERSES    = "hot-universes";
const KEY_HOT_TIMELINES    = "hot-timelines";
const KEY_HOT_REGIONS      = "hot-regions";

function cosmosKey(prefix, instanceId, cosmos) {
  return [
    prefix,
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");
}

function resultKey(instanceId, cosmos) {
  return cosmosKey(KEY_RESULT_PREFIX, instanceId, cosmos);
}

function envelopeKey(instanceId, cosmos) {
  return cosmosKey(KEY_ENVELOPE_PREFIX, instanceId, cosmos);
}

function trackExecutionHot(instanceId, cosmos, region, organismId, logs = []) {
  if (!instanceId) return;

  const actionTypes = {};
  for (const log of logs) {
    const t = log.actionType;
    if (!t) continue;
    actionTypes[t] = (actionTypes[t] || 0) + 1;
  }

  const hotActionTypes = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const [t, count] of Object.entries(actionTypes)) {
    hotActionTypes[t] = (hotActionTypes[t] || 0) + count;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hotActionTypes);

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const instKey = `${cosmos.universeId}|${cosmos.timelineId}|${instanceId}`;
  hotInstances[instKey] = (hotInstances[instKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hotInstances);

  if (organismId) {
    const hotOrganisms = CoreMemory.get(ROUTE, KEY_HOT_ORGANISMS) || {};
    hotOrganisms[organismId] = (hotOrganisms[organismId] || 0) + 1;
    CoreMemory.set(ROUTE, KEY_HOT_ORGANISMS, hotOrganisms);
  }

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);

  const hotRegions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const regionId = region && region.regionId ? region.regionId : "r:global";
  const rKey = `${cosmos.universeId}|${cosmos.timelineId}|${regionId}`;
  hotRegions[rKey] = (hotRegions[rKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, hotRegions);
}

// Wrapped execution with CoreMemory

export function executeDeploymentPlanWithMemory(plan, currentState, organismContext = {}) {
  CoreMemory.prewarm();

  const execResult = executeDeploymentPlan(plan, currentState, organismContext);
  const envelope = buildExecutionEnvelope(execResult);

  const cosmos = normalizeCosmosContext(execResult.cosmos || {});
  const keyResult = resultKey(execResult.instanceId, cosmos);
  const keyEnvelope = envelopeKey(execResult.instanceId, cosmos);

  CoreMemory.set(ROUTE, keyResult, execResult);
  CoreMemory.set(ROUTE, keyEnvelope, envelope);

  trackExecutionHot(
    execResult.instanceId,
    cosmos,
    execResult.region,
    execResult.organismId,
    execResult.logs
  );

  return { result: execResult, envelope };
}

export function executeMultiOrganismPlanWithMemory(
  multiPlan,
  currentStatesById,
  organismContextById = {}
) {
  CoreMemory.prewarm();

  const results = executeMultiOrganismPlan(
    multiPlan,
    currentStatesById,
    organismContextById
  );

  for (const [instanceId, execResult] of Object.entries(results)) {
    const envelope = buildExecutionEnvelope(execResult);
    const cosmos = normalizeCosmosContext(execResult.cosmos || {});
    const keyResult = resultKey(instanceId, cosmos);
    const keyEnvelope = envelopeKey(instanceId, cosmos);

    CoreMemory.set(ROUTE, keyResult, execResult);
    CoreMemory.set(ROUTE, keyEnvelope, envelope);

    trackExecutionHot(
      instanceId,
      cosmos,
      execResult.region,
      execResult.organismId,
      execResult.logs
    );
  }

  return results;
}

// -------------------------
// CoreMemory Accessors
// -------------------------

export function getLastExecutionResult(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, resultKey(instanceId, cosmos));
}

export function getLastExecutionEnvelope(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, envelopeKey(instanceId, cosmos));
}

export function getExecutionMemoryState() {
  CoreMemory.prewarm();

  return {
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotOrganisms: CoreMemory.get(ROUTE, KEY_HOT_ORGANISMS),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS)
  };
}

// -------------------------
// Exported API
// -------------------------

const ExecutionPhysicsAPI = {
  DeploymentActionType,
  CurrentInstanceState,
  MultiOrganismPlan,

  ExecutionLogEntry,
  ExecutionResult,
  ExecutionEnvelope,

  applyDeploymentActionToState,
  executeDeploymentPlan,
  executeMultiOrganismPlan,
  buildExecutionEnvelope,

  executeDeploymentPlanWithMemory,
  executeMultiOrganismPlanWithMemory,

  getLastExecutionResult,
  getLastExecutionEnvelope,
  getExecutionMemoryState,

  CoreMemory,
  ROUTE
};

export default ExecutionPhysicsAPI;
