/**
 * ============================================================
 *  ORGAN: PulseScheduler
 *  ROOT:  PULSE-X
 *  MODE:  runtime
 *  TARGET: multi-tick-orchestration
 *  VERSION: v2.4-PRESENCE-TOUCH-IMMORTAL
 *
 *  ROLE:
 *    - Deterministic orchestrator over Router + Overmind + Runtime.
 *    - Runs multi-tick pipelines (sequence of macro ticks).
 *    - Uses Overmind world-lens + dual-band + Pulse-Touch hints.
 *    - Shapes tick flow using presence/mode/page/chunkProfile/trust.
 *
 *  GUARANTEES:
 *    - No real-time dependence.
 *    - No randomness.
 *    - No direct device/network IO.
 *    - Pure orchestration over symbolic + binary layers.
 * ============================================================
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseScheduler",
  version: "v2.4-PRESENCE-TOUCH-IMMORTAL",
  layer: "scheduler",
  role: "macro_orchestrator",
  lineage: "PulseScheduler-v1 → v11-Evo → v12.3 → v14-IMMORTAL → v2.4-PRESENCE-TOUCH-IMMORTAL",

  evo: {
    macroScheduler: true,
    runtimeAware: true,
    substrateAware: true,
    dualBand: true,
    deterministicScheduling: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    // IMMORTAL TOUCH UPGRADE
    pulseTouchAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkAware: true,
    pageAware: true,
    trustAware: true,
    identityAware: true,
    regionAware: true,
    modeAware: true
  },

  contract: {
    always: [
      "PulseRuntime",
      "BinarySubstrate"
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

// ============================================================================
//  META
// ============================================================================

export const PulseSchedulerMeta = Object.freeze({
  layer: "PulseXScheduler",
  role: "SCHEDULER_ORGAN",
  version: "v2.4-PRESENCE-TOUCH-IMMORTAL",
  identity: "PulseScheduler-v2.4-PRESENCE-TOUCH-IMMORTAL",
  epoch: "v13.5-PRESENCE-TOUCH",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    hostAgnostic: true,
    regionAware: true,
    binaryAware: true,
    overmindAware: true,
    routerAware: true,
    runtimeAware: true,
    multiTickAware: true,
    pulseTouchAware: true
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
    schedulerAware: true,
    pulseTouchAware: true,
    pageAware: true,
    modeAware: true,
    trustAware: true,
    identityAware: true
  }),

  contract: Object.freeze({
    input: [
      "InstanceContext[]",
      "CurrentInstanceStateById",
      "GlobalContinuancePolicy",
      "AIRouterRequestShape",
      "DualBandSnapshotAPI",
      "PulseTouchSnapshot",
      "maxTicks",
      "stopOnWorldLens[]"
    ],
    output: [
      "SchedulerPipelineResult",
      "SchedulerPipelineMetaSummary"
    ]
  })
});

// ============================================================================
//  IMPORTS
// ============================================================================

import { routeAIRequest } from "../PULSE-AI/aiRouter-v11-EVO.js";
import { createOvermindOrgan } from "../PULSE-AI/aiOvermindPrime.js";

// UPGRADED RUNTIME (Touch-aware)
import PulseRuntimeAPI from "../PULSE-X/PulseRuntime-v2-Evo.js";

const {
  runPulseTickV2: runPulseTick,
  PulseRuntimeTickResult
} = PulseRuntimeAPI;

// ============================================================================
//  TYPES
// ============================================================================

export class SchedulerResult {
  constructor({
    scheduleId,
    tickIndex,
    routing = null,
    overmindDecision = null,
    runtimeTick = null,
    meta = {}
  }) {
    this.scheduleId = scheduleId;
    this.tickIndex = tickIndex;
    this.routing = routing;
    this.overmindDecision = overmindDecision;
    this.runtimeTick = runtimeTick;
    this.meta = meta;
  }
}

export class SchedulerPipelineResult {
  constructor({
    scheduleId,
    ticks = [],
    finalStateById = {},
    meta = {}
  }) {
    this.scheduleId = scheduleId;
    this.ticks = ticks;
    this.finalStateById = finalStateById;
    this.meta = meta;
  }
}

function buildScheduleId(seed = "pulse-scheduler-v2.4-presence-touch") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const chr = seed.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `sched-${Math.abs(hash)}`;
}

// ============================================================================
//  CORE SCHEDULER ORGAN
// ============================================================================

export class PulseScheduler {
  constructor(config = {}) {
    this.config = {
      enableRouting: true,
      enableOvermind: true,
      enableRuntimeTick: true,
      defaultGlobalPolicy: {},
      defaultMaxTicks: 3,
      defaultStopOnWorldLens: ["unsafe"],
      ...config
    };

    this.overmind =
      config.overmind ||
      createOvermindOrgan({
        personalFrame: config.personalFrame || null,
        juryFrame: config.juryFrame || null,
        safetyFrame: config.safetyFrame || null
      });
  }

  // --------------------------------------------------------------------------
  // v2.4 macro tick (Touch-aware)
  // --------------------------------------------------------------------------
  async runMacroTick({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
    pulseTouch = null,
    scheduleId = null,
    tickIndex = 0
  }) {
    const reasoning = [];
    const effectiveScheduleId = scheduleId || buildScheduleId();

    reasoning.push(
      `PulseScheduler-v2.4-PRESENCE-TOUCH-IMMORTAL: macro tick #${tickIndex} (schedule=${effectiveScheduleId}).`
    );

    const policy =
      globalContinuancePolicy || this.config.defaultGlobalPolicy || {};

    // 1) ROUTING (Touch-aware)
    let routing = null;

    if (this.config.enableRouting && userRequest) {
      routing = routeAIRequest(userRequest, {
        ...dualBand,
        pulseTouch
      });
    }

    // 2) OVERMIND (Touch-aware)
    let overmindDecision = null;

    if (this.config.enableOvermind && routing) {
      const intent = {
        type: userRequest?.intent || "analyze",
        domain: userRequest?.domain || null,
        scope: userRequest?.scope || null,
        safetyMode: routing?.personaSafety?.safetyMode || "standard",
        keywords: userRequest?.keywords || [],
        pulseTouch
      };

      const context = {
        domain: userRequest?.domain || null,
        scope: userRequest?.scope || null,
        safetyMode: routing?.personaSafety?.safetyMode || "standard",
        personaId: routing.personaId,
        archetypePrimaryPage: routing.archetypes?.primaryPage || null,
        dualBand: routing.dualBand || null,
        pulseTouch
      };

      const candidates = [
        {
          text:
            userRequest?.rawText ||
            userRequest?.prompt ||
            "No explicit user text provided.",
          routing,
          pulseTouch
        }
      ];

      overmindDecision = await this.overmind.process({
        intent,
        context,
        candidates,
        options: { mode: "normal" }
      });
    }

    // 3) RUNTIME TICK (Touch-aware)
    let runtimeTickResult = null;

    if (this.config.enableRuntimeTick) {
      const runtimeResult = runPulseTick({
        instanceContexts: instances,
        currentStatesById,
        globalContinuancePolicy: policy,
        pulseTouch
      });

      runtimeTickResult = runtimeResult;
    }

    // 4) META SUMMARY
    const meta = Object.freeze({
      schedulerMeta: PulseSchedulerMeta,
      scheduleId: effectiveScheduleId,
      tickIndex,
      routingPersonaId: routing?.personaId || null,
      routingArchetypePrimaryPage:
        routing?.archetypes?.primaryPage || null,
      overmindWorldLens: overmindDecision?.meta?.worldLens || null,
      overmindSafetyStatus: overmindDecision?.meta?.safetyStatus || null,
      runtimePlanSummary:
        runtimeTickResult?.multiPlanSummary || null,
      pulseTouch,
      notes: reasoning
    });

    return new SchedulerResult({
      scheduleId: effectiveScheduleId,
      tickIndex,
      routing,
      overmindDecision,
      runtimeTick: runtimeTickResult,
      meta
    });
  }

  // --------------------------------------------------------------------------
  // v2.4: Multi-tick pipeline (Touch-aware)
  // --------------------------------------------------------------------------
  async runPipeline({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
    pulseTouch = null,
    maxTicks = null,
    stopOnWorldLens = null
  }) {
    const scheduleId = buildScheduleId();
    const ticks = [];
    const reasoning = [];

    const effectiveMaxTicks =
      typeof maxTicks === "number" && maxTicks > 0
        ? maxTicks
        : this.config.defaultMaxTicks;

    const effectiveStopOnWorldLens =
      Array.isArray(stopOnWorldLens) && stopOnWorldLens.length > 0
        ? stopOnWorldLens
        : this.config.defaultStopOnWorldLens;

    let currentStateById = { ...currentStatesById };

    for (let tickIndex = 0; tickIndex < effectiveMaxTicks; tickIndex++) {
      const tickResult = await this.runMacroTick({
        instances,
        currentStatesById: currentStateById,
        globalContinuancePolicy,
        userRequest,
        dualBand,
        pulseTouch,
        scheduleId,
        tickIndex
      });

      ticks.push(tickResult);

      const worldLens = tickResult.overmindDecision?.meta?.worldLens || null;

      if (worldLens && effectiveStopOnWorldLens.includes(worldLens)) {
        break;
      }

      if (tickResult.runtimeTick?.executionResultsById) {
        const nextState = { ...currentStateById };
        for (const [instanceId, execResult] of Object.entries(
          tickResult.runtimeTick.executionResultsById
        )) {
          if (execResult?.newState) {
            nextState[instanceId] = execResult.newState;
          }
        }
        currentStateById = nextState;
      }
    }

    const meta = Object.freeze({
      schedulerMeta: PulseSchedulerMeta,
      scheduleId,
      totalTicks: ticks.length,
      stopOnWorldLens: effectiveStopOnWorldLens,
      pulseTouch,
      notes: reasoning
    });

    return new SchedulerPipelineResult({
      scheduleId,
      ticks,
      finalStateById: currentStateById,
      meta
    });
  }
}

// ============================================================================
//  PUBLIC API — Create Scheduler Organ
// ============================================================================

export function createPulseScheduler(config = {}) {
  const core = new PulseScheduler(config);

  return Object.freeze({
    meta: PulseSchedulerMeta,
    runMacroTick: (payload) => core.runMacroTick(payload),
    runPipeline: (payload) => core.runPipeline(payload)
  });
}

export const pulseScheduler = createPulseScheduler();
