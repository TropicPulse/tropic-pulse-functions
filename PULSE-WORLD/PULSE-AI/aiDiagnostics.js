// ============================================================================
//  PULSE OS v11‑EVO — DIAGNOSTICS ORGAN
//  Drift Tracker • Mismatch Ledger • Slowdown Sensor • Integrity Surface
//  PURE OBSERVATION. ZERO RANDOMNESS. ZERO MUTATION.
// ============================================================================

export const DiagnosticsMeta = Object.freeze({
  layer: "PulseAIDiagnosticsFrame",
  role: "DIAGNOSTICS_ORGAN",
  version: "11.0-EVO",
  identity: "aiDiagnostics-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    diagnosticsAware: true,
    patternAware: true,
    schemaAware: true,
    observerOnly: true,
    architectAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide deterministic diagnostics state for any AI context",
      "Record mismatches, drift, missing fields, and slowdown causes",
      "Expose safe, read-only observation surfaces",
      "Support organism-level introspection without mutation"
    ]),

    never: Object.freeze([
      "mutate context identity",
      "modify system architecture",
      "write to external systems",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "observe",
      "record",
      "annotate",
      "stay deterministic"
    ])
  })
});


// ============================================================================
// FACTORY — Create Diagnostics State
// ============================================================================
export function createDiagnosticsState() {
  return {
    mismatches: [],
    missingFields: [],
    slowdownCauses: [],
    driftEvents: [],
    driftDetected: false,
    timestamp: Date.now()
  };
}

// ============================================================================
// ATTACH HELPERS — Bind Diagnostics to a Context
// ============================================================================
export function attachDiagnosticsOrgan(context) {
  if (!context) return context;

  const diagnostics = createDiagnosticsState();
  context.diagnostics = diagnostics;

  // --------------------------------------------------------------------------
  // MISMATCH — expected vs actual
  // --------------------------------------------------------------------------
  context.flagMismatch = (key, expected, actual) => {
    diagnostics.mismatches.push({ key, expected, actual });
    context.trace?.push?.(`Mismatch: ${key} expected ${expected}, got ${actual}`);
  };

  // --------------------------------------------------------------------------
  // MISSING FIELD — required but absent
  // --------------------------------------------------------------------------
  context.flagMissingField = (key) => {
    diagnostics.missingFields.push({ key });
    context.trace?.push?.(`Missing field: ${key}`);
  };

  // --------------------------------------------------------------------------
  // SLOWDOWN — performance / payload concerns
  // --------------------------------------------------------------------------
  context.flagSlowdown = (reason) => {
    diagnostics.slowdownCauses.push({ reason });
    context.trace?.push?.(`Slowdown cause: ${reason}`);
  };

  // --------------------------------------------------------------------------
  // DRIFT — schema / behavior divergence
  // --------------------------------------------------------------------------
  context.flagDrift = (description) => {
    diagnostics.driftDetected = true;
    diagnostics.driftEvents.push({ description });
    context.trace?.push?.(`Drift detected: ${description}`);
  };

  return context;
}

// ============================================================================
// STANDALONE DIAGNOSTICS API — No Context Mutation
// ============================================================================
export function createDiagnosticsAPI() {
  const diagnostics = createDiagnosticsState();

  function flagMismatch(key, expected, actual) {
    diagnostics.mismatches.push({ key, expected, actual });
  }

  function flagMissingField(key) {
    diagnostics.missingFields.push({ key });
  }

  function flagSlowdown(reason) {
    diagnostics.slowdownCauses.push({ reason });
  }

  function flagDrift(description) {
    diagnostics.driftDetected = true;
    diagnostics.driftEvents.push({ description });
  }

  return Object.freeze({
    meta: DiagnosticsMeta,
    diagnostics,
    flagMismatch,
    flagMissingField,
    flagSlowdown,
    flagDrift
  });
}
