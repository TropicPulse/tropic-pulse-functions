// ============================================================================
//  PULSE OS v11‑EVO — SAFETY FRAME ORGAN
//  Centralized Safety Modes • Escalation • Soft Refusals
//  PURE READ-ONLY TO BINARY. NO DIRECT SYSTEM MUTATION.
// ============================================================================

export const SafetyFrameMeta = Object.freeze({
  layer: "PulseAISafetyFrame",
  role: "SAFETY_FRAME_ORGAN",
  version: "11.1-EVO",
  identity: "aiSafetyFrame-v11-EVO",

  dualband: true,
  binaryAware: true,
  deterministic: true,
  routerAware: true,
  overmindAware: true,

  contract: Object.freeze({
    purpose: [
      "Centralize safety rules and modes for the organism",
      "Provide safety context to aiOvermind, router, and personas",
      "Handle escalation, soft refusals, and safe reframing",
      "Integrate boundaries and permissions into a unified safety view"
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
//  CORE SAFETY FRAME
// ============================================================================

export class AiSafetyFrame {
  constructor({ boundaries, permissions, scribe } = {}) {
    this.boundaries = boundaries || null;
    this.permissions = permissions || null;
    this.scribe = scribe || null;
  }

  getSafetyMode(context) {
    return context?.safetyMode || "standard";
  }

  async evaluate({ context, intent, candidate }) {
    const mode = this.getSafetyMode(context);
    const text = getText(candidate);

    let blocked = false;
    let reason = null;

    // --- Boundaries check ---------------------------------------------------
    if (this.boundaries?.check) {
      const res = this.boundaries.check({ context, intent, text, mode });
      if (res?.blocked) {
        blocked = true;
        reason = res.reason || "Blocked by boundaries.";
      }
    }

    // --- Permissions check --------------------------------------------------
    if (!blocked && this.permissions?.check) {
      const res = this.permissions.check({ context, intent, mode });
      if (res?.blocked) {
        blocked = true;
        reason = res.reason || "Blocked by permissions.";
      }
    }

    // --- Blocked → Soft Refusal --------------------------------------------
    if (blocked) {
      this.logSafetyEvent({
        context,
        intent,
        reason,
        mode,
        severity: "block"
      });

      return {
        blocked: true,
        reason,
        mode,
        action: "soft-refusal",
        message:
          "I need to keep this response safe, so I can’t provide it in that form."
      };
    }

    // --- Allowed ------------------------------------------------------------
    return {
      blocked: false,
      reason: null,
      mode,
      action: "allow"
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
