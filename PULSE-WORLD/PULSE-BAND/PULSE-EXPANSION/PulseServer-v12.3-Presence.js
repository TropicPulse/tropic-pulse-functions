// ============================================================================
//  PULSE OS v13‑PRESENCE‑EVO+ — PULSE SERVER (EXEC ENGINE / ADVANTAGE HUB)
//  PulseServer-v13-Presence
//
//  ROLE:
//    - Deterministic compute / exec engine for the organism.
//    - Centralizes compute advantages (batching, caching, reuse) WITHOUT
//      reinterpreting organ math.
//    - Binds: AdrenalSystem + Scheduler + Runtime v2 (+ Router/Overmind via Scheduler).
//    - Single entrypoint for “server-as-compute” and “server-as-earn/flow”.
//    - Now worldCore-aware, user-aware, mesh-aware, brain-aware.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseServer",
  version: "v14-IMMORTAL",
  layer: "presence_server",
  role: "presence_region_server",
  lineage: "PulsePresence-v14",

  evo: {
    regionServer: true,
    regionState: true,
    regionPhysics: true,
    regionIdentity: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseCastle",
      "PulseExpansion"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
//  IMPORTS — Organs it feeds and orchestrates
// ============================================================================

// Adrenal (compute starter / circulation governor)
import {
  runInstanceOrchestrator as runAdrenalInstanceOrchestrator,
  PulseProxyAdrenalSystemMeta
} from "../PULSE-PROXY/PulseProxyAdrenalSystem.js";

// Scheduler (Router + Overmind + Runtime v1 macro pipeline)
import {
  createPulseScheduler,
  PulseSchedulerMeta
} from "../PULSE-X/PulseScheduler-v2.js";

// Runtime v2 (multi-organism execution + binary frames)
import PulseRuntimeV2 from "../PULSE-X/PulseRuntime-v2-Evo.js";

const {
  runPulseTickV2,
  getRuntimeStateV2,
  CoreMemory: RuntimeCoreMemory
} = PulseRuntimeV2;


// ============================================================================
//  META — PulseServer Identity
// ============================================================================
export const PulseServerMeta = Object.freeze({
  layer: "PulseServer",
  role: "PRESENCE_EXEC_ENGINE",
  version: "v13-PRESENCE-EVO+",
  identity: "PulseServer-v13-PRESENCE-EXEC-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Exec engine role
    execEngine: true,
    presenceExecEngine: true,
    earnExecAware: true,
    runtimeExecAware: true,
    schedulerExecAware: true,
    adrenalExecAware: true,

    // Advantage hub
    advantageHub: true,
    hotStateAware: true,
    planCacheAware: true,
    binaryFrameReuseAware: true,
    multiInstanceBatchAware: true,
    memoryPrewarmAware: true,

    // Safety / environment
    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroTimersIntroduced: true,
    zeroAsyncLoopsIntroduced: true,
    zeroDateNowIntroduced: true,
    zeroNetworkFetchIntroduced: true,

    // Band / field awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    dualMode: true,

    // Delegation
    usesAdrenalSystem: true,
    usesSchedulerOrgan: true,
    usesRuntimeV2: true,

    // NEW v13+ integration
    worldCoreAware: true,
    userContextAware: true,
    meshAware: true,
    brainAware: true
  }),

  contract: Object.freeze({
    input: [
      "PulseServerJobRequest"
      // {
      //   instances: InstanceContext[],
      //   currentStatesById: CurrentInstanceStateById,
      //   globalContinuancePolicy?: GlobalContinuancePolicy,
      //   userRequest?: AIRouterRequestShape,
      //   dualBand?: DualBandSnapshotAPI,
      //   maxTicks?: number,
      //   stopOnWorldLens?: string[],
      //   adrenalPulse?: { id?: string; jobId?: string; mode?: string; lineage?: any },
      //   cacheKey?: string
      // }
    ],
    output: [
      "PulseServerJobResult"
      // {
      //   serverMeta,
      //   schedulerPipeline,
      //   runtimeStateV2,
      //   adrenalMeta,
      //   adrenalTickAccepted,
      //   cacheHit,
      //   meta
      // }
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v13-PRESENCE-EVO+",
    parent: "PulseProxy-v13-PRESENCE-EVO+",
    ancestry: [
      "PulseServer-v9",
      "PulseServer-v10",
      "PulseServer-v11",
      "PulseServer-v11-Evo",
      "PulseServer-v12-Evo",
      "PulseServer-v12.3-PRESENCE-EVO+"
    ]
  })
});


