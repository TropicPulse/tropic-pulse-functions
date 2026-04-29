
// ============================================================================
// FILE: /apps/PULSE-OS/PulseOSCNSNervousSystem-v11-EVO-BINARY-MAX.js
// PULSE OS — v11‑EVO‑BINARY‑MAX
// “THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN”
// ============================================================================

export const PulseRole = {
  type: "NervousSystem",
  subsystem: "CNS",
  layer: "B-Layer",
  version: "11.0",
  identity: "PulseOSCNSNervousSystem-v11-EVO-BINARY",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,

    // Dual‑band: symbolic (routes, types) + binary (payload bytes) as modes, not mutation
    dualBand: true,
    binaryAware: true,
    symbolicPrimary: true,
    binaryNonExecutable: true,
    zeroFilesystem: true,

    // Contracts — v11 organism‑wide
    routingContract: "PulseRouter-v11.0",
    proxyCompatibility: "PulseProxySpine-v11.0",
    sendCompatibility: "PulseSendSystem-v11.0",

    // Continuance / loop‑theory awareness
    loopTheoryAware: true,
    continuanceAware: true
  }
};

export const PulseOSCNSNervousSystemMeta = Object.freeze({
  layer: "PulseOSCNSNervousSystem",
  role: "CNS_COMMUNICATION_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseOSCNSNervousSystem-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // CNS communication laws
    cnsCommunicationOrgan: true,
    frontendBackendBridge: true,
    offlineOnlineDualBand: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,
    binaryNonExecutable: true,

    // Routing laws
    deterministicRouting: true,
    proxySpineOnly: true,
    localFirstRouting: true,
    guardedGlobalAccess: true,
    routerHealingAware: true,
    routeDownAlertAware: true,

    // Safety
    zeroDynamicImports: true,
    zeroEval: true,
    zeroFilesystem: true,
    zeroUserCode: true,
    zeroRandomness: true,
    zeroDateNow: true,
    worldLensAware: true,

    // Continuance + loop theory
    loopTheoryAware: true,
    continuanceAware: true
  }),

  contract: Object.freeze({
    input: [
      "RouteRequest",
      "DualBandContext",
      "ProxySpineInjection",
      "ShortTermMemory"
    ],
    output: [
      "CNSRouteResult",
      "CNSDiagnostics",
      "CNSSignatures",
      "CNSHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseOS-v11.2-EVO",
    ancestry: [
      "PulseOSCNSNervousSystem-v9",
      "PulseOSCNSNervousSystem-v10",
      "PulseOSCNSNervousSystem-v11",
      "PulseOSCNSNervousSystem-v11-Evo",
      "PulseOSCNSNervousSystem-v11-EVO-BINARY"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "cns-routing"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "symbolic routing → proxy spine → healing + drift reporting",
    adaptive: "binary-tagged payloads + dual-band metadata",
    return: "deterministic CNS route result + signatures"
  })
});


// ============================================================================
// ORGAN IMPORTS — COMPLETE THE CONNECTION (Membranes → CNS)
// ============================================================================
import { PulseOSShortTermMemory } from "./PulseOSShortTermMemory.js";


// ============================================================================
// CNS CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "CNS-LAYER";
const LAYER_NAME = "THE CENTRAL NERVOUS SYSTEM";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE ORGAN";
const LAYER_VER  = "11.0";

const hasWindow = typeof window !== "undefined";

// Router memory + heartbeat surfaces from ShortTermMemory / window
const RouterMemory =
  (PulseOSShortTermMemory && PulseOSShortTermMemory.RouterMemory) ||
  PulseOSShortTermMemory ||
  (hasWindow && window.PulseRouterMemory) ||
  null;

const GateHeartbeat =
  (PulseOSShortTermMemory && PulseOSShortTermMemory.GateHeartbeat) ||
  (hasWindow && window.GateHeartbeat) ||
  null;

// Base logger (diagnostics only, non-contract)
const baseLog =
  (hasWindow && typeof window.PulseLog === "function")
    ? window.PulseLog
    : (typeof console !== "undefined" && typeof console.log === "function"
        ? console.log
        : () => {});

