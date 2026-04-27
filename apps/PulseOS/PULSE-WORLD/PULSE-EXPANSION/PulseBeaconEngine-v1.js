// ============================================================================
// PULSE-WORLD : PulseBeaconEngine-v11-EVO.js
// ORGAN TYPE: Bluetooth Presence / Membrane Organism
// VERSION: v11-EVO (A-B-A Pattern, Overmind-Ready)
// ============================================================================
// ROLE:
//   The PulseBeaconEngine is the Bluetooth membrane for PulseWorld.
//   It broadcasts presence, advertises castles, signals mesh status,
//   and provides the "tap to enter" entry point into PulseWorld.
//
// CONTRACT:
//   - Must never auto-connect; user must always tap/opt-in.
//   - Must only broadcast within SafetyFrame constraints.
//   - Must adapt power + interval based on density + demand.
//   - Must clearly distinguish new users vs known Pulse users.
//   - Must expose clean hooks for PulseExpansion + PulseCastle + NodeAdmin.
//   - Must remain deterministic, synthetic, and hardware-abstracted.
//
// ARCHITECTURE:
//   A = Baseline beacon structure (modes, payload, opt-in).
//   B = Adaptive behavior (density-aware, demand-aware,
//       profile-aware, cost-aware, mesh-aware, pulse-aware).
//   A = Return to stable, deterministic contracts.
//
// DEPENDENCIES (ABSTRACTED):
//   - SafetyFrame (policy decisions, not direct calls here)
//   - PulseExpansion (region + density + cost hints)
//   - PulseCastle (castle state, readiness)
//   - NodeAdmin (pulse modes, focus, intents)
//   - Overmind (directives, global strategy)
//   - bluetoothAdapter (injected, pure interface: no direct hardware here)
// ============================================================================

export const PulseBeaconMeta = Object.freeze({
  organId: "PulseBeaconEngine-v11-EVO",
  role: "BLUETOOTH_MEMBRANE",
  version: "11.0-EVO",
  epoch: "v11-EVO",
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
  contract: Object.freeze({
    purpose:
      "Bluetooth presence membrane for PulseWorld. Broadcasts presence, mesh status, and castle readiness within SafetyFrame.",
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
      "adapt power/interval deterministically based on inputs"
    ])
  })
});

// ============================================================================
// FACTORY: createPulseBeaconEngine — v11-EVO
// ============================================================================

