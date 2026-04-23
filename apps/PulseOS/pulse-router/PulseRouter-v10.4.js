// ============================================================================
//  PulseRouter-v11-Evo-A2 — EVOLUTION ROUTER
//  Deterministic Routing Spine • Pulse-Agnostic • Evolution-Aware
//  Pattern/Lineage/Page-Ancestry + Loop-Theory Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The routing spine of the organism.
//  • Works with Pulse v1, Pulse v2, Pulse v3.
//  • Deterministic routing: NO randomness, NO timestamps.
//  • Pattern-aware, lineage-aware, mode-aware, identity-aware.
//  • Uses advantageField + healthScore when available.
//  • Integrates Commandments, Instincts, Design, Thought.
//  • Maintains routing memory (success/failure).
//  • Ancestry-aware: patternAncestry, lineageSignature, pageAncestrySignature.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a mesh layer.
//  • Not a mover.
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a network layer.
//
//  SAFETY CONTRACT (v11-Evo-A2):
//  -----------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure deterministic routing.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter Organ (v11-Evo-A2)
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "RoutingSpine",
  version: "11.0",
  identity: "PulseRouter-v11-Evolution-A2",

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
    pulseRouter11Ready: true,
    commandmentsAware: true,
    instinctsAware: true,
    designAware: true,
    thoughtAware: true
  },

  // ⭐ LOOP THEORY INVARIANTS ⭐
  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMesh-v11",
  sendContract: "PulseSend-v11"
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
//  INTERNAL: Fallback deterministic routing algorithm (legacy spine)
// ============================================================================
function fallbackRouteTarget(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "normal";
  const health = pulse.healthScore ?? 1;

  const raw = `${pattern}::${lineageDepth}::${mode}::${health}`;
  let acc = 0;

  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 5)) % 9973;
  }

  const organs = ["GPU", "Earn", "OS", "Mesh"];
  const index = acc % organs.length;

  return organs[index];
}


// ============================================================================
//  INTERNAL: Degradation tier helper (aligned with Thought/Instincts)
// ============================================================================
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;

  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ============================================================================
//  INTERNAL: ancestry helpers (pattern/lineage/page)
// ============================================================================
function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const patternAncestry = buildPatternAncestry(safePattern);
  const lineageSig = buildLineageSignature(safeLineage);

  const shape = {
    pattern: safePattern,
    patternAncestry,
    lineageSignature: lineageSig,
    pageId: safePageId
  };

  // simple deterministic hash (no imports)
  let raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}
// ============================================================================
//  INTERNAL: Evolution-aware routing decision
//  Priority:
//    1) Commandments
//    2) Instincts
//    3) Design
//    4) Thought
//    5) Fallback hash router
// ============================================================================
//
//  NOTE: This organ does NOT import the other organs.
//  It expects their outputs (if any) to be attached to the pulse:
//
//    • pulse.commandmentsDecision   → { targetOrgan?, forbiddenPaths?, preferredPath? }
//    • pulse.instinctsDecision      → { targetOrgan?, confidence? }
//    • pulse.designDecision         → { targetOrgan?, designId? }
//    • pulse.thoughtDecision        → { targetOrgan?, mode?, tier?, patternAncestry?, lineageSignature?, pageId?, pageAncestrySignature? }
//
//  If those fields are absent, this router simply falls back deterministically.
// ============================================================================

