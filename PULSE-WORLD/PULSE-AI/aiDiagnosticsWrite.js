// ============================================================================
//  PULSE OS v11‑EVO — DIAGNOSTICS WRITE ORGAN
//  Safe Logger • Identity‑Stripped • Deterministic Write Surface
//  PURE LOGGING. ZERO IDENTITY. ZERO MUTATION.
// ============================================================================

export const DiagnosticsWriteMeta = Object.freeze({
  layer: "PulseAIDiagnosticsWriteFrame",
  role: "DIAGNOSTICS_WRITE_ORGAN",
  version: "11.0-EVO",
  identity: "aiDiagnosticsWrite-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    writeAware: true,
    logAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: "Safely store AI runs into a logging backend without identity anchors.",
    never: Object.freeze([
      "store user identifiers",
      "store device fingerprints",
      "store session roots",
      "mutate logs after write"
    ]),
    always: Object.freeze([
      "strip identity",
      "write deterministically",
      "preserve diagnostics",
      "preserve trace",
      "preserve routing snapshot"
    ])
  })
});


// ============================================================================
// PUBLIC API — Create Diagnostics Write Organ
// ============================================================================
export function createDiagnosticsWriteOrgan({ context, backend }) {

  // --------------------------------------------------------------------------
  // IDENTITY STRIPPER
  // --------------------------------------------------------------------------
  function stripIdentity(obj) {
    if (!obj || typeof obj !== "object") return obj;

    const clone = { ...obj };
    delete clone.userId;
    delete clone.uid;
    delete clone.resendToken;
    delete clone.identityRoot;
    delete clone.sessionRoot;
    delete clone.deviceFingerprint;

    return clone;
  }

  // --------------------------------------------------------------------------
  // WRITE LOG ENTRY
  // --------------------------------------------------------------------------
  async function writeRun({ result }) {
    const timestamp = Date.now();
    const docId = `${context.personaId || "unknown"}-${timestamp}`;

    const safePayload = {
      personaId: context.personaId,
      userIsOwner: context.userIsOwner || false,
      timestamp,

      result: stripIdentity(result),
      diagnostics: stripIdentity(context.diagnostics),
      trace: Array.isArray(context.trace) ? [...context.trace] : [],
      routing: stripIdentity(context.routing),

      scribeReport: stripIdentity(context.scribeReport),
      clinicianReport: stripIdentity(context.clinicianReport)
    };

    await backend.write(`AI_LOGS/${docId}`, safePayload);

    return {
      ok: true,
      id: docId,
      message: "Diagnostics written safely (identity stripped)."
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: DiagnosticsWriteMeta,

    log(message) {
      context?.logStep?.(`aiDiagnosticsWrite: ${message}`);
    },

    writeRun
  });
}
// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------

// ESM
export {
  DiagnosticsWriteMeta,
  createDiagnosticsWriteOrgan
};

// CommonJS
if (typeof module !== "undefined") {
  module.exports = {
    DiagnosticsWriteMeta,
    createDiagnosticsWriteOrgan
  };
}
