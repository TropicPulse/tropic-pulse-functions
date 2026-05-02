// ============================================================================
// FILE: /PULSE-OS/PulseOSCNSNervousSystem-v12.3-EVO-BINARY-MAX.js
// PULSE OS — v12.3‑EVO‑BINARY‑MAX
// “THE CENTRAL NERVOUS SYSTEM / COMMUNICATION INTELLIGENCE ORGAN”
//  • UPGRADED: CNS-level passive/active PageScanner integration (always-on, no timers)
//  • UPGRADED: v13+ CNS healers (checkBand / checkIdentity / checkRouterMemory)
// ============================================================================

export const PulseRole = {
  type: "NervousSystem",
  subsystem: "CNS",
  layer: "B-Layer",
  version: "12.3",
  identity: "PulseOSCNSNervousSystem-v12.3-EVO-BINARY-MAX",

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

    // Contracts — v12 organism‑wide
    routingContract: "PulseRouter-v12.3",
    proxyCompatibility: "PulseProxySpine-v12.3",
    sendCompatibility: "PulseSendSystem-v12.3",

    // Continuance / loop‑theory awareness
    loopTheoryAware: true,
    continuanceAware: true
  }
};

export const PulseOSCNSNervousSystemMeta = Object.freeze({
  layer: "PulseOSCNSNervousSystem",
  role: "CNS_COMMUNICATION_ORGAN",
  version: "v12.3-EVO-BINARY-MAX",
  identity: "PulseOSCNSNervousSystem-v12.3-EVO-BINARY-MAX",

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
    root: "PulseOS-v12-EVO",
    parent: "PulseOS-v12.3-EVO",
    ancestry: [
      "PulseOSCNSNervousSystem-v9",
      "PulseOSCNSNervousSystem-v10",
      "PulseOSCNSNervousSystem-v11",
      "PulseOSCNSNervousSystem-v11-EVO-BINARY",
      "PulseOSCNSNervousSystem-v12.0-EVO-BINARY"
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
// PageScannerV12: A1/A2 intelligence pack, used here as CNS-level passive/active scanner
import { PageScannerV12 } from "../../PULSE-UI/PULSEOSSkinReflex.js";

import checkBand from "../PULSE-PROXY/CheckBand-v11-Evo.js";
import checkIdentity from "../PULSE-PROXY/CheckIdentity-v11-Evo.js";
import checkRouterMemory from "../PULSE-PROXY/CheckRouterMemory-v11-Evo.js";


// ============================================================================
// CNS CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "CNS-LAYER";
const LAYER_NAME = "THE CENTRAL NERVOUS SYSTEM";
const LAYER_ROLE = "COMMUNICATION INTELLIGENCE ORGAN";
const LAYER_VER  = "12.3";

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
// CNS‑LEVEL PAGESCANNER BRIDGE — ALWAYS‑ON PASSIVE/ACTIVE SCANNER
//  • No timers, no loops, no polling
//  • Called on every route/log/heal/transport/alert/heal-memory event
//  • Uses PageScannerV12.buildDriftPacket as the intelligence core
// ============================================================================
const CNSPageScanner = {
  emit(event, context = {}) {
    try {
      if (!PageScannerV12 || typeof PageScannerV12.buildDriftPacket !== "function") {
        return;
      }

      const packet = PageScannerV12.buildDriftPacket({
        event,
        layer: "B-Layer",
        subsystem: "CNS",
        cnsIdentity: PulseOSCNSNervousSystemMeta.identity,
        ...context
      });

      if (
        hasWindow &&
        window.PageScannerAdapter &&
        typeof window.PageScannerAdapter.onEvent === "function"
      ) {
        window.PageScannerAdapter.onEvent(packet);
      }

      if (typeof packet.severity === "number") {
        logCNS("CNS_PAGESCANNER_EVENT", {
          event,
          severity: packet.severity,
          tooFar: !!packet.tooFar
        });
      }
    } catch {
      // Scanner must never break CNS
    }
  }
};


// ============================================================================
// ROUTE FAILURE STATE
// ============================================================================
let routeFailureCount = 0;


// ============================================================================
// CNS CONTEXT MAP — v12 dual‑band + binary‑aware
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
// CNS HEALING STATE — v13+
// ============================================================================
const CNS_HEALING = {
  lastBandCheck: null,
  lastIdentityCheck: null,
  lastRouterMemoryCheck: null,
  lastHealRequestCount: 0,
  lastHealAppliedCount: 0,
  lastHealError: null
};

function safeRun(label, fn) {
  try {
    const res = fn();
    return res === undefined ? { ok: true, surface: label } : res;
  } catch (err) {
    return { ok: false, error: String(err), surface: label };
  }
}


// ============================================================================
// TRANSPORT LAYER — OFFLINE + ONLINE (GUARDED GLOBALS, DUAL‑BAND)
//  • UPGRADED: every call emits CNSPageScanner events
//  • UPGRADED: router-memory healing uses local checkRouterMemory before remote
// ============================================================================
const Transport = {
  async callEndpoint(type, payload) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    // OFFLINE BAND — local‑first, no network
    if (offlineMode) {
      logCNS("TRANSPORT_OFFLINE_MODE", { type, band: "offline" });

      CNSPageScanner.emit("cns-transport-offline-call", {
        type,
        band: "offline",
        payloadShape: payload ? Object.keys(payload) : []
      });

      const localEndpoint =
        hasWindow && window.PulseLocalEndpoint &&
        typeof window.PulseLocalEndpoint.handle === "function"
          ? window.PulseLocalEndpoint
          : null;

      if (localEndpoint) {
        try {
          const result = await localEndpoint.handle({ type, payload, CNS_CONTEXT });
          logCNS("TRANSPORT_OFFLINE_RESPONSE", { type, band: "offline" });

          CNSPageScanner.emit("cns-transport-offline-response", {
            type,
            band: "offline"
          });

          return result;
        } catch (err) {
          const msg = String(err);
          logCNS("TRANSPORT_OFFLINE_ERROR", {
            type,
            band: "offline",
            message: msg
          });

          CNSPageScanner.emit("cns-transport-offline-error", {
            type,
            band: "offline",
            message: msg
          });

          return { error: "Offline local endpoint failed", details: msg };
        }
      }

      logCNS("TRANSPORT_OFFLINE_NO_HANDLER", { type, band: "offline" });

      CNSPageScanner.emit("cns-transport-offline-no-handler", {
        type,
        band: "offline"
      });

      return { error: "Offline mode: no local endpoint handler registered" };
    }

    // ONLINE BAND — local push to remote endpoint (brain/endpoint owns fetch)
    logCNS("TRANSPORT_ONLINE_CALL", { type, band: "online" });

    CNSPageScanner.emit("cns-transport-online-call", {
      type,
      band: "online",
      payloadShape: payload ? Object.keys(payload) : []
    });

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("TRANSPORT_ONLINE_NO_REMOTE_ENDPOINT", { type, band: "online" });

      CNSPageScanner.emit("cns-transport-online-no-remote", {
        type,
        band: "online"
      });

      return { error: "No remote endpoint handler registered for online band" };
    }

    try {
      const json = await remoteEndpoint.handle({ type, payload, context: CNS_CONTEXT });
      logCNS("TRANSPORT_ONLINE_RESPONSE", { type, band: "online" });

      CNSPageScanner.emit("cns-transport-online-response", {
        type,
        band: "online"
      });

      return json;
    } catch (err) {
      const msg = String(err);
      logCNS("TRANSPORT_ONLINE_ERROR", {
        type,
        band: "online",
        message: msg
      });

      CNSPageScanner.emit("cns-transport-online-error", {
        type,
        band: "online",
        message: msg
      });

      return { error: "Online remote endpoint failed", details: msg };
    }
  },

  async callCheckRouterMemory(logs) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    // v13+: always run local router-memory validator first
    CNS_HEALING.lastRouterMemoryCheck = safeRun("checkRouterMemory", () =>
      checkRouterMemory(logs)
    );

    if (offlineMode) {
      logCNS("HEAL_SKIP_OFFLINE", { count: logs.length, band: "offline" });

      CNSPageScanner.emit("cns-heal-skip-offline", {
        count: logs.length,
        band: "offline"
      });

      return null;
    }

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("HEAL_NO_REMOTE_ENDPOINT", { count: logs.length, band: "online" });

      CNSPageScanner.emit("cns-heal-no-remote", {
        count: logs.length,
        band: "online"
      });

      return null;
    }

    try {
      const data = await remoteEndpoint.handle({
        type: "CheckRouterMemory",
        payload: { logs },
        context: CNS_CONTEXT
      });

      CNSPageScanner.emit("cns-heal-remote-response", {
        count: logs.length,
        band: "online"
      });

      return data;
    } catch (err) {
      const msg = String(err);
      logCNS("HEAL_REMOTE_ERROR", {
        count: logs.length,
        band: "online",
        message: msg
      });

      CNSPageScanner.emit("cns-heal-remote-error", {
        count: logs.length,
        band: "online",
        message: msg
      });

      return null;
    }
  },

  async callRouteDownAlert(error, type) {
    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (offlineMode) {
      logCNS("ALERT_SKIP_OFFLINE", { error, type, band: "offline" });

      CNSPageScanner.emit("cns-alert-skip-offline", {
        error,
        type,
        band: "offline"
      });

      return;
    }

    const remoteEndpoint =
      hasWindow && window.PulseRemoteEndpoint &&
      typeof window.PulseRemoteEndpoint.handle === "function"
        ? window.PulseRemoteEndpoint
        : null;

    if (!remoteEndpoint) {
      logCNS("ALERT_NO_REMOTE_ENDPOINT", { error, type, band: "online" });

      CNSPageScanner.emit("cns-alert-no-remote", {
        error,
        type,
        band: "online"
      });

      return;
    }

    try {
      await remoteEndpoint.handle({
        type: "RouteDownAlert",
        payload: { error, type },
        context: CNS_CONTEXT
      });
      logCNS("ALERT_SENT", { type, band: "online" });

      CNSPageScanner.emit("cns-alert-sent", {
        error,
        type,
        band: "online"
      });
    } catch (err) {
      const msg = String(err);
      logCNS("ALERT_REMOTE_ERROR", {
        message: msg,
        band: "online"
      });

      CNSPageScanner.emit("cns-alert-remote-error", {
        error,
        type,
        band: "online",
        message: msg
      });
    }
  }
};


