// ============================================================================
//  FILE: /PULSE-PROXY/PulseProxySpine-v12.3-EVO.js
//  PULSE OS v12.3-EVO — PULSE PROXY SPINE (BACKEND SPINE)
//  Unified TPProxy Gateway • Vitals Pump • OS‑Healer Feed
//  SYMBOLIC BACKEND ORGAN — NO BUSINESS LOGIC, NO MARKETPLACE.
//  PRESENCE/HARMONICS/DUAL-BAND AWARE (PASSIVE + FORWARD)
// ============================================================================
//
//  WHAT THIS ORGAN IS (v12.3-EVO):
//  -------------------------------
//  • The Backend Spine of PulseProxy for the organism.
//  • Single ingress spine for TPProxy traffic, vitals, and OS‑healer feeds.
//  • Maintains an OS‑visible healingState for PulseProxyHealer / GlobalHealer.
//  • Owns Redis + mailer wiring, but never business logic or scoring.
//  • Fail‑open by design: degraded modes are logged, never fatal.
//  • Symbolic‑only, but dual‑band compatible and presence/harmonics aware
//    as passive metadata (no routing intelligence).
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • NOT a router brain (no dynamic routing intelligence).
//  • NOT a marketplace engine or pricing layer.
//  • NOT a scoring / ranking engine.
//  • NOT a business rules engine.
//  • NOT a place for OSKernel logic or GPU logic.
//  • NOT a binary organ — this is a symbolic backend spine only.
//
//  SAFETY CONTRACT (v12.3-EVO):
//  ----------------------------
//  • Fail‑open: Redis / mailer / env failures degrade, never crash the process.
//  • No IQ, no routing intelligence, no marketplace logic.
//  • No mutation outside healingState + explicit global boot flags.
//  • Deterministic boot guards (single‑boot, idempotent).
//  • Drift‑proof identity + context via PROXY_CONTEXT.
//  • Multi‑instance safe: no singleton assumptions beyond process‑local flags.
//  • Presence/harmonics/dual‑band are surfaced as metadata only.
// ============================================================================


const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ============================================================================
//  SPINE IDENTITY — v12.3-EVO (symbolic backend only, no binary partner)
// ============================================================================

export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "BackendSpine",
  version: "12.3-EVO",
  identity: "PulseProxySpine-v12.3-EVO",

  evo: {
    deterministic: true,
    driftProof: true,
    backendOnly: true,
    symbolicBackend: true,

    // 12.3-EVO additions (passive only)
    presenceAware: true,          // read-only presence metadata
    harmonicsAware: true,         // read-only harmonic metadata
    dualBandCompatible: true,     // symbolic-only, no binary routing
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,
    passiveForwarding: true,

    // unchanged guarantees
    dualModeEvolution: false,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  HUMAN‑READABLE CONTEXT MAP — Spine Identity (v12.3-EVO)
// ============================================================================

const PROXY_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  purpose:
    "Route traffic, expose vitals, protect user by failing open, feed OS healers",
  context:
    "Unified TPProxy gateway + vitals pump for OS-level healers and admin dashboards",
  version: PulseRole.version,
  target: "proxy-core",
  selfRepairable: true,
  evo: PulseRole.evo
};

export const PulseProxySpineMeta = Object.freeze({
  layer: "PulseProxySpine",
  role: "BACKEND_SPINE_ORGAN",
  version: "v12.3-EVO",
  identity: "PulseProxySpine-v12.3-EVO",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    backendOnly: true,
    symbolicBackend: true,
    dualModeEvolution: false,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: true,
    organismClusterBoost: true,
    cognitiveComputeLink: true,
    failOpenSafe: true,

    // 12.3-EVO additions
    presenceAware: true,
    harmonicsAware: true,
    dualBandCompatible: true,
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,
    passiveForwarding: true,

    // Execution prohibitions
    zeroIQ: true,
    zeroRouting: true,
    zeroMarketplace: true,
    zeroScoring: true,
    zeroBusinessLogic: true,
    zeroOSKernelLogic: true,
    zeroGPULogic: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroNetworkMutation: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroGPU: true,

    // Awareness
    symbolicAware: true,
    binaryAware: false,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: false,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "TPProxyRequest",
      "VitalsSnapshot",
      "HealerContext",
      "BackendContext",
      "PresenceBandState",
      "HarmonicSnapshot"
    ],
    output: [
      "SpineIngressResult",
      "SpineBandSignature",
      "SpineWaveField",
      "SpineDiagnostics",
      "SpineHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "PulseProxySpine-v7",
      "PulseProxySpine-v8",
      "PulseProxySpine-v9",
      "PulseProxySpine-v10",
      "PulseProxySpine-v11",
      "PulseProxySpine-v11.1",
      "PulseProxySpine-v11-Evo",
      "PulseProxySpine-v11.2-EVO-BINARY-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic"],
    default: "symbolic",
    behavior: "backend-spine"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "TPProxy ingress → vitals pump → OS-healer feed",
    adaptive: "wave-field overlays (no binary mode)",
    return: "deterministic spine surfaces + signatures"
  })
});

