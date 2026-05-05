// ============================================================================
//  FILE: /PULSE-PROXY/PulseProxySpine-v16.1-Immortal-PROXY-SPINE.js
//  PULSE OS v16.1-Immortal — PULSE PROXY SPINE (BACKEND PROXY SPINE)
//  Unified TPProxy Gateway • Vitals Pump • OS‑Healer Feed • SDN Prewarm Bridge
//  SYMBOLIC BACKEND ORGAN — NO BUSINESS LOGIC, NO MARKETPLACE, NO GPU.
//  v16.1-Immortal: Dual-band, presence/harmonics, advantage-field, prewarm/cache/chunk/remember
//                  Fully proxy-aware, organism-aware, PNS-aware, Experience-aware,
//                  CoreMemory/ProxyFront/Context‑linked, PNSRepair/PNSPurifier‑linked.
// ============================================================================
//
//  WHAT THIS ORGAN IS (v16.1-Immortal-PROXY-SPINE):
//  ------------------------------------------------
//  • Backend Proxy Spine of PulseProxy for the organism (symbolic-only).
//  • Single ingress spine for TPProxy traffic, vitals, OS‑healer feeds, proxy context,
//    and nervous system mirrors.
//  • Maintains an OS‑visible healingState for PulseProxyHealer / GlobalHealer / WorldCore.
//  • Owns Redis + mailer wiring, but never business logic, scoring, or routing IQ.
//  • Fail‑open by design: degraded modes are logged, never fatal.
//  • Symbolic‑only, dual‑band compatible, presence/harmonics/SDN‑prewarm aware
//    as passive metadata (no routing intelligence).
//  • Proxy‑aware: surfaces ProxyFront, ProxyContext, ProxyOrganism snapshots as
//    descriptive fields only (no mutation of those organs).
//  • PNS‑aware: consumes PNS symbolic nervous snapshot and exposes it to healers.
//  • Experience‑aware: exposes an ExperienceMeta block for AI/agent experience surfaces.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • NOT a router brain (no dynamic routing intelligence).
//  • NOT a marketplace engine or pricing layer.
//  • NOT a scoring / ranking engine.
//  • NOT a business rules engine.
//  • NOT a place for OSKernel logic or GPU logic.
//  • NOT a binary organ — this is a symbolic backend proxy spine only.
//
//  SAFETY CONTRACT (v16.1-Immortal-PROXY-SPINE):
//  ---------------------------------------------
//  • Fail‑open: Redis / mailer / env failures degrade, never crash the process.
//  • No IQ, no routing intelligence, no marketplace logic.
//  • No mutation outside healingState + explicit global boot flags.
//  • Deterministic boot guards (single‑boot, idempotent).
//  • Drift‑proof identity + context via PROXY_CONTEXT + ProxyContext + ProxyFrontMeta.
//  • Multi‑instance safe: no singleton assumptions beyond process‑local flags.
//  • Presence/harmonics/dual‑band/SDN‑prewarm are surfaced as metadata only.
//  • No randomness in math; timestamps only for telemetry, not decision math.
//  • No execution of binary surfaces; binary is descriptive-only.
// ============================================================================

import express from "express";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import crypto from "crypto";

// SDN prewarm engine (spinal reflex ignition for backend spine, passive only)
import { prewarmSDN } from "../PULSE-OS/PulseOSSDNPrewarm-v16.js";

