// ============================================================================
//  PULSE-TRUST v16 — JuryBoxCamera
//  Observer / Pattern Detector for Jury sessions
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustJuryBoxCamera",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_jury_observer",
  lineage: "PulseTrustJuryBoxCamera-v14 → v16-Immortal-ORGANISM",

  description: `
    PulseTrustJuryBoxCamera is the black-box recorder and observer for
    jury sessions. It does not judge content; it watches behavior.

    It ingests:
      - events: who spoke, who decided, who echoed AI-origin content
      - verdicts: what the jury decided, with creatorFlags

    It detects:
      - dominance patterns (one actor making too many decisions)
      - AI echo patterns (too many AI-origin events)
      - basic anomalies in jury behavior

    Its output is not a verdict; it is a behavioral snapshot:
      - patterns: dominantUser, decision counts, AI echo counts
      - anomalies: structured descriptions of suspicious patterns

    This snapshot can then be:
      - fed into JuryFeed (as citizenWitness patterns/anomalies)
      - fused into CreatorFlags
      - reviewed by JuryCouncil for systemic issues.
  `,

  evo: {
    trustAware: true,
    juryAware: true,
    anomalyAware: true,
    dominanceAware: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    metadataOnly: true
  },

  contract: {
    always: [
      "PulseTrustJuryFrame",
      "PulseTrustJuryCouncil",
      "PulseTrustCreatorFlags"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "contentMutation"
    ]
  }
}
*/

export const PulseTrustJuryBoxCameraMeta = Object.freeze({
  organId: "PulseTrustJuryBoxCamera-v16",
  role: "TRUST_JURY_OBSERVER",
  version: "v16-Immortal-ORGANISM"
});

export function createJuryBoxCamera() {
  /**
   * analyzeSession
   * @param {Object} params
   * @param {Array} params.events - [{ type, actor, ts, source, aiOrigin, decisionId, ... }]
   * @param {Array} params.verdicts - [{ decisionId, verdict, creatorFlags, ts }]
   */
  function analyzeSession({
    events = [],
    verdicts = []
  } = {}) {
    const anomalies = [];
    const patterns = {
      dominantUser: null,
      dominantUserDecisionCount: 0,
      aiEchoCount: 0
    };

    const decisionByUser = new Map();
    let aiEchoCount = 0;

    for (const e of events) {
      if (e.type === "decision" && e.actor) {
        const prev = decisionByUser.get(e.actor) || 0;
        decisionByUser.set(e.actor, prev + 1);
      }
      if (e.aiOrigin === true) {
        aiEchoCount += 1;
      }
    }

    let dominantUser = null;
    let dominantCount = 0;
    for (const [user, count] of decisionByUser.entries()) {
      if (count > dominantCount) {
        dominantUser = user;
        dominantCount = count;
      }
    }

    patterns.dominantUser = dominantUser;
    patterns.dominantUserDecisionCount = dominantCount;
    patterns.aiEchoCount = aiEchoCount;

    if (dominantUser && dominantCount >= 3) {
      anomalies.push({
        type: "dominance",
        actor: dominantUser,
        count: dominantCount,
        severity: 2,
        note: "Single actor dominates decision stream."
      });
    }

    return Object.freeze({
      meta: PulseTrustJuryBoxCameraMeta,
      patterns,
      anomalies,
      verdicts
    });
  }

  return Object.freeze({
    meta: PulseTrustJuryBoxCameraMeta,
    analyzeSession
  });
}

export default createJuryBoxCamera;
