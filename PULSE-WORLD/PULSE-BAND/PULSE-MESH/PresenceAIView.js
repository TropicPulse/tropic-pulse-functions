// ============================================================================
// FILE: PresenceAIView.js
// PULSE OS v12.3+ PRESENCE-EVO
// Presence AI View (Machine-Facing)
// Deterministic • Metadata-Only • Safe Presence Exposure
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PresenceAIView",
  version: "v14.9-PRESENCE-VIEW",
  layer: "presence",
  role: "presence_ai_surface",
  lineage: "PulsePresence-v14",

  evo: {
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Includes mesh hops + distance
    aiView: true,                   // Safe AI-facing presence surface
    deterministic: true,
    driftProof: true,
    dualBand: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PresenceAwareness",
      "PowerUserRanking"
    ],
    never: [
      "legacyPresenceAIView",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPresenceAIView({
  PulseSenses,
  PresenceScanner,
  SystemClock,
  IdentityDirectory,
  PublicProfile,
  log, warn, error
}) {

  const meta = {
    layer: "PresenceAIView",
    role: "PRESENCE_AI_API",
    version: "12.3+",
    evo: {
      presenceAware: true,
      dualBandReady: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      driftProof: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // -------------------------------------------------------
  // SAFE NEARBY PRESENCE (AI-readable)
  // -------------------------------------------------------
  function buildNearbyPresenceAI() {
    try {
      const raw = PresenceScanner.scanNearby() || [];

      return raw.map((p) => ({
        uid: p.uid,
        displayName: IdentityDirectory.safeName(p.uid),
        distance: p.distance,
        presenceBand: p.presenceBand,
        systemAge: SystemClock.safeAgeOf(p.uid),
        signalStrength: p.signalStrength ?? null,
        publicDetails: PublicProfile.safeDetails(p.uid)
      }));
    } catch (err) {
      warn("presence-ai", "Presence scan failed", err);
      return [];
    }
  }

  // -------------------------------------------------------
  // SYSTEM AGE (self)
  // -------------------------------------------------------
  function getSystemAgeAI() {
    try {
      return {
        uptimeSeconds: SystemClock.uptimeSeconds(),
        organismAgeDays: SystemClock.organismAgeDays(),
        organismAgeCategory:
          SystemClock.organismAgeDays() < 30
            ? "new"
            : SystemClock.organismAgeDays() < 365
            ? "mature"
            : "veteran"
      };
    } catch (err) {
      warn("presence-ai", "SystemClock unavailable", err);
      return { uptimeSeconds: 0, organismAgeDays: 0, organismAgeCategory: "unknown" };
    }
  }

  // -------------------------------------------------------
  // AI VIEW BUILDER
  // -------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const senses = PulseSenses.forAI(entryNodeId, context);
    const nearby = buildNearbyPresenceAI();
    const age = getSystemAgeAI();

    return {
      meta,
      performance_percent: senses.performance_percent,
      performance_hint: senses.performance_hint,
      stability: senses.stability,
      drift_risk: senses.drift_risk,
      environment: senses.environment,
      safety: senses.safety,
      hormones: senses.hormones,
      aura: senses.aura,
      mesh: senses.mesh,
      sdn: senses.sdn,
      mode: senses.mode,
      presence: senses.presence,
      narrative_for_ai: senses.narrative_for_ai,
      nearbyPresence: nearby,
      systemAge: age
    };
  }

  return {
    meta,
    build
  };
}
