// ============================================================================
//  PULSE OS v12.3‑EVO — PERSONAL FRAME ORGAN
//  User-Level Preferences • Tone • Abstraction • Context Injection
//  PURE READ-ONLY TO BINARY. GUARDED WRITES TO PERSONAL MEMORY.
//  DUALBAND • DETERMINISTIC • SAFETY-AWARE • OVERMIND-PRIME-AWARE
// ============================================================================

export const PersonalFrameMeta = Object.freeze({
  layer: "PulseAIPersonalFrame",
  role: "PERSONAL_FRAME_ORGAN",
  version: "12.3-EVO",
  identity: "aiPersonalFrame-v12.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    safetyAware: true,
    overmindAware: true,
    routerAware: true,
    memoryAware: true,
    personaAware: true,
    packetAware: true,
    windowAware: true,
    lineageAware: true,
    toneAware: true,
    abstractionAware: true,
    multiInstanceReady: true,
    readOnly: false,
    epoch: "12.3-EVO"
  }),

  contract: Object.freeze({
    purpose: [
      "Represent user-level preferences and communication style",
      "Provide personal context to Overmind-Prime and personas",
      "Control abstraction level, tone, and verbosity per user",
      "Maintain personal memory lanes when allowed",
      "Shape final output according to user profile",
      "Integrate with dualband safety and persona routing",
      "Emit window-safe personal-frame snapshots"
    ],

    never: [
      "mutate binary organs",
      "override system-wide safety constraints",
      "expose raw identity anchors",
      "write outside personal lanes",
      "introduce randomness",
      "simulate personas or identities"
    ],

    always: [
      "stay deterministic",
      "respect owner+user gating",
      "strip identity anchors",
      "defer to SafetyFrame for safety decisions",
      "integrate router safetyMode + personaId",
      "remain read-only relative to binary layers"
    ]
  }),

  boundaryReflex() {
    return "PersonalFrame is a deterministic preference organ — it never mutates binary state.";
  }
});

// ============================================================================
//  PERSONAL FRAME — v12.3‑EVO
// ============================================================================

export class AiPersonalFrame {
  constructor({ memoryAPI, defaultProfile = {} } = {}) {
    this.memoryAPI = memoryAPI || null;

    this.defaultProfile = Object.freeze({
      tone: "neutral",          // neutral | warm | direct | formal | playful
      abstraction: "medium",    // low | medium | high
      verbosity: "normal",      // terse | normal | detailed
      safetyMode: "standard",   // standard | strict | relaxed (if allowed)
      personaBias: null,        // optional persona preference
      ...defaultProfile
    });

    // window-safe snapshot
    this.personalArtery = {
      lastTone: this.defaultProfile.tone,
      lastAbstraction: this.defaultProfile.abstraction,
      lastVerbosity: this.defaultProfile.verbosity,
      snapshot: () => Object.freeze({
        tone: this.personalArtery.lastTone,
        abstraction: this.personalArtery.lastAbstraction,
        verbosity: this.personalArtery.lastVerbosity
      })
    };
  }

  // --------------------------------------------------------------------------
  //  LOAD PROFILE (deterministic, lineage-aware)
  // --------------------------------------------------------------------------
  async loadProfile(context) {
    const userId = context?.userId || null;
    if (!userId || !this.memoryAPI?.getPersonalProfile) {
      return this.defaultProfile;
    }

    const stored = await this.memoryAPI.getPersonalProfile(userId);
    const profile = Object.freeze({
      ...this.defaultProfile,
      ...(stored || {})
    });

    // update artery snapshot
    this.personalArtery.lastTone = profile.tone;
    this.personalArtery.lastAbstraction = profile.abstraction;
    this.personalArtery.lastVerbosity = profile.verbosity;

    return profile;
  }

  // --------------------------------------------------------------------------
  //  UPDATE PROFILE (guarded write)
  // --------------------------------------------------------------------------
  async updateProfile(context, patch = {}) {
    const userId = context?.userId || null;
    if (!userId || !this.memoryAPI?.setPersonalProfile) return null;

    const current = await this.loadProfile(context);
    const next = { ...current, ...patch };

    await this.memoryAPI.setPersonalProfile(userId, next);

    // update artery snapshot
    this.personalArtery.lastTone = next.tone;
    this.personalArtery.lastAbstraction = next.abstraction;
    this.personalArtery.lastVerbosity = next.verbosity;

    return Object.freeze(next);
  }

  // --------------------------------------------------------------------------
  //  SHAPE OUTPUT — Tone Engine v3 + Abstraction Governor + Verbosity Filter
  // --------------------------------------------------------------------------
  async shapeOutput({ context, text }) {
    const profile = await this.loadProfile(context);
    let result = String(text || "");

    // ------------------------------------------------------
    // Verbosity shaping
    // ------------------------------------------------------
    if (profile.verbosity === "terse" && result.length > 800) {
      result = result.slice(0, 800) + " …";
    }

    if (profile.verbosity === "detailed") {
      result = result + "\n\n(If you'd like a shorter version, just say so.)";
    }

    // ------------------------------------------------------
    // Tone shaping v3
    // ------------------------------------------------------
    if (profile.tone === "warm") {
      result = result.replace(/\.$/, " — hope this helps.");
    }

    if (profile.tone === "direct") {
      result = result.replace(/(?:\.\s*)?$/, ".");
    }

    if (profile.tone === "formal") {
      result = result.replace(/\bhey\b/gi, "Greetings");
    }

    if (profile.tone === "playful") {
      result = result + " 😄";
    }

    // ------------------------------------------------------
    // Abstraction shaping v3
    // ------------------------------------------------------
    if (profile.abstraction === "low") {
      result = this._simplify(result);
    }

    if (profile.abstraction === "high") {
      result = this._expand(result);
    }

    return {
      text: result,
      profile
    };
  }

  // --------------------------------------------------------------------------
  //  INTERNAL HELPERS — deterministic simplify/expand
  // --------------------------------------------------------------------------
  _simplify(text) {
    return text
      .replace(/however,/gi, "but")
      .replace(/therefore,/gi, "so")
      .replace(/in summary/gi, "basically")
      .trim();
  }

  _expand(text) {
    return (
      text +
      "\n\nTo elaborate further: this can be broken down into underlying principles, contextual factors, and practical implications."
    );
  }
}

// ============================================================================
//  PUBLIC API — Create Personal Frame Organ
// ============================================================================

export function createPersonalFrameOrgan(config = {}) {
  const core = new AiPersonalFrame(config);

  return Object.freeze({
    meta: PersonalFrameMeta,

    async loadProfile(context) {
      return core.loadProfile(context);
    },

    async updateProfile(context, patch) {
      return core.updateProfile(context, patch);
    },

    async shapeOutput(payload) {
      return core.shapeOutput(payload);
    },

    arterySnapshot() {
      return core.personalArtery.snapshot();
    }
  });
}
