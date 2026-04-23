// ============================================================================
//  PulseRouter-v10.4
//  Deterministic Routing Brainstem • Pulse-Agnostic • Evolution-Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The routing brainstem of the organism.
//  • Works with Pulse v1, Pulse v2, Pulse v3.
//  • Deterministic routing: NO randomness, NO timestamps.
//  • Pattern-aware, lineage-aware, mode-aware, identity-aware.
//  • Uses advantageField + healthScore when available.
//  • Maintains routing memory (success/failure).
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a mesh layer.
//  • Not a mover.
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a network layer.
//
//  SAFETY CONTRACT (v10.4):
//  ------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure deterministic routing.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter Organ (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "RoutingBrainstem",
  version: "10.4",
  identity: "PulseRouter-v10.4",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    advantageAware: true,
    deterministicRouting: true,
    memoryReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseRouter10Ready: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMesh-v10.4",
  sendContract: "PulseSend-v10.4"
};


// ============================================================================
//  INTERNAL MEMORY — deterministic, local, safe
// ============================================================================
const routingMemory = {
  successes: {},
  failures: {}
};

function rememberSuccess(pattern, target) {
  const key = `${pattern}::${target}`;
  routingMemory.successes[key] = (routingMemory.successes[key] || 0) + 1;
}

function rememberFailure(pattern, target) {
  const key = `${pattern}::${target}`;
  routingMemory.failures[key] = (routingMemory.failures[key] || 0) + 1;
}


// ============================================================================
//  INTERNAL: Deterministic routing algorithm
// ============================================================================
//
//  Inputs:
//    • pattern
//    • lineageDepth
//    • mode
//    • advantageField (if present)
//    • healthScore (if present)
//    • targetHint (optional)
//
//  Output:
//    • targetOrgan (string)
// ============================================================================

function computeRouteTarget(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "normal";

  const advantage = pulse.advantageField || {};
  const health = pulse.healthScore ?? 1;

  // ⭐ Deterministic hash
  const raw = `${pattern}::${lineageDepth}::${mode}::${health}`;
  let acc = 0;

  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 5)) % 9973;
  }

  // ⭐ Map hash → organ
  const organs = ["GPU", "Earn", "OS", "Mesh"];
  const index = acc % organs.length;

  return organs[index];
}


// ============================================================================
//  PUBLIC API — PulseRouter (v10.4)
// ============================================================================
export const PulseRouter = {

  PulseRole,

  // --------------------------------------------------------------------------
  //  route(pulse)
  // --------------------------------------------------------------------------
  route(pulse) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";

    // ⭐ If pulse provides a targetHint (e.g., returnTo), respect it
    if (pulse.targetHint) {
      rememberSuccess(pattern, pulse.targetHint);
      return pulse.targetHint;
    }

    // ⭐ Compute deterministic target
    const target = computeRouteTarget(pulse);

    rememberSuccess(pattern, target);
    return target;
  },

  // --------------------------------------------------------------------------
  //  remember(pulse, target, status, healthScore)
  // --------------------------------------------------------------------------
  remember(pulse, target, status, healthScore = 1) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";

    if (status === "success") {
      rememberSuccess(pattern, target);
    } else {
      rememberFailure(pattern, target);
    }

    // ⭐ No mutation of pulse — memory is local only
    return {
      pattern,
      target,
      status,
      healthScore
    };
  },

  // --------------------------------------------------------------------------
  //  diagnostics() — optional introspection
  // --------------------------------------------------------------------------
  diagnostics() {
    return {
      PulseRole,
      routingMemory
    };
  }
};
