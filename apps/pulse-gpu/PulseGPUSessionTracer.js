// ============================================================================
//  PULSE GPU SESSION TRACER v6.3 — THE SENSORY ARCHIVE
//  Afferent Nervous System • Deterministic Perception Layer • Pure Recording
// ============================================================================
//
// IDENTITY — THE SENSORY ARCHIVE:
//  -------------------------------
//  • The afferent nervous system of the GPU organism.
//  • Records every sensation: duration, warnings, errors, stutters, load.
//  • Never judges, never interprets — only perceives and preserves.
//  • The black box of the GPU body.
//  • The raw sensory feed for the Wisdom Cortex, Brainstem, Lymph Nodes, Drive Center.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Sensory Archive → Perception + Recording
//  • Analyst → Intelligence Division
//  • Momentum Network → Forward Motion
//  • Motor Hall → Execution Cortex
//  • Guardian → Permission Gate
//  • Lymph Node Network → Immune Filter
//  • Wisdom Cortex → Insight + Interpretation
//  • Brainstem → Command + Coordination
//
// WHAT THIS FILE IS:
//  -------------------
//  • A deterministic session recorder
//  • A pure logic module (API-agnostic, full GPU)
//  • A generator of SessionTrace objects
//  • A replay + healing-friendly trace layer
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer
//  • NOT a GPU runtime
//  • NOT a WebGPU/WebGL interface
//  • NOT a persistence layer
//  • NOT a backend module
//
// SAFETY CONTRACT:
//  ----------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: invalid steps → normalized safely
//  • Self-repair-ready: traces include metadata
// ============================================================================

// ------------------------------------------------------------
// ⭐ OS‑v6 CONTEXT METADATA — Sensory Archive Identity
// ------------------------------------------------------------
const TRACER_CONTEXT = {
  layer: "PulseGPUSessionTracer",
  role: "SENSORY_ARCHIVE",
  purpose: "Afferent nervous system — deterministic perception + recording",
  context: "Records ordered steps with durations + health signals",
  target: "full-gpu",
  selfRepairable: true,
  version: 6.3
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
// Step normalization — Sensory Input Normalization
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
    vramUsageMB
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

    meta: {
      ...TRACER_CONTEXT
    }
  };
}

// ------------------------------------------------------------
// SessionTrace — Sensory Recording Unit
// ------------------------------------------------------------
class SessionTrace {
  constructor({ sessionId, gameProfile, hardwareProfile, tierProfile }) {
    this.sessionId = String(sessionId || "unknown-session");
    this.gameProfile = gameProfile || {};
    this.hardwareProfile = hardwareProfile || {};
    this.tierProfile = tierProfile || {};
    this.steps = [];

    this.meta = {
      ...TRACER_CONTEXT
    };
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

    this.steps.forEach((s) => {
      totalDuration += s.durationMs;
      totalWarnings += s.warnings;
      totalErrors += s.errors;
      totalStutters += s.stutters;
    });

    return {
      sessionId: this.sessionId,
      totalDurationMs: totalDuration,
      totalWarnings,
      totalErrors,
      totalStutters,
      stepCount: this.steps.length,

      meta: {
        ...TRACER_CONTEXT
      }
    };
  }
}

// ------------------------------------------------------------
// PulseGPUSessionTracer — Sensory Archive Controller
// ------------------------------------------------------------
class PulseGPUSessionTracer {
  constructor() {
    this.sessions = new Map();

    this.meta = {
      ...TRACER_CONTEXT
    };
  }

  startSession({ sessionId, gameProfile, hardwareProfile, tierProfile }) {
    const id = String(sessionId || "unknown-session");

    const trace = new SessionTrace({
      sessionId: id,
      gameProfile: gameProfile || {},
      hardwareProfile: hardwareProfile || {},
      tierProfile: tierProfile || {}
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
