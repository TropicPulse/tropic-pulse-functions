// FILE: tropic-pulse-functions/apps/pulse-ai/aiDebug.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIDebug — formats AI context (trace + diagnostics) into a clean,
//   human‑readable debug report.
//
// PURPOSE:
//   • Provide a readable diagnostic summary
//   • Help identify bad data, mismatches, drift, slowdown causes
//   • Make debugging AI behavior fast and intuitive
//
// OUTPUT:
//   • A formatted string or object representing the debug report
//
// RESPONSIBILITIES:
//   • Format trace steps
//   • Format mismatches
//   • Format missing fields
//   • Format drift
//   • Format slowdown causes
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//
// ------------------------------------------------------
// Pulse‑AI Debug Formatter
// ------------------------------------------------------

/**
 * formatDebugReport(context)
 *
 * Produces a clean, human‑readable diagnostic summary.
 */
export function formatDebugReport(context) {
  const { trace, diagnostics } = context;

  return {
    summary: buildSummary(diagnostics),
    trace: [...trace],
    mismatches: [...diagnostics.mismatches],
    missingFields: [...diagnostics.missingFields],
    slowdownCauses: [...diagnostics.slowdownCauses],
    driftDetected: diagnostics.driftDetected,
  };
}

/**
 * buildSummary(diagnostics)
 * Creates a short, readable summary of the most important issues.
 */
function buildSummary(diagnostics) {
  const summary = [];

  if (diagnostics.mismatches.length > 0) {
    summary.push(
      `⚠️ ${diagnostics.mismatches.length} field mismatches detected`
    );
  }

  if (diagnostics.missingFields.length > 0) {
    summary.push(
      `⚠️ ${diagnostics.missingFields.length} missing fields detected`
    );
  }

  if (diagnostics.driftDetected) {
    summary.push(`⚠️ Schema drift detected`);
  }

  if (diagnostics.slowdownCauses.length > 0) {
    summary.push(
      `🐢 Slowdown causes: ${diagnostics.slowdownCauses.join(", ")}`
    );
  }

  if (summary.length === 0) {
    summary.push("✅ No issues detected");
  }

  return summary;
}

/**
 * formatDebugString(context)
 *
 * Returns a pretty‑printed string version of the debug report.
 */
export function formatDebugString(context) {
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

  return out;
}
