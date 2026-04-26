// ============================================================================
//  PULSE OS v11‑EVO — CLINICIAN ORGAN
//  Diagnostic Interpreter • Triage Specialist • System Health Auditor
//  PURE OBSERVATION. ZERO MEDICAL ADVICE. ZERO MUTATION.
// ============================================================================

export const ClinicianMeta = Object.freeze({
  layer: "PulseAIClinicianFrame",
  role: "CLINICIAN_ORGAN",
  version: "11.0-EVO",
  identity: "aiClinician-v11-EVO",

  evo: Object.freeze({
    // Core identity
    driftProof: true,
    deterministic: true,
    dualband: true,

    // Awareness
    binaryAware: true,
    symbolicAware: true,
    diagnosticsAware: true,
    routingAware: true,
    contextAware: true,
    observerOnly: true,

    // Evolutionary flags
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Safety
    identitySafe: true,
    readOnly: true,

    // Lifecycle
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: [
      "Interpret AI diagnostics state",
      "Summarize mismatches, drift, and slowdown causes",
      "Provide safe, identity-free admin snapshots",
      "Support debugging and system introspection",
      "Act as a non-medical fact-checker for AI behavior"
    ],

    never: [
      "diagnose medical conditions",
      "interpret real scans as medical advice",
      "modify system architecture",
      "mutate identity or permissions"
    ],

    always: [
      "stay observer-only",
      "stay deterministic",
      "stay identity-safe",
      "stay schema-aware"
    ]
  })
});

// ============================================================================
// PUBLIC API — Create Clinician Organ
// ============================================================================
export function createClinicianOrgan(context) {
  const diagnostics = context?.diagnostics || {};
  const trace = Array.isArray(context?.trace) ? [...context.trace] : [];

  // --------------------------------------------------------------------------
  // SUMMARY BUILDER
  // --------------------------------------------------------------------------
  function buildSummary() {
    return {
      mismatches: diagnostics.mismatches?.length || 0,
      missingFields: diagnostics.missingFields?.length || 0,
      slowdown: diagnostics.slowdownCauses?.length || 0,
      drift: diagnostics.driftDetected === true
    };
  }

  // --------------------------------------------------------------------------
  // SAFE CONTEXT SNAPSHOT
  // --------------------------------------------------------------------------
  function buildSafeContext() {
    return {
      personaId: context.personaId,
      userIsOwner: context.userIsOwner === true,
      permissions: context.permissions || null,
      boundaries: context.boundaries || null
    };
  }

  // --------------------------------------------------------------------------
  // FLAG SUMMARY
  // --------------------------------------------------------------------------
  function buildFlags() {
    return [
      ...(diagnostics.mismatches?.length ? [{ type: "mismatch" }] : []),
      ...(diagnostics.missingFields?.length ? [{ type: "missing" }] : []),
      ...(diagnostics.slowdownCauses?.length ? [{ type: "slowdown" }] : []),
      ...(diagnostics.driftDetected ? [{ type: "drift" }] : [])
    ];
  }

  // --------------------------------------------------------------------------
  // PUBLIC CLINICIAN API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: ClinicianMeta,

    log(message) {
      context?.logStep?.(`aiClinician: ${message}`);
    },

    buildModel() {
      return Object.freeze({
        summary: buildSummary(),
        safeContext: buildSafeContext(),
        trace,
        flags: buildFlags(),
        meta: ClinicianMeta
      });
    }
  });
}