export function createPulseBeaconEngine({
  engineID = null,
  regionID = null,
  boundCastleID = null,
  trace = false,
  bluetoothAdapter = null, // optional: { broadcast(payload, profile) }
// no hardware logic here; adapter is a pure interface.
  safetyPolicy = null      // optional: fn({ mode, payload, signalProfile }) => { allowed: boolean }
} = {}) {

  // --------------------------------------------------------------------------
  // INTERNAL STATE
  // --------------------------------------------------------------------------
  let activeMode = "discovery"; // discovery | presence | adaptive | pulse-reach | pulse-storm | pulse-mesh | pulse-expand
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
    meshStatus: "unknown", // unknown | weak | stable | strong
    loadHint: "light",     // light | medium | heavy
    experienceHint: "PulseWorld",
    userProfile: "unknown" // unknown | new | known
  };

  const signalState = {
    powerLevel: "auto",   // low | medium | high | auto
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
      "pulse-mesh": {
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
    if (trace) console.log("[PulseBeaconEngine]", ...args);
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
  // MODE ENGINE
  // --------------------------------------------------------------------------
  function setMode(nextMode) {
    if (!nextMode || typeof nextMode !== "string") return { ok: false, reason: "invalid-mode" };

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
  // PAYLOAD ENGINE
  // --------------------------------------------------------------------------
  function updatePayloadFromContext({
    regionTag = null,
    castlePresence = null,
    meshStatus = null,
    loadHint = null,
    userProfile = null
  } = {}) {
    if (regionTag !== null) payloadState.regionTag = regionTag;
    if (castlePresence !== null) payloadState.castlePresence = !!castlePresence;
    if (meshStatus !== null) payloadState.meshStatus = meshStatus;
    if (loadHint !== null) payloadState.loadHint = loadHint;
    if (userProfile !== null) payloadState.userProfile = userProfile;

    emitToOvermind("payload-updated", { payloadState });
    emitToNodeAdmin("payload-updated", { payloadState });

    return { ok: true, payloadState: { ...payloadState } };
  }

  function buildPayload() {
    const base = {
      regionTag: payloadState.regionTag,
      castlePresence: payloadState.castlePresence,
      meshStatus: payloadState.meshStatus,
      loadHint: payloadState.loadHint,
      experienceHint: payloadState.experienceHint
    };

    let profileHints = {};
    if (payloadState.userProfile === "new") {
      profileHints = PayloadProfiles.newUserProfile;
    } else if (payloadState.userProfile === "known") {
      profileHints = PayloadProfiles.knownUserProfile;
    }

    return Object.freeze({
      ...base,
      ...profileHints
    });
  }

  // --------------------------------------------------------------------------
  // SIGNAL SHAPING ENGINE
  // --------------------------------------------------------------------------
  function computeSignalProfile({ densityHint, demandHint, regionType, meshStatus } = {}) {
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

    // B-layer: adaptive shaping.
    if (Modes.adaptive.autoSwitchEnabled) {
      const dense = densityHint === "high";
      const sparse = densityHint === "low";
      const highDemand = demandHint === "high";
      const meshStrong = meshStatus === "strong";

      if (dense) {
        // Reduce power, keep presence.
        powerProfile = "low";
        intervalProfile = "steady";
      } else if (sparse) {
        // Extend reach.
        powerProfile = "high";
        intervalProfile = "steady";
      }

      if (highDemand) {
        // Short bursts.
        intervalProfile = "frequent";
      }

      if (meshStrong && activeMode === "pulse-mesh") {
        powerProfile = "medium";
        intervalProfile = "steady";
      }

      if (regionType === "home") {
        powerProfile = powerProfile === "high" ? "medium" : powerProfile;
      }
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

    // Default: allow if not auto-connect and user-visible.
    return { allowed: true };
  }

  // --------------------------------------------------------------------------
  // BROADCAST ENGINE (ABSTRACTED)
// --------------------------------------------------------------------------
  function broadcastOnce({ densityHint, demandHint, regionType, meshStatus } = {}) {
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
      emitToOvermind("broadcast-blocked", { reason: safety.reason || "safety-denied", payload, signalProfile });
      emitToNodeAdmin("broadcast-blocked", { reason: safety.reason || "safety-denied", payload, signalProfile });
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
      // Still deterministic: adapter is a pure side-effect boundary.
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

    const { mode, payloadUpdate, broadcastNow, contextHints } = directive;
    let modeChanged = false;
    let payloadChanged = false;
    let broadcastResult = null;

    if (mode) {
      const res = setMode(mode);
      modeChanged = res.ok;
    }

    if (payloadUpdate) {
      const res = updatePayloadFromContext(payloadUpdate);
      payloadChanged = res.ok;
    }

    if (broadcastNow) {
      broadcastResult = broadcastOnce(contextHints || {});
    }

    const result = { ok: true, modeChanged, payloadChanged, broadcastResult };
    emitToOvermind("directive-applied", { directive, result });
    emitToNodeAdmin("directive-applied", { directive, result });
    return result;
  }

  // --------------------------------------------------------------------------
  // NODEADMIN INTENT SURFACE (ORGANISM LEVEL)
// --------------------------------------------------------------------------
  function attachNodeAdminBridge(bridge) {
    nodeAdmin = bridge || null;
    emitToOvermind("nodeadmin-bridge-set", { hasBridge: !!bridge });
    return { ok: true, hasBridge: !!bridge };
  }

  // Optional helper for NodeAdmin: simple intent mapping.
  function handleNodeAdminIntent(intentName, payload = {}) {
    if (!intentName) return { ok: false, reason: "no-intent" };

    if (intentName === "broadcast-discovery") {
      setMode("discovery");
      return broadcastOnce(payload.contextHints || {});
    }

    if (intentName === "broadcast-presence") {
      setMode("presence");
      return broadcastOnce(payload.contextHints || {});
    }

    if (intentName === "pulse-reach") {
      setMode("pulse-reach");
      return broadcastOnce(payload.contextHints || {});
    }

    if (intentName === "pulse-storm") {
      setMode("pulse-storm");
      return broadcastOnce(payload.contextHints || {});
    }

    if (intentName === "pulse-mesh") {
      setMode("pulse-mesh");
      return broadcastOnce(payload.contextHints || {});
    }

    if (intentName === "pulse-expand") {
      setMode("pulse-expand");
      return broadcastOnce(payload.contextHints || {});
    }

    return { ok: false, reason: "unknown-intent" };
  }

  // --------------------------------------------------------------------------
  // OVERMIND BRIDGE
  // --------------------------------------------------------------------------
  function attachOvermindBridge(bridge) {
    overmind = bridge || null;
    emitToOvermind("overmind-bridge-set", { hasBridge: !!bridge });
    return { ok: true, hasBridge: !!bridge };
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
      contracts: { ...Contracts }
    });
  }

  function getManual() {
    return {
      meta: PulseBeaconMeta,
      description: "PulseBeaconEngine is the Bluetooth membrane organ for PulseWorld.",
      usage: {
        setMode: "beacon.setMode('discovery' | 'presence' | 'adaptive' | 'pulse-reach' | 'pulse-storm' | 'pulse-mesh' | 'pulse-expand')",
        updatePayloadFromContext:
          "beacon.updatePayloadFromContext({ regionTag?, castlePresence?, meshStatus?, loadHint?, userProfile? })",
        broadcastOnce:
          "beacon.broadcastOnce({ densityHint?, demandHint?, regionType?, meshStatus? })",
        applyDirective:
          "beacon.applyDirective({ mode?, payloadUpdate?, broadcastNow?, contextHints? })",
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

  function applyDirective(directive) {
    if (!directive || typeof directive !== "object") return { ok: false };

    const { mode, broadcastNow, payloadUpdate, contextHints } = directive;

    // 1. Update mode
    if (mode && typeof setMode === "function") {
      setMode(mode);
    }

    // 2. Update payload
    if (payloadUpdate && typeof updatePayload === "function") {
      updatePayload(payloadUpdate);
    }

    // 3. Optional: update context hints
    if (contextHints) {
      remember("beacon-context-hints", {
        ...contextHints,
        ts: Date.now()
      });
    }

    // 4. Broadcast immediately if requested
    if (broadcastNow && typeof broadcast === "function") {
      broadcast();
    }

    return { ok: true, applied: directive };
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
    applyDirective,   // ← NEW
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
