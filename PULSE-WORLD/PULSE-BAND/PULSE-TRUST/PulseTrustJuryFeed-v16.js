// ============================================================================
//  PULSE-TRUST v16 — JuryFeed Builder
//  Normalizes PulseUser + Advantage into a jury-ready feed
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustJuryFeed",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_jury_feed_builder",
  lineage: "PulseTrustJuryFeed-v14 → v16-Immortal-ORGANISM",

  description: `
    PulseTrustJuryFeed is the adapter between the lived experience of the user
    (PulseUser / citizen witness) and the abstract reasoning of the JuryFrame.

    It takes raw, messy, high-entropy signals from:
      - citizenWitness (patterns, anomalies, flow)
      - advantageContext (mesh, castle, proxy, earn, pressure)
    and converts them into a normalized, read-only juryFeed object.

    This juryFeed is the "case file" the jury sees:
      - what patterns are emerging?
      - who is dominating?
      - where are anomalies clustering?
      - what is the current mesh / castle / proxy pressure?
      - is the environment high-stress or stable?

    It does not judge. It does not decide. It only prepares the evidence
    in a deterministic, drift-proof way for the JuryFrame to evaluate.
  `,

  evo: {
    trustAware: true,
    juryAware: true,
    citizenWitnessAware: true,
    advantageAware: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    metadataOnly: true
  },

  contract: {
    always: [
      "PulseUser",
      "PulseWorldCore",
      "PulseTrustJuryFrame"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "statefulAdapters"
    ]
  }
}
*/

export const PulseTrustJuryFeedMeta = Object.freeze({
  organId: "PulseTrustJuryFeed-v16",
  role: "TRUST_JURY_FEED_BUILDER",
  version: "v16-Immortal-ORGANISM"
});

/**
 * buildJuryFeed
 * Normalizes citizen witness + advantage context into a jury-ready feed.
 */
export function buildJuryFeed({
  citizenWitness = {},
  advantageContext = {},
  anomalies = [],
  flow = null
} = {}) {
  const cwPatterns = citizenWitness.patterns || {};
  const cwAnomalies = citizenWitness.anomalies || anomalies || [];
  const cwFlow = citizenWitness.flow || flow || null;

  return Object.freeze({
    meta: PulseTrustJuryFeedMeta,
    citizenWitness: Object.freeze({
      patterns: cwPatterns,
      anomalies: cwAnomalies,
      flow: cwFlow
    }),
    advantageContext: Object.freeze(advantageContext || {}),
    anomalies: cwAnomalies,
    flow: cwFlow
  });
}

export default buildJuryFeed;
