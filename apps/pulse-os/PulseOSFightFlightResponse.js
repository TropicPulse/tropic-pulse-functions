// ============================================================================
//  PULSE OS — ACTNow v9.0
//  ADRENAL REFLEX LOOP — “ACT NOW”
//  White/Silver Organ • Reflex • Renewal • Non‑Interference
// ============================================================================
//
//  THIS ORGAN HAS ZERO IMPORTS.
//  ALL dependencies are injected by the CNS Brain.
// ============================================================================

export function createACTNow({ PulseImmunity, PulseSurgeonGeneral, PulseEventBus, log, error }) {

  return {

    intervalMs: 5000,
    running: false,
    timer: null,

    meta: {
      layer: "ACTNow",
      role: "HEARTBEAT_LOOP",
      version: "9.0",
      generation: "v9",
      color: "white-silver",
      theme: "renewal",
      driftProof: true,
      selfRepairable: true,
      futureEvolutionReady: true
    },

    // ----------------------------------------------------------
    // START LOOP
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
    // STOP LOOP
    // ----------------------------------------------------------
    stop() {
      if (!this.running) return;

      clearInterval(this.timer);
      this.running = false;

      log("[ACTNow] Heartbeat loop stopped.");
    },

    // ----------------------------------------------------------
    // ONE FULL CYCLE
    // ----------------------------------------------------------
    async cycle(snapshotProvider) {
      const snapshot = await snapshotProvider();
      if (!snapshot) return;

      const analysis = PulseImmunity.analyze(snapshot);
      const report = await PulseSurgeonGeneral.command(analysis);

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
