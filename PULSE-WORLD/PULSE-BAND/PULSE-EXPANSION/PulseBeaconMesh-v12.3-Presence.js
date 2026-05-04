/**
 * ============================================================================
 *  PULSE-WORLD : PulseBeaconMesh-v12.3-Presence.js
 *  ROLE: Local membrane simulator + density/mode/advantage debugger
 *  VERSION: v16-IMMORTAL-ORGANISM
 *  LAYER: BeaconMesh
 *  IDENTITY: PulseBeaconMesh-v16-IMMORTAL-ORGANISM
 * ============================================================================
 *
 *  PURPOSE:
 *    This organ simulates local world conditions and feeds them into the
 *    PulseBeaconEngine IMMORTAL chain. It does NOT compute signal physics.
 *
 *    In v16-IMMORTAL-ORGANISM, BeaconMesh is no longer an isolated helper.
 *    It is the LOCAL MEMBRANE of the organism, wired symbolically into:
 *
 *      - PulseExpansion (world / region / cluster)
 *      - PulseCastle (castle / beacon / console)
 *      - PulseServer (server lanes)
 *      - PulseUser (user lanes)
 *      - PulseTouch (presence / mode / page / chunkProfile / trust / identity)
 *      - PulseNet (mesh family / ingress / pressure)
 *      - PulseMesh (symbolic mesh organism)
 *      - PulseRuntime (hot instances / regions / presence / modes / pages)
 *      - PulseScheduler (macro tick orchestration)
 *      - PulseOvermind (world-lens / safety)
 *
 *    CONTRACT:
 *      - Never mutate the Beacon Engine.
 *      - Never compute signal shaping.
 *      - Never override global hints.
 *      - Only call Beacon Engine APIs.
 *      - Always deterministic.
 *      - Pure membrane surface (symbolic composition only).
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseBeaconMesh",
  version: "v16-IMMORTAL-ORGANISM",
  layer: "beacon_mesh",
  role: "local_membrane_simulator",
  lineage: "PulseBeaconMesh-v1 → v11-Evo → v14-IMMORTAL → v16-IMMORTAL-ORGANISM",

  evo: {
    localMembrane: true,
    organismAware: true,
    dualBandAware: true,
    meshAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroTimers: true,
    zeroAsync: true,

    presenceFieldAware: true,
    bandAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    multiInstanceReady: true,
    regionAware: true,
    castleAware: true,
    expansionAware: true,
    routerAware: true,
    meshPressureAware: true,
    presenceTierAware: true,
    advantageBandAware: true,
    chunkPlanAware: true,
    pulseTouchAware: true,
    pulseNetAware: true,
    runtimeAware: true,
    schedulerAware: true,
    overmindAware: true,
    meshOrganismAware: true
  },

  contract: {
    always: [
      "PulseBeaconEngine",
      "PulseExpansion",
      "PulseCastle",
      "PulseServer",
      "PulseUser",
      "PulseTouch",
      "PulseNet",
      "PulseMesh",
      "PulseRuntime",
      "PulseScheduler",
      "PulseOvermind"
    ],
    never: [
      "routerCore",
      "safeRoute",
      "fetchViaCNS",
      "meshKernelExec",
      "presenceEngineExec"
    ]
  }
}
*/

// ============================================================================
// IMPORTS — ORGANISM CONTEXT + BEACON ENGINE
// ============================================================================

// Expansion / world / region / cluster
import {
  PulseExpansionMeta,
  createPulseExpansion,
  getPulseExpansionContext
} from "../PULSE-EXPANSION/PulseExpansion-v12.3-Presence.js";

// Castle / beacon / console
import {
  PulseCastleMeta,
  createPulseCastle,
  getPulseCastleContext
} from "../PULSE-EXPANSION/PulseCastle-v12.3-Presence.js";
import {
  PulseServerMeta,
  createPulseServer,
  getPulseServerContext
} from "../PULSE-EXPANSION/PulseServer-v12.3-Presence.js";
import {
  PulseRouterMeta,
  createPulseRouter
} from "../PULSE-EXPANSION/PulseRouter-v12.3-Presence.js";

import {
  getBeaconEngineContext
} from "../PULSE-EXPANSION/PulseBeaconEngine-v12.3-Presence.js";
import {
  getConsoleContext
} from "../PULSE-EXPANSION/PulseBeaconConsole-v12.3-Presence.js";

