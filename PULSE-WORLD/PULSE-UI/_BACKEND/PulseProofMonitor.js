// ============================================================================
//  PULSE OS — PROOF VITALS MONITOR (v14‑IMMORTAL‑OFFLINE‑FIRST)
//  “Organism Life Witness / Continuous Vitals / Offline-First Telemetry”
// ============================================================================
//
//  DESIGN:
//  - Always-on, never sleeps, never “turns off for a bit”.
//  - Logs every event it can see: impulses, routes, errors, drift, heartbeat.
//  - Offline-first: everything is logged locally via ProofLogger + LocalStorage.
//  - Backend writes are OPTIONAL and ONLY occur when PULSE_ONLINE === true.
//  - No routing, no healing, no control, no mutation of other organs.
//  - Pure witness: if the organism dies, we SEE it.
//
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseProofMonitor",
  version: "v14-IMMORTAL-OFFLINE-FIRST",
  layer: "frontend",
  role: "observer_monitor",
  lineage: "PulseOS-v14",

  evo: {
    binaryAware: true,
    dualBandAware: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    vitalsMonitor: true,
    passive: true,

    // v14 IMMORTAL
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,
    loggerAligned: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIFlow",
      "PulseUIErrors",
      "PulseProofLogger"
    ],
    never: [
      "legacyMonitor",
      "legacyVitals",
      "safeRoute",
      "fetchViaCNS",
      "legacyPresence",
      "legacyChunker",
      "legacyFlow"
    ]
  }
}
*/

console.log("Monitor");
import { log, warn, error } from "./PulseProofLogger.js";

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
// ============================================================================
//  ONLINE FLAG — OFFLINE-FIRST
// ============================================================================

function isOnline() {
  if (typeof window !== "undefined" && typeof window.PULSE_ONLINE === "boolean") {
    return window.PULSE_ONLINE === true;
  }
  if (typeof global.PULSE_ONLINE === "boolean") {
    return global.PULSE_ONLINE === true;
  }
  if (typeof globalThis.PULSE_ONLINE === "boolean") {
    return globalThis.PULSE_ONLINE === true;
  }
  if (typeof g.PULSE_ONLINE === "boolean") {
    return g.PULSE_ONLINE === true;
  }
  return false;
}


// ============================================================================
//  ORGAN IDENTITY — v14‑IMMORTAL‑OFFLINE‑FIRST
// ============================================================================

export const PulseRole = {
  type: "Organ",
  subsystem: "ProofLayer",
  layer: "ProofVitalsMonitor",
  version: "14.0-IMMORTAL-OFFLINE-FIRST",
  identity: "PulseProofVitalsMonitor",

  evo: {
    driftProof: true,
    deterministicVitals: true,
    zeroDriftAverages: true,

    backendOptional: true,      // works fully offline
    noRouting: true,
    noHealing: true,
    noOrgans: true,
    noControl: true,

    metricsOnly: true,
    binaryAware: true,
    dualBandAware: true,
    proxyTierAware: true,

    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true,

    alwaysOn: true,
    presenceAware: true,
    spinalAware: true,
    cnsAware: true,
    pageScannerAware: true,
    errorSpineAware: true,
    routerMemoryAware: true,

    // NEW IMMORTAL TRAITS
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true
  }
};

const PROOF_CONTEXT = {
  layer:   PulseRole.layer,
  role:    PulseRole.identity,
  version: PulseRole.version,
  lineage: "proof-core",
  evo:     PulseRole.evo
};

const VITALS_CONTEXT = {
  ...PROOF_CONTEXT,
  organ: "VitalsMonitor"
};

// ============================================================================
//  ICONS / GLYPHS — COSMETIC ONLY
// ============================================================================

const ICON = {
  update: "🩸",
  trust:  "🧪",
  phase:  "📊",
  hub:    "🛰️",
  alloc:  "⚙️",
  warn:   "⚠️",
  error:  "🟥",
  ok:     "🟢",
  pulse:  "💓",
  death:  "💀",
  route:  "🛰️",
  drift:  "🌊",
  spine:  "🧵",
  cns:    "🧠"
};

const HEALTH = {
  healthy:   "|",
  stable:    "|",
  degrading: "~",
  critical:  "X",
  unknown:   "?"
};

