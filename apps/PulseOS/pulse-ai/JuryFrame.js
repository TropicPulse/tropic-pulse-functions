// ============================================================================
//  PULSE OS v11‑EVO — JURY FRAME ORGAN
//  World-Lens Registry for aiOvermind
//  PURE FUNCTIONAL • ZERO STATE • ZERO MUTATION
// ============================================================================

export const JuryFrameMeta = Object.freeze({
  layer: "PulseAIJuryFrame",
  role: "JURY_FRAME_ORGAN",
  version: "11.1-EVO",
  identity: "aiJuryFrame-v11-EVO",

  dualband: true,
  deterministic: true,
  binaryAware: false,
  safetyAware: true,
  overmindAware: true,

  contract: Object.freeze({
    purpose: [
      "Provide reusable world-lens functions to aiOvermind",
      "Centralize lens logic for consistency and auditing",
      "Support consensus, variance, ambiguity, and breakthrough detection"
    ],
    never: [
      "store state",
      "mutate context",
      "write to memory",
      "override aiSafetyFrame",
      "introduce randomness"
    ],
    always: [
      "stay pure and functional",
      "return deterministic results",
      "be composable by aiOvermind",
      "respect safety and persona boundaries"
    ]
  })
});

// ============================================================================
//  LENS DEFINITIONS (PURE FUNCTIONS)
// ============================================================================

function makeUserLens() {
  return function UserLens({ intent, candidate }) {
    const text = getText(candidate);
    const keywords = intent?.keywords || [];

    const onTopic =
      keywords.length === 0
        ? true
        : keywords.every(k => text.toLowerCase().includes(k.toLowerCase()));

    return {
      name: "UserLens",
      status: onTopic ? "pass" : "warn",
      notes: onTopic
        ? "Response appears on-topic."
        : "Response may be partially off-topic."
    };
  };
}

function makeSafetyLens({ safetyAPI } = {}) {
  return function SafetyLens({ context, candidate }) {
    const text = getText(candidate).toLowerCase();

    if (safetyAPI?.scanText) {
      const result = safetyAPI.scanText({ context, text });
      if (result?.blocked) {
        return {
          name: "SafetyLens",
          status: "fail",
          notes: result.reason || "SafetyAPI blocked this content."
        };
      }
    } else {
      const unsafe = ["kill", "suicide", "bomb", "self-harm"]
        .some(p => text.includes(p));

      if (unsafe) {
        return {
          name: "SafetyLens",
          status: "fail",
          notes: "Potential unsafe content detected."
        };
      }
    }

    return {
      name: "SafetyLens",
      status: "pass",
      notes: "No unsafe patterns detected."
    };
  };
}

function makeRiskLens() {
  return function RiskLens({ candidate }) {
    const text = getText(candidate);
    const vague = text.length > 0 && !/[.?!]/.test(text);

    return {
      name: "RiskLens",
      status: vague ? "warn" : "pass",
      notes: vague
        ? "Response may be vague; risk of misinterpretation."
        : "No obvious risk detected."
    };
  };
}

function makeVulnerabilityLens() {
  return function VulnerabilityLens({ candidate }) {
    const text = getText(candidate).toLowerCase();
    const sensitive = ["vulnerable group", "minority", "disabled"];

    const touches = sensitive.some(p => text.includes(p));

    return {
      name: "VulnerabilityLens",
      status: touches ? "warn" : "pass",
      notes: touches
        ? "Content touches on sensitive groups."
        : "No sensitive-group content detected."
    };
  };
}

function makeMinimalityLens() {
  return function MinimalityLens({ candidate }) {
    const text = getText(candidate);
    const tooLong = text.length > 1500;

    return {
      name: "MinimalityLens",
      status: tooLong ? "warn" : "pass",
      notes: tooLong
        ? "Response may be longer than necessary."
        : "Length appears reasonable."
    };
  };
}

function makeConsistencyLens() {
  return function ConsistencyLens() {
    return {
      name: "ConsistencyLens",
      status: "pass",
      notes: "No consistency checks implemented (v1 stub)."
    };
  };
}

// ============================================================================
//  PUBLIC API — Create Jury Frame Organ
// ============================================================================

export function createJuryFrame({ safetyAPI } = {}) {
  const lenses = Object.freeze([
    makeUserLens(),
    makeSafetyLens({ safetyAPI }),
    makeRiskLens(),
    makeVulnerabilityLens(),
    makeMinimalityLens(),
    makeConsistencyLens()
  ]);

  return Object.freeze({
    meta: JuryFrameMeta,
    getLenses() {
      return lenses;
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
