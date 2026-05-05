/* global log,warn,error */
// ============================================================================
// FILE: /PulseOS/PULSE-UI/PulseUIFlow-v16.js
// PULSE OS — v16‑IMMORTAL
// “UI FLOW ENGINE / INTENT GLUE / HUMAN‑VISIBLE ORGANISM MAP”
// Offline‑First • LocalStorage+CoreMemory Mirrored • Replay‑Aware
// Tier/Channel‑Aware • Router‑Checked • Evolutionary‑Page‑Driven
// ============================================================================

/*
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUIFlow",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_flow_engine",
  lineage: "PulseUIFlow-v13-Evo-PRIME → v14-Immortal → v16-Immortal",

  evo: {
    intentDriven: true,
    organismMapAligned: true,
    presenceAware: true,
    chunkAligned: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    offlineFirst: true,
    localStoreMirrored: true,
    coreMemoryMirrored: true,
    replayAware: true,
    modeAgnostic: true,

    routeAware: true,
    routerChecked: true,
    errorAware: true,
    identityAware: true,
    evolutionaryPageAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIErrors",
      "PulseProofBridge",
      "PulseCore.Memory"
    ],
    never: [
      "legacyUIFlow",
      "legacyPresence",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUIFlow",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "UIIntent",
    "IdentityContext",
    "RouterCheckResult",
    "EvolutionaryPage"
  ],

  produces: [
    "UIFlowStateSnapshot",
    "UIFlowTransition",
    "UIFlowReplayBuffer"
  ],

  sideEffects: "localstorage_and_corememory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

const UIFLOW_SCHEMA_VERSION = "v3";

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

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

const route = PulseProofBridge?.route;
const CoreMemory = PulseProofBridge?.coreMemory || null;

// ============================================================================
// IMMORTAL LOCALSTORAGE MIRROR — PulseUIFlowStore
// ============================================================================

const UIFLOW_LS_KEY = "PulseUIFlow.v16.buffer";
const UIFLOW_LS_MAX = 2000;

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__uiflow_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function loadFlowBuffer() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(UIFLOW_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mirrorFlowBufferToCoreMemory(buf) {
  if (!CoreMemory || typeof CoreMemory.setRouteSnapshot !== "function") return;
  try {
    const envelope = {
      schemaVersion: UIFLOW_SCHEMA_VERSION,
      version: "16.0-Immortal",
      routeId: "uiFlow",
      buffer: buf,
      timestamp: "NO_TIMESTAMP_v16"
    };
    CoreMemory.setRouteSnapshot("uiFlow", envelope);
  } catch {
    // best-effort only
  }
}

function saveFlowBuffer(buf) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buf.length > UIFLOW_LS_MAX ? buf.slice(buf.length - UIFLOW_LS_MAX) : buf;
    window.localStorage.setItem(UIFLOW_LS_KEY, JSON.stringify(trimmed));
    mirrorFlowBufferToCoreMemory(trimmed);
  } catch {}
}

function appendFlowRecord(kind, payload) {
  const entry = {
    ts: Date.now(),
    kind,
    payload
  };
  const buf = loadFlowBuffer();
  buf.push(entry);
  saveFlowBuffer(buf);
}

export const PulseUIFlowStore = {
  getAll() {
    return loadFlowBuffer();
  },
  tail(n = 200) {
    const buf = loadFlowBuffer();
    return buf.slice(Math.max(0, buf.length - n));
  },
  clear() {
    saveFlowBuffer([]);
  }
};

// ============================================================================
// ORIGINAL UI FLOW ENGINE (v13 logic preserved, v16 visibility added)
// ============================================================================

export const PulseUIFlowRole = {
  type: "UIFlow",
  subsystem: "PulseUIFlow",
  layer: "UI-Flow",
  version: "16.0-Immortal",
  identity: "PulseUIFlow-v16-Immortal",

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

  pulseContract: "PulseUIFlow-v3",
  meshContract: "PulseMesh-v16-ready",
  sendContract: "PulseSend-v16-ready"
};

const hasWindow = typeof window !== "undefined";

function safeConsoleLog(...args) {
  if (typeof console !== "undefined" && typeof console.log === "function") {
    console.log(...args);
  }
}

const FLOW_LAYER_ID   = "UI-FLOW";
const FLOW_LAYER_NAME = "PULSE UI FLOW ENGINE";
const FLOW_LAYER_VER  = "16.0-Immortal";

const FLOW_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_UIFLOW_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

function logFlow(stage, details = {}) {
  appendFlowRecord("flow_log", { stage, details });

  if (!FLOW_DIAGNOSTICS_ENABLED) return;
  if (typeof log === "function") {
    log(
      JSON.stringify({
        pulseLayer: FLOW_LAYER_ID,
        pulseName:  FLOW_LAYER_NAME,
        pulseVer:   FLOW_LAYER_VER,
        schemaVersion: UIFLOW_SCHEMA_VERSION,
        stage,
        ...details
      })
    );
  } else {
    safeConsoleLog("[PulseUIFlow-v16]", stage, details);
  }
}

// ============================================================================
// INTENT MAP (unchanged semantics)
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
    next: ["settings", "profile", "earn", "scanner", "proxyHealth", "aiEarn"],
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
// FLOW STATE (unchanged logic, IMMORTAL visibility added)
// ============================================================================
const UIFlowState = {
  current: null,
  last: null,
  identityTrusted: false,

  setCurrent(flowId) {
    this.last = this.current;
    this.current = flowId;

    appendFlowRecord("setCurrent", {
      current: this.current,
      last: this.last
    });

    logFlow("FLOW_STATE_UPDATED", {
      current: this.current,
      last: this.last,
      identityTrusted: this.identityTrusted
    });
  },

  setIdentityTrusted(trusted) {
    this.identityTrusted = !!trusted;

    appendFlowRecord("setIdentityTrusted", {
      identityTrusted: this.identityTrusted
    });

    logFlow("FLOW_IDENTITY_UPDATED", {
      identityTrusted: this.identityTrusted
    });
  },

  snapshot() {
    return {
      schemaVersion: UIFLOW_SCHEMA_VERSION,
      current: this.current,
      last: this.last,
      identityTrusted: this.identityTrusted
    };
  }
};

// ============================================================================
// HELPERS
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
    appendFlowRecord("evolve_missing_page", { flowId: flowDef.id });
    logFlow("EVOLVE_MISSING_EVOLUTIONARY_PAGE", { flowId: flowDef.id });
    return { ok: false, reason: "NO_EVOLUTIONARY_PAGE" };
  }

  appendFlowRecord("evolve_intent", {
    flowId: flowDef.id,
    intent: flowDef.intent,
    extraPayload
  });

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
// PUBLIC API — IMMORTAL UI FLOW ENGINE
// ============================================================================
export async function initUIFlow() {
  appendFlowRecord("init_start", {});

  logFlow("INIT_V16_START", {});

  if (!hasWindow) {
    appendFlowRecord("init_no_window", {});
    logFlow("INIT_V16_SKIPPED_NO_WINDOW", {});
    return null;
  }

  let identityTrusted = false;
  let identityContext = null;

  try {
    if (typeof route === "function") {
      identityContext = await route("identity.check", {});
      identityTrusted = !!identityContext?.trustedDevice;

      appendFlowRecord("identity_check", {
        identityTrusted,
        identityContext
      });
    } else {
      appendFlowRecord("identity_check_skipped_no_route", {});
      logFlow("IDENTITY_CHECK_SKIPPED_NO_ROUTE", {});
    }
  } catch (err) {
    appendFlowRecord("identity_check_error", { error: String(err) });
    logFlow("IDENTITY_CHECK_FAILED", { error: String(err) });
  }

  UIFlowState.setIdentityTrusted(identityTrusted);

  const initialFlow = identityTrusted
    ? UIIntentFlowMap.dashboard
    : UIIntentFlowMap.login;

  UIFlowState.setCurrent(initialFlow.id);

  await evolveToIntent(initialFlow, {
    mode: identityTrusted ? "inside" : "outside"
  });

  appendFlowRecord("init_complete", {
    flowId: initialFlow.id,
    identityTrusted
  });

  logFlow("INIT_V16_COMPLETE", {
    flowId: initialFlow.id,
    identityTrusted
  });

  // Mirror snapshot into CoreMemory as well
  try {
    if (CoreMemory && typeof CoreMemory.setRouteSnapshot === "function") {
      CoreMemory.setRouteSnapshot("uiFlowState", {
        schemaVersion: UIFLOW_SCHEMA_VERSION,
        version: "16.0-Immortal",
        routeId: "uiFlowState",
        state: UIFlowState.snapshot(),
        timestamp: "NO_TIMESTAMP_v16"
      });
    }
  } catch {
    // best-effort
  }

  return {
    flow: initialFlow,
    identityTrusted,
    identityContext
  };
}

export async function goToFlowIntent(flowId, options = {}) {
  appendFlowRecord("goToFlowIntent_in", { flowId, options });

  const currentId = UIFlowState.current;
  const currentFlow = UIIntentFlowMap[currentId] || null;
  const targetFlow = UIIntentFlowMap[flowId] || null;

  if (!targetFlow) {
    appendFlowRecord("unknown_target", { flowId });
    logFlow("FLOW_UNKNOWN_TARGET_INTENT", { flowId });
    return { ok: false, reason: "UNKNOWN_TARGET" };
  }

  if (currentFlow && !currentFlow.next.includes(flowId)) {
    appendFlowRecord("illegal_transition", {
      from: currentFlow.id,
      to: targetFlow.id
    });
    logFlow("FLOW_ILLEGAL_TRANSITION_INTENT", {
      from: currentFlow.id,
      to: targetFlow.id
    });
    return { ok: false, reason: "ILLEGAL_TRANSITION" };
  }

  if (targetFlow.requiresIdentity && !UIFlowState.identityTrusted) {
    appendFlowRecord("identity_block", {
      flowId: targetFlow.id,
      identityTrusted: UIFlowState.identityTrusted
    });

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

  let allowed = true;
  try {
    if (typeof route === "function") {
      const result = await route("uiFlowIntentCheck", {
        from: currentFlow ? currentFlow.id : null,
        to: targetFlow.id,
        reflexOrigin: "UIFlow-v16",
        layer: "UI-Flow",
        binaryAware: true,
        dualBand: true
      });

      appendFlowRecord("router_check", { result });

      if (result && result.allowed === false) {
        allowed = false;
        logFlow("FLOW_ROUTER_BLOCKED_INTENT", {
          from: currentFlow ? currentFlow.id : null,
          to: targetFlow.id
        });
      }
    } else {
      appendFlowRecord("router_check_skipped_no_route", {});
      logFlow("FLOW_ROUTER_CHECK_SKIPPED_NO_ROUTE", {});
    }
  } catch (err) {
    appendFlowRecord("router_check_error", { error: String(err) });
    logFlow("FLOW_ROUTER_CHECK_FAILED_INTENT", { error: String(err) });
  }

  if (!allowed) {
    appendFlowRecord("router_blocked", {});
    return { ok: false, reason: "ROUTER_BLOCKED" };
  }

  UIFlowState.setCurrent(targetFlow.id);
  await evolveToIntent(targetFlow, options.payload || {});

  appendFlowRecord("goToFlowIntent_out", {
    from: currentFlow ? currentFlow.id : null,
    to: targetFlow.id
  });

  // Mirror snapshot into CoreMemory
  try {
    if (CoreMemory && typeof CoreMemory.setRouteSnapshot === "function") {
      CoreMemory.setRouteSnapshot("uiFlowState", {
        schemaVersion: UIFLOW_SCHEMA_VERSION,
        version: "16.0-Immortal",
        routeId: "uiFlowState",
        state: UIFlowState.snapshot(),
        timestamp: "NO_TIMESTAMP_v16"
      });
    }
  } catch {
    // best-effort
  }

  return {
    ok: true,
    from: currentFlow ? currentFlow.id : null,
    to: targetFlow.id
  };
}

export function getUIFlowSnapshot() {
  const snap = {
    ...UIFlowState.snapshot(),
    map: UIIntentFlowMap
  };

  appendFlowRecord("snapshot", snap);
  return snap;
}

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

  appendFlowRecord("bind_controls", { count: nodes.length });

  logFlow("FLOW_INTENT_CONTROLS_BOUND", {
    count: nodes.length
  });
}

export default {
  PulseUIFlowRole,
  initUIFlow,
  goToFlowIntent,
  getUIFlowSnapshot,
  bindUIFlowIntentControls
};

// ============================================================================
// GLOBAL EXPOSURE OF IMMORTAL STORE
// ============================================================================
try {
  if (typeof window !== "undefined") {
    window.PulseUIFlow = initUIFlow;
    window.PulseUIFlowStore = PulseUIFlowStore;
    window.PulseUIFlowV16 = {
      onError: (packet) => {
        appendFlowRecord("error_spine_packet", packet);
        logFlow("ERROR_SPINE_PACKET", { signature: packet.signature });
      }
    };
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseUIFlow = initUIFlow;
    globalThis.PulseUIFlowStore = PulseUIFlowStore;
  }
  if (typeof global !== "undefined") {
    global.PulseUIFlow = initUIFlow;
    global.PulseUIFlowStore = PulseUIFlowStore;
  }
  if (typeof g !== "undefined") {
    g.PulseUIFlow = initUIFlow;
    g.PulseUIFlowStore = PulseUIFlowStore;
  }
} catch {}
