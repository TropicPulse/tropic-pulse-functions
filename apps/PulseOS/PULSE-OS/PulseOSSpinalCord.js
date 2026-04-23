// ============================================================================
// FILE: /PULSE-OS/PulseOSSpinalCord.js
// PULSE OS SPINAL CORD — v10.4
// “CENTRAL NERVOUS SYSTEM WIRING LAYER”
// ============================================================================
//
// ROLE (v10.4):
// -------------
// • Unified spinal cord for the entire Pulse organism.
// • Receives impulses from UI, GPU, Mesh, Earn, OS organs.
// • Routes impulses to Router, Cortex, Brain, and Organs.
// • Emits nervous‑system events onto the EventBus.
// • Tracks nervous‑system health for Evolution / BrainIntel.
// • Pure frontend wiring — no backend, no fetch, no filesystem.
//
// SAFETY CONTRACT (v10.4):
// ------------------------
// • No dynamic eval / Function / import.meta.glob.
// • No direct backend calls (backend is reached via Router/route only).
// • Deterministic routing behavior (no random branching).
// • No mutation of external modules (Brain, Router, EventBus).
// • Spinal Cord is wiring only — no cognition, no business logic.
// ============================================================================

export const PulseRole = {
  type: "NervousSystem",
  subsystem: "OS",
  layer: "SpinalCord",
  version: "10.4",
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

    routingContract: "PulseRouter-v10.4",
    osOrganContract: "PulseOS-v10.4",
    earnCompatibility: "PulseEarn-v10.4",
    gpuCompatibility: "PulseGPU-v10.4",
    sendCompatibility: "PulseSendSystem-v10.4"
  }
};


// ============================================================================
// FACTORY — All dependencies are injected by CNS Brain / Cortex
// ============================================================================
export function createPulseOSSpinalCord({
  Router,        // expected to expose: route(type, payload)
  EventBus,      // expected to expose: emit(event, payload)
  Brain,         // PulseOSBrain (for logging + context)
  Evolution,     // optional: Evolution organ for lineage + drift
  log = console.log,
  warn = console.warn
}) {

  // --------------------------------------------------------------------------
  // INTERNAL STATE
  // --------------------------------------------------------------------------
  const SpinalState = {
    receptors: {},          // { source: Set<handler> }
    impulseCount: 0,
    lastImpulseTs: null,
    healthScore: 1.0
  };


  // --------------------------------------------------------------------------
  // RECEPTOR REGISTRATION — sources that can emit impulses into Spinal Cord
  // --------------------------------------------------------------------------
  function registerReceptor(source, handler) {
    if (!source || typeof handler !== "function") return;

    if (!SpinalState.receptors[source]) {
      SpinalState.receptors[source] = new Set();
    }

    SpinalState.receptors[source].add(handler);

    Evolution?.recordLineage?.(`spinal-register-receptor:${source}`);
    log("[PulseOSSpinalCord] Receptor registered:", source);
  }


  function unregisterReceptor(source, handler) {
    const set = SpinalState.receptors[source];
    if (!set) return;

    set.delete(handler);
    if (set.size === 0) {
      delete SpinalState.receptors[source];
    }

    Evolution?.recordLineage?.(`spinal-unregister-receptor:${source}`);
    log("[PulseOSSpinalCord] Receptor unregistered:", source);
  }


  // --------------------------------------------------------------------------
  // IMPULSE EMISSION — entrypoint from UI / GPU / Mesh / Earn / OS
  // --------------------------------------------------------------------------
  function emitImpulse(source, impulse) {
    SpinalState.impulseCount += 1;
    SpinalState.lastImpulseTs = Date.now();

    EventBus?.emit?.("spinal:impulse", { source, impulse, ts: SpinalState.lastImpulseTs });

    const set = SpinalState.receptors[source];
    if (set && set.size > 0) {
      for (const handler of set) {
        try {
          handler(impulse);
        } catch (err) {
          warn("[PulseOSSpinalCord] Receptor handler error:", source, err);
        }
      }
    }

    Evolution?.recordLineage?.("spinal-impulse");
  }


  // --------------------------------------------------------------------------
  // ROUTING HELPERS — Spinal Cord → Router → Organs / Backend
  // --------------------------------------------------------------------------
  async function routeToOrgan(routeType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-organ");

    if (!Router?.route) {
      warn("[PulseOSSpinalCord] Router missing route() — cannot route to organ.");
      return { error: "routerMissing", details: "Router.route not available" };
    }

    const res = await Router.route(routeType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        lastImpulseTs: SpinalState.lastImpulseTs
      }
    });

    EventBus?.emit?.("spinal:route:organ", { routeType, payload, res });
    return res;
  }


  async function routeToBackend(endpointType, payload = {}) {
    Evolution?.recordLineage?.("spinal-route-backend");

    if (!Router?.route) {
      warn("[PulseOSSpinalCord] Router missing route() — cannot route to backend.");
      return { error: "routerMissing", details: "Router.route not available" };
    }

    const res = await Router.route(endpointType, {
      ...payload,
      spinalContext: {
        impulseCount: SpinalState.impulseCount,
        lastImpulseTs: SpinalState.lastImpulseTs
      }
    });

    EventBus?.emit?.("spinal:route:backend", { endpointType, payload, res });
    return res;
  }


  // --------------------------------------------------------------------------
  // HEALTH ENGINE — Spinal Cord health reporting for Evolution / BrainIntel
  // --------------------------------------------------------------------------
  function updateHealth(score) {
    SpinalState.healthScore = score;
    EventBus?.emit?.("spinal:health:update", { score, ts: Date.now() });
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

  Brain?.log?.("[PulseOSSpinalCord v10.4] Initialized spinal cord.");
  Evolution?.recordLineage?.("spinal-init");

  return PulseOSSpinalCord;
}