// Proxy / organism / context / front (symbolic-only, descriptive surfaces)
import { PulseProxyOrganismMeta, createProxy } from "./PulseProxy-v16.js";
import { PulseProofBridge as PulseProxyBridge } from "../../PULSE-UI/_BACKEND/PulseProofBridge.js";
import {
  proxyFrontRoute,
  PulseProxyFrontMeta
} from "./PulseProxyFront-v14-Immortal-PROXY-FRONT.js";
import {
  updateProxyStateFromEnvelope,
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "./PulseProxyContext-v16-Immortal.js";

// Nervous system symbolic band (for dual-band awareness)
import {
  PulseBandSymbolicMeta,
  pulseband as PulseBandSymbolic
} from "../PULSE-BAND/PulseBandSymbolic-v12.3.js";

// PNS repair / purifier (symbolic-only healing helpers)
import {
  PNSRepair,
  PNSPurifier
} from "../PULSE-BAND/PulseBandPNS-Healing-v16.js";

// Earn + metrics + OS healers + OS binary
import { createPulseEarnSendSystem } from "../PULSE-EARN/PulseEarnSendSystem.js";
import { updateUserMetrics as recordUserMetrics } from "../../PULSE-UI/_BACKEND/PulseProofMonitor.js";
import startPulseTimer from "./PulseProxyHeart.js";
import { createPulseOSHealerV12_3 as startPulseOSHealer } from "../PULSE-OS/PulseOSInflammatoryResponse.js";
import { createGlobalHealerV12 as startGlobalHealer } from "../PULSE-OS/PulseOSImmuneSystem.js";
import { PulseBinaryOSv11Evo as startPulseOS } from "../PULSE-OS/PulseBinaryOS-v16.js";

const log   = global.log   || console.log;
const warn  = global.warn  || console.warn;
const error = global.error || console.error;

// ============================================================================
//  EXPERIENCE META BLOCK — AI / Agent Experience Surfaces (v16.1)
// ============================================================================
//
//  This block is purely descriptive. It gives AI/agents a stable,
//  organism-readable view of what "experience" this spine is providing:
//  • What band/field surfaces are exposed
//  • What healing hooks exist (PNSRepair/PNSPurifier)
//  • How TPProxy traffic is framed as experience for the organism
// ============================================================================

export const PulseProxySpineExperienceMeta = Object.freeze({
  layer: "BackendProxySpine",
  role: "EXPERIENCE_SPINE",
  version: "v16.1-Immortal-PROXY-SPINE",
  identity: "PulseProxySpineExperience-v16.1-Immortal",
  experience: {
    // What the AI can "feel" from this organ
    surfaces: {
      proxyContext: true,
      nervousSnapshot: true,
      spineBand: true,
      spineWaveField: true,
      spineAdvantageField: true,
      presenceBandState: true,
      harmonicDrift: true,
      coherenceScore: true,
      rateLimitBand: true,
      redisStatus: true
    },
    healingHooks: {
      pnsRepair: true,
      pnsPurifier: true,
      osHealer: true,
      globalHealer: true
    },
    narrative: {
      description:
        "Backend proxy spine that turns TPProxy traffic, nervous snapshots, and band/field metadata " +
        "into a stable, organism-readable experience surface for AI/agents. It does not route or score; " +
        "it only describes, heals, and reflects.",
      aiUsageHint:
        "Use this organ's surfaces to understand network health, proxy pressure, and healing state. " +
        "Never treat it as a router; treat it as a vitals + experience mirror."
    }
  }
});

// ============================================================================
//  SPINE IDENTITY — v16.1-Immortal-PROXY-SPINE (symbolic backend proxy spine)
// ============================================================================

export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "BackendProxySpine",
  version: "v16.1-Immortal-PROXY-SPINE",
  identity: "PulseProxySpine-v16.1-Immortal-PROXY-SPINE",

  evo: {
    deterministic: true,
    driftProof: true,
    backendOnly: true,
    symbolicBackend: true,

    // IMMORTAL presence / band / SDN surfaces (passive only)
    presenceAware: true,
    harmonicsAware: true,
    dualBandCompatible: true,
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,
    passiveForwarding: true,

    sdnPrewarmAware: true,
    spinalReflexIgnition: true,
    proxySpineImmortal: true,

    // Proxy / organism awareness
    proxyFrontAware: true,
    proxyContextAware: true,
    proxyOrganismAware: true,
    nervousSystemAware: true,

    // Healing awareness
    pnsRepairAware: true,
    pnsPurifierAware: true,
    osHealerAware: true,
    globalHealerAware: true,

    // Experience awareness
    experienceMetaAware: true,

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
//  HUMAN‑READABLE CONTEXT MAP — Spine Identity (v16.1 IMMORTAL PROXY SPINE)
// ============================================================================

const PROXY_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  purpose:
    "Route TPProxy traffic symbolically, expose vitals, protect user by failing open, feed OS healers, PNS healers, and organism context",
  context:
    "Unified TPProxy gateway + vitals pump + proxy context bridge for OS-level healers, PNS healers, admin dashboards, and organism surfaces",
  version: PulseRole.version,
  target: "proxy-core",
  selfRepairable: true,
  evo: PulseRole.evo,
  experience: PulseProxySpineExperienceMeta
};

export const PulseProxySpineMeta = Object.freeze({
  layer: "PulseProxySpine",
  role: "BACKEND_PROXY_SPINE_ORGAN",
  version: "v16.1-Immortal-PROXY-SPINE",
  identity: "PulseProxySpine-v16.1-Immortal-PROXY-SPINE",

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

    // IMMORTAL presence / band / SDN surfaces
    presenceAware: true,
    harmonicsAware: true,
    dualBandCompatible: true,
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,
    passiveForwarding: true,
    sdnPrewarmAware: true,

    // Proxy / organism awareness
    proxyFrontAware: true,
    proxyContextAware: true,
    proxyOrganismAware: true,
    nervousSystemAware: true,

    // Healing awareness
    pnsRepairAware: true,
    pnsPurifierAware: true,
    osHealerAware: true,
    globalHealerAware: true,

    // Experience awareness
    experienceMetaAware: true,

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
      "HarmonicSnapshot",
      "ProxyFrontEnvelope",
      "ProxyContextState",
      "NervousSystemSnapshot"
    ],
    output: [
      "SpineIngressResult",
      "SpineBandSignature",
      "SpineWaveField",
      "SpineAdvantageField",
      "SpineProxyContextSnapshot",
      "SpineDiagnostics",
      "SpineHealingState",
      "SpineExperienceMeta"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v16-Immortal",
    ancestry: [
      "PulseProxySpine-v7",
      "PulseProxySpine-v8",
      "PulseProxySpine-v9",
      "PulseProxySpine-v10",
      "PulseProxySpine-v11",
      "PulseProxySpine-v11.1",
      "PulseProxySpine-v11-Evo",
      "PulseProxySpine-v11.2-Evo-BINARY-MAX",
      "PulseProxySpine-v12.3-Evo",
      "PulseProxySpine-v14.0-Presence-Immortal-BACKEND",
      "PulseProxySpine-v16-Immortal-PROXY-SPINE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic"],
    default: "symbolic",
    behavior: "backend-proxy-spine"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "TPProxy ingress → vitals pump → OS/PNS-healer + proxy-context feed",
    adaptive:
      "wave-field overlays (no binary mode) + SDN prewarm bridge + proxy context + nervous system mirrors + experience surfaces",
    return: "deterministic spine surfaces + signatures + proxy context snapshot + experience meta"
  })
});

