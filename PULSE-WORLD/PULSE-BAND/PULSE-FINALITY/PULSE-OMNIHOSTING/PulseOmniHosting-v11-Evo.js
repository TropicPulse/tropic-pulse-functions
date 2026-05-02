
/**
 * PulseOmniHosting-v12.3-PRESENCE-EVO+.js
 * PULSE-FINALITY / PULSE-OMNIHOSTING
 *
 * ROLE:
 *   The universal hosting mesh for Pulse OS.
 *   Determines where an organism can run, replicate, or move.
 *   Provides deterministic failover and multi-instance placement.
 *
 * NEVER:
 *   - Never embed host-specific logic.
 *   - Never use randomness.
 *   - Never mutate host descriptors.
 *
 * ALWAYS:
 *   - Always use PulseSchema as truth.
 *   - Always evaluate hosts deterministically.
 *   - Always produce reversible placement plans.
 *   - 12.3+: expose presence/fallback/chunk/cache/prewarm hints as symbolic fields only.
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseOmniHosting",
  version: "v14-IMMORTAL",
  layer: "hosting",
  role: "omni_hosting_engine",
  lineage: "PulseOS-v14",

  evo: {
    hostingEngine: true,
    capabilityMatrix: true,
    placementPlanner: true,
    failoverPlanner: true,
    hostEligibility: true,
    hostTrendModeling: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseContinuance",
      "PulseSchema"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyOmniHosting"
    ]
  }
}
*/

// -------------------------
// META EXPORT
// -------------------------

export const PulseOmniHostingMeta = Object.freeze({
  layer: "PulseOmniHosting",
  role: "OMNIHOSTING_PHYSICS_ORGAN",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseOmniHosting-v12.3-PRESENCE-EVO+",
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    hostAgnostic: true,
    multiInstanceReady: true,
    zeroBackend: true,
    zeroNetwork: true,
    reversiblePlacement: true,
    noRandomness: true,

    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    epoch: "12.3-PRESENCE-EVO+"
  })
});

// -------------------------
// Host Descriptor
// -------------------------

export class HostDescriptor {
  constructor({
    name,
    type,
    region,
    capabilities = {},
    meta = {}
  }) {
    this.name = name;
    this.type = type;
    this.region = region;
    this.capabilities = {
      read: !!capabilities.read,
      write: !!capabilities.write,
      binary: !!capabilities.binary,
      compute: !!capabilities.compute,
      storage: !!capabilities.storage
    };
    this.meta = meta;
  }
}

// -------------------------
// Capability Matrix
// -------------------------

export function buildCapabilityMatrix(hosts = []) {
  const matrix = {};

  for (const host of hosts) {
    matrix[host.name] = {
      type: host.type,
      region: host.region,
      capabilities: { ...host.capabilities }
    };
  }

  return matrix;
}

// -------------------------
// Internal helpers (12.3+ hints)
// -------------------------

function computeFallbackBandLevelForPlacement(eligibleCount, minInstances) {
  if (eligibleCount === 0) return 3;
  if (eligibleCount <= minInstances) return 2;
  if (eligibleCount <= minInstances + 1) return 1;
  return 0;
}

function buildPlacementChunkHint(eligibleCount) {
  const max = 10;
  const ratio = Math.max(0, Math.min(1, eligibleCount / max));
  return { chunkAggression: 1 - ratio };
}

function buildPlacementCacheHint(eligibleCount) {
  let priority = "normal";
  if (eligibleCount <= 1) priority = "critical";
  else if (eligibleCount <= 2) priority = "high";
  else if (eligibleCount <= 4) priority = "medium";

  return {
    keepHot: eligibleCount <= 4,
    priority
  };
}

function buildPlacementPrewarmHint(eligibleCount) {
  if (eligibleCount <= 1) {
    return { shouldPrewarm: true, reason: "scarce_eligible_hosts" };
  }
  if (eligibleCount <= 3) {
    return { shouldPrewarm: true, reason: "limited_eligible_hosts" };
  }
  return { shouldPrewarm: false, reason: "sufficient_eligible_hosts" };
}

