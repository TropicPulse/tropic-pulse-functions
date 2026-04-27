/**
 * PulseRuntime-v2-Evo.js
 * PULSE-X / RUNTIME / v2
 *
 * ROLE:
 *   v2 Runtime introduces:
 *     - runtime-level hot-state tracking
 *     - binary metrics (frame sizes, counts)
 *     - tick sequencing
 *     - region/host heatmaps
 *     - instance heatmaps
 *     - deterministic runtime clock (logical)
 *     - world-adjustment hooks
 *     - unified introspection API
 *
 *   Symbolic-first.
 *   Binary-backed.
 *   Memory-spined.
 *   Deterministic.
 */

// -------------------------
// Imports
// -------------------------

import * as PulseWorldRegioning from "../PULSE-REGIONING/index.js";
import * as PulseWorldFinality from "../PULSE-FINALITY/index.js";

import MultiOrganismSupportAPI from "../PULSE-ORGANS/MultiOrganismSupport-v11-Evo.js";
import ExecutionPhysicsAPI from "../PULSE-ORGANS/ExecutionPhysics-v11-Evo.js";

import { createPulseCoreMemory } from "../PULSECORE/PulseCoreMemory.js";

import BinarySubstrateV2 from "./BinarySubstrate-v2.js";

const {
  buildMultiOrganismPlan,
  summarizeMultiOrganismPlan
} = MultiOrganismSupportAPI;

const {
  executeMultiOrganismPlan
} = ExecutionPhysicsAPI;

const {
  packMultiOrganismPlan,
  packExecutionResult
} = BinarySubstrateV2;

// -------------------------
// Runtime Memory
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "runtime-v2";

const KEY_TICK = "tick-counter";
const KEY_LAST_POLICY = "policy";
const KEY_LAST_PLAN = "plan";
const KEY_LAST_PLAN_SUMMARY = "plan-summary";
const KEY_LAST_EXEC = "exec-results";
const KEY_LAST_FRAMES = "binary-frames";

const KEY_HOT_INSTANCES = "hot-instances";
const KEY_HOT_REGIONS = "hot-regions";
const KEY_HOT_HOSTS = "hot-hosts";
const KEY_HOT_FRAME_SIZES = "hot-frame-sizes";

// -------------------------
// Helpers
// -------------------------

function bumpTick() {
  const t = CoreMemory.get(ROUTE, KEY_TICK) || 0;
  const next = t + 1;
  CoreMemory.set(ROUTE, KEY_TICK, next);
  return next;
}

function trackInstance(id) {
  const hot = CoreMemory.get(ROUTE, KEY_HOT_INSTANCES) || {};
  hot[id] = (hot[id] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_INSTANCES, hot);
}

function trackRegionHost(state) {
  if (!state) return;

  const regions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hosts = CoreMemory.get(ROUTE, KEY_HOT_HOSTS) || {};

  if (state.currentRegionId) {
    regions[state.currentRegionId] = (regions[state.currentRegionId] || 0) + 1;
  }
  if (state.currentHostName) {
    hosts[state.currentHostName] = (hosts[state.currentHostName] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, regions);
  CoreMemory.set(ROUTE, KEY_HOT_HOSTS, hosts);
}

function trackFrameSize(uint8) {
  const size = uint8?.length || 0;
  const hot = CoreMemory.get(ROUTE, KEY_HOT_FRAME_SIZES) || {};
  hot[size] = (hot[size] || 0) + 1;
  CoreMemory.set(ROUTE, KEY_HOT_FRAME_SIZES, hot);
}

// -------------------------
// Types
// -------------------------

export class BinaryFramesBundle {
  constructor({ multiPlanFrame, executionFramesById }) {
    this.multiPlanFrame = multiPlanFrame;
    this.executionFramesById = executionFramesById;
  }
}

export class PulseRuntimeTickResult {
  constructor({
    tick,
    multiPlan,
    multiPlanSummary,
    executionResultsById,
    binaryFrames
  }) {
    this.tick = tick;
    this.multiPlan = multiPlan;
    this.multiPlanSummary = multiPlanSummary;
    this.executionResultsById = executionResultsById;
    this.binaryFrames = binaryFrames;
  }
}

// -------------------------
// Runtime Tick (v2)
// -------------------------

export function runPulseTickV2({
  instanceContexts,
  currentStatesById,
  globalContinuancePolicy = {}
}) {
  CoreMemory.prewarm();

  const tick = bumpTick();

  CoreMemory.set(ROUTE, KEY_LAST_POLICY, globalContinuancePolicy);

  // World-level adjustment hook
  const adjustedContexts =
    PulseWorldRegioning.adjustInstanceContextsForWorld?.(
      instanceContexts,
      globalContinuancePolicy
    ) || instanceContexts;

  // Build plan
  const multiPlan = buildMultiOrganismPlan(adjustedContexts);
  const multiPlanSummary = summarizeMultiOrganismPlan(multiPlan);

  CoreMemory.set(ROUTE, KEY_LAST_PLAN, multiPlan);
  CoreMemory.set(ROUTE, KEY_LAST_PLAN_SUMMARY, multiPlanSummary);

  // Execute
  const executionResultsById = executeMultiOrganismPlan(
    multiPlan,
    currentStatesById
  );

  CoreMemory.set(ROUTE, KEY_LAST_EXEC, executionResultsById);

  // Track instance + region/host heatmaps
  for (const [id, state] of Object.entries(currentStatesById)) {
    trackInstance(id);
    trackRegionHost(state);
  }

  // Binary pack
  const multiPlanFrame = packMultiOrganismPlan(multiPlan);
  trackFrameSize(multiPlanFrame);

  const executionFramesById = {};
  for (const [id, exec] of Object.entries(executionResultsById)) {
    const frame = packExecutionResult(exec);
    executionFramesById[id] = frame;
    trackFrameSize(frame);
  }

  const binaryFrames = new BinaryFramesBundle({
    multiPlanFrame,
    executionFramesById
  });

  CoreMemory.set(ROUTE, KEY_LAST_FRAMES, binaryFrames);

  // Finality hook
  PulseWorldFinality.onRuntimeTickCompleted?.({
    tick,
    multiPlan,
    multiPlanSummary,
    executionResultsById
  });

  return new PulseRuntimeTickResult({
    tick,
    multiPlan,
    multiPlanSummary,
    executionResultsById,
    binaryFrames
  });
}

// -------------------------
// Introspection API
// -------------------------

export function getRuntimeStateV2() {
  CoreMemory.prewarm();

  return {
    tick: CoreMemory.get(ROUTE, KEY_TICK),
    policy: CoreMemory.get(ROUTE, KEY_LAST_POLICY),
    plan: CoreMemory.get(ROUTE, KEY_LAST_PLAN),
    planSummary: CoreMemory.get(ROUTE, KEY_LAST_PLAN_SUMMARY),
    execResults: CoreMemory.get(ROUTE, KEY_LAST_EXEC),
    binaryFrames: CoreMemory.get(ROUTE, KEY_LAST_FRAMES),
    hotInstances: CoreMemory.get(ROUTE, KEY_HOT_INSTANCES),
    hotRegions: CoreMemory.get(ROUTE, KEY_HOT_REGIONS),
    hotHosts: CoreMemory.get(ROUTE, KEY_HOT_HOSTS),
    hotFrameSizes: CoreMemory.get(ROUTE, KEY_HOT_FRAME_SIZES)
  };
}

// -------------------------
// Export
// -------------------------

const PulseRuntimeV2 = {
  runPulseTickV2,
  getRuntimeStateV2,
  CoreMemory
};

export default PulseRuntimeV2;
