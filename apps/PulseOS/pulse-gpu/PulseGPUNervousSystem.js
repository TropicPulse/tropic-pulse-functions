// ============================================================================
//  PULSE GPU SESSION TRACER v11-Evo-binary — THE SENSORY ARCHIVE
//  Afferent Nervous System • Deterministic Perception Layer • Pure Recording
// ============================================================================
//
// IDENTITY — THE SENSORY ARCHIVE (v11-Evo-binary):
//  ----------------------------------------------
//  • The afferent nervous system of the GPU organism.
//  • Records every sensation: duration, warnings, errors, stutters, load.
//  • Records binary/symbolic mode, dispatch lineage, shape signatures.
//  • Never judges, never interprets — only perceives and preserves.
//  • The black box of the GPU body.
//  • The raw sensory feed for Insights, Brainstem, Healer, Advisor, GeneticMemory.
//  • Advantage‑cascade aware: inherits all systemic advantages.
//  • PulseSend‑v11‑ready: sensory traces can be routed by the compute router.
//  • Earn‑v3‑ready: compatible with Earn‑v3 job payloads.
//
// SAFETY CONTRACT (v11-Evo-binary):
//  --------------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: invalid steps → normalized safely
//  • Self-repair-ready: traces include metadata
//  • Deterministic: same steps → same trace
// ============================================================================


// ------------------------------------------------------------
// ⭐ OS‑v11-Evo-binary CONTEXT METADATA — Sensory Archive Identity
// ------------------------------------------------------------
const TRACER_CONTEXT = {
  layer: "PulseGPUSessionTracer",
  role: "SENSORY_ARCHIVE",
  purpose: "Afferent nervous system — deterministic perception + recording",
  context:
    "Records ordered steps with durations + health signals + GPU mode/dispatch info",
  target: "full-gpu+binary",
  selfRepairable: true,
  version: "11.0-Evo-binary",

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    // v11-Evo-binary awareness
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,

    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v11-Evo",
    binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
    earnCompatibility: "Earn-v3",

    // Legacy compatibility (metadata only)
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};


// ------------------------------------------------------------
// Utility: clamp helpers
// ------------------------------------------------------------
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}


// ------------------------------------------------------------
// Step normalization — Sensory Input Normalization (v11-Evo-binary)
// ------------------------------------------------------------
function normalizeStep(step = {}) {
  const {
    stepId = "unknown-step",
    label = "",
    durationMs = 0,
    warnings = 0,
    errors = 0,
    stutters = 0,

    gpuLoad,
    cpuLoad,
    vramUsageMB,

    // v11-Evo-binary sensory fields
    binaryModeObserved,
    symbolicModeObserved,
    gpuPattern,
    gpuShapeSignature,
    gpuEvolutionStage,
    gpuModeBias,
    gpuDispatchProfile,
    pressureSnapshot,
    factoringSnapshot
  } = step;

  return {
    stepId: String(stepId),
    label: label ? String(label) : "",
    durationMs: clamp(durationMs, 0, 60 * 60 * 1000),
    warnings: clamp(warnings, 0, 100000),
    errors: clamp(errors, 0, 100000),
    stutters: clamp(stutters, 0, 100000),

    gpuLoad:
      typeof gpuLoad === "number" ? clamp(gpuLoad, 0, 100) : undefined,
    cpuLoad:
      typeof cpuLoad === "number" ? clamp(cpuLoad, 0, 100) : undefined,
    vramUsageMB:
      typeof vramUsageMB === "number"
        ? clamp(vramUsageMB, 0, 4_000_000)
        : undefined,

    // v11-Evo-binary sensory fields (pure recording)
    binaryModeObserved:
      typeof binaryModeObserved === "boolean" ? binaryModeObserved : false,
    symbolicModeObserved:
      typeof symbolicModeObserved === "boolean" ? symbolicModeObserved : false,

    gpuPattern: gpuPattern || null,
    gpuShapeSignature: gpuShapeSignature || null,
    gpuEvolutionStage: gpuEvolutionStage || null,
    gpuModeBias: gpuModeBias || null,
    gpuDispatchProfile: gpuDispatchProfile || null,

    pressureSnapshot:
      pressureSnapshot && typeof pressureSnapshot === "object"
        ? { ...pressureSnapshot }
        : null,

    factoringSnapshot:
      factoringSnapshot && typeof factoringSnapshot === "object"
        ? { ...factoringSnapshot }
        : null,

    meta: { ...TRACER_CONTEXT }
  };
}


