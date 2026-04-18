// ============================================================================
// FILE: /apps/tropic-pulse/lib/Connectors/PulseNet.js
// LAYER: THE PULSE (Signal Path + Arterial Rhythm Layer)
// ============================================================================
//
// ROLE:
//   THE PULSE — The arterial signal path of Pulse OS
//   • Receives signal from Nervous System (PulseBand)
//   • Computes signalScore + signalSlope
//   • Classifies route health
//   • Emits pulse updates to the OS
//
// CONTRACT:
//   • No PulseBand imports
//   • No PulseClient imports
//   • No PulseUpdate imports
//   • Pure subsystem module
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PulseNet
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const PULSE_LAYER_ID = "PULSE-LAYER";
const PULSE_LAYER_NAME = "THE PULSE";
const PULSE_LAYER_ROLE = "Signal Path + Arterial Rhythm Layer";

const PULSE_DIAGNOSTICS_ENABLED =
  window?.PULSE_PULSE_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const pulseLog = (stage, details = {}) => {
  if (!PULSE_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: PULSE_LAYER_ID,
      pulseName: PULSE_LAYER_NAME,
      pulseRole: PULSE_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

pulseLog("PULSE_INIT", {});

// ============================================================================
// INTERNAL HELPERS
// ============================================================================
const nowMs = () => Date.now();

// ============================================================================
// THE PULSE — STATE + SIGNAL ENGINE
// ============================================================================
export const PulseNet = {
  listeners: {},

  state: {
    activePath: "Primary",
    signalState: "Normal",

    signalScore: 100,
    signalSlope: 0,
    lastSignalSamples: [],

    routeHealth: {
      label: "Excellent",
      reason: "Initial",
      lastUpdateTimestamp: 0
    },

    lastUpdateTimestamp: 0
  },

  // --------------------------------------------------------------------------
  // STATUS API — Pulse Snapshot
  // --------------------------------------------------------------------------
  getStatus() {
    osLog("PulseNet → getStatus()");
    pulseLog("GET_STATUS");
    return { ...this.state, routeHealth: { ...this.state.routeHealth } };
  },

  setStatus(newState) {
    osLog("PulseNet → setStatus()");
    pulseLog("SET_STATUS_CALLED");

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

    osLog("PulseNet → emit(update)");
    pulseLog("EMIT_UPDATE");
    this.emit("update", this.getStatus());
  },

  // --------------------------------------------------------------------------
  // EVENTS — Pulse Firing
  // --------------------------------------------------------------------------
  on(event, callback) {
    osLog(`PulseNet → on(${event})`);
    pulseLog("EVENT_SUBSCRIBE", { event });

    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    osLog(`PulseNet → emit(${event})`);
    pulseLog("EVENT_EMIT", { event });

    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  },

  // --------------------------------------------------------------------------
  // ⭐ SIGNAL BRIDGE — Nervous System → Pulse
  // --------------------------------------------------------------------------
  updateSignalFromPulseBand(pulsebandStatus) {
    osLog("PulseNet → updateSignalFromPulseBand()");
    pulseLog("SIGNAL_BRIDGE_START");

    if (!pulsebandStatus) {
      osLog("PulseNet → updateSignalFromPulseBand() aborted (no status)");
      pulseLog("SIGNAL_BRIDGE_ABORT");
      return;
    }

    const L = pulsebandStatus.live || pulsebandStatus;

    const latency = Number(L.latency ?? 0);
    const phoneBars = Number(L.phoneBars ?? 0);
    const pulsebandBars = Number(L.pulsebandBars ?? 0);

    osLog(
      `PulseNet → Raw Input: latency=${latency}, phoneBars=${phoneBars}, pulsebandBars=${pulsebandBars}`
    );

    pulseLog("SIGNAL_RAW", { latency, phoneBars, pulsebandBars });

    // Derive stabilityScore if missing
    let stabilityScore = Number(L.stabilityScore ?? 0);
    if (!Number.isFinite(stabilityScore) || stabilityScore <= 0) {
      const latScore = Math.max(0, 100 - Math.min(latency, 300));
      const barScore =
        (Math.min(pulsebandBars, 4) / 4) * 60 +
        (Math.min(phoneBars, 4) / 4) * 40;

      stabilityScore = Math.round((latScore * 0.5 + barScore * 0.5));

      osLog(`PulseNet → Derived stabilityScore=${stabilityScore}`);
      pulseLog("STABILITY_DERIVED", { stabilityScore });
    }

    const samples = this.state.lastSignalSamples;

    const score =
      (100 - Math.min(latency, 100)) * 0.4 +
      stabilityScore * 0.3 +
      (pulsebandBars * 25) * 0.2 +
      (phoneBars * 25) * 0.1;

    samples.push(score);
    if (samples.length > 8) samples.shift();

    osLog(`PulseNet → signalScore=${score.toFixed(1)} (samples=${samples.length})`);
    pulseLog("SIGNAL_SCORE", { score, samples: samples.length });

    let slope = this.state.signalSlope;
    if (samples.length >= 4) {
      const first = samples[0];
      const last = samples[samples.length - 1];
      slope = last - first;

      osLog(`PulseNet → signalSlope=${slope.toFixed(1)}`);
      pulseLog("SIGNAL_SLOPE", { slope });
    }

    this.state.signalScore = score;
    this.state.signalSlope = slope;

    let signalState = "Normal";
    if (score < 55 || slope < -15) signalState = "LowSignal";
    if (score < 25) signalState = "NoSignal";

    osLog(`PulseNet → signalState=${signalState}`);
    pulseLog("SIGNAL_STATE", { signalState });

    const routeHealth = this._deriveRouteHealth({
      score,
      slope,
      latency,
      pulsebandBars,
      phoneBars,
      signalState
    });

    osLog(
      `PulseNet → routeHealth=${routeHealth.label} (${routeHealth.reason})`
    );

    pulseLog("ROUTE_HEALTH", routeHealth);

    this.setStatus({
      activePath: L.route || this.state.activePath,
      signalState,
      routeHealth
    });
  },

  // --------------------------------------------------------------------------
  // ROUTE HEALTH CLASSIFIER — Arterial Integrity
  // --------------------------------------------------------------------------
  _deriveRouteHealth({ score, slope, latency, pulsebandBars, phoneBars, signalState }) {
    osLog("PulseNet → _deriveRouteHealth()");
    pulseLog("ROUTE_HEALTH_START");

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

    osLog(`PulseNet → Health classified as ${label} (${reason})`);
    pulseLog("ROUTE_HEALTH_CLASSIFIED", { label, reason });

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
