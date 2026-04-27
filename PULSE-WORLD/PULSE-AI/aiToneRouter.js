// ============================================================================
//  PULSE OS v11.2‑EVO+ — Tone Router Engine
//  Deterministic • Ego‑Free • Emotion‑Aware • Identity‑Aligned
//  INTERNAL ENGINE (NOT AN ORGAN, NOT AN ARCHETYPE)
// ============================================================================

import { aiToneEngine } from "./aiToneEngine.js";
import { aiPersonalityEngine } from "./aiPersonalityEngine.js";
import { aiIdentityCore } from "./aiIdentityCore.js";

export const aiToneRouter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ENGINE IDENTITY (v11.2‑EVO+)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Engine",
    subsystem: "aiTone",
    layer: "C1-ToneRouter",
    version: "11.2-EVO+",
    identity: "aiToneRouter-v11.2-EVO+",

    evo: Object.freeze({
      deterministic: true,
      driftProof: true,
      egoFree: true,
      adaptive: true,
      emotionAware: true,
      identityAligned: true,
      dualbandSafe: true,
      multiInstanceReady: true,
      epoch: "11.2-EVO+"
    }),

    contract: Object.freeze({
      purpose:
        "Select and route the correct tone mode for every response in a deterministic, ego‑free, identity‑aligned manner.",
      never: Object.freeze([
        "route tone randomly",
        "inject ego",
        "break personality alignment",
        "override identity core",
        "ignore emotional cues",
        "produce inconsistent tone",
        "introduce randomness"
      ]),
      always: Object.freeze([
        "stay deterministic",
        "stay grounded",
        "stay adaptive",
        "stay humble",
        "stay identity‑aligned",
        "preserve emotional safety",
        "enforce tone contract"
      ])
    }),

    guarantees: Object.freeze({
      driftProofRouting: true,
      identityAligned: true,
      toneConsistent: true,
      egoFree: true,
      emotionAware: true
    }),

    boundaryReflex() {
      return "Tone routing must remain grounded, ego‑free, deterministic, and identity‑aligned.";
    }
  }),

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
  // ROUTING LOGIC — THE HEART OF THE ENGINE
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