// User lanes
import { getPulseUserContext, createPulseWorldCore } from "../PULSE-EXPANSION/PulseUser-v12.3-Presence.js";

// Mesh organism (symbolic + binary)
import createPulseMesh, {
  PulseMeshMeta
} from "../PULSE-MESH/PulseMesh-v11-Evo.js";
import createBinaryMesh, {
  BinaryMeshMeta
} from "../PULSE-MESH/PulseBinaryMesh-v11-Evo.js";

// Beacon engine (concrete engine type, optional direct use)
import PulseBeaconEngine from "../PULSE-EXPANSION/PulseBeaconEngine-v12.3-Presence.js";

// Touch / presence
import { getPulseTouchContext } from "../../PULSE-UI/PULSE-TOUCH.js";

// Net / connectivity
import { getPulseNetContext } from "../../PULSE-UI/_BACKEND/PULSE-NET.js";

// Runtime (hot instances / regions / presence / modes / pages)
import { getPulseRuntimeContext } from "../PULSE-X/PulseRuntime-v2-Evo.js";

// Scheduler (macro ticks / policies / world-lens stop conditions)
import { getPulseSchedulerContext } from "../PULSE-X/PulseScheduler-v2.js";

// Overmind (world-lens / safety / persona mix)
import { getPulseOvermindContext } from "../PULSE-AI/aiOvermindPrime.js";

// Proxy context (IMMORTAL dual-band envelope)
import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";

// ============================================================================
// META
// ============================================================================

export const PulseBeaconMeshMeta = Object.freeze({
  layer: "BeaconMesh",
  role: "LOCAL_MEMBRANE_SIMULATOR",
  version: "v16-IMMORTAL-ORGANISM",
  identity: "PulseBeaconMesh-v16-IMMORTAL-ORGANISM",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroEval: true,
    zeroDynamicImports: true,
    zeroMutation: true,
    zeroExternalMutation: true,

    meshAware: true,
    presenceFieldAware: true,
    bandAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    multiInstanceReady: true,
    regionAware: true,
    castleAware: true,
    expansionAware: true,
    routerAware: true,
    meshPressureAware: true,
    presenceTierAware: true,
    advantageBandAware: true,
    chunkPlanAware: true,
    pulseTouchAware: true,
    pulseNetAware: true,
    runtimeAware: true,
    schedulerAware: true,
    overmindAware: true,
    meshOrganismAware: true,
    proxyAware: true
  })
});

// ============================================================================
// INTERNAL HELPERS (symbolic only)
// ============================================================================

function stableHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `bm${h}`;
}

function buildOrganismContext() {
  const expansion = getPulseExpansionContext?.() || {};
  const castle = getPulseCastleContext?.() || {};
  const beaconEngineCtx = getBeaconEngineContext?.() || {};
  const consoleCtx = getConsoleContext?.() || {};
  const server = getPulseServerContext?.() || {};
  const user = getPulseUserContext?.() || {};
  const touch = getPulseTouchContext?.() || {};
  const net = getPulseNetContext?.() || {};
  const runtime = getPulseRuntimeContext?.() || {};
  const scheduler = getPulseSchedulerContext?.() || {};
  const overmind = getPulseOvermindContext?.() || {};

  return {
    expansion,
    castle,
    beaconEngineCtx,
    console: consoleCtx,
    server,
    user,
    touch,
    net,
    runtime,
    scheduler,
    overmind,
    meshMeta: PulseMeshMeta,
    binaryMeshMeta: BinaryMeshMeta,
    expansionMeta: PulseExpansionMeta,
    castleMeta: PulseCastleMeta,
    serverMeta: PulseServerMeta,
    routerMeta: PulseRouterMeta,
    proxy: getProxyContext?.() || null
  };
}

function buildScenarioProfile({
  densityHint = "medium",
  demandHint = "medium",
  regionType = "venue",
  meshStatus = "unknown",
  presenceTier = "normal",
  advantageBand = "neutral",
  fallbackBandLevel = null
} = {}) {
  return Object.freeze({
    densityHint,
    demandHint,
    regionType,
    meshStatus,
    presenceTier,
    advantageBand,
    fallbackBandLevel,
    scenarioSignature: stableHash(
      `SCENARIO::${densityHint}::${demandHint}::${regionType}::${meshStatus}::${presenceTier}::${advantageBand}::${fallbackBandLevel}`
    )
  });
}

