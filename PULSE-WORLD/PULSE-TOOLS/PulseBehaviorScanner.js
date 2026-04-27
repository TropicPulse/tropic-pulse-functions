// ============================================================================
// FILE: /apps/PulseOS/Scanner/PulseBehaviorScanner-v11-EVO.js
// PULSE OS — v11-EVO
// ENVIRONMENT BEHAVIOR ORGAN — LOOP/WAVE/NODE-DRIVEN, NON-BINARY
// ============================================================================
// ROLE:
//   - Decide HOW to scan based on environment (body/home/town/kitchen/crab/...).
//   - Multi-phase scanning: coarse → medium → deep.
//   - NodeAdmin-aware: sentinel energy, frequency, wavelength.
//   - HeatMap-aware: environment templates.
//   - AdminInspector-aware: flags, anomalies, escalation.
//   - Environment-first (NOT binary-first).
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
    throw new Error("[PulseBehaviorScanner] missing required organs");
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT PROFILES (BASELINES)
  // ---------------------------------------------------------------------------
  const profiles = {
    body:    { envType:"body",    loopScale:0.40, passes:9,  pulse:"slow",   wave:"deep",  node:"scan"  },
    home:    { envType:"home",    loopScale:0.60, passes:7,  pulse:"normal", wave:"deep",  node:"scan"  },
    town:    { envType:"town",    loopScale:1.00, passes:6,  pulse:"fast",   wave:"multi", node:"boost" },
    kitchen: { envType:"kitchen", loopScale:0.50, passes:8,  pulse:"slow",   wave:"deep",  node:"scan"  },
    crab:    { envType:"crab",    loopScale:0.50, passes:10, pulse:"slow",   wave:"deep",  node:"scan"  }
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

    // environment-first loop scaling
    const loopMax = Math.floor(Math.max(H, W) * profile.loopScale) || 1;

    // configure NodeAdmin baseline
    nodeAdmin.setMode(profile.node);

    const loopHistory = [];
    const waveHistory = [];
    const spinSnapshots = [];

    let lastWave = { phase:0, amplitude:0 };
    let lastBits = [];

    // PHASED SCANNING
    for (let pass = 0; pass < profile.passes; pass++) {
      const phase = getPhase(pass, profile.passes);

      // pulse mode
      const pulseMode = selectPulseMode(profile.pulse, phase);
      const bits = nextPulse(pulse, pulseMode);
      lastBits = bits;

      // wave mode
      const waveMode = selectWaveMode(profile.wave, phase);
      const wave = nextWave(waveScanner, waveMode, bits);
      lastWave = wave;
      waveHistory.push({ phase:wave.phase, amplitude:wave.amplitude });

      // NodeAdmin sentinel update
      const sentinels = nodeAdmin.updateSentinels(loopMax);
      const s = sentinels[pass % sentinels.length];

      // loop index
      const loopIndex = loopScanner.nextIndex(bits, loopMax, s.phase);
      loopHistory.push(loopIndex);

      // apply loop sweep
      applyLoopSweep(grid, loopIndex, envType, phase);

      // apply wave contrast
      applyWaveToGrid(grid, wave, phase);

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
      console.log("[PulseBehaviorScanner-v11-EVO] runScan", {
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
  // MODE SELECTION (ENVIRONMENT-FIRST)
  // ---------------------------------------------------------------------------
  function selectPulseMode(base, phase) {
    if (phase==="coarse") return base==="fast" ? "fast" : "normal";
    if (phase==="medium") return base;
    return "slow";
  }

  function selectWaveMode(base, phase) {
    if (phase==="coarse") return base==="multi" ? "multi" : "standard";
    if (phase==="medium") return base;
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

  function applyLoopSweep(grid, loopIndex, envType, phase) {
    const H = grid.length;
    const W = grid[0].length;

    const delta = phase==="deep" ? 0.05 : phase==="medium" ? 0.035 : 0.02;

    if (envType==="body" || envType==="crab") {
      const y = loopIndex % H;
      for (let x=0; x<W; x++) {
        grid[y][x].density = clamp(grid[y][x].density + delta, 0, 1);
      }
    } else {
      const x = loopIndex % W;
      for (let y=0; y<H; y++) {
        grid[y][x].density = clamp(grid[y][x].density + delta, 0, 1);
      }
    }
  }

  function applyWaveToGrid(grid, wave, phase) {
    const H = grid.length;
    const W = grid[0].length;

    const blend = phase==="deep" ? 0.4 : phase==="medium" ? 0.3 : 0.2;

    for (let y=0; y<H; y++) {
      for (let x=0; x<W; x++) {
        const cell = grid[y][x];
        const phaseTerm = wave.phase + (x+y)*0.05;
        const baseContrast = Math.abs(Math.sin(phaseTerm));
        cell.contrast = clamp(cell.contrast*(1-blend) + baseContrast*blend, 0, 1);
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
