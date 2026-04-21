// ============================================================================
// FILE: /apps/organs/endocrine/PulseMeshEndocrineSystem.js
// PULSE OS v9.2 — MESH ENDOCRINE SYSTEM  // white-gold
// “Mesh Endocrine Interpreter / System Hormone Clinician”
// ============================================================================
//
// IDENTITY — THE MESH ENDOCRINE SYSTEM (v9.2):
// -------------------------------------------
// • Reads Halo (counters), Field (pressure), Echo (diagnostic reflection).
// • Interprets mesh health as endocrine / hormone-like systemic signals.
// • Produces a structured “mesh endocrine report” for:
//      - Awareness Page (UI diagnostics)
//      - Backend AI (immune + analytics)
//      - Mesh Immune System (healing insight)
//      - Clinician / you (human-readable interpretation)
// • NEVER mutates impulses, NEVER routes, NEVER computes payloads.
// • Pure interpretation organ — white-gold, clinical, non-interference.
//
// THEME:
// • Color: White-Gold (clinical clarity + systemic influence).
// • Subtheme: Interpretation, diagnosis, endocrine-style systemic insight.
//
// SAFETY CONTRACT (v9.2):
// • Read-only, metadata-only.
// • No loops, no hormones, no memory writes.
// • No routing, no healing, no mutation, no payload access.
// • No autonomy, no sentience, no self-model.
// • Deterministic-field: same Halo/Field/Echo → same report.
// • Unified-advantage-field: inherits all safe systemic advantages.
// • Drift-proof, multi-instance-ready, factoring-aware.
//
// ARCHITECTURE (v9.2):
// • Zero imports — all dependencies injected by CNS Brain.
// • Uses:
//      - PulseHalo      → counters / safety / flow / mesh vitals
//      - PulseFieldRead → environmental + internal field snapshot
//      - PulseEcho      → diagnostic echo pulse (metadata-only)
// • Pure endocrine interpreter — no routing, no mutation, no compute.
// • Backend-safe, frontend-safe, global-safe.
// ============================================================================


export function createPulseMeshEndocrineSystem({
  PulseHalo,
  PulseFieldRead,
  PulseEcho,
  log,
  warn,
  error
}) {
  const meta = {
    layer: "PulseMeshEndocrineSystem",
    role: "MESH_ENDOCRINE_INTERPRETER",
    version: 9.2,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
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
      meshPressureAware: true
    }
  };

  return {
    meta,

    // -------------------------------------------------------
    // [pulse:mesh] EXAMINE_MESH  // white-gold
    // -------------------------------------------------------
    examineMesh(entryNodeId, context = {}) {
      const haloSnapshot = PulseHalo.snapshot
        ? PulseHalo.snapshot()
        : PulseHalo.status();

      const fieldSnapshot = PulseFieldRead.snapshot();
      const echoReflection = PulseEcho.sendEcho(entryNodeId, context);

      return buildMeshEndocrineReport({
        halo: haloSnapshot,
        field: fieldSnapshot,
        echo: echoReflection,
        meta
      });
    }
  };
}


// ============================================================================
// Mesh Endocrine Report Builder (v9.2)
// ============================================================================
function buildMeshEndocrineReport({ halo, field, echo, meta }) {
  const flowThrottles = halo.flow_throttles ?? 0;
  const flowThrottleRate = halo.flow?.throttle_rate ?? 0;

  const sections = [];

  // PERFORMANCE SUMMARY
  const performance = estimateMeshPerformance(field, echo, flowThrottleRate);
  sections.push({
    title: "Mesh Performance",
    summary: `Mesh performance estimated at ${performance.toFixed(1)}%.`,
    details: [
      `Stability (blood pressure): ${pct(field.stability)}`,
      `Throughput (pulse flow): ${describeMeshThroughput(echo)}`,
      `Resonance (rhythm coherence): ${pct(field.resonance)}`,
      `Friction (inflammation): ${pct(field.friction)}`,
      `Noise (sensory load): ${pct(field.noise)}`,
      `Flow Throttles (self‑protection events): ${flowThrottles}`,
      `Throttle Rate: ${pct(flowThrottleRate)}`
    ]
  });

  // STABILITY & DRIFT
  sections.push({
    title: "Stability & Drift",
    summary: describeMeshStability(field, echo, flowThrottleRate),
    details: [
      `Stability: ${pct(field.stability)}`,
      `Drift Pressure: ${pct(field.driftPressure)}`,
      `Aura Loop: ${echo.aura?.inLoop ? "ACTIVE" : "inactive"}`,
      `Aura Sync: ${echo.aura?.sync ? "ACTIVE" : "inactive"}`,
      `Flow Guard Activity: ${pct(flowThrottleRate)}`
    ]
  });

  // IMMUNE & HORMONES
  sections.push({
    title: "Immune & Hormones",
    summary: describeMeshImmuneHormones(echo),
    details: [
      `Immune Quarantine: ${echo.immune?.quarantined ? "YES" : "no"}`,
      `Hormone Event: ${echo.hormones?.event || "none"}`,
      `Reflex Drop: ${echo.reflex?.dropped ? "YES" : "no"}`
    ]
  });

  // FIELD ENVIRONMENT
  sections.push({
    title: "Mesh Internal Environment",
    summary: describeMeshField(field),
    details: [
      `Friction: ${pct(field.friction)}`,
      `Noise: ${pct(field.noise)}`,
      `Load Wave: ${pct(field.loadWave)}`,
      `External Heat: ${pct(field.externalHeat)}`,
      `External Storm: ${pct(field.externalStorm)}`,
      `External Signal: ${pct(field.externalSignal)}`
    ]
  });

  // FLOW & SURVIVAL PATTERNS
  sections.push({
    title: "Flow & Survival Patterns",
    summary: describeMeshFlowSurvival(echo, flowThrottleRate),
    details: [
      `Flow Throttled (this echo): ${echo.flow?.throttled ? "YES" : "no"}`,
      `Throttle Reason: ${echo.flow?.reason || "none"}`,
      `Organism Self‑Protection: ${flowThrottleRate > 0 ? "ACTIVE" : "quiet"}`
    ]
  });

  return {
    performancePercent: performance,
    interpretation: summarizeMeshForYou(
      performance,
      field,
      echo,
      flowThrottleRate
    ),
    sections,
    meta
  };
}


// ============================================================================
// Interpretation Logic (v9.2)
// ============================================================================
function estimateMeshPerformance(field, echo, flowThrottleRate = 0) {
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

  if (echo.aura?.sync) base += 2;
  if (echo.aura?.inLoop) base -= 3;
  if (echo.flow?.throttled) base -= 5;

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
    return "Flow Guard is engaging frequently — mesh is protecting itself from overload.";

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
    parts.push("Hormone Boost (adrenaline) detected.");
  else if (echo.hormones?.event === "damp")
    parts.push("Hormone Damp (cortisol) detected.");
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