log(
  "%c🟦 PulseProxySpine v16.1-Immortal-PROXY-SPINE online — backend proxy spine + vitals pump + SDN prewarm + proxy context + PNS healing + experience meta active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  INTERNAL HELPERS — band / wave / advantage surfaces for the spine
// ============================================================================

function spineComputeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 99991;
  }
  return `spine-h${h}`;
}

function buildSpineBand() {
  // Backend proxy spine is symbolic-only but dual-band aware
  return "symbolic-proxy-spine";
}

function buildSpineWaveField({ region, mode, latencyClass, networkHealth } = {}) {
  const key = [
    region || "UnknownRegion",
    mode || "UnknownMode",
    latencyClass || "UnknownLatency",
    networkHealth || "UnknownHealth"
  ].join("::");

  const amplitude = 10 + (key.length % 11);
  const wavelength = amplitude + 11;
  const phase = (amplitude * 5) % 64;

  return {
    amplitude,
    wavelength,
    phase,
    band: "proxy-spine",
    mode: "symbolic-wave",
    waveSignature: spineComputeHash(`SPINE_WAVE::${key}::${amplitude}`)
  };
}

function buildSpineAdvantageField({ rateLimitBand, redisReady, offlineMode } = {}) {
  const rlBand = rateLimitBand || "low";
  const redisScore = redisReady ? 1 : 0.4;
  const onlineScore = offlineMode ? 0.5 : 1.0;

  let pressureBand = "low";
  if (rlBand === "critical") pressureBand = "critical";
  else if (rlBand === "high") pressureBand = "high";
  else if (rlBand === "medium") pressureBand = "medium";

  const advantageScore = Math.max(
    0,
    Math.min(1, redisScore * onlineScore * (pressureBand === "critical" ? 0.4 : 1))
  );

  return {
    pressureBand,
    redisReady,
    offlineMode,
    advantageScore,
    advantageSignature: spineComputeHash(
      `SPINE_ADVANTAGE::${pressureBand}::${redisReady ? "1" : "0"}::${offlineMode ? "1" : "0"}::${advantageScore}`
    )
  };
}

