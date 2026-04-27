/**
 * META {
 *   organ: "MultiOrganismSupport",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "multi-organism-coordination",
 *   version: "v11-EVO",
 *
 *   role: "Coordinates many organism instances at once: snapshots, deltas, deployments, and summaries.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     regionAware: true,
 *     hostAgnostic: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "InstanceContext[]",
 *       "GlobalContinuancePolicy"
 *     ],
 *     output: [
 *       "MultiOrganismPlan",
 *       "MultiOrganismSummary"
 *     ]
 *   },
 *
 *   upstream: [
 *     "LineageEngine",
 *     "SnapshotPhysics",
 *     "DeltaEngine",
 *     "DeploymentPhysics",
 *     "PulseContinuance",
 *     "RegionMeshRouting"
 *   ],
 *
 *   downstream: [
 *     "ExecutionPhysics"
 *   ],
 *
 *   notes: [
 *     "This organ never executes deployments; it only coordinates symbolic plans.",
 *     "It treats each instance as a cell in a larger organism mesh.",
 *     "GlobalContinuancePolicy can bias movement, spawning, and retirement."
 *   ]
 * }
 */

/**
 * MultiOrganismSupport-v11-Evo.js
 * PULSE-WORLD / PULSE-MULTI
 *
 * ROLE:
 *   Coordinate many instances:
 *     - build per-instance snapshots
 *     - compute deltas
 *     - build deployment plans
 *     - aggregate into a multi-organism plan
 *
 * NEVER:
 *   - Never talk to real infrastructure.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 */

// -------------------------
// Types
// -------------------------

/**
 * InstanceContext
 *
 * instanceId: string
 * currentState: CurrentInstanceState
 * previousSnapshot: SnapshotRecord | null
 * desiredSnapshot: SnapshotRecord
 * regionRoute: RegionRoute
 * continuanceDecision: {
 *   shouldMoveRegion: boolean,
 *   shouldMoveHost: boolean,
 *   shouldRestart: boolean,
 *   shouldSpawnReplica: boolean,
 *   shouldRetire: boolean,
 *   targetHost?: string,
 *   spawnRegion?: string,
 *   spawnHost?: string
 * }
 */
export class InstanceContext {
  constructor({
    instanceId,
    currentState,
    previousSnapshot = null,
    desiredSnapshot,
    regionRoute,
    continuanceDecision
  }) {
    this.instanceId = instanceId;
    this.currentState = currentState;
    this.previousSnapshot = previousSnapshot;
    this.desiredSnapshot = desiredSnapshot;
    this.regionRoute = regionRoute;
    this.continuanceDecision = continuanceDecision;
  }
}

/**
 * InstancePlanBundle
 *
 * instanceId: string
 * deltaRecord: DeltaRecord | null
 * deltaSummary: DeltaSummary | null
 * deltaPatch: DeltaPatch | null
 * deploymentPlan: DeploymentPlan
 * deploymentSummary: DeploymentSummary
 */
export class InstancePlanBundle {
  constructor({
    instanceId,
    deltaRecord = null,
    deltaSummary = null,
    deltaPatch = null,
    deploymentPlan,
    deploymentSummary
  }) {
    this.instanceId = instanceId;
    this.deltaRecord = deltaRecord;
    this.deltaSummary = deltaSummary;
    this.deltaPatch = deltaPatch;
    this.deploymentPlan = deploymentPlan;
    this.deploymentSummary = deploymentSummary;
  }
}

/**
 * MultiOrganismPlan
 *
 * instances: InstancePlanBundle[]
 */
export class MultiOrganismPlan {
  constructor({ instances = [] }) {
    this.instances = instances;
  }
}

/**
 * MultiOrganismSummary
 *
 * totalInstances: number
 * totalActions: number
 * actionTypeCounts: { [type: string]: number }
 */
export class MultiOrganismSummary {
  constructor({ totalInstances, totalActions, actionTypeCounts }) {
    this.totalInstances = totalInstances;
    this.totalActions = totalActions;
    this.actionTypeCounts = actionTypeCounts;
  }
}

