// ============================================================================
// FILE: /apps/PulseOS/PULSE-UI/PulseUIFlow-v12-EVO.js
// PULSE OS — v12‑EVO
// “UI FLOW ENGINE / ROUTE GLUE / HUMAN‑VISIBLE NERVOUS MAP”
// ============================================================================
//
// CANONICAL ROLE (v12‑EVO):
//   • Orchestrate high‑level UI flows (login, dashboard, settings, etc.)
//   • Bind SkinReflex/PageScanner signals to visible UI transitions
//   • Maintain a minimal, deterministic UI flow state (NOT app state)
//   • Expose a single, safe API for pages to request flow changes
//
// WHAT THIS ORGAN IS:
//   ✔ A UI flow coordinator (front‑door for page flows)
//   ✔ A thin membrane between Router results and visible UI
//   ✔ A human‑visible map of “where we are” and “where we can go next”
//   ✔ A drift‑aware, route‑aware, binary‑aware flow layer
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a router (no backend routing decisions)
//   ✘ NOT a data cache or store
//   ✘ NOT a scheduler or timer
//   ✘ NOT a rendering engine
//   ✘ NOT a binary execution organ
//
// SAFETY CONTRACT (v12‑EVO):
//   • No direct DOM mutation outside of well‑scoped helpers
//   • No timers, no intervals for core flow logic
//   • No mutation of Router payloads
//   • Flow state is minimal and replaceable
//   • Always treat SkinReflex/PageScanner as source of truth for errors
//   • Never block the organism; flows are hints, not hard stops
// ============================================================================


// ============================================================================
// ORGAN ROLE EXPORT — v12‑EVO
// ============================================================================
export const PulseUIFlowRole = {
  type: "UIFlow",
  subsystem: "PulseUIFlow",
  layer: "UI-Flow",
  version: "12.0",
  identity: "PulseUIFlow-v12-EVO",

  evo: {
    driftProof: true,
    deterministicFlow: true,
    minimalState: true,
    binaryAware: true,
    dualBand: true,
    futureEvolutionReady: true
  },

  flow: {
    pageLevel: true,
    routeAware: true,
    errorAware: true,
    identityAware: true
  },

  pulseContract: "PulseUIFlow-v1",
  meshContract: "PulseMesh-v12-ready",
  sendContract: "PulseSend-v12-ready"
};


// ============================================================================
// GLOBAL GUARDS
// ============================================================================
const hasWindow = typeof window !== "undefined";

function safeConsoleLog(...args) {
  if (typeof console !== "undefined" && typeof console.log === "function") {
    console.log(...args);
  }
}


// ============================================================================
// FLOW DIAGNOSTICS
// ============================================================================
const FLOW_LAYER_ID   = "UI-FLOW";
const FLOW_LAYER_NAME = "PULSE UI FLOW ENGINE";
const FLOW_LAYER_VER  = "12.0";

const FLOW_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_UIFLOW_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

function logFlow(stage, details = {}) {
  if (!FLOW_DIAGNOSTICS_ENABLED) return;
  if (typeof log !== "function") {
    safeConsoleLog("[PulseUIFlow]", stage, details);
    return;
  }

  log(
    JSON.stringify({
      pulseLayer: FLOW_LAYER_ID,
      pulseName:  FLOW_LAYER_NAME,
      pulseVer:   FLOW_LAYER_VER,
      stage,
      ...details
    })
  );
}


// ============================================================================
// IMPORTS — Router + SkinReflex attach (if available)
// ============================================================================
import { route } from "../PULSE-OS/PulseOSCNSNervousSystem.js";
import { attachScanner } from "../PulseOSSkinReflex.js";


// ============================================================================
// UI FLOW MAP — declarative, human‑readable
//  • This is NOT app state; it’s a flow graph
// ============================================================================
const UIFlowMap = Object.freeze({
  Login: {
    id: "Login",
    path: "/Login.html",
    next: ["Dashboard"],
    requiresIdentity: false
  },
  Dashboard: {
    id: "Dashboard",
    path: "/Dashboard.html",
    next: ["Settings", "Profile"],
    requiresIdentity: true
  },
  Settings: {
    id: "Settings",
    path: "/Settings.html",
    next: ["Dashboard"],
    requiresIdentity: true
  },
  Profile: {
    id: "Profile",
    path: "/Profile.html",
    next: ["Dashboard"],
    requiresIdentity: true
  },
  ErrorPage: {
    id: "ErrorPage",
    path: "/Error.html",
    next: ["Dashboard"],
    requiresIdentity: false
  }
});


// ============================================================================
// MINIMAL FLOW STATE — deterministic, replaceable
// ============================================================================
const UIFlowState = {
  current: null,
  last: null,

  setCurrent(flowId) {
    this.last = this.current;
    this.current = flowId;

    logFlow("FLOW_STATE_UPDATED", {
      current: this.current,
      last: this.last
    });
  },

  snapshot() {
    return {
      current: this.current,
      last: this.last
    };
  }
};


// ============================================================================
// HELPERS — navigation + path resolution
// ============================================================================
function resolveFlowByPath(pathname) {
  const entries = Object.values(UIFlowMap);
  for (const flow of entries) {
    if (flow.path === pathname) return flow;
  }
  return null;
}

function navigateToPath(path) {
  if (!hasWindow || !window.location) return;
  if (!path) return;

  logFlow("NAVIGATE", { path });
  window.location.href = path;
}


// ============================================================================
// PUBLIC API — v12‑EVO UI FLOW ENGINE
// ============================================================================

/**
 * Initialize UI Flow for current page.
 *  • Attaches SkinReflex/PageScanner
 *  • Resolves current flow from location
 *  • Optionally validates identity via Router
 */
export async function initUIFlow() {
  logFlow("INIT_START", {});

  if (!hasWindow || !window.location) {
    logFlow("INIT_SKIPPED_NO_WINDOW", {});
    return null;
  }

  // 1. Attach SkinReflex/PageScanner (A1/A2)
  let scannerContext = null;
  try {
    scannerContext = await attachScanner();
  } catch (err) {
    logFlow("SCANNER_ATTACH_FAILED", { error: String(err) });
  }

  const pathname =
    (window.location && window.location.pathname) || "unknown";

  const flow = resolveFlowByPath(pathname) || UIFlowMap.ErrorPage;
  UIFlowState.setCurrent(flow.id);

  const identityTrusted = !!scannerContext?.identity?.trustedDevice;

  // 2. Identity gating for flows that require it
  if (flow.requiresIdentity && !identityTrusted) {
    logFlow("FLOW_IDENTITY_BLOCK", {
      flowId: flow.id,
      path: flow.path,
      identityTrusted
    });

    navigateToPath(UIFlowMap.Login.path);
    return {
      flow,
      identityTrusted,
      redirected: true
    };
  }

  logFlow("INIT_COMPLETE", {
    flowId: flow.id,
    path: flow.path,
    identityTrusted
  });

  return {
    flow,
    identityTrusted,
    redirected: false,
    scannerContext
  };
}


/**
 * Request a flow transition by flowId.
 *  • Validates that transition is allowed by UIFlowMap
 *  • Optionally consults Router for backend‑driven decisions
 */
export async function goToFlow(flowId, options = {}) {
  const currentId = UIFlowState.current;
  const currentFlow = UIFlowMap[currentId] || null;
  const targetFlow = UIFlowMap[flowId] || null;

  if (!targetFlow) {
    logFlow("FLOW_UNKNOWN_TARGET", { flowId });
    return { ok: false, reason: "UNKNOWN_TARGET" };
  }

  if (currentFlow && !currentFlow.next.includes(flowId)) {
    logFlow("FLOW_ILLEGAL_TRANSITION", {
      from: currentFlow.id,
      to: flowId
    });
    return { ok: false, reason: "ILLEGAL_TRANSITION" };
  }

  // Optional: ask Router if this transition is allowed
  let allowed = true;
  try {
    const result = await route("uiFlowCheck", {
      from: currentFlow ? currentFlow.id : null,
      to: targetFlow.id,
      reflexOrigin: "UIFlow",
      layer: "UI-Flow",
      binaryAware: true,
      dualBand: true
    });

    if (result && result.allowed === false) {
      allowed = false;
      logFlow("FLOW_ROUTER_BLOCKED", {
        from: currentFlow ? currentFlow.id : null,
        to: targetFlow.id
      });
    }
  } catch (err) {
    logFlow("FLOW_ROUTER_CHECK_FAILED", { error: String(err) });
  }

  if (!allowed) {
    return { ok: false, reason: "ROUTER_BLOCKED" };
  }

  UIFlowState.setCurrent(targetFlow.id);
  navigateToPath(targetFlow.path);

  return {
    ok: true,
    from: currentFlow ? currentFlow.id : null,
    to: targetFlow.id
  };
}


/**
 * Get current UI flow snapshot (for diagnostics / overlays).
 */
export function getUIFlowSnapshot() {
  return {
    ...UIFlowState.snapshot(),
    map: UIFlowMap
  };
}


/**
 * Bind UI buttons/links to flow transitions declaratively.
 *  • data-pulse-flow-target="Dashboard"
 */
export function bindUIFlowControls(root = null) {
  if (!hasWindow || !document) return;

  const scope = root || document;
  const nodes = scope.querySelectorAll("[data-pulse-flow-target]");

  nodes.forEach((node) => {
    const target = node.getAttribute("data-pulse-flow-target");
    if (!target) return;

    node.addEventListener("click", async (e) => {
      e.preventDefault();
      await goToFlow(target);
    });
  });

  logFlow("FLOW_CONTROLS_BOUND", {
    count: nodes.length
  });
}


// ============================================================================
// AUTO‑INIT (optional, safe)
//  • If page opts in via window.PULSE_UIFLOW_AUTO_INIT = true
// ============================================================================
if (hasWindow) {
  if (window.PULSE_UIFLOW_AUTO_INIT === true) {
    (async () => {
      try {
        await initUIFlow();
        bindUIFlowControls();
      } catch (err) {
        safeConsoleLog("[PulseUIFlow] auto‑init failed:", err);
      }
    })();
  }
}


// ============================================================================
// ESM + CommonJS DUAL EXPORTS
// ============================================================================

// ESM
export default {
  PulseUIFlowRole,
  initUIFlow,
  goToFlow,
  getUIFlowSnapshot,
  bindUIFlowControls
};

// CommonJS
module.exports = {
  PulseUIFlowRole,
  initUIFlow,
  goToFlow,
  getUIFlowSnapshot,
  bindUIFlowControls
};