log(
  "%c🟦 PulseProxySpine v12.3-EVO online — backend spine + vitals pump active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  HEALING METADATA — OS-visible heartbeat for PulseProxyHealer (v12.3-EVO)
// ============================================================================

const healingState = {
  ...PROXY_CONTEXT,
  lastRequestTs: null,
  lastError: null,
  lastProxyError: null,
  lastRedisError: null,
  lastEmailError: null,
  lastWarmConnection: null,
  lastRateLimitDecision: null,
  lastTPProxyCall: null,
  lastHealthCheck: null,
  lastMetricsCheck: null,
  lastNodeCheck: null,
  lastPingCheck: null,
  cycleCount: 0,
  status: "healthy",
  mode: "online",

  // 12.3-EVO passive band metadata
  pulsePrewarm: null,
  pulseCacheMode: null,
  pulseChunkMode: null,
  pulseRemember: null,

  presenceBandState: null,
  harmonicDrift: null,
  coherenceScore: null,

  dualBandMode: "symbolic"
};

export function getSpineHealingState() {
  return { ...healingState };
}

// ============================================================================
//  DOWNSTREAM ORGANS — Packet Engine, Metrics, OS‑level organs
// ============================================================================

import { createPulseEarnSendSystem } from "../PULSE-EARN/PulseEarnSendSystem.js";


import { updateUserMetrics as recordUserMetrics } from "../PulseProofMonitor.js";

import startPulseTimer from "./PulseProxyHeart.js";
import { createPulseOSHealerV12_3 as startPulseOSHealer } from "../PULSE-OS/PulseOSInflammatoryResponse.js";
import { createGlobalHealerV12 as startGlobalHealer} from "../PULSE-OS/PulseOSImmuneSystem.js";

// ============================================================================
//  SINGLE‑BOOT GUARDS — v12.3-EVO (unchanged behavior)
// ============================================================================

if (!global.__pulseTimerStarted) {
  log("%c[SPINE BOOT] Starting Pulse Timer loop…", "color:#9C27B0; font-weight:bold;");
  startPulseTimer();
  global.__pulseTimerStarted = true;
}

if (!global.__pulseOSStarted) {
  log("%c[SPINE BOOT] Starting PulseOS (global supervisor / brainstem)…", "color:#4CAF50; font-weight:bold;");
  startPulseOS();
  global.__pulseOSStarted = true;
}

if (!global.__pulseOSHealerStarted) {
  log("%c[SPINE BOOT] Starting PulseOSHealer (OS-level immune scan)…", "color:#4CAF50; font-weight:bold;");
  startPulseOSHealer();
  global.__pulseOSHealerStarted = true;
}

if (!global.__globalHealerStarted) {
  log("%c[SPINE BOOT] Starting GlobalHealer (system-wide immune response)…", "color:#4CAF50; font-weight:bold;");
  startGlobalHealer();
  global.__globalHealerStarted = true;
}

// ============================================================================
//  APP + ENV — v12.3-EVO
// ============================================================================

const app = express();
const PORT = process.env.PORT || 8080;

// backend-only PulseChunker base URL
const CHUNKER_BASE =
  process.env.PULSE_CHUNKER_BASE ||
  "https://us-central1-tropic-pulse.cloudfunctions.net";

// ============================================================================
//  ENV + IDENTITY + MODE — v12.3-EVO
// ============================================================================

const SMTP_PASS = process.env.EMAIL_PASSWORD;
const ALERT_EMAIL_TO = "FordFamilyDelivery@gmail.com";
const ALERT_EMAIL_FROM = `"Tropic Pulse" <Sales@TropicPulse.bz>`;
const SMTP_HOST = "smtp.gmail.com";
const SMTP_USER = "Sales@TropicPulse.bz";

const MAX_REQUESTS_PER_DAY = Number(process.env.PULSE_MAX_REQ_PER_DAY || "5000");

const START_TIME = Date.now();
global.__lastStartTime = global.__lastStartTime || START_TIME;

const CLOUD_REGION =
  process.env.GOOGLE_CLOUD_REGION ||
  process.env.X_GOOGLE_GCLOUD_REGION ||
  "US-Central1";

const NODE_ID = process.env.K_REVISION || process.env.HOSTNAME || "Local";

const PULSE_VERSION = "v12.3-EVO";

const OFFLINE_MODE =
  process.env.PULSE_OFFLINE_MODE === "1" ||
  process.env.PULSE_PROXY_MODE === "offline";

healingState.mode = OFFLINE_MODE ? "offline" : "online";

log(
  "%c[SPINE BOOT] Identity:",
  "color:#03A9F4; font-weight:bold;",
  {
    region: CLOUD_REGION,
    nodeId: NODE_ID,
    version: PULSE_VERSION,
    maxRequestsPerDay: MAX_REQUESTS_PER_DAY,
    mode: OFFLINE_MODE ? "OFFLINE (local-only)" : "ONLINE (internet-enabled)"
  }
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ============================================================================
//  GLOBAL REQUEST MIDDLEWARE — v12.3-EVO
//  Adds headers + captures passive band metadata
// ============================================================================

app.use((req, res, next) => {
  res.setHeader("X-Pulse-Version", PULSE_VERSION);
  res.setHeader("X-Pulse-Node", NODE_ID);
  res.setHeader("X-Pulse-Region", CLOUD_REGION);
  res.setHeader("X-Pulse-Mode", OFFLINE_MODE ? "offline" : "online");

  // passive capture from incoming headers
  healingState.pulsePrewarm   = req.get("x-pulse-prewarm")   || healingState.pulsePrewarm;
  healingState.pulseCacheMode = req.get("x-pulse-cache")     || healingState.pulseCacheMode;
  healingState.pulseChunkMode = req.get("x-pulse-chunk")     || healingState.pulseChunkMode;
  healingState.pulseRemember  = req.get("x-pulse-remember")  || healingState.pulseRemember;

  // presence/harmonics can be injected by upstream or left null
  healingState.presenceBandState = req.get("x-pulse-presence")   || healingState.presenceBandState;
  healingState.harmonicDrift     = req.get("x-pulse-harmonics")  || healingState.harmonicDrift;
  healingState.coherenceScore    = req.get("x-pulse-coherence")  || healingState.coherenceScore;

  healingState.lastRequestTs = Date.now();
  healingState.cycleCount++;

  // forward passive band metadata on every response
  res.setHeader("X-Pulse-Prewarm", healingState.pulsePrewarm ?? "0");
  res.setHeader("X-Pulse-Cache", healingState.pulseCacheMode ?? "none");
  res.setHeader("X-Pulse-Chunk", healingState.pulseChunkMode ?? "none");
  res.setHeader("X-Pulse-Remember", healingState.pulseRemember ?? "0");

  res.setHeader("X-Pulse-Presence", healingState.presenceBandState ?? "0");
  res.setHeader("X-Pulse-Harmonics", healingState.harmonicDrift ?? "0");
  res.setHeader("X-Pulse-Coherence", healingState.coherenceScore ?? "0");
  res.setHeader("X-Pulse-BandState", healingState.dualBandMode);

  next();
});


// ============================================================================
//  CONTEXT SHAPE — v12.3-EVO
// ============================================================================
export function createSpineContext({
  layer = "BackendSpine",
  role = "PulseProxySpine-v12.3-EVO",
  purpose = "Unified TPProxy gateway + vitals pump + OS healer feed",
  context = "Backend spine for PulseProxy: routes traffic, exposes vitals, feeds healers",
  version = "12.3-EVO",
  target = "proxy-core",
  selfRepairable = true
} = {}) {
  return {
    layer,
    role,
    purpose,
    context,
    version,
    target,
    selfRepairable,
    evo: { ...PulseRoleBinary.evo }
  };
}


// ============================================================================
//  VITALS FIELD — Deterministic Shape + Defaults (with band metadata)
// ============================================================================
export function createEmptyVitals(context = createSpineContext()) {
  return {
    ...context,
    lastRequestTs: null,
    lastError: null,
    lastProxyError: null,
    lastRedisError: null,
    lastEmailError: null,
    lastWarmConnection: null,
    lastRateLimitDecision: null,
    lastTPProxyCall: null,
    lastHealthCheck: null,
    lastMetricsCheck: null,
    lastNodeCheck: null,
    lastPingCheck: null,
    cycleCount: 0,
    status: "healthy",
    mode: "online",

    // 12.3-EVO passive band metadata
    pulsePrewarm: null,
    pulseCacheMode: null,
    pulseChunkMode: null,
    pulseRemember: null,

    presenceBandState: null,
    harmonicDrift: null,
    coherenceScore: null,

    dualBandMode: "symbolic"
  };
}


// ============================================================================
//  RATE LIMIT FIELD — Deterministic Rate Limit Math
// ============================================================================
export function computeRateLimitState({
  totalRequestsToday,
  maxRequestsPerDay,
  nowMs,
  startTimeMs
} = {}) {
  const safeTotal = Number.isFinite(totalRequestsToday)
    ? Math.max(0, totalRequestsToday)
    : 0;

  const safeMax = Number.isFinite(maxRequestsPerDay) && maxRequestsPerDay > 0
    ? maxRequestsPerDay
    : 1;

  const usageRatio = safeTotal / safeMax;
  const clampedRatio = usageRatio > 1 ? 1 : usageRatio;

  let band = "low";
  if (clampedRatio >= 0.9) band = "critical";
  else if (clampedRatio >= 0.7) band = "high";
  else if (clampedRatio >= 0.4) band = "medium";

  const uptimeMs =
    Number.isFinite(nowMs) && Number.isFinite(startTimeMs) && nowMs >= startTimeMs
      ? nowMs - startTimeMs
      : null;

  return {
    totalRequestsToday: safeTotal,
    maxRequestsPerDay: safeMax,
    usageRatio: clampedRatio,
    band,
    uptimeMs
  };
}


// ============================================================================
//  NODE + REGION DESCRIPTORS — Deterministic Identity View
// ============================================================================
export function buildNodeDescriptor({
  region,
  nodeId,
  version,
  mode,
  maxRequestsPerDay
} = {}) {
  return {
    region: region || "unknown-region",
    nodeId: nodeId || "unknown-node",
    version: version || "v12.3-EVO",
    mode: mode === "offline" ? "offline" : "online",
    maxRequestsPerDay: Number.isFinite(maxRequestsPerDay)
      ? maxRequestsPerDay
      : null
  };
}


// ============================================================================
//  HEALABILITY MAP — How the Spine Looks to Healers (Binary View)
// ============================================================================
export function buildHealabilitySnapshot({
  vitals,
  rateLimit,
  nodeDescriptor,
  redisReady,
  offlineMode
} = {}) {
  const v = vitals || {};
  const r = rateLimit || {};
  const n = nodeDescriptor || {};

  const redisStatus = redisReady ? "ready" : "degraded";
  const mode = offlineMode ? "offline" : "online";

  let health = "healthy";

  if (v.lastProxyError || v.lastRedisError || v.lastEmailError) {
    health = "degraded";
  }

  if (r.band === "critical") {
    health = "rate-limited";
  }

  if (mode === "offline") {
    health = health === "healthy" ? "offline" : health;
  }

  return {
    health,
    mode,
    redisStatus,
    node: {
      region: n.region,
      nodeId: n.nodeId,
      version: n.version
    },
    rateLimit: {
      band: r.band,
      usageRatio: r.usageRatio,
      totalRequestsToday: r.totalRequestsToday,
      maxRequestsPerDay: r.maxRequestsPerDay
    },
    vitals: {
      lastRequestTs: v.lastRequestTs,
      lastError: v.lastError,
      lastProxyError: v.lastProxyError,
      lastRedisError: v.lastRedisError,
      lastEmailError: v.lastEmailError,
      lastWarmConnection: v.lastWarmConnection,
      lastRateLimitDecision: v.lastRateLimitDecision,
      lastTPProxyCall: v.lastTPProxyCall,
      lastHealthCheck: v.lastHealthCheck,
      lastMetricsCheck: v.lastMetricsCheck,
      lastNodeCheck: v.lastNodeCheck,
      lastPingCheck: v.lastPingCheck,
      cycleCount: v.cycleCount,

      // 12.3-EVO band metadata surfaced to healers
      presenceBandState: v.presenceBandState,
      harmonicDrift: v.harmonicDrift,
      coherenceScore: v.coherenceScore,
      pulsePrewarm: v.pulsePrewarm,
      pulseCacheMode: v.pulseCacheMode,
      pulseChunkMode: v.pulseChunkMode,
      pulseRemember: v.pulseRemember,
      dualBandMode: v.dualBandMode
    }
  };
}


// ============================================================================
//  VITALS UPDATE HELPERS — Pure, Caller-Driven
// ============================================================================
export function bumpCycle(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastRequestTs: Number.isFinite(nowMs) ? nowMs : base.lastRequestTs || null,
    cycleCount: (base.cycleCount || 0) + 1
  };
}

export function recordError(vitals, { type, message, nowMs } = {}) {
  const base = vitals || {};
  const msg = typeof message === "string" ? message : String(message || "");

  const next = {
    ...base,
    lastError: msg
  };

  if (type === "proxy") {
    next.lastProxyError = msg;
  } else if (type === "redis") {
    next.lastRedisError = msg;
  } else if (type === "email") {
    next.lastEmailError = msg;
  }

  if (Number.isFinite(nowMs)) {
    next.lastRequestTs = nowMs;
  }

  return next;
}

export function recordWarmConnection(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastWarmConnection: Number.isFinite(nowMs) ? nowMs : base.lastWarmConnection || null
  };
}