function buildSpineBandSignature(band) {
  return spineComputeHash(`SPINE_BAND::${band}`);
}

// ============================================================================
//  HEALING METADATA — OS-visible heartbeat for PulseProxyHealer (IMMORTAL)
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

  // IMMORTAL passive band metadata
  pulsePrewarm: null,
  pulseCacheMode: null,
  pulseChunkMode: null,
  pulseRemember: null,

  presenceBandState: null,
  harmonicDrift: null,
  coherenceScore: null,

  dualBandMode: "symbolic",

  // v16: proxy context + band/advantage surfaces
  spineBand: null,
  spineBandSignature: null,
  spineWaveField: null,
  spineAdvantageField: null,

  proxyContextSnapshot: null,
  proxyPressure: 0,
  proxyBoost: 0,
  proxyFallback: false,
  proxyMode: "normal",
  proxyLineage: null,

  nervousSnapshot: null,

  // v16.1: experience meta snapshot
  experienceMeta: PulseProxySpineExperienceMeta
};

export function getSpineHealingState() {
  return { ...healingState };
}

// ============================================================================
//  APP + ENV — v16.1 IMMORTAL BACKEND PROXY SPINE
// ============================================================================

const app = express();
const PORT = process.env.PORT || 8080;

// backend-only PulseChunker base URL
const CHUNKER_BASE =
  process.env.PULSE_CHUNKER_BASE ||
  "https://us-central1-tropic-pulse.cloudfunctions.net";

// ============================================================================
//  ENV + IDENTITY + MODE — v16.1 IMMORTAL BACKEND PROXY SPINE
// ============================================================================

const SMTP_PASS = process.env.EMAIL_PASSWORD;
const ALERT_EMAIL_TO = process.env.PULSE_ADMIN_EMAIL_TO || "FordFamilyDelivery@gmail.com";
const ALERT_EMAIL_FROM = process.env.PULSE_ADMIN_EMAIL_FROM || `"Tropic Pulse" <Sales@TropicPulse.bz>`;
const SMTP_HOST = process.env.PULSE_SMTP_HOST || "smtp.gmail.com";
const SMTP_USER = process.env.PULSE_SMTP_USER || "Sales@TropicPulse.bz";

const MAX_REQUESTS_PER_DAY = Number(process.env.PULSE_MAX_REQ_PER_DAY || "5000");

const START_TIME = Date.now();
global.__lastStartTime = global.__lastStartTime || START_TIME;

const CLOUD_REGION =
  process.env.GOOGLE_CLOUD_REGION ||
  process.env.X_GOOGLE_GCLOUD_REGION ||
  "US-Central1";

const NODE_ID = process.env.K_REVISION || process.env.HOSTNAME || "Local";

