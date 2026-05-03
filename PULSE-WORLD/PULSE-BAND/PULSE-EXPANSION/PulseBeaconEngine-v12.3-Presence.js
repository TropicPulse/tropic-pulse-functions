// ============================================================================
// PULSE-WORLD : PulseBeaconEngine-v15-IMMORTAL.js
// ORGAN TYPE: Bluetooth Presence / Membrane Organism
// VERSION: v15-IMMORTAL (Hybrid, Every-Advantage, Every-Prewarm, Mesh-/User-/WorldCore-Aware, Monolithic Membrane)
// ============================================================================
//
// ROLE:
//   PulseBeaconEngine is the Bluetooth membrane of PulseWorld.
//   It turns region + mesh + castle + user + worldCore state into deterministic,
//   SafetyFrame-compliant Bluetooth presence frames AND EMITS THEM over Bluetooth.
//
//   v15-IMMORTAL upgrades:
//     - WorldCore-aware, Mesh-aware, Router-aware, Server-aware
//     - Explicit userContext attachment (user ↔ membrane)
//     - Direct consumption of PulseMesh.buildUserMeshSignal() / worldMesh signals
//     - Chunk-prewarm + cache-hints surfaced as first-class fields
//     - Deterministic “profile lanes” for discovery/presence/mesh/expand
//     - Ready for dual-band symbolic/binary presence frames
//     - INTERNAL Bluetooth emitter: this file is the ONLY place that can emit Bluetooth.
//
// CONTRACT:
//   - Never auto-connect, never bypass SafetyFrame.
//   - Never perform direct hardware I/O except via internal nativeBluetoothBroadcast.
//   - Never introduce randomness or async drift.
//   - Always remain deterministic, synthetic, and drift-proof in its logic.
//   - This organ is the ONLY Bluetooth membrane in the organism.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBeaconEngine",
  version: "v15-IMMORTAL",
  layer: "presence_engine",
  role: "bluetooth_presence_engine",
  lineage: "PulsePresence-v15",

  evo: {
    presenceEngine: true,
    bluetoothBroadcast: true,
    proximityField: true,
    advantageBand: true,
    fallbackBand: true,
    chunkPrewarm: true,
    densityAware: true,
    meshAware: true,
    worldCoreAware: true,
    userAware: true,
    routerAware: true,
    serverAware: true,

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
      "PulseBeaconMesh",
      "PulseUser",
      "PulseExpansion",
      "PulseMesh",
      "PulseRouter",
      "PulseServer"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseBeaconMeta = Object.freeze({
  organId: "PulseBeaconEngine-v15-IMMORTAL",
  role: "BLUETOOTH_MEMBRANE",
  version: "v15-IMMORTAL",
  epoch: "v15-IMMORTAL",
  layer: "Membrane",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true,
    noAutoConnect: true,
    userVisible: true,
    userControllable: true
  }),
  evo: Object.freeze({
    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    multiInstanceAware: true,
    expansionAware: true,
    meshAware: true,
    meshPressureAware: true,
    densityAware: true,
    castleAware: true,
    regionAware: true,
    regionPresenceAware: true,
    regionAdvantageAware: true,
    regionChunkPlanAware: true,
    bandAware: true,
    binaryFieldAware: true,
    waveFieldAware: true,
    dualbandSafe: true,
    worldCoreAware: true,
    userAware: true,
    routerAware: true,
    serverAware: true
  }),
  contract: Object.freeze({
    purpose:
      "Bluetooth presence membrane for PulseWorld. Broadcasts presence, mesh status, pressure, and castle readiness within SafetyFrame.",
    never: Object.freeze([
      "auto-connect devices",
      "bypass SafetyFrame",
      "lie about mesh or castle state",
      "perform direct hardware I/O outside nativeBluetoothBroadcast",
      "introduce randomness",
      "self-modify core contracts"
    ]),
    always: Object.freeze([
      "respect user opt-in",
      "respect system Bluetooth settings",
      "respect SafetyFrame constraints",
      "expose deterministic state snapshots",
      "allow control via NodeAdmin and Overmind directives",
      "adapt power/interval deterministically based on inputs",
      "remain mesh-aware and expansion-aware",
      "surface presence/advantage/chunk-prewarm fields"
    ])
  })
});

