// ============================================================================
// FILE: /PULSE-OS/PulseOSSpinalCord.js
// PULSE OS SPINAL CORD — v11-Evo-Prime
// “DUAL-BAND CENTRAL NERVOUS SYSTEM WIRING LAYER”
// ============================================================================
//
// ROLE (v11-Evo-Prime):
// ---------------------
// • Dual-band spinal cord for the entire Pulse organism.
// • Strict separation of binary, symbolic, and dual impulses.
// • Receives impulses from UI, GPU, Mesh, Earn, OS organs.
// • Routes impulses to Router, Cortex, Brain, and Organs.
// • Emits nervous-system events onto the EventBus.
// • Pure wiring — no cognition, no business logic, no compute.
//
// SAFETY CONTRACT (v11-Evo-Prime):
// --------------------------------
// • No timestamps (no Date.now()).
// • No nondeterminism, no randomness.
// • No mutation of external modules.
// • No backend calls directly (Router only).
// • Deterministic routing behavior.
// • Pure wiring — no decisions, no branching logic beyond modeKind.
// ============================================================================


// ============================================================================
// SPINAL CORD IDENTITY — v11-Evo-Prime
// ============================================================================
export const PulseRole = {
  type: "NervousSystem",
  subsystem: "OS",
  layer: "SpinalCord",
  version: "11.0-Evo-Prime",
  identity: "PulseOSSpinalCord",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,
    continuanceAware: true,

    // Dual-band nervous system
    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,

    // Updated routing contracts
    routingContract: "PulseRouter-v11",
    osOrganContract: "PulseOS-v11-Evo",
    earnCompatibility: "PulseEarn-v11",
    gpuCompatibility: "PulseGPU-v11-Evo",
    sendCompatibility: "PulseSendSystem-v11"
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
    impulseCount: 0,
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
      ec.shapeSignature || ""
    ].join("|");
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
    log(`[SpinalCord] Receptor registered (${modeKind}):`, source);
  }

  function unregisterReceptor(modeKind, source, handler) {
    const bucket = SpinalState.receptors[modeKind];
    if (!bucket || !bucket[source]) return;

    bucket[source].delete(handler);
    if (bucket[source].size === 0) delete bucket[source];

    Evolution?.recordLineage?.(`spinal-unregister-${modeKind}:${source}`);
    log(`[SpinalCord] Receptor unregistered (${modeKind}):`, source);
  }


  // --------------------------------------------------------------------------
  // IMPULSE EMISSION — strict dual-band conduction
  // --------------------------------------------------------------------------
  function emitImpulse(source, impulse = {}) {
    const modeKind = impulse.modeKind || "symbolic"; // binary | symbolic | dual
    const executionContext = impulse.executionContext || {};
    const pressureSnapshot = impulse.pressureSnapshot || {};

    SpinalState.impulseCount += 1;

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
      pressureSnapshot
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
  // ROUTING — deterministic, no timestamps
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
        impulseCount: SpinalState.impulseCount
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
        impulseCount: SpinalState.impulseCount
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

  Brain?.log?.("[PulseOSSpinalCord v11-Evo-Prime] Initialized dual-band spinal cord.");
  Evolution?.recordLineage?.("spinal-init-v11");

  return PulseOSSpinalCord;
}