function computeFallbackBandLevelForFailover(targetCount) {
  if (targetCount === 0) return 3;
  if (targetCount === 1) return 2;
  if (targetCount === 2) return 1;
  return 0;
}

function buildFailoverChunkHint(targetCount) {
  const max = 10;
  const ratio = Math.max(0, Math.min(1, targetCount / max));
  return { chunkAggression: 1 - ratio };
}

function buildFailoverCacheHint(targetCount) {
  let priority = "normal";
  if (targetCount === 0) priority = "critical";
  else if (targetCount === 1) priority = "high";
  else if (targetCount === 2) priority = "medium";

  return {
    keepHot: targetCount <= 2,
    priority
  };
}

function buildFailoverPrewarmHint(targetCount) {
  if (targetCount === 0) {
    return { shouldPrewarm: true, reason: "no_failover_targets" };
  }
  if (targetCount === 1) {
    return { shouldPrewarm: true, reason: "single_failover_target" };
  }
  return { shouldPrewarm: false, reason: "multiple_failover_targets" };
}

// -------------------------
// Placement Logic
// -------------------------

export function evaluateHostForSchema(host, pulseSchema) {
  const requiresBinary = Object.values(pulseSchema.fields).some(
    (f) => f.type === "binary"
  );

  if (requiresBinary && !host.capabilities.binary) {
    return false;
  }

  const requiresCompute = Object.values(pulseSchema.fields).some(
    (f) => f.type === "object" || f.type === "array"
  );

  if (requiresCompute && !host.capabilities.compute) {
    return false;
  }

  return true;
}

export function buildPlacementPlan(hosts, pulseSchema, minInstances = 1) {
  const eligible = hosts.filter((h) =>
    evaluateHostForSchema(h, pulseSchema)
  );

  eligible.sort((a, b) => a.name.localeCompare(b.name));

  const selected = eligible.slice(0, minInstances);

  const eligibleNames = eligible.map((h) => h.name);
  const selectedNames = selected.map((h) => h.name);

  const fallbackBandLevel = computeFallbackBandLevelForPlacement(
    eligibleNames.length,
    minInstances
  );
  const chunkHint = buildPlacementChunkHint(eligibleNames.length);
  const cacheHint = buildPlacementCacheHint(eligibleNames.length);
  const prewarmHint = buildPlacementPrewarmHint(eligibleNames.length);

  return {
    selectedHosts: selectedNames,
    eligibleHosts: eligibleNames,
    minInstances,
    schemaVersion: pulseSchema.version,

    // 12.3-PRESENCE-EVO+ symbolic hints
    fallbackBandLevel,
    chunkHint,
    cacheHint,
    prewarmHint
  };
}

// -------------------------
// Failover Logic
// -------------------------

export function buildFailoverPlan(hosts, pulseSchema, failedHostName) {
  const remaining = hosts.filter((h) => h.name !== failedHostName);

  const eligible = remaining.filter((h) =>
    evaluateHostForSchema(h, pulseSchema)
  );

  eligible.sort((a, b) => a.name.localeCompare(b.name));

  const failoverTargets = eligible.map((h) => h.name);

  const fallbackBandLevel = computeFallbackBandLevelForFailover(
    failoverTargets.length
  );
  const chunkHint = buildFailoverChunkHint(failoverTargets.length);
  const cacheHint = buildFailoverCacheHint(failoverTargets.length);
  const prewarmHint = buildFailoverPrewarmHint(failoverTargets.length);

  return {
    failedHost: failedHostName,
    failoverTargets,
    schemaVersion: pulseSchema.version,

    // 12.3-PRESENCE-EVO+ symbolic hints
    fallbackBandLevel,
    chunkHint,
    cacheHint,
    prewarmHint
  };
}

// -------------------------
// Exported API
// -------------------------

const PulseOmniHostingAPI = {
  Meta: PulseOmniHostingMeta,
  HostDescriptor,
  buildCapabilityMatrix,
  evaluateHostForSchema,
  buildPlacementPlan,
  buildFailoverPlan
};

export default PulseOmniHostingAPI;
