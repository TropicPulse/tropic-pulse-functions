/**
 * META {
 *   organ: "PulseContinuance",
 *   root: "PULSE-FINALITY",
 *   mode: "substrate",
 *   target: "predictive-continuance",
 *   version: "v12.3-PRESENCE-EVO+",
 *
 *   role: "Predictive survival engine. Uses environment + grid signals to move BEFORE failure.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     schemaAware: true,
 *     noRandomness: true,
 *     presenceAware: true,
 *     advantageAware: true,
 *     fallbackBandAware: true,
 *     chunkAware: true,
 *     cacheAware: true,
 *     prewarmAware: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "PulseSchema",
 *       "HostDescriptor[]",
 *       "RegionSignal[]",
 *       "GridSignal[]",
 *       "CurrentPlacementPlan"
 *     ],
 *     output: [
 *       "PreemptiveMovePlan",
 *       "ReplicationPlan",
 *       "ContinuanceRiskReport"
 *     ]
 *   },
 *
 *   upstream: [
 *     "PulseSchema",
 *     "PulseOmniHosting",
 *     "RegioningPhysics",
 *     "EnvironmentPhysics",
 *     "PulseGridSignals"
 *   ],
 *
 *   downstream: [
 *     "DeploymentPhysics",
 *     "DeltaEngine",
 *     "SnapshotPhysics",
 *     "LineageEngine",
 *     "PulseContinuanceCoreMemory-v12.3-PRESENCE-EVO+"
 *   ],
 *
 *   notes: [
 *     "Continuance is about moving BEFORE failure, not recovering AFTER.",
 *     "Uses symbolic risk scoring, no randomness.",
 *     "Does not talk to real hosts; only reasons over descriptors + signals.",
 *     "Output is a plan, not an action.",
 *     "12.3+ adds presence/fallback/chunk/cache/prewarm hints as pure symbolic fields."
 *   ]
 * }
 */

/**
 * PulseContinuance-v12.3-PRESENCE-EVO+.js
 * PULSE-FINALITY / PULSE-CONTINUANCE
 *
 * ROLE:
 *   Predictive survival physics for Pulse OS.
 *   Reads region/grid/host signals and proposes preemptive movement or replication
 *   BEFORE outages or instability hit the organism.
 *
 * NEVER:
 *   - Never call real hosts or networks.
 *   - Never introduce randomness.
 *   - Never mutate input descriptors or signals.
 *
 * ALWAYS:
 *   - Always operate on symbolic descriptors.
 *   - Always be deterministic for the same inputs.
 *   - Always output explicit, reversible plans.
 *   - 12.3+: attach presence/fallback/chunk/cache/prewarm hints as pure metadata.
 */

// -------------------------
// Types
// -------------------------

export class RegionSignal {
  constructor({ regionId, instability = 0, trend = "stable", meta = {} }) {
    this.regionId = regionId;
    this.instability = clamp01(instability);
    this.trend = trend;
    this.meta = meta;
  }
}

export class GridSignal {
  constructor({
    sourceId,
    instability = 0,
    trend = "stable",
    affectedRegions = [],
    meta = {}
  }) {
    this.sourceId = sourceId;
    this.instability = clamp01(instability);
    this.trend = trend;
    this.affectedRegions = affectedRegions;
    this.meta = meta;
  }
}

export class CurrentPlacementPlan {
  constructor({
    selectedHosts = [],
    eligibleHosts = [],
    minInstances = 1,
    schemaVersion = 1
  }) {
    this.selectedHosts = selectedHosts;
    this.eligibleHosts = eligibleHosts;
    this.minInstances = minInstances;
    this.schemaVersion = schemaVersion;
  }
}

export class PreemptiveMovePlan {
  constructor({ moveFrom = [], moveTo = [], reason = "", riskScore = 0 }) {
    this.moveFrom = moveFrom;
    this.moveTo = moveTo;
    this.reason = reason;
    this.riskScore = clamp01(riskScore);
  }
}

