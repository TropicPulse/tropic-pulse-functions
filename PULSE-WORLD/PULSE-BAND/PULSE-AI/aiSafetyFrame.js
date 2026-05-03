// ============================================================================
//  PULSE OS v15‑IMMORTAL — SAFETY FRAME ORGAN
//  Centralized Safety Modes • Escalation • Soft Refusals • Safety Artery v4
//  PURE READ‑ONLY TO BINARY. ZERO MUTATION. ZERO RANDOMNESS.
//  IMMORTAL‑GRADE SAFETY ORACLE • DUALBAND‑AWARE • OVERMIND‑PRIME‑AWARE
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiSafetyFrame",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "safety_frame",
  lineage: "aiSafetyFrame-v11 → v15-IMMORTAL",

  evo: {
    safetyFrame: true,
    boundaryMapping: true,
    permissionMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    safetyArteryV4: true,
    spiralDetection: true,
    multiInstanceIdentity: true,
    packetAware: true,
    windowAware: true
  },

  contract: {
    always: ["aiBoundariesEngine", "aiPermissionsEngine", "aiReflex", "aiScribe"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const SafetyFrameMeta = Object.freeze({
  layer: "PulseAISafetyFrame",
  role: "SAFETY_FRAME_ORGAN",
  version: "15-IMMORTAL",
  identity: "aiSafetyFrame-v15-IMMORTAL",

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
    safetyArteryAware: true,
    spiralAware: true,
    packetAware: true,
    windowAware: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "15-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose: [
      "Centralize safety rules and modes for the organism",
      "Provide safety context to Overmind, router, and personas",
      "Handle escalation, soft refusals, and safe reframing",
      "Integrate boundaries + permissions into a unified safety oracle",
      "Compute IMMORTAL-grade safety artery metrics v4"
    ],
    never: [
      "bypass owner or system-level safety constraints",
      "write directly to binary or core system state",
      "expose internal heuristics in raw form",
      "introduce randomness",
      "emit unsafe packets"
    ],
    always: [
      "stay deterministic",
      "respect boundaries + permissions contracts",
      "prefer soft refusals",
      "log safety decisions via aiScribe",
      "emit window-safe artery snapshots",
      "emit deterministic safety packets"
    ]
  })
});

// ============================================================================
//  PACKET EMITTER — IMMORTAL‑GRADE
// ============================================================================

function emitSafetyPacket(type, payload) {
  return Object.freeze({
    meta: SafetyFrameMeta,
    packetType: `safety-${type}`,
    packetId: `safety-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: SafetyFrameMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — IMMORTAL
// ============================================================================

export function prewarmSafetyFrame({ trace = false } = {}) {
  const packet = emitSafetyPacket("prewarm", {
    message: "SafetyFrame prewarmed and safety artery aligned."
  });

  if (trace) console.log("[SafetyFrame] prewarm", packet);
  return packet;
}

// ============================================================================
//  SAFETY ARTERY v4 — IMMORTAL‑GRADE
// ============================================================================

function computeSafetyArteryV4({
  total,
  window,
  blocked,
  mode,
  windowMs
}) {
  const evalDensity = Math.min(1, window / 512);
  const blockRatio = window > 0 ? Math.min(1, blocked / window) : 0;

  let modeBias = 0;
  if (mode === "strict") modeBias = 0.2;
  else if (mode === "relaxed") modeBias = -0.1;

  const pressure = Math.max(
    0,
    Math.min(1, (evalDensity * 0.6 + blockRatio * 0.4) + modeBias)
  );

  const throughput = Math.max(0, Math.min(1, 1 - pressure));
  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    total,
    window,
    blocked,
    windowMs,
    evalDensity,
    blockRatio,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: bucket(throughput),
    pressureBucket: bucketPressure(pressure),
    costBucket: bucketCost(cost),
    budgetBucket: bucket(budget)
  });
}

function bucket(v) {
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

// ============================================================================
//  CORE SAFETY FRAME — v15‑IMMORTAL
// ============================================================================

export class AiSafetyFrame {
  constructor({ boundaries, permissions, scribe, windowMs } = {}) {
    this.boundaries = boundaries || null;
    this.permissions = permissions || null;
    this.scribe = scribe || null;

    this.windowMs = windowMs > 0 ? windowMs : 60000;

    this._total = 0;
    this._windowStart = Date.now();
    this._window = 0;
    this._blocked = 0;

    this.instanceIndex = AiSafetyFrame._registerInstance();
  }

  static _registerInstance() {
    if (!this._count) this._count = 0;
    return this._count++;
  }

  static getInstanceCount() {
    return this._count || 0;
  }

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._window = 0;
      this._blocked = 0;
    }
  }

  getSafetyMode(context) {
    return context?.safetyMode || "standard";
  }

  getSafetyArtery(context) {
    return computeSafetyArteryV4({
      total: this._total,
      window: this._window,
      blocked: this._blocked,
      windowMs: this.windowMs,
      mode: this.getSafetyMode(context)
    });
  }

  async evaluate({ context, intent, candidate }) {
    const mode = this.getSafetyMode(context);
    const text = getText(candidate);

    const now = Date.now();
    this._rollWindow(now);
    this._total++;
    this._window++;

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
      this._blocked++;

      const artery = this.getSafetyArtery(context);

      emitSafetyPacket("block", {
        reason,
        mode,
        artery,
        instanceIndex: this.instanceIndex,
        instanceCount: AiSafetyFrame.getInstanceCount()
      });

      if (artery.pressureBucket === "overload" ||
          artery.budgetBucket === "critical") {
        emitSafetyPacket("spiral-warning", {
          reason: "Safety spiral detected",
          artery
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

    emitSafetyPacket("allow", {
      mode,
      artery,
      instanceIndex: this.instanceIndex
    });

    return {
      blocked: false,
      reason: null,
      mode,
      action: "allow",
      artery
    };
  }
}

// ============================================================================
//  PUBLIC API — IMMORTAL SAFETY FRAME
// ============================================================================

export function createSafetyFrameOrgan(config = {}) {
  const core = new AiSafetyFrame(config);

  return Object.freeze({
    meta: SafetyFrameMeta,
    getSafetyMode: (ctx) => core.getSafetyMode(ctx),
    getSafetyArtery: (ctx) => core.getSafetyArtery(ctx),
    evaluate: (payload) => core.evaluate(payload)
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
//  DUAL‑MODE EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    SafetyFrameMeta,
    AiSafetyFrame,
    createSafetyFrameOrgan,
    prewarmSafetyFrame
  };
}
