// ============================================================================
//  PulseRouter-v11-Evo-A3 — SYMBOLIC EVOLUTION ROUTER (Pre-Binary Top Layer)
//  Deterministic Routing Spine • Pulse-Agnostic • Evolution-Aware
//  Pattern/Lineage/Page-Ancestry + Loop-Theory Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The symbolic routing spine of the organism.
//  • Works with Pulse v1, Pulse v2, Pulse v3.
//  • Deterministic routing: NO randomness, NO timestamps.
//  • Pattern-aware, lineage-aware, mode-aware, identity-aware.
//  • Uses advantageField + healthScore when available.
//  • Integrates Commandments, Instincts, Design, Thought.
//  • Maintains routing memory (success/failure).
//  • Ancestry-aware: patternAncestry, lineageSignature, pageAncestrySignature.
//  • Pure symbolic — NO binary logic.
//
//  SAFETY CONTRACT (v11-Evo-A3):
//  -----------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure deterministic routing.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter Organ (v11-Evo-A3)
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "RoutingSpine",
  version: "11.0",
  identity: "PulseRouter-v11-Evolution-A3",

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
// INTERNAL MEMORY — deterministic, local, safe
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
// FALLBACK deterministic routing algorithm (legacy spine)
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
  return organs[acc % organs.length];
}


// ============================================================================
// Degradation tier helper
// ============================================================================
function classifyDegradationTier(h) {
  const v = typeof h === "number" ? h : 1.0;
  if (v >= 0.95) return "microDegrade";
  if (v >= 0.85) return "softDegrade";
  if (v >= 0.50) return "midDegrade";
  if (v >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ============================================================================
// ancestry helpers
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

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId
  };

  let raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ============================================================================
// Evolution-aware routing decision (SYMBOLIC ONLY)
// ============================================================================
function evolutionAwareRouteTarget(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage.slice() : [];
  const pageId = pulse.pageId || "NO_PAGE";

  const health = pulse.healthScore ?? 1;
  const tier = classifyDegradationTier(health);

  const patternAncestry =
    pulse.patternAncestry?.length
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

  // 1) Commandments
  if (pulse.commandmentsDecision?.targetOrgan) {
    const target = pulse.commandmentsDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return { targetOrgan: target, source: "Commandments", tier, pattern, patternAncestry, lineage, lineageSignature, pageId, pageAncestrySignature };
  }

  // 2) Instincts
  if (pulse.instinctsDecision?.targetOrgan) {
    const target = pulse.instinctsDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return { targetOrgan: target, source: "Instincts", tier, pattern, patternAncestry, lineage, lineageSignature, pageId, pageAncestrySignature };
  }

  // 3) Design
  if (pulse.designDecision?.targetOrgan) {
    const target = pulse.designDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return { targetOrgan: target, source: "Design", tier, pattern, patternAncestry, lineage, lineageSignature, pageId, pageAncestrySignature };
  }

  // 4) Thought
  if (pulse.thoughtDecision?.targetOrgan) {
    const target = pulse.thoughtDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Thought",
      tier: pulse.thoughtDecision.tier || tier,
      pattern,
      patternAncestry: pulse.thoughtDecision.patternAncestry || patternAncestry,
      lineage,
      lineageSignature: pulse.thoughtDecision.lineageSignature || lineageSignature,
      pageId: pulse.thoughtDecision.pageId || pageId,
      pageAncestrySignature: pulse.thoughtDecision.pageAncestrySignature || pageAncestrySignature
    };
  }

  // 5) Fallback deterministic router
  const fallbackTarget = fallbackRouteTarget(pulse);
  rememberSuccess(pattern, fallbackTarget);
  return { targetOrgan: fallbackTarget, source: "Fallback", tier, pattern, patternAncestry, lineage, lineageSignature, pageId, pageAncestrySignature };
}


// ============================================================================
// PUBLIC API — PulseRouter (v11 Evolution-A3)
// ============================================================================
export const PulseRouter = {

  PulseRole,

  route(pulse) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";

    if (pulse.targetHint) {
      rememberSuccess(pattern, pulse.targetHint);
      return pulse.targetHint;
    }

    return evolutionAwareRouteTarget(pulse).targetOrgan;
  },

  routeWithMeta(pulse) {
    if (pulse.targetHint) {
      const pattern = pulse.pattern || "UNKNOWN_PATTERN";
      rememberSuccess(pattern, pulse.targetHint);

      const lineage = pulse.lineage || [];
      const pageId = pulse.pageId || "NO_PAGE";

      return {
        targetOrgan: pulse.targetHint,
        source: "Hint",
        tier: classifyDegradationTier(pulse.healthScore ?? 1),
        pattern,
        patternAncestry: buildPatternAncestry(pattern),
        lineage,
        lineageSignature: buildLineageSignature(lineage),
        pageId,
        pageAncestrySignature: buildPageAncestrySignature({ pattern, lineage, pageId })
      };
    }

    return evolutionAwareRouteTarget(pulse);
  },

  remember(pulse, target, status, healthScore = 1) {
    const pattern = pulse.pattern || "UNKNOWN_PATTERN";
    if (status === "success") rememberSuccess(pattern, target);
    else rememberFailure(pattern, target);
    return { pattern, target, status, healthScore };
  },

  diagnostics() {
    return { PulseRole, routingMemory };
  }
};
