// ============================================================================
//  PULSE OS v10.4 — PULSE PROXY SPINE (BACKEND SPINE)
//  Unified TPProxy Gateway • Vitals Pump • OS‑Healer Feed
//  ORGANISM‑CORRECT BACKEND ORGAN — NO BUSINESS LOGIC.
// ============================================================================

const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ============================================================================
//  SPINE IDENTITY — v10.4
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "BackendSpine",
  version: "10.4",
  identity: "PulseProxySpine",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    futureEvolutionReady: true
  }
};

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
  "%c🟦 PulseProxySpine v10.4 online — backend spine + vitals pump active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  HEALING METADATA — OS-visible heartbeat for PulseProxyHealer (v10.4)
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


// Packet Engine (PulseEarn organ)
import {
  readPacketExists,
  writePacket,
  generatePacketData
} from "./pulse-earn/PacketEngine.js";

// ICU Vitals Monitor
import { updateUserMetrics as recordUserMetrics } from "./pulse-os/PulseUserMetrics.js";

// OS‑level organs (Heart, OSKernel, Immune Layers)
import startPulseTimer from "./PulseProxyHeart.js";
import startPulseOS from "./pulse-os/PulseOS.js";
import startPulseOSHealer from "./pulse-os/PulseOSHealer.js";
import startGlobalHealer from "../pulse-os/GlobalHealer.js";

// ============================================================================
//  SINGLE‑BOOT GUARDS — unchanged
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
//  APP + ENV — unchanged
// ============================================================================
const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================================
//  ENV + IDENTITY + MODE — v10.4
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

const PULSE_VERSION = "v10.4";

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
//  GLOBAL REQUEST MIDDLEWARE — v10.4
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
//  REDIS — v10.4 (Fail‑open, drift‑proof)
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
//  VAULT PATCH (Lore) — v10.4
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
//  MAILER — v10.4 (Critical alerts only, fail‑open)
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
  log("%c[SPINE BOOT] Mailer enabled — critical alerts will be sent.", "color:#4CAF50; font-weight:bold;");
} else {
  log("%c[SPINE BOOT] Mailer disabled — EMAIL_PASSWORD / SMTP config missing.", "color:#FFC107; font-weight:bold;");
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
//  (Next: UNIVERSAL PROXY — TPProxy v10.4 …)
// ============================================================================
// ============================================================================
//  UNIVERSAL PROXY — TPProxy v10.4
//  Unified Fetch Gateway • Safe Fail‑Open • Vitals Pump • Advantage‑Aware
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
  try { system = sysHeader ? JSON.parse(sysHeader) : null; } catch {}

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
  //  OFFLINE MODE — Local‑Only Behavior
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
  //  ONLINE MODE — Full Internet‑Enabled Proxy Behavior
  // ========================================================================
  try {
    let warmDuration = 0;

    if (rememberMe) {
      const warmStart = Date.now();
      await warmConnection(target);
      warmDuration = Date.now() - warmStart;
    }

    // Redis Cache Hit
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

    // Upstream Fetch
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
//  HEALTH — PROXY VITALS SNAPSHOT (v10.4)
// ============================================================================
app.get("/pulse-proxy/health", async (req, res) => {
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
//  METRICS — ICU‑Grade Telemetry (v10.4)
// ============================================================================
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
//  NODE INFO — BACKEND BODY CARD (v10.4)
// ============================================================================
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
//  PING — REFLEX TEST (v10.4)
// ============================================================================
app.get("/pulse-proxy/ping", async (req, res) => {
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
//  EXPORT (v10.4)
// ============================================================================
export default app;
