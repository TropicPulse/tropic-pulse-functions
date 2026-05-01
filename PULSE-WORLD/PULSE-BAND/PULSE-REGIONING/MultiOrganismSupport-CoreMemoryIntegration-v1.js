/**
 * MultiOrganismSupport-CosmosMultiverse-v13.js
 * PULSE-WORLD / MULTI-ORGANISM + CORE MEMORY + MULTIVERSE COSMOS
 *
 * ROLE:
 *   Multiverse-aware multi-organism coordination membrane.
 *
 *   Wraps MultiOrganismSupport with PulseCoreMemory hot caching:
 *     - Caches per-instance plan bundles per universe/timeline/branch
 *     - Caches global MultiOrganismPlan + Summary per universe/timeline/branch
 *     - Tracks hot instances, hot action types, hot universes, hot timelines
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic, deterministic multiverse caching.
 */

import MultiOrganismSupportAPI from "./MultiOrganismSupport-v11-Evo.js";
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

const {
  InstanceContext,
  InstancePlanBundle,
  MultiOrganismPlan,
  MultiOrganismSummary,
  buildInstancePlanBundle,
  buildMultiOrganismPlan,
  summarizeMultiOrganismPlan
} = MultiOrganismSupportAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "multi-organism-cosmos-multiverse";

const KEY_INSTANCE_PLAN_PREFIX = "instance-plan:";
const KEY_INSTANCE_DELTA_PREFIX = "instance-delta:";
const KEY_INSTANCE_DEPLOY_PREFIX = "instance-deploy:";

const KEY_GLOBAL_PLAN = "global-multi-plan";
const KEY_GLOBAL_SUMMARY = "global-multi-summary";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";
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

function instancePlanKey(instanceId, cosmos) {
  return cosmosKey(KEY_INSTANCE_PLAN_PREFIX, instanceId, cosmos);
}

function instanceDeltaKey(instanceId, cosmos) {
  return cosmosKey(KEY_INSTANCE_DELTA_PREFIX, instanceId, cosmos);
}

function instanceDeployKey(instanceId, cosmos) {
  return cosmosKey(KEY_INSTANCE_DEPLOY_PREFIX, instanceId, cosmos);
}

function globalPlanKey(cosmos) {
  return `${KEY_GLOBAL_PLAN}|${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}`;
}

function globalSummaryKey(cosmos) {
  return `${KEY_GLOBAL_SUMMARY}|${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}`;
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

function trackActionTypes(plan, cosmos) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const action of plan.actions || []) {
    const key = `${cosmos.universeId}|${cosmos.timelineId}|${action.type}`;
    hot[key] = (hot[key] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

// -------------------------
// Wrapped API (Multiverse-aware)
// -------------------------

export function buildInstancePlanBundleWithMemory(instanceContext, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const bundle = buildInstancePlanBundle(instanceContext);
  const instanceId = instanceContext.instanceId;

  CoreMemory.set(ROUTE, instancePlanKey(instanceId, cosmos), bundle);

  CoreMemory.set(ROUTE, instanceDeltaKey(instanceId, cosmos), {
    deltaRecord: bundle.deltaRecord,
    deltaSummary: bundle.deltaSummary,
    deltaPatch: bundle.deltaPatch
  });

  CoreMemory.set(ROUTE, instanceDeployKey(instanceId, cosmos), {
    deploymentPlan: bundle.deploymentPlan,
    deploymentSummary: bundle.deploymentSummary
  });

  trackInstance(instanceId, cosmos);
  trackActionTypes(bundle.deploymentPlan, cosmos);

  return bundle;
}

export function buildMultiOrganismPlanWithMemory(instanceContexts, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);

  const bundles = instanceContexts.map((ctx) =>
    buildInstancePlanBundleWithMemory(ctx, cosmos)
  );

  const multiPlan = new MultiOrganismPlan({
    cosmos,
    instances: bundles
  });

  CoreMemory.set(ROUTE, globalPlanKey(cosmos), multiPlan);

  return multiPlan;
}

export function summarizeMultiOrganismPlanWithMemory(multiPlan, cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);
  const summary = summarizeMultiOrganismPlan(multiPlan);

  CoreMemory.set(ROUTE, globalSummaryKey(cosmos), summary);

  return summary;
}

// -------------------------
// Hot Memory Accessors (Multiverse-aware)
// -------------------------

export function getLastInstancePlan(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, instancePlanKey(instanceId, cosmos));
}

export function getLastInstanceDelta(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, instanceDeltaKey(instanceId, cosmos));
}

export function getLastInstanceDeployment(instanceId, cosmosContext = {}) {
  CoreMemory.prewarm();
  const cosmos = normalizeCosmosContext(cosmosContext);
  return CoreMemory.get(ROUTE, instanceDeployKey(instanceId, cosmos));
}

export function getLastMultiOrganismState(cosmosContext = {}) {
  CoreMemory.prewarm();

  const cosmos = normalizeCosmosContext(cosmosContext);

  return {
    globalPlan: CoreMemory.get(ROUTE, globalPlanKey(cosmos)),
    globalSummary: CoreMemory.get(ROUTE, globalSummaryKey(cosmos)),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotUniverses: CoreMemory.get(ROUTE, KEY_HOT_UNIVERSES),
    hotTimelines: CoreMemory.get(ROUTE, KEY_HOT_TIMELINES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const MultiOrganismSupportCosmosMultiverse = {
  InstanceContext,
  InstancePlanBundle,
  MultiOrganismPlan,
  MultiOrganismSummary,

  buildInstancePlanBundleWithMemory,
  buildMultiOrganismPlanWithMemory,
  summarizeMultiOrganismPlanWithMemory,

  getLastInstancePlan,
  getLastInstanceDelta,
  getLastInstanceDeployment,
  getLastMultiOrganismState,

  CoreMemory
};

export default MultiOrganismSupportCosmosMultiverse;