export class ReplicationPlan {
  constructor({ replicateTo = [], reason = "", riskScore = 0 }) {
    this.replicateTo = replicateTo;
    this.reason = reason;
    this.riskScore = clamp01(riskScore);
  }
}

/**
 * ContinuanceRiskReport v12.3-PRESENCE-EVO+
 *
 * perRegion: { [regionId: string]: number }   // 0.0 - 1.0
 * globalRisk: number                          // 0.0 - 1.0
 * notes: string[]
 *
 * 12.3+ additions (pure metadata, no side effects):
 *   fallbackBandLevel: 0–3
 *   prewarmHint: { shouldPrewarm: boolean, reason: string }
 *   cacheHint: { keepHot: boolean, priority: "normal"|"medium"|"high"|"critical" }
 *   chunkHint: { chunkAggression: number (0–1) }
 */
export class ContinuanceRiskReport {
  constructor({
    perRegion = {},
    globalRisk = 0,
    notes = [],
    fallbackBandLevel = 0,
    prewarmHint = null,
    cacheHint = null,
    chunkHint = null
  }) {
    this.perRegion = perRegion;
    this.globalRisk = clamp01(globalRisk);
    this.notes = notes;
    this.fallbackBandLevel = fallbackBandLevel;
    this.prewarmHint = prewarmHint;
    this.cacheHint = cacheHint;
    this.chunkHint = chunkHint;
  }
}

// -------------------------
// Helpers
// -------------------------

function clamp01(v) {
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}

function computeFallbackBandLevel(globalRisk) {
  if (globalRisk >= 0.8) return 3;
  if (globalRisk >= 0.6) return 2;
  if (globalRisk >= 0.4) return 1;
  return 0;
}

function buildPrewarmHint(globalRisk) {
  if (globalRisk >= 0.6) {
    return {
      shouldPrewarm: true,
      reason: "high_global_risk"
    };
  }
  if (globalRisk >= 0.4) {
    return {
      shouldPrewarm: true,
      reason: "moderate_global_risk"
    };
  }
  return {
    shouldPrewarm: false,
    reason: "low_global_risk"
  };
}

function buildCacheHint(globalRisk) {
  let priority = "normal";
  if (globalRisk >= 0.8) priority = "critical";
  else if (globalRisk >= 0.6) priority = "high";
  else if (globalRisk >= 0.4) priority = "medium";

  return {
    keepHot: globalRisk >= 0.4,
    priority
  };
}

function buildChunkHint(globalRisk) {
  // Higher risk → lower aggression (be conservative)
  const chunkAggression = 1 - globalRisk;
  return {
    chunkAggression
  };
}

/**
 * computeRegionRisk
 *
 * Combines RegionSignal + GridSignal into a per-region risk score.
 * Deterministic, symbolic, no randomness.
 */
export function computeRegionRisk(regionSignals = [], gridSignals = []) {
  const risk = {};

  for (const rs of regionSignals) {
    risk[rs.regionId] = clamp01(rs.instability);
  }

  for (const gs of gridSignals) {
    const weight =
      gs.trend === "rising" ? 0.5 :
      gs.trend === "stable" ? 0.3 :
      0.2; // falling

    for (const regionId of gs.affectedRegions || []) {
      const base = risk[regionId] || 0;
      const added = clamp01(gs.instability * weight);
      risk[regionId] = clamp01(base + added - base * added);
    }
  }

  return risk;
}

/**
 * computeGlobalRisk
 *
 * Aggregates per-region risk into a single global risk score.
 */
export function computeGlobalRisk(perRegionRisk = {}) {
  const values = Object.values(perRegionRisk);
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return clamp01(sum / values.length);
}

// -------------------------
// Plan Builders
// -------------------------

