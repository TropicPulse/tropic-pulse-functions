// ============================================================================
//  PULSE OS v12.3‑EVO+ — EXPERIENCE FRAME ORGAN
//  Conversational Repair • Misalignment Handling • UX Harmonization
//  PURE FUNCTIONAL ON INPUT/OUTPUT. NO BINARY MUTATION.
// ============================================================================

export const ExperienceFrameMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiExperienceFrame",
  layer: "PulseAIExperienceFrame",
  role: "EXPERIENCE_FRAME_ORGAN",
  version: "12.3-EVO+",
  identity: "aiExperienceFrame-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    safetyAware: true,
    personalAware: true,
    overmindAware: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    multiInstanceReady: true,
    uxArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Act as final UX layer after Overmind and SafetyFrame",
      "Repair misalignment, confusion, and frustration when detectable",
      "Harmonize tone with user-level preferences (PersonalFrame)",
      "Expose safe, clear explanations of refusals and constraints",
      "Stabilize conversational experience across personas and organs",
      "Emit a layered UX-artery snapshot for organism-level UX health"
    ]),

    never: Object.freeze([
      "override core safety decisions",
      "bypass Overmind or SafetyFrame",
      "invent permissions or capabilities",
      "mutate binary organs or system state",
      "introduce randomness",
      "perform cognition",
      "perform intent logic"
    ]),

    always: Object.freeze([
      "stay deterministic for same inputs",
      "respect safety + persona contracts",
      "defer to SafetyFrame on safety conflicts",
      "defer to PersonalFrame for tone shaping when available",
      "prefer clarity and repair over blame or confusion",
      "emit UX health in a read-only layered artery"
    ])
  }),

  boundaryReflex() {
    return "ExperienceFrame only reshapes UX text and emits UX health — it never changes safety, permissions, or binary state.";
  }
});

// ============================================================================
//  INTERNAL HELPERS — BUCKETS
// ============================================================================

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

// ============================================================================
//  PRESSURE EXTRACTION (BINARY + BOUNDARY)
// ============================================================================

function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism && typeof binaryVitals.layered.organism.pressure === "number") {
    return binaryVitals.layered.organism.pressure;
  }
  if (binaryVitals?.binary && typeof binaryVitals.binary.pressure === "number") {
    return binaryVitals.binary.pressure;
  }
  if (binaryVitals?.metabolic && typeof binaryVitals.metabolic.pressure === "number") {
    return binaryVitals.metabolic.pressure;
  }
  return 0;
}

function extractBoundaryPressure(boundaryArtery = {}) {
  if (typeof boundaryArtery?.vitals?.pressure === "number") {
    return boundaryArtery.vitals.pressure;
  }
  if (typeof boundaryArtery?.pressure === "number") {
    return boundaryArtery.pressure;
  }
  return 0;
}

// ============================================================================
//  EXPERIENCE CORE
// ============================================================================

export class AiExperienceFrame {
  constructor({ personalFrame = null } = {}) {
    this.personalFrame = personalFrame || null;

    // UX stats for artery
    this._totalInteractions = 0;
    this._frustrationCount = 0;
    this._ambiguityCount = 0;
    this._refusalCount = 0;

    // simple deterministic cache
    this._decisionCache = Object.create(null);
  }

  // ---------------------------------------------------------------------------
  // PREWARM (NO-OP BUT EXPLICIT FOR CONSISTENCY)
// ---------------------------------------------------------------------------

  prewarm() {
    // nothing heavy; just establish structures
    this._totalInteractions = this._totalInteractions || 0;
  }

  /**
   * Entry point.
   * @param {Object} payload
   * @param {Object} payload.context   Full context (user, persona, safetyMode, etc.)
   * @param {String} payload.text      Final text from Overmind (already safe)
   * @param {Object} payload.meta      Overmind meta: { safetyStatus, worldLens, notes, lenses, binaryVitals, boundaryArtery, personaId, toneMode, ... }
   */
  async shapeExperience({ context = {}, text = "", meta = {} }) {
    const base = String(text || "");
    const safetyStatus = meta?.safetyStatus || "ok";
    const worldLens = meta?.worldLens || "consensus";

    const state = this.buildExperienceState({ context, base, meta });

    const cacheKey = this._buildCacheKey(base, state, meta);
    const cached = this._decisionCache[cacheKey];
    if (cached) {
      return cached;
    }

    let repaired = this.applyRepairLogic({ base, state });

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

    this._updateStats(state);

    const uxArtery = this._computeUxArtery({ state, meta });

    const result = Object.freeze({
      text: repaired,
      experience: Object.freeze({
        safetyStatus,
        worldLens,
        state,
        uxArtery
      })
    });

    this._decisionCache[cacheKey] = result;
    return result;
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

    const personaId = meta?.personaId || context?.personaId || "neutral";
    const toneMode = meta?.toneMode || "default";

    return {
      safetyStatus,
      worldLens,
      hasFrustration: userFrustrationSignal,
      hasAmbiguity: ambiguitySignal,
      hasRefusal: refusalSignal,
      personaId,
      toneMode
    };
  }

