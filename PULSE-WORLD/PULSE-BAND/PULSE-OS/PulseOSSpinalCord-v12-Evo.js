// ============================================================================
// FILE: /PULSE-OS/PulseOSSpinalCord-v13.0-PRESENCE-IMMORTAL.js
// PULSE OS SPINAL CORD — v13.0-PRESENCE-IMMORTAL
// “ORGANISM-WIDE DUAL-BAND SPINE • ADVANTAGE FIELD CONDUCTOR • ROUTE ROOT”
// CHUNK/PREWARM/CACHE-AWARE • MULTI-PRESENCE-AWARE • FIREWALL-GATED
// PASSIVE/ACTIVE PAGESCANNER-AWARE (NO TIMERS, NO POLLING)
// SDN PREWARM v13.0-PRESENCE-IMMORTAL (Spinal Reflex Ignition)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSSpinalCord",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_spinal_cord",
  lineage: "PulseOS-v14",

  evo: {
    spinalCord: true,
    conduction: true,
    reflexArc: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    presenceAware: true,
    meshAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSNervousSystem",
      "PulseOSSensoryCortex",
      "PulseOSFightFlightResponse"
    ],
    never: [
      "legacySpinalCord",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { prewarmSDN } from "./PulseSDN-Prewarm-v12-Evo.js";
import { PageScannerV12 } from "../../PULSE-UI/_BACKEND/PulseSkinReflex.js";

// ============================================================================
// SPINAL CORD IDENTITY — v13.0-PRESENCE-IMMORTAL
// ============================================================================
export const PulseRole = {
  type: "NervousSystem",
  subsystem: "OS",
  layer: "SpinalCord",
  version: "13.0-PRESENCE-IMMORTAL",
  identity: "PulseOSSpinalCord-v13.0-PRESENCE-IMMORTAL",

  evo: {
    // Core nervous properties
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    continuanceAware: true,

    // Advantage field + loop theory
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,

    // Dual-band nervous system
    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,

    // Organism-wide identity
    organismWideIdentity: true,
    routeRoot: true,
    routeChainAware: true,
    extensionAware: true,
    systemAware: true,

    // Memory + overlay alignment
    memorySpineAligned: true,
    binaryOverlayAware: true,
    coreGovernorAware: true,

    // Updated routing contracts (v13 Presence-IMMORTAL)
    routingContract: "PulseRouter-v13.0-PRESENCE-IMMORTAL",
    osOrganContract: "PulseOS-v13.0-PRESENCE-IMMORTAL",
    earnCompatibility: "PulseEarn-v13.0-PRESENCE-IMMORTAL",
    gpuCompatibility: "PulseGPU-v13.0-PRESENCE-IMMORTAL",
    sendCompatibility: "PulseSendSystem-v13.0-PRESENCE-IMMORTAL",
    meshCompatibility: "PulseMesh-v13.0-PRESENCE-IMMORTAL",
    aiCompatibility: "PulseAI-v13.0-PRESENCE-IMMORTAL",

    // Firewall awareness
    firewallAware: true,
    firewallEnforcedAtSpine: true,

    // v12.3+ chunk / prewarm / cache / presence
    chunkAware: true,
    prewarmAware: true,
    cacheAware: true,
    routePrewarmAware: true,
    multiPresenceAware: true,
    presenceSpineAware: true,

    // v13 Presence-IMMORTAL
    presenceImmortalAware: true,
    sdnPrewarmImmortalAware: true
  }
};

export const PulseOSSpinalCordMeta = Object.freeze({
  layer: "PulseOSSpinalCord",
  role: "CENTRAL_SPINE_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseOSSpinalCord-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    continuanceAware: true,

    // Nervous system laws
    trueOrganismSpine: true,
    routeRoot: true,
    dualBandSpine: true,
    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,
    strictBandSeparation: true,
    extensionAware: true,
    systemAware: true,
    routeChainAware: true,

    // Advantage field + loop theory
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,

    // Wiring laws
    pureWiring: true,
    noCognition: true,
    noBusinessLogic: true,
    noCompute: true,
    deterministicRouting: true,
    modeKindOnlyDecisions: true,
    extensionIdOnlyDecisions: true,

    // Safety prohibitions (IMMORTAL)
    zeroTimestamps: true,
    zeroRandomness: true,
    zeroBackend: true,
    zeroNetwork: true,
    zeroDOM: true,
    zeroGPUCalls: true,
    zeroFS: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Firewall guarantees
    firewallAware: true,
    firewallEnforcedAtSpine: true,
    firewallBlocksUnsafeRoutes: true,
    firewallBlocksUnsafeSources: true,
    firewallBlocksUnsafeExtensions: true,
    firewallBlocksUnsafeSystems: true,

    // Memory + overlay alignment
    memorySpineAligned: true,
    binaryOverlayAware: true,
    coreGovernorAware: true,

    // v12.3+ chunk / prewarm / cache / presence guarantees
    chunkPrewarmSpine: true,
    cachePrewarmSpine: true,
    routePrewarmSpine: true,
    multiPresenceSpine: true,
    presenceRouteAware: true,

    // v13 Presence-IMMORTAL
    sdnPrewarmPresenceImmortal: true,
    spinalReflexIgnitionImmortal: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "Impulse",
      "ImpulseBand",
      "ExtensionId",
      "OrganismContext",
      "DualBandContext"
    ],
    output: [
      "SpineRoute",
      "SpineDiagnostics",
      "SpineSignatures",
      "SpineHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v13.0-PRESENCE-IMMORTAL",
    parent: "PulseOS-v13.0-PRESENCE-IMMORTAL-MAX",
    ancestry: [
      "PulseOSSpinalCord-v9",
      "PulseOSSpinalCord-v10",
      "PulseOSSpinalCord-v11",
      "PulseOSSpinalCord-v11-Evo",
      "PulseOSSpinalCord-v11-Evo-Max",
      "PulseOSSpinalCord-v12-Evo-Max",
      "PulseOSSpinalCord-v13-Evo-Max-Firewall",
      "PulseOSSpinalCord-v13-Evo-Max-Firewall-12.3-Presence",
      "PulseOSSpinalCord-v13.0-PRESENCE-IMMORTAL"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
    default: "symbolic",
    behavior: "central-spine"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "impulse → band separation → route root → Router/Cortex/Brain",
    adaptive:
      "binary-overlay + extension-aware routing surfaces + firewall gating + route prewarm surfaces",
    return: "deterministic spine route + signatures"
  })
});

