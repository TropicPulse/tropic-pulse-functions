// ============================================================================
//  PULSE-TRUST v16 — JuryFrame Wrapper
//  Bridges core JuryFrame (12-lens justice engine) into Trust fabric
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseTrustJuryFrame",
  version: "v16-Immortal-ORGANISM",
  layer: "trust",
  role: "trust_jury_frame",
  lineage: "JuryFrame-v12.3-Evo+ → JuryFrame-v16-Immortal-ORGANISM",

  description: `
    PulseTrustJuryFrame is the trust-facing wrapper around the core JuryFrame
    justice engine. It exposes a stable, composable API for aiOvermindPrime,
    PulseWorldCore, and other organs to evaluate candidates through a
    multi-lens, multi-perspective justice system.

    The underlying JuryFrame:
      - runs multiple lenses (safety, user, risk, vulnerability, minimality,
        consistency, AI-origin, dominance, flow, anomaly, expansion, etc.)
      - fuses them into a worldLens verdict (consensus, ambiguous, risky, blocked)
      - emits a world-lens artery snapshot (pressure, budget, boundaries, binary)

    PulseTrustJuryFrame does not change the logic of the jury.
    It simply:
      - wires in juryFeed (PulseTrustJuryFeed)
      - accepts binaryVitals and boundaryArtery
      - returns a deterministic, read-only verdict object for trust fabric.
  `,

  evo: {
    juryAware: true,
    trustAware: true,
    dualBand: true,
    binaryAware: true,
    symbolicPrimary: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "JuryFrame-v16",
      "PulseTrustJuryFeed"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "statefulJuryWrappers"
    ]
  }
}
*/

import {
  JuryFrameMeta,
  createJuryFrame,
  evaluateJury
} from "../PULSE-AI-JURY/JuryFrame-v16.js";

export const PulseTrustJuryFrameMeta = Object.freeze({
  organId: "PulseTrustJuryFrame-v16",
  role: "TRUST_JURY_FRAME",
  version: "v16-Immortal-ORGANISM",
  juryMeta: JuryFrameMeta
});

export function createPulseTrustJuryFrame({ safetyAPI } = {}) {
  const jury = createJuryFrame({ safetyAPI });

  function evaluate({
    intent,
    context,
    candidate,
    juryFeed,
    binaryVitals,
    boundaryArtery
  } = {}) {
    return jury.evaluate({
      intent,
      context,
      candidate,
      juryFeed,
      binaryVitals,
      boundaryArtery
    });
  }

  return Object.freeze({
    meta: PulseTrustJuryFrameMeta,
    evaluate,
    getLenses: jury.getLenses
  });
}

// Direct helper for one-off evaluations
export function evaluateWithTrustJury(args = {}) {
  return evaluateJury(args);
}

export default createPulseTrustJuryFrame;
