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
    driftProof: true,
    deterministic: true,
    dualband: true,

    binaryAware: true,
    symbolicAware: true,
    diagnosticsAware: true,
    routingAware: true,
    contextAware: true,
    observerOnly: true,

    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    identitySafe: true,
    readOnly: true,

    packetAware: true,
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

    never: Object.freeze([
      "diagnose medical conditions",
      "interpret real scans as medical advice",
      "modify system architecture",
      "mutate identity or permissions",
      "introduce randomness",
      "override routing or persona logic"
    ]),

    always: Object.freeze([
      "stay observer-only",
      "stay deterministic",
      "stay identity-safe",
      "stay schema-aware",
      "emit deterministic clinician packets"
    ])
  })
});

// ============================================================================
//  CLINICIAN ORGAN IMPLEMENTATION
// ============================================================================

export function createClinicianOrgan(context = {}) {
  const diagnostics = context.diagnostics || {};
  const trace = Array.isArray(context.trace) ? [...context.trace] : [];

  function buildSummary() {
    return Object.freeze({
      mismatches: diagnostics.mismatches?.length || 0,
      missingFields: diagnostics.missingFields?.length || 0,
      slowdown: diagnostics.slowdownCauses?.length || 0,
      drift: diagnostics.driftDetected === true
    });
  }

  function buildSafeContext() {
    return Object.freeze({
      personaId: context.personaId,
      userIsOwner: context.userIsOwner === true,
      permissions: context.permissions || null,
      boundaries: context.boundaries || null
    });
  }

  function buildFlags() {
    return Object.freeze([
      ...(diagnostics.mismatches?.length ? [{ type: "mismatch" }] : []),
      ...(diagnostics.missingFields?.length ? [{ type: "missing" }] : []),
      ...(diagnostics.slowdownCauses?.length ? [{ type: "slowdown" }] : []),
      ...(diagnostics.driftDetected ? [{ type: "drift" }] : [])
    ]);
  }

  function buildPacket() {
    const payload = {
      type: "clinician-snapshot",
      timestamp: Date.now(),
      summary: buildSummary(),
      flags: buildFlags()
    };

    const json = JSON.stringify(payload);

    const bits = context.encoder?.encode
      ? context.encoder.encode(json)
      : null;

    return Object.freeze({
      ...payload,
      bits,
      bitLength: bits ? bits.length : 0
    });
  }

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
    },

    emitPacket() {
      return buildPacket();
    }
  });
}

// ============================================================================
//  ESM EXPORTS
// ============================================================================
export {
  createClinicianOrgan
};

export default createClinicianOrgan;

// ============================================================================
//  COMMONJS FALLBACK EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    ClinicianMeta,
    createClinicianOrgan,
    default: createClinicianOrgan
  };
}
