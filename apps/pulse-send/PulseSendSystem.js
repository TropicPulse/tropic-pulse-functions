// ============================================================================
//  PulseSendSystem.js — Nervous System Conductor (v1.0)
//  Unifies: Impulse → Pulse v2 / Pulse v1 → Router → Mesh → Send
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse
//    • Try Pulse v2 (evolved organism)
//    • If Pulse v2 fails → fallback to LegacyPulse v1
//    • Route → Mesh → Send
//    • Return result to PulseBand
//
//  SAFETY:
//    • No network
//    • No GPU
//    • No Earn
//    • No backend
//    • Pure internal routing
// ============================================================================

// External organs (you already have these)
import { createPulse, evolvePulse } from "./EvolutionaryPulse.js";
import { createLegacyPulse, legacyPulseFromImpulse } from "./LegacyPulse.js";

import { PulseRouter } from "./PulseRouter-v3.js";
import { PulseMesh }   from "./PulseMesh-v3.js";
import { PulseMeshV2 } from "./PulseMesh-v2.js";

import { PulseSend }   from "./PulseSend-v3.js";
import { PulseSendV2 } from "./PulseSend-v2.js";


// ============================================================================
//  INTERNAL: Try to build Pulse v2 safely
// ============================================================================
function tryPulseV2(impulse) {
  try {
    const p = createPulse({
      jobId: impulse.tickId,
      pattern: impulse.intent,
      payload: impulse.payload,
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null
    });

    return { ok: true, pulse: p };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Build Pulse v1 (fallback)
// ============================================================================
function buildPulseV1(impulse) {
  return legacyPulseFromImpulse(impulse);
}


// ============================================================================
//  MAIN: Process a Pulse through the nervous system
// ============================================================================
async function processPulse(pulse, impulse) {
  // 1. Route
  const route = PulseRouter.route(pulse, impulse);

  // 2. Mesh (v3 for Pulse v2, v2 for Pulse v1)
  const meshResult = pulse.PulseRole.version === "2.0"
    ? PulseMesh.process(pulse, route, impulse)
    : PulseMeshV2.process(pulse, route, impulse);

  // 3. Send (v3 for Pulse v2, v2 for Pulse v1)
  const sendResult = pulse.PulseRole.version === "2.0"
    ? await PulseSend.send(meshResult, impulse)
    : await PulseSendV2.send(meshResult, impulse);

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
    // 1. Try Pulse v2
    const v2 = tryPulseV2(impulse);

    let pulse = null;
    let usedFallback = false;

    if (v2.ok) {
      pulse = v2.pulse;
    } else {
      // 2. Fallback to Pulse v1
      pulse = buildPulseV1(impulse);
      usedFallback = true;
    }

    // 3. Process through nervous system
    const result = await processPulse(pulse, impulse);

    // 4. Return to PulseBand
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
