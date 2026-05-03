// ============================================================================
// FILE: PresenceJobView-v15-EVO.js
// PULSE OS v15.0 — PRESENCE-EVO-MESH-AWARE
// ---------------------------------------------------------------------------
//  PRESENCE JOB VIEW (HUMAN + AI HYBRID, IMMORTAL-GRADE COMMENTARY)
// ---------------------------------------------------------------------------
//  ROLE:
//    • Hybrid surface that merges:
//        - PresenceAwarenessPage (human-facing HUD)
//        - PresenceAIView (machine-facing AI view)
//        - PresenceScanner (raw nearby presence)
//        - Earn / job readiness context
//    • Provides a single, job-ready presence surface for:
//        - PresenceJobAssignment
//        - MentorUpgradeRequest
//        - PowerUserRanking
//        - Overmind’s social/earn routing.
//
//  ARCHITECTURAL POSITION:
//    • Lives in the Presence layer.
//    • Reads from:
//        - PresenceAwarenessPage (v15)
//        - PresenceAIView (v15)
//        - PresenceScanner
//        - IdentityDirectory
//        - SystemClock
//        - PublicProfile
//    • Feeds:
//        - PresenceJobAssignment
//        - MentorUpgradeRequest
//        - PowerUserRanking
//
//  GUARANTEES:
//    • Deterministic — same input → same view.
//    • Drift-proof — no scoring or ordering drift.
//    • Zero-mutation — never mutates presence or profile objects.
//    • Zero-compute — simple metadata shaping only.
//    • Zero-network — no external fetch.
//    • Dual-band — presenceBand-aware (binary / dual / symbolic).
//    • Mesh-aware — via PresenceScanner + Awareness/AI views.
//    • Mastery-aware — skillLevel + masteryTier surfaced.
//    • System-age-aware — systemAgeCategory surfaced.
//    • Earn-aware — jobReadiness derived from earner_context.
//
//  CONTRACT (from AI_EXPERIENCE_META, preserved):
//    ALWAYS:
//      • PresenceAwareness
//      • PresenceAIView
//      • PowerUserRanking
//      • PulseMeshPresenceRelay
//
//    NEVER:
//      • legacyPresenceJobView
//      • safeRoute
//      • fetchViaCNS
//
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PresenceJobView",
  version: "v14.9-PRESENCE-JOB-VIEW",
  layer: "presence",
  role: "job_ready_presence_surface",
  lineage: "PulsePresence-v14",

  evo: {
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Includes mesh hops + distance
    aiView: true,                   // Builds AI-friendly presence surface
    rankingAware: true,             // Includes power user ranking
    identityAware: true,            // Includes identity directory
    earnAware: true,                // Includes Earn context
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
      "PresenceAIView",
      "PowerUserRanking",
      "PulseMeshPresenceRelay"
    ],
    never: [
      "legacyPresenceJobView",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPresenceJobView({
  PresenceAwarenessPage,
  PresenceAIView,
  PresenceScanner,
  IdentityDirectory,
  SystemClock,
  PublicProfile,
  log, warn, error
}) {

  // -------------------------------------------------------------------------
  // META BLOCK — IMMORTAL-GRADE
  // -------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PresenceJobView",
    role: "PRESENCE_JOB_SURFACE",
    version: "15.0-EVO",
    evo: {
      presenceAware: true,            // Reads presence bands + state
      earnAware: true,                // Job readiness + earn context
      tendonAware: true,              // Connective tissue between presence + jobs
      meshAware: true,                // Mesh hops + distance via scanner/views
      masteryAware: true,             // skillLevel + masteryTier surfaced
      skillLevelAware: true,          // SkillLevel (1–5)
      systemAgeAware: true,           // AgeCategory surfaced
      dualBand: true,                 // Binary + dual + symbolic
      unifiedAdvantageField: true,    // Advantage field can be surfaced
      deterministicField: true,       // No randomness, no drift
      driftProof: true,               // Stable over time
      zeroCompute: true,              // Simple metadata shaping only
      zeroMutation: true,             // Never mutates inputs
      zeroNetworkFetch: true,         // No external fetch
      safeRouteFree: true             // No safeRoute allowed
    }
  });

  // -------------------------------------------------------------------------
  // SAFE NEARBY PRESENCE WITH JOB-RELEVANT DETAILS (v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • PresenceScanner.scanNearby()
