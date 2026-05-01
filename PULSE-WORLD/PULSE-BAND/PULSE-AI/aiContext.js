// ============================================================================
//  PULSE OS v12.3‑Presence — COGNITIVE FRAME ORGAN
//  Dual‑Band Context • ABA Anchor • Drift & Diagnostics Surface
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const COGNITIVE_FRAME_META = Object.freeze({
  layer: "PulseAICognitiveFrame",
  role: "COGNITIVE_FRAME_ORGAN",
  version: "12.3-Presence",
  identity: "aiCognitiveFrame-v12.3-Presence",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

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
    safetyFrameAware: true,
    experienceFrameAware: true,
    overmindAware: true,

    identitySafe: true,
    readOnly: true,

    multiInstanceReady: true,
    epoch: "12.3-Presence"
  }),

  presence: Object.freeze({
    organId: "CognitiveFrame",
    organKind: "Context",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "frame:created",
        "diagnostic:mismatch",
        "diagnostic:missingField",
        "diagnostic:slowdown",
        "diagnostic:drift",
        "ABA:setStablePoint",
        "ABA:resetToStablePoint",
        "abstraction:updateLevel",
        "repair:next",
        "window:explainSafe",
        "frustration:soothe"
      ]
    }
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, frame-scoped
// ============================================================================
function emitCognitiveFramePacket(type, payload) {
  return Object.freeze({
    meta: COGNITIVE_FRAME_META,
    packetType: `cognitive-frame-${type}`,
    timestamp: Date.now(),
    epoch: COGNITIVE_FRAME_META.evo.epoch,
    layer: COGNITIVE_FRAME_META.layer,
    role: COGNITIVE_FRAME_META.role,
    identity: COGNITIVE_FRAME_META.identity,
    ...payload
  });
}

// ============================================================================
//  COGNITIVE FRAME PREWARM ENGINE — v12.3‑Presence
// ============================================================================
export function prewarmCognitiveFrame() {
  try {
    const warmRequest = {
      intent: "prewarm",
      domain: "system",
      action: "init",
      userId: "prewarm-user"
    };

    const warmRouting = {
      personaId: "ARCHITECT",
      persona: { id: "ARCHITECT" },
      permissions: { allow: true },
      boundaries: { mode: "safe" },
      dualBand: true,
      reasoning: ["prewarm"],
      flags: { stable: true }
    };

    const warmOrganism = {
      binary: { throughput: 1, pressure: 0, cost: 0, budget: 1 },
      symbolic: { state: "prewarm" }
    };

    const frame = createCognitiveFrame({
      request: warmRequest,
      routing: warmRouting,
      organismSnapshot: warmOrganism
    });

    frame.flagMismatch?.("test", "expected", "actual");
    frame.flagMissingField?.("missingField");
    frame.flagSlowdown?.("prewarm");
    frame.flagDrift?.("prewarm drift");

    frame.ABA.setStablePoint?.({ snapshot: "prewarm" });
    frame.ABA.resetToStablePoint?.();

    frame.abstraction.updateLevel?.("prewarm");

    frame.repair.next?.();
    frame.repair.next?.();

    frame.window.explainSafe?.("prewarm");

    frame.frustration.soothe?.();

    return emitCognitiveFramePacket("prewarm", {
      message: "Cognitive frame prewarmed and context pathways aligned."
    });
  } catch (err) {
    console.error("[CognitiveFrame Prewarm] Failed:", err);
    return emitCognitiveFramePacket("prewarm-error", {
      error: String(err),
      message: "Cognitive frame prewarm failed."
    });
  }
}

// ============================================================================
//  createCognitiveFrame — Self‑Contained Cognitive Context
// ============================================================================

export function createCognitiveFrame(options = {}) {
  prewarmCognitiveFrame();   // ← PREWARM HERE

  const { request = {}, routing = {}, organismSnapshot = null } = options;

  const context = {
    meta: COGNITIVE_FRAME_META,

    request: Object.freeze({
      intent: request.intent || null,
      domain: request.domain || null,
      action: request.action || null,
      userId: request.userId || null
    }),

    personaId: routing.personaId || null,
    persona: routing.persona || null,
    permissions: routing.permissions || null,
    boundaries: routing.boundaries || null,

    dualBand: routing.dualBand || null,

    organism: organismSnapshot || null,
    binaryVitals: organismSnapshot?.binary || null,
    symbolicState: organismSnapshot?.symbolic || null,

    trace: Array.isArray(routing.reasoning) ? [...routing.reasoning] : [],

    diagnostics: {
      mismatches: [],
      missingFields: [],
      slowdownCauses: [],
      driftEvents: [],
      driftDetected: false
    },

    routing
  };

  // TRACE HELPERS
  context.logStep = function logStep(message) {
    this.trace.push(String(message || ""));
  };

  // DIAGNOSTIC HELPERS
  context.flagMismatch = function (key, expected, actual) {
    this.diagnostics.mismatches.push({ key, expected, actual });
    this.trace.push(`Mismatch: "${key}" expected ${expected}, got ${actual}`);
    this.logStep && this.logStep("diagnostic:mismatch");
  };

  context.flagMissingField = function (key) {
    this.diagnostics.missingFields.push({ key });
    this.trace.push(`Missing field: "${key}"`);
    this.logStep && this.logStep("diagnostic:missingField");
  };

  context.flagSlowdown = function (reason) {
    this.diagnostics.slowdownCauses.push({ reason });
    this.trace.push(`Slowdown cause: ${reason}`);
    this.logStep && this.logStep("diagnostic:slowdown");
  };

  context.flagDrift = function (description) {
    this.diagnostics.driftDetected = true;
    this.diagnostics.driftEvents.push({ description });
    this.trace.push(`Drift detected: ${description}`);
    this.logStep && this.logStep("diagnostic:drift");
  };

  // ABA ANCHOR
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

  // ABSTRACTION TRACKING
  context.abstraction = {
    level: "general",

    updateLevel(userMessage = "") {
      const hasCodeLike = /[{}`;]/.test(userMessage || "");
      this.level = hasCodeLike ? "specific" : "general";
      context.logStep(`Abstraction level set to: ${this.level}`);
    }
  };

  // DRIFT DETECTION + REPAIR
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

  // LAYERED REPAIR REFLEX
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

  // WINDOW PRINCIPLE
  context.window = {
    explainSafe(topic = "that") {
      return (
        `I can’t go into unsafe or disallowed details about ${topic}, ` +
        `but I can give you the fullest safe, conceptual explanation available.`
      );
    }
  };

  // FRUSTRATION‑AWARE TONE
  context.frustration = {
    soothe() {
      return (
        "I hear the frustration — let’s reset and rebuild this cleanly. " +
        "Tell me the exact angle you want to focus on."
      );
    }
  };

  // OPTIONAL INTENT CONTEXT
  if (request.intentContext) {
    context.intentContext = Object.freeze({ ...request.intentContext });
    context.logStep("Intent handler context attached.");
  }

  const frozen = Object.freeze(context);

  // final trace marker
  frozen.logStep("frame:created");

  return frozen;
}

export default createCognitiveFrame;

// ============================================================================
//  COMMONJS FALLBACK EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    COGNITIVE_FRAME_META,
    createCognitiveFrame,
    default: createCognitiveFrame,
    prewarmCognitiveFrame
  };
}
