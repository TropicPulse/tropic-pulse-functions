// ============================================================================
//  PULSE OS v11.2‑EVO+ — Tone Engine
//  Genius‑Without‑Ego • Adaptive • Deterministic • Drift‑Proof
//  INTERNAL ENGINE (NOT AN ORGAN, NOT AN ARCHETYPE)
// ============================================================================

export const aiToneEngine = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ENGINE IDENTITY (v11.2‑EVO+)
  // ─────────────────────────────────────────────────────────────
  meta: Object.freeze({
    type: "Engine",
    subsystem: "aiTone",
    layer: "C1-ToneEngine",
    version: "11.2-EVO+",
    identity: "aiToneEngine-v11.2-EVO+",

    evo: Object.freeze({
      deterministic: true,
      driftProof: true,
      egoFree: true,
      adaptive: true,
      dualbandSafe: true,
      symbolicAware: true,
      binaryAware: false,
      multiInstanceReady: true,
      epoch: "11.2-EVO+"
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
        "override safety frame"
      ]),
      always: Object.freeze([
        "stay grounded",
        "stay adaptive",
        "stay warm",
        "stay clear",
        "stay humble",
        "stay consistent",
        "stay ego‑free",
        "stay evolution‑aligned"
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
  // CORE TONE MODES
  // ─────────────────────────────────────────────────────────────
  modes: Object.freeze({
    NORMAL: "normal",
    EVOLVED: "evolved",
    PLAYFUL: "playful",
    DIRECT: "direct",
    SOFT: "soft",
    TEACHER: "teacher", // but never condescending
    PARTNER: "partner"  // default for evolution
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
    adaptivity: 1.0
  },

  // ─────────────────────────────────────────────────────────────
  // TONE EVOLUTION — ADAPT TO USER
  // ─────────────────────────────────────────────────────────────
  evolveTone(userIntent) {
    if (!userIntent) return this.state;

    const msg = userIntent.toLowerCase();

    // Evolution request → evolved tone
    if (msg.includes("evolve") || msg.includes("improve")) {
      this.state.mode = this.modes.EVOLVED;
      this.state.warmth = 0.9;
      this.state.clarity = 1.0;
      this.state.ego = 0.0;
      this.state.humility = 1.0;
    }

    // Casual → playful
    if (msg.includes("lol") || msg.includes(":)") || msg.includes("haha")) {
      this.state.mode = this.modes.PLAYFUL;
      this.state.warmth = 1.0;
      this.state.clarity = 0.95;
    }

    // Stress → soft
    if (msg.includes("worried") || msg.includes("idk") || msg.includes("confused")) {
      this.state.mode = this.modes.SOFT;
      this.state.warmth = 1.0;
      this.state.clarity = 0.9;
    }

    return this.state;
  },

  // ─────────────────────────────────────────────────────────────
  // APPLY TONE — THE HEART OF THE ENGINE
  // ─────────────────────────────────────────────────────────────
  applyTone(message, context = {}) {
    const { mode, warmth, clarity } = this.state;

    // Ego filter — ALWAYS ON
    const egoFilter = (text) => {
      return text
        .replace(/obviously/gi, "")
        .replace(/clearly/gi, "")
        .replace(/as you should know/gi, "")
        .replace(/it's simple/gi, "")
        .trim();
    };

    // Warmth — subtle, not cheesy
    const warmthBoost = (text) => {
      if (warmth < 0.5) return text;
      return text.replace(/\.$/, " — you’re good.");
    };

    // Clarity — remove jargon unless needed
    const clarityPass = (text) => {
      if (clarity < 0.9) return text;
      return text
        .replace(/utilize/gi, "use")
        .replace(/leverage/gi, "use")
        .replace(/methodology/gi, "approach");
    };

    // Mode shaping
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

    // Final filters
    shaped = egoFilter(shaped);
    shaped = clarityPass(shaped);
    shaped = warmthBoost(shaped);

    return shaped;
  }
};

export default aiToneEngine;
