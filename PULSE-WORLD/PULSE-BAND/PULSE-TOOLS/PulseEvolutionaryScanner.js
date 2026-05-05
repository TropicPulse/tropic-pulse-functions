// ============================================================================
// FILE: /PulseOS/Scanner/PulseScannerCortex-v16-Immortal.js
// PULSE OS — v16‑IMMORTAL
// SCANNER CORTEX ORGAN — DUAL-BAND, PRESENCE/HARMONICS, ADVANTAGE/ARTERY-AWARE
// ============================================================================
// ROLE (v16‑IMMORTAL):
//   - Organism’s visual cortex for binary-first, dual-band scanning.
//   - Dynamically shapes layers based on presence + harmonics + admin flags.
//   - Fuses binary, pulse, presence, harmonic, and anomaly signals.
//   - Produces adaptive layer sets for PageEvo‑IMMORTAL.
//   - Balanced adaptive mode: stable unless meaningful change detected.
//   - Advantage/artery-aware: can surface “where to look” without IO.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseScannerCortex",
  version: "v16-Immortal",
  layer: "scanner_cortex",
  role: "visual_cortex_organ",
  lineage: "PulseScannerCortex-v12.3-Evo → v16-Immortal",

  evo: {
    cortexOrgan: true,
    dualBand: true,
    presenceAware: true,
    harmonicAware: true,
    arteryAware: true,
    advantageView: true,
    windowSafe: true,

    adminInspectorAware: true,
    pageEvoAware: true,

    deterministic: true,
    driftProof: true,
    pureComputeCore: true,

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
      "PageEvo"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyScannerCortex"
    ]
  }
}
*/

import { createBinaryPulse } from "../PULSE-TECH/PulseBinaryTech-v16.js";
import { createBinaryWaveScanner } from "../PULSE-TOOLS/PulseBinaryWaveScanner.js";
import { createBinaryLoopScanner } from "../PULSE-TOOLS/PulseBinaryLoopScanner.js";
import { createPulseAdminInspector } from "../PULSE-TOOLS/PulseAdminInspector.js";
import { createPageEvo as PageEvo } from "../PULSE-TOOLS/PulseBinaryFramework.js";

// ============================================================================
// GRID HELPERS
// ============================================================================
function createGrid(w, h) {
  return Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({
      density: 0,
      contrast: 0,
      wave: 0,
      presence: 0,
      tags: []
    }))
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function avgGridScalar(grid, key) {
  let sum = 0, count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      sum += grid[y][x][key] ?? 0;
      count++;
    }
  }
  return count ? sum / count : 0;
}

function snapshot(grid) {
  return grid.map(row =>
    row.map(c => ({
      density: c.density,
      contrast: c.contrast,
      wave: c.wave,
      presence: c.presence,
      tags: c.tags
    }))
  );
}

