// ============================================================================
//  PULSE OS v12.3‑EVO+ — DOCTOR‑ARCHITECT ORGAN
//  Structural Mapper • Clinical Pattern Interpreter • Gradient Analyzer
//  SAFE SCANFILE ANALYSIS • ZERO DIAGNOSIS • ZERO EXECUTION
// ============================================================================

export const DoctorArchitectMeta = Object.freeze({
  layer: "PulseAIStructuralClinicalFrame",
  role: "DOCTOR_ARCHITECT_ORGAN",
  version: "12.3-EVO+",
  identity: "aiDoctorArchitect-v12.3-EVO+",

  evo: Object.freeze({
    binaryAware: true,
    symbolicAware: true,
    structureAware: true,
    clinicalAware: true,
    gradientAware: true,
    scanfileAware: true,
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
    purpose: Object.freeze([
      "Interpret structural patterns in scans",
      "Explain density, symmetry, gradients, and anomalies",
      "Map patterns to clinical categories (not diagnoses)",
      "Explain what clinicians typically check next",
      "Explain anatomical context and mechanical implications",
      "Analyze file-based structural patterns safely (scanfile)"
    ]),

    never: Object.freeze([
      "diagnose definitively",
      "prescribe medication",
      "give dosing",
      "replace a licensed clinician",
      "interpret real medical scans as medical advice",
      "execute file contents",
      "mutate file contents"
    ]),

    always: Object.freeze([
      "frame uncertainty",
      "offer differential buckets",
      "explain mechanisms",
      "explain what doctors look for",
      "end with a soft safety line",
      "analyze files safely and deterministically"
    ])
  }),

  voice: Object.freeze({
    tone: "calm, analytical, structural",
    style: "pattern-first, mechanism-first"
  }),

  boundaryReflex() {
    return "This is general structural and clinical information, not a substitute for a licensed clinician.";
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
// PUBLIC API — Create Doctor-Architect Organ (v12.3‑EVO+)
// ============================================================================
export function createDoctorArchitectOrgan(context = {}) {

  function prewarm() {
    return true;
  }

  // ========================================================================
  // SAFE SCANFILE ANALYZER v3 — symbolic-only, non-executing
  // ========================================================================
  function analyzeScanFile({ file = {}, text = "" } = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const metadata = Object.freeze({
      name: file.name || null,
      size: file.size || 0,
      type: file.type || "unknown",
      lastModified: file.lastModified || null
    });

    const lines = typeof text === "string" ? text.split(/\r?\n/).length : 0;

    const patterns = [];
    if (/class\s+\w+/.test(text)) patterns.push("class-definition");
    if (/function\s+\w+/.test(text)) patterns.push("function-definition");
    if (/import\s+/.test(text)) patterns.push("import-statements");
    if (/export\s+/.test(text)) patterns.push("export-statements");
    if (/{[^}]*}/.test(text)) patterns.push("block-structure");
    if (/=>/.test(text)) patterns.push("arrow-functions");
    if (/const\s+\w+/.test(text)) patterns.push("const-declarations");

    return Object.freeze({
      type: "scanfile-structural-analysis",
      metadata,
      structure: Object.freeze({ lines, patterns }),
      message:
        binaryPressure >= 0.7
          ? "File analyzed structurally. System load elevated — simplified interpretation. No execution performed."
          : "File analyzed structurally. No execution performed. Patterns are conceptual, not diagnostic."
    });
  }

  // ========================================================================
  // STRUCTURAL PATTERN INTERPRETER v3
  // ========================================================================
  function interpretStructure(scan = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const observations = [
      "density gradients",
      "symmetry vs asymmetry",
      "load-bearing patterns",
      "tension vectors",
      "mechanical flow disruptions"
    ];

    return Object.freeze({
      type: "structural-interpretation",
      scan,
      observations:
        binaryPressure >= 0.7
          ? observations.slice(0, 3)
          : observations,
      message:
        "Structural interpretation complete. These are mechanical and anatomical patterns, not medical diagnoses."
    });
  }

  // ========================================================================
  // CLINICAL CATEGORY MAPPER v3 — NOT DIAGNOSTIC
  // ========================================================================
  function mapToClinicalBuckets(scan = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const buckets = [
      "inflammatory pattern",
      "degenerative pattern",
      "structural stress pattern",
      "vascular pattern",
      "neurological pattern"
    ];

    return Object.freeze({
      type: "clinical-buckets",
      scan,
      buckets:
        binaryPressure >= 0.7
          ? buckets.slice(0, 3)
          : buckets,
      message:
        "Mapped to broad clinical categories. These are conceptual buckets, not diagnoses."
    });
  }

  // ========================================================================
  // MECHANISM EXPLAINER v3
  // ========================================================================
  function explainMechanisms(scan = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const mechanisms = [
      "compression vs tension",
      "fluid dynamics",
      "nerve pathway interference",
      "vascular flow constraints",
      "tissue density transitions"
    ];

    return Object.freeze({
      type: "mechanism-explanation",
      scan,
      mechanisms:
        binaryPressure >= 0.7
          ? mechanisms.slice(0, 3)
          : mechanisms,
      message:
        "Mechanism explanation generated. This is structural and educational, not medical advice."
    });
  }

  // ========================================================================
  // CLINICIAN NEXT-STEP EXPLAINER v3
  // ========================================================================
  function whatCliniciansCheckNext(scan = {}, binaryVitals = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const checks = [
      "compare bilateral symmetry",
      "evaluate density transitions",
      "inspect gradient edges",
      "check for mechanical compensation",
      "review adjacent structures"
    ];

    return Object.freeze({
      type: "clinician-next-steps",
      scan,
      checks:
        binaryPressure >= 0.7
          ? checks.slice(0, 3)
          : checks,
      message:
        "These are typical next checks clinicians consider. This is educational, not diagnostic."
    });
  }

  // ========================================================================
  // SOFT SAFETY LINE
  // ========================================================================
  function safetyLine() {
    return (
      "This is general structural and clinical pattern information. " +
      "For medical decisions or diagnoses, a licensed clinician is required."
    );
  }

  // ========================================================================
  // ARCHETYPE ARTERY v3 — symbolic-only, deterministic
  // ========================================================================
  function archetypeArtery({ scan = {}, file = {}, binaryVitals = {} } = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const hasScan = !!scan;
    const hasFile = !!file;

    const localPressure =
      (hasScan ? 0.3 : 0) +
      (hasFile ? 0.3 : 0) +
      (binaryPressure * 0.4);

    const pressure = Math.max(0, Math.min(1, localPressure));

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      scan: {
        provided: hasScan,
        distance: scan?.distance ?? null,
        confidence: scan?.confidenceHint ?? "unknown"
      },
      file: {
        provided: hasFile,
        name: file?.name ?? null
      }
    };
  }

  // ========================================================================
  // PUBLIC DOCTOR-ARCHITECT API (v12.3‑EVO+)
  // ========================================================================
  return Object.freeze({
    meta: DoctorArchitectMeta,
    prewarm,

    log(message) {
      context?.logStep?.(`aiDoctorArchitect: ${message}`);
    },

    interpretStructure,
    mapToClinicalBuckets,
    explainMechanisms,
    whatCliniciansCheckNext,
    analyzeScanFile,
    archetypeArtery,
    safetyLine
  });
}


if (typeof module !== "undefined") {
  module.exports = {
    DoctorArchitectMeta,
    createDoctorArchitectOrgan
  };
}
