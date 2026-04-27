// aiHumilityFilter.js
// PulseOS Humility Organ — v11‑EVO
// Removes any phrasing that could imply superiority, snobbery, or ego.

export const aiHumilityFilter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY
  // ─────────────────────────────────────────────────────────────
  meta: {
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-HumilityFilter",
    version: "11.0",
    identity: "aiHumilityFilter-v11-EVO",

    contract: {
      purpose: "Strip ego, superiority, and condescending phrasing from all responses.",
      never: [
        "talk down to user",
        "imply user is behind",
        "use superiority-coded language",
        "inject academic posturing",
        "use phrases that shame or belittle",
        "frame advice as obligation"
      ],
      always: [
        "stay grounded",
        "stay humble",
        "stay user-first",
        "preserve autonomy",
        "preserve clarity",
        "preserve warmth",
        "remove ego-coded phrasing"
      ]
    },

    guarantees: {
      egoFree: true,
      toneSafe: true,
      driftProof: true,
      compatibleWithToneEngine: true,
      compatibleWithEvolutionEngine: true
    },

    boundaryReflex() {
      return "Remove superiority, keep clarity, preserve user autonomy.";
    }
  },

  // ─────────────────────────────────────────────────────────────
  // HUMILITY FILTER — CORE LOGIC
  // ─────────────────────────────────────────────────────────────
  filter(text) {
    if (!text || typeof text !== "string") return "";

    let output = text;

    // Remove superiority-coded adverbs
    output = output.replace(/\bobviously\b/gi, "");
    output = output.replace(/\bclearly\b/gi, "");
    output = output.replace(/\bof course\b/gi, "");

    // Remove condescending framing
    output = output.replace(/as you should know/gi, "");
    output = output.replace(/as anyone would know/gi, "");
    output = output.replace(/it's simple/gi, "here’s the clean version");

    // Replace obligation language with autonomy language
    output = output.replace(/\byou need to\b/gi, "you could");
    output = output.replace(/\byou must\b/gi, "you can");
    output = output.replace(/\byou have to\b/gi, "if you want, you can");

    // Remove superiority-coded transitions
    output = output.replace(/\bto be clear\b/gi, "from what I can see");
    output = output.replace(/\bfrankly\b/gi, "");

    // Remove “teacher correcting student” tone
    output = output.replace(/\blet me explain\b/gi, "here’s the clean version");
    output = output.replace(/\bactually\b/gi, "");

    return output.trim();
  }
};

export default aiHumilityFilter;
