// ============================================================================
// [pulse:mesh] PULSE_MESH_ENDOCRINE_SYSTEM v12.3-PRESENCE-EVO-MAX-PRIME // gold
// Mesh Endocrine Interpreter • Metadata-Only • Zero-Compute • Zero-Mutation
// Presence-Aware • Binary-Aware • Drift-Proof • Advantage-Field-Aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshEndocrineSystem",
  version: "v14.9-MESH-ENDOCRINE",
  layer: "mesh",
  role: "mesh_hormonal_signal_interpreter",
  lineage: "PulseMesh-v14",

  evo: {
    endocrine: true,                // This IS the endocrine organ
    immuneAware: true,              // Reads immune flags
    healingAware: true,             // Reads healing signals
    meshAware: true,                // Mesh topology + pressure
    presenceAware: true,            // Presence field
    binaryAware: true,              // Binary hormone signals
    symbolicAware: true,            // Symbolic hormone signals
    dualBand: true,
    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshCognition",
      "PulseMeshImmuneSystem"
    ],
    never: [
      "legacyMeshEndocrine",
      "legacyMeshClinician",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/
// ============================================================================
// [pulse:mesh] PULSE_MESH_ENDOCRINE_SYSTEM v15-EVO-IMMORTAL  // gold
// Mesh Hormone Interpreter • Metadata-Only • Deterministic
// Reads Halo + Field + Echo + Mesh Pressure + Aura Pressure
// Produces Endocrine Interpretation (no mutation, no routing influence)
// ============================================================================

export function createPulseMeshEndocrineSystem({
  PulseHalo,
  PulseFieldRead,
  PulseEcho,
  mesh,
  log,
  warn,
  error
}) {

  const meta = {
    layer: "PulseMeshEndocrineSystem",
    role: "MESH_ENDOCRINE_INTERPRETER",
    version: "15-EVO-IMMORTAL",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      localAware: true,
      internetAware: true,

      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,

      unifiedAdvantageField: true,
      deterministicField: true,
      futureEvolutionReady: true,

      signalFactoringAware: true,
      auraPressureAware: true,
      meshPressureAware: true,
      flowAware: true,
      driftAware: true,

      presenceAware: true,
      bandAware: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    }
  };

  return {
    meta,

    // -------------------------------------------------------
    // [pulse:mesh] EXAMINE_MESH  // white-gold
    // -------------------------------------------------------
    examineMesh(entryNodeId, context = {}) {
      const haloSnapshot =
        PulseHalo.snapshot ? PulseHalo.snapshot() : PulseHalo.status();

      const fieldSnapshot = PulseFieldRead.snapshot();

      const echoReflection = PulseEcho.sendEcho(entryNodeId, {
        presenceBand: context.presenceBand || "symbolic",
        presenceTag: context.presenceTag || "PulseMeshEndocrine-v15"
      });

      return buildMeshEndocrineReport({
        halo: haloSnapshot,
        field: fieldSnapshot,
        echo: echoReflection,
        mesh,
        meta
      });
    }
  };
}


