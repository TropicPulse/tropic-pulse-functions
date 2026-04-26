/**
 * PulseOmniHosting-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-FINALITY / OMNIHOSTING + CORE MEMORY
 *
 * ROLE:
 *   Wraps PulseOmniHosting physics with PulseCoreMemory hot caching.
 *   - Stores last capability matrix
 *   - Stores last placement plan
 *   - Stores last failover plan
 *   - Stores host eligibility + trends
 *   - Provides instant recall for PulseRuntime + Continuance + Regioning
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import PulseOmniHostingAPI from "./PulseOmniHosting-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "omnihosting-global";

const KEY_LAST_MATRIX = "last-capability-matrix";
const KEY_LAST_PLACEMENT = "last-placement-plan";
const KEY_LAST_FAILOVER = "last-failover-plan";
const KEY_LAST_ELIGIBLE = "last-eligible-hosts";
const KEY_HOST_TRENDS = "host-trend-history";

// -------------------------
// Wrapped API
// -------------------------

/**
 * buildCapabilityMatrixWithMemory
 *
 * Wraps buildCapabilityMatrix
 * Adds:
 *   - hot caching
 *   - trend tracking
 */
export function buildCapabilityMatrixWithMemory(hosts) {
  CoreMemory.prewarm();

  const matrix = PulseOmniHostingAPI.buildCapabilityMatrix(hosts);

  CoreMemory.set(ROUTE, KEY_LAST_MATRIX, matrix);

  // Track host trends (simple hit counter for now)
  const trends = CoreMemory.get(ROUTE, KEY_HOST_TRENDS) || {};
  for (const h of hosts) {
    trends[h.name] = (trends[h.name] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOST_TRENDS, trends);

  return matrix;
}

/**
 * buildPlacementPlanWithMemory
 *
 * Wraps buildPlacementPlan
 * Adds:
 *   - hot caching
 *   - eligibility caching
 */
export function buildPlacementPlanWithMemory(hosts, pulseSchema, minInstances) {
  CoreMemory.prewarm();

  const placement = PulseOmniHostingAPI.buildPlacementPlan(
    hosts,
    pulseSchema,
    minInstances
  );

  CoreMemory.set(ROUTE, KEY_LAST_PLACEMENT, placement);
  CoreMemory.set(ROUTE, KEY_LAST_ELIGIBLE, placement.eligibleHosts);

  return placement;
}

/**
 * buildFailoverPlanWithMemory
 *
 * Wraps buildFailoverPlan
 * Adds:
 *   - hot caching
 *   - trend memory for failed hosts
 */
export function buildFailoverPlanWithMemory(hosts, pulseSchema, failedHostName) {
  CoreMemory.prewarm();

  const failover = PulseOmniHostingAPI.buildFailoverPlan(
    hosts,
    pulseSchema,
    failedHostName
  );

  CoreMemory.set(ROUTE, KEY_LAST_FAILOVER, failover);

  // Mark failed host in trend history
  const trends = CoreMemory.get(ROUTE, KEY_HOST_TRENDS) || {};
  trends[failedHostName] = (trends[failedHostName] || 0) - 5; // negative trend
  CoreMemory.set(ROUTE, KEY_HOST_TRENDS, trends);

  return failover;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastOmniHostingState() {
  CoreMemory.prewarm();

  return {
    capabilityMatrix: CoreMemory.get(ROUTE, KEY_LAST_MATRIX),
    placementPlan: CoreMemory.get(ROUTE, KEY_LAST_PLACEMENT),
    failoverPlan: CoreMemory.get(ROUTE, KEY_LAST_FAILOVER),
    eligibleHosts: CoreMemory.get(ROUTE, KEY_LAST_ELIGIBLE),
    hostTrends: CoreMemory.get(ROUTE, KEY_HOST_TRENDS)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const PulseOmniHostingCoreMemory = {
  buildCapabilityMatrixWithMemory,
  buildPlacementPlanWithMemory,
  buildFailoverPlanWithMemory,
  getLastOmniHostingState,
  CoreMemory
};

export default PulseOmniHostingCoreMemory;