// ============================================================================
// MAIN FACTORY — PULSE SCANNER CORTEX (v16‑IMMORTAL)
// ============================================================================
export function createPulseScannerCortex({
  trace = false,
  spins = 3
} = {}) {

  // -------------------------------------------------------------------------
  // CORE ORGANS (v16‑IMMORTAL)
  // -------------------------------------------------------------------------
  const pulse    = createBinaryPulse({ trace });
  const waveScan = createBinaryWaveScanner({ trace });
  const loopScan = createBinaryLoopScanner({ trace });
  const admin    = createPulseAdminInspector({ trace });
  const pageEvo  = PageEvo({ trace });

  // -------------------------------------------------------------------------
  // BASE GRIDS
  // -------------------------------------------------------------------------
  const bodyGrid = createGrid(32, 32);
  const homeGrid = createGrid(24, 24);
  const townGrid = createGrid(40, 40);
  const nodeGrid = createGrid(16, 16);

  // -------------------------------------------------------------------------
  // SPIN ENGINES (multi-sentinel, multi-presence)
// -------------------------------------------------------------------------
  const spinEngines = Array.from({ length: spins }, (_, i) => ({
    id: i,
    phaseOffset: (Math.PI * 2 * i) / spins,
    speed: 0.45 + i * 0.33,
    weight: 0.55 + i * 0.18
  }));

  // -------------------------------------------------------------------------
  // PRESENCE + HARMONICS STATE (v16‑IMMORTAL)
// -------------------------------------------------------------------------
  let presenceHistory = [];   // store scalar presence averages
  let harmonics = [];         // [{ phaseDrift, cohesionScore, amplitude }]

  function updatePresence(grid) {
    const p = avgGridScalar(grid, "presence");
    presenceHistory.push(p);
    if (presenceHistory.length > 64) presenceHistory.shift();
    return p;
  }

  function updateHarmonics(bits) {
    const ones = bits.reduce((a,b)=>a+b,0);
    const ratio = bits.length ? ones / bits.length : 0;

    const phaseDrift = Math.abs(Math.sin(ratio * Math.PI * 2));
    const cohesionScore = clamp(1 - phaseDrift, 0, 1);
    const amplitude = clamp(ratio, 0, 1);

    harmonics = [{
      phaseDrift,
      cohesionScore,
      amplitude
    }];

    return { phaseDrift, cohesionScore, amplitude };
  }

  function deriveNodeEnergyView() {
    if (!harmonics.length) {
      return { energy: 0.5, mood: "steady" };
    }
    const h = harmonics[0];
    const energy = clamp(
      h.cohesionScore * 0.6 +
      (1 - Math.abs(h.phaseDrift)) * 0.25 +
      (h.amplitude ?? 0.5) * 0.15,
      0,
      1
    );
    const mood =
      energy > 0.85 ? "surge"   :
      energy > 0.65 ? "charged" :
      energy > 0.45 ? "active"  :
      energy > 0.25 ? "steady"  :
                      "calm";

    return { energy, mood };
  }

  // -------------------------------------------------------------------------
  // ADAPTIVE LAYER ENGINE (BALANCED MODE, v16‑IMMORTAL)
// -------------------------------------------------------------------------
  function buildAdaptiveLayers({
    bodySnap,
    homeSnap,
    townSnap,
    nodeSnap,
    presenceAvg,
    harmonicDrift,
    coherenceScore,
    adminFlags
  }) {
    const layers = [];

    const bodyDensityAvg   = avgGridScalar(bodySnap, "density");
    const bodyContrastAvg  = avgGridScalar(bodySnap, "contrast");
    const bodyWaveAvg      = avgGridScalar(bodySnap, "wave");
    const nodeDensityAvg   = avgGridScalar(nodeSnap, "density");
    const nodeContrastAvg  = avgGridScalar(nodeSnap, "contrast");
    const nodeWaveAvg      = avgGridScalar(nodeSnap, "wave");
    const homeDensityAvg   = avgGridScalar(homeSnap, "density");
    const homeContrastAvg  = avgGridScalar(homeSnap, "contrast");
    const homeWaveAvg      = avgGridScalar(homeSnap, "wave");
    const townDensityAvg   = avgGridScalar(townSnap, "density");
    const townContrastAvg  = avgGridScalar(townSnap, "contrast");
    const townWaveAvg      = avgGridScalar(townSnap, "wave");

    // Always include body + node layers
    layers.push({
      id: "bodyPresence",
      type: "bodyPresence",
      summary: {
        densityAvg: bodyDensityAvg,
        contrastAvg: bodyContrastAvg,
        waveAvg: bodyWaveAvg,
        presenceAvg
      },
      presence: presenceAvg,
      harmonics: coherenceScore,
      anomalies: adminFlags.filter(f => f.layer === "body"),
      mood: presenceAvg > 0.6 ? "focused" : "calm",
      weight: 1.0
    });

    layers.push({
      id: "nodeHarmonics",
      type: "nodeHarmonics",
      summary: {
        densityAvg: nodeDensityAvg,
        contrastAvg: nodeContrastAvg,
        waveAvg: nodeWaveAvg
      },
      presence: presenceAvg,
      harmonics: coherenceScore,
      anomalies: adminFlags.filter(f => f.layer === "node"),
      mood: harmonicDrift > 0.4 ? "alert" : "steady",
      weight: 1.0
    });

    // Balanced adaptive: include home/town only when meaningful
    if (presenceAvg > 0.15 || harmonicDrift > 0.15) {
      layers.push({
        id: "homePresence",
        type: "homePresence",
        summary: {
          densityAvg: homeDensityAvg,
          contrastAvg: homeContrastAvg,
          waveAvg: homeWaveAvg
        },
        presence: presenceAvg,
        harmonics: coherenceScore,
        anomalies: adminFlags.filter(f => f.layer === "home"),
        mood: "aware",
        weight: 0.8
      });
    }

    if (presenceAvg > 0.25 || harmonicDrift > 0.25) {
      layers.push({
        id: "townPresence",
        type: "townPresence",
        summary: {
          densityAvg: townDensityAvg,
          contrastAvg: townContrastAvg,
          waveAvg: townWaveAvg
        },
        presence: presenceAvg,
        harmonics: coherenceScore,
        anomalies: adminFlags.filter(f => f.layer === "town"),
        mood: "scanning",
        weight: 0.7
      });
    }

    return layers;
  }

  // -------------------------------------------------------------------------
  // MAIN FRAME STEP (PURE CORE + external scheduler)
  // -------------------------------------------------------------------------
    function nextFrame({ gpuStats } = {}) {
    const bits = pulse.nextPulseSlow();
    const { phaseDrift, cohesionScore, amplitude } = updateHarmonics(bits);
    const nodeEnergyView = deriveNodeEnergyView();

    const baseNumber = bits.reduce((a,b)=>a+b,0);
    const harmonicBias = phaseDrift;
    const presenceBiasBody = avgGridScalar(bodyGrid, "presence");

    for (const engine of spinEngines) {
      const spinPhase = baseNumber * engine.speed + engine.phaseOffset;

      stepLayer(bodyGrid, bits, spinPhase, engine.weight, {
        presenceBias: presenceBiasBody,
        harmonicBias,
        gpuStats
      });
      stepLayer(homeGrid, bits, spinPhase, engine.weight, {
        presenceBias: avgGridScalar(homeGrid, "presence"),
        harmonicBias,
        gpuStats
      });
      stepLayer(townGrid, bits, spinPhase, engine.weight, {
        presenceBias: avgGridScalar(townGrid, "presence"),
        harmonicBias,
        gpuStats
      });
      stepLayer(nodeGrid, bits, spinPhase, engine.weight, {
        presenceBias: avgGridScalar(nodeGrid, "presence"),
        harmonicBias,
        gpuStats
      });
    }

    const bodySnap = snapshot(bodyGrid);
    const homeSnap = snapshot(homeGrid);
    const townSnap = snapshot(townGrid);
    const nodeSnap = snapshot(nodeGrid);

    const presenceAvg = updatePresence(bodyGrid);

    const adminFlags = admin.inspectAll({
      body: bodySnap,
      home: homeSnap,
      town: townSnap,
      node: nodeSnap,
      bits,
      spins: [],
      loopHistory: [],
      waveHistory: [],
      nodeEnergy: nodeEnergyView.energy,
      harmonics,
      presenceHistory
    });

    const layers = buildAdaptiveLayers({
      bodySnap,
      homeSnap,
      townSnap,
      nodeSnap,
      presenceAvg,
      harmonicDrift: phaseDrift,
      coherenceScore: cohesionScore,   // ✅ fixed
      adminFlags
    });

    pageEvo.evolve({
      blocks: layers,
      loopIndex: baseNumber,
      wave: { phase: phaseDrift * Math.PI * 2, amplitude },
      flags: adminFlags,
      energy: nodeEnergyView.energy,
      presence: presenceAvg
    });

    if (trace) {
      console.log("[PulseScannerCortex‑v16-IMMORTAL] frame", {
        presenceAvg,
        phaseDrift,
        cohesionScore,
        nodeEnergyView,
        layersCount: layers.length,
        flagsCount: adminFlags.length
      });
    }

    return {
      bits,
      presenceAvg,
      harmonics,
      nodeEnergyView,
      layers,
      adminFlags
    };
  }


  // -------------------------------------------------------------------------
  // LAYER STEP (dual-band + harmonics + GPU-aware, symbolic only)
// -------------------------------------------------------------------------
  function stepLayer(grid, bits, spinPhase, weight, {
    presenceBias = 0,
    harmonicBias = 0,
    gpuStats = null
  } = {}) {
    const H = grid.length;
    const W = grid[0].length;

    const gpuInfluence = gpuStats?.loadFactor ?? 0;

    const loopIndex = loopScan.nextIndex(
      bits,
      Math.max(H, W),
      spinPhase,
      presenceBias,
      harmonicBias
    );

    const wave = waveScan.nextWave(
      bits,
      presenceBias,
      harmonicBias
    );

    const baseDensityDelta = 0.03 * weight;
    const baseContrastBlend = 0.3 * weight;

    const dualBandScale =
      0.5 +
      presenceBias * 0.3 +
      harmonicBias * 0.2 +
      gpuInfluence * 0.1;

    const densityDelta = baseDensityDelta * clamp(dualBandScale, 0.4, 1.4);
    const contrastBlend = baseContrastBlend * clamp(dualBandScale, 0.4, 1.4);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];

        const phaseTerm = (wave.phase ?? 0) + spinPhase + (x + y) * 0.045;
        const baseContrast = Math.abs(Math.sin(phaseTerm));

        cell.density = clamp(cell.density * 0.9 + densityDelta, 0, 1);
        cell.contrast = clamp(
          cell.contrast * (1 - contrastBlend) + baseContrast * contrastBlend,
          0,
          1
        );
        cell.wave = wave.amplitude ?? wave.depth ?? 0;
        cell.presence = clamp(
          cell.presence * 0.85 + (wave.amplitude ?? 0) * 0.15,
          0,
          1
        );
      }
    }
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return {
    // external scheduler drives this; core stays pure
    nextFrame,
    start(interval = 200) {
      setInterval(() => nextFrame(), interval);
    },
    snapshot() {
      return {
        body: snapshot(bodyGrid),
        home: snapshot(homeGrid),
        town: snapshot(townGrid),
        node: snapshot(nodeGrid),
        presenceHistory: [...presenceHistory],
        harmonics: [...harmonics]
      };
    }
  };
}
