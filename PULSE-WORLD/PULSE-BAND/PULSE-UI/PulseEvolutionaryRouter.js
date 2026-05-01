// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryRouter.js
//  PULSE OS v11‑EVO‑PRIME — UI ROUTER ORGAN (UPGRADED)
//  “DETERMINISTIC PAGE ROUTING WITH CORE‑POWERED MEMORY”
// ============================================================================

export const RouterRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageRouter",
  version: "11.3-Evo-Prime",
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
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — creates the router organ
// ============================================================================
export function createPulseEvolutionaryRouter({
  CNS,
  Evolution,
  CodeOrgan,     // PulseEvolutionaryCode
  BrainOrgan,    // PulseEvolutionaryBrain
  ImpulseOrgan,  // PulseEvolutionaryImpulse
  log = console.log,
  warn = console.warn
} = {}) {

  const RouterState = {
    currentRoute: "init",
    lastTransition: null,
    routeHistory: []
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryRouter]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  ROUTING TABLE — deterministic, lineage-aware
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

  // --------------------------------------------------------------------------
  //  VALIDATE ROUTE
  // --------------------------------------------------------------------------
  function isValidRoute(route) {
    return typeof route === "string" && ROUTES.hasOwnProperty(route);
  }

  // --------------------------------------------------------------------------
  //  TRANSITION — deterministic, binary-native, CNS-aware
  // --------------------------------------------------------------------------
  async function transition(toRoute, { payload, binaryPayload, context } = {}) {
    if (!isValidRoute(toRoute)) {
      warn("[PulseEvolutionaryRouter] INVALID_ROUTE", toRoute);
      return { ok: false, error: "InvalidRoute" };
    }

    const fromRoute = RouterState.currentRoute;
    const allowed = ROUTES[fromRoute]?.next || [];

    if (!allowed.includes(toRoute)) {
      warn("[PulseEvolutionaryRouter] ROUTE_NOT_ALLOWED", { fromRoute, toRoute });
      return { ok: false, error: "RouteNotAllowed" };
    }

    RouterState.currentRoute = toRoute;
    RouterState.lastTransition = { from: fromRoute, to: toRoute };
    RouterState.routeHistory.push({ from: fromRoute, to: toRoute });

    safeLog("TRANSITION", { fromRoute, toRoute });

    // Emit impulse to CNS
    ImpulseOrgan?.emit({
      source: "PulseEvolutionaryRouter",
      payload: { fromRoute, toRoute },
      binaryPayload: null,
      context
    });

    // Execute route handler
    const handler = ROUTES[toRoute]?.handler;
    if (typeof handler === "function") {
      const res = await handler({ payload, binaryPayload, context });
      return { ok: true, route: toRoute, result: res };
    }

    return { ok: true, route: toRoute };
  }

  // --------------------------------------------------------------------------
  //  PUBLIC ENTRY — go to a route
  // --------------------------------------------------------------------------
  async function go(route, opts = {}) {
    return transition(route, opts);
  }

  const PulseEvolutionaryRouter = {
    RouterRole,
    RouterState,
    go,
    transition
  };

  safeLog("INIT", {
    identity: RouterRole.identity,
    version: RouterRole.version
  });

  return PulseEvolutionaryRouter;
}