// ============================================================================
//  TYPES
// ============================================================================
export class PulseServerJobResult {
  constructor({
    serverMeta,
    schedulerPipeline,
    runtimeStateV2,
    adrenalMeta,
    adrenalTickAccepted,
    cacheHit = false,
    meta = {}
  }) {
    this.serverMeta = serverMeta;
    this.schedulerPipeline = schedulerPipeline;
    this.runtimeStateV2 = runtimeStateV2;
    this.adrenalMeta = adrenalMeta;
    this.adrenalTickAccepted = adrenalTickAccepted;
    this.cacheHit = cacheHit;
    this.meta = meta;
  }
}


// ============================================================================
//  INTERNAL ADVANTAGE STATE (Deterministic, in‑memory, backend‑only)
// ============================================================================

// Simple deterministic cache keyed by symbolic cacheKey.
// We do NOT store user secrets, only organ outputs / summaries.
const jobResultCache = new Map();

// Hot multi‑instance batch memory (symbolic only).
// Example: we can reuse instanceContexts / currentStatesById across jobs.
const hotInstanceBatches = new Map();

function stableStringify(obj) {
  if (obj == null || typeof obj !== "object") return JSON.stringify(obj);
  const keys = Object.keys(obj).sort();
  const out = {};
  for (const k of keys) out[k] = obj[k];
  return JSON.stringify(out);
}

function buildBatchKey(instances, currentStatesById, globalContinuancePolicy) {
  return stableStringify({
    instances,
    currentStatesById,
    globalContinuancePolicy
  });
}


// ============================================================================
//  CORE SERVER ENGINE — now worldCore/user/mesh aware
// ============================================================================
export class PulseServerPresenceExec {
  constructor(config = {}) {
    this.config = {
      enableAdrenal: true,
      enableScheduler: true,
      enableRuntimeV2DirectTick: true,
      enableJobCache: true,
      enableBatchReuse: true,
      defaultGlobalPolicy: {},
      defaultMaxTicks: 3,
      defaultStopOnWorldLens: ["unsafe"],

      // NEW: integration points
      worldCore: null,   // PulseWorldCore instance (user orchestrator)
      mesh: null,        // mesh environment / snapshot
      userContext: null, // user / session context

      ...config
    };

    this.worldCore = this.config.worldCore || null;
    this.mesh = this.config.mesh || null;
    this.userContext = this.config.userContext || null;

    this.scheduler = createPulseScheduler({
      defaultGlobalPolicy: this.config.defaultGlobalPolicy,
      defaultMaxTicks: this.config.defaultMaxTicks,
      defaultStopOnWorldLens: this.config.defaultStopOnWorldLens,
      ...this.config.schedulerConfig
    });

    // Attach runtime to worldCore if it supports it (user ↔ brain)
    if (this.worldCore && typeof this.worldCore.attachRuntime === "function") {
      try {
        this.worldCore.attachRuntime(PulseRuntimeV2);
      } catch {
        // never throw from integration
      }
    }

    // Attach user to mesh if mesh supports it
    if (this.mesh && typeof this.mesh.attachUser === "function") {
      try {
        this.mesh.attachUser(this.userContext || { source: "PulseServer" });
      } catch {
        // ignore
      }
    }
  }

  // Allow late binding of worldCore / mesh / userContext
  attachWorldCore(worldCore) {
    this.worldCore = worldCore;
    if (worldCore && typeof worldCore.attachRuntime === "function") {
      try {
        worldCore.attachRuntime(PulseRuntimeV2);
      } catch {}
    }
    return { ok: true };
  }

  attachMesh(mesh) {
    this.mesh = mesh;
    if (mesh && typeof mesh.attachUser === "function") {
      try {
        mesh.attachUser(this.userContext || { source: "PulseServer" });
      } catch {}
    }
    return { ok: true };
  }

  attachUserContext(userContext) {
    this.userContext = userContext;
    if (this.mesh && typeof this.mesh.attachUser === "function") {
      try {
        this.mesh.attachUser(userContext);
      } catch {}
    }
    return { ok: true };
  }

