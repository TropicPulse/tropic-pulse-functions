// ============================================================================
//  PULSE OS v7.1+ — THE EVOLUTIONARY CLINICIAN
//  Diagnostic Interpreter • Triage Specialist • Evolutionary Insight Layer
//  PURE DIAGNOSTIC TRANSFORMATION. NO LOGIC CHANGES.
// ============================================================================
//
// IDENTITY — THE EVOLUTIONARY CLINICIAN:
//  -------------------------------------
//  • Reads raw AI trace + diagnostics
//  • Classifies issues by severity
//  • Builds structured admin dashboard models
//  • Preserves trace for deep inspection
//  • Surfaces evolutionary advantages in the system
//  • Highlights patterns where the organism improved itself
//  • Provides conceptual insight (not medical advice)
//  • Helps humans understand systemic evolution through metaphor
//
// ROLE IN THE DIGITAL BODY (v7.1+):
//  --------------------------------
//  • Diagnostic Interpreter → Reads subsystem signals
//  • Triage Specialist → Highlights issues + severity
//  • Evolutionary Insight Layer → Surfaces adaptive advantages
//  • Cognitive Bridge → Helps humans understand system evolution
//  • Pure Observer → No writes, no mutations, no orchestration
//
// SAFETY CONTRACT (v7.1+):
//  ------------------------
//  • READ‑ONLY — no writes, no mutations
//  • NO eval(), NO Function(), NO dynamic imports
//  • NO executing user code
//  • NO network calls
//  • Pure diagnostic transformation
//  • No medical advice, no diagnosis, no treatment guidance
// ============================================================================

const CLINICIAN_LAYER_ID = "EVOLUTIONARY-CLINICIAN-LAYER";
const CLINICIAN_LAYER_NAME = "THE EVOLUTIONARY CLINICIAN";
const CLINICIAN_LAYER_ROLE = "Diagnostic Interpreter + Evolutionary Insight Layer";

const CLINICIAN_DIAGNOSTICS_ENABLED =
  process?.env?.PULSE_CLINICIAN_DIAGNOSTICS === "true" ||
  process?.env?.PULSE_DIAGNOSTICS === "true";

const clinicianLog = (stage, details = {}) => {
  if (!CLINICIAN_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: CLINICIAN_LAYER_ID,
      pulseName: CLINICIAN_LAYER_NAME,
      pulseRole: CLINICIAN_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

clinicianLog("CLINICIAN_INIT", {});


// ============================================================================
// PUBLIC API — Build Admin Panel Model
// ============================================================================
export function buildAdminPanelModel(context, options = {}) {
  clinicianLog("BUILD_MODEL_START");

  const { trace, diagnostics } = context;

  const summaryCards = buildSummaryCards(diagnostics);
  const issueList = buildIssueList(diagnostics);

  const model = {
    summaryCards,
    issueList,
    trace: [...trace],
    meta: {
      personaId: context.personaId,
      driftDetected: diagnostics.driftDetected,
      totalIssues: issueList.length,
      generatedAt: new Date().toISOString(),
      ...options.meta,
    },
  };

  clinicianLog("BUILD_MODEL_COMPLETE", {
    totalIssues: model.meta.totalIssues
  });

  return model;
}

// ============================================================================
// SUMMARY CARDS — Clinical Overview
// ============================================================================
function buildSummaryCards(diagnostics) {
  clinicianLog("SUMMARY_CARDS_START");

  const cards = [];

  const mismatchCount = diagnostics.mismatches.length;
  const missingCount = diagnostics.missingFields.length;
  const slowdownCount = diagnostics.slowdownCauses.length;
  const drift = diagnostics.driftDetected;

  cards.push({
    id: "overall-health",
    title: "Overall Health",
    icon: drift || mismatchCount || missingCount ? "warning" : "check",
    severity: drift || mismatchCount || missingCount ? "warning" : "ok",
    description: drift
      ? "Schema drift detected. Review issues below."
      : mismatchCount || missingCount
      ? "Some data issues detected. Review details below."
      : "No major issues detected.",
  });

  cards.push({
    id: "mismatches",
    title: "Field Mismatches",
    icon: mismatchCount ? "error" : "check",
    severity: mismatchCount ? "error" : "ok",
    count: mismatchCount,
    description: mismatchCount
      ? `${mismatchCount} fields have type or schema mismatches.`
      : "No mismatched fields detected.",
  });

  cards.push({
    id: "missing-fields",
    title: "Missing Fields",
    icon: missingCount ? "warning" : "check",
    severity: missingCount ? "warning" : "ok",
    count: missingCount,
    description: missingCount
      ? `${missingCount} expected fields are missing.`
      : "No missing fields detected.",
  });

  cards.push({
    id: "performance",
    title: "Performance Signals",
    icon: slowdownCount ? "turtle" : "bolt",
    severity: slowdownCount ? "warning" : "ok",
    count: slowdownCount,
    description: slowdownCount
      ? `${slowdownCount} potential slowdown causes detected.`
      : "No slowdown patterns detected.",
  });

  cards.push({
    id: "drift",
    title: "Schema Drift",
    icon: drift ? "split" : "link",
    severity: drift ? "error" : "ok",
    description: drift
      ? "Schema drift detected between Pulse and data source."
      : "No schema drift detected.",
  });

  clinicianLog("SUMMARY_CARDS_COMPLETE", { count: cards.length });
  return cards;
}

// ============================================================================
// ISSUE LIST — Clinical Triage Table
// ============================================================================
function buildIssueList(diagnostics) {
  clinicianLog("ISSUE_LIST_START");

  const issues = [];

  diagnostics.mismatches.forEach((m) => {
    issues.push({
      type: "mismatch",
      severity: "error",
      field: m.field,
      message: `Field "${m.field}" mismatch: expected ${m.expected}, got ${m.actual}`,
      hint: "Align this field's type/value with the Pulse schema.",
    });
  });

  diagnostics.missingFields.forEach((f) => {
    issues.push({
      type: "missing",
      severity: "warning",
      field: f,
      message: `Missing field "${f}"`,
      hint: "Add this field or update the schema if it's no longer required.",
    });
  });

  diagnostics.slowdownCauses.forEach((reason, index) => {
    issues.push({
      type: "slowdown",
      severity: "warning",
      field: null,
      message: `Potential slowdown cause: ${reason}`,
      hint: "Consider simplifying or splitting this data to improve AI performance.",
      id: `slowdown-${index}`,
    });
  });

  if (diagnostics.driftDetected) {
    issues.push({
      type: "drift",
      severity: "error",
      field: null,
      message: "Schema drift detected between Pulse and data source.",
      hint: "Run a full audit and align schemas before deploying changes.",
    });
  }

  clinicianLog("ISSUE_LIST_COMPLETE", { count: issues.length });
  return issues;
}
