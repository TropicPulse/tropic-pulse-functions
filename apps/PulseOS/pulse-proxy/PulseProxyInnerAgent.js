// ============================================================================
//  FILE: /apps/PULSE-PROXY/PulseProxyInnerAgent.js
//  PULSE OS v11-EVO — PROXY INNER AGENT (DUAL-BAND)
//  “INNER AGENT / ORGANISM BRIDGE”
//  CNS ↔ Router ↔ /PULSE-PROXY/endpoint ↔ InnerAgent ↔ Brain / LTM / Pages
//  PURE BACKEND ORGAN — NO MARKETPLACE, NO BUSINESS LOGIC, NO RANDOMNESS.
// ============================================================================
//
//  UPGRADE NOTE (v11-EVO):
//  -----------------------
//  • This organ REPLACES the legacy backend Endpoint.js bridge.
//  • Any old references to `Endpoint` / `endpoint.js` should now map to:
//        BackendEndpoint.now = ["PulseProxyInnerAgent"]
//  • The Netlify / proxy endpoint handler should call:
//        InnerAgent.handle({ type, payload, binaryPayload, context })
//  • This file is the ORGANISM-CORRECT BACKEND ENDPOINT BRIDGE.
//    If you ever “wipe the endpoint” again, you are wiping THIS.
//
//  ROLE (v11-EVO):
//  --------------
//  • Single inner bridge between PulseProxy endpoint and the organism core.
//  • Receives typed backend impulses from `/PULSE-PROXY/endpoint`.
//  • Dispatches deterministically to Brain, LongTermMemory, and Pages surfaces.
//  • Dual-band aware: can carry symbolic payload + optional binaryPayload.
//  • No routing intelligence, no scoring, no marketplace logic.
//  • Pure adapter: type → target organ → result.
//
//  SAFETY CONTRACT (v11-EVO):
//  --------------------------
//  • No randomness, no Date.now().
//  • No mutation outside this organ’s own local state.
//  • No marketplace logic, no pricing, no scoring.
//  • No OSKernel logic, no GPU logic.
//  • Deterministic dispatch for same (type, payload, binaryPayload, context).
//  • Fail-open: errors are returned as { error }, never throw fatal.
// ============================================================================

// ============================================================================
//  ORGAN IDENTITY — v11-EVO (Dual-band aware)
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "InnerAgent",
  version: "11.1-Evo",
  identity: "PulseProxyInnerAgent",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    innerBridge: true,

    // Dual-band nervous awareness
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    noIQ: true,
    noRouting: true,          // no dynamic routing intelligence
    noCompute: true,          // no business compute
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — dependencies injected by backend spine / endpoint
//  Expected surfaces:
//    • Brain:           { handle(type, payload, binaryPayload, context) }
//    • LongTermMemory:  { handle(type, payload, binaryPayload, context) }
//    • Pages:           { handle(type, payload, binaryPayload, context) }
// ============================================================================
export function createPulseProxyInnerAgent({
  Brain,
  LongTermMemory,
  Pages,
  log = console.log,
  warn = console.warn
} = {}) {
  const InnerState = {
    lastType: null,
    lastTarget: null,
    lastModeKind: null // "symbolic" | "binary" | "dual"
  };

  function safeLog(stage, details = {}) {
    try {
      log("[InnerAgent]", stage, JSON.stringify(details));
    } catch {
      // never fatal
    }
  }

  function resolveTarget(type) {
    if (!type || typeof type !== "string") {
      return { target: null, route: "unknown" };
    }

    // Brain‑oriented types
    if (type.startsWith("brain:") || type === "PING_BRAIN") {
      return { target: "Brain", route: "brain" };
    }

    // Long‑term memory types
    if (type.startsWith("ltm:") || type === "LONG_TERM_MEMORY") {
      return { target: "LongTermMemory", route: "ltm" };
    }

    // Page / document / content types
    if (type.startsWith("page:") || type === "PAGE_REQUEST") {
      return { target: "Pages", route: "pages" };
    }

    // Default: brain as safe fallback
    return { target: "Brain", route: "brain-default" };
  }

  async function dispatchToTarget(target, type, payload, binaryPayload, context) {
    const safePayload = payload || {};
    const safeBinary = binaryPayload || null;
    const safeContext = context || {};

    const args = [type, safePayload, safeBinary, safeContext];

    if (target === "Brain") {
      if (!Brain || typeof Brain.handle !== "function") {
        return { error: "BrainUnavailable", type, target };
      }
      return await Brain.handle(...args);
    }

    if (target === "LongTermMemory") {
      if (!LongTermMemory || typeof LongTermMemory.handle !== "function") {
        return { error: "LongTermMemoryUnavailable", type, target };
      }
      return await LongTermMemory.handle(...args);
    }

    if (target === "Pages") {
      if (!Pages || typeof Pages.handle !== "function") {
        return { error: "PagesUnavailable", type, target };
      }
      return await Pages.handle(...args);
    }

    return { error: "UnknownTarget", type, target };
  }

  // --------------------------------------------------------------------------
  // PUBLIC ENTRY — called by proxy endpoint / backend spine
  //  This is the ORGANISM-CORRECT BACKEND ENDPOINT BRIDGE.
  //  Netlify / proxy handler should call:
  //    InnerAgent.handle({ type, payload, binaryPayload, context })
  // --------------------------------------------------------------------------
  async function handle({ type, payload, binaryPayload, context, modeKind } = {}) {
    const { target, route } = resolveTarget(type);
    const mk = modeKind || (binaryPayload ? "dual" : "symbolic");

    InnerState.lastType = type || null;
    InnerState.lastTarget = target;
    InnerState.lastModeKind = mk;

    safeLog("DISPATCH_START", { type, target, route, modeKind: mk });

    try {
      const res = await dispatchToTarget(target, type, payload, binaryPayload, context);
      safeLog("DISPATCH_OK", { type, target, route, modeKind: mk });
      return {
        ok: !res?.error,
        target,
        route,
        type,
        modeKind: mk,
        result: res
      };
    } catch (err) {
      const message = String(err?.message || err);
      warn("[InnerAgent] DISPATCH_ERROR", message);
      return {
        ok: false,
        target,
        route,
        type,
        modeKind: mk,
        error: "InnerAgentDispatchError",
        message
      };
    }
  }

  const PulseProxyInnerAgent = {
    PulseRole,
    InnerState,
    handle
  };

  safeLog("INIT", {
    identity: PulseRole.identity,
    version: PulseRole.version,
    upgradeFrom: "Endpoint.js"
  });

  return PulseProxyInnerAgent;
}
