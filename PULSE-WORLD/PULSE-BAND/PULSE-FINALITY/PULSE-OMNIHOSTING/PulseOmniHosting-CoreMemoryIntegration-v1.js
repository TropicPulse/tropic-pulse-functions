/**
 * PulseOmniHosting-CoreMemoryIntegration-v12.3-PRESENCE-EVO+.js
 * PULSE-WORLD / PULSE-FINALITY / OMNIHOSTING + CORE MEMORY
 *
 * ROLE:
 *   Wraps PulseOmniHosting physics with PulseCoreMemory hot caching.
 *   - Stores last capability matrix
 *   - Stores last placement plan
 *   - Stores last failover plan
 *   - Stores host eligibility + trends
 *   - Stores last presence + advantage + fallback + chunk/cache/prewarm hints
 *   - Provides instant recall for PulseRuntime + Continuance + Regioning + PulseBand
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import PulseOmniHostingAPI from "./PulseOmniHosting-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSE-CORE/PulseCoreMemory.js";

// -------------------------
// META — v12.3-PRESENCE-EVO+
// -------------------------

export const PulseOmniHostingCoreMemoryMeta = Object.freeze({
  layer: "PulseOmniHostingCoreMemory",
  role: "OMNIHOSTING_BACKBONE_ORGAN",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseOmniHosting-CoreMemory-v12.3-PRESENCE-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    omniHostingAware: true,
    placementAware: true,
    failoverAware: true,
    eligibilityAware: true,
    trendAware: true,

    // 12.3+ advantages
    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,

    hotMemoryOrgan: true,
    symbolicMemory: true,
    zeroMutationOfPhysics: true,
    zeroRandomness: true,
    zeroIO: true,
    epoch: "12.3-PRESENCE-EVO+"
  })
});

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

// 12.3+ presence / advantage / fallback / hints
const KEY_LAST_PRESENCE = "last-presence-field";
const KEY_LAST_ADVANTAGE = "last-advantage-field";
const KEY_LAST_FALLBACK = "last-fallback-band-level";
const KEY_LAST_CHUNK_HINTS = "last-chunk-hints";
const KEY_LAST_CACHE_HINTS = "last-cache-hints";
const KEY_LAST_PREWARM_HINTS = "last-prewarm-hints";

// -------------------------
// Wrapped API
// -------------------------

/**
 * buildCapabilityMatrixWithMemory
 *
 * Wraps buildCapabilityMatrix
 * Adds:
 *   - hot caching
 *   - trend tracking (symbolic)
 */
export function buildCapabilityMatrixWithMemory(hosts, {
  presenceContext = {},
  advantageContext = {},
  fallbackBandLevel = 0,
  chunkHints = {},
  cacheHints = {},
  prewarmHints = {}
} = {}) {
  CoreMemory.prewarm();

  const matrix = PulseOmniHostingAPI.buildCapabilityMatrix(hosts);

  CoreMemory.set(ROUTE, KEY_LAST_MATRIX, matrix);

  // Track host trends (symbolic counters)
  const trends = CoreMemory.get(ROUTE, KEY_HOST_TRENDS) || {};
  for (const h of hosts) {
    trends[h.name] = (trends[h.name] || 0) + 1;
  }
  CoreMemory.set(ROUTE, KEY_HOST_TRENDS, trends);

  // Presence / advantage / fallback / hints snapshot
  CoreMemory.set(ROUTE, KEY_LAST_PRESENCE, presenceContext);
  CoreMemory.set(ROUTE, KEY_LAST_ADVANTAGE, advantageContext);
  CoreMemory.set(ROUTE, KEY_LAST_FALLBACK, fallbackBandLevel);
  CoreMemory.set(ROUTE, KEY_LAST_CHUNK_HINTS, chunkHints);
  CoreMemory.set(ROUTE, KEY_LAST_CACHE_HINTS, cacheHints);
  CoreMemory.set(ROUTE, KEY_LAST_PREWARM_HINTS, prewarmHints);

  return matrix;
}

/**
 * buildPlacementPlanWithMemory
 *
 * Wraps buildPlacementPlan
 * Adds:
 *   - hot caching
 *   - eligibility caching
 *   - presence/advantage/fallback/hints caching
 */