function makeHealthBar(status) {
  const sym = HEALTH[status] || HEALTH.unknown;

  switch (status) {
    case "healthy":   return `${sym} OK`;
    case "stable":    return `${sym} STABLE`;
    case "degrading": return `${sym} DEGRADED`;
    case "critical":  return `${sym} BROKEN`;
    default:          return `${sym} UNKNOWN`;
  }
}

// ============================================================================
//  LOCALSTORAGE VITALS BUFFER — IMMORTAL OFFLINE SURFACE
// ============================================================================

const VITALS_LS_KEY = "PulseVitals.v14.buffer";
const VITALS_LS_MAX_ENTRIES = 2000;

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__pulse_vitals_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function loadVitalsBuffer() {
  if (!isOnline()) return;
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(VITALS_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVitalsBuffer(buffer) {
  if (!isOnline()) return;
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buffer.length > VITALS_LS_MAX_ENTRIES
        ? buffer.slice(buffer.length - VITALS_LS_MAX_ENTRIES)
        : buffer;
    window.localStorage.setItem(VITALS_LS_KEY, JSON.stringify(trimmed));
  } catch {
    // never throw
  }
}

function appendVitalsEntry(kind, payload) {
  if (!isOnline()) return;
  const entry = {
    ts: Date.now(),
    kind,
    payload,
    context: {
      layer: VITALS_CONTEXT.layer,
      organ: VITALS_CONTEXT.organ,
      version: VITALS_CONTEXT.version
    }
  };

  const buffer = loadVitalsBuffer();
  buffer.push(entry);
  saveVitalsBuffer(buffer);
}

export const PulseVitalsStore = {
  getAll() {
    return loadVitalsBuffer();
  },
  clear() {
    saveVitalsBuffer([]);
  },
  tail(n = 200) {
    const buf = loadVitalsBuffer();
    if (n <= 0) return [];
    return buf.slice(Math.max(0, buf.length - n));
  }
};

// ============================================================================
//  ROUTE SCAN — READ-ONLY VISUALIZATION (NO CONTROL)
// ============================================================================

export function printRouteScan(route = {}) {
  console.groupCollapsed(
    "%c🔍 ROUTE SCAN — PulseOS v14‑IMMORTAL‑OFFLINE‑FIRST",
    "color:#03A9F4; font-weight:bold;"
  );

  const nodes = [
    ["Brain",     "🧠", route.brain,    "#7C4DFF"],
    ["Synapse",   "⚡", route.synapse,  "#42A5F5"],
    ["Spine",     "🧵", route.spine,    "#26A69A"],
    ["Heart",     "🫀", route.heart,    "#E53935"],
    ["PulseBand", "📡", route.band,     "#EC407A"],
    ["Router",    "🛰️", route.router,   "#26C6DA"],
    ["Proxy",     "🌐", route.proxy,    "#29B6F6"],
    ["Vitals",    "🩸", route.vitals,   "#FF7043"],
    ["History",   "📜", route.history,  "#BDBDBD"],
    ["Purifier",  "🧹", route.purifier, "#8D6E63"]
  ];

  for (const [name, icon, status, color] of nodes) {
    const bar = makeHealthBar(status || "unknown");
    console.log(
      `%c${icon}  ${name.padEnd(14)} → ${bar}`,
      `color:${color}; font-weight:bold;`
    );
  }

  console.groupEnd();
}

// ============================================================================
//  CONSTANTS / CONFIG
// ============================================================================

export const NORMAL_MAX     = 4;
export const UPGRADED_MAX   = 8;
export const HIGHEND_MAX    = 8;
export const TEST_EARN_MAX  = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_PERFORMANCE_LOGGING = true;
export const PERFORMANCE_LOG_COLLECTION = "UserPerformanceLogs";

// ============================================================================
//  BACKEND METRICS — ONLY WHEN ONLINE, OTHERWISE LOCAL-ONLY
// ============================================================================

export async function updateUserMetrics(userId, data = {}) {
  if (!isOnline()) return;
  const uid = userId || "anonymous";

  // ALWAYS log locally (offline-first)
  const localPayload = {
    userId: uid,
    ...data,
    band: "dual",
    binaryArtery: false
  };

  log("vitals", `${ICON.update} update_local`, localPayload);
  appendVitalsEntry("metrics_update", localPayload);

  // Only mirror to backend when explicitly online and db present
  if (!db) return;
  if (!isOnline()) return;
  if (!userId || userId === "anonymous") return;

  const payload = {
    userId,
    bytes: data.bytes ?? 0,
    durationMs: data.durationMs ?? 0,
    meshRelay: !!data.meshRelay,
    meshPing: !!data.meshPing,
    hubFlag: !!data.hubFlag,
    band: "dual",
    binaryArtery: false
  };

  const ref = db.collection("UserMetrics").doc(userId);
  const now = Date.now(); // observation time only

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const existing = snap.exists ? snap.data() : {};

      const totalRequests = (existing.totalRequests || 0) + 1;
      const totalBytes    = (existing.totalBytes || 0) + (data.bytes || 0);

      let avgLatency = existing.avgLatency || 0;
      if (data.durationMs != null) {
        if (!existing.totalRequests) {
          avgLatency = data.durationMs;
        } else {
          avgLatency =
            (avgLatency * existing.totalRequests + data.durationMs) /
            totalRequests;
        }
      }

      const meshRelays     = (existing.meshRelays || 0) + (data.meshRelay ? 1 : 0);
      const meshPings      = (existing.meshPings || 0) + (data.meshPing ? 1 : 0);
      const hubSignals     = (existing.hubSignals || 0) + (data.hubFlag ? 1 : 0);
      const stabilityScore = existing.stabilityScore || 0;

      tx.set(
        ref,
        {
          userId,
          totalRequests,
          totalBytes,
          avgLatency,
          meshRelays,
          meshPings,
          hubSignals,
          stabilityScore,
          lastSeen: now,
          updatedAt: now
        },
        { merge: true }
      );
    });
  } catch (err) {
    error("vitals", `${ICON.error} metrics_update_failed`, {
      error: String(err),
      band: "dual",
      binaryArtery: false
    });
  }

  if (ENABLE_PERFORMANCE_LOGGING) {
    try {
      await db.collection(PERFORMANCE_LOG_COLLECTION).add({
        ...VITALS_CONTEXT,
        userId,
        ts: Date.now(), // observation time only
        bytes: data.bytes ?? null,
        durationMs: data.durationMs ?? null,
        meshRelay: data.meshRelay ?? false,
        meshPing: data.meshPing ?? false,
        hubFlag: data.hubFlag ?? false
      });

      log("vitals", `${ICON.ok} snapshot_logged_remote`, {
        userId,
        band: "dual",
        binaryArtery: false
      });
    } catch (err) {
      error("vitals", `${ICON.error} snapshot_failed_remote`, {
        error: String(err),
        band: "dual",
        binaryArtery: false
      });
    }
  }
}

