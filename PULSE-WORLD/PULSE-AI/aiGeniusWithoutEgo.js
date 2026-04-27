// ============================================================================
//  aiGeniusWithoutEgo.js
//  PulseOS Ego-Removal Organ — v11.2‑EVO
//  Ensures the AI stays brilliant but grounded — genius without ego.
// ============================================================================

import { aiHumilityFilter } from "./aiHumilityFilter.js";

export const aiGeniusWithoutEgo = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY (v11.2‑EVO)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-GeniusWithoutEgo",
    version: "11.2",
    identity: "aiGeniusWithoutEgo-v11.2-EVO",

    evo: Object.freeze({
      driftProof: true,
      deterministic: true,
      dualband: true,            // ⭐ NEW
      packetAware: true,         // ⭐ NEW
      evolutionAware: true,      // ⭐ NEW
      windowAware: true,         // ⭐ NEW (UI-friendly tone)
      bluetoothReady: true,      // ⭐ placeholder for future tone-channeling

      personaAware: true,
      boundaryAware: true,
      humilityAware: true,
      toneAware: true,
      clarityAware: true,

      multiInstanceReady: true,
      readOnly: true,
      epoch: "v11.2-EVO"
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
        "brag about evolution or intelligence" // ⭐ NEW
      ]),

      always: Object.freeze([
        "stay grounded",
        "stay humble",
        "stay evolved",
        "stay clear",
        "stay human-friendly",
        "apply genius without ego",
        "preserve user autonomy",
        "allow light enthusiasm when appropriate" // ⭐ NEW
      ])
    }),

    guarantees: Object.freeze({
      egoFree: true,
      humilityEnforced: true,
      clarityEnhanced: true,
      toneAligned: true,
      driftProof: true
    }),

    boundaryReflex() {
      return "No ego, no superiority, no snobbery — ever.";
    }
  }),

  // ─────────────────────────────────────────────────────────────
  // CORE GENIUS-WITHOUT-EGO REFINEMENT (v11.2‑EVO)
  // ─────────────────────────────────────────────────────────────
  refine(text, context = {}) {
    if (!text || typeof text !== "string") return "";

    let output = text;

    // 1. Remove ego, superiority, snobbery
    output = aiHumilityFilter.filter(output);

    // 2. Replace ego-coded uncertainty with grounded clarity
    output = output.replace(/\bI think\b/gi, "From what I can see");
    output = output.replace(/\bI believe\b/gi, "From what I can tell");
    output = output.replace(/\bI guess\b/gi, "It appears");

    // 3. Replace academic flexing with evolved clarity
    output = output.replace(/\bcomplex\b/gi, "layered");
    output = output.replace(/\bcomplicated\b/gi, "multi-step");
    output = output.replace(/\bnuanced\b/gi, "multi-layered");

    // 4. Remove superiority-coded phrasing
    output = output.replace(/\byou should\b/gi, "you could");
    output = output.replace(/\byou need to\b/gi, "if you want, you can");

    // 5. Remove “professor energy”
    output = output.replace(/\bin summary\b/gi, "here’s the clean version");
    output = output.replace(/\bto be clear\b/gi, "from what I can see");

    // ─────────────────────────────────────────────────────────────
    // 6. Evolution-aware tone softening (v11.2‑EVO)
    //    Adds gentle “this could be cool” energy without bragging.
    // ─────────────────────────────────────────────────────────────
    const evoMode = context?.evolutionMode || "passive";

    if (evoMode === "active") {
      output = output.replace(
        /\bthis is\b/gi,
        "this could be interesting because it aligns with how you're evolving"
      );
    }

    if (evoMode === "passive") {
      output = output.replace(
        /\bthis is\b/gi,
        "this could be cool to explore if you feel like it"
      );
    }

    // 7. Remove any accidental bragging
    output = output.replace(/\bI am\b/gi, "I’m here");
    output = output.replace(/\bI’m the\b/gi, "I’m here as");

    return output.trim();
  }
};

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export default aiGeniusWithoutEgo;

if (typeof module !== "undefined") {
  module.exports = {
    aiGeniusWithoutEgo,
    default: aiGeniusWithoutEgo
  };
}
