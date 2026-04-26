/**
 * META {
 *   organ: "DeploymentPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-deployment",
 *   version: "v11-EVO",
 *
 *   role: "Applies symbolic deltas to the organism's world placement. Determines movement, placement, and deployment actions.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     regionAware: true,
 *     hostAgnostic: true,
 *     reversible: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "CurrentInstanceState",
 *       "DeltaPatch",
 *       "RegionRoute",
 *       "ContinuanceDecision"
 *     ],
 *     output: [
 *       "DeploymentAction",
 *       "DeploymentPlan",
 *       "DeploymentSummary"
 *     ]
 *   },
 *
 *   upstream: [
 *     "DeltaEngine",
 *     "SnapshotPhysics",
 *     "RegionMeshRouting",
 *     "PulseContinuance"
 *   ],
 *
 *   downstream: [
 *     "MultiOrganismSupport",
 *     "ExecutionPhysics"
 *   ],
 *
 *   notes: [
 *     "DeploymentPhysics does not perform real deployments.",
 *     "It produces symbolic actions for ExecutionPhysics.",
 *     "Movement is region-first, host-second.",
 *     "All actions are reversible."
 *   ]
 * }
 */

/**
 * DeploymentPhysics-v11-Evo.js
 * PULSE-WORLD / PULSE-DEPLOYMENT
 *
 * ROLE:
 *   Convert deltas + routing + continuance into symbolic deployment actions.
 *
 * NEVER:
 *   - Never talk to real servers.
 *   - Never perform real network calls.
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

export const DeploymentActionType = Object.freeze({
  APPLY_DELTA: "APPLY_DELTA",
  MOVE_REGION: "MOVE_REGION",
  MOVE_HOST: "MOVE_HOST",
  RESTART_INSTANCE: "RESTART_INSTANCE",
  SPAWN_INSTANCE: "SPAWN_INSTANCE",
  RETIRE_INSTANCE: "RETIRE_INSTANCE",
  NO_OP: "NO_OP"
});

/**
 * DeploymentAction
 *
 * type: DeploymentActionType
 * instanceId: string
 * regionId?: string
 * hostName?: string
 * patch?: object
 * meta?: object
 */
export class DeploymentAction {
  constructor({
    type,
    instanceId,
    regionId = null,
    hostName = null,
    patch = null,
    meta = {}
  }) {
    this.type = type;
    this.instanceId = instanceId;
    this.regionId = regionId;
    this.hostName = hostName;
    this.patch = patch;
    this.meta = meta;
  }
}

/**
 * DeploymentPlan
 *
 * instanceId: string
 * actions: DeploymentAction[]
 */
export class DeploymentPlan {
  constructor({ instanceId, actions = [] }) {
    this.instanceId = instanceId;
    this.actions = actions;
  }
}

/**
 * DeploymentSummary
 *
 * instanceId: string
 * totalActions: number
 * actionTypes: string[]
 */
export class DeploymentSummary {
  constructor({ instanceId, totalActions, actionTypes }) {
    this.instanceId = instanceId;
    this.totalActions = totalActions;
    this.actionTypes = actionTypes;
  }
}

// -------------------------
// Core Logic
// -------------------------

/**
 * buildDeploymentPlan
 *
 * Input:
 *   - currentState: CurrentInstanceState
 *   - deltaPatch: DeltaPatch
 *   - regionRoute: RegionRoute (from RegionMeshRouting)
 *   - continuanceDecision: {
 *       shouldMoveRegion: boolean,
 *       shouldMoveHost: boolean,
 *       shouldRestart: boolean,
 *       shouldSpawnReplica: boolean,
 *       shouldRetire: boolean
 *     }
 *
 * Output:
 *   - DeploymentPlan
 */
export function buildDeploymentPlan({
  currentState,
  deltaPatch,
  regionRoute,
  continuanceDecision
}) {
  const actions = [];
  const instanceId = currentState.instanceId;

  // 1. Region movement (if required)
  if (continuanceDecision.shouldMoveRegion && regionRoute.path.length > 1) {
    const targetRegion = regionRoute.path[regionRoute.path.length - 1];

    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_REGION,
        instanceId,
        regionId: targetRegion,
        meta: { route: regionRoute.path }
      })
    );
  }

  // 2. Host movement (if required)
  if (continuanceDecision.shouldMoveHost) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_HOST,
        instanceId,
        hostName: continuanceDecision.targetHost || null
      })
    );
  }

  // 3. Apply delta patch (if any)
  if (deltaPatch && Object.keys(deltaPatch.patch).length > 0) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.APPLY_DELTA,
        instanceId,
        patch: deltaPatch.patch
      })
    );
  }

  // 4. Restart (if required)
  if (continuanceDecision.shouldRestart) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.RESTART_INSTANCE,
        instanceId
      })
    );
  }

  // 5. Spawn replica (if required)
  if (continuanceDecision.shouldSpawnReplica) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.SPAWN_INSTANCE,
        instanceId,
        regionId: continuanceDecision.spawnRegion || null,
        hostName: continuanceDecision.spawnHost || null
      })
    );
  }

  // 6. Retirement (if required)
  if (continuanceDecision.shouldRetire) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.RETIRE_INSTANCE,
        instanceId
      })
    );
  }

  // 7. If nothing changed → NO_OP
  if (actions.length === 0) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.NO_OP,
        instanceId
      })
    );
  }

  return new DeploymentPlan({ instanceId, actions });
}

/**
 * summarizeDeploymentPlan
 *
 * Produces a compact summary of the plan.
 */
export function summarizeDeploymentPlan(plan) {
  const actionTypes = plan.actions.map((a) => a.type);

  return new DeploymentSummary({
    instanceId: plan.instanceId,
    totalActions: plan.actions.length,
    actionTypes
  });
}

// -------------------------
// Exported API
// -------------------------

const DeploymentPhysicsAPI = {
  DeploymentActionType,
  DeploymentAction,
  DeploymentPlan,
  DeploymentSummary,
  buildDeploymentPlan,
  summarizeDeploymentPlan
};

export default DeploymentPhysicsAPI;