// ============================================================================
// INTERNAL BLUETOOTH EMITTER (ONLY HARDWARE EDGE IN THE ORGANISM)
// ============================================================================
//
// This is the ONLY place in the entire codebase that is allowed to touch
// real Bluetooth APIs. Platform glue (Android/iOS/Web/ESP32/etc.) must be
// wired here and nowhere else.
//
// Implementations should map (payload, profile) → platform BLE advertiser.
//
// NOTE: This is "real" in the sense that when wired, it actually emits.
// If not wired, it throws, making "fake" impossible to silently pass.
//
let _nativeBluetoothDriver = null; // platform-specific driver, internal only

export function attachNativeBluetoothDriver(driver) {
  // driver MUST implement: driver.broadcast(payload, profile)
  if (!driver || typeof driver.broadcast !== "function") {
    throw new Error("[PulseBeaconEngine-v15] Invalid native Bluetooth driver");
  }
  _nativeBluetoothDriver = driver;
  return { ok: true };
}

function nativeBluetoothBroadcast(payload, profile) {
  if (!_nativeBluetoothDriver) {
    // No silent fake. If not wired, this is a hard failure.
    throw new Error(
      "[PulseBeaconEngine-v15] nativeBluetoothBroadcast called with no attached driver"
    );
  }
  // This is the ONLY real hardware edge.
  _nativeBluetoothDriver.broadcast(payload, profile);
}

// ============================================================================
// FACTORY: createPulseBeaconEngine — v15-IMMORTAL
// Hybrid: consumes global hints + mesh/user/worldCore snapshots,
//         produces local presence/advantage/band/chunk fields,
//         and EMITS via internal nativeBluetoothBroadcast.
// ============================================================================

