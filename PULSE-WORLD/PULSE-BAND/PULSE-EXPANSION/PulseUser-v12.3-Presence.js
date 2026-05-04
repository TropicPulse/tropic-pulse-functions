// ============================================================================
// PULSE-WORLD : PulseUser-v12.3-Presence.js
// ORGAN TYPE: Local OS / Experience Orchestrator
// VERSION: v16-IMMORTAL-ORGANISM (Hybrid, Every-Advantage, Brain-Aware, Server-Attachable)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseUser",
  version: "v16-IMMORTAL-ORGANISM",
  layer: "presence_user",
  role: "presence_user_core",
  lineage: "PulseUser-v9 → v12.3-PRESENCE-EVO+ → v15-IMMORTAL → v16-IMMORTAL-ORGANISM",

  evo: {
    userCore: true,
    presenceAware: true,
    bluetoothAware: true,
    meshAware: true,
    regionAware: true,
    advantageBand: true,
    fallbackBand: true,

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
      "PulseBeaconEngine",
      "PulseBeaconMesh",
      "PulseExpansion",
      "PulseCastle",
      "PulseMesh",
      "PulseServer",
      "PulseRouter"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// IMPORTS — OS / Mesh / Castle / Server / Router / Expansion / Band
// ============================================================================

// Primary OS / Binary OS (OSBrain + runtimes)
import * as PulseBinaryOS from "../PULSE-OS/PulseBinaryOS-v11-Evo-Max.js";

// Mesh + BeaconMesh meta
import { PulseMeshMeta, createPulseMesh } from "../PULSE-MESH/PulseMesh-v11-Evo.js";
import { PulseBeaconMeshMeta, PulseBeaconMesh } from "../PULSE-EXPANSION/PulseBeaconMesh-v12.3-Presence.js";
import { PulseExpansionMeta, createPulseExpansion } from "../PULSE-EXPANSION/PulseExpansion-v12.3-Presence.js";
import { PulseCastleMeta, createPulseCastle } from "../PULSE-EXPANSION/PulseCastle-v12.3-Presence.js";
import { PulseServerMeta, createPulseServer } from "../PULSE-EXPANSION/PulseServer-v12.3-Presence.js";
import { PulseRouterMeta, createPulseRouter } from "../PULSE-EXPANSION/PulseRouter-v12.3-Presence.js";
// Earn / Band / BinarySend
import { getEarnContext, evolveEarn, createEarn } from "../PULSE-EARN/PulseEarn-v12.3-Presence.js";
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v11-Evo.js";
import { createBinarySend as PulseSendBin } from "../PULSE-SEND/PulseBinarySend-v11-EVO.js";

// PROXY CONTEXT — v16 IMMORTAL ORGANISM
import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";

// ============================================================================
// META — PulseWorldCore
// ============================================================================

export const PulseWorldCoreMeta = Object.freeze({
  organId: "PulseWorldCore-v16-IMMORTAL-ORGANISM",
  role: "LOCAL_OS",
  version: "v16-IMMORTAL-ORGANISM",
  epoch: "v16-IMMORTAL-ORGANISM",
  layer: "Experience",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true
  }),
  evo: Object.freeze({
    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    meshPressureAware: true,
    routeAware: true,
    castleAware: true,
    expansionAware: true,
    dualbandSafe: true,
    runtimeAware: true,
    osBrainAware: true,
    userAttachedToBrain: true,
    serverAttachedToUser: true,
    meshOrganismAware: true,
    beaconMeshAware: true,
    serverExecAware: true,
    routerAware: true,
    earnAware: true,
    bandAware: true,
    binarySendAware: true,
    proxyAware: true
  })
});

// ============================================================================
// FACTORY: createPulseWorldCore — v16 IMMORTAL ORGANISM
// ============================================================================

