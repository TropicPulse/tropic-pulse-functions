/**
 * ============================================================
 *  ORGAN: PulseScheduler
 *  ROOT:  PULSE-X
 *  MODE:  runtime
 *  TARGET: multi-tick-orchestration
 *  VERSION: v2-EVO
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
 *
 *  CONTRACT:
 *    INPUT:
 *      - SchedulerPipelineRequest:
 *          {
 *            instances: InstanceContext[],
 *            currentStatesById: CurrentInstanceStateById,
 *            globalContinuancePolicy?: GlobalContinuancePolicy,
 *            userRequest?: AIRouterRequestShape,
 *            dualBand?: DualBandSnapshotAPI,
 *            maxTicks?: number,                // default 3
 *            stopOnWorldLens?: string[]        // e.g. ["unsafe", "breakthrough"]
 *          }
 *
 *    OUTPUT:
 *      - SchedulerPipelineResult:
 *          {
 *            scheduleId: string,
 *            ticks: SchedulerResult[],
 *            finalStateById: CurrentInstanceStateById,
 *            meta: SchedulerPipelineMetaSummary
 *          }
 * ============================================================
 */

// ============================================================================
//  META
// ============================================================================

export const PulseSchedulerMeta = Object.freeze({
  layer: "PulseXScheduler",
  role: "SCHEDULER_ORGAN",
  version: "v2-EVO",
  identity: "PulseScheduler-v2-EVO",

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

// Router
import { routeAIRequest } from "../AI/aiRouter-v11-EVO.js";

// Overmind
import { createOvermindOrgan } from "../AI/aiOvermind-v11.2-EVO.js";

// Runtime
import PulseRuntimeAPI from "./PulseRuntime-v1-Evo.js";

const {
  runPulseTick,
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

// Deterministic ID (no randomness, no time)
function buildScheduleId(seed = "pulse-scheduler-v2-evo") {
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
  // v1-style single macro tick (kept for compatibility)
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
      `PulseScheduler-v2-EVO: macro tick #${tickIndex} (schedule=${effectiveScheduleId}).`
    );
    reasoning.push(`Instances: ${instances.length}`);

    const policy =
      globalContinuancePolicy || this.config.defaultGlobalPolicy || {};
    reasoning.push("Global continuance policy loaded (symbolic).");

    // 1) ROUTING
    let routing = null;

    if (this.config.enableRouting && userRequest) {
      reasoning.push("Routing enabled: processing userRequest via aiRouter.");
      routing = routeAIRequest(userRequest, dualBand || null);
      reasoning.push("Routing completed.");
    } else {
      reasoning.push("Routing skipped (no userRequest or disabled).");
    }

    // 2) OVERMIND
    let overmindDecision = null;

    if (this.config.enableOvermind && routing) {
      reasoning.push("Overmind enabled: processing routed intent.");

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

      // NEW: Forward Overmind meta → NodeAdmin (beacon directive)
      if (globalThis.nodeAdmin && typeof globalThis.nodeAdmin.handleOvermindMeta === "function") {
        globalThis.nodeAdmin.handleOvermindMeta(overmindDecision.meta);
      }

      reasoning.push(
        `Overmind worldLens: ${overmindDecision?.meta?.worldLens || "n/a"}`
      );

    } else {
      reasoning.push("Overmind skipped (no routing or disabled).");
    }

    // 3) RUNTIME TICK
    let runtimeTickResult = null;

    if (this.config.enableRuntimeTick) {
      reasoning.push("Runtime tick enabled: executing multi-organism plan.");

      const runtimeResult = runPulseTick({
        instanceContexts: instances,
        currentStatesById,
        globalContinuancePolicy: policy
      });

      if (runtimeResult instanceof PulseRuntimeTickResult) {
        runtimeTickResult = runtimeResult;
        reasoning.push("Runtime tick completed (PulseRuntimeTickResult).");
      } else {
        runtimeTickResult = runtimeResult;
        reasoning.push("Runtime tick completed (plain object).");
      }
    } else {
      reasoning.push("Runtime tick skipped (disabled).");
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

    reasoning.push(
      `PulseScheduler-v2-EVO: starting pipeline (scheduleId=${scheduleId}, maxTicks=${effectiveMaxTicks}).`
    );

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
      const safetyStatus =
        tickResult.overmindDecision?.meta?.safetyStatus || null;

      reasoning.push(
        `Tick #${tickIndex}: worldLens=${worldLens || "n/a"}, safety=${safetyStatus || "n/a"}`
      );

      if (worldLens && effectiveStopOnWorldLens.includes(worldLens)) {
        reasoning.push(
          `Stopping pipeline due to worldLens="${worldLens}" (stopOnWorldLens rule).`
        );
        break;
      }

      // Advance state if runtime produced new states (v1 runtime returns executionResultsById)
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

    async runMacroTick(payload) {
      return core.runMacroTick(payload);
    },

    async runPipeline(payload) {
      return core.runPipeline(payload);
    }
  });
}

// Default singleton-style instance
export const pulseScheduler = createPulseScheduler();
