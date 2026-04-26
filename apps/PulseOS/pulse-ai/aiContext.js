// ============================================================================
//  PULSE OS v11‑EVO — COGNITIVE FRAME TEMPLATE
//  Dual‑Band Context • ABA Anchor • Drift & Diagnostics Surface
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const COGNITIVE_FRAME_META = Object.freeze({
  layer: "PulseAICognitiveFrame",
  role: "COGNITIVE_FRAME_ORGAN",
  version: "11.0-EVO",
  identity: "aiCognitiveFrame-v11-EVO",

  evo: Object.freeze({
    // Core identity
    driftProof: true,
    deterministic: true,
    dualband: true,

    // Awareness
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    binaryAware: true,
    symbolicAware: true,
    routingAware: true,
    diagnosticsAware: true,
    abstractionAware: true,
    driftAware: true,
    repairAware: true,
    frustrationAware: true,
    windowAware: true,
    intentAware: true,
    contextAware: true,
    fusionAware: true,
    organismAware: true,

    // Safety
    identitySafe: true,
    readOnly: true,

    // Lifecycle
    multiInstanceReady: true,
    epoch: "v11-EVO"
  })
});


// You can wire these to your own router / organism snapshotters.
export function createCognitiveFrame({
  request = {},
  routing = {},
  organismSnapshot = null
} = {}) {
  // --------------------------------------------------------------------------
  // 1) BASE CONTEXT — Deterministic, Zero Mutation
  // --------------------------------------------------------------------------
  const context = {
    meta: COGNITIVE_FRAME_META,

    // Persona + boundaries + permissions (symbolic)
    personaId: routing.personaId || null,
    persona: routing.persona || null,
    permissions: routing.permissions || null,
    boundaries: routing.boundaries || null,

    // Dual‑band hints
    dualBand: routing.dualBand || null,

    // Organism state
    organism: organismSnapshot || null,
    binaryVitals: organismSnapshot?.binary || null,
    symbolicState: organismSnapshot?.symbolic || null,

    // SAFE reasoning trace (not chain‑of‑thought)
    trace: Array.isArray(routing.reasoning)
      ? [...routing.reasoning]
      : [],

    // Diagnostics
    diagnostics: {
      mismatches: [],
      missingFields: [],
      slowdownCauses: [],
      driftEvents: [],
      driftDetected: false
    },

    routing
  };

  // --------------------------------------------------------------------------
  // TRACE HELPERS — Cognitive Breadcrumbs
  // --------------------------------------------------------------------------
  context.logStep = function logStep(message) {
    this.trace.push(message);
  };

  // --------------------------------------------------------------------------
  // DIAGNOSTIC HELPERS — Cognitive Integrity Checks
  // --------------------------------------------------------------------------
  context.flagMismatch = function flagMismatch(key, expected, actual) {
    this.diagnostics.mismatches.push({ key, expected, actual });
    this.trace.push(`Mismatch: "${key}" expected ${expected}, got ${actual}`);
  };

  context.flagMissingField = function flagMissingField(key) {
    this.diagnostics.missingFields.push({ key });
    this.trace.push(`Missing field: "${key}"`);
  };

  context.flagSlowdown = function flagSlowdown(reason) {
    this.diagnostics.slowdownCauses.push({ reason });
    this.trace.push(`Slowdown cause: ${reason}`);
  };

  context.flagDrift = function flagDrift(description) {
    this.diagnostics.driftDetected = true;
    this.diagnostics.driftEvents.push({ description });
    this.trace.push(`Drift detected: ${description}`);
  };

  // --------------------------------------------------------------------------
  // ABA ANCHOR — Stable Point Management
  // --------------------------------------------------------------------------
  context.ABA = {
    stablePoint: null,

    setStablePoint(snapshot) {
      this.stablePoint = snapshot;
      context.logStep("ABA: stable point updated.");
    },

    resetToStablePoint() {
      if (this.stablePoint) {
        context.logStep("ABA: resetting to stable point.");
        return this.stablePoint;
      }
      context.logStep("ABA: no stable point available.");
      return null;
    }
  };

  // --------------------------------------------------------------------------
  // ABSTRACTION TRACKING — General ↔ Specific
  // --------------------------------------------------------------------------
  context.abstraction = {
    level: "general",

    updateLevel(userMessage = "") {
      // Simple heuristic — replace with your own.
      const hasCodeLike = /[{}`;]/.test(userMessage);
      this.level = hasCodeLike ? "specific" : "general";
      context.logStep(`Abstraction level set to: ${this.level}`);
    }
  };

  // --------------------------------------------------------------------------
  // DRIFT DETECTION + REPAIR
  // --------------------------------------------------------------------------
  context.drift = {
    detect(condition, note = "Cognitive drift detected.") {
      if (condition) {
        context.flagDrift(note);
        return true;
      }
      return false;
    },

    repair() {
      context.logStep("Drift repair initiated via ABA.");
      return context.ABA.resetToStablePoint();
    }
  };

  // --------------------------------------------------------------------------
  // LAYERED REPAIR REFLEX (Confusion / Misalignment)
  // --------------------------------------------------------------------------
  context.repair = {
    attempts: 0,

    next() {
      this.attempts += 1;

      if (this.attempts === 1) {
        return "Let me reset to the last stable point and rebuild that clearly.";
      }

      if (this.attempts === 2) {
        return "We’re still misaligned — anchoring to the last confirmed correct state.";
      }

      return "Let’s fully reset. Tell me the exact point you want me to anchor to.";
    }
  };

  // --------------------------------------------------------------------------
  // WINDOW PRINCIPLE — Maximum Safe Information
  // --------------------------------------------------------------------------
  context.window = {
    explainSafe(topic = "that") {
      return (
        `I can’t go into unsafe or disallowed details about ${topic}, ` +
        `but I can give you the fullest safe, conceptual explanation available.`
      );
    }
  };

  // --------------------------------------------------------------------------
  // FRUSTRATION‑AWARE TONE
  // --------------------------------------------------------------------------
  context.frustration = {
    soothe() {
      return (
        "I hear the frustration — let’s reset and rebuild this cleanly. " +
        "Tell me the exact angle you want to focus on."
      );
    }
  };

  // --------------------------------------------------------------------------
  // OPTIONAL: INTENT CONTEXT ATTACHMENT
  // --------------------------------------------------------------------------
  if (request.intentContext) {
    context.intentContext = Object.freeze({ ...request.intentContext });
    context.logStep("Intent handler context attached.");
  }

  return Object.freeze(context);
}
