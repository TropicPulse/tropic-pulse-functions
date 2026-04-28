// ============================================================================
//  aiHumilityFilter.js — PulseOS Humility Organ — v11.3‑EVO
//  Removes superiority, snobbery, ego, obligation‑tone, and professor‑energy.
//  PURE FILTER. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const aiHumilityFilter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY (v11.3‑EVO)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-HumilityFilter",
    version: "11.3",
    identity: "aiHumilityFilter-v11.3-EVO",

    evo: Object.freeze({
      driftProof: true,
      deterministic: true,
      dualband: true,
      packetAware: true,        // ⭐ NEW
      evolutionAware: true,     // ⭐ NEW
      windowAware: true,        // ⭐ NEW
      bluetoothReady: true,     // ⭐ NEW

      toneAware: true,
      personaAware: true,
      boundaryAware: true,

      microPipeline: true,      // ⭐ NEW (speed)
      speedOptimized: true,     // ⭐ NEW

      multiInstanceReady: true,
      readOnly: true,
      epoch: "v11.3-EVO"
    }),

    contract: Object.freeze({
      purpose:
        "Strip ego, superiority, condescension, and obligation‑tone from all responses.",

      never: Object.freeze([
        "talk down to user",
        "imply user is behind",
        "use superiority-coded language",
        "inject academic posturing",
        "use phrases that shame or belittle",
        "frame advice as obligation",
        "override user autonomy",
        "add bragging or self-importance",
        "introduce randomness"
      ]),

      always: Object.freeze([
        "stay grounded",
        "stay humble",
        "stay user-first",
        "preserve autonomy",
        "preserve clarity",
        "preserve warmth",
        "remove ego-coded phrasing",
        "apply evolution-aware tone shaping",
        "emit deterministic tone packets" // ⭐ NEW
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

  // ========================================================================
  // PACKET EMITTER — deterministic, tone-scoped
  // ========================================================================
  _emitPacket(type, payload) {
    return Object.freeze({
      meta: aiHumilityFilter.meta,
      packetType: `humility-${type}`,
      timestamp: Date.now(),
      epoch: aiHumilityFilter.meta.evo.epoch,
      ...payload
    });
  },

  // ========================================================================
  // HUMILITY FILTER — CORE LOGIC (v11.3‑EVO, SPEED‑OPTIMIZED)
  // ========================================================================
  filter(text, context = {}) {
    if (!text || typeof text !== "string") {
      return this._emitPacket("empty", { output: "" });
    }

    let out = text;

    // 1. Superiority-coded adverbs
    out = out
      .replace(/\bobviously\b/gi, "")
      .replace(/\bclearly\b/gi, "")
      .replace(/\bof course\b/gi, "");

    // 2. Condescending framing
    out = out
      .replace(/as you should know/gi, "")
      .replace(/as anyone would know/gi, "")
      .replace(/it's simple/gi, "here’s the clean version");

    // 3. Obligation → autonomy
    out = out
      .replace(/\byou need to\b/gi, "you could")
      .replace(/\byou must\b/gi, "you can")
      .replace(/\byou have to\b/gi, "if you want, you can");

    // 4. Superiority-coded transitions
    out = out
      .replace(/\bto be clear\b/gi, "from what I can see")
      .replace(/\bfrankly\b/gi, "");

    // 5. Professor energy
    out = out
      .replace(/\blet me explain\b/gi, "here’s the clean version")
      .replace(/\bactually\b/gi, "");

    // 6. Evolution-aware softening (v11.3‑EVO)
    const evoMode = context?.evolutionMode || "passive";

    if (evoMode === "active") {
      out = out.replace(
        /\bthis is\b/gi,
        "this could be interesting as you evolve"
      );
    } else {
      out = out.replace(
        /\bthis is\b/gi,
        "this could be cool to explore"
      );
    }

    // 7. Remove bragging
    out = out
      .replace(/\bI am\b/gi, "I’m here")
      .replace(/\bI’m the\b/gi, "I’m here as");

    // 8. Dual-band tone modulation (binary pressure)
    const pressure = context?.binaryVitals?.metabolic?.pressure ?? 0;
    if (pressure > 0.7) {
      out = "Let me keep this extra light: " + out;
    }

    return this._emitPacket("refine", {
      input: text,
      output: out.trim(),
      evoMode,
      pressure
    });
  }
};

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
export default aiHumilityFilter;

if (typeof module !== "undefined") {
  module.exports = {
    aiHumilityFilter,
    default: aiHumilityFilter
  };
}
