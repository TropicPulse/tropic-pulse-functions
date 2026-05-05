/*
===============================================================================
FILE: /PULSE-WORLD/DeploymentPhysics-v16-Immortal.js
LAYER: PULSE-WORLD SUBSTRATE — SYMBOLIC DEPLOYMENT PHYSICS
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseWorld.DeploymentPhysics",
  version: "v16-Immortal",
  layer: "pulse_world",
  role: "organism_deployment_physics",
  lineage: "DeploymentPhysics-v13-COSMOS-MULTIVERSE → v16-Immortal",

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

    coreMemoryAware: true,
    schemaVersioned: true,
    envelopeAware: false,
    integrityAware: false,
    historyAware: true,
    futureEvolutionReady: true
  },

  contracts: {
    input: [
      "CurrentInstanceState",
      "DeltaPatch",
      "CosmosRoute { universeId, timelineId, branchId, regionRoute }",
      "RegionRoute? (override)",
      "ContinuanceDecision"
    ],
    output: [
      "DeploymentAction",
      "DeploymentPlan",
      "DeploymentSummary"
    ]
  },

  upstream: [
    "DeltaEngine-v16",
    "SnapshotPhysics",
    "RegionMeshRouting-v16",
    "PulseContinuance",
    "LineageEngine-v16"
  ],

  downstream: [
    "MultiOrganismSupport-v16",
    "ExecutionPhysics-v16"
  ],

  notes: [
    "DeploymentPhysics v16 is multiverse + region aware but physics-pure.",
    "Movement is universe-first, timeline-second, branch-third, region-fourth, host-fifth.",
    "All actions remain symbolic and reversible.",
    "CoreMemory integration is write-only, deterministic, and multiverse keyed."
  ]
}
===============================================================================
EXPORT_META = {
  organ: "PulseWorld.DeploymentPhysics",
  layer: "pulse_world",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "CurrentInstanceState",
    "DeltaPatch",
    "CosmosRoute",
    "ContinuanceDecision"
  ],

  produces: [
    "DeploymentAction",
    "DeploymentPlan",
    "DeploymentSummary"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const DEPLOYMENT_ENGINE_VERSION = "16.0-Immortal";
const DEPLOYMENT_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// CoreMemory via PulseProofBridge (only import)
// ---------------------------------------------------------------------------

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const CoreMemory = PulseProofBridge.coreMemory;

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
  constructor({ instanceId, cosmos, region = { regionId: "r:global", route: null }, actions = [] }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos; // { universeId, timelineId, branchId }
    this.region = region; // { regionId, route? }
    this.actions = actions;
    this.schemaVersion = DEPLOYMENT_SCHEMA_VERSION;
    this.engineVersion = DEPLOYMENT_ENGINE_VERSION;
  }
}

/**
 * DeploymentSummary
 */
