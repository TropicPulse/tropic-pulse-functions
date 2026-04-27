// ============================================================================
//  PULSE OS v11.2‑EVO+ — PERSONAL FRAME ORGAN
//  User-Level Preferences • Tone • Abstraction • Context Injection
//  PURE READ-ONLY TO BINARY. GUARDED WRITES TO PERSONAL MEMORY.
//  DUALBAND • DETERMINISTIC • SAFETY-AWARE • OVERMIND-AWARE
// ============================================================================

export const PersonalFrameMeta = Object.freeze({
  layer: "PulseAIPersonalFrame",
  role: "PERSONAL_FRAME_ORGAN",
  version: "11.2-EVO+",
  identity: "aiPersonalFrame-v11.2-EVO+",

  dualband: true,
  binaryAware: true,
  deterministic: true,
  safetyAware: true,
  overmindAware: true,
  routerAware: true,
  memoryAware: true,
  personaAware: true,
  driftProof: true,

  contract: Object.freeze({
    purpose: Object.freeze([
      "Represent user-level preferences and communication style",
      "Provide personal context to aiOvermind and personas",
      "Control abstraction level, tone, and verbosity per user",
      "Maintain personal memory lanes when allowed",
      "Shape final output according to user profile",
      "Integrate with dualband safety and persona routing"
    ]),

    never: Object.freeze([
      "mutate binary organs",
      "override system-wide safety constraints",
      "expose raw identity anchors",
      "write outside personal lanes",
      "introduce randomness",
      "simulate personas or identities"
    ]),

    always: Object.freeze([
      "stay deterministic",
      "respect owner+user gating",
      "strip identity anchors",
      "defer to aiSafetyFrame for safety decisions",
      "integrate router safetyMode + personaId",
      "remain read-only relative to binary layers"
    ])
  })
});

// ============================================================================
//  CORE PERSONAL FRAME
// ============================================================================

export class AiPersonalFrame {
  constructor({ memoryAPI, defaultProfile = {} } = {}) {
    this.memoryAPI = memoryAPI || null;

    this.defaultProfile = Object.freeze({
      tone: "neutral",          // neutral | warm | direct | formal | playful
      abstraction: "medium",    // low | medium | high
      verbosity: "normal",      // terse | normal | detailed
      safetyMode: "standard",   // standard | strict | relaxed (if allowed)
      personaBias: null,        // optional: prefer certain persona tones
      ...defaultProfile
    });
  }

  // Load personal profile for a given user/context
  async loadProfile(context) {
    const userId = context?.userId || null;
    if (!userId || !this.memoryAPI?.getPersonalProfile) {
      return this.defaultProfile;
    }

    const stored = await this.memoryAPI.getPersonalProfile(userId);
    return Object.freeze({
      ...this.defaultProfile,
      ...(stored || {})
    });
  }

  // Optionally update personal profile (if allowed)
  async updateProfile(context, patch = {}) {
    const userId = context?.userId || null;
    if (!userId || !this.memoryAPI?.setPersonalProfile) return null;

    const current = await this.loadProfile(context);
    const next = { ...current, ...patch };

    await this.memoryAPI.setPersonalProfile(userId, next);
    return Object.freeze(next);
  }

  // Shape output according to personal profile
  async shapeOutput({ context, text }) {
    const profile = await this.loadProfile(context);
    let result = String(text || "");

    // Verbosity shaping
    if (profile.verbosity === "terse" && result.length > 1200) {
      result = result.slice(0, 1200) + " …";
    }

    // Tone shaping (v1 minimal)
    if (profile.tone === "warm") {
      result = result.replace(/\.$/, " — hope this helps.");
    }

    if (profile.tone === "direct") {
      result = result.replace(/(?:\.\s*)?$/, ".");
    }

    // Abstraction shaping (v1 stub)
    // low = simplify
    // high = expand
    // medium = unchanged

    return {
      text: result,
      profile
    };
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
    }
  });
}
