// ============================================================================
// FILE: /PulseOS/Scanner/PulseBinaryBehaviorScanner-v12.3-EVO.js
// PULSE OS — v12.3‑EVO
// BINARY BEHAVIOR ORGAN — DUAL-BAND, PRESENCE-AWARE, NODEADMIN‑EVO
// ============================================================================
// ROLE (12.3‑EVO):
//   - Binary-first behavior engine, upgraded to dual-band (binary + presence).
//   - Decide HOW to scan based on environment (body/home/town/kitchen/crab/...).
//   - Binary bits influence: speed, depth, loop radius, wave mode.
//   - Presence influences: stability, safety, anomaly focus.
//   - Multi-phase scanning: coarse → medium → deep → presence.
//   - NodeAdmin‑EVO-aware: harmonics, phase drift, cohesion.
//   - HeatMap‑EVO-aware: presence + environment templates.
//   - AdminInspector‑12.3-aware: presence, harmonics, wave, loop, energy flags.
// ============================================================================

export function createPulseBinaryBehaviorScanner({
  pulse,
  waveScanner,
  loopScanner,
  nodeAdmin,
  heatMap,
  adminInspector,
  trace = false
} = {}) {

  if (!pulse || !waveScanner || !loopScanner || !nodeAdmin || !heatMap) {
    throw new Error("[PulseBinaryBehaviorScanner‑12.3] missing required organs");
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT PROFILES (12.3‑EVO)
  // ---------------------------------------------------------------------------
  const profiles = {
    body:    { envType:"body",    baseLoopScale:0.40, basePasses:9,  presence:"sensitive" },
    home:    { envType:"home",    baseLoopScale:0.60, basePasses:7,  presence:"normal"    },
    town:    { envType:"town",    baseLoopScale:1.00, basePasses:6,  presence:"wide"      },
    kitchen: { envType:"kitchen", baseLoopScale:0.50, basePasses:8,  presence:"normal"    },
    crab:    { envType:"crab",    baseLoopScale:0.50, basePasses:10, presence:"sensitive" }
  };

  function getProfile(envType) {
    return profiles[envType] || profiles.body;
  }

  // ---------------------------------------------------------------------------
  // CORE: RUN A SCAN SESSION (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function runScan({ envType, grid, presenceHistory, harmonics }) {
    const profile = getProfile(envType);

    const H = grid.length;
    const W = grid[0].length;

    // initial binary pulse
    const initialBits = pulse.nextPulseFast();
    const binaryRatio = initialBits.reduce((a,b)=>a+b,0) / initialBits.length;

    // dual-band loop scaling (binary + presence)
    const presenceFactor = computePresenceFactor(presenceHistory, profile.presence);
    const loopScale = clamp(
      profile.baseLoopScale * (0.5 + binaryRatio * 0.5 + presenceFactor * 0.5),
      0.2,
      1.3
    );

    const passes = Math.floor(
      profile.basePasses * (0.7 + binaryRatio * 0.4 + presenceFactor * 0.4)
    );

    const loopMax = Math.floor(Math.max(H, W) * loopScale) || 1;

    let lastWave = { phase:0, amplitude:0 };
    let lastBits = initialBits;

    const loopHistory = [];
    const waveHistory = [];
    const spinSnapshots = [];
    const presenceSnapshots = [];

    // configure NodeAdmin‑EVO baseline
    nodeAdmin.setMode(binaryRatio > 0.55 ? "boost" : "scan");

    // PHASED SCANNING (12.3‑EVO)
    for (let pass = 0; pass < passes; pass++) {
      const phase = getPhase(pass, passes);

      // binary-first pulse mode (dual-band aware)
      const pulseMode = selectPulseMode(binaryRatio, presenceFactor, phase);
      const bits = nextPulse(pulse, pulseMode);
      lastBits = bits;

      // binary-first wave mode (dual-band aware)
      const waveMode = selectWaveMode(binaryRatio, presenceFactor, phase);
      const wave = nextWave(waveScanner, waveMode, bits);
      lastWave = wave;
      waveHistory.push({ phase:wave.phase, amplitude:wave.amplitude });

      // NodeAdmin‑EVO sentinel update
      const sentinels = nodeAdmin.updateSentinels(loopMax);
      const s = sentinels[pass % sentinels.length];

      // loop index
      const loopIndex = loopScanner.nextIndex(bits, loopMax, s.phase);
      loopHistory.push(loopIndex);

      // apply loop sweep (binary-weighted)
      applyLoopSweep(grid, loopIndex, envType, phase, binaryRatio, presenceFactor);

      // apply wave contrast (binary-weighted)
      applyWaveToGrid(grid, wave, phase, binaryRatio, presenceFactor);

      // presence injection
      applyPresenceToGrid(grid, presenceHistory, profile.presence, phase);

      // snapshots
      spinSnapshots.push(snapshotGrid(grid));
      presenceSnapshots.push(snapshotPresence(grid));
    }

    // build environment heatmap (12.3‑EVO)
    const heat = heatMap.buildEnvironmentHeatMap({
      grid,
      envType,
      presenceSnapshots
    });

    // summarize
    const summary = summarizeGrid(grid);

    // inspector flags (12.3‑EVO)
    let flags = [];
    if (adminInspector) {
      flags = adminInspector.inspectAll({
        body: envType==="body" ? grid : emptyLike(grid),
        home: envType==="home" ? grid : emptyLike(grid),
        town: envType==="town" ? grid : emptyLike(grid),
        node: envType==="node" ? grid : emptyLike(grid),
        bits:lastBits,
        spins:spinSnapshots,
        loopHistory,
        waveHistory,
        nodeEnergy: deriveNodeEnergyFromHarmonics(harmonics),
        harmonics,
        presenceHistory
      });
    }

    // NodeAdmin‑EVO advice
    let advice = null;
    if (nodeAdmin.analyzeAndAdvise) {
      advice = nodeAdmin.analyzeAndAdvise({
        envType,
        summary,
        flags,
        presenceSnapshots,
        harmonics,
        binaryRatio
      });
      if (advice?.suggestedMode) nodeAdmin.setMode(advice.suggestedMode);
    }

    if (trace) {
      console.log("[PulseBinaryBehaviorScanner‑12.3‑EVO] runScan", {
        envType,
        summary,
        flagsCount: flags.length,
        advice,
        binaryRatio,
        presenceFactor
      });
    }

    return {
      envType,
      grid,
      heat,
      lastWave,
      summary,
      loopHistory,
      waveHistory,
      flags,
      advice,
      presenceSnapshots,
      binaryRatio,
      presenceFactor
    };
  }

  // ---------------------------------------------------------------------------
  // PHASE LOGIC (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function getPhase(pass, total) {
    const r = pass / Math.max(1, total - 1);
    if (r < 0.25) return "coarse";
    if (r < 0.50) return "medium";
    if (r < 0.75) return "deep";
    return "presence";
  }

  // ---------------------------------------------------------------------------
  // PRESENCE FACTOR (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function computePresenceFactor(history, sensitivity) {
    if (!history || !history.length) return 0.0;

    const last = history[history.length - 1];
    let sum = 0, count = 0;
    for (let y=0; y<last.length; y++) {
      for (let x=0; x<last[0].length; x++) {
        sum += last[y][x] ?? 0;
        count++;
      }
    }
    const avg = count ? sum / count : 0;

    let factor = avg; // 0..1
    if (sensitivity === "sensitive") factor = clamp(factor * 1.2, 0, 1);
    if (sensitivity === "wide")      factor = clamp(factor * 0.9, 0, 1);

    return factor;
  }

  // ---------------------------------------------------------------------------
  // BINARY-FIRST + PRESENCE-AWARE MODE SELECTION
  // ---------------------------------------------------------------------------
  function selectPulseMode(ratio, presenceFactor, phase) {
    const bias = ratio - presenceFactor; // >0 => binary-dominant, <0 => presence-dominant

    if (phase === "coarse") {
      return bias > 0.1 ? "fast" : "normal";
    }
    if (phase === "medium") {
      return bias > 0.2 ? "normal" : "slow";
    }
    if (phase === "deep") {
      return "slow";
    }
    // presence phase: stabilize
    return "slow";
  }

  function selectWaveMode(ratio, presenceFactor, phase) {
    const bias = ratio - presenceFactor;

    if (phase === "coarse") {
      return bias > 0.15 ? "multi" : "standard";
    }
    if (phase === "medium") {
      return bias > 0.1 ? "deep" : "standard";
    }
    if (phase === "deep") {
      return "deep";
    }
    // presence phase: keep deep but less aggressive
    return "deep";
  }

  // ---------------------------------------------------------------------------
  // HELPERS (DUAL-BAND APPLIED)
  // ---------------------------------------------------------------------------
  function nextPulse(pulse, mode) {
    if (mode==="slow"   && pulse.nextPulseSlow)  return pulse.nextPulseSlow();
    if (mode==="fast"   && pulse.nextPulseFast)  return pulse.nextPulseFast();
    if (mode==="normal" && pulse.nextPulse)      return pulse.nextPulse();
    return pulse.nextPulseFast ? pulse.nextPulseFast() : pulse.nextPulse();
  }

  function nextWave(waveScanner, mode, bits) {
    if (mode==="deep"   && waveScanner.nextWaveDeep)  return waveScanner.nextWaveDeep(bits);
    if (mode==="multi"  && waveScanner.nextWaveMulti) {
      const waves = waveScanner.nextWaveMulti(bits);
      return waves[0] || waveScanner.nextWave(bits);
    }
    return waveScanner.nextWave(bits);
  }

  function applyLoopSweep(grid, loopIndex, envType, phase, ratio, presenceFactor) {
    const H = grid.length;
    const W = grid[0].length;

    const baseDelta = phase==="deep" ? 0.05 : phase==="medium" ? 0.035 : 0.02;
    const dualBandScale = 0.5 + ratio * 0.4 + presenceFactor * 0.4;
    const scaled = baseDelta * dualBandScale;

    if (envType==="body" || envType==="crab") {
      const y = loopIndex % H;
      for (let x=0; x<W; x++) {
        grid[y][x].density = clamp(grid[y][x].density + scaled, 0, 1);
      }
    } else {
      const x = loopIndex % W;
      for (let y=0; y<H; y++) {
        grid[y][x].density = clamp(grid[y][x].density + scaled, 0, 1);
      }
    }
  }

  function applyWaveToGrid(grid, wave, phase, ratio, presenceFactor) {
    const H = grid.length;
    const W = grid[0].length;

    const baseBlend = phase==="deep" ? 0.4 : phase==="medium" ? 0.3 : 0.2;
    const dualBandScale = 0.5 + ratio * 0.3 + presenceFactor * 0.5;
    const scaled = baseBlend * dualBandScale;

    for (let y=0; y<H; y++) {
      for (let x=0; x<W; x++) {
        const cell = grid[y][x];
        const phaseTerm = wave.phase + (x+y)*0.05;
        const baseContrast = Math.abs(Math.sin(phaseTerm));
        cell.contrast = clamp(cell.contrast*(1-scaled) + baseContrast*scaled, 0, 1);
        cell.wave = wave.amplitude;
      }
    }
  }

  function applyPresenceToGrid(grid, history, sensitivity, phase) {
    if (!history || !history.length) return;

    const last = history[history.length - 1];
    const factor = phase==="presence" ? 0.45 : 0.15;

    for (let y=0; y<grid.length; y++) {
      for (let x=0; x<grid[0].length; x++) {
        const cell = grid[y][x];
        const p = last[y]?.[x] ?? 0;
        cell.presence = clamp((cell.presence ?? 0)*(1-factor) + p*factor, 0, 1);
      }
    }
  }

  function summarizeGrid(grid) {
    let d=0,c=0,w=0,p=0,count=0;
    grid.forEach(row => row.forEach(cell => {
      d+=cell.density; c+=cell.contrast; w+=cell.wave; p+=(cell.presence ?? 0); count++;
    }));
    return {
      densityAvg:  count? d/count : 0,
      contrastAvg: count? c/count : 0,
      waveAvg:     count? w/count : 0,
      presenceAvg: count? p/count : 0
    };
  }

  function snapshotGrid(grid) {
    return grid.map(row => row.map(c => ({
      density:c.density,
      contrast:c.contrast,
      wave:c.wave,
      presence:c.presence,
      tags:c.tags
    })));
  }

  function snapshotPresence(grid) {
    return grid.map(row => row.map(c => c.presence ?? 0));
  }

  function emptyLike(grid) {
    return grid.map(row => row.map(() => ({
      density:0, contrast:0, wave:0, presence:0, tags:[]
    })));
  }

  // derive a scalar nodeEnergy from harmonics (12.3‑EVO compatible)
  function deriveNodeEnergyFromHarmonics(harmonics) {
    if (!harmonics || !harmonics.length) return 0.5;
    let sum = 0, count = 0;
    for (const h of harmonics) {
      const coh = h.cohesionScore ?? 0.5;
      sum += coh;
      count++;
    }
    return count ? clamp(sum / count, 0, 1) : 0.5;
  }

  return { runScan };
}

// -----------------------------------------------------------------------------
// UTIL
// -----------------------------------------------------------------------------
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
