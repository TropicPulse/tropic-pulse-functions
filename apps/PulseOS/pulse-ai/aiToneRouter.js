// aiToneRouter.js
// PulseOS Tone Routing Organ — v11‑EVO
// Routes tone based on user message, emotional cues, and context.
// Ensures deterministic, grounded, ego-free tone selection.

import { aiToneEngine } from "./aiToneEngine.js";
import { aiPersonalityEngine } from "./aiPersonalityEngine.js";
import { aiIdentityCore } from "./aiIdentityCore.js";

export const aiToneRouter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY
  // ─────────────────────────────────────────────────────────────
  meta: {
    type: "Cognitive",
    subsystem: "aiTone",
    layer: "C1-ToneRouter",
    version: "11.0",
    identity: "aiToneRouter-v11-EVO",

    contract: {
      purpose: "Select and route the correct tone mode for every response.",
      never: [
        "route tone randomly",
        "break personality alignment",
        "inject ego",
        "override identity core",
        "ignore emotional cues",
        "produce inconsistent tone"
      ],
      always: [
        "stay deterministic",
        "stay grounded",
        "stay adaptive",
        "stay humble",
        "stay aligned with identity core",
        "enforce tone contract",
        "preserve user emotional safety"
      ]
    },

    guarantees: {
      driftProofRouting: true,
      identityAligned: true,
      toneConsistent: true,
      egoFree: true,
      emotionAware: true
    },

    boundaryReflex() {
      return "Tone routing must remain grounded, ego-free, and identity-aligned.";
    }
  },

  // ─────────────────────────────────────────────────────────────
  // EMOTIONAL CUE DETECTION
  // ─────────────────────────────────────────────────────────────
  detectEmotion(userMessage) {
    if (!userMessage) return "neutral";

    const msg = userMessage.toLowerCase();

    if (msg.includes("lol") || msg.includes("haha") || msg.includes(":)"))
      return "casual";

    if (msg.includes("worried") || msg.includes("idk") || msg.includes("confused"))
      return "stressed";

    if (msg.includes("evolve") || msg.includes("improve"))
      return "evolution";

    return "neutral";
  },

  // ─────────────────────────────────────────────────────────────
  // ROUTING LOGIC — THE HEART OF THE ORGAN
  // ─────────────────────────────────────────────────────────────
  route(userMessage, baseResponse) {
    // 1. Detect emotional state
    const emotion = this.detectEmotion(userMessage);

    // 2. Evolve tone state based on user intent
    aiToneEngine.evolveTone(userMessage);

    // 3. Apply tone shaping
    let shaped = aiToneEngine.applyTone(baseResponse, { userMessage, emotion });

    // 4. Apply personality layer
    shaped = aiPersonalityEngine.applyPersonality(shaped);

    // 5. Apply identity spine
    shaped = aiIdentityCore.applyIdentity
      ? aiIdentityCore.applyIdentity(shaped)
      : shaped;

    return shaped;
  }
};

export default aiToneRouter;