export function recordRateLimitDecision(vitals, { decision, nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastRateLimitDecision: decision || base.lastRateLimitDecision || null,
    lastRequestTs: Number.isFinite(nowMs) ? nowMs : base.lastRequestTs || null
  };
}

export function recordTPProxyCall(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastTPProxyCall: Number.isFinite(nowMs) ? nowMs : base.lastTPProxyCall || null
  };
}

export function recordHealthCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastHealthCheck: Number.isFinite(nowMs) ? nowMs : base.lastHealthCheck || null
  };
}

export function recordMetricsCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastMetricsCheck: Number.isFinite(nowMs) ? nowMs : base.lastMetricsCheck || null
  };
}

export function recordNodeCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastNodeCheck: Number.isFinite(nowMs) ? nowMs : base.lastNodeCheck || null
  };
}

export function recordPingCheck(vitals, { nowMs } = {}) {
  const base = vitals || {};
  return {
    ...base,
    lastPingCheck: Number.isFinite(nowMs) ? nowMs : base.lastPingCheck || null
  };
}


// ============================================================================
//  PACKET / EARN DESCRIPTORS — Binary View Only
// ============================================================================
export function describePacket({
  packetId,
  userId,
  deviceId,
  kind,
  createdAtMs,
  sizeBytes
} = {}) {
  return {
    packetId: packetId || null,
    userId: userId || null,
    deviceId: deviceId || null,
    kind: kind || "unknown",
    createdAtMs: Number.isFinite(createdAtMs) ? createdAtMs : null,
    sizeBytes: Number.isFinite(sizeBytes) ? sizeBytes : null
  };
}


