/**
 * ============================================================
 *  ORGAN: PulseScheduler
 *  ROOT:  PULSE-X
 *  MODE:  runtime
 *  TARGET: multi-tick-orchestration
 *  VERSION: v2.3-PRESENCE-EVO+
 *
 *  ROLE:
 *    - Deterministic orchestrator over Router + Overmind + Runtime.
 *    - Runs multi-tick pipelines (sequence of macro ticks).
 *    - Uses Overmind world-lens + dual-band hints to shape tick flow.
 *
 *  GUARANTEES:
 *    - No real-time dependence.
 *    - No randomness.
 *    - No direct device/network IO.
 *    - Pure orchestration over symbolic + binary layers.
 * ============================================================
 */

// ============================================================================
//  META
// ============================================================================

export const PulseSchedulerMeta = Object.freeze({
  layer: "PulseXScheduler",
  role: "SCHEDULER_ORGAN",
  version: "v2.3-PRESENCE-EVO+",
  identity: "PulseScheduler-v2.3-PRESENCE-EVO+",
  epoch: "v12.3-PRESENCE-EVO+",

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
    multiTickAware: true
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
    schedulerAware: true
  }),

  contract: Object.freeze({
    input: [
      "InstanceContext[]",
      "CurrentInstanceStateById",
      "GlobalContinuancePolicy",
      "AIRouterRequestShape",
      "DualBandSnapshotAPI",
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

import { routeAIRequest } from "../AI/aiRouter-v11-EVO.js";
import { createOvermindOrgan } from "../AI/aiOvermind-v11.2-EVO.js";

// UPGRADED RUNTIME
import PulseRuntimeAPI from "../PULSE-x/pulseruntime-V2-EVO.js";

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

function buildScheduleId(seed = "pulse-scheduler-v2.3-presence-evo") {
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
  // v1-style macro tick (kept for compatibility)
  // --------------------------------------------------------------------------
  async runMacroTick({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
    scheduleId = null,
    tickIndex = 0
  }) {
    const reasoning = [];
    const effectiveScheduleId = scheduleId || buildScheduleId();

    reasoning.push(
      `PulseScheduler-v2.3-PRESENCE-EVO+: macro tick #${tickIndex} (schedule=${effectiveScheduleId}).`
    );

    const policy =
      globalContinuancePolicy || this.config.defaultGlobalPolicy || {};

    // 1) ROUTING
    let routing = null;

    if (this.config.enableRouting && userRequest) {
      routing = routeAIRequest(userRequest, dualBand || null);
    }

    // 2) OVERMIND
    let overmindDecision = null;

    if (this.config.enableOvermind && routing) {
      const intent = {
        type: userRequest?.intent || "analyze",
        domain: userRequest?.domain || null,
        scope: userRequest?.scope || null,
        safetyMode: routing?.personaSafety?.safetyMode || "standard",
        keywords: userRequest?.keywords || []
      };

      const context = {
        domain: userRequest?.domain || null,
        scope: userRequest?.scope || null,
        safetyMode: routing?.personaSafety?.safetyMode || "standard",
        personaId: routing.personaId,
        archetypePrimaryPage: routing.archetypes?.primaryPage || null,
        dualBand: routing.dualBand || null
      };

      const candidates = [
        {
          text:
            userRequest?.rawText ||
            userRequest?.prompt ||
            "No explicit user text provided.",
          routing
        }
      ];

      overmindDecision = await this.overmind.process({
        intent,
        context,
        candidates,
        options: { mode: "normal" }
      });

      if (globalThis.nodeAdmin?.handleOvermindMeta) {
        globalThis.nodeAdmin.handleOvermindMeta(overmindDecision.meta);
      }
    }

    // 3) RUNTIME TICK
    let runtimeTickResult = null;

    if (this.config.enableRuntimeTick) {
      const runtimeResult = runPulseTick({
        instanceContexts: instances,
        currentStatesById,
        globalContinuancePolicy: policy
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
  // v2: Multi-tick pipeline
  // --------------------------------------------------------------------------
  async runPipeline({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
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
