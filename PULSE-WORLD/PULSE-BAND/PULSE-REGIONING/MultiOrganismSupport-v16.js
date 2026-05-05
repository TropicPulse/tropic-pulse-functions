/*
===============================================================================
FILE: /PULSE-WORLD/MultiOrganismSupport-v16.js
LAYER: PULSE-WORLD SUBSTRATE — MULTI-ORGANISM COORDINATION
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.MultiOrganismSupport",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "multi_organism_coordination",
  lineage: "MultiOrganismSupport-v13-COSMOS-MULTIVERSE → v16-Immortal",

  evo: {
    deterministic: true,
    symbolic: true,
    multiverseAware: true,
    regionAware: true,
    hostAgnostic: true,
    noRandomness: true,

    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    unifiedAdvantageField: true,
    coreMemoryAware: true,
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "InstanceContext[]",
      "GlobalContinuancePolicy",
      "CosmosContext { universeId, timelineId, branchId }"
    ],
    output: [
      "MultiOrganismPlan",
      "MultiOrganismSummary",
      "MultiOrganismPlanEnvelope"
    ]
  },

  upstream: [
    "LineageEngine-v16",
    "SnapshotPhysics-v16",
    "DeltaEngine-v16",
    "DeploymentPhysics-v16",
    "RegionMeshRouting-v16",
    "PulseContinuance-v16"
  ],

  downstream: [
    "ExecutionPhysics-v16"
  ],

  notes: [
    "Never executes deployments; only coordinates symbolic plans.",
    "Treats each instance as a star in a multiverse mesh.",
    "CosmosContext determines which universe/timeline/branch the plan belongs to.",
    "Advantage is computed per-instance and aggregated for the swarm."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.MultiOrganismSupport",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "InstanceContext[]",
    "GlobalContinuancePolicy",
    "CosmosContext"
  ],

  produces: [
    "MultiOrganismPlan",
    "MultiOrganismSummary",
    "MultiOrganismPlanEnvelope"
  ],

  sideEffects: "none",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const MULTI_ORG_ENGINE_VERSION = "16.0-Immortal";
const MULTI_ORG_SCHEMA_VERSION = "v3";

// -------------------------
// Imports (v16 IMMORTAL)
// -------------------------

import SnapshotPhysicsAPI from "./SnapshotPhysics-v16.js";
import DeltaEngineAPI from "./DeltaEngine-v16.js";
import DeploymentPhysicsAPI from "./DeploymentPhysics-v16.js";
import RegionMeshRoutingAPI from "./RegionMeshRouting-v16.js";
import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const { projectSnapshotForDelta } = SnapshotPhysicsAPI;
const { computeDelta, summarizeDelta, buildDeltaPatch } = DeltaEngineAPI;
const { buildDeploymentPlan, summarizeDeploymentPlan } = DeploymentPhysicsAPI;
const { computeRegionRoute } = RegionMeshRoutingAPI;

const CoreMemory = PulseProofBridge.coreMemory;

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

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function computeInstanceAdvantage({ deltaSummary, deploymentSummary, regionRoute }) {
  let deltaScore = 0;
  let actionScore = 0;
  let routeScore = 0;

  if (deltaSummary && typeof deltaSummary.totalChanges === "number") {
    const changes = deltaSummary.totalChanges;
    if (changes === 0) deltaScore = 0;
    else if (changes === 1) deltaScore = 0.4;
    else if (changes <= 3) deltaScore = 0.7;
    else deltaScore = 1.0;
  }

  if (deploymentSummary && typeof deploymentSummary.totalActions === "number") {
    const actions = deploymentSummary.totalActions;
    if (actions === 0) actionScore = 0;
    else if (actions === 1) actionScore = 0.4;
    else if (actions <= 5) actionScore = 0.7;
    else actionScore = 1.0;
  }

  if (regionRoute && typeof regionRoute.advantage === "number") {
    routeScore = clamp01(regionRoute.advantage);
  }

  return clamp01(0.4 * deltaScore + 0.4 * actionScore + 0.2 * routeScore);
}

function computeIntegrityHash(payload) {
  const json = JSON.stringify(payload || {});
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0;
  }
  return "MULTI_ORG_INTEGRITY_" + hash.toString(16).padStart(8, "0");
}

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
    regionRoute = null,
    continuanceDecision,
    organismId = null
  }) {
    this.instanceId = instanceId;
    this.currentState = currentState;
    this.previousSnapshot = previousSnapshot;
    this.desiredSnapshot = desiredSnapshot;

    this.cosmosRoute = cosmosRoute || {
      universeId: "u:default",
      timelineId: "t:main",
      branchId: "b:root"
    };

    this.regionRoute = regionRoute;
    this.continuanceDecision = continuanceDecision;
    this.organismId = organismId;
  }
}

export class InstancePlanBundle {
  constructor({
    instanceId,
    cosmos,
    organismId = null,
    deltaRecord = null,
    deltaSummary = null,
    deltaPatch = null,
    deploymentPlan,
    deploymentSummary,
    regionRoute = null,
    advantage = 0
  }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.organismId = organismId;

    this.deltaRecord = deltaRecord;
    this.deltaSummary = deltaSummary;
    this.deltaPatch = deltaPatch;

    this.deploymentPlan = deploymentPlan;
    this.deploymentSummary = deploymentSummary;

    this.regionRoute = regionRoute;
    this.advantage = clamp01(advantage);

    this.schemaVersion = MULTI_ORG_SCHEMA_VERSION;
    this.engineVersion = MULTI_ORG_ENGINE_VERSION;
  }
}

export class MultiOrganismPlan {
  constructor({ cosmos, instances = [], advantage = 0 }) {
    this.cosmos = cosmos;
    this.instances = instances;
    this.advantage = clamp01(advantage);

    this.schemaVersion = MULTI_ORG_SCHEMA_VERSION;
    this.engineVersion = MULTI_ORG_ENGINE_VERSION;
  }
}

export class MultiOrganismSummary {
  constructor({ cosmos, totalInstances, totalActions, actionTypeCounts, advantage }) {
    this.cosmos = cosmos;
    this.totalInstances = totalInstances;
    this.totalActions = totalActions;
    this.actionTypeCounts = actionTypeCounts;
    this.advantage = clamp01(advantage);

    this.schemaVersion = MULTI_ORG_SCHEMA_VERSION;
    this.engineVersion = MULTI_ORG_ENGINE_VERSION;
  }
}

export class MultiOrganismPlanEnvelope {
  constructor({
    schemaVersion,
    engineVersion,
    cosmos,
    plan,
    summary,
    integrity
  }) {
    this.schemaVersion = schemaVersion;
    this.engineVersion = engineVersion;
    this.cosmos = cosmos;
    this.plan = plan;
    this.summary = summary;
    this.integrity = integrity;
  }
}

// -------------------------
// Core Logic (v16 IMMORTAL)
// -------------------------

export function buildInstancePlanBundle(instanceContext) {
  CoreMemory.prewarm();

  const {
    instanceId,
    currentState,
    previousSnapshot,
    desiredSnapshot,
    cosmosRoute,
    regionRoute,
    continuanceDecision,
    organismId
  } = instanceContext;

  const cosmos = normalizeCosmosContext(cosmosRoute);

  let deltaRecord = null;
  let deltaSummary = null;
  let deltaPatch = null;

  if (previousSnapshot && desiredSnapshot) {
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

  let effectiveRegionRoute = regionRoute || null;

  if (!effectiveRegionRoute && currentState.currentRegionId && continuanceDecision?.targetRegionId) {
    effectiveRegionRoute = computeRegionRoute(
      instanceContext.regionGraph,
      instanceContext.regionStabilityMap,
      currentState.currentRegionId,
      continuanceDecision.targetRegionId,
      cosmos
    );
  }

  const deploymentPlan = buildDeploymentPlan({
    currentState,
    deltaPatch: deltaPatch || { patch: {} },
    cosmosRoute: cosmos,
    continuanceDecision
  });

  const deploymentSummary = summarizeDeploymentPlan(deploymentPlan);

  const advantage = computeInstanceAdvantage({
    deltaSummary,
    deploymentSummary,
    regionRoute: effectiveRegionRoute
  });

  const bundle = new InstancePlanBundle({
    instanceId,
    cosmos,
    organismId,
    deltaRecord,
    deltaSummary,
    deltaPatch,
    deploymentPlan,
    deploymentSummary,
    regionRoute: effectiveRegionRoute,
    advantage
  });

  const key = [
    "instance-plan",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");

  CoreMemory.set("multi-organism-support-v16", key, bundle);

  return bundle;
}

export function buildMultiOrganismPlan(instanceContexts = [], cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);

  const bundles = instanceContexts.map((ctx) => buildInstancePlanBundle(ctx));

  let totalAdvantage = 0;
  for (const b of bundles) {
    totalAdvantage += b.advantage || 0;
  }

  const avgAdvantage =
    bundles.length > 0 ? clamp01(totalAdvantage / bundles.length) : 0;

  const plan = new MultiOrganismPlan({
    cosmos,
    instances: bundles,
    advantage: avgAdvantage
  });

  const key = [
    "multi-plan",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId
  ].join("|");

  CoreMemory.set("multi-organism-support-v16", key, plan);

  return plan;
}

export function summarizeMultiOrganismPlan(multiPlan) {
  const cosmos = multiPlan.cosmos;

  const totalInstances = multiPlan.instances.length;
  let totalActions = 0;
  const actionTypeCounts = {};
  let totalAdvantage = 0;

  for (const bundle of multiPlan.instances) {
    const plan = bundle.deploymentPlan;
    totalActions += plan.actions.length;

    for (const action of plan.actions) {
      actionTypeCounts[action.type] =
        (actionTypeCounts[action.type] || 0) + 1;
    }

    totalAdvantage += bundle.advantage || 0;
  }

  const avgAdvantage =
    totalInstances > 0 ? clamp01(totalAdvantage / totalInstances) : 0;

  return new MultiOrganismSummary({
    cosmos,
    totalInstances,
    totalActions,
    actionTypeCounts,
    advantage: avgAdvantage
  });
}

// -------------------------
// Envelope Builder (v16 IMMORTAL)
// -------------------------

export function buildMultiOrganismPlanEnvelope(multiPlan) {
  const summary = summarizeMultiOrganismPlan(multiPlan);

  const basePayload = {
    schemaVersion: MULTI_ORG_SCHEMA_VERSION,
    engineVersion: MULTI_ORG_ENGINE_VERSION,
    cosmos: multiPlan.cosmos,
    plan: multiPlan,
    summary
  };

  const integrity = {
    hash: computeIntegrityHash(basePayload),
    schemaVersion: MULTI_ORG_SCHEMA_VERSION
  };

  const envelope = new MultiOrganismPlanEnvelope({
    ...basePayload,
    integrity
  });

  const cosmos = multiPlan.cosmos || {};
  const key = [
    "multi-envelope",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId
  ].join("|");

  CoreMemory.set("multi-organism-support-v16", key, envelope);

  return envelope;
}

// -------------------------
// CoreMemory Accessors
// -------------------------

export function getLastInstancePlan(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);

  const key = [
    "instance-plan",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId,
    instanceId
  ].join("|");

  return CoreMemory.get("multi-organism-support-v16", key);
}

export function getLastMultiOrganismPlan(cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);

  const key = [
    "multi-plan",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId
  ].join("|");

  return CoreMemory.get("multi-organism-support-v16", key);
}

export function getLastMultiOrganismEnvelope(cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);

  const key = [
    "multi-envelope",
    cosmos.universeId,
    cosmos.timelineId,
    cosmos.branchId
  ].join("|");

  return CoreMemory.get("multi-organism-support-v16", key);
}

export function getMultiOrganismMemoryState() {
  CoreMemory.prewarm();
  return CoreMemory.getNamespace("multi-organism-support-v16");
}

// -------------------------
// Exported API
// -------------------------

const MultiOrganismSupportAPI = {
  InstanceContext,
  InstancePlanBundle,
  MultiOrganismPlan,
  MultiOrganismSummary,
  MultiOrganismPlanEnvelope,

  buildInstancePlanBundle,
  buildMultiOrganismPlan,
  summarizeMultiOrganismPlan,
  buildMultiOrganismPlanEnvelope,

  getLastInstancePlan,
  getLastMultiOrganismPlan,
  getLastMultiOrganismEnvelope,
  getMultiOrganismMemoryState,

  CoreMemory,
  MULTI_ORG_ENGINE_VERSION,
  MULTI_ORG_SCHEMA_VERSION
};

export default MultiOrganismSupportAPI;