// ============================================================================
//  PURE FUNCTIONS — TRUST / PHASE / HUB / ALLOCATION
// ============================================================================

export function calculateTrustScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  score += Math.min((metrics.totalRequests || 0) / 100, 20);
  score += Math.min((metrics.meshRelays || 0) / 10, 20);
  score += Math.min((metrics.hubSignals || 0) / 5, 20);

  if (metrics.avgLatency && metrics.avgLatency < 150) score += 20;

  score += metrics.stabilityScore || 0;

  const final = Math.min(score, 100);

  const payload = {
    userId: metrics.userId ?? "?",
    score: final,
    band: "dual",
    binaryArtery: false
  };

  log("vitals", `${ICON.trust} trust_score`, payload);
  appendVitalsEntry("trust_score", payload);

  return final;
}

export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25)       phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else                      phase = 4;

  const payload = {
    trustScore,
    phase,
    band: "dual",
    binaryArtery: false
  };

  log("vitals", `${ICON.phase} phase`, payload);
  appendVitalsEntry("phase", payload);

  return phase;
}

export function isHub(metrics) {
  if (!metrics) return false;

  const hub =
    (metrics.meshRelays || 0) > 50 ||
    (metrics.hubSignals || 0) > 20 ||
    (metrics.totalRequests || 0) > 500;

  if (hub) {
    const payload = {
      userId: metrics.userId ?? "?",
      relays: metrics.meshRelays,
      hubSignals: metrics.hubSignals,
      totalRequests: metrics.totalRequests,
      band: "dual",
      binaryArtery: false
    };

    warn("vitals", `${ICON.hub} hub_detected`, payload);
    appendVitalsEntry("hub_detected", payload);
  }

  return hub;
}

