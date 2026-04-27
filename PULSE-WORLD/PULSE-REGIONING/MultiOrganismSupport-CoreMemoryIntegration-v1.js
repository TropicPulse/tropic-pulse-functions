/**
 * MultiOrganismSupport-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / MULTI-ORGANISM + CORE MEMORY
 *
 * ROLE:
 *   Wraps MultiOrganismSupport with PulseCoreMemory hot caching.
 *   - Caches per-instance plan bundles
 *   - Caches global MultiOrganismPlan + Summary
 *   - Tracks hot instances and hot action types
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import MultiOrganismSupportAPI from "./MultiOrganismSupport-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "multi-organism-global";

const KEY_INSTANCE_PLAN_PREFIX = "instance-plan:";
const KEY_INSTANCE_DELTA_PREFIX = "instance-delta:";
const KEY_INSTANCE_DEPLOY_PREFIX = "instance-deploy:";

const KEY_GLOBAL_PLAN = "global-multi-plan";
const KEY_GLOBAL_SUMMARY = "global-multi-summary";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";

// -------------------------
// Internal helpers
// -------------------------

function instancePlanKey(instanceId) {
  return `${KEY_INSTANCE_PLAN_PREFIX}${instanceId}`;
}

function instanceDeltaKey(instanceId) {
  return `${KEY_INSTANCE_DELTA_PREFIX}${instanceId}`;
}

function instanceDeployKey(instanceId) {
  return `${KEY_INSTANCE_DEPLOY_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackActionTypes(plan) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const action of plan.actions || []) {
    hot[action.type] = (hot[action.type] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

// -------------------------
// Wrapped API
// -------------------------

export function buildInstancePlanBundleWithMemory(instanceContext) {
  CoreMemory.prewarm();

  const bundle = buildInstancePlanBundle(instanceContext);
  const instanceId = instanceContext.instanceId;

  CoreMemory.set(ROUTE, instancePlanKey(instanceId), bundle);
  CoreMemory.set(ROUTE, instanceDeltaKey(instanceId), {
    deltaRecord: bundle.deltaRecord,
    deltaSummary: bundle.deltaSummary,
    deltaPatch: bundle.deltaPatch
  });
  CoreMemory.set(ROUTE, instanceDeployKey(instanceId), {
    deploymentPlan: bundle.deploymentPlan,
    deploymentSummary: bundle.deploymentSummary
  });

  trackInstance(instanceId);
  trackActionTypes(bundle.deploymentPlan);

  return bundle;
}

export function buildMultiOrganismPlanWithMemory(instanceContexts) {
  CoreMemory.prewarm();

  const bundles = instanceContexts.map((ctx) =>
    buildInstancePlanBundleWithMemory(ctx)
  );

  const multiPlan = new MultiOrganismPlan({ instances: bundles });

  CoreMemory.set(ROUTE, KEY_GLOBAL_PLAN, multiPlan);

  return multiPlan;
}

export function summarizeMultiOrganismPlanWithMemory(multiPlan) {
  CoreMemory.prewarm();

  const summary = summarizeMultiOrganismPlan(multiPlan);

  CoreMemory.set(ROUTE, KEY_GLOBAL_SUMMARY, summary);

  return summary;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastInstancePlan(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, instancePlanKey(instanceId));
}

export function getLastInstanceDelta(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, instanceDeltaKey(instanceId));
}

export function getLastInstanceDeployment(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, instanceDeployKey(instanceId));
}

export function getLastMultiOrganismState() {
  CoreMemory.prewarm();

  return {
    globalPlan: CoreMemory.get(ROUTE, KEY_GLOBAL_PLAN),
    globalSummary: CoreMemory.get(ROUTE, KEY_GLOBAL_SUMMARY),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const MultiOrganismSupportCoreMemory = {
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

export default MultiOrganismSupportCoreMemory;