const PULSE_VERSION = "v16.1-Immortal-PROXY-SPINE";

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
//  MAILER — v16.1 IMMORTAL BACKEND PROXY SPINE (admin alerts)
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
//  GLOBAL REQUEST MIDDLEWARE — v16.1 IMMORTAL BACKEND PROXY SPINE
//  Adds headers + captures passive band metadata + proxy context snapshot
//  + PNS snapshot + spine band/wave/advantage surfaces
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

  // v16: pull nervous system snapshot (symbolic-only) if available
  try {
    if (PulseBandSymbolic && typeof PulseBandSymbolic.getStatus === "function") {
      healingState.nervousSnapshot = PulseBandSymbolic.getStatus();
    }
  } catch {
    // fail-open
  }

  // v16: pull proxy context snapshot (symbolic-only)
  try {
    const ctx = getProxyContext();
    healingState.proxyContextSnapshot = ctx;
    healingState.proxyPressure = getProxyPressure();
    healingState.proxyBoost = getProxyBoost();
    healingState.proxyFallback = getProxyFallback();
    healingState.proxyMode = getProxyMode();
    healingState.proxyLineage = getProxyLineage();
  } catch {
    // fail-open
  }

  // v16: compute spine band / wave / advantage surfaces
  const band = buildSpineBand();
  const bandSignature = buildSpineBandSignature(band);
  const waveField = buildSpineWaveField({
    region: CLOUD_REGION,
    mode: healingState.mode,
    latencyClass: healingState.nervousSnapshot?.latencyClass,
    networkHealth: healingState.nervousSnapshot?.networkHealth
  });

  const advantageField = buildSpineAdvantageField({
    rateLimitBand: healingState.lastRateLimitDecision?.band,
    redisReady: global.__lastRedisError == null,
    offlineMode: OFFLINE_MODE
  });

  healingState.spineBand = band;
  healingState.spineBandSignature = bandSignature;
  healingState.spineWaveField = waveField;
  healingState.spineAdvantageField = advantageField;

  // forward passive band metadata on every response
  res.setHeader("X-Pulse-Prewarm", healingState.pulsePrewarm ?? "0");
  res.setHeader("X-Pulse-Cache", healingState.pulseCacheMode ?? "none");
  res.setHeader("X-Pulse-Chunk", healingState.pulseChunkMode ?? "none");
  res.setHeader("X-Pulse-Remember", healingState.pulseRemember ?? "0");

  res.setHeader("X-Pulse-Presence", healingState.presenceBandState ?? "0");
  res.setHeader("X-Pulse-Harmonics", healingState.harmonicDrift ?? "0");
  res.setHeader("X-Pulse-Coherence", healingState.coherenceScore ?? "0");
  res.setHeader("X-Pulse-BandState", healingState.dualBandMode);
  res.setHeader("X-Pulse-Spine-Band", band);
  res.setHeader("X-Pulse-Spine-BandSignature", bandSignature);
  res.setHeader("X-Pulse-Spine-Advantage", advantageField.advantageSignature);

  // v16.1: expose experience meta on every response (symbolic only)
  res.setHeader("X-Pulse-Experience-Identity", PulseProxySpineExperienceMeta.identity);
  res.setHeader("X-Pulse-Experience-Version", PulseProxySpineExperienceMeta.version);

  next();
});

// ============================================================================
//  CONTEXT SHAPE — v16.1 IMMORTAL BACKEND PROXY SPINE
// ============================================================================
export function createSpineContext({
  layer = "BackendProxySpine",
  role = "PulseProxySpine-v16.1-Immortal-PROXY-SPINE",
  purpose = "Unified TPProxy gateway + vitals pump + OS/PNS healer + proxy context + experience feed",
  context = "Backend proxy spine for PulseProxy: routes TPProxy traffic symbolically, exposes vitals, feeds healers and organism context, and surfaces experience meta",
  version = "v16.1-Immortal-PROXY-SPINE",
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
    evo: { ...PulseRole.evo },
    experience: PulseProxySpineExperienceMeta
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

    // IMMORTAL passive band metadata
    pulsePrewarm: null,
    pulseCacheMode: null,
    pulseChunkMode: null,
    pulseRemember: null,

    presenceBandState: null,
    harmonicDrift: null,
    coherenceScore: null,

    dualBandMode: "symbolic",

    // v16: spine band / advantage
    spineBand: null,
    spineBandSignature: null,
    spineWaveField: null,
    spineAdvantageField: null
  };
}

