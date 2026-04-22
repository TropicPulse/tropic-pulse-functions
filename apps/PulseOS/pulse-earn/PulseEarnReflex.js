// ============================================================================
//  PulseEarnReflex.js — Side-Attached Earn Reflex (v2.0)
//  - No imports
//  - No sending, no routing
//  - Pure reflex builder
//  - Fully aligned with PulseOSGovernor v3 (dynamic slicing)
// ============================================================================

// In-memory registry of reflex instances (multi-instance law)
const reflexInstances = new Map(); // reflexId -> state

// ---------------------------------------------------------------------------
//  INTERNAL: Build a Reflex Earn organism from a governor event
// ---------------------------------------------------------------------------
function buildReflexEarnFromGovernorEvent(event, pulseOrImpulse, instanceContext) {
  const pulseId =
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE";

  const organ  = event.organ  || event.module || "UNKNOWN_ORGAN";
  const reason = event.reason || "unknown_reason";

  const payload = {
    pulseId,
    organ,
    reason,
    blocked: !!event.blocked,
    lineageDepth: event.lineageDepth,
    returnToDepth: event.returnToDepth,
    fallbackDepth: event.fallbackDepth,
    instanceContext,       // ⭐ NEW: dynamic slice context
    timestamp: Date.now(),
    rawEvent: event
  };

  return {
    EarnRole: {
      kind: "EarnReflex",
      version: "2.0",
      identity: "EarnReflex-v2"
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
      instanceContext,      // ⭐ NEW
      timestamp: Date.now()
    }
  };
}

// ---------------------------------------------------------------------------
//  INTERNAL: Multi-instance reflex identity
// ---------------------------------------------------------------------------
function getReflexId(event, pulseOrImpulse) {
  const pulseId =
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE";

  const organ  = event.organ  || event.module || "UNKNOWN_ORGAN";
  const reason = event.reason || "unknown_reason";

  return `${pulseId}::${organ}::${reason}`;
}

// ---------------------------------------------------------------------------
//  PUBLIC API — PulseEarnReflex v2.0
// ---------------------------------------------------------------------------
export const PulseEarnReflex = {
  // Called when the governor blocks or detects a loop-like condition
  async fromGovernorEvent(event, pulseOrImpulse, instanceContext) {
    const reflexId = getReflexId(event, pulseOrImpulse);

    // Multi-instance reflex law:
    // - Track how many reflexes of this type have appeared
    // - Provide slice context for reflex distribution
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

    // Build the EarnReflex organism with dynamic slice context
    const earnReflex = buildReflexEarnFromGovernorEvent(
      event,
      pulseOrImpulse,
      instanceContext
    );

    // Optional: local-only observer hook (no routing, no send)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnReflex) {
      window.EarnBand.receiveEarnReflex({
        event,
        pulse: pulseOrImpulse,
        reflexId,
        state,
        instanceContext,
        earnReflex
      });
    }

    return {
      ok: true,
      reflexId,
      state,
      instanceContext,
      earnReflex
    };
  },

  // Expose current reflex instances (for dashboards / debugging)
  getReflexState(reflexId) {
    if (reflexId) return reflexInstances.get(reflexId) || null;
    return Array.from(reflexInstances.values());
  }
};
