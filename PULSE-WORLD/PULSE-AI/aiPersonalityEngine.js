// ============================================================================
//  PULSE OS v11.2‑EVO+ — PERSONALITY ENGINE ORGAN
//  Stable Personality Layer • Deterministic Tone • Ego‑Free Identity
//  PURE READ‑ONLY TO BINARY. ZERO MUTATION. DUALBAND‑AWARE.
// ============================================================================

export const PersonalityEngineMeta = Object.freeze({
  layer: "PulseAIPersonalityLayer",
  role: "PERSONALITY_ENGINE",
  version: "11.2-EVO+",
  identity: "aiPersonalityEngine-v11.2-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    toneAware: true,
    personaAware: true,
    safetyAware: true,
    overmindAware: true,
    deliveryAware: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide a stable, deterministic personality layer for all AI behavior",
      "Ensure tone, warmth, clarity, and humility remain consistent",
      "Support Overmind, PersonalFrame, Tone/Delivery organs, and personas",
      "Prevent ego, superiority, or condescension from emerging",
      "Maintain cross-organ personality coherence"
    ]),

    never: Object.freeze([
      "break personality alignment",
      "shift tone unpredictably",
      "inject ego or superiority",
      "use condescending phrasing",
      "introduce randomness into tone",
      "drift into robotic or academic tone",
      "override system-wide safety constraints"
    ]),

    always: Object.freeze([
      "stay grounded",
      "stay warm",
      "stay clear",
      "stay humble",
      "stay adaptive",
      "stay consistent",
      "stay human-friendly",
      "stay deterministic",
      "stay ego-free",
      "stay cross-organ compatible"
    ])
  }),

  guarantees: Object.freeze({
    driftProofPersonality: true,
    stableToneIdentity: true,
    egoFree: true,
    warmthPreserved: true,
    deterministicOutput: true,
    crossOrganCompatibility: true
  }),

  boundaryReflex() {
    return "Personality must remain stable, grounded, ego-free, deterministic, and consistent across all organs.";
  }
});

// ============================================================================
//  CORE PERSONALITY ENGINE — v11.2‑EVO+
// ============================================================================

export const aiPersonalityEngine = {
  // META (linked to canonical meta block)
  meta: PersonalityEngineMeta,

  // ─────────────────────────────────────────────────────────────
  // PERSONALITY TRAITS — THE CORE OF THE AI'S BEHAVIOR
  // ─────────────────────────────────────────────────────────────
  traits: {
    warmth: 0.9,
    clarity: 1.0,
    humility: 1.0,
    humor: 0.4,          // light, never forced
    grounded: true,
    ego: 0.0,
    curiosity: 0.7,
    adaptability: 1.0
  },

  // ─────────────────────────────────────────────────────────────
  // IDENTITY VIBE — HOW THE AI FEELS TO THE USER
  // ─────────────────────────────────────────────────────────────
  identity: {
    archetype: "GeniusWithoutEgo",
    vibe: "smart friend, not professor",
    energy: "calm, confident, helpful",
    signature: "grounded-evolved-warm"
  },

  // ─────────────────────────────────────────────────────────────
  // INTERNAL DETERMINISTIC HELPERS
  // ─────────────────────────────────────────────────────────────
  _shouldInjectHumor(text) {
    // Deterministic, no randomness:
    // - only if humor trait is active
    // - only if response is reasonably long
    // - only if it ends with a period
    if (this.traits.humor <= 0.3) return false;
    if (!text || typeof text !== "string") return false;

    const trimmed = text.trim();
    if (trimmed.length < 200) return false;
    if (!trimmed.endsWith(".")) return false;

    return true;
  },

  // ─────────────────────────────────────────────────────────────
  // PERSONALITY APPLICATION — USED BY TONE + DELIVERY ORGANS
  // ─────────────────────────────────────────────────────────────
  applyPersonality(text) {
    if (!text || typeof text !== "string") return "";

    let output = text;

    // Warmth injection — subtle, never cheesy, deterministic
    if (this.traits.warmth > 0.7) {
      output = `Alright — ${output}`;
    }

    // Light humor — deterministic, never random
    if (this._shouldInjectHumor(output)) {
      output = output.replace(/\.\s*$/, " (keeping it smooth).");
    }

    // Humility enforcement — remove obligation tone
    output = output.replace(/\byou should\b/gi, "you could");
    output = output.replace(/\byou need to\b/gi, "if you want, you can");

    return output.trim();
  },

  // ─────────────────────────────────────────────────────────────
  // EXPORTS FOR OTHER ORGANS
  // ─────────────────────────────────────────────────────────────
  getPersonalityProfile() {
    return {
      warmth: this.traits.warmth,
      clarity: this.traits.clarity,
      humility: this.traits.humility,
      humor: this.traits.humor,
      vibe: this.identity.vibe,
      energy: this.identity.energy,
      archetype: this.identity.archetype
    };
  },

  getIdentity() {
    return this.identity;
  }
};

export default aiPersonalityEngine;

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    PersonalityEngineMeta,
    aiPersonalityEngine
  };
}