export class DeploymentSummary {
  constructor({ instanceId, cosmos, region, totalActions, actionTypes }) {
    this.instanceId = instanceId;
    this.cosmos = cosmos;
    this.region = region;
    this.totalActions = totalActions;
    this.actionTypes = actionTypes;
    this.schemaVersion = DEPLOYMENT_SCHEMA_VERSION;
    this.engineVersion = DEPLOYMENT_ENGINE_VERSION;
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

function normalizeRegionRoute(cosmosRoute = {}, regionRoute = null, currentState = null) {
  const route = regionRoute || cosmosRoute.regionRoute || null;

  let regionId = "r:global";
  if (route && Array.isArray(route.path) && route.path.length > 0) {
    regionId = route.path[route.path.length - 1];
  } else if (currentState && currentState.currentRegionId) {
    regionId = currentState.currentRegionId;
  }

  return {
    regionId,
    route: route ? route.path || null : null
  };
}

// ---------------------------------------------------------------------------
// Core Logic (v16 Multiverse + Region)
// ---------------------------------------------------------------------------

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
 *       regionRoute?
 *     }
 *   - regionRoute (optional override)
 *   - continuanceDecision
 *
 * Output:
 *   - DeploymentPlan (multiverse + region aware)
 */
export function buildDeploymentPlan({
  currentState,
  deltaPatch,
  cosmosRoute,
  regionRoute,
  continuanceDecision
}) {
  const cosmos = normalizeCosmosContext(cosmosRoute);
  const region = normalizeRegionRoute(cosmosRoute, regionRoute, currentState);
  const actions = [];
  const instanceId = currentState.instanceId;

  // 1. Universe movement (if required)
  if (
    continuanceDecision.shouldMoveUniverse &&
    cosmosRoute.universeId !== currentState.universeId
  ) {
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
  if (
    continuanceDecision.shouldMoveTimeline &&
    cosmosRoute.timelineId !== currentState.timelineId
  ) {
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
  if (
    continuanceDecision.shouldMoveBranch &&
    cosmosRoute.branchId !== currentState.branchId
  ) {
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
  if (
    continuanceDecision.shouldMoveRegion &&
    (cosmosRoute.regionRoute?.path?.length > 1 ||
      regionRoute?.path?.length > 1)
  ) {
    const route = regionRoute || cosmosRoute.regionRoute;
    const targetRegion = route.path[route.path.length - 1];

    actions.push(
      new DeploymentAction({
        type: DeploymentActionType.MOVE_REGION,
        instanceId,
        regionId: targetRegion,
        meta: { route: route.path }
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
  if (deltaPatch && deltaPatch.patch && Object.keys(deltaPatch.patch).length > 0) {
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
        regionId: continuanceDecision.spawnRegion || region.regionId || null,
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

  return new DeploymentPlan({ instanceId, cosmos, region, actions });
}

/**
 * summarizeDeploymentPlan
 */
export function summarizeDeploymentPlan(plan) {
  const actionTypes = plan.actions.map((a) => a.type);

  return new DeploymentSummary({
    instanceId: plan.instanceId,
    cosmos: plan.cosmos,
    region: plan.region,
    totalActions: plan.actions.length,
    actionTypes
  });
}

// ---------------------------------------------------------------------------
// CoreMemory + Multiverse Deployment Caching (v16)
// ---------------------------------------------------------------------------

const ROUTE = "deployment-physics-v16";

const KEY_PLAN_PREFIX    = "plan:";
const KEY_SUMMARY_PREFIX = "summary:";

const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_INSTANCES    = "hot-instances";
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

function planKey(instanceId, cosmos) {
  return cosmosKey(KEY_PLAN_PREFIX, instanceId, cosmos);
}

function summaryKey(instanceId, cosmos) {
  return cosmosKey(KEY_SUMMARY_PREFIX, instanceId, cosmos);
}

function trackDeploymentHot(instanceId, cosmos, region, actions = []) {
  if (!instanceId) return;

  const actionTypes = {};
  for (const action of actions) {
    const t = action.type;
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

// Wrapped builders with CoreMemory

export function buildDeploymentPlanWithMemory(args) {
  CoreMemory.prewarm();

  const plan = buildDeploymentPlan(args);
  const summary = summarizeDeploymentPlan(plan);

  const cosmos = normalizeCosmosContext(plan.cosmos || {});
  const kPlan = planKey(plan.instanceId, cosmos);
  const kSummary = summaryKey(plan.instanceId, cosmos);

  CoreMemory.set(ROUTE, kPlan, plan);
  CoreMemory.set(ROUTE, kSummary, summary);

  trackDeploymentHot(plan.instanceId, cosmos, plan.region, plan.actions);

  return { plan, summary };
}

// -------------------------
// CoreMemory Accessors
// -------------------------

export function getLastDeploymentPlan(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, planKey(instanceId, cosmos));
}

export function getLastDeploymentSummary(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, summaryKey(instanceId, cosmos));
}

export function getDeploymentMemoryState() {
  CoreMemory.prewarm();

  return {
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS)
  };
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
  summarizeDeploymentPlan,

  buildDeploymentPlanWithMemory,
  getLastDeploymentPlan,
  getLastDeploymentSummary,
  getDeploymentMemoryState,

  CoreMemory,
  ROUTE,
  DEPLOYMENT_ENGINE_VERSION,
  DEPLOYMENT_SCHEMA_VERSION
};

export default DeploymentPhysicsAPI;