const CNS_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_CNS_DIAGNOSTICS === "true" ||
    window.PULSE_DIAGNOSTICS === "true");

const logCNS = (stage, details = {}) => {
  if (!CNS_DIAGNOSTICS_ENABLED) return;

  baseLog(JSON.stringify({
    pulseLayer: LAYER_ID,
    pulseName:  LAYER_NAME,
    pulseRole:  LAYER_ROLE,
    pulseVer:   LAYER_VER,
    stage,
    ...details
  }));
};

logCNS("CNS_INIT");


// ============================================================================
// ROUTE FAILURE STATE
// ============================================================================
let routeFailureCount = 0;


// ============================================================================
// CNS CONTEXT MAP — v11 dual‑band + binary‑aware
// ============================================================================
const CNS_CONTEXT = {
  label: "CNS",
  layer: "B‑Layer",
  purpose: "Frontend → Backend Communication Organ",
  context: "Sends structured requests to backend via Proxy Spine gateway",
  version: LAYER_VER,

  // Dual‑band tagging (symbolic‑primary, binary‑aware)
  band: "dual",
  symbolicPrimary: true,
  binaryAware: true,

  modes: {
    offline: "local-endpoint",
    online: "proxy-spine"
  }
};
// ============================================================================
// TRANSPORT LAYER — OFFLINE + ONLINE (GUARDED GLOBALS, DUAL‑BAND)
// ============================================================================
const Transport = {
  async callEndpoint(type, payload) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    // OFFLINE BAND — local‑first, no network
    if (offlineMode) {
      logCNS("TRANSPORT_OFFLINE_MODE", { type, band: "offline" });

      const localEndpoint =
        hasWindow && window.PulseLocalEndpoint &&
        typeof window.PulseLocalEndpoint.handle === "function"
          ? window.PulseLocalEndpoint
          : null;

      if (localEndpoint) {
        try {
          const result = await localEndpoint.handle({ type, payload, CNS_CONTEXT });
          logCNS("TRANSPORT_OFFLINE_RESPONSE", { type, band: "offline" });
          return result;
        } catch (err) {
          logCNS("TRANSPORT_OFFLINE_ERROR", {
            type,
            band: "offline",
            message: String(err)
          });
          return { error: "Offline local endpoint failed", details: String(err) };
        }
      }

      logCNS("TRANSPORT_OFFLINE_NO_HANDLER", { type, band: "offline" });
      return { error: "Offline mode: no local endpoint handler registered" };
    }

    // ONLINE BAND — local push to remote endpoint (brain/endpoint owns fetch)
    logCNS("TRANSPORT_ONLINE_CALL", { type, band: "online" });

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("TRANSPORT_ONLINE_NO_REMOTE_ENDPOINT", { type, band: "online" });
      return { error: "No remote endpoint handler registered for online band" };
    }

    try {
      const json = await remoteEndpoint.handle({ type, payload, context: CNS_CONTEXT });
      logCNS("TRANSPORT_ONLINE_RESPONSE", { type, band: "online" });
      return json;
    } catch (err) {
      logCNS("TRANSPORT_ONLINE_ERROR", {
        type,
        band: "online",
        message: String(err)
      });
      return { error: "Online remote endpoint failed", details: String(err) };
    }
  },

  async callCheckRouterMemory(logs) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logCNS("HEAL_SKIP_OFFLINE", { count: logs.length, band: "offline" });
      return null;
    }

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("HEAL_NO_REMOTE_ENDPOINT", { count: logs.length, band: "online" });
      return null;
    }

    try {
      const data = await remoteEndpoint.handle({
        type: "CheckRouterMemory",
        payload: { logs },
        context: CNS_CONTEXT
      });
      return data;
    } catch (err) {
      logCNS("HEAL_REMOTE_ERROR", {
        count: logs.length,
        band: "online",
        message: String(err)
      });
      return null;
    }
  },

  async callRouteDownAlert(error, type) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logCNS("ALERT_SKIP_OFFLINE", { error, type, band: "offline" });
      return;
    }

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("ALERT_NO_REMOTE_ENDPOINT", { error, type, band: "online" });
      return;
    }

    try {
      await remoteEndpoint.handle({
        type: "RouteDownAlert",
        payload: { error, type },
        context: CNS_CONTEXT
      });
      logCNS("ALERT_SENT", { type, band: "online" });
    } catch (err) {
      logCNS("ALERT_REMOTE_ERROR", {
        message: String(err),
        band: "online"
      });
    }
  }
};


