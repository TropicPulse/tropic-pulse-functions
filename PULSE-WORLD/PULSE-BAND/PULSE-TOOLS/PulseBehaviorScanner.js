// ============================================================================
// FILE: /PulseOS/Scanner/PulseBinaryBehaviorScanner-v16.js
// PULSE OS — v16‑IMMORTAL
// BINARY BEHAVIOR ORGAN — DUAL-BAND, PRESENCE/HARMONICS/GPU-AWARE, NODEADMIN‑EVO
// ============================================================================
// ROLE (v16‑IMMORTAL):
//   - Binary-first behavior engine, dual-band (binary + presence) with harmonics + GPU overlays.
//   - Decide HOW to scan based on environment (body/home/town/kitchen/crab/...).
//   - Binary bits influence: speed, depth, loop radius, wave mode.
//   - Presence influences: stability, safety, anomaly focus.
//   - Harmonics influence: cohesion, drift, energy mood.
//   - GPU influence: symbolic bias only (no IO), for advantage/artery-aware paths.
//   - Multi-phase scanning: coarse → medium → deep → presence.
//   - NodeAdmin‑EVO-aware: harmonics, phase drift, cohesion.
//   - HeatMap‑EVO-aware: presence + environment templates.
//   - AdminInspector‑IMMORTAL-aware: presence, harmonics, wave, loop, energy flags.
//   - Zero randomness, zero timestamps, zero mutation of inputs.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryBehaviorScanner",
  version: "v16-Immortal",
  layer: "behavior_scanner",
  role: "binary_behavior_organ",
  lineage: "PulseBinaryBehaviorScanner-v12.3-Evo → v16-Immortal",

  evo: {
    behaviorOrgan: true,
    dualBand: true,
    presenceAware: true,
    harmonicAware: true,
    arteryAware: true,
    advantageView: true,
    windowSafe: true,

    nodeAdminAware: true,
    heatMapAware: true,
    adminInspectorAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    zeroRandomness: true
  },

  contract: {
    always: [
      "BinaryPulse",
      "BinaryWaveScanner",
      "PulseBinaryLoopScanner",
      "PulseAdminInspector",
      "NodeAdminEVO",
      "HeatMapEVO",
      "PageEvo"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyBehaviorScanner"
    ]
  }
}
*/

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
    throw new Error("[PulseBinaryBehaviorScanner‑16-IMMORTAL] missing required organs");
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT PROFILES (v16‑IMMORTAL, same shape, tuned constants)
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
  // CORE: RUN A SCAN SESSION (v16‑IMMORTAL)
  // ---------------------------------------------------------------------------
  // NOTE: signature kept v12.3-compatible; gpuStats is optional.
  function runScan({ envType, grid, presenceHistory, harmonics, gpuStats } = {}) {
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

    // NodeAdmin‑EVO baseline mode
    nodeAdmin.setMode(binaryRatio > 0.55 ? "boost" : "scan");

    const nodeEnergyView = deriveNodeEnergyView(harmonics);
    const harmonicBias = nodeEnergyView.energy;

    // PHASED SCANNING (v16‑IMMORTAL)
    for (let pass = 0; pass < passes; pass++) {
      const phase = getPhase(pass, passes);

      // binary-first pulse mode (dual-band aware)
      const pulseMode = selectPulseMode(binaryRatio, presenceFactor, phase);
      const bits = nextPulse(pulse, pulseMode);
      lastBits = bits;

      // binary-first wave mode (dual-band + harmonics + GPU aware)
      const waveMode = selectWaveMode(binaryRatio, presenceFactor, phase);
      const wave = nextWave(waveScanner, waveMode, bits, {
        presence: presenceFactor,
        harmonicBias,
        gpuStats
      });
      lastWave = wave;
      waveHistory.push({ phase:wave.phase, amplitude:wave.amplitude });

      // NodeAdmin‑EVO sentinel update
      const sentinels = nodeAdmin.updateSentinels(loopMax);
      const s = sentinels[pass % sentinels.length];

      // loop index (dual-band aware via loopScanner)
      const loopIndex = loopScanner.nextIndex(
        bits,
        loopMax,
        s.phase,
        presenceFactor,
        harmonicBias
      );
      loopHistory.push(loopIndex);

      // apply loop sweep (binary + presence + harmonics + GPU symbolic bias)
      applyLoopSweep(grid, loopIndex, envType, phase, binaryRatio, presenceFactor, {
        harmonicBias,
        gpuInfluence: gpuStats?.loadFactor ?? 0
      });

      // apply wave contrast (binary + presence + harmonics)
      applyWaveToGrid(grid, wave, phase, binaryRatio, presenceFactor, {
        presence: presenceFactor,
        harmonicBias
      });

      // presence injection
      const sensitivityScalar =
        profile.presence === "sensitive" ? 1.2 :
        profile.presence === "wide"      ? 0.9 :
                                           1.0;
      applyPresenceToGrid(grid, presenceHistory, sensitivityScalar, phase);

      // snapshots
      spinSnapshots.push(snapshotGrid(grid));
      presenceSnapshots.push(snapshotPresence(grid));
    }

    // build environment heatmap (IMMORTAL, same API)
    const heat = heatMap.buildEnvironmentHeatMap({
      grid,
      envType,
      presenceSnapshots
    });

    // summarize
    const summary = summarizeGrid(grid);

    // inspector flags (IMMORTAL)
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
        nodeEnergy: nodeEnergyView.energy,
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
        binaryRatio,
        nodeEnergyView
      });
      if (advice?.suggestedMode) nodeAdmin.setMode(advice.suggestedMode);
    }

    if (trace) {
      console.log("[PulseBinaryBehaviorScanner‑16-IMMORTAL] runScan", {
        envType,
        summary,
        flagsCount: flags.length,
        advice,
        binaryRatio,
        presenceFactor,
        nodeEnergyView
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
      presenceFactor,
      nodeEnergyView
    };
  }

  // ---------------------------------------------------------------------------
  // PHASE LOGIC (unchanged semantics, v16‑IMMORTAL)
// ---------------------------------------------------------------------------
  function getPhase(pass, total) {
    const r = pass / Math.max(1, total - 1);
    if (r < 0.25) return "coarse";
    if (r < 0.50) return "medium";
    if (r < 0.75) return "deep";
    return "presence";
  }

  // ---------------------------------------------------------------------------
  // PRESENCE FACTOR (dual-band scalar, v16‑IMMORTAL)
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
  // BINARY-FIRST + PRESENCE-AWARE MODE SELECTION (v16‑IMMORTAL)
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
  // HELPERS (DUAL-BAND + ADVANTAGE + ARTERY/GPU-AWARE, v16‑IMMORTAL)
// ---------------------------------------------------------------------------
  function nextPulse(pulse, mode) {
    // v11-compatible, but prefers explicit modes if present
    if (mode==="slow"   && pulse.nextPulseSlow)  return pulse.nextPulseSlow();
    if (mode==="fast"   && pulse.nextPulseFast)  return pulse.nextPulseFast();
    if (mode==="normal" && pulse.nextPulse)      return pulse.nextPulse();
    return pulse.nextPulseFast ? pulse.nextPulseFast() : pulse.nextPulse();
  }

  // v16-IMMORTAL: dual-band + GPU-aware options, but v11-safe
  // usage:
  //   nextWave(scanner, mode, bits)                          // legacy
  //   nextWave(scanner, mode, bits, { presence, harmonicBias, gpuStats })
  function nextWave(waveScanner, mode, bits, opts) {
    const presence     = opts && typeof opts === "object" ? (opts.presence ?? 0)     : 0;
    const harmonicBias = opts && typeof opts === "object" ? (opts.harmonicBias ?? 0) : 0;
    const gpuStats     = opts && typeof opts === "object" ? (opts.gpuStats ?? null)  : null;

    const hasAdvantageView = typeof waveScanner.nextAdvantageView === "function";

    // If scanner is v16-IMMORTAL with advantage view, we can route through it
    if (hasAdvantageView && mode === "advantage") {
      return waveScanner.nextAdvantageView({
        bits,
        presence,
        harmonicBias,
        gpuStats
      });
    }

    // Prefer v16 signatures if available (presence/harmonic/gpu), else fall back to v12.3
    const callStandard = () =>
      waveScanner.nextWave.length >= 4
        ? waveScanner.nextWave(bits, presence, harmonicBias, gpuStats)
        : waveScanner.nextWave(bits);

    const callDeep = () =>
      waveScanner.nextWaveDeep.length >= 4
        ? waveScanner.nextWaveDeep(bits, presence, harmonicBias, gpuStats)
        : waveScanner.nextWaveDeep(bits);

    const callMulti = () =>
      waveScanner.nextWaveMulti.length >= 4
        ? waveScanner.nextWaveMulti(bits, presence, harmonicBias, gpuStats)
        : waveScanner.nextWaveMulti(bits);

    const callEdge = () =>
      waveScanner.nextWaveEdge.length >= 4
        ? waveScanner.nextWaveEdge(bits, presence, harmonicBias, gpuStats)
        : waveScanner.nextWaveEdge(bits);

    const callFlat = () =>
      waveScanner.nextWaveFlat.length >= 4
        ? waveScanner.nextWaveFlat(bits, presence, harmonicBias, gpuStats)
        : waveScanner.nextWaveFlat(bits);

    const callUltra = () =>
      typeof waveScanner.nextWaveUltraMulti === "function"
        ? (waveScanner.nextWaveUltraMulti.length >= 4
            ? waveScanner.nextWaveUltraMulti(bits, presence, harmonicBias, gpuStats)
            : waveScanner.nextWaveUltraMulti(bits))
        : null;

    if (mode === "deep"   && waveScanner.nextWaveDeep)  return callDeep();
    if (mode === "multi"  && waveScanner.nextWaveMulti) {
      const waves = callMulti();
      return Array.isArray(waves) && waves.length ? waves[0] : callStandard();
    }
    if (mode === "edge"   && waveScanner.nextWaveEdge)  return callEdge();
    if (mode === "flat"   && waveScanner.nextWaveFlat)  return callFlat();
    if (mode === "ultra"  && waveScanner.nextWaveUltraMulti) {
      const waves = callUltra();
      return Array.isArray(waves) && waves.length ? waves[0] : callStandard();
    }

    return callStandard();
  }

  // v16-IMMORTAL: loop sweep now dual-band + harmonic + GPU aware (symbolic only)
  // optional opts: { harmonicBias, presence, gpuInfluence }
  function applyLoopSweep(grid, loopIndex, envType, phase, ratio, presenceFactor, opts = {}) {
    const H = grid.length;
    const W = grid[0].length;

    const harmonicBias = opts.harmonicBias ?? 0;
    const gpuInfluence = opts.gpuInfluence ?? 0;

    const baseDelta =
      phase === "deep"   ? 0.05 :
      phase === "medium" ? 0.035 :
      phase === "flat"   ? 0.015 :
                           0.02;

    const dualBandScale =
      0.4 +
      ratio * 0.3 +
      presenceFactor * 0.3 +
      harmonicBias * 0.2 +
      gpuInfluence * 0.1;

    const scaled = baseDelta * clamp(dualBandScale, 0.2, 1.4);

    if (envType==="body" || envType==="crab") {
      const y = loopIndex % H;
      for (let x=0; x<W; x++) {
        const cell = grid[y][x];
        cell.density = clamp(cell.density + scaled, 0, 1);
      }
    } else {
      const x = loopIndex % W;
      for (let y=0; y<H; y++) {
        const cell = grid[y][x];
        cell.density = clamp(cell.density + scaled, 0, 1);
      }
    }
  }

  // v16-IMMORTAL: wave → grid with depth/reflection awareness if present
  // optional opts: { presence, harmonicBias }
  function applyWaveToGrid(grid, wave, phase, ratio, presenceFactor, opts = {}) {
    const H = grid.length;
    const W = grid[0].length;

    const presence = opts.presence ?? presenceFactor;
    const harmonicBias = opts.harmonicBias ?? 0;

    const baseBlend =
      phase === "deep"   ? 0.4 :
      phase === "medium" ? 0.3 :
      phase === "flat"   ? 0.18 :
                           0.2;

    const dualBandScale =
      0.4 +
      ratio * 0.25 +
      presence * 0.4 +
      harmonicBias * 0.25;

    const scaled = baseBlend * clamp(dualBandScale, 0.3, 1.5);

    const depth      = wave.depth      ?? wave.amplitude ?? 0;
    const reflection = wave.reflection ?? wave.amplitude ?? 0;
    const band       = wave.band       ?? 1;

    for (let y=0; y<H; y++) {
      for (let x=0; x<W; x++) {
        const cell = grid[y][x];
        const phaseTerm = (wave.phase ?? 0) + (x + y) * 0.05;

        const baseContrast = Math.abs(Math.sin(phaseTerm));
        const depthBoost   = clamp(depth * 0.6 + reflection * 0.4, 0, 1);
        const bandWeight   = clamp(band, 0.5, 1.5);

        const targetContrast = clamp(
          baseContrast * (0.6 + depthBoost * 0.4) * bandWeight,
          0,
          1
        );

        cell.contrast = clamp(
          cell.contrast * (1 - scaled) + targetContrast * scaled,
          0,
          1
        );

        cell.wave = wave.amplitude ?? depth;
      }
    }
  }

  // v16-IMMORTAL: presence history → grid, sensitivity + phase-aware
  function applyPresenceToGrid(grid, history, sensitivityScalar, phase) {
    if (!history || !history.length) return;

    const last = history[history.length - 1];
    const baseFactor =
      phase === "presence" ? 0.45 :
      phase === "deep"     ? 0.3  :
                             0.15;

    const factor = clamp(baseFactor * (sensitivityScalar ?? 1), 0, 0.7);

    for (let y=0; y<grid.length; y++) {
      for (let x=0; x<grid[0].length; x++) {
        const cell = grid[y][x];
        const p = last[y]?.[x] ?? 0;
        const prev = cell.presence ?? 0;
        cell.presence = clamp(prev * (1 - factor) + p * factor, 0, 1);
      }
    }
  }

  // v16-IMMORTAL: richer summary (still returns v11-safe fields)
  function summarizeGrid(grid) {
    let d = 0, c = 0, w = 0, p = 0, count = 0;
    let d2 = 0, c2 = 0, pMin = 1, pMax = 0;

    grid.forEach(row => row.forEach(cell => {
      const density  = cell.density  ?? 0;
      const contrast = cell.contrast ?? 0;
      const wave     = cell.wave     ?? 0;
      const presence = cell.presence ?? 0;

      d += density; c += contrast; w += wave; p += presence; count++;

      d2 += density * density;
      c2 += contrast * contrast;

      if (presence < pMin) pMin = presence;
      if (presence > pMax) pMax = presence;
    }));

    const densityAvg  = count ? d / count : 0;
    const contrastAvg = count ? c / count : 0;
    const waveAvg     = count ? w / count : 0;
    const presenceAvg = count ? p / count : 0;

    const densityVar  = count ? d2 / count - densityAvg * densityAvg : 0;
    const contrastVar = count ? c2 / count - contrastAvg * contrastAvg : 0;

    return {
      densityAvg,
      contrastAvg,
      waveAvg,
      presenceAvg,

      densityVar,
      contrastVar,
      presenceMin: count ? pMin : 0,
      presenceMax: count ? pMax : 0
    };
  }

  function snapshotGrid(grid) {
    return grid.map(row => row.map(c => ({
      density:   c.density,
      contrast:  c.contrast,
      wave:      c.wave,
      presence:  c.presence,
      tags:      c.tags,
      alert:     c.alert,
      tint:      c.tint,
      mood:      c.mood,
      visibility:c.visibility
    })));
  }

  function snapshotPresence(grid) {
    return grid.map(row => row.map(c => c.presence ?? 0));
  }

  function emptyLike(grid) {
    return grid.map(row => row.map(() => ({
      density:  0,
      contrast: 0,
      wave:     0,
      presence: 0,
      tags:     []
    })));
  }

  // v16-IMMORTAL: derive nodeEnergy + symbolic view from harmonics
  function deriveNodeEnergyFromHarmonics(harmonics) {
    if (!harmonics || !harmonics.length) return 0.5;
    let sum = 0, count = 0;
    for (const h of harmonics) {
      const coh   = h.cohesionScore ?? 0.5;
      const drift = Math.abs(h.phaseDrift ?? 0);
      const amp   = h.amplitude ?? 0.5;
      const score = clamp(coh * 0.6 + (1 - drift) * 0.25 + amp * 0.15, 0, 1);
      sum += score;
      count++;
    }
    return count ? clamp(sum / count, 0, 1) : 0.5;
  }

  // v16-IMMORTAL: richer energy view (optional, non-breaking)
  function deriveNodeEnergyView(harmonics) {
    const energy = deriveNodeEnergyFromHarmonics(harmonics);
    const mood =
      energy > 0.85 ? "surge"   :
      energy > 0.65 ? "charged" :
      energy > 0.45 ? "active"  :
      energy > 0.25 ? "steady"  :
                      "calm";

    return {
      energy,
      mood
    };
  }

  return { runScan, deriveNodeEnergyView };
}

// -----------------------------------------------------------------------------
// UTIL
// -----------------------------------------------------------------------------
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }
