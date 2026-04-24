// ============================================================================
// FILE: /apps/PulseOS/Scanner/PulseHeatMap-v11-EVO.js
// PULSE OS — v11-EVO
// UNIVERSAL HEATMAP ORGAN — ENVIRONMENT-AWARE + MULTI-SPIN AWARE
// ============================================================================
// ROLE:
//   - Convert any grid into a universal heatmap representation.
//   - Environment-aware (body/home/town/kitchen/crab/etc).
//   - Multi-spin aware (v11-EVO).
//   - Deterministic color mapping.
//   - Renderer-agnostic output.
// ============================================================================

export function createPulseHeatMap({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // TEMPLATE REGISTRY — environment → base sprite + mapping function
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
  // UNIVERSAL COLOR MAPPER — deterministic, no drift
  // ---------------------------------------------------------------------------
  function colorFromValue(v) {
    const x = clamp(v, 0, 1);
    if (x > 0.85) return "rgb(255, 0, 0)";
    if (x > 0.70) return "rgb(255, 80, 0)";
    if (x > 0.55) return "rgb(255, 150, 0)";
    if (x > 0.40) return "rgb(255, 220, 0)";
    if (x > 0.25) return "rgb(180, 255, 0)";
    if (x > 0.10) return "rgb(80, 255, 80)";
    return "rgb(0, 180, 255)";
  }

  // ---------------------------------------------------------------------------
  // MULTI-SPIN AWARE VALUE BOOST (v11-EVO)
  // ---------------------------------------------------------------------------
  function spinBoost(spins, x, y) {
    if (!Array.isArray(spins) || spins.length < 2) return 0;

    let total = 0;
    let count = 0;

    for (let i = 1; i < spins.length; i++) {
      const prev = spins[i - 1][y][x];
      const curr = spins[i][y][x];

      const diff = Math.abs(curr.density - prev.density);
      total += diff;
      count++;
    }

    return count ? clamp(total / count, 0, 1) * 0.15 : 0;
  }

  // ---------------------------------------------------------------------------
  // CORE: GRID → HEATMAP POINTS (ENVIRONMENT + MULTI-SPIN)
  // ---------------------------------------------------------------------------
  function buildEnvironmentHeatMap({ grid, envType, spins = null }) {
    const tmpl = templates[envType] || templates.body;
    const H = grid.length;
    const W = grid[0].length;

    const points = [];

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const cell = grid[y][x];

        // Base value from density/contrast/wave
        let value =
          0.5 * cell.density +
          0.3 * cell.contrast +
          0.2 * cell.wave;

        // Multi-spin boost (v11-EVO)
        value += spinBoost(spins, x, y);

        const color = colorFromValue(value);
        const { envX, envY } = tmpl.mapCoord(x, y, W - 1, H - 1);

        points.push({
          x,
          y,
          value,
          color,
          envX,
          envY,
          sprite: tmpl.sprite,
          tags: cell.tags
        });
      }
    }

    if (trace) {
      console.log("[PulseHeatMap] env:", envType, "points:", points.length);
    }

    return {
      envType,
      sprite: tmpl.sprite,
      points
    };
  }

  // ---------------------------------------------------------------------------
  // CONVENIENCE WRAPPERS
  // ---------------------------------------------------------------------------
  const buildBodyHeatMap  = grid => buildEnvironmentHeatMap({ grid, envType: "body" });
  const buildHomeHeatMap  = grid => buildEnvironmentHeatMap({ grid, envType: "home" });
  const buildTownHeatMap  = grid => buildEnvironmentHeatMap({ grid, envType: "town" });

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    registerTemplate,
    buildEnvironmentHeatMap,
    buildBodyHeatMap,
    buildHomeHeatMap,
    buildTownHeatMap
  };
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
