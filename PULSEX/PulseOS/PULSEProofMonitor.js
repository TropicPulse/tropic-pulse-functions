// ============================================================================
//  PULSE OS — PROOF MONITOR (v11)
//  “Verification Layer / Proof-of-Evolution / Stability Witness / Load Auditor”
//
//  METAPHOR:
//  - This organ is the organism’s PROOF OF LIFE MONITOR.
//  - It verifies that the organism is alive, stable, and evolving under load.
//  - It does NOT heal, route, compute, or influence the organism.
//  - It simply measures and confirms.
//
//  - ProofMonitor = the external witness that validates:
//        • our evolution is real
//        • our stability is measurable
//        • our performance is observable
//        • our growth is trackable
//        • our routing pathways are healthy
//
//  - It sits beside Understanding and ProofLogger in the TOP LAYER,
//    forming the “Visibility → Contact → Verification → Evidence” chain.
//
//  - Outsiders can SEE our evolution through the Window,
//    they can MEET us through Understanding,
//    they can VERIFY us through ProofMonitor,
//    and they can TRUST us because ProofLogger records the proof.
//
//  - Pure measurement. Pure verification. Pure proof.
//  - Zero routing. Zero healing. Zero mutation. Zero influence.
// ============================================================================


// ============================================================================
// FILE: /apps/PulseOS/Surface/PulseProofMonitor.js
// PULSE PROOF MONITOR — v11‑EVO‑BINARY‑MAX
// VITALS TELEMETRY • READ‑ONLY METRICS • BINARY‑FIRST AWARE • NO MIDDLEMEN
// ============================================================================
//
// ROLE (SURFACE VITALS LAYER):
// ----------------------------
//  - Read‑only vitals monitor for the organism.
//  - Observes traffic, pressure, and stability — NEVER controls it.
//  - No routing, no identity, no evolution, no organ mutation.
//  - Pure telemetry: bytes, latency, mesh relays, hub signals, stability.
//
// BINARY INTENT (v11‑EVO‑BINARY‑MAX):
// -----------------------------------
//  - Binary organism is primary; this layer only WATCHES its behavior.
//  - Metrics are advisory, not authoritative — they never steer the core.
//  - All calculations are deterministic, replayable, and loggable.
//  - No randomness, no async nervous system, no hidden timers.
//
// CONTRACT:
// ---------
//  - Never throw (universal resolver + defensive guards).
//  - Never mutate external inputs.
//  - Never synthesize “truth” about the organism — only record observations.
//  - Firestore timestamps (Date.now) are allowed as OBSERVATION TIME ONLY,
//    not as organism time or contract time.
//  - No routing, no identity, no organ imports.
// ============================================================================


// ============================================================================
//  UNIVERSAL GLOBAL RESOLVER — NEVER THROWS
//  - Works in backend Node, browser, or test harness.
//  - db is ONLY valid on backend; front‑layer calls become no‑ops.
// ============================================================================
const g =
  typeof global !== "undefined"
    ? global
    : typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : {};

// Backend‑only globals (db only exists on backend)
const db    = g.db    || null;
const log   = g.log   || console.log;
const warn  = g.warn  || console.warn;
const error = g.error || console.error;


