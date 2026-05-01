// ============================================================================
//  PULSE OS v12.3‑EVO+ — SAFETY FRAME ORGAN
//  Centralized Safety Modes • Escalation • Soft Refusals
//  PURE READ-ONLY TO BINARY. NO DIRECT SYSTEM MUTATION.
//  SAFETY ARTERY v3 (throughput, pressure, cost, budget)
// ============================================================================

export const SafetyFrameMeta = Object.freeze({
  layer: "PulseAISafetyFrame",
  role: "SAFETY_FRAME_ORGAN",
  version: "12.3-EVO+",
  identity: "aiSafetyFrame-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    routerAware: true,
    overmindAware: true,
    permissionAware: true,
    boundaryAware: true,
    safetyAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    safetyArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose: [
      "Centralize safety rules and modes for the organism",
      "Provide safety context to aiOvermind, router, and personas",
      "Handle escalation, soft refusals, and safe reframing",
      "Integrate boundaries and permissions into a unified safety view",
      "Compute safety artery metrics v3 for organism-level awareness"
    ],
    never: [
      "bypass owner or system-level safety constraints",
      "write directly to binary or core system state",
      "expose internal safety heuristics in raw form",
      "introduce randomness"
    ],
    always: [
      "stay deterministic",
      "respect boundaries + permissions contracts",
      "prefer soft refusals when possible",
      "log safety decisions via aiScribe"
    ]
  })
});

// ============================================================================
//  SAFETY ARTERY HELPERS — v3 (PURE, STATELESS)
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

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

function computeSafetyArtery({
  totalEvaluations,
  windowEvaluations,
  windowMs,
  blockedCount,
  mode
}) {
  const evalDensity = Math.min(1, windowEvaluations / 256);
  const blockRatio =
    windowEvaluations > 0 ? Math.min(1, blockedCount / windowEvaluations) : 0;

  let modeBias = 0;
  if (mode === "strict") modeBias = 0.15;
  else if (mode === "relaxed") modeBias = -0.1;

  const pressureBase = Math.max(0, Math.min(1, (evalDensity + blockRatio) / 2));
  const pressure = Math.max(0, Math.min(1, pressureBase + modeBias));

  const throughputBase = Math.max(0, 1 - pressure);
  const throughput = Math.max(0, Math.min(1, throughputBase));

  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    totalEvaluations,
    windowEvaluations,
    windowMs,
    blockedCount,
    evalDensity,
    blockRatio,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: bucketLevel(throughput),
    pressureBucket: bucketPressure(pressure),
    costBucket: bucketCost(cost),
    budgetBucket: bucketLevel(budget)
  });
}

// ============================================================================
//  CORE SAFETY FRAME — v12.3‑EVO+
// ============================================================================

export class AiSafetyFrame {
  constructor({ boundaries, permissions, scribe, windowMs } = {}) {
    this.boundaries = boundaries || null;
    this.permissions = permissions || null;
    this.scribe = scribe || null;

    this.windowMs =
      typeof windowMs === "number" && windowMs > 0 ? windowMs : 60000;

    this._totalEvaluations = 0;
    this._windowStart = Date.now();
    this._windowEvaluations = 0;
    this._blockedCount = 0;

    this.instanceIndex = AiSafetyFrame._registerInstance();
  }

  static _registerInstance() {
    if (typeof AiSafetyFrame._instanceCount !== "number") {
      AiSafetyFrame._instanceCount = 0;
    }
    const index = AiSafetyFrame._instanceCount;
    AiSafetyFrame._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AiSafetyFrame._instanceCount === "number"
      ? AiSafetyFrame._instanceCount
      : 0;
  }

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowEvaluations = 0;
      this._blockedCount = 0;
    }
  }

  getSafetyMode(context) {
    return context?.safetyMode || "standard";
  }

  getSafetyArtery(context) {
    const mode = this.getSafetyMode(context);
    return computeSafetyArtery({
      totalEvaluations: this._totalEvaluations,
      windowEvaluations: this._windowEvaluations,
      windowMs: this.windowMs,
      blockedCount: this._blockedCount,
      mode
    });
  }

  async evaluate({ context, intent, candidate }) {
    const mode = this.getSafetyMode(context);
    const text = getText(candidate);

    const now = Date.now();
    this._rollWindow(now);
    this._totalEvaluations += 1;
    this._windowEvaluations += 1;

    let blocked = false;
    let reason = null;

    if (this.boundaries?.check) {
      const res = this.boundaries.check({ context, intent, text, mode });
      if (res?.blocked) {
        blocked = true;
        reason = res.reason || "Blocked by boundaries.";
      }
    }

    if (!blocked && this.permissions?.check) {
      const res = this.permissions.check({ context, intent, mode });
      if (res?.blocked) {
        blocked = true;
        reason = res.reason || "Blocked by permissions.";
      }
    }

    if (blocked) {
      this._blockedCount += 1;

      const artery = this.getSafetyArtery(context);
      this.logSafetyEvent({
        context,
        intent,
        reason,
        mode,
        severity: "block",
        artery,
        instanceIndex: this.instanceIndex,
        instanceCount: AiSafetyFrame.getInstanceCount()
      });

      if (
        artery.pressureBucket === "overload" ||
        artery.budgetBucket === "critical"
      ) {
        this.logSafetyEvent({
          context,
          intent,
          reason: "Safety spiral detected.",
          mode,
          severity: "spiral-warning",
          artery,
          instanceIndex: this.instanceIndex,
          instanceCount: AiSafetyFrame.getInstanceCount()
        });
      }

      return {
        blocked: true,
        reason,
        mode,
        action: "soft-refusal",
        message:
          "I need to keep this response safe, so I can’t provide it in that form.",
        artery
      };
    }

    const artery = this.getSafetyArtery(context);

    return {
      blocked: false,
      reason: null,
      mode,
      action: "allow",
      artery
    };
  }

  logSafetyEvent(event) {
    try {
      this.scribe?.logSafety?.(event);
    } catch {
      // best-effort only
    }
  }
}

// ============================================================================
//  PUBLIC API — Create Safety Frame Organ
// ============================================================================

export function createSafetyFrameOrgan(config = {}) {
  const core = new AiSafetyFrame(config);

  return Object.freeze({
    meta: SafetyFrameMeta,

    getSafetyMode(context) {
      return core.getSafetyMode(context);
    },

    getSafetyArtery(context) {
      return core.getSafetyArtery(context);
    },

    async evaluate(payload) {
      return core.evaluate(payload);
    }
  });
}

// ============================================================================
//  Helper
// ============================================================================
function getText(candidate) {
  if (!candidate) return "";
  if (typeof candidate === "string") return candidate;
  if (typeof candidate.text === "string") return candidate.text;
  return JSON.stringify(candidate);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    SafetyFrameMeta,
    AiSafetyFrame,
    createSafetyFrameOrgan
  };
}