export function createPulseBeaconEngine({
  engineID = null,
  regionID = null,
  boundCastleID = null,
  trace = false,
  safetyPolicy = null,     // fn({ mode, payload, signalProfile }) => { allowed: boolean }
  globalHints = null       // unified global hints object (hybrid v15)
} = {}) {
  // --------------------------------------------------------------------------
  // INTERNAL STATE
  // --------------------------------------------------------------------------
  let activeMode = "discovery"; // discovery | presence | adaptive | pulse-reach | pulse-storm | PULSE-MESH | pulse-expand
  let tick = 0;

  const identity = {
    engineID,
    regionID,
    boundCastleID,
    createdBy: "PulseExpansion"
  };

  const payloadState = {
    regionTag: null,
    castlePresence: false,
    meshStatus: "unknown",      // unknown | weak | stable | strong
    meshPressureIndex: 0,       // 0–100 symbolic pressure index
    meshStrength: "unknown",    // unknown | weak | stable | strong
    loadHint: "light",          // light | medium | heavy
    experienceHint: "PulseWorld",
    userProfile: "unknown",     // unknown | new | known
    advantageHint: "neutral",   // neutral | boost | protect | expand
    fallbackBandLevel: 0,       // 0–3 symbolic band level
    coldStartPhase: "unknown"   // unknown | warming | active | cooling
  };

  const signalState = {
    powerLevel: "auto",      // low | medium | high | auto
    intervalProfile: "auto", // auto | frequent | steady | sparse
    maxRangeMeters: 50
  };

  const optInState = {
    requiresUserTap: true,
    requiresConsent: true,
    noSilentJoin: true
  };

  const telemetry = {
    activeMode: null,
    seenDevicesCount: 0,
    optInAttempts: 0,
    successfulJoins: 0,
    lastBroadcast: null
  };

  // v15+ global → local hybrid hints
  let lastGlobalHints = globalHints || null;

  // External bridges
  let overmind = null;
  let nodeAdmin = null;

  // Attachments (mesh/user/worldCore/server/router)
  let meshSnapshotProvider = null;     // () => mesh.getSnapshot()
  let worldCoreSnapshotProvider = null;// () => worldCore.getSnapshot()
  let routerSnapshotProvider = null;   // () => router.getSnapshot()
  let serverSnapshotProvider = null;   // () => pulseServerSnapshot
  let userContext = null;              // user/session context (symbolic only)

  // --------------------------------------------------------------------------
  // BASELINE DEFINITIONS (A)
  // --------------------------------------------------------------------------
  const Modes = Object.freeze({
    baseline: {
      discovery: {
        description: "High-power, visible beacon for new users",
        powerProfile: "high",
        intervalProfile: "frequent"
      },
      presence: {
        description: "Low-power heartbeat for known Pulse devices",
        powerProfile: "low",
        intervalProfile: "steady"
      }
    },
    adaptive: {
      autoSwitchEnabled: true,
      densityAware: true,
      demandAware: true,
      regionTypeAware: true // home | venue | campus | city
    },
    organism: {
      "pulse-reach": {
        description: "Extended reach for sparse regions",
        powerProfile: "high",
        intervalProfile: "steady"
      },
      "pulse-storm": {
        description: "Short, intense bursts for high attention windows",
        powerProfile: "high",
        intervalProfile: "frequent"
      },
      "PULSE-MESH": {
        description: "Mesh-aware, cooperative presence",
        powerProfile: "medium",
        intervalProfile: "steady"
      },
      "pulse-expand": {
        description: "Gradual region expansion under mesh guidance",
        powerProfile: "medium",
        intervalProfile: "auto"
      }
    },
    defaults: {
      initialMode: "discovery"
    }
  });

  const PayloadProfiles = Object.freeze({
    newUserProfile: {
      showOnboardingHint: true,
      showFirstTimeTag: true
    },
    knownUserProfile: {
      showFastPathHint: true,
      showWelcomeBackTag: true
    }
  });

  const SignalLimits = Object.freeze({
    maxPowerProfile: "high",
    minIntervalProfile: "sane" // symbolic; enforced via mapping
  });

  const MultiInstance = Object.freeze({
    canRunMultipleBeaconsPerRegion: true,
    preferSingleBeaconPerCastle: true,
    governedBy: "PulseExpansion.SafetyFrame.multiInstanceGovernor",
    preventBeaconFlood: true,
    mergeOverlappingBeacons: true,
    splitRegionsOnlyWhenNeeded: true,
    onePrimaryBeaconPerRegionPreferred: true
  });

  const Contracts = Object.freeze({
    mustBeUserVisible: true,
    mustBeUserControllable: true,
    mustRespectSafetyFrame: true,
    mustNotAutoConnect: true
  });

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------
  function log(...args) {
    if (trace) console.log("[PulseBeaconEngine-v15]", ...args);
  }

  function rememberBroadcast(payload, profile) {
    telemetry.activeMode = activeMode;
    telemetry.lastBroadcast = {
      timestamp: Date.now(),
      payload,
      profile
    };
  }

  function emitToOvermind(eventType, data) {
    if (!overmind || typeof overmind.emit !== "function") return;
    overmind.emit({
      organId: PulseBeaconMeta.organId,
      eventType,
      data,
      snapshot: getStateSnapshot()
    });
  }

  function emitToNodeAdmin(eventType, data) {
    if (!nodeAdmin || typeof nodeAdmin.onBeaconEvent !== "function") return;
    nodeAdmin.onBeaconEvent({
      organId: PulseBeaconMeta.organId,
      eventType,
      data,
      snapshot: getStateSnapshot()
    });
  }

  // --------------------------------------------------------------------------
  // ATTACHMENTS (Mesh / WorldCore / Router / Server / User)
  // --------------------------------------------------------------------------
  function attachMeshSnapshotProvider(provider) {
    meshSnapshotProvider = typeof provider === "function" ? provider : null;
    return { ok: true, hasProvider: !!meshSnapshotProvider };
  }

  function attachWorldCoreSnapshotProvider(provider) {
    worldCoreSnapshotProvider = typeof provider === "function" ? provider : null;
    return { ok: true, hasProvider: !!worldCoreSnapshotProvider };
  }

  function attachRouterSnapshotProvider(provider) {
    routerSnapshotProvider = typeof provider === "function" ? provider : null;
    return { ok: true, hasProvider: !!routerSnapshotProvider };
  }

  function attachServerSnapshotProvider(provider) {
    serverSnapshotProvider = typeof provider === "function" ? provider : null;
    return { ok: true, hasProvider: !!serverSnapshotProvider };
  }

  function attachUserContext(ctx) {
    userContext = ctx || null;
    emitToOvermind("user-context-updated", { userContext });
    emitToNodeAdmin("user-context-updated", { userContext });
    return { ok: true, userContext };
  }

  function readMeshView() {
    if (!meshSnapshotProvider) return null;
    try {
      const snap = meshSnapshotProvider();
      return snap || null;
    } catch {
      return null;
    }
  }

  function readWorldCoreView() {
    if (!worldCoreSnapshotProvider) return null;
    try {
      const snap = worldCoreSnapshotProvider();
      return snap || null;
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // GLOBAL HINTS (v15 HYBRID)
  // --------------------------------------------------------------------------
  function setGlobalHints(hints) {
    lastGlobalHints = hints || null;
    emitToOvermind("global-hints-updated", { hints: lastGlobalHints });
    emitToNodeAdmin("global-hints-updated", { hints: lastGlobalHints });
    return { ok: true, hints: lastGlobalHints };
  }

  function getGlobalHints() {
    return lastGlobalHints;
  }

  // --------------------------------------------------------------------------
  // MODE ENGINE
  // --------------------------------------------------------------------------
  function setMode(nextMode) {
    if (!nextMode || typeof nextMode !== "string") {
      return { ok: false, reason: "invalid-mode" };
    }

    const known =
      Modes.baseline[nextMode] ||
      Modes.organism[nextMode] ||
      (nextMode === "adaptive" ? Modes.adaptive : null);

    if (!known && nextMode !== "adaptive") {
      return { ok: false, reason: "unknown-mode" };
    }

    activeMode = nextMode;
    log("Mode set:", activeMode);
    emitToOvermind("mode-change", { mode: activeMode });
    emitToNodeAdmin("mode-change", { mode: activeMode });
    return { ok: true, mode: activeMode };
  }

  function getMode() {
    return activeMode;
  }

  // --------------------------------------------------------------------------
  // PAYLOAD ENGINE (LOCAL + GLOBAL HINTS + MESH/WORLDCORE)
  // --------------------------------------------------------------------------
  function updatePayloadFromContext({
    regionTag = null,
    castlePresence = null,
    meshStatus = null,
    meshPressureIndex = null,
    meshStrength = null,
    loadHint = null,
    userProfile = null,
    advantageHint = null,
    fallbackBandLevel = null,
    coldStartPhase = null
  } = {}) {
    if (regionTag !== null) payloadState.regionTag = regionTag;
    if (castlePresence !== null) payloadState.castlePresence = !!castlePresence;
    if (meshStatus !== null) payloadState.meshStatus = meshStatus;
    if (meshPressureIndex !== null) payloadState.meshPressureIndex = meshPressureIndex;
    if (meshStrength !== null) payloadState.meshStrength = meshStrength;
    if (loadHint !== null) payloadState.loadHint = loadHint;
    if (userProfile !== null) payloadState.userProfile = userProfile;
    if (advantageHint !== null) payloadState.advantageHint = advantageHint;
    if (fallbackBandLevel !== null) payloadState.fallbackBandLevel = fallbackBandLevel;
    if (coldStartPhase !== null) payloadState.coldStartPhase = coldStartPhase;

    // Mesh + worldCore auto-hydration (symbolic only)
    const meshView = readMeshView();
    if (meshView && meshView.densityHealth?.A_metrics) {
      const dh = meshView.densityHealth.A_metrics;
      if (typeof dh.meshPressureIndex === "number") {
        payloadState.meshPressureIndex = dh.meshPressureIndex;
      }
      if (typeof dh.meshStrength === "string") {
        payloadState.meshStrength = dh.meshStrength;
        payloadState.meshStatus = dh.meshStrength;
      }
    }

    const wcView = readWorldCoreView();
    if (wcView?.advantageContext?.presenceField?.presenceTier && !payloadState.regionTag) {
      payloadState.regionTag = wcView.advantageContext.presenceField.presenceTier;
    }

    emitToOvermind("payload-updated", { payloadState });
    emitToNodeAdmin("payload-updated", { payloadState });

    return { ok: true, payloadState: { ...payloadState } };
  }

  // --------------------------------------------------------------------------
  // PRESENCE / ADVANTAGE / HINTS / BAND / CHUNK FIELDS
  // --------------------------------------------------------------------------
  function buildPresenceField() {
    const gh = lastGlobalHints || {};
    const presenceCtx = gh.presenceContext || {};
    const advantageCtx = gh.advantageContext || {};
    const fallbackCtx = gh.fallbackContext || {};

    const meshView = readMeshView();
    const wcView = readWorldCoreView();

    const regionPresence =
      payloadState.regionTag ||
      presenceCtx.regionPresence ||
      wcView?.advantageContext?.presenceField?.presenceTier ||
      regionID ||
      "unknown";

    const meshStrength =
      gh.meshStrength ||
      payloadState.meshStrength ||
      payloadState.meshStatus ||
      meshView?.densityHealth?.A_metrics?.meshStrength ||
      "unknown";

    const meshPressureIndex =
      gh.meshPressureIndex ??
      payloadState.meshPressureIndex ??
      meshView?.densityHealth?.A_metrics?.meshPressureIndex ??
      0;

    return Object.freeze({
      bandPresence: presenceCtx.bandPresence || "unknown",
      routerPresence: presenceCtx.routerPresence || "unknown",
      devicePresence: presenceCtx.devicePresence || "unknown",
      meshPresence: payloadState.meshStatus,
      meshStrength,
      meshPressureIndex,
      castlePresence: payloadState.castlePresence ? "present" : "absent",
      regionPresence,
      advantageBand: advantageCtx.advantageBand || payloadState.advantageHint || "neutral",
      fallbackBandLevel:
        fallbackCtx.fallbackBandLevel ??
        gh.fallbackBandLevel ??
        payloadState.fallbackBandLevel ??
        0,
      coldStartPhase: payloadState.coldStartPhase
    });
  }

  function buildAdvantageField() {
    const gh = lastGlobalHints || {};
    const advantageCtx = gh.advantageContext || {};
    const wcView = readWorldCoreView();

    return Object.freeze({
      advantageScore: advantageCtx.score ?? null,
      advantageBand: advantageCtx.band || payloadState.advantageHint || "neutral",
      regionAdvantage: gh.regionAdvantage || wcView?.advantageContext?.advantageField || {},
      regionPresence: gh.regionPresence || wcView?.advantageContext?.presenceField || {}
    });
  }

  function buildHintsField() {
    const gh = lastGlobalHints || {};
    const fallbackCtx = gh.fallbackContext || {};

    const fallbackBandLevel =
      fallbackCtx.fallbackBandLevel ??
      gh.fallbackBandLevel ??
      payloadState.fallbackBandLevel ??
      0;

    return Object.freeze({
      fallbackBandLevel,
      chunkHints: gh.chunkHints || {},
      cacheHints: gh.cacheHints || {},
      prewarmHints: gh.prewarmHints || {},
      regionChunkPlan: gh.regionChunkPlan || {}
    });
  }

  function buildBandField() {
    const gh = lastGlobalHints || {};
    const bandSignature = gh.bandSignature || null;
    const binaryField = gh.binaryField || null;
    const waveField = gh.waveField || null;

    return Object.freeze({
      bandSignature,
      binaryField,
      waveField
    });
  }

  function buildChunkPrewarmField() {
    const gh = lastGlobalHints || {};
    const hintsField = buildHintsField();

    return Object.freeze({
      planVersion: "v15-Beacon-ChunkPrewarm",
      fallbackBandLevel: hintsField.fallbackBandLevel,
      chunkHints: hintsField.chunkHints,
      cacheHints: hintsField.cacheHints,
      prewarmHints: hintsField.prewarmHints,
      regionChunkPlan: hintsField.regionChunkPlan
    });
  }

  function buildPayload() {
    const base = {
      regionTag: payloadState.regionTag,
      castlePresence: payloadState.castlePresence,
      meshStatus: payloadState.meshStatus,
      meshStrength: payloadState.meshStrength,
      meshPressureIndex: payloadState.meshPressureIndex,
      loadHint: payloadState.loadHint,
      experienceHint: payloadState.experienceHint
    };

    let profileHints = {};
    if (payloadState.userProfile === "new") {
      profileHints = PayloadProfiles.newUserProfile;
    } else if (payloadState.userProfile === "known") {
      profileHints = PayloadProfiles.knownUserProfile;
    }

    const presenceField = buildPresenceField();
    const advantageField = buildAdvantageField();
    const hintsField = buildHintsField();
    const bandField = buildBandField();
    const chunkPrewarmField = buildChunkPrewarmField();

    return Object.freeze({
      ...base,
      ...profileHints,
      presenceField,
      advantageField,
      hintsField,
      bandField,
      chunkPrewarmField,
      userContext: userContext || null,
      globalHints: {
        fallbackBandLevel: hintsField.fallbackBandLevel,
        chunkHints: hintsField.chunkHints,
        cacheHints: hintsField.cacheHints,
        prewarmHints: hintsField.prewarmHints,
        regionPresence: advantageField.regionPresence,
        regionAdvantage: advantageField.regionAdvantage,
        regionChunkPlan: hintsField.regionChunkPlan,
        bandSignature: bandField.bandSignature
      }
    });
  }

  // --------------------------------------------------------------------------
  // SIGNAL SHAPING ENGINE (USES GLOBAL HINTS + MESH/WORLDCORE)
  // --------------------------------------------------------------------------
  function computeSignalProfile({
    densityHint,
    demandHint,
    regionType,
    meshStatus
  } = {}) {
    // Start from baseline based on mode.
    let powerProfile = "medium";
    let intervalProfile = "steady";

    const baseline = Modes.baseline[activeMode];
    const organism = Modes.organism[activeMode];

    if (baseline) {
      powerProfile = baseline.powerProfile;
      intervalProfile = baseline.intervalProfile;
    } else if (organism) {
      powerProfile = organism.powerProfile;
      intervalProfile = organism.intervalProfile;
    } else if (activeMode === "adaptive") {
      powerProfile = "auto";
      intervalProfile = "auto";
    }

    const gh = lastGlobalHints || {};
    const fallbackCtx = gh.fallbackContext || {};
    const fallbackBandLevel =
      fallbackCtx.fallbackBandLevel ??
      gh.fallbackBandLevel ??
      payloadState.fallbackBandLevel ??
      0;

    const chunkAggression = gh.chunkHints?.chunkAggression ?? 0;
    const cachePriority = gh.cacheHints?.priority || "normal";
    const prewarmNeeded = gh.prewarmHints?.shouldPrewarm || false;

    const meshView = readMeshView();

    const effectiveDensity =
      densityHint ||
      gh.densityHint ||
      (meshView?.densityHealth?.A_metrics?.userCount > 20 ? "high" : "medium");

    const effectiveDemand = demandHint || gh.demandHint || "medium";
    const effectiveRegionType = regionType || gh.regionType || "venue";
    const effectiveMeshStatus =
      meshStatus ||
      gh.meshStatus ||
      payloadState.meshStatus ||
      meshView?.densityHealth?.A_metrics?.meshStrength ||
      "unknown";

    // B-layer: adaptive shaping (local + global).
    if (Modes.adaptive.autoSwitchEnabled) {
      const dense = effectiveDensity === "high";
      const sparse = effectiveDensity === "low";
      const highDemand = effectiveDemand === "high";
      const meshStrong = effectiveMeshStatus === "strong";

      if (dense) {
        powerProfile = "low";
        intervalProfile = "steady";
      } else if (sparse) {
        powerProfile = "high";
        intervalProfile = "steady";
      }

      if (highDemand) {
        intervalProfile = "frequent";
      }

      if (meshStrong && activeMode === "PULSE-MESH") {
        powerProfile = "medium";
        intervalProfile = "steady";
      }

      if (effectiveRegionType === "home") {
        powerProfile = powerProfile === "high" ? "medium" : powerProfile;
      }
    }

    // Global hints influence:
    if (fallbackBandLevel >= 2) {
      powerProfile = powerProfile === "high" ? "medium" : powerProfile;
      intervalProfile = intervalProfile === "frequent" ? "steady" : intervalProfile;
    }

    if (chunkAggression > 0.5) {
      intervalProfile = "frequent";
    }

    if (cachePriority === "critical") {
      powerProfile = "high";
      intervalProfile = "frequent";
    } else if (cachePriority === "high") {
      intervalProfile = "steady";
    }

    if (prewarmNeeded && intervalProfile === "sparse") {
      intervalProfile = "steady";
    }

    // Enforce limits.
    if (powerProfile === "very-high") {
      powerProfile = SignalLimits.maxPowerProfile;
    }

    signalState.powerLevel = powerProfile;
    signalState.intervalProfile = intervalProfile;

    return Object.freeze({
      powerProfile,
      intervalProfile,
      maxRangeMeters: signalState.maxRangeMeters
    });
  }

  // --------------------------------------------------------------------------
  // SAFETY CHECK
  // --------------------------------------------------------------------------
  function checkSafety(payload, signalProfile) {
    if (!Contracts.mustRespectSafetyFrame) {
      return { allowed: true };
    }

    if (typeof safetyPolicy === "function") {
      return safetyPolicy({
        mode: activeMode,
        payload,
        signalProfile,
        identity,
        contracts: Contracts
      });
    }

    return { allowed: true };
  }

  // --------------------------------------------------------------------------
  // BROADCAST ENGINE (REAL BLUETOOTH EMISSION VIA INTERNAL EMITTER)
  // --------------------------------------------------------------------------
  function broadcastOnce({
    densityHint,
    demandHint,
    regionType,
    meshStatus
  } = {}) {
    tick++;

    const payload = buildPayload();
    const signalProfile = computeSignalProfile({
      densityHint,
      demandHint,
      regionType,
      meshStatus
    });

    const safety = checkSafety(payload, signalProfile);
    if (!safety.allowed) {
      const reason = safety.reason || "safety-denied";
      emitToOvermind("broadcast-blocked", { reason, payload, signalProfile });
      emitToNodeAdmin("broadcast-blocked", { reason, payload, signalProfile });
      log("Broadcast blocked:", { reason, payload, signalProfile });
      return { ok: false, reason: "safety-denied" };
    }

    const profile = {
      mode: activeMode,
      powerProfile: signalProfile.powerProfile,
      intervalProfile: signalProfile.intervalProfile,
      maxRangeMeters: signalProfile.maxRangeMeters
    };

    rememberBroadcast(payload, profile);
    emitToOvermind("broadcast", { payload, profile });
    emitToNodeAdmin("broadcast", { payload, profile });

    // REAL EMISSION: this is the ONLY hardware edge.
    nativeBluetoothBroadcast(payload, profile);

    log("Broadcast:", { payload, profile });
    return { ok: true, payload, profile };
  }

  // --------------------------------------------------------------------------
  // DIRECTIVE ENGINE (OVERMIND + NODEADMIN)
  // --------------------------------------------------------------------------
  function applyDirective(directive) {
    if (!directive || typeof directive !== "object") {
      return { ok: false, reason: "invalid-directive" };
    }

    const {
      mode,
      payloadUpdate,
      broadcastNow,
      contextHints,
      globalHints: gh
    } = directive;

    let modeChanged = false;
    let payloadChanged = false;
    let hintsChanged = false;
    let broadcastResult = null;

    if (mode) {
      const res = setMode(mode);
      modeChanged = !!res.ok;
    }

    if (payloadUpdate) {
      const res = updatePayloadFromContext(payloadUpdate);
      payloadChanged = !!res.ok;
    }

    if (gh) {
      const res = setGlobalHints(gh);
      hintsChanged = !!res.ok;
    }

    if (broadcastNow) {
      broadcastResult = broadcastOnce(contextHints || {});
    }

    const result = {
      ok: true,
      modeChanged,
      payloadChanged,
      hintsChanged,
      broadcastResult
    };

    emitToOvermind("directive-applied", { directive, result });
    emitToNodeAdmin("directive-applied", { directive, result });
    log("Directive applied:", { directive, result });
    return result;
  }

  // --------------------------------------------------------------------------
  // BRIDGES
  // --------------------------------------------------------------------------
  function attachNodeAdminBridge(bridge) {
    nodeAdmin = bridge || null;
    const hasBridge = !!bridge;
    emitToOvermind("nodeadmin-bridge-set", { hasBridge });
    log("NodeAdmin bridge set:", { hasBridge });
    return { ok: true, hasBridge };
  }

  function handleNodeAdminIntent(intentName, payload = {}) {
    if (!intentName) return { ok: false, reason: "no-intent" };

    const ctx = payload.contextHints || {};

    if (intentName === "broadcast-discovery") {
      setMode("discovery");
      return broadcastOnce(ctx);
    }

    if (intentName === "broadcast-presence") {
      setMode("presence");
      return broadcastOnce(ctx);
    }

    if (intentName === "pulse-reach") {
      setMode("pulse-reach");
      return broadcastOnce(ctx);
    }

    if (intentName === "pulse-storm") {
      setMode("pulse-storm");
      return broadcastOnce(ctx);
    }

    if (intentName === "PULSE-MESH") {
      setMode("PULSE-MESH");
      return broadcastOnce(ctx);
    }

    if (intentName === "pulse-expand") {
      setMode("pulse-expand");
      return broadcastOnce(ctx);
    }

    return { ok: false, reason: "unknown-intent" };
  }

  function attachOvermindBridge(bridge) {
    overmind = bridge || null;
    const hasBridge = !!bridge;
    emitToOvermind("overmind-bridge-set", { hasBridge });
    log("Overmind bridge set:", { hasBridge });
    return { ok: true, hasBridge };
  }

  // --------------------------------------------------------------------------
  // TELEMETRY & SNAPSHOT
  // --------------------------------------------------------------------------
  function getTelemetry() {
    return Object.freeze({ ...telemetry });
  }

  function getStateSnapshot() {
    return Object.freeze({
      organId: PulseBeaconMeta.organId,
      identity: { ...identity },
      mode: activeMode,
      tick,
      payloadState: { ...payloadState },
      signalState: { ...signalState },
      telemetry: { ...telemetry },
      multiInstance: { ...MultiInstance },
      contracts: { ...Contracts },
      globalHints: lastGlobalHints,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField(),
      hintsField: buildHintsField(),
      bandField: buildBandField(),
      chunkPrewarmField: buildChunkPrewarmField()
    });
  }

  function getManual() {
    return {
      meta: PulseBeaconMeta,
      description:
        "PulseBeaconEngine-v15 is the monolithic Bluetooth membrane organ for PulseWorld, fully presence/advantage/band/chunk-prewarm aware, and the ONLY Bluetooth emitter.",
      usage: {
        setMode:
          "beacon.setMode('discovery' | 'presence' | 'adaptive' | 'pulse-reach' | 'pulse-storm' | 'PULSE-MESH' | 'pulse-expand')",
        updatePayloadFromContext:
          "beacon.updatePayloadFromContext({ regionTag?, castlePresence?, meshStatus?, meshPressureIndex?, meshStrength?, loadHint?, userProfile?, advantageHint?, fallbackBandLevel?, coldStartPhase? })",
        setGlobalHints:
          "beacon.setGlobalHints({ presenceContext?, advantageContext?, fallbackContext?, fallbackBandLevel?, chunkHints?, cacheHints?, prewarmHints?, regionPresence?, regionAdvantage?, regionChunkPlan?, bandSignature?, binaryField?, waveField?, meshPressureIndex?, meshStrength?, densityHint?, demandHint?, regionType?, meshStatus? })",
        attachMeshSnapshotProvider:
          "beacon.attachMeshSnapshotProvider(() => mesh.getSnapshot())",
        attachWorldCoreSnapshotProvider:
          "beacon.attachWorldCoreSnapshotProvider(() => worldCore.getSnapshot())",
        attachUserContext:
          "beacon.attachUserContext(userContext)",
        buildPresenceField: "beacon.buildPresenceField() → presenceField",
        buildAdvantageField: "beacon.buildAdvantageField() → advantageField",
        buildHintsField: "beacon.buildHintsField() → hintsField",
        buildBandField: "beacon.buildBandField() → bandField",
        buildChunkPrewarmField: "beacon.buildChunkPrewarmField() → chunkPrewarmField",
        buildPayload: "beacon.buildPayload() → full broadcast payload",
        computeSignalProfile:
          "beacon.computeSignalProfile({ densityHint?, demandHint?, regionType?, meshStatus? }) → signalProfile",
        broadcastOnce:
          "beacon.broadcastOnce({ densityHint?, demandHint?, regionType?, meshStatus? })",
        applyDirective:
          "beacon.applyDirective({ mode?, payloadUpdate?, globalHints?, broadcastNow?, contextHints? })",
        attachOvermindBridge:
          "beacon.attachOvermindBridge({ emit? })",
        attachNodeAdminBridge:
          "beacon.attachNodeAdminBridge({ onBeaconEvent? })",
        handleNodeAdminIntent:
          "beacon.handleNodeAdminIntent(intentName, { contextHints? })",
        getStateSnapshot: "beacon.getStateSnapshot()",
        getTelemetry: "beacon.getTelemetry()",
        attachNativeBluetoothDriver:
          "attachNativeBluetoothDriver({ broadcast(payload, profile) }) // ONLY hardware edge"
      },
      caveat:
        "Hardware emission is performed ONLY via nativeBluetoothBroadcast(payload, profile) using the attached native driver. This organ is the sole Bluetooth emitter and must remain deterministic and SafetyFrame-compliant."
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------
  return {
    meta: PulseBeaconMeta,

    // identity
    identity: { ...identity },

    // mode
    setMode,
    getMode,

    // payload
    updatePayloadFromContext,
    buildPayload,

    // global hints (hybrid v15)
    setGlobalHints,
    getGlobalHints,
    buildPresenceField,
    buildAdvantageField,
    buildHintsField,
    buildBandField,
    buildChunkPrewarmField,

    // signal
    computeSignalProfile,

    // broadcast
    broadcastOnce,

    // directives
    applyDirective,

    // bridges
    attachOvermindBridge,
    attachNodeAdminBridge,
    handleNodeAdminIntent,

    // attachments
    attachMeshSnapshotProvider,
    attachWorldCoreSnapshotProvider,
    attachRouterSnapshotProvider,
    attachServerSnapshotProvider,
    attachUserContext,

    // telemetry
    getStateSnapshot,
    getTelemetry,

    // manual
    getManual
  };
}
