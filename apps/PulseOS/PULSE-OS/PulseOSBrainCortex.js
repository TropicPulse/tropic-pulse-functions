// ============================================================================
// FILE: /apps/pulse-os/PulseOSCortex.js
// PULSE OS — v11-Evo
// “THE CORTEX ORGAN — HIGH‑LEVEL COGNITION + ORGAN SUPERVISOR”
// ============================================================================
//
// ROLE (v11-Evo):
// ---------------
// • Receives PulseOSBrain (CNS) directly
// • Reads Intent, IQ, OrganismMap from Brain
// • Reads Evolution from Brain.evolution
// • Initializes Nervous System + Organs (delegated to CNS Brain)
// • Reports lineage + drift to Evolution (band-tagged)
// • Maintains OS-level conscious state
// • Pure frontend, deterministic, zero timing, zero backend
// • Continuance-aware (never halts organism)
// • Dual-band aware (symbolic | binary | dual) — tagging only
// ============================================================================

export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "Cortex",
  version: "11.0-Evo",
  identity: "PulseOSCortex",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    loopTheoryAware: true,
    continuanceAware: true,

    // v11 organism-wide contracts
    routingContract: "PulseRouter-v11",
    gpuCompatibility: "PulseGPU-v11",
    sdnCompatibility: "PulseSDN-v11",
    earnCompatibility: "PulseEarn-v11",
    sendCompatibility: "PulseSendSystem-v11",

    // Dual-band
    dualMode: true,
    symbolicAware: true,
    binaryAware: true
  }
};


// ============================================================================
//  FACTORY — Cortex receives the CNS Brain directly
// ============================================================================
export function createPulseOSCortex({ Brain }) {

  if (!Brain) {
    throw new Error("PulseOSCortex: Missing CNS Brain injection.");
  }

  const Evolution = Brain.evolution || null;

  // --------------------------------------------------------------------------
  // Band normalizer — tagging only, no branching
  // --------------------------------------------------------------------------
  function normalizeBand(band) {
    if (band === "binary" || band === "symbolic" || band === "dual") return band;
    return "dual";
  }

  // --------------------------------------------------------------------------
  // Cortex State (zero timing, zero backend)
// --------------------------------------------------------------------------
  const CortexState = {
    booted: false,
    routeName: "main",
    hasIdentity: false,

    // Pull maps directly from CNS Brain
    IntentMap: Brain.PulseIntentMap,
    IQMap: Brain.PulseIQMap,
    OrganismMap: Brain.PulseOrganismMap,

    // Understanding context
    understanding: Brain.understanding || null,

    // v11 band tagging
    band: "dual"
  };


  // ========================================================================
  //  BOOT — Cortex comes online AFTER PulseOSBrain
  // ========================================================================
  function bootCortex({ band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    if (!CortexState.booted) {
      CortexState.booted = true;
    }

    // Evolution lineage (band-tagged)
    Evolution?.recordLineage?.("cortex-boot", { band: normBand });

    // Initialize Nervous System (delegated to CNS Brain)
    if (Brain.cortex?.initializeNervousSystem) {
      Brain.cortex.initializeNervousSystem();
    }

    // Initialize Organs (delegated to CNS Brain)
    if (Brain.cortex?.initializeOrgans) {
      Brain.cortex.initializeOrgans();
    }

    // Drift scan (band-tagged)
    Evolution?.scanDrift?.(Brain, { band: normBand });

    Brain.log("[Cortex v11-Evo] Boot complete", { CortexState });
    return CortexState;
  }


  // ========================================================================
  //  UPDATE — Route or identity changed (band-tagged)
// ========================================================================
  function updateCortex(ctx = {}, { band = "dual" } = {}) {
    const normBand = normalizeBand(band);
    CortexState.band = normBand;

    CortexState.routeName   = ctx.routeName   ?? CortexState.routeName;
    CortexState.hasIdentity = ctx.hasIdentity ?? CortexState.hasIdentity;

    Evolution?.recordLineage?.("cortex-update", { band: normBand });
    return CortexState;
  }


  // ========================================================================
  //  PUBLIC API
  // ========================================================================
  return {
    boot: bootCortex,
    update: updateCortex,
    state: CortexState,
    isReady: () => CortexState.booted
  };
}
