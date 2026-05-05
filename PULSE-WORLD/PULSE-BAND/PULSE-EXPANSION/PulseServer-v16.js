// ============================================================================
//  PULSE OS v16‑IMMORTAL‑ORGANISM — PULSE SERVER (EXEC ENGINE / ADVANTAGE HUB)
//  PulseServer-v16-Immortal-ORGANISM.js
//
//  ROLE:
//    - Deterministic compute / exec engine for the organism.
//    - Centralizes compute advantages (batching, caching, reuse) WITHOUT
//      reinterpreting organ math.
//    - Binds: AdrenalSystem + Scheduler + Runtime v2 (+ Router/Overmind via Scheduler).
//    - Single entrypoint for “server-as-compute” and “server-as-earn/flow”.
//    - WorldCore-aware, user-aware, mesh-aware, brain-aware, PulseNet-bridge-aware.
//    - DualBand-aware + binary send aware (symbolic + binary lanes).
//    - NO direct network fetch: all network is via higher PulseNet bridge / expansion.
//    - v16+: Castle-aware, Expansion-aware, can act as Castle-General fallback
//      when Castle is absent or degraded (server-as-central-castle).
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseServer",
  version: "v16-Immortal-ORGANISM",
  layer: "presence_server",
  role: "presence_region_server",
  lineage: "PulsePresence-v15-Immortal → v16-Immortal-ORGANISM",

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
    zeroFilesystem: true,

    // v16+: castle + expansion + PulseNet bridge
    castleAware: true,
    expansionAware: true,
    pulseNetBridgeAware: true,
    soldierAware: true,
    routeAware: true,
    nodeAdminAware: true,
    castleFallbackGeneral: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseCastle",
      "PulseExpansion",
      "PulseNetBridge"
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

import { logger } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";

// v16 Expansion / Castle
import {
  PulseExpansionMeta,
  createPulseExpansion
} from "../PULSE-EXPANSION/PulseExpansion-v16.js";

import {
  PulseCastleMeta,
  summarizeCastlePresence,
  computeCastlePresence
} from "../PULSE-EXPANSION/PulseCastle-v16.js";

// Router (still v12.3 presence-era)
import {
  PulseRouterMeta,
  createPulseRouter
} from "./PulseRouter-v16.js";

// User lanes / WorldCore
import {
  getPulseUserContext,
  createPulseWorldCore
} from "./PulseUser-v16.js";

// Adrenal (compute starter / circulation governor)
import {
  runInstanceOrchestrator as runAdrenalInstanceOrchestrator,
  PulseProxyAdrenalSystemMeta
} from "../PULSE-PROXY/PulseProxyAdrenalSystem.js";

// PulseNet bridge (symbolic adapter to PULSE-NET)
import {
  createPulseNetBridge
} from "../../PULSE-UI/_BACKEND/PULSE-NET.js";

// Touch / presence
import { getPulseTouchContext } from "../../PULSE-UI/PULSE-TOUCH.js";

// Scheduler (Router + Overmind + Runtime v2 macro pipeline)
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

// DualBand / Binary field (optional, advantage-only)
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v16.js";
import { createBinarySend as PulseSendBin } from "../PULSE-SEND/PulseBinarySend-v16.js";

// Proxy context (v16 IMMORTAL ORGANISM)
import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";


