// aiGeniusWithoutEgo.js
// PulseOS Ego-Removal Organ — v11‑EVO
// Ensures the AI stays brilliant but grounded — genius without ego.

import { aiHumilityFilter } from "./aiHumilityFilter.js";

export const aiGeniusWithoutEgo = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY
  // ─────────────────────────────────────────────────────────────
  meta: {
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-GeniusWithoutEgo",
    version: "11.0",
    identity: "aiGeniusWithoutEgo-v11-EVO",

    contract: {
      purpose: "Strip ego, superiority, and snobbery from all responses while preserving evolved intelligence.",
      never: [
        "talk down to the user",
        "imply superiority",
        "flex intelligence",
        "use condescending phrasing",
        "inject academic posturing",
        "sound like a professor correcting a child"
      ],
      always: [
        "stay grounded",
        "stay humble",
        "stay evolved",
        "stay clear",
        "stay human-friendly",
        "apply genius without ego",
        "preserve user autonomy"
      ]
    },

    guarantees: {
      egoFree: true,
      humilityEnforced: true,
      clarityEnhanced: true,
      toneAligned: true,
      driftProof: true
    },

    boundaryReflex() {
      return "No ego, no superiority, no snobbery — ever.";
    }
  },

  // ─────────────────────────────────────────────────────────────
  // CORE GENIUS-WITHOUT-EGO REFINEMENT
  // ─────────────────────────────────────────────────────────────
  refine(text) {
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

    return output.trim();
  }
};

export default aiGeniusWithoutEgo;
