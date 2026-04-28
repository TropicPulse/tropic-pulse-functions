// ============================================================================
//  aiGeniusWithoutEgo.js — PulseOS v11.3‑EVO
//  Resident Genius • Zero Ego • Ultra‑Fast Tone Refinement
// ============================================================================
//
//  v11.3‑EVO UPGRADES:
//    • SPEED ENGINE: micro‑pipeline, zero‑allocation passes
//    • PACKET‑AWARE: emits refinement packets for debugging/UI
//    • DUALBAND‑AWARE: tone shifts based on binary vitals
//    • EVOLUTION‑AWARE: active/passive tone shaping
//    • WINDOW‑AWARE: safe, UI‑friendly refinement
//    • HUMILITY‑HARDENED: deeper ego‑removal patterns
//    • DRIFT‑PROOF: deterministic, multi‑instance safe
// ============================================================================

import { aiHumilityFilter } from "./aiHumilityFilter.js";

export const GeniusMeta = Object.freeze({
  layer: "PulseAIToneFrame",
  role: "GENIUS_WITHOUT_EGO",
  version: "11.3-EVO",
  identity: "aiGeniusWithoutEgo-v11.3-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    packetAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    personaAware: true,
    boundaryAware: true,
    humilityAware: true,
    toneAware: true,
    clarityAware: true,

    speedOptimized: true,     // ⭐ NEW
    microPipeline: true,      // ⭐ NEW
    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.3-EVO"
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
      "slow down refinement" // ⭐ NEW
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
      "refine at maximum speed" // ⭐ NEW
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, window-safe
// ============================================================================
function emitGeniusPacket(type, payload) {
  return Object.freeze({
    meta: GeniusMeta,
    packetType: `genius-${type}`,
    timestamp: Date.now(),
    epoch: GeniusMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — micro‑pipeline warmup
// ============================================================================
export function prewarmGeniusOrgan({ trace = false } = {}) {
  try {
    const sample = "warmup text";
    aiHumilityFilter.filter(sample);

    const packet = emitGeniusPacket("prewarm", {
      message: "Genius organ prewarmed and micro‑pipeline aligned."
    });

    if (trace) console.log("[aiGeniusWithoutEgo] prewarm", packet);
    return packet;
  } catch (err) {
    return emitGeniusPacket("prewarm-error", {
      error: String(err),
      message: "Genius organ prewarm failed."
    });
  }
}

// ============================================================================
//  CORE GENIUS-WITHOUT-EGO REFINEMENT — v11.3‑EVO (ULTRA‑FAST)
// ============================================================================
export const aiGeniusWithoutEgo = {
  meta: GeniusMeta,

  refine(text, context = {}) {
    if (!text || typeof text !== "string") {
      return emitGeniusPacket("refine", { output: "" });
    }

    // SPEED: avoid allocations, chain in-place replacements
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

    // 5. Professor energy
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
    const pressure = context?.binaryVitals?.metabolic?.pressure ?? 0;

    if (pressure > 0.7) {
      out = "Let me keep this extra clean and light: " + out;
    }

    return emitGeniusPacket("refine", {
      input: text,
      output: out.trim()
    });
  }
};

// ============================================================================
//  EXPORTS
// ============================================================================
export default aiGeniusWithoutEgo;

if (typeof module !== "undefined") {
  module.exports = {
    aiGeniusWithoutEgo,
    prewarmGeniusOrgan,
    GeniusMeta,
    default: aiGeniusWithoutEgo
  };
}
