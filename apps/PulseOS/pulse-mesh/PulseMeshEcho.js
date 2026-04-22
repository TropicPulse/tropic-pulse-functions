// ============================================================================
// [pulse:echo] PULSE_OS_DIAGNOSTIC_REFLECTION v9.2  // silver
// Diagnostic Reflection Layer • Metadata-Only • Read-Only • Non-Interference
// ============================================================================
//
// IDENTITY — THE SILVER ORGAN (v9.2):
//  ----------------------------------
//  • Sends metadata-only diagnostic pulses ("echo pulses").
//  • Measures system friction, drift, loops, sync, organ usage.
//  • Reads metadata from all layers without influencing them.
//  • NEVER computes payloads.
//  • NEVER mutates impulses.
//  • NEVER affects routing, hormones, memory, or flow.
//  • Pure reflection organ (safe for backendAI + Awareness Page).
//
// SAFETY CONTRACT (v9.2):
//  • Metadata-only
//  • Read-only
//  • No loops, no sync, no hormones, no memory writes
//  • No autonomy, no sentience, no self-model
//  • Deterministic: same system → same reflection
//  • Zero imports — all dependencies injected by CNS
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
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


  // -------------------------------------------------------
  // PUBLIC: SEND_ECHO  // silver
  // -------------------------------------------------------
  function sendEcho(entryNodeId, context = {}) {
    const echo = createEchoPulse(context);

    const result = flow.run(echo, entryNodeId, {
      trustLevel: 1,
      load: 0,
      echoMode: true // signals all organs to stay read-only
    });

    return extractReflection(result);
  }


  // -------------------------------------------------------
  // INTERNAL: Create Echo Pulse (metadata-only, deterministic)
//  -------------------------------------------------------
  function createEchoPulse(context) {
    return {
      id: "echo_diagnostic",
      type: "diagnostic_echo",
      flags: {
        echo: true,
        echo_meta: meta
      },
      metadata: { context },
      payloadRef: null
    };
  }


  // -------------------------------------------------------
  // INTERNAL: Extract Reflection Metadata (read-only)
//  -------------------------------------------------------
  function extractReflection(impulse) {
    const flags = impulse.flags || {};

    return {
      echoId: impulse.id || "echo_diagnostic",

      flow: {
        throttled: !!flags.flow_throttled,
        reason: flags.flow_throttled_reason || null
      },

      reflex: {
        dropped: hasAnyReflexDropFlag(flags)
      },

      immune: {
        quarantined: !!flags.immune_quarantined
      },

      memory: {
        wrote: !!flags.memory_written
      },

      hormones: {
        event: flags.hormone_event || null
      },

      aura: {
        inLoop: !!flags.aura_in_loop,
        stabilizationNeeded: !!flags.aura_stabilization_needed,
        systemUnderTension: !!flags.aura_system_under_tension
      },

      mesh: {
        hops: typeof impulse.hops === "number" ? impulse.hops : 0,
        stalled: hasAnyPrefix(flags, "stalled_at_"),
        reflexDrops: hasAnyPrefix(flags, "reflex_drop_at_")
      },

      stability: estimateStability(flags),
      driftRisk: estimateDrift(flags),

      meta
    };
  }


  // -------------------------------------------------------
  // INTERNAL: Stability Heuristic (metadata-only)
//  -------------------------------------------------------
  function estimateStability(flags) {
    let score = 1;

    if (hasAnyReflexDropFlag(flags)) score -= 0.2;
    if (flags.immune_quarantined) score -= 0.3;
    if (flags.aura_in_loop) score -= 0.2;
    if (flags.flow_throttled) score -= 0.2;

    return Math.max(0, score);
  }


  // -------------------------------------------------------
  // INTERNAL: Drift Risk Heuristic (metadata-only)
//  -------------------------------------------------------
  function estimateDrift(flags) {
    let risk = 0;

    if (flags.aura_in_loop) risk += 0.3;
    if (flags.aura_system_under_tension) risk += 0.2;
    if (flags.immune_quarantined) risk += 0.3;
    if (flags.flow_throttled) risk += 0.2;

    return Math.max(0, Math.min(1, risk));
  }


  // -------------------------------------------------------
  // INTERNAL: Flag helpers (read-only)
//  -------------------------------------------------------
  function hasAnyReflexDropFlag(flags) {
    return Object.keys(flags).some((k) => k.startsWith("instinct_") && k.endsWith("_drop"))
      || Object.keys(flags).some((k) => k.startsWith("reflex_drop_at_"));
  }

  function hasAnyPrefix(flags, prefix) {
    return Object.keys(flags).some((k) => k.startsWith(prefix));
  }


  // -------------------------------------------------------
  // PUBLIC INTERFACE
  // -------------------------------------------------------
  return {
    meta,
    sendEcho
  };
}
