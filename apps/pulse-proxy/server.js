// ======================================================
//  PULSE ENGINE — SERVER.JS v6.3
//  PULSE PROXY SPINE — ROOT OF BACKEND + OS ARCHITECTURE
//  C‑LAYER GATEWAY (BACKEND SPINE + VITALS PUMP)
// ======================================================
//
// WHAT THIS FILE IS:
//  -------------------
//  • The ROOT spine of the entire Pulse backend.
//  • The entrypoint for the Tropic Pulse Proxy.
//  • The universal request router for TPProxy.
//  • The system that exposes admin dashboards.
//  • The system that handles rate limiting.
//  • The system that handles logs + metrics.
//  • The system that handles warm connections.
//  • The system that handles packet engine access.
//  • The system that handles email alerts.
//  • The system that sets identity + version headers.
//  • The system that protects the user by FAILING OPEN.
//  • The system that exposes healing metadata for PulseProxyHealer.
//  • The circulatory spine feeding PulseBand (nervous system) + PulseClient (blood flow).
//
//  • The system that boots the Pulse‑OS layer:
//        - PulseOS (global supervisor / brainstem)
//        - PulseOSHealer (OS-level immune scan)
//        - GlobalHealer (system-wide immune response)
//        - Midnight Timer (compiler input generator)
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT an Earn engine.
//  • NOT an Earn runtime.
//  • NOT a job orchestrator.
//  • NOT a marketplace adapter.
//  • NOT a scoring engine.
//  • NOT a trust engine.
//  • NOT a GPU worker.
//  • NOT a blockchain client.
//  • NOT a wallet or token handler.
//  • NOT a place for arbitrary code execution.
//  • NOT a place for business logic that belongs in subsystems.
//
// DESIGN LAW FOR THIS FILE:
//  -------------------------
//  “If any subsystem fails, the proxy must fail OPEN.
//   The proxy must never block, stall, or degrade the user’s device.
//   The proxy must always pass traffic through even if the entire Earn
//   stack is offline.”
//
// SAFETY CONTRACT:
//  ----------------
//  • Always fail OPEN — never block user traffic.
//  • Never run user-provided scripts.
//  • Never eval, Function(), or dynamic import.
//  • Never perform compute here — delegate to subsystems.
//  • Never mutate global state except logs + metrics.
//  • Never assume Earn availability — proxy must stand alone.
//  • Never assume Redis availability — fail open.
//  • Never assume Firestore availability — fail open.
//  • Never assume packet engine availability — fail open.
//  • Never assume email availability — fail silently.
//
// ======================================================
//  PULSE PROXY CONTEXT (SPINE METADATA)
// ======================================================
const PROXY_CONTEXT = {
  layer: "PulseProxySpine",
  role: "BACKEND_SPINE",
  purpose:
    "Route traffic, expose vitals, protect user by failing open, feed OS healers",
  context:
    "Unified TPProxy gateway + vitals pump for OS-level healers and admin dashboards",
  version: 6.3,
  target: "proxy-core",
  selfRepairable: false
};

console.log(
  "%c🟦 PulseProxySpine v6.3 online — backend spine + vitals pump active.",
  "color:#03A9F4; font-weight:bold;"
);

// ======================================================
//  Healing Metadata (v6.3) — OS-visible heartbeat for PulseProxyHealer
// ------------------------------------------------------
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
  status: "healthy" // healthy | warning | error
};

// ======================================================

import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

import {
  readPacketExists,
  writePacket,
  generatePacketData
} from "./pulse-earn/PacketEngine.js";

// ------------------------------------------------------
//  Timer Layer (Non‑Operational Logging + Saving)
// ------------------------------------------------------
import startPulseTimer from "./timer.js";
// ------------------------------------------------------
//  Pulse‑OS Layer (Global Supervisor + Healers)
// ------------------------------------------------------
import startPulseOS from "./pulse-os/PulseOS.js";
import startPulseOSHealer from "./pulse-os/PulseOSHealer.js";
import startGlobalHealer from "./pulse-os/GlobalHealer.js";

// Start the background timer loop (kept to avoid behavior change)
console.log(
  "%c[SPINE BOOT] Starting Pulse Timer loop…",
  "color:#9C27B0; font-weight:bold;"
);
startPulseTimer();

