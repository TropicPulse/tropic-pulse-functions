// ============================================================================
//  PULSE OS — PROOF VITALS MONITOR (v13-EVO-ALWAYS-ON-OFFLINE-FIRST)
//  “Organism Life Witness / Continuous Vitals / Offline-First Telemetry”
// ============================================================================
//
//  DESIGN:
//  - Always-on, never sleeps, never “turns off for a bit”.
//  - Logs every event it can see: impulses, routes, errors, drift, heartbeat.
//  - Offline-first: everything is logged locally via ProofLogger.
//  - Backend writes are OPTIONAL and ONLY occur when PULSE_ONLINE === true.
//  - No routing, no healing, no control, no mutation of other organs.
//  - Pure witness: if the organism dies, we SEE it.
//
// ============================================================================
console.log("Monitor");
import { log, warn, error } from "./PulseProofLogger.js";

const g =
  typeof global !== "undefined"
    ? global
    : typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : {};

const db = g.db || null;

// ============================================================================
//  ORGAN IDENTITY — v13-EVO-ALWAYS-ON-OFFLINE-FIRST
// ============================================================================

export const PulseRole = {
  type: "Organ",
  subsystem: "ProofLayer",
  layer: "ProofVitalsMonitor",
  version: "13.0-EVO-ALWAYS-ON-OFFLINE-FIRST",
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
    routerMemoryAware: true
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
//  ROUTE SCAN — READ-ONLY VISUALIZATION (NO CONTROL)
// ============================================================================

export function printRouteScan(route = {}) {
  console.groupCollapsed(
    "%c🔍 ROUTE SCAN — PulseOS v13-EVO-ALWAYS-ON-OFFLINE-FIRST",
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
//  ONLINE FLAG — OFFLINE-FIRST
// ============================================================================

function isOnline() {
  if (typeof window !== "undefined") {
    return window.PULSE_ONLINE === true;
  }
  if (typeof g.PULSE_ONLINE === "boolean") {
    return g.PULSE_ONLINE === true;
  }
  return false;
}

// ============================================================================
//  BACKEND METRICS — ONLY WHEN ONLINE, OTHERWISE LOCAL-ONLY
// ============================================================================

export async function updateUserMetrics(userId, data = {}) {
  // ALWAYS log locally (offline-first)
  log("vitals", `${ICON.update} update_local`, {
    userId: userId || "anonymous",
    ...data,
    band: "dual",
    binaryArtery: false
  });

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

  log("vitals", `${ICON.trust} trust_score`, {
    userId: metrics.userId ?? "?",
    score: final,
    band: "dual",
    binaryArtery: false
  });

  return final;
}

export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25)       phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else                      phase = 4;

  log("vitals", `${ICON.phase} phase`, {
    trustScore,
    phase,
    band: "dual",
    binaryArtery: false
  });

  return phase;
}

export function isHub(metrics) {
  if (!metrics) return false;

  const hub =
    (metrics.meshRelays || 0) > 50 ||
    (metrics.hubSignals || 0) > 20 ||
    (metrics.totalRequests || 0) > 500;

  if (hub) {
    warn("vitals", `${ICON.hub} hub_detected`, {
      userId: metrics.userId ?? "?",
      relays: metrics.meshRelays,
      hubSignals: metrics.hubSignals,
      totalRequests: metrics.totalRequests,
      band: "dual",
      binaryArtery: false
    });
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

  log("vitals", `${ICON.alloc} instance_allocation`, {
    phase,
    hubFlag,
    deviceTier,
    earnMode,
    testEarnActive,
    final,
    band: "dual",
    binaryArtery: false
  });

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
//  Every event that flows through these channels is logged.
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

    log("vitals", `${ICON.pulse} pulse`, payload);
  }

  function markOrganismDeath(reason) {
    if (!VitalsState.organismAlive) return;
    VitalsState.organismAlive = false;

    error("vitals", `${ICON.death} organism_death`, {
      reason,
      band: "dual",
      binaryArtery: false
    });

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

  meta: {
    layer:     PulseRole.layer,
    subsystem: PulseRole.subsystem,
    version:   PulseRole.version,
    identity:  PulseRole.identity
  }
};