// ============================================================================
// UNIVERSAL SYS‑CALL FUNCTION — CNS v12.3‑EVO‑BINARY‑MAX Dual‑Band
//  • UPGRADED: every event runs band + identity healers once per push
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

export async function logEvent(eventType, data) {
  const band = resolveBandFromPayload(data || {});
  const dnaTag = resolveDnaTagFromPayload(data || {});
  logCNS("LOG_EVENT", { eventType, band, dnaTag });

  CNSPageScanner.emit("cns-log-event", {
    eventType,
    band,
    dnaTag
  });

  // v13+: CNS pre‑validation on every event (band + identity)
  CNS_HEALING.lastBandCheck = safeRun("checkBand", () => checkBand(band));
  CNS_HEALING.lastIdentityCheck = safeRun("checkIdentity", () =>
    checkIdentity({ phase: "logEvent", eventType, band, dnaTag })
  );

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

    CNSPageScanner.emit("cns-gate-heartbeat", {
      band,
      dnaTag
    });
  }
}


// ============================================================================
// ROUTER MEMORY HEALING — v12.3‑EVO‑BINARY‑MAX Dual‑Band Aware
//  • UPGRADED: tracks heal counts + errors in CNS_HEALING
// ============================================================================
async function healRouterMemoryIfNeeded() {
  if (!RouterMemory || typeof RouterMemory.getAll !== "function") {
    logCNS("HEAL_SKIP_NO_ROUTER_MEMORY");

    CNSPageScanner.emit("cns-heal-skip-no-router-memory", {});
    return;
  }

  const logs = RouterMemory.getAll();
  if (!logs || logs.length === 0) {
    logCNS("HEAL_SKIP_EMPTY");

    CNSPageScanner.emit("cns-heal-skip-empty", {});
    return;
  }

  CNS_HEALING.lastHealRequestCount = logs.length;

  logCNS("HEAL_REQUEST", { count: logs.length });

  CNSPageScanner.emit("cns-heal-request", {
    count: logs.length
  });

  try {
    const data = await Transport.callCheckRouterMemory(logs);

    if (data && Array.isArray(data.logs)) {
      if (typeof RouterMemory.replaceAll === "function") {
        RouterMemory.replaceAll(data.logs);
      } else {
        RouterMemory._logs = data.logs;
      }
      CNS_HEALING.lastHealAppliedCount = data.logs.length;

      logCNS("HEAL_APPLIED", { count: data.logs.length });

      CNSPageScanner.emit("cns-heal-applied", {
        count: data.logs.length
      });
    } else if (data === null) {
      logCNS("HEAL_OFFLINE_NO_REMOTE");

      CNSPageScanner.emit("cns-heal-offline-no-remote", {});
    } else {
      logCNS("HEAL_DEGRADED");

      CNSPageScanner.emit("cns-heal-degraded", {});
    }
  } catch (err) {
    const msg = String(err);
    CNS_HEALING.lastHealError = msg;

    logCNS("HEAL_ERROR", { message: msg });

    CNSPageScanner.emit("cns-heal-error", {
      message: msg
    });
  }
}


