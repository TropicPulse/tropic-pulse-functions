// ============================================================================
// FILE: MentorUpgradeRequest.js
// PULSE OS v12.3+ PRESENCE-EVO
// Mentor Upgrade Request Surface
// Deterministic • Metadata-Only • Power-User + Learner Linking
// ============================================================================

export function createMentorUpgradeRequest({
  PresenceJobView,
  PowerUserRanking,
  log, warn, error
}) {

  const meta = {
    layer: "MentorUpgradeRequest",
    role: "MENTOR_UPGRADE_SURFACE",
    version: "12.3+",
    evo: {
      presenceAware: true,
      earnAware: true,
      socialAware: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // -------------------------------------------------------
  // Build mentor candidates list
  // -------------------------------------------------------
  function buildMentorCandidates(entryNodeId, context = {}) {
    const view = PresenceJobView.build(entryNodeId, context);
    const nearby = view.nearbyPresence || [];
    const ranking = PowerUserRanking.rankNearby(nearby);

    return ranking
      .filter((p) => p.powerUser === true)
      .map((p) => ({
        uid: p.uid,
        displayName: p.displayName,
        presenceBand: p.presenceBand,
        systemAge: p.systemAge,
        ageCategory: p.ageCategory,
        rankScore: p.rankScore
      }));
  }

  // -------------------------------------------------------
  // Build upgrade request payload (metadata-only)
// -------------------------------------------------------
  function buildUpgradeRequestPayload(requesterUid, mentorUid, reason) {
    return {
      meta,
      requester: {
        uid: requesterUid
      },
      mentor: {
        uid: mentorUid
      },
      reason: reason || "upgrade_request",
      status: "pending"
    };
  }

  // -------------------------------------------------------
  // Public API
  // -------------------------------------------------------
  function build(entryNodeId, context = {}) {
    const mentors = buildMentorCandidates(entryNodeId, context);

    return {
      meta,
      mentors
    };
  }

  return {
    meta,
    build,
    buildUpgradeRequestPayload
  };
}