// ------------------------------------------------------
//  Start Pulse‑OS (Global Supervisor + Healers)
// ------------------------------------------------------
console.log(
  "%c[SPINE BOOT] Starting PulseOS (global supervisor / brainstem)…",
  "color:#4CAF50; font-weight:bold;"
);
startPulseOS(); // OS brain — heartbeat + FUNCTION_LOG ingestion

console.log(
  "%c[SPINE BOOT] Starting PulseOSHealer (OS-level immune scan)…",
  "color:#4CAF50; font-weight:bold;"
);
startPulseOSHealer(); // OS-level drift detector

console.log(
  "%c[SPINE BOOT] Starting GlobalHealer (system-wide immune response)…",
  "color:#4CAF50; font-weight:bold;"
);
startGlobalHealer(); // System-wide healer

// ------------------------------------------------------

const app = express();
const PORT = process.env.PORT || 8080;

// ------------------------------------------------------
//  ENV + Identity
// ------------------------------------------------------
const SMTP_PASS = process.env.EMAIL_PASSWORD;
const ALERT_EMAIL_TO = "FordFamilyDelivery@gmail.com";
const ALERT_EMAIL_FROM = `"Tropic Pulse" <Sales@TropicPulse.bz>`;
const SMTP_HOST = "smtp.gmail.com";
const SMTP_USER = "Sales@TropicPulse.bz";

const MAX_REQUESTS_PER_DAY = Number(
  process.env.PULSE_MAX_REQ_PER_DAY || "5000"
);

const START_TIME = Date.now();
global.__lastStartTime = global.__lastStartTime || START_TIME;

const CLOUD_REGION =
  process.env.GOOGLE_CLOUD_REGION ||
  process.env.X_GOOGLE_GCLOUD_REGION ||
  "US-Central1";

const NODE_ID = process.env.K_REVISION || process.env.HOSTNAME || "Local";

const PULSE_VERSION = process.env.PULSE_VERSION || "v3";

console.log(
  "%c[SPINE BOOT] Identity:",
  "color:#03A9F4; font-weight:bold;",
  {
    region: CLOUD_REGION,
    nodeId: NODE_ID,
    version: PULSE_VERSION,
    maxRequestsPerDay: MAX_REQUESTS_PER_DAY
  }
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Global request middleware — attach identity headers + bump heartbeat
app.use((req, res, next) => {
  res.setHeader("X-Pulse-Version", PULSE_VERSION);
  res.setHeader("X-Pulse-Node", NODE_ID);
  res.setHeader("X-Pulse-Region", CLOUD_REGION);

  healingState.lastRequestTs = Date.now();
  healingState.cycleCount++;

  next();
});

// ------------------------------------------------------
//  Redis
// ------------------------------------------------------
let redis = null;
let redisReady = false;

if (process.env.REDIS_URL) {
  console.log(
    "%c[SPINE BOOT] Redis URL detected — initializing client…",
    "color:#FFC107; font-weight:bold;"
  );
  redis = createClient({ url: process.env.REDIS_URL });
} else {
  console.log(
    "%c[SPINE BOOT] Redis URL not set — cache + rate limiting in fail-open mode.",
    "color:#FFC107; font-weight:bold;"
  );
}

// ------------------------------------------------------
//  Vault Patch (Lore)
// ------------------------------------------------------
export const VAULT_PATCH_TWILIGHT = {
  signature: "Twilight",
  invoked: "2026-04-11T01:00:00-02:00",
  version: 3,
  type: "security-data-integrity-chunking",
  glyph: "🌒",
  description:
    "The first protective veil cast by the Vault Spirit during a 4 AM development session.",
  note: "Named 'Twilight' because it was created in the quiet hours before dawn."
};

// ------------------------------------------------------
//  Mailer
// ------------------------------------------------------
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
  console.log(
    "%c[SPINE BOOT] Mailer enabled — critical alerts will be sent.",
    "color:#4CAF50; font-weight:bold;"
  );
} else {
  console.log(
    "%c[SPINE BOOT] Mailer disabled — EMAIL_PASSWORD / SMTP config missing. Failing silently on alerts.",
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
    healingState.lastEmailError = String(err);
    console.error(
      "%c[PULSE EMAIL ERROR]",
      "color:#FF5252; font-weight:bold;",
      String(err)
    );
  }
}

