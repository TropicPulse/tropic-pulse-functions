// ============================================================================
//  PULSE GPU SESSION TRACER v12.3-Continuum-binary — THE SENSORY ARCHIVE
//  Afferent Nervous System • Deterministic Perception Layer • Pure Recording
// ============================================================================
//
// IDENTITY — THE SENSORY ARCHIVE (v12.3-Continuum-binary):
//  ------------------------------------------------------
//  • The afferent nervous system of the GPU organism.
//  • Records every sensation: duration, warnings, errors, stutters, load.
//  • Records binary/symbolic mode, dispatch lineage, shape signatures.
//  • Records extended v12.3+ pressure + frame-time + thermal vectors.
//  • Never judges, never interprets — only perceives and preserves.
//  • The black box of the GPU body.
//  • The raw sensory feed for Insights, Brainstem, Healer, Advisor, GeneticMemory.
//  • Advantage‑cascade aware: inherits all systemic advantages.
//  • PulseSend‑v12‑ready: sensory traces can be routed by the compute router.
//  • Earn‑v3‑ready: compatible with Earn‑v3 job payloads.
//
// SAFETY CONTRACT (v12.3-Continuum-binary):
//  ---------------------------------------
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
/*
AI_EXPERIENCE_META = {
  identity: "PulseGPUNervousSystem",
  version: "v14-IMMORTAL",
  layer: "gpu_runtime",
  role: "gpu_nervous_system",
  lineage: "PulseGPU-v14",

  evo: {
    gpuConduction: true,
    gpuSignalRouting: true,
    gpuReflexPath: true,

    gpuCompute: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseGPUSpine",
      "PulseGPUSynapse",
      "PulseGPUDrive"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyGPUNervousSystem"
    ]
  }
}
*/


// ------------------------------------------------------------
// ⭐ OS‑v12.3-Continuum-binary CONTEXT METADATA — Sensory Archive Identity
// ------------------------------------------------------------
const TRACER_CONTEXT = {
  layer: "PulseGPUSessionTracer",
  role: "SENSORY_ARCHIVE",
  purpose: "Afferent nervous system — deterministic perception + recording",
  context:
    "Records ordered steps with durations + health signals + GPU mode/dispatch info + v12.3+ vectors",
  target: "full-gpu+binary",
  selfRepairable: true,
  version: "12.3-Continuum-binary",

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend12Ready: true,

    // v12.3-Continuum awareness
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,
    dualModeEvolution: true,
    dualBandAware: true,
    organismLoaderAware: true,
    geneticMemoryLink: true,
    healerLink: true,

    routingContract: "PulseSend-v12",
    gpuOrganContract: "PulseGPU-v12-Continuum",
    binaryGpuOrganContract: "PulseBinaryGPU-v12-Continuum",
    earnCompatibility: "Earn-v3",

    // Legacy compatibility (metadata only)
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2",
    legacyRoutingContractV11: "PulseSend-v11",
    legacyGPUOrganContractV11: "PulseGPU-v11-Evo"
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
// Step normalization — Sensory Input Normalization (v12.3-Continuum-binary)
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

    // v12.3+ extended telemetry (optional)
    frameTimeAvgMs,
    frameTimeP95Ms,
    frameTimeP99Ms,
    gpuTempC,
    gpuPowerW,
    gpuFanRpm,
    memoryBandwidthGBs,

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

    // v12.3+ extended telemetry (pure recording)
    frameTimeAvgMs:
      typeof frameTimeAvgMs === "number"
        ? clamp(frameTimeAvgMs, 0, 1000)
        : undefined,
    frameTimeP95Ms:
      typeof frameTimeP95Ms === "number"
        ? clamp(frameTimeP95Ms, 0, 2000)
        : undefined,
    frameTimeP99Ms:
      typeof frameTimeP99Ms === "number"
        ? clamp(frameTimeP99Ms, 0, 5000)
        : undefined,
    gpuTempC:
      typeof gpuTempC === "number"
        ? clamp(gpuTempC, 0, 130)
        : undefined,
    gpuPowerW:
      typeof gpuPowerW === "number"
        ? clamp(gpuPowerW, 0, 1000)
        : undefined,
    gpuFanRpm:
      typeof gpuFanRpm === "number"
        ? clamp(gpuFanRpm, 0, 20000)
        : undefined,
    memoryBandwidthGBs:
      typeof memoryBandwidthGBs === "number"
        ? clamp(memoryBandwidthGBs, 0, 3000)
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
// SessionTrace — Sensory Recording Unit (v12.3-Continuum-binary)
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

    // v12.3-Continuum-binary: session-level GPU context snapshot
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

      // v12.3-Continuum-binary: mode counts for GeneticMemory / Insights
      binaryStepCount: binarySteps,
      symbolicStepCount: symbolicSteps,

      // session-level GPU context
      gpuContext: this.gpuContext,

      meta: { ...TRACER_CONTEXT }
    };
  }
}


// ------------------------------------------------------------
// PulseGPUSessionTracer — Sensory Archive Controller (v12.3-Continuum-binary)
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
