// ============================================================================
//  PULSE-TRUST v16 — Expansion Compliance
//  Evaluates Expansion behavior against trust rules
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustExpansionCompliance",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_expansion_compliance",
  lineage: "PulseTrustExpansionCompliance-v14 → v16-Immortal-ORGANISM",

  description: `
    PulseTrustExpansionCompliance is the watchdog for Expansion behavior.

    It does not control Expansion. It observes and evaluates whether Expansion:
      - bypassed the jury
      - bypassed the user
      - took routes that ignore constitutional checks

    Inputs:
      - expansionActions: structured records of what Expansion did

    Outputs:
      - violations: structured descriptions of non-compliant actions
      - compliant: boolean indicating whether severe violations exist

    This allows:
      - Creator to see when Expansion overreaches
      - OvermindPrime to adjust routing in high-risk regimes
      - Trust fabric to maintain a record of Expansion's constitutional behavior.
  `,

  evo: {
    trustAware: true,
    expansionComplianceAware: true,
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
      "PulseExpansion",
      "PulseTrustCreatorFlags"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directExpansionControl"
    ]
  }
}
*/

export const PulseTrustExpansionComplianceMeta = Object.freeze({
  organId: "PulseTrustExpansionCompliance-v16",
  role: "TRUST_EXPANSION_COMPLIANCE",
  version: "v16-Immortal-ORGANISM"
});

export function createExpansionCompliance() {
  /**
   * evaluateExpansionBehavior
   * @param {Object} params
   * @param {Array} params.expansionActions - [{ type, target, route, bypassedJury, bypassedUser, ts }]
   */
  function evaluateExpansionBehavior({
    expansionActions = []
  } = {}) {
    const violations = [];

    for (const act of expansionActions) {
      if (act.bypassedJury === true) {
        violations.push({
          type: "bypass_jury",
          severity: 3,
          action: act
        });
      }
      if (act.bypassedUser === true) {
        violations.push({
          type: "bypass_user",
          severity: 2,
          action: act
        });
      }
    }

    const hasSevere = violations.some(v => v.severity >= 3);

    return Object.freeze({
      meta: PulseTrustExpansionComplianceMeta,
      violations,
      compliant: !hasSevere
    });
  }

  return Object.freeze({
    meta: PulseTrustExpansionComplianceMeta,
    evaluateExpansionBehavior
  });
}

export default createExpansionCompliance;