// ============================================================================
// ROUTE‑DOWN ALERT — v12.3‑EVO‑BINARY‑MAX Continuance‑First
//  • UPGRADED: records band/identity state at alert time
// ============================================================================
async function triggerRouteDownAlert(error, type, band = "symbolic") {
  // v13+: capture band + identity drift at alert time
  CNS_HEALING.lastBandCheck = safeRun("checkBand", () => checkBand(band));
  CNS_HEALING.lastIdentityCheck = safeRun("checkIdentity", () =>
    checkIdentity({ phase: "routeDownAlert", type, band, error })
  );

  logCNS("ALERT_TRIGGER", { error, type, band });

  CNSPageScanner.emit("cns-alert-trigger", {
    error,
    type,
    band
  });

  try {
    await Transport.callRouteDownAlert(error, type);
    logCNS("ALERT_SENT", { type, band });

    CNSPageScanner.emit("cns-alert-sent-final", {
      error,
      type,
      band
    });
  } catch (err) {
    const msg = String(err);
    logCNS("ALERT_ERROR", { message: msg, band });

    CNSPageScanner.emit("cns-alert-error", {
      error,
      type,
      band,
      message: msg
    });
  }
}


// ============================================================================
// ROUTE — CNS v12.3‑EVO‑BINARY‑MAX Dual‑Band
//  • UPGRADED: CNSPageScanner on call, response, error, retry
//  • UPGRADED: band + identity healers on route entry
// ============================================================================
export async function route(type, payload = {}) {
  const band = resolveBandFromPayload(payload);
  const dnaTag = resolveDnaTagFromPayload(payload);

  // v13+: CNS pre‑validation on route entry
  CNS_HEALING.lastBandCheck = safeRun("checkBand", () => checkBand(band));
  CNS_HEALING.lastIdentityCheck = safeRun("checkIdentity", () =>
    checkIdentity({ phase: "route", type, band, dnaTag })
  );

  if (routingInProgressBands.has(band)) {
    const result = {
      error: "routeRecursionDetected",
      details: "Routing attempted while routing already in progress for this band",
      band
    };

    CNSPageScanner.emit("cns-route-recursion-detected", {
      type,
      band,
      dnaTag
    });

    return result;
  }

  routingInProgressBands.add(band);

  logCNS("ROUTE_CALL", { type, band, dnaTag });

  CNSPageScanner.emit("cns-route-call", {
    type,
    band,
    dnaTag
  });

  await logEvent("routeCall", { type, payload, band, dnaTag, ...CNS_CONTEXT });
  await healRouterMemoryIfNeeded();

  try {
    const json = await Transport.callEndpoint(type, payload);

    routeFailureCount = 0;
    routingInProgressBands.delete(band);

    logCNS("ROUTE_RESPONSE", { type, band, dnaTag });
    logEvent("routeResponse", { type, payload, json, band, dnaTag, ...CNS_CONTEXT });

    CNSPageScanner.emit("cns-route-response", {
      type,
      band,
      dnaTag
    });

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

    CNSPageScanner.emit("cns-route-error", {
      type,
      band,
      dnaTag,
      message: msg,
      signature,
      count: routeFailureCount
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

      const result = { error: "importConflict", details: msg, signature, band, dnaTag };

      CNSPageScanner.emit("cns-route-import-conflict", {
        type,
        band,
        dnaTag,
        message: msg,
        signature
      });

      return result;
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

      const result = { error: "frontendEnvMismatch", details: msg, signature, band, dnaTag };

      CNSPageScanner.emit("cns-route-frontend-env-mismatch", {
        type,
        band,
        dnaTag,
        message: msg,
        signature
      });

      return result;
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      routingInProgressBands.delete(band);

      const result = { error: "routeRecursionLoop", details: msg, signature, band, dnaTag };

      CNSPageScanner.emit("cns-route-recursion-loop", {
        type,
        band,
        dnaTag,
        message: msg,
        signature
      });

      return result;
    }

    const offlineMode =
      hasWindow && window.PULSE_OFFLINE_MODE === true;

    if (!offlineMode && routeFailureCount === 1) {
      logCNS("ROUTE_RETRY", { type, band, dnaTag });

      CNSPageScanner.emit("cns-route-retry", {
        type,
        band,
        dnaTag,
        message: msg,
        signature
      });

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

        CNSPageScanner.emit("cns-route-retry-success", {
          type,
          band,
          dnaTag,
          signature
        });

        return retryJson;

      } catch (retryErr) {
        const retryMsg = String(retryErr);

        logCNS("ROUTE_RETRY_FAIL", {
          type,
          message: retryMsg,
          signature,
          band,
          dnaTag
        });

        CNSPageScanner.emit("cns-route-retry-fail", {
          type,
          band,
          dnaTag,
          message: retryMsg,
          signature
        });

        await triggerRouteDownAlert(retryMsg, type, band);
        routeFailureCount = 0;
      }
    }

    routingInProgressBands.delete(band);

    const result = {
      error: "Frontend connector failed",
      details: msg,
      signature,
      band,
      dnaTag
    };

    CNSPageScanner.emit("cns-route-failed-final", {
      type,
      band,
      dnaTag,
      message: msg,
      signature
    });

    return result;
  }
}


