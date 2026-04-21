// ============================================================================
// FILE: /apps/organs/endocrine/PulseMeshEndocrineSystem.js
// [pulse:mesh] PULSE_MESH_ENDOCRINE_SYSTEM v9.1  // white-gold
// Endocrine Interpreter • System-Wide Monitor • Healing Coordinator
// ============================================================================
//
// IDENTITY — THE MESH ENDOCRINE SYSTEM:
//  ------------------------------------
//  • The endocrine-equivalent organ of PulseMesh.
//  • Watches immune activity, flow pressure, drift, aura, hormones, routing stress.
//  • Interprets system-wide signals into a coherent “body state”.
//  • Coordinates healing by informing immune + repair systems what’s happening.
//  • Produces human-readable, organism-style diagnostic reports.
//
// ROLE (v9.1):
//  • Oversees immune system behavior (but does NOT fight).
//  • Oversees healing patterns (but does NOT heal).
//  • Oversees stress + pressure (but does NOT throttle).
//  • Oversees hormones (but does NOT modulate).
//  • Oversees flow (but does NOT route).
//  • Pure interpretation + coordination layer.
//
// THEME:
//  • Color: White-Gold (endocrine clarity + systemic oversight).
//  • Subtheme: Interpretation, coordination, whole-body state awareness.
//
// SAFETY CONTRACT:
//  • Read-only.
//  • Metadata-only.
//  • No control, no autonomy, no mutation.
//  • No routing, no healing, no immune action.
//  • Deterministic: same metadata → same interpretation.
//  • Drift-proof: zero side effects.
//
// ADVANTAGE CASCADE (conceptual only):
//  • Inherits ANY advantage from ANY mesh organ automatically.
//  • Unified advantage field — all advantages ON unless unsafe.
// ============================================================================
//
// ARCHITECTURE — v9.1 ZERO-IMPORT ORGAN:
//  -------------------------------------
//  • No imports — all dependencies are DI from Brain / Heart / LongTermMemory.
//  • No file-level coupling to other organs.
//  • Multi-instance ready, drift-proof, circular-import-proof.
// ============================================================================

// -----------------------------------------------------------
// Endocrine Interpreter Factory (DI-based, zero-import)
// -----------------------------------------------------------
//
// Expected deps:
//  • mesh              — the mesh instance
//  • PulseField        — environmental field organ (read API)
//  • PulseHalo         — awareness/vitals organ (read API)
//  • createPulseEcho   — factory for diagnostic echo organ
//  • PulseFlow         — flow engine factory
// -----------------------------------------------------------

export function createPulseMeshEndocrineSystem({
  mesh,
  PulseField,
  PulseHalo,
  createPulseEcho,
  PulseFlow
}) {
  const flow = PulseFlow(mesh);
  const echo = createPulseEcho(mesh, flow);

  const meta = {
    layer: "PulseMeshEndocrineSystem",
    role: "MESH_ENDOCRINE_INTERPRETER",
    version: 9.1,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true
    }
  };

  return {
    meta,

    // -------------------------------------------------------
    // [pulse:mesh] EXAMINE_MESH  // white-gold
    // -------------------------------------------------------
    examineMesh(entryNodeId, context = {}) {
      const haloSnapshot = PulseHalo.snapshot();
      const fieldSnapshot = PulseField.snapshot();
      const echoReflection = echo.sendEcho(entryNodeId, context);

      return buildMeshEndocrineReport({
        halo: haloSnapshot,
        field: fieldSnapshot,
        echo: echoReflection,
        meta
      });
    }
  };
}

