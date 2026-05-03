// ============================================================================
// FILE: /organs/world/PulseWorldSocialGraph-v15.0-IMMORTAL.js
// PULSE OS v15.0+ PRESENCE‑EVO‑IMMORTAL
// Pulse‑World Social Graph
// Deterministic • Metadata‑Only • Presence + Jobs + Mentorship + Upgrades
// Full Advantage Stack: Prewarm • Chunk • Cache • Presence‑Band
// ============================================================================
//
// Nodes: users (uid)
// Edges: presence, jobs, mentorship, upgrades
// No payload data, only relationship metadata.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseWorldSocialGraph",
  version: "v15.0-WORLD-SOCIAL-GRAPH-IMMORTAL",
  layer: "world_social",
  role: "social_graph_engine",
  lineage: "PulseWorld-v15",

  evo: {
    socialGraph: true,
    presenceAware: true,
    presenceBandAware: true,
    meshAware: true,
    rankingAware: true,
    mentorshipAware: true,
    jobAware: true,
    earnAware: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true,
    unifiedAdvantageField: true,
    coordinatorFree: true
  },

  contract: {
    always: [
      "PresenceAwareness",
      "PresenceAIView",
      "PowerUserRanking",
      "MentorUpgradeRequest",
      "PresenceJobAssignment",
      "PulseMeshPresenceRelay",
      "PulseMeshSkin",
      "PulseMeshSurvivalInstincts"
    ],
    never: [
      "legacySocialGraph",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseWorldSocialGraph({
  PowerUserRanking,
  log, warn, error
}) {

  const meta = {
    layer: "PulseWorldSocialGraph",
    role: "SOCIAL_GRAPH",
    version: "15.0-WORLD-SOCIAL-GRAPH-IMMORTAL",
    evo: {
      presenceAware: true,
      socialAware: true,
      earnAware: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      driftProof: true,
      zeroCompute: true,
      zeroMutation: true
    }
  };

  // ========================================================================
  // INTERNAL GRAPH STRUCTURE
  // ========================================================================
  const graph = {
    nodes: new Map(),   // uid -> { uid, displayName, systemAge, presenceBand }
    edges: []           // { type, from, to, meta }
  };

  // ========================================================================
  // NODE HELPERS
  // ========================================================================
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
      meta: {
        ...edgeMeta,

        // IMMORTAL unified‑advantage‑field tags
        advantage_meta: {
          prewarm_surface: true,
          chunk_surface: true,
          cache_surface: true,
          presence_band: edgeMeta.presenceBand || "symbolic",
          band_kind: "world_social_edge"
        }
      }
    });
  }

  // ========================================================================
  // PRESENCE INGESTION — proximity edges
  // ========================================================================
  function ingestPresenceSnapshot(selfUid, nearbyPresence) {
    const ranked = PowerUserRanking.rankNearby(nearbyPresence || []);

    ensureNode({ uid: selfUid });

    for (const person of ranked) {
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

  // ========================================================================
  // JOB INGESTION — job edges
  // ========================================================================
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

  // ========================================================================
  // MENTORSHIP INGESTION — mentor edges
  // ========================================================================
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

  // ========================================================================
  // UPGRADE INGESTION — upgrade edges (IMMORTAL tier)
  // ========================================================================
  function ingestUpgradeEvent(event) {
    if (!event) return;

    const { uid, upgradeType, tier, timestamp } = event;

    ensureNode({ uid });

    addEdge("upgrade", uid, "system", {
      upgradeType,
      tier,
      timestamp
    });
  }

  // ========================================================================
  // SNAPSHOT
  // ========================================================================
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
    ingestUpgradeEvent,
    snapshot
  };
}
