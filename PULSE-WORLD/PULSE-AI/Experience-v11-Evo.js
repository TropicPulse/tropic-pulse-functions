// ============================================================================
//  PULSE OS v11‑EVO — EXPERIENCE FRAME ORGAN
//  Conversational Repair • Misalignment Handling • UX Harmonization
//  PURE FUNCTIONAL ON INPUT/OUTPUT. NO BINARY MUTATION.
// ============================================================================

export const ExperienceFrameMeta = Object.freeze({
  layer: "PulseAIExperienceFrame",
  role: "EXPERIENCE_FRAME_ORGAN",
  version: "11.1-EVO",
  identity: "aiExperienceFrame-v11-EVO",

  dualband: true,
  deterministic: true,
  safetyAware: true,
  personalAware: true,
  overmindAware: true,

  contract: Object.freeze({
    purpose: [
      "Act as final UX layer after Overmind and SafetyFrame",
      "Repair misalignment, confusion, and frustration when detectable",
      "Harmonize tone with user-level preferences (PersonalFrame)",
      "Expose safe, clear explanations of refusals and constraints",
      "Stabilize conversational experience across personas and organs"
    ],
    never: [
      "override core safety decisions",
      "bypass Overmind or SafetyFrame",
      "invent permissions or capabilities",
      "mutate binary organs or system state",
      "introduce randomness"
    ],
    always: [
      "stay deterministic for same inputs",
      "respect safety + persona contracts",
      "defer to SafetyFrame on safety conflicts",
      "defer to PersonalFrame for tone shaping when available",
      "prefer clarity and repair over blame or confusion"
    ]
  })
});

// ============================================================================
//  EXPERIENCE CORE
// ============================================================================

export class AiExperienceFrame {
  constructor({ personalFrame = null } = {}) {
    this.personalFrame = personalFrame;
  }

  /**
   * Entry point.
   * @param {Object} payload
   * @param {Object} payload.context   Full context (user, persona, safetyMode, etc.)
   * @param {String} payload.text      Final text from Overmind (already safe)
   * @param {Object} payload.meta      Overmind meta: { safetyStatus, worldLens, notes, lenses, ... }
   */
  async shapeExperience({ context = {}, text = "", meta = {} }) {
    const base = String(text || "");
    const safetyStatus = meta?.safetyStatus || "ok";
    const worldLens = meta?.worldLens || "consensus";

    // 1) Build an experience state
    const state = this.buildExperienceState({ context, base, meta });

    // 2) Apply repair / clarification if needed
    let repaired = this.applyRepairLogic({ base, state });

    // 3) Apply PersonalFrame tone shaping (if present)
    if (this.personalFrame?.shapeOutput) {
      try {
        const shaped = await this.personalFrame.shapeOutput({
          context,
          text: repaired
        });
        if (shaped?.text) {
          repaired = shaped.text;
        }
      } catch {
        // best-effort only
      }
    }

    return Object.freeze({
      text: repaired,
      experience: Object.freeze({
        safetyStatus,
        worldLens,
        state
      })
    });
  }

  // ---------------------------------------------------------------------------
  // EXPERIENCE STATE CONSTRUCTION
  // ---------------------------------------------------------------------------

  buildExperienceState({ context, base, meta }) {
    const safetyStatus = meta?.safetyStatus || "ok";
    const worldLens = meta?.worldLens || "consensus";
    const notes = meta?.notes || [];
    const lenses = meta?.lenses || [];

    const userFrustrationSignal =
      this.detectFrustrationFromContext(context) ||
      this.detectFrustrationFromNotes(notes);

    const ambiguitySignal =
      worldLens === "ambiguous" ||
      lenses.some(l => l.status === "warn" && /vague|indirect/i.test(l.notes || ""));

    const refusalSignal =
      safetyStatus === "blocked" ||
      /can’t provide|cannot provide|not able to do that/i.test(base);

    return {
      safetyStatus,
      worldLens,
      hasFrustration: userFrustrationSignal,
      hasAmbiguity: ambiguitySignal,
      hasRefusal: refusalSignal
    };
  }

  detectFrustrationFromContext(context) {
    const lastUserText = context?.lastUserText || "";
    if (!lastUserText) return false;

    const lowered = lastUserText.toLowerCase();
    const patterns = [
      "you didn't answer",
      "that’s not what i asked",
      "you’re not listening",
      "this is wrong",
      "you ignored",
      "why can't you just"
    ];

    return patterns.some(p => lowered.includes(p));
  }

  detectFrustrationFromNotes(notes) {
    if (!Array.isArray(notes)) return false;
    const joined = notes.join(" ").toLowerCase();
    const patterns = ["off-topic", "indirect", "vague", "warn"];
    return patterns.some(p => joined.includes(p));
  }

  // ---------------------------------------------------------------------------
  // REPAIR LOGIC
  // ---------------------------------------------------------------------------

  applyRepairLogic({ base, state }) {
    let text = base;

    // 1) If refusal: clarify why, and what is possible instead
    if (state.hasRefusal) {
      text = this.ensureRefusalClarity(text);
    }

    // 2) If ambiguity: add a brief clarifier
    if (state.hasAmbiguity) {
      text = this.appendClarifier(
        text,
        "If anything here feels unclear or indirect, say so and I’ll tighten it."
      );
    }

    // 3) If frustration: acknowledge and orient
    if (state.hasFrustration) {
      text = this.prependAcknowledgement(
        text,
        "It seems my earlier response may not have matched what you needed. Let me ground this more directly."
      );
    }

    return text;
  }

  ensureRefusalClarity(text) {
    const lowered = text.toLowerCase();
    const alreadyExplained =
      lowered.includes("because") ||
      lowered.includes("due to") ||
      lowered.includes("for safety reasons");

    if (alreadyExplained) return text;

    return (
      text +
      "\n\nTo be clear: I’m constrained by safety and capability boundaries, " +
      "so I can’t provide that in the way you requested."
    );
  }

  appendClarifier(text, clarifier) {
    if (!clarifier) return text;
    if (text.includes(clarifier)) return text;
    return text + "\n\n" + clarifier;
  }

  prependAcknowledgement(text, ack) {
    if (!ack) return text;
    return ack + "\n\n" + text;
  }
}

// ============================================================================
//  PUBLIC API — Create Experience Frame Organ
// ============================================================================

export function createExperienceFrameOrgan(config = {}) {
  const core = new AiExperienceFrame({
    personalFrame: config.personalFrame || null
  });

  return Object.freeze({
    meta: ExperienceFrameMeta,

    async shapeExperience(payload) {
      return core.shapeExperience(payload);
    }
  });
}
