/* global log,warn,error */
// ============================================================================
// FILE: /apps/PulseOS/PULSE-UI/PulseUIFlow-v13-EVO-PRIME.js
// PULSE OS — v13‑EVO‑PRIME
// “UI FLOW ENGINE / INTENT GLUE / HUMAN‑VISIBLE ORGANISM MAP”
// ============================================================================
//
// CANONICAL ROLE (v13‑EVO‑PRIME):
//   • Orchestrate high‑level UI flows as INTENTS (not pages)
//   • Bind Router / SkinReflex / Cortex signals to EvolutionaryPage.evolve()
//   • Maintain minimal, deterministic FLOW STATE (not app state)
//   • Expose a single, safe API for flows to request intent transitions
//
// WHAT THIS ORGAN IS:
//   ✔ A UI flow coordinator (front‑door for INTENT flows)
//   ✔ A thin membrane between Router results and EvolutionaryPage
//   ✔ A human‑visible map of “where we are” and “where we can go next”
//   ✔ A drift‑aware, route‑aware, identity‑aware, binary‑aware flow layer
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a router
//   ✘ NOT a data store
//   ✘ NOT a scheduler
//   ✘ NOT a renderer
//   ✘ NOT a binary executor
// ============================================================================


// ============================================================================
// ORGAN ROLE EXPORT — v13‑EVO‑PRIME
// ============================================================================
export const PulseUIFlowRole = {
  type: "UIFlow",
  subsystem: "PulseUIFlow",
  layer: "UI-Flow",
  version: "13.0",
  identity: "PulseUIFlow-v13-EVO-PRIME",

  evo: {
    driftProof: true,
    deterministicFlow: true,
    minimalState: true,
    binaryAware: true,
    dualBand: true,
    futureEvolutionReady: true
  },

  flow: {
    intentLevel: true,
    routeAware: true,
    errorAware: true,
    identityAware: true,
    organismAware: true
  },

  pulseContract: "PulseUIFlow-v2",
  meshContract: "PulseMesh-v13-ready",
  sendContract: "PulseSend-v13-ready"
};


// ============================================================================
// GLOBAL GUARDS + DIAGNOSTICS
// ============================================================================
const hasWindow = typeof window !== "undefined";

function safeConsoleLog(...args) {
  if (typeof console !== "undefined" && typeof console.log === "function") {
    console.log(...args);
  }
}

const FLOW_LAYER_ID   = "UI-FLOW";
const FLOW_LAYER_NAME = "PULSE UI FLOW ENGINE";
const FLOW_LAYER_VER  = "13.0";

const FLOW_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_UIFLOW_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

function logFlow(stage, details = {}) {
  if (!FLOW_DIAGNOSTICS_ENABLED) return;
  if (typeof log === "function") {
    log(
      JSON.stringify({
        pulseLayer: FLOW_LAYER_ID,
        pulseName:  FLOW_LAYER_NAME,
        pulseVer:   FLOW_LAYER_VER,
        stage,
        ...details
      })
    );
  } else {
    safeConsoleLog("[PulseUIFlow-v13]", stage, details);
  }
}


// ============================================================================
// IMPORTS — Router / SkinReflex / EvolutionaryPage
// ============================================================================
import { route } from "../PULSE-OS/PulseOSCNSNervousSystem.js";
import { attachScanner } from "../PulseOSSkinReflex.js";

// EvolutionaryPage is exposed globally by EvolutionaryTrustedPage boot
// window.PulseEvolutionaryPage.evolve({ intent: "dashboard", ... })


// ============================================================================
// INTENT-LEVEL FLOW MAP — declarative, human-readable
//  • This is NOT app state; it’s an INTENT graph
// ============================================================================
const UIIntentFlowMap = Object.freeze({
  login: {
    id: "login",
    intent: "login",
    next: ["dashboard"],
    requiresIdentity: false
  },
  dashboard: {
    id: "dashboard",
    intent: "dashboard",
    next: ["settings", "profile", "earn", "scanner", "proxyHealth"],
    requiresIdentity: true
  },
  settings: {
    id: "settings",
    intent: "settings",
    next: ["dashboard"],
    requiresIdentity: true
  },
  profile: {
    id: "profile",
    intent: "profile",
    next: ["dashboard"],
    requiresIdentity: true
  },
  earn: {
    id: "earn",
    intent: "earn",
    next: ["dashboard"],
    requiresIdentity: true
  },
  aiEarn: {
    id: "aiEarn",
    intent: "aiEarn",
    next: ["dashboard"],
    requiresIdentity: true
  },
  scanner: {
    id: "scanner",
    intent: "scanner",
    next: ["dashboard"],
    requiresIdentity: true
  },
  proxyHealth: {
    id: "proxyHealth",
    intent: "proxyHealth",
    next: ["dashboard"],
    requiresIdentity: true
  },
  error: {
    id: "error",
    intent: "error",
    next: ["dashboard"],
    requiresIdentity: false
  }
});


// ============================================================================
// MINIMAL FLOW STATE — deterministic, replaceable
// ============================================================================
const UIFlowState = {
  current: null,
  last: null,
  identityTrusted: false,

  setCurrent(flowId) {
    this.last = this.current;
    this.current = flowId;

    logFlow("FLOW_STATE_UPDATED", {
      current: this.current,
      last: this.last,
      identityTrusted: this.identityTrusted
    });
  },

  setIdentityTrusted(trusted) {
    this.identityTrusted = !!trusted;
    logFlow("FLOW_IDENTITY_UPDATED", {
      identityTrusted: this.identityTrusted
    });
  },

  snapshot() {
    return {
      current: this.current,
      last: this.last,
      identityTrusted: this.identityTrusted
    };
  }
};


