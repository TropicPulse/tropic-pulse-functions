// PulseNet.js — v3 Routing + Extended Reach Engine
(function () {

  function nowMs() { return Date.now(); }

  window.__pulseLogs = window.__pulseLogs || [];

  function pushPulseLog(entry) {
    try {
      const log = {
        ts: entry.ts ?? Date.now(),
        type: entry.type || "event",
        path: entry.path || null,
        route: entry.route || null,
        bytes: entry.bytes ?? null,
        durationMs: entry.durationMs ?? null,
        warmDuration: entry.warmDuration ?? null,
        system: entry.system || "PulseNet",
        error: entry.error || null,
        stack: entry.stack || null,
        extra: entry.extra || null
      };
      window.__pulseLogs.push(log);
      if (window.__pulseLogs.length > 200) window.__pulseLogs.shift();
      if (window.pulseband?.emit) window.pulseband.emit("log", log);
    } catch (err) {
      console.warn("[PulseNet] Failed to push log:", err);
    }
  }

  const pulsenet = {
    listeners: {},

    state: {
      activePath: "Primary",
      signalState: "Normal",

      lastGoodWifi: null,
      lastGoodCellular: null,
      lastGoodPulsePath: null,

      pathMemory: [],
      bestPathScore: null,

      lastProbeTimestamp: 0,
      lastSwitchTimestamp: 0,

      probeResults: [],
      extendedReachActive: false,

      jitterHistory: [],
      routeHealth: {},

      signalScore: 100,
      signalSlope: 0,
      lastSignalSamples: [],

      lastUpdateTimestamp: 0
    },

    getStatus() {
      return { ...this.state };
    },

    setStatus(newState) {
      const now = nowMs();
      const clean = {};

      for (const k in newState) {
        if (newState[k] !== undefined && newState[k] !== null) {
          clean[k] = newState[k];
        } else {
          pushPulseLog({
            type: "pulsenet_ignored_field",
            extra: { field: k, value: newState[k] }
          });
        }
      }

      this.state = {
        ...this.state,
        ...clean,
        lastUpdateTimestamp: now
      };

      pushPulseLog({
        type: "pulsenet_status_update",
        extra: { updatedKeys: Object.keys(clean) }
      });

      this.emit("update", this.getStatus());
    },

    on(event, callback) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(callback);
    },

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(data));
      }
    },

    // ---------------------------------------------------------
    // PATH MEMORY + LEARNING
    // ---------------------------------------------------------
    addPathToMemory(path) {
      if (!path || !path.gatewayIP) return;

      const ip = path.gatewayIP;
      const existing = this.state.pathMemory.find(p => p.ip === ip);

      if (existing) {
        existing.lastSeen = nowMs();
        existing.decay = 1.0;
        if (path.latency != null) existing.latency = path.latency;
        if (path.origin) existing.origin = path.origin;
        if (typeof path.hops === "number") existing.hops = path.hops;
        if (path.distance != null) existing.distance = path.distance;
        return;
      }

      this.state.pathMemory.push({
        type: path.type || "unknown",
        ip,
        latency: path.latency || null,
        lastSeen: nowMs(),
        score: null,
        decay: 1.0,
        origin: path.origin || "local",
        hops: path.hops || 0,
        distance: path.distance || null
      });

      this.setStatus({});
    },

    decayPaths() {
      const now = nowMs();
      this.state.pathMemory.forEach(p => {
        const age = now - p.lastSeen;
        if (age > 30000) p.decay = Math.max(0, p.decay - 0.02);
        if (age > 120000) p.decay = Math.max(0, p.decay - 0.05);
      });
      this.setStatus({});
    },

    learnPathFromSuccess(info) {
      if (!info || !info.gatewayIP) return;
      this.addPathToMemory(info);
    },

    // ---------------------------------------------------------
    // ⭐ v3 SIGNAL BRIDGE (PulseBand → PulseNet)
    // ---------------------------------------------------------
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

      if (samples.length >= 4) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        this.state.signalSlope = last - first;
      }

      this.state.signalScore = score;

      if (score < 55 || this.state.signalSlope < -15) {
        this.handleLowSignal();
      }
      if (score < 25) {
        this.handleNoSignal();
      }

      this.setStatus({});
    },

    // ---------------------------------------------------------
    // MICROPULSE + SCORING
    // ---------------------------------------------------------
    async sendMicropulse(path) {
      if (!path || !path.ip) return null;

      const url = `https://${path.ip}/pulse-micro`;
      const start = performance.now();

      try {
        const res = await fetch(url, { method: "GET" });
        const latency = performance.now() - start;
        const success = res.ok ? 1 : 0;
        const stability = this.computeStability(latency);
        const survivability = this.computeSurvivability(path);

        return { latency, success, stability, survivability };

      } catch (err) {
        const latency = performance.now() - start;

        pushPulseLog({
          type: "micropulse_error",
          path: url,
          error: String(err),
          durationMs: latency,
          extra: { ip: path.ip }
        });

        return {
          latency: 999,
          success: 0,
          stability: 0,
          survivability: this.computeSurvivability(path)
        };
      }
    },

    computeStability(latency) {
      const hist = this.state.jitterHistory;
      hist.push(latency);
      if (hist.length > 10) hist.shift();

      const avg = hist.reduce((a, b) => a + b, 0) / hist.length;
      const variance =
        hist.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / hist.length;
      const jitter = Math.sqrt(variance);

      return Math.max(0, 100 - jitter);
    },

    computeSurvivability(path) {
      const age = nowMs() - (path.lastSeen || 0);
      if (age < 5000) return 100;
      if (age < 15000) return 70;
      if (age < 30000) return 40;
      return 10;
    },

    estimateDistanceFromLatency(latency) {
      const miles = latency * 0.12;
      return Math.round(miles * 10) / 10;
    },

    // ---------------------------------------------------------
    // CLOUD HINTS
    // ---------------------------------------------------------
    async getCloudPathHints() {
      const payload = {
        lastPaths: this.state.pathMemory,
        lastGoodWifi: this.state.lastGoodWifi,
        lastGoodCellular: this.state.lastGoodCellular,
        signalScore: this.state.signalScore
      };

      const start = performance.now();

      try {
        const res = await fetch("/pulsenet/hints", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const durationMs = performance.now() - start;

        if (!res.ok) {
          pushPulseLog({
            type: "cloud_hint_http_error",
            error: `HTTP ${res.status}`,
            durationMs
          });
          return;
        }

        const data = await res.json();

        (data.paths || []).forEach(p =>
          this.addPathToMemory({
            ...p,
            origin: "cloudHint",
            hops: p.hops || 0
          })
        );

        pushPulseLog({
          type: "cloud_hint_received",
          extra: { count: (data.paths || []).length }
        });

      } catch (err) {
        const durationMs = performance.now() - start;
        pushPulseLog({
          type: "cloud_hint_error",
          error: String(err),
          durationMs
        });
      }
    },

    // ---------------------------------------------------------
    // PROBING + SWITCHING
    // ---------------------------------------------------------
    async probePaths() {
      const now = nowMs();
      if (now - this.state.lastProbeTimestamp < 3000) return;

      this.state.lastProbeTimestamp = now;

      const candidates = [
        this.state.lastGoodWifi,
        this.state.lastGoodCellular,
        this.state.lastGoodPulsePath,
        ...this.state.pathMemory
      ].filter(Boolean);

      if (!candidates.length) return;

      const results = [];

      const probes = candidates.map(async (path) => {
        const response = await this.sendMicropulse(path);
        if (response) {
          path.distance = this.estimateDistanceFromLatency(response.latency);
          const score = this.scorePath(response, path) * (path.decay || 1.0);
          results.push({ path, score });
        }
      });

      await Promise.all(probes);

      this.state.probeResults = results;
      this.setStatus({});

      if (results.length) {
        const best = results.sort((a, b) => b.score - a.score)[0];
        this.switchTo(best.path, best.score);
      }
    },

    // ---------------------------------------------------------
    // ⭐ UPDATED SCORING (v3)
    // ---------------------------------------------------------
    scorePath(response, path) {
      const {
        latency = 999,
        success = 0,
        stability = 0,
        survivability = 0
      } = response;

      const baseScore =
        (1000 - latency) * 0.45 +
        success * 0.25 +
        stability * 0.20 +
        survivability * 0.10;

      const hopPenalty = (path.hops || 0) * 25;
      const originBoost = path.origin === "mesh" ? 5 : 0;

      return baseScore - hopPenalty + originBoost;
    },

    // ---------------------------------------------------------
    // ⭐ UPDATED SWITCH LOGIC (v3)
    // ---------------------------------------------------------
    switchTo(path, score) {
      const now = nowMs();
      const prevPath = this.state.activePath;

      this.setStatus({
        activePath: path.type || "Extended",
        bestPathScore: score || null,
        extendedReachActive:
          path.type === "Extended" || path.origin === "mesh",
        lastSwitchTimestamp: now
      });

      this.emit("pathSwitch", {
        path,
        score,
        from: prevPath,
        to: path.type || "Extended",
        hops: path.hops || 0,
        origin: path.origin || "local",
        distance: path.distance || null,
        timestamp: now
      });
    },

    // ---------------------------------------------------------
    // SIGNAL HANDLERS
    // ---------------------------------------------------------
    async handleLowSignal() {
      this.setStatus({ signalState: "LowSignal" });
      this.decayPaths();
      await this.getCloudPathHints();
      await this.probePaths();
    },

    async handleNoSignal() {
      this.setStatus({ signalState: "NoSignal" });
      this.decayPaths();
      await this.getCloudPathHints();
      await this.probePaths();
    }
  };

  window.pulsenet = pulsenet;

})();