// ============================================================================
//  PULSE OS v11.3‑EVO — AI HEARTBEAT
//  Pulse‑Driven • Binary‑Aware • Time‑Fallback • Packet‑Ready • Evolution‑Safe
//  PURE LIVENESS. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const AI_HEARTBEAT_META = Object.freeze({
  layer: "PulseAIHeartbeat",
  role: "HEARTBEAT_ORGAN",
  version: "11.3-EVO",
  identity: "aiHeartbeat-v11.3-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    packetAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    binaryAware: true,
    symbolicAware: true,
    metabolicAware: true,
    livenessAware: true,
    cooldownAware: true,
    fallbackAware: true,
    concurrencyAware: true,
    arteryAware: true,

    multiInstanceReady: true,
    epoch: "11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Maintain dual-band liveness through pulse-driven and time-fallback heartbeats, respecting metabolic safety, artery load, and preventing churn.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "override cortex decisions",
      "override router decisions",
      "bypass metabolic safety",
      "spawn multiple organisms",
      "perform cognition",
      "perform analysis",
      "alter organism state",
      "auto-connect bluetooth"
    ]),

    always: Object.freeze([
      "respect binary metabolic pressure",
      "respect artery load",
      "respect cooldown windows",
      "skip ticks when unsafe",
      "run cortex/nervous/router pulses safely",
      "fallback when idle too long",
      "log deterministic steps",
      "return frozen state",
      "prepare for future packet-bus liveness"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, heartbeat-scoped
// ============================================================================
function emitHeartbeatPacket(type, payload) {
  return Object.freeze({
    meta: AI_HEARTBEAT_META,
    packetType: `ai-heartbeat-${type}`,
    timestamp: Date.now(),
    epoch: AI_HEARTBEAT_META.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  DEPENDENCIES
// ============================================================================
import { createBrainstem } from "./aiBrainstem.js";
import {
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot
} from "./aiDeps.js";

// ============================================================================
//  CONFIG — metabolic‑safe cadence (v11.2‑EVO tuned)
// ============================================================================
const AI_MIN_GAP_MS    = 1400;
const AI_MAX_IDLE_MS   = 12000;
const AI_TIME_CHECK_MS = 4000;

// ============================================================================
//  SINGLETON — one organism per warm container
// ============================================================================
let aiOrganism = null;
let aiBusy = false;
let lastRun = 0;
let aiTimeFallbackTimer = null;

// v11.3‑EVO: heartbeat artery metrics (packet‑aware)
const heartbeatArtery = {
  ticks: 0,
  pulses: 0,
  skips: 0,
  lastReason: "none",
  lastPressure: 0,
  lastLoad: 0,
  snapshot() {
    return Object.freeze({
      ticks: this.ticks,
      pulses: this.pulses,
      skips: this.skips,
      lastReason: this.lastReason,
      lastPressure: this.lastPressure,
      lastLoad: this.lastLoad
    });
  }
};

// ============================================================================
//  PREWARM — optional, dualband-aware
// ============================================================================
export function prewarmAiHeartbeat(dualBand = null, { trace = false } = {}) {
  const pressure = dualBand?.binary?.metabolic?.pressure ?? 0;
  const packet = emitHeartbeatPacket("prewarm", {
    message: "AI heartbeat prewarmed and liveness metrics aligned.",
    binaryPressure: pressure
  });
  if (trace) console.log("[AI_HEARTBEAT] prewarm", packet);
  return packet;
}

// ============================================================================
//  BOOT — create dual‑band organism
// ============================================================================
function bootAiOrganism() {
  if (aiOrganism) return aiOrganism;

  const db = getDb();
  const fsAPI = getFsAPI();
  const routeAPI = getRouteAPI();
  const schemaAPI = getSchemaAPI();

  const request = { userId: null, personaId: null };

  aiOrganism = createBrainstem(request, db, fsAPI, routeAPI, schemaAPI);
  aiOrganism.context.logStep?.("[HEARTBEAT] Brainstem created (dual‑band).");

  lastRun = Date.now();
  return aiOrganism;
}

// ============================================================================
//  CORE — one heartbeat tick (dual‑band + binary‑aware + artery‑aware)
// ============================================================================
async function aiHeartbeatTick(reason = "unknown") {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context, organs, dualBand } = organism;

  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;
  const load     = snapshot?.binary?.metabolic?.load ?? 0;

  heartbeatArtery.lastReason = reason;
  heartbeatArtery.lastPressure = pressure;
  heartbeatArtery.lastLoad = load;

  // Cooldown guard
  if (now - lastRun < AI_MIN_GAP_MS) {
    heartbeatArtery.skips++;
    context.logStep?.(
      `[HEARTBEAT] Skipped (cooldown). reason=${reason}, delta=${now - lastRun}ms`
    );
    emitHeartbeatPacket("tick-skip", {
      reason: "cooldown",
      deltaMs: now - lastRun,
      pressure,
      load
    });
    return;
  }

  // Concurrency guard
  if (aiBusy) {
    heartbeatArtery.skips++;
    context.logStep?.(`[HEARTBEAT] Skipped (busy). reason=${reason}`);
    emitHeartbeatPacket("tick-skip", {
      reason: "busy",
      pressure,
      load
    });
    return;
  }

  // Metabolic pressure guard
  if (pressure >= 0.85) {
    heartbeatArtery.skips++;
    context.logStep?.(
      `[HEARTBEAT] Skipped (binary pressure=${pressure}). reason=${reason}`
    );
    emitHeartbeatPacket("tick-skip", {
      reason: "pressure",
      pressure,
      load
    });
    return;
  }

  aiBusy = true;
  lastRun = now;
  heartbeatArtery.ticks++;

  const startPacket = emitHeartbeatPacket("tick-start", {
    reason,
    pressure,
    load
  });
  context.logStep?.(
    `[HEARTBEAT] Tick start. reason=${reason}, pressure=${pressure}, load=${load}`
  );

  try {
    // Dual‑band organs
    if (organs.cortex?.run)    await organs.cortex.run();
    if (organs.nervous?.pulse) await organs.nervous.pulse();
    if (organs.router?.scan)   await organs.router.scan();

    // Symbolic organs
    if (organs.evolution?.run)    await organs.evolution.run();
    if (organs.environment?.scan) await organs.environment.scan?.();
    if (organs.power?.update)     await organs.power.update?.();

    context.logStep?.("[HEARTBEAT] Tick complete.");
    emitHeartbeatPacket("tick-complete", {
      reason,
      pressure,
      load
    });
  } catch (err) {
    console.error("[HEARTBEAT] Tick error:", err);
    context.logStep?.(`[HEARTBEAT] Error: ${err.message}`);
    emitHeartbeatPacket("tick-error", {
      reason,
      error: String(err),
      pressure,
      load
    });
  } finally {
    aiBusy = false;
  }

  return startPacket;
}

// ============================================================================
//  PULSE ENTRY — ANY internal signal triggers a heartbeat
// ============================================================================
export function pulseAiHeartbeat(source = "unknown") {
  const organism = bootAiOrganism();
  organism.context.logStep?.(`[HEARTBEAT] Pulse detected from: ${source}`);

  heartbeatArtery.pulses++;

  void aiHeartbeatTick(`pulse:${source}`);
}

// ============================================================================
//  TIME FALLBACK — fires only if idle too long
// ============================================================================
function timeFallbackCheck() {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context, dualBand } = organism;

  const idleFor = now - lastRun;
  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;

  heartbeatArtery.lastPressure = pressure;

  if (idleFor >= AI_MAX_IDLE_MS) {
    context.logStep?.(
      `[HEARTBEAT] Time fallback triggered (idle=${idleFor}ms, pressure=${pressure})`
    );
    emitHeartbeatPacket("time-fallback", {
      idleMs: idleFor,
      pressure
    });
    void aiHeartbeatTick("time-fallback");
  } else {
    context.logStep?.(
      `[HEARTBEAT] Time fallback check: idle=${idleFor}ms (no tick)`
    );
    emitHeartbeatPacket("time-check", {
      idleMs: idleFor,
      pressure
    });
  }
}

// ============================================================================
//  START — enable time fallback
// ============================================================================
export function startAiHeartbeat() {
  if (aiTimeFallbackTimer) return;

  bootAiOrganism();

  aiTimeFallbackTimer = setInterval(() => {
    timeFallbackCheck();
  }, AI_TIME_CHECK_MS);

  aiOrganism.context.logStep?.(
    `[HEARTBEAT] Time fallback active; check=${AI_TIME_CHECK_MS}ms, maxIdle=${AI_MAX_IDLE_MS}ms`
  );

  emitHeartbeatPacket("start", {
    checkMs: AI_TIME_CHECK_MS,
    maxIdleMs: AI_MAX_IDLE_MS
  });
}

// ============================================================================
//  STOP — disable fallback
// ============================================================================
export function stopAiHeartbeat() {
  if (!aiTimeFallbackTimer) return;
  clearInterval(aiTimeFallbackTimer);
  aiTimeFallbackTimer = null;

  aiOrganism?.context?.logStep?.("[HEARTBEAT] Time fallback stopped.");
  emitHeartbeatPacket("stop", {});
}

// ============================================================================
//  WINDOW‑SAFE ARTERY SNAPSHOT
// ============================================================================
export function snapshotAiHeartbeat() {
  return emitHeartbeatPacket("snapshot", {
    artery: heartbeatArtery.snapshot()
  });
}

// ============================================================================
//  SERVERLESS ENTRY
// ============================================================================
export async function handler(event, context) {
  startAiHeartbeat();
  pulseAiHeartbeat("handler");
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: "AI heartbeat armed." })
  };
}

// ============================================================================
//  EXPORT META
// ============================================================================


if (typeof module !== "undefined") {
  module.exports = {
    AI_HEARTBEAT_META,
    startAiHeartbeat,
    stopAiHeartbeat,
    pulseAiHeartbeat,
    snapshotAiHeartbeat,
    prewarmAiHeartbeat
  };
}