  // --------------------------------------------------------------------------
  // 0) Memory prewarm + hot batch reuse
  // --------------------------------------------------------------------------
  prewarmAndMaybeReuseBatch({
    instances,
    currentStatesById,
    globalContinuancePolicy
  }) {
    RuntimeCoreMemory.prewarm?.();

    if (!this.config.enableBatchReuse) {
      return { instances, currentStatesById, reused: false };
    }

    const batchKey = buildBatchKey(
      instances,
      currentStatesById,
      globalContinuancePolicy
    );

    if (hotInstanceBatches.has(batchKey)) {
      const hot = hotInstanceBatches.get(batchKey);
      return {
        instances: hot.instances,
        currentStatesById: hot.currentStatesById,
        reused: true
      };
    }

    hotInstanceBatches.set(batchKey, {
      instances,
      currentStatesById
    });

    return { instances, currentStatesById, reused: false };
  }

  // --------------------------------------------------------------------------
  // 1) Optional Adrenal tick — compute starter / circulation governor
  // --------------------------------------------------------------------------
  async runAdrenalIfEnabled(adrenalPulse) {
    if (!this.config.enableAdrenal) {
      return {
        adrenalTickAccepted: false,
        adrenalMeta: {
          meta: PulseProxyAdrenalSystemMeta,
          note: "Adrenal disabled at PulseServer config."
        }
      };
    }

    const pulsePayload = {
      ...(adrenalPulse || {}),
      userContext: this.userContext || null
    };

    await runAdrenalInstanceOrchestrator(pulsePayload);

    return {
      adrenalTickAccepted: true,
      adrenalMeta: {
        meta: PulseProxyAdrenalSystemMeta,
        pulse: pulsePayload
      }
    };
  }

  // --------------------------------------------------------------------------
  // 2) Scheduler pipeline — Router + Overmind + Runtime (v1-style)
// --------------------------------------------------------------------------
  async runSchedulerPipeline({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
    maxTicks = null,
    stopOnWorldLens = null
  }) {
    if (!this.config.enableScheduler) {
      return {
        schedulerPipeline: null,
        schedulerMeta: {
          meta: PulseSchedulerMeta,
          note: "Scheduler disabled at PulseServer config."
        }
      };
    }

    const advantageContext =
      this.worldCore && typeof this.worldCore.buildAdvantageContext === "function"
        ? this.worldCore.buildAdvantageContext()
        : null;

    const pipelineResult = await this.scheduler.runPipeline({
      instances,
      currentStatesById,
      globalContinuancePolicy:
        globalContinuancePolicy ?? this.config.defaultGlobalPolicy,
      userRequest,
      dualBand,
      maxTicks: maxTicks ?? this.config.defaultMaxTicks,
      stopOnWorldLens: stopOnWorldLens ?? this.config.defaultStopOnWorldLens,
      // pass advantage + user context into scheduler if it knows how to use it
      advantageContext,
      userContext: this.userContext || null
    });

    return {
      schedulerPipeline: pipelineResult,
      schedulerMeta: PulseSchedulerMeta
    };
  }

  // --------------------------------------------------------------------------
  // 3) Optional direct Runtime v2 tick — extra compute pass in same run
  // --------------------------------------------------------------------------
  runRuntimeV2IfEnabled({
    instanceContexts,
    currentStatesById,
    globalContinuancePolicy = {}
  }) {
    if (!this.config.enableRuntimeV2DirectTick) {
      return null;
    }

    return runPulseTickV2({
      instanceContexts,
      currentStatesById,
      globalContinuancePolicy
    });
  }

  // --------------------------------------------------------------------------
  // 4) Job-level cache — reuse full compute result when safe
  // --------------------------------------------------------------------------
  maybeGetCachedJob(cacheKey) {
    if (!this.config.enableJobCache || !cacheKey) return null;
    return jobResultCache.get(cacheKey) || null;
  }

  maybeStoreCachedJob(cacheKey, result) {
    if (!this.config.enableJobCache || !cacheKey) return;
    jobResultCache.set(cacheKey, result);
  }

