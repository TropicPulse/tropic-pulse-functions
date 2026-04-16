// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUSessionTracer.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUSessionTracer — deterministic, pure-logic tracer for GPU/game sessions.
//   Records ordered "steps" within a session with durations + health signals.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A deterministic session trace builder
//     • A source of structured traces for Memory + InsightsEngine
//     • v5-ready: traces include metadata for self-healing + replay
//
//   This file IS NOT:
//     • A renderer
//     • A GPU runtime
//     • A WebGPU/WebGL interface
//     • A persistence layer
//     • A UI or notification system
//     • A backend module
//
// SAFETY RULES:
//   • NO WebGPU/WebGL APIs
//   • NO DOM APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • FAIL-OPEN: invalid steps or missing sessions must not break the tracer
//   • SELF-REPAIR READY: traces must contain enough metadata for reconstruction
//
// ------------------------------------------------------
// Utility: clamp helpers
// ------------------------------------------------------

function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// ------------------------------------------------------
// Step normalization (v5-ready)
// ------------------------------------------------------

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

    // v5 metadata for healing + replay
    meta: {
      layer: "PulseGPUSessionTracer",
      version: 4,
      target: "full-gpu"
    }
  };
}

// ------------------------------------------------------
// SessionTrace model (v5-ready)
// ------------------------------------------------------

class SessionTrace {
  constructor({ sessionId, gameProfile, hardwareProfile, tierProfile }) {
    this.sessionId = String(sessionId || "unknown-session");
    this.gameProfile = gameProfile || {};
    this.hardwareProfile = hardwareProfile || {};
    this.tierProfile = tierProfile || {};
    this.steps = [];

    // v5 metadata for healing + replay
    this.meta = {
      layer: "PulseGPUSessionTracer",
      version: 4,
      target: "full-gpu",
      selfRepairable: true
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
      stepCount: this.steps.length
    };
  }
}

// ------------------------------------------------------
// PulseGPUSessionTracer (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUSessionTracer {
  constructor() {
    this.sessions = new Map(); // sessionId -> SessionTrace
  }

  // ----------------------------------------------------
  // Start a new session (fail-open)
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // Record a step (fail-open)
  // ----------------------------------------------------
  recordStep(sessionId, step) {
    const id = String(sessionId || "unknown-session");
    const trace = this.sessions.get(id);

    if (!trace) {
      // fail-open: ignore silently
      return null;
    }

    trace.addStep(step || {});
    return trace;
  }

  // ----------------------------------------------------
  // End a session (fail-open)
  // ----------------------------------------------------
  endSession(sessionId) {
    const id = String(sessionId || "unknown-session");
    const trace = this.sessions.get(id);

    if (!trace) return null;

    this.sessions.delete(id);
    return trace;
  }

  // ----------------------------------------------------
  // Get current trace (fail-open)
  // ----------------------------------------------------
  getSessionTrace(sessionId) {
    const id = String(sessionId || "unknown-session");
    return this.sessions.get(id) || null;
  }

  // ----------------------------------------------------
  // Clear a session
  // ----------------------------------------------------
  clearSession(sessionId) {
    const id = String(sessionId || "unknown-session");
    this.sessions.delete(id);
  }

  // ----------------------------------------------------
  // Clear all sessions
  // ----------------------------------------------------
  clearAllSessions() {
    this.sessions.clear();
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUSessionTracer,
  SessionTrace,
  normalizeStep
};