// ============================================================================
// LOGGING ENTRY POINT — v11‑EVO‑BINARY‑MAX Dual‑Band
// ============================================================================
export async function logEvent(eventType, data) {
  const band = resolveBandFromPayload(data || {});
  const dnaTag = resolveDnaTagFromPayload(data || {});
  logCNS("LOG_EVENT", { eventType, band, dnaTag });

  const page =
    hasWindow && window.location
      ? window.location.pathname
      : null;

  if (RouterMemory && typeof RouterMemory.push === "function") {
    RouterMemory.push({
      eventType,
      data,
      page,
      band,
      dnaTag,
      timestamp: ++routerEventSeq
    });
  }

  logCNS("LOG_PUSHED", { eventType, band, dnaTag });

  await healRouterMemoryIfNeeded();

  if (typeof GateHeartbeat === "function") {
    GateHeartbeat();
    logCNS("GATE_HEARTBEAT_SIGNAL_SENT", { band, dnaTag });
  }
}


// ============================================================================
// ROUTER MEMORY HEALING — v11‑EVO‑BINARY‑MAX Dual‑Band Aware
// ============================================================================
async function healRouterMemoryIfNeeded() {
  if (!RouterMemory || typeof RouterMemory.getAll !== "function") {
    logCNS("HEAL_SKIP_NO_ROUTER_MEMORY");
    return;
  }

  const logs = RouterMemory.getAll();
  if (!logs || logs.length === 0) {
    logCNS("HEAL_SKIP_EMPTY");
    return;
  }

  logCNS("HEAL_REQUEST", { count: logs.length });

  try {
    const data = await Transport.callCheckRouterMemory(logs);

    if (data && Array.isArray(data.logs)) {
      if (typeof RouterMemory.replaceAll === "function") {
        RouterMemory.replaceAll(data.logs);
      } else {
        RouterMemory._logs = data.logs;
      }
      logCNS("HEAL_APPLIED", { count: data.logs.length });
    } else if (data === null) {
      logCNS("HEAL_OFFLINE_NO_REMOTE");
    } else {
      logCNS("HEAL_DEGRADED");
    }
  } catch (err) {
    logCNS("HEAL_ERROR", { message: String(err) });
  }
}


// ============================================================================
// ROUTE‑DOWN ALERT — v11‑EVO‑BINARY‑MAX Continuance‑First
// ============================================================================
async function triggerRouteDownAlert(error, type, band = "symbolic") {
  logCNS("ALERT_TRIGGER", { error, type, band });

  try {
    await Transport.callRouteDownAlert(error, type);
    logCNS("ALERT_SENT", { type, band });
  } catch (err) {
    logCNS("ALERT_ERROR", { message: String(err), band });
  }
}


// ============================================================================
// UNIVERSAL SYS‑CALL FUNCTION — CNS v11‑EVO‑BINARY‑MAX Dual‑Band
// ============================================================================
const ROUTE_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

const routingInProgressBands = new Set();

function resolveBandFromPayload(payload) {
  const band = payload && typeof payload.__band === "string"
    ? payload.__band.toLowerCase()
    : ROUTE_BANDS.SYMBOLIC;

  return band === ROUTE_BANDS.BINARY ? ROUTE_BANDS.BINARY : ROUTE_BANDS.SYMBOLIC;
}

function resolveDnaTagFromPayload(payload) {
  return payload && typeof payload.__dnaTag === "string"
    ? payload.__dnaTag
    : null;
}