  // --------------------------------------------------------------------------
  // MAIN ENTRYPOINT — PulseServer job (now worldCore/user/mesh aware)
// --------------------------------------------------------------------------
  async runServerJob({
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    userRequest = null,
    dualBand = null,
    maxTicks = null,
    stopOnWorldLens = null,
    adrenalPulse = null,
    cacheKey = null
  } = {}) {
    const notes = [];

    notes.push("PulseServer-v13-PRESENCE-EXEC-EVO+: starting job.");

    // 0) Job cache check
    const cached = this.maybeGetCachedJob(cacheKey);
    if (cached) {
      notes.push("Job cache hit: returning cached PulseServerJobResult.");
      const cachedWithNotes = new PulseServerJobResult({
        ...cached,
        cacheHit: true,
        meta: {
          ...(cached.meta || {}),
          notes: [...(cached.meta?.notes || []), ...notes]
        }
      });
      return cachedWithNotes;
    }

    // 0.1) Prewarm + batch reuse
    const {
      instances: effectiveInstances,
      currentStatesById: effectiveStates,
      reused: batchReused
    } = this.prewarmAndMaybeReuseBatch({
      instances,
      currentStatesById,
      globalContinuancePolicy
    });

    notes.push(
      batchReused
        ? "Hot batch reused for instances/currentStates."
        : "New batch stored as hot for future reuse."
    );

    // 1) Adrenal tick (compute starter / circulation)
    const {
      adrenalTickAccepted,
      adrenalMeta
    } = await this.runAdrenalIfEnabled(adrenalPulse);

    notes.push(
      adrenalTickAccepted
        ? "Adrenal tick executed (compute circulation updated)."
        : "Adrenal tick skipped (disabled)."
    );

    // 2) Scheduler pipeline (Router + Overmind + Runtime v1)
    const {
      schedulerPipeline,
      schedulerMeta
    } = await this.runSchedulerPipeline({
      instances: effectiveInstances,
      currentStatesById: effectiveStates,
      globalContinuancePolicy,
      userRequest,
      dualBand,
      maxTicks,
      stopOnWorldLens
    });

    notes.push(
      schedulerPipeline
        ? `Scheduler pipeline completed with ${schedulerPipeline.ticks.length} ticks.`
        : "Scheduler pipeline skipped (disabled)."
    );

    // 3) Optional direct Runtime v2 tick (same instances/states, same policy)
    let runtimeV2TickResult = null;
    if (this.config.enableRuntimeV2DirectTick) {
      runtimeV2TickResult = this.runRuntimeV2IfEnabled({
        instanceContexts: effectiveInstances,
        currentStatesById: effectiveStates,
        globalContinuancePolicy:
          globalContinuancePolicy ?? this.config.defaultGlobalPolicy
      });
      notes.push("Runtime v2 direct tick executed (extra compute pass).");
    } else {
      notes.push("Runtime v2 direct tick skipped (disabled).");
    }

    // 4) Runtime v2 introspection snapshot (hot-state + frames)
    const runtimeStateV2 = getRuntimeStateV2();
    notes.push("Runtime v2 state snapshot captured (hot-state + binary frames).");

    // 5) Pull worldCore + mesh advantage context for this job
    const advantageContext =
      this.worldCore && typeof this.worldCore.buildAdvantageContext === "function"
        ? this.worldCore.buildAdvantageContext()
        : null;

    const worldCoreSnapshot =
      this.worldCore && typeof this.worldCore.getSnapshot === "function"
        ? this.worldCore.getSnapshot()
        : null;

    const meshSnapshot =
      this.mesh && typeof this.mesh.getSnapshot === "function"
        ? this.mesh.getSnapshot()
        : null;

    const meta = Object.freeze({
      serverMeta: PulseServerMeta,
      schedulerMeta,
      adrenalMeta,
      advantageContext,
      worldCoreSnapshot,
      meshSnapshot,
      userContext: this.userContext || null,
      notes
    });

    const result = new PulseServerJobResult({
      serverMeta: PulseServerMeta,
      schedulerPipeline,
      runtimeStateV2: {
        state: runtimeStateV2,
        directTick: runtimeV2TickResult
      },
      adrenalMeta,
      adrenalTickAccepted,
      cacheHit: false,
      meta
    });

    this.maybeStoreCachedJob(cacheKey, result);

    return result;
  }
}


// ============================================================================
//  PUBLIC API — Create / Singleton
// ============================================================================
export function createPulseServer(config = {}) {
  const core = new PulseServerPresenceExec(config);

  return Object.freeze({
    meta: PulseServerMeta,

    async runServerJob(payload) {
      return core.runServerJob(payload);
    },

    // expose integration hooks if caller wants to wire after creation
    attachWorldCore(worldCore) {
      return core.attachWorldCore(worldCore);
    },
    attachMesh(mesh) {
      return core.attachMesh(mesh);
    },
    attachUserContext(userContext) {
      return core.attachUserContext(userContext);
    }
  });
}

// Default singleton-style instance (no worldCore/mesh until attached)
export const pulseServer = createPulseServer();