export function buildPlacementPlanWithMemory(
  hosts,
  pulseSchema,
  minInstances,
  {
    presenceContext = {},
    advantageContext = {},
    fallbackBandLevel = 0,
    chunkHints = {},
    cacheHints = {},
    prewarmHints = {}
  } = {}
) {
  CoreMemory.prewarm();

  const placement = PulseOmniHostingAPI.buildPlacementPlan(
    hosts,
    pulseSchema,
    minInstances
  );

  CoreMemory.set(ROUTE, KEY_LAST_PLACEMENT, placement);
  CoreMemory.set(ROUTE, KEY_LAST_ELIGIBLE, placement.eligibleHosts);

  CoreMemory.set(ROUTE, KEY_LAST_PRESENCE, presenceContext);
  CoreMemory.set(ROUTE, KEY_LAST_ADVANTAGE, advantageContext);
  CoreMemory.set(ROUTE, KEY_LAST_FALLBACK, fallbackBandLevel);
  CoreMemory.set(ROUTE, KEY_LAST_CHUNK_HINTS, chunkHints);
  CoreMemory.set(ROUTE, KEY_LAST_CACHE_HINTS, cacheHints);
  CoreMemory.set(ROUTE, KEY_LAST_PREWARM_HINTS, prewarmHints);

  return placement;
}

/**
 * buildFailoverPlanWithMemory
 *
 * Wraps buildFailoverPlan
 * Adds:
 *   - hot caching
 *   - trend memory for failed hosts (symbolic)
 *   - presence/advantage/fallback/hints caching
 */
export function buildFailoverPlanWithMemory(
  hosts,
  pulseSchema,
  failedHostName,
  {
    presenceContext = {},
    advantageContext = {},
    fallbackBandLevel = 0,
    chunkHints = {},
    cacheHints = {},
    prewarmHints = {}
  } = {}
) {
  CoreMemory.prewarm();

  const failover = PulseOmniHostingAPI.buildFailoverPlan(
    hosts,
    pulseSchema,
    failedHostName
  );

  CoreMemory.set(ROUTE, KEY_LAST_FAILOVER, failover);

  const trends = CoreMemory.get(ROUTE, KEY_HOST_TRENDS) || {};
  trends[failedHostName] = (trends[failedHostName] || 0) - 5;
  CoreMemory.set(ROUTE, KEY_HOST_TRENDS, trends);

  CoreMemory.set(ROUTE, KEY_LAST_PRESENCE, presenceContext);
  CoreMemory.set(ROUTE, KEY_LAST_ADVANTAGE, advantageContext);
  CoreMemory.set(ROUTE, KEY_LAST_FALLBACK, fallbackBandLevel);
  CoreMemory.set(ROUTE, KEY_LAST_CHUNK_HINTS, chunkHints);
  CoreMemory.set(ROUTE, KEY_LAST_CACHE_HINTS, cacheHints);
  CoreMemory.set(ROUTE, KEY_LAST_PREWARM_HINTS, prewarmHints);

  return failover;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastOmniHostingState() {
  CoreMemory.prewarm();

  return {
    meta: PulseOmniHostingCoreMemoryMeta,

    capabilityMatrix: CoreMemory.get(ROUTE, KEY_LAST_MATRIX),
    placementPlan: CoreMemory.get(ROUTE, KEY_LAST_PLACEMENT),
    failoverPlan: CoreMemory.get(ROUTE, KEY_LAST_FAILOVER),
    eligibleHosts: CoreMemory.get(ROUTE, KEY_LAST_ELIGIBLE),
    hostTrends: CoreMemory.get(ROUTE, KEY_HOST_TRENDS),

    presenceField: CoreMemory.get(ROUTE, KEY_LAST_PRESENCE),
    advantageField: CoreMemory.get(ROUTE, KEY_LAST_ADVANTAGE),
    fallbackBandLevel: CoreMemory.get(ROUTE, KEY_LAST_FALLBACK),

    chunkHints: CoreMemory.get(ROUTE, KEY_LAST_CHUNK_HINTS),
    cacheHints: CoreMemory.get(ROUTE, KEY_LAST_CACHE_HINTS),
    prewarmHints: CoreMemory.get(ROUTE, KEY_LAST_PREWARM_HINTS)
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
  CoreMemory,
  meta: PulseOmniHostingCoreMemoryMeta
};

export default PulseOmniHostingCoreMemory;
