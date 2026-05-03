// ============================================================================
// PULSE-NET — Immortal Local Heartbeat + Forward/Backward Engine ignition
// v16-FAMILY-NET-IMMORTAL (SUPER INSTANCE MODE)
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
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseNet",
  version: "v16-FAMILY-NET-IMMORTAL",
  layer: "frontend",
  role: "network_intelligence",
  lineage: "PulseOS-v12 → v13-EVO-IMMORTAL → v15-FAMILY-IMMORTAL → v16-FAMILY-NET-IMMORTAL",

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
    singleInternetEdge: true
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

import { createForwardEngine } from "../PULSE-BAND/PULSE-ENGINE/ForwardEngine.js";
import { createBackwardEngine } from "../PULSE-BAND/PULSE-ENGINE/BackwardEngine.js";
import PulseUIErrors from "./PulseUIErrors-v12-Evo.js";
import { initUIFlow } from "./PulseUIFlow-v12-Evo.js";
import { safeRoute as route } from "./PulseProofBridge.js";

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
// GLOBAL INGRESS QUEUES — EXPANSION/CASTLE/SERVER/USER/BRAIN/SOLDIER
//  • No imports from those organs.
//  • They reach us via routing channels (PulseProofBridge / server).
//  • This file is the only internet edge: NetworkOrgan uses route(...).
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
// NETWORK ORGAN — THE ONLY INTERNET EDGE
//  • Everything external goes through here.
//  • Expansion/Castle/Server/User/Brain/Soldier signals are normalized here.
//  • Uses route(...) to talk to independent PulseNet server (symbolic).
// ============================================================================
const NetworkOrgan = {
  // symbolic channel names for server-side PulseNet
  channels: {
    expansion: "pulseNet.server.expansion",
    castle: "pulseNet.server.castle",
    server: "pulseNet.server.server",
    user: "pulseNet.server.user",
    brain: "pulseNet.server.brain",
    soldier: "pulseNet.server.soldier",
    mesh: "pulseNet.server.mesh",
    heartbeat: "pulseNet.heartbeat"
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
      await route(this.channels.heartbeat, {
        instanceId,
        organism,
        result,
        layer: "PulseNet",
        binaryAware: true,
        dualBand: true,
        singleInternetEdge: true
      }).catch(() => {});
    } catch {
      // swallow; ErrorSpine will be handled by caller
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
// INGRESS PROCESSOR — SOLDIERS / EXPANSION / CASTLES / MESH
//  • Drains queues each tick.
//  • Normalizes and forwards to NetworkOrgan (only internet edge).
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

// Mom Heart — primary beat: forward engine + organism heartbeat
function momHeart(instanceId, now) {
  runOrganismHeartbeat(instanceId, "mom");
  const forwardMetrics = warmForwardEngine(instanceId);
  return { source: "mom", forward: forwardMetrics };
}

// Dad Heart — fallback beat: backward engine + AI heartbeat
function dadHeart(instanceId, now) {
  runAIHeartbeat(instanceId, "dad");
  const backwardMetrics = warmBackwardEngine(instanceId);
  return { source: "dad", backward: backwardMetrics };
}

// Earn Heart — tertiary beat: both engines if stale, light touch if not
function earnHeart(instanceId, now, stale) {
  if (stale) {
    runOrganismHeartbeat(instanceId, "earn-stale");
    runAIHeartbeat(instanceId, "earn-stale");
    const forwardMetrics = warmForwardEngine(instanceId);
    const backwardMetrics = warmBackwardEngine(instanceId);
    return {
      source: "earn-stale",
      forward: forwardMetrics,
      backward: backwardMetrics
    };
  } else {
    // light nudge: just ensure organism time moves
    runOrganismHeartbeat(instanceId, "earn-soft");
    return { source: "earn-soft" };
  }
}

// Random nudge — probabilistic extra push
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
//  • Now also processes ingress each tick.
//  • Heartbeat still pings CNS, but NetworkOrgan is the only internet edge.
// ============================================================================
async function tickFamily(instanceId = "core") {
  const now = Date.now();
  const { last } = getHeartbeatState(instanceId);
  const delta = now - (last || 0);

  const stale = delta > 90 * 1000;      // organism stale
  const softStale = delta > 15 * 1000;  // soft fallback threshold

  let result = null;

  // 0) Process ingress from Expansion/Castle/Server/User/Brain/Soldier/Mesh
  await processIngress(instanceId);

  // 1) Mom tries first (primary beat)
  if (!stale) {
    result = momHeart(instanceId, now);
  } else {
    console.log("[PULSE-NET]", instanceId, "Mom stale, escalating to Dad/Earn");
  }

  // 2) If Mom is stale or soft-stale, let Dad step in
  if (!result || softStale) {
    const dadResult = dadHeart(instanceId, now);
    result = { ...(result || {}), ...dadResult };
  }

  // 3) If fully stale, Earn does a heavy rescue beat
  if (stale) {
    const earnResult = earnHeart(instanceId, now, true);
    result = { ...(result || {}), ...earnResult };
  } else {
    // non-stale: Earn does a soft continuity beat
    const earnResult = earnHeart(instanceId, now, false);
    result = { ...(result || {}), ...earnResult };
  }

  // 4) Random nudge as extra beat source
  const rnd = randomNudge(instanceId, now);
  if (rnd) {
    result = { ...(result || {}), ...rnd };
  }

  // 5) UIFlow + CNS + ErrorSpine awareness (local only) + heartbeat via NetworkOrgan
  try {
    // Ping CNS / PulseNet server with heartbeat via NetworkOrgan
    await NetworkOrgan.sendHeartbeat(instanceId, getOrganism(instanceId), result);

    // Light UIFlow ignition on first ticks (idempotent)
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
    intervalMs = 750,      // slightly faster in dev; can be raised in prod
    superInstance = true   // reserved flag for future tuning
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
//  • Expansion/Castle/Server/User/Brain/Soldier/Mesh send symbolic packets.
//  • These are queued and flushed each tick via NetworkOrgan.
//  • This keeps PulseNet as the single internet edge.
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
