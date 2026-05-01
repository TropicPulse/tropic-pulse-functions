// ============================================================================
// PULSE-NET — Immortal Local Heartbeat + Forward/Backward Engine ignition
// v15-FAMILY-IMMORTAL
//  • Multi-instance safe
//  • Drift-proof
//  • Dual-lane (forward/backward)
//  • Shared organism memory
//  • Exportable engines for Earn
//  • Deterministic tick sequencing
//  • 3-heart mesh (Mom/Dad/Earn) + random nudge
//  • LOCAL ONLY — lives under PULSE-X, NOT a Netlify function
// ============================================================================

import { createForwardEngine } from "../ForwardEngine.js";
import { createBackwardEngine } from "../BackwardEngine.js";

// ============================================================================
// GLOBAL ORGANISM MEMORY (shared across all imports)
// ============================================================================
globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};
globalThis.__PULSE_ORGANISM__ = globalThis.__PULSE_ORGANISM__ || {
  forwardTicks: 0,
  backwardTicks: 0,
  lastHeartbeat: 0,
  lastAIHeartbeat: 0,
  lastBeatSource: "none"
};

// Local PULSE-NET runtime state
globalThis.__PULSE_NET__ = globalThis.__PULSE_NET__ || {
  started: false,
  intervalId: null,
  lastTick: 0
};

// ============================================================================
// ENGINE SINGLETONS (per import in Earn / PULSE-X)
// ============================================================================
let forwardEngine = null;
let backwardEngine = null;

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
// ENGINE FACTORIES (multi-instance safe)
// ============================================================================
function getForwardEngine() {
  if (forwardEngine) return forwardEngine;

  forwardEngine = createForwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: "forward-local",
    trace: true
  });

  forwardEngine.prewarm();
  return forwardEngine;
}

function getBackwardEngine() {
  if (backwardEngine) return backwardEngine;

  backwardEngine = createBackwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: "backward-local",
    trace: true
  });

  backwardEngine.prewarm();
  return backwardEngine;
}

// ============================================================================
// HEARTBEAT HELPERS
// ============================================================================
function getHeartbeatState() {
  return { last: globalThis.__PULSE_ORGANISM__.lastHeartbeat };
}

function updateHeartbeatState(ts) {
  globalThis.__PULSE_ORGANISM__.lastHeartbeat = ts;
  console.log("[PULSE-NET] Heartbeat updated:", ts);
}

function runOrganismHeartbeat(source) {
  const now = Date.now();
  globalThis.__PULSE_ORGANISM__.lastHeartbeat = now;
  globalThis.__PULSE_ORGANISM__.lastBeatSource = source;
  console.log("[PULSE-NET] Organism heartbeat:", source, now);
}

function runAIHeartbeat(source) {
  const now = Date.now();
  globalThis.__PULSE_ORGANISM__.lastAIHeartbeat = now;
  console.log("[PULSE-NET] AI heartbeat:", source, now);
}

// ============================================================================
// ENGINE TICK HELPERS
// ============================================================================
function warmForwardEngine() {
  const engine = getForwardEngine();
  const result = engine.tick();

  globalThis.__PULSE_ORGANISM__.forwardTicks++;
  console.log("[PULSE-NET] ForwardEngine tick:", result.metrics);
  return result.metrics;
}

function warmBackwardEngine() {
  const engine = getBackwardEngine();
  const result = engine.tick();

  globalThis.__PULSE_ORGANISM__.backwardTicks++;
  console.log("[PULSE-NET] BackwardEngine tick:", result.metrics);
  return result.metrics;
}

// ============================================================================
// 3-HEART MESH (Mom / Dad / Earn) + random nudge
// ============================================================================

// Mom Heart — primary beat: forward engine + organism heartbeat
function momHeart(now) {
  runOrganismHeartbeat("mom");
  const forwardMetrics = warmForwardEngine();
  return { source: "mom", forward: forwardMetrics };
}

// Dad Heart — fallback beat: backward engine + AI heartbeat
function dadHeart(now) {
  runAIHeartbeat("dad");
  const backwardMetrics = warmBackwardEngine();
  return { source: "dad", backward: backwardMetrics };
}

// Earn Heart — tertiary beat: both engines if stale, light touch if not
function earnHeart(now, stale) {
  if (stale) {
    runOrganismHeartbeat("earn-stale");
    runAIHeartbeat("earn-stale");
    const forwardMetrics = warmForwardEngine();
    const backwardMetrics = warmBackwardEngine();
    return {
      source: "earn-stale",
      forward: forwardMetrics,
      backward: backwardMetrics
    };
  } else {
    // light nudge: just ensure organism time moves
    runOrganismHeartbeat("earn-soft");
    return { source: "earn-soft" };
  }
}

// Random nudge — probabilistic extra push
function randomNudge(now) {
  if (Math.random() > 0.97) {
    runOrganismHeartbeat("random");
    console.log("[PULSE-NET] Random nudge beat");
    return { source: "random" };
  }
  return null;
}

// ============================================================================
// LOCAL IMMORTAL LOOP (NO NETLIFY, NO HANDLER)
// ============================================================================

function tickFamily() {
  const now = Date.now();
  const { last } = getHeartbeatState();
  const delta = now - (last || 0);

  const stale = delta > 90 * 1000;      // organism stale
  const softStale = delta > 15 * 1000;  // soft fallback threshold

  let result = null;

  // 1) Mom tries first (primary beat)
  if (!stale) {
    result = momHeart(now);
  } else {
    console.log("[PULSE-NET] Mom stale, escalating to Dad/Earn");
  }

  // 2) If Mom is stale or soft-stale, let Dad step in
  if (!result || softStale) {
    const dadResult = dadHeart(now);
    result = { ...(result || {}), ...dadResult };
  }

  // 3) If fully stale, Earn does a heavy rescue beat
  if (stale) {
    const earnResult = earnHeart(now, true);
    result = { ...(result || {}), ...earnResult };
  } else {
    // non-stale: Earn does a soft continuity beat
    const earnResult = earnHeart(now, false);
    result = { ...(result || {}), ...earnResult };
  }

  // 4) Random nudge as extra beat source
  const rnd = randomNudge(now);
  if (rnd) {
    result = { ...(result || {}), ...rnd };
  }

  globalThis.__PULSE_NET__.lastTick = now;
  return result;
}

// Start the local immortal loop (idempotent)
export function startPulseNet(intervalMs = 1000) {
  const state = globalThis.__PULSE_NET__;
  if (state.started) {
    console.log("[PULSE-NET] Already started");
    return;
  }

  state.started = true;
  state.intervalId = setInterval(() => {
    try {
      tickFamily();
    } catch (err) {
      console.error("[PULSE-NET] Tick error:", err);
    }
  }, intervalMs);

  console.log("[PULSE-NET] Local immortal family loop started @", intervalMs, "ms");
}

// ============================================================================
// EXPORT ENGINES + ORGANISM FOR EARN / OTHER ORGANS
// ============================================================================
export function PulseNetForward() {
  return getForwardEngine();
}

export function PulseNetBackward() {
  return getBackwardEngine();
}

export function PulseNetOrganism() {
  return globalThis.__PULSE_ORGANISM__;
}
