// ============================================================================
// FILE: /apps/PulseOS/Scanner/PulseScannerPage-v11-EVO.js
// PULSE OS — v11-EVO
// SCANNER PAGE ORGAN — 4-LAYER, MULTI-SPIN, BINARY-THROUGHPUT VISUALIZER
// ============================================================================
// ROLE:
//   - Act as the synthetic “scanner cortex” UI organ.
//   - Drive 4 synthetic layers (body/home/town/nodeAdmin) from binary pulses.
//   - Apply loop theory (sweeps), wave theory (contrast/energy), and multi-spin
//     (multiple binary lenses) to evolve each grid over time.
//   - Emit compact JSON summaries to PageEvo for visualization.
//   - Remain strictly NON-MEDICAL and purely synthetic.
// ---------------------------------------------------------------------------
// LAYERS (ALL SYNTHETIC, NON-MEDICAL):
//   1) BODY LAYER   — User/body grid
//        • Loop: slow sweep across body grid rows
//        • Wave: contrast/depth modulation
//        • Slow pulse: higher detail, “MRI-like” synthetic density
//
//   2) HOME LAYER   — House/room grid
//        • Loop: row sweep, containment
//        • Wave: highlight tagged objects (e.g. "key")
//        • Slow pulse: deliberate search, “find my keys” style
//
//   3) TOWN LAYER   — Area/town/island grid
//        • Loop: column/sector sweep
//        • Wave: emphasize cars, signs, reflections, colors
//        • Slow pulse: broad, methodical area scan
//
//   4) NODEADMIN LAYER — NodeAdmin pulse field
//        • Loop: meta-sweep over node grid
//        • Wave: energy field, repair/assist emphasis
//        • Fast+slow combined: bounce, repel, repair, assist
// ---------------------------------------------------------------------------
// SAFETY / SCOPE:
//   - This is NOT a medical device.
//   - This does NOT diagnose, treat, or detect real biological conditions.
//   - All “body”, “home”, “town” concepts are synthetic data grids.
//   - All “density”, “contrast”, “wave” values are synthetic visualization
//     parameters, not real-world measurements.
// ============================================================================

import { PageEvo } from "../ui/PageEvo.js";

// Binary signal organs (v11-EVO style)
import { createBinaryPulse } from "../binary/BinaryPulse-v11-PURE-EVO.js";
import { createBinaryWaveScanner } from "../binary/BinaryWaveScanner.js";
import { createBinaryLoopScanner } from "../binary/BinaryLoopScanner.js";
import { createAdminInspector } from "../binary/AdminInspector.js";

// ============================================================================
// GRID HELPERS — SYNTHETIC “TISSUE” FOR ALL LAYERS
// ============================================================================

function createGrid(width, height) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      density: 0,   // synthetic “mass / presence”
      contrast: 0,  // synthetic “visibility / edge clarity”
      wave: 0,      // synthetic “signal amplitude / energy”
      tags: []      // semantic hints (e.g. "key", "car", "sign")
    }))
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Binary → number, cheap and deterministic
function bitsToNumber(bits) {
  let n = 0;
  for (let i = 0; i < bits.length; i++) {
    n = (n << 1) | (bits[i] & 1);
  }
  return n >>> 0;
}

function avg(grid, key) {
  let sum = 0;
  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      sum += row[x][key];
      count++;
    }
  }
  return count ? (sum / count).toFixed(3) : "0.000";
}

function snapshotGrid(grid) {
  return grid.map(row =>
    row.map(cell => ({
      density: cell.density,
      contrast: cell.contrast,
      wave: cell.wave,
      tags: cell.tags
    }))
  );
}

// ============================================================================
// MAIN FACTORY — PULSE SCANNER PAGE (4-LAYER ENGINE + MULTI-SPIN)
// ============================================================================