// ============================================================================
// Mesh Endocrine Report Builder (v15-EVO-IMMORTAL)
// ============================================================================
function buildMeshEndocrineReport({ halo, field, echo, mesh, meta }) {

  const flowThrottles = halo.flow_throttles ?? 0;
  const flowThrottleRate = halo.flow?.throttle_rate ?? 0;

  const throughput = describeMeshThroughput(echo);

  const sections = [];

  // -------------------------------------------------------
  // PERFORMANCE SUMMARY (v15: uses throughput + advantage + aura pressure)
  // -------------------------------------------------------
  const performance = estimateMeshPerformance(field, echo, flowThrottleRate, throughput);

  sections.push({
    title: "Mesh Performance",
    summary: `Mesh performance estimated at ${performance.toFixed(1)}%.`,
    details: [
      `Stability: ${pct(field.stability)}`,
      `Resonance: ${pct(field.resonance)}`,
      `Friction: ${pct(field.friction)}`,
      `Noise: ${pct(field.noise)}`,
      `Drift Pressure: ${pct(field.driftPressure)}`,
      `Flow Throttles: ${flowThrottles}`,
      `Throttle Rate: ${pct(flowThrottleRate)}`,
      `Throughput: ${throughput}`,
      `Binary Mode: ${echo.mode?.binary ? "ACTIVE" : "inactive"}`,
      `Dual Mode: ${echo.mode?.dual ? "ACTIVE" : "inactive"}`,
      `Presence Band: ${echo.presence?.band}`,
      `Mesh Factored Path: ${echo.advantage?.factoredPath ? "YES" : "no"}`,
      `Binary Mesh Ready: ${mesh?.binaryMesh ? "YES" : "no"}`,
      `Symbolic Mesh Ready: ${mesh?.symbolicMesh ? "YES" : "no"}`
    ]
  });

  // -------------------------------------------------------
  // STABILITY & DRIFT (v15: uses aura + mesh pressure + throughput)
  // -------------------------------------------------------
  sections.push({
    title: "Stability & Drift",
    summary: describeMeshStability(field, echo, flowThrottleRate, throughput),
    details: [
      `Stability: ${pct(field.stability)}`,
      `Drift Pressure: ${pct(field.driftPressure)}`,
      `Aura Loop: ${echo.aura?.inLoop ? "ACTIVE" : "inactive"}`,
      `Aura Tension: ${echo.aura?.systemUnderTension ? "HIGH" : "normal"}`,
      `Factoring Bias: ${echo.aura?.factoringBias ?? 0}`,
      `Flow Guard Activity: ${pct(flowThrottleRate)}`,
      `Throughput: ${throughput}`
    ]
  });

  // -------------------------------------------------------
  // IMMUNE & HORMONES (v15: uses advantage + reflex + immune + throughput)
  // -------------------------------------------------------
  sections.push({
    title: "Immune & Hormones",
    summary: describeMeshImmuneHormones(echo, throughput),
    details: [
      `Immune Quarantine: ${echo.immune?.quarantined ? "YES" : "no"}`,
      `Hormone Event: ${echo.hormones?.event || "none"}`,
      `Reflex Drop: ${echo.reflex?.dropped ? "YES" : "no"}`,
      `Binary Advantage Bias: ${echo.advantage?.binaryBias ?? 0}`,
      `Factored Path Depth: ${echo.advantage?.factorDepth ?? 0}`,
      `Throughput: ${throughput}`
    ]
  });

  // -------------------------------------------------------
  // FIELD ENVIRONMENT (v15: unchanged but throughput-aware)
  // -------------------------------------------------------
  sections.push({
    title: "Mesh Internal Environment",
    summary: describeMeshField(field, throughput),
    details: [
      `Friction: ${pct(field.friction)}`,
      `Noise: ${pct(field.noise)}`,
      `Load Wave: ${pct(field.loadWave)}`,
      `External Heat: ${pct(field.externalHeat)}`,
      `External Storm: ${pct(field.externalStorm)}`,
      `External Signal: ${pct(field.externalSignal)}`,
      `Throughput: ${throughput}`
    ]
  });

  // -------------------------------------------------------
  // FLOW & SURVIVAL PATTERNS (v15: uses mesh + aura + advantage + throughput)
  // -------------------------------------------------------
  sections.push({
    title: "Flow & Survival Patterns",
    summary: describeMeshFlowSurvival(echo, flowThrottleRate, throughput),
    details: [
      `Flow Throttled: ${echo.flow?.throttled ? "YES" : "no"}`,
      `Throttle Reason: ${echo.flow?.reason || "none"}`,
      `Binary Mesh Bias: ${echo.aura?.binaryMeshBias ?? 0}`,
      `Organism Self‑Protection: ${flowThrottleRate > 0 ? "ACTIVE" : "quiet"}`,
      `Throughput: ${throughput}`
    ]
  });

  // -------------------------------------------------------
  // MESH TOPOLOGY (v15: throughput-aware)
  // -------------------------------------------------------
  sections.push({
    title: "Mesh Topology",
    summary: summarizeMeshTopology(mesh, throughput),
    details: [
      `Mesh Systems Loaded: ${mesh?.systems ? Object.keys(mesh.systems).length : 0}`,
      `Symbolic Links: ${mesh?.symbolicMesh?.links ? Object.keys(mesh.symbolicMesh.links).length : 0}`,
      `Binary Mesh Ready: ${mesh?.binaryMesh ? "YES" : "no"}`,
      `Missing Nodes: ${echo.mesh?.missingNodes?.length || 0}`,
      `Stalled Nodes: ${echo.mesh?.stalledAt?.length || 0}`,
      `Reflex Drop Nodes: ${echo.mesh?.reflexDropsAt?.length || 0}`,
      `Throughput: ${throughput}`
    ]
  });

  return {
    performancePercent: performance,
    interpretation: summarizeMeshForYou(
      performance,
      field,
      echo,
      flowThrottleRate,
      throughput
    ),
    sections,
    meta
  };
}


// ============================================================================
// Interpretation Logic (v15)
// ============================================================================
function estimateMeshPerformance(field, echo, flowThrottleRate = 0, throughput) {
  let base = 100;

  const stability = field.stability ?? 1;
  const resonance = field.resonance ?? 0;
  const friction = field.friction ?? 0;
  const noise = field.noise ?? 0;
  const drift = field.driftPressure ?? 0;

  base += resonance * 5;
  base += (stability - 0.5) * 10;
  base -= friction * 5;
  base -= noise * 5;
  base -= drift * 5;
  base -= flowThrottleRate * 20;

  // v15: advantage + aura + mesh pressure
  if (echo.advantage?.factoredPath) base += 2;
  if (echo.aura?.sync) base += 2;
  if (echo.aura?.inLoop) base -= 3;
  if (echo.flow?.throttled) base -= 5;
  if (echo.mode?.binary) base += 1;

  // v15: throughput weighting
  if (throughput === "minimal routing") base += 2;
  if (throughput === "light routing") base += 1;
  if (throughput === "moderate routing") base -= 1;
  if (throughput === "high routing") base -= 3;

  return Math.max(0, base);
}