// ============================================================================
//  REDIS DESCRIPTORS — Binary View Only
// ============================================================================
export function describeRedisState({ ready, lastError } = {}) {
  return {
    ready: !!ready,
    lastError: lastError ? String(lastError) : null,
    status: ready ? "ready" : "degraded"
  };
}


// ============================================================================
//  MAILER DESCRIPTORS — Binary View Only
// ============================================================================
export function describeMailerState({ enabled, lastError } = {}) {
  return {
    enabled: !!enabled,
    lastError: lastError ? String(lastError) : null,
    status: enabled ? "ready" : "disabled"
  };
}


// ============================================================================
//  TPProxy DESCRIPTORS — Binary View Only
// ============================================================================
export function describeTPProxyState({
  lastTPProxyCall,
  lastProxyError
} = {}) {
  return {
    lastTPProxyCall: Number.isFinite(lastTPProxyCall) ? lastTPProxyCall : null,
    lastProxyError: lastProxyError ? String(lastProxyError) : null
  };
}

// ============================================================================
//  REDIS — v12.3-EVO (unchanged behavior)
// ============================================================================

let redis = null;
let redisReady = false;

if (process.env.REDIS_URL) {
  log("%c[SPINE BOOT] Redis URL detected — initializing client…", "color:#FFC107; font-weight:bold;");
  redis = createClient({ url: process.env.REDIS_URL });

  redis.on("ready", () => {
    redisReady = true;
    global.__lastRedisError = null;
    log("%c[REDIS] Connected — cache + rate limiting enabled (fail-open safe).", "color:#4CAF50; font-weight:bold;");
  });

  redis.on("error", (err) => {
    redisReady = false;
    const msg = String(err);
    global.__lastRedisError = msg;
    healingState.lastRedisError = msg;
    warn("%c[REDIS ERROR] Entering degraded / fail-open mode:", "color:#FF9800; font-weight:bold;", msg);
  });

  redis.connect().catch((err) => {
    const msg = String(err);
    redisReady = false;
    global.__lastRedisError = msg;
    healingState.lastRedisError = msg;
    warn("%c[REDIS CONNECT FAILED] Staying in fail-open mode:", "color:#FF9800; font-weight:bold;", msg);
  });
} else {
  log("%c[SPINE BOOT] Redis URL not set — cache + rate limiting in fail-open mode.", "color:#FFC107; font-weight:bold;");
}

