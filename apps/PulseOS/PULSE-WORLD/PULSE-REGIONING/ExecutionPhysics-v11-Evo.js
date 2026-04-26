/**
 * META {
 *   organ: "ExecutionPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "symbolic-execution",
 *   version: "v11-EVO",
 *
 *   role: "Executes symbolic deployment plans against symbolic instance state. Produces new state + logs.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     regionAware: true,
 *     hostAgnostic: true,
 *     noRandomness: true,
 *     reversible: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "DeploymentPlan",
 *       "CurrentInstanceState"
 *     ],
 *     output: [
 *       "ExecutionResult",
 *       "ExecutionLogEntry[]"
 *     ]
 *   },
 *
 *   upstream: [
 *     "DeploymentPhysics",
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
 *     "ExecutionPhysics is symbolic only; no real infra calls.",
 *     "It applies actions to state and emits logs.",
 *     "Perfectly suited for binary packing: small, fixed, deterministic."
 *   ]
 * }
 */

/**
 * ExecutionPhysics-v11-Evo.js
 * PULSE-WORLD / PULSE-EXECUTION
 *
 * ROLE:
 *   Apply DeploymentPlan actions to CurrentInstanceState symbolically.
 *   Emit:
 *     - new CurrentInstanceState
 *     - execution log
 *
 * NEVER:
 *   - Never talk to real servers.
 *   - Never perform real I/O.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always be reversible (via lineage + snapshots).
 */

// -------------------------
// Types
// -------------------------

/**
 * ExecutionLogEntry
 *
 * instanceId: string
 * actionType: string
 * details: object
 */
export class ExecutionLogEntry {
  constructor({ instanceId, actionType, details = {} }) {
    this.instanceId = instanceId;
    this.actionType = actionType;
    this.details = details;
  }
}

/**
 * ExecutionResult
 *
 * instanceId: string
 * newState: CurrentInstanceState
 * logs: ExecutionLogEntry[]
 */
export class ExecutionResult {
  constructor({ instanceId, newState, logs = [] }) {
    this.instanceId = instanceId;
    this.newState = newState;
    this.logs = logs;
  }
}

// -------------------------
// Imports (logical)
// -------------------------

// Wire these to your actual modules.
import { CurrentInstanceState } from "./LineageEngine-v11-Evo.js";
import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";
import MultiOrganismSupportAPI from "./MultiOrganismSupport-v11-Evo.js";

const { DeploymentActionType } = DeploymentPhysicsAPI;
const { MultiOrganismPlan } = MultiOrganismSupportAPI;

// -------------------------
// Core Execution Logic
// -------------------------

/**
 * applyDeploymentActionToState
 *
 * Pure function:
 *   - takes CurrentInstanceState + DeploymentAction
 *   - returns NEW CurrentInstanceState
 */
export function applyDeploymentActionToState(currentState, action) {
  const base = new CurrentInstanceState({
    instanceId: currentState.instanceId,
    active: currentState.active,
    currentRegionId: currentState.currentRegionId,
    currentHostName: currentState.currentHostName,
    mergedInto: currentState.mergedInto
  });

  switch (action.type) {
    case DeploymentActionType.MOVE_REGION:
      base.currentRegionId = action.regionId;
      return base;

    case DeploymentActionType.MOVE_HOST:
      base.currentHostName = action.hostName;
      return base;

    case DeploymentActionType.RESTART_INSTANCE:
      // Symbolic restart: stays active, no field change here.
      return base;

    case DeploymentActionType.SPAWN_INSTANCE:
      // ExecutionPhysics does not create new instances itself;
      // it just logs that a spawn is requested.
      return base;

    case DeploymentActionType.RETIRE_INSTANCE:
      base.active = false;
      return base;

    case DeploymentActionType.APPLY_DELTA:
      // DeltaPatch already applied at Snapshot/Deployment level;
      // here we only care about placement state.
      return base;

    case DeploymentActionType.NO_OP:
    default:
      return base;
  }
}

/**
 * executeDeploymentPlan
 *
 * Input:
 *   - plan: DeploymentPlan
 *   - currentState: CurrentInstanceState
 *
 * Output:
 *   - ExecutionResult
 */
export function executeDeploymentPlan(plan, currentState) {
  let state = currentState;
  const logs = [];

  for (const action of plan.actions) {
    const newState = applyDeploymentActionToState(state, action);

    logs.push(
      new ExecutionLogEntry({
        instanceId: state.instanceId,
        actionType: action.type,
        details: {
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
    newState: state,
    logs
  });
}

// -------------------------
// Multi-Organism Execution
// -------------------------

/**
 * executeMultiOrganismPlan
 *
 * Input:
 *   - multiPlan: MultiOrganismPlan
 *   - currentStatesById: { [instanceId: string]: CurrentInstanceState }
 *
 * Output:
 *   - { [instanceId: string]: ExecutionResult }
 */
export function executeMultiOrganismPlan(multiPlan, currentStatesById) {
  if (!(multiPlan instanceof MultiOrganismPlan)) {
    throw new Error("executeMultiOrganismPlan: expected MultiOrganismPlan");
  }

  const results = {};

  for (const bundle of multiPlan.instances) {
    const instanceId = bundle.instanceId;
    const currentState = currentStatesById[instanceId];

    if (!currentState) {
      continue; // or log missing state symbolically
    }

    const execResult = executeDeploymentPlan(
      bundle.deploymentPlan,
      currentState
    );

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