// ------------------------------------------------------
// GET /UserScores (admin)
// ------------------------------------------------------
export const adminUserScores = app.get("/UserScores", async (req, res) => {
  try {
    console.log(
      "%c[ADMIN] /UserScores requested",
      "color:#03A9F4; font-weight:bold;"
    );
    const db = getFirestore();

    const snap = await db.collection("UserScores").get();
    const results = [];

    snap.forEach((doc) => {
      const d = doc.data();

      results.push({
        userId: doc.id,
        trustScore: d.trustScore ?? 0,
        meshScore: d.meshScore ?? 0,
        phase: d.phase ?? 1,
        hub: d.hub ?? false,
        instances: d.instances ?? 1,
        lastUpdated: d.lastUpdated ?? null
      });
    });

    results.sort((a, b) => b.trustScore - a.trustScore);

    console.log(
      "%c[ADMIN] /UserScores response count:",
      "color:#03A9F4; font-weight:bold;",
      results.length
    );

    res.json({
      ok: true,
      count: results.length,
      users: results
    });
  } catch (err) {
    healingState.lastError = String(err);
    console.error(
      "%c[ADMIN ERROR] Error fetching UserScores:",
      "color:#FF5252; font-weight:bold;",
      err
    );
    res.status(500).json({
      ok: false,
      error: "Failed to fetch user scores"
    });
  }
});

// ------------------------------------------------------
//  Pulse Logs (in-memory)
// ------------------------------------------------------
const pulseLogs = [];
const MAX_LOGS = 300;

function pushPulseLog(entry) {
  pulseLogs.unshift({
    ...entry,
    ...PROXY_CONTEXT
  });
  if (pulseLogs.length > MAX_LOGS) {
    pulseLogs.pop();
  }
}

