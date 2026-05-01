// ============================================================================
// PULSE-WORLD : PulseUser-v12.3-Presence.js
// ORGAN TYPE: Local OS / Experience Orchestrator
// VERSION: v13-PRESENCE-EVO+ (Hybrid, Every-Advantage, Context-Aware, Brain-Aware)
// ============================================================================

// PRIMARY OS / BINARY OS PULLER
// This is the thing that actually knows how to boot brains / runtimes.
// Swap this line to PulseOS-v11-Evo.js if that's your primary.
import * as PulseBinaryOS from "../PULSE-OS/PulseBinaryOS-v11-Evo-Max.js";

// ============================================================================

export const PulseWorldCoreMeta = Object.freeze({
  organId: "PulseWorldCore-v13-PRESENCE-EVO+",
  role: "LOCAL_OS",
  version: "13-PRESENCE-EVO+",
  epoch: "v13-PRESENCE-EVO+",
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
    osBrainAware: true, // still true: we see brain via primary OS / binary OS puller
    userAttachedToBrain: true,
    serverAttachedToUser: true
  })
});

// ============================================================================
// FACTORY: createPulseWorldCore — v13-PRESENCE-EVO+
// ============================================================================

export function createPulseWorldCore({
  regionID = null,
  trace = false,
  serverMode = false
} = {}) {

  // 1. Identity
  const Identity = Object.freeze({
    coreID: "PulseWorldCore",
    version: "v13-PRESENCE-EVO+",
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

  // This is now the "primary OS / binary OS puller" attachment.
  // It may internally own OSBrain + runtimes.
  let primaryOSSnapshot = null; // PulseBinaryOS / PulseOS
  let runtimeSnapshot = null;   // Runtime / Brainstem (if you still attach it separately)

  // Core user/world context we pass into brain / mesh / others
  const userContext = Object.freeze({
    identity: Identity,
    regionID,
    serverMode,
    trace
  });

  function attachBeacon(snapshot) {
    beaconSnapshot = snapshot;

    // allow beacon to see world core if it wants
    if (snapshot && typeof snapshot.attachWorldCore === "function") {
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

    if (snapshot && typeof snapshot.attachWorldCore === "function") {
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

    if (snapshot && typeof snapshot.attachWorldCore === "function") {
      snapshot.attachWorldCore({
        identity: Identity,
        buildAdvantageContext,
        getSnapshot
      });
    }

    return { ok: true };
  }

  function attachMesh(snapshot) {
    meshSnapshot = snapshot;

    // Mesh gets explicit user/world attachment
    if (snapshot && typeof snapshot.attachUser === "function") {
      snapshot.attachUser(userContext);
    }
    if (snapshot && typeof snapshot.attachWorldCore === "function") {
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

    if (snapshot && typeof snapshot.attachWorldCore === "function") {
      snapshot.attachWorldCore({
        identity: Identity,
        buildAdvantageContext,
        getSnapshot
      });
    }

    return { ok: true };
  }

  // Attach primary OS (PulseBinaryOS / PulseOS)
  function attachPrimaryOS(snapshot) {
    primaryOSSnapshot = snapshot;

    // let OS see user/world context if it supports it
    if (snapshot && typeof snapshot.attachWorldCore === "function") {
      snapshot.attachWorldCore({
        identity: Identity,
        getSnapshot,
        buildAdvantageContext,
        computeAdaptiveUI
      });
    }

    return { ok: true };
  }

  // Keep runtime attachment if you still want direct runtime view
  function attachRuntime(snapshot) {
    runtimeSnapshot = snapshot;

    // explicit user → brain attachment
    if (snapshot && typeof snapshot.attachUserContext === "function") {
      snapshot.attachUserContext(userContext);
    }
    if (snapshot && typeof snapshot.attachWorldCore === "function") {
      snapshot.attachWorldCore({
        identity: Identity,
        getSnapshot,
        buildAdvantageContext,
        computeAdaptiveUI
      });
    }

    return { ok: true };
  }

  // If running under server, auto‑attach the primary OS module we imported.
  // No brain boot here — primary OS handles that internally.
  if (serverMode === true) {
    attachPrimaryOS(PulseBinaryOS);
  }

  // 3. Boot Sequence
  const Boot = {
    A_triggers: {
      fromBeaconTap: true,
      fromLocalShortcut: true,
      fromServerSession: serverMode === true
    },
    B_contextAwareness: {
      readRegionFromBeacon: true,
      readCastlePresenceFromExpansion: true,
      readMeshStrengthFromMesh: true,
      readPresenceFieldFromBeacon: true,
      readAdvantageFieldFromBeacon: true
    },
    A_contracts: {
      mustRequireUserOptIn: true,
      mustRespectSafetyFrame: true
    }
  };

  // 4. Experience Shell
  const Experience = {
    A_layout: {
      hasLocalDashboard: true,
      hasToolsTray: true,
      hasEvolutionPanel: true,
      hasBrainPanel: true
    },
    B_adaptiveUI: {
      densityAwareUI: true,
      meshStrengthIndicators: true,
      castlePresenceIndicators: true,
      presenceFieldIndicators: true,
      advantageBandIndicators: true,
      fallbackBandIndicators: true,
      routeHealthIndicators: true,
      runtimeHealthIndicators: true,
      osBrainHealthIndicators: true // via primary OS view
    },
    A_tools: {
      defaultTools: ["MyDay", "MyTools", "Evolution", "LocalPulse"],
      offlineFirst: true
    }
  };

  // 5. Routing Integration
  function requestRoute(request) {
    if (!routerSnapshot) {
      return { ok: false, reason: "router-not-attached" };
    }
    return routerSnapshot.decideRoute(request);
  }

  // 6. Advantage Aggregation
  function buildAdvantageContext() {
    return Object.freeze({
      presenceField: beaconSnapshot?.presenceField || null,
      advantageField: beaconSnapshot?.advantageField || null,
      meshStrength: meshSnapshot?.densityHealth?.A_metrics?.meshStrength || "unknown",
      meshPressureIndex: meshSnapshot?.densityHealth?.A_metrics?.meshPressureIndex || 0,
      castleLoadLevel: castleSnapshot?.state?.loadLevel || "unknown",
      routeStable: expansionSnapshot?.routeField?.routeStable ?? null,
      fallbackBandLevel: beaconSnapshot?.globalHints?.fallbackBandLevel ?? 0
    });
  }

  // 7. Brain / Runtime View (direct runtime, if attached)
  function getBrainView() {
    if (runtimeSnapshot?.getRuntimeStateV2) {
      return runtimeSnapshot.getRuntimeStateV2();
    }
    return null;
  }

  // 8. Primary OS / OSBrain View (read-only, via primary OS)
  // Expect primaryOSSnapshot to expose something like getOSState / getBrainState.
  function getPrimaryOSView() {
    if (primaryOSSnapshot?.getOSState) {
      return primaryOSSnapshot.getOSState();
    }
    if (primaryOSSnapshot?.getOSBrainState) {
      return primaryOSSnapshot.getOSBrainState();
    }
    return null;
  }

  // 9. Ask primary OS to spin a brain/runtime (delegated)
  // This is the “server spins something that spins brains” hook,
  // now correctly routed through the primary OS / binary OS puller,
  // and enriched with user attachment.
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

  // 10. Adaptive UI Logic
  function computeAdaptiveUI() {
    const ctx = buildAdvantageContext();
    const brain = getBrainView();
    const primaryOS = getPrimaryOSView();

    const runtimeHealthy =
      brain &&
      typeof brain.tick === "number" &&
      brain.tick >= 0;

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
      showOSBrainWarning: primaryOS && !osBrainHealthy
    });
  }

  // 11. Telemetry
  const Telemetry = {
    metrics: {
      sessionsStarted: 0,
      localSessions: 0,
      remoteSessions: 0
    }
  };

  // 12. Snapshot
  function getSnapshot() {
    return Object.freeze({
      organId: PulseWorldCoreMeta.organId,
      identity: Identity,
      boot: Boot,
      experience: Experience,
      attached: {
        beacon: beaconSnapshot,
        router: routerSnapshot,
        castle: castleSnapshot,
        mesh: meshSnapshot,
        expansion: expansionSnapshot,
        primaryOS: primaryOSSnapshot, // primary OS / binary OS puller
        runtime: runtimeSnapshot
      },
      advantageContext: buildAdvantageContext(),
      brainView: getBrainView(),
      primaryOSView: getPrimaryOSView(),
      adaptiveUI: computeAdaptiveUI(),
      telemetry: Telemetry
    });
  }

  // 13. Public API
  return Object.freeze({
    meta: PulseWorldCoreMeta,
    identity: Identity,

    // attachments
    attachBeacon,
    attachRouter,
    attachCastle,
    attachMesh,
    attachExpansion,
    attachPrimaryOS,
    attachRuntime,

    // routing
    requestRoute,

    // experience
    computeAdaptiveUI,
    buildAdvantageContext,

    // brain/runtime
    getBrainView,
    getPrimaryOSView,
    requestBrainInstance,

    // introspection
    getSnapshot
  });
}

export default createPulseWorldCore;
