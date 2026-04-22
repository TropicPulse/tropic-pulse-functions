// ============================================================================
//  PulseSendSystem.js — Nervous System Conductor (v2.0)
//  Impulse → Pulse v2 (evolved) / Pulse v1 (legacy) → Router → Mesh → Send
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse
//    • Try Pulse v2 (evolved organism via PulseShifterEvolutionaryPulse)
//    • If Pulse v2 fails → fallback to LegacyPulse v1
//    • Route → Mesh → Send
//    • Return result to PulseBand
//
//  SAFETY:
//    • No direct network
//    • No GPU
//    • No Earn
//    • Pure internal routing + transport
// ============================================================================

// Evolutionary + legacy pulse builders
import { createPulse, evolvePulse } from "../pulse-shifter/PulseShifterEvolutionaryPulse.js";
import { createLegacyPulse, legacyPulseFromImpulse } from "../pulse-send/PulseSendLegacyPulse.js";

// Router
import { PulseRouter } from "../pulse-router/PulseRouterEvolutionaryThought.js";

import { PulseSend } from "./PulseSend.js";


// ============================================================================
//  INTERNAL: Try to build Pulse v2 safely
// ============================================================================
function tryPulseV2(impulse) {
  try {
    const basePulse = createPulse({
      jobId: impulse.tickId,
      pattern: impulse.intent,
      payload: impulse.payload,
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null
    });

    const evolved = evolvePulse(basePulse, {
      source: "PulseSendSystem",
      intent: impulse.intent,
      lineage: impulse.payload?.parentLineage || null
    });

    return { ok: true, pulse: evolved || basePulse };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Build Pulse v1 (fallback)
// ============================================================================
function buildPulseV1(impulse) {
  // Prefer explicit legacy builder if available
  if (typeof createLegacyPulse === "function") {
    return createLegacyPulse({
      jobId: impulse.tickId,
      intent: impulse.intent,
      payload: impulse.payload || {}
    });
  }

  // Fallback: direct impulse → legacy pulse
  return legacyPulseFromImpulse(impulse);
}


// ============================================================================
//  MAIN: Process a Pulse through the nervous system
// ============================================================================
async function processPulse(pulse, impulse) {
  // 1. Route
  const route = PulseRouter.route(pulse, impulse);

  // 2. Mesh — version‑aware inside PulseMesh
  const meshResult = await PulseMesh.process({
    pulse,
    route,
    impulse
  });

  // 3. Send — version‑aware inside PulseSend
  const sendResult = await PulseSend.send({
    pulse,
    meshResult,
    impulse
  });

  return sendResult;
}


// ============================================================================
//  PUBLIC API — PulseSendSystem
// ============================================================================
export const PulseSendSystem = {

  // --------------------------------------------------------------------------
  //  SEND — entry point for the entire nervous system
  // --------------------------------------------------------------------------
  async send(impulse) {
    // 1. Try Pulse v2 (evolutionary)
    const v2 = tryPulseV2(impulse);

    let pulse = null;
    let usedFallback = false;

    if (v2.ok) {
      pulse = v2.pulse;
    } else {
      // 2. Fallback to Pulse v1 (legacy)
      pulse = buildPulseV1(impulse);
      usedFallback = true;
    }

    // 3. Process through nervous system
    const result = await processPulse(pulse, impulse);

    // 4. Return to PulseBand (if present)
    if (typeof window !== "undefined" && window.PulseBand?.receivePulseSendResult) {
      window.PulseBand.receivePulseSendResult({
        impulse,
        pulse,
        result,
        fallback: usedFallback
      });
    }

    return {
      ok: true,
      pulse,
      result,
      fallback: usedFallback
    };
  }
};
