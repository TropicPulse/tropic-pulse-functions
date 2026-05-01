/**
 * META {
 *   organ: "MultiOrganismSupport",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "multi-organism-coordination",
 *   version: "v13-COSMOS-MULTIVERSE",
 *
 *   role: "Coordinates many organism instances across universes, timelines, and branches.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     multiverseAware: true,
 *     regionAware: true,
 *     hostAgnostic: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "InstanceContext[]",
 *       "GlobalContinuancePolicy",
 *       "CosmosContext { universeId, timelineId, branchId }"
 *     ],
 *     output: [
 *       "MultiOrganismPlan",
 *       "MultiOrganismSummary"
 *     ]
 *   },
 *
 *   upstream: [
 *     "LineageEngine-v13",
 *     "SnapshotPhysics",
 *     "DeltaEngine-v13",
 *     "DeploymentPhysics-v13",
 *     "PulseContinuance",
 *     "RegionMeshRouting-v13"
 *   ],
 *
 *   downstream: [
 *     "ExecutionPhysics-v13"
 *   ],
 *
 *   notes: [
 *     "This organ never executes deployments; it only coordinates symbolic plans.",
 *     "It treats each instance as a star in a multiverse mesh.",
 *     "CosmosContext determines which universe/timeline/branch the plan belongs to."
 *   ]
 * }
 */

// -------------------------
// Types
// -------------------------

export class InstanceContext {
  constructor({
    instanceId,
    currentState,
    previousSnapshot = null,
    desiredSnapshot,
    cosmosRoute,
    regionRoute,
    continuanceDecision
  }) {
    this.instanceId = instanceId;
    this.currentState = currentState;
    this.previousSnapshot = previousSnapshot;
    this.desiredSnapshot = desiredSnapshot;

    // v13 multiverse routing
    this.cosmosRoute = cosmosRoute || {
      universeId: "u:default",
      timelineId: "t:main",
      branchId: "b:root"
    };

    this.regionRoute = regionRoute;
    this.continuanceDecision = continuanceDecision;
  }
}

export class InstancePlanBundle {
  constructor({
    instanceId,
    cosmos,
    deltaRecord = null,
    deltaSummary = null,
    deltaPatch = null,
    deploymentPlan,
    deploymentSummary
  }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.deltaRecord = deltaRecord;
    this.deltaSummary = deltaSummary;
    this.deltaPatch = deltaPatch;
    this.deploymentPlan = deploymentPlan;
    this.deploymentSummary = deploymentSummary;
  }
}

export class MultiOrganismPlan {
  constructor({ cosmos, instances = [] }) {
    this.cosmos = cosmos;
    this.instances = instances;
  }
}

export class MultiOrganismSummary {
  constructor({ cosmos, totalInstances, totalActions, actionTypeCounts }) {
    this.cosmos = cosmos;
    this.totalInstances = totalInstances;
    this.totalActions = totalActions;
    this.actionTypeCounts = actionTypeCounts;
  }
}

// -------------------------
// Imports (logical)
// -------------------------

import SnapshotPhysicsAPI from "./SnapshotPhysics-v11-Evo.js";
import DeltaEngineAPI from "./DeltaEngine-v11-Evo.js";
import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";

const { projectSnapshotForDelta } = SnapshotPhysicsAPI;
const { computeDelta, summarizeDelta, buildDeltaPatch } = DeltaEngineAPI;
const { buildDeploymentPlan, summarizeDeploymentPlan } = DeploymentPhysicsAPI;

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

export function buildInstancePlanBundle(instanceContext) {
  const {
    instanceId,
    currentState,
    previousSnapshot,
    desiredSnapshot,
    cosmosRoute,
    regionRoute,
    continuanceDecision
  } = instanceContext;

  const cosmos = normalizeCosmosContext(cosmosRoute);

  let deltaRecord = null;
  let deltaSummary = null;
  let deltaPatch = null;

  if (previousSnapshot) {
    const beforeProjected = projectSnapshotForDelta(previousSnapshot);
    const afterProjected = projectSnapshotForDelta(desiredSnapshot);

    const beforeSnapshot = {
      header: previousSnapshot.header,
      state: beforeProjected.state
    };

    const afterSnapshot = {
      header: desiredSnapshot.header,
      state: afterProjected.state
    };

    deltaRecord = computeDelta(beforeSnapshot, afterSnapshot, cosmos);
    deltaSummary = summarizeDelta(deltaRecord);
    deltaPatch = buildDeltaPatch(deltaRecord);
  }

  const deploymentPlan = buildDeploymentPlan({
    currentState,
    deltaPatch: deltaPatch || { patch: {} },
    cosmosRoute: cosmos,
    regionRoute,
    continuanceDecision
  });

  const deploymentSummary = summarizeDeploymentPlan(deploymentPlan);

  return new InstancePlanBundle({
    instanceId,
    cosmos,
    deltaRecord,
    deltaSummary,
    deltaPatch,
    deploymentPlan,
    deploymentSummary
  });
}

export function buildMultiOrganismPlan(instanceContexts = [], cosmosContext = {}) {
  const cosmos = normalizeCosmosContext(cosmosContext);

  const bundles = instanceContexts.map((ctx) =>
    buildInstancePlanBundle(ctx)
  );

  return new MultiOrganismPlan({
    cosmos,
    instances: bundles
  });
}

export function summarizeMultiOrganismPlan(multiPlan) {
  const cosmos = multiPlan.cosmos;

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
    cosmos,
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
