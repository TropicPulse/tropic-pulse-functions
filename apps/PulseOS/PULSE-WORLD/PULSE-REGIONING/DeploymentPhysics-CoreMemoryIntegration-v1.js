/**
 * DeploymentPhysics-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-DEPLOYMENT + CORE MEMORY
 *
 * ROLE:
 *   Wraps DeploymentPhysics with PulseCoreMemory hot caching.
 *   - Caches last deployment plan per instance
 *   - Caches last deployment summary per instance
 *   - Tracks hot action types
 *   - Tracks hot region/host movement patterns
 *   - Tracks hot instances (loop-theory)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import DeploymentPhysicsAPI from "./DeploymentPhysics-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

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

const ROUTE = "deployment-global";

const KEY_PLAN_PREFIX = "deploy-plan:";
const KEY_SUMMARY_PREFIX = "deploy-summary:";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_ACTION_TYPES = "hot-action-types";
const KEY_HOT_REGION_MOVES = "hot-region-moves";
const KEY_HOT_HOST_MOVES = "hot-host-moves";

// -------------------------
// Internal helpers
// -------------------------

function planKey(instanceId) {
  return `${KEY_PLAN_PREFIX}${instanceId}`;
}

function summaryKey(instanceId) {
  return `${KEY_SUMMARY_PREFIX}${instanceId}`;
}

function trackInstance(instanceId) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[instanceId] = (hot[instanceId] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackActionTypes(actions) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES) || {};
  for (const a of actions || []) {
    hot[a.type] = (hot[a.type] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOT_ACTION_TYPES, hot);
}

function trackRegionHostMoves(actions) {
  const regionMoves = CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES) || {};
  const hostMoves = CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES) || {};

  for (const a of actions || []) {
    if (a.type === DeploymentActionType.MOVE_REGION && a.regionId) {
      regionMoves[a.regionId] = (regionMoves[a.regionId] || 0) + 1;
    }
    if (a.type === DeploymentActionType.MOVE_HOST && a.hostName) {
      hostMoves[a.hostName] = (hostMoves[a.hostName] || 0) + 1;
    }
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGION_MOVES, regionMoves);
  CoreMemory.set(ROUTE, KEY_HOT_HOST_MOVES, hostMoves);
}

// -------------------------
// Wrapped API
// -------------------------

export function buildDeploymentPlanWithMemory(args) {
  CoreMemory.prewarm();

  const plan = buildDeploymentPlan(args);
  const instanceId = plan.instanceId;

  CoreMemory.set(ROUTE, planKey(instanceId), plan);
  trackInstance(instanceId);
  trackActionTypes(plan.actions);
  trackRegionHostMoves(plan.actions);

  return plan;
}

export function summarizeDeploymentPlanWithMemory(plan) {
  CoreMemory.prewarm();

  const summary = summarizeDeploymentPlan(plan);
  const instanceId = plan.instanceId;

  CoreMemory.set(ROUTE, summaryKey(instanceId), summary);
  trackInstance(instanceId);

  return summary;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastDeploymentPlan(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, planKey(instanceId));
}

export function getLastDeploymentSummary(instanceId) {
  CoreMemory.prewarm();
  return CoreMemory.get(ROUTE, summaryKey(instanceId));
}

export function getDeploymentMemoryState() {
  CoreMemory.prewarm();

  return {
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotActionTypes: CoreMemory.get(ROUTE, KEY_HOT_ACTION_TYPES),
    hotRegionMoves: CoreMemory.get(ROUTE, KEY_HOT_REGION_MOVES),
    hotHostMoves: CoreMemory.get(ROUTE, KEY_HOT_HOST_MOVES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const DeploymentPhysicsCoreMemory = {
  DeploymentActionType,
  DeploymentAction,
  DeploymentPlan,
  DeploymentSummary,

  buildDeploymentPlanWithMemory,
  summarizeDeploymentPlanWithMemory,

  getLastDeploymentPlan,
  getLastDeploymentSummary,
  getDeploymentMemoryState,

  CoreMemory
};

export default DeploymentPhysicsCoreMemory;