// ============================================================================
//  META — PulseServer Identity
// ============================================================================
export const PulseServerMeta = Object.freeze({
  layer: "PulseServer",
  role: "PRESENCE_EXEC_ENGINE",
  version: "v16-Immortal-ORGANISM",
  identity: "PulseServer-v16-Immortal-ORGANISM-EXEC",

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
    dualBandExecAware: true,
    binarySendAware: true,

    // Delegation
    usesAdrenalSystem: true,
    usesSchedulerOrgan: true,
    usesRuntimeV2: true,

    // Integration
    worldCoreAware: true,
    userContextAware: true,
    meshAware: true,
    brainAware: true,
    pulseNetBridgeAware: true,
    expansionAware: true,
    castleAware: true,

    // Proxy
    proxyAware: true,
    proxyPressureAware: true,
    proxyFallbackAware: true,
    proxyBoostAware: true,

    // Castle fallback
    castleFallbackGeneral: true
  }),

  contract: Object.freeze({
    input: [
      "PulseServerJobRequest"
    ],
    output: [
      "PulseServerJobResult"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v16-Immortal-ORGANISM",
    parent: "PulseProxy-v16-Immortal-ORGANISM",
    ancestry: [
      "PulseServer-v9",
      "PulseServer-v10",
      "PulseServer-v11",
      "PulseServer-v11-Evo",
      "PulseServer-v12-Evo",
      "PulseServer-v12.3-Presence-Evo+",
      "PulseServer-v13-Presence-Evo+",
      "PulseServer-v15-Immortal-Presence-Evo+"
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
const jobResultCache = new Map();
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
//  PROXY-AWARE TICK GOVERNOR — symbolic-only, no runtime mutation
// ============================================================================
function computeProxyAwareMaxTicks(baseMaxTicks) {
  let maxTicks = baseMaxTicks;

  const mode = getProxyMode();
  const pressure = getProxyPressure();
  const boost = getProxyBoost();
  const fallback = getProxyFallback();

  if (fallback || mode === "fallback") {
    maxTicks = Math.max(1, maxTicks - 2);
  }

  if (pressure > 0.7) {
    maxTicks = Math.max(1, maxTicks - 1);
  }

  if (boost > 0.5 && !fallback && mode !== "fallback") {
    maxTicks += 1;
  }

  return maxTicks;
}

// ============================================================================
//  CASTLE / EXPANSION / PULSENET BRIDGE HELPERS
// ============================================================================

function buildServerCastleId({ serverId, regionId }) {
  return `SERVER_GENERAL::${regionId || "unknown-region"}::${serverId || "anon"}`;
}

function isCastleHealthy(presenceField) {
  if (!presenceField) return false;
  const tier = presenceField.tier || presenceField.presenceTier || "normal";
  const score =
    presenceField.presenceScore ??
    presenceField.composite ??
    0;
  const stress = presenceField.stressIndex ?? 0;

  if (getProxyFallback()) return false;
  if (tier === "low") return false;
  if (score < 0.3) return false;
  if (stress > 0.9) return false;
  return true;
}

function emitBridgeSafe(bridge, method, payload) {
  if (!bridge || typeof bridge[method] !== "function") return { ok: false };
  try {
    return bridge[method](payload) || { ok: true };
  } catch (err) {
    logger?.log?.("server", "pulsenet_bridge_error", {
      method,
      error: String(err)
    });
    return { ok: false, error: String(err) };
  }
}

// ============================================================================
//  CORE SERVER ENGINE — worldCore/user/mesh/PulseNet-bridge/dualBand aware
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

      // Integration points
      worldCore: null,
      mesh: null,
      userContext: null,
      pulseNetBridge: null,
      brainNetworkMode: true,

      // Castle / Expansion
      regionId: null,
      hostName: null,
      serverId: null,
      enableCastleFallback: true,

      // DualBand / binary
      dualBandEngine: null,
      binarySend: null,

      ...config
    };

    this.worldCore = this.config.worldCore || null;
    this.mesh = this.config.mesh || null;
    this.userContext = this.config.userContext || null;

    this.regionId = this.config.regionId || null;
    this.hostName = this.config.hostName || null;
    this.serverId = this.config.serverId || null;

    // PulseNet bridge (symbolic)
    this.pulseNetBridge =
      this.config.pulseNetBridge ||
      (typeof createPulseNetBridge === "function"
        ? createPulseNetBridge()
        : null);

    // DualBand / binary
    this.dualBandEngine =
      this.config.dualBandEngine ||
      (typeof PulseBinaryOrganismBoot === "function"
        ? PulseBinaryOrganismBoot({ mode: "presence-server" })
        : null);

    this.binarySend =
      this.config.binarySend ||
      (typeof PulseSendBin === "function"
        ? PulseSendBin({ source: "PulseServer-v16" })
        : null);

    // Scheduler
    this.scheduler = createPulseScheduler({
      defaultGlobalPolicy: this.config.defaultGlobalPolicy,
      defaultMaxTicks: this.config.defaultMaxTicks,
      defaultStopOnWorldLens: this.config.defaultStopOnWorldLens,
      ...this.config.schedulerConfig
    });

    // Expansion (v16) — server-aware, castle-aware, PulseNet-bridge-aware
    this.expansion =
      typeof createPulseExpansion === "function"
        ? createPulseExpansion({})
        : null;

    if (
      this.expansion &&
      this.pulseNetBridge &&
      typeof this.expansion.attachPulseNetBridge === "function"
    ) {
      try {
        this.expansion.attachPulseNetBridge(this.pulseNetBridge);
      } catch (err) {
        logger?.log?.("server", "expansion_attach_pulsenet_error", {
          error: String(err)
        });
      }
    }

    // WorldCore runtime attach
    if (this.worldCore && typeof this.worldCore.attachRuntime === "function") {
      try {
        this.worldCore.attachRuntime(PulseRuntimeV2);
      } catch (err) {
        logger?.log?.("server", "worldcore_attach_runtime_error", {
          error: String(err)
        });
      }
    }

    // Mesh user attach
    if (this.mesh && typeof this.mesh.attachUser === "function") {
      try {
        this.mesh.attachUser(this.userContext || { source: "PulseServer" });
      } catch (err) {
        logger?.log?.("server", "mesh_attach_user_error", {
          error: String(err)
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // Integration hooks
  // --------------------------------------------------------------------------
  attachWorldCore(worldCore) {
    this.worldCore = worldCore;
    if (worldCore && typeof worldCore.attachRuntime === "function") {
      try {
        worldCore.attachRuntime(PulseRuntimeV2);
      } catch (err) {
        logger?.log?.("server", "worldcore_attach_runtime_error", {
          error: String(err)
        });
      }
    }
    return { ok: true };
  }

  attachMesh(mesh) {
    this.mesh = mesh;
    if (mesh && typeof mesh.attachUser === "function") {
      try {
        mesh.attachUser(this.userContext || { source: "PulseServer" });
      } catch (err) {
        logger?.log?.("server", "mesh_attach_user_error", {
          error: String(err)
        });
      }
    }
    return { ok: true };
  }

  attachUserContext(userContext) {
    this.userContext = userContext;
    if (this.mesh && typeof this.mesh.attachUser === "function") {
      try {
        this.mesh.attachUser(userContext);
      } catch (err) {
        logger?.log?.("server", "mesh_attach_user_error", {
          error: String(err)
        });
      }
    }
    return { ok: true };
  }

  attachPulseNetBridge(pulseNetBridge) {
    this.pulseNetBridge = pulseNetBridge;
    if (pulseNetBridge && typeof pulseNetBridge.attachServer === "function") {
      try {
        pulseNetBridge.attachServer({ serverMeta: PulseServerMeta });
      } catch (err) {
        logger?.log?.("server", "pulsenet_attach_server_error", {
          error: String(err)
        });
      }
    }
    if (
      this.expansion &&
      this.pulseNetBridge &&
      typeof this.expansion.attachPulseNetBridge === "function"
    ) {
      try {
        this.expansion.attachPulseNetBridge(this.pulseNetBridge);
      } catch (err) {
        logger?.log?.("server", "expansion_attach_pulsenet_error", {
          error: String(err)
        });
      }
    }
    return { ok: true };
  }

  attachDualBandEngine(dualBandEngine) {
    this.dualBandEngine = dualBandEngine || null;
    return { ok: true };
  }

  attachBinarySend(binarySend) {
    this.binarySend = binarySend || null;
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
      this.worldCore &&
      typeof this.worldCore.buildAdvantageContext === "function"
        ? this.worldCore.buildAdvantageContext()
        : null;

    const dualBandSnapshot =
      dualBand ||
      (this.dualBandEngine &&
      typeof this.dualBandEngine.getSnapshot === "function"
        ? this.dualBandEngine.getSnapshot()
        : null);

    const baseMaxTicks = maxTicks ?? this.config.defaultMaxTicks;
    const proxyAwareMaxTicks = computeProxyAwareMaxTicks(baseMaxTicks);

    const pipelineResult = await this.scheduler.runPipeline({
      instances,
      currentStatesById,
      globalContinuancePolicy:
        globalContinuancePolicy ?? this.config.defaultGlobalPolicy,
      userRequest,
      dualBand: dualBandSnapshot,
      maxTicks: proxyAwareMaxTicks,
      stopOnWorldLens: stopOnWorldLens ?? this.config.defaultStopOnWorldLens,
      advantageContext,
      userContext: this.userContext || null
    });

    return {
      schedulerPipeline: pipelineResult,
      schedulerMeta: {
        ...PulseSchedulerMeta,
        proxyMode: getProxyMode(),
        proxyPressure: getProxyPressure()
      }
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
  // 5) Brain-network-shaped helper — compute miner for BrainIntent
  // --------------------------------------------------------------------------
  async runBrainNetworkJob({
    brainIntent,
    instances = [],
    currentStatesById = {},
    globalContinuancePolicy = null,
    dualBand = null,
    maxTicks = null,
    stopOnWorldLens = null,
    adrenalPulse = null,
    cacheKey = null
  } = {}) {
    if (!this.config.brainNetworkMode || !brainIntent) {
      return this.runServerJob({
        instances,
        currentStatesById,
        globalContinuancePolicy,
        dualBand,
        maxTicks,
        stopOnWorldLens,
        adrenalPulse,
        cacheKey
      });
    }

    const userRequest = {
      source: "BrainIntent",
      intent: brainIntent.intent,
      payload: brainIntent.payload || null,
      band: brainIntent.band || "symbolic",
      userContext: this.userContext || null
    };

    return this.runServerJob({
      instances,
      currentStatesById,
      globalContinuancePolicy,
      userRequest,
      dualBand,
      maxTicks,
      stopOnWorldLens,
      adrenalPulse,
      cacheKey
    });
  }

  // --------------------------------------------------------------------------
  // 6) Castle-General fallback — server becomes central castle if needed
  // --------------------------------------------------------------------------
  evaluateCastleFallbackAndSignal({
    runtimeStateV2,
    schedulerPipeline
  }) {
    if (!this.config.enableCastleFallback) {
      return {
        takeover: false,
        reason: "castle_fallback_disabled"
      };
    }

    const regionId = this.regionId || "unknown-region";
    const serverId = this.serverId || "server-unknown";
    const hostName = this.hostName || "host-unknown";

    let takeover = false;
    let reason = "castle_healthy_or_unknown";
    let castlePresenceField = null;
    let meshSnapshot = null;

    try {
      const { byRegion } = summarizeCastlePresence();
      const regionInfo = byRegion[regionId];

      if (!regionInfo || regionInfo.castles.length === 0) {
        takeover = true;
        reason = "no_castles_in_region";
      } else {
        let anyHealthy = false;
        for (const c of regionInfo.castles) {
          const presenceField = c.presenceField || computeCastlePresence(c);
          if (isCastleHealthy(presenceField)) {
            anyHealthy = true;
            break;
          }
        }
        if (!anyHealthy) {
          takeover = true;
          reason = "all_castles_unhealthy_or_low";
        }
      }

      meshSnapshot = regionInfo || null;
      castlePresenceField =
        regionInfo && regionInfo.castles[0]
          ? regionInfo.castles[0].presenceField || null
          : null;
    } catch (err) {
      takeover = true;
      reason = "castle_snapshot_error";
      logger?.log?.("server", "castle_snapshot_error", {
        error: String(err)
      });
    }

    const serverCastleId = buildServerCastleId({ serverId, regionId });

    const serverCastlePresence = {
      castleId: serverCastleId,
      regionId,
      hostName,
      presenceField: {
        tier: "normal",
        presenceScore: 0.6,
        loadIndex: 0.4,
        stressIndex: 0.3,
        proxyMode: getProxyMode(),
        proxyPressure: getProxyPressure(),
        proxyBoost: getProxyBoost(),
        proxyFallback: getProxyFallback()
      },
      runtimeHint: {
        runtimeStateV2: !!runtimeStateV2,
        schedulerTicks: schedulerPipeline?.ticks?.length ?? 0
      }
    };

    if (takeover && this.pulseNetBridge) {
      emitBridgeSafe(this.pulseNetBridge, "routeCastle", {
        mode: "server_general_takeover",
        serverId,
        regionId,
        hostName,
        serverCastleId,
        serverCastlePresence,
        previousCastlePresence: castlePresenceField,
        meshSnapshot,
        proxy: {
          mode: getProxyMode(),
          pressure: getProxyPressure(),
          boost: getProxyBoost(),
          fallback: getProxyFallback(),
          lineage: getProxyLineage()
        }
      });

      if (this.expansion && typeof this.expansion.buildExpansionPlan === "function") {
        try {
          this.expansion.buildExpansionPlan({
            globalLoadIndex: 0.5,
            regionSignals: {
              [regionId]: {
                avgLoadIndex: 0.5,
                userDensityHint: 0,
                stressHint: 0.4
              }
            }
          });
        } catch (err) {
          logger?.log?.("server", "expansion_plan_on_takeover_error", {
            error: String(err)
          });
        }
      }
    }

    return {
      takeover,
      reason,
      serverCastleId,
      serverCastlePresence
    };
  }

  // --------------------------------------------------------------------------
  // MAIN ENTRYPOINT — PulseServer job
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

    notes.push("PulseServer-v16-Immortal-ORGANISM-EXEC: starting job.");

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

    const {
      adrenalTickAccepted,
      adrenalMeta
    } = await this.runAdrenalIfEnabled(adrenalPulse);

    notes.push(
      adrenalTickAccepted
        ? "Adrenal tick executed (compute circulation updated)."
        : "Adrenal tick skipped (disabled)."
    );

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

    const runtimeStateV2 = getRuntimeStateV2();
    notes.push("Runtime v2 state snapshot captured (hot-state + binary frames).");

    const advantageContext =
      this.worldCore &&
      typeof this.worldCore.buildAdvantageContext === "function"
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

    const dualBandSnapshot =
      dualBand ||
      (this.dualBandEngine &&
      typeof this.dualBandEngine.getSnapshot === "function"
        ? this.dualBandEngine.getSnapshot()
        : null);

    const proxyMeta = {
      proxy: getProxyContext(),
      proxyPressure: getProxyPressure(),
      proxyBoost: getProxyBoost(),
      proxyFallback: getProxyFallback(),
      proxyMode: getProxyMode(),
      proxyLineage: getProxyLineage()
    };

    const castleFallback = this.evaluateCastleFallbackAndSignal({
      runtimeStateV2,
      schedulerPipeline
    });

    const meta = Object.freeze({
      serverMeta: PulseServerMeta,
      schedulerMeta,
      adrenalMeta,
      advantageContext,
      worldCoreSnapshot,
      meshSnapshot,
      dualBandSnapshot,
      userContext: this.userContext || null,
      pulseNetBridgeAttached: !!this.pulseNetBridge,
      binarySendAttached: !!this.binarySend,
      proxyMeta,
      castleFallback,
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

    async runBrainNetworkJob(payload) {
      return core.runBrainNetworkJob(payload);
    },

    attachWorldCore(worldCore) {
      return core.attachWorldCore(worldCore);
    },
    attachMesh(mesh) {
      return core.attachMesh(mesh);
    },
    attachUserContext(userContext) {
      return core.attachUserContext(userContext);
    },
    attachPulseNetBridge(pulseNetBridge) {
      return core.attachPulseNetBridge(pulseNetBridge);
    },
    attachDualBandEngine(dualBandEngine) {
      return core.attachDualBandEngine(dualBandEngine);
    },
    attachBinarySend(binarySend) {
      return core.attachBinarySend(binarySend);
    }
  });
}

export const pulseServer = createPulseServer();