function evolutionAwareRouteTarget(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage.slice() : [];
  const pageId = pulse.pageId || "NO_PAGE";

  const health = pulse.healthScore ?? 1;
  const tier = classifyDegradationTier(health);

  const patternAncestry =
    Array.isArray(pulse.patternAncestry) && pulse.patternAncestry.length
      ? pulse.patternAncestry.slice()
      : buildPatternAncestry(pattern);

  const lineageSignature =
    typeof pulse.lineageSignature === "string"
      ? pulse.lineageSignature
      : buildLineageSignature(lineage);

  const pageAncestrySignature =
    typeof pulse.pageAncestrySignature === "string"
      ? pulse.pageAncestrySignature
      : buildPageAncestrySignature({ pattern, lineage, pageId });

  // 1) Commandments (law tablet)
  const commandments = pulse.commandmentsDecision || null;
  if (commandments && commandments.targetOrgan) {
    const target = commandments.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Commandments",
      tier,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 2) Instincts (genetic best-path)
  const instincts = pulse.instinctsDecision || null;
  if (instincts && instincts.targetOrgan) {
    const target = instincts.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Instincts",
      tier,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 3) Design (blueprint-preferred organ)
  const design = pulse.designDecision || null;
  if (design && design.targetOrgan) {
    const target = design.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Design",
      tier,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 4) Thought (brainstem routing)
  const thought = pulse.thoughtDecision || null;
  if (thought && thought.targetOrgan) {
    const target = thought.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Thought",
      tier: thought.tier || tier,
      pattern,
      patternAncestry:
        Array.isArray(thought.patternAncestry) &&
        thought.patternAncestry.length
          ? thought.patternAncestry.slice()
          : patternAncestry,
      lineage,
      lineageSignature:
        typeof thought.lineageSignature === "string"
          ? thought.lineageSignature
          : lineageSignature,
      pageId: thought.pageId || pageId,
      pageAncestrySignature:
        typeof thought.pageAncestrySignature === "string"
          ? thought.pageAncestrySignature
          : pageAncestrySignature
    };
  }

  // 5) Fallback hash router (legacy deterministic spine)
  const fallbackTarget = fallbackRouteTarget(pulse);
  rememberSuccess(pattern, fallbackTarget);
  return {
    targetOrgan: fallbackTarget,
    source: "Fallback",
    tier,
    pattern,
    patternAncestry,
    lineage,
    lineageSignature,
    pageId,
    pageAncestrySignature
  };
}


// ============================================================================
//  PUBLIC API — PulseRouter (v11 Evolution-A2)
// ============================================================================
export const PulseRouter = {

  PulseRole,

  // --------------------------------------------------------------------------
  //  route(pulse)
  //  • Returns a target organ string
  // --------------------------------------------------------------------------
  route(pulse) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";

    // 0) If pulse provides a hard targetHint (e.g., returnTo), respect it
    if (pulse.targetHint) {
      const target = pulse.targetHint;
      rememberSuccess(pattern, target);
      return target;
    }

    const decision = evolutionAwareRouteTarget(pulse);
    return decision.targetOrgan;
  },

  // --------------------------------------------------------------------------
  //  routeWithMeta(pulse)
  //  • Returns full routing decision metadata
  // --------------------------------------------------------------------------
  routeWithMeta(pulse) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";
    const lineage = Array.isArray(pulse.lineage) ? pulse.lineage.slice() : [];
    const pageId = pulse.pageId || "NO_PAGE";

    const baseTier = classifyDegradationTier(pulse.healthScore ?? 1);

    if (pulse.targetHint) {
      const target = pulse.targetHint;
      rememberSuccess(pattern, target);

      const patternAncestry =
        Array.isArray(pulse.patternAncestry) && pulse.patternAncestry.length
          ? pulse.patternAncestry.slice()
          : buildPatternAncestry(pattern);

      const lineageSignature =
        typeof pulse.lineageSignature === "string"
          ? pulse.lineageSignature
          : buildLineageSignature(lineage);

      const pageAncestrySignature =
        typeof pulse.pageAncestrySignature === "string"
          ? pulse.pageAncestrySignature
          : buildPageAncestrySignature({ pattern, lineage, pageId });

      return {
        targetOrgan: target,
        source: "Hint",
        tier: baseTier,
        pattern,
        patternAncestry,
        lineage,
        lineageSignature,
        pageId,
        pageAncestrySignature
      };
    }

    const decision = evolutionAwareRouteTarget(pulse);

    return {
      targetOrgan: decision.targetOrgan,
      source: decision.source,
      tier: decision.tier,
      pattern: decision.pattern,
      patternAncestry: decision.patternAncestry.slice(),
      lineage: decision.lineage.slice(),
      lineageSignature: decision.lineageSignature,
      pageId: decision.pageId,
      pageAncestrySignature: decision.pageAncestrySignature
    };
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
