/**
 * ExecutionPhysics-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-EXECUTION + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware execution physics membrane.
 *
 *   Wraps ExecutionPhysics with PulseCoreMemory hot caching:
 *     - Caches last execution result per universe/timeline/branch
 *     - Caches last logs per universe/timeline/branch
 *     - Caches last newState per universe/timeline/branch
 *     - Tracks hot instances, hot action types, hot cosmic transitions
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import ExecutionPhysicsAPI from "./ExecutionPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  ExecutionLogEntry,
  ExecutionResult,
  applyDeploymentActionToState,
  executeDeploymentPlan,
  executeMultiOrganismPlan
} = ExecutionPhysicsAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "execution-cosmos-multiverse";

const KEY_EXEC_RESULT_PREFIX = "exec-result:";
const KEY_EXEC_LOGS_PREFIX = "exec-logs:";
const KEY_EXEC_STATE_PREFIX = "exec-state:";

const KEY_LAST_MULTI_EXEC = "last-multi-execution";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_TRANSITIONS = "hot-transitions";

const KEY_HOT_UNIVERSES = "hot-universes";
const KEY_HOT_TIMELINES = "hot-timelines";

// -------------------------
// Multiverse helpers
// -------------------------

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

function resultKey(instanceId, cosmos) {
  return cosmosKey(KEY_EXEC_RESULT_PREFIX, instanceId, cosmos);
}

function logsKey(instanceId, cosmos) {
  return cosmosKey(KEY_EXEC_LOGS_PREFIX, instanceId, cosmos);
}

function stateKey(instanceId, cosmos) {
  return cosmosKey(KEY_EXEC_STATE_PREFIX, instanceId, cosmos);
}

// -------------------------
// Hot tracking
// -------------------------

function trackInstance(instanceId, cosmos) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const key = `${cosmos.universeId}|${cosmos.timelineId}|${instanceId}`;
  hot[key] = (hot[key] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);

  const hotUniverses = CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES) || {};
  hotUniverses[cosmos.universeId] = (hotUniverses[cosmos.universeId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_UNIVERSES, hotUniverses);

  const hotTimelines = CoreMemory.get(ROUTE, KEY_HOT_TIMELINES) || {};
  const tlKey = `${cosmos.universeId}|${cosmos.timelineId}`;
  hotTimelines[tlKey] = (hotTimelines[tlKey] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_TIMELINES, hotTimelines);
}

function trackActionTypes(logs, cosmos) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const log of logs || []) {
    const key = `${cosmos.universeId}|${cosmos.timelineId}|${log.actionType}`;
    hot[key] = (hot[key] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

function trackTransitions(logs, cosmos) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_TRANSITIONS) || {};

  for (const log of logs || []) {
    const region = log.details.regionId || null;
    const host = log.details.hostName || null;

    if (region) {
      const key = `${cosmos.universeId}|${cosmos.timelineId}|region:${region}`;
      hot[key] = (hot[key] || 0) + 1;
    }

    if (host) {
      const key = `${cosmos.universeId}|${cosmos.timelineId}|host:${host}`;
      hot[key] = (hot[key] || 0) + 1;
    }
  }

  CoreMemory.set(ROUTE, KEY_HOT_TRANSITIONS, hot);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

export function executeDeploymentPlanWithMemory(plan, currentState, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const execResult = executeDeploymentPlan(plan, currentState);
  const instanceId = execResult.instanceId;

  CoreMemory.set(ROUTE, resultKey(instanceId, cosmos), execResult);
  CoreMemory.set(ROUTE, logsKey(instanceId, cosmos), execResult.logs);
  CoreMemory.set(ROUTE, stateKey(instanceId, cosmos), execResult.newState);

  trackInstance(instanceId, cosmos);
  trackActionTypes(execResult.logs, cosmos);
  trackTransitions(execResult.logs, cosmos);

  return execResult;
}

export function executeMultiOrganismPlanWithMemory(multiPlan, currentStatesById, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const results = {};

  for (const bundle of multiPlan.instances) {
    const instanceId = bundle.instanceId;
    const currentState = currentStatesById[instanceId];

    if (!currentState) continue;

    const execResult = executeDeploymentPlanWithMemory(
      bundle.deploymentPlan,
      currentState,
      cosmos
    );

    results[instanceId] = execResult;
  }

  CoreMemory.set(ROUTE, KEY_LAST_MULTI_EXEC, {
    cosmos,
    results
  });

  return results;
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
// -------------------------

export function getLastExecutionResult(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, resultKey(instanceId, cosmos));
}

export function getLastExecutionLogs(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, logsKey(instanceId, cosmos));
}

export function getLastExecutionState(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, stateKey(instanceId, cosmos));
}

export function getExecutionMemoryState() {
  CoreMemory.prewarm();

  return {
    lastMultiExecution: CoreMemory.get(ROUTE, KEY_LAST_MULTI_EXEC),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotTransitions: CoreMemory.get(ROUTE, KEY_HOT_TRANSITIONS),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const ExecutionPhysicsCosmosMultiverse = {
  ExecutionLogEntry,
  ExecutionResult,

  applyDeploymentActionToState,
  executeDeploymentPlanWithMemory,
  executeMultiOrganismPlanWithMemory,

  getLastExecutionResult,
  getLastExecutionLogs,
  getLastExecutionState,
  getExecutionMemoryState,

  CoreMemory
};

export default ExecutionPhysicsCosmosMultiverse;
