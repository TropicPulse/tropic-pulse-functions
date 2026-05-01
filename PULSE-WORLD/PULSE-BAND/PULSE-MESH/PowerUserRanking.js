// ============================================================================
// FILE: PowerUserRanking.js
// PULSE OS v12.3+ PRESENCE-EVO
// Power User Ranking Engine
// Deterministic • Metadata-Only • Presence + Age + Role Aware
// ============================================================================

export function createPowerUserRanking({
  log, warn, error
}) {

  const meta = {
    layer: "PowerUserRanking",
    role: "POWER_USER_RANKING",
    version: "12.3+",
    evo: {
      presenceAware: true,
      socialAware: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // -------------------------------------------------------
  // Deterministic rank score
  // -------------------------------------------------------
  function computeRankScore(person) {
    let score = 0;

    if (person.ageCategory === "veteran") score += 3;
    if (person.ageCategory === "mature") score += 2;

    if (person.presenceBand === "binary") score += 3;
    if (person.presenceBand === "dual") score += 2;

    if (person.publicDetails?.role === "teacher") score += 2;
    if (person.publicDetails?.rank === "mentor") score += 2;

    if (person.powerUser) score += 1;

    return score;
  }

  // -------------------------------------------------------
  // Rank nearby presence list
  // -------------------------------------------------------
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

  return {
    meta,
    rankNearby
  };
}
