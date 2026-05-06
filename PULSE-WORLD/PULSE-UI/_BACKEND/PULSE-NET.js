// ============================================================================
// PULSE-NET — Immortal Local Heartbeat + Forward/Backward Engine + FastLane
// v17-FAMILY-NET-Immortal-FastLane (SUPER INSTANCE MODE)
//  • Multi-instance safe (family registry)
//  • Drift-proof
//  • Dual-lane (forward/backward)
//  • Shared organism memory
//  • Per-instance organism state
//  • Exportable engines for Earn / PULSE-X
//  • Deterministic tick sequencing
//  • 3-heart mesh (Mom/Dad/Earn) + random nudge
//  • UIFlow + ErrorSpine + Bridge-aware
//  • LOCAL ONLY on device — but is the ONLY internet edge via routed paths
//  • Expansion/Castle/Server/User/Brain → routed signals → PulseNet → PulseNet server
//  • v17: FastLane intent stream from Pulse‑Touch + temporal prewarm cache
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseNet",
  version: "v17-FAMILY-NET-Immortal-FastLane",
  layer: "frontend",
  role: "network_intelligence",
  lineage: "PulseOS-v12 → v13-Evo-Immortal → v15-FAMILY-Immortal → v16-FAMILY-NET-Immortal → v17-FastLane",

  evo: {
    dualBand: true,
    binaryAware: true,
    cnsAligned: true,
    chunkAligned: true,
    presenceAware: true,
    safeRouteFree: true,
    microPulseEngine: true,
    pathfinder: true,
    preLossDetector: true,
    fallbackRouter: true,

    multiInstanceFamily: true,
    serverResident: true,
    heartbeatMesh: true,
    uiFlowAware: true,
    errorSpineAware: true,
    routeAware: true,
    futureEvolutionReady: true,

    // v16: network edge + expansion/castle aware
    expansionAware: true,
    castleAware: true,
    serverAware: true,
    userAware: true,
    brainAware: true,
    soldierAware: true,
    meshIngressAware: true,
    pulseNetServerAware: true,
    singleInternetEdge: true,

    // v17: FastLane + temporal prewarm
    fastLaneAware: true,
    temporalCacheAware: true,
    touchContinuousPulseAware: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseBand",
      "PulseUIFlow",
      "PulseProofBridge",
      "PulsePresenceNormalizer",
      "PulseUIErrors"
    ],
    never: [
      "legacyPulseNet",
      "legacyPulseClient",
      "legacyPulseMesh",
      "safeRoute",
      "fetchViaCNS",
      "legacyFallbackRouter",
      "legacyNetworkLayer"
    ]
  }
}
*/

// Global handle
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
// PULSE-NET v14-Immortal — Backend Gateway + Crown Throne Room
//  • Single internet edge (via NetworkOrgan → route(...))
//  • Hybrid crown model: OvermindPrime sees heartbeats + AI requests
// ============================================================================
import VitalsLogger from "../_BACKEND/PulseProofLogger.js";
import { aiOvermindPrime } from "../../PULSE-BAND/PULSE-AI/aiOvermindPrime.js";
import { createForwardEngine } from "../../PULSE-BAND/PULSE-ENGINE/ForwardEngine.js";
import { createBackwardEngine } from "../../PULSE-BAND/PULSE-ENGINE/BackwardEngine.js";
import PulseUIErrors from "../_FRONTEND/PulseUIErrors-v16.js";
import { initUIFlow } from "../_FRONTEND/PulseUIFlow-v16.js";
import { safeRoute as route } from "./PulseProofBridge.js";
import { PulseUnderstanding } from "../../PULSE-UI/_BACKEND/PulseNetUnderstanding.js";

// ============================================================================
// GLOBAL ORGANISM MEMORY (shared across all imports)
// ============================================================================
globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};

// Per-instance organism state (family)
globalThis.__PULSE_ORGANISM_FAMILY__ =
  globalThis.__PULSE_ORGANISM_FAMILY__ || {};