// ============================================================================
//  ORGAN IDENTITY — v11‑EVO‑BINARY‑MAX
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "ProofLayer",
  layer: "ProofMonitor",
  version: "11.0",
  identity: "PulseProofMonitor",

  evo: {
    driftProof: true,
    deterministicVitals: true,
    zeroDriftAverages: true,

    backendOnly: true,          // Only meaningful when db is present
    noIQ: true,                 // No design brain here
    noRouting: true,            // No router control
    noIdentity: true,           // No identity control
    noOrgans: true,             // No organ imports

    metricsOnly: true,          // Pure telemetry, no actuation
    binaryAware: true,          // Knows about binary organism, never controls it
    dualBandAware: true,        // Aware of text + binary, but only as metrics
    proxyTierAware: true,       // Can log which proxy tier was used

    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true
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
//  ICONS / GLYPHS — PURELY COSMETIC (NO LOGIC)
// ============================================================================
const ICON = {
  update: "🩸",
  trust:  "🧪",
  phase:  "📊",
  hub:    "🛰️",
  alloc:  "⚙️",
  warn:   "⚠️",
  error:  "🟥",
  ok:     "🟢"
};

const ORG = {
  brain:    "🧠",
  synapse:  "⚡",
  spine:    "🧵",
  heart:    "🫀",
  band:     "📡",
  router:   "🛰️",
  proxy:    "🌐",
  vitals:   "🩸",
  history:  "📜",
  purifier: "🧹",
  unknown:  "⬡"
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

function renderRouteNode(name, icon, status, color) {
  const bar = makeHealthBar(status);
  console.log(
    `%c${icon}  ${name.padEnd(14)} → ${bar}`,
    `color:${color}; font-weight:bold;`
  );
}


// ============================================================================
//  ROUTE SCAN — READ‑ONLY VISUALIZATION (NO CONTROL)
// ============================================================================
export function printRouteScan(route = {}) {
  console.groupCollapsed(
    "%c🔍 ROUTE SCAN — PulseOS v11‑EVO‑BINARY‑MAX",
    "color:#03A9F4; font-weight:bold;"
  );

  renderRouteNode("Brain",     ORG.brain,    route.brain,    "#7C4DFF");
  renderRouteNode("Synapse",   ORG.synapse,  route.synapse,  "#42A5F5");
  renderRouteNode("Spine",     ORG.spine,    route.spine,    "#26A69A");
  renderRouteNode("Heart",     ORG.heart,    route.heart,    "#E53935");
  renderRouteNode("PulseBand", ORG.band,     route.band,     "#EC407A");
  renderRouteNode("Router",    ORG.router,   route.router,   "#26C6DA");
  renderRouteNode("Proxy",     ORG.proxy,    route.proxy,    "#29B6F6");
  renderRouteNode("Vitals",    ORG.vitals,   route.vitals,   "#FF7043");
  renderRouteNode("History",   ORG.history,  route.history,  "#BDBDBD");
  renderRouteNode("Purifier",  ORG.purifier, route.purifier, "#8D6E63");

  console.groupEnd();
}


// ============================================================================
//  INSTANCE LIMIT HINTS — ADVISORY ONLY (NO HARD LAW)
//  - These are hints for CheckBand / orchestrators.
//  - They do NOT directly control the organism here.
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
//  updateUserMetrics — BACKEND‑ONLY VITALS UPDATE
//  - No db → silent no‑op.
//  - Uses Date.now ONLY as observation timestamps, not organism time.
// ============================================================================
export async function updateUserMetrics(userId, data = {}) {
  if (!db) return;
  if (!userId || userId === "anonymous") return;

  log(
    "vitals",
    `${ICON.update} update`,
    {
      userId,
      bytes: data.bytes ?? 0,
      durationMs: data.durationMs ?? 0,
      meshRelay: !!data.meshRelay,
      meshPing: !!data.meshPing,
      hubFlag: !!data.hubFlag
    }
  );

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
    error("vitals", `${ICON.error} metrics_update_failed`, { error: String(err) });
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

      log("vitals", `${ICON.ok} snapshot_logged`, { userId });
    } catch (err) {
      error("vitals", `${ICON.error} snapshot_failed`, { error: String(err) });
    }
  }
}


// ============================================================================
//  TRUST SCORE — PURE FUNCTION, DETERMINISTIC
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
    score: final
  });

  return final;
}


// ============================================================================
//  PHASE CALCULATION — PURE FUNCTION, DETERMINISTIC
// ============================================================================
export function calculatePhase(trustScore) {
  let phase = 1;

  if (trustScore < 25)       phase = 1;
  else if (trustScore < 50) phase = 2;
  else if (trustScore < 75) phase = 3;
  else                      phase = 4;

  log("vitals", `${ICON.phase} phase`, { trustScore, phase });

  return phase;
}


// ============================================================================
//  HUB DETECTION — PURE OBSERVATION, NO CONTROL
// ============================================================================
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
      totalRequests: metrics.totalRequests
    });
  }

  return hub;
}


// ============================================================================
//  INSTANCE ALLOCATION HINT — ADVISORY ONLY
//  - This does NOT directly spin workers here.
//  - CheckBand / backend orchestrators consume this as a hint.
// ============================================================================
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
    final
  });

  return final;
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
