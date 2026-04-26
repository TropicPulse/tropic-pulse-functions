/**
 * META {
 *   organ: "PulseContinuance",
 *   root: "PULSE-FINALITY",
 *   mode: "substrate",
 *   target: "predictive-continuance",
 *   version: "v11-EVO",
 *
 *   role: "Predictive survival engine. Uses environment + grid signals to move BEFORE failure.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     schemaAware: true,
 *     noRandomness: true
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
 *     "LineageEngine"
 *   ],
 *
 *   notes: [
 *     "Continuance is about moving BEFORE failure, not recovering AFTER.",
 *     "Uses symbolic risk scoring, no randomness.",
 *     "Does not talk to real hosts; only reasons over descriptors + signals.",
 *     "Output is a plan, not an action."
 *   ]
 * }
 */

/**
 * PulseContinuance-v11-Evo.js
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
 */

// -------------------------
// Types
// -------------------------

/**
 * RegionSignal
 *
 * regionId: string
 * instability: number (0.0 - 1.0)  // 0 = stable, 1 = critical
 * trend: "rising" | "falling" | "stable"
 * meta: free-form metadata
 */
export class RegionSignal {
  constructor({ regionId, instability = 0, trend = "stable", meta = {} }) {
    this.regionId = regionId;
    this.instability = clamp01(instability);
    this.trend = trend;
    this.meta = meta;
  }
}

/**
 * GridSignal
 *
 * sourceId: string (tower, grid segment, provider, etc.)
 * instability: number (0.0 - 1.0)
 * trend: "rising" | "falling" | "stable"
 * affectedRegions: string[]
 * meta: free-form metadata
 */
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

/**
 * CurrentPlacementPlan
 *
 * selectedHosts: string[]
 * eligibleHosts: string[]
 * minInstances: number
 * schemaVersion: number
 */
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

/**
 * PreemptiveMovePlan
 *
 * moveFrom: string[]        // hosts to move away from
 * moveTo: string[]          // target hosts
 * reason: string
 * riskScore: number         // 0.0 - 1.0
 */
export class PreemptiveMovePlan {
  constructor({ moveFrom = [], moveTo = [], reason = "", riskScore = 0 }) {
    this.moveFrom = moveFrom;
    this.moveTo = moveTo;
    this.reason = reason;
    this.riskScore = clamp01(riskScore);
  }
}

/**
 * ReplicationPlan
 *
 * replicateTo: string[]     // hosts to add instances on
 * reason: string
 * riskScore: number
 */
export class ReplicationPlan {
  constructor({ replicateTo = [], reason = "", riskScore = 0 }) {
    this.replicateTo = replicateTo;
    this.reason = reason;
    this.riskScore = clamp01(riskScore);
  }
}

/**
 * ContinuanceRiskReport
 *
 * perRegion: { [regionId: string]: number }   // 0.0 - 1.0
 * globalRisk: number                          // 0.0 - 1.0
 * notes: string[]
 */
export class ContinuanceRiskReport {
  constructor({ perRegion = {}, globalRisk = 0, notes = [] }) {
    this.perRegion = perRegion;
    this.globalRisk = clamp01(globalRisk);
    this.notes = notes;
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

/**
 * computeRegionRisk
 *
 * Combines RegionSignal + GridSignal into a per-region risk score.
 * Deterministic, symbolic, no randomness.
 */
export function computeRegionRisk(regionSignals = [], gridSignals = []) {
  const risk = {};

  // Base from region signals
  for (const rs of regionSignals) {
    risk[rs.regionId] = clamp01(rs.instability);
  }

  // Add contributions from grid signals
  for (const gs of gridSignals) {
    const weight =
      gs.trend === "rising" ? 0.5 :
      gs.trend === "stable" ? 0.3 :
      0.2; // falling

    for (const regionId of gs.affectedRegions || []) {
      const base = risk[regionId] || 0;
      const added = clamp01(gs.instability * weight);
      risk[regionId] = clamp01(base + added - base * added); // union-like combine
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

/**
 * buildContinuanceRiskReport
 *
 * Input:
 *   - regionSignals: RegionSignal[]
 *   - gridSignals: GridSignal[]
 *
 * Output:
 *   - ContinuanceRiskReport
 */
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

  return new ContinuanceRiskReport({ perRegion, globalRisk, notes });
}

/**
 * buildPreemptiveMovePlan
 *
 * Input:
 *   - hosts: HostDescriptor[]
 *   - placement: CurrentPlacementPlan
 *   - perRegionRisk: { [regionId: string]: number }
 *
 * Output:
 *   - PreemptiveMovePlan
 *
 * Logic:
 *   - Identify selected hosts in high-risk regions.
 *   - Identify eligible hosts in lower-risk regions.
 *   - Propose moving instances away from high-risk → lower-risk.
 */
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

  // Eligible targets: any host in eligibleHosts with lower region risk
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
    moveFrom.length === 0 ? 0 :
    Math.max(...moveFrom.map((name) => {
      const h = byName[name];
      return h ? (perRegionRisk[h.region] || 0) : 0;
    }));

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

/**
 * buildReplicationPlan
 *
 * Input:
 *   - hosts: HostDescriptor[]
 *   - placement: CurrentPlacementPlan
 *   - perRegionRisk: { [regionId: string]: number }
 *   - minInstances: number
 *
 * Output:
 *   - ReplicationPlan
 *
 * Logic:
 *   - If global risk is moderate but not extreme, propose adding instances
 *     in the lowest-risk eligible regions until minInstances is satisfied.
 */
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

  // Sort by ascending risk
  eligible.sort((a, b) => a.risk - b.risk);

  const needed = minInstances - currentCount;
  const replicateTo = eligible.slice(0, needed).map((e) => e.name);

  const riskScore =
    replicateTo.length === 0
      ? 0
      : Math.max(...replicateTo.map((name) => {
          const h = byName[name];
          return h ? (perRegionRisk[h.region] || 0) : 0;
        }));

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
