/**
 * META {
 *   organ: "DeploymentPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-deployment",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Applies symbolic deltas to the organism's world placement across universes, timelines, and branches.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
     multiverseAware: true,
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
 *       "CosmosRoute { universeId, timelineId, branchId, regionRoute }",
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
 *     "DeltaEngine-v13",
 *     "SnapshotPhysics",
 *     "RegionMeshRouting-v13",
 *     "PulseContinuance"
 *   ],
 *
 *   downstream: [
 *     "MultiOrganismSupport",
 *     "ExecutionPhysics"
 *   ],
 *
 *   notes: [
 *     "DeploymentPhysics v13 is multiverse-aware but physics-pure.",
 *     "Movement is universe-first, timeline-second, region-third, host-fourth.",
 *     "All actions remain symbolic and reversible."
 *   ]
 * }
 */

// -------------------------
// Types
// -------------------------

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

/**
 * DeploymentAction
 */
export class DeploymentAction {
  constructor({
    type,
    instanceId,
    universeId = null,
    timelineId = null,
    branchId = null,
    regionId = null,
    hostName = null,
    patch = null,
    meta = {}
  }) {
    this.type = type;
    this.instanceId = instanceId;
    this.universeId = universeId;
    this.timelineId = timelineId;
    this.branchId = branchId;
    this.regionId = regionId;
    this.hostName = hostName;
    this.patch = patch;
    this.meta = meta;
  }
}

/**
 * DeploymentPlan
 */
export class DeploymentPlan {
  constructor({ instanceId, cosmos, actions = [] }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.actions = actions;
  }
}

/**
 * DeploymentSummary
 */
export class DeploymentSummary {
  constructor({ instanceId, cosmos, totalActions, actionTypes }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.totalActions = totalActions;
    this.actionTypes = actionTypes;
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

// -------------------------
// Core Logic (v13 Multiverse)
// -------------------------

/**
 * buildDeploymentPlan
 *
 * Input:
 *   - currentState
 *   - deltaPatch
 *   - cosmosRoute: {
 *       universeId,
 *       timelineId,
 *       branchId,
 *       regionRoute
 *     }
 *   - continuanceDecision
 *
 * Output:
 *   - DeploymentPlan (multiverse-aware)
 */
export function buildDeploymentPlan({
  currentState,
  deltaPatch,
  cosmosRoute,
  continuanceDecision
}) {
  const cosmos = normalizeCosmosContext(cosmosRoute);
  const actions = [];
  const instanceId = currentState.instanceId;

  // 1. Universe movement (if required)
  if (continuanceDecision.shouldMoveUniverse &&
      cosmosRoute.universeId !== currentState.universeId) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_UNIVERSE,
        instanceId,
        universeId: cosmosRoute.universeId,
        meta: { from: currentState.universeId, to: cosmosRoute.universeId }
      })
    );
  }

  // 2. Timeline movement (if required)
  if (continuanceDecision.shouldMoveTimeline &&
      cosmosRoute.timelineId !== currentState.timelineId) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_TIMELINE,
        instanceId,
        timelineId: cosmosRoute.timelineId,
        meta: { from: currentState.timelineId, to: cosmosRoute.timelineId }
      })
    );
  }

  // 3. Branch movement (if required)
  if (continuanceDecision.shouldMoveBranch &&
      cosmosRoute.branchId !== currentState.branchId) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_BRANCH,
        instanceId,
        branchId: cosmosRoute.branchId,
        meta: { from: currentState.branchId, to: cosmosRoute.branchId }
      })
    );
  }

  // 4. Region movement (if required)
  if (continuanceDecision.shouldMoveRegion &&
      cosmosRoute.regionRoute?.path?.length > 1) {
    const targetRegion = cosmosRoute.regionRoute.path.at(-1);

    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_REGION,
        instanceId,
        regionId: targetRegion,
        meta: { route: cosmosRoute.regionRoute.path }
      })
    );
  }

  // 5. Host movement (if required)
  if (continuanceDecision.shouldMoveHost) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_HOST,
        instanceId,
        hostName: continuanceDecision.targetHost || null
      })
    );
  }

  // 6. Apply delta patch (if any)
  if (deltaPatch && Object.keys(deltaPatch.patch).length > 0) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.APPLY_DELTA,
        instanceId,
        patch: deltaPatch.patch
      })
    );
  }

  // 7. Restart (if required)
  if (continuanceDecision.shouldRestart) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.RESTART_INSTANCE,
        instanceId
      })
    );
  }

  // 8. Spawn replica (if required)
  if (continuanceDecision.shouldSpawnReplica) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.SPAWN_INSTANCE,
        instanceId,
        universeId: cosmos.universeId,
        timelineId: cosmos.timelineId,
        branchId: cosmos.branchId,
        regionId: continuanceDecision.spawnRegion || null,
        hostName: continuanceDecision.spawnHost || null
      })
    );
  }

  // 9. Retirement (if required)
  if (continuanceDecision.shouldRetire) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.RETIRE_INSTANCE,
        instanceId
      })
    );
  }

  // 10. If nothing changed → NO_OP
  if (actions.length === 0) {
    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.NO_OP,
        instanceId
      })
    );
  }

  return new DeploymentPlan({ instanceId, cosmos, actions });
}

/**
 * summarizeDeploymentPlan
 */
export function summarizeDeploymentPlan(plan) {
  const actionTypes = plan.actions.map((a) => a.type);

  return new DeploymentSummary({
    instanceId: plan.instanceId,
    cosmos: plan.cosmos,
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