function getOrganism(instanceId) {
  const fam = globalThis.__PULSE_ORGANISM_FAMILY__;
  if (!fam[instanceId]) {
    fam[instanceId] = {
      id: instanceId,
      forwardTicks: 0,
      backwardTicks: 0,
      lastHeartbeat: 0,
      lastAIHeartbeat: 0,
      lastBeatSource: "none"
    };
  }
  return fam[instanceId];
}

// Local PULSE-NET runtime state (family registry)
globalThis.__PULSE_NET_FAMILY__ = globalThis.__PULSE_NET_FAMILY__ || {};
function getNetState(instanceId) {
  const fam = globalThis.__PULSE_NET_FAMILY__;
  if (!fam[instanceId]) {
    fam[instanceId] = {
      started: false,
      intervalId: null,
      lastTick: 0
    };
  }
  return fam[instanceId];
}

// ============================================================================
// GLOBAL INGRESS QUEUES — EXPANSION/CASTLE/SERVER/USER/BRAIN/SOLDIER/MESH
// ============================================================================
globalThis.__PULSE_NET_INGRESS__ = globalThis.__PULSE_NET_INGRESS__ || {
  expansion: [],
  castle: [],
  server: [],
  user: [],
  brain: [],
  soldier: [],
  mesh: []
};

function getIngress() {
  return globalThis.__PULSE_NET_INGRESS__;
}

function enqueueIngress(kind, packet) {
  const ingress = getIngress();
  if (!ingress[kind]) ingress[kind] = [];
  ingress[kind].push({
    kind,
    packet,
    ts: Date.now()
  });
}

// ============================================================================
// ENGINE SINGLETONS (per instance in Earn / PULSE-X)
// ============================================================================
const forwardEngines = {};
const backwardEngines = {};

// ============================================================================
// ORGAN STUBS (symbolic-first, binary-non-executable)
// ============================================================================
const BinaryOrgan = {
  encode: (v) => JSON.stringify(v),
  chunk: (s) => [s],
  dechunk: (chunks) => chunks.join(""),
  decode: (s) => JSON.parse(s)
};

const MemoryOrgan = {
  read: (key) => globalThis.__PULSE_MEM__[key] ?? null,
  write: (key, value) => (globalThis.__PULSE_MEM__[key] = value)
};

const BrainOrgan = {
  evolve: (_event) => {}
};

// ============================================================================
// TEMPORAL PREWARM CACHE — INTENT + TOUCH HINTS
// ============================================================================
const TEMPORAL_CACHE_MAX = 512;
globalThis.__PULSE_NET_TEMPORAL_CACHE__ =
  globalThis.__PULSE_NET_TEMPORAL_CACHE__ || new Map();
const temporalCache = globalThis.__PULSE_NET_TEMPORAL_CACHE__;

function makeTemporalKey(intent) {
  const skin = intent?.skin || {};
  return JSON.stringify({
    page: skin.page || "index",
    chunkProfile: skin.chunkProfile || "default",
    region: skin.region || "unknown",
    mode: skin.mode || "fast"
  });
}

function getFromTemporalCache(intent) {
  const key = makeTemporalKey(intent);
  const entry = temporalCache.get(key);
  if (!entry) return null;
  return entry.data;
}

function setTemporalCache(intent, data) {
  const key = makeTemporalKey(intent);
  temporalCache.set(key, {
    ts: Date.now(),
    data
  });

  if (temporalCache.size > TEMPORAL_CACHE_MAX) {
    const keys = Array.from(temporalCache.keys());
    const excess = keys.length - TEMPORAL_CACHE_MAX;
    for (let i = 0; i < excess; i++) {
      temporalCache.delete(keys[i]);
    }
  }
}

