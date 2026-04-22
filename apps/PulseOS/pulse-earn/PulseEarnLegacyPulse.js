// ============================================================================
//  PulseEarnLegacyPulse.js — Earn v1 Fallback Wrapper (v1.0)
//  Bridges LegacyEarn → PulseSendSystem using Pulse-compatible shape
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse
//    • Build LegacyEarn v1 (stable fallback)
//    • Wrap it in Pulse-compatible shape
//    • Send through PulseSendSystem
//    • Return results to EarnBand / PulseBand
//
//  SAFETY:
//    • No network
//    • No GPU
//    • No miner
//    • Pure internal routing
// ============================================================================

import { legacyEarnFromImpulse } from "./LegacyEarn.js";
import { PulseSendSystem } from "./PulseSendSystem.js";


// ============================================================================
//  INTERNAL: Build Pulse-Compatible Earn Wrapper
// ============================================================================
function buildPulseCompatibleEarn(earn) {
  if (!earn) return null;

  return {
    PulseRole: earn.EarnRole,   // PulseSendSystem expects PulseRole-like structure
    jobId: earn.jobId,
    pattern: earn.pattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    meta: earn.meta,

    // Earn-specific identity
    earn: {
      role: earn.EarnRole,
      pattern: earn.pattern,
      lineage: earn.lineage,
      meta: earn.meta
    }
  };
}


// ============================================================================
//  PUBLIC API — PulseEarnLegacyPulse
// ============================================================================
export const PulseEarnLegacyPulse = {

  // --------------------------------------------------------------------------
  //  SEND — entry point for Earn v1 fallback
  // --------------------------------------------------------------------------
  async send(impulse) {
    // 1. Build Earn v1 from Impulse
    const earnV1 = legacyEarnFromImpulse(impulse);

    // 2. Wrap Earn v1 in Pulse-compatible shape
    const pulseCompatibleEarn = buildPulseCompatibleEarn(earnV1);

    // 3. Send through Pulse nervous system
    const result = await PulseSendSystem.send({
      ...impulse,
      payload: {
        ...impulse.payload,
        earn: pulseCompatibleEarn
      }
    });

    // 4. Return results to EarnBand (if present)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnResult) {
      window.EarnBand.receiveEarnResult({
        impulse,
        earn: earnV1,
        pulseCompatibleEarn,
        result,
        fallback: true
      });
    }

    return {
      ok: true,
      earn: earnV1,
      pulseCompatibleEarn,
      result,
      fallback: true
    };
  }
};
