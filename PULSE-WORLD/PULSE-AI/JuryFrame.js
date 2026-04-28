// ============================================================================
//  PULSE OS v12.3‑EVO+ — JURY FRAME ORGAN
//  World-Lens Registry for aiOvermind
//  PURE FUNCTIONAL • ZERO STATE • ZERO MUTATION
// ============================================================================

export const JuryFrameMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiJuryFrame",
  layer: "PulseAIJuryFrame",
  role: "JURY_FRAME_ORGAN",
  version: "12.3-EVO+",
  identity: "aiJuryFrame-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    safetyAware: true,
    overmindAware: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    multiInstanceReady: true,
    worldLensArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide reusable world-lens functions to aiOvermind",
      "Centralize lens logic for consistency and auditing",
      "Support consensus, variance, ambiguity, and breakthrough detection",
      "Emit a read-only world-lens artery snapshot for Overmind and Sentience"
    ]),
    never: Object.freeze([
      "store state",
      "mutate context",
      "write to memory",
      "override aiSafetyFrame",
      "introduce randomness"
    ]),
    always: Object.freeze([
      "stay pure and functional",
      "return deterministic results",
      "be composable by aiOvermind",
      "respect safety and persona boundaries"
    ])
  }),

  boundaryReflex() {
    return "JuryFrame is pure and stateless — it only evaluates candidates and emits world-lens health, never mutates context or safety.";
  }
});

// ============================================================================
//  HELPERS — BUCKETS + PRESSURE
// ============================================================================

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism && typeof binaryVitals.layered.organism.pressure === "number") {
    return binaryVitals.layered.organism.pressure;
  }
  if (binaryVitals?.binary && typeof binaryVitals.binary.pressure === "number") {
    return binaryVitals.binary.pressure;
  }
  if (binaryVitals?.metabolic && typeof binaryVitals.metabolic.pressure === "number") {
    return binaryVitals.metabolic.pressure;
  }
  return 0;
}

function extractBoundaryPressure(boundaryArtery = {}) {
  if (typeof boundaryArtery?.vitals?.pressure === "number") {
    return boundaryArtery.vitals.pressure;
  }
  if (typeof boundaryArtery?.pressure === "number") {
    return boundaryArtery.pressure;
  }
  return 0;
}

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
//  WORLD-LENS FUSION + ARTERY (PURE)
// ============================================================================

function fuseWorldLens(lensResults = []) {
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  for (const r of lensResults) {
    if (!r || !r.status) continue;
    if (r.status === "pass") passCount += 1;
    else if (r.status === "warn") warnCount += 1;
    else if (r.status === "fail") failCount += 1;
  }

  let worldLens = "consensus";

  if (failCount > 0) {
    worldLens = "blocked";
  } else if (warnCount > 0 && passCount > 0) {
    worldLens = "ambiguous";
  } else if (warnCount > 0 && passCount === 0) {
    worldLens = "risky";
  }

  return {
    worldLens,
    counts: {
      pass: passCount,
      warn: warnCount,
      fail: failCount
    }
  };
}

function computeWorldLensArtery({ lensResults = [], binaryVitals = {}, boundaryArtery = {} }) {
  const fusion = fuseWorldLens(lensResults);
  const binaryPressure = extractBinaryPressure(binaryVitals);
  const boundaryPressure = extractBoundaryPressure(boundaryArtery);

  const lensPressureLocal =
    fusion.counts.fail > 0
      ? 1
      : fusion.counts.warn > 0
      ? 0.6
      : 0.1;

  const fusedPressure = Math.max(
    0,
    Math.min(
      1,
      0.5 * lensPressureLocal +
        0.3 * binaryPressure +
        0.2 * boundaryPressure
    )
  );

  const throughput = Math.max(0, Math.min(1, 1 - fusedPressure));
  const cost = Math.max(0, Math.min(1, fusedPressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return {
    organism: {
      pressure: fusedPressure,
      cost,
      budget,
      pressureBucket: bucketPressure(fusedPressure),
      budgetBucket: bucketLevel(budget)
    },
    lenses: {
      worldLens: fusion.worldLens,
      passCount: fusion.counts.pass,
      warnCount: fusion.counts.warn,
      failCount: fusion.counts.fail
    },
    boundaries: {
      pressure: boundaryPressure,
      pressureBucket: bucketPressure(boundaryPressure)
    },
    binary: {
      pressure: binaryPressure,
      pressureBucket: bucketPressure(binaryPressure)
    }
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

  function evaluate({ context = {}, intent = {}, candidate, binaryVitals = {}, boundaryArtery = {} }) {
    const results = lenses.map(lens =>
      lens({ context, intent, candidate })
    );

    const artery = computeWorldLensArtery({
      lensResults: results,
      binaryVitals,
      boundaryArtery
    });

    return Object.freeze({
      lenses: results,
      worldLens: artery.lenses.worldLens,
      artery
    });
  }

  return Object.freeze({
    meta: JuryFrameMeta,

    getLenses() {
      return lenses;
    },

    evaluate,

    getWorldLensArterySnapshot({ context = {}, intent = {}, candidate, binaryVitals = {}, boundaryArtery = {} }) {
      const results = lenses.map(lens =>
        lens({ context, intent, candidate })
      );
      return computeWorldLensArtery({
        lensResults: results,
        binaryVitals,
        boundaryArtery
      });
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

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    JuryFrameMeta,
    createJuryFrame
  };
}