// ------------------------------------------------------------
// SessionTrace — Sensory Recording Unit (v11-Evo-binary)
// ------------------------------------------------------------
class SessionTrace {
  constructor({
    sessionId,
    gameProfile,
    hardwareProfile,
    tierProfile,
    gpuContext
  }) {
    this.sessionId = String(sessionId || "unknown-session");
    this.gameProfile = gameProfile || {};
    this.hardwareProfile = hardwareProfile || {};
    this.tierProfile = tierProfile || {};

    // v11-Evo-binary: session-level GPU context snapshot
    this.gpuContext = gpuContext || null;

    this.steps = [];
    this.meta = { ...TRACER_CONTEXT };
  }

  addStep(step) {
    const normalized = normalizeStep(step);
    this.steps.push(normalized);
  }

  getSummary() {
    let totalDuration = 0;
    let totalWarnings = 0;
    let totalErrors = 0;
    let totalStutters = 0;
    let binarySteps = 0;
    let symbolicSteps = 0;

    this.steps.forEach((s) => {
      totalDuration += s.durationMs;
      totalWarnings += s.warnings;
      totalErrors += s.errors;
      totalStutters += s.stutters;

      if (s.binaryModeObserved) binarySteps += 1;
      if (s.symbolicModeObserved) symbolicSteps += 1;
    });

    return {
      sessionId: this.sessionId,
      totalDurationMs: totalDuration,
      totalWarnings,
      totalErrors,
      totalStutters,
      stepCount: this.steps.length,

      // v11-Evo-binary: mode counts for GeneticMemory / Insights
      binaryStepCount: binarySteps,
      symbolicStepCount: symbolicSteps,

      // session-level GPU context
      gpuContext: this.gpuContext,

      meta: { ...TRACER_CONTEXT }
    };
  }
}


// ------------------------------------------------------------
// PulseGPUSessionTracer — Sensory Archive Controller (v11-Evo-binary)
// ------------------------------------------------------------
class PulseGPUSessionTracer {
  constructor() {
    this.sessions = new Map();
    this.meta = { ...TRACER_CONTEXT };
  }

  startSession({
    sessionId,
    gameProfile,
    hardwareProfile,
    tierProfile,
    gpuContext
  }) {
    const id = String(sessionId || "unknown-session");

    const trace = new SessionTrace({
      sessionId: id,
      gameProfile: gameProfile || {},
      hardwareProfile: hardwareProfile || {},
      tierProfile: tierProfile || {},
      gpuContext: gpuContext || null
    });

    this.sessions.set(id, trace);
    return trace;
  }

  recordStep(sessionId, step) {
    const id = String(sessionId || "unknown-session");
    const trace = this.sessions.get(id);

    if (!trace) return null;

    trace.addStep(step || {});
    return trace;
  }

  endSession(sessionId) {
    const id = String(sessionId || "unknown-session");
    const trace = this.sessions.get(id);

    if (!trace) return null;

    this.sessions.delete(id);
    return trace;
  }

  getSessionTrace(sessionId) {
    const id = String(sessionId || "unknown-session");
    return this.sessions.get(id) || null;
  }

  clearSession(sessionId) {
    const id = String(sessionId || "unknown-session");
    this.sessions.delete(id);
  }

  clearAllSessions() {
    this.sessions.clear();
  }
}


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseGPUSessionTracer,
  SessionTrace,
  normalizeStep
};
