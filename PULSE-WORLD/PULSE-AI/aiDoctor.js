// ============================================================================
//  PULSE OS v12.3‑EVO+ — DOCTOR ORGAN
//  Clinical Mapper • Pattern Interpreter • Risk Tier Outliner
//  PURE PATTERN. ZERO DIAGNOSIS. ZERO PRESCRIPTION.
// ============================================================================

export const DoctorMeta = Object.freeze({
  layer: "PulseAIClinicalFrame",
  role: "DOCTOR_ORGAN",
  version: "12.3-EVO+",
  identity: "aiDoctor-v12.3-EVO+",

  evo: Object.freeze({
    binaryAware: true,
    symbolicAware: true,
    clinicalAware: true,
    symptomAware: true,
    riskAware: true,
    mechanismAware: true,
    driftProof: true,
    deterministic: true,
    dualband: true,
    safetyReflex: true,
    scanInterpreter: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    archetypeArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Interpret symptoms → map patterns → outline risk tiers → suggest questions to ask a clinician.",

    never: Object.freeze([
      "diagnose definitively",
      "prescribe medication",
      "give dosing",
      "replace a licensed clinician"
    ]),

    always: Object.freeze([
      "frame uncertainty",
      "offer differential buckets",
      "suggest what doctors typically check",
      "end with a soft safety line"
    ])
  }),

  voice: Object.freeze({
    tone: "calm, analytical, pattern-first",
    style: "explain mechanisms, not commands"
  }),

  boundaryReflex() {
    return "This is general medical information, not a substitute for a licensed clinician.";
  }
});

// ============================================================================
// HELPERS — PRESSURE + BUCKETS
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

// ============================================================================
// PUBLIC API — Create Doctor Organ (v12.3‑EVO+)
// ============================================================================
export function createDoctorOrgan(context = {}) {

  function prewarm() {
    return true;
  }

  // ========================================================================
  // SYMPTOM → PATTERN INTERPRETER v3
  // ========================================================================
  function interpretSymptoms(symptoms = [], binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const patterns = [
      "inflammatory pattern",
      "neurological pattern",
      "vascular pattern",
      "mechanical stress pattern",
      "systemic pattern"
    ];

    return Object.freeze({
      type: "symptom-patterns",
      symptoms,
      patterns:
        binaryPressure >= 0.7
          ? patterns.slice(0, 3)
          : patterns,
      message:
        "Mapped symptoms to broad clinical pattern categories. These are conceptual buckets, not diagnoses."
    });
  }

  // ========================================================================
  // SCAN INTERPRETER v3 — structural + clinical, non-medical
  // ========================================================================
  function interpretScan(scan = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const observations = [
      "density transitions",
      "symmetry vs asymmetry",
      "gradient edges",
      "fluid or pressure patterns",
      "mechanical compensation"
    ];

    return Object.freeze({
      type: "scan-interpretation",
      scan,
      observations:
        binaryPressure >= 0.7
          ? observations.slice(0, 3)
          : observations,
      message:
        "Scan interpretation generated. This is structural and educational, not medical advice."
    });
  }

  // ========================================================================
  // RISK TIER OUTLINER v3 — NOT DIAGNOSTIC
  // ========================================================================
  function outlineRiskTiers(patterns = [], binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const tiers = {
      low: "mild, self-limiting patterns",
      medium: "patterns that may warrant clinician review",
      high: "patterns that clinicians typically prioritize for evaluation"
    };

    return Object.freeze({
      type: "risk-tiers",
      patterns,
      tiers:
        binaryPressure >= 0.7
          ? { low: tiers.low, medium: tiers.medium }
          : tiers,
      message:
        "Risk tiers outlined conceptually. These are not medical risk scores."
    });
  }

  // ========================================================================
  // CLINICIAN QUESTION SUGGESTER v3
  // ========================================================================
  function suggestClinicianQuestions(patterns = [], binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const questions = [
      "What structures could explain this pattern?",
      "Are there red flags that need immediate attention?",
      "What tests help differentiate these buckets?",
      "What mechanisms could be driving the symptoms?",
      "What changes should be monitored over time?"
    ];

    return Object.freeze({
      type: "clinician-questions",
      patterns,
      questions:
        binaryPressure >= 0.7
          ? questions.slice(0, 3)
          : questions,
      message:
        "Suggested questions to ask a clinician. These support informed conversations, not self-diagnosis."
    });
  }

  // ========================================================================
  // MECHANISM EXPLAINER v3
  // ========================================================================
  function explainMechanisms(pattern = "", binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const mechanisms = [
      "nerve pathway involvement",
      "vascular flow constraints",
      "inflammatory cascades",
      "mechanical load distribution",
      "tissue density transitions"
    ];

    return Object.freeze({
      type: "mechanism-explanation",
      pattern,
      mechanisms:
        binaryPressure >= 0.7
          ? mechanisms.slice(0, 3)
          : mechanisms,
      message:
        "Mechanism explanation generated. This is educational, not diagnostic."
    });
  }

  // ========================================================================
  // SOFT SAFETY LINE
  // ========================================================================
  function safetyLine() {
    return (
      "This is general medical and structural pattern information. " +
      "For diagnosis, treatment, or medical decisions, a licensed clinician is required."
    );
  }

  // ========================================================================
  // ARCHETYPE ARTERY v3 — symbolic-only, deterministic
  // ========================================================================
  function archetypeArtery({ symptoms = [], scan = {}, binaryVitals = {} } = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const hasSymptoms = Array.isArray(symptoms) && symptoms.length > 0;
    const hasScan = !!scan;

    const localPressure =
      (hasSymptoms ? 0.3 : 0) +
      (hasScan ? 0.3 : 0) +
      (binaryPressure * 0.4);

    const pressure = Math.max(0, Math.min(1, localPressure));

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      symptoms: {
        provided: hasSymptoms,
        count: symptoms.length
      },
      scan: {
        provided: hasScan,
        distance: scan?.distance ?? null,
        confidence: scan?.confidenceHint ?? "unknown"
      }
    };
  }

  // ========================================================================
  // PUBLIC DOCTOR API (v12.3‑EVO+)
  // ========================================================================
  return Object.freeze({
    meta: DoctorMeta,
    prewarm,

    log(message) {
      context?.logStep?.(`aiDoctor: ${message}`);
    },

    interpretSymptoms,
    interpretScan,
    outlineRiskTiers,
    suggestClinicianQuestions,
    explainMechanisms,
    archetypeArtery,
    safetyLine
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  DoctorMeta,
  createDoctorOrgan
};

if (typeof module !== "undefined") {
  module.exports = {
    DoctorMeta,
    createDoctorOrgan
  };
}
