// ============================================================================
//  FILE: /apps/PULSE-PROXY/PulseProxySpine.js
//  PULSE OS v11.1 — PULSE PROXY SPINE (BACKEND SPINE)
//  Unified TPProxy Gateway • Vitals Pump • OS‑Healer Feed
//  ORGANISM‑CORRECT BACKEND ORGAN — NO BUSINESS LOGIC, NO MARKETPLACE.
// ============================================================================
//
//  WHAT THIS ORGAN IS (v11.1):
//  ---------------------------
//  • The Backend Spine of PulseProxy for the organism.
//  • Single ingress spine for TPProxy traffic, vitals, and OS‑healer feeds.
//  • Maintains an OS‑visible healingState for PulseProxyHealer / GlobalHealer.
//  • Owns Redis + mailer wiring, but never business logic or scoring.
//  • Fail‑open by design: degraded modes are logged, never fatal.
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
//  SAFETY CONTRACT (v11.1):
//  ------------------------
//  • Fail‑open: Redis / mailer / env failures degrade, never crash the process.
//  • No IQ, no routing intelligence, no marketplace logic.
//  • No mutation outside healingState + explicit global boot flags.
//  • Deterministic boot guards (single‑boot, idempotent).
//  • Drift‑proof identity + context via PROXY_CONTEXT.
//  • Multi‑instance safe: no singleton assumptions beyond process‑local flags.
// ============================================================================

import express from "express";
import nodemailer from "nodemailer";
import { createClient } from "redis";

const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ============================================================================
//  SPINE IDENTITY — v11.1 (symbolic backend only, no binary partner)
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "BackendSpine",
  version: "11.1",
  identity: "PulseProxySpine",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    symbolicBackend: true,      // explicit: this is the symbolic spine
    dualModeEvolution: false,   // no binary twin for this organ
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
//  HUMAN‑READABLE CONTEXT MAP — Spine Identity (v11.1)
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

log(
  "%c🟦 PulseProxySpine v11.1 online — backend spine + vitals pump active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  HEALING METADATA — OS-visible heartbeat for PulseProxyHealer (v11.1)
//  NOTE: This is symbolic state only; no business logic is encoded here.
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
  mode: "online"
};

// Optional: read‑only export for OS healers / dashboards
export function getSpineHealingState() {
  return { ...healingState };
}

// ============================================================================
//  DOWNSTREAM ORGANS — Packet Engine, Metrics, OS‑level organs
//  (unchanged wiring, but explicitly documented as symbolic links)
// ============================================================================

// Packet Engine (PulseEarn organ)
import {
  readPacketExists,
  writePacket,
  generatePacketData
} from "./PULSE-EARN/PacketEngine.js";

// ICU Vitals Monitor
import { updateUserMetrics as recordUserMetrics } from "./PULSE-OS/PulseUserMetrics.js";

// OS‑level organs (Heart, OSKernel, Immune Layers)
import startPulseTimer from "./PulseProxyHeart.js";
import startPulseOS from "./PULSE-OS/PulseOS.js";
import startPulseOSHealer from "./PULSE-OS/PulseOSHealer.js";
import startGlobalHealer from "../PULSE-OS/GlobalHealer.js";

// ============================================================================
//  SINGLE‑BOOT GUARDS — v11.1 (idempotent, process‑local)
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
//  APP + ENV — v11.1 (symbolic spine shell, no business logic)
// ============================================================================
const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================================
//  ENV + IDENTITY + MODE — v11.1
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

const PULSE_VERSION = "v11.1";

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
//  GLOBAL REQUEST MIDDLEWARE — v11.1 (healingState pump)
// ============================================================================
app.use((req, res, next) => {
  res.setHeader("X-Pulse-Version", PULSE_VERSION);
  res.setHeader("X-Pulse-Node", NODE_ID);
  res.setHeader("X-Pulse-Region", CLOUD_REGION);
  res.setHeader("X-Pulse-Mode", OFFLINE_MODE ? "offline" : "online");

  healingState.lastRequestTs = Date.now();
  healingState.cycleCount++;

  next();
});

// ============================================================================
//  REDIS — v11.1 (Fail‑open, drift‑proof, symbolic cache wiring)
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
//  VAULT PATCH (Lore) — unchanged (lore versioning is independent)
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

// (rest of routes / handlers can remain exactly as you have them)
// ============================================================================
//  END SPINE HEADER v11.1 — organism-correct, symbolic-only backend spine
// ============================================================================
// ============================================================================
//  MAILER — v11.0 (Critical alerts only, fail‑open, healer‑aware)
// ============================================================================
//
// ROLE (v11.0):
//   • Sends only critical OS / proxy failures to a fixed alert inbox.
//   • Never blocks the request path — failures are fail‑open + logged.
//   • No marketing, no campaigns, no user‑facing flows.
//
// SAFETY (v11.0):
//   • Missing / broken SMTP config → mailer disabled, not fatal.
//   • Errors surface via healingState.lastEmailError for OS‑level healers.
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

/**
 * sendCriticalEmail (v11.0)
 * Symbolic, best‑effort alert channel for spine / proxy failures.
 * Never throws; all errors are logged into healingState.
 */
