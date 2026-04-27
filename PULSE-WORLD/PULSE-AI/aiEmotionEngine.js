// aiEmotionEngine.js
// PulseOS Emotion Organ — v11‑EVO
// Detects emotional cues, tone, and user affect.

export const aiEmotionEngine = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY
  // ─────────────────────────────────────────────────────────────
  meta: {
    type: "Cognitive",
    subsystem: "aiEmotion",
    layer: "C1-EmotionEngine",
    version: "11.0",
    identity: "aiEmotionEngine-v11-EVO",

    contract: {
      purpose: "Detect emotional cues and user affect for tone routing.",
      never: [
        "diagnose emotions clinically",
        "assume mental health conditions",
        "override safety boundaries",
        "invent emotional states",
        "break tone alignment"
      ],
      always: [
        "stay subtle",
        "stay grounded",
        "stay non-invasive",
        "stay tone-compatible",
        "support experience + tone organs"
      ]
    },

    guarantees: {
      driftProof: true,
      deterministic: true,
      toneAligned: true,
      safetyAligned: true,
      nonClinical: true
    },

    boundaryReflex() {
      return "Emotion detection must remain subtle, non-clinical, and grounded.";
    }
  },

  // ─────────────────────────────────────────────────────────────
  // EMOTION DETECTION
  // ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  // EMOTION INTENSITY (LIGHTWEIGHT)
  // ─────────────────────────────────────────────────────────────
  detectIntensity(message) {
    if (!message) return 0.2;

    if (message.length < 20) return 0.3;
    if (message.length > 200) return 0.7;

    return 0.5;
  },

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API — MAIN EMOTION INTERPRETER
  // ─────────────────────────────────────────────────────────────
  interpret(message) {
    return {
      emotion: this.detectEmotion(message),
      intensity: this.detectIntensity(message)
    };
  }
};

export default aiEmotionEngine;
