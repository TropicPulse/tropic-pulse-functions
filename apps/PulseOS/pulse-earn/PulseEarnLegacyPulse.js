// ============================================================================
//  PulseEarnLegacyPulse.js — Earn v1 Fallback Wrapper (v4.0 HARD-SAFE)
//  NO PulseSendSystem, NO network, NO routing, NO loops.
//  Only: build LegacyEarn v1 + Pulse-compatible envelope and return it.
// ============================================================================

// ============================================================================
//  INTERNAL: Build LegacyEarn v1 directly from impulse (NO IMPORTS)
// ============================================================================
function buildLegacyEarnFromImpulse(impulse) {
  const payload = impulse?.payload || {};

  return {
    EarnRole: {
      kind: "Earn",
      version: "1.0",
      identity: "Earn-v1"
    },
    jobId: impulse.tickId || payload.jobId || "UNKNOWN_JOB",
    pattern: impulse.intent || payload.pattern || "UNKNOWN_PATTERN",
    payload,
    priority: payload.priority || "normal",
    returnTo: payload.returnTo || null,
    lineage: payload.parentLineage || [],
    meta: {
      ...(payload.meta || {}),
      legacy: true,
      origin: "LegacyEarn",
      timestamp: Date.now()
    }
  };
}

// ============================================================================
//  INTERNAL: Build Pulse-Compatible Earn Wrapper
// ============================================================================
function buildPulseCompatibleEarn(earn) {
  if (!earn) return null;

  return {
    PulseRole: earn.EarnRole,
    jobId: earn.jobId,
    pattern: earn.pattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    meta: {
      ...(earn.meta || {}),
      origin: "LegacyEarn",
      earnVersion: "1.0",
      earnIdentity: "Earn-v1",
      earnEnvelope: true
    },
    earn: {
      role: earn.EarnRole,
      pattern: earn.pattern,
      lineage: earn.lineage,
      meta: earn.meta,
      __earnEnvelope: true
    }
  };
}

// ============================================================================
//  PUBLIC API — PulseEarnLegacyPulse (v4.0 HARD-SAFE)
//  NOTE: This module DOES NOT SEND ANYTHING.
//        It only returns the legacy Earn + envelope.
//        Caller decides if/where to send, under a governor.
// ============================================================================
export const PulseEarnLegacyPulse = {

  async build(impulse) {
    // 1. Build Earn v1 from Impulse
    const earnV1 = buildLegacyEarnFromImpulse(impulse);

    // 2. Wrap Earn v1 in Pulse-compatible shape
    const pulseCompatibleEarn = buildPulseCompatibleEarn(earnV1);

    // 3. Optionally notify EarnBand (local only, no routing)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnResult) {
      window.EarnBand.receiveEarnResult({
        impulse,
        earn: earnV1,
        pulseCompatibleEarn,
        result: null,
        fallback: true
      });
    }

    // 4. Return ONLY the structures; no sending, no routing.
    return {
      ok: true,
      earn: earnV1,
      pulseCompatibleEarn,
      fallback: true
    };
  }
};