export function buildContinuanceRiskReport(regionSignals, gridSignals) {
  const perRegion = computeRegionRisk(regionSignals, gridSignals);
  const globalRisk = computeGlobalRisk(perRegion);

  const notes = [];

  if (globalRisk >= 0.7) {
    notes.push("High global risk detected. Preemptive movement strongly recommended.");
  } else if (globalRisk >= 0.4) {
    notes.push("Moderate global risk detected. Consider replication in safer regions.");
  } else {
    notes.push("Global risk is low. No immediate movement required.");
  }

  const fallbackBandLevel = computeFallbackBandLevel(globalRisk);
  const prewarmHint = buildPrewarmHint(globalRisk);
  const cacheHint = buildCacheHint(globalRisk);
  const chunkHint = buildChunkHint(globalRisk);

  return new ContinuanceRiskReport({
    perRegion,
    globalRisk,
    notes,
    fallbackBandLevel,
    prewarmHint,
    cacheHint,
    chunkHint
  });
}

export function buildPreemptiveMovePlan(hosts, placement, perRegionRisk) {
  const byName = {};
  for (const h of hosts) byName[h.name] = h;

  const moveFrom = [];
  const candidates = [];

  for (const hostName of placement.selectedHosts) {
    const host = byName[hostName];
    if (!host) continue;
    const rRisk = perRegionRisk[host.region] || 0;
    if (rRisk >= 0.6) {
      moveFrom.push(hostName);
    } else {
      candidates.push({ hostName, risk: rRisk });
    }
  }

  const moveToSet = new Set();
  for (const hostName of placement.eligibleHosts) {
    const host = byName[hostName];
    if (!host) continue;
    const rRisk = perRegionRisk[host.region] || 0;
    if (rRisk < 0.6) {
      moveToSet.add(hostName);
    }
  }

  const moveTo = Array.from(moveToSet).sort();

  const riskScore =
    moveFrom.length === 0
      ? 0
      : Math.max(
          ...moveFrom.map((name) => {
            const h = byName[name];
            return h ? (perRegionRisk[h.region] || 0) : 0;
          })
        );

  const reason =
    moveFrom.length === 0
      ? "No high-risk hosts in current placement."
      : "High-risk regions detected for current placement. Proposing preemptive movement.";

  return new PreemptiveMovePlan({
    moveFrom,
    moveTo,
    reason,
    riskScore
  });
}

export function buildReplicationPlan(
  hosts,
  placement,
  perRegionRisk,
  minInstances
) {
  const byName = {};
  for (const h of hosts) byName[h.name] = h;

  const currentCount = placement.selectedHosts.length;
  if (currentCount >= minInstances) {
    return new ReplicationPlan({
      replicateTo: [],
      reason: "Minimum instance count already satisfied.",
      riskScore: 0
    });
  }

  const eligible = placement.eligibleHosts
    .map((name) => {
      const h = byName[name];
      if (!h) return null;
      return {
        name,
        risk: perRegionRisk[h.region] || 0
      };
    })
    .filter(Boolean);

  eligible.sort((a, b) => a.risk - b.risk);

  const needed = minInstances - currentCount;
  const replicateTo = eligible.slice(0, needed).map((e) => e.name);

  const riskScore =
    replicateTo.length === 0
      ? 0
      : Math.max(
          ...replicateTo.map((name) => {
            const h = byName[name];
            return h ? (perRegionRisk[h.region] || 0) : 0;
          })
        );

  const reason =
    replicateTo.length === 0
      ? "No suitable low-risk hosts available for replication."
      : "Replicating to lower-risk hosts to satisfy minimal instance floor.";

  return new ReplicationPlan({
    replicateTo,
    reason,
    riskScore
  });
}

// -------------------------
// Exported API
// -------------------------

const PulseContinuanceAPI = {
  RegionSignal,
  GridSignal,
  CurrentPlacementPlan,
  PreemptiveMovePlan,
  ReplicationPlan,
  ContinuanceRiskReport,
  computeRegionRisk,
  computeGlobalRisk,
  buildContinuanceRiskReport,
  buildPreemptiveMovePlan,
  buildReplicationPlan
};

export default PulseContinuanceAPI;
