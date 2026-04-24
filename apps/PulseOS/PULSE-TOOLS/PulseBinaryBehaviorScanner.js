// ============================================================================
// FILE: /apps/PulseOS/Scanner/PulseBinaryBehaviorScanner-v11-EVO.js
// PULSE OS — v11-EVO
// BINARY BEHAVIOR ORGAN — ENVIRONMENT-AWARE, LOOP/WAVE/NODE-DRIVEN
// ============================================================================
// ROLE:
//   - Binary-first behavior engine.
//   - Decide HOW to scan based on environment (body/home/town/kitchen/crab/...).
//   - Binary bits determine: speed, depth, loop radius, wave mode.
//   - Multi-phase scanning: coarse → medium → deep.
//   - NodeAdmin-aware: sentinel energy, frequency, wavelength.
//   - HeatMap-aware: environment templates.
//   - AdminInspector-aware: flags, anomalies, escalation.
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
    throw new Error("[PulseBinaryBehaviorScanner] missing required organs");
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT PROFILES (BASELINES)
  // ---------------------------------------------------------------------------
  const profiles = {
    body:    { envType:"body",    baseLoopScale:0.40, basePasses:9 },
    home:    { envType:"home",    baseLoopScale:0.60, basePasses:7 },
    town:    { envType:"town",    baseLoopScale:1.00, basePasses:6 },
    kitchen: { envType:"kitchen", baseLoopScale:0.50, basePasses:8 },
    crab:    { envType:"crab",    baseLoopScale:0.50, basePasses:10 }
  };

  function getProfile(envType) {
    return profiles[envType] || profiles.body;
  }

  // ---------------------------------------------------------------------------
  // CORE: RUN A SCAN SESSION
  // ---------------------------------------------------------------------------
  function runScan({ envType, grid }) {
    const profile = getProfile(envType);

    const H = grid.length;
    const W = grid[0].length;

    // binary-first loop scaling
    const bits = pulse.nextPulseFast();
    const binaryRatio = bits.reduce((a,b)=>a+b,0) / bits.length;

    const loopScale = clamp(
      profile.baseLoopScale * (0.5 + binaryRatio),
      0.2,
      1.2
    );

    const passes = Math.floor(
      profile.basePasses * (0.7 + binaryRatio * 0.6)
    );

    const loopMax = Math.floor(Math.max(H, W) * loopScale) || 1;

    let lastWave = { phase:0, amplitude:0 };
    let lastBits = bits;

    const loopHistory = [];
    const waveHistory = [];
    const spinSnapshots = [];

    // PHASED SCANNING
    for (let pass = 0; pass < passes; pass++) {
      const phase = getPhase(pass, passes);

      // binary-first pulse mode
      const pulseMode = selectPulseMode(binaryRatio, phase);
      const bits = nextPulse(pulse, pulseMode);
      lastBits = bits;

      // binary-first wave mode
      const waveMode = selectWaveMode(binaryRatio, phase);
      const wave = nextWave(waveScanner, waveMode, bits);
      lastWave = wave;
      waveHistory.push({ phase:wave.phase, amplitude:wave.amplitude });

      // NodeAdmin sentinel update
      const sentinels = nodeAdmin.updateSentinels(loopMax);
      const s = sentinels[pass % sentinels.length];

      // binary-first loop index
      const loopIndex = loopScanner.nextIndex(bits, loopMax, s.phase);
      loopHistory.push(loopIndex);

      // apply loop sweep
      applyLoopSweep(grid, loopIndex, envType, phase, binaryRatio);

      // apply wave contrast
      applyWaveToGrid(grid, wave, phase, binaryRatio);

      // snapshot for multi-spin analysis
      spinSnapshots.push(snapshotGrid(grid));
    }

    // build environment heatmap
    const heat = heatMap.buildEnvironmentHeatMap({ grid, envType });

    // summarize
    const summary = summarizeGrid(grid);

    // inspector flags
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
        nodeEnergy: averageSentinelEnergy(nodeAdmin, loopMax)
      });
    }

    // NodeAdmin advice
    let advice = null;
    if (nodeAdmin.analyzeAndAdvise) {
      advice = nodeAdmin.analyzeAndAdvise({
        body: envType==="body" ? summary : null,
        home: envType==="home" ? summary : null,
        town: envType==="town" ? summary : null,
        node: envType==="node" ? summary : null,
        flags
      });
      if (advice?.suggestedMode) nodeAdmin.setMode(advice.suggestedMode);
    }

    if (trace) {
      console.log("[PulseBinaryBehaviorScanner] runScan", {
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
      advice
    };
  }

  // ---------------------------------------------------------------------------
  // PHASE LOGIC
  // ---------------------------------------------------------------------------
  function getPhase(pass, total) {
    const r = pass / Math.max(1, total - 1);
    if (r < 0.33) return "coarse";
    if (r < 0.66) return "medium";
    return "deep";
  }

  // ---------------------------------------------------------------------------
  // BINARY-FIRST MODE SELECTION
  // ---------------------------------------------------------------------------
  function selectPulseMode(ratio, phase) {
    if (phase === "coarse") return ratio > 0.5 ? "fast" : "normal";
    if (phase === "medium") return ratio > 0.6 ? "normal" : "slow";
    return "slow";
  }

  function selectWaveMode(ratio, phase) {
    if (phase === "coarse") return ratio > 0.6 ? "multi" : "standard";
    if (phase === "medium") return ratio > 0.5 ? "deep" : "standard";
    return "deep";
  }

  // ---------------------------------------------------------------------------
  // HELPERS
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

  function applyLoopSweep(grid, loopIndex, envType, phase, ratio) {
    const H = grid.length;
    const W = grid[0].length;

    const delta = phase==="deep" ? 0.05 : phase==="medium" ? 0.035 : 0.02;
    const scaled = delta * (0.5 + ratio);

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

  function applyWaveToGrid(grid, wave, phase, ratio) {
    const H = grid.length;
    const W = grid[0].length;

    const blend = phase==="deep" ? 0.4 : phase==="medium" ? 0.3 : 0.2;
    const scaled = blend * (0.5 + ratio);

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

  function summarizeGrid(grid) {
    let d=0,c=0,w=0,count=0;
    grid.forEach(row => row.forEach(cell => {
      d+=cell.density; c+=cell.contrast; w+=cell.wave; count++;
    }));
    return {
      densityAvg: count? d/count : 0,
      contrastAvg: count? c/count : 0,
      waveAvg: count? w/count : 0
    };
  }

  function snapshotGrid(grid) {
    return grid.map(row => row.map(c => ({
      density:c.density,
      contrast:c.contrast,
      wave:c.wave,
      tags:c.tags
    })));
  }

  function emptyLike(grid) {
    return grid.map(row => row.map(() => ({
      density:0, contrast:0, wave:0, tags:[]
    })));
  }

  function averageSentinelEnergy(nodeAdmin, loopMax) {
    const sentinels = nodeAdmin.updateSentinels(loopMax);
    if (!sentinels?.length) return 0.5;
    return sentinels.reduce((a,s)=>a+(s.energy||0.5),0) / sentinels.length;
  }

  return { runScan };
}

// -----------------------------------------------------------------------------
// UTIL
// -----------------------------------------------------------------------------
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
