// ============================================================================
// FILE: /PULSE-OS/PulseOSSpinalCord.js
// PULSE OS SPINAL CORD — v13-Evo-Max-Firewall
// “ORGANISM-WIDE DUAL-BAND SPINE • ADVANTAGE FIELD CONDUCTOR • ROUTE ROOT”
// ============================================================================
//
// ROLE (v13-Evo-Max-Firewall):
// ----------------------------
// • The ONE TRUE SPINE for the entire Pulse organism (route root).
// • Dual-band (binary + symbolic) central nervous system wiring layer.
// • Strict separation of binary, symbolic, and dual impulses.
// • Receives impulses from UI, GPU, Mesh, Earn, OS, AI, Proxy, Send.
// • Routes impulses to Router, Cortex, Brain, Organs, and Systems.
// • Conducts unified advantage field + loop theory across all extensions.
// • Pure wiring — no cognition, no business logic, no compute.
// • Enforces Firewall (PulseChunks-v1) at the nervous-system level.
//
// SAFETY CONTRACT (v13-Evo-Max-Firewall):
// ---------------------------------------
// • No timestamps (no Date.now()).
// • No nondeterminism, no randomness.
// • No mutation of external modules.
// • No backend calls directly (Router only).
// • Deterministic routing behavior.
// • Pure wiring — no decisions beyond modeKind + extensionId + firewall verdict.
// • No direct GPU / FS / DOM / Network calls.
// • Firewall-aware: refuses unsafe routes, sources, extensions, systems.
// ============================================================================
import { prewarmSDN } from "./PulseSDN-Prewarm-v12-EVO.js";


// ============================================================================
// SPINAL CORD IDENTITY — v13-Evo-Max-Firewall
// ============================================================================
export const PulseRole = {
  type: "NervousSystem",
  subsystem: "OS",
  layer: "SpinalCord",
  version: "13.0-Evo-Max-Firewall",
  identity: "PulseOSSpinalCord",

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

    // Updated routing contracts
    routingContract: "PulseRouter-v13-Firewall",
    osOrganContract: "PulseOS-v13-Evo",
    earnCompatibility: "PulseEarn-v13",
    gpuCompatibility: "PulseGPU-v13-Evo",
    sendCompatibility: "PulseSendSystem-v13",
    meshCompatibility: "PulseMesh-v13",
    aiCompatibility: "PulseAI-v13",

    // Firewall awareness
    firewallAware: true,
    firewallEnforcedAtSpine: true
  }
};

