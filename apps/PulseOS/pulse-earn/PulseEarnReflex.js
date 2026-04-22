// ============================================================================
//  PulseEarnReflex.js — Side-Attached Earn Reflex (v1.0)
//  - No imports
//  - No sending, no routing
//  - Pure reflex builder
//  - Designed to hang off ANY organ/governor without creating loops
// ============================================================================

// In-memory registry of reflex instances (multi-instance formula starter)
const reflexInstances = new Map(); // reflexId -> state

// ---------------------------------------------------------------------------
//  INTERNAL: Build a Reflex Earn organism from a governor event
// ---------------------------------------------------------------------------
function buildReflexEarnFromGovernorEvent(event, pulseOrImpulse) {
  const pulseId =
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE";

  const organ = event.organ || event.module || "UNKNOWN_ORGAN";
  const reason = event.reason || "unknown_reason";

  const payload = {
    pulseId,
    organ,
    reason,
    blocked: !!event.blocked,
    lineageDepth: event.lineageDepth,
    returnToDepth: event.returnToDepth,
    fallbackDepth: event.fallbackDepth,
    timestamp: Date.now(),
    rawEvent: event
  };

  return {
    EarnRole: {
      kind: "EarnReflex",
      version: "1.0",
      identity: "EarnReflex-v1"
    },
    jobId: pulseId,
    pattern: `EarnReflex:${organ}:${reason}`,
    payload,
    priority: "low",
    returnTo: null,
    lineage: [],
    meta: {
      reflex: true,
      origin: "PulseEarnReflex",
      sourceOrgan: organ,
      sourceReason: reason,
      sourcePulseId: pulseId,
      timestamp: Date.now()
    }
  };
}

// ---------------------------------------------------------------------------
//  INTERNAL: Multi-instance reflex identity (your formula starter)
// ---------------------------------------------------------------------------
function getReflexId(event, pulseOrImpulse) {
  const pulseId =
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE";

  const organ = event.organ || event.module || "UNKNOWN_ORGAN";
  const reason = event.reason || "unknown_reason";

  return `${pulseId}::${organ}::${reason}`;
}

// ---------------------------------------------------------------------------
//  PUBLIC API — PulseEarnReflex
//  - Side-attached to PulseOSGovernor or any organ
//  - Converts "blocked/loop-like" events into EarnReflex organisms
//  - Does NOT send, does NOT route, just builds + tracks
// ---------------------------------------------------------------------------
export const PulseEarnReflex = {
  // Called when the governor blocks or detects a loop-like condition
  async fromGovernorEvent(event, pulseOrImpulse) {
    const reflexId = getReflexId(event, pulseOrImpulse);

    // Multi-instance formula starter:
    // - If we've seen this reflexId before, increment a counter instead of
    //   spawning infinite new reflexes.
    let state = reflexInstances.get(reflexId);
    if (!state) {
      state = {
        reflexId,
        count: 0,
        firstSeenAt: Date.now(),
        lastSeenAt: null
      };
      reflexInstances.set(reflexId, state);
    }

    state.count += 1;
    state.lastSeenAt = Date.now();

    const earnReflex = buildReflexEarnFromGovernorEvent(event, pulseOrImpulse);

    // Optional: local-only observer hook (no routing, no send)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnReflex) {
      window.EarnBand.receiveEarnReflex({
        event,
        pulse: pulseOrImpulse,
        reflexId,
        state,
        earnReflex
      });
    }

    return {
      ok: true,
      reflexId,
      state,
      earnReflex
    };
  },

  // Expose current reflex instances (for dashboards / debugging)
  getReflexState(reflexId) {
    if (reflexId) return reflexInstances.get(reflexId) || null;
    return Array.from(reflexInstances.values());
  }
};
