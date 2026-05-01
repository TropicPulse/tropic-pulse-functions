// ============================================================================
// FILE: PresenceJobView.js
// PULSE OS v12.3+ PRESENCE-EVO
// Presence Job View (Human + AI Hybrid)
// Deterministic • Metadata-Only • Safe DisplayName Presence
// Job-Readiness • Power-User Detection • Earn-Context Surfacing
// ============================================================================

export function createPresenceJobView({
  PresenceAwarenessPage,
  PresenceAIView,
  PresenceScanner,
  IdentityDirectory,
  SystemClock,
  PublicProfile,
  log, warn, error
}) {

  const meta = {
    layer: "PresenceJobView",
    role: "PRESENCE_JOB_SURFACE",
    version: "12.3+",
    evo: {
      presenceAware: true,
      earnAware: true,
      tendonAware: true,
      dualBandReady: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      driftProof: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // -------------------------------------------------------
  // SAFE NEARBY PRESENCE WITH JOB-RELEVANT DETAILS
  // -------------------------------------------------------
  function buildNearbyPresenceJobList() {
    try {
      const raw = PresenceScanner.scanNearby() || [];

      return raw.map((p) => {
        const displayName = IdentityDirectory.safeName(p.uid);
        const systemAge = SystemClock.safeAgeOf(p.uid);
        const publicDetails = PublicProfile.safeDetails(p.uid);

        // Power-user detection (metadata-only)
        const ageCategory =
          systemAge < 30 ? "new" :
          systemAge < 365 ? "mature" :
          "veteran";

        const powerUser =
          ageCategory === "veteran" ||
          p.presenceBand === "binary" ||
          publicDetails?.rank === "mentor" ||
          publicDetails?.role === "teacher";

        return {
          uid: p.uid,
          displayName,
          distance: p.distance,
          presenceBand: p.presenceBand,
          systemAge,
          ageCategory,
          publicDetails,
          powerUser
        };
      });

    } catch (err) {
      warn("presence-job", "Presence scan failed", err);
      return [];
    }
  }

  // -------------------------------------------------------
  // JOB READINESS SCORE (metadata-only, deterministic)
// -------------------------------------------------------
  function computeJobReadiness(impulse) {
    if (!impulse || !impulse.flags) return "unknown";

    const ctx = impulse.flags.earner_context || {};
    const cls = ctx.class || "medium";
    const urgency = ctx.urgency || 1;
    const volatility = ctx.volatility || 0;
    const band = ctx.presence_band || "symbolic";

    // Deterministic scoring (no compute)
    let score = 0;

    if (cls === "heavy") score += 2;
    if (cls === "medium") score += 1;

    if (urgency > 0.9) score += 1;
    if (volatility < 0.05) score += 1;

    if (band === "binary") score += 2;
    if (band === "dual") score += 1;

    if (score >= 5) return "high";
    if (score >= 3) return "medium";
    return "low";
  }

  // -------------------------------------------------------
  // BUILD JOB VIEW
  // -------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const awareness = PresenceAwarenessPage.build(entryNodeId, context);
    const aiView = PresenceAIView.build(entryNodeId, context);

    const nearby = buildNearbyPresenceJobList();

    // Job readiness for the current impulse (if any)
    const jobReadiness = computeJobReadiness(context.impulse);

    return {
      meta,

      // Presence surfaces
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

      // AI-readable presence
      aiPresence: {
        performance_percent: aiView.performance_percent,
        stability: aiView.stability,
        drift_risk: aiView.drift_risk,
        environment: aiView.environment,
        presence: aiView.presence,
        nearbyPresence: aiView.nearbyPresence
      }
    };
  }

  return {
    meta,
    build
  };
}