export function allocateInstances(
  phase,
  hubFlag,
  deviceTier,
  earnMode,
  testEarnActive
) {
  if (!isOnline()) return;
  let base = phase >= 2 ? 2 : 1;

  if (hubFlag) base *= 2;
  if (deviceTier === "upgraded") base *= UPGRADED_MULT;
  if (deviceTier === "highend")  base *= HIGHEND_MULT;
  if (earnMode) base = Math.floor(base * EARN_MODE_MULT);
  if (testEarnActive) base = TEST_EARN_MAX;

  const max =
    testEarnActive
      ? TEST_EARN_MAX
      : deviceTier === "upgraded"
      ? UPGRADED_MAX
      : deviceTier === "highend"
      ? HIGHEND_MAX
      : NORMAL_MAX;

  const final = Math.max(1, Math.min(base, max));

  const payload = {
    phase,
    hubFlag,
    deviceTier,
    earnMode,
    testEarnActive,
    final,
    band: "dual",
    binaryArtery: false
  };

  log("vitals", `${ICON.alloc} instance_allocation`, payload);
  appendVitalsEntry("instance_allocation", payload);

  return final;
}

// ============================================================================
//  ALWAYS-ON ORGANISM VITALS — ATTACHMENT SURFACE
// ============================================================================
//
//  attachVitalsMonitor({
//    EventBus,        // emits spinal/cns/heartbeat/etc
//    RouterMemory,    // optional: RouterMemory surface
//    PageScanner,     // optional: PageScannerAdapter or intel emitter
//    ErrorSpine,      // optional: PulseUIErrors or similar
//    getCurrentUserId // optional: function returning current user id
//  })
//
//  No timers. No polling. Purely event-driven.
//  Every event that flows through these channels is logged + mirrored.
// ============================================================================

