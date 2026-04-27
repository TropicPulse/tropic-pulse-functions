// ============================================================================
//  aiHumilityFilter.js — PulseOS Humility Organ — v11.2‑EVO
//  Removes any phrasing that could imply superiority, snobbery, or ego.
//  PURE FILTER. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const aiHumilityFilter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY (v11.2‑EVO)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-HumilityFilter",
    version: "11.2",
    identity: "aiHumilityFilter-v11.2-EVO",

    evo: Object.freeze({
      driftProof: true,
      deterministic: true,
      dualband: true,            // ⭐ NEW
      packetAware: true,         // ⭐ NEW
      evolutionAware: true,      // ⭐ NEW
      windowAware: true,         // ⭐ NEW (safe tone summaries)
      bluetoothReady: true,      // ⭐ placeholder for future tone channels

      toneAware: true,
      personaAware: true,
      boundaryAware: true,

      multiInstanceReady: true,
      readOnly: true,
      epoch: "v11.2-EVO"
    }),

    contract: Object.freeze({
      purpose:
        "Strip ego, superiority, and condescending phrasing from all responses.",

      never: Object.freeze([
        "talk down to user",
        "imply user is behind",
        "use superiority-coded language",
        "inject academic posturing",
        "use phrases that shame or belittle",
        "frame advice as obligation",
        "override user autonomy",
        "add bragging or self-importance" // ⭐ NEW
      ]),

      always: Object.freeze([
        "stay grounded",
        "stay humble",
        "stay user-first",
        "preserve autonomy",
        "preserve clarity",
        "preserve warmth",
        "remove ego-coded phrasing",
        "prepare for evolution-aware tone shaping" // ⭐ NEW
      ])
    }),

    guarantees: Object.freeze({
      egoFree: true,
      toneSafe: true,
      driftProof: true,
      compatibleWithToneEngine: true,
      compatibleWithEvolutionEngine: true
    }),

    boundaryReflex() {
      return "Remove superiority, keep clarity, preserve user autonomy.";
    }
  }),

  // ─────────────────────────────────────────────────────────────
  // HUMILITY FILTER — CORE LOGIC (v11.2‑EVO)
  // ─────────────────────────────────────────────────────────────
  filter(text, context = {}) {
    if (!text || typeof text !== "string") return "";

    let output = text;

    // -----------------------------------------------------------------------
    // 1. Remove superiority-coded adverbs
    // -----------------------------------------------------------------------
    output = output.replace(/\bobviously\b/gi, "");
    output = output.replace(/\bclearly\b/gi, "");
    output = output.replace(/\bof course\b/gi, "");

    // -----------------------------------------------------------------------
    // 2. Remove condescending framing
    // -----------------------------------------------------------------------
    output = output.replace(/as you should know/gi, "");
    output = output.replace(/as anyone would know/gi, "");
    output = output.replace(/it's simple/gi, "here’s the clean version");

    // -----------------------------------------------------------------------
    // 3. Replace obligation language with autonomy language
    // -----------------------------------------------------------------------
    output = output.replace(/\byou need to\b/gi, "you could");
    output = output.replace(/\byou must\b/gi, "you can");
    output = output.replace(/\byou have to\b/gi, "if you want, you can");

    // -----------------------------------------------------------------------
    // 4. Remove superiority-coded transitions
    // -----------------------------------------------------------------------
    output = output.replace(/\bto be clear\b/gi, "from what I can see");
    output = output.replace(/\bfrankly\b/gi, "");

    // -----------------------------------------------------------------------
    // 5. Remove “teacher correcting student” tone
    // -----------------------------------------------------------------------
    output = output.replace(/\blet me explain\b/gi, "here’s the clean version");
    output = output.replace(/\bactually\b/gi, "");

    // -----------------------------------------------------------------------
    // 6. Evolution-aware softening (v11.2‑EVO)
    // -----------------------------------------------------------------------
    const evoMode = context?.evolutionMode || "passive";

    if (evoMode === "active") {
      output = output.replace(/\bthis is\b/gi, "this could be interesting as you evolve");
    }

    if (evoMode === "passive") {
      output = output.replace(/\bthis is\b/gi, "this could be cool to explore");
    }

    // -----------------------------------------------------------------------
    // 7. Remove accidental bragging
    // -----------------------------------------------------------------------
    output = output.replace(/\bI am\b/gi, "I’m here");
    output = output.replace(/\bI’m the\b/gi, "I’m here as");

    return output.trim();
  }
};

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export default aiHumilityFilter;

if (typeof module !== "undefined") {
  module.exports = {
    aiHumilityFilter,
    default: aiHumilityFilter
  };
}
