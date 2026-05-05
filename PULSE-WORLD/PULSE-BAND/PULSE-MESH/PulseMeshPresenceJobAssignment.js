// ============================================================================
// FILE: PresenceJobAssignment-v15-Evo.js
// PULSE OS v15.0 — PRESENCE-Evo-MESH-AWARE
// ---------------------------------------------------------------------------
//  PRESENCE-BASED JOB ASSIGNMENT ENGINE (IMMORTAL-GRADE COMMENTARY)
// ---------------------------------------------------------------------------
//  ROLE:
//    • Assigns jobs to nearby presence nodes based on readiness, presence band,
//      skillLevel, masteryTier, systemAgeCategory, and powerUser status.
//    • Uses PresenceJobView as its single source of truth for:
//        - nearbyPresence (AI-safe, v15 fields)
//        - jobReadiness
//        - mesh + presence context
//    • Uses JobCatalog as a deterministic job pool provider.
//
//  ARCHITECTURAL POSITION:
//    • Lives in the presence_social layer.
//    • Reads from:
//        - PresenceJobView (which itself reads PresenceAIView + Awareness)
//        - JobCatalog (deterministic job definitions)
//    • Feeds:
//        - Earn pipelines
//        - Mentor/learner flows
//        - Overmind’s task routing layer.
//
//  GUARANTEES:
//    • Deterministic — same input → same assignments.
//    • Drift-proof — no scoring drift over time.
//    • Zero-mutation — never mutates presence or job objects.
//    • Zero-compute — pure metadata shaping (simple scoring).
//    • Zero-network — no external fetch.
//    • Dual-band — presenceBand-aware (binary / dual / symbolic).
//    • Mesh-aware — via PresenceJobView’s mesh context.
//    • Mastery-aware — skillLevel + masteryTier influence job matching.
//    • System-age-aware — ageCategory influences job type (onboarding, advanced).
//
//  CONTRACT (from AI_EXPERIENCE_META, preserved):
//    ALWAYS:
//      • PresenceAwareness
//      • PresenceAIView
//      • PowerUserRanking
//      • PulseMeshPresenceRelay
//
//    NEVER:
//      • legacyJobAssignment
//      • safeRoute
//      • fetchViaCNS
//
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PresenceJobAssignment",
  version: "v14.9-Presence-JOB-Evo",
  layer: "presence_social",
  role: "job_assignment_engine",
  lineage: "PulseWorld-v14",

  evo: {
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Uses mesh hops + proximity
    aiViewAware: true,              // Uses PresenceAIView
    rankingAware: true,             // Uses PowerUserRanking
    deterministic: true,            // Job assignment must be stable
    driftProof: true,               // No drift in job scoring
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
      "legacyJobAssignment",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPresenceJobAssignment({
  PresenceJobView,
  JobCatalog,          // injected: deterministic job definitions
  log, warn, error
}) {

  // -------------------------------------------------------------------------
  // META BLOCK — IMMORTAL-GRADE
  // -------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PresenceJobAssignment",
    role: "JOB_ASSIGNMENT_ENGINE",
    version: "15.0-Evo",
    evo: {
      presenceAware: true,            // Reads presenceBand + presence state
      earnAware: true,                // Feeds earn/job pipelines
      tendonAware: true,              // Connective tissue between presence + jobs
      meshAware: true,                // Mesh context via PresenceJobView
      masteryAware: true,             // skillLevel + masteryTier aware
      skillLevelAware: true,          // SkillLevel (1–5)
      systemAgeAware: true,           // AgeCategory influences job type
      dualBand: true,                 // Binary + dual + symbolic
      unifiedAdvantageField: true,    // Advantage field can influence pools (via JobCatalog)
      deterministicField: true,       // No randomness, no drift
      driftProof: true,               // Stable scoring over time
      zeroCompute: true,              // Simple scoring only
      zeroMutation: true,             // Never mutates inputs
      zeroNetworkFetch: true,         // No external fetch
      safeRouteFree: true             // No safeRoute allowed
    }
  });

  // -------------------------------------------------------------------------
  // DETERMINISTIC JOB POOL SELECTION (v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • jobReadiness: "high" | "medium" | "low" | "unknown"
//
//  OUTPUT:
//    • deterministic job pool from JobCatalog
// -------------------------------------------------------------------------
  function selectJobPool(jobReadiness) {
    if (jobReadiness === "high")   return JobCatalog.forHighReadiness();
    if (jobReadiness === "medium") return JobCatalog.forMediumReadiness();
    if (jobReadiness === "low")    return JobCatalog.forLowReadiness();
    return JobCatalog.forUnknownReadiness
      ? JobCatalog.forUnknownReadiness()
      : JobCatalog.forLowReadiness();
  }

  // -------------------------------------------------------------------------
  // DETERMINISTIC MATCH SCORE (METADATA-ONLY, v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • job   — job definition (tags, id, title, etc.)