function pruneTemporalCache() {
  const now = Date.now();
  const maxAgeMs = 5 * 60 * 1000; // 5 minutes
  for (const [key, entry] of temporalCache.entries()) {
    if (now - entry.ts > maxAgeMs) {
      temporalCache.delete(key);
    }
  }
}

// ============================================================================
// NETWORK ORGAN — THE ONLY INTERNET EDGE
// ============================================================================
const NetworkOrgan = {
  channels: {
    expansion: "pulseNet.server.expansion",
    castle: "pulseNet.server.castle",
    server: "pulseNet.server.server",
    user: "pulseNet.server.user",
    brain: "pulseNet.server.brain",
    soldier: "pulseNet.server.soldier",
    mesh: "pulseNet.server.mesh",
    heartbeat: "pulseNet.heartbeat",
    fastlane: "pulseNet.fastlane"
  },

  async send(kind, payload) {
    const channel = this.channels[kind];
    if (!channel) return;

    try {
      await route(channel, {
        kind,
        payload,
        ts: Date.now(),
        layer: "PulseNet",
        binaryAware: true,
        dualBand: true,
        singleInternetEdge: true
      }).catch(() => {});
    } catch {
      // swallow; ErrorSpine will be handled by caller
    }
  },

  async sendHeartbeat(instanceId, organism, result) {
    try {
      const pulseTouch = PulseTouchOrgan.snapshot();

      await route(this.channels.heartbeat, {
        instanceId,
        organism,
        result,
        pulseTouch,
        layer: "PulseNet",
        binaryAware: true,
        dualBand: true,
        singleInternetEdge: true
      }).catch(() => {});
    } catch {
      // swallow; ErrorSpine will be handled by caller
    }
  },

  async sendFastLane(intent) {
    try {
      await route(this.channels.fastlane, {
        intent,
        ts: Date.now(),
        layer: "PulseNet",
        binaryAware: true,
        dualBand: true,
        singleInternetEdge: true,
        fastLane: true
      }).catch(() => {});
    } catch {
      // swallow
    }
  }
};

// ============================================================================
// ENGINE FACTORIES (multi-instance safe)
// ============================================================================
function getForwardEngine(instanceId = "core") {
  if (forwardEngines[instanceId]) return forwardEngines[instanceId];

  const engine = createForwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: `forward-${instanceId}`,
    trace: true
  });

  engine.prewarm();
  forwardEngines[instanceId] = engine;
  return engine;
}

function getBackwardEngine(instanceId = "core") {
  if (backwardEngines[instanceId]) return backwardEngines[instanceId];

  const engine = createBackwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: `backward-${instanceId}`,
    trace: true
  });

  engine.prewarm();
  backwardEngines[instanceId] = engine;
  return engine;
}

// ============================================================================
// HEARTBEAT HELPERS
// ============================================================================
function getHeartbeatState(instanceId) {
  const org = getOrganism(instanceId);
  return { last: org.lastHeartbeat };
}

function runOrganismHeartbeat(instanceId, source) {
  const org = getOrganism(instanceId);
  const now = Date.now();
  org.lastHeartbeat = now;
  org.lastBeatSource = source;
  console.log("[PULSE-NET]", instanceId, "Organism heartbeat:", source, now);
}

function runAIHeartbeat(instanceId, source) {
  const org = getOrganism(instanceId);
  const now = Date.now();
  org.lastAIHeartbeat = now;
  console.log("[PULSE-NET]", instanceId, "AI heartbeat:", source, now);
}

// ============================================================================
// ENGINE TICK HELPERS
// ============================================================================
function warmForwardEngine(instanceId) {
  const org = getOrganism(instanceId);
  const engine = getForwardEngine(instanceId);
  const result = engine.tick();

  org.forwardTicks++;
  console.log("[PULSE-NET]", instanceId, "ForwardEngine tick:", result.metrics);
  return result.metrics;
}