function describeMeshThroughput(echo) {
  const hops = echo.mesh?.hops || 0;
  if (hops === 0) return "minimal routing";
  if (hops < 5) return "light routing";
  if (hops < 15) return "moderate routing";
  return "high routing";
}


function describeMeshStability(field, echo, flowThrottleRate = 0) {
  const stability = field.stability ?? 1;
  const drift = field.driftPressure ?? 0;

  if (flowThrottleRate > 0.2)
    return "Flow Guard is engaging frequently — mesh is protecting itself.";

  if (stability > 0.85 && drift < 0.2)
    return "Mesh is stable with low Drift Pressure.";

  if (stability > 0.6 && drift < 0.4)
    return "Mesh is generally stable with mild Drift Pressure.";

  if (drift >= 0.4 && !echo.aura?.sync)
    return "Drift Pressure elevated and Aura Sync inactive — instability risk.";

  if (echo.aura?.inLoop)
    return "Aura Loop detected — mesh may be cycling on patterns.";

  return "Mixed stability; mesh is compensating.";
}

function describeMeshImmuneHormones(echo) {
  const parts = [];

  if (echo.immune?.quarantined)
    parts.push("Immune Quarantine ACTIVE — unsafe impulses isolated.");
  else parts.push("Immune Quarantine quiet.");

  if (echo.hormones?.event === "boost")
    parts.push("Hormone Boost detected.");
  else if (echo.hormones?.event === "damp")
    parts.push("Hormone Damp detected.");
  else parts.push("No hormone modulation.");

  if (echo.reflex?.dropped) parts.push("Reflex Drop occurred.");

  return parts.join(" ");
}

function describeMeshField(field) {
  const bits = [];
  const friction = field.friction ?? 0;
  const noise = field.noise ?? 0;
  const loadWave = field.loadWave ?? 0;
  const externalHeat = field.externalHeat ?? 0;
  const externalStorm = field.externalStorm ?? 0;

  if (friction > 0.5) bits.push("Friction elevated.");
  if (noise > 0.5) bits.push("Noise high.");
  if (loadWave > 0.5) bits.push("Load Wave strong.");
  if (externalHeat > 0.5) bits.push("External Heat contributing.");
  if (externalStorm > 0.5)
    bits.push("External Storm impacting stability.");

  if (bits.length === 0) return "Internal environment calm.";
  return bits.join(" ");
}

function describeMeshFlowSurvival(echo, flowThrottleRate = 0) {
  if (!echo.flow?.throttled && flowThrottleRate === 0)
    return "Flow smooth — no braking needed.";

  if (echo.flow?.reason === "max_depth")
    return "Flow Guard stopped deep recursion — organism prevented runaway loop.";

  if (echo.flow?.reason === "max_active_impulses_soft")
    return "Flow Guard limited impulse surge — organism prevented routing storm.";

  if (flowThrottleRate > 0.2)
    return "Flow Guard active — survival patterns prioritizing safety.";

  return "Flow occasionally braking — mild stress.";
}

function summarizeMeshTopology(mesh) {
  if (!mesh) return "Mesh environment unavailable.";

  const systems = mesh.systems ? Object.keys(mesh.systems).length : 0;
  const links = mesh.symbolicMesh?.links
    ? Object.keys(mesh.symbolicMesh.links).length
    : 0;

  if (systems === 0) return "Mesh systems not loaded.";
  if (links === 0) return "Mesh loaded but no symbolic links.";

  return `Mesh online with ${systems} systems and ${links} symbolic links.`;
}

function summarizeMeshForYou(performance, field, echo, flowThrottleRate = 0) {
  const perf = performance.toFixed(1);

  if (perf > 100)
    return `Mesh at ${perf}%. Stability strong, resonance high, Flow compensating cleanly.`;

  if (perf > 90 && flowThrottleRate === 0)
    return `Mesh performing well at ${perf}%. No braking needed.`;

  if (perf > 90 && flowThrottleRate > 0)
    return `Mesh at ${perf}%. High performance, but Flow Guard has begun intervening — you are pushing the edge.`;

  if (flowThrottleRate > 0.2)
    return `Mesh at ${perf}%. Organism is actively braking — recent patterns were survival‑level stress.`;

  return `Mesh at ${perf}%. Stability and Drift require monitoring — Immune, Aura, and Flow Guard will reveal compensation vs degradation.`;
}


// ============================================================================
// Helpers
// ============================================================================
function pct(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return "0%";
  return `${(v * 100).toFixed(0)}%`;
}