// ============================================================================
// HEALING ENTRY POINT — v12.3‑EVO‑BINARY‑MAX Dual‑Band
//  • UPGRADED: band + identity healers on heal entry
// ============================================================================
export async function heal(type, payload) {
  const band = resolveBandFromPayload(payload || {});
  const dnaTag = resolveDnaTagFromPayload(payload || {});
  logCNS("HEAL_CALL", { type, band, dnaTag });

  CNSPageScanner.emit("cns-heal-call", {
    type,
    band,
    dnaTag
  });

  // v13+: CNS pre‑validation on heal entry
  CNS_HEALING.lastBandCheck = safeRun("checkBand", () => checkBand(band));
  CNS_HEALING.lastIdentityCheck = safeRun("checkIdentity", () =>
    checkIdentity({ phase: "heal", type, band, dnaTag })
  );

  logEvent("healingRequest", { type, payload, band, dnaTag, ...CNS_CONTEXT });

  const result = await route(type, payload);

  CNSPageScanner.emit("cns-heal-result", {
    type,
    band,
    dnaTag
  });

  return result;
}


// ============================================================================
// CNS NERVOUS SYSTEM DIAGNOSTICS SURFACE
// ============================================================================
export function getCNSNervousSystemDiagnostics() {
  return { ...CNS_HEALING };
}


// ============================================================================
// PUBLIC ORGAN SURFACE
// ============================================================================
export const PulseOSCNSNervousSystem = {
  PulseRole,
  meta: PulseOSCNSNervousSystemMeta,
  route,
  logEvent,
  heal,
  getDiagnostics: getCNSNervousSystemDiagnostics
};