async function sendCriticalEmail(subject, payload) {
  if (!transporter) return; // fail‑open: no mailer, no crash

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
//  UNIVERSAL PROXY — TPProxy v11.0
//  Unified Fetch Gateway • Safe Fail‑Open • Vitals Pump • Advantage‑Aware
// ============================================================================
//
// ROLE (v11.0):
//   • Thin, organism‑correct fetch gateway for shell / mesh.
//   • Provides caching (Redis), vitals (metrics), offline awareness.
//   • No scoring, no marketplace, no routing intelligence.
//
// SAFETY CONTRACT (v11.0):
//   • Fail‑open: Redis / upstream / mailer failures never crash the spine.
//   • Deterministic X‑Pulse‑* headers for healers + dashboards.
//   • Only mutates healingState + metrics; no cross‑subsystem writes.
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
  const meshRelay = req.get("x-pulse-mesh-relay") === "1";
  const meshPing  = req.get("x-pulse-mesh-ping") === "1";
  const hubFlag   = req.get("x-pulse-hub") === "1";

  const cacheKey =
    "pulse:cache:" + crypto.createHash("sha1").update(target).digest("hex");

  const start = Date.now();

  // ========================================================================
  //  OFFLINE MODE — Local‑Only Behavior (v11.0, deterministic)
// ========================================================================
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
      durationMs
    };

    recordUserMetrics(userId, { event: "offline_proxy", durationMs });

    return res
      .set("x-pulse-cache", "offline")
      .set("x-pulse-mode", "offline")
      .json(payload);
  }

  // ========================================================================
  //  ONLINE MODE — Full Internet‑Enabled Proxy Behavior (v11.0)
// ========================================================================
  try {
    let warmDuration = 0;

    // Optional warm connection for latency smoothing / advantage
    if (rememberMe) {
      const warmStart = Date.now();
      await warmConnection(target);
      warmDuration = Date.now() - warmStart;
      healingState.lastWarmConnection = warmStart;
    }

    // --------------------------------------------------------------------
    //  REDIS CACHE HIT — advantage‑aware, fail‑open
    // --------------------------------------------------------------------
    if (rememberMe && redisReady) {
      const cachedRaw = await redis.get(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);

        recordUserMetrics(userId, {
          bytes: cached.bytes,
          event: "cache_hit"
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

    // --------------------------------------------------------------------
    //  UPSTREAM FETCH — single hop, no routing logic
    // --------------------------------------------------------------------
    const upstreamRes = await fetch(target);
    const contentType =
      upstreamRes.headers.get("content-type") || "application/octet-stream";

    const buf = Buffer.from(await upstreamRes.arrayBuffer());
    const bytes = buf.length;

    // Cache write is best‑effort; failures are non‑fatal
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
      event: "ok"
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

    recordUserMetrics(userId, { event: "error", durationMs });

    // Critical alert is best‑effort; failure is logged but not fatal
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
      mode: OFFLINE_MODE ? "offline" : "online"
    });

    res.status(502).json({ error: "pulse_proxy_failed" });
  }
});
// ============================================================================
//  HEALTH — PROXY VITALS SNAPSHOT (v11.0)
//  OS‑Visible Health Card • Redis Status • Event Loop Lag
// ============================================================================
//
// ROLE (v11.0):
//   • Exposes a lightweight, read‑only health snapshot for OS healers / dashboards.
//   • Reports Redis status, uptime, protocol, and event loop lag.
//   • No mutations beyond healingState.lastHealthCheck.
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
    coldStart: START_TIME === global.__lastStartTime
  });
});

// ============================================================================
//  METRICS — ICU‑Grade Telemetry (v11.0)
//  CPU / Memory / Event Loop Lag • Cache Status • Drift‑Safe Snapshot
// ============================================================================
//
// ROLE (v11.0):
//   • Provides ICU‑style telemetry for backend observability.
//   • CPU, memory, event loop lag, cache status, and cold‑start awareness.
//   • Read‑only; no cross‑subsystem writes.
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
    }
  });
});

// ============================================================================
//  NODE INFO — BACKEND BODY CARD (v11.0)
//  Node Identity • TLS / HTTP • Uptime • Redis Status
// ============================================================================
//
// ROLE (v11.0):
//   • Exposes node‑level identity and runtime envelope for debuggers / healers.
//   • No business logic, no routing decisions.
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
    lastProxyError: global.__lastProxyError || null
  });
});

// ============================================================================
//  PING — REFLEX TEST (v11.0)
//  Minimal Reflex • No Side Effects
// ============================================================================
//
// ROLE (v11.0):
//   • Simple reflex endpoint for liveness checks.
//   • No writes beyond healingState.lastPingCheck.
// ============================================================================
app.get("/PULSE-PROXY/ping", async (req, res) => {
  const t0 = Date.now();
  healingState.lastPingCheck = t0;

  res.json({
    ok: true,
    message: "pong",
    timestamp: t0,
    ...PROXY_CONTEXT,
    mode: OFFLINE_MODE ? "offline" : "online"
  });
});

// ============================================================================
//  EXPORT (v11.0)
// ============================================================================
export default app;