// -----------------------------------------------------------
// Mesh Endocrine Report Builder
// -----------------------------------------------------------

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
      `Stability (blood pressure): ${(field.stability * 100).toFixed(0)}%`,
      `Throughput (pulse flow): ${describeMeshThroughput(echo)}`,
      `Resonance (rhythm coherence): ${(field.resonance * 100).toFixed(0)}%`,
      `Friction (inflammation): ${(field.friction * 100).toFixed(0)}%`,
      `Noise (sensory load): ${(field.noise * 100).toFixed(0)}%`,
      `Flow Throttles (self‑protection events): ${flowThrottles}`,
      `Throttle Rate: ${(flowThrottleRate * 100).toFixed(1)}%`
    ]
  });

  // STABILITY & DRIFT
  sections.push({
    title: "Stability & Drift",
    summary: describeMeshStability(field, echo, flowThrottleRate),
    details: [
      `Stability: ${(field.stability * 100).toFixed(0)}%`,
      `Drift Pressure: ${(field.driftPressure * 100).toFixed(0)}%`,
      `Aura Loop: ${echo.aura.loop ? "ACTIVE" : "inactive"}`,
      `Aura Sync: ${echo.aura.sync ? "ACTIVE" : "inactive"}`,
      `Flow Guard Activity: ${(flowThrottleRate * 100).toFixed(1)}%`
    ]
  });

  // IMMUNE & HORMONES
  sections.push({
    title: "Immune & Hormones",
    summary: describeMeshImmuneHormones(echo),
    details: [
      `Immune Quarantine: ${echo.immune.quarantined ? "YES" : "no"}`,
      `Hormone Event: ${echo.hormones.event || "none"}`,
      `Reflex Drop: ${echo.reflex.triggered ? "YES" : "no"}`
    ]
  });

  // FIELD ENVIRONMENT
  sections.push({
    title: "Mesh Internal Environment",
    summary: describeMeshField(field),
    details: [
      `Friction: ${(field.friction * 100).toFixed(0)}%`,
      `Noise: ${(field.noise * 100).toFixed(0)}%`,
      `Load Wave: ${(field.loadWave * 100).toFixed(0)}%`,
      `External Heat: ${(field.externalHeat * 100).toFixed(0)}%`,
      `External Storm: ${(field.externalStorm * 100).toFixed(0)}%`,
      `External Signal: ${(field.externalSignal * 100).toFixed(0)}%`
    ]
  });

  // FLOW & SURVIVAL PATTERNS
  sections.push({
    title: "Flow & Survival Patterns",
    summary: describeMeshFlowSurvival(echo, flowThrottleRate),
    details: [
      `Flow Throttled (this echo): ${echo.flow?.throttled ? "YES" : "no"}`,
      `Throttle Reason: ${echo.flow?.reason || "none"}`,
      `Cortex Flow Anomaly: ${echo.flags?.cortex_flow_anomaly ? "YES" : "no"}`,
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

// -----------------------------------------------------------
// Interpretation Logic (mesh‑aware)
// -----------------------------------------------------------

function estimateMeshPerformance(field, echo, flowThrottleRate = 0) {
  let base = 100;
  base += field.resonance * 5;
  base -= field.friction * 5;
  base -= field.noise * 5;
  base -= field.driftPressure * 5;
  base -= flowThrottleRate * 20;
  if (echo.aura.sync) base += 2;
  if (echo.aura.loop) base -= 3;
  if (echo.flow?.throttled) base -= 5;
  return Math.max(0, base);
}

function describeMeshThroughput(echo) {
  const hops = echo.mesh.hops || 0;
  if (hops === 0) return "minimal routing";
  if (hops < 5) return "light routing";
  if (hops < 15) return "moderate routing";
  return "high routing";
}

function describeMeshStability(field, echo, flowThrottleRate = 0) {
  if (flowThrottleRate > 0.2)
    return "Flow Guard is engaging frequently — mesh is protecting itself from overload.";

  if (field.stability > 0.85 && field.driftPressure < 0.2)
    return "Mesh is stable with low Drift Pressure.";

  if (field.stability > 0.6 && field.driftPressure < 0.4)
    return "Mesh is generally stable with mild Drift Pressure.";

  if (field.driftPressure >= 0.4 && !echo.aura.sync)
    return "Drift Pressure elevated and Aura Sync inactive — instability risk.";

  if (echo.aura.loop)
    return "Aura Loop detected — mesh may be cycling on patterns.";

  return "Mixed stability; mesh is compensating.";
}

function describeMeshImmuneHormones(echo) {
  const parts = [];

  if (echo.immune.quarantined)
    parts.push("Immune Quarantine ACTIVE — unsafe impulses isolated.");
  else parts.push("Immune Quarantine quiet.");

  if (echo.hormones.event === "boost")
    parts.push("Hormone Boost (adrenaline) detected.");
  else if (echo.hormones.event === "damp")
    parts.push("Hormone Damp (cortisol) detected.");
  else parts.push("No hormone modulation.");

  if (echo.reflex.triggered) parts.push("Reflex Drop occurred.");

  return parts.join(" ");
}

function describeMeshField(field) {
  const bits = [];
  if (field.friction > 0.5) bits.push("Friction elevated.");
  if (field.noise > 0.5) bits.push("Noise high.");
  if (field.loadWave > 0.5) bits.push("Load Wave strong.");
  if (field.externalHeat > 0.5) bits.push("External Heat contributing.");
  if (field.externalStorm > 0.5)
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
