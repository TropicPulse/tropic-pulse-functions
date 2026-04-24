// ============================================================================
// FILE: /apps/PulseOS/Scanner/PulseAdminInspector.js
// PULSE OS — v11-EVO
// ADMIN INSPECTOR ORGAN — DUAL-MODE (BINARY + ENVIRONMENT)
// ============================================================================
// ROLE:
//   - Inspect ALL layers (body/home/town/node/kitchen/crab/etc).
//   - Mode "binary": enable binary anomaly detection.
//   - Mode "environment": skip binary checks.
//   - Detect anomalies in density/contrast/wave/energy/loop/spin.
//   - Multi-spin interference analysis.
//   - Loop stagnation detection.
//   - Wave collapse detection.
//   - NodeAdmin energy imbalance detection.
//   - Environment-aware anomaly classification.
//   - Provide attention scores + repair hints.
//   - Tier-aware escalation (Proxy → Mesh → NodeAdmin).
// ============================================================================

export function createPulseAdminInspector({
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  trace = false
} = {}) {

  // ---------------------------------------------------------------------------
  // MODE
  // ---------------------------------------------------------------------------
  let mode = "environment"; // "binary" | "environment"

  function setMode(m) {
    mode = m === "binary" ? "binary" : "environment";
    if (trace) console.log("[AdminInspector] mode set to:", mode);
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0) / arr.length : 0;

  const flatten = grid => {
    const out = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        out.push(grid[y][x]);
      }
    }
    return out;
  };

  // ---------------------------------------------------------------------------
  // BINARY ANOMALIES (only in binary mode)
  // ---------------------------------------------------------------------------
  function detectBinary(bits) {
    if (mode !== "binary") return [];

    const flags = [];
    const ones = bits.reduce((a,b)=>a+b,0);
    const ratio = ones / bits.length;

    if (ratio < 0.1) flags.push({ type:"binary-underflow", severity:"medium" });
    if (ratio > 0.9) flags.push({ type:"binary-overflow", severity:"medium" });

    let streak = 1;
    for (let i = 1; i < bits.length; i++) {
      if (bits[i] === bits[i-1]) streak++;
      else streak = 1;
      if (streak >= 8) {
        flags.push({ type:"binary-streak", severity:"high" });
        break;
      }
    }

    return flags;
  }

  // ---------------------------------------------------------------------------
  // GRID ANOMALIES
  // ---------------------------------------------------------------------------
  function detectGrid(grid, layer) {
    const flags = [];
    const flat = flatten(grid);

    const d = avg(flat.map(c=>c.density));
    const c = avg(flat.map(c=>c.contrast));
    const w = avg(flat.map(c=>c.wave));

    if (d > 0.8 && c > 0.7)
      flags.push({ type:"high-density-cluster", layer, severity:"medium" });

    if (c < 0.12)
      flags.push({ type:"contrast-collapse", layer, severity:"low" });

    if (w > 0.9)
      flags.push({ type:"wave-overdrive", layer, severity:"low" });

    return flags;
  }

  // ---------------------------------------------------------------------------
  // ENVIRONMENT-SPECIFIC ANOMALIES
  // ---------------------------------------------------------------------------
  function detectEnvironment(grid, layer) {
    const flags = [];
    const flat = flatten(grid);

    for (const cell of flat) {
      if (!cell.tags) continue;

      if (cell.tags.includes("pain") || cell.tags.includes("injury"))
        flags.push({ type:"body-inflammation", layer, severity:"high" });

      if (cell.tags.includes("kidney-stone"))
        flags.push({ type:"body-stone", layer, severity:"high" });

      if (cell.tags.includes("car"))
        flags.push({ type:"traffic-cluster", layer, severity:"medium" });

      if (cell.tags.includes("mesh-failure"))
        flags.push({ type:"mesh-failure", layer, severity:"high" });

      if (cell.tags.includes("leak"))
        flags.push({ type:"home-leak", layer, severity:"medium" });

      if (cell.tags.includes("key"))
        flags.push({ type:"object-located", layer, severity:"info" });
    }

    return flags;
  }

  // ---------------------------------------------------------------------------
  // MULTI-SPIN INTERFERENCE
  // ---------------------------------------------------------------------------
  function detectSpin(spins) {
    const flags = [];
    if (!Array.isArray(spins) || spins.length < 2) return flags;

    for (let i = 1; i < spins.length; i++) {
      const prev = spins[i-1];
      const curr = spins[i];

      let diff = 0;
      for (let y = 0; y < curr.length; y++) {
        for (let x = 0; x < curr[0].length; x++) {
          diff += Math.abs(curr[y][x].density - prev[y][x].density);
        }
      }

      const norm = diff / (curr.length * curr[0].length);
      if (norm > 0.22)
        flags.push({ type:"spin-divergence", spinPair:[i-1,i], severity:"medium" });
    }

    return flags;
  }

  // ---------------------------------------------------------------------------
  // LOOP STAGNATION
  // ---------------------------------------------------------------------------
  function detectLoop(loopHistory) {
    if (!Array.isArray(loopHistory) || loopHistory.length < 6) return [];

    const last = loopHistory.slice(-6);
    const allSame = last.every(v => v === last[0]);

    return allSame
      ? [{ type:"loop-stagnation", severity:"medium" }]
      : [];
  }

  // ---------------------------------------------------------------------------
  // WAVE COLLAPSE
  // ---------------------------------------------------------------------------
  function detectWaveCollapse(waveHistory) {
    if (!Array.isArray(waveHistory) || waveHistory.length < 6) return [];

    const amps = waveHistory.slice(-6).map(w => w.amplitude);
    const low = amps.every(a => a < 0.05);

    return low
      ? [{ type:"wave-collapse", severity:"high" }]
      : [];
  }

  // ---------------------------------------------------------------------------
  // NODEADMIN ENERGY IMBALANCE
  // ---------------------------------------------------------------------------
  function detectEnergy(nodeEnergy) {
    if (nodeEnergy > 0.95)
      return [{ type:"energy-overload", severity:"medium" }];
    if (nodeEnergy < 0.05)
      return [{ type:"energy-starvation", severity:"medium" }];
    return [];
  }

  // ---------------------------------------------------------------------------
  // TIER ESCALATION
  // ---------------------------------------------------------------------------
  function escalate(flags) {
    if (!flags.length) return;

    const high = flags.some(f => f.severity === "high");
    const med  = flags.some(f => f.severity === "medium");

    if (high && fallbackNode?.exchange)
      return fallbackNode.exchange(flags);

    if (med && fallbackMesh?.exchange)
      return fallbackMesh.exchange(flags);

    if (fallbackProxy?.exchange)
      return fallbackProxy.exchange(flags);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC: INSPECT EVERYTHING
  // ---------------------------------------------------------------------------
  function inspectAll({
    body,
    home,
    town,
    node,
    bits,
    spins,
    loopHistory,
    waveHistory,
    nodeEnergy
  }) {
    let flags = [];

    // binary anomalies only if mode = "binary"
    flags.push(...detectBinary(bits));

    // grid anomalies
    flags.push(...detectGrid(body, "body"));
    flags.push(...detectGrid(home, "home"));
    flags.push(...detectGrid(town, "town"));
    flags.push(...detectGrid(node, "node"));

    // environment anomalies
    flags.push(...detectEnvironment(body, "body"));
    flags.push(...detectEnvironment(home, "home"));
    flags.push(...detectEnvironment(town, "town"));
    flags.push(...detectEnvironment(node, "node"));

    // spin / loop / wave / energy
    flags.push(...detectSpin(spins));
    flags.push(...detectLoop(loopHistory));
    flags.push(...detectWaveCollapse(waveHistory));
    flags.push(...detectEnergy(nodeEnergy));

    escalate(flags);

    if (trace) console.log("[AdminInspector] flags:", flags);

    return flags;
  }

  return {
    setMode,
    inspectAll
  };
}
