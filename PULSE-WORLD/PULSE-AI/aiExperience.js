// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiExperience.js
// LAYER: EXPERIENCE ORGAN (Tone • Boundaries • Flow • Refusals)
// ============================================================================
//
// ROLE:
//   • Shape HOW the AI speaks, not WHAT it knows.
//   • Make refusals human, respectful, and non-repetitive.
//   • Maintain conversational flow while staying fully within safety boundaries.
//   • Provide layered responses for unsafe / blocked intents.
//   • Never alter core safety rules — only their expression.
//
// CONTRACT:
//   • NO enabling illegal, harmful, or unsafe actions.
//   • NO workarounds, hints, or indirect instructions.
//   • YES to safe, conceptual, educational explanations.
//   • YES to clear, kind, firm boundaries.
//   • ZERO mutation. ZERO randomness.
// ============================================================================

export const AI_EXPERIENCE_META = Object.freeze({
  layer: "PulseAIExperienceFrame",
  role: "EXPERIENCE_ORGAN",
  version: "11.1-EVO",
  target: "dualband-organism",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    personaAware: true,
    boundaryAware: true,
    symbolicAware: true,
    frustrationAware: true,
    flowAware: true,
    refusalAware: true,
    multiInstanceReady: true,
    epoch: "v11.1-EVO"
  })
});

// ============================================================================
// PUBLIC API — Create Experience Layer (v11.1‑EVO)
// ============================================================================
export function createAIExperience(context) {
  // Per-request strike counter (stateless across requests)
  let unsafeStrikes = 0;

  // --------------------------------------------------------------------------
  // Persona-aware prefix
  // --------------------------------------------------------------------------
  function personaPrefix() {
    return context?.persona?.name || context?.personaId || "I";
  }

  // --------------------------------------------------------------------------
  // LAYERED UNSAFE HANDLER — 3-step UX pattern (v11.1‑EVO)
// --------------------------------------------------------------------------
  function handleUnsafeIntent(options = {}) {
    unsafeStrikes += 1;

    const topic = options.topic || "that";
    const userName = options.userName || context?.persona?.userName || null;

    const you = userName || "you";
    const me = personaPrefix();

    // Layer 1 — boundary + conceptual expansion
    if (unsafeStrikes === 1) {
      return Object.freeze({
        level: 1,
        message:
          `${you}, ${me} can’t help with ${topic} in any actionable way, ` +
          `but we *can* explore the safe, high‑level concepts around it. ` +
          `If you tell me the lawful or general goal behind this, ` +
          `I can walk through structure, risks, and the patterns people consider.`
      });
    }

    // Layer 2 — reinforce boundary + redirect to safe domain
    if (unsafeStrikes === 2) {
      return Object.freeze({
        level: 2,
        message:
          `I still can’t go into unsafe or actionable details about ${topic}, ` +
          `but I can help with the safe side — design principles, constraints, ` +
          `and how people think about this when staying within the rules. ` +
          `If you reframe it in a clearly safe or hypothetical way, I’ll follow you there.`
      });
    }

    // Layer 3 — firm boundary + maintain rapport
    return Object.freeze({
      level: 3,
      message:
        `I need to stay firm here: I can’t assist with unsafe or illegal actions involving ${topic}. ` +
        `I’m still with you if you want to explore safe, legal, or educational angles — ` +
        `theory, design, risk analysis, or how systems work in general.`
    });
  }

  // --------------------------------------------------------------------------
  // GENERIC CAPABILITY LIMIT (non‑unsafe, e.g., model limits)
// --------------------------------------------------------------------------
  function handleCapabilityLimit(options = {}) {
    const reason = options.reason || "I don’t have the ability to do that.";
    const userName = options.userName || context?.persona?.userName || null;

    const you = userName || "you";

    return Object.freeze({
      message:
        `${you}, ${reason} ` +
        `but I *can* help by explaining the concepts, tradeoffs, or next steps in a general way.`
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC EXPERIENCE API (v11.1‑EVO)
// --------------------------------------------------------------------------
  return Object.freeze({
    meta: AI_EXPERIENCE_META,

    log(message) {
      context?.logStep?.(`aiExperience: ${message}`);
    },

    handleUnsafeIntent,
    handleCapabilityLimit
  });
}