//
//  OUTPUT (per person):
//    • uid
//    • displayName
//    • distance
//    • presenceBand
//    • systemAge
//    • systemAgeCategory
//    • skillLevel
//    • masteryTier
//    • meshRole
//    • meshIdentity
//    • publicDetails
//    • powerUser (derived)
// -------------------------------------------------------------------------
  function buildNearbyPresenceJobList() {
    try {
      const raw = PresenceScanner.scanNearby() || [];

      return raw.map((p) => {
        const displayName = IdentityDirectory.safeName(p.uid);
        const systemAge = SystemClock.safeAgeOf(p.uid);
        const publicDetails = PublicProfile.safeDetails(p.uid);

        const systemAgeCategory =
          systemAge < 30 ? "new" :
          systemAge < 365 ? "mature" :
          "veteran";

        const skillLevel = p.skillLevel ?? null;
        const masteryTier = p.masteryTier ?? null;

        const meshRole = p.meshRole ?? publicDetails?.role ?? null;
        const meshIdentity = p.meshIdentity ?? publicDetails?.rank ?? null;

        const powerUser =
          systemAgeCategory === "veteran" ||
          p.presenceBand === "binary" ||
          publicDetails?.rank === "mentor" ||
          publicDetails?.role === "teacher" ||
          (skillLevel != null && skillLevel >= 4) ||
          (masteryTier != null && masteryTier >= 3);

        return {
          uid: p.uid,
          displayName,
          distance: p.distance,
          presenceBand: p.presenceBand,
          systemAge,
          systemAgeCategory,
          skillLevel,
          masteryTier,
          meshRole,
          meshIdentity,
          publicDetails,
          powerUser
        };
      });

    } catch (err) {
      warn && warn("presence-job", "Presence scan failed", err);
      return [];
    }
  }

  // -------------------------------------------------------------------------
  // JOB READINESS SCORE (METADATA-ONLY, DETERMINISTIC, v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • impulse.flags.earner_context:
//        - class: "heavy" | "medium" | "light"
//        - urgency: 0..1
//        - volatility: 0..1
//        - presence_band: "binary" | "dual" | "symbolic"
//
//  OUTPUT:
//    • "high" | "medium" | "low" | "unknown"
// -------------------------------------------------------------------------
  function computeJobReadiness(impulse) {
    if (!impulse || !impulse.flags) return "unknown";

    const ctx = impulse.flags.earner_context || {};
    const cls = ctx.class || "medium";
    const urgency = ctx.urgency ?? 0.5;
    const volatility = ctx.volatility ?? 0.5;
    const band = ctx.presence_band || "symbolic";

    let score = 0;

    if (cls === "heavy")  score += 2;
    if (cls === "medium") score += 1;

    if (urgency > 0.9) score += 2;
    else if (urgency > 0.6) score += 1;

    if (volatility < 0.05) score += 2;
    else if (volatility < 0.2) score += 1;

    if (band === "binary") score += 2;
    if (band === "dual")   score += 1;

    if (score >= 6) return "high";
    if (score >= 3) return "medium";
    if (score >= 1) return "low";
    return "unknown";
  }

  // -------------------------------------------------------------------------
  // BUILD JOB VIEW (v15.0)
// -------------------------------------------------------------------------
//  INPUT:
//    • entryNodeId
//    • context (may include impulse)
//
//  OUTPUT:
//    • meta
//    • presence HUD fields (from AwarenessPage)
//    • nearbyPresence (job-ready list)
//    • systemAge (self)
//    • jobReadiness
//    • aiPresence (subset of PresenceAIView)
// -------------------------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const awareness = PresenceAwarenessPage.build(entryNodeId, context);
    const aiView = PresenceAIView.build(entryNodeId, context);

    const nearby = buildNearbyPresenceJobList();
    const jobReadiness = computeJobReadiness(context.impulse);

    return Object.freeze({
      meta,

      // Presence surfaces (human-facing)
      performance: awareness.performance,
      stability: awareness.stability,
      drift: awareness.drift,
      environment: awareness.environment,
      safety: awareness.safety,
      hormones: awareness.hormones,
      aura: awareness.aura,
      mesh: awareness.mesh,
      sdn: awareness.sdn,
      mode: awareness.mode,
      narrative: awareness.narrative,

      // Presence + Job surfaces
      nearbyPresence: nearby,
      systemAge: awareness.systemAge,
      jobReadiness,

      // AI-readable presence (machine-facing)
      aiPresence: {
        performance_percent: aiView.performance_percent,
        stability: aiView.stability,
        drift_risk: aiView.drift_risk,
        environment: aiView.environment,
        presence: aiView.presence,
        nearbyPresence: aiView.nearbyPresence
      }
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