// ============================================================================
// HELPERS — resolve by intent, call EvolutionaryPage
// ============================================================================
function resolveFlowByIntent(intentId) {
  return UIIntentFlowMap[intentId] || null;
}

function getEvolutionaryPage() {
  if (!hasWindow) return null;
  return window.PulseEvolutionaryPage || null;
}

async function evolveToIntent(flowDef, extraPayload = {}) {
  const EvoPage = getEvolutionaryPage();
  if (!EvoPage || typeof EvoPage.evolve !== "function") {
    logFlow("EVOLVE_MISSING_EVOLUTIONARY_PAGE", { flowId: flowDef.id });
    return { ok: false, reason: "NO_EVOLUTIONARY_PAGE" };
  }

  logFlow("EVOLVE_INTENT", {
    flowId: flowDef.id,
    intent: flowDef.intent
  });

  await EvoPage.evolve({
    intent: flowDef.intent,
    ...extraPayload
  });

  return { ok: true };
}


// ============================================================================
// PUBLIC API — v13‑EVO‑PRIME UI FLOW ENGINE
// ============================================================================

/**
 * Initialize UI Flow for current organism session.
 *  • Attaches SkinReflex/PageScanner
 *  • Derives identity trust
 *  • Chooses initial intent (login or dashboard)
 */
export async function initUIFlow() {
  logFlow("INIT_V13_START", {});

  if (!hasWindow) {
    logFlow("INIT_V13_SKIPPED_NO_WINDOW", {});
    return null;
  }

  // 1. Attach SkinReflex/PageScanner
  let scannerContext = null;
  try {
    scannerContext = await attachScanner();
  } catch (err) {
    logFlow("SCANNER_ATTACH_FAILED", { error: String(err) });
  }

  const identityTrusted = !!scannerContext?.identity?.trustedDevice;
  UIFlowState.setIdentityTrusted(identityTrusted);

  // 2. Choose initial flow
  const initialFlow = identityTrusted
    ? UIIntentFlowMap.dashboard
    : UIIntentFlowMap.login;

  UIFlowState.setCurrent(initialFlow.id);

  // 3. Evolve EvolutionaryPage into that intent
  await evolveToIntent(initialFlow, {
    mode: identityTrusted ? "inside" : "outside"
  });

  logFlow("INIT_V13_COMPLETE", {
    flowId: initialFlow.id,
    identityTrusted
  });

  return {
    flow: initialFlow,
    identityTrusted,
    scannerContext
  };
}


/**
 * Request a flow transition by intentId (flowId).
 *  • Validates transition against UIIntentFlowMap
 *  • Optionally consults Router
 *  • Calls EvolutionaryPage.evolve() instead of navigation
 */
export async function goToFlowIntent(flowId, options = {}) {
  const currentId = UIFlowState.current;
  const currentFlow = UIIntentFlowMap[currentId] || null;
  const targetFlow = UIIntentFlowMap[flowId] || null;

  if (!targetFlow) {
    logFlow("FLOW_UNKNOWN_TARGET_INTENT", { flowId });
    return { ok: false, reason: "UNKNOWN_TARGET" };
  }

  if (currentFlow && !currentFlow.next.includes(flowId)) {
    logFlow("FLOW_ILLEGAL_TRANSITION_INTENT", {
      from: currentFlow.id,
      to: targetFlow.id
    });
    return { ok: false, reason: "ILLEGAL_TRANSITION" };
  }

  // Identity gating
  if (targetFlow.requiresIdentity && !UIFlowState.identityTrusted) {
    logFlow("FLOW_IDENTITY_BLOCK_INTENT", {
      flowId: targetFlow.id,
      intent: targetFlow.intent,
      identityTrusted: UIFlowState.identityTrusted
    });

    const loginFlow = UIIntentFlowMap.login;
    UIFlowState.setCurrent(loginFlow.id);
    await evolveToIntent(loginFlow, { mode: "outside" });

    return { ok: false, reason: "IDENTITY_REQUIRED_REDIRECT_LOGIN" };
  }

  // Optional: ask Router if this transition is allowed
  let allowed = true;
  try {
    const result = await route("uiFlowIntentCheck", {
      from: currentFlow ? currentFlow.id : null,
      to: targetFlow.id,
      reflexOrigin: "UIFlow-v13",
      layer: "UI-Flow",
      binaryAware: true,
      dualBand: true
    });

    if (result && result.allowed === false) {
      allowed = false;
      logFlow("FLOW_ROUTER_BLOCKED_INTENT", {
        from: currentFlow ? currentFlow.id : null,
        to: targetFlow.id
      });
    }
  } catch (err) {
    logFlow("FLOW_ROUTER_CHECK_FAILED_INTENT", { error: String(err) });
  }

  if (!allowed) {
    return { ok: false, reason: "ROUTER_BLOCKED" };
  }

  UIFlowState.setCurrent(targetFlow.id);
  await evolveToIntent(targetFlow, options.payload || {});

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
    map: UIIntentFlowMap
  };
}


/**
 * Bind UI controls to intent transitions.
 *  • data-pulse-intent-target="dashboard"
 */
export function bindUIFlowIntentControls(root = null) {
  if (!hasWindow || !document) return;

  const scope = root || document;
  const nodes = scope.querySelectorAll("[data-pulse-intent-target]");

  nodes.forEach((node) => {
    const target = node.getAttribute("data-pulse-intent-target");
    if (!target) return;

    node.addEventListener("click", async (e) => {
      e.preventDefault();
      await goToFlowIntent(target);
    });
  });

  logFlow("FLOW_INTENT_CONTROLS_BOUND", {
    count: nodes.length
  });
}


// ESM default
export default {
  PulseUIFlowRole,
  initUIFlow,
  goToFlowIntent,
  getUIFlowSnapshot,
  bindUIFlowIntentControls
};
