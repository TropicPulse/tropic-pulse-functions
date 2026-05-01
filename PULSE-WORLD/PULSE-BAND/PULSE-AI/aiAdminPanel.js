// ============================================================================
//  PULSE OS v12.3‑EVO+ — ADMIN PANEL DIAGNOSTICS ORGAN
//  Summary Cards • Issue Table • Trace • Meta • Diagnostics-Artery v3
//  PURE OBSERVATION. ZERO MUTATION. ZERO IDENTITY LEAKAGE.
// ============================================================================

export const AdminDiagnosticsMeta = Object.freeze({
  layer: "PulseAIAdminDiagnosticsFrame",
  role: "ADMIN_DIAGNOSTICS_ORGAN",
  version: "12.3-EVO+",
  identity: "aiAdminDiagnostics-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    windowAware: true,
    packetAware: false,
    readOnly: true,
    multiInstanceReady: true,
    diagnosticsArteryAware: true,
    epoch: "12.3-EVO+"
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
  if (v > 0)   return "low";
  return "none";
}

// ============================================================================
//  PUBLIC API — Create Admin Diagnostics Organ (v12.3‑EVO+)
// ============================================================================
export function createAdminDiagnosticsOrgan(context = {}) {
  const diagnostics = context?.diagnostics || {};
  const trace = Array.isArray(context?.trace) ? [...context.trace] : [];

  function prewarm() {
    return true;
  }

  // --------------------------------------------------------------------------
  // SUMMARY CARDS v3 — binary-pressure-aware
  // --------------------------------------------------------------------------
  function buildSummaryCards(binaryVitals = {}) {
    const mismatchCount = diagnostics.mismatches?.length || 0;
    const missingCount = diagnostics.missingFields?.length || 0;
    const slowdownCount = diagnostics.slowdownCauses?.length || 0;
    const drift = diagnostics.driftDetected === true;

    const binaryPressure = extractBinaryPressure(binaryVitals);

    const simplified = binaryPressure >= 0.7;

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
        count: simplified ? Math.min(mismatchCount, 5) : mismatchCount,
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
        count: simplified ? Math.min(missingCount, 5) : missingCount,
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
        count: simplified ? Math.min(slowdownCount, 5) : slowdownCount,
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
  // ISSUE LIST v3 — binary-pressure-aware
  // --------------------------------------------------------------------------
  function buildIssueList(binaryVitals = {}) {
    const issues = [];

    const binaryPressure = extractBinaryPressure(binaryVitals);
    const simplified = binaryPressure >= 0.7;

    (diagnostics.mismatches || []).forEach((m, index) => {
      if (simplified && index >= 10) return;
      issues.push({
        type: "mismatch",
        severity: "error",
        key: m.key,
        message: `Field "${m.key}" mismatch: expected ${m.expected}, got ${m.actual}`,
        hint: "Align this field with the Pulse schema."
      });
    });

    (diagnostics.missingFields || []).forEach((f, index) => {
      if (simplified && index >= 10) return;
      issues.push({
        type: "missing",
        severity: "warning",
        key: f.key,
        message: `Missing field "${f.key}"`,
        hint: "Add this field or update the schema."
      });
    });

    (diagnostics.slowdownCauses || []).forEach((s, index) => {
      if (simplified && index >= 10) return;
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
  // ADMIN DIAGNOSTICS ARTERY v3 — symbolic-only, deterministic
  // --------------------------------------------------------------------------
  function diagnosticsArtery({ binaryVitals = {} } = {}) {
    const mismatchCount = diagnostics.mismatches?.length || 0;
    const missingCount = diagnostics.missingFields?.length || 0;
    const slowdownCount = diagnostics.slowdownCauses?.length || 0;
    const drift = diagnostics.driftDetected === true;

    const binaryPressure = extractBinaryPressure(binaryVitals);

    const localPressure =
      (mismatchCount ? 0.3 : 0) +
      (missingCount ? 0.2 : 0) +
      (slowdownCount ? 0.3 : 0) +
      (drift ? 0.4 : 0);

    const pressure = Math.max(
      0,
      Math.min(1, 0.6 * localPressure + 0.4 * binaryPressure)
    );

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      diagnostics: {
        mismatches: mismatchCount,
        missingFields: missingCount,
        slowdown: slowdownCount,
        drift
      }
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC ADMIN DIAGNOSTICS API (v12.3‑EVO+)
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: AdminDiagnosticsMeta,
    prewarm,

    log(message) {
      context?.logStep?.(`aiAdminDiagnostics: ${message}`);
    },

    buildModel({ binaryVitals = {}, meta = {} } = {}) {
      const summaryCards = buildSummaryCards(binaryVitals);
      const issueList = buildIssueList(binaryVitals);

      return Object.freeze({
        summaryCards,
        issueList,
        trace,
        artery: diagnosticsArtery({ binaryVitals }),
        meta: Object.freeze({
          personaId: context.personaId,
          driftDetected: diagnostics.driftDetected === true,
          totalIssues: issueList.length,
          ...meta
        })
      });
    },

    diagnosticsArtery
  });
}
