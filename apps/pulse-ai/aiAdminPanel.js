// FILE: tropic-pulse-functions/apps/pulse-ai/aiAdminPanel.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIAdminPanel — shapes AI debug context into a UI‑ready model
//   for an admin dashboard (sections, severities, icons, actions).
//
// PURPOSE:
//   • Turn raw trace + diagnostics into a structured admin view
//   • Classify issues by severity (error / warning / info / ok)
//   • Provide per‑field issue objects for clickable UI
//
// OUTPUT:
//   • AdminPanelModel: { summaryCards, issueList, trace, meta }
//
// RESPONSIBILITIES:
//   • Map diagnostics → summary cards
//   • Map mismatches/missing/drift/slowdown → issue list
//   • Preserve trace for deep inspection
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//
// ------------------------------------------------------
// Pulse‑AI Admin Panel Model
// ------------------------------------------------------

/**
 * buildAdminPanelModel(context, options?)
 *
 * Returns:
 * {
 *   summaryCards: [...],
 *   issueList: [...],
 *   trace: [...],
 *   meta: {...}
 * }
 */
export function buildAdminPanelModel(context, options = {}) {
  const { trace, diagnostics } = context;

  const summaryCards = buildSummaryCards(diagnostics);
  const issueList = buildIssueList(diagnostics);

  return {
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
}

/**
 * buildSummaryCards(diagnostics)
 * Produces high‑level cards for the top of the admin dashboard.
 */
function buildSummaryCards(diagnostics) {
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

  return cards;
}

/**
 * buildIssueList(diagnostics)
 * Produces a flat list of issues for table/list rendering.
 */
function buildIssueList(diagnostics) {
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

  return issues;
}
