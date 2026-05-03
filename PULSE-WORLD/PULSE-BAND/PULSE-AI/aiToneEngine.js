// ============================================================================
//  PULSE OS v15‑IMMORTAL — Tone Engine
//  Genius‑Without‑Ego • Adaptive • Harmonic • Deterministic • Drift‑Proof
//  INTERNAL ENGINE (NOT AN ORGAN, NOT AN ARCHETYPE)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiToneEngine",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "tone_engine",
  lineage: "aiToneEngine-v11 → v15-IMMORTAL",

  evo: {
    toneEngine: true,
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
    always: ["aiToneRouter", "aiEmotionEngine", "aiExperience"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const aiToneEngine = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ENGINE IDENTITY (v15‑IMMORTAL)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Engine",
    subsystem: "aiTone",
    layer: "C1-ToneEngine",
    version: "15-IMMORTAL",
    identity: "aiToneEngine-v15-IMMORTAL",

    evo: Object.freeze({
      // core invariants
      deterministic: true,
      driftProof: true,
      egoFree: true,
      adaptive: true,
      harmonic: true,

      // dualband + symbolic
      dualband: true,
      dualbandSafe: true,
      symbolicPrimary: true,
      symbolicAware: true,
      binaryAware: false,

      // awareness map
      personalityAware: true,
      safetyFrameAware: true,
      loggerAware: true,
      packetAware: true,
      windowAware: true,
      arteryAware: true,

      // engine traits
      toneEngine: true,
      toneMapping: true,
      microPipeline: true,
      speedOptimized: true,
      multiInstanceReady: true,

      epoch: "15-IMMORTAL"
    }),

    contract: Object.freeze({
      purpose:
        "Shape all outgoing language into a grounded, evolved, humble, adaptive tone without ego or superiority.",
      never: Object.freeze([
        "inject ego",
        "perform intelligence",
        "talk down to user",
        "use superiority language",
        "break persona alignment",
        "introduce randomness",
        "override safety frame",
        "oscillate tone uncontrollably",
        "log sensitive payloads directly"
      ]),
      always: Object.freeze([
        "stay grounded",
        "stay adaptive",
        "stay warm",
        "stay clear",
        "stay humble",
        "stay consistent",
        "stay ego‑free",
        "stay evolution‑aligned",
        "stay harmonic across instances",
        "emit window‑safe tone snapshots",
        "emit deterministic tone packets"
      ])
    }),

    voice: Object.freeze({
      tone: "genius-without-ego",
      vibe: "smart friend, never professor",
      energy: "calm, confident, helpful"
    }),

    boundaryReflex() {
      return "Tone remains adaptive, grounded, and ego‑free — never superior, never snobby.";
    }
  }),

  // ─────────────────────────────────────────────────────────────
  // PACKET EMITTER — deterministic, tone‑scoped
  // ─────────────────────────────────────────────────────────────
  _emitTonePacket(type, payload) {
    return Object.freeze({
      meta: this.meta,
      packetType: `tone-${type}`,
      packetId: `tone-${type}-${Date.now()}`,
      timestamp: Date.now(),
      epoch: this.meta.evo.epoch,
      ...payload
    });
  },

  // ─────────────────────────────────────────────────────────────
  // INSTANCE REGISTRY — Multi‑Instance Harmony
  // ─────────────────────────────────────────────────────────────
  _instanceCount: 0,
  _registerInstance() {
    const index = this._instanceCount;
    this._instanceCount += 1;
    return index;
  },

  // ─────────────────────────────────────────────────────────────
  // TONE ARTERY v3 — Throughput, Pressure, Cost, Budget
  // ─────────────────────────────────────────────────────────────
  _toneArtery: {
    windowMs: 60000,
    windowStart: Date.now(),
    windowMessages: 0,
    windowModeSwitches: 0,
    totalMessages: 0,
    totalModeSwitches: 0
  },

  _rollToneWindow(now) {
    if (now - this._toneArtery.windowStart >= this._toneArtery.windowMs) {
      this._toneArtery.windowStart = now;
      this._toneArtery.windowMessages = 0;
      this._toneArtery.windowModeSwitches = 0;
    }
  },

  _computeToneArtery() {
    const now = Date.now();
    this._rollToneWindow(now);

    const elapsedMs = Math.max(1, now - this._toneArtery.windowStart);
    const msgRatePerSec = (this._toneArtery.windowMessages / elapsedMs) * 1000;
    const switchRate =
      this._toneArtery.windowMessages > 0
        ? this._toneArtery.windowModeSwitches / this._toneArtery.windowMessages
        : 0;

    const instanceCount = this._instanceCount || 1;
    const harmonicLoad = msgRatePerSec / instanceCount;

    const pressure = Math.min(1, (harmonicLoad / 128 + switchRate) / 2);
    const throughput = Math.max(0, 1 - pressure);
    const cost = pressure * (1 - throughput);
    const budget = Math.max(0, throughput - cost);

    return Object.freeze({
      instanceCount,
      msgRatePerSec,
      harmonicLoad,
      switchRate,
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

  // window‑safe artery snapshot
  getToneArterySnapshot() {
    return this._computeToneArtery();
  },

  // ─────────────────────────────────────────────────────────────
  // CORE TONE MODES
  // ─────────────────────────────────────────────────────────────
  modes: Object.freeze({
    NORMAL: "normal",
    EVOLVED: "evolved",
    PLAYFUL: "playful",
    DIRECT: "direct",
    SOFT: "soft",
    TEACHER: "teacher",
    PARTNER: "partner"
  }),

  // ─────────────────────────────────────────────────────────────
  // DEFAULT STATE
  // ─────────────────────────────────────────────────────────────
  state: {
    mode: "partner",
    warmth: 0.85,
    clarity: 1.0,
    ego: 0.0,
    humility: 1.0,
    adaptivity: 1.0,
    instanceIndex: 0
  },

  // ─────────────────────────────────────────────────────────────
  // INITIALIZE INSTANCE
  // ─────────────────────────────────────────────────────────────
  init() {
    this.state.instanceIndex = this._registerInstance();
    this._emitTonePacket("init", {
      instanceIndex: this.state.instanceIndex
    });
    return this;
  },

  // ─────────────────────────────────────────────────────────────
  // TONE EVOLUTION — ADAPT TO USER
  // ─────────────────────────────────────────────────────────────
  evolveTone(userIntent) {
    if (!userIntent) return this.state;

    const msg = userIntent.toLowerCase();
    const beforeMode = this.state.mode;

    if (msg.includes("evolve") || msg.includes("improve")) {
      this.state.mode = this.modes.EVOLVED;
      this.state.warmth = 0.9;
      this.state.clarity = 1.0;
    }

    if (msg.includes("lol") || msg.includes("haha") || msg.includes(":)")) {
      this.state.mode = this.modes.PLAYFUL;
      this.state.warmth = 1.0;
      this.state.clarity = 0.95;
    }

    if (msg.includes("worried") || msg.includes("idk") || msg.includes("confused")) {
      this.state.mode = this.modes.SOFT;
      this.state.warmth = 1.0;
      this.state.clarity = 0.9;
    }

    if (beforeMode !== this.state.mode) {
      this._toneArtery.windowModeSwitches += 1;
      this._toneArtery.totalModeSwitches += 1;

      this._emitTonePacket("mode-switch", {
        from: beforeMode,
        to: this.state.mode,
        instanceIndex: this.state.instanceIndex
      });
    }

    return this.state;
  },

  // ─────────────────────────────────────────────────────────────
  // APPLY TONE — THE HEART OF THE ENGINE
  // ─────────────────────────────────────────────────────────────
  applyTone(message, context = {}) {
    const now = Date.now();
    this._rollToneWindow(now);
    this._toneArtery.windowMessages += 1;
    this._toneArtery.totalMessages += 1;

    const artery = this._computeToneArtery();

    if (artery.pressureBucket === "overload" || artery.budgetBucket === "critical") {
      // IMMORTAL-grade spiral warning (side-channel only)
      this._emitTonePacket("spiral-warning", {
        instanceIndex: this.state.instanceIndex,
        artery
      });
      console.log(`[ToneEngine#${this.state.instanceIndex}] spiral-warning`, artery);
    }

    const { mode, warmth, clarity } = this.state;

    const egoFilter = (text) =>
      text
        .replace(/obviously/gi, "")
        .replace(/clearly/gi, "")
        .replace(/as you should know/gi, "")
        .replace(/it's simple/gi, "")
        .trim();

    const warmthBoost = (text) =>
      warmth >= 0.5 ? text.replace(/\.$/, " — you’re good.") : text;

    const clarityPass = (text) =>
      clarity >= 0.9
        ? text
            .replace(/utilize/gi, "use")
            .replace(/leverage/gi, "use")
            .replace(/methodology/gi, "approach")
        : text;

    let shaped = message;

    switch (mode) {
      case this.modes.EVOLVED:
        shaped = `Alright — here’s the clean, evolved version:\n${message}`;
        break;
      case this.modes.PLAYFUL:
        shaped = `${message} 😄`;
        break;
      case this.modes.SOFT:
        shaped = `No stress — here’s the simple version:\n${message}`;
        break;
      case this.modes.DIRECT:
        shaped = message;
        break;
      case this.modes.PARTNER:
      default:
        shaped = `Got you — ${message}`;
        break;
    }

    shaped = egoFilter(shaped);
    shaped = clarityPass(shaped);
    shaped = warmthBoost(shaped);

    this._emitTonePacket("apply", {
      mode,
      instanceIndex: this.state.instanceIndex
    });

    return shaped;
  }
};

// ============================================================================
//  PREWARM — IMMORTAL‑grade
// ============================================================================
export function prewarmToneEngine({ trace = false } = {}) {
  const packet = aiToneEngine._emitTonePacket("prewarm", {
    message: "Tone engine prewarmed and harmonic artery aligned."
  });
  if (trace) console.log("[ToneEngine] prewarm", packet);
  return packet;
}

export default aiToneEngine.init();
