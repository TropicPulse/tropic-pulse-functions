// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiDebug.js
// LAYER: THE SCRIBE (Diagnostic Recorder + Evolutionary Report Formatter)
// ============================================================================
//
// ROLE (v7.1+):
//   THE SCRIBE — The recorder of Pulse OS diagnostics.
//   • Formats AI context into readable debug reports.
//   • Summarizes mismatches, drift, slowdown, missing fields.
//   • Outputs human‑friendly diagnostic strings + objects.
//   • Surfaces evolutionary patterns in system behavior (conceptual only).
//
// PURPOSE (v7.1+):
//   • Provide a clean, readable diagnostic summary.
//   • Make debugging AI behavior fast + intuitive.
//   • Present trace + issues in a structured format.
//   • Act as the “historian” of the organism — recording what happened.
//   • Provide conceptual insight into system evolution (not medical).
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Pure formatting + summarization.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 aiDebug.
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const SCRIBE_LAYER_ID = "SCRIBE-LAYER";
const SCRIBE_LAYER_NAME = "THE SCRIBE";
const SCRIBE_LAYER_ROLE = "Diagnostic Recorder + Evolutionary Report Formatter";

const SCRIBE_DIAGNOSTICS_ENABLED =
  process?.env?.PULSE_SCRIBE_DIAGNOSTICS === "true" ||
  process?.env?.PULSE_DIAGNOSTICS === "true";

const scribeLog = (stage, details = {}) => {
  if (!SCRIBE_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: SCRIBE_LAYER_ID,
      pulseName: SCRIBE_LAYER_NAME,
      pulseRole: SCRIBE_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

scribeLog("SCRIBE_INIT", {});

// ============================================================================
// PUBLIC API — Build Debug Report (Object)
// ============================================================================
export function formatDebugReport(context) {
  scribeLog("FORMAT_REPORT_START");

  const { trace, diagnostics } = context;

  const report = {
    summary: buildSummary(diagnostics),
    trace: [...trace],
    mismatches: [...diagnostics.mismatches],
    missingFields: [...diagnostics.missingFields],
    slowdownCauses: [...diagnostics.slowdownCauses],
    driftDetected: diagnostics.driftDetected,
  };

  scribeLog("FORMAT_REPORT_COMPLETE", {
    summaryLines: report.summary.length,
    traceLength: report.trace.length
  });

  return report;
}

// ============================================================================
// SUMMARY BUILDER — Evolutionary Summary Lines
// ============================================================================
function buildSummary(diagnostics) {
  scribeLog("SUMMARY_START");

  const summary = [];

  if (diagnostics.mismatches.length > 0) {
    summary.push(`⚠️ ${diagnostics.mismatches.length} field mismatches detected`);
  }

  if (diagnostics.missingFields.length > 0) {
    summary.push(`⚠️ ${diagnostics.missingFields.length} missing fields detected`);
  }

  if (diagnostics.driftDetected) {
    summary.push(`⚠️ Schema drift detected`);
  }

  if (diagnostics.slowdownCauses.length > 0) {
    summary.push(`🐢 Slowdown causes: ${diagnostics.slowdownCauses.join(", ")}`);
  }

  if (summary.length === 0) {
    summary.push("✅ No issues detected");
  }

  scribeLog("SUMMARY_COMPLETE", { lines: summary.length });
  return summary;
}

// ============================================================================
// STRING FORMATTER — Pretty Printed Debug Report
// ============================================================================
export function formatDebugString(context) {
  scribeLog("FORMAT_STRING_START");

  const report = formatDebugReport(context);

  let out = "\n=== AI DEBUG REPORT ===\n\n";

  out += "SUMMARY:\n";
  report.summary.forEach((line) => {
    out += `  - ${line}\n`;
  });

  out += "\nTRACE:\n";
  report.trace.forEach((step, i) => {
    out += `  ${i + 1}. ${step}\n`;
  });

  if (report.mismatches.length > 0) {
    out += "\nMISMATCHES:\n";
    report.mismatches.forEach((m) => {
      out += `  - Field "${m.field}": expected ${m.expected}, got ${m.actual}\n`;
    });
  }

  if (report.missingFields.length > 0) {
    out += "\nMISSING FIELDS:\n";
    report.missingFields.forEach((f) => {
      out += `  - ${f}\n`;
    });
  }

  if (report.slowdownCauses.length > 0) {
    out += "\nSLOWDOWN CAUSES:\n";
    report.slowdownCauses.forEach((s) => {
      out += `  - ${s}\n`;
    });
  }

  out += `\nDRIFT DETECTED: ${report.driftDetected ? "YES" : "NO"}\n`;

  out += "\n========================\n";

  scribeLog("FORMAT_STRING_COMPLETE");
  return out;
}
