/**
 * ExecutionPhysics-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-EXECUTION + CORE MEMORY
 *
 * ROLE:
 *   Wraps ExecutionPhysics with PulseCoreMemory hot caching.
 *   - Caches last execution result per instance
 *   - Caches last logs per instance
 *   - Caches last newState per instance
 *   - Tracks hot instances + hot action types
 *   - Tracks hot transitions (region/host)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import ExecutionPhysicsAPI from "./ExecutionPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "execution-global";

const KEY_EXEC_RESULT_PREFIX = "exec-result:";
const KEY_EXEC_LOGS_PREFIX = "exec-logs:";
const KEY_EXEC_STATE_PREFIX = "exec-state:";

const KEY_LAST_MULTI_EXEC = "last-multi-execution";
const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_TRANSITIONS = "hot-transitions";

// -------------------------
// Internal helpers
// -------------------------

function resultKey(instanceId) {
  return `${KEY_EXEC_RESULT_PREFIX}${instanceId}`;
}

function logsKey(instanceId) {
  return `${KEY_EXEC_LOGS_PREFIX}${instanceId}`;
}

function stateKey(instanceId) {
  return `${KEY_EXEC_STATE_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackActionTypes(logs) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const log of logs || []) {
    hot[log.actionType] = (hot[log.actionType] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

function trackTransitions(logs) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_TRANSITIONS) || {};

  for (const log of logs || []) {
    const region = log.details.regionId || null;
    const host = log.details.hostName || null;

    if (region) {
      const key = `region:${region}`;
      hot[key] = (hot[key] || 0) + 1;
    }

    if (host) {
      const key = `host:${host}`;
      hot[key] = (hot[key] || 0) + 1;
    }
  }

  CoreMemory.set(ROUTE, KEY_HOT_TRANSITIONS, hot);
}

// -------------------------
// Wrapped API
// -------------------------

export function executeDeploymentPlanWithMemory(plan, currentState) {
  CoreMemory.prewarm();

  const execResult = executeDeploymentPlan(plan, currentState);
  const instanceId = execResult.instanceId;

  CoreMemory.set(ROUTE, resultKey(instanceId), execResult);
  CoreMemory.set(ROUTE, logsKey(instanceId), execResult.logs);
  CoreMemory.set(ROUTE, stateKey(instanceId), execResult.newState);

  trackInstance(instanceId);
  trackActionTypes(execResult.logs);
  trackTransitions(execResult.logs);

  return execResult;
}

export function executeMultiOrganismPlanWithMemory(multiPlan, currentStatesById) {
  CoreMemory.prewarm();

  const results = {};

  for (const bundle of multiPlan.instances) {
    const instanceId = bundle.instanceId;
    const currentState = currentStatesById[instanceId];

    if (!currentState) continue;

    const execResult = executeDeploymentPlanWithMemory(
      bundle.deploymentPlan,
      currentState
    );

    results[instanceId] = execResult;
  }

  CoreMemory.set(ROUTE, KEY_LAST_MULTI_EXEC, results);

  return results;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastExecutionResult(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, resultKey(instanceId));
}

export function getLastExecutionLogs(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, logsKey(instanceId));
}

export function getLastExecutionState(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, stateKey(instanceId));
}

export function getExecutionMemoryState() {
  CoreMemory.prewarm();

  return {
    lastMultiExecution: CoreMemory.get(ROUTE, KEY_LAST_MULTI_EXEC),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotTransitions: CoreMemory.get(ROUTE, KEY_HOT_TRANSITIONS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const ExecutionPhysicsCoreMemory = {
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

export default ExecutionPhysicsCoreMemory;
