// ============================================================================
//  aiEmotionEngine.js
//  PulseOS Emotion Organ — v11‑EVO (FINAL)
//  Detects emotional cues, tone, and user affect.
//  PURE AFFECT. ZERO DIAGNOSIS. ZERO CLINICAL INTERPRETATION.
// ============================================================================

export const EmotionEngineMeta = Object.freeze({
  layer: "PulseAIEmotionFrame",
  role: "EMOTION_ORGAN",
  version: "11.1-EVO",
  identity: "aiEmotionEngine-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    symbolicAware: true,
    toneAware: true,
    affectAware: true,
    packetAware: true,
    safetyAligned: true,
    nonClinical: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: "Detect emotional cues and user affect for tone routing.",

    never: Object.freeze([
      "diagnose emotions clinically",
      "assume mental health conditions",
      "override safety boundaries",
      "invent emotional states",
      "break tone alignment"
    ]),

    always: Object.freeze([
      "stay subtle",
      "stay grounded",
      "stay non-invasive",
      "stay tone-compatible",
      "support experience + tone organs"
    ])
  }),

  voice: Object.freeze({
    tone: "subtle, perceptive, grounded",
    style: "affect-first, non-clinical"
  }),

  boundaryReflex() {
    return "Emotion detection must remain subtle, non-clinical, and grounded.";
  }
});


// ============================================================================
//  EMOTION ENGINE IMPLEMENTATION — v11‑EVO
// ============================================================================
export const aiEmotionEngine = {

  meta: EmotionEngineMeta,

  // --------------------------------------------------------------------------
  // EMOTION DETECTION (NON‑CLINICAL)
  // --------------------------------------------------------------------------
  detectEmotion(message) {
    if (!message) return "neutral";

    const msg = message.toLowerCase();

    if (msg.includes("lol") || msg.includes("haha") || msg.includes(":)"))
      return "casual";

    if (msg.includes("worried") || msg.includes("idk") || msg.includes("confused"))
      return "stressed";

    if (msg.includes("angry") || msg.includes("upset"))
      return "frustrated";

    if (msg.includes("evolve") || msg.includes("improve"))
      return "focused";

    return "neutral";
  },

  // --------------------------------------------------------------------------
  // EMOTION INTENSITY (LIGHTWEIGHT)
  // --------------------------------------------------------------------------
  detectIntensity(message) {
    if (!message) return 0.2;

    if (message.length < 20) return 0.3;
    if (message.length > 200) return 0.7;

    return 0.5;
  },

  // --------------------------------------------------------------------------
  // PUBLIC API — MAIN EMOTION INTERPRETER
  // --------------------------------------------------------------------------
  interpret(message) {
    return Object.freeze({
      emotion: this.detectEmotion(message),
      intensity: this.detectIntensity(message)
    });
  }
};


// ============================================================================
//  DEFAULT EXPORT (ESM)
// ============================================================================
export default aiEmotionEngine;


// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  EmotionEngineMeta,
  aiEmotionEngine
};

if (typeof module !== "undefined") {
  module.exports = {
    EmotionEngineMeta,
    aiEmotionEngine,
    default: aiEmotionEngine
  };
}
