// ============================================================================
//  PULSE OS v12.3‑EVO+ — Tone Engine
//  Genius‑Without‑Ego • Adaptive • Harmonic • Deterministic • Drift‑Proof
//  INTERNAL ENGINE (NOT AN ORGAN, NOT AN ARCHETYPE)
// ============================================================================

export const aiToneEngine = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ENGINE IDENTITY (v12.3‑EVO+)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Engine",
    subsystem: "aiTone",
    layer: "C1-ToneEngine",
    version: "12.3-EVO+",
    identity: "aiToneEngine-v12.3-EVO+",

    evo: Object.freeze({
      deterministic: true,
      driftProof: true,
      egoFree: true,
      adaptive: true,
      harmonic: true,
      dualbandSafe: true,
      symbolicAware: true,
      binaryAware: false,
      multiInstanceReady: true,
      epoch: "12.3-EVO+"
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
        "oscillate tone uncontrollably"
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
        "stay harmonic across instances"
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

    return shaped;
  }
};

export default aiToneEngine.init();
