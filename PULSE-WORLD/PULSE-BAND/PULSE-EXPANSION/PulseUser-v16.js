// ============================================================================
// PULSE-WORLD : PulseUser-v16-Immortal-ORGANISM-JuryReady.js
// ORGAN TYPE: Local OS / Experience Orchestrator / Citizen Witness
// VERSION: v16-Immortal-ORGANISM (Hybrid, Every-Advantage, Brain-Aware, Server-Attachable, Jury-Ready)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseUser",
  version: "v16-Immortal-ORGANISM-JuryReady",
  layer: "presence_user",
  role: "presence_user_core",
  lineage: "PulseUser-v9 → v12.3-Presence-Evo+ → v15-Immortal → v16-Immortal-ORGANISM → v16-Immortal-ORGANISM-JuryReady",

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
import * as PulseBinaryOS from "../PULSE-OS/PulseBinaryOS-v16.js";

// Mesh + BeaconMesh meta
import { PulseMeshMeta, createPulseMesh } from "../PULSE-MESH/PulseMesh-v16.js";
import { PulseBeaconMeshMeta, PulseBeaconMesh } from "./PulseBeaconMesh-v16.js";

import { PulseCastleMeta, createPulseCastle } from "../PulseCastle-v16.js";
import { PulseServerMeta, createPulseServer } from "./PulseServer-v16.js";
import { PulseRouterMeta, createPulseRouter } from "./PulseRouter-v16.js";
import { PulseExpansionMeta, createPulseExpansion } from "./PulseExpansion-v16.js";
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v16.js";
// Earn / Band / BinarySend
import { getEarnContext, evolveEarn, createEarn } from "../PULSE-EARN/PulseEarn-v16.js";

import { createBinarySend as PulseSendBin } from "../PULSE-SEND/PulseBinarySend-v16.js";

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
  organId: "PulseWorldCore-v16-Immortal-ORGANISM-JuryReady",
  role: "LOCAL_OS",
  version: "v16-Immortal-ORGANISM-JuryReady",
  epoch: "v16-Immortal-ORGANISM",
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
    proxyAware: true,

    // ⭐ Jury-ready extensions
    juryAware: true,
    citizenWitnessAware: true,
    behaviorPatternAware: true,
    aiOriginEchoAware: true,
    socialAnomalyAware: true,
    timelineFlowAware: true
  })
});

// ============================================================================
// FACTORY: createPulseWorldCore — v16 IMMORTAL ORGANISM JURY-READY
// ============================================================================

