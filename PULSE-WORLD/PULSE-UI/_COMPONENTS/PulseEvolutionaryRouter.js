/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryRouter-v16-Immortal.js
LAYER: UI PAGE ROUTER ORGAN — IMMORTAL v16+
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryRouter",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_page_router",
  lineage: "PulseEvolutionaryRouter-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    uiRouting: true,
    deterministic: true,
    driftProof: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    routeAware: true,
    lineageAware: true,
    cnsAware: true,
    memoryAware: true,
    unifiedAdvantageField: true,
    signatureAware: true,
    tierAware: true,
    channelAware: true,
    futureEvolutionReady: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    // v16+ upgrades
    schemaVersioned: true,
    envelopeAware: true,
    historyAware: true,
    integrityAware: true,
    degradationAware: true,
    experienceBlocksAware: true
  },

  contract: {
    always: [
      "PulseUI.EvolutionaryCode",
      "PulseUI.EvolutionaryBrain",
      "PulseUI.EvolutionaryImpulse",
      "PulseUI.EvolutionaryMemory",
      "PulseCore.Memory",
      "PulseCore.CNS",
      "PulseDesign.Manifest"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS",
      "safeRoute"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.EvolutionaryRouter",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "RouteName",
    "SymbolicPayload",
    "BinaryPayload",
    "RouteContext",
    "CNS",
    "Evolution",
    "MemoryOrgan",
    "ImpulseOrgan",
    "CodeOrgan",
    "BrainOrgan"
  ],

  produces: [
    "RouteTransition",
    "TransitionSignature",
    "TransitionTier",
    "TransitionChannel",
    "TransitionExperience"
  ],

  sideEffects: "cns_emit_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

// Global handle
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;
  
export const RouterRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageRouter",
  version: "16.0-Immortal",
  identity: "PulseEvolutionaryRouter",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    uiRouting: true,
    cnsAware: true,
    routeAware: true,
    unifiedAdvantageField: true,
    signatureAware: true,
    tierAware: true,
    channelAware: true,
    futureEvolutionReady: true
  }
};

const ROUTER_SCHEMA_VERSION = "v3";

// ============================================================================
// INTERNAL: deterministic signature + hash
// ============================================================================
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function deterministicSignature(obj) {
  const json = JSON.stringify(obj || {});
  const h = hashString(json);
  return "ROUTE_SIG_" + h.toString(16).padStart(8, "0");
}

// ============================================================================
// INTERNAL: transition tiers + channels
// ============================================================================
const TransitionTiers = Object.freeze({
  normal: "normal",
  important: "important",
  critical: "critical",
  immortal: "immortal"
});

const TransitionChannels = Object.freeze({
  ui: "ui",
  system: "system",
  evolution: "evolution",
  memory: "memory",
  earn: "earn"
});

// ============================================================================
// INTERNAL: advantage + integrity + experience blocks
// ============================================================================
function computeTransitionAdvantage({ payload, binaryPayload }) {
  const payloadJson = JSON.stringify(payload || {});
  const payloadSize = payloadJson.length;

  const binary = binaryPayload;
  const binarySize = Array.isArray(binary) ? binary.length : 0;

  const total = payloadSize + binarySize || 1;
  const symbolicWeight = payloadSize / total;
  const binaryWeight = binarySize / total;

  const density = binaryWeight;
  const entropyHint = 1 - Math.abs(0.5 - density) * 2;

  const advantage =
    0.4 * symbolicWeight +
    0.6 * binaryWeight;

  return {
    payloadSize,
    binarySize,
    totalSize: total,
    symbolicWeight,
    binaryWeight,
    density,
    entropyHint,
    advantage
  };
}

function computeTransitionIntegrity({ fromRoute, toRoute, advantage }) {
  const base =
    (fromRoute ? 0.25 : 0) +
    (toRoute ? 0.25 : 0) +
    0.25 * (advantage.entropyHint ?? 0.5) +
    0.25 * (advantage.advantage ?? 0.5);

  const score = Math.max(0, Math.min(1, base));

  const status =
    score >= 0.95 ? "immortal" :
    score >= 0.85 ? "excellent" :
    score >= 0.70 ? "good" :
    score >= 0.55 ? "fair" :
    score >= 0.40 ? "degraded" :
                    "critical";

  const degraded = status === "degraded" || status === "critical";

  return { score, status, degraded };
}

