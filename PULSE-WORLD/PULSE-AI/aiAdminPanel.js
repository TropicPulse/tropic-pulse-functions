// ============================================================================
//  PULSE OS v11.2‑EVO — ADMIN PANEL DIAGNOSTICS ORGAN
//  Summary Cards • Issue Table • Trace • Meta
//  PURE OBSERVATION. ZERO MUTATION. ZERO IDENTITY LEAKAGE.
// ============================================================================

export const AdminDiagnosticsMeta = Object.freeze({
  layer: "PulseAIAdminDiagnosticsFrame",
  role: "ADMIN_DIAGNOSTICS_ORGAN",
  version: "11.2-EVO",
  identity: "aiAdminDiagnostics-v11.2-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    windowAware: true,          // safe for UI surfaces
    packetAware: false,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Transform diagnostics into UI-facing structures",
      "Provide summary cards, issue lists, and trace output",
      "Support admin dashboards and debugging tools",
      "Stay read-only and identity-safe"
    ]),
    never: Object.freeze([
      "mutate diagnostics",
      "modify context",
      "expose identity anchors",
      "write to external systems",
      "change organism state"
    ]),
    always: Object.freeze([
      "summarize",
      "structure",
      "format",
      "stay deterministic",
      "stay ego-free",
      "stay admin-facing only"
    ])
  })
});

// ============================================================================
//  PUBLIC API — Create Admin Diagnostics Organ
// ============================================================================
export function createAdminDiagnosticsOrgan(context) {
  const diagnostics = context?.diagnostics || {};
  const trace = Array.isArray(context?.trace) ? [...context.trace] : [];

  // --------------------------------------------------------------------------
  // SUMMARY CARDS
  // --------------------------------------------------------------------------
  function buildSummaryCards() {
    const mismatchCount = diagnostics.mismatches?.length || 0;
    const missingCount = diagnostics.missingFields?.length || 0;
    const slowdownCount = diagnostics.slowdownCauses?.length || 0;
    const drift = diagnostics.driftDetected === true;

    return Object.freeze([
      {
        id: "overall-health",
        title: "Overall Health",
        icon: drift || mismatchCount || missingCount ? "warning" : "check",
        severity: drift || mismatchCount || missingCount ? "warning" : "ok",
        description:
          drift
            ? "Schema drift detected."
            : mismatchCount || missingCount
            ? "Data issues detected."
            : "No major issues detected."
      },
      {
        id: "mismatches",
        title: "Field Mismatches",
        icon: mismatchCount ? "error" : "check",
        severity: mismatchCount ? "error" : "ok",
        count: mismatchCount,
        description:
          mismatchCount
            ? `${mismatchCount} mismatched fields.`
            : "No mismatched fields."
      },
      {
        id: "missing-fields",
        title: "Missing Fields",
        icon: missingCount ? "warning" : "check",
        severity: missingCount ? "warning" : "ok",
        count: missingCount,
        description:
          missingCount
            ? `${missingCount} missing fields.`
            : "No missing fields."
      },
      {
        id: "performance",
        title: "Performance Signals",
        icon: slowdownCount ? "turtle" : "bolt",
        severity: slowdownCount ? "warning" : "ok",
        count: slowdownCount,
        description:
          slowdownCount
            ? `${slowdownCount} slowdown patterns detected.`
            : "No slowdown patterns."
      },
      {
        id: "drift",
        title: "Schema Drift",
        icon: drift ? "split" : "link",
        severity: drift ? "error" : "ok",
        description: drift ? "Schema drift detected." : "No schema drift."
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // ISSUE LIST
  // --------------------------------------------------------------------------
  function buildIssueList() {
    const issues = [];

    (diagnostics.mismatches || []).forEach((m) => {
      issues.push({
        type: "mismatch",
        severity: "error",
        key: m.key,
        message: `Field "${m.key}" mismatch: expected ${m.expected}, got ${m.actual}`,
        hint: "Align this field with the Pulse schema."
      });
    });

    (diagnostics.missingFields || []).forEach((f) => {
      issues.push({
        type: "missing",
        severity: "warning",
        key: f.key,
        message: `Missing field "${f.key}"`,
        hint: "Add this field or update the schema."
      });
    });

    (diagnostics.slowdownCauses || []).forEach((s, index) => {
      issues.push({
        type: "slowdown",
        severity: "warning",
        key: null,
        message: `Potential slowdown cause: ${s.reason}`,
        hint: "Consider simplifying this data.",
        id: `slowdown-${index}`
      });
    });

    if (diagnostics.driftDetected) {
      issues.push({
        type: "drift",
        severity: "error",
        key: null,
        message: "Schema drift detected.",
        hint: "Run a full audit and align schemas."
      });
    }

    return Object.freeze(issues);
  }

  // --------------------------------------------------------------------------
  // PUBLIC ADMIN DIAGNOSTICS API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: AdminDiagnosticsMeta,

    log(message) {
      context?.logStep?.(`aiAdminDiagnostics: ${message}`);
    },

    buildModel(options = {}) {
      const summaryCards = buildSummaryCards();
      const issueList = buildIssueList();

      return Object.freeze({
        summaryCards,
        issueList,
        trace,
        meta: Object.freeze({
          personaId: context.personaId,
          driftDetected: diagnostics.driftDetected === true,
          totalIssues: issueList.length,
          ...options.meta
        })
      });
    }
  });
}
