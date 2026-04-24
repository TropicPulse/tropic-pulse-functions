// ============================================================================
//  PULSE OS — ACTNow v11-Evo
//  ADRENAL REFLEX LOOP — “ACT NOW”
//  White/Silver Organ • Reflex • Renewal • Non‑Interference
//  PURE REFLEX. ZERO COGNITION. ZERO NETWORK. ZERO BACKEND.
//  NO TIMERS. NO AUTONOMY. CNS-TRIGGERED ONLY.
// ============================================================================

export const ACTNOW_CONTEXT_V11 = {
  organ: "ACTNow",
  layer: "Reflex",
  role: "Adrenal Reflex Loop",
  version: "11.0-Evo",
  generation: "v11",
  color: "white-silver",
  theme: "renewal",
  evo: {
    reflexPure: true,
    deterministicNeuron: true,
    deterministicCycle: true,
    unifiedAdvantageField: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,
    continuanceAware: true,
    driftProof: true,
    selfRepairable: true,
    multiInstanceReady: true,
    zeroNetwork: true,
    zeroBackend: true,
    zeroCognition: true,
    zeroTiming: true,
    zeroAutonomy: true
  }
};


// ============================================================================
//  FACTORY — Pure Reflex Organ (no timers, no scheduling)
// ============================================================================
export function createACTNowV11({
  PulseImmunity,
  PulseSurgeonGeneral
} = {}) {

  // --------------------------------------------------------------------------
  //  REFLEX: snapshot → { analysis, report, reflexEvent }
// --------------------------------------------------------------------------
  function reflex(snapshot, { modeKind = "dual" } = {}) {
    if (!snapshot) return null;

    // Pure reflex: no timestamps, no async, no cognition
    const analysis = PulseImmunity.analyze(snapshot);
    const report   = PulseSurgeonGeneral.command(analysis);

    return {
      ...ACTNOW_CONTEXT_V11,
      modeKind,
      kind: "AdrenalReflexEvent",
      analysis,
      report
      // CNS attaches timestamp + routing metadata
    };
  }

  return {
    meta: ACTNOW_CONTEXT_V11,
    reflex
  };
}
