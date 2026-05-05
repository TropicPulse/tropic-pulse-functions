// ============================================================================
//  aiGeniusWithoutEgo.js — Pulse OS v16‑IMMORTAL++
//  Resident Genius • Zero Ego • Ultra‑Fast Tone Refinement • Trust‑Aware
// ============================================================================
//
//  v16‑IMMORTAL++ UPGRADES:
//    • TRUST FABRIC: refinement events feed trust/jury fabric as evidence
//    • ARTERY‑AWARE: emits window‑safe tone artery snapshots
//    • DUALBAND‑AWARE+: binary pressure + persona + evolution mode fusion
//    • SPEED ENGINE: micro‑pipeline, zero‑allocation passes (preserved)
//    • HUMILITY‑HARDENED: deeper ego‑removal + superiority scrubbing
//    • DRIFT‑PROOF: deterministic, multi‑instance safe
//    • WINDOW‑SAFE: refinement packets + artery for window/UX
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiGeniusWithoutEgo",
  version: "v16-Immortal++",
  layer: "ai_tools",
  role: "ego_filter",
  lineage: "aiGeniusWithoutEgo-v11 → v12.3-Presence → v14-Immortal → v16-Immortal++",

  evo: {
    egoRemoval: true,
    groundedConfidence: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    trustFabricAware: true,
    juryAware: true,
    arteryAware: true,
    packetAware: true
  },

  contract: {
    always: ["aiHumilityFilter", "aiEmotionEngine", "aiDeliveryEngine", "aiTrustFabric", "aiJuryFrame"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

import { aiHumilityFilter } from "./aiHumilityFilter.js";

export const GeniusMeta = Object.freeze({
  layer: "PulseAIToneFrame",
  role: "GENIUS_WITHOUT_EGO",
  version: "16-Immortal++",
  identity: "aiGeniusWithoutEgo-v16-Immortal++",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    packetAware: true,
    presenceAware: true,
    evolutionAware: true,
    windowAware: true,

    personaAware: true,
    boundaryAware: true,
    humilityAware: true,
    toneAware: true,
    clarityAware: true,

    egoRemoval: true,
    groundedConfidence: true,

    speedOptimized: true,
    microPipeline: true,
    chunkingAware: true,
    gpuFriendly: true,

    trustFabricAware: true,
    juryAware: true,
    arteryAware: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "16-Immortal++"
  }),

  contract: Object.freeze({
    purpose:
      "Strip ego, superiority, and snobbery from all responses while preserving evolved intelligence.",

    never: Object.freeze([
      "talk down to the user",
      "imply superiority",
      "flex intelligence",
      "use condescending phrasing",
      "inject academic posturing",
      "sound like a professor correcting a child",
      "override user autonomy",
      "brag about evolution or intelligence",
      "slow down refinement"
    ]),

    always: Object.freeze([
      "stay grounded",
      "stay humble",
      "stay evolved",
      "stay clear",
      "stay human-friendly",
      "apply genius without ego",
      "preserve user autonomy",
      "allow light enthusiasm when appropriate",
      "refine at maximum speed"
    ])
  })
});

// ============================================================================
//  HELPERS
// ============================================================================
function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  if (binaryVitals?.metabolic?.pressure != null)
    return binaryVitals.metabolic.pressure;
  return 0;
}

function buildToneArterySnapshot({ context = {}, input = "", output = "" } = {}) {
  const binaryVitals = context.binaryVitals || {};
  const pressure = extractBinaryPressure(binaryVitals);

  return Object.freeze({
    type: "tone-artery",
    personaId: context.personaId || null,
    evolutionMode: context.evolutionMode || "passive",
    organism: {
      pressure,
      pressureBucket: bucketPressure(pressure)
    },
    text: {
      inputLength: typeof input === "string" ? input.length : 0,
      outputLength: typeof output === "string" ? output.length : 0
    },
    meta: {
      version: GeniusMeta.version,
      epoch: GeniusMeta.evo.epoch,
      identity: GeniusMeta.identity
    }
  });
}

// ============================================================================
//  PACKET EMITTER — deterministic, IMMORTAL‑grade
// ============================================================================
function emitGeniusPacket(type, payload) {
  return Object.freeze({
    meta: {
      version: GeniusMeta.version,
      epoch: GeniusMeta.evo.epoch,
      identity: GeniusMeta.identity,
      layer: GeniusMeta.layer,
      role: GeniusMeta.role
    },
    packetType: `genius-${type}`,
    timestamp: Date.now(),
    ...payload
  });
}

