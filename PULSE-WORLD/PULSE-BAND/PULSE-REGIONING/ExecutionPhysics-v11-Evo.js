/**
 * META {
 *   organ: "ExecutionPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "symbolic-execution",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Executes symbolic deployment plans across universes, timelines, and branches. Produces new state + logs.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     multiverseAware: true,
 *     regionAware: true,
 *     hostAgnostic: true,
 *     noRandomness: true,
 *     reversible: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "DeploymentPlan (multiverse-aware)",
 *       "CurrentInstanceState"
 *     ],
 *     output: [
 *       "ExecutionResult",
 *       "ExecutionLogEntry[]"
 *     ]
 *   },
 *
 *   upstream: [
 *     "DeploymentPhysics-v13",
 *     "MultiOrganismSupport",
 *     "LineageEngine",
 *     "SnapshotPhysics"
 *   ],
 *
 *   downstream: [
 *     "anything that wants new state or logs"
 *   ],
 *
 *   notes: [
 *     "ExecutionPhysics v13 is symbolic only; no real infra calls.",
 *     "It applies actions to state and emits logs.",
 *     "Multiverse-aware but physics-pure.",
 *     "Perfect for binary packing: small, fixed, deterministic."
 *   ]
 * }
 */

// -------------------------
// Types
// -------------------------

export class ExecutionLogEntry {
  constructor({ instanceId, actionType, cosmos, details = {} }) {
    this.instanceId = instanceId;
    this.actionType = actionType;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.details = details;
  }
}

export class ExecutionResult {
  constructor({ instanceId, cosmos, newState, logs = [] }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.newState = newState;
    this.logs = logs;
  }
}

// -------------------------
// Imports (logical)
// -------------------------

import { CurrentInstanceState } from "./LineageEngine-v11-Evo.js";
import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";
import MultiOrganismSupportAPI from "./MultiOrganismSupport-v11-Evo.js";

const { DeploymentActionType } = DeploymentPhysicsAPI;
const { MultiOrganismPlan } = MultiOrganismSupportAPI;

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

// -------------------------
// Core Execution Logic (v13 Multiverse)
// -------------------------

export function applyDeploymentActionToState(currentState, action, cosmos) {
  const base = new CurrentInstanceState({
    instanceId: currentState.instanceId,
    active: currentState.active,
    currentRegionId: currentState.currentRegionId,
    currentHostName: currentState.currentHostName,
    mergedInto: currentState.mergedInto,

    // v13 multiverse placement
    universeId: currentState.universeId || "u:default",
    timelineId: currentState.timelineId || "t:main",
    branchId: currentState.branchId || "b:root"
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
      return base;

    case DeploymentActionType.NO_OP:
    default:
      return base;
  }
}

export function executeDeploymentPlan(plan, currentState) {
  const cosmos = normalizeCosmosContext(plan.cosmos || {});
  let state = currentState;
  const logs = [];

  for (const action of plan.actions) {
    const newState = applyDeploymentActionToState(state, action, cosmos);

    logs.push(
      new ExecutionLogEntry({
        instanceId: state.instanceId,
        actionType: action.type,
        cosmos,
        details: {
          universeId: action.universeId || null,
          timelineId: action.timelineId || null,
          branchId: action.branchId || null,
          regionId: action.regionId || null,
          hostName: action.hostName || null,
          meta: action.meta || null
        }
      })
    );

    state = newState;
  }

  return new ExecutionResult({
    instanceId: state.instanceId,
    cosmos,
    newState: state,
    logs
  });
}

// -------------------------
// Multi-Organism Execution (v13 Multiverse)
// -------------------------

export function executeMultiOrganismPlan(multiPlan, currentStatesById) {
  if (!(multiPlan instanceof MultiOrganismPlan)) {
    throw new Error("executeMultiOrganismPlan: expected MultiOrganismPlan");
  }

  const cosmos = normalizeCosmosContext(multiPlan.cosmos || {});
  const results = {};

  for (const bundle of multiPlan.instances) {
    const instanceId = bundle.instanceId;
    const currentState = currentStatesById[instanceId];

    if (!currentState) continue;

    const execResult = executeDeploymentPlan(bundle.deploymentPlan, currentState);
    results[instanceId] = execResult;
  }

  return results;
}

// -------------------------
// Exported API
// -------------------------

const ExecutionPhysicsAPI = {
  ExecutionLogEntry,
  ExecutionResult,
  applyDeploymentActionToState,
  executeDeploymentPlan,
  executeMultiOrganismPlan
};

export default ExecutionPhysicsAPI;
