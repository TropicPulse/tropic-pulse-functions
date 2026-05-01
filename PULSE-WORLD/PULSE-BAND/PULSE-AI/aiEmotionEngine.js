// ============================================================================
//  aiEmotionEngine.js — Pulse OS v12.3‑Presence
//  Emotion Organ • Subtle Affect Detection • Tone Routing Surface
//  PURE AFFECT. ZERO DIAGNOSIS. ZERO CLINICAL INTERPRETATION.
// ============================================================================

export const EmotionEngineMeta = Object.freeze({
  layer: "PulseAIEmotionFrame",
  role: "EMOTION_ORGAN",
  version: "12.3-Presence",
  identity: "aiEmotionEngine-v12.3-Presence",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    symbolicAware: true,
    toneAware: true,
    affectAware: true,

    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    safetyAligned: true,
    nonClinical: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,

    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose: "Detect emotional cues and user affect for tone routing.",

    never: Object.freeze([
      "diagnose emotions clinically",
      "assume mental health conditions",
      "override safety boundaries",
      "invent emotional states",
      "break tone alignment",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "stay subtle",
      "stay grounded",
      "stay non-invasive",
      "stay tone-compatible",
      "support experience + tone organs",
      "emit deterministic affect packets"
    ])
  }),

  voice: Object.freeze({
    tone: "subtle, perceptive, grounded",
    style: "affect-first, non-clinical"
  }),

  presence: Object.freeze({
    organId: "EmotionEngine",
    organKind: "Affect",
    physiologyBand: "Symbolic",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-message",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "emotion:detected",
        "emotion:packet"
      ]
    }
  }),

  boundaryReflex() {
    return "Emotion detection must remain subtle, non-clinical, and grounded.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, emotion-scoped
// ============================================================================
function emitEmotionPacket(type, payload = {}) {
  return Object.freeze({
    meta: EmotionEngineMeta,
    packetType: `emotion-${type}`,
    timestamp: Date.now(),
    epoch: EmotionEngineMeta.evo.epoch,
    layer: EmotionEngineMeta.layer,
    role: EmotionEngineMeta.role,
    identity: EmotionEngineMeta.identity,
    ...payload
  });
}

// ============================================================================
//  EMOTION ENGINE PREWARM — v12.3‑Presence
// ============================================================================
export function prewarmEmotionEngine() {
  try {
    const warmSamples = [
      "lol this is funny",
      "idk I'm confused",
      "I'm angry about this",
      "I want to evolve the system",
      "neutral baseline"
    ];

    for (const msg of warmSamples) {
      aiEmotionEngine.detectEmotion(msg);
      aiEmotionEngine.detectIntensity(msg);
      aiEmotionEngine.interpret(msg);
    }

    return emitEmotionPacket("prewarm", {
      message: "Emotion engine prewarmed and affect pathways aligned."
    });
  } catch (err) {
    return emitEmotionPacket("prewarm-error", {
      error: String(err),
      message: "Emotion engine prewarm failed."
    });
  }
}

// ============================================================================
//  EMOTION ENGINE IMPLEMENTATION — v12.3‑Presence
// ============================================================================
export const aiEmotionEngine = {

  meta: EmotionEngineMeta,

  // --------------------------------------------------------------------------
  // EMOTION DETECTION (NON‑CLINICAL, SUBTLE)
  // --------------------------------------------------------------------------
  detectEmotion(message) {
    if (!message) {
      return "neutral";
    }

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
  // EMOTION INTENSITY (LIGHTWEIGHT, NON‑CLINICAL)
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
    const emotion = this.detectEmotion(message);
    const intensity = this.detectIntensity(message);

    return emitEmotionPacket("detected", {
      emotion,
      intensity,
      message
    });
  }
};

// ============================================================================
//  DEFAULT EXPORT (ESM)
// ============================================================================
export default aiEmotionEngine;

if (typeof module !== "undefined") {
  module.exports = {
    EmotionEngineMeta,
    aiEmotionEngine,
    prewarmEmotionEngine,
    default: aiEmotionEngine
  };
}
