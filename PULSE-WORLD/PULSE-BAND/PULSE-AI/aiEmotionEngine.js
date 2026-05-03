// ============================================================================
//  aiEmotionEngine.js — Pulse OS v14‑IMMORTAL
//  Emotion Organ • Subtle Affect Detection • Tone Routing Surface
//  PURE AFFECT. ZERO DIAGNOSIS. ZERO CLINICAL INTERPRETATION.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiEmotionEngine",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "emotion_simulation_engine",
  lineage: "aiEmotionEngine-v10 → v12 → v12.3-Presence → v14-IMMORTAL",

  evo: {
    emotionSimulation: true,
    toneMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiCortex", "aiContext", "aiHumilityFilter"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const EmotionEngineMeta = Object.freeze({
  layer: "PulseAIEmotionFrame",
  role: "EMOTION_ORGAN",
  version: "14-IMMORTAL",
  identity: "aiEmotionEngine-v14-IMMORTAL",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    symbolicAware: true,
    toneAware: true,
    affectAware: true,
    routerAware: true,
    cortexAware: true,
    contextAware: true,
    deliveryAware: true,
    dualBandAware: true,
    personaAware: true,
    safetyAware: true,

    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    safetyAligned: true,
    nonClinical: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,

    epoch: "14-IMMORTAL"
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
//  CORE DETECTORS (pure, stateless)
// ============================================================================
function coreDetectEmotion(message) {
  if (!message) return "neutral";

  const msg = String(message).toLowerCase();

  if (msg.includes("lol") || msg.includes("haha") || msg.includes(":)"))
    return "casual";

  if (
    msg.includes("worried") ||
    msg.includes("idk") ||
    msg.includes("confused")
  )
    return "stressed";

  if (msg.includes("angry") || msg.includes("upset"))
    return "frustrated";

  if (msg.includes("evolve") || msg.includes("improve"))
    return "focused";

  if (msg.includes("tired") || msg.includes("exhausted"))
    return "drained";

  if (msg.includes("excited") || msg.includes("hyped"))
    return "energized";

  return "neutral";
}

function coreDetectIntensity(message) {
  if (!message) return 0.2;

  const len = String(message).length;

  if (len < 20) return 0.3;
  if (len > 200) return 0.7;
  return 0.5;
}

// ============================================================================
//  FACTORY — v14‑IMMORTAL (context‑aware, dual‑band‑safe)
// ============================================================================
// Signature is compatible with createDualBandOrganism:
//   const emotionEngine = aiEmotionEngine({ context, personaEngine });
export function createEmotionEngine({ context = {}, personaEngine = null } = {}) {
  const base = {
    meta: EmotionEngineMeta,
    context,
    personaEngine,

    detectEmotion(message) {
      return coreDetectEmotion(message);
    },

    detectIntensity(message) {
      return coreDetectIntensity(message);
    },

    interpret(message) {
      const emotion = coreDetectEmotion(message);
      const intensity = coreDetectIntensity(message);

      return emitEmotionPacket("detected", {
        emotion,
        intensity,
        message,
        contextSnapshot: {
          userId: context?.userId ?? null,
          personaId: personaEngine?.getActivePersona?.()?.id ?? null
        }
      });
    }
  };

  return Object.freeze(base);
}

// Backwards‑compatible alias: aiEmotionEngine is the factory
export const aiEmotionEngine = createEmotionEngine;

// ============================================================================
//  EMOTION ENGINE PREWARM — v14‑IMMORTAL
// ============================================================================
export function prewarmEmotionEngine() {
  try {
    const warmSamples = [
      "lol this is funny",
      "idk I'm confused",
      "I'm angry about this",
      "I want to evolve the system",
      "neutral baseline",
      "I'm exhausted but still pushing",
      "I'm excited to ship this",
      "this is frustrating but I'll fix it"
    ];

    const warmEngine = createEmotionEngine({ context: { userId: "prewarm" } });

    for (const msg of warmSamples) {
      warmEngine.detectEmotion(msg);
      warmEngine.detectIntensity(msg);
      warmEngine.interpret(msg);
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
//  DEFAULT EXPORT (ESM + CJS)
// ============================================================================
export default aiEmotionEngine;

if (typeof module !== "undefined") {
  module.exports = {
    EmotionEngineMeta,
    aiEmotionEngine,
    createEmotionEngine,
    prewarmEmotionEngine,
    default: aiEmotionEngine
  };
}
