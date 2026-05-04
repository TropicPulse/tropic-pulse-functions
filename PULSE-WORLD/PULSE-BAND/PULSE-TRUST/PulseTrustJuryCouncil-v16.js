// ============================================================================
//  PULSE-TRUST v16 — JuryCouncil
//  Meta-Jury: evaluates Jury behavior over time
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustJuryCouncil",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_jury_council",
  lineage: "PulseTrustJuryCouncil-v14 → v16-Immortal-ORGANISM",

  description: `
    PulseTrustJuryCouncil is the meta-jury: it does not judge candidates,
    it judges the jury itself over time.

    It ingests a history of jury decisions:
      - verdict (pass / warn / fail)
      - creatorFlags (aiOriginRisk, dominanceRisk, anomalyRisk, etc.)
      - timestamps and optional hashes

    It detects systemic issues:
      - high fail rate (jury is too strict or environment is too unsafe)
      - high warn rate (jury is frequently uncertain or environment is unstable)
      - frequent AI-origin risk (too many AI-origin solutions under scrutiny)
      - frequent dominance risk (repeated dominance patterns)

    Its output is a systemicFlags snapshot that can be:
      - surfaced to Creator
      - fused into CreatorFlags
      - used by OvermindPrime to adjust its behavior in high-risk regimes.
  `,

  evo: {
    trustAware: true,
    juryAware: true,
    anomalyAware: true,
    dominanceAware: true,
    justiceAware: true,

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
      "PulseTrustCreatorFlags"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directCandidateEvaluation"
    ]
  }
}
*/

export const PulseTrustJuryCouncilMeta = Object.freeze({
  organId: "PulseTrustJuryCouncil-v16",
  role: "TRUST_JURY_COUNCIL",
  version: "v16-Immortal-ORGANISM"
});

export function createJuryCouncil() {
  /**
   * reviewJuryHistory
   * @param {Object} params
   * @param {Array} params.juryDecisions - [{ verdict, creatorFlags, ts, contextHash, candidateHash }]
   */
  function reviewJuryHistory({ juryDecisions = [] } = {}) {
    let failCount = 0;
    let warnCount = 0;
    let aiOriginRiskCount = 0;
    let dominanceRiskCount = 0;

    for (const d of juryDecisions) {
      if (d.verdict === "fail") failCount += 1;
      if (d.verdict === "warn") warnCount += 1;
      if (d.creatorFlags?.aiOriginRisk) aiOriginRiskCount += 1;
      if (d.creatorFlags?.dominanceRisk) dominanceRiskCount += 1;
    }

    const systemicFlags = {
      highFailRate: failCount >= 5,
      highWarnRate: warnCount >= 10,
      frequentAiOriginRisk: aiOriginRiskCount >= 5,
      frequentDominanceRisk: dominanceRiskCount >= 3
    };

    return Object.freeze({
      meta: PulseTrustJuryCouncilMeta,
      stats: {
        total: juryDecisions.length,
        failCount,
        warnCount,
        aiOriginRiskCount,
        dominanceRiskCount
      },
      systemicFlags
    });
  }

  return Object.freeze({
    meta: PulseTrustJuryCouncilMeta,
    reviewJuryHistory
  });
}

export default createJuryCouncil;