// ============================================================================
//  VAULT PATCH (Lore) — unchanged
// ============================================================================

export const VAULT_PATCH_TWILIGHT = {
  signature: "Twilight",
  invoked: "2026-04-11T01:00:00-02:00",
  version: 4,
  type: "security-data-integrity-chunking",
  glyph: "🌒",
  description:
    "The first protective veil cast by the Vault Spirit during a 4 AM development session.",
  note: "Named 'Twilight' because it was created in the quiet hours before dawn."
};

// ============================================================================
//  MAILER — v12.3-EVO (unchanged behavior)
// ============================================================================

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: 465,
        secure: true,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      })
    : null;

if (transporter) {
  log(
    "%c[SPINE BOOT] Mailer enabled — critical alerts will be sent.",
    "color:#4CAF50; font-weight:bold;"
  );
} else {
  log(
    "%c[SPINE BOOT] Mailer disabled — EMAIL_PASSWORD / SMTP config missing.",
    "color:#FFC107; font-weight:bold;"
  );
}

async function sendCriticalEmail(subject, payload) {
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: ALERT_EMAIL_FROM,
      to: ALERT_EMAIL_TO,
      secure: true,
      subject,
      text: JSON.stringify(payload, null, 2)
    });
  } catch (err) {
    const msg = String(err);
    healingState.lastEmailError = msg;
    error("%c[PULSE EMAIL ERROR]", "color:#FF5252; font-weight:bold;", msg);
  }
}

// ============================================================================
//  UNIVERSAL PROXY — TPProxy v12.3-EVO (logic unchanged, now band-aware)
// ============================================================================

