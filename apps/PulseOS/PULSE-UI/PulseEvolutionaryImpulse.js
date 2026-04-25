// ============================================================================
//  FILE: /ui/PulseEvolutionaryImpulse.js
//  PULSE OS v11‑EVO‑PRIME — UI IMPULSE ORGAN
//  “THE UI → CNS SIGNAL LAYER”
//  Deterministic • Dual‑Band • Drift‑Proof • No Randomness
//
//  ROLE:
//  -----
//  • Emits impulses from UI → CNS.
//  • Used by EvolutionaryBrain + EvolutionaryCode.
//  • Dual‑band: symbolic + binary impulse payloads.
//  • No routing logic, no compute, no mutation outside organ.
// ============================================================================

export const ImpulseRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "Impulse",
  version: "11.2-Evo-Prime",
  identity: "PulseEvolutionaryImpulse",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    impulseEmitter: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

export function createPulseEvolutionaryImpulse({
  CNS,
  log = console.log,
  warn = console.warn
} = {}) {

  const ImpulseState = {
    lastImpulse: null,
    lastModeKind: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryImpulse]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  EMIT IMPULSE — deterministic, dual‑band
  // --------------------------------------------------------------------------
  function emit({ source = "UI", payload = {}, binaryPayload = null, context = {} } = {}) {
    const modeKind = binaryPayload ? "dual" : "symbolic";

    const impulse = {
      source,
      payload,
      binary: binaryPayload,
      modeKind,
      context
    };

    ImpulseState.lastImpulse = impulse;
    ImpulseState.lastModeKind = modeKind;

    try {
      CNS?.emitImpulse?.("PulseEvolutionaryImpulse", impulse);
      safeLog("IMPULSE_OK", { modeKind });
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
