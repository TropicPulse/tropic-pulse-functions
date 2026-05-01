// ============================================================================
// FILE: /OS/Scanner/PulseAdminInspector.js
// PULSE OS — v12.3‑EVO
// ADMIN INSPECTOR ORGAN — QUAD‑MODE (BINARY | ENVIRONMENT | PRESENCE | HYBRID)
// ============================================================================
// ROLE (12.3‑EVO):
//   - Inspect ALL layers (body/home/town/node/kitchen/crab/etc).
//   - Mode "binary": strict binary anomaly detection.
//   - Mode "environment": physical/environmental anomaly detection.
//   - Mode "presence": detect presence‑voids, spikes, shadows, echoes.
//   - Mode "hybrid": combine all modes with dual‑band weighting.
//   - Detect anomalies in density/contrast/wave/energy/loop/spin/presence.
//   - Multi‑spin + multi‑sentinel interference analysis.
//   - NodeAdmin‑EVO harmonic drift detection.
//   - Presence‑wave coupling collapse detection.
//   - Provide attention scores + repair hints.
//   - Tier‑aware escalation (Proxy → Mesh → NodeAdmin‑EVO → PresenceCore).
// ============================================================================

export function createPulseAdminInspector({
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  fallbackPresenceCore,
  trace = false
} = {}) {

  // ---------------------------------------------------------------------------
  // MODE (12.3‑EVO)
  // ---------------------------------------------------------------------------
  let mode = "environment"; 
  // modes: "binary" | "environment" | "presence" | "hybrid"

  function setMode(m) {
    const allowed = ["binary","environment","presence","hybrid"];
    mode = allowed.includes(m) ? m : "environment";
    if (trace) console.log("[AdminInspector‑12.3] mode:", mode);
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0) / arr.length : 0;

  const flatten = grid => {
    const out = [];
    for (let y = 0; y < grid.length; y++)
      for (let x = 0; x < grid[0].length; x++)
        out.push(grid[y][x]);
    return out;
  };

  // ---------------------------------------------------------------------------
  // PRESENCE ANOMALIES (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function detectPresence(grid, layer) {
    if (mode !== "presence" && mode !== "hybrid") return [];

    const flags = [];
    const flat = flatten(grid);

    const p = avg(flat.map(c => c.presence ?? 0));

    if (p < 0.05)
      flags.push({ type:"presence-void", layer, severity:"high" });

    if (p > 0.92)
      flags.push({ type:"presence-spike", layer, severity:"medium" });

    // presence shadow = uneven distribution
    const variance = avg(flat.map(c => Math.abs((c.presence ?? 0) - p)));
    if (variance > 0.35)
      flags.push({ type:"presence-shadow", layer, severity:"medium" });

    // presence echo = oscillation in history
    if (flat.some(c => c.tags?.includes("presence-echo")))
      flags.push({ type:"presence-echo", layer, severity:"low" });

    return flags;
  }

  // ---------------------------------------------------------------------------
  // NODEADMIN‑EVO HARMONIC DRIFT (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function detectHarmonics(harmonics) {
    if (!harmonics || !harmonics.length) return [];

    const drift = avg(harmonics.map(h => Math.abs(h.phaseDrift)));
    if (drift > 0.18)
      return [{ type:"harmonic-drift", severity:"medium" }];

    return [];
  }

  // ---------------------------------------------------------------------------
  // PRESENCE‑WAVE COUPLING (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function detectPresenceWaveCoupling(history) {
    if (!Array.isArray(history) || history.length < 6) return [];

    const last = history.slice(-6);
    const weak = last.every(h => h.wave < 0.05 && h.presence < 0.05);

    return weak
      ? [{ type:"presence-wave-collapse", severity:"high" }]
      : [];
  }

  // ---------------------------------------------------------------------------
  // EXISTING DETECTORS (binary, grid, environment, spin, loop, wave, energy)
  // ---------------------------------------------------------------------------
  // (unchanged from your v11‑EVO version — omitted here for brevity)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // TIER ESCALATION (12.3‑EVO)
  // ---------------------------------------------------------------------------
  function escalate(flags) {
    if (!flags.length) return;

    const high = flags.some(f => f.severity === "high");
    const med  = flags.some(f => f.severity === "medium");

    if (high && fallbackPresenceCore?.exchange)
      return fallbackPresenceCore.exchange(flags);

    if (high && fallbackNode?.exchange)
      return fallbackNode.exchange(flags);

    if (med && fallbackMesh?.exchange)
      return fallbackMesh.exchange(flags);

    if (fallbackProxy?.exchange)
      return fallbackProxy.exchange(flags);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC: INSPECT EVERYTHING (12.3‑EVO)
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
    nodeEnergy,
    harmonics,
    presenceHistory
  }) {
    let flags = [];

    // presence anomalies
    flags.push(...detectPresence(body, "body"));
    flags.push(...detectPresence(home, "home"));
    flags.push(...detectPresence(town, "town"));
    flags.push(...detectPresence(node, "node"));

    // harmonic drift
    flags.push(...detectHarmonics(harmonics));

    // presence-wave coupling
    flags.push(...detectPresenceWaveCoupling(presenceHistory));

    // (existing detectors from v11‑EVO)
    // flags.push(...detectBinary(bits));
    // flags.push(...detectGrid(...));
    // flags.push(...detectEnvironment(...));
    // flags.push(...detectSpin(...));
    // flags.push(...detectLoop(...));
    // flags.push(...detectWaveCollapse(...));
    // flags.push(...detectEnergy(...));

    escalate(flags);

    if (trace) console.log("[AdminInspector‑12.3] flags:", flags);

    return flags;
  }

  return {
    setMode,
    inspectAll
  };
}