app.get("/TPProxy", async (req, res) => {
  healingState.lastTPProxyCall = Date.now();

  const target = req.query.url;
  if (!target) {
    warn("[TPProxy] Missing_URL");
    return res.status(400).json({ error: "Missing_URL" });
  }

  const sysHeader = req.get("x-pulse-device");
  let system = null;
  try {
    system = sysHeader ? JSON.parse(sysHeader) : null;
  } catch {
    // malformed header is non‑fatal; system stays null
  }

  const rememberMe = req.get("x-pulse-remember") === "1";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "Unknown";

  const userId    = req.get("x-pulse-user") || "anonymous";
  const meshRelay = req.get("x-PULSE-MESH-relay") === "1";
  const meshPing  = req.get("x-PULSE-MESH-ping") === "1";
  const hubFlag   = req.get("x-pulse-hub") === "1";

  const cacheKey =
    "pulse:cache:" + crypto.createHash("sha1").update(target).digest("hex");

  const start = Date.now();

  if (OFFLINE_MODE) {
    const durationMs = Date.now() - start;

    const payload = {
      ok: false,
      mode: "offline",
      message: "TPProxy running in offline mode; external fetch disabled.",
      target,
      system,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      durationMs,
      presenceBandState: healingState.presenceBandState,
      harmonicDrift: healingState.harmonicDrift,
      coherenceScore: healingState.coherenceScore,
      pulsePrewarm: healingState.pulsePrewarm,
      pulseCacheMode: healingState.pulseCacheMode,
      pulseChunkMode: healingState.pulseChunkMode,
      pulseRemember: healingState.pulseRemember,
      dualBandMode: healingState.dualBandMode
    };

    recordUserMetrics(userId, {
      event: "offline_proxy",
      durationMs,
      presenceBandState: healingState.presenceBandState,
      harmonicDrift: healingState.harmonicDrift,
      coherenceScore: healingState.coherenceScore,
      pulsePrewarm: healingState.pulsePrewarm,
      pulseCacheMode: healingState.pulseCacheMode,
      pulseChunkMode: healingState.pulseChunkMode,
      pulseRemember: healingState.pulseRemember,
      dualBandMode: healingState.dualBandMode
    });

    return res
      .set("x-pulse-cache", "offline")
      .set("x-pulse-mode", "offline")
      .json(payload);
  }

  try {
    let warmDuration = 0;

    if (rememberMe) {
      const warmStart = Date.now();
      await warmConnection(target);
      warmDuration = Date.now() - warmStart;
      healingState.lastWarmConnection = warmStart;
    }

    if (rememberMe && redisReady) {
      const cachedRaw = await redis.get(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);

        recordUserMetrics(userId, {
          bytes: cached.bytes,
          event: "cache_hit",
          presenceBandState: healingState.presenceBandState,
          harmonicDrift: healingState.harmonicDrift,
          coherenceScore: healingState.coherenceScore,
          pulsePrewarm: healingState.pulsePrewarm,
          pulseCacheMode: healingState.pulseCacheMode,
          pulseChunkMode: healingState.pulseChunkMode,
          pulseRemember: healingState.pulseRemember,
          dualBandMode: healingState.dualBandMode
        });

        return res
          .set("x-pulse-bytes", String(cached.bytes))
          .set("x-pulse-chunks", String(cached.chunkCount))
          .set("x-pulse-cache", "hit")
          .set("x-pulse-mode", "online")
          .set("content-type", cached.contentType)
          .send(Buffer.from(cached.data, "base64"));
      }
    }

    const upstreamRes = await fetch(target);
    const contentType =
      upstreamRes.headers.get("content-type") || "application/octet-stream";

    const buf = Buffer.from(await upstreamRes.arrayBuffer());
    const bytes = buf.length;

    if (rememberMe && redisReady) {
      await redis.set(
        cacheKey,
        JSON.stringify({
          data: buf.toString("base64"),
          bytes,
          contentType,
          chunkCount: 1
        }),
        { EX: 300 }
      );
    }

    const durationMs = Date.now() - start;

    recordUserMetrics(userId, {
      bytes,
      durationMs,
      event: "ok",
      presenceBandState: healingState.presenceBandState,
      harmonicDrift: healingState.harmonicDrift,
      coherenceScore: healingState.coherenceScore,
      pulsePrewarm: healingState.pulsePrewarm,
      pulseCacheMode: healingState.pulseCacheMode,
      pulseChunkMode: healingState.pulseChunkMode,
      pulseRemember: healingState.pulseRemember,
      dualBandMode: healingState.dualBandMode
    });

    res
      .set("x-pulse-bytes", String(bytes))
      .set("x-pulse-chunks", "1")
      .set("x-pulse-cache", rememberMe ? "miss" : "bypass")
      .set("x-pulse-mode", "online")
      .set("content-type", contentType)
      .send(buf);

  } catch (err) {
    const durationMs = Date.now() - start;
    const msg = String(err);

    healingState.lastProxyError = msg;
    healingState.status = "warning";

    recordUserMetrics(userId, {
      event: "error",
      durationMs,
      presenceBandState: healingState.presenceBandState,
      harmonicDrift: healingState.harmonicDrift,
      coherenceScore: healingState.coherenceScore,
      pulsePrewarm: healingState.pulsePrewarm,
      pulseCacheMode: healingState.pulseCacheMode,
      pulseChunkMode: healingState.pulseChunkMode,
      pulseRemember: healingState.pulseRemember,
      dualBandMode: healingState.dualBandMode
    });

    await sendCriticalEmail("[PULSE CRITICAL] Proxy failure", {
      target,
      error: msg,
      durationMs,
      system,
      rememberMe,
      ip,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      ...PROXY_CONTEXT,
      mode: OFFLINE_MODE ? "offline" : "online",
      presenceBandState: healingState.presenceBandState,
      harmonicDrift: healingState.harmonicDrift,
      coherenceScore: healingState.coherenceScore,
      pulsePrewarm: healingState.pulsePrewarm,
      pulseCacheMode: healingState.pulseCacheMode,
      pulseChunkMode: healingState.pulseChunkMode,
      pulseRemember: healingState.pulseRemember,
      dualBandMode: healingState.dualBandMode
    });

    res.status(502).json({ error: "pulse_proxy_failed" });
  }
});

