// ============================================================================
//  PulseEarnSendSystem.js — Earn Nervous System Conductor (v2.0 - GOVERNED)
//  Tries Earn v2 → falls back to Earn v1 (via legacy Pulse) → delegates to PulseSendSystem
//  NOW WITH: Single-pass Earn → Pulse → Send, no Earn re-entry, no loops.
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse (from Earn worker / UI / system).
//    • Try to build Earn v2 (evolved organism).
//    • If Earn v2 fails → fallback to Earn v1 (legacy pulse-style).
//    • Wrap Earn organism into Pulse-compatible payload (tagged, single-use).
//    • Delegate routing/mesh/send to PulseSendSystem ONCE per Earn lifecycle.
//
//  SAFETY:
//    • No network (delegated to PulseSendSystem).
//    • No GPU.
//    • No miner.
//    • No compute.
//    • Pure internal orchestration + loop governor.
//    • Prevents Earn → Send → Earn re-entry.
// ============================================================================

import { createEarn, evolveEarn } from "./PulseEarn.js";
import {
  createLegacyPulse,
  legacyPulseFromImpulse
} from "../pulse-send/PulseSendLegacyPulse.js";
import { PulseRouter } from "../pulse-router/PulseRouterEvolutionaryThought.js";
import { PulseSendSystem } from "../pulse-send/PulseSendSystem.js";


// ============================================================================
//  INTERNAL: Earn Loop Guard / Governor
// ============================================================================

// Detect if this impulse is already carrying an Earn envelope
// i.e., this is a re-entry from a Pulse that already went through Earn.
function isEarnReentryImpulse(impulse) {
  if (!impulse || !impulse.payload) return false;

  const earn = impulse.payload.earn;

  if (!earn) return false;

  // v2 identity
  if (earn.EarnRole?.identity === "Earn-v2") return true;

  // v1-style wrapper
  if (earn.EarnRole?.kind === "Earn") return true;
  if (earn.role?.identity === "Earn-v2") return true;
  if (earn.kind === "Earn") return true;

  // explicit guard flag (if ever set upstream)
  if (earn.__earnEnvelope === true) return true;

  return false;
}

// Mark payload as having passed through Earn → Pulse once
function tagImpulseAsEarnSent(impulse, pulseCompatibleEarn) {
  const basePayload = impulse.payload || {};

  return {
    ...impulse,
    payload: {
      ...basePayload,
      // single-pass Earn envelope
      earn: {
        ...(pulseCompatibleEarn || {}),
        __earnEnvelope: true
      },
      // global guard flag for any other systems
      __earnSent: true
    }
  };
}


// ============================================================================
//  INTERNAL: Try to build Earn v2 safely
// ============================================================================
function tryEarnV2(impulse) {
  try {
    const baseEarn = createEarn({
      jobId: impulse.tickId,
      pattern:
        impulse.intent ||
        impulse.payload?.pattern ||
        "UNKNOWN_EARN_PATTERN",
      payload: impulse.payload || {},
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null
    });

    const evolved =
      typeof evolveEarn === "function"
        ? evolveEarn(baseEarn, {
            source: "PulseEarnSendSystem",
            intent: impulse.intent,
            lineage: impulse.payload?.parentLineage || null
          })
        : baseEarn;

    return { ok: true, earn: evolved || baseEarn };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Build Earn v1 fallback (via legacy Pulse)
// ============================================================================
function buildEarnV1(impulse) {
  // reuse legacy pulse builder as Earn v1 carrier
  const legacyPulse = legacyPulseFromImpulse(impulse);

  return {
    // minimal Earn-shaped wrapper around legacy pulse
    EarnRole: {
      kind: "Earn",
      version: legacyPulse.PulseRole?.version || "1.0"
    },
    jobId: legacyPulse.jobId,
    pattern: legacyPulse.pattern,
    payload: legacyPulse.payload,
    priority: legacyPulse.priority,
    returnTo: legacyPulse.returnTo,
    lineage: legacyPulse.lineage,
    meta: legacyPulse.meta || {}
  };
}


// ============================================================================
//  INTERNAL: Wrap Earn organism into Pulse-compatible shape
// ============================================================================
function wrapEarnForPulse(earn) {
  return {
    PulseRole: earn.EarnRole, // PulseSendSystem expects PulseRole-like structure
    jobId: earn.jobId,
    pattern: earn.pattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    meta: {
      ...(earn.meta || {}),
      origin: "Earn",
      earnVersion: earn.EarnRole?.version || "unknown",
      earnIdentity: earn.EarnRole?.identity || earn.EarnRole?.kind || "Earn",
      earnEnvelope: true
    },

    // Earn-specific identity
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
//  PUBLIC API — PulseEarnSendSystem (v2.0 GOVERNED)
// ============================================================================
export const PulseEarnSendSystem = {
  // --------------------------------------------------------------------------
  //  SEND — entry point for Earn nervous system
  // --------------------------------------------------------------------------
  async send(impulse) {
    // 0. GOVERNOR: block Earn re-entry / loops
    if (isEarnReentryImpulse(impulse)) {
      return {
        ok: false,
        blocked: true,
        reason: "earn_reentry_blocked",
        impulse,
        note:
          "Impulse already carries an Earn envelope; Earn → Send → Earn loop prevented."
      };
    }

    // 1. Try Earn v2
    const v2 = tryEarnV2(impulse);

    let earn = null;
    let usedFallback = false;

    if (v2.ok) {
      earn = v2.earn;
    } else {
      // 2. Fallback to Earn v1 (wrapped legacy pulse)
      earn = buildEarnV1(impulse);
      usedFallback = true;
    }

    // 3. Wrap Earn organism for Pulse
    const pulseCompatibleEarn = wrapEarnForPulse(earn);

    // 4. Tag impulse as having passed through Earn → Pulse ONCE
    const governedImpulse = tagImpulseAsEarnSent(
      impulse,
      pulseCompatibleEarn
    );

    // 5. Delegate EVERYTHING to PulseSendSystem (single-pass)
    const result = await PulseSendSystem.send(governedImpulse);

    // 6. Return results to EarnBand (if present, browser-only)
    if (
      typeof window !== "undefined" &&
      window.EarnBand?.receiveEarnResult
    ) {
      window.EarnBand.receiveEarnResult({
        impulse: governedImpulse,
        earn,
        pulseCompatibleEarn,
        result,
        fallback: usedFallback
      });
    }

    return {
      ok: true,
      earn,
      pulseCompatibleEarn,
      result,
      fallback: usedFallback
    };
  }
};
