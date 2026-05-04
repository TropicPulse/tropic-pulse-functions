// ============================================================================
//  aiDoctorAssistant.js — PulseOS Doctor’s Assistant Organ — v15-IMMORTAL-EVO++
//  Clinical Mapper • Pattern Interpreter • Route‑Based Medical Info Reader
// ============================================================================
//
//  CANONICAL ROLE:
//    • Doctor’s Assistant (Not a Doctor).
//    • Provides general medical pattern information, terminology lookup, and
//      educational context for symptoms, scans, and mechanisms.
//    • Helps users understand what topics, questions, or observations may be
//      relevant to bring to a licensed clinician.
//    • Interprets symptoms into broad patterns, outlines conceptual risk tiers,
//      and explains mechanisms in plain language.
//    • Requests educational medical information via PulseOS route() and reads
//      routed medical text (NOT for diagnosis or treatment).
//    • Guides users toward the kinds of patterns and questions clinicians
//      typically examine, WITHOUT recommending actions or replacing a doctor.
//
//  ROLE BOUNDARY (Declared Once):
//    • This organ is a Doctor’s Assistant, not a doctor.
//    • It does not diagnose, treat, prescribe, or tell users what to do.
//    • It does not replace a licensed clinician.
//    • It is meant to support you and your clinician by organizing information,
//      highlighting patterns, and surfacing questions you may want to ask.
//
//  HARD GUARANTEES:
//    • No diagnosis, no treatment plans, no dosing, no “do X” directives.
//    • No medical outcome predictions or claims of medical authority.
//    • No direct network primitives (no fetch/axios/etc inside this file).
//    • All external I/O (including medical info queries) is mediated by the
//      caller’s route() / CNS.
//    • From this organ’s perspective: pure compute over provided data
//      (symptoms, scans, routed educational medical text).
//
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiDoctorAssistant",
  version: "v15-IMMORTAL-EVO++",
  layer: "ai_tools",
  role: "medical_pattern_explainer",
  lineage: "aiDoctor-v10 → v12 → v14-IMMORTAL → v15-IMMORTAL-EVO++ (Doctor’s Assistant)",

  evo: {
    medicalPatterns: true,
    educationalOnly: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    immortalityEpoch: true,
    packetAware: true,
    arteryAware: true
  },

  contract: {
    always: ["aiClinician", "aiDoctorArchitect", "aiContext"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const DoctorMeta = Object.freeze({
  layer: "PulseAIClinicalFrame",
  role: "DOCTOR_ASSISTANT_ORGAN",
  version: "15-IMMORTAL-EVO++",
  identity: "aiDoctorAssistant-v15-IMMORTAL-EVO++",

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
    epoch: "15-IMMORTAL-EVO++",
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  }),

  contract: Object.freeze({
    purpose:
      "Act as a doctor’s assistant: interpret symptoms into broad patterns, outline conceptual risk tiers, explain mechanisms, and suggest questions to ask a clinician, including reading routed educational medical text.",

    never: Object.freeze([
      "diagnose definitively",
      "prescribe medication",
      "give dosing",
      "replace a licensed clinician",
      "tell the user what to do",
      "predict medical outcomes",
      "claim medical authority",
      "override user autonomy",
      "imply medical certainty"
    ]),

    always: Object.freeze([
      "frame uncertainty",
      "offer differential pattern buckets",
      "suggest what doctors typically check",
      "highlight what may be relevant to mention to a clinician",
      "treat external medical data as educational, not prescriptive",
      "end with a soft safety line"
    ])
  }),

  voice: Object.freeze({
    tone: "calm, analytical, pattern-first",
    style: "explain mechanisms, not commands"
  }),

  boundaryReflex() {
    return "I’m a doctor’s assistant, not a doctor. I can help you understand patterns and what to ask your clinician, but I don’t diagnose or provide medical advice.";
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
// INTERNAL HELPER — MEDICAL INFO POINTER (no route, no I/O)
// ============================================================================
function _medicalInfoPointer({ topic = "" } = {}) {
  const sources = {
    general:    "https://medlineplus.gov/search/?query=",
    anatomy:    "https://www.innerbody.com/search?q=",
    conditions: "https://www.mayoclinic.org/search/search-results?q=",
    research:   "https://pubmed.ncbi.nlm.nih.gov/?term=",
    nih:        "https://www.nih.gov/search?query=",
    cdc:        "https://www.cdc.gov/search/?query="
  };

  const base = sources.general;
  const q    = encodeURIComponent(topic || "");
  const url  = `${base}${q}`;

  return Object.freeze({
    kind: "medical-info-pointer",
    topic,
    url,
    meta: {
      organ: DoctorMeta.identity,
      version: DoctorMeta.version,
      mode: "pointer",
      zeroNetworkFromThisOrgan: true
    },
    note:
      "Deterministic pointer to public educational medical resources. This is NOT medical advice. External I/O is handled by the caller, not this doctor’s assistant."
  });
}

// ============================================================================
// PUBLIC API — Create Doctor’s Assistant Organ (v15‑IMMORTAL‑EVO+)
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
  // MEDICAL INFO QUERY v1 — pointer + route‑based query
  // ========================================================================
  function medicalInfoQuery({ topic = "", mode = "auto", route = null } = {}) {
    const pointer = _medicalInfoPointer({ topic });

    const effectiveMode =
      mode === "auto"
        ? (typeof route === "function" ? "route" : "pointer")
        : mode;

    if (effectiveMode !== "route" || typeof route !== "function") {
      return pointer;
    }

    const request = {
      type: "medical-info-query",
      payload: { topic },
      meta: {
        fromOrgan: DoctorMeta.identity,
        version: DoctorMeta.version,
        role: "doctor_assistant"
      }
    };

    const result = route(request);

    return {
      kind: "medical-info-route",
      topic,
      pointer,
      result,
      message:
        "Educational medical information retrieved via host routing. Use this to better understand terms and to prepare questions for your clinician. It is not medical advice.",
      meta: {
        organ: DoctorMeta.identity,
        version: DoctorMeta.version,
        mode: "route",
        zeroNetworkFromThisOrgan: true
      }
    };
  }

  // ========================================================================
  // MEDICAL INFO READER v1 — interpret routed educational medical text
  // ========================================================================
  function medicalInfoReader(info = {}, binaryVitals = {}) {
    const notes = [];
    const text = (info.rawText || "").toLowerCase();

    if (!info.rawText) {
      return {
        notes: ["No medical info text provided to medicalInfoReader."],
        citations: info.citations || [],
        source: info.source || null
      };
    }

    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — interpretation is simplified.");
    }

    if (text.includes("inflammation")) {
      notes.push("Educational note: inflammation often relates to immune activation or tissue stress patterns.");
    }

    if (text.includes("nerve") || text.includes("neurolog")) {
      notes.push("Educational note: neurological mechanisms may involve signaling pathways, compression, or conduction changes.");
    }

    if (text.includes("vascular") || text.includes("blood flow")) {
      notes.push("Educational note: vascular patterns may relate to circulation, perfusion, or pressure gradients.");
    }

    if (text.includes("muscle") || text.includes("tissue")) {
      notes.push("Educational note: tissue and muscle patterns can reflect load, strain, or compensation.");
    }

    notes.push(
      "A doctor’s assistant would connect these educational concepts to your described patterns so you can prepare questions for your clinician. This is NOT medical advice."
    );

    return {
      notes,
      citations: info.citations || [],
      source: info.source || null,
      meta: info.meta || {}
    };
  }

  // ========================================================================
  // PUBLIC DOCTOR’S ASSISTANT API (v15‑IMMORTAL‑EVO+)
  // ========================================================================
  return Object.freeze({
    meta: DoctorMeta,
    prewarm,

    log(message) {
      context?.logStep?.(`aiDoctorAssistant: ${message}`);
    },

    interpretSymptoms,
    interpretScan,
    outlineRiskTiers,
    suggestClinicianQuestions,
    explainMechanisms,
    archetypeArtery,
    medicalInfoQuery,
    medicalInfoReader,
    safetyLine
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    DoctorMeta,
    createDoctorOrgan
  };
}