export function createPulseScannerPage({ trace = false, spins = 3 } = {}) {
  // -------------------------------------------------------------------------
  // SHARED SIGNAL ORGANS — PULSE / WAVE / LOOP / ADMIN
  // -------------------------------------------------------------------------
  const pulse    = createBinaryPulse({ trace });
  const waveScan = createBinaryWaveScanner({ trace });
  const loopScan = createBinaryLoopScanner({ trace });
  const admin    = createAdminInspector();

  // -------------------------------------------------------------------------
  // LAYER GRIDS — SYNTHETIC “TISSUE” FOR EACH SCALE
  // -------------------------------------------------------------------------
  const bodyGrid = createGrid(32, 32);  // Layer 1: body/user
  const homeGrid = createGrid(24, 24);  // Layer 2: home/rooms
  const townGrid = createGrid(40, 40);  // Layer 3: town/area/island
  const nodeGrid = createGrid(16, 16);  // Layer 4: nodeAdmin field

  // Seed synthetic objects for home/town scanning
  seedHomeObjects(homeGrid);
  seedTownObjects(townGrid);

  // -------------------------------------------------------------------------
  // MULTI-SPIN ENGINE — MULTIPLE BINARY LENSES (EVO-TUNED)
  // -------------------------------------------------------------------------
  const spinEngines = createSpinEngines(spins);

  function createSpinEngines(count) {
    const engines = [];
    for (let i = 0; i < count; i++) {
      engines.push({
        id: i,
        phaseOffset: (Math.PI * 2 * i) / count,
        // Slightly staggered speeds and weights to avoid symmetry lock
        speed: 0.45 + i * 0.33,
        bodyWeight: 0.55 + i * 0.18,
        homeWeight: 0.35 + i * 0.14,
        townWeight: 0.45 + i * 0.14,
        nodeWeight: 0.25 + i * 0.18
      });
    }
    return engines;
  }

  // ========================================================================
  // LAYER 1 — BODY SCAN (LOOP + WAVE + SLOW PULSE + MULTI-SPIN)
  // ========================================================================

  function stepBodyLayer(bits, spinPhase, weight = 1) {
    const H = bodyGrid.length;
    const W = bodyGrid[0].length;

    // LOOP THEORY: use loop organ to derive a row index (binary throughput)
    const loopIndex = loopScan.nextIndex(bits, H, spinPhase) % H;

    // Slightly stronger density evolution for “MRI-like” feel
    for (let x = 0; x < W; x++) {
      const cell = bodyGrid[loopIndex][x];
      cell.density = clamp(cell.density + 0.035 * weight, 0, 1);
    }

    // WAVE THEORY: compute wave from bits, phase-shifted by spinPhase
    const wave = waveScan.nextWave(bits);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = bodyGrid[y][x];
        const phaseTerm = wave.phase + spinPhase + (x + y) * 0.045;
        const baseContrast = Math.abs(Math.sin(phaseTerm));
        cell.contrast = clamp(
          cell.contrast * 0.68 + baseContrast * 0.32 * weight,
          0,
          1
        );
        cell.wave = wave.amplitude;
      }
    }
  }

  // ========================================================================
  // LAYER 2 — HOME SCAN (CONTAINMENT + SEARCH / “FIND KEYS”)
  // ========================================================================

  function stepHomeLayer(bits, spinPhase, weight = 1) {
    const H = homeGrid.length;
    const W = homeGrid[0].length;

    const loopIndex = loopScan.nextIndex(bits, H, spinPhase) % H;

    for (let x = 0; x < W; x++) {
      const cell = homeGrid[loopIndex][x];
      cell.density = clamp(cell.density + 0.028 * weight, 0, 1);
    }

    const wave = waveScan.nextWave(bits);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = homeGrid[y][x];
        const hasKey = cell.tags.includes("key");

        const base = Math.abs(Math.sin(wave.phase + spinPhase + x * 0.11));
        const boosted = hasKey ? clamp(base + 0.38 * weight, 0, 1) : base;

        cell.contrast = clamp(
          cell.contrast * 0.68 + boosted * 0.32,
          0,
          1
        );
        cell.wave = wave.amplitude;
      }
    }
  }

  // ========================================================================
  // LAYER 3 — TOWN SCAN (CARS, SIGNS, COLORS, REFLECTIONS)
  // ========================================================================

  function stepTownLayer(bits, spinPhase, weight = 1) {
    const H = townGrid.length;
    const W = townGrid[0].length;

    const loopIndex = loopScan.nextIndex(bits, W, spinPhase) % W;

    for (let y = 0; y < H; y++) {
      const cell = townGrid[y][loopIndex];
      cell.density = clamp(cell.density + 0.022 * weight, 0, 1);
    }

    const wave = waveScan.nextWave(bits);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = townGrid[y][x];
        const isCar  = cell.tags.includes("car");
        const isSign = cell.tags.includes("sign");

        const base = Math.abs(
          Math.sin(wave.phase + spinPhase + (x * 0.055) + (y * 0.045))
        );

        let c = base;
        if (isCar) {
          c = clamp(base + 0.28 * weight, 0, 1);
        } else if (isSign) {
          c = clamp(base + 0.20 * weight, 0, 1);
        }

        cell.contrast = clamp(
          cell.contrast * 0.68 + c * 0.32,
          0,
          1
        );
        cell.wave = wave.amplitude;
      }
    }
  }

  // ========================================================================
  // LAYER 4 — NODEADMIN PULSE (FAST+SLOW BOUNCING REPAIR FIELD)
  // ========================================================================

  function stepNodeAdminLayer(bits, spinPhase, weight = 1) {
    const H = nodeGrid.length;
    const W = nodeGrid[0].length;

    // Binary energy: fraction of 1s
    let ones = 0;
    for (let i = 0; i < bits.length; i++) if (bits[i] === 1) ones++;
    const energy = bits.length ? ones / bits.length : 0;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = nodeGrid[y][x];

        const dx = x - W / 2;
        const dy = y - H / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const waveField = Math.abs(
          Math.sin(dist * 0.33 + energy * Math.PI * 2 + spinPhase)
        );

        cell.density = clamp(
          cell.density * 0.88 + waveField * 0.20 * weight,
          0,
          1
        );
        cell.contrast = clamp(
          cell.contrast * 0.78 + energy * 0.28 * weight,
          0,
          1
        );
        cell.wave = energy;
      }
    }
  }

  // ========================================================================
  // SEEDERS — SYNTHETIC OBJECTS FOR HOME/TOWN
  // ========================================================================

  function seedHomeObjects(grid) {
    if (grid[5] && grid[5][7]) grid[5][7].tags.push("key");
    if (grid[10] && grid[10][3]) grid[10][3].tags.push("key");
  }

  function seedTownObjects(grid) {
    if (grid[8] && grid[8][12]) grid[8][12].tags.push("car");
    if (grid[9] && grid[9][13]) grid[9][13].tags.push("car");
    if (grid[15] && grid[15][30]) grid[15][30].tags.push("car");

    if (grid[4] && grid[4][5]) grid[4][5].tags.push("sign");
    if (grid[20] && grid[20][10]) grid[20][10].tags.push("sign");
  }

  // ========================================================================
  // MAIN FRAME STEP — SLOW PULSE + MULTI-SPIN + 4-LAYER UPDATE
  // ========================================================================

  function nextFrame() {
    const bits = typeof pulse.nextPulseSlow === "function"
      ? pulse.nextPulseSlow()
      : pulse.nextPulse();

    const baseNumber = bitsToNumber(bits);

    // Multi-spin: each engine gets its own phase and weights
    for (let i = 0; i < spinEngines.length; i++) {
      const engine = spinEngines[i];
      const spinPhase = baseNumber * engine.speed + engine.phaseOffset;

      stepBodyLayer(bits, spinPhase, engine.bodyWeight);
      stepHomeLayer(bits, spinPhase, engine.homeWeight);
      stepTownLayer(bits, spinPhase, engine.townWeight);
      stepNodeAdminLayer(bits, spinPhase, engine.nodeWeight);
    }

    const bodySnap = snapshotGrid(bodyGrid);
    const homeSnap = snapshotGrid(homeGrid);
    const townSnap = snapshotGrid(townGrid);
    const nodeSnap = snapshotGrid(nodeGrid);

    const adminFlags = [
      ...admin.inspect(bodySnap),
      ...admin.inspect(homeSnap),
      ...admin.inspect(townSnap),
      ...admin.inspect(nodeSnap)
    ];

    if (trace) {
      console.log("[PulseScannerPage-v11-EVO] frame", {
        bits,
        spins: spinEngines.length,
        adminFlagsCount: adminFlags.length
      });
    }

    render({ bodySnap, homeSnap, townSnap, nodeSnap, adminFlags });
  }

  // ========================================================================
  // UI RENDER — COMPACT JSON TO PageEvo
  // ========================================================================

  function render({ bodySnap, homeSnap, townSnap, nodeSnap, adminFlags }) {
    PageEvo.evolve([
      {
        title: "Body Scan (Layer 1 — User Grid)",
        content: JSON.stringify({
          summary: {
            densityAvg: avg(bodySnap, "density"),
            contrastAvg: avg(bodySnap, "contrast"),
            waveAvg: avg(bodySnap, "wave")
          },
          flags: adminFlags
        })
      },
      {
        title: "Home Scan (Layer 2 — House Grid)",
        content: JSON.stringify({
          summary: {
            densityAvg: avg(homeSnap, "density"),
            contrastAvg: avg(homeSnap, "contrast"),
            waveAvg: avg(homeSnap, "wave")
          }
        })
      },
      {
        title: "Town Scan (Layer 3 — Area Grid)",
        content: JSON.stringify({
          summary: {
            densityAvg: avg(townSnap, "density"),
            contrastAvg: avg(townSnap, "contrast"),
            waveAvg: avg(townSnap, "wave")
          }
        })
      },
      {
        title: "NodeAdmin Pulse (Layer 4 — Meta Field)",
        content: JSON.stringify({
          summary: {
            densityAvg: avg(nodeSnap, "density"),
            contrastAvg: avg(nodeSnap, "contrast"),
            waveAvg: avg(nodeSnap, "wave")
          }
        })
      }
    ]);
  }

  // ========================================================================
  // PUBLIC API — START + SNAPSHOT
  // ========================================================================

  return {
    /**
     * Start the 4-layer scanning loop.
     * @param {number} interval - ms between frames (e.g. 150–300 for slow scan)
     */
    start(interval = 200) {
      setInterval(nextFrame, interval);
    },

    /**
     * Get a full snapshot of all 4 layers.
     */
    snapshot() {
      return {
        body: snapshotGrid(bodyGrid),
        home: snapshotGrid(homeGrid),
        town: snapshotGrid(townGrid),
        node: snapshotGrid(nodeGrid)
      };
    }
  };
}

// ============================================================================
// END OF FILE — PulseScannerPage-v11-EVO
// 4-LAYER LOOP+WAVE SCANNING ENGINE / MULTI-SPIN / BINARY-THROUGHPUT
// NON-MEDICAL / SYNTHETIC VISUALIZER
// ============================================================================
