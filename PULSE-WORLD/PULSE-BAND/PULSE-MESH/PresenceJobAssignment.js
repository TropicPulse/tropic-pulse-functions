// ============================================================================
// FILE: PresenceJobAssignment.js
// PULSE OS v12.3+ PRESENCE-EVO
// Presence-Based Job Assignment Engine
// Deterministic • Metadata-Only • Presence + Readiness + Power-User Aware
// ============================================================================

export function createPresenceJobAssignment({
  PresenceJobView,
  JobCatalog,          // injected: deterministic job definitions
  log, warn, error
}) {

  const meta = {
    layer: "PresenceJobAssignment",
    role: "JOB_ASSIGNMENT_ENGINE",
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
  // Deterministic job pool selection
  // -------------------------------------------------------
  function selectJobPool(jobReadiness) {
    if (jobReadiness === "high") return JobCatalog.forHighReadiness();
    if (jobReadiness === "medium") return JobCatalog.forMediumReadiness();
    return JobCatalog.forLowReadiness();
  }

  // -------------------------------------------------------
  // Deterministic match score (metadata-only)
// -------------------------------------------------------
  function scoreJobForPresence(job, person) {
    let score = 0;

    if (person.powerUser && job.tags.includes("mentor")) score += 2;
    if (!person.powerUser && job.tags.includes("learner")) score += 2;

    if (person.presenceBand === "binary" && job.tags.includes("precision")) score += 1;
    if (person.presenceBand === "dual" && job.tags.includes("bridge")) score += 1;
    if (person.presenceBand === "symbolic" && job.tags.includes("creative")) score += 1;

    if (person.ageCategory === "veteran" && job.tags.includes("advanced")) score += 1;
    if (person.ageCategory === "new" && job.tags.includes("onboarding")) score += 1;

    return score;
  }

  // -------------------------------------------------------
  // Assign jobs to nearby presence
  // -------------------------------------------------------
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
          powerUser: person.powerUser,
          score: bestScore
        });
      }
    }

    return {
      meta,
      jobReadiness,
      assignments
    };
  }

  return {
    meta,
    assign
  };
}
