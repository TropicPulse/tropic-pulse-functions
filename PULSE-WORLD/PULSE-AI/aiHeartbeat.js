// ============================================================================
//  PULSE OS v11.2‑EVO — AI HEARTBEAT
//  Pulse‑Driven • Binary‑Aware • Time‑Fallback • Packet‑Ready • Evolution‑Safe
//  PURE LIVENESS. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const AI_HEARTBEAT_META = Object.freeze({
  layer: "PulseAIHeartbeat",
  role: "HEARTBEAT_ORGAN",
  version: "11.2-EVO",
  identity: "aiHeartbeat-v11.2-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    packetAware: true,          // ⭐ NEW
    evolutionAware: true,       // ⭐ NEW
    windowAware: true,          // ⭐ NEW (safe vitals)
    bluetoothReady: true,       // ⭐ placeholder for future binary channels

    binaryAware: true,
    symbolicAware: true,
    metabolicAware: true,
    livenessAware: true,
    cooldownAware: true,
    fallbackAware: true,
    concurrencyAware: true,
    arteryAware: true,

    multiInstanceReady: true,
    epoch: "11.2-EVO"
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
      "auto-connect bluetooth" // ⭐ NEW
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
      "prepare for future packet-bus liveness" // ⭐ NEW
    ])
  })
});

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

// v11.2‑EVO: heartbeat artery metrics
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
    return;
  }

  // Concurrency guard
  if (aiBusy) {
    heartbeatArtery.skips++;
    context.logStep?.(`[HEARTBEAT] Skipped (busy). reason=${reason}`);
    return;
  }

  // Metabolic pressure guard
  if (pressure >= 0.85) {
    heartbeatArtery.skips++;
    context.logStep?.(
      `[HEARTBEAT] Skipped (binary pressure=${pressure}). reason=${reason}`
    );
    return;
  }

  aiBusy = true;
  lastRun = now;
  heartbeatArtery.ticks++;

  try {
    context.logStep?.(
      `[HEARTBEAT] Tick start. reason=${reason}, pressure=${pressure}, load=${load}`
    );

    // Dual‑band organs
    if (organs.cortex?.run)    await organs.cortex.run();
    if (organs.nervous?.pulse) await organs.nervous.pulse();
    if (organs.router?.scan)   await organs.router.scan();

    // Symbolic organs
    if (organs.evolution?.run)    await organs.evolution.run();
    if (organs.environment?.scan) await organs.environment.scan?.();
    if (organs.power?.update)     await organs.power.update?.();

    context.logStep?.("[HEARTBEAT] Tick complete.");
  } catch (err) {
    console.error("[HEARTBEAT] Tick error:", err);
    context.logStep?.(`[HEARTBEAT] Error: ${err.message}`);
  } finally {
    aiBusy = false;
  }
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
    void aiHeartbeatTick("time-fallback");
  } else {
    context.logStep?.(
      `[HEARTBEAT] Time fallback check: idle=${idleFor}ms (no tick)`
    );
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
}

// ============================================================================
//  STOP — disable fallback
// ============================================================================
export function stopAiHeartbeat() {
  if (!aiTimeFallbackTimer) return;
  clearInterval(aiTimeFallbackTimer);
  aiTimeFallbackTimer = null;

  aiOrganism?.context?.logStep?.("[HEARTBEAT] Time fallback stopped.");
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
export { AI_HEARTBEAT_META };

if (typeof module !== "undefined") {
  module.exports = { AI_HEARTBEAT_META };
}
