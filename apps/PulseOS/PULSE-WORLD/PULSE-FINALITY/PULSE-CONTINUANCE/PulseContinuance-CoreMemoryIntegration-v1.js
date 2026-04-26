/**
 * PulseContinuance-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-FINALITY / CONTINUANCE + CORE MEMORY
 *
 * ROLE:
 *   Wraps PulseContinuance physics with PulseCoreMemory hot caching.
 *   - Stores last risk report
 *   - Stores last preemptive move plan
 *   - Stores last replication plan
 *   - Stores last region/grid signals
 *   - Stores last placement plan
 *   - Provides instant recall for PulseRuntime + PulseWorld
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import PulseContinuanceAPI from "./PulseContinuance-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "continuance-global";

const KEY_LAST_REGION_SIGNALS = "last-region-signals";
const KEY_LAST_GRID_SIGNALS = "last-grid-signals";
const KEY_LAST_PLACEMENT = "last-placement-plan";

const KEY_LAST_RISK_REPORT = "last-risk-report";
const KEY_LAST_PREEMPTIVE_PLAN = "last-preemptive-move-plan";
const KEY_LAST_REPLICATION_PLAN = "last-replication-plan";

// -------------------------
// Wrapped API
// -------------------------

/**
 * computeContinuanceWithMemory
 *
 * Wraps:
 *   - buildContinuanceRiskReport
 *   - buildPreemptiveMovePlan
 *   - buildReplicationPlan
 *
 * Adds:
 *   - hot memory caching
 *   - last-cycle recall
 */
export function computeContinuanceWithMemory({
  regionSignals,
  gridSignals,
  hosts,
  placement
}) {
  // Prewarm memory (bulk load if needed)
  CoreMemory.prewarm();

  // Store raw inputs for trend analysis
  CoreMemory.set(ROUTE, KEY_LAST_REGION_SIGNALS, regionSignals);
  CoreMemory.set(ROUTE, KEY_LAST_GRID_SIGNALS, gridSignals);
  CoreMemory.set(ROUTE, KEY_LAST_PLACEMENT, placement);

  // 1. Build risk report
  const riskReport = PulseContinuanceAPI.buildContinuanceRiskReport(
    regionSignals,
    gridSignals
  );

  CoreMemory.set(ROUTE, KEY_LAST_RISK_REPORT, riskReport);

  // 2. Build preemptive move plan
  const preemptivePlan = PulseContinuanceAPI.buildPreemptiveMovePlan(
    hosts,
    placement,
    riskReport.perRegion
  );

  CoreMemory.set(ROUTE, KEY_LAST_PREEMPTIVE_PLAN, preemptivePlan);

  // 3. Build replication plan
  const replicationPlan = PulseContinuanceAPI.buildReplicationPlan(
    hosts,
    placement,
    riskReport.perRegion,
    placement.minInstances
  );

  CoreMemory.set(ROUTE, KEY_LAST_REPLICATION_PLAN, replicationPlan);

  // Return combined symbolic output
  return {
    riskReport,
    preemptivePlan,
    replicationPlan
  };
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastContinuanceState() {
  CoreMemory.prewarm();

  return {
    regionSignals: CoreMemory.get(ROUTE, KEY_LAST_REGION_SIGNALS),
    gridSignals: CoreMemory.get(ROUTE, KEY_LAST_GRID_SIGNALS),
    placement: CoreMemory.get(ROUTE, KEY_LAST_PLACEMENT),

    riskReport: CoreMemory.get(ROUTE, KEY_LAST_RISK_REPORT),
    preemptivePlan: CoreMemory.get(ROUTE, KEY_LAST_PREEMPTIVE_PLAN),
    replicationPlan: CoreMemory.get(ROUTE, KEY_LAST_REPLICATION_PLAN)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const PulseContinuanceCoreMemory = {
  computeContinuanceWithMemory,
  getLastContinuanceState,
  CoreMemory
};

export default PulseContinuanceCoreMemory;
