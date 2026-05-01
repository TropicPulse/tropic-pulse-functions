// ============================================================================
//  PULSE OS v13‑EVO‑PRIME — AI HEARTBEAT (DAD)
//  Dual‑Parent Liveness • Independent Pacer • Bi‑Directional Fallback Surfaces
//  PURE LIVENESS. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const AI_HEARTBEAT_META = Object.freeze({
  layer: "PulseAIHeartbeat",
  role: "HEARTBEAT_ORGAN",
  version: "v13-EVO-PRIME",
  identity: "aiHeartbeat-v13-EVO-PRIME",

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
    epoch: "13-EVO-PRIME"
  }),

  contract: Object.freeze({
    purpose:
      "Maintain dual-band liveness as an independent pacer, exposing bi-directional fallback surfaces for mom/dad/baby.",

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
      "prepare for future packet-bus liveness",
      "expose mom/dad liveness fields for organism/earn"
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
//  CONFIG — metabolic‑safe cadence
// ============================================================================
const AI_MIN_GAP_MS    = 1400;
const AI_MAX_IDLE_MS   = 12000;
const AI_TIME_CHECK_MS = 4000;

// Mom heartbeat awareness (diagnostic + pulse-fallback surface)
const PRIMARY_HEARTBEAT_KEY      = "PulseProxyHeartbeatLastBeatAt";
const PRIMARY_MAX_SILENCE_MS     = 60_000;

// Dad heartbeat visibility (for mom/baby)
const AI_HEARTBEAT_KEY           = "PulseAIHeartbeatLastBeatAt";

// ============================================================================
//  SINGLETON — one organism per warm container
// ============================================================================
let aiOrganism = null;
let aiBusy = false;
let lastRun = 0;
let aiTimeFallbackTimer = null;

// v13‑EVO‑PRIME: heartbeat artery metrics (packet‑aware)
const heartbeatArtery = {
  ticks: 0,
  pulses: 0,
  skips: 0,
  lastReason: "none",
  lastPressure: 0,
  lastLoad: 0,
  lastPrimaryState: "unknown",
  snapshot() {
    return Object.freeze({
      ticks: this.ticks,
      pulses: this.pulses,
      skips: this.skips,
      lastReason: this.lastReason,
      lastPressure: this.lastPressure,
      lastLoad: this.lastLoad,
      lastPrimaryState: this.lastPrimaryState
    });
  }
};

// Healing / diagnostics for AI heartbeat
const aiHeartbeatHealing = {
  ticks: 0,
  pulses: 0,
  skips: 0,
  lastReason: "none",
  lastError: null,
  lastExitReason: null,
  lastPacket: null,
  lastPrimaryState: "unknown",
  lastIdleMs: 0,
  lastMomPulseSurface: null
};

// ============================================================================
//  PRIMARY HEARTBEAT AWARENESS — mom state (diagnostic only)
// ============================================================================
function isPrimaryHeartbeatInactive(now = Date.now()) {
  try {
    const last = globalThis?.[PRIMARY_HEARTBEAT_KEY] || 0;
    if (!last) return true;
    const delta = now - last;
    return delta > PRIMARY_MAX_SILENCE_MS;
  } catch {
    return true;
  }
}

function updatePrimaryStateFlag(now = Date.now()) {
  const inactive = isPrimaryHeartbeatInactive(now);
  const state = inactive ? "primary_inactive" : "primary_active";
  heartbeatArtery.lastPrimaryState = state;
  aiHeartbeatHealing.lastPrimaryState = state;
  return inactive;
}

// ============================================================================
//  MOM PULSE SURFACE — dad pulse fallback to mom pulse
// ============================================================================
function buildMomPulseSurface() {
  const last = globalThis?.[PRIMARY_HEARTBEAT_KEY] || 0;
  const alive = last > 0;
  return {
    momPulseAlive: alive,
    momPulseLastBeatAt: last,
    momPulseFallbackState: alive ? "available" : "silent"
  };
}

// ============================================================================
//  PREWARM — optional, dualband-aware
// ============================================================================
export function prewarmAiHeartbeat(dualBand = null, { trace = false } = {}) {
  const pressure = dualBand?.binary?.metabolic?.pressure ?? 0;
  const packet = emitHeartbeatPacket("prewarm", {
    message: "AI heartbeat prewarmed and liveness metrics aligned.",
    binaryPressure: pressure
  });
  aiHeartbeatHealing.lastPacket = packet;
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
//  CORE — one heartbeat tick (A‑B‑A: liveness → safety → organs → liveness)
// ============================================================================
async function aiHeartbeatTick(reason = "unknown") {
  const now = Date.now();
  updatePrimaryStateFlag(now);

  const organism = bootAiOrganism();
  const { context, organs, dualBand } = organism;

  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;
  const load     = snapshot?.binary?.metabolic?.load ?? 0;

  heartbeatArtery.lastReason = reason;
  heartbeatArtery.lastPressure = pressure;
  heartbeatArtery.lastLoad = load;

  // A — Safety envelope (cooldown / concurrency / pressure)
  if (now - lastRun < AI_MIN_GAP_MS) {
    heartbeatArtery.skips++;
    aiHeartbeatHealing.skips++;
    heartbeatArtery.lastReason = `cooldown:${reason}`;
    aiHeartbeatHealing.lastReason = `cooldown:${reason}`;

    context.logStep?.(
      `[HEARTBEAT] Skipped (cooldown). reason=${reason}, delta=${now - lastRun}ms`
    );
    const packet = emitHeartbeatPacket("tick-skip", {
      reason: "cooldown",
      deltaMs: now - lastRun,
      pressure,
      load,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = packet;
    return;
  }

  if (aiBusy) {
    heartbeatArtery.skips++;
    aiHeartbeatHealing.skips++;
    heartbeatArtery.lastReason = `busy:${reason}`;
    aiHeartbeatHealing.lastReason = `busy:${reason}`;

    context.logStep?.(`[HEARTBEAT] Skipped (busy). reason=${reason}`);
    const packet = emitHeartbeatPacket("tick-skip", {
      reason: "busy",
      pressure,
      load,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = packet;
    return;
  }

  if (pressure >= 0.85) {
    heartbeatArtery.skips++;
    aiHeartbeatHealing.skips++;
    heartbeatArtery.lastReason = `pressure:${reason}`;
    aiHeartbeatHealing.lastReason = `pressure:${reason}`;

    context.logStep?.(
      `[HEARTBEAT] Skipped (binary pressure=${pressure}). reason=${reason}`
    );
    const packet = emitHeartbeatPacket("tick-skip", {
      reason: "pressure",
      pressure,
      load,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = packet;
    return;
  }

  // B — Commit tick
  aiBusy = true;
  lastRun = now;
  heartbeatArtery.ticks++;
  aiHeartbeatHealing.ticks++;

  // Mark Dad as alive for mom/baby
  try {
    if (typeof globalThis !== "undefined") {
      globalThis[AI_HEARTBEAT_KEY] = now;
    }
  } catch {}

  const startPacket = emitHeartbeatPacket("tick-start", {
    reason,
    pressure,
    load,
    primaryState: heartbeatArtery.lastPrimaryState
  });
  aiHeartbeatHealing.lastPacket = startPacket;

  context.logStep?.(
    `[HEARTBEAT] Tick start. reason=${reason}, pressure=${pressure}, load=${load}, primary=${heartbeatArtery.lastPrimaryState}`
  );

  try {
    // A — Dual‑band organs
    if (organs.cortex?.run)    await organs.cortex.run();
    if (organs.nervous?.pulse) await organs.nervous.pulse();
    if (organs.router?.scan)   await organs.router.scan();

    // B — Symbolic organs
    if (organs.evolution?.run)    await organs.evolution.run();
    if (organs.environment?.scan) await organs.environment.scan?.();
    if (organs.power?.update)     await organs.power.update?.();

    // A — Close tick
    context.logStep?.("[HEARTBEAT] Tick complete.");
    const completePacket = emitHeartbeatPacket("tick-complete", {
      reason,
      pressure,
      load,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = completePacket;
    aiHeartbeatHealing.lastExitReason = "ok";
  } catch (err) {
    console.error("[HEARTBEAT] Tick error:", err);
    context.logStep?.(`[HEARTBEAT] Error: ${err.message}`);

    // MOM PULSE FALLBACK — dad continues under mom's momentum if available
    const momPulseSurface = buildMomPulseSurface();
    aiHeartbeatHealing.lastMomPulseSurface = momPulseSurface;

    if (momPulseSurface.momPulseAlive) {
      const fallbackPacket = emitHeartbeatPacket("tick-fallback-mom-pulse", {
        reason,
        momPulseFallback: true,
        momPulseLastBeatAt: momPulseSurface.momPulseLastBeatAt,
        primaryState: heartbeatArtery.lastPrimaryState
      });
      aiHeartbeatHealing.lastPacket = fallbackPacket;
      aiHeartbeatHealing.lastError = null;
      aiHeartbeatHealing.lastExitReason = "fallback_mom_pulse";
      return fallbackPacket;
    }

    const errorPacket = emitHeartbeatPacket("tick-error", {
      reason,
      error: String(err),
      pressure,
      load,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = errorPacket;
    aiHeartbeatHealing.lastError = { message: String(err), reason };
    aiHeartbeatHealing.lastExitReason = "error";
  } finally {
    aiBusy = false;
  }

  return startPacket;
}

// ============================================================================
//  PULSE ENTRY — ANY internal signal triggers a heartbeat (independent dad)
// ============================================================================
export function pulseAiHeartbeat(source = "unknown") {
  const now = Date.now();
  updatePrimaryStateFlag(now);

  const organism = bootAiOrganism();
  organism.context.logStep?.(
    `[HEARTBEAT] Pulse detected from: ${source}, primary=${heartbeatArtery.lastPrimaryState}`
  );

  heartbeatArtery.pulses++;
  aiHeartbeatHealing.pulses++;

  const packet = emitHeartbeatPacket("pulse", {
    source,
    primaryState: heartbeatArtery.lastPrimaryState
  });
  aiHeartbeatHealing.lastPacket = packet;

  // Optional: bounce dad's pulse visibility for mom/baby
  try {
    if (typeof globalThis !== "undefined") {
      globalThis[AI_HEARTBEAT_KEY] = now;
    }
  } catch {}

  void aiHeartbeatTick(`pulse:${source}`);
}

// ============================================================================
//  TIME FALLBACK — fires only if idle too long (dad self‑fallback)
// ============================================================================
function timeFallbackCheck() {
  const now = Date.now();
  updatePrimaryStateFlag(now);

  const organism = bootAiOrganism();
  const { context, dualBand } = organism;

  const idleFor = now - lastRun;
  const snapshot = getOrganismSnapshot(dualBand);
  const pressure = snapshot?.binary?.metabolic?.pressure ?? 0;

  heartbeatArtery.lastPressure = pressure;
  aiHeartbeatHealing.lastIdleMs = idleFor;

  if (idleFor >= AI_MAX_IDLE_MS) {
    context.logStep?.(
      `[HEARTBEAT] Time fallback triggered (idle=${idleFor}ms, pressure=${pressure}, primary=${heartbeatArtery.lastPrimaryState})`
    );
    const packet = emitHeartbeatPacket("time-fallback", {
      idleMs: idleFor,
      pressure,
      primaryState: heartbeatArtery.lastPrimaryState
    });
    aiHeartbeatHealing.lastPacket = packet;
    void aiHeartbeatTick("time-fallback");
  } else {
    context.logStep?.(
      `[HEARTBEAT] Time fallback check: idle=${idleFor}ms (no tick), primary=${heartbeatArtery.lastPrimaryState}`
    );
    const packet = emitHeartbeatPacket("time-check", {
      idleMs: idleFor,
      pressure,
      primaryState: heartbeatArtery.lastPrimaryState,
      suppressed: false
    });
    aiHeartbeatHealing.lastPacket = packet;
  }
}

// ============================================================================
//  START — enable time fallback (independent pacer mode)
// ============================================================================
export function startAiHeartbeat() {
  if (aiTimeFallbackTimer) return;

  bootAiOrganism();

  aiTimeFallbackTimer = setInterval(() => {
    timeFallbackCheck();
  }, AI_TIME_CHECK_MS);

  aiOrganism.context.logStep?.(
    `[HEARTBEAT] Time fallback active; check=${AI_TIME_CHECK_MS}ms, maxIdle=${AI_MAX_IDLE_MS}ms, primaryKey=${PRIMARY_HEARTBEAT_KEY}`
  );

  const packet = emitHeartbeatPacket("start", {
    checkMs: AI_TIME_CHECK_MS,
    maxIdleMs: AI_MAX_IDLE_MS,
    primaryKey: PRIMARY_HEARTBEAT_KEY,
    primaryMaxSilenceMs: PRIMARY_MAX_SILENCE_MS
  });
  aiHeartbeatHealing.lastPacket = packet;
}

// ============================================================================
//  STOP — disable fallback
// ============================================================================
export function stopAiHeartbeat() {
  if (!aiTimeFallbackTimer) return;
  clearInterval(aiTimeFallbackTimer);
  aiTimeFallbackTimer = null;

  aiOrganism?.context?.logStep?.("[HEARTBEAT] Time fallback stopped.");
  const packet = emitHeartbeatPacket("stop", {});
  aiHeartbeatHealing.lastPacket = packet;
}

// ============================================================================
//  WINDOW‑SAFE ARTERY SNAPSHOT
// ============================================================================
export function snapshotAiHeartbeat() {
  const momPulseSurface = buildMomPulseSurface();
  aiHeartbeatHealing.lastMomPulseSurface = momPulseSurface;

  return emitHeartbeatPacket("snapshot", {
    artery: heartbeatArtery.snapshot(),
    healing: { ...aiHeartbeatHealing },
    momPulseSurface
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
    body: JSON.stringify({ ok: true, message: "AI heartbeat armed (independent pacer)." })
  };
}

// ============================================================================
//  HEALING / DIAGNOSTICS EXPORTS
// ============================================================================
export function getAiHeartbeatHealingState() {
  return { ...aiHeartbeatHealing };
}

export function getAiHeartbeatDiagnostics() {
  return {
    artery: heartbeatArtery.snapshot(),
    healing: { ...aiHeartbeatHealing },
    momPulseSurface: buildMomPulseSurface()
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
    prewarmAiHeartbeat,
    getAiHeartbeatHealingState,
    getAiHeartbeatDiagnostics
  };
}