function updateUserMetrics(userId, data) {
  try {
    global.__userMetrics = global.__userMetrics || {};
    const u = (global.__userMetrics[userId] ||= {});

    if (data.bytes) u.bytes = (u.bytes || 0) + data.bytes;
    if (data.durationMs) u.durationMs = (u.durationMs || 0) + data.durationMs;

    u.lastEvent = data.event;
    u.lastUpdated = Date.now();
  } catch (err) {
    console.log(
      "%c[updateUserMetrics ERROR]",
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

// ------------------------------------------------------
//  Rate Limiting (Fail-Open)
// ------------------------------------------------------
async function checkRateLimit(ip) {
  if (!redisReady) {
    // Fail-open: rate limiting disabled, but we still record the decision.
    healingState.lastRateLimitDecision = {
      ip,
      day: null,
      allowed: true,
      current: null,
      disabled: true,
      ...PROXY_CONTEXT
    };
    return true;
  }

  const day = new Date().toISOString().slice(0, 10);
  const key = `pulse:rate:${ip}:${day}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 24 * 60 * 60);
  }

  const allowed = current <= MAX_REQUESTS_PER_DAY;
  healingState.lastRateLimitDecision = { ip, day, allowed, current };

  if (!allowed) {
    console.warn(
      "%c[RATE LIMIT] IP blocked for the day:",
      "color:#FF9800; font-weight:bold;",
      ip,
      "count:",
      current
    );
  }

  return allowed;
}

// ------------------------------------------------------
//  Warm Connection (Pre‑flow priming)
// ------------------------------------------------------
async function warmConnection(url) {
  try {
    await fetch(url, {
      method: "GET",
      headers: { range: "bytes=0-0" }
    });
    healingState.lastWarmConnection = {
      url,
      ts: Date.now(),
      ok: true
    };
    return true;
  } catch (err) {
    healingState.lastWarmConnection = {
      url,
      ts: Date.now(),
      ok: false,
      error: String(err)
    };
    console.warn(
      "%c[WARM CONNECTION ERROR]",
      "color:#FF9800; font-weight:bold;",
      url,
      String(err)
    );
    return false;
  }
}

// ------------------------------------------------------
//  Chunker
// ------------------------------------------------------
function chunkBuffer(buffer, chunkSize = 128 * 1024) {
  const chunks = [];
  for (let i = 0; i < buffer.length; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }
  return chunks;
}

// ------------------------------------------------------
//  Logs Endpoint
// ------------------------------------------------------
app.get("/pulse-proxy/logs", (req, res) => {
  try {
    res.json({
      ts: Date.now(),
      ...PROXY_CONTEXT,
      count: pulseLogs.length,
      logs: pulseLogs.slice()
    });
  } catch (e) {
    healingState.lastError = String(e);
    res.json({
      ts: Date.now(),
      ...PROXY_CONTEXT,
      count: 0,
      logs: [],
      error: "Log Retrieval Failed",
      details: String(e)
    });
  }
});

// ---------------------------------------------------------
//  UNIVERSAL PROXY — FINAL TPProxy ENDPOINT
// ---------------------------------------------------------
app.get("/TPProxy", async (req, res) => {
  healingState.lastTPProxyCall = Date.now();

  const target = req.query.url;
  if (!target) {
    console.warn(
      "%c[TPProxy] Missing_URL",
      "color:#FF9800; font-weight:bold;"
    );
    return res.status(400).json({ error: "Missing_URL" });
  }

  const sysHeader = req.get("x-pulse-device");
  let system = null;
  try {
    system = sysHeader ? JSON.parse(sysHeader) : null;
  } catch {}

  const rememberHeader = req.get("x-pulse-remember");
  const rememberMe = rememberHeader === "1";

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "Unknown";

  const userId = req.get("x-pulse-user") || "anonymous";
  const meshRelay = req.get("x-pulse-mesh-relay") === "1";
  const meshPing = req.get("x-pulse-mesh-ping") === "1";
  const hubFlag = req.get("x-pulse-hub") === "1";

  try {
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      pushPulseLog({
        ts: Date.now(),
        type: "rate_limit",
        path: target,
        route: "/TPProxy",
        bytes: 0,
        durationMs: 0,
        system,
        userId,
        meshRelay,
        meshPing,
        hubFlag,
        error: "rate_limited"
      });

      updateUserMetrics(userId, { event: "rate_limit" });

      return res.status(429).json({ error: "rate_limited" });
    }
  } catch (err) {
    healingState.lastError = String(err);
    console.error(
      "%c[PULSE RATE LIMIT ERROR]",
      "color:#FF5252; font-weight:bold;",
      String(err)
    );
  }

  const cacheKey =
    "pulse:cache:" + crypto.createHash("sha1").update(target).digest("hex");

  const start = Date.now();

  try {
    let warmDuration = 0;

    if (rememberMe) {
      const warmStart = Date.now();
      await warmConnection(target);
      warmDuration = Date.now() - warmStart;
    }

    if (rememberMe && redisReady) {
      const cachedRaw = await redis.get(cacheKey);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);

        pushPulseLog({
          ts: Date.now(),
          type: "cache_hit",
          path: target,
          route: "/TPProxy",
          bytes: cached.bytes,
          durationMs: 0,
          warmDuration,
          system,
          userId,
          meshRelay,
          meshPing,
          hubFlag,
          error: null
        });

        updateUserMetrics(userId, {
          bytes: cached.bytes,
          event: "cache_hit"
        });

        return res
          .set("x-pulse-bytes", String(cached.bytes))
          .set("x-pulse-chunks", String(cached.chunkCount))
          .set("x-pulse-cache", "hit")
          .set("content-type", cached.contentType)
          .send(Buffer.from(cached.data, "base64"));
      }
    } else if (rememberMe && !redisReady) {
      console.log(
        "%c[TPProxy] rememberMe=1 but Redis disabled — cache bypass (fail-open).",
        "color:#FFC107; font-weight:bold;"
      );
    }

    const upstreamRes = await fetch(target);
    const contentType =
      upstreamRes.headers.get("content-type") || "application/octet-stream";

    const buf = Buffer.from(await upstreamRes.arrayBuffer());
    const bytes = buf.length;
    const chunks = chunkBuffer(buf);

    if (rememberMe && redisReady) {
      await redis.set(
        cacheKey,
        JSON.stringify({
          data: buf.toString("base64"),
          bytes,
          contentType,
          chunkCount: chunks.length
        }),
        { EX: 300 }
      );
    }

    const durationMs = Date.now() - start;

    pushPulseLog({
      ts: Date.now(),
      type: "ok",
      path: target,
      route: "/TPProxy",
      bytes,
      durationMs,
      system,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      error: null
    });

    updateUserMetrics(userId, {
      bytes,
      durationMs,
      event: "ok"
    });

    res
      .set("x-pulse-bytes", String(bytes))
      .set("x-pulse-chunks", String(chunks.length))
      .set("x-pulse-cache", rememberMe ? "miss" : "bypass")
      .set("content-type", contentType)
      .send(buf);
  } catch (err) {
    const durationMs = Date.now() - start;

    const errorPayload = {
      target,
      error: String(err),
      durationMs,
      system,
      rememberMe,
      ip,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      ...PROXY_CONTEXT
    };

    global.__lastProxyError = String(err);
    healingState.lastProxyError = String(err);
    healingState.status = "warning";

    pushPulseLog({
      ts: Date.now(),
      type: "error",
      path: target,
      route: "/TPProxy",
      bytes: 0,
      durationMs,
      system,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      error: String(err)
    });

    updateUserMetrics(userId, {
      event: "error",
      durationMs
    });

    await sendCriticalEmail("[PULSE CRITICAL] Proxy failure", errorPayload);

    res.status(502).json({ error: "pulse_proxy_failed" });
  }
});

// ------------------------------------------------------
//  HEALTH — PROXY VITALS SNAPSHOT
// ------------------------------------------------------
app.get("/pulse-proxy/health", async (req, res) => {
  const now = Date.now();
  healingState.lastHealthCheck = now;

  const start = process.hrtime.bigint();
  await Promise.resolve();
  const end = process.hrtime.bigint();
  const eventLoopLag = Number(end - start) / 1e6;

  const tlsProto = req.socket.getProtocol?.() || null;

  const status = redisReady ? "OK!" : "Degraded";

  if (status !== "OK!") {
    console.warn(
      "%c[HEALTH] Degraded state detected — Redis disabled or unavailable.",
      "color:#FF9800; font-weight:bold;"
    );
  }

  res.json({
    ...PROXY_CONTEXT,
    status,
    ts: now,
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

// ------------------------------------------------------
//  METRICS — PROXY VITALS PANEL
// ------------------------------------------------------
app.get("/pulse-proxy/metrics", async (req, res) => {
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

    timestamp: now,
    uptime: Math.round((now - START_TIME) / 1000),
    coldStart: START_TIME === global.__lastStartTime,

    totalRequests: pulseLogs.length,
    requestsPerMinute: Math.round(
      (pulseLogs.length / ((now - START_TIME) / 60000)) || 0
    ),

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
      pressure: Number(
        ((mem.heapUsed / mem.heapTotal) * 100).toFixed(2)
      )
    }
  });
});

// ------------------------------------------------------
//  NODE INFO — BACKEND BODY CARD
// ------------------------------------------------------
app.get("/pulse-proxy/node", async (req, res) => {
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

// ------------------------------------------------------
//  PING (Unified Physics) — REFLEX TEST
// ------------------------------------------------------
app.get("/pulse-proxy/ping", async (req, res) => {
  const t0 = Date.now();
  healingState.lastPingCheck = t0;

  const proxyBase = {
    ok: true,
    message: "pong",
    timestamp: Date.now()
  };

  const proxyPayload = JSON.stringify(proxyBase);
  const proxyBytes = Buffer.byteLength(proxyPayload, "utf8");
  const reqBytes = 0;

  const t1 = Date.now();
  const proxyRtt = Math.max(1, t1 - t0);
  const proxyPacketKB = Math.max(0.001, (proxyBytes + reqBytes) / 1024);
  const proxyMsPerKB = proxyRtt / proxyPacketKB;
  const proxyKbps = 1000 / proxyMsPerKB;

  let backend = {
    ok: false,
    rtt: null,
    kbps: null,
    msPerKB: null,
    error: null
  };

  try {
    const b0 = Date.now();
    const backendRes = await fetch("https://www.tropicpulse.bz/ping", {
      method: "GET",
      cache: "no-store"
    });
    const b1 = Date.now();
    const backendJson = await backendRes.json().catch(() => ({}));

    backend.ok = true;
    backend.rtt = backendJson.rtt ?? b1 - b0;
    backend.kbps = backendJson.kbps ?? null;
    backend.msPerKB = backendJson.msPerKB ?? null;
  } catch (err) {
    backend.error = String(err);
    healingState.lastError = String(err);
    console.warn(
      "%c[PING] Backend ping failed:",
      "color:#FF9800; font-weight:bold;",
      String(err)
    );
  }

  const unified = {
    ...PROXY_CONTEXT,
    ok: true,
    route: "Primary",

    proxy: {
      rtt: proxyRtt,
      kbps: proxyKbps,
      msPerKB: proxyMsPerKB
    },

    backend,

    latency: backend.ok && backend.rtt ? proxyRtt + backend.rtt : proxyRtt,

    kbps: backend.ok && backend.kbps ? backend.kbps : proxyKbps,

    timestamp: Date.now()
  };

  res.json(unified);
});

// ------------------------------------------------------
//  Packet Worker + Orchestrator (kept as‑is, now observed)
// ------------------------------------------------------
async function processWorker({
  fileId,
  totalPackets,
  instanceId = 0,
  activeInstances = null,
  readPacketExists,
  writePacket,
  generatePacketData
}) {
  let start = 0;
  let step = 1;

  if (typeof activeInstances === "number" && activeInstances > 0) {
    const sliceSize = Math.floor(totalPackets / activeInstances);
    start = sliceSize * instanceId;
    step = 1;
  } else {
    start = instanceId * 4;
    step = 4;
  }

  for (
    let packetIndex = start;
    packetIndex < totalPackets;
    packetIndex += step
  ) {
    const exists = await readPacketExists(fileId, packetIndex);
    if (exists) continue;

    const packetData = await generatePacketData(fileId, packetIndex);
    await writePacket(fileId, packetIndex, packetData);
  }

  return {
    instanceId,
    mode: activeInstances ? "dynamic" : "fallback",
    start,
    step,
    status: "complete"
  };
}

async function runInstanceOrchestrator() {
  const totalPackets = 10000;
  const activeInstances = 1;
  const instanceId = 0;

  try {
    console.log(
      "%c[PACKET WORKER] Starting instance:",
      "color:#03A9F4; font-weight:bold;",
      instanceId,
      "totalPackets:",
      totalPackets
    );
    const result = await processWorker({
      fileId: "default",
      totalPackets,
      instanceId,
      activeInstances,
      readPacketExists,
      writePacket,
      generatePacketData
    });
    console.log(
      "%c[PACKET WORKER] Completed instance:",
      "color:#03A9F4; font-weight:bold;",
      result
    );
  } catch (err) {
    healingState.lastError = String(err);
    console.error(
      "%c[InstanceOrchestrator ERROR]",
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

// ------------------------------------------------------
// START — ALWAYS RUN — NEVER REMOVE ABILITIES
// ------------------------------------------------------
async function init() {
  console.log(
    "%c[PULSE BOOT] Initializing Pulse Engine (Proxy Spine)…",
    "color:#03A9F4; font-weight:bold;"
  );

  if (redis) {
    try {
      await redis.connect();
      redisReady = true;
      console.log(
        "%c[REDIS] Connected",
        "color:#4CAF50; font-weight:bold;"
      );
    } catch (err) {
      global.__lastRedisError = String(err);
      healingState.lastRedisError = String(err);
      console.error(
        "%c[REDIS INIT ERROR]",
        "color:#FF5252; font-weight:bold;",
        err
      );
      console.log(
        "%c[REDIS] Failing open — continuing without Redis.",
        "color:#FFC107; font-weight:bold;"
      );
    }
  }

  setInterval(runInstanceOrchestrator, 1000);

  app.listen(PORT, () => {
    console.log(
      "%c[PULSE BOOT] Pulse Engine running on " +
        PORT +
        " | Redis: " +
        (redisReady ? "OK" : "DISABLED") +
        " | Region: " +
        CLOUD_REGION +
        " | Node: " +
        NODE_ID +
        " | Version: " +
        PULSE_VERSION,
      "color:#03A9F4; font-weight:bold;"
    );
  });
}

init();

// ------------------------------------------------------
// Export healing metadata for PulseProxyHealer
// ------------------------------------------------------
export function getPulseProxyHealingState() {
  return { ...healingState };
}
