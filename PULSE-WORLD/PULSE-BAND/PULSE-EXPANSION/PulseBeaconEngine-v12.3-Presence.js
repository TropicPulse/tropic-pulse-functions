// ============================================================================
// PULSE-WORLD : PulseBeaconEngine-v13-PRESENCE-EVO++.js
// ORGAN TYPE: Bluetooth Presence / Membrane Organism
// VERSION: v13-PRESENCE-EVO++ (Hybrid, Every-Advantage, Every-Prewarm, Mesh-Aware)
// ============================================================================

export const PulseBeaconMeta = Object.freeze({
  organId: "PulseBeaconEngine-v13-PRESENCE-EVO++",
  role: "BLUETOOTH_MEMBRANE",
  version: "13-PRESENCE-EVO++",
  epoch: "v13-PRESENCE-EVO++",
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
    dualbandSafe: true
  }),
  contract: Object.freeze({
    purpose:
      "Bluetooth presence membrane for PulseWorld. Broadcasts presence, mesh status, pressure, and castle readiness within SafetyFrame.",
    never: Object.freeze([
      "auto-connect devices",
      "bypass SafetyFrame",
      "lie about mesh or castle state",
      "perform direct hardware I/O",
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
// FACTORY: createPulseBeaconEngine — v13-PRESENCE-EVO++
// Hybrid: consumes global hints, produces local presence/advantage/band/chunk fields.
// ============================================================================

export function createPulseBeaconEngine({
  engineID = null,
  regionID = null,
  boundCastleID = null,
  trace = false,
  bluetoothAdapter = null, // { broadcast(payload, profile) }
  safetyPolicy = null,     // fn({ mode, payload, signalProfile }) => { allowed: boolean }
  globalHints = null       // unified global hints object (hybrid v13)
//  expected shape (symbolic):
//  {
//    presenceContext?,
//    advantageContext?,
//    fallbackContext?,
//    fallbackBandLevel?,
//    chunkHints?,
//    cacheHints?,
//    prewarmHints?,
//    regionPresence?,
//    regionAdvantage?,
//    regionChunkPlan?,
//    bandSignature?,
//    binaryField?,
//    waveField?,
//    meshPressureIndex?,
//    meshStrength?,
//    densityHint?,
//    demandHint?,
//    regionType?,
//    meshStatus?
//  }
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

  // v13+ global → local hybrid hints
  let lastGlobalHints = globalHints || null;

  // External bridges
  let overmind = null;
  let nodeAdmin = null;

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
    if (trace) console.log("[PulseBeaconEngine-v13]", ...args);
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
  // GLOBAL HINTS (v13 HYBRID)
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
  // PAYLOAD ENGINE (LOCAL + GLOBAL HINTS)
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

    const regionPresence =
      payloadState.regionTag ||
      presenceCtx.regionPresence ||
      regionID ||
      "unknown";

    const meshStrength =
      gh.meshStrength ||
      payloadState.meshStrength ||
      payloadState.meshStatus ||
      "unknown";

    const meshPressureIndex =
      gh.meshPressureIndex ??
      payloadState.meshPressureIndex ??
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

    return Object.freeze({
      advantageScore: advantageCtx.score ?? null,
      advantageBand: advantageCtx.band || payloadState.advantageHint || "neutral",
      regionAdvantage: gh.regionAdvantage || {},
      regionPresence: gh.regionPresence || {}
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
      planVersion: "v13-Beacon-ChunkPrewarm",
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
      // for NodeAdmin / Expansion: beaconSnapshot.globalHints.*
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
  // SIGNAL SHAPING ENGINE (USES GLOBAL HINTS)
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

    const effectiveDensity = densityHint || gh.densityHint || "medium";
    const effectiveDemand = demandHint || gh.demandHint || "medium";
    const effectiveRegionType = regionType || gh.regionType || "venue";
    const effectiveMeshStatus = meshStatus || gh.meshStatus || payloadState.meshStatus;

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
    // - fallbackBandLevel: higher → more conservative
    if (fallbackBandLevel >= 2) {
      powerProfile = powerProfile === "high" ? "medium" : powerProfile;
      intervalProfile = intervalProfile === "frequent" ? "steady" : intervalProfile;
    }

    // - chunkAggression: higher → shorter bursts
    if (chunkAggression > 0.5) {
      intervalProfile = "frequent";
    }

    // - cachePriority: critical → keep presence strong
    if (cachePriority === "critical") {
      powerProfile = "high";
      intervalProfile = "frequent";
    } else if (cachePriority === "high") {
      intervalProfile = "steady";
    }

    // - prewarmNeeded: if true, keep beacon more active
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
  // BROADCAST ENGINE
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

    if (bluetoothAdapter && typeof bluetoothAdapter.broadcast === "function") {
      bluetoothAdapter.broadcast(payload, profile);
    }

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
        "PulseBeaconEngine-v13 is the Bluetooth membrane organ for PulseWorld, fully presence/advantage/band/chunk-prewarm aware.",
      usage: {
        setMode:
          "beacon.setMode('discovery' | 'presence' | 'adaptive' | 'pulse-reach' | 'pulse-storm' | 'PULSE-MESH' | 'pulse-expand')",
        updatePayloadFromContext:
          "beacon.updatePayloadFromContext({ regionTag?, castlePresence?, meshStatus?, meshPressureIndex?, meshStrength?, loadHint?, userProfile?, advantageHint?, fallbackBandLevel?, coldStartPhase? })",
        setGlobalHints:
          "beacon.setGlobalHints({ presenceContext?, advantageContext?, fallbackContext?, fallbackBandLevel?, chunkHints?, cacheHints?, prewarmHints?, regionPresence?, regionAdvantage?, regionChunkPlan?, bandSignature?, binaryField?, waveField?, meshPressureIndex?, meshStrength?, densityHint?, demandHint?, regionType?, meshStatus? })",
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
        getTelemetry: "beacon.getTelemetry()"
      },
      caveat:
        "Hardware emission must be implemented via bluetoothAdapter.broadcast(payload, profile). This organ must remain deterministic, synthetic, and SafetyFrame-compliant."
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

    // global hints (hybrid v13)
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

    // introspection
    getStateSnapshot,
    getTelemetry,
    getManual
  };
}
