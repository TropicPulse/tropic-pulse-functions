// ============================================================================
// FILE: /PulseOS/Scanner/PulseScannerCortex-v12.3-EVO.js
// PULSE OS — v12.3‑EVO
// SCANNER CORTEX ORGAN — PRESENCE + HARMONICS + DUAL-BAND + ADAPTIVE LAYERS
// ============================================================================
// ROLE (12.3‑EVO):
//   - The organism’s visual cortex.
//   - Dynamically creates/destroys layers based on presence + harmonics.
//   - Fuses binary, pulse, presence, and harmonic signals.
//   - Produces adaptive layer sets for PageEvo‑12.3.
//   - Balanced adaptive mode: stable unless meaningful change detected.
// ============================================================================

import { createBinaryPulse } from "../PULSE-TECH/PulseBinaryTech-v11-EVO.js";
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

function avg(grid, key) {
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
// MAIN FACTORY — PULSE SCANNER CORTEX (DYNAMIC ADAPTIVE)
// ============================================================================
export function createPulseScannerCortex({
  trace = false,
  spins = 3
} = {}) {

  // -------------------------------------------------------------------------
  // CORE ORGANS (12.3‑EVO)
  // -------------------------------------------------------------------------
  const pulse    = createBinaryPulse({ trace });
  const waveScan = createBinaryWaveScanner({ trace });
  const loopScan = createBinaryLoopScanner({ trace });
  const admin    = createPulseAdminInspector({ trace });

  // -------------------------------------------------------------------------
  // BASE GRIDS (v11 → v12.3 presence-aware)
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
  // PRESENCE + HARMONICS STATE
  // -------------------------------------------------------------------------
  let presenceHistory = [];
  let harmonics = [];

  function updatePresence(grid) {
    const p = avg(grid, "presence");
    presenceHistory.push(p);
    if (presenceHistory.length > 32) presenceHistory.shift();
    return p;
  }

  function updateHarmonics(bits) {
    const ones = bits.reduce((a,b)=>a+b,0);
    const ratio = ones / bits.length;

    const drift = Math.abs(Math.sin(ratio * Math.PI * 2));
    const coherence = 1 - drift;

    harmonics = [{ phaseDrift: drift, coherenceScore: coherence }];
    return { drift, coherence };
  }

  // -------------------------------------------------------------------------
  // ADAPTIVE LAYER ENGINE (BALANCED MODE)
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

    // Always include body + node layers
    layers.push({
      id: "bodyPresence",
      type: "bodyPresence",
      summary: {
        densityAvg: avg(bodySnap, "density"),
        contrastAvg: avg(bodySnap, "contrast"),
        waveAvg: avg(bodySnap, "wave"),
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
        densityAvg: avg(nodeSnap, "density"),
        contrastAvg: avg(nodeSnap, "contrast"),
        waveAvg: avg(nodeSnap, "wave")
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
          densityAvg: avg(homeSnap, "density"),
          contrastAvg: avg(homeSnap, "contrast"),
          waveAvg: avg(homeSnap, "wave")
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
          densityAvg: avg(townSnap, "density"),
          contrastAvg: avg(townSnap, "contrast"),
          waveAvg: avg(townSnap, "wave")
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
  // MAIN FRAME STEP
  // -------------------------------------------------------------------------
  function nextFrame() {
    const bits = pulse.nextPulseSlow();
    const { drift: harmonicDrift, coherence: coherenceScore } = updateHarmonics(bits);

    const baseNumber = bits.reduce((a,b)=>a+b,0);

    for (const engine of spinEngines) {
      const spinPhase = baseNumber * engine.speed + engine.phaseOffset;

      stepLayer(bodyGrid, bits, spinPhase, engine.weight);
      stepLayer(homeGrid, bits, spinPhase, engine.weight);
      stepLayer(townGrid, bits, spinPhase, engine.weight);
      stepLayer(nodeGrid, bits, spinPhase, engine.weight);
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
      nodeEnergy: coherenceScore,
      harmonics,
      presenceHistory
    });

    const layers = buildAdaptiveLayers({
      bodySnap,
      homeSnap,
      townSnap,
      nodeSnap,
      presenceAvg,
      harmonicDrift,
      coherenceScore,
      adminFlags
    });

    PageEvo.evolve({
      blocks: layers,
      loopIndex: baseNumber,
      wave: { phase: harmonicDrift * Math.PI * 2, amplitude: coherenceScore },
      flags: adminFlags,
      energy: coherenceScore,
      presence: presenceAvg
    });
  }

  // -------------------------------------------------------------------------
  // LAYER STEP (presence-aware, dual-band)
  // -------------------------------------------------------------------------
  function stepLayer(grid, bits, spinPhase, weight) {
    const H = grid.length;
    const W = grid[0].length;

    const loopIndex = loopScan.nextIndex(bits, H, spinPhase, avg(grid,"presence"), harmonics[0]?.phaseDrift);

    const wave = waveScan.nextWave(bits, avg(grid,"presence"), harmonics[0]?.phaseDrift);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];

        const phaseTerm = wave.phase + spinPhase + (x + y) * 0.045;
        const baseContrast = Math.abs(Math.sin(phaseTerm));

        cell.density = clamp(cell.density * 0.9 + 0.03 * weight, 0, 1);
        cell.contrast = clamp(cell.contrast * 0.7 + baseContrast * 0.3 * weight, 0, 1);
        cell.wave = wave.amplitude;
        cell.presence = clamp(cell.presence * 0.85 + wave.amplitude * 0.15, 0, 1);
      }
    }
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return {
    start(interval = 200) {
      setInterval(nextFrame, interval);
    },
    snapshot() {
      return {
        body: snapshot(bodyGrid),
        home: snapshot(homeGrid),
        town: snapshot(townGrid),
        node: snapshot(nodeGrid)
      };
    }
  };
}

// ============================================================================
// END OF FILE — PulseScannerCortex-v12.3-EVO
// Dynamic Adaptive Presence Cortex / Harmonics Cortex / Dual-Band Visual Cortex
// ============================================================================
