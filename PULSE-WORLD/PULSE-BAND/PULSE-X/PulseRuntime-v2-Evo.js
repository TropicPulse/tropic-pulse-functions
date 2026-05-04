/**
 * PulseRuntime-v2.4-PRESENCE-TOUCH-IMMORTAL.js
 * PULSE-X / RUNTIME / v2.4
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
 *   v2.4-PRESENCE-TOUCH-IMMORTAL adds:
 *     - Pulse-Touch–aware hot maps (presence/mode/page/chunkProfile/trust)
 *     - explicit Pulse-Touch propagation into binary frames (via BinarySubstrate v2.4)
 *     - upgraded meta/lineage to match Presence/Touch epoch
 *
 *   Symbolic-first.
 *   Binary-backed.
 *   Memory-spined.
 *   Deterministic.
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseRuntime",
  version: "v2.4-PRESENCE-TOUCH-IMMORTAL",
  layer: "runtime",
  role: "organism_execution_conductor",
  lineage: "PulseRuntime-v1 → v11-Evo → v13-PRESENCE-EVO+ → v14-IMMORTAL → v2.4-PRESENCE-TOUCH-IMMORTAL",

  evo: {
    runtimeConductor: true,        // orchestrates organs
    executionCycle: true,          // deterministic tick
    dualBand: true,                // symbolic + binary
    substrateAware: true,          // BinarySubstrate integration
    schedulerAware: true,          // PulseScheduler integration

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    // Presence / Touch / Advantage
    presenceAware: true,
    advantageAware: true,
    pulseTouchAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    meshAware: true,
    expansionAware: true,
    multiInstanceReady: true,
    runtimeAware: true
  },

  contract: {
    always: [
      "BinarySubstrate",
      "PulseScheduler"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "presenceEngine",
      "meshKernel",
      "routerCore"
    ]
  }
}
*/

// -------------------------
// Meta
// -------------------------

export const PulseRuntimeV2Meta = Object.freeze({
  organId: "PulseRuntime-v2.4-PRESENCE-TOUCH-IMMORTAL",
  role: "RUNTIME_SPINE",
  version: "2.4-PRESENCE-TOUCH-IMMORTAL",
  epoch: "v13.5-PRESENCE-TOUCH",
  layer: "RuntimeCore",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true
  }),
  evo: Object.freeze({
    presenceAware: true,
    advantageAware: true,
    dualbandSafe: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    meshAware: true,
    expansionAware: true,
    multiInstanceReady: true,
    runtimeAware: true,
    pulseTouchAware: true
  })
});

// -------------------------
// Imports
// -------------------------

// World / Regioning (this *is* PulseExpansion)
import * as PulseWorldRegioning from "../PULSE-EXPANSION/PulseExpansion-v12.3-Presence.js";

// Delta Engine (CoreMemory integrations)
import * as PulseContinuance from "../PULSE-FINALITY/PULSE-CONTINUANCE/PulseContinuance-CoreMemoryIntegration-v1.js";
import * as PulseOmniHosting from "../PULSE-FINALITY/PULSE-OMNIHOSTING/PulseOmniHosting-CoreMemoryIntegration-v1.js";
import * as PulseSchema from "../PULSE-FINALITY/PULSE-SCHEMA/PulseSchema-CoreMemoryIntegration-v1.js";