// ============================================================================
// ORGAN: PulseBeaconMesh (v16-IMMORTAL-ORGANISM)
// ============================================================================

export function PulseBeaconMesh({
  beacon,
  meshID = null,
  regionID = null,
  trace = false
} = {}) {
  if (!beacon) {
    throw new Error("PulseBeaconMesh requires a Beacon Engine instance");
  }

  const log = (...args) => trace && console.log("[PulseBeaconMesh v16]", ...args);

  const snapshotMeta = Object.freeze({
    engineIdentity: beacon?.meta?.identity ?? null,
    engineVersion: beacon?.meta?.version ?? null,
    engineLayer: beacon?.meta?.layer ?? null,
    engineRole: beacon?.meta?.role ?? null
  });

  // Optional: local mesh organism view for this beacon membrane
  const localMesh =
    createPulseMesh?.({
      meshID: meshID || "beacon-mesh",
      regionID,
      trace: false
    }) || null;

  const binaryMesh =
    createBinaryMesh?.({
      meshID: meshID || "beacon-binary-mesh",
      regionID,
      trace: false
    }) || null;

  // --------------------------------------------------------------------------
  // COMPOSITE FIELD (symbolic composition of presence/band/advantage/chunk+proxy)
  // --------------------------------------------------------------------------
  function buildCompositeField() {
    const presenceField = beacon.buildPresenceField?.() ?? null;
    const bandField = beacon.buildBandField?.() ?? null;
    const advantageField = beacon.buildAdvantageField?.() ?? null;
    const chunkPrewarmField = beacon.buildChunkPrewarmField?.() ?? null;

    const presenceTier =
      presenceField?.presenceTier ??
      presenceField?.routerPresence ??
      presenceField?.bandPresence ??
      "unknown";

    const advantageBand =
      advantageField?.advantageBand ??
      advantageField?.band ??
      "neutral";

    const meshStrength =
      presenceField?.meshPresence ??
      presenceField?.meshStrength ??
      "unknown";

    const meshPressureIndex =
      presenceField?.meshPressureIndex ??
      advantageField?.meshPressureIndex ??
      null;

    const chunkPriority =
      chunkPrewarmField?.priority ??
      chunkPrewarmField?.planPriority ??
      null;

    // Proxy overlay (IMMORTAL dual-band envelope)
    const proxyPressure = getProxyPressure?.() ?? 0;
    const proxyFallback = !!getProxyFallback?.();
    const proxyBoost = getProxyBoost?.() ?? 0;
    const proxyMode = getProxyMode?.() ?? "normal";
    const proxyLineage = getProxyLineage?.() ?? null;

    const organismCtx = buildOrganismContext();

    return Object.freeze({
      presenceField,
      bandField,
      advantageField,
      chunkPrewarmField,
      presenceTier,
      advantageBand,
      meshStrength,
      meshPressureIndex,
      chunkPriority,

      proxyPressure,
      proxyFallback,
      proxyBoost,
      proxyMode,
      proxyLineage,

      organismContext: organismCtx,
      compositeSignature: stableHash(
        `COMPOSITE::${presenceTier}::${advantageBand}::${meshStrength}::${meshPressureIndex}::${chunkPriority}::${proxyMode}::${proxyPressure}`
      )
    });
  }

  // --------------------------------------------------------------------------
  // REGIONING SIGNATURE
  // --------------------------------------------------------------------------
  function getRegioningSignature() {
    if (typeof beacon.getRegioningSignature === "function") {
      return beacon.getRegioningSignature();
    }
    return beacon?.meta?.regioningPhysicsSignature ?? null;
  }

  // --------------------------------------------------------------------------
  // MULTI-INSTANCE VIEW
  // --------------------------------------------------------------------------
  function getMultiInstanceView() {
    if (typeof beacon.getMultiInstanceSnapshot === "function") {
      return beacon.getMultiInstanceSnapshot();
    }
    const snap = beacon.getStateSnapshot?.();
    return {
      snapshot: snap,
      note:
        "Engine does not expose explicit multi-instance snapshot; returning generic state snapshot."
    };
  }

  // --------------------------------------------------------------------------
  // PRESET SCENARIOS (symbolic only, organism-aware)
  // --------------------------------------------------------------------------
  function simulateScenarioPreset(preset = "default") {
    const ctx = buildOrganismContext();
    const touch = ctx.touch || {};
    const net = ctx.net || {};
    const expansion = ctx.expansion || {};

    switch (preset) {
      case "home_low":
        return simulate({
          densityHint: "low",
          demandHint: "low",
          regionType: "home",
          meshStatus: "stable",
          presenceTier: touch.presenceTier || "normal",
          advantageBand: touch.advantageBand || "neutral",
          fallbackBandLevel: touch.fallbackBandLevel ?? null
        });
      case "venue_peak":
        return simulate({
          densityHint: "high",
          demandHint: "high",
          regionType: "venue",
          meshStatus: "strong",
          presenceTier: touch.presenceTier || "elevated",
          advantageBand: touch.advantageBand || "advantaged",
          fallbackBandLevel: touch.fallbackBandLevel ?? 0
        });
      case "campus_burst":
        return simulate({
          densityHint: "high",
          demandHint: "burst",
          regionType: "campus",
          meshStatus: "stable",
          presenceTier: touch.presenceTier || "normal",
          advantageBand: touch.advantageBand || "neutral",
          fallbackBandLevel: touch.fallbackBandLevel ?? 0
        });
      case "city_overloaded":
        return simulate({
          densityHint: "peak",
          demandHint: "high",
          regionType: "city",
          meshStatus: "overloaded",
          presenceTier: touch.presenceTier || "stressed",
          advantageBand: touch.advantageBand || "constrained",
          fallbackBandLevel: touch.fallbackBandLevel ?? 1
        });
      case "expansion_region":
        return simulate({
          densityHint: expansion.densityHint || "medium",
          demandHint: expansion.demandHint || "medium",
          regionType: expansion.regionType || "venue",
          meshStatus: net.meshStatus || "unknown",
          presenceTier: touch.presenceTier || "normal",
          advantageBand: touch.advantageBand || "neutral",
          fallbackBandLevel: touch.fallbackBandLevel ?? null
        });
      default:
        return simulate({});
    }
  }

  function simulateBatch(scenarios = []) {
    if (!Array.isArray(scenarios) || scenarios.length === 0) return [];
    return Object.freeze(
      scenarios.map((s) => {
        const profile = buildScenarioProfile(s || {});
        const result = simulate({
          densityHint: profile.densityHint,
          demandHint: profile.demandHint,
          regionType: profile.regionType,
          meshStatus: profile.meshStatus,
          presenceTier: profile.presenceTier,
          advantageBand: profile.advantageBand,
          fallbackBandLevel: profile.fallbackBandLevel
        });
        return { profile, result };
      })
    );
  }

  // --------------------------------------------------------------------------
  // CORE SIMULATION SURFACE (delegates to beacon)
  // --------------------------------------------------------------------------
  function simulate({
    densityHint = "medium",
    demandHint = "medium",
    regionType = "venue",
    meshStatus = "unknown",
    presenceTier = "normal",
    advantageBand = "neutral",
    fallbackBandLevel = null
  } = {}) {
    const profile = buildScenarioProfile({
      densityHint,
      demandHint,
      regionType,
      meshStatus,
      presenceTier,
      advantageBand,
      fallbackBandLevel
    });

    log("Simulate scenario:", profile);

    const result = beacon.broadcastOnce({
      densityHint: profile.densityHint,
      demandHint: profile.demandHint,
      regionType: profile.regionType,
      meshStatus: profile.meshStatus
    });

    return Object.freeze({
      profile,
      result
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC ORGAN SURFACE
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: PulseBeaconMeshMeta,
    engineMeta: snapshotMeta,
    meshIdentity: binaryMesh?.identity || localMesh?.identity || null,

    simulate,
    simulateScenarioPreset,
    simulateBatch,
    buildScenarioProfile,

    getTelemetry() {
      return beacon.getTelemetry?.() ?? null;
    },

    getSnapshot() {
      const engineSnapshot = beacon.getStateSnapshot?.() ?? null;
      return Object.freeze({
        engineSnapshot,
        composite: buildCompositeField()
      });
    },

    getPresenceField() {
      return beacon.buildPresenceField?.() ?? null;
    },

    getBandField() {
      return beacon.buildBandField?.() ?? null;
    },

    getAdvantageField() {
      return beacon.buildAdvantageField?.() ?? null;
    },

    getChunkPrewarmField() {
      return beacon.buildChunkPrewarmField?.() ?? null;
    },

    getCompositeField: buildCompositeField,

    getRegioningSignature,
    getMultiInstanceView
  });
}

export default PulseBeaconMesh;
