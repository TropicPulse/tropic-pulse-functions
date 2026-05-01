// ============================================================================
// PULSE-NET — Immortal Backend Heartbeat + Forward/Backward Engine ignition
// v14-EVO-IMMORTAL
//  • Multi-instance safe
//  • Drift-proof
//  • Dual-lane (forward/backward)
//  • Shared organism memory
//  • Exportable engines for Earn
//  • Deterministic tick sequencing
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
  lastAIHeartbeat: 0
};

// ============================================================================
// ENGINE SINGLETONS (per cold start OR per import in Earn)
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
    instanceId: "forward-netlify",
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
    instanceId: "backward-netlify",
    trace: true
  });

  backwardEngine.prewarm();
  return backwardEngine;
}

// ============================================================================
// HEARTBEAT HELPERS
// ============================================================================
async function getHeartbeatState() {
  return { last: globalThis.__PULSE_ORGANISM__.lastHeartbeat };
}

async function updateHeartbeatState(ts) {
  globalThis.__PULSE_ORGANISM__.lastHeartbeat = ts;
  console.log("Heartbeat updated:", ts);
}

async function runOrganismHeartbeat() {
  globalThis.__PULSE_ORGANISM__.lastHeartbeat = Date.now();
  console.log("Organism heartbeat triggered");
}

async function runAIHeartbeat() {
  globalThis.__PULSE_ORGANISM__.lastAIHeartbeat = Date.now();
  console.log("AI heartbeat triggered");
}

// ============================================================================
// ENGINE TICK HELPERS
// ============================================================================
async function warmForwardEngine() {
  const engine = getForwardEngine();
  const result = engine.tick();

  globalThis.__PULSE_ORGANISM__.forwardTicks++;

  console.log("[PULSE-NET] ForwardEngine tick:", result.metrics);
  return result.metrics;
}

async function warmBackwardEngine() {
  const engine = getBackwardEngine();
  const result = engine.tick();

  globalThis.__PULSE_ORGANISM__.backwardTicks++;

  console.log("[PULSE-NET] BackwardEngine tick:", result.metrics);
  return result.metrics;
}

// ============================================================================
// NETLIFY HANDLER (IMMORTAL ORGANISM LOOP)
// ============================================================================
export const handler = async () => {
  try {
    const state = await getHeartbeatState();

    const now = Date.now();
    const last = state?.last || 0;
    const stale = now - last > 90 * 1000;

    if (stale) {
      await runOrganismHeartbeat();
      await runAIHeartbeat();
      await updateHeartbeatState(now);
    }

    const forwardMetrics = await warmForwardEngine();
    const backwardMetrics = await warmBackwardEngine();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        stale,
        last,
        now,
        forward: forwardMetrics,
        backward: backwardMetrics,
        organism: globalThis.__PULSE_ORGANISM__
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// ============================================================================
// EXPORT ENGINES FOR EARN PAGE (SHARED ORGANISM)
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
