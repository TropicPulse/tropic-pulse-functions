/* ============================================================
   PulseBand.js — PulseBand v6
   Purpose: Internal Proxy-App Acceleration Layer + UI Dashboard
   Notes:
     - Runs from /proxy/
     - GPU subsystem lives in /pulse-gpu/
     - No Earn / No Marketplace / No Compute Loop
     - Loads on ANY frontend page
     - PulseBand.html dashboard works globally
   ============================================================ */
// ============================================================================
// PULSEBAND — CORE GPU + UPDATE + CLIENT + NET IMPORTS
// ============================================================================

// GPU Intelligence Layer
import { BrainInput, PulseGPUBrainExport } from "../pulse-gpu/PulseGPUBrain.js";
import { PulseGPURuntime } from "../pulse-gpu/PulseGPURuntime.js";
import { PulseGPUEngine } from "../pulse-gpu/PulseGPUEngine.js";

// Pulse Update Loop (device → band)
import { PulseUpdate } from "../pulse-update/PulseUpdate.js";

// Pulse Client (fetch wrapper)
import { PulseClient } from "../pulse-client/PulseClient.js";

// PulseNet (network intelligence)
import { PulseNet } from "../pulse-net/PulseNet.js";


(function () {

  // ------------------------------------------------------------
  // Utility helpers
  // ------------------------------------------------------------
  const nowMs = () => Date.now();

  const computeNetworkHealthFromLatency = (latencyMs) => {
    if (!Number.isFinite(latencyMs) || latencyMs <= 0) return "Unknown";
    if (latencyMs < 120) return "Excellent";
    if (latencyMs < 250) return "Good";
    if (latencyMs < 500) return "Weak";
    return "Critical";
  };

  const safeSeconds = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  };

  const getSafeTimestamp = (status) => {
    if (status.lastSyncTimestamp != null) return status.lastSyncTimestamp;
    if (status.lastSyncSeconds != null)
      return nowMs() - status.lastSyncSeconds * 1000;
    return nowMs();
  };

  // ------------------------------------------------------------
  // PulseBand v6 — Engine State
  // ------------------------------------------------------------
  const pulseband = {
    listeners: {},

    gpu: {
      ready: false,
      packages: null
    },

    engine: {
      initialized: false,
      pageEnabled: true,   // page-level toggle
      globalEnabled: true  // future global toggle
    },

    // Live + Snapshot state
    state: {
      live: {
        pulsebandBars: 0,
        phoneBars: 0,
        latency: 0,
        latencyClass: "Unknown",
        networkHealth: "Unknown",
        microWindowActive: false,
        lastUpdateTimestamp: 0,
        lastSyncTimestamp: null,
        lastSyncSeconds: 0,
        route: "Primary",
        state: "Idle",
        efficiency: 100,
        efficiencyMode: null,
        phoneKbps: 0,
        appKbps: 0
      },

      snapshot: {
        advantage: 1.0,
        timeSaved: 0,
        lastUpdateTimestamp: 0
      },

      gpuPerformance: {
        warm: false,
        smoothness: 0,
        pacing: "Unknown",
        stalls: 0,
        efficiency: 100,
        load: 0
      },

      // Flat mirror for UI
      latency: 0,
      latencyClass: "Unknown",
      networkHealth: "Unknown",
      microWindowActive: false,
      lastSyncTimestamp: null,
      lastSyncSeconds: 0,
      route: "Primary",
      state: "Idle",
      efficiency: 100,
      efficiencyMode: null,
      phoneKbps: 0,
      appKbps: 0,
      pulsebandBars: 0,
      phoneBars: 0,
      advantage: 1.0,
      timeSaved: 0
    },

    // ------------------------------------------------------------
    // GPU Brain Init
    // ------------------------------------------------------------
    async initGraphics(rawAssets) {
      try {
        const input = new BrainInput({
          rawTextures: rawAssets.textures || [],
          rawMeshes: rawAssets.meshes || [],
          rawAnimations: rawAssets.animations || [],
          rawShaders: rawAssets.shaders || [],
          rawScenes: rawAssets.scenes || []
        });

        const packages = PulseGPUBrainExport.buildAndStore(input);
        console.log("[PulseBand] GPU Brain ready:", packages);

        this.gpu.packages = packages;
        this.gpu.ready = !!packages;
      } catch (err) {
        console.error("[PulseBand] GPU Brain failed:", err);
        this.gpu.ready = false;
      }
    },

    // ------------------------------------------------------------
    // Engine Init (Proxy-App Layer)
    // ------------------------------------------------------------
    async initEngine() {
      if (this.engine.initialized) return;
      this.engine.initialized = true;

      console.log("[PulseBand] Initializing v6 engine…");

      this.setStatus({
        live: {
          latency: 1,
          networkHealth: "Excellent",
          latencyClass: "Excellent",
          state: "Warm",
          route: "Pulse"
        }
      });

      console.log("[PulseBand] Engine ready.");
    },

    // ------------------------------------------------------------
    // Page-Level Toggle
    // ------------------------------------------------------------
    enableForPage() {
      this.engine.pageEnabled = true;
      this.emit("page-toggle", { pageEnabled: true });
    },

    disableForPage() {
      this.engine.pageEnabled = false;
      this.emit("page-toggle", { pageEnabled: false });
    },

    isPageEnabled() {
      return !!this.engine.pageEnabled;
    },

    // ------------------------------------------------------------
    // Status API
    // ------------------------------------------------------------
    getStatus() {
      const status = {
        ...this.state,
        live: { ...this.state.live },
        snapshot: { ...this.state.snapshot }
      };

      status.safeTimestamp = getSafeTimestamp(status);
      status.gpuReady = this.gpu.ready;
      status.gpuPerformance = { ...this.state.gpuPerformance };
      status.engine = { ...this.engine };

      return status;
    },

    setStatus(newState) {
      const now = nowMs();
      const clean = {};

      for (const k in newState) {
        if (newState[k] !== undefined && newState[k] !== null) clean[k] = newState[k];
      }

      // GPU auto-init
      if (!this.gpu.ready && clean.gpuAssets) {
        this.initGraphics(clean.gpuAssets);
      }

      // LIVE merge
      if (clean.live) {
        const L = clean.live;
        const latency = L.latency ?? this.state.live.latency ?? 0;

        this.state.live = {
          ...this.state.live,
          ...L,
          latency,
          networkHealth: computeNetworkHealthFromLatency(latency),
          latencyClass:
            latency <= 0 ? "Unknown" :
            latency < 80 ? "Excellent" :
            latency < 150 ? "Good" :
            latency < 300 ? "Weak" : "Critical",
          microWindowActive:
            L.microWindowActive ??
            (now - (this.state.live.lastUpdateTimestamp || 0) < 5000),
          lastUpdateTimestamp: now
        };
      }

      // SNAPSHOT merge
      if (clean.snapshot) {
        this.state.snapshot = {
          ...this.state.snapshot,
          ...clean.snapshot,
          lastUpdateTimestamp: now
        };
      }

      // Flat mirror
      const L = this.state.live;
      const S = this.state.snapshot;

      this.state.latency = L.latency;
      this.state.latencyClass = L.latencyClass;
      this.state.networkHealth = L.networkHealth;
      this.state.microWindowActive = L.microWindowActive;

      this.state.lastSyncTimestamp = L.lastSyncTimestamp;
      this.state.lastSyncSeconds =
        L.lastSyncTimestamp ? Math.floor((now - L.lastSyncTimestamp) / 1000) : 0;

      this.state.route = L.route;
      this.state.state = L.state;
      this.state.efficiency = L.efficiency;
      this.state.efficiencyMode = L.efficiencyMode;
      this.state.phoneKbps = L.phoneKbps;
      this.state.appKbps = L.appKbps;

      this.state.pulsebandBars = L.pulsebandBars;
      this.state.phoneBars = L.phoneBars;

      this.state.advantage = S.advantage;
      this.state.timeSaved = S.timeSaved;

      this.state.gpuReady = this.gpu.ready;
      this.state.gpuPerformance.warm = this.gpu.ready;

      this.emit("update", this.getStatus());
    },

    // ------------------------------------------------------------
    // Events
    // ------------------------------------------------------------
    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    },

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((cb) => cb(data));
      }
    },

    // ------------------------------------------------------------
    // PulseCache Request Helper
    // ------------------------------------------------------------
    _request(type, extra = {}) {
      return new Promise((resolve, reject) => {
        try {
          const sessionId = type + "_" + Date.now();
          this.emit("request", { type, sessionId, ...extra });
          this.on("response:" + sessionId, (payload) => resolve(payload));
        } catch (err) {
          reject(err);
        }
      });
    }
  };

  // ------------------------------------------------------------
  // Expose globally
  // ------------------------------------------------------------
  pulseband = pulseband;

  // ------------------------------------------------------------
  // GPU + Engine Warmup
  // ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    console.log("[PulseBand] DOM ready — warming up…");

    await pulseband.initGraphics({
      textures: [],
      meshes: [],
      animations: [],
      shaders: [],
      scenes: []
    });

    await pulseband.initEngine();

    console.log("[PulseBand] Warmup complete.");
  });

})();