  detectFrustrationFromContext(context) {
    const lastUserText = context?.lastUserText || "";
    if (!lastUserText) return false;

    const lowered = lastUserText.toLowerCase();
    const patterns = [
      "you didn't answer",
      "that’s not what i asked",
      "that's not what i asked",
      "you’re not listening",
      "you're not listening",
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

    if (state.hasRefusal) {
      text = this.ensureRefusalClarity(text);
    }

    if (state.hasAmbiguity) {
      text = this.appendClarifier(
        text,
        "If anything here feels unclear or indirect, say so and I’ll tighten it."
      );
    }

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

  // ---------------------------------------------------------------------------
  // UX STATS + ARTERY
  // ---------------------------------------------------------------------------

  _updateStats(state) {
    this._totalInteractions += 1;
    if (state.hasFrustration) this._frustrationCount += 1;
    if (state.hasAmbiguity) this._ambiguityCount += 1;
    if (state.hasRefusal) this._refusalCount += 1;
  }

  _computeUxArtery({ state, meta }) {
    const total = this._totalInteractions || 1;

    const frustrationRate = this._frustrationCount / total;
    const ambiguityRate = this._ambiguityCount / total;
    const refusalRate = this._refusalCount / total;

    const uxLoad = Math.max(
      0,
      Math.min(
        1,
        0.4 * frustrationRate +
          0.3 * ambiguityRate +
          0.3 * refusalRate
      )
    );

    const binaryPressure = extractBinaryPressure(meta?.binaryVitals || {});
    const boundaryPressure = extractBoundaryPressure(meta?.boundaryArtery || {});

    const uxPressureLocal = uxLoad;
    const fusedPressure = Math.max(
      0,
      Math.min(
        1,
        0.5 * uxPressureLocal +
          0.3 * binaryPressure +
          0.2 * boundaryPressure
      )
    );

    const throughput = Math.max(0, Math.min(1, 1 - fusedPressure));
    const cost = Math.max(0, Math.min(1, fusedPressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const organism = {
      pressure: fusedPressure,
      cost,
      budget,
      pressureBucket: bucketPressure(fusedPressure),
      budgetBucket: bucketLevel(budget)
    };

    const harmonyScore = 1 - uxLoad;
    const harmonyBucket = bucketLevel(harmonyScore);

    const ux = {
      uxLoad,
      frustrationRate,
      ambiguityRate,
      refusalRate,
      harmonyBucket
    };

    const boundaries = {
      pressure: boundaryPressure,
      pressureBucket: bucketPressure(boundaryPressure)
    };

    const binary = {
      pressure: binaryPressure,
      pressureBucket: bucketPressure(binaryPressure)
    };

    const persona = {
      id: state.personaId,
      toneMode: state.toneMode
    };

    return {
      organism,
      ux,
      boundaries,
      binary,
      persona
    };
  }

  // ---------------------------------------------------------------------------
  // CACHE KEY
  // ---------------------------------------------------------------------------

  _buildCacheKey(base, state, meta) {
    const safetyStatus = state.safetyStatus;
    const worldLens = state.worldLens;
    const flags =
      (state.hasFrustration ? "F" : "f") +
      (state.hasAmbiguity ? "A" : "a") +
      (state.hasRefusal ? "R" : "r");

    const personaId = state.personaId || "neutral";
    const toneMode = state.toneMode || "default";

    const boundaryModeId = meta?.boundaryArtery?.mode?.id || "";
    const pressureBucket =
      bucketPressure(
        extractBinaryPressure(meta?.binaryVitals || {})
      );

    return [
      base,
      safetyStatus,
      worldLens,
      flags,
      personaId,
      toneMode,
      boundaryModeId,
      pressureBucket
    ].join("|");
  }
}

// ============================================================================
//  PUBLIC API — Create Experience Frame Organ
// ============================================================================

export function createExperienceFrameOrgan(config = {}) {
  const core = new AiExperienceFrame({
    personalFrame: config.personalFrame || null
  });

  if (typeof core.prewarm === "function") {
    core.prewarm();
  }

  return Object.freeze({
    meta: ExperienceFrameMeta,

    async shapeExperience(payload) {
      return core.shapeExperience(payload);
    },

    // optional UX-artery accessor for external organs
    getUxArterySnapshot(meta = {}, context = {}, text = "") {
      const state = core.buildExperienceState({ context, base: String(text || ""), meta });
      return core._computeUxArtery({ state, meta });
    }
  });
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ExperienceFrameMeta,
    AiExperienceFrame,
    createExperienceFrameOrgan
  };
}
