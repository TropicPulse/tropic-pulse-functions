// ============================================================================
//  PULSE-TRUST v16 — Creator Flag Fusion
//  Fuses Jury, BoxCamera, and Council into Creator-level flags
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustCreatorFlags",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_creator_flags",
  lineage: "PulseTrustCreatorFlags-v14 → v16-Immortal-ORGANISM",

  description: `
    PulseTrustCreatorFlags is the fusion layer that converts multiple
    trust signals into a single, Creator-facing flag set.

    Inputs:
      - juryResult: per-candidate verdict + creatorFlags
      - boxCameraSnapshot: behavioral anomalies and patterns
      - councilSnapshot: systemic flags over time

    It produces:
      - a fused flags object:
          aiOriginRisk
          juryFlowRisk
          dominanceRisk
          anomalyRisk
          expansionCentralizationRisk
          highStressContext
          systemicHighFailRate
          systemicHighWarnRate
          systemicFrequentAiOriginRisk
          systemicFrequentDominanceRisk

    This is the "dashboard" the Creator sees:
      - not raw data
      - not low-level metrics
      - but a distilled, constitutional view of risk.

    It does not decide. It informs.
  `,

  evo: {
    trustAware: true,
    creatorFlagAware: true,
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
      "PulseTrustJuryBoxCamera",
      "PulseTrustJuryCouncil"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directOverride"
    ]
  }
}
*/

export const PulseTrustCreatorFlagsMeta = Object.freeze({
  organId: "PulseTrustCreatorFlags-v16",
  role: "TRUST_CREATOR_FLAGS",
  version: "v16-Immortal-ORGANISM"
});

export function fuseCreatorFlags({
  juryResult = null,
  boxCameraSnapshot = null,
  councilSnapshot = null
} = {}) {
  const juryFlags = juryResult?.creatorFlags || {};
  const boxAnomalies = boxCameraSnapshot?.anomalies || [];
  const councilFlags = councilSnapshot?.systemicFlags || {};

  const anomalyRisk = boxAnomalies.some(a => (a?.severity ?? 1) >= 3);

  const fused = {
    aiOriginRisk: !!juryFlags.aiOriginRisk,
    juryFlowRisk: !!juryFlags.juryFlowRisk,
    dominanceRisk: !!juryFlags.dominanceRisk,
    anomalyRisk: !!juryFlags.anomalyRisk || anomalyRisk,
    expansionCentralizationRisk: !!juryFlags.expansionCentralizationRisk,
    highStressContext: !!juryFlags.highStressContext,
    systemicHighFailRate: !!councilFlags.highFailRate,
    systemicHighWarnRate: !!councilFlags.highWarnRate,
    systemicFrequentAiOriginRisk: !!councilFlags.frequentAiOriginRisk,
    systemicFrequentDominanceRisk: !!councilFlags.frequentDominanceRisk
  };

  return Object.freeze({
    meta: PulseTrustCreatorFlagsMeta,
    flags: fused
  });
}

export default fuseCreatorFlags;
