// ============================================================================
// FILE: PresenceAwareness.js
// PULSE OS v12.3+ PRESENCE-EVO
// Presence Awareness Page (Human-Facing)
// Deterministic • Metadata-Only • Safe DisplayName Presence
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PresenceAwareness",
  version: "v14.9-PRESENCE-AWARE",
  layer: "presence",
  role: "presence_awareness_engine",
  lineage: "PulsePresence-v14",

  evo: {
    presenceField: true,            // Reads presence field
    meshAware: true,                // Includes mesh hops + relay
    aiSurface: true,                // Feeds PresenceAIView
    deterministic: true,
    driftProof: true,
    dualBand: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulsePresence",
      "PulseMeshPresenceRelay",
      "PresenceAIView"
    ],
    never: [
      "legacyPresenceAwareness",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPresenceAwarenessPage({
  PulseSenses,
  PresenceScanner,     // safe presence detector
  SystemClock,         // uptime + organism age
  IdentityDirectory,   // safe displayName lookup
  PublicProfile,       // safe public details (optional)
  log, warn, error
}) {

  const meta = {
    layer: "PresenceAwarenessPage",
    role: "PRESENCE_HUD",
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
  // SAFE PRESENCE LIST (Human-Facing)
  // -------------------------------------------------------
  function buildNearbyPresenceList() {
    try {
      const raw = PresenceScanner.scanNearby() || [];

      return raw.map((p) => ({
        displayName: IdentityDirectory.safeName(p.uid),
        distance: p.distance,
        presenceBand: p.presenceBand,
        systemAge: SystemClock.safeAgeOf(p.uid),   // safe: days only
        publicDetails: PublicProfile.safeDetails(p.uid) // safe: no private data
      }));
    } catch (err) {
      warn("presence", "Presence scan failed", err);
      return [];
    }
  }

  // -------------------------------------------------------
  // SYSTEM AGE (self)
  // -------------------------------------------------------
  function getSystemAge() {
    try {
      return {
        uptimeSeconds: SystemClock.uptimeSeconds(),
        organismAgeDays: SystemClock.organismAgeDays()
      };
    } catch (err) {
      warn("presence", "SystemClock unavailable", err);
      return { uptimeSeconds: 0, organismAgeDays: 0 };
    }
  }

  // -------------------------------------------------------
  // PAGE BUILDER
  // -------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const senses = PulseSenses.forAwarenessPage(entryNodeId, context);
    const nearby = buildNearbyPresenceList();
    const age = getSystemAge();

    return {
      meta,
      performance: senses.performance,
      stability: senses.stability,
      drift: senses.drift,
      environment: senses.environment,
      safety: senses.safety,
      hormones: senses.hormones,
      aura: senses.aura,
      mesh: senses.mesh,
      sdn: senses.sdn,
      mode: senses.mode,
      narrative: senses.narrative,
      nearbyPresence: nearby,
      systemAge: age
    };
  }

  return {
    meta,
    build
  };
}
