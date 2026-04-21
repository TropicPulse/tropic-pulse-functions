// ============================================================================
//  PULSE OS — ACTNow v9.2
//  ADRENAL REFLEX LOOP — “ACT NOW”
//  White/Silver Organ • Reflex • Renewal • Non‑Interference
// ============================================================================
//
//  THIS ORGAN HAS ZERO IMPORTS.
//  ALL dependencies are injected by the CNS Brain.
//  PURE REFLEX. ZERO COGNITION. ZERO NETWORK. ZERO BACKEND.
// ============================================================================

export function createACTNow({
  PulseImmunity,
  PulseSurgeonGeneral,
  PulseEventBus,
  log,
  error
}) {

  return {

    intervalMs: 5000,
    running: false,
    timer: null,

    meta: {
      layer: "ACTNow",
      role: "HEARTBEAT_LOOP",
      version: "9.2",
      generation: "v9",
      color: "white-silver",
      theme: "renewal",

      driftProof: true,
      selfRepairable: true,
      futureEvolutionReady: true,
      multiInstanceReady: true,
      reflexPure: true,
      zeroNetwork: true,
      zeroBackend: true,

      evo: {
        deterministicNeuron: true,
        deterministicCycle: true,
        advantageCascadeAware: true,
        unifiedAdvantageField: true,
        pulseEfficiencyAware: true,
        zeroCognition: true,
        zeroMutationOutsideOrgan: true,

        // Conceptual compatibility (no logic impact)
        routingContract: "PulseSend-v9.2",
        osOrganContract: "PulseOS-v9.2",
        earnCompatibility: "PulseEarn-v9.2"
      }
    },

    // ----------------------------------------------------------
    // START LOOP — deterministic reflex activation
    // ----------------------------------------------------------
    start(snapshotProvider) {
      if (this.running) return;

      this.running = true;

      this.timer = setInterval(async () => {
        try {
          await this.cycle(snapshotProvider);
        } catch (err) {
          error("[ACTNow] Cycle error:", err);
        }
      }, this.intervalMs);

      log("[ACTNow] Heartbeat loop started.");
    },

    // ----------------------------------------------------------
    // STOP LOOP — reflex shutdown
    // ----------------------------------------------------------
    stop() {
      if (!this.running) return;

      clearInterval(this.timer);
      this.running = false;

      log("[ACTNow] Heartbeat loop stopped.");
    },

    // ----------------------------------------------------------
    // ONE FULL CYCLE — pure reflex, no cognition
    // ----------------------------------------------------------
    async cycle(snapshotProvider) {
      const snapshot = await snapshotProvider();
      if (!snapshot) return;

      // Reflex immune analysis
      const analysis = PulseImmunity.analyze(snapshot);

      // Surgeon General command (deterministic)
      const report = await PulseSurgeonGeneral.command(analysis);

      // Emit immune update
      PulseEventBus.emit("immune:update", {
        meta: this.meta,
        analysis,
        report,
        timestamp: Date.now()
      });

      log("[ACTNow] Cycle complete.");
    }
  };
}