function makeErrorSignature(err) {
  const msg = String(err);
  const stack = err?.stack || "";
  const top = stack.split("\n")[1] || "NO_FRAME";
  return msg + "::" + top.trim();
}

let routerEventSeq = 0;

export async function route(type, payload = {}) {
  const band = resolveBandFromPayload(payload);
  const dnaTag = resolveDnaTagFromPayload(payload);

  if (routingInProgressBands.has(band)) {
    return {
      error: "routeRecursionDetected",
      details: "Routing attempted while routing already in progress for this band",
      band
    };
  }

  routingInProgressBands.add(band);

  logCNS("ROUTE_CALL", { type, band, dnaTag });

  await logEvent("routeCall", { type, payload, band, dnaTag, ...CNS_CONTEXT });
  await healRouterMemoryIfNeeded();

  try {
    const json = await Transport.callEndpoint(type, payload);

    routeFailureCount = 0;
    routingInProgressBands.delete(band);

    logCNS("ROUTE_RESPONSE", { type, band, dnaTag });
    logEvent("routeResponse", { type, payload, json, band, dnaTag, ...CNS_CONTEXT });

    return json;

  } catch (err) {
    const msg = String(err);
    const signature = makeErrorSignature(err);

    routeFailureCount++;

    logCNS("ROUTE_ERROR", {
      type,
      message: msg,
      signature,
      count: routeFailureCount,
      band,
      dnaTag
    });

    logEvent("routeError", {
      type,
      payload,
      error: msg,
      signature,
      band,
      dnaTag,
      ...CNS_CONTEXT
    });

    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      routingInProgressBands.delete(band);
      return { error: "importConflict", details: msg, signature, band, dnaTag };
    }

    if (msg.includes("process is not defined")) {
      if (RouterMemory && typeof RouterMemory.push === "function") {
        RouterMemory.push({
          eventType: "frontendEnvMismatch",
          repairHint: "Replace process.env.* with window.PULSE_*",
          timestamp: ++routerEventSeq,
          signature,
          band,
          dnaTag
        });
      }
      routingInProgressBands.delete(band);
      return { error: "frontendEnvMismatch", details: msg, signature, band, dnaTag };
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      routingInProgressBands.delete(band);
      return { error: "routeRecursionLoop", details: msg, signature, band, dnaTag };
    }

    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (!offlineMode && routeFailureCount === 1) {
      logCNS("ROUTE_RETRY", { type, band, dnaTag });

      try {
        const retryJson = await Transport.callEndpoint(type, payload);

        routeFailureCount = 0;
        routingInProgressBands.delete(band);

        logCNS("ROUTE_RETRY_SUCCESS", { type, band, dnaTag });
        logEvent("routeRetrySuccess", {
          type,
          payload,
          retryJson,
          signature,
          band,
          dnaTag,
          ...CNS_CONTEXT
        });

        return retryJson;

      } catch (retryErr) {
        logCNS("ROUTE_RETRY_FAIL", {
          type,
          message: String(retryErr),
          signature,
          band,
          dnaTag
        });

        await triggerRouteDownAlert(String(retryErr), type, band);
        routeFailureCount = 0;
      }
    }

    routingInProgressBands.delete(band);
    return {
      error: "Frontend connector failed",
      details: msg,
      signature,
      band,
      dnaTag
    };
  }
}



// ============================================================================
// HEALING ENTRY POINT — v11‑EVO‑BINARY‑MAX Dual‑Band
// ============================================================================
export async function heal(type, payload) {
  const band = resolveBandFromPayload(payload || {});
  const dnaTag = resolveDnaTagFromPayload(payload || {});
  logCNS("HEAL_CALL", { type, band, dnaTag });

  logEvent("healingRequest", { type, payload, band, dnaTag, ...CNS_CONTEXT });

  return await route(type, payload);
}


// ============================================================================
// PUBLIC ORGAN SURFACE
// ============================================================================
export const PulseOSCNSNervousSystem = {
  PulseRole,
  meta: PulseOSCNSNervousSystemMeta,
  route,
  logEvent,
  heal
};

