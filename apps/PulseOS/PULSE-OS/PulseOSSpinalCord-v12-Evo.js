// ============================================================================
// FILE: /PULSE-OS/PulseOSSpinalCord.js
// PULSE OS SPINAL CORD — v12-Evo-Max
// “ORGANISM-WIDE DUAL-BAND SPINE • ADVANTAGE FIELD CONDUCTOR • ROUTE ROOT”
// ============================================================================
//
// ROLE (v12-Evo-Max):
// -------------------
// • The ONE TRUE SPINE for the entire Pulse organism (route root).
// • Dual-band (binary + symbolic) central nervous system wiring layer.
// • Strict separation of binary, symbolic, and dual impulses.
// • Receives impulses from UI, GPU, Mesh, Earn, OS, AI, Proxy, Send.
// • Routes impulses to Router, Cortex, Brain, Organs, and Systems.
// • Conducts unified advantage field + loop theory across all extensions.
// • Pure wiring — no cognition, no business logic, no compute.
//
// SAFETY CONTRACT (v12-Evo-Max):
// ------------------------------
// • No timestamps (no Date.now()).
// • No nondeterminism, no randomness.
// • No mutation of external modules.
// • No backend calls directly (Router only).
// • Deterministic routing behavior.
// • Pure wiring — no decisions beyond modeKind + extensionId.
// • No direct GPU / FS / DOM / Network calls.
// ============================================================================


// ============================================================================
// SPINAL CORD IDENTITY — v12-Evo-Max
// ============================================================================
export const PulseRole = {
  type: "NervousSystem",
  subsystem: "OS",
  layer: "SpinalCord",
  version: "12.0-Evo-Max",
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
    routingContract: "PulseRouter-v12",
    osOrganContract: "PulseOS-v12-Evo",
    earnCompatibility: "PulseEarn-v12",
    gpuCompatibility: "PulseGPU-v12-Evo",
    sendCompatibility: "PulseSendSystem-v12",
    meshCompatibility: "PulseMesh-v12",
    aiCompatibility: "PulseAI-v12"
  }
};


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
  // EXTENSION / SYSTEM REGISTRATION — organism-wide attachment points
  // --------------------------------------------------------------------------
  function registerExtension(extensionId, kind, meta = {}) {
    if (!extensionId || !kind) return;
    SpinalState.extensions[extensionId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-ext-register:${extensionId}:${kind}`);
    log("[SpinalCord] Extension registered:", extensionId, kind);
  }

  function registerSystem(systemId, kind, meta = {}) {
    if (!systemId || !kind) return;
    SpinalState.systems[systemId] = { kind, meta };
    Evolution?.recordLineage?.(`spinal-sys-register:${systemId}:${kind}`);
    log("[SpinalCord] System registered:", systemId, kind);
  }


  // --------------------------------------------------------------------------
  // RECEPTOR REGISTRATION — strict separation
  // --------------------------------------------------------------------------
  function registerReceptor(modeKind, source, handler) {
    if (!source || typeof handler !== "function") return;
    if (!["binary", "symbolic", "dual"].includes(modeKind)) return;

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
  // IMPULSE EMISSION — strict dual-band conduction + advantage field
  // --------------------------------------------------------------------------
  function emitImpulse(source, impulse = {}) {
    const modeKind = impulse.modeKind || "symbolic"; // binary | symbolic | dual
    const executionContext = impulse.executionContext || {};
    const pressureSnapshot = impulse.pressureSnapshot || {};

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
  // ROUTING — deterministic, no timestamps, route-root aware
  // --------------------------------------------------------------------------
  async function routeToOrgan(routeType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-organ");

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

  Brain?.log?.("[PulseOSSpinalCord v12-Evo-Max] Initialized organism-wide dual-band spinal cord.");
  Evolution?.recordLineage?.("spinal-init-v12");

  return PulseOSSpinalCord;
}
