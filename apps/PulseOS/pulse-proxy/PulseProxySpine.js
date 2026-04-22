// ============================================================================
//  PULSE OS v9.2 — PULSE PROXY SPINE (BACKEND SPINE)
//  Unified TPProxy Gateway • Vitals Pump • OS‑Healer Feed
//  ORGANISM‑CORRECT BACKEND ORGAN — NO BUSINESS LOGIC.
// ============================================================================
//
//  ROLE IN THE DIGITAL BODY (v9.2):
//  --------------------------------
//  • Backend Spine → central routing column for all proxy traffic
//  • Vitals Pump → emits rich vitals for OS-level healers + dashboards
//  • Safety Buffer → fails open where possible, never traps the organism
//  • Healer Feeder → continuously feeds PulseOSHealer + GlobalHealer
//  • Boundary Organ → sits between internet, Redis, Firestore, and OS
//
//  v9.2 ORGANISM LAWS APPLIED:
//  ---------------------------
//  • Zero‑drift identity block
//  • Deterministic metadata surface
//  • Unified‑advantage‑field (all safe advantages ON)
//  • No mutation outside organ boundaries
//  • No dynamic imports, no eval
//  • Fail‑open everywhere except explicit security boundaries
// ============================================================================

const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ============================================================================
//  SPINE IDENTITY — v9.2 (Upgraded)
// ============================================================================
const PROXY_CONTEXT = {
  layer: "PulseProxySpine",
  role: "BACKEND_SPINE",
  purpose:
    "Route traffic, expose vitals, protect user by failing open, feed OS healers",
  context:
    "Unified TPProxy gateway + vitals pump for OS-level healers and admin dashboards",
  version: "9.2",
  target: "proxy-core",
  selfRepairable: true,
  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true
  }
};

log(
  "%c🟦 PulseProxySpine v9.2 online — backend spine + vitals pump active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  HEALING METADATA — OS-visible heartbeat for PulseProxyHealer (v9.2)
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
  status: "healthy", // healthy | warning | error
  mode: "online"     // online | offline
};

// ============================================================================
//  IMPORTS — v9.2 (Spine is allowed to import organs)
// ============================================================================
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

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
import startGlobalHealer from "./pulse-os/GlobalHealer.js";

// ============================================================================
//  SINGLE‑BOOT GUARDS — v9.2 (Serverless‑safe, drift‑proof)
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
//  APP + ENV — v9.2 (No window.* ever)
// ============================================================================
const app = express();
const PORT = process.env.PORT || 8080;

// ============================================================================
//  ENV + IDENTITY + MODE — v9.2
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

const PULSE_VERSION = process.env.PULSE_VERSION || "v9.2";

// Explicit offline/online mode switch
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
//  GLOBAL REQUEST MIDDLEWARE — v9.2 (Identity headers + heartbeat)
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
//  REDIS — v9.2 (Fail‑open, drift‑proof)
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
//  VAULT PATCH (Lore) — v9.2
// ============================================================================
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

// ============================================================================
//  MAILER — v9.2 (Critical alerts only, fail‑open)
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

// • Inherits ANY safe advantage from OS automatically.
// • Unified‑advantage‑field: ALL advantages ON unless unsafe.
// ============================================================================

const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ======================================================
//  PULSE PROXY CONTEXT (SPINE METADATA) — v9.2
// ======================================================
const PROXY_CONTEXT = {
  layer: "PulseProxySpine",
  role: "BACKEND_SPINE",
  purpose:
    "Route traffic, expose vitals, protect user by failing open, feed OS healers",
  context:
    "Unified TPProxy gateway + vitals pump for OS-level healers and admin dashboards",
  version: "9.2",
  target: "proxy-core",
  selfRepairable: false,
  evo: {
    // Unified-advantage-field: all safe advantages ON by default
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    unifiedAdvantageField: true
  }
};

