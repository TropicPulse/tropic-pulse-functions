// ============================================================================
// FILE: PulseWorldSocialGraph.js
// PULSE OS v12.3+ PRESENCE-EVO
// Pulse-World Social Graph
// Deterministic • Metadata-Only • Presence + Jobs + Mentorship Edges
// ============================================================================
//
// Nodes: users (uid)
// Edges: presence, jobs, mentorship, upgrades
// No payload data, only relationship metadata.
// ============================================================================

export function createPulseWorldSocialGraph({
  PowerUserRanking,
  log, warn, error
}) {

  const meta = {
    layer: "PulseWorldSocialGraph",
    role: "SOCIAL_GRAPH",
    version: "12.3+",
    evo: {
      presenceAware: true,
      socialAware: true,
      earnAware: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  const graph = {
    nodes: new Map(),   // uid -> { uid, displayName, systemAge, presenceBand }
    edges: []           // { type, from, to, meta }
  };

  // -------------------------------------------------------
  // Node helpers
  // -------------------------------------------------------
  function ensureNode(person) {
    if (!person || !person.uid) return;

    if (!graph.nodes.has(person.uid)) {
      graph.nodes.set(person.uid, {
        uid: person.uid,
        displayName: person.displayName || null,
        systemAge: person.systemAge || 0,
        presenceBand: person.presenceBand || "symbolic"
      });
    }
  }

  function addEdge(type, fromUid, toUid, edgeMeta = {}) {
    if (!fromUid || !toUid) return;

    graph.edges.push({
      type,
      from: fromUid,
      to: toUid,
      meta: edgeMeta
    });
  }

  // -------------------------------------------------------
  // Ingest presence snapshot (proximity edges)
// -------------------------------------------------------
  function ingestPresenceSnapshot(selfUid, nearbyPresence) {
    const ranked = PowerUserRanking.rankNearby(nearbyPresence || []);

    for (const person of ranked) {
      ensureNode({ uid: selfUid });
      ensureNode(person);

      addEdge("presence", selfUid, person.uid, {
        distance: person.distance,
        presenceBand: person.presenceBand,
        systemAge: person.systemAge,
        powerUser: person.powerUser,
        rankScore: person.rankScore
      });
    }
  }

  // -------------------------------------------------------
  // Ingest job assignments (job edges)
// -------------------------------------------------------
  function ingestJobAssignments(assignments) {
    for (const a of assignments || []) {
      ensureNode({ uid: a.uid, displayName: a.displayName });

      addEdge("job", "system", a.uid, {
        jobId: a.jobId,
        jobTitle: a.jobTitle,
        jobTags: a.jobTags,
        presenceBand: a.presenceBand,
        systemAge: a.systemAge,
        powerUser: a.powerUser,
        score: a.score
      });
    }
  }

  // -------------------------------------------------------
  // Ingest mentor upgrade requests (mentorship edges)
// -------------------------------------------------------
  function ingestMentorRequest(requestPayload) {
    if (!requestPayload) return;

    const { requester, mentor, reason, status } = requestPayload;

    ensureNode({ uid: requester?.uid });
    ensureNode({ uid: mentor?.uid });

    addEdge("mentor_request", requester?.uid, mentor?.uid, {
      reason,
      status
    });
  }

  // -------------------------------------------------------
  // Snapshot
  // -------------------------------------------------------
  function snapshot() {
    return {
      meta,
      nodes: Array.from(graph.nodes.values()),
      edges: graph.edges.slice()
    };
  }

  return {
    meta,
    ingestPresenceSnapshot,
    ingestJobAssignments,
    ingestMentorRequest,
    snapshot
  };
}
