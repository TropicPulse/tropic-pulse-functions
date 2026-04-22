// ============================================================================
//  PulseEarnReflexRouter.js — Reflex → Earn Synapse (v1.0)
//  - No imports
//  - No routing, no sending
//  - Pure, deterministic EarnReflex → Earn handoff
//  - Fully aligned with PulseOSGovernor v3 (instance slicing safe)
//  - Designed to run ONLY when explicitly called
// ============================================================================

// Local registry of routed reflexes (drift-proof, no loops)
const routedReflexes = new Map(); // reflexId -> state

// ---------------------------------------------------------------------------
//  INTERNAL: Build a stable reflex routing state
// ---------------------------------------------------------------------------
function getOrCreateReflexRouteState(reflexId) {
  let state = routedReflexes.get(reflexId);
  if (!state) {
    state = {
      reflexId,
      count: 0,
      firstSeenAt: Date.now(),
      lastSeenAt: null
    };
    routedReflexes.set(reflexId, state);
  }
  return state;
}

// ---------------------------------------------------------------------------
//  PUBLIC API — PulseEarnReflexRouter
//  - Accepts an EarnReflex organism
//  - Hands it to EarnSystem safely (no loops, no recursion)
//  - Does NOT send, does NOT route, does NOT mutate pulse
// ---------------------------------------------------------------------------
export const PulseEarnReflexRouter = {
  /**
   * route(earnReflex, EarnSystem)
   * - earnReflex: the organism built by PulseEarnReflex
   * - EarnSystem: the frontend Earn engine (PulseEarn)
   */
  async route(earnReflex, EarnSystem) {
    if (!earnReflex || !earnReflex.meta?.reflex) {
      return {
        ok: false,
        reason: "invalid_reflex",
        reflex: earnReflex
      };
    }

    const reflexId = earnReflex.meta.sourcePulseId
      ? `${earnReflex.meta.sourcePulseId}::${earnReflex.meta.sourceOrgan}::${earnReflex.meta.sourceReason}`
      : earnReflex.meta.reflexId || "UNKNOWN_REFLEX";

    const state = getOrCreateReflexRouteState(reflexId);
    state.count += 1;
    state.lastSeenAt = Date.now();

    // If EarnSystem is missing or not ready, fail-open (immune-safe)
    if (!EarnSystem || typeof EarnSystem.handle !== "function") {
      return {
        ok: false,
        reason: "earn_system_unavailable",
        reflexId,
        state
      };
    }

    // -----------------------------------------------------------------------
    //  SAFE HANDOFF:
    //  - No routing
    //  - No sending
    //  - No returnTo
    //  - No lineage mutation
    //  - Pure EarnSystem.handle() call
    // -----------------------------------------------------------------------
    try {
      const result = await EarnSystem.handle(earnReflex, {
        reflex: true,
        reflexId,
        state,
        instanceContext: earnReflex.meta.instanceContext || null
      });

      return {
        ok: true,
        routed: true,
        reflexId,
        state,
        result
      };
    } catch (error) {
      return {
        ok: false,
        routed: false,
        reflexId,
        state,
        error
      };
    }
  },

  // -------------------------------------------------------------------------
  //  Debug / Dashboard
  // -------------------------------------------------------------------------
  getRoutedState(reflexId) {
    if (reflexId) return routedReflexes.get(reflexId) || null;
    return Array.from(routedReflexes.values());
  }
};
