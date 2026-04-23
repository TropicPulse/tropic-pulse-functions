// ============================================================================
// PulseOS Evolution Engine — v10
// “Evolution that evolves the organism, not the filesystem”
// ============================================================================
//
// ROLE IN THE ORGANISM (v10):
// ---------------------------
// • FIRST organ after Understanding
// • Attaches Intent, OrganismMap, IQMap to Brain
// • Attaches Evolution to Brain
// • Boots the Brain (which boots Cortex)
// • Provides drift detection + lineage tracking
// • Provides organ evolution + organism evolution
// • Provides CNS evolution + structural drift scanning
// • Pure frontend, deterministic, zero network, zero filesystem
//
// SAFETY CONTRACT (v10):
// -----------------------
// • No dynamic eval
// • No backend calls
// • No filesystem access
// • No import.meta.glob
// • Deterministic, drift‑proof wiring only
//
// IDENTITY (v10):
// ---------------
// • organ: Evolution
// • layer: CNS
// • subsystem: OS
// • version: 10.0
// ============================================================================

export const PulseRole = {
  type: "Evolution",
  subsystem: "OS",
  layer: "CNS",
  version: "10.0",
  identity: "PulseOSEvolution",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    zeroNetwork: true,
    zeroFilesystem: true
  }
};


// ============================================================================
//  EVOLUTION ENGINE — The CNS growth organ
// ============================================================================
export function PulseOSEvolution({ intent, organism, iq, understanding }) {

  // Internal drift + lineage state
  const DriftState = {
    lineage: [],
    driftEvents: [],
    organHealth: {},
    organismHealth: 1.0,
    lastScan: null
  };


  // --------------------------------------------------------------------------
  // DRIFT SCANNER — Detect structural drift in maps + Brain surface
  // --------------------------------------------------------------------------
  function scanDrift(Brain) {
    const drift = [];

    if (!Brain.PulseIntentMap) drift.push("missing-intent-map");
    if (!Brain.PulseOrganismMap) drift.push("missing-organism-map");
    if (!Brain.PulseIQMap) drift.push("missing-iq-map");

    DriftState.lastScan = Date.now();
    DriftState.driftEvents.push(...drift);

    return drift;
  }


  // --------------------------------------------------------------------------
  // LINEAGE ENGINE — Track organism evolution lineage
  // --------------------------------------------------------------------------
  function recordLineage(event) {
    DriftState.lineage.push({
      ts: Date.now(),
      event
    });
  }


  // --------------------------------------------------------------------------
  // ORGAN HEALTH ENGINE — Track health of each organ
  // --------------------------------------------------------------------------
  function updateOrganHealth(organName, score) {
    DriftState.organHealth[organName] = score;
  }


  // --------------------------------------------------------------------------
  // ORGANISM HEALTH ENGINE — Aggregate organ health
  // --------------------------------------------------------------------------
  function computeOrganismHealth() {
    const values = Object.values(DriftState.organHealth);
    if (values.length === 0) return 1.0;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    DriftState.organismHealth = avg;
    return avg;
  }


  // --------------------------------------------------------------------------
  // EVOLUTION → BRAIN BOOTSTRAP
  // --------------------------------------------------------------------------
  function bootBrain(Brain) {

    // Attach maps to Brain
    Brain.PulseIntentMap = intent;
    Brain.PulseOrganismMap = organism;
    Brain.PulseIQMap = iq;

    // Attach Evolution organ to Brain
    Brain.evolution = Evolution;

    // Record lineage
    recordLineage("brain-boot");

    // Boot Brain (this boots Cortex internally)
    const bootedBrain = Brain.cognitiveBootstrap({
      intent,
      organism,
      iqMap: iq,
      understanding
    });

    // Initial drift scan
    scanDrift(bootedBrain);

    return bootedBrain;
  }


  // --------------------------------------------------------------------------
  // PUBLIC EVOLUTION ORGAN SURFACE
  // --------------------------------------------------------------------------
  const Evolution = {
    PulseRole,
    DriftState,
    scanDrift,
    recordLineage,
    updateOrganHealth,
    computeOrganismHealth,
    bootBrain
  };

  return Evolution;
}
