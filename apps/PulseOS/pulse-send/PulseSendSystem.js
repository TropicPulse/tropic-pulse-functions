// ============================================================================
//  PulseSendSystem.js — Nervous System Conductor (v10.4‑Evo)
//  Impulse → Pulse v3 → Pulse v2 → Pulse v1 → Router → Mesh → Send
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse
//    • Try Pulse v3 (unified organism)
//    • If v3 fails → try Pulse v2 (evolution engine)
//    • If v2 fails → fallback to Pulse v1 (EvoStable)
//    • Route → Mesh → Send → ReturnArc
//    • Return result to PulseBand
//
//  SAFETY:
//    • No network
//    • No GPU
//    • No Earn
//    • Pure internal routing + transport
// ============================================================================


// ============================================================================
//  IMPORTS — Pulse v1 / v2 / v3 creators
// ============================================================================
import { createPulseV3 } from "../pulse-send/PulseV3UnifiedOrganism.js";
import { createPulseV2 } from "../pulse-send/PulseV2EvolutionEngine.js";
import { createLegacyPulse } from "../pulse-send/PulseSendLegacyPulse.js";

// Router + Mesh + Send
import { PulseRouter } from "../pulse-router/PulseRouter-v10.4.js";
import { PulseMesh } from "../pulse-mesh/PulseMesh-v10.4.js";
import { createPulseSend } from "./pulse-send/PulseSend.js";


// ============================================================================
//  BUILD PulseSend (v10.4‑Evo)
// ============================================================================
const PulseSend = createPulseSend({
  createPulseV3,
  createPulseV2,
  createPulseV1: createLegacyPulse,
  pulseRouter: PulseRouter,
  pulseMesh: PulseMesh,
  createPulseSendMover,
  createPulseSendImpulse,
  createPulseSendReturn,
  log: console.log
});


// ============================================================================
//  INTERNAL: Try Pulse v3 (Unified Organism)
// ============================================================================
function tryPulseV3(impulse) {
  try {
    const pulse = createPulseV3({
      jobId: impulse.tickId,
      pattern: impulse.intent,
      payload: impulse.payload,
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null,
      mode: impulse.payload?.mode || "normal"
    });

    return { ok: true, pulse };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Try Pulse v2 (Evolution Engine)
// ============================================================================
function tryPulseV2(impulse) {
  try {
    const pulse = createPulseV2({
      jobId: impulse.tickId,
      pattern: impulse.intent,
      payload: impulse.payload,
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null,
      mode: impulse.payload?.mode || "normal"
    });

    return { ok: true, pulse };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Build Pulse v1 (EvoStable)
// ============================================================================
function buildPulseV1(impulse) {
  return createLegacyPulse({
    jobId: impulse.tickId,
    pattern: impulse.intent,
    payload: impulse.payload || {},
    priority: impulse.payload?.priority || "normal",
    returnTo: impulse.payload?.returnTo || null,
    parentLineage: impulse.payload?.parentLineage || null,
    mode: impulse.payload?.mode || "normal"
  });
}


// ============================================================================
//  PUBLIC API — PulseSendSystem (v10.4‑Evo)
// ============================================================================
export const PulseSendSystem = {

  // --------------------------------------------------------------------------
  //  SEND — entry point for the entire nervous system
  // --------------------------------------------------------------------------
  async send(impulse) {
    let pulse = null;
    let fallbackTier = null;

    // ================================================================
    // ⭐ Tier 1 — Try Pulse v3 (Unified Organism)
    // ================================================================
    const v3 = tryPulseV3(impulse);
    if (v3.ok) {
      pulse = v3.pulse;
      fallbackTier = "v3";
    } else {
      console.warn("[PulseSendSystem] Pulse v3 failed → trying v2");
    }

    // ================================================================
    // ⭐ Tier 2 — Try Pulse v2 (Evolution Engine)
    // ================================================================
    if (!pulse) {
      const v2 = tryPulseV2(impulse);
      if (v2.ok) {
        pulse = v2.pulse;
        fallbackTier = "v2";
      } else {
        console.warn("[PulseSendSystem] Pulse v2 failed → falling back to v1");
      }
    }

    // ================================================================
    // ⭐ Tier 3 — Fallback to Pulse v1 (EvoStable)
    // ================================================================
    if (!pulse) {
      pulse = buildPulseV1(impulse);
      fallbackTier = "v1";
    }

    // ================================================================
    // ⭐ Transport Chain — Router → Mesh → Send → ReturnArc
    // ================================================================
    const result = PulseSend.send({
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      payload: pulse.payload,
      priority: pulse.priority,
      returnTo: pulse.returnTo,
      mode: pulse.mode
    });

    // ================================================================
    // ⭐ Return to PulseBand (if present)
    // ================================================================
    if (typeof window !== "undefined" && window.PulseBand?.receivePulseSendResult) {
      window.PulseBand.receivePulseSendResult({
        impulse,
        pulse,
        result,
        fallbackTier
      });
    }

    return {
      ok: true,
      pulse,
      result,
      fallbackTier
    };
  }
};
