// ============================================================================
// FILE: /apps/organs/loop/ACTNow.js
// PULSE OS — v6.4+
// AUTO-REFRESH LOOP — “ACT NOW”
// ============================================================================
//
// ROLE:
//   • Provides a safe, timed refresh cycle for the organism
//   • Re-runs PulseImmunity at intervals
//   • Re-runs PulseSurgeonGeneral for healing
//   • Broadcasts updates to dashboards
//   • Ensures no drift, no stale state, no memory corruption
//   • Rebuilds state cleanly between cycles
//
// This is the heartbeat of Pulse OS.
// ============================================================================

import { PulseImmunity } from "../immune/PulseImmunity.js";
import { PulseSurgeonGeneral } from "../immune/PulseSurgeonGeneral.js";

// Optional: event bus for dashboards
import { PulseEventBus } from "../events/PulseEventBus.js";

export const ACTNow = {

  // ----------------------------------------------------------
  // CONFIG — timing + safety
  // ----------------------------------------------------------
  intervalMs: 5000, // 5 seconds (your 2010 pattern reborn)
  running: false,
  timer: null,

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
        console.error("[ACTNow] Cycle error:", err);
      }
    }, this.intervalMs);

    console.log("[ACTNow] Auto-refresh loop started.");
  },

  // ----------------------------------------------------------
  // STOP LOOP
  // ----------------------------------------------------------
  stop() {
    if (!this.running) return;

    clearInterval(this.timer);
    this.running = false;

    console.log("[ACTNow] Auto-refresh loop stopped.");
  },

  // ----------------------------------------------------------
  // ONE FULL CYCLE
  // ----------------------------------------------------------
  async cycle(snapshotProvider) {
    // Step 1: Get fresh snapshot
    const snapshot = await snapshotProvider();
    if (!snapshot) return;

    // Step 2: Analyze
    const analysis = PulseImmunity.analyze(snapshot);

    // Step 3: Command immune system
    const report = await PulseSurgeonGeneral.command(analysis);

    // Step 4: Broadcast to dashboards
    PulseEventBus.emit("immune:update", {
      analysis,
      report,
      timestamp: Date.now()
    });

    console.log("[ACTNow] Cycle complete.");
  }
};
