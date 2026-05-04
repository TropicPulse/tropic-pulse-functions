// -----------------------------------------------------------------------------
// PulseProofBridge.js — LOCAL PORT BRIDGE for FRONT ↔ CNS (SIGNAL VERSION)
//  - Request/response routing with timeouts
//  - Fire-and-forget signals for telemetry (dnaVisibility, etc.)
//  - Dev tracing
//  - SSR-safe (no BroadcastChannel → no-op bridge)
//  - v14 IMMORTAL: LocalStorage mirroring of ALL bridge events
// -----------------------------------------------------------------------------
/*
AI_EXPERIENCE_META = {
  identity: "PulseProofBridge",
  version: "v13-EVO-CNS-PRIME",
  layer: "frontend",
  role: "cns_bridge",
  lineage: "PulseOS-v12",

  evo: {
    cnsAligned: true,
    dualBand: true,
    binaryAware: true,
    presenceAware: true,
    safeRouteFree: true,
    chunkAligned: true,
    bridgeCore: true,

    // v14 IMMORTAL
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,
    modeAgnostic: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIFlow",
      "PulseUIErrors",
      "PulsePresenceNormalizer"
    ],
    never: [
      "legacyBridge",
      "safeRoute",
      "fetchViaCNS",
      "legacyPresence",
      "legacyChunker",
      "legacyFlow"
    ]
  }
}
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
// -----------------------------------------------------------------------------
// IMMORTAL LOCALSTORAGE MIRROR — PulseBridgeStore
// -----------------------------------------------------------------------------

const BRIDGE_LS_KEY = "PulseBridge.v14.buffer";
const BRIDGE_LS_MAX = 2000;

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__pulse_bridge_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function loadBridgeBuffer() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(BRIDGE_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBridgeBuffer(buf) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buf.length > BRIDGE_LS_MAX ? buf.slice(buf.length - BRIDGE_LS_MAX) : buf;
    window.localStorage.setItem(BRIDGE_LS_KEY, JSON.stringify(trimmed));
  } catch {}
}

function appendBridgeRecord(kind, payload) {
  const entry = {
    ts: Date.now(),
    kind,
    payload
  };
  const buf = loadBridgeBuffer();
  buf.push(entry);
  saveBridgeBuffer(buf);
}

export const PulseBridgeStore = {
  getAll() {
    return loadBridgeBuffer();
  },
  tail(n = 200) {
    const buf = loadBridgeBuffer();
    return buf.slice(Math.max(0, buf.length - n));
  },
  clear() {
    saveBridgeBuffer([]);
  }
};

// -----------------------------------------------------------------------------
// ORIGINAL BRIDGE IMPLEMENTATION (UNCHANGED BEHAVIOR)
// -----------------------------------------------------------------------------

const DEV = true;

const hasBroadcastChannel =
  typeof window !== "undefined" && typeof BroadcastChannel !== "undefined";

const channel = hasBroadcastChannel ? new BroadcastChannel("PulseCNS") : null;

// Paths that should NEVER block waiting for CNS_RESPONSE
const FIRE_AND_FORGET_PATHS = new Set([
  "proxy.dnaVisibility",
]);

// -----------------------------------------------------------------------------
// CALLBACK REGISTRIES
// -----------------------------------------------------------------------------
let dualBandBootHandler = null;
let aiEventHandler = null;

export function onDualBandBoot(fn) {
  dualBandBootHandler = fn;
}

export function onAIEvent(fn) {
  aiEventHandler = fn;
}

// -----------------------------------------------------------------------------
// Marks synthetic 404s
// -----------------------------------------------------------------------------
function mark404(result) {
  if (!result) return result;
  if (result === 404) return "404*";
  if (result?.status === 404) return { ...result, status: "404*" };
  if (typeof result === "string" && result.trim() === "404") return "404*";
  return result;
}

// -----------------------------------------------------------------------------
// Optional dev-mode tracing
// -----------------------------------------------------------------------------
function trace(label, data) {
  if (!DEV) return;
  console.log(`%c[LOCAL PORT BRIDGE] → ${label}`, "color:#7FDBFF; font-weight:bold;", data);
}

function traceInbound(label, data) {
  if (!DEV) return;
  console.log(`%c[LOCAL PORT BRIDGE] ← ${label}`, "color:#39CCCC; font-weight:bold;", data);
}

// -----------------------------------------------------------------------------
// SAFE ROUTE — CNS_REQUEST → CNS_RESPONSE
// -----------------------------------------------------------------------------
export function safeRoute(path, payload = {}, timeoutMs = 10000) {
  trace("CNS (SIGNAL)", { path, payload });

  // IMMORTAL: mirror outbound safeRoute
  appendBridgeRecord("safeRoute_outbound", { path, payload });

  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, safeRoute is a no-op:", {
        path,
        payload,
      });
    }
    appendBridgeRecord("safeRoute_noop", { path, payload });
    return Promise.resolve(null);
  }

  const requestId = `req-${Date.now()}-${Math.floor(performance.now() * 1000)}`;

  // Fire-and-forget paths
  if (FIRE_AND_FORGET_PATHS.has(path)) {
    channel.postMessage({
      type: "CNS_REQUEST",
      requestId,
      path,
      payload,
    });

    appendBridgeRecord("safeRoute_fireAndForget", { path, payload });

    return Promise.resolve(null);
  }

  // Normal request/response
  return new Promise((resolve) => {
    let settled = false;

    const cleanup = () => {
      if (!channel) return;
      channel.removeEventListener("message", handler);
    };

    const handler = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "CNS_RESPONSE") return;
      if (msg.requestId !== requestId) return;

      if (settled) return;
      settled = true;

      cleanup();

      const result = mark404(msg.result);

      // IMMORTAL: mirror inbound response
      appendBridgeRecord("safeRoute_inbound", {
        path,
        payload,
        result
      });

      resolve(result);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;

      cleanup();

      appendBridgeRecord("safeRoute_timeout", { path, payload });

      if (DEV) {
        console.warn("[LOCAL PORT BRIDGE] safeRoute timeout:", { path, payload, timeoutMs });
      }
      resolve(null);
    }, timeoutMs);

    const wrappedHandler = (event) => {
      handler(event);
      if (settled) clearTimeout(timer);
    };

    channel.addEventListener("message", wrappedHandler);

    channel.postMessage({
      type: "CNS_REQUEST",
      requestId,
      path,
      payload,
    });
  });
}

// ============================================================================
// CORE MEMORY BRIDGE LAYER (v1)
//  - Allows PulseRouteMemory, PulseRouter, PulseExpansion, etc
//    to access PulseCoreMemory WITHOUT importing it.
//  - Keeps membrane intact.
// ============================================================================

export const coreMemoryBridge = {
  read(key) {
    try {
      return route("coreMemory.read", { key });
    } catch (err) {
      return null;
    }
  },

  write(key, value) {
    try {
      return route("coreMemory.write", { key, value });
    } catch (err) {
      return false;
    }
  },

  start() {
    try {
      return route("coreMemory.start", { ts: Date.now() });
    } catch (err) {
      return false;
    }
  }
};


// -----------------------------------------------------------------------------
// FIRE-AND-FORGET ROUTE
// -----------------------------------------------------------------------------
export function fireAndForgetRoute(path, payload = {}) {
  trace("CNS (SIGNAL, FIRE-AND-FORGET)", { path, payload });

  appendBridgeRecord("fireAndForget_outbound", { path, payload });

  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, fireAndForgetRoute is a no-op:", {
        path,
        payload,
      });
    }
    appendBridgeRecord("fireAndForget_noop", { path, payload });
    return;
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  channel.postMessage({
    type: "CNS_REQUEST",
    requestId,
    path,
    payload,
  });
}

// -----------------------------------------------------------------------------
// START DUALBAND AI
// -----------------------------------------------------------------------------
export function startDualBandAI(options = {}) {
  trace("DUALBAND_AI_START (SIGNAL)", options);

  appendBridgeRecord("dualband_start_outbound", options);

  if (!channel) return;

  channel.postMessage({
    type: "DUALBAND_AI_START",
    timestamp: Date.now(),
    options,
  });
}

// -----------------------------------------------------------------------------
// IMAGE FETCH THROUGH BRIDGE
// -----------------------------------------------------------------------------
export function fetchImageThroughBridge(url) {
  trace("IMAGE_FETCH (SIGNAL)", { url });

  appendBridgeRecord("imageFetch_outbound", { url });

  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, fetchImageThroughBridge is a no-op:", {
        url,
      });
    }
    appendBridgeRecord("imageFetch_noop", { url });
    return Promise.resolve(null);
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "IMAGE_RESPONSE") return;
      if (msg.requestId !== requestId) return;

      channel.removeEventListener("message", handler);

      appendBridgeRecord("imageFetch_inbound", {
        url,
        data: msg.data
      });

      resolve(msg.data);
    };

    channel.addEventListener("message", handler);

    channel.postMessage({
      type: "IMAGE_REQUEST",
      requestId,
      url,
    });
  });
}

// -----------------------------------------------------------------------------
// START UNDERSTANDING
// -----------------------------------------------------------------------------
export function startUnderstanding(options = {}) {
  trace("UNDERSTANDING_START (SIGNAL)", options);

  appendBridgeRecord("understanding_start_outbound", options);

  if (!channel) return;

  channel.postMessage({
    type: "UNDERSTANDING_START",
    timestamp: Date.now(),
    options,
  });
}

// -----------------------------------------------------------------------------
// START PULSE-NET
// -----------------------------------------------------------------------------
export function startPulseNet(options = {}) {
  trace("PULSENET_START (SIGNAL)", options);

  appendBridgeRecord("pulsenet_start_outbound", options);

  if (!channel) return;

  channel.postMessage({
    type: "PULSENET_START",
    timestamp: Date.now(),
    options,
  });
}


// -----------------------------------------------------------------------------
// INBOUND SIGNAL HANDLER — AI → UI events
// -----------------------------------------------------------------------------
if (channel) {
  channel.onmessage = (event) => {
    const msg = event.data;
    if (!msg) return;

    // Mirror inbound
    appendBridgeRecord("inbound_raw", msg);

    if (msg.type === "DUALBAND_AI_EVENT") {
      traceInbound("DUALBAND_AI_EVENT", msg.data);
      appendBridgeRecord("dualband_ai_event", msg.data);
      if (aiEventHandler) aiEventHandler(msg.data);
      return;
    }

    if (msg.type === "IMAGE_RESPONSE") {
      traceInbound("IMAGE_RESPONSE", msg.data);
      appendBridgeRecord("image_response", msg.data);
      return;
    }

    if (msg.type === "DUALBAND_BOOT") {
      traceInbound("DUALBAND_BOOT", msg.bootOptions);
      appendBridgeRecord("dualband_boot", msg.bootOptions);
      if (dualBandBootHandler) dualBandBootHandler(msg.bootOptions);
      return;
    }
  };
}
// -----------------------------------------------------------------------------
// ALIASES
// -----------------------------------------------------------------------------
export const route = safeRoute;
export const PulseBinaryOrganismBoot = startDualBandAI;
export const PulseUnderstandingBoot = startUnderstanding;
export const PulseNetBoot = startPulseNet;   // ← NEW (boots Pulse-Net by SIGNAL)

export const PulseProofBridge = {
  route,
  coreMemory: coreMemoryBridge,
  PulseNetBoot,              // ← expose Pulse-Net boot through the bridge
};


// -----------------------------------------------------------------------------
// GLOBAL EXPOSURE OF IMMORTAL STORE
// -----------------------------------------------------------------------------
try {
  if (typeof window !== "undefined") {
    window.PulseBridgeStore = PulseBridgeStore;
    window.PulseProofBridge = PulseProofBridge;
  }
  if (typeof global !== "undefined") {
    global.PulseBridgeStore = PulseBridgeStore;
    global.PulseProofBridge = PulseProofBridge;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseBridgeStore = PulseBridgeStore;
    globalThis.PulseProofBridge = PulseProofBridge;
  }
  if (typeof g !== "undefined") {
    g.PulseBridgeStore = PulseBridgeStore;
    g.PulseProofBridge = PulseProofBridge;
  }
} catch {}
