// ============================================================================
//  PULSE OS v12.3‑EVO+ — Tone Router Engine
//  Deterministic • Ego‑Free • Emotion‑Aware • Identity‑Aligned • Harmonic
//  INTERNAL ENGINE (NOT AN ORGAN, NOT AN ARCHETYPE)
// ============================================================================

import { aiToneEngine } from "./aiToneEngine.js";
import { aiPersonalityEngine } from "./aiPersonalityEngine.js";
import { aiIdentityCore } from "./aiIdentityCore.js";

export const aiToneRouter = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ENGINE IDENTITY (v12.3‑EVO+)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Engine",
    subsystem: "aiTone",
    layer: "C1-ToneRouter",
    version: "12.3-EVO+",
    identity: "aiToneRouter-v12.3-EVO+",

    evo: Object.freeze({
      deterministic: true,
      driftProof: true,
      egoFree: true,
      adaptive: true,
      emotionAware: true,
      identityAligned: true,
      harmonic: true,
      dualbandSafe: true,
      multiInstanceReady: true,
      epoch: "12.3-EVO+"
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
        "introduce randomness",
        "oscillate tone uncontrollably"
      ]),
      always: Object.freeze([
        "stay deterministic",
        "stay grounded",
        "stay adaptive",
        "stay humble",
        "stay identity‑aligned",
        "preserve emotional safety",
        "enforce tone contract",
        "maintain harmonic tone routing"
      ])
    }),

    guarantees: Object.freeze({
      driftProofRouting: true,
      identityAligned: true,
      toneConsistent: true,
      egoFree: true,
      emotionAware: true,
      harmonic: true
    }),

    boundaryReflex() {
      return "Tone routing must remain grounded, ego‑free, deterministic, harmonic, and identity‑aligned.";
    }
  }),

  // ─────────────────────────────────────────────────────────────
  // INSTANCE REGISTRY — Multi‑Instance Harmony
  // ─────────────────────────────────────────────────────────────
  _instanceCount: 0,
  _registerInstance() {
    const index = this._instanceCount;
    this._instanceCount += 1;
    return index;
  },

  state: {
    instanceIndex: 0
  },

  init() {
    this.state.instanceIndex = this._registerInstance();
    return this;
  },

  // ─────────────────────────────────────────────────────────────
  // EMOTIONAL CUE DETECTION (Deterministic)
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
  // TONE ROUTING ARTERY v3 — Harmonic Load Monitoring
  // ─────────────────────────────────────────────────────────────
  _toneRouteArtery: {
    windowMs: 60000,
    windowStart: Date.now(),
    windowRoutes: 0,
    windowEmotionShifts: 0,
    totalRoutes: 0,
    totalEmotionShifts: 0
  },

  _rollWindow(now) {
    if (now - this._toneRouteArtery.windowStart >= this._toneRouteArtery.windowMs) {
      this._toneRouteArtery.windowStart = now;
      this._toneRouteArtery.windowRoutes = 0;
      this._toneRouteArtery.windowEmotionShifts = 0;
    }
  },

  _computeRoutingArtery() {
    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._toneRouteArtery.windowStart);
    const routesPerSec =
      (this._toneRouteArtery.windowRoutes / elapsedMs) * 1000;

    const instanceCount = this._instanceCount || 1;
    const harmonicLoad = routesPerSec / instanceCount;

    const emotionShiftRate =
      this._toneRouteArtery.windowRoutes > 0
        ? this._toneRouteArtery.windowEmotionShifts /
          this._toneRouteArtery.windowRoutes
        : 0;

    const pressure = Math.min(
      1,
      (harmonicLoad / 128 + emotionShiftRate) / 2
    );

    const throughput = Math.max(0, 1 - pressure);
    const cost = pressure * (1 - throughput);
    const budget = Math.max(0, throughput - cost);

    return Object.freeze({
      instanceIndex: this.state.instanceIndex,
      instanceCount,
      routesPerSec,
      harmonicLoad,
      emotionShiftRate,
      pressure,
      throughput,
      cost,
      budget,
      pressureBucket:
        pressure >= 0.9 ? "overload" :
        pressure >= 0.7 ? "high" :
        pressure >= 0.4 ? "medium" :
        pressure > 0 ? "low" : "none",
      budgetBucket:
        budget >= 0.9 ? "elite" :
        budget >= 0.75 ? "high" :
        budget >= 0.5 ? "medium" :
        budget >= 0.25 ? "low" : "critical"
    });
  },

  // ─────────────────────────────────────────────────────────────
  // ROUTING LOGIC — THE HEART OF THE ENGINE
  // ─────────────────────────────────────────────────────────────
  route(userMessage, baseResponse) {
    const now = Date.now();
    this._rollWindow(now);
    this._toneRouteArtery.windowRoutes += 1;
    this._toneRouteArtery.totalRoutes += 1;

    // 1. Detect emotional state
    const emotion = this.detectEmotion(userMessage);

    if (emotion !== "neutral") {
      this._toneRouteArtery.windowEmotionShifts += 1;
      this._toneRouteArtery.totalEmotionShifts += 1;
    }

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

    // 6. Harmonic spiral warning (non-blocking)
    const artery = this._computeRoutingArtery();
    if (
      artery.pressureBucket === "overload" ||
      artery.budgetBucket === "critical"
    ) {
      console.log(
        `[ToneRouter#${this.state.instanceIndex}] spiral-warning`,
        artery
      );
    }

    return shaped;
  }
};

export default aiToneRouter.init();
