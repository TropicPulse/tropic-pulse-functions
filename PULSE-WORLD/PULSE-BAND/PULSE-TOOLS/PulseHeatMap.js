// ============================================================================
// FILE: /PulseOS/Scanner/PulseHeatMap-v12.3-EVO.js
// PULSE OS — v12.3-EVO
// UNIVERSAL HEATMAP ORGAN — PRESENCE + HARMONICS + DUAL-BAND + MULTI-SPIN-EVO
// ============================================================================
// ROLE (12.3-EVO):
//   - Convert any grid into a universal heatmap representation.
//   - Environment-aware (body/home/town/kitchen/crab/etc).
//   - Presence-aware (presenceAvg, presenceGradient).
//   - Harmonics-aware (phaseDrift, coherenceScore).
//   - Dual-band aware (binary + pulse + presence).
//   - Multi-spin-EVO aware (spin divergence weighting).
//   - Deterministic color mapping (epoch-stable).
//   - Renderer-agnostic output.
// ============================================================================

export function createPulseHeatMap({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // TEMPLATE REGISTRY — environment → sprite + mapping
  // ---------------------------------------------------------------------------
  const templates = {
    body: {
      sprite: "silhouette-body",
      mapCoord: (x, y, W, H) => ({ envX: x / W, envY: y / H })
    },
    home: {
      sprite: "silhouette-home",
      mapCoord: (x, y, W, H) => ({ envX: x / W, envY: y / H })
    },
    town: {
      sprite: "silhouette-town",
      mapCoord: (x, y, W, H) => ({ envX: x / W, envY: y / H })
    },
    kitchen: {
      sprite: "silhouette-kitchen",
      mapCoord: (x, y, W, H) => ({ envX: x / W, envY: y / H })
    },
    crab: {
      sprite: "silhouette-crab",
      mapCoord: (x, y, W, H) => ({ envX: x / W, envY: y / H })
    }
  };

  function registerTemplate(name, sprite, mapCoord) {
    templates[name] = { sprite, mapCoord };
  }

  // ---------------------------------------------------------------------------
  // DUAL-BAND COLOR MAPPER — deterministic, epoch-stable
  // ---------------------------------------------------------------------------
  function colorFromValue(v, presence = 0, coherence = 0) {
    const x = clamp(v, 0, 1);

    // presence softens extremes, coherence sharpens edges
    const p = clamp(presence, 0, 1);
    const h = clamp(coherence, 0, 1);

    const bias = (h * 0.2) - (p * 0.1);
    const y = clamp(x + bias, 0, 1);

    if (y > 0.85) return "rgb(255, 0, 0)";
    if (y > 0.70) return "rgb(255, 80, 0)";
    if (y > 0.55) return "rgb(255, 150, 0)";
    if (y > 0.40) return "rgb(255, 220, 0)";
    if (y > 0.25) return "rgb(180, 255, 0)";
    if (y > 0.10) return "rgb(80, 255, 80)";
    return "rgb(0, 180, 255)";
  }

  // ---------------------------------------------------------------------------
  // MULTI-SPIN-EVO BOOST — divergence weighting
  // ---------------------------------------------------------------------------
  function spinBoost(spins, x, y) {
    if (!Array.isArray(spins) || spins.length < 2) return 0;

    let total = 0;
    let count = 0;

    for (let i = 1; i < spins.length; i++) {
      const prev = spins[i - 1][y][x];
      const curr = spins[i][y][x];

      const diff =
        Math.abs(curr.density - prev.density) +
        Math.abs(curr.presence - prev.presence);

      total += diff;
      count++;
    }

    return count ? clamp(total / count, 0, 1) * 0.20 : 0;
  }

  // ---------------------------------------------------------------------------
  // CORE: GRID → HEATMAP POINTS (ENV + PRESENCE + HARMONICS + MULTI-SPIN-EVO)
  // ---------------------------------------------------------------------------
  function buildEnvironmentHeatMap({
    grid,
    envType,
    spins = null,
    presenceAvg = 0,
    harmonicDrift = 0,
    coherenceScore = 0
  }) {
    const tmpl = templates[envType] || templates.body;
    const H = grid.length;
    const W = grid[0].length;

    const points = [];

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];

        // Base value from density/contrast/wave/presence
        let value =
          0.40 * cell.density +
          0.25 * cell.contrast +
          0.20 * cell.wave +
          0.15 * cell.presence;

        // Multi-spin-EVO boost
        value += spinBoost(spins, x, y);

        // Dual-band color mapping
        const color = colorFromValue(value, presenceAvg, coherenceScore);

        const { envX, envY } = tmpl.mapCoord(x, y, W - 1, H - 1);

        points.push({
          x,
          y,
          value,
          color,
          envX,
          envY,
          sprite: tmpl.sprite,
          tags: cell.tags,
          presence: cell.presence,
          harmonics: coherenceScore
        });
      }
    }

    if (trace) {
      console.log("[PulseHeatMap‑12.3‑EVO] env:", envType, "points:", points.length);
    }

    return {
      envType,
      sprite: tmpl.sprite,
      points
    };
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    registerTemplate,
    buildEnvironmentHeatMap
  };
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
