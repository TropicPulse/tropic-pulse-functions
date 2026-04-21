// ============================================================================
// [pulse:echo] PULSE_OS_DIAGNOSTIC_REFLECTION v9.1  // silver
// Diagnostic Reflection Layer • Metadata-Only • Read-Only • Non-Interference
// ============================================================================
//
// IDENTITY — THE SILVER ORGAN:
//  ----------------------------
//  • Sends metadata-only diagnostic pulses ("echo pulses").
//  • Measures system friction, drift, loops, sync, organ usage.
//  • Reads metadata from all layers without influencing them.
//  • NEVER computes payloads.
//  • NEVER mutates impulses.
//  • NEVER affects routing, hormones, memory, or flow.
//  • Pure reflection organ (safe for backendAI + Awareness Page).
//
// THEME:
//  • Color: Silver (reflection, clarity, non-interference).
//  • Subtheme: Sonar, diagnostics, transparency.
//
// SAFETY CONTRACT:
//  • Metadata-only.
//  • Read-only.
//  • No loops, no sync, no hormones, no memory writes.
//  • No autonomy, no sentience, no self-model.
//  • Deterministic: same system → same reflection.
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
//  (Echo MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseEcho({
  flow,
  mesh,
  log,
  warn,
  error
}) {

  const meta = {
    layer: "PulseEcho",
    role: "DIAGNOSTIC_REFLECTION",
    version: 9.1,
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
      futureEvolutionReady: true
    }
  };


  // -------------------------------------------------------
  // PUBLIC: SEND_ECHO  // silver
  // -------------------------------------------------------
  function sendEcho(entryNodeId, context = {}) {
    const echo = createEchoPulse(context);

    const result = flow.run(echo, entryNodeId, {
      trustLevel: 1,
      load: 0,
      echoMode: true, // signals all organs to stay read-only
    });

    return extractReflection(result);
  }


  // -------------------------------------------------------
  // INTERNAL: Create Echo Pulse (metadata-only)
  // -------------------------------------------------------
  function createEchoPulse(context) {
    return {
      id: `echo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type: "diagnostic_echo",
      flags: {
        echo: true,
        echo_depth: 0,
        echo_start: Date.now(),
        echo_meta: meta
      },
      metadata: { context },
      payloadRef: null // echo pulses NEVER carry payloads
    };
  }


  // -------------------------------------------------------
  // INTERNAL: Extract Reflection Metadata
  // -------------------------------------------------------
  function extractReflection(impulse) {
    return {
      echoId: impulse.id,
      durationMs: Date.now() - impulse.flags.echo_start,

      flow: {
        throttled: !!impulse.flags.flow_throttled,
        reason: impulse.flags.flow_throttled_reason || null,
      },

      reflex: {
        triggered: !!impulse.flags.flow_reflex_drop
      },
      immune: {
        quarantined: !!impulse.flags.immune_quarantined
      },
      memory: {
        wrote: !!impulse.flags.memory_written
      },
      hormones: {
        event: impulse.flags.hormone_event || null
      },
      aura: {
        loop: !!impulse.flags.aura_loop,
        sync: !!impulse.flags.aura_sync
      },

      mesh: {
        hops: impulse.flags.mesh_hops || 0,
        routeHint: impulse.routeHint || null
      },

      stability: estimateStability(impulse),
      driftRisk: estimateDrift(impulse),

      meta
    };
  }


  // -------------------------------------------------------
  // INTERNAL: Stability Heuristic
  // -------------------------------------------------------
  function estimateStability(impulse) {
    let score = 1;

    if (impulse.flags.flow_reflex_drop) score -= 0.2;
    if (impulse.flags.immune_quarantined) score -= 0.3;
    if (impulse.flags.aura_loop) score -= 0.2;
    if (impulse.flags.flow_throttled) score -= 0.2;

    return Math.max(0, score);
  }


  // -------------------------------------------------------
  // INTERNAL: Drift Risk Heuristic
  // -------------------------------------------------------
  function estimateDrift(impulse) {
    let risk = 0;

    if (impulse.flags.aura_loop) risk += 0.3;
    if (impulse.flags.aura_sync) risk -= 0.2;
    if (impulse.flags.immune_quarantined) risk += 0.3;
    if (impulse.flags.flow_throttled) risk += 0.2;

    return Math.max(0, Math.min(1, risk));
  }


  // -------------------------------------------------------
  // PUBLIC INTERFACE
  // -------------------------------------------------------
  return {
    meta,
    sendEcho
  };
}