// Core Memory
import { createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

// Binary substrate (Touch-aware v2.4)
import BinarySubstrateV2 from "./BinarySubstrate-v2.js";
const { packMultiOrganismPlan, packExecutionResult } = BinarySubstrateV2;

// -------------------------
// Runtime Functions Wiring
// -------------------------

// Build multi-organism plan (Expansion / Regioning layer)
const buildMultiOrganismPlan =
  PulseWorldRegioning.buildMultiOrganismPlan ||
  (() => {
    throw new Error("buildMultiOrganismPlan missing in PulseWorldRegioning");
  });

// Summaries (Schema layer)
const summarizeMultiOrganismPlan =
  PulseSchema.summarizeMultiOrganismPlan ||
  (() => {
    throw new Error("summarizeMultiOrganismPlan missing in PulseSchema");
  });

// Execution (Continuance / OmniHosting layer)
const executeMultiOrganismPlan =
  PulseContinuance.executeMultiOrganismPlan ||
  PulseOmniHosting.executeMultiOrganismPlan ||
  (() => {
    throw new Error(
      "executeMultiOrganismPlan missing in PulseContinuance/PulseOmniHosting"
    );
  });

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

const KEY_HOT_PRESENCE = "hot-presence";
const KEY_HOT_MODES = "hot-modes";
const KEY_HOT_PAGES = "hot-pages";
const KEY_HOT_CHUNK_PROFILES = "hot-chunk-profiles";
const KEY_HOT_TRUST = "hot-trust";

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

function trackRegionHostAndTouch(state) {
  if (!state) return;

  const regions = CoreMemory.get(ROUTE, KEY_HOT_REGIONS) || {};
  const hosts = CoreMemory.get(ROUTE, KEY_HOT_HOSTS) || {};

  if (state.currentRegionId) {
    regions[state.currentRegionId] =
      (regions[state.currentRegionId] || 0) + 1;
  }
  if (state.currentHostName) {
    hosts[state.currentHostName] =
      (hosts[state.currentHostName] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_REGIONS, regions);
  CoreMemory.set(ROUTE, KEY_HOT_HOSTS, hosts);

  const presenceMap = CoreMemory.get(ROUTE, KEY_HOT_PRESENCE) || {};
  const modesMap = CoreMemory.get(ROUTE, KEY_HOT_MODES) || {};
  const pagesMap = CoreMemory.get(ROUTE, KEY_HOT_PAGES) || {};
  const chunksMap = CoreMemory.get(ROUTE, KEY_HOT_CHUNK_PROFILES) || {};
  const trustMap = CoreMemory.get(ROUTE, KEY_HOT_TRUST) || {};

  const presence = state.presence || state.pulseTouch?.presence;
  const mode = state.mode || state.pulseTouch?.mode;
  const page = state.page || state.pulseTouch?.page;
  const chunkProfile = state.chunkProfile || state.pulseTouch?.chunkProfile;
  const trusted = state.trusted || state.pulseTouch?.trusted;

  if (presence) {
    presenceMap[presence] = (presenceMap[presence] || 0) + 1;
  }
  if (mode) {
    modesMap[mode] = (modesMap[mode] || 0) + 1;
  }
  if (page) {
    pagesMap[page] = (pagesMap[page] || 0) + 1;
  }
  if (chunkProfile) {
    chunksMap[chunkProfile] = (chunksMap[chunkProfile] || 0) + 1;
  }
  if (trusted) {
    trustMap[trusted] = (trustMap[trusted] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_PRESENCE, presenceMap);
  CoreMemory.set(ROUTE, KEY_HOT_MODES, modesMap);
  CoreMemory.set(ROUTE, KEY_HOT_PAGES, pagesMap);
  CoreMemory.set(ROUTE, KEY_HOT_CHUNK_PROFILES, chunksMap);
  CoreMemory.set(ROUTE, KEY_HOT_TRUST, trustMap);
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
// Runtime Tick (v2.4)
// -------------------------

export function runPulseTickV2({
  instanceContexts,
  currentStatesById,
  globalContinuancePolicy = {}
}) {
  CoreMemory.prewarm();

  const tick = bumpTick();
  CoreMemory.set(ROUTE, KEY_LAST_POLICY, globalContinuancePolicy);

  const adjustedContexts =
    PulseWorldRegioning.adjustInstanceContextsForWorld?.(
      instanceContexts,
      globalContinuancePolicy
    ) || instanceContexts;

  const multiPlan = buildMultiOrganismPlan(adjustedContexts);
  const multiPlanSummary = summarizeMultiOrganismPlan(multiPlan);

  CoreMemory.set(ROUTE, KEY_LAST_PLAN, multiPlan);
  CoreMemory.set(ROUTE, KEY_LAST_PLAN_SUMMARY, multiPlanSummary);

  const executionResultsById = executeMultiOrganismPlan(
    multiPlan,
    currentStatesById
  );

  CoreMemory.set(ROUTE, KEY_LAST_EXEC, executionResultsById);

  for (const [id, state] of Object.entries(currentStatesById)) {
    trackInstance(id);
    trackRegionHostAndTouch(state);
  }

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
    hotFrameSizes: CoreMemory.get(ROUTE, KEY_HOT_FRAME_SIZES),
    hotPresence: CoreMemory.get(ROUTE, KEY_HOT_PRESENCE),
    hotModes: CoreMemory.get(ROUTE, KEY_HOT_MODES),
    hotPages: CoreMemory.get(ROUTE, KEY_HOT_PAGES),
    hotChunkProfiles: CoreMemory.get(ROUTE, KEY_HOT_CHUNK_PROFILES),
    hotTrust: CoreMemory.get(ROUTE, KEY_HOT_TRUST)
  };
}

// -------------------------
// Export
// -------------------------

const PulseRuntimeV2 = {
  meta: PulseRuntimeV2Meta,
  runPulseTickV2,
  getRuntimeStateV2,
  CoreMemory
};

export default PulseRuntimeV2;
