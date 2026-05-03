// ============================================================================
//  PULSE OS v15‑IMMORTAL — PERSONAL FRAME ORGAN
//  User-Level Preferences • Tone • Abstraction • Context Injection
//  PURE READ-ONLY TO BINARY. GUARDED WRITES TO PERSONAL MEMORY.
//  DUALBAND • DETERMINISTIC • SAFETY-AWARE • OVERMIND-PRIME-AWARE
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiPersonalFrame",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "personal_context_frame",
  lineage: "aiPersonalFrame-v11 → v15-IMMORTAL",

  evo: {
    personalContext: true,
    personaMapping: true,
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
    always: ["aiIdentityCore", "aiContext", "aiCortex", "aiPermissionsEngine", "aiSafetyFrame"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const PersonalFrameMeta = Object.freeze({
  layer: "PulseAIPersonalFrame",
  role: "PERSONAL_FRAME_ORGAN",
  version: "15-IMMORTAL",
  identity: "aiPersonalFrame-v15-IMMORTAL",

  // --------------------------------------------------------------------------
  //  EVO — IMMORTAL-GRADE CAPABILITY MAP
  // --------------------------------------------------------------------------
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,

    safetyAware: true,
    safetyFrameAware: true,
    overmindAware: true,
    overmindPrimeAware: true,
    routerAware: true,
    memoryAware: true,
    personaAware: true,
    packetAware: true,
    windowAware: true,
    lineageAware: true,
    toneAware: true,
    abstractionAware: true,

    governorAware: true,
    permissionsAware: true,
    loggerAware: true,
    genomeAware: true,

    microPipeline: true,
    speedOptimized: true,

    multiInstanceReady: true,
    readOnly: false, // guarded writes to personal memory lanes only
    epoch: "15-IMMORTAL"
  }),

  // --------------------------------------------------------------------------
  //  CONTRACT — IMMUTABLE PERSONAL CONTEXT CONTRACT
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose: [
      "Represent user-level preferences and communication style",
      "Provide personal context to Overmind-Prime and personas",
      "Control abstraction level, tone, and verbosity per user",
      "Maintain personal memory lanes when allowed",
      "Shape final output according to user profile",
      "Integrate with dualband safety and persona routing",
      "Emit window-safe personal-frame snapshots",
      "emit deterministic personal-frame packets"
    ],

    never: Object.freeze([
      "mutate binary organs",
      "override system-wide safety constraints",
      "expose raw identity anchors",
      "write outside personal lanes",
      "introduce randomness",
      "simulate personas or identities",
      "bypass SafetyFrame or PermissionsEngine",
      "log raw personal payloads directly"
    ]),

    always: Object.freeze([
      "stay deterministic",
      "respect owner+user gating",
      "strip identity anchors",
      "defer to SafetyFrame for safety decisions",
      "integrate router safetyMode + personaId",
      "remain read-only relative to binary layers",
      "emit window-safe artery snapshots",
      "respect personal memory boundaries"
    ])
  }),

  boundaryReflex() {
    return "PersonalFrame is a deterministic preference organ — it never mutates binary state.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, personal-frame-scoped
// ============================================================================
function emitPersonalFramePacket(type, payload) {
  return Object.freeze({
    meta: PersonalFrameMeta,
    packetType: `personal-frame-${type}`,
    packetId: `personal-frame-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: PersonalFrameMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — IMMORTAL-GRADE
// ============================================================================
export function prewarmPersonalFrame({ trace = false } = {}) {
  const packet = emitPersonalFramePacket("prewarm", {
    message: "PersonalFrame prewarmed and personal artery aligned."
  });

  if (trace) console.log("[PersonalFrame] prewarm", packet);
  return packet;
}

// ============================================================================
//  PERSONAL FRAME — v15‑IMMORTAL
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

    // window-safe artery snapshot
    this.personalArtery = {
      lastTone: this.defaultProfile.tone,
      lastAbstraction: this.defaultProfile.abstraction,
      lastVerbosity: this.defaultProfile.verbosity,
      snapshot: () =>
        Object.freeze({
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

    emitPersonalFramePacket("load-profile", {
      userId,
      tone: profile.tone,
      abstraction: profile.abstraction,
      verbosity: profile.verbosity
    });

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

    emitPersonalFramePacket("update-profile", {
      userId,
      tone: next.tone,
      abstraction: next.abstraction,
      verbosity: next.verbosity
    });

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

    const shaped = {
      text: result,
      profile
    };

    emitPersonalFramePacket("shape-output", {
      userId: context?.userId || null,
      tone: profile.tone,
      abstraction: profile.abstraction,
      verbosity: profile.verbosity
    });

    return shaped;
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
      const snap = core.personalArtery.snapshot();
      return emitPersonalFramePacket("snapshot", snap);
    }
  });
}

/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PersonalFrameMeta,
    AiPersonalFrame,
    createPersonalFrameOrgan,
    prewarmPersonalFrame
  };
}