export function createPulseWorldCore({
  regionID = null,
  trace = false,
  serverMode = false
} = {}) {

  // 1. Identity
  const Identity = Object.freeze({
    coreID: "PulseWorldCore",
    version: "v16-IMMORTAL-ORGANISM",
    createdBy: "PulseOS",
    regionID,
    serverMode
  });

  // 2. Attached Organ Snapshots
  let beaconSnapshot = null;
  let routerSnapshot = null;
  let castleSnapshot = null;
  let meshSnapshot = null;
  let expansionSnapshot = null;

  let serverBridgeSnapshot = null;
  let serverExecSnapshot = null;

  let primaryOSSnapshot = null;
  let runtimeSnapshot = null;

  let dualBandOrganism = null;
  let binarySend = null;

  const userContext = Object.freeze({
    identity: Identity,
    regionID,
    serverMode,
    trace
  });

  // ---------------------------------------------------------------------------
  // ATTACHMENTS
  // ---------------------------------------------------------------------------

  function attachBeacon(snapshot) {
    beaconSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        getSnapshot,
        buildAdvantageContext
      });
    }
    return { ok: true };
  }

  function attachRouter(snapshot) {
    routerSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        requestRoute,
        getSnapshot
      });
    }
    return { ok: true };
  }

  function attachCastle(snapshot) {
    castleSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        buildAdvantageContext,
        getSnapshot,
        handleBrainNetworkIntent
      });
    }
    return { ok: true };
  }

  function attachMesh(snapshot) {
    meshSnapshot = snapshot;
    if (snapshot?.attachUser) snapshot.attachUser(userContext);
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        buildAdvantageContext,
        getSnapshot
      });
    }
    return { ok: true };
  }

  function attachExpansion(snapshot) {
    expansionSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        buildAdvantageContext,
        getSnapshot,
        handleBrainNetworkIntent
      });
    }
    return { ok: true };
  }

  function attachServerBridge(snapshot) {
    serverBridgeSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        userContext,
        getSnapshot
      });
    }
    return { ok: true };
  }

  function attachServerExec(snapshot) {
    serverExecSnapshot = snapshot;
    return { ok: true };
  }

  function attachPrimaryOS(snapshot) {
    primaryOSSnapshot = snapshot;
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        getSnapshot,
        buildAdvantageContext,
        computeAdaptiveUI,
        handleBrainNetworkIntent
      });
    }
    return { ok: true };
  }

  function attachRuntime(snapshot) {
    runtimeSnapshot = snapshot;
    if (snapshot?.attachUserContext) snapshot.attachUserContext(userContext);
    if (snapshot?.attachWorldCore) {
      snapshot.attachWorldCore({
        identity: Identity,
        getSnapshot,
        buildAdvantageContext,
        computeAdaptiveUI,
        handleBrainNetworkIntent
      });
    }
    return { ok: true };
  }

  function attachDualBand({ organism, send } = {}) {
    dualBandOrganism = organism || dualBandOrganism;
    binarySend = send || binarySend;
    return { ok: true };
  }

  // Auto-attach OS + dualband in server mode
  if (serverMode === true) {
    attachPrimaryOS(PulseBinaryOS);
    try { dualBandOrganism = PulseBinaryOrganismBoot?.({ trace: false }) || null; } catch {}
    try { binarySend = PulseSendBin?.({ trace: false }) || null; } catch {}
  }

  // ---------------------------------------------------------------------------
  // ROUTING
  // ---------------------------------------------------------------------------

  function requestRoute(request) {
    if (!routerSnapshot) return { ok: false, reason: "router-not-attached" };
    return routerSnapshot.decideRoute(request);
  }

  // ---------------------------------------------------------------------------
  // ADVANTAGE CONTEXT (FULLY UPGRADED + PROXY INTEGRATED)
// ---------------------------------------------------------------------------

  function buildAdvantageContext() {
    const earn = getEarnContext?.() || {};

    return Object.freeze({
      presenceField: beaconSnapshot?.presenceField || null,
      advantageField: beaconSnapshot?.advantageField || null,

      meshStrength: meshSnapshot?.densityHealth?.A_metrics?.meshStrength || "unknown",
      meshPressureIndex: meshSnapshot?.densityHealth?.A_metrics?.meshPressureIndex || 0,

      castleLoadLevel: castleSnapshot?.state?.loadLevel || "unknown",
      routeStable: expansionSnapshot?.routeField?.routeStable ?? null,
      fallbackBandLevel: beaconSnapshot?.globalHints?.fallbackBandLevel ?? 0,

      earnContext: earn || null,

      meshMeta: PulseMeshMeta || null,
      beaconMeshMeta: PulseBeaconMeshMeta || null,
      castleMeta: PulseCastleMeta || null,
      serverMeta: PulseServerMeta || null,
      routerMeta: PulseRouterMeta || null,
      expansionMeta: PulseExpansionMeta || null,

      // ⭐ PROXY INTEGRATION — v16 IMMORTAL
      proxy: getProxyContext(),
      proxyPressure: getProxyPressure(),
      proxyBoost: getProxyBoost(),
      proxyFallback: getProxyFallback(),
      proxyMode: getProxyMode(),
      proxyLineage: getProxyLineage()
    });
  }

  // ---------------------------------------------------------------------------
  // ADAPTIVE UI (FULLY UPGRADED + PROXY AWARE)