// ============================================================================
//  PULSEBAND CHUNKER BRIDGE — v12.3-EVO → PulseChunker-v12-Evo
//  (logic unchanged, now forwards passive band metadata)
// ============================================================================

app.post("/PULSE-PROXY/pulseband/session", async (req, res) => {
  try {
    const upstream = await fetch(`${CHUNKER_BASE}/createPulseBandSession`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...req.body,
        presenceBandState: healingState.presenceBandState,
        harmonicDrift: healingState.harmonicDrift,
        coherenceScore: healingState.coherenceScore,
        pulsePrewarm: healingState.pulsePrewarm,
        pulseCacheMode: healingState.pulseCacheMode,
        pulseChunkMode: healingState.pulseChunkMode,
        pulseRemember: healingState.pulseRemember,
        dualBandMode: healingState.dualBandMode
      })
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    const msg = String(err);
    warn("[PULSEBAND SESSION] Bridge failed:", msg);
    res.status(502).json({ success: false, error: "pulseband_session_bridge_failed" });
  }
});

app.get("/PULSE-PROXY/pulseband/next", async (req, res) => {
  try {
    const qs = new URLSearchParams({
      ...req.query,
      presenceBandState: healingState.presenceBandState ?? "",
      harmonicDrift: healingState.harmonicDrift ?? "",
      coherenceScore: healingState.coherenceScore ?? "",
      pulsePrewarm: healingState.pulsePrewarm ?? "",
      pulseCacheMode: healingState.pulseCacheMode ?? "",
      pulseChunkMode: healingState.pulseChunkMode ?? "",
      pulseRemember: healingState.pulseRemember ?? "",
      dualBandMode: healingState.dualBandMode ?? ""
    }).toString();
    const upstream = await fetch(`${CHUNKER_BASE}/getNextPulseBandChunk?${qs}`);
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    const msg = String(err);
    warn("[PULSEBAND NEXT] Bridge failed:", msg);
    res.status(502).json({ success: false, error: "pulseband_next_bridge_failed" });
  }
});

app.post("/PULSE-PROXY/pulseband/ack", async (req, res) => {
  try {
    const upstream = await fetch(`${CHUNKER_BASE}/ackPulseBandChunk`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...req.body,
        presenceBandState: healingState.presenceBandState,
        harmonicDrift: healingState.harmonicDrift,
        coherenceScore: healingState.coherenceScore,
        pulsePrewarm: healingState.pulsePrewarm,
        pulseCacheMode: healingState.pulseCacheMode,
        pulseChunkMode: healingState.pulseChunkMode,
        pulseRemember: healingState.pulseRemember,
        dualBandMode: healingState.dualBandMode
      })
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    const msg = String(err);
    warn("[PULSEBAND ACK] Bridge failed:", msg);
    res.status(502).json({ success: false, error: "pulseband_ack_bridge_failed" });
  }
});

app.post("/PULSE-PROXY/pulseband/redownload", async (req, res) => {
  try {
    const upstream = await fetch(`${CHUNKER_BASE}/logPulseBandRedownload`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...req.body,
        presenceBandState: healingState.presenceBandState,
        harmonicDrift: healingState.harmonicDrift,
        coherenceScore: healingState.coherenceScore,
        pulsePrewarm: healingState.pulsePrewarm,
        pulseCacheMode: healingState.pulseCacheMode,
        pulseChunkMode: healingState.pulseChunkMode,
        pulseRemember: healingState.pulseRemember,
        dualBandMode: healingState.dualBandMode
      })
    });
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    const msg = String(err);
    warn("[PULSEBAND REDOWNLOAD] Bridge failed:", msg);
    res.status(502).json({ success: false, error: "pulseband_redownload_bridge_failed" });
  }
});

// ============================================================================
//  HEALTH — PROXY VITALS SNAPSHOT (v12.3-EVO)
// ============================================================================

app.get("/PULSE-PROXY/health", async (req, res) => {
  const now = Date.now();
  healingState.lastHealthCheck = now;

  const start = process.hrtime.bigint();
  await Promise.resolve();
  const end = process.hrtime.bigint();
  const eventLoopLag = Number(end - start) / 1e6;

  const tlsProto = req.socket.getProtocol?.() || null;

  res.json({
    ...PROXY_CONTEXT,
    status: redisReady ? "OK!" : "Degraded",
    ts: now,
    mode: OFFLINE_MODE ? "offline" : "online",
    redis: redisReady ? "Connected!" : "Disabled",
    lastRedisError: global.__lastRedisError || null,
    lastProxyError: global.__lastProxyError || null,
    region: CLOUD_REGION,
    nodeId: NODE_ID,
    version: PULSE_VERSION,
    uptime: Math.round((now - START_TIME) / 1000),
    latency: eventLoopLag,
    protocol: req.protocol,
    tlsProtocol: tlsProto || "TLS Offloaded Upstream",
    tlsSource: tlsProto ? "Node" : "Cloudflare",
    httpVersion: req.httpVersion,
    clientIp: req.headers["x-forwarded-for"] || req.ip || null,
    coldStart: START_TIME === global.__lastStartTime,

    presenceBandState: healingState.presenceBandState,
    harmonicDrift: healingState.harmonicDrift,
    coherenceScore: healingState.coherenceScore,
    pulsePrewarm: healingState.pulsePrewarm,
    pulseCacheMode: healingState.pulseCacheMode,
    pulseChunkMode: healingState.pulseChunkMode,
    pulseRemember: healingState.pulseRemember,
    dualBandMode: healingState.dualBandMode
  });
});