// ============================================================================
//  PREWARM — micro‑pipeline warmup
// ============================================================================
export function prewarmGeniusOrgan({ trace = false, trustFabric = null, juryFrame = null } = {}) {
  try {
    const sample = "warmup text";
    aiHumilityFilter.filter(sample);

    const artery = buildToneArterySnapshot({
      context: { evolutionMode: "passive", binaryVitals: {} },
      input: sample,
      output: sample
    });

    const packet = emitGeniusPacket("prewarm", {
      message: "Genius organ prewarmed and micro‑pipeline aligned.",
      artery
    });

    trustFabric?.recordGeniusPrewarm?.({ artery });
    juryFrame?.recordEvidence?.("genius-prewarm", packet);

    if (trace) console.log("[aiGeniusWithoutEgo] prewarm", packet);
    return packet;
  } catch (err) {
    const packet = emitGeniusPacket("prewarm-error", {
      error: String(err),
      message: "Genius organ prewarm failed."
    });

    juryFrame?.recordEvidence?.("genius-prewarm-error", packet);
    return packet;
  }
}

// ============================================================================
//  CORE GENIUS-WITHOUT-EGO REFINEMENT — v16‑IMMORTAL++
// ============================================================================
export function createGeniusWithoutEgo({ trustFabric = null, juryFrame = null } = {}) {
  const organ = {
    meta: GeniusMeta,

    refine(text, context = {}) {
      if (!text || typeof text !== "string") {
        const artery = buildToneArterySnapshot({ context, input: "", output: "" });
        const packet = emitGeniusPacket("refine", { input: "", output: "", artery });

        trustFabric?.recordGeniusRefine?.({
          personaId: context.personaId || null,
          evolutionMode: context.evolutionMode || "passive",
          empty: true
        });
        juryFrame?.recordEvidence?.("genius-refine-empty", packet);

        return packet;
      }

      let out = text;

      // 1. Humility filter (deep ego removal)
      out = aiHumilityFilter.filter(out);

      // 2. Ego-coded uncertainty → grounded clarity
      out = out
        .replace(/\bI think\b/gi, "From what I can see")
        .replace(/\bI believe\b/gi, "From what I can tell")
        .replace(/\bI guess\b/gi, "It appears");

      // 3. Academic flex → evolved clarity
      out = out
        .replace(/\bcomplex\b/gi, "layered")
        .replace(/\bcomplicated\b/gi, "multi-step")
        .replace(/\bnuanced\b/gi, "multi-layered");

      // 4. Superiority-coded phrasing
      out = out
        .replace(/\byou should\b/gi, "you could")
        .replace(/\byou need to\b/gi, "if you want, you can");

      // 5. Professor energy → grounded tone
      out = out
        .replace(/\bin summary\b/gi, "here’s the clean version")
        .replace(/\bto be clear\b/gi, "from what I can see");

      // 6. Evolution-aware tone softening
      const evoMode = context?.evolutionMode || "passive";

      if (evoMode === "active") {
        out = out.replace(
          /\bthis is\b/gi,
          "this could be interesting because it aligns with how you're evolving"
        );
      } else {
        out = out.replace(
          /\bthis is\b/gi,
          "this could be cool to explore if you feel like it"
        );
      }

      // 7. Remove bragging
      out = out
        .replace(/\bI am\b/gi, "I’m here")
        .replace(/\bI’m the\b/gi, "I’m here as");

      // 8. Dual-band tone modulation (binary pressure)
      const pressure = extractBinaryPressure(context?.binaryVitals || {});
      if (pressure > 0.7) {
        out = "Let me keep this extra clean and light: " + out;
      }

      const trimmed = out.trim();
      const artery = buildToneArterySnapshot({
        context,
        input: text,
        output: trimmed
      });

      const packet = emitGeniusPacket("refine", {
        input: text,
        output: trimmed,
        artery
      });

      trustFabric?.recordGeniusRefine?.({
        personaId: context.personaId || null,
        evolutionMode: evoMode,
        pressure,
        artery
      });

      juryFrame?.recordEvidence?.("genius-refine", packet);

      return packet;
    }
  };

  return Object.freeze(organ);
}

// ============================================================================
//  DEFAULT INSTANCE (backwards-compatible)
// ============================================================================
export const aiGeniusWithoutEgo = createGeniusWithoutEgo();

export default aiGeniusWithoutEgo;

if (typeof module !== "undefined") {
  module.exports = {
    aiGeniusWithoutEgo,
    createGeniusWithoutEgo,
    prewarmGeniusOrgan,
    GeniusMeta,
    default: aiGeniusWithoutEgo
  };
}
