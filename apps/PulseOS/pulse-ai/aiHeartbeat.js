// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiHeartbeat.js
// LAYER: AI HEARTBEAT (Pulse-Driven + Time-Fallback)
// ============================================================================

import { createBrainstem } from "./aiBrainstem.js";
import { getDb, getFsAPI, getRouteAPI, getSchemaAPI } from "./aiDeps.js";

// --------------------------------------------------------------------------
// CONFIG
// --------------------------------------------------------------------------

// Minimum time between heartbeats (prevents churn)
const AI_MIN_GAP_MS = 1500;

// If no pulses occur for this long, time-fallback will fire
const AI_MAX_IDLE_MS = 15000;

// How often to check for idle state (very light)
const AI_TIME_CHECK_INTERVAL_MS = 5000;

// --------------------------------------------------------------------------
// SINGLETON: one AI organism per warm container
// --------------------------------------------------------------------------
let aiOrganism = null;

// Concurrency + cadence control
let aiBusy = false;
let lastRun = 0;

// Time fallback interval
let aiTimeFallbackTimer = null;

// --------------------------------------------------------------------------
// BOOT: create the AI organism (brainstem + organs)
// --------------------------------------------------------------------------
function bootAiOrganism() {
  if (aiOrganism) return aiOrganism;

  const db = getDb();
  const fsAPI = getFsAPI();
  const routeAPI = getRouteAPI();
  const schemaAPI = getSchemaAPI();

  const request = {
    userId: null,
    personaId: null
  };

  aiOrganism = createBrainstem(request, db, fsAPI, routeAPI, schemaAPI);
  aiOrganism.context.logStep?.("[AI-HEARTBEAT] Brainstem created.");

  // Initialize lastRun so fallback has a baseline
  lastRun = Date.now();

  return aiOrganism;
}

// --------------------------------------------------------------------------
// CORE: one AI heartbeat tick (guarded)
// --------------------------------------------------------------------------
async function aiHeartbeatTick(reason = "unknown") {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context, organs } = organism;

  // Cooldown guard
  if (now - lastRun < AI_MIN_GAP_MS) {
    context.logStep?.(
      `[AI-HEARTBEAT] Skipped (cooldown). reason=${reason}, delta=${now - lastRun}ms`
    );
    return;
  }

  // Concurrency guard
  if (aiBusy) {
    context.logStep?.(
      `[AI-HEARTBEAT] Skipped (busy). reason=${reason}`
    );
    return;
  }

  aiBusy = true;
  lastRun = now;

  try {
    context.logStep?.(`[AI-HEARTBEAT] Tick start. reason=${reason}`);

    if (organs.thought?.run) await organs.thought.run();
    if (organs.memory?.run) await organs.memory.run();
    if (organs.evolution?.run) await organs.evolution.run();
    if (organs.routes?.scan) await organs.routes.scan();
    if (organs.voiceCache?.maintain) await organs.voiceCache.maintain();

    context.logStep?.("[AI-HEARTBEAT] Tick complete.");
  } catch (err) {
    console.error("[AI-HEARTBEAT] Tick error:", err);
  } finally {
    aiBusy = false;
  }
}

// --------------------------------------------------------------------------
// PULSE ENTRY: call this from ANY internal signal
// --------------------------------------------------------------------------
export function pulseAiHeartbeat(source = "unknown") {
  const organism = bootAiOrganism();
  organism.context.logStep?.(
    `[AI-HEARTBEAT] Pulse detected from: ${source}`
  );

  // Fire tick (guards prevent churn)
  void aiHeartbeatTick(`pulse:${source}`);
}

// --------------------------------------------------------------------------
// TIME FALLBACK: fires only if no pulses for too long
// --------------------------------------------------------------------------
function timeFallbackCheck() {
  const now = Date.now();
  const organism = bootAiOrganism();
  const { context } = organism;

  const idleFor = now - lastRun;

  if (idleFor >= AI_MAX_IDLE_MS) {
    context.logStep?.(
      `[AI-HEARTBEAT] Time fallback triggered after idle=${idleFor}ms`
    );
    void aiHeartbeatTick("time-fallback");
  } else {
    context.logStep?.(
      `[AI-HEARTBEAT] Time fallback check: idle=${idleFor}ms (no tick)`
    );
  }
}

// --------------------------------------------------------------------------
// START: enable time-based survival fallback
// --------------------------------------------------------------------------
export function startAiHeartbeat() {
  if (aiTimeFallbackTimer) return; // already running

  bootAiOrganism();

  aiTimeFallbackTimer = setInterval(() => {
    timeFallbackCheck();
  }, AI_TIME_CHECK_INTERVAL_MS);

  aiOrganism.context.logStep?.(
    `[AI-HEARTBEAT] Time fallback active; checkInterval=${AI_TIME_CHECK_INTERVAL_MS}ms, maxIdle=${AI_MAX_IDLE_MS}ms`
  );
}

// --------------------------------------------------------------------------
// STOP: disable time-based fallback
// --------------------------------------------------------------------------
export function stopAiHeartbeat() {
  if (!aiTimeFallbackTimer) return;
  clearInterval(aiTimeFallbackTimer);
  aiTimeFallbackTimer = null;

  if (aiOrganism?.context?.logStep) {
    aiOrganism.context.logStep("[AI-HEARTBEAT] Time fallback stopped.");
  }
}

// --------------------------------------------------------------------------
// SERVERLESS / ROUTE ENTRY (optional)
// --------------------------------------------------------------------------
export async function handler(event, context) {
  startAiHeartbeat();
  pulseAiHeartbeat("handler");
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: "AI heartbeat armed." })
  };
}
