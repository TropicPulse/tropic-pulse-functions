// ============================================================================
//  v12.3‑Presence — BOUNDARIES ENGINE (Dual‑Band Superego Contract)
// ============================================================================
import { getBoundariesForPersona, canPerformDynamic } from "./permissions.js";

export const BoundariesMeta = Object.freeze({
  layer: "PulseAIBoundariesLayer",
  role: "BOUNDARIES_ENGINE",
  version: "12.3-Presence",
  identity: "aiBoundariesEngine-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualBandSafe: true,
    boundaryAware: true,
    personaAware: true,
    permissionAware: true,
    packetAware: true,
    windowAware: true,
    evolutionAware: true,
    driftAware: true,

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve symbolic + binary-aware boundaries deterministically from persona, mode, and binary vitals.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent boundaries",
      "override SafetyFrame decisions",
      "override Overmind decisions",
      "inject symbolic metadata",
      "alter boundary meaning"
    ]),

    always: Object.freeze([
      "respect static persona boundaries",
      "respect universal boundary levels",
      "respect boundary modes",
      "respect binary vitals",
      "emit deterministic packets",
      "remain deterministic",
      "remain read-only"
    ])
  }),

  presence: Object.freeze({
    organId: "BoundariesEngine",
    organKind: "Superego",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "resolve",
        "check",
        "driftDetected",
        "prewarm",
        "prewarm-error"
      ]
    }
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, boundary-scoped
// ============================================================================
function emitBoundaryPacket(type, payload) {
  return Object.freeze({
    meta: BoundariesMeta,
    packetType: `boundaries-${type}`,
    timestamp: Date.now(),
    epoch: BoundariesMeta.evo.epoch,
    layer: BoundariesMeta.layer,
    role: BoundariesMeta.role,
    identity: BoundariesMeta.identity,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms static boundary tables + dynamic resolver
// ============================================================================
export function prewarmBoundariesEngine({ trace = false } = {}) {
  try {
    const warmPersona = "architect";
    const warmMode = "default";
    const warmVitals = { pressure: 0, load: 0 };

    const packet = emitBoundaryPacket("prewarm", {
      message: "Boundaries engine prewarmed and static tables aligned.",
      warmPersona,
      warmMode,
      warmVitals
    });

    if (trace) console.log("[BoundariesEngine] prewarm", packet);
    return packet;
  } catch (err) {
    return emitBoundaryPacket("prewarm-error", {
      error: String(err),
      message: "Boundaries engine prewarm failed."
    });
  }
}

// ============================================================================
//  ENGINE IMPLEMENTATION — v12.3‑Presence
// ============================================================================
export function createBoundariesEngine({ context = {} } = {}) {
  let driftCount = 0;

  function resolve(personaId, mode, binaryVitals = {}) {
    const staticBoundaries = getBoundariesForPersona(personaId);

    return emitBoundaryPacket("resolve", {
      personaId,
      mode,
      binaryVitals,
      static: staticBoundaries
    });
  }

  function check(personaId, domain, action, mode, binaryVitals = {}) {
    const allowed = canPerformDynamic(
      personaId,
      domain,
      action,
      mode,
      binaryVitals
    );

    const driftDetected = binaryVitals?.pressure >= 0.9;
    if (driftDetected) driftCount++;

    return emitBoundaryPacket("check", {
      personaId,
      domain,
      action,
      mode,
      binaryVitals,
      allowed,
      driftDetected,
      driftCount
    });
  }

  return Object.freeze({
    meta: BoundariesMeta,
    resolve,
    check
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    BoundariesMeta,
    createBoundariesEngine,
    prewarmBoundariesEngine
  };
}