// ============================================================================
// FACTORY — Dependencies injected by CNS Brain / Cortex
// ============================================================================
export function createPulseOSSpinalCord({
  Router,        // expected: route(type, payload)
  EventBus,      // expected: emit(event, payload)
  Brain,         // PulseOSBrain (for logging)
  Evolution,     // Evolution organ for lineage stamping
  CoreGovernor,  // optional: CoreGovernor (for context-only, no compute)
  BinaryOverlay, // optional: PulseBinaryOverlay (for context-only, no compute)
  Firewall,      // PulseChunks-v1 / firewall surface (optional but recommended)
  Chunker,       // v12.3+ route chunk/prewarm surface (context-only)
  PrewarmCache,  // v12.3+ cache prewarm surface (context-only)
  PresenceMesh,  // v12.3+ multi-presence mesh (context-only)
  log = console.log,
  warn = console.warn
}) {
  // --------------------------------------------------------------------------
  // SPINAL-LEVEL PAGESCANNER BRIDGE — ALWAYS-ON PASSIVE/ACTIVE
  //  • No timers, no polling
  //  • Called on impulses, routes, firewall decisions, prewarm, health
  // --------------------------------------------------------------------------
  const SpinalPageScanner = {
    emit(event, context = {}) {
      try {
        if (!PageScannerV12 || typeof PageScannerV12.buildDriftPacket !== "function") {
          return;
        }

        const packet = PageScannerV12.buildDriftPacket({
          event,
          layer: "SpinalCord",
          subsystem: "OS-Spine",
          spinalIdentity: PulseOSSpinalCordMeta.identity,
          ...context
        });

        if (
          typeof window !== "undefined" &&
          window.PageScannerAdapter &&
          typeof window.PageScannerAdapter.onEvent === "function"
        ) {
          window.PageScannerAdapter.onEvent(packet);
        }

        if (typeof packet.severity === "number") {
          Brain?.log?.(
            "[SpinalCord/PageScanner] event:",
            event,
            "severity:",
            packet.severity,
            "tooFar:",
            !!packet.tooFar
          );
        }
      } catch {
        // Scanner must never break spine
      }
    }
  };

  // --------------------------------------------------------------------------
  // INTERNAL STATE — deterministic, no timestamps
  // --------------------------------------------------------------------------
  const SpinalState = {
    receptors: {
      binary: {},     // { source: Set<handler> }
      symbolic: {},   // { source: Set<handler> }
      dual: {}        // { source: Set<handler> }
    },

    // Extensions + systems registry (Mesh, GPU, Proxy, Send, Earn, AI, etc.)
    extensions: Object.create(null), // { extensionId: { kind, meta } }
    systems: Object.create(null),    // { systemId: { kind, meta } }

    // Advantage + loop theory (pure counters / flags, no time)
    impulseCount: 0,
    loopCounters: {
      binary: 0,
      symbolic: 0,
      dual: 0
    },
    advantageField: {
      // purely logical flags / counters, no timestamps
      binaryHot: false,
      symbolicHot: false,
      dualHot: false,
      lastModeKind: "symbolic"
    },

    // v12.3+ multi-presence + prewarm surfaces (pure metadata)
    presence: {
      sessions: Object.create(null), // { presenceId: { extensionId, systemId, modeKind } }
      multiPresenceEnabled: true
    },
    prewarm: {
      chunkPrewarmEnabled: true,
      cachePrewarmEnabled: true,
      routePrewarmEnabled: true
    },

    healthScore: 1.0
  };

  // --------------------------------------------------------------------------
  // HELPERS — deterministic impulse signature
  // --------------------------------------------------------------------------
  function buildImpulseSignature({ source, modeKind, executionContext }) {
    const ec = executionContext || {};
    return [
      source || "unknown",
      modeKind || "symbolic",
      ec.binaryMode || "auto",
      ec.pipelineId || "",
      ec.sceneType || "",
      ec.workloadClass || "",
      ec.dispatchSignature || "",
      ec.shapeSignature || "",
      ec.extensionId || "",
      ec.systemId || "",
      ec.presenceId || ""
    ].join("|");
  }

  function updateLoopAndAdvantage(modeKind) {
    if (modeKind === "binary") SpinalState.loopCounters.binary += 1;
    else if (modeKind === "symbolic") SpinalState.loopCounters.symbolic += 1;
    else if (modeKind === "dual") SpinalState.loopCounters.dual += 1;

    SpinalState.advantageField.lastModeKind = modeKind;

    SpinalState.advantageField.binaryHot =
      SpinalState.loopCounters.binary > SpinalState.loopCounters.symbolic;
    SpinalState.advantageField.symbolicHot =
      SpinalState.loopCounters.symbolic > SpinalState.loopCounters.binary;
    SpinalState.advantageField.dualHot =
      SpinalState.loopCounters.dual > 0;
  }

  // --------------------------------------------------------------------------
  // v12.3+ PRESENCE REGISTRATION — multi-presence map (pure metadata)
  // --------------------------------------------------------------------------
  function registerPresence(presenceId, { extensionId, systemId, modeKind } = {}) {
    if (!presenceId) return;
    SpinalState.presence.sessions[presenceId] = {
      extensionId: extensionId || null,
      systemId: systemId || null,
      modeKind: modeKind || "symbolic"
    };
    Evolution?.recordLineage?.(`spinal-presence-register:${presenceId}`);
    Brain?.log?.("[SpinalCord] Presence registered:", presenceId);

    SpinalPageScanner.emit("spinal-presence-register", {
      presenceId,
      extensionId: extensionId || null,
      systemId: systemId || null,
      modeKind: modeKind || "symbolic"
    });
  }

  function unregisterPresence(presenceId) {
    if (!presenceId) return;
    if (SpinalState.presence.sessions[presenceId]) {
      delete SpinalState.presence.sessions[presenceId];
      Evolution?.recordLineage?.(`spinal-presence-unregister:${presenceId}`);
      Brain?.log?.("[SpinalCord] Presence unregistered:", presenceId);

      SpinalPageScanner.emit("spinal-presence-unregister", {
        presenceId
      });
    }
  }

  // --------------------------------------------------------------------------
  // v12.3+ PREWARM HELPERS — chunk/cache/route prewarm (context-only)
// --------------------------------------------------------------------------
  function buildRoutePrewarmContext(source, impulse, impulseSignature) {
    const modeKind = impulse.modeKind || "symbolic";
    const executionContext = impulse.executionContext || {};
    const pressureSnapshot = impulse.pressureSnapshot || {};
    const presenceId = executionContext.presenceId || null;

    return {
      source,
      modeKind,
      impulseSignature,
      executionContext,
      pressureSnapshot,
      presenceId,
      spinalAdvantageField: SpinalState.advantageField,
      spinalLoopCounters: SpinalState.loopCounters,
      spinalExtensions: SpinalState.extensions,
      spinalSystems: SpinalState.systems
    };
  }

  function prewarmForImpulse(source, impulse, impulseSignature) {
    const ctx = buildRoutePrewarmContext(source, impulse, impulseSignature);

    SpinalPageScanner.emit("spinal-prewarm-context", {
      source,
      modeKind: impulse.modeKind || "symbolic",
      presenceId: ctx.presenceId
    });

    if (SpinalState.prewarm.chunkPrewarmEnabled && Chunker?.prewarmForRoute) {
      try {
        Chunker.prewarmForRoute(ctx);
        Evolution?.recordLineage?.("spinal-prewarm-chunk");
      } catch (err) {
        warn?.("[SpinalCord] Chunker prewarm failed:", err);
      }
    }

    if (SpinalState.prewarm.cachePrewarmEnabled && PrewarmCache?.prewarm) {
      try {
        PrewarmCache.prewarm(ctx);
        Evolution?.recordLineage?.("spinal-prewarm-cache");
      } catch (err) {
        warn?.("[SpinalCord] Cache prewarm failed:", err);
      }
    }

    if (PresenceMesh?.notifySpineImpulse) {
      try {
        PresenceMesh.notifySpineImpulse(ctx);
        Evolution?.recordLineage?.("spinal-presence-impulse");
      } catch (err) {
        warn?.("[SpinalCord] PresenceMesh notify failed:", err);
      }
    }
  }

  // --------------------------------------------------------------------------
  // FIREWALL HELPERS — centralized checks
  // --------------------------------------------------------------------------
  function firewallBlocksRoute(routeType) {
    if (!Firewall || typeof Firewall.isBlockedRoute !== "function") return false;
    const blocked = !!Firewall.isBlockedRoute(routeType);

    if (blocked) {
      SpinalPageScanner.emit("spinal-firewall-route-block", {
        routeType
      });
    }

    return blocked;
  }

  function firewallBlocksSource(source) {
    if (!Firewall || typeof Firewall.isBlockedSource !== "function") return false;
    const blocked = !!Firewall.isBlockedSource(source);

    if (blocked) {
      SpinalPageScanner.emit("spinal-firewall-source-block", {
        source
      });
    }

    return blocked;
  }

  function firewallBlocksExtension(extensionId) {
    if (!Firewall || typeof Firewall.isBlockedExtension !== "function") return false;
    const blocked = !!Firewall.isBlockedExtension(extensionId);

    if (blocked) {
      SpinalPageScanner.emit("spinal-firewall-extension-block", {
        extensionId
      });
    }

    return blocked;
  }

  function firewallBlocksSystem(systemId) {
    if (!Firewall || typeof Firewall.isBlockedSystem !== "function") return false;
    const blocked = !!Firewall.isBlockedSystem(systemId);

    if (blocked) {
      SpinalPageScanner.emit("spinal-firewall-system-block", {
        systemId
      });
    }

    return blocked;
  }

  // --------------------------------------------------------------------------
  // EXTENSION / SYSTEM REGISTRATION — organism-wide attachment points
  // --------------------------------------------------------------------------
  function registerExtension(extensionId, kind, meta = {}) {
    if (!extensionId || !kind) return;

    if (firewallBlocksExtension(extensionId)) {
      warn("[SpinalCord] Firewall blocked unsafe extension:", extensionId, kind);
      Evolution?.recordLineage?.(
        `spinal-firewall-ext-block:${extensionId}:${kind}`
      );
      return;
    }

    SpinalState.extensions[extensionId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-ext-register:${extensionId}:${kind}`);
    log("[SpinalCord] Extension registered:", extensionId, kind);

    SpinalPageScanner.emit("spinal-extension-register", {
      extensionId,
      kind
    });
  }

  function registerSystem(systemId, kind, meta = {}) {
    if (!systemId || !kind) return;

    if (firewallBlocksSystem(systemId)) {
      warn("[SpinalCord] Firewall blocked unsafe system:", systemId, kind);
      Evolution?.recordLineage?.(
        `spinal-firewall-sys-block:${systemId}:${kind}`
      );
      return;
    }

    SpinalState.systems[systemId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-sys-register:${systemId}:${kind}`);
    log("[SpinalCord] System registered:", systemId, kind);

    SpinalPageScanner.emit("spinal-system-register", {
      systemId,
      kind
    });
  }

  // --------------------------------------------------------------------------
  // RECEPTOR REGISTRATION — strict separation + firewall
  // --------------------------------------------------------------------------
  function registerReceptor(modeKind, source, handler) {
    if (!source || typeof handler !== "function") return;
    if (!["binary", "symbolic", "dual"].includes(modeKind)) return;

    if (firewallBlocksSource(source)) {
      warn(
        "[SpinalCord] Firewall blocked unsafe receptor source:",
        source,
        modeKind
      );
      Evolution?.recordLineage?.(
        `spinal-firewall-receptor-block:${modeKind}:${source}`
      );
      return;
    }

    const bucket = SpinalState.receptors[modeKind];
    if (!bucket[source]) bucket[source] = new Set();
    bucket[source].add(handler);

    Evolution?.recordLineage?.(`spinal-register-${modeKind}:${source}`);
    log("[SpinalCord] Receptor registered:", modeKind, source);

    SpinalPageScanner.emit("spinal-receptor-register", {
      modeKind,
      source
    });
  }

  function unregisterReceptor(modeKind, source, handler) {
    const bucket = SpinalState.receptors[modeKind];
    if (!bucket || !bucket[source]) return;

    bucket[source].delete(handler);
    if (bucket[source].size === 0) delete bucket[source];

    Evolution?.recordLineage?.(`spinal-unregister-${modeKind}:${source}`);
    log("[SpinalCord] Receptor unregistered:", modeKind, source);

    SpinalPageScanner.emit("spinal-receptor-unregister", {
      modeKind,
      source
    });
  }

  // --------------------------------------------------------------------------
  // IMPULSE EMISSION — strict dual-band conduction + advantage field + firewall
  // --------------------------------------------------------------------------
  function emitImpulse(source, impulse = {}) {
    const modeKind = impulse.modeKind || "symbolic";
    const executionContext = impulse.executionContext || {};
    const pressureSnapshot = impulse.pressureSnapshot || {};

    if (firewallBlocksSource(source)) {
      warn(
        "[SpinalCord] Firewall blocked unsafe impulse source:",
        source,
        modeKind
      );
      Evolution?.recordLineage?.(
        `spinal-firewall-impulse-block:${modeKind}:${source}`
      );

      SpinalPageScanner.emit("spinal-impulse-blocked", {
        source,
        modeKind
      });

      return;
    }

    SpinalState.impulseCount += 1;
    updateLoopAndAdvantage(modeKind);

    const impulseSignature = buildImpulseSignature({
      source,
      modeKind,
      executionContext
    });

    SpinalPageScanner.emit("spinal-impulse", {
      source,
      modeKind,
      impulseSignature,
      advantageField: SpinalState.advantageField
    });

    prewarmForImpulse(source, impulse, impulseSignature);

    EventBus?.emit?.("spinal:impulse", {
      source,
      modeKind,
      impulseSignature,
      executionContext,
      pressureSnapshot,
      advantageField: SpinalState.advantageField,
      loopCounters: SpinalState.loopCounters
    });

    const bucket = SpinalState.receptors[modeKind];
    const set = bucket?.[source];

    if (set && set.size > 0) {
      for (const handler of set) {
        try {
          handler(impulse);
        } catch (err) {
          warn("[SpinalCord] Receptor handler error:", source, err);
          SpinalPageScanner.emit("spinal-receptor-error", {
            source,
            modeKind
          });
        }
      }
    }

    Evolution?.recordLineage?.(`spinal-impulse-${modeKind}`);
  }

  // --------------------------------------------------------------------------
  // ROUTING — deterministic, no timestamps, route-root aware + firewall
  // --------------------------------------------------------------------------
  async function routeToOrgan(routeType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-organ");

    if (firewallBlocksRoute(routeType)) {
      warn("[SpinalCord] Firewall blocked unsafe organ route:", routeType);
      Evolution?.recordLineage?.(
        `spinal-firewall-route-organ-block:${routeType}`
      );
      EventBus?.emit?.("spinal:route:block", {
        kind: "organ",
        routeType,
        reason: "firewallBlocked"
      });

      SpinalPageScanner.emit("spinal-route-organ-blocked", {
        routeType
      });

      return {
        error: "firewallBlocked",
        kind: "organ",
        routeType,
        reason: "unsafeRoute"
      };
    }

    if (!Router?.route) {
      warn("[SpinalCord] Router missing route() — cannot route to organ.");

      SpinalPageScanner.emit("spinal-route-organ-router-missing", {
        routeType
      });

      return { error: "routerMissing", details: "Router.route not available" };
    }

    SpinalPageScanner.emit("spinal-route-organ-call", {
      routeType
    });

    const res = await Router.route(routeType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        advantageField: SpinalState.advantageField,
        loopCounters: SpinalState.loopCounters,
        extensions: SpinalState.extensions,
        systems: SpinalState.systems,
        presence: SpinalState.presence,
        coreGovernorAware: !!CoreGovernor,
        binaryOverlayAware: !!BinaryOverlay
      }
    });

    EventBus?.emit?.("spinal:route:organ", { routeType, payload, res });

    SpinalPageScanner.emit("spinal-route-organ-response", {
      routeType
    });

    return res;
  }

  async function routeToBackend(endpointType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-backend");

    if (firewallBlocksRoute(endpointType)) {
      warn(
        "[SpinalCord] Firewall blocked unsafe backend route:",
        endpointType
      );
      Evolution?.recordLineage?.(
        `spinal-firewall-route-backend-block:${endpointType}`
      );
      EventBus?.emit?.("spinal:route:block", {
        kind: "backend",
        routeType: endpointType,
        reason: "firewallBlocked"
      });

      SpinalPageScanner.emit("spinal-route-backend-blocked", {
        endpointType
      });

      return {
        error: "firewallBlocked",
        kind: "backend",
        routeType: endpointType,
        reason: "unsafeRoute"
      };
    }

    if (!Router?.route) {
      warn("[SpinalCord] Router missing route() — cannot route to backend.");

      SpinalPageScanner.emit("spinal-route-backend-router-missing", {
        endpointType
      });

      return { error: "routerMissing", details: "Router.route not available" };
    }

    SpinalPageScanner.emit("spinal-route-backend-call", {
      endpointType
    });

    const res = await Router.route(endpointType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        advantageField: SpinalState.advantageField,
        loopCounters: SpinalState.loopCounters,
        extensions: SpinalState.extensions,
        systems: SpinalState.systems,
        presence: SpinalState.presence,
        coreGovernorAware: !!CoreGovernor,
        binaryOverlayAware: !!BinaryOverlay
      }
    });

    EventBus?.emit?.("spinal:route:backend", { endpointType, payload, res });

    SpinalPageScanner.emit("spinal-route-backend-response", {
      endpointType
    });

    return res;
  }

  // --------------------------------------------------------------------------
  // HEALTH ENGINE — deterministic, no timestamps
  // --------------------------------------------------------------------------
  function updateHealth(score) {
    SpinalState.healthScore = score;
    EventBus?.emit?.("spinal:health:update", { score });
    Evolution?.updateOrganHealth?.("PulseOSSpinalCord", score);

    SpinalPageScanner.emit("spinal-health-update", {
      score
    });
  }

  function getHealth() {
    return SpinalState.healthScore;
  }

  // --------------------------------------------------------------------------
  // PUBLIC SPINAL CORD SURFACE
  // --------------------------------------------------------------------------
  const PulseOSSpinalCord = {
    PulseRole,
    SpinalState,

    // Extensions / systems
    registerExtension,
    registerSystem,

    // Presence (v12.3+)
    registerPresence,
    unregisterPresence,

    // Receptors
    registerReceptor,
    unregisterReceptor,

    // Impulses
    emitImpulse,

    // Routing
    routeToOrgan,
    routeToBackend,

    // Health
    updateHealth,
    getHealth
  };

  // --------------------------------------------------------------------------
  // SDN PREWARM ENGINE — Spinal Reflex Ignition (v13.0-PRESENCE-IMMORTAL)
  // --------------------------------------------------------------------------
  try {
    prewarmSDN(PulseOSSpinalCord);
    Brain?.log?.(
      "[PulseOSSpinalCord] SDN prewarm complete (reflex arcs hot, v13.0-PRESENCE-IMMORTAL)."
    );

    SpinalPageScanner.emit("spinal-sdn-prewarm-complete", {});
  } catch (err) {
    warn?.("[PulseOSSpinalCord] SDN prewarm failed:", err);

    SpinalPageScanner.emit("spinal-sdn-prewarm-error", {});
  }

  Brain?.log?.(
    "[PulseOSSpinalCord v13.0-PRESENCE-IMMORTAL] Initialized organism-wide dual-band spinal cord with firewall gating, chunk/cache prewarm, multi-presence spine, SDN prewarm, and PageScanner spine-level intel."
  );
  Evolution?.recordLineage?.("spinal-init-v13.0-PRESENCE-IMMORTAL");

  SpinalPageScanner.emit("spinal-init", {});

  return PulseOSSpinalCord;
}
