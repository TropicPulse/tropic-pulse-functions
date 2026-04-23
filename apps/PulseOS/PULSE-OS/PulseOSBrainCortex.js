// ============================================================================
// FILE: /apps/pulse-os/PulseOSCortex.js
// PULSE OS — v10.1
// “THE CORTEX ORGAN — HIGH‑LEVEL COGNITION + ORGAN SUPERVISOR”
// ============================================================================
//
// ROLE (v10.1):
// -------------
// • Receives PulseOSBrain (CNS) directly
// • Reads Intent, IQ, OrganismMap from Brain
// • Reads Evolution from Brain.evolution
// • Initializes Nervous System + Organs
// • Reports lineage + drift to Evolution
// • Maintains OS‑level conscious state
// • Pure frontend, deterministic, no backend
// ============================================================================

export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "Cortex",
  version: "10.1",
  identity: "PulseOSCortex",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true
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

  // Cortex State
  const CortexState = {
    bootTs: null,
    ready: false,
    routeName: "main",
    hasIdentity: false,

    // Pull maps directly from CNS Brain
    IntentMap: Brain.PulseIntentMap,
    IQMap: Brain.PulseIQMap,
    OrganismMap: Brain.PulseOrganismMap,

    // Understanding context
    understanding: Brain.understanding || null
  };


  // ========================================================================
  //  BOOT — Cortex comes online AFTER PulseOSBrain
  // ========================================================================
  async function bootCortex() {
    if (!CortexState.bootTs) {
      CortexState.bootTs = Date.now();
    }

    // Evolution lineage
    Evolution?.recordLineage?.("cortex-boot");

    // Initialize Nervous System if Brain provided it
    if (Brain.cortex?.initializeNervousSystem) {
      Brain.cortex.initializeNervousSystem();
    }

    // Initialize Organs if Brain provided it
    if (Brain.cortex?.initializeOrgans) {
      Brain.cortex.initializeOrgans();
    }

    CortexState.ready = true;

    // Evolution drift scan
    Evolution?.scanDrift?.(Brain);

    Brain.log("[Cortex v10.1] Boot complete", { CortexState });
    return CortexState;
  }


  // ========================================================================
  //  UPDATE — Route or identity changed
  // ========================================================================
  function updateCortex(ctx = {}) {
    CortexState.routeName = ctx.routeName ?? CortexState.routeName;
    CortexState.hasIdentity = ctx.hasIdentity ?? CortexState.hasIdentity;

    Evolution?.recordLineage?.("cortex-update");
    return CortexState;
  }


  // ========================================================================
  //  PUBLIC API
  // ========================================================================
  return {
    boot: bootCortex,
    update: updateCortex,
    state: CortexState,
    isReady: () => CortexState.ready
  };
}