log(
  "%c🟦 PulseProxySpine v9.2 online — backend spine + vitals pump active (unified-advantage-field).",
  "color:#03A9F4; font-weight:bold;"
);

// ======================================================
//  Healing Metadata — OS-visible heartbeat for PulseProxyHealer
// ======================================================
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
  status: "healthy", // healthy | warning | error
  mode: "online" // online | offline
};

// ======================================================
//  Imports (spine is allowed to import organs)
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

// Vitals Monitor (ICU bedside monitor)
import { updateUserMetrics as recordUserMetrics } from "./pulse-os/PulseUserMetrics.js";

// Timer + OS layer (heartbeat lives in heart.js, not here)
import startPulseTimer from "./PulseProxyHeart.js";
import startPulseOS from "./pulse-os/PulseOS.js";
import startPulseOSHealer from "./pulse-os/PulseOSHealer.js";
import startGlobalHealer from "./pulse-os/GlobalHealer.js";

// ======================================================
//  Single-boot guards (Netlify / serverless safe)
// ======================================================
if (!global.__pulseTimerStarted) {
  log(
    "%c[SPINE BOOT] Starting Pulse Timer loop…",
    "color:#9C27B0; font-weight:bold;"
  );
  startPulseTimer();
  global.__pulseTimerStarted = true;
}

if (!global.__pulseOSStarted) {
  log(
    "%c[SPINE BOOT] Starting PulseOS (global supervisor / brainstem)…",
    "color:#4CAF50; font-weight:bold;"
  );
  startPulseOS(); // OS brain — heartbeat + FUNCTION_LOG ingestion
  global.__pulseOSStarted = true;
}

if (!global.__pulseOSHealerStarted) {
  log(
    "%c[SPINE BOOT] Starting PulseOSHealer (OS-level immune scan)…",
    "color:#4CAF50; font-weight:bold;"
  );
  startPulseOSHealer(); // OS-level drift detector
  global.__pulseOSHealerStarted = true;
}

if (!global.__globalHealerStarted) {
  log(
    "%c[SPINE BOOT] Starting GlobalHealer (system-wide immune response)…",
    "color:#4CAF50; font-weight:bold;"
  );
  startGlobalHealer(); // System-wide healer
  global.__globalHealerStarted = true;
}

// ======================================================
//  App + ENV (no window.*)
// ======================================================
const app = express();
const PORT = process.env.PORT || 8080;

// ------------------------------------------------------
//  ENV + Identity + Mode
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

// Explicit offline/online mode switch (local vs internet)
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