function safeGroup(label, fn) {
  try {
    if (typeof console !== "undefined" && console.groupCollapsed) {
      console.groupCollapsed(label);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  } catch {
    // never throw
  }
}

export function attachVitalsMonitor({
  EventBus,
  RouterMemory,
  PageScanner,
  ErrorSpine,
  getCurrentUserId
} = {}) {
  const VitalsState = {
    lastImpulseSeq: 0,
    lastRouteSeq: 0,
    lastHeartbeatSeq: 0,
    lastDriftSeq: 0,
    lastErrorSeq: 0,
    organismAlive: true
  };

  function currentUserId() {
    try {
      return typeof getCurrentUserId === "function"
        ? getCurrentUserId() || "anonymous"
        : "anonymous";
    } catch {
      return "anonymous";
    }
  }

  function markPulse(kind, details = {}) {
    const payload = {
      kind,
      ts: Date.now(), // observation time only
      userId: currentUserId(),
      ...details
    };

    // ALWAYS mirrored to LocalStorage via vitals store
    log("vitals", `${ICON.pulse} pulse`, payload);
    appendVitalsEntry("pulse", payload);
  }

  function markOrganismDeath(reason) {
    if (!VitalsState.organismAlive) return;
    VitalsState.organismAlive = false;

    const payload = {
      reason,
      band: "dual",
      binaryArtery: false
    };

    error("vitals", `${ICON.death} organism_death`, payload);
    appendVitalsEntry("organism_death", payload);

    safeGroup("%c💀 ORGANISM DEATH DETECTED", () => {
      console.log("Reason:", reason);
      console.log("VitalsState:", VitalsState);
    });
  }

  // Spinal impulses / CNS routes / heartbeat / any EventBus events
  if (EventBus && typeof EventBus.on === "function") {
    EventBus.on("spinal:impulse", (evt) => {
      VitalsState.lastImpulseSeq += 1;
      markPulse("spinalImpulse", {
        seq: VitalsState.lastImpulseSeq,
        source: evt?.source || "unknown",
        modeKind: evt?.modeKind || "symbolic"
      });
    });

    EventBus.on("cns:route", (evt) => {
      VitalsState.lastRouteSeq += 1;
      markPulse("cnsRoute", {
        seq: VitalsState.lastRouteSeq,
        type: evt?.type || "unknown",
        band: evt?.band || "symbolic"
      });
    });

    EventBus.on("heartbeat", (evt) => {
      VitalsState.lastHeartbeatSeq += 1;
      markPulse("heartbeat", {
        seq: VitalsState.lastHeartbeatSeq,
        source: evt?.source || "unknown"
      });
    });

    EventBus.on("organism:death", (evt) => {
      markOrganismDeath(evt?.reason || "unknown");
    });
  }

  // RouterMemory snapshot (read-only)
  if (RouterMemory && typeof RouterMemory.getAll === "function") {
    try {
      const logs = RouterMemory.getAll() || [];
      if (logs.length > 0) {
        safeGroup("%c🩸 ROUTER MEMORY SNAPSHOT", () => {
          console.log("count:", logs.length);
        });
        markPulse("routerMemorySnapshot", { count: logs.length });
      }
    } catch {
      // never throw
    }
  }

  // PageScanner drift intel
  if (PageScanner && typeof PageScanner.onEvent === "function") {
    const original = PageScanner.onEvent;
    PageScanner.onEvent = function patched(packet) {
      VitalsState.lastDriftSeq += 1;

      markPulse("pageScannerDrift", {
        seq: VitalsState.lastDriftSeq,
        severity: packet?.severity ?? 0,
        tooFar: !!packet?.tooFar
      });

      return original.call(PageScanner, packet);
    };
  }

  // Error spine
  if (ErrorSpine && typeof ErrorSpine.on === "function") {
    ErrorSpine.on("error", (evt) => {
      VitalsState.lastErrorSeq += 1;
      markPulse("errorSpine", {
        seq: VitalsState.lastErrorSeq,
        message: String(evt?.message || evt || "unknown")
      });
    });
  }

  // Frontend global error hook
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("error", (event) => {
      VitalsState.lastErrorSeq += 1;
      markPulse("windowError", {
        seq: VitalsState.lastErrorSeq,
        message: event?.message || "unknown"
      });
    });
  }

  log("vitals", `${ICON.ok} monitor_attached`, {
    band: "dual",
    binaryArtery: false
  });
  appendVitalsEntry("monitor_attached", {
    ts: Date.now(),
    band: "dual",
    binaryArtery: false
  });

  return {
    PulseRole,
    VitalsState
  };
}

// ============================================================================
//  EXPORT — VITALS MONITOR SURFACE
// ============================================================================

export const VitalsMonitor = {
  PulseRole,

  updateUserMetrics,
  calculateTrustScore,
  calculatePhase,
  isHub,
  allocateInstances,

  printRouteScan,
  attachVitalsMonitor,

  NORMAL_MAX,
  UPGRADED_MAX,
  HIGHEND_MAX,
  TEST_EARN_MAX,
  UPGRADED_MULT,
  HIGHEND_MULT,
  EARN_MODE_MULT,
  ENABLE_PERFORMANCE_LOGGING,
  PERFORMANCE_LOG_COLLECTION,

  PulseVitalsStore,

  meta: {
    layer:     PulseRole.layer,
    subsystem: PulseRole.subsystem,
    version:   PulseRole.version,
    identity:  PulseRole.identity
  }
};

// ============================================================================
//  GLOBAL BINDING FOR VITALS STORE (OPTIONAL, MODE-AGNOSTIC UI HOOK)
// ============================================================================

try {
  if (typeof global !== "undefined") {
    global.PulseVitalsStore = PulseVitalsStore;
    global.VitalsMonitor = VitalsMonitor;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseVitalsStore = PulseVitalsStore;
    globalThis.VitalsMonitor = VitalsMonitor;
  }
  if (typeof window !== "undefined") {
    window.PulseVitalsStore = PulseVitalsStore;
    window.VitalsMonitor = VitalsMonitor;
  }
  if (typeof g !== "undefined") {
    g.PulseVitalsStore = PulseVitalsStore;
    g.VitalsMonitor = VitalsMonitor;
  }
} catch {
  // never throw
}
