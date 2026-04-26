// ============================================================================
//  PULSE OS v11‑EVO — AI HEARTBEAT
//  Pulse‑Driven • Binary‑Aware • Time‑Fallback • Dual‑Band Liveness
//  PURE LIVENESS. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const AI_HEARTBEAT_META = Object.freeze({
  layer: "PulseAIHeartbeat",
  role: "HEARTBEAT_ORGAN",
  version: "11.0-EVO",
  identity: "aiHeartbeat-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    metabolicAware: true,
    livenessAware: true,
    cooldownAware: true,
    fallbackAware: true,
    concurrencyAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Maintain dual-band liveness through pulse-driven and time-fallback heartbeats, respecting metabolic safety and preventing churn.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "override cortex decisions",
      "override router decisions",
      "bypass metabolic safety",
      "spawn multiple organisms",
      "perform cognition",
      "perform analysis"
    ]),

    always: Object.freeze([
      "respect binary metabolic pressure",
      "respect cooldown windows",
      "skip ticks when unsafe",
      "run cortex/nervous/router pulses safely",
      "fallback when idle too long",
      "log deterministic steps",
      "return frozen state"
    ])
  })
});

import { createBrainstem } from "./aiBrainstem.js";
import {
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot
} from "./aiDeps.js";

// --------------------------------------------------------------------------
// CONFIG — metabolic‑safe cadence
// --------------------------------------------------------------------------
const AI_MIN_GAP_MS = 1500;     // prevents churn
const AI_MAX_IDLE_MS = 15000;   // fallback threshold
const AI_TIME_CHECK_MS = 5000;  // idle check cadence

// --------------------------------------------------------------------------
// SINGLETON — one organism per warm container
// --------------------------------------------------------------------------
let aiOrganism = null;
let aiBusy = false;
let lastRun = 0;
let aiTimeFallbackTimer = null;

// --------------------------------------------------------------------------
// BOOT — create dual‑band organism
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// CORE — one heartbeat tick (dual‑band + binary‑aware)
// --------------------------------------------------------------------------
async function aiHeartbeatTick(reason = "unknown") {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context, organs, dualBand } = organism;

  // Binary vitals
  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;
  const load = snapshot?.binary?.metabolic?.load ?? 0;

  // Cooldown guard
  if (now - lastRun < AI_MIN_GAP_MS) {
    context.logStep?.(
      `[HEARTBEAT] Skipped (cooldown). reason=${reason}, delta=${now - lastRun}ms`
    );
    return;
  }

  // Concurrency guard
  if (aiBusy) {
    context.logStep?.(`[HEARTBEAT] Skipped (busy). reason=${reason}`);
    return;
  }

  // Metabolic pressure guard
  if (pressure >= 0.85) {
    context.logStep?.(
      `[HEARTBEAT] Skipped (binary pressure=${pressure}). reason=${reason}`
    );
    return;
  }

  aiBusy = true;
  lastRun = now;

  try {
    context.logStep?.(
      `[HEARTBEAT] Tick start. reason=${reason}, pressure=${pressure}, load=${load}`
    );

    // Dual‑band organs
    if (organs.cortex?.run) await organs.cortex.run();
    if (organs.nervous?.pulse) await organs.nervous.pulse();
    if (organs.router?.scan) await organs.router.scan();

    // Symbolic organs
    if (organs.evolution?.run) await organs.evolution.run();
    if (organs.environment?.scan) await organs.environment.scan?.();
    if (organs.power?.update) await organs.power.update?.();

    context.logStep?.("[HEARTBEAT] Tick complete.");
  } catch (err) {
    console.error("[HEARTBEAT] Tick error:", err);
    context.logStep?.(`[HEARTBEAT] Error: ${err.message}`);
  } finally {
    aiBusy = false;
  }
}

// --------------------------------------------------------------------------
// PULSE ENTRY — ANY internal signal triggers a heartbeat
// --------------------------------------------------------------------------
export function pulseAiHeartbeat(source = "unknown") {
  const organism = bootAiOrganism();
  organism.context.logStep?.(`[HEARTBEAT] Pulse detected from: ${source}`);

  void aiHeartbeatTick(`pulse:${source}`);
}

// --------------------------------------------------------------------------
// TIME FALLBACK — fires only if idle too long
// --------------------------------------------------------------------------
function timeFallbackCheck() {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context, dualBand } = organism;

  const idleFor = now - lastRun;
  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;

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

// --------------------------------------------------------------------------
// START — enable time fallback
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// STOP — disable fallback
// --------------------------------------------------------------------------
export function stopAiHeartbeat() {
  if (!aiTimeFallbackTimer) return;
  clearInterval(aiTimeFallbackTimer);
  aiTimeFallbackTimer = null;

  aiOrganism?.context?.logStep?.("[HEARTBEAT] Time fallback stopped.");
}

// --------------------------------------------------------------------------
// SERVERLESS ENTRY
// --------------------------------------------------------------------------
export async function handler(event, context) {
  startAiHeartbeat();
  pulseAiHeartbeat("handler");
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: "AI heartbeat armed." })
  };
}