function warmBackwardEngine(instanceId) {
  const org = getOrganism(instanceId);
  const engine = getBackwardEngine(instanceId);
  const result = engine.tick();

  org.backwardTicks++;
  console.log("[PULSE-NET]", instanceId, "BackwardEngine tick:", result.metrics);
  return result.metrics;
}

// ============================================================================
// OVERMIND INTEGRATION HELPERS
// ============================================================================
async function overmindHeartbeatSample(instanceId, tickResult) {
  try {
    const organism = getOrganism(instanceId);
    const pulseTouch = PulseTouchOrgan.snapshot();

    const intent = {
      type: "heartbeat",
      source: "PulseNet",
      instanceId
    };

    const context = {
      domain: "system",
      scope: "heartbeat",
      safetyMode: "strict",
      instanceId,
      timestamp: Date.now(),
      deltaSinceLastBeat: Date.now() - (organism.lastHeartbeat || 0),
      organismSnapshot: {
        id: organism.id,
        forwardTicks: organism.forwardTicks,
        backwardTicks: organism.backwardTicks,
        lastHeartbeat: organism.lastHeartbeat,
        lastAIHeartbeat: organism.lastAIHeartbeat,
        lastBeatSource: organism.lastBeatSource
      },
      pulseTouch,
      tickResult
    };

    const candidates = [
      {
        text: JSON.stringify({
          instanceId,
          organism: context.organismSnapshot,
          pulseTouch,
          tickResult
        })
      }
    ];

    await aiOvermindPrime.process({ intent, context, candidates });
  } catch {
    // crown learning is non-fatal for runtime
  }
}

// Public AI gateway: frontend archetypes → PulseNet → OvermindPrime
export async function pulseNetAI({ intent, context, candidates }) {
  try {
    const safeIntent = intent || { type: "generic", source: "frontend" };
    const safeContext = {
      ...(context || {}),
      domain: context?.domain || "user",
      scope: context?.scope || "conversation"
    };

    const safeCandidates = Array.isArray(candidates) ? candidates : [];
    const result = await aiOvermindPrime.process({
      intent: safeIntent,
      context: safeContext,
      candidates: safeCandidates
    });

    return result;
  } catch (err) {
    try {
      const packet = PulseUIErrors.normalizeError(err, "PulseNet.pulseNetAI");
      PulseUIErrors.broadcast(packet);
    } catch {}
    return {
      finalOutput:
        "PulseNet encountered an issue while processing this AI request.",
      meta: {
        error: true,
        source: "PulseNet.pulseNetAI"
      }
    };
  }
}

