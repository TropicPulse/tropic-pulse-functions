/**
 * DeploymentPhysics-CosmosMultiverse-v13.js
 * PULSE-WORLD / PULSE-DEPLOYMENT + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware deployment physics membrane.
 *
 *   Wraps DeploymentPhysics with PulseCoreMemory hot caching:
 *     - Caches last deployment plan per universe/timeline/branch
 *     - Caches last deployment summary per universe/timeline/branch
 *     - Tracks hot action types across universes
 *     - Tracks region drift + host drift across timelines
 *     - Tracks hot instances (loop-theory)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  DeploymentActionType,
  DeploymentAction,
  DeploymentPlan,
  DeploymentSummary,
  buildDeploymentPlan,
  summarizeDeploymentPlan
} = DeploymentPhysicsAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "deployment-cosmos-multiverse";

// Key prefixes
const KEY_PLAN_PREFIX = "deploy-plan:";
const KEY_SUMMARY_PREFIX = "deploy-summary:";

// Hot maps
const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_REGION_MOVES = "hot-region-moves";
const KEY_HOT_HOST_MOVES = "hot-host-moves";
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

function planKey(instanceId, cosmos) {
  return cosmosKey(KEY_PLAN_PREFIX, instanceId, cosmos);
}

function summaryKey(instanceId, cosmos) {
  return cosmosKey(KEY_SUMMARY_PREFIX, instanceId, cosmos);
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

function trackActionTypes(actions, cosmos) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const a of actions || []) {
    const key = `${cosmos.universeId}|${cosmos.timelineId}|${a.type}`;
    hot[key] = (hot[key] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

function trackRegionHostMoves(actions, cosmos) {
  const regionMoves = CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES) || {};
  const hostMoves = CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES) || {};

  for (const a of actions || []) {
    if (a.type === DeploymentActionType.MOVE_REGION && a.regionId) {
      const key = `${cosmos.universeId}|${cosmos.timelineId}|${a.regionId}`;
      regionMoves[key] = (regionMoves[key] || 0) + 1;
    }
    if (a.type === DeploymentActionType.MOVE_HOST && a.hostName) {
      const key = `${cosmos.universeId}|${cosmos.timelineId}|${a.hostName}`;
      hostMoves[key] = (hostMoves[key] || 0) + 1;
    }
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGION_MOVES, regionMoves);
  CoreMemory.set(ROUTE, KEY_HOT_HOST_MOVES, hostMoves);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

export function buildDeploymentPlanWithMemory(args, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const plan = buildDeploymentPlan(args);
  const instanceId = plan.instanceId;

  CoreMemory.set(ROUTE, planKey(instanceId, cosmos), {
    ...plan,
    cosmos
  });

  trackInstance(instanceId, cosmos);
  trackActionTypes(plan.actions, cosmos);
  trackRegionHostMoves(plan.actions, cosmos);

  return plan;
}

export function summarizeDeploymentPlanWithMemory(plan, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const summary = summarizeDeploymentPlan(plan);
  const instanceId = plan.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId, cosmos), {
    ...summary,
    cosmos
  });

  trackInstance(instanceId, cosmos);

  return summary;
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
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
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotRegionMoves: CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES),
    hotHostMoves: CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// -------------------------
// Cosmic State Helpers
// -------------------------

export function getUniverseDeploymentHeatmap(universeId) {
  CoreMemory.prewarm();

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const hotActionTypes = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  const hotRegionMoves = CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES) || {};
  const hotHostMoves = CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES) || {};

  const prefix = `${universeId}|`;

  const instanceHits = {};
  const actionHits = {};
  const regionHits = {};
  const hostHits = {};

  for (const key in hotInstances) if (key.startsWith(prefix)) instanceHits[key] = hotInstances[key];
  for (const key in hotActionTypes) if (key.startsWith(prefix)) actionHits[key] = hotActionTypes[key];
  for (const key in hotRegionMoves) if (key.startsWith(prefix)) regionHits[key] = hotRegionMoves[key];
  for (const key in hotHostMoves) if (key.startsWith(prefix)) hostHits[key] = hotHostMoves[key];

  return {
    universeId,
    instanceHits,
    actionHits,
    regionHits,
    hostHits
  };
}

export function getTimelineDeploymentHeatmap(universeId, timelineId) {
  CoreMemory.prewarm();

  const prefix = `${universeId}|${timelineId}|`;

  const hotInstances = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  const hotActionTypes = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  const hotRegionMoves = CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES) || {};
  const hotHostMoves = CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES) || {};

  const instanceHits = {};
  const actionHits = {};
  const regionHits = {};
  const hostHits = {};

  for (const key in hotInstances) if (key.startsWith(prefix)) instanceHits[key] = hotInstances[key];
  for (const key in hotActionTypes) if (key.startsWith(prefix)) actionHits[key] = hotActionTypes[key];
  for (const key in hotRegionMoves) if (key.startsWith(prefix)) regionHits[key] = hotRegionMoves[key];
  for (const key in hotHostMoves) if (key.startsWith(prefix)) hostHits[key] = hotHostMoves[key];

  return {
    universeId,
    timelineId,
    instanceHits,
    actionHits,
    regionHits,
    hostHits
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const DeploymentPhysicsCosmosMultiverse = {
  DeploymentActionType,
  DeploymentAction,
  DeploymentPlan,
  DeploymentSummary,

  buildDeploymentPlanWithMemory,
  summarizeDeploymentPlanWithMemory,

  getLastDeploymentPlan,
  getLastDeploymentSummary,
  getDeploymentMemoryState,

  getUniverseDeploymentHeatmap,
  getTimelineDeploymentHeatmap,

  CoreMemory
};

export default DeploymentPhysicsCosmosMultiverse;