// -------------------------
// Imports (logical)
// -------------------------

// These are logical imports; wire them to your actual modules.
import SnapshotPhysicsAPI from "./SnapshotPhysics-v11-Evo.js";
import DeltaEngineAPI from "./DeltaEngine-v11-Evo.js";
import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";

const {
  projectSnapshotForDelta
} = SnapshotPhysicsAPI;

const {
  computeDelta,
  summarizeDelta,
  buildDeltaPatch
} = DeltaEngineAPI;

const {
  buildDeploymentPlan,
  summarizeDeploymentPlan
} = DeploymentPhysicsAPI;

// -------------------------
// Core Logic
// -------------------------

/**
 * buildInstancePlanBundle
 *
 * For a single instance:
 *   - compute delta (if previous snapshot exists)
 *   - build patch
 *   - build deployment plan
 *   - summarize
 */
export function buildInstancePlanBundle(instanceContext) {
  const {
    instanceId,
    currentState,
    previousSnapshot,
    desiredSnapshot,
    regionRoute,
    continuanceDecision
  } = instanceContext;

  let deltaRecord = null;
  let deltaSummary = null;
  let deltaPatch = null;

  if (previousSnapshot) {
    // Use projected snapshots to ensure stable diff surface
    const beforeProjected = projectSnapshotForDelta(previousSnapshot);
    const afterProjected = projectSnapshotForDelta(desiredSnapshot);

    // Re-wrap into SnapshotRecord-like objects for DeltaEngine
    const beforeSnapshot = {
      header: previousSnapshot.header,
      state: beforeProjected.state
    };
    const afterSnapshot = {
      header: desiredSnapshot.header,
      state: afterProjected.state
    };

    deltaRecord = computeDelta(beforeSnapshot, afterSnapshot);
    deltaSummary = summarizeDelta(deltaRecord);
    deltaPatch = buildDeltaPatch(deltaRecord);
  }

  const deploymentPlan = buildDeploymentPlan({
    currentState,
    deltaPatch: deltaPatch || { patch: {} },
    regionRoute,
    continuanceDecision
  });

  const deploymentSummary = summarizeDeploymentPlan(deploymentPlan);

  return new InstancePlanBundle({
    instanceId,
    deltaRecord,
    deltaSummary,
    deltaPatch,
    deploymentPlan,
    deploymentSummary
  });
}

/**
 * buildMultiOrganismPlan
 *
 * Input:
 *   - instanceContexts: InstanceContext[]
 *
 * Output:
 *   - MultiOrganismPlan
 */
export function buildMultiOrganismPlan(instanceContexts = []) {
  const bundles = instanceContexts.map((ctx) =>
    buildInstancePlanBundle(ctx)
  );

  return new MultiOrganismPlan({ instances: bundles });
}

/**
 * summarizeMultiOrganismPlan
 *
 * Produces a global summary across all instances.
 */
export function summarizeMultiOrganismPlan(multiPlan) {
  let totalInstances = multiPlan.instances.length;
  let totalActions = 0;
  const actionTypeCounts = {};

  for (const bundle of multiPlan.instances) {
    const plan = bundle.deploymentPlan;
    totalActions += plan.actions.length;

    for (const action of plan.actions) {
      actionTypeCounts[action.type] =
        (actionTypeCounts[action.type] || 0) + 1;
    }
  }

  return new MultiOrganismSummary({
    totalInstances,
    totalActions,
    actionTypeCounts
  });
}

// -------------------------
// Exported API
// -------------------------

const MultiOrganismSupportAPI = {
  InstanceContext,
  InstancePlanBundle,
  MultiOrganismPlan,
  MultiOrganismSummary,
  buildInstancePlanBundle,
  buildMultiOrganismPlan,
  summarizeMultiOrganismPlan
};

export default MultiOrganismSupportAPI;