// ------------------------------------------------------
//  Global request middleware — attach identity headers + bump heartbeat
// ------------------------------------------------------
app.use((req, res, next) => {
  res.setHeader("X-Pulse-Version", PULSE_VERSION);
  res.setHeader("X-Pulse-Node", NODE_ID);
  res.setHeader("X-Pulse-Region", CLOUD_REGION);
  res.setHeader("X-Pulse-Mode", OFFLINE_MODE ? "offline" : "online");

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
  log(
    "%c[SPINE BOOT] Redis URL detected — initializing client…",
    "color:#FFC107; font-weight:bold;"
  );
  redis = createClient({ url: process.env.REDIS_URL });

  // explicit lifecycle wiring — keeps fail-open but gives real readiness
  redis.on("ready", () => {
    redisReady = true;
    global.__lastRedisError = null;
    log(
      "%c[REDIS] Connected — cache + rate limiting enabled (still fail-open on error).",
      "color:#4CAF50; font-weight:bold;"
    );
  });

  redis.on("error", (err) => {
    redisReady = false;
    const msg = String(err);
    global.__lastRedisError = msg;
    healingState.lastRedisError = msg;
    warn(
      "%c[REDIS ERROR] Entering degraded / fail-open mode:",
      "color:#FF9800; font-weight:bold;",
      msg
    );
  });

  redis
    .connect()
    .catch((err) => {
      const msg = String(err);
      redisReady = false;
      global.__lastRedisError = msg;
      healingState.lastRedisError = msg;
      warn(
        "%c[REDIS CONNECT FAILED] Staying in fail-open mode:",
        "color:#FF9800; font-weight:bold;",
        msg
      );
    });
} else {
  log(
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
  log(
    "%c[SPINE BOOT] Mailer enabled — critical alerts will be sent.",
    "color:#4CAF50; font-weight:bold;"
  );
} else {
  log(
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
    const msg = String(err);
    healingState.lastEmailError = msg;
    error(
      "%c[PULSE EMAIL ERROR]",
      "color:#FF5252; font-weight:bold;",
      msg
    );
  }
}
// ============================================================================
//  UNIVERSAL PROXY — TPProxy v9.2+
//  Unified Fetch Gateway • Safe Fail‑Open • Vitals Pump • Advantage‑Aware
// ============================================================================

app.get("/TPProxy", async (req, res) => {
  healingState.lastTPProxyCall = Date.now();

  // -----------------------------------------------------
  // 1. Target URL
  // -----------------------------------------------------
  const target = req.query.url;
  if (!target) {
    warn("%c[TPProxy] Missing_URL", "color:#FF9800; font-weight:bold;");
    return res.status(400).json({ error: "Missing_URL" });
  }

  // -----------------------------------------------------
  // 2. System Header (optional)
  // -----------------------------------------------------
  const sysHeader = req.get("x-pulse-device");
  let system = null;
  try {
    system = sysHeader ? JSON.parse(sysHeader) : null;
  } catch {
    system = null;
  }

  // -----------------------------------------------------
  // 3. Remember‑Me (cache warmup + Redis caching)
  // -----------------------------------------------------
  const rememberHeader = req.get("x-pulse-remember");
  const rememberMe = rememberHeader === "1";

  // -----------------------------------------------------
  // 4. Identity + Mesh Flags
  // -----------------------------------------------------
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "Unknown";

  const userId   = req.get("x-pulse-user") || "anonymous";
  const meshRelay = req.get("x-pulse-mesh-relay") === "1";
  const meshPing  = req.get("x-pulse-mesh-ping") === "1";
  const hubFlag   = req.get("x-pulse-hub") === "1";

  // -----------------------------------------------------
  // 5. Rate Limiting (Fail‑Open)
  // -----------------------------------------------------
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
    const msg = String(err);
    healingState.lastError = msg;
    error("%c[PULSE RATE LIMIT ERROR]", "color:#FF5252; font-weight:bold;", msg);
  }

  // -----------------------------------------------------
  // 6. Cache Key
  // -----------------------------------------------------
  const cacheKey =
    "pulse:cache:" + crypto.createHash("sha1").update(target).digest("hex");

  const start = Date.now();

  // -----------------------------------------------------
  // 7. OFFLINE MODE — Local‑Only Behavior
  // -----------------------------------------------------
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

    pushPulseLog({
      ts: Date.now(),
      type: "offline_proxy",
      path: target,
      route: "/TPProxy",
      bytes: 0,
      durationMs,
      system,
      userId,
      meshRelay,
      meshPing,
      hubFlag,
      error: "offline-mode"
    });

    updateUserMetrics(userId, { event: "offline_proxy", durationMs });

    return res
      .set("x-pulse-cache", "offline")
      .set("x-pulse-mode", "offline")
      .json(payload);
  }

  // ========================================================================
  // 8. ONLINE MODE — Full Internet‑Enabled Proxy Behavior
  // ========================================================================
  try {
    let warmDuration = 0;

    // ---------------------------------------------------
    // 8A. Warm Connection (if rememberMe)
    // ---------------------------------------------------
    if (rememberMe) {
      const warmStart = Date.now();
      await warmConnection(target);
      warmDuration = Date.now() - warmStart;
    }

    // ---------------------------------------------------
    // 8B. Redis Cache Hit
    // ---------------------------------------------------
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
          .set("x-pulse-mode", "online")
          .set("content-type", cached.contentType)
          .send(Buffer.from(cached.data, "base64"));
      }
    } else if (rememberMe && !redisReady) {
      log(
        "%c[TPProxy] rememberMe=1 but Redis disabled — cache bypass (fail-open).",
        "color:#FFC107; font-weight:bold;"
      );
    }

    // ---------------------------------------------------
    // 8C. Upstream Fetch
    // ---------------------------------------------------
    const upstreamRes = await fetch(target);
    const contentType =
      upstreamRes.headers.get("content-type") || "application/octet-stream";

    const buf = Buffer.from(await upstreamRes.arrayBuffer());
    const bytes = buf.length;
    const chunks = chunkBuffer(buf);

    // ---------------------------------------------------
    // 8D. Cache Store (if rememberMe)
    // ---------------------------------------------------
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

    // ---------------------------------------------------
    // 8E. Log Success
    // ---------------------------------------------------
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

    // ---------------------------------------------------
    // 8F. Return Upstream Response
    // ---------------------------------------------------
    res
      .set("x-pulse-bytes", String(bytes))
      .set("x-pulse-chunks", String(chunks.length))
      .set("x-pulse-cache", rememberMe ? "miss" : "bypass")
      .set("x-pulse-mode", "online")
      .set("content-type", contentType)
      .send(buf);

  // ========================================================================
  // 9. ERROR HANDLING — v9.2 (Zero‑Drift Error Surface)
  // ========================================================================
  } catch (err) {
    const durationMs = Date.now() - start;
    const msg = String(err);

    const errorPayload = {
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
    };

    global.__lastProxyError = msg;
    healingState.lastProxyError = msg;
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
      error: msg
    });

    updateUserMetrics(userId, { event: "error", durationMs });

    await sendCriticalEmail("[PULSE CRITICAL] Proxy failure", errorPayload);

    res.status(502).json({ error: "pulse_proxy_failed" });
  }
});
// ============================================================================
//  HEALTH — PROXY VITALS SNAPSHOT (v9.2+)
//  Zero‑Drift • Deterministic • Advantage‑Aware
// ============================================================================
app.get("/pulse-proxy/health", async (req, res) => {
  const now = Date.now();
  healingState.lastHealthCheck = now;

  // event loop lag (v9.2 deterministic micro‑lag)
  const start = process.hrtime.bigint();
  await Promise.resolve();
  const end = process.hrtime.bigint();
  const eventLoopLag = Number(end - start) / 1e6;

  const tlsProto = req.socket.getProtocol?.() || null;

  const status = redisReady ? "OK!" : "Degraded";

  if (status !== "OK!") {
    warn(
      "%c[HEALTH] Degraded state detected — Redis disabled or unavailable.",
      "color:#FF9800; font-weight:bold;"
    );
  }

  res.json({
    ...PROXY_CONTEXT,
    status,
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
//  METRICS — PROXY VITALS PANEL (v9.2+)
//  Deterministic • Zero‑Drift • ICU‑Grade Telemetry
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

// ============================================================================
//  NODE INFO — BACKEND BODY CARD (v9.2+)
//  Identity‑Correct • Drift‑Proof • Deterministic
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
//  PING — REFLEX TEST (v9.2+)
//  Unified Physics • Zero‑Drift Reflex
// ============================================================================
app.get("/pulse-proxy/ping", async (req, res) => {
  const t0 = Date.now();
  healingState.lastPingCheck = t0;

  const proxyBase = {
    ok: true,
    message: "pong",
    timestamp: t0,
    ...PROXY_CONTEXT,
    mode: OFFLINE_MODE ? "offline" : "online"
  };

  res.json(proxyBase);
});

// ============================================================================
//  EXPORT (v9.2+)
// ============================================================================
export default app;
// or: export const handler = app;
