/* ============================================================
   PulseNet.js — PulseNet v6
   Purpose: Signal bridge + route health metadata for PulseBand
   Notes:
     - No path memory / probing / cloud hints / extended reach
     - No micropulse / scoring / switching / logs
     - Just: PulseBand → PulseNet → UI
   ============================================================ */

(function () {

  const nowMs = () => Date.now();

  const pulsenet = {
    listeners: {},

    state: {
      // High-level route view
      activePath: "Primary",      // e.g. "Primary", "Pulse", "Fallback"
      signalState: "Normal",      // "Normal", "LowSignal", "NoSignal"

      // Simple health metrics
      signalScore: 100,           // 0–100
      signalSlope: 0,             // trend over last samples
      lastSignalSamples: [],      // recent scores

      // Derived route health
      routeHealth: {
        label: "Excellent",       // "Excellent", "Good", "Weak", "Critical"
        reason: "Initial",
        lastUpdateTimestamp: 0
      },

      lastUpdateTimestamp: 0
    },

    /* ---------------------------------------------------------
       STATUS API
    --------------------------------------------------------- */
    getStatus() {
      return { ...this.state, routeHealth: { ...this.state.routeHealth } };
    },

    setStatus(newState) {
      const now = nowMs();
      const clean = {};

      for (const k in newState) {
        if (newState[k] !== undefined && newState[k] !== null) {
          clean[k] = newState[k];
        }
      }

      this.state = {
        ...this.state,
        ...clean,
        lastUpdateTimestamp: now
      };

      this.emit("update", this.getStatus());
    },

    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */
    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    },

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
    },

    /* ---------------------------------------------------------
       ⭐ SIGNAL BRIDGE (PulseBand → PulseNet)
       Takes PulseBand status and derives:
         - signalScore
         - signalSlope
         - signalState
         - routeHealth
    --------------------------------------------------------- */
    updateSignalFromPulseBand(pulsebandStatus) {
      if (!pulsebandStatus) return;

      const L = pulsebandStatus.live || pulsebandStatus;

      const latency = Number(L.latency ?? 0);
      const phoneBars = Number(L.phoneBars ?? 0);
      const pulsebandBars = Number(L.pulsebandBars ?? 0);

      // Derive stabilityScore if missing
      let stabilityScore = Number(L.stabilityScore ?? 0);
      if (!Number.isFinite(stabilityScore) || stabilityScore <= 0) {
        const latScore = Math.max(0, 100 - Math.min(latency, 300));
        const barScore =
          (Math.min(pulsebandBars, 4) / 4) * 60 +
          (Math.min(phoneBars, 4) / 4) * 40;
        stabilityScore = Math.round((latScore * 0.5 + barScore * 0.5));
      }

      const samples = this.state.lastSignalSamples;

      const score =
        (100 - Math.min(latency, 100)) * 0.4 +
        stabilityScore * 0.3 +
        (pulsebandBars * 25) * 0.2 +
        (phoneBars * 25) * 0.1;

      samples.push(score);
      if (samples.length > 8) samples.shift();

      let slope = this.state.signalSlope;
      if (samples.length >= 4) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        slope = last - first;
      }

      // Update core signal metrics
      this.state.signalScore = score;
      this.state.signalSlope = slope;

      // Derive signalState
      let signalState = "Normal";
      if (score < 55 || slope < -15) signalState = "LowSignal";
      if (score < 25) signalState = "NoSignal";

      // Derive routeHealth label
      const routeHealth = this._deriveRouteHealth({
        score,
        slope,
        latency,
        pulsebandBars,
        phoneBars,
        signalState
      });

      this.setStatus({
        activePath: L.route || this.state.activePath,
        signalState,
        routeHealth
      });
    },

    /* ---------------------------------------------------------
       ROUTE HEALTH CLASSIFIER
    --------------------------------------------------------- */
    _deriveRouteHealth({ score, slope, latency, pulsebandBars, phoneBars, signalState }) {
      let label = "Excellent";
      let reason = "High score";

      if (signalState === "NoSignal") {
        label = "Critical";
        reason = "No signal";
      } else if (signalState === "LowSignal") {
        label = "Weak";
        reason = "Low signal";
      } else {
        if (score > 80 && latency < 80 && pulsebandBars >= 3) {
          label = "Excellent";
          reason = "Fast + stable";
        } else if (score > 60 && latency < 150) {
          label = "Good";
          reason = "Acceptable latency";
        } else if (score > 40) {
          label = "Weak";
          reason = "Degraded conditions";
        } else {
          label = "Critical";
          reason = "Severely degraded";
        }
      }

      return {
        label,
        reason,
        score,
        slope,
        latency,
        pulsebandBars,
        phoneBars,
        signalState,
        lastUpdateTimestamp: nowMs()
      };
    }
  };

  window.pulsenet = pulsenet;

})();
