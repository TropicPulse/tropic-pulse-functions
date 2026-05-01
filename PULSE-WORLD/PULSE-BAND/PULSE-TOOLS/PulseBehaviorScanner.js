// ============================================================================
// FILE: /PulseOS/Scanner/PulseBehaviorScanner-v12.3-EVO.js
// PULSE OS — v12.3‑EVO
// ENVIRONMENT BEHAVIOR ORGAN — PRESENCE-AWARE, DUAL-BAND, NODEADMIN‑EVO
// ============================================================================
// ROLE (12.3‑EVO):
//   - Decide HOW to scan based on environment (body/home/town/kitchen/crab/...).
//   - Multi-phase scanning: coarse → medium → deep → presence.
//   - Dual-band: pulse (environment) + binary (precision).
//   - Presence-aware: void/spike/shadow/echo detection.
//   - NodeAdmin‑EVO-aware: sentinel harmonics, phase drift, energy coupling.
//   - HeatMap‑EVO-aware: presence templates + environment templates.
//   - AdminInspector‑12.3-aware: presence flags, harmonic drift, wave collapse.
//   - Environment-first with presence override.
// ============================================================================

export function createPulseBehaviorScanner({
  pulse,
  waveScanner,
  loopScanner,
  nodeAdmin,
  heatMap,
  adminInspector,
  trace = false
} = {}) {

  if (!pulse || !waveScanner || !loopScanner || !nodeAdmin || !heatMap) {
    throw new Error("[PulseBehaviorScanner‑12.3] missing required organs");
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT PROFILES (12.3‑EVO)
  // ---------------------------------------------------------------------------
  const profiles = {
    body:    { envType:"body",    loopScale:0.40, passes:10, pulse:"slow",   wave:"deep",  node:"scan",   presence:"sensitive" },
    home:    { envType:"home",    loopScale:0.60, passes:8,  pulse:"normal", wave:"deep",  node:"scan",   presence:"normal"    },
    town:    { envType:"town",    loopScale:1.00, passes:7,  pulse:"fast",   wave:"multi", node:"boost",  presence:"wide"      },
    kitchen: { envType:"kitchen", loopScale:0.50, passes:9,  pulse:"slow",   wave:"deep",  node:"scan",   presence:"normal"    },
    crab:    { envType:"crab",    loopScale:0.50, passes:11, pulse:"slow",   wave:"deep",  node:"scan",   presence:"sensitive" }
  };

  function getProfile(envType) {
    return profiles[envType] || profiles.body;
  }
// ---------------------------------------------------------------------------
// CORE: RUN A SCAN SESSION (12.3‑EVO+)
// ---------------------------------------------------------------------------
function runScan({ envType, grid, presenceHistory, harmonics }) {
  const profile = getProfile(envType);

  const H = grid.length;
  const W = grid[0].length;

  // environment-first loop scaling
  const loopMax = Math.floor(Math.max(H, W) * profile.loopScale) || 1;

  // configure NodeAdmin‑EVO baseline
  nodeAdmin.setMode(profile.node);

  const loopHistory = [];
  const waveHistory = [];
  const spinSnapshots = [];
  const presenceSnapshots = [];

  let lastWave = { phase:0, amplitude:0 };
  let lastBits = [];

  // PRECOMPUTE PRESENCE FACTOR (12.3‑EVO+)
  const presenceFactor = computePresenceFactor(presenceHistory, profile.presence);

  // PHASED SCANNING (12.3‑EVO+)
  for (let pass = 0; pass < profile.passes; pass++) {
    const phase = getPhase(pass, profile.passes);

    // pulse mode (presence‑aware dual‑band)
    const pulseMode = selectPulseMode(profile.pulse, presenceFactor, phase);
    const bits = nextPulse(pulse, pulseMode);
    lastBits = bits;

    // wave mode (presence‑aware)
    const waveMode = selectWaveMode(profile.wave, presenceFactor, phase);
    const wave = nextWave(waveScanner, waveMode, bits);
    lastWave = wave;
    waveHistory.push({ phase:wave.phase, amplitude:wave.amplitude });

    // NodeAdmin‑EVO sentinel update
    const sentinels = nodeAdmin.updateSentinels(loopMax);
    const s = sentinels[pass % sentinels.length];

    // loop index
    const loopIndex = loopScanner.nextIndex(bits, loopMax, s.phase);
    loopHistory.push(loopIndex);

    // apply loop sweep
    applyLoopSweep(grid, loopIndex, envType, phase);

    // apply wave contrast
    applyWaveToGrid(grid, wave, phase);

    // presence injection (12.3‑EVO)
    applyPresenceToGrid(grid, presenceHistory, profile.presence, phase);

    // snapshot for multi-spin + presence analysis
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

  // inspector flags (12.3‑EVO+)
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

      // ⭐ v12.3‑EVO+ replacement for deprecated averageSentinelEnergy
      nodeEnergy: nodeAdmin.getHarmonicEnergy(),
      nodeCohesion: nodeAdmin.getCohesionScore(),
      presenceCoupling: nodeAdmin.getPresenceCoupling(),

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
      harmonics
    });
    if (advice?.suggestedMode) nodeAdmin.setMode(advice.suggestedMode);
  }

  if (trace) {
    console.log("[PulseBehaviorScanner‑12.3‑EVO] runScan", {
      envType,
      summary,
      flagsCount: flags.length,
      advice
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
    presenceSnapshots
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
  // PRESENCE APPLICATION (12.3‑EVO)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // HELPERS (unchanged + presence additions)
  // ---------------------------------------------------------------------------
  function snapshotPresence(grid) {
    return grid.map(row => row.map(c => c.presence ?? 0));
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
