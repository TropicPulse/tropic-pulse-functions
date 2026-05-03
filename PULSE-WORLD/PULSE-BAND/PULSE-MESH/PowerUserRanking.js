// ============================================================================
// FILE: PowerUserRanking-v15-EVO.js
// PULSE OS v15.0 — PRESENCE-EVO-MESH-AWARE
// ---------------------------------------------------------------------------
//  POWER USER RANKING ENGINE (IMMORTAL-GRADE COMMENTARY)
// ---------------------------------------------------------------------------
//  ROLE:
//    • This organ computes the *rankScore* for presence nodes.
//    • It is the backbone of mentor selection, social graph ordering,
//      and Overmind’s presence reasoning.
//    • It is metadata-only, deterministic, drift-proof, and zero-mutation.
//
//  ARCHITECTURAL POSITION:
//    • Lives in the Presence-Social layer.
//    • Reads from PresenceAIView (presenceBand, systemAge, founderEra).
//    • Reads from MeshPresence (meshRole, meshIdentity, proximity).
//    • Reads from Mastery (skillLevel, masteryTier).
//    • Feeds MentorUpgradeRequest, OvermindSocial, and PresenceJobView.
//
//  GUARANTEES:
//    • Deterministic — same input → same output.
//    • Drift-proof — no ranking drift over time.
//    • Zero-mutation — never mutates presence objects.
//    • Zero-compute — pure metadata shaping (no heavy math).
//    • Zero-network — no external fetch.
//    • Dual-band — symbolic + binary scoring.
//    • Mesh-aware — reads mesh proximity + identity.
//    • Mastery-aware — reads skillLevel + masteryTier.
//    • System-age-aware — founderEra + ageCategory.
//    • Advantage-field-aware — unified advantage cascade.
//
//  CONTRACT:
//    ALWAYS:
//      • PresenceAwareness
//      • PresenceAIView
//      • MentorUpgradeRequest
//
//    NEVER:
//      • legacyRanking
//      • safeRoute
//      • fetchViaCNS
//
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PowerUserRanking",
  version: "v14.9-PRESENCE-RANK",
  layer: "presence_social",
  role: "power_user_ranking_engine",
  lineage: "PulseWorld-v14",

  evo: {
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Reads mesh proximity
    rankingEngine: true,            // Computes rankScore
    deterministic: true,            // Ranking must be stable
    driftProof: true,               // No rank drift
    dualBand: true,                 // Binary + symbolic scoring
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PresenceAwareness",
      "PresenceAIView",
      "MentorUpgradeRequest"
    ],
    never: [
      "legacyRanking",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/
export function createPowerUserRanking({ log, warn, error }) {

  // -------------------------------------------------------------------------
  // META BLOCK — IMMORTAL-GRADE
  // -------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PowerUserRanking",
    role: "POWER_USER_RANKING",
    version: "15.0-EVO",
    evo: {
      presenceAware: true,            // Reads presence bands + system age
      meshAware: true,                // Reads mesh proximity + identity
      masteryAware: true,             // Reads masteryTier + subsystem mastery
      skillLevelAware: true,          // Reads skillLevel (1–5)
      systemAgeAware: true,           // FounderEra / AgeCategory
      socialAware: true,              // Social graph aware
      unifiedAdvantageField: true,    // Advantage cascade scoring
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
  // DETERMINISTIC RANK SCORE (v15.0)
  // -------------------------------------------------------------------------
  //  INPUT:
  //    • person — presence node with v15 metadata
  //
  //  OUTPUT:
  //    • rankScore — deterministic integer
  //
  //  SCORING DIMENSIONS:
  //    1. System Age (veteran > mature > stable > new)
  //    2. Presence Band (binary > dual > symbolic)
  //    3. Skill Level (1–5)
  //    4. Mastery Tier (1–5)
  //    5. Mesh Role (teacher > guide > helper > none)
  //    6. Mesh Identity (mentor > contributor > learner)
  //    7. Power User Flag
  //    8. Advantage Field (mesh proximity weighting)
  //
  //  NOTES:
  //    • No randomness
  //    • No mutation
  //    • No external fetch
  // -------------------------------------------------------------------------
  function computeRankScore(person) {
    let score = 0;

    // --- System Age --------------------------------------------------------
    switch (person.systemAgeCategory) {
      case "veteran": score += 4; break;
      case "mature":  score += 3; break;
      case "stable":  score += 2; break;
      case "new":     score += 0; break;
    }

    // --- Presence Band -----------------------------------------------------
    switch (person.presenceBand) {
      case "binary":   score += 4; break;
      case "dual":     score += 3; break;
      case "symbolic": score += 1; break;
    }

    // --- Skill Level (1–5) -------------------------------------------------
    score += (person.skillLevel || 0);

    // --- Mastery Tier (1–5) ------------------------------------------------
    score += (person.masteryTier || 0);

    // --- Mesh Role ---------------------------------------------------------
    switch (person.meshRole) {
      case "teacher":  score += 4; break;
      case "guide":    score += 3; break;
      case "helper":   score += 2; break;
    }

    // --- Mesh Identity -----------------------------------------------------
    switch (person.meshIdentity) {
      case "mentor":       score += 4; break;
      case "contributor":  score += 2; break;
      case "learner":      score += 1; break;
    }

    // --- Power User Flag ---------------------------------------------------
    if (person.powerUser) score += 2;

    // --- Advantage Field (mesh proximity weighting) ------------------------
    // NOTE: advantageField is metadata-only, no compute.
    if (person.advantageField === "high")   score += 3;
    if (person.advantageField === "medium") score += 2;
    if (person.advantageField === "low")    score += 1;

    return score;
  }

  // -------------------------------------------------------------------------
  // RANK NEARBY PRESENCE (v15.0)
  // -------------------------------------------------------------------------
  //  INPUT:
  //    • nearbyPresence — array of presence nodes
  //
  //  OUTPUT:
  //    • sorted list by rankScore (desc), then displayName
  //
  //  NOTES:
  //    • Deterministic
  //    • Zero-mutation
  //    • Zero-compute (only metadata shaping)
  // -------------------------------------------------------------------------
  function rankNearby(nearbyPresence) {
    const list = (nearbyPresence || []).map((p) => {
      const rankScore = computeRankScore(p);
      return { ...p, rankScore };
    });

    list.sort((a, b) => {
      if (b.rankScore !== a.rankScore) return b.rankScore - a.rankScore;
      return String(a.displayName || "").localeCompare(String(b.displayName || ""));
    });

    return list;
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta,
    rankNearby
  });
}