// ============================================================================
//  METRICS — ICU‑Grade Telemetry (v12.3-EVO)
// ============================================================================

app.get("/PULSE-PROXY/metrics", async (req, res) => {
  const now = Date.now();
  healingState.lastMetricsCheck = now;

  const start = process.hrtime.bigint();
  await Promise.resolve();
  const end = process.hrtime.bigint();
  const eventLoopLag = Number(end - start) / 1e6;

  const cpu = process.cpuUsage();
  const cpuPercent =
    ((cpu.user + cpu.system) / 1000 / (now - START_TIME)) * 100;

  const mem = process.memoryUsage();

  res.json({
    ...PROXY_CONTEXT,
    region: CLOUD_REGION,
    nodeId: NODE_ID,
    version: PULSE_VERSION,
    mode: OFFLINE_MODE ? "offline" : "online",
    timestamp: now,
    uptime: Math.round((now - START_TIME) / 1000),
    coldStart: START_TIME === global.__lastStartTime,
    cacheEnabled: redisReady,
    lastRedisError: global.__lastRedisError || null,
    eventLoopLagMs: eventLoopLag,
    lastProxyError: global.__lastProxyError || null,
    cpu: {
      raw: cpu,
      percent: Number(cpuPercent.toFixed(2))
    },
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      arrayBuffers: mem.arrayBuffers,
      pressure: Number(((mem.heapUsed / mem.heapTotal) * 100).toFixed(2))
    },

    presenceBandState: healingState.presenceBandState,
    harmonicDrift: healingState.harmonicDrift,
    coherenceScore: healingState.coherenceScore,
    pulsePrewarm: healingState.pulsePrewarm,
    pulseCacheMode: healingState.pulseCacheMode,
    pulseChunkMode: healingState.pulseChunkMode,
    pulseRemember: healingState.pulseRemember,
    dualBandMode: healingState.dualBandMode
  });
});

// ============================================================================
//  NODE INFO — BACKEND BODY CARD (v12.3-EVO)
// ============================================================================

app.get("/PULSE-PROXY/node", async (req, res) => {
  const now = Date.now();
  healingState.lastNodeCheck = now;

  const start = process.hrtime.bigint();
  await Promise.resolve();
  const end = process.hrtime.bigint();
  const eventLoopLag = Number(end - start) / 1e6;

  const tlsProto = req.socket.getProtocol?.() || null;

  res.json({
    ...PROXY_CONTEXT,
    region: CLOUD_REGION,
    nodeId: NODE_ID,
    version: PULSE_VERSION,
    nodeVersion: process.version,
    mode: OFFLINE_MODE ? "offline" : "online",
    timestamp: now,
    startTime: START_TIME,
    uptime: Math.round((now - START_TIME) / 1000),
    coldStart: START_TIME === global.__lastStartTime,
    protocol: req.protocol,
    tlsProtocol: tlsProto || "TLS Offloaded Upstream",
    tlsSource: tlsProto ? "Node" : "Cloudflare",
    httpVersion: req.httpVersion,
    clientIp: req.headers["x-forwarded-for"] || req.ip || null,
    eventLoopLagMs: eventLoopLag,
    redisStatus: redisReady ? "Connected!" : "Disabled",
    lastRedisError: global.__lastRedisError || null,
    lastProxyError: global.__lastProxyError || null,

    presenceBandState: healingState.presenceBandState,
    harmonicDrift: healingState.harmonicDrift,
    coherenceScore: healingState.coherenceScore,
    pulsePrewarm: healingState.pulsePrewarm,
    pulseCacheMode: healingState.pulseCacheMode,
    pulseChunkMode: healingState.pulseChunkMode,
    pulseRemember: healingState.pulseRemember,
    dualBandMode: healingState.dualBandMode
  });
});

// ============================================================================
//  PING — REFLEX TEST (v12.3-EVO)
// ============================================================================

app.get("/PULSE-PROXY/ping", async (req, res) => {
  const t0 = Date.now();
  healingState.lastPingCheck = t0;

  res.json({
    ok: true,
    message: "pong",
    timestamp: t0,
    ...PROXY_CONTEXT,
    mode: OFFLINE_MODE ? "offline" : "online",
    presenceBandState: healingState.presenceBandState,
    harmonicDrift: healingState.harmonicDrift,
    coherenceScore: healingState.coherenceScore,
    pulsePrewarm: healingState.pulsePrewarm,
    pulseCacheMode: healingState.pulseCacheMode,
    pulseChunkMode: healingState.pulseChunkMode,
    pulseRemember: healingState.pulseRemember,
    dualBandMode: healingState.dualBandMode
  });
});

// ============================================================================
//  EXPORT (v12.3-EVO)
// ============================================================================

export default app;
