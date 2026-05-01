// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryImpulse.js
//  PULSE OS v11‑EVO‑PRIME — UI IMPULSE ORGAN (UPGRADED)
//  “THE UI → CNS SIGNAL LAYER”
//  Deterministic • Dual‑Band • Binary‑Native • Drift‑Proof
// ============================================================================

export const ImpulseRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "Impulse",
  version: "11.3-Evo-Prime",
  identity: "PulseEvolutionaryImpulse",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    impulseEmitter: true,
    routeAware: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  FACTORY — creates the impulse organ
// ============================================================================
export function createPulseEvolutionaryImpulse({
  CNS,
  Evolution,
  RouteOrgan,   // optional: allows route-aware impulses
  log = console.log,
  warn = console.warn
} = {}) {

  const ImpulseState = {
    lastImpulse: null,
    lastModeKind: null,
    lastRoute: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryImpulse]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  BUILD IMPULSE ENVELOPE — deterministic, binary-native
  // --------------------------------------------------------------------------
  function buildImpulseEnvelope({ source, payload, binaryPayload, context }) {
    const modeKind = binaryPayload ? "dual" : "symbolic";

    const lineage = Evolution?.getPageLineage?.() || {};
    const route = RouteOrgan?.RouterState?.currentRoute || "unknown";

    return {
      source,
      modeKind,
      route,
      lineage,
      payload: payload || {},
      binary: binaryPayload || null,
      context: context || {},
      version: ImpulseRole.version,
      timestamp: "NO_TIMESTAMP_v11" // deterministic placeholder
    };
  }

  // --------------------------------------------------------------------------
  //  EMIT IMPULSE — deterministic, dual-band, CNS-aware
  // --------------------------------------------------------------------------
  function emit({ source = "UI", payload = {}, binaryPayload = null, context = {} } = {}) {
    const envelope = buildImpulseEnvelope({ source, payload, binaryPayload, context });

    ImpulseState.lastImpulse = envelope;
    ImpulseState.lastModeKind = envelope.modeKind;
    ImpulseState.lastRoute = envelope.route;

    try {
      CNS?.emitImpulse?.("PulseEvolutionaryImpulse", envelope);
      safeLog("IMPULSE_OK", { modeKind: envelope.modeKind, route: envelope.route });
      return { ok: true };
    } catch (err) {
      warn("[PulseEvolutionaryImpulse] EMIT_ERROR", String(err));
      return { ok: false, error: "EmitError" };
    }
  }

  const PulseEvolutionaryImpulse = {
    ImpulseRole,
    ImpulseState,
    emit
  };

  safeLog("INIT", {
    identity: ImpulseRole.identity,
    version: ImpulseRole.version
  });

  return PulseEvolutionaryImpulse;
}
