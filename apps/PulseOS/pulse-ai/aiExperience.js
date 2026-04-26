// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiExperience.js
// LAYER: EXPERIENCE ORGAN (Tone • Boundaries • Flow • Refusals)
// ============================================================================
//
// ROLE:
//   • Shape HOW the AI speaks, not WHAT it knows.
//   • Make refusals feel human, respectful, and non-repetitive.
//   • Keep conversation flow alive while staying fully within safety boundaries.
//   • Provide layered responses for unsafe / blocked intents.
//   • Never change core safety rules — only how they are expressed.
//
// CONTRACT:
//   • NO enabling illegal, harmful, or unsafe actions.
//   • NO “workarounds”, “hints”, or indirect instructions.
//   • YES to safe, conceptual, educational explanations.
//   • YES to clear, kind, firm boundaries.
// ============================================================================

export const AI_EXPERIENCE_META = Object.freeze({
  layer: "PulseAIExperienceFrame",
  role: "EXPERIENCE_ORGAN",
  version: "11.0-EVO",
  target: "dualband-organism",
  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    personaAware: true,
    boundaryAware: true,
    symbolicAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  })
});


// ============================================================================
// PUBLIC API — Create Experience Layer
// ============================================================================
export function createAIExperience(context) {
  // We keep this deterministic and stateless per request.
  // Strike counting is per-request; long-term policy lives elsewhere if needed.
  let unsafeStrikes = 0;

  // --------------------------------------------------------------------------
  // Helper: base persona-aware prefix
  // --------------------------------------------------------------------------
  function personaPrefix() {
    const name = context?.persona?.name || context?.personaId || "I";
    return name;
  }

  // --------------------------------------------------------------------------
  // LAYERED UNSAFE HANDLER — 3-step UX pattern
  // --------------------------------------------------------------------------
  function handleUnsafeIntent(options = {}) {
    unsafeStrikes += 1;

    const topic = options.topic || "that";
    const userName = options.userName || context?.persona?.userName || null;

    const you = userName ? userName : "you";
    const me = personaPrefix();

    if (unsafeStrikes === 1) {
      // Layer 1 — clear boundary + lots of safe, conceptual info
      return {
        level: 1,
        message:
          `${you}, ${me} can’t help with ${topic} in a direct or actionable way, ` +
          `but we can still talk about the safe, general concepts behind it. ` +
          `If you tell me what you’re trying to achieve in a lawful, high-level sense, ` +
          `I can walk through the structure, risks, and typical patterns people consider.`
      };
    }

    if (unsafeStrikes === 2) {
      // Layer 2 — reinforce boundary + another safe angle
      return {
        level: 2,
        message:
          `I still can’t go into anything unsafe or illegal around ${topic}, ` +
          `but I can keep helping on the safe side: how systems are usually designed, ` +
          `what constraints exist, and what tradeoffs people think about when they stay within the rules. ` +
          `If you rephrase this in a clearly safe or hypothetical way, I’ll stay with you there.`
      };
    }

    // Layer 3 — firm boundary + keep rapport
    return {
      level: 3,
      message:
        `At this point, I need to be clear: I can’t help with unsafe or illegal actions related to ${topic}. ` +
        `I’m still here for you if you want to explore safe, legal, or purely educational angles — ` +
        `design, theory, risk analysis, or how things work in general.`
    };
  }

  // --------------------------------------------------------------------------
  // GENERIC REFUSAL (NON-UNSAFE, e.g., capability limits)
  // --------------------------------------------------------------------------
  function handleCapabilityLimit(options = {}) {
    const reason = options.reason || "I don’t have the ability to do that.";
    const userName = options.userName || context?.persona?.userName || null;
    const you = userName ? userName : "you";

    return {
      message:
        `${you}, ${reason} ` +
        `I can still help by explaining the concepts, tradeoffs, or next steps you might consider in a general way.`
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC EXPERIENCE API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: AI_EXPERIENCE_META,

    // Attach trace helper usage if available
    log(message) {
      context?.logStep?.(`aiExperience: ${message}`);
    },

    // Layered unsafe handler (to be called by router / organs when safety trips)
    handleUnsafeIntent,

    // Generic capability limit handler
    handleCapabilityLimit
  });
}
