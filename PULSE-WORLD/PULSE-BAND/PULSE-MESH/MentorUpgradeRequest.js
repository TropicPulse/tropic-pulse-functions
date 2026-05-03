
// ============================================================================
// FILE: MentorUpgradeRequest-v15-EVO.js
// PULSE OS v15.0 — PRESENCE-EVO-MESH-AWARE
// ---------------------------------------------------------------------------
//  MENTOR UPGRADE REQUEST SURFACE (IMMORTAL-GRADE COMMENTARY)
// ---------------------------------------------------------------------------
//  ROLE:
//    • This organ is the *social presence gateway* for mentor upgrades.
//    • It does NOT compute, mutate, or route — it only *describes*.
//    • It reads presence, mesh, mastery, skill-level, and system-age metadata.
//    • It produces deterministic, drift-proof mentor candidate lists.
//    • It is the “front door” for the mentor/mentee upgrade pipeline.
//
//  ARCHITECTURAL POSITION:
//    • Lives in the Presence-Social layer.
//    • Reads from Mesh (proximity, hops, identity, roles).
//    • Reads from Presence (bands, systemAge, founderEra).
//    • Reads from Mastery (skillLevel, masteryTier).
//    • Reads from PowerUserRanking (advantage field).
//    • Feeds Overmind’s social reasoning layer.
//    • Zero influence on routing, chunking, or CNS.
//
//  GUARANTEES:
//    • Deterministic — same input → same output.
//    • Drift-proof — no topology drift, no ranking drift.
//    • Zero-mutation — never mutates presence objects.
//    • Zero-compute — pure metadata shaping.
//    • Zero-network — no fetch, no external calls.
//    • Dual-band — symbolic + binary presence scoring.
//    • Mesh-aware — reads mesh proximity + identity.
//    • Presence-aware — reads presence bands + system age.
//    • Mastery-aware — reads skillLevel + masteryTier.
//    • Social-aware — reads mentor/mentee graph.
//
//  CONTRACT:
//    ALWAYS:
//      • PresenceAwareness
//      • PresenceAIView
//      • PowerUserRanking
//      • PulseMeshPresenceRelay
//
//    NEVER:
//      • legacyMentorUpgrade
//      • safeRoute
//      • fetchViaCNS
//
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "MentorUpgradeRequest",
  version: "v14.9-PRESENCE-WORLD",
  layer: "presence_social",
  role: "mentor_upgrade_pipeline",
  lineage: "PulseWorld-v14",

  evo: {
    presenceAware: true,            // Reads presence fields
    meshAware: true,                // Reads mesh proximity + hops
    socialAware: true,              // Works with mentor/mentee graph
    deterministic: true,            // No randomness in upgrade logic
    driftProof: true,               // Mentor upgrades must be stable
    dualBand: true,                 // Symbolic + binary scoring
    zeroMutationOfInput: true,      // Never mutate presence objects
    zeroNetworkFetch: true,         // No external fetch
    safeRouteFree: true             // No safeRoute allowed
  },

  contract: {
    always: [
      "PresenceAwareness",
      "PresenceAIView",
      "PowerUserRanking",
      "PulseMeshPresenceRelay"
    ],
    never: [
      "legacyMentorUpgrade",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/
export function createMentorUpgradeRequest({
  PresenceJobView,
  PowerUserRanking,
  log, warn, error
}) {

  // -------------------------------------------------------------------------
  // META BLOCK — IMMORTAL-GRADE
  // -------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "MentorUpgradeRequest",
    role: "MENTOR_UPGRADE_SURFACE",
    version: "15.0-EVO",
    evo: {
      presenceAware: true,            // Reads presence bands + system age
      meshAware: true,                // Reads mesh proximity + identity
      masteryAware: true,             // Reads masteryTier + subsystem mastery
      skillLevelAware: true,          // Reads skillLevel (1–5)
      systemAgeAware: true,           // FounderEra / AgeCategory
      socialAware: true,              // Mentor/mentee graph aware
      unifiedAdvantageField: true,    // Uses advantage cascade
      deterministicField: true,       // No randomness, no drift
      zeroCompute: true,              // Pure metadata shaping
      zeroMutation: true,             // Never mutates presence objects
      zeroNetworkFetch: true,         // No external fetch
      dualBand: true,                 // Symbolic + binary scoring
      meshPressureAware: true,        // Reads mesh tension signals
      safeRouteFree: true             // No safeRoute allowed
    }
  });

  // -------------------------------------------------------------------------
  // BUILD MENTOR CANDIDATES (PURE METADATA)
  // -------------------------------------------------------------------------
  //  INPUT:
  //    • entryNodeId — presence node requesting a mentor
  //    • context — optional presence context
  //
  //  OUTPUT:
  //    • Deterministic list of mentor candidates with:
  //        - uid
  //        - displayName
  //        - presenceBand
  //        - systemAge + category
  //        - skillLevel
  //        - masteryTier
  //        - meshRole + meshIdentity
  //        - rankScore (advantage field)
  //
  //  RULES:
  //    • Must be power users
  //    • Must be skillLevel >= 3
  //    • Must be masteryTier >= 2
  //    • Must not be “new” systemAgeCategory
  //    • Must be mesh-visible (proximity > 0)
  // -------------------------------------------------------------------------
  function buildMentorCandidates(entryNodeId, context = {}) {
    const view = PresenceJobView.build(entryNodeId, context);
    const nearby = view.nearbyPresence || [];

    // v15 ranking includes mastery, skill, mesh identity, founder era, etc.
    const ranking = PowerUserRanking.rankNearby(nearby);

    return ranking
      .filter((p) =>
        p.powerUser === true &&
        p.skillLevel >= 3 &&
        p.masteryTier >= 2 &&
        p.systemAgeCategory !== "new"
      )
      .map((p) => ({
        uid: p.uid,
        displayName: p.displayName,
        presenceBand: p.presenceBand,
        systemAge: p.systemAge,
        systemAgeCategory: p.systemAgeCategory,
        skillLevel: p.skillLevel,
        masteryTier: p.masteryTier,
        meshRole: p.meshRole,
        meshIdentity: p.meshIdentity,
        rankScore: p.rankScore
      }));
  }

  // -------------------------------------------------------------------------
  // BUILD UPGRADE REQUEST PAYLOAD (PURE METADATA)
  // -------------------------------------------------------------------------
  //  INPUT:
  //    • requesterUid
  //    • mentorUid
  //    • reason (optional)
  //
  //  OUTPUT:
  //    • Immutable metadata-only upgrade request object
  //
  //  NOTES:
  //    • No mutation
  //    • No compute
  //    • No routing
  //    • No external fetch
  // -------------------------------------------------------------------------
  function buildUpgradeRequestPayload(requesterUid, mentorUid, reason) {
    return Object.freeze({
      meta,
      requester: { uid: requesterUid },
      mentor: { uid: mentorUid },
      reason: reason || "upgrade_request",
      status: "pending"
    });
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const mentors = buildMentorCandidates(entryNodeId, context);

    return Object.freeze({
      meta,
      mentors
    });
  }

  return Object.freeze({
    meta,
    build,
    buildUpgradeRequestPayload
  });
}