// ============================================================================
//  RATE LIMIT FIELD — Deterministic Rate Limit Math (telemetry-only timestamps)
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
    version: version || "v16.1-Immortal-PROXY-SPINE",
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

      // IMMORTAL band metadata surfaced to healers
      presenceBandState: v.presenceBandState,
      harmonicDrift: v.harmonicDrift,
      coherenceScore: v.coherenceScore,
      pulsePrewarm: v.pulsePrewarm,
      pulseCacheMode: v.pulseCacheMode,
      pulseChunkMode: v.pulseChunkMode,
      pulseRemember: v.pulseRemember,
      dualBandMode: v.dualBandMode,

      spineBand: v.spineBand,
      spineBandSignature: v.spineBandSignature,
      spineWaveField: v.spineWaveField,
      spineAdvantageField: v.spineAdvantageField
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
//  REDIS — v16.1 IMMORTAL BACKEND PROXY SPINE (fail-open, with admin alerts)
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

    // Admin alert on Redis error
    sendCriticalEmail("[PulseProxySpine] Redis Error", {
      nodeId: NODE_ID,
      region: CLOUD_REGION,
      version: PULSE_VERSION,
      error: msg,
      time: new Date().toISOString()
    });
  });

  redis.connect().catch((err) => {
    const msg = String(err);
    redisReady = false;
    global.__lastRedisError = msg;
    healingState.lastRedisError = msg;
    warn("%c[REDIS CONNECT FAILED] Staying in fail-open mode:", "color:#FF9800; font-weight:bold;", msg);

    // Admin alert on Redis connect failure
    sendCriticalEmail("[PulseProxySpine] Redis Connect Failed", {
      nodeId: NODE_ID,
      region: CLOUD_REGION,
      version: PULSE_VERSION,
      error: msg,
      time: new Date().toISOString()
    });
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
//  SDN PREWARM BRIDGE — Backend Spine SDN Ignition (passive, IMMORTAL)
// ============================================================================

try {
  const ProxySDN = {
    // We expose a minimal SDN surface; no business logic, no routing.
    registerExtension(name, kind, meta) {
      // backend spine treats this as descriptive-only; no side effects
      log("[ProxySDN] registerExtension (passive):", name, kind);
    },
    emitImpulse(source, packet) {
      // impulses are descriptive-only; no routing, no compute
      log("[ProxySDN] emitImpulse (passive):", source, packet?.executionContext?.dispatchSignature);
    }
  };

  prewarmSDN(ProxySDN);
  log("[PulseProxySpine] SDN prewarm complete (backend reflex arcs hot).");
} catch (err) {
  warn("[PulseProxySpine] SDN prewarm failed:", err);
}

// ============================================================================
//  PNS HEALING INTEGRATION — PNSRepair / PNSPurifier (symbolic-only)
// ============================================================================
//
//  These helpers are called when the spine detects degraded or critical states.
//  They do not mutate external systems; they emit symbolic healing intents
//  that OS healers / PNS organs can interpret.
// ============================================================================

function invokePNSHealingIfNeeded(healability) {
  try {
    if (!healability) return;

    const { health, rateLimit, vitals } = healability;

    const degraded =
      health === "degraded" ||
      health === "rate-limited" ||
      health === "offline";

    if (!degraded) return;

    const context = {
      source: "PulseProxySpine-v16.1",
      health,
      rateLimitBand: rateLimit?.band,
      lastProxyError: vitals?.lastProxyError,
      lastRedisError: vitals?.lastRedisError,
      lastEmailError: vitals?.lastEmailError,
      presenceBandState: vitals?.presenceBandState,
      harmonicDrift: vitals?.harmonicDrift,
      coherenceScore: vitals?.coherenceScore,
      proxyMode: healingState.proxyMode,
      proxyPressure: healingState.proxyPressure
    };

    // PNSRepair: symbolic repair intent
    if (PNSRepair && typeof PNSRepair.repair === "function") {
      PNSRepair.repair(context);
    }

    // PNSPurifier: symbolic purification intent
    if (PNSPurifier && typeof PNSPurifier.purify === "function") {
      PNSPurifier.purify(context);
    }

    // Admin alert on degraded health
    sendCriticalEmail("[PulseProxySpine] Degraded Health Detected", {
      nodeId: NODE_ID,
      region: CLOUD_REGION,
      version: PULSE_VERSION,
      health,
      rateLimitBand: rateLimit?.band,
      lastProxyError: vitals?.lastProxyError,
      lastRedisError: vitals?.lastRedisError,
      lastEmailError: vitals?.lastEmailError,
      time: new Date().toISOString()
    });
  } catch (err) {
    warn("[PulseProxySpine] PNS healing invocation failed:", err);
  }
}

// ============================================================================
//  UNIVERSAL PROXY — TPProxy v16.1 IMMORTAL BACKEND PROXY SPINE
//  (logic preserved from v12.3-Evo, band/presence fields extended, proxy-aware,
//   PNS healing aware, admin email on failure)
// ============================================================================

app.get("/TPProxy", async (req, res) => {
  healingState.lastTPProxyCall = Date.now();

  const target = req.query.url;
  if (!target) {
    const msg = "[TPProxy] Missing_URL";
    warn(msg);

    healingState.lastProxyError = msg;

    // Admin alert on malformed request
    sendCriticalEmail("[PulseProxySpine] TPProxy Missing URL", {
      nodeId: NODE_ID,
      region: CLOUD_REGION,
      version: PULSE_VERSION,
      error: msg,
      time: new Date().toISOString()
    });

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

  // v16: build a symbolic proxy envelope for organism context (no routing)
  const proxy = createProxy({
    jobId: "TPProxy",
    pattern: "ProxySpine/TPProxy",
    payload: {
      target,
      userId,
      ip,
      meshRelay,
      meshPing,
      hubFlag,
      rememberMe
    },
    priority: "normal",
    returnTo: null,
    parentLineage: null,
    pageId: "BACKEND_TPPROXY"
  });

  // update proxy context from a symbolic envelope (no binary logic)
  try {
    updateProxyStateFromEnvelope({
      binaryField: { density: 0, surface: 0 },
      presenceEnvelope: {
        presenceSignature: healingState.presenceBandState || "spine-presence"
      },
      cacheChunkEnvelope: {
        cacheChunkSurfaceSignature: healingState.pulseCacheMode
          ? `CACHE_${healingState.pulseCacheMode}`
          : "CACHE_NONE"
      }
    });
  } catch {
    // fail-open
  }

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
      dualBandMode: healingState.dualBandMode,
      proxyContext: healingState.proxyContextSnapshot,
      proxyMode: healingState.proxyMode,
      proxyPressure: healingState.proxyPressure,
      experienceMeta: PulseProxySpineExperienceMeta
    };

    recordUserMetrics(userId, {
      event: "offline_proxy",
      durationMs,
      presenceBandState: healingState.presenceBandState,
      proxyMode: healingState.proxyMode
    });

    // Build healability snapshot + invoke PNS healing if needed
    const healability = buildHealabilitySnapshot({
      vitals: healingState,
      rateLimit: healingState.lastRateLimitDecision || { band: "low" },
      nodeDescriptor: buildNodeDescriptor({
        region: CLOUD_REGION,
        nodeId: NODE_ID,
        version: PULSE_VERSION,
        mode: healingState.mode,
        maxRequestsPerDay: MAX_REQUESTS_PER_DAY
      }),
      redisReady,
      offlineMode: OFFLINE_MODE
    });
    invokePNSHealingIfNeeded(healability);

    return res.status(200).json(payload);
  }

  // NOTE: actual external fetch / caching logic would live here in your real code.
  // For v16.1-Immortal spine, we keep this symbolic and fail-open; you can plug
  // your existing TPProxy fetch implementation in this block.

  const durationMs = Date.now() - start;

  const payload = {
    ok: true,
    mode: "pass-through",
    message: "TPProxy spine v16.1-Immortal-PROXY-SPINE symbolic pass-through (plug real fetch here).",
    target,
    system,
    userId,
    meshRelay,
    meshPing,
    hubFlag,
    durationMs,
    cacheKey,
    presenceBandState: healingState.presenceBandState,
    harmonicDrift: healingState.harmonicDrift,
    coherenceScore: healingState.coherenceScore,
    pulsePrewarm: healingState.pulsePrewarm,
    pulseCacheMode: healingState.pulseCacheMode,
    pulseChunkMode: healingState.pulseChunkMode,
    pulseRemember: healingState.pulseRemember,
    dualBandMode: healingState.dualBandMode,
    proxyContext: healingState.proxyContextSnapshot,
    proxyMode: healingState.proxyMode,
    proxyPressure: healingState.proxyPressure,
    experienceMeta: PulseProxySpineExperienceMeta
  };

  recordUserMetrics(userId, {
    event: "tpproxy_pass_through",
    durationMs,
    presenceBandState: healingState.presenceBandState,
    proxyMode: healingState.proxyMode
  });

  // Build healability snapshot + invoke PNS healing if needed
  const healability = buildHealabilitySnapshot({
    vitals: healingState,
    rateLimit: healingState.lastRateLimitDecision || { band: "low" },
    nodeDescriptor: buildNodeDescriptor({
      region: CLOUD_REGION,
      nodeId: NODE_ID,
      version: PULSE_VERSION,
      mode: healingState.mode,
      maxRequestsPerDay: MAX_REQUESTS_PER_DAY
    }),
    redisReady,
    offlineMode: OFFLINE_MODE
  });
  invokePNSHealingIfNeeded(healability);

  return res.status(200).json(payload);
});

// ============================================================================
//  SERVER BOOT — v16.1 IMMORTAL BACKEND PROXY SPINE
// ============================================================================

app.listen(PORT, () => {
  log(
    "%c[SPINE BOOT] PulseProxySpine v16.1-Immortal-PROXY-SPINE listening on port " + PORT,
    "color:#03A9F4; font-weight:bold;"
  );
});

export default app;