export const PulseOSSpinalCordMeta = Object.freeze({
  layer: "PulseOSSpinalCord",
  role: "CENTRAL_SPINE_ORGAN",
  version: "v13-EVO-MAX-FIREWALL",
  identity: "PulseOSSpinalCord-v13-EVO-MAX-FIREWALL",

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

    // Safety prohibitions
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
    root: "PulseOS-v13-EVO",
    parent: "PulseOS-v13-EVO-MAX",
    ancestry: [
      "PulseOSSpinalCord-v9",
      "PulseOSSpinalCord-v10",
      "PulseOSSpinalCord-v11",
      "PulseOSSpinalCord-v11-Evo",
      "PulseOSSpinalCord-v11-Evo-Max",
      "PulseOSSpinalCord-v12-Evo-Max",
      "PulseOSSpinalCord-v13-Evo-Max-Firewall"
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
    adaptive: "binary-overlay + extension-aware routing surfaces + firewall gating",
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
  Firewall,      // NEW: PulseChunks-v1 / firewall surface (optional but recommended)
  log = console.log,
  warn = console.warn
}) {

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
      ec.systemId || ""
    ].join("|");
  }

  function updateLoopAndAdvantage(modeKind) {
    if (modeKind === "binary") SpinalState.loopCounters.binary += 1;
    else if (modeKind === "symbolic") SpinalState.loopCounters.symbolic += 1;
    else if (modeKind === "dual") SpinalState.loopCounters.dual += 1;

    SpinalState.advantageField.lastModeKind = modeKind;

    // Simple deterministic advantage flags (no time, no randomness)
    SpinalState.advantageField.binaryHot =
      SpinalState.loopCounters.binary > SpinalState.loopCounters.symbolic;
    SpinalState.advantageField.symbolicHot =
      SpinalState.loopCounters.symbolic > SpinalState.loopCounters.binary;
    SpinalState.advantageField.dualHot =
      SpinalState.loopCounters.dual > 0;
  }


  // --------------------------------------------------------------------------
  // FIREWALL HELPERS — centralized checks
  // --------------------------------------------------------------------------
  function firewallBlocksRoute(routeType) {
    if (!Firewall || typeof Firewall.isBlockedRoute !== "function") return false;
    return !!Firewall.isBlockedRoute(routeType);
  }

  function firewallBlocksSource(source) {
    if (!Firewall || typeof Firewall.isBlockedSource !== "function") return false;
    return !!Firewall.isBlockedSource(source);
  }

  function firewallBlocksExtension(extensionId) {
    if (!Firewall || typeof Firewall.isBlockedExtension !== "function") return false;
    return !!Firewall.isBlockedExtension(extensionId);
  }

  function firewallBlocksSystem(systemId) {
    if (!Firewall || typeof Firewall.isBlockedSystem !== "function") return false;
    return !!Firewall.isBlockedSystem(systemId);
  }


  // --------------------------------------------------------------------------
  // EXTENSION / SYSTEM REGISTRATION — organism-wide attachment points
  // --------------------------------------------------------------------------
  function registerExtension(extensionId, kind, meta = {}) {
    if (!extensionId || !kind) return;

    // Firewall gate
    if (firewallBlocksExtension(extensionId)) {
      warn("[SpinalCord] Firewall blocked unsafe extension:", extensionId, kind);
      Evolution?.recordLineage?.(`spinal-firewall-ext-block:${extensionId}:${kind}`);
      return;
    }

    SpinalState.extensions[extensionId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-ext-register:${extensionId}:${kind}`);
    log("[SpinalCord] Extension registered:", extensionId, kind);
  }

  function registerSystem(systemId, kind, meta = {}) {
    if (!systemId || !kind) return;

    // Firewall gate
    if (firewallBlocksSystem(systemId)) {
      warn("[SpinalCord] Firewall blocked unsafe system:", systemId, kind);
      Evolution?.recordLineage?.(`spinal-firewall-sys-block:${systemId}:${kind}`);
      return;
    }

    SpinalState.systems[systemId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-sys-register:${systemId}:${kind}`);
    log("[SpinalCord] System registered:", systemId, kind);
  }


  // --------------------------------------------------------------------------
  // RECEPTOR REGISTRATION — strict separation + firewall
  // --------------------------------------------------------------------------
  function registerReceptor(modeKind, source, handler) {
    if (!source || typeof handler !== "function") return;
    if (!["binary", "symbolic", "dual"].includes(modeKind)) return;

    // Firewall gate
    if (firewallBlocksSource(source)) {
      warn("[SpinalCord] Firewall blocked unsafe receptor source:", source, modeKind);
      Evolution?.recordLineage?.(`spinal-firewall-receptor-block:${modeKind}:${source}`);
      return;
    }

    const bucket = SpinalState.receptors[modeKind];
    if (!bucket[source]) bucket[source] = new Set();
    bucket[source].add(handler);

    Evolution?.recordLineage?.(`spinal-register-${modeKind}:${source}`);
    log("[SpinalCord] Receptor registered:", modeKind, source);
  }

  function unregisterReceptor(modeKind, source, handler) {
    const bucket = SpinalState.receptors[modeKind];
    if (!bucket || !bucket[source]) return;

    bucket[source].delete(handler);
    if (bucket[source].size === 0) delete bucket[source];

    Evolution?.recordLineage?.(`spinal-unregister-${modeKind}:${source}`);
    log("[SpinalCord] Receptor unregistered:", modeKind, source);
  }


  // --------------------------------------------------------------------------
  // IMPULSE EMISSION — strict dual-band conduction + advantage field + firewall
  // --------------------------------------------------------------------------
  function emitImpulse(source, impulse = {}) {
    const modeKind = impulse.modeKind || "symbolic"; // binary | symbolic | dual
    const executionContext = impulse.executionContext || {};
    const pressureSnapshot = impulse.pressureSnapshot || {};

    // Firewall gate: block unsafe impulse sources
    if (firewallBlocksSource(source)) {
      warn("[SpinalCord] Firewall blocked unsafe impulse source:", source, modeKind);
      Evolution?.recordLineage?.(`spinal-firewall-impulse-block:${modeKind}:${source}`);
      return;
    }

    SpinalState.impulseCount += 1;
    updateLoopAndAdvantage(modeKind);

    const impulseSignature = buildImpulseSignature({
      source,
      modeKind,
      executionContext
    });

    // Emit spinal impulse event (no timestamps)
    EventBus?.emit?.("spinal:impulse", {
      source,
      modeKind,
      impulseSignature,
      executionContext,
      pressureSnapshot,
      advantageField: SpinalState.advantageField,
      loopCounters: SpinalState.loopCounters
    });

    // Strict separation
    const bucket = SpinalState.receptors[modeKind];
    const set = bucket?.[source];

    if (set && set.size > 0) {
      for (const handler of set) {
        try {
          handler(impulse);
        } catch (err) {
          warn("[SpinalCord] Receptor handler error:", source, err);
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

    // Firewall gate: block unsafe routes
    if (firewallBlocksRoute(routeType)) {
      warn("[SpinalCord] Firewall blocked unsafe organ route:", routeType);
      Evolution?.recordLineage?.(`spinal-firewall-route-organ-block:${routeType}`);
      EventBus?.emit?.("spinal:route:block", {
        kind: "organ",
        routeType,
        reason: "firewallBlocked"
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
      return { error: "routerMissing", details: "Router.route not available" };
    }

    const res = await Router.route(routeType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        advantageField: SpinalState.advantageField,
        loopCounters: SpinalState.loopCounters,
        extensions: SpinalState.extensions,
        systems: SpinalState.systems,
        coreGovernorAware: !!CoreGovernor,
        binaryOverlayAware: !!BinaryOverlay
      }
    });

    EventBus?.emit?.("spinal:route:organ", { routeType, payload, res });
    return res;
  }

  async function routeToBackend(endpointType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-backend");

    // Firewall gate: block unsafe backend routes
    if (firewallBlocksRoute(endpointType)) {
      warn("[SpinalCord] Firewall blocked unsafe backend route:", endpointType);
      Evolution?.recordLineage?.(`spinal-firewall-route-backend-block:${endpointType}`);
      EventBus?.emit?.("spinal:route:block", {
        kind: "backend",
        routeType: endpointType,
        reason: "firewallBlocked"
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
      return { error: "routerMissing", details: "Router.route not available" };
    }

    const res = await Router.route(endpointType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        advantageField: SpinalState.advantageField,
        loopCounters: SpinalState.loopCounters,
        extensions: SpinalState.extensions,
        systems: SpinalState.systems,
        coreGovernorAware: !!CoreGovernor,
        binaryOverlayAware: !!BinaryOverlay
      }
    });

    EventBus?.emit?.("spinal:route:backend", { endpointType, payload, res });
    return res;
  }


  // --------------------------------------------------------------------------
  // HEALTH ENGINE — deterministic, no timestamps
  // --------------------------------------------------------------------------
  function updateHealth(score) {
    SpinalState.healthScore = score;
    EventBus?.emit?.("spinal:health:update", { score });
    Evolution?.updateOrganHealth?.("PulseOSSpinalCord", score);
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
// SDN PREWARM ENGINE — Spinal Reflex Ignition
// --------------------------------------------------------------------------
try {
  prewarmSDN(PulseOSSpinalCord);
  Brain?.log?.("[PulseOSSpinalCord] SDN prewarm complete (reflex arcs hot).");
} catch (err) {
  warn?.("[PulseOSSpinalCord] SDN prewarm failed:", err);
}

Brain?.log?.("[PulseOSSpinalCord v13-Evo-Max-Firewall] Initialized organism-wide dual-band spinal cord with firewall gating.");
Evolution?.recordLineage?.("spinal-init-v13-firewall");

return PulseOSSpinalCord;
}
