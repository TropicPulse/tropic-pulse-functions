// ============================================================================
//  v11‑EVO — BOUNDARIES ENGINE (Dual‑Band Superego Contract)
// ============================================================================

export const BoundariesMeta = Object.freeze({
  layer: "PulseAIBoundariesLayer",
  role: "BOUNDARIES_ENGINE",
  version: "11.1-EVO",
  identity: "aiBoundariesEngine-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    boundaryAware: true,
    personaAware: true,
    permissionAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve symbolic + binary-aware boundaries deterministically from persona, mode, and binary vitals.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent boundaries",
      "override SafetyFrame decisions",
      "override Overmind decisions"
    ]),

    always: Object.freeze([
      "respect static persona boundaries",
      "respect universal boundary levels",
      "respect boundary modes",
      "respect binary vitals",
      "remain deterministic",
      "remain read-only"
    ])
  })
});

// ---------------------------------------------------------
//  ENGINE IMPLEMENTATION
// ---------------------------------------------------------

function createBoundariesEngine({ context = {} } = {}) {
  function resolve(personaId, mode, binaryVitals = {}) {
    const staticBoundaries = getBoundariesForPersona(personaId);

    return Object.freeze({
      static: staticBoundaries,
      mode,
      binaryVitals
    });
  }

  function check(personaId, domain, action, mode, binaryVitals = {}) {
    return canPerformDynamic(
      personaId,
      domain,
      action,
      mode,
      binaryVitals
    );
  }

  return Object.freeze({
    meta: BoundariesMeta,
    resolve,
    check
  });
}

// ---------------------------------------------------------
//  ESM EXPORTS
// ---------------------------------------------------------

export {
  createBoundariesEngine
};

// ---------------------------------------------------------
//  COMMONJS FALLBACK EXPORTS
// ---------------------------------------------------------

if (typeof module !== "undefined") {
  module.exports = {
    BoundariesMeta,
    createBoundariesEngine
  };
}