// ---------------------------------------------------------------------------

  function computeAdaptiveUI() {
    const ctx = buildAdvantageContext();
    const brain = getBrainView();
    const primaryOS = getPrimaryOSView();

    const runtimeHealthy =
      brain && typeof brain.tick === "number" && brain.tick >= 0;

    const osBrainHealthy =
      primaryOS &&
      (primaryOS.status === "healthy" || primaryOS.osBrainStatus === "healthy");

    return Object.freeze({
      showMeshWarning: ctx.meshPressureIndex >= 70,
      showCastleLoadWarning: ctx.castleLoadLevel === "high" || ctx.castleLoadLevel === "critical",
      showRouteUnstableWarning: ctx.routeStable === false,
      showFallbackMode: ctx.fallbackBandLevel >= 2,
      showAdvantageBoost: ctx.advantageField?.advantageBand === "high",

      showRuntimePanel: !!brain,
      showRuntimeWarning: brain && !runtimeHealthy,

      showOSBrainPanel: !!primaryOS,
      showOSBrainWarning: primaryOS && !osBrainHealthy,

      // ⭐ PROXY UI INTEGRATION
      showProxyWarning: ctx.proxyPressure > 0.7,
      showProxyFallback: ctx.proxyFallback === true,
      showProxyBoost: ctx.proxyBoost > 0.5
    });
  }

  // ---------------------------------------------------------------------------
  // BRAIN / RUNTIME VIEW
  // ---------------------------------------------------------------------------

  function getBrainView() {
    return runtimeSnapshot?.getRuntimeStateV2?.() || null;
  }

  function getPrimaryOSView() {
    return (
      primaryOSSnapshot?.getOSState?.() ||
      primaryOSSnapshot?.getOSBrainState?.() ||
      null
    );
  }

  function requestBrainInstance(spawnRequest = {}) {
    if (!primaryOSSnapshot?.spawnRuntimeInstance &&
        !primaryOSSnapshot?.spawnBrainInstance) {
      return { ok: false, reason: "primary-os-spawn-not-available" };
    }

    const enriched = {
      ...spawnRequest,
      userContext,
      worldCoreIdentity: Identity
    };

    if (primaryOSSnapshot.spawnRuntimeInstance) {
      return primaryOSSnapshot.spawnRuntimeInstance(enriched);
    }
    return primaryOSSnapshot.spawnBrainInstance(enriched);
  }

  // ---------------------------------------------------------------------------
  // BRAIN NETWORK INTENT
  // ---------------------------------------------------------------------------

  function handleBrainNetworkIntent(intent) {
    if (!intent || intent.intent !== "network-request") {
      return { ok: false, reason: "invalid-intent" };
    }

    if (expansionSnapshot?.handleBrainNetworkIntent) {
      return expansionSnapshot.handleBrainNetworkIntent({
        intent,
        userContext,
        worldCoreIdentity: Identity,
        serverBridge: serverBridgeSnapshot,
        serverExec: serverExecSnapshot,
        dualBandOrganism,
        binarySend
      });
    }

    if (castleSnapshot?.handleBrainNetworkIntent) {
      return castleSnapshot.handleBrainNetworkIntent({
        intent,
        userContext,
        worldCoreIdentity: Identity,
        serverBridge: serverBridgeSnapshot,
        serverExec: serverExecSnapshot,
        dualBandOrganism,
        binarySend
      });
    }

    if (serverBridgeSnapshot?.handleBrainNetworkIntent) {
      return serverBridgeSnapshot.handleBrainNetworkIntent({
        intent,
        userContext,
        worldCoreIdentity: Identity,
        serverExec: serverExecSnapshot,
        dualBandOrganism,
        binarySend
      });
    }

    return { ok: false, reason: "no-brain-network-handler" };
  }

  // ---------------------------------------------------------------------------
  // SNAPSHOT
  // ---------------------------------------------------------------------------

  function getSnapshot() {
    return Object.freeze({
      organId: PulseWorldCoreMeta.organId,
      identity: Identity,

      attached: {
        beacon: beaconSnapshot,
        router: routerSnapshot,
        castle: castleSnapshot,
        mesh: meshSnapshot,
        expansion: expansionSnapshot,
        primaryOS: primaryOSSnapshot,
        runtime: runtimeSnapshot,
        serverBridge: serverBridgeSnapshot,
        serverExec: serverExecSnapshot,
        dualBandOrganism,
        binarySend
      },

      advantageContext: buildAdvantageContext(),
      adaptiveUI: computeAdaptiveUI(),
      brainView: getBrainView(),
      primaryOSView: getPrimaryOSView()
    });
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  return Object.freeze({
    meta: PulseWorldCoreMeta,
    identity: Identity,

    attachBeacon,
    attachRouter,
    attachCastle,
    attachMesh,
    attachExpansion,
    attachPrimaryOS,
    attachRuntime,
    attachServerBridge,
    attachServerExec,
    attachDualBand,

    requestRoute,
    computeAdaptiveUI,
    buildAdvantageContext,

    getBrainView,
    getPrimaryOSView,
    requestBrainInstance,

    handleBrainNetworkIntent,

    getSnapshot
  });
}

export default createPulseWorldCore;
