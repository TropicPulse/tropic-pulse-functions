// -----------------------------------------------------------------------------
// PulseBridge.js — LOCAL PORT BRIDGE for FRONT ↔ CNS (SIGNAL VERSION)
//  - Request/response routing with timeouts
//  - Fire-and-forget signals for telemetry (dnaVisibility, etc.)
//  - Dev tracing
//  - SSR-safe (no BroadcastChannel → no-op bridge)
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
// CALLBACK REGISTRIES (UI registers handlers here)
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
// Marks synthetic 404s so YOU know it's internal
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
// SAFE ROUTE — CNS_REQUEST → CNS_RESPONSE (with timeout, SSR-safe)
//  - SPECIAL: certain paths (e.g. proxy.dnaVisibility) are auto fire-and-forget
// -----------------------------------------------------------------------------
export function safeRoute(path, payload = {}, timeoutMs = 10000) {
  trace("CNS (SIGNAL)", { path, payload });

  // SSR / no BroadcastChannel → resolve immediately with null
  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, safeRoute is a no-op:", {
        path,
        payload,
      });
    }
    return Promise.resolve(null);
  }

  const requestId = `req-${Date.now()}-${Math.floor(performance.now() * 1000)}`;


  // 🔹 Auto fire-and-forget for telemetry-style paths
  if (FIRE_AND_FORGET_PATHS.has(path)) {
    channel.postMessage({
      type: "CNS_REQUEST",
      requestId,
      path,
      payload,
    });
    // Never wait for a response
    return Promise.resolve(null);
  }

  // Normal request/response path with timeout
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
      resolve(mark404(msg.result));
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;

      cleanup();
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

// -----------------------------------------------------------------------------
// FIRE-AND-FORGET ROUTE — explicit helper for telemetry, logs, etc.
// -----------------------------------------------------------------------------
export function fireAndForgetRoute(path, payload = {}) {
  trace("CNS (SIGNAL, FIRE-AND-FORGET)", { path, payload });

  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, fireAndForgetRoute is a no-op:", {
        path,
        payload,
      });
    }
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
// START DUALBAND AI — fire-and-forget signal
// -----------------------------------------------------------------------------
export function startDualBandAI(options = {}) {
  trace("DUALBAND_AI_START (SIGNAL)", options);

  if (!channel) return;

  channel.postMessage({
    type: "DUALBAND_AI_START",
    timestamp: Date.now(),
    options,
  });
}

// -----------------------------------------------------------------------------
// IMAGE FETCH THROUGH BRIDGE — request/response
// -----------------------------------------------------------------------------
export function fetchImageThroughBridge(url) {
  trace("IMAGE_FETCH (SIGNAL)", { url });

  if (!channel) {
    if (DEV) {
      console.warn("[LOCAL PORT BRIDGE] BroadcastChannel unavailable, fetchImageThroughBridge is a no-op:", {
        url,
      });
    }
    return Promise.resolve(null);
  }

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "IMAGE_RESPONSE") return;
      if (msg.requestId !== requestId) return;

      channel.removeEventListener("message", handler);
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
// START UNDERSTANDING — fire-and-forget signal
// -----------------------------------------------------------------------------
export function startUnderstanding(options = {}) {
  trace("UNDERSTANDING_START (SIGNAL)", options);

  if (!channel) return;

  channel.postMessage({
    type: "UNDERSTANDING_START",
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

    if (msg.type === "DUALBAND_AI_EVENT") {
      traceInbound("DUALBAND_AI_EVENT", msg.data);
      if (aiEventHandler) aiEventHandler(msg.data);
      return;
    }

    if (msg.type === "IMAGE_RESPONSE") {
      traceInbound("IMAGE_RESPONSE", msg.data);
      // UI will handle the data (Blob/Base64) via fetchImageThroughBridge
      return;
    }

    if (msg.type === "DUALBAND_BOOT") {
      traceInbound("DUALBAND_BOOT", msg.bootOptions);
      if (dualBandBootHandler) dualBandBootHandler(msg.bootOptions);
      return;
    }
  };
}

// -----------------------------------------------------------------------------
// ALIASES FOR WINDOW / OTHER MODULES
// -----------------------------------------------------------------------------
export const route = safeRoute;
export const PulseBinaryOrganismBoot = startDualBandAI;
export const PulseUnderstandingBoot = startUnderstanding;