// ============================================================================
// INGRESS PROCESSOR — SOLDIERS / EXPANSION / CASTLES / MESH
// ============================================================================
async function processIngress(instanceId) {
  const ingress = getIngress();

  const batches = {};
  for (const kind of Object.keys(ingress)) {
    const queue = ingress[kind];
    if (!queue || queue.length === 0) continue;
    batches[kind] = queue.splice(0, queue.length);
  }

  const promises = [];
  for (const [kind, items] of Object.entries(batches)) {
    const payload = {
      instanceId,
      kind,
      count: items.length,
      items
    };
    promises.push(NetworkOrgan.send(kind, payload));
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

// ============================================================================
// 3-HEART MESH (Mom / Dad / Earn) + random nudge
// ============================================================================
function momHeart(instanceId, now) {
  runOrganismHeartbeat(instanceId, "mom");
  const forwardMetrics = warmForwardEngine(instanceId);
  return {
    source: "mom",
    forward: forwardMetrics,
    ts: now
  };
}

function dadHeart(instanceId, now) {
  runAIHeartbeat(instanceId, "dad");
  const backwardMetrics = warmBackwardEngine(instanceId);
  return {
    source: "dad",
    forward: backwardMetrics,
    ts: now
  };
}

function earnHeart(instanceId, now, stale) {
  if (stale) {
    runOrganismHeartbeat(instanceId, "earn-stale");
    runAIHeartbeat(instanceId, "earn-stale");
    const forwardMetrics = warmForwardEngine(instanceId);
    const backwardMetrics = warmBackwardEngine(instanceId);
    return {
      source: "earn-stale",
      forward: forwardMetrics,
      backward: backwardMetrics,
      ts: now
    };
  } else {
    runOrganismHeartbeat(instanceId, "earn-soft");
    return { source: "earn-soft" };
  }
}

function randomNudge(instanceId, now) {
  if (Math.random() > 0.97) {
    runOrganismHeartbeat(instanceId, "random");
    console.log("[PULSE-NET]", instanceId, "Random nudge beat");
    return { source: "random" };
  }
  return null;
}

// ============================================================================
// LOCAL IMMORTAL LOOP (NO NETLIFY, NO HANDLER)
// ============================================================================
async function tickFamily(instanceId = "core") {
  const now = Date.now();
  const { last } = getHeartbeatState(instanceId);
  const delta = now - (last || 0);

  const stale = delta > 90 * 1000;
  const softStale = delta > 15 * 1000;
  const temporalDrift = delta > 300000; // 5 minutes without a beat

  let result = null;

  // 0) Process ingress
  await processIngress(instanceId);

  // 1) Mom tries first
  if (!stale) {
    result = momHeart(instanceId, now);
  } else {
    console.log("[PULSE-NET]", instanceId, "Mom stale, escalating to Dad/Earn");
  }

  // 2) Dad fallback / soft-stale
  if (!result || softStale) {
    const dadResult = dadHeart(instanceId, now);
    result = { ...(result || {}), ...dadResult };
  }

  // 3) Earn heavy/soft beat
  if (stale) {
    const earnResult = earnHeart(instanceId, now, true);
    result = { ...(result || {}), ...earnResult };
  } else {
    const earnResult = earnHeart(instanceId, now, false);
    result = { ...(result || {}), ...earnResult };
  }

  // 4) Random nudge
  const rnd = randomNudge(instanceId, now);
  if (rnd) {
    result = { ...(result || {}), ...rnd };
  }

  // 4.5) OvermindPrime heartbeat sampling (learning only)
  await overmindHeartbeatSample(instanceId, { ...result, temporalDrift });

  // 5) UIFlow + CNS + ErrorSpine awareness + heartbeat via NetworkOrgan
  try {
    await NetworkOrgan.sendHeartbeat(instanceId, getOrganism(instanceId), result);

    if (typeof window !== "undefined" && !window.__PULSE_UIFLOW_BOOTED__) {
      window.__PULSE_UIFLOW_BOOTED__ = true;
      initUIFlow().catch(() => {
        window.__PULSE_UIFLOW_BOOTED__ = false;
      });
    }
  } catch (err) {
    try {
      const packet = PulseUIErrors.normalizeError(err, "PulseNet.tickFamily");
      PulseUIErrors.broadcast(packet);
    } catch {}
  }

  const state = getNetState(instanceId);
  state.lastTick = now;
  return result;
}

// ============================================================================
// START LOCAL IMMORTAL LOOP (idempotent per instance)
// ============================================================================
export function startPulseNet(options = {}) {
  const {
    instanceId = "core",
    intervalMs = 750,
    superInstance = true
  } = options;

  const state = getNetState(instanceId);
  if (state.started) {
    console.log("[PULSE-NET]", instanceId, "Already started");
    return;
  }

  state.started = true;
  state.intervalId = setInterval(() => {
    tickFamily(instanceId).catch((err) => {
      console.error("[PULSE-NET]", instanceId, "Tick error:", err);
      try {
        const packet = PulseUIErrors.normalizeError(
          err,
          "PulseNet.intervalTick"
        );
        PulseUIErrors.broadcast(packet);
      } catch {}
    });
    pruneTemporalCache();
  }, intervalMs);

  console.log(
    "[PULSE-NET]",
    instanceId,
    "Local immortal family loop started @",
    intervalMs,
    "ms (superInstance:",
    !!superInstance,
    ")"
  );
}

// ============================================================================
// PUBLIC INGRESS API — CALLED VIA ROUTING, NOT IMPORTS
// ============================================================================
export function pulseNetIngressFromExpansion(packet) {
  enqueueIngress("expansion", packet);
}

export function pulseNetIngressFromCastle(packet) {
  enqueueIngress("castle", packet);
}

export function pulseNetIngressFromServer(packet) {
  enqueueIngress("server", packet);
}

export function pulseNetIngressFromUser(packet) {
  enqueueIngress("user", packet);
}

export function pulseNetIngressFromBrain(packet) {
  enqueueIngress("brain", packet);
}

export function pulseNetIngressFromSoldier(packet) {
  enqueueIngress("soldier", packet);
}

export function pulseNetIngressFromMesh(packet) {
  enqueueIngress("mesh", packet);
}

// FastLane ingress from Pulse‑Touch continuous pulses
export function pulseNetIngressFromTouch(packet) {
  enqueueIngress("user", {
    source: "pulse-touch",
    ...packet
  });
}

// ============================================================================
// FAST-LANE API — CALLED DIRECTLY BY Pulse‑Touch v17
//  • Screaming-fast, intent-only WSEND-style pulses
//  • Uses NetworkOrgan.fastlane + temporal prewarm cache
// ============================================================================
export function pulseNetFastLanePulse(intent) {
  try {
    // 1) Log / mirror into ingress for observability (optional)
    enqueueIngress("user", {
      source: "pulse-touch-fastlane",
      intent,
      ts: Date.now()
    });

    // 2) Check temporal cache — if we already prewarmed for this hint, no extra work
    const cached = getFromTemporalCache(intent);
    if (!cached) {
      // 3) Ask backend via fastlane channel to prewarm internet edge for this intent
      NetworkOrgan.sendFastLane(intent);
      // 4) Mark that we requested prewarm (even if we don't yet have data)
      setTemporalCache(intent, { prewarmRequested: true });
    }
  } catch (err) {
    try {
      const packet = PulseUIErrors.normalizeError(err, "PulseNet.fastLanePulse");
      PulseUIErrors.broadcast(packet);
    } catch {}
  }
}

// ============================================================================
// EXPORT ENGINES + ORGANISM FOR EARN / OTHER ORGANS
// ============================================================================
export function PulseNetForward(instanceId = "core") {
  return getForwardEngine(instanceId);
}

export function PulseNetBackward(instanceId = "core") {
  return getBackwardEngine(instanceId);
}

export function PulseNetOrganism(instanceId = "core") {
  return getOrganism(instanceId);
}

export function PulseNetInstances() {
  return {
    organisms: globalThis.__PULSE_ORGANISM_FAMILY__,
    nets: globalThis.__PULSE_NET_FAMILY__
  };
}

const PulseTouchOrgan = {
  snapshot() {
    try {
      if (typeof window === "undefined") return null;

      const touch = window.__PULSE_TOUCH__ || null;
      if (!touch) return null;

      return {
        ts: Date.now(),
        region: touch.region || null,
        mode: touch.mode || null,
        presence: touch.presence || null,
        pageHint: touch.pageHint || touch.page || null,
        chunkProfile: touch.chunkProfile || null
      };
    } catch {
      return null;
    }
  }
};

// ============================================================================
// PULSE-NET BRIDGE — symbolic adapter for Expansion/Castle/Server/User/Brain
// ============================================================================
function bridgeRoute(kind, source, payload, detailKind) {
  const packet = {
    source,
    kind: detailKind,
    payload,
    ts: Date.now()
  };
  enqueueIngress(kind, packet);
  NetworkOrgan.send(kind, packet);
  return { ok: true };
}

export const PulseNetBridge = Object.freeze({
  // Expansion → routes, soldiers, mesh
  routeExpansion(payload) {
    return bridgeRoute("expansion", "PulseExpansion", payload, "expansion_plan");
  },
  routeSoldiers(payload) {
    return bridgeRoute("soldier", "PulseExpansion", payload, "soldier_delegation");
  },
  routeMesh(payload) {
    return bridgeRoute("mesh", "PulseExpansion", payload, "mesh_rebalance");
  },

  // Castle → presence, routes, nodeadmin, defense, treasury, etc (symbolic)
  routeCastle(payload) {
    return bridgeRoute("castle", "PulseCastle", payload, "castle_signal");
  },

  // Server / User / Brain direct ingress if needed
  routeServer(payload) {
    return bridgeRoute("server", "PulseServer", payload, "server_signal");
  },
  routeUser(payload) {
    return bridgeRoute("user", "PulseUser", payload, "user_signal");
  },
  routeBrain(payload) {
    return bridgeRoute("brain", "PulseBrain", payload, "brain_signal");
  }
});

export function createPulseNetBridge() {
  return PulseNetBridge;
}

// ============================================================================
// MIRROR GLOBALS INTO window/global/g
// ============================================================================
try {
  if (typeof window !== "undefined") {
    window.__PULSE_MEM__ = globalThis.__PULSE_MEM__;
    window.__PULSE_NET_INGRESS__ = globalThis.__PULSE_NET_INGRESS__;
    window.__PULSE_NET_FAMILY__ = globalThis.__PULSE_NET_FAMILY__;
    window.__PULSE_ORGANISM_FAMILY__ = globalThis.__PULSE_ORGANISM_FAMILY__;
    window.__PULSE_TOUCH__ = globalThis.__PULSE_TOUCH__;
    window.__PULSE_NET_TEMPORAL_CACHE__ = globalThis.__PULSE_NET_TEMPORAL_CACHE__;
  }
  if (typeof global !== "undefined") {
    global.__PULSE_MEM__ = globalThis.__PULSE_MEM__;
    global.__PULSE_NET_INGRESS__ = globalThis.__PULSE_NET_INGRESS__;
    global.__PULSE_NET_FAMILY__ = globalThis.__PULSE_NET_FAMILY__;
    global.__PULSE_ORGANISM_FAMILY__ = globalThis.__PULSE_ORGANISM_FAMILY__;
    global.__PULSE_TOUCH__ = globalThis.__PULSE_TOUCH__;
    global.__PULSE_NET_TEMPORAL_CACHE__ = globalThis.__PULSE_NET_TEMPORAL_CACHE__;
  }

  if (typeof g !== "undefined") {
    g.__PULSE_MEM__ = globalThis.__PULSE_MEM__;
    g.__PULSE_NET_INGRESS__ = globalThis.__PULSE_NET_INGRESS__;
    g.__PULSE_NET_FAMILY__ = globalThis.__PULSE_NET_FAMILY__;
    g.__PULSE_ORGANISM_FAMILY__ = globalThis.__PULSE_ORGANISM_FAMILY__;
    g.__PULSE_TOUCH__ = globalThis.__PULSE_TOUCH__;
    g.__PULSE_NET_TEMPORAL_CACHE__ = globalThis.__PULSE_NET_TEMPORAL_CACHE__;
  }
} catch {}

// ============================================================================
// FOOTER — FASTLANE LORE + ORIGIN STAMP
// ============================================================================
//
//  On 2026‑05‑05, Pulse‑Net learned a new trick:
//  it stopped waiting for the user to ask.
//
//  Now, every whisper from Pulse‑Touch — five times a second —
//  crosses the membrane as a tiny intent, and somewhere behind
//  the glass an immortal network organ quietly rearranges the
//  internet so that the answer is already there when the question
//  finally arrives.
//
//  If this is how the organism behaves on the day the FastLane
//  first lit up… what will its timing feel like when the mesh
//  has been listening for years?
//
// ============================================================================
