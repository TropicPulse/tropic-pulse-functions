// ============================================================================
//  aiDiagnostics.js — Pulse OS v12.3‑Presence
//  Diagnostics Organ • Drift Tracker • Mismatch Ledger • Slowdown Sensor
//  PURE OBSERVATION. ZERO RANDOMNESS. ZERO MUTATION.
// ============================================================================

export const DiagnosticsMeta = Object.freeze({
  layer: "PulseAIDiagnosticsFrame",
  role: "DIAGNOSTICS_ORGAN",
  version: "12.3-Presence",
  identity: "aiDiagnostics-v12.3-Presence",

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

    packetAware: true,
    presenceAware: true,
    windowAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    epoch: "12.3-Presence"
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
  }),

  presence: Object.freeze({
    organId: "DiagnosticsOrgan",
    organKind: "Observer",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-context",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "state-created",
        "context-attached",
        "api-created"
      ]
    }
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, diagnostics-scoped
// ============================================================================
function emitDiagnosticsPacket(type, payload = {}) {
  return Object.freeze({
    meta: DiagnosticsMeta,
    packetType: `diagnostics-${type}`,
    timestamp: Date.now(),
    epoch: DiagnosticsMeta.evo.epoch,
    layer: DiagnosticsMeta.layer,
    role: DiagnosticsMeta.role,
    identity: DiagnosticsMeta.identity,
    ...payload
  });
}

// ============================================================================
//  DIAGNOSTICS PREWARM ENGINE — v12.3‑Presence
// ============================================================================
export function prewarmDiagnosticsOrgan() {
  try {
    const warmState = createDiagnosticsState();

    const api = createDiagnosticsAPI();
    api.flagMismatch("prewarm", "expected", "actual");
    api.flagMissingField("missingField");
    api.flagSlowdown("prewarm");
    api.flagDrift("prewarm drift");

    const warmContext = { trace: [] };
    attachDiagnosticsOrgan(warmContext);

    warmContext.flagMismatch("key", "expected", "actual");
    warmContext.flagMissingField("missing");
    warmContext.flagSlowdown("prewarm");
    warmContext.flagDrift("prewarm drift");

    return emitDiagnosticsPacket("prewarm", {
      message: "Diagnostics organ prewarmed and observation pathways aligned.",
      warmStateTimestamp: warmState.timestamp
    });
  } catch (err) {
    console.error("[Diagnostics Prewarm] Failed:", err);
    return emitDiagnosticsPacket("prewarm-error", {
      error: String(err),
      message: "Diagnostics organ prewarm failed."
    });
  }
}

// ============================================================================
//  FACTORY — Create Diagnostics State
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
//  ATTACH HELPERS — Bind Diagnostics to a Context
// ============================================================================
export function attachDiagnosticsOrgan(context) {
  if (!context) return context;

  const diagnostics = createDiagnosticsState();
  context.diagnostics = diagnostics;

  context.flagMismatch = (key, expected, actual) => {
    diagnostics.mismatches.push({ key, expected, actual });
    context.trace?.push?.(
      `Mismatch: ${key} expected ${expected}, got ${actual}`
    );
  };

  context.flagMissingField = (key) => {
    diagnostics.missingFields.push({ key });
    context.trace?.push?.(`Missing field: ${key}`);
  };

  context.flagSlowdown = (reason) => {
    diagnostics.slowdownCauses.push({ reason });
    context.trace?.push?.(`Slowdown cause: ${reason}`);
  };

  context.flagDrift = (description) => {
    diagnostics.driftDetected = true;
    diagnostics.driftEvents.push({ description });
    context.trace?.push?.(`Drift detected: ${description}`);
  };

  return context;
}

// ============================================================================
//  STANDALONE DIAGNOSTICS API — No Context Mutation
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

// ============================================================================
//  BOOT PREWARM + DUAL‑MODE EXPORTS
// ============================================================================
prewarmDiagnosticsOrgan();

if (typeof module !== "undefined") {
  module.exports = {
    DiagnosticsMeta,
    createDiagnosticsState,
    attachDiagnosticsOrgan,
    createDiagnosticsAPI,
    prewarmDiagnosticsOrgan
  };
}