//    • person — presence node with v15 fields:
//        - powerUser
//        - presenceBand
//        - systemAgeCategory
//        - skillLevel
//        - masteryTier
//        - meshRole
//        - meshIdentity
//
//  OUTPUT:
//    • integer score (higher = better match)
//
//  NOTES:
//    • No randomness
//    • No mutation
//    • No external fetch
// -------------------------------------------------------------------------
  function scoreJobForPresence(job, person) {
    let score = 0;

    const tags = job.tags || [];

    // --- Mentor / Learner alignment ---------------------------------------
    if (person.powerUser && tags.includes("mentor")) score += 3;
    if (!person.powerUser && tags.includes("learner")) score += 3;

    // --- Presence band alignment ------------------------------------------
    if (person.presenceBand === "binary"   && tags.includes("precision")) score += 2;
    if (person.presenceBand === "dual"     && tags.includes("bridge"))    score += 2;
    if (person.presenceBand === "symbolic" && tags.includes("creative"))  score += 2;

    // --- System age alignment ---------------------------------------------
    switch (person.systemAgeCategory) {
      case "veteran":
        if (tags.includes("advanced"))   score += 2;
        if (tags.includes("mentor"))     score += 1;
        break;
      case "mature":
        if (tags.includes("core"))       score += 2;
        break;
      case "new":
        if (tags.includes("onboarding")) score += 2;
        break;
    }

    // --- Skill level + mastery tier ---------------------------------------
    const skill = person.skillLevel || 0;
    const mastery = person.masteryTier || 0;

    if (skill >= 4 && tags.includes("high_skill"))   score += 2;
    if (skill <= 2 && tags.includes("low_skill"))    score += 2;

    if (mastery >= 4 && tags.includes("high_mastery")) score += 2;
    if (mastery <= 2 && tags.includes("low_mastery"))  score += 2;

    // --- Mesh role / identity alignment -----------------------------------
    if (person.meshRole === "teacher" && tags.includes("teaching")) score += 2;
    if (person.meshRole === "guide"   && tags.includes("guidance")) score += 2;

    if (person.meshIdentity === "mentor"      && tags.includes("mentor"))      score += 1;
    if (person.meshIdentity === "contributor" && tags.includes("contribution")) score += 1;
    if (person.meshIdentity === "learner"     && tags.includes("learning"))     score += 1;

    return score;
  }

  // -------------------------------------------------------------------------
  // ASSIGN JOBS TO NEARBY PRESENCE (v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • entryNodeId — presence node requesting assignment
//    • context — optional context for PresenceJobView
//
//  OUTPUT:
//    • { meta, jobReadiness, assignments[] }
//
//  assignments[i]:
//    • uid
//    • displayName
//    • jobId
//    • jobTitle
//    • jobTags
//    • presenceBand
//    • systemAge
//    • systemAgeCategory
//    • powerUser
//    • skillLevel
//    • masteryTier
//    • meshRole
//    • meshIdentity
//    • score
// -------------------------------------------------------------------------
  function assign(entryNodeId, context = {}) {
    const view = PresenceJobView.build(entryNodeId, context);
    const nearby = view.nearbyPresence || [];
    const jobReadiness = view.jobReadiness || "unknown";

    const pool = selectJobPool(jobReadiness);
    const assignments = [];

    for (const person of nearby) {
      let bestJob = null;
      let bestScore = -Infinity;

      for (const job of pool) {
        const s = scoreJobForPresence(job, person);
        if (s > bestScore) {
          bestScore = s;
          bestJob = job;
        }
      }

      if (bestJob) {
        assignments.push({
          uid: person.uid,
          displayName: person.displayName,
          jobId: bestJob.id,
          jobTitle: bestJob.title,
          jobTags: bestJob.tags,
          presenceBand: person.presenceBand,
          systemAge: person.systemAge,
          systemAgeCategory: person.systemAgeCategory,
          powerUser: person.powerUser,
          skillLevel: person.skillLevel,
          masteryTier: person.masteryTier,
          meshRole: person.meshRole,
          meshIdentity: person.meshIdentity,
          score: bestScore
        });
      }
    }

    return Object.freeze({
      meta,
      jobReadiness,
      assignments
    });
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta,
    assign
  });
}