function buildExperienceBlocks({
  fromRoute,
  toRoute,
  tier,
  channel,
  advantage,
  integrity
}) {
  return {
    schemaVersion: ROUTER_SCHEMA_VERSION,
    blocks: [
      {
        id: "router.transition",
        kind: "transition",
        fromRoute,
        toRoute,
        tier,
        channel
      },
      {
        id: "router.advantage",
        kind: "advantage",
        payloadSize: advantage.payloadSize,
        binarySize: advantage.binarySize,
        totalSize: advantage.totalSize,
        symbolicWeight: advantage.symbolicWeight,
        binaryWeight: advantage.binaryWeight,
        density: advantage.density,
        entropyHint: advantage.entropyHint,
        advantage: advantage.advantage
      },
      {
        id: "router.integrity",
        kind: "integrity",
        score: integrity.score,
        status: integrity.status,
        degraded: integrity.degraded
      }
    ]
  };
}

function buildEnvelopeId({ fromRoute, toRoute, signature }) {
  const base = `${fromRoute}:${toRoute}:${signature}`;
  const h = hashString(base);
  return `ROUTE-${ROUTER_SCHEMA_VERSION}-${h.toString(16).padStart(8, "0")}`;
}

// ============================================================================
// FACTORY — creates the router organ
// ============================================================================
export function createPulseEvolutionaryRouter({
  CNS,
  Evolution,
  CodeOrgan,
  BrainOrgan,
  ImpulseOrgan,
  MemoryOrgan,
  log = console.log,
  warn = console.warn
} = {}) {

  const RouterState = {
    currentRoute: "init",
    lastTransition: null,
    lastSignature: null,
    lastTier: null,
    lastChannel: null,
    lastExperience: null,
    routeHistory: [],
    eventSeq: 0
  };

  function nextSeq() {
    RouterState.eventSeq += 1;
    return RouterState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryRouter-v16]",
        stage,
        JSON.stringify({
          schemaVersion: ROUTER_SCHEMA_VERSION,
          seq: RouterState.eventSeq,
          currentRoute: RouterState.currentRoute,
          ...details
        })
      );
    } catch {}
  }

  // --------------------------------------------------------------------------
  // ROUTING TABLE — deterministic, lineage-aware
  // --------------------------------------------------------------------------
  const ROUTES = {
    init: {
      next: ["home", "debug", "evo"],
      handler: () => BrainOrgan.freshEvolve({ type: "page:init" })
    },

    home: {
      next: ["debug", "evo"],
      handler: () => CodeOrgan.evolve({ type: "page:home" })
    },

    debug: {
      next: ["home", "evo"],
      handler: () => CodeOrgan.evolve({ type: "page:debug" })
    },

    evo: {
      next: ["home", "debug"],
      handler: () => CodeOrgan.evolve({ type: "page:evo" })
    }
  };

  function isValidRoute(route) {
    return typeof route === "string" && Object.prototype.hasOwnProperty.call(ROUTES, route);
  }

  // --------------------------------------------------------------------------
  // BUILD TRANSITION ENVELOPE — deterministic, dual-band, experience-aware
  // --------------------------------------------------------------------------
  function buildTransitionEnvelope({
    fromRoute,
    toRoute,
    payload,
    binaryPayload,
    context,
    tier = TransitionTiers.normal,
    channel = TransitionChannels.ui
  }) {
    const lineage = Evolution?.getPageLineage?.() || {};
    const advantage = computeTransitionAdvantage({ payload, binaryPayload });
    const integrity = computeTransitionIntegrity({ fromRoute, toRoute, advantage });
    const baseEnvelope = {
      schemaVersion: ROUTER_SCHEMA_VERSION,
      fromRoute,
      toRoute,
      lineage,
      tier,
      channel,
      payload: payload || {},
      binary: binaryPayload || null,
      context: context || {},
      version: RouterRole.version,
      timestamp: "NO_TIMESTAMP_v16"
    };

    const signature = deterministicSignature(baseEnvelope);
    const id = buildEnvelopeId({ fromRoute, toRoute, signature });
    const experience = buildExperienceBlocks({
      fromRoute,
      toRoute,
      tier,
      channel,
      advantage,
      integrity
    });

    return {
      ...baseEnvelope,
      id,
      signature,
      advantage,
      integrity,
      experience
    };
  }

  // --------------------------------------------------------------------------
  // TRANSITION — deterministic, CNS-aware, MemoryOrgan/CoreMemory-aware
  // --------------------------------------------------------------------------
  async function transition(
    toRoute,
    {
      payload,
      binaryPayload,
      context,
      tier = TransitionTiers.normal,
      channel = TransitionChannels.ui
    } = {}
  ) {
    nextSeq();

    if (!isValidRoute(toRoute)) {
      const err = "InvalidRoute";
      warn("[PulseEvolutionaryRouter-v16] INVALID_ROUTE", toRoute);
      safeLog("INVALID_ROUTE", { toRoute, error: err });
      return { ok: false, error: err };
    }

    const fromRoute = RouterState.currentRoute;
    const allowed = ROUTES[fromRoute]?.next || [];

    if (!allowed.includes(toRoute)) {
      const err = "RouteNotAllowed";
      warn("[PulseEvolutionaryRouter-v16] ROUTE_NOT_ALLOWED", { fromRoute, toRoute });
      safeLog("ROUTE_NOT_ALLOWED", { fromRoute, toRoute, error: err });
      return { ok: false, error: err };
    }

    const envelope = buildTransitionEnvelope({
      fromRoute,
      toRoute,
      payload,
      binaryPayload,
      context,
      tier,
      channel
    });

    RouterState.currentRoute = toRoute;
    RouterState.lastTransition = envelope;
    RouterState.lastSignature = envelope.signature;
    RouterState.lastTier = tier;
    RouterState.lastChannel = channel;
    RouterState.lastExperience = envelope.experience;
    RouterState.routeHistory.push({ from: fromRoute, to: toRoute });

    safeLog("TRANSITION", {
      fromRoute,
      toRoute,
      signature: envelope.signature,
      integrityStatus: envelope.integrity.status,
      degraded: envelope.integrity.degraded
    });

    // Emit impulse to CNS via ImpulseOrgan
    try {
      ImpulseOrgan?.emit({
        source: "PulseEvolutionaryRouter",
        payload: {
          fromRoute,
          toRoute,
          integrityStatus: envelope.integrity.status,
          degraded: envelope.integrity.degraded
        },
        binaryPayload: null,
        context,
        tier,
        channel
      });
    } catch (err) {
      warn("[PulseEvolutionaryRouter-v16] IMPULSE_EMIT_ERROR", String(err));
      safeLog("IMPULSE_EMIT_ERROR", { error: String(err) });
    }

    // Persist router state via MemoryOrgan → CoreMemory (through bridge)
    try {
      MemoryOrgan?.core?.setRouteSnapshot?.("router", {
        schemaVersion: ROUTER_SCHEMA_VERSION,
        version: RouterRole.version,
        currentRoute: toRoute,
        lastTransition: envelope,
        routeHistory: RouterState.routeHistory.slice(-64)
      });
      safeLog("MEMORY_WRITE_OK", { toRoute });
    } catch (err) {
      warn("[PulseEvolutionaryRouter-v16] MEMORY_WRITE_ERROR", String(err));
      safeLog("MEMORY_WRITE_ERROR", { error: String(err) });
    }

    // Execute route handler
    const handler = ROUTES[toRoute]?.handler;
    if (typeof handler === "function") {
      const res = await handler({ payload, binaryPayload, context });
      return {
        ok: true,
        route: toRoute,
        result: res,
        signature: envelope.signature,
        experience: envelope.experience
      };
    }

    return {
      ok: true,
      route: toRoute,
      signature: envelope.signature,
      experience: envelope.experience
    };
  }

  async function go(route, opts = {}) {
    return transition(route, opts);
  }

  const PulseEvolutionaryRouter = {
    RouterRole,
    RouterState,
    go,
    transition,
    Tiers: TransitionTiers,
    Channels: TransitionChannels
  };

  safeLog("INIT", {
    identity: RouterRole.identity,
    version: RouterRole.version,
    schemaVersion: ROUTER_SCHEMA_VERSION
  });

  return PulseEvolutionaryRouter;
}

try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryRouter = createPulseEvolutionaryRouter;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryRouter = createPulseEvolutionaryRouter;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryRouter = createPulseEvolutionaryRouter;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryRouter = createPulseEvolutionaryRouter;
  }
} catch {}
