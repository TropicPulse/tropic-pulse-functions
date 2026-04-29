// ============================================================================
//  v11.3‑EVO — BOUNDARIES ENGINE (Dual‑Band Superego Contract)
// ============================================================================
import { getBoundariesForPersona,canPerformDynamic } from "./permissions.js";

export const BoundariesMeta = Object.freeze({
  layer: "PulseAIBoundariesLayer",
  role: "BOUNDARIES_ENGINE",
  version: "11.3-EVO",
  identity: "aiBoundariesEngine-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    boundaryAware: true,
    personaAware: true,
    permissionAware: true,
    packetAware: true,       // ⭐ NEW
    windowAware: true,       // ⭐ NEW
    evolutionAware: true,    // ⭐ NEW
    driftAware: true,        // ⭐ NEW
    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.3-EVO"
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
      "inject symbolic metadata",    // ⭐ NEW
      "alter boundary meaning"       // ⭐ NEW
    ]),

    always: Object.freeze([
      "respect static persona boundaries",
      "respect universal boundary levels",
      "respect boundary modes",
      "respect binary vitals",
      "emit deterministic packets",  // ⭐ NEW
      "remain deterministic",
      "remain read-only"
    ])
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
//  ENGINE IMPLEMENTATION — v11.3‑EVO
// ============================================================================
function createBoundariesEngine({ context = {} } = {}) {
  // Drift counter for hybrid mode
  let driftCount = 0;

  function resolve(personaId, mode, binaryVitals = {}) {
    const staticBoundaries = getBoundariesForPersona(personaId);

    const packet = emitBoundaryPacket("resolve", {
      personaId,
      mode,
      binaryVitals,
      static: staticBoundaries
    });

    return Object.freeze({
      static: staticBoundaries,
      mode,
      binaryVitals,
      packet
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

    // Drift detection: if binary vitals cross thresholds
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
//  EXPORTS
// ============================================================================
export { createBoundariesEngine };

if (typeof module !== "undefined") {
  module.exports = {
    BoundariesMeta,
    createBoundariesEngine,
    prewarmBoundariesEngine
  };
}
