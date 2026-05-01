// ============================================================================
//  PulseRouter-v13-COSMOS-MULTIVERSE
//  SYMBOLIC EVOLUTION ROUTER — Multiverse-Aware Routing Spine
// ============================================================================
//
//  ROLE:
//    - Deterministic symbolic routing across universes/timelines/branches.
//    - Pattern-aware, lineage-aware, page-aware, ancestry-aware.
//    - Integrates Commandments, Instincts, Design, Thought.
//    - Zero randomness, zero mutation, zero drift.
//    - Pure symbolic (no binary).
//    - Reversible routing signatures.
//    - Cosmos-aware routing metadata.
//
// ============================================================================


// --- EVOLUTIONARY ROUTER ORGANS --------------------------------------------
import * as PulseRouterEvolutionaryDesign     from "./PulseRouterEvolutionaryDesign.js";
import * as PulseRouterEvolutionaryInstincts  from "./PulseRouterEvolutionaryInstincts.js";
import * as PulseRouterEvolutionaryThought    from "./PulseRouterEvolutionaryThought.js";

// --- MESH ROUTER ------------------------------------------------------------
import * as PulseRouterMesh           from "./PulseRouterMesh-v11-Evo.js";

// --- EARN-AWARE ROUTER ------------------------------------------------------
import * as PulseRouterEarn           from "./PulseRouterEarn-v11-Evo.js";

// --- ROUTER COMMANDMENTS ----------------------------------------------------
import * as PulseRouterCommandments   from "./PulseRouterCommandments.js";
// ============================================================================
// ⭐ PulseRole — identifies this as the PulseRouter Organ (v13-COSMOS)
// ============================================================================
export const PulseRole = {
  type: "Router",
  subsystem: "PulseRouter",
  layer: "RoutingSpine",
  version: "13.0",
  identity: "PulseRouter-v13-COSMOS-MULTIVERSE",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    pageAware: true,
    cosmosAware: true,
    modeAware: true,
    identityAware: true,
    advantageAware: true,
    deterministicRouting: true,
    memoryReady: true,
    futureEvolutionReady: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMesh-v13",
  sendContract: "PulseSend-v13"
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
// COSMOS CONTEXT HELPERS
// ============================================================================
function normalizeCosmos(cosmos = {}) {
  return {
    universeId: cosmos.universeId || "u:default",
    timelineId: cosmos.timelineId || "t:main",
    branchId: cosmos.branchId || "b:root"
  };
}

function cosmosSignature(cosmos) {
  const raw = `${cosmos.universeId}|${cosmos.timelineId}|${cosmos.branchId}`;
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (h * 31 + raw.charCodeAt(i)) >>> 0;
  }
  return `cx${h.toString(16)}`;
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

function buildPageAncestrySignature({ pattern, lineage, pageId, cosmos }) {
  const shape = {
    pattern: pattern || "",
    patternAncestry: buildPatternAncestry(pattern || ""),
    lineageSignature: buildLineageSignature(lineage || []),
    pageId: pageId || "NO_PAGE",
    cosmosSignature: cosmosSignature(cosmos)
  };

  const raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ============================================================================
// degradation tier helper
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
// fallback deterministic routing (legacy spine)
// ============================================================================
function fallbackRouteTarget(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "normal";
  const health = pulse.healthScore ?? 1;

  const raw = `${pattern}::${lineageDepth}::${mode}::${health}`;
  let acc = 0;

  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 7)) % 12289;
  }

  const organs = ["GPU", "Earn", "OS", "Mesh"];
  return organs[acc % organs.length];
}


// ============================================================================
// evolution-aware routing (COSMOS v13)
// ============================================================================
function evolutionAwareRouteTarget(pulse) {
  const cosmos = normalizeCosmos(pulse.cosmos || {});
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
      : buildPageAncestrySignature({ pattern, lineage, pageId, cosmos });

  // 1) Commandments
  if (pulse.commandmentsDecision?.targetOrgan) {
    const target = pulse.commandmentsDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Commandments",
      tier,
      cosmos,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 2) Instincts
  if (pulse.instinctsDecision?.targetOrgan) {
    const target = pulse.instinctsDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Instincts",
      tier,
      cosmos,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 3) Design
  if (pulse.designDecision?.targetOrgan) {
    const target = pulse.designDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Design",
      tier,
      cosmos,
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature
    };
  }

  // 4) Thought
  if (pulse.thoughtDecision?.targetOrgan) {
    const target = pulse.thoughtDecision.targetOrgan;
    rememberSuccess(pattern, target);
    return {
      targetOrgan: target,
      source: "Thought",
      tier: pulse.thoughtDecision.tier || tier,
      cosmos,
      pattern,
      patternAncestry: pulse.thoughtDecision.patternAncestry || patternAncestry,
      lineage,
      lineageSignature: pulse.thoughtDecision.lineageSignature || lineageSignature,
      pageId: pulse.thoughtDecision.pageId || pageId,
      pageAncestrySignature:
        pulse.thoughtDecision.pageAncestrySignature || pageAncestrySignature
    };
  }

  // 5) Fallback
  const fallbackTarget = fallbackRouteTarget(pulse);
  rememberSuccess(pattern, fallbackTarget);

  return {
    targetOrgan: fallbackTarget,
    source: "Fallback",
    tier,
    cosmos,
    pattern,
    patternAncestry,
    lineage,
    lineageSignature,
    pageId,
    pageAncestrySignature
  };
}


// ============================================================================
// PUBLIC API — PulseRouter (v13 COSMOS)
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

      const cosmos = normalizeCosmos(pulse.cosmos || {});
      const lineage = pulse.lineage || [];
      const pageId = pulse.pageId || "NO_PAGE";

      return {
        targetOrgan: pulse.targetHint,
        source: "Hint",
        tier: classifyDegradationTier(pulse.healthScore ?? 1),
        cosmos,
        pattern,
        patternAncestry: buildPatternAncestry(pattern),
        lineage,
        lineageSignature: buildLineageSignature(lineage),
        pageId,
        pageAncestrySignature: buildPageAncestrySignature({
          pattern,
          lineage,
          pageId,
          cosmos
        })
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
