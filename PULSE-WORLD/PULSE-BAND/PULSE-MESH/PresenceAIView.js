// ============================================================================
// FILE: PresenceAIView-v15-EVO.js
// PULSE OS v15.0 — PRESENCE-EVO-MESH-AWARE
// ---------------------------------------------------------------------------
//  PRESENCE AI VIEW (MACHINE-FACING, IMMORTAL-GRADE COMMENTARY)
// ---------------------------------------------------------------------------
//  ROLE:
//    • This organ is the *safe, machine-facing presence surface*.
//    • It exposes presence, mesh, mastery, and system-age metadata to AI
//      without leaking unsafe or high-pressure details.
//    • It is the canonical source for:
//        - nearbyPresence (AI-safe)
//        - systemAge (AI-safe)
//        - performance + stability + drift signals
//        - mesh + mode + aura + hormones + environment
//
//  ARCHITECTURAL POSITION:
//    • Lives in the Presence layer.
//    • Reads from:
//        - PulseSenses (organism vitals + environment)
//        - PresenceScanner (nearby presence nodes)
//        - SystemClock (system age / uptime)
//        - IdentityDirectory (safe display names)
//        - PublicProfile (safe public details)
//    • Feeds:
//        - PowerUserRanking
//        - MentorUpgradeRequest
//        - OvermindPresence
//        - PresenceJobView
//
//  GUARANTEES:
//    • Deterministic — same input → same output.
//    • Drift-proof — no topology or scoring drift.
//    • Zero-mutation — never mutates presence or profile objects.
//    • Zero-compute — pure metadata shaping, no heavy math.
//    • Zero-network — no external fetch, no remote calls.
//    • Dual-band — exposes binary + symbolic presence bands safely.
//    • Mesh-aware — includes mesh hops, distance, and mesh presence band.
//    • Mastery-aware — exposes skillLevel + masteryTier (read-only).
//    • System-age-aware — exposes systemAge + ageCategory (read-only).
//
//  CONTRACT:
//    ALWAYS:
//      • PresenceAwareness
//      • PowerUserRanking
//
//    NEVER:
//      • legacyPresenceAIView
//      • safeRoute
//      • fetchViaCNS
//
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

  // -------------------------------------------------------------------------
  // META BLOCK — IMMORTAL-GRADE
  // -------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PresenceAIView",
    role: "PRESENCE_AI_API",
    version: "15.0-EVO",
    evo: {
      presenceAware: true,            // Reads presence bands + state
      meshAware: true,                // Includes mesh hops + distance
      masteryAware: true,             // Exposes masteryTier + skillLevel
      skillLevelAware: true,          // SkillLevel (1–5) surfaced safely
      systemAgeAware: true,           // System age + ageCategory
      aiView: true,                   // Machine-facing, safe surface
      dualBand: true,                 // Binary + symbolic presence bands
      unifiedAdvantageField: true,    // Advantage field visible to AI
      deterministicField: true,       // No randomness, no drift
      driftProof: true,               // Stable over time
      zeroCompute: true,              // Pure metadata shaping
      zeroMutation: true,             // Never mutates inputs
      zeroNetworkFetch: true,         // No external fetch
      safeRouteFree: true             // No safeRoute allowed
    }
  });

  // -------------------------------------------------------------------------
  // SAFE NEARBY PRESENCE (AI-READABLE, v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • PresenceScanner.scanNearby() → raw presence nodes
//
//  OUTPUT (per node):
//    • uid
//    • displayName (safe)
//    • distance
//    • meshHops (optional, mesh-aware)
//    • meshDistance (optional, mesh-aware)
//    • presenceBand
//    • systemAge
//    • systemAgeCategory
//    • skillLevel
//    • masteryTier
//    • meshRole
//    • meshIdentity
//    • advantageField
//    • signalStrength
//    • publicDetails (safe)
// -------------------------------------------------------------------------
  function buildNearbyPresenceAI() {
    try {
      const raw = PresenceScanner.scanNearby() || [];

      return raw.map((p) => ({
        uid: p.uid,
        displayName: IdentityDirectory.safeName(p.uid),
        distance: p.distance,
        meshHops: p.meshHops ?? null,
        meshDistance: p.meshDistance ?? null,
        presenceBand: p.presenceBand,
        systemAge: p.systemAge ?? null,
        systemAgeCategory: p.systemAgeCategory ?? null,
        skillLevel: p.skillLevel ?? null,
        masteryTier: p.masteryTier ?? null,
        meshRole: p.meshRole ?? null,
        meshIdentity: p.meshIdentity ?? null,
        advantageField: p.advantageField ?? null,
        signalStrength: p.signalStrength ?? null,
        publicDetails: PublicProfile.safeDetails(p.uid)
      }));
    } catch (err) {
      warn && warn("presence-ai", "Presence scan failed", err);
      return [];
    }
  }

  // -------------------------------------------------------------------------
  // SYSTEM AGE (SELF, AI-SAFE)
// -------------------------------------------------------------------------
//  INPUT:
//    • SystemClock
//
//  OUTPUT:
//    • uptimeSeconds
//    • organismAgeDays
//    • organismAgeCategory: "new" | "mature" | "veteran" | "unknown"
// -------------------------------------------------------------------------
  function getSystemAgeAI() {
    try {
      const uptimeSeconds = SystemClock.uptimeSeconds();
      const organismAgeDays = SystemClock.organismAgeDays();

      let organismAgeCategory = "unknown";
      if (organismAgeDays < 30) {
        organismAgeCategory = "new";
      } else if (organismAgeDays < 365) {
        organismAgeCategory = "mature";
      } else {
        organismAgeCategory = "veteran";
      }

      return {
        uptimeSeconds,
        organismAgeDays,
        organismAgeCategory
      };
    } catch (err) {
      warn && warn("presence-ai", "SystemClock unavailable", err);
      return {
        uptimeSeconds: 0,
        organismAgeDays: 0,
        organismAgeCategory: "unknown"
      };
    }
  }

  // -------------------------------------------------------------------------
  // AI VIEW BUILDER (v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • entryNodeId — presence node requesting the view
//    • context — optional context for PulseSenses
//
//  OUTPUT:
//    • meta
//    • performance + stability + drift signals
//    • environment + safety + hormones + aura
//    • mesh + sdn + mode + presence
//    • narrative_for_ai
//    • nearbyPresence (AI-safe, v15 fields)
//    • systemAge (self, AI-safe)
// -------------------------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const senses = PulseSenses.forAI(entryNodeId, context);
    const nearby = buildNearbyPresenceAI();
    const age = getSystemAgeAI();

    return Object.freeze({
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
    });
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta,
    build
  });
}