export function createPulseWorldCore({
  regionID = null,
  trace = false,
  serverMode = false
} = {}) {

  // 1. Identity
  const Identity = Object.freeze({
    coreID: "PulseWorldCore",
    version: "v16-Immortal-ORGANISM-JuryReady",
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
  // JURY-READY INTERNAL STATE (DETERMINISTIC, IN-MEMORY ONLY)
  // ---------------------------------------------------------------------------

  const MAX_EVENTS = 256;
  const MAX_ANOMALIES = 128;
  const MAX_DECISIONS = 128;

  const interactionLog = [];
  const anomalyLog = [];
  const decisionTimeline = [];

  function pushBounded(list, item, max) {
    list.push(item);
    if (list.length > max) list.shift();
  }

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
  // JURY-READY: CITIZEN WITNESS + PATTERN / FLOW / AI-ORIGIN DETECTION
  // ---------------------------------------------------------------------------

  /**
   * Record a local user / social / behavioral event.
   * This is the primary feed into Jury for social pattern analysis.
   *
   * event = {
   *   type: "chat" | "decision" | "identity" | "anomaly" | "ai_echo" | ...,
   *   userId,
   *   role,          // "juror" | "participant" | "observer" | ...
   *   content,       // opaque, no mutation
   *   aiOrigin: bool,
   *   contextHash,   // stable hash of prior context (optional)
   *   timestamp,     // ms since epoch (provided by caller, not generated here)
   *   tag            // optional string tag
   * }
   */
  function recordUserEvent(event) {
    if (!event || typeof event !== "object") {
      return { ok: false, reason: "invalid-event" };
    }

    const safeEvent = Object.freeze({
      type: event.type || "unknown",
      userId: event.userId || null,
      role: event.role || null,
      content: event.content ?? null,
      aiOrigin: event.aiOrigin === true,
      contextHash: event.contextHash || null,
      timestamp: event.timestamp ?? null,
      tag: event.tag || null
    });

    pushBounded(interactionLog, safeEvent, MAX_EVENTS);
    return { ok: true };
  }

  /**
   * Record a decision that will later be used for jury-flow / timeline analysis.
   *
   * decision = {
   *   decisionId,
   *   stageIndex,          // 0,1,2,... (early decisions vs later)
   *   userId,
   *   aiOrigin: bool,
   *   contextHash,
   *   verdictSummary,
   *   timestamp
   * }
   */
  function recordDecision(decision) {
    if (!decision || typeof decision !== "object") {
      return { ok: false, reason: "invalid-decision" };
    }

    const safeDecision = Object.freeze({
      decisionId: decision.decisionId || null,
      stageIndex: typeof decision.stageIndex === "number" ? decision.stageIndex : null,
      userId: decision.userId || null,
      aiOrigin: decision.aiOrigin === true,
      contextHash: decision.contextHash || null,
      verdictSummary: decision.verdictSummary ?? null,
      timestamp: decision.timestamp ?? null
    });

    pushBounded(decisionTimeline, safeDecision, MAX_DECISIONS);
    return { ok: true };
  }

  /**
   * Simple, deterministic behavior pattern summary for Jury:
   * - dominance: who keeps producing final decisions
   * - aiEchoCount: how many events are AI-origin echoes
   * - identityLoops: repeated identity assertions
   */
  function analyzeBehaviorPatterns() {
    const dominanceMap = Object.create(null);
    const identityLoopMap = Object.create(null);
    let aiEchoCount = 0;

    for (const d of decisionTimeline) {
      if (!d || !d.userId) continue;
      dominanceMap[d.userId] = (dominanceMap[d.userId] || 0) + 1;
    }

    for (const e of interactionLog) {
      if (!e) continue;
      if (e.aiOrigin === true) aiEchoCount++;
      if (e.type === "identity" && e.userId) {
        identityLoopMap[e.userId] = (identityLoopMap[e.userId] || 0) + 1;
      }
    }

    const dominantUser = Object.keys(dominanceMap).reduce(
      (best, userId) => {
        const count = dominanceMap[userId];
        if (!best || count > best.count) return { userId, count };
        return best;
      },
      null
    );

    return Object.freeze({
      dominantUser: dominantUser ? dominantUser.userId : null,
      dominantUserDecisionCount: dominantUser ? dominantUser.count : 0,
      aiEchoCount,
      identityLoops: Object.freeze(identityLoopMap)
    });
  }

  /**
   * Detect simple contextual divergence:
   * - proposalContextHash does not match last known contextHash
   * - or proposal is marked as aiOrigin and contextHash is null
   */
  function detectContextDivergence({ proposalContextHash, aiOrigin }) {
    const last = interactionLog.length > 0 ? interactionLog[interactionLog.length - 1] : null;
    const lastHash = last?.contextHash || null;

    const mismatch =
      proposalContextHash &&
      lastHash &&
      proposalContextHash !== lastHash;

    const suspiciousAI =
      aiOrigin === true &&
      !proposalContextHash;

    const divergent = !!(mismatch || suspiciousAI);

    return Object.freeze({
      divergent,
      reason: divergent
        ? (mismatch ? "context-hash-mismatch" : "ai-origin-without-context")
        : null,
      lastContextHash: lastHash,
      proposalContextHash: proposalContextHash || null
    });
  }

  /**
   * Record an anomaly for Jury / Creator:
   * anomaly = {
   *   type: "dominance" | "ai_origin" | "context_divergence" | "flow_error" | ...,
   *   severity: 1|2|3,
   *   details: any,
   *   timestamp
   * }
   */
  function recordAnomaly(anomaly) {
    if (!anomaly || typeof anomaly !== "object") {
      return { ok: false, reason: "invalid-anomaly" };
    }

    const safeAnomaly = Object.freeze({
      type: anomaly.type || "unknown",
      severity: anomaly.severity ?? 1,
      details: anomaly.details ?? null,
      timestamp: anomaly.timestamp ?? null
    });

    pushBounded(anomalyLog, safeAnomaly, MAX_ANOMALIES);
    return { ok: true };
  }

  /**
   * Build a citizen-witness report for aiJury:
   * - local behavior patterns
   * - recent anomalies
   * - recent interactions
   * - decision timeline summary
   */
  function buildCitizenWitnessReport() {
    const patterns = analyzeBehaviorPatterns();

    const decisionsSummary = decisionTimeline.map(d => ({
      decisionId: d.decisionId,
      stageIndex: d.stageIndex,
      userId: d.userId,
      aiOrigin: d.aiOrigin,
      timestamp: d.timestamp
    }));

    const interactionsSummary = interactionLog.map(e => ({
      type: e.type,
      userId: e.userId,
      role: e.role,
      aiOrigin: e.aiOrigin,
      tag: e.tag,
      timestamp: e.timestamp
    }));

    return Object.freeze({
      identity: Identity,
      regionID,
      serverMode,
      patterns,
      decisions: Object.freeze(decisionsSummary),
      interactions: Object.freeze(interactionsSummary),
      anomalies: Object.freeze(anomalyLog.slice())
    });
  }

  /**
   * Build a Jury-ready feed:
   * - advantage context
   * - adaptive UI state
   * - citizen witness report
   * - brain / OS views (for health correlation)
   */
  function buildJuryFeed() {
    return Object.freeze({
      identity: Identity,
      advantageContext: buildAdvantageContext(),
      adaptiveUI: computeAdaptiveUI(),
      brainView: getBrainView(),
      primaryOSView: getPrimaryOSView(),
      citizenWitness: buildCitizenWitnessReport()
    });
  }

  /**
   * Simple flow integrity check:
   * - if earliest decision is aiOrigin and later decisions depend on it,
   *   mark as potential flow error.
   */
  function analyzeJuryFlow() {
    if (decisionTimeline.length === 0) {
      return Object.freeze({
        flowError: false,
        reason: null,
        rootDecisionId: null
      });
    }

    const first = decisionTimeline[0];
    const later = decisionTimeline.slice(1);

    const anyDependOnFirst =
      !!later.find(d => d.contextHash && first.contextHash && d.contextHash === first.contextHash);

    const flowError =
      first.aiOrigin === true && anyDependOnFirst;

    return Object.freeze({
      flowError,
      reason: flowError ? "ai-origin-root-decision-with-downstream-dependents" : null,
      rootDecisionId: first.decisionId || null
    });
  }

  /**
   * Expose a compact Jury snapshot for Creator / aiJury:
   */
  function getJurySnapshot() {
    return Object.freeze({
      identity: Identity,
      patterns: analyzeBehaviorPatterns(),
      flow: analyzeJuryFlow(),
      anomalies: anomalyLog.slice(),
      decisions: decisionTimeline.slice(),
      interactions: interactionLog.slice()
    });
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
      primaryOSView: getPrimaryOSView(),

      // Jury-ready views
      jurySnapshot: getJurySnapshot()
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

    // ⭐ Jury-ready citizen witness + pattern / flow APIs
    recordUserEvent,
    recordDecision,
    recordAnomaly,
    analyzeBehaviorPatterns,
    detectContextDivergence,
    buildCitizenWitnessReport,
    buildJuryFeed,
    analyzeJuryFlow,
    getJurySnapshot,

    getSnapshot
  });
}

export default createPulseWorldCore;
