// ============================================================================
// [pulse:echo] PULSE_OS_DIAGNOSTIC_REFLECTION v15-EVO-IMMORTAL  // silver
// Diagnostic Reflection Layer • Metadata-Only • Read-Only • Non-Interference
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof • Advantage-Aware
// ============================================================================
//
// IDENTITY — THE SILVER ORGAN (v15-EVO-IMMORTAL):
// -----------------------------------------------
// • Sends metadata-only diagnostic pulses ("echo pulses").
// • Measures system friction, drift, loops, sync, organ usage, mesh pressure.
// • Reads metadata from all layers without influencing them.
// • NEVER computes payloads.
// • NEVER mutates impulses.
// • NEVER affects routing, hormones, memory, or flow.
// • Pure reflection organ (safe for backendAI + Awareness Page).
// • Presence-aware, binary-aware, dual-band-ready, deterministic-field,
//   unified-advantage-field, mesh-pressure-aware, flow-aware, drift-aware,
//   multi-instance-ready, chunk/prewarm-ready.
//
// SAFETY CONTRACT (v15):
// -----------------------
// • Metadata-only
// • Read-only
// • No loops, no sync, no hormones, no memory writes
// • No autonomy, no sentience, no self-model
// • Deterministic: same system → same reflection
// • Zero imports — all dependencies injected by CNS
// • Zero routing influence
// • Zero mutation of input
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshEcho",
  version: "v14.9-MESH-ECHO-IMMORTAL",
  layer: "mesh",
  role: "mesh_reflex_and_echo_engine",
  lineage: "PulseMesh-v14",

  evo: {
    reflex: true,
    echo: true,
    binaryAware: true,
    symbolicAware: true,
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
      "PulseMeshCognition"
    ],
    never: [
      "legacyMeshEcho",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/
// ============================================================================
// [pulse:echo] PULSE_OS_DIAGNOSTIC_REFLECTION v15-EVO-IMMORTAL  // silver
// FULL UTILIZATION EDITION — now fully mesh-aware
// ============================================================================

export function createPulseEcho({
  flow,
  mesh,   // <-- NOW FULLY USED
  log,
  warn,
  error
}) {

  const meta = {
    layer: "PulseEcho",
    role: "DIAGNOSTIC_REFLECTION",
    version: "15-EVO-IMMORTAL-FULL-MESH",
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

  // -------------------------------------------------------
  // PUBLIC: SEND_ECHO
  // -------------------------------------------------------
  function sendEcho(entryNodeId, context = {}) {
    const echo = createEchoPulse(context);

    const result = flow.run(echo, entryNodeId, {
      trustLevel: 1,
      load: 0,
      echoMode: true,
      binaryMode: false,
      dualMode: true,
      presenceBand: context.presenceBand || "symbolic",
      presenceTag: context.presenceTag || "PulseEcho-v15"
    });

    return extractReflection(result);
  }

  // -------------------------------------------------------
  // INTERNAL: CREATE ECHO PULSE
  // -------------------------------------------------------
  function createEchoPulse(context) {
    return {
      id: "echo_diagnostic",
      type: "diagnostic_echo",
      flags: {
        echo: true,
        echo_meta: meta,
        presence_band: context.presenceBand || "symbolic",
        presence_tag: context.presenceTag || "PulseEcho-v15"
      },
      metadata: { context },
      payloadRef: null
    };
  }

  // -------------------------------------------------------
  // INTERNAL: EXTRACT REFLECTION (NOW MESH-AWARE)
// -------------------------------------------------------
  function extractReflection(impulse) {
    const flags = impulse.flags || {};

    return {
      echoId: impulse.id || "echo_diagnostic",

      // ---------------------------------------------------
      // MODE + PRESENCE
      // ---------------------------------------------------
      mode: {
        binary: !!flags.binary_mode,
        symbolic: !flags.binary_mode,
        dual: !!flags.dual_mode
      },

      presence: {
        band: flags.presence_band || "symbolic",
        tag: flags.presence_tag || "PulseEcho-v15",
        auraBand: flags.aura_presence_band || null,
        auraTag: flags.aura_presence_tag || null
      },

      // ---------------------------------------------------
      // FLOW + PRESSURE
      // ---------------------------------------------------
      flow: {
        throttled: !!flags.flow_throttled,
        reason: flags.flow_throttled_reason || null,
        pressure: flags.flow_pressure ?? null,
        recentThrottleRate: flags.recent_throttle_rate ?? null
      },

      // ---------------------------------------------------
      // AURA PRESSURE + LOOPING
      // ---------------------------------------------------
      aura: {
        inLoop: !!flags.aura_in_loop,
        loopDepth: flags.aura_loop_depth ?? 0,
        stabilizationNeeded: !!flags.aura_stabilization_needed,
        systemUnderTension: !!flags.aura_system_under_tension,
        prefersStableRoutes: !!flags.aura_prefers_stable_routes,
        prefersFactoredPaths: !!flags.aura_prefers_factored_paths,
        factoringBias: flags.aura_factoring_bias ?? null,
        prefersBinaryMesh: !!flags.aura_prefers_binary_mesh,
        binaryMeshBias: flags.aura_binary_mesh_bias ?? null,
        binaryOSAvailable: !!flags.aura_binary_os_available
      },

      // ---------------------------------------------------
      // MESH (NOW FULLY REFLECTED)
      // ---------------------------------------------------
      mesh: {
        hops: typeof impulse.hops === "number" ? impulse.hops : 0,

        stalledAt: extractPrefixed(flags, "stalled_at_"),
        reflexDropsAt: extractPrefixed(flags, "reflex_drop_at_"),
        missingNodes: extractPrefixed(flags, "missing_node_"),

        driftPressure: flags.drift_pressure ?? null,

        // NEW: mesh environment reflection
        meshMeta: mesh?.meta ?? null,
        meshSystems: mesh?.systems ? Object.keys(mesh.systems) : [],
        meshLinks: mesh?.symbolicMesh?.links
          ? Object.keys(mesh.symbolicMesh.links)
          : [],
        binaryMeshReady: mesh?.binaryMesh ? true : false,
        symbolicMeshReady: mesh?.symbolicMesh ? true : false
      },

      // ---------------------------------------------------
      // REFLEX + IMMUNE + MEMORY + HORMONES
      // ---------------------------------------------------
      reflex: {
        dropped: hasAnyReflexDropFlag(flags),
        reflexFlags: extractPrefixed(flags, "instinct_")
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

      // ---------------------------------------------------
      // ADVANTAGE FIELD
      // ---------------------------------------------------
      advantage: {
        binaryPreferred: !!flags.aura_prefers_binary_mesh,
        binaryBias: flags.aura_binary_mesh_bias ?? null,
        factoredPath: !!flags.mesh_factored,
        factorDepth: flags.mesh_factor_depth ?? null
      },

      // ---------------------------------------------------
      // STABILITY + DRIFT
      // ---------------------------------------------------
      stability: estimateStability(flags),
      driftRisk: estimateDrift(flags),

      meta
    };
  }

  // -------------------------------------------------------
  // STABILITY + DRIFT HEURISTICS
  // -------------------------------------------------------
  function estimateStability(flags) {
    let score = 1;

    if (hasAnyReflexDropFlag(flags)) score -= 0.2;
    if (flags.immune_quarantined) score -= 0.3;
    if (flags.aura_in_loop) score -= 0.2;
    if (flags.flow_throttled) score -= 0.2;
    if (flags.aura_system_under_tension) score -= 0.1;

    return Math.max(0, score);
  }

  function estimateDrift(flags) {
    let risk = 0;

    if (flags.aura_in_loop) risk += 0.3;
    if (flags.aura_system_under_tension) risk += 0.2;
    if (flags.immune_quarantined) risk += 0.3;
    if (flags.flow_throttled) risk += 0.2;
    if (flags.drift_pressure !== undefined) risk += flags.drift_pressure * 0.3;

    return Math.max(0, Math.min(1, risk));
  }

  // -------------------------------------------------------
  // HELPERS
  // -------------------------------------------------------
  function hasAnyReflexDropFlag(flags) {
    return Object.keys(flags).some((k) => k.startsWith("instinct_") && k.endsWith("_drop"))
        || Object.keys(flags).some((k) => k.startsWith("reflex_drop_at_"));
  }

  function extractPrefixed(flags, prefix) {
    return Object.keys(flags)
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.replace(prefix, ""));
  }

  // -------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------
  return {
    meta,
    sendEcho
  };
}
