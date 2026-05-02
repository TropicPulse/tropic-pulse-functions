// ============================================================================
// [pulse:mesh] COMMUNITY_FLOW_LAYER v12.3-PRESENCE-EVO-MAX-PRIME  // rainbow
// Full-Spectrum Coordination • Deterministic Lifecycle Sequencer
// Metadata-Only • Zero Recursion • Zero Routing • SDN-Aligned
// Presence-Aware • Binary-Aware • Dual-Band • Drift-Proof
// ============================================================================
//
// IDENTITY — THE FLOW ORGAN (v12.3):
// ----------------------------------
// • Pure lifecycle sequencer for impulses.
// • Coordinates Skin → Reflex → Cortex → Tendons → Organs → Immune
//                     → Memory → Hormones → Aura → Router → SendSystem.
// • No recursion, no timestamps, no rate limiting.
// • No routing logic — Router handles destination.
// • No movement logic — SendSystem handles movement.
// • No mesh routing — Mesh is deterministic pathway engine.
// • Metadata-only shaping + sequencing.
// • SDN-aware: receives impulses from SDN, returns shaped impulses.
// • Presence-aware, binary-aware, dual-band-aware.
//
// SAFETY CONTRACT (v12.3):
// -------------------------
// • No payload access.
// • No compute.
// • No recursion.
// • No timestamps.
// • No routing override.
// • No mutation outside metadata.
// • Deterministic-field, unified-advantage-field, drift-proof.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshFlow",
  version: "v14.9-MESH-FLOW",
  layer: "mesh",
  role: "mesh_conduction_and_flow_engine",
  lineage: "PulseMesh-v14",

  evo: {
    flow: true,                     // This IS the flow organ
    conductor: true,                // Impulse conduction
    sequencing: true,               // Impulse sequencing
    lifecycle: true,                // Impulse lifecycle
    binaryAware: true,              // Binary conduction hints
    symbolicAware: true,            // Symbolic conduction hints
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
      "PulseMeshAwareness",
      "PulseMeshCognition",
      "PulseMeshCortex",
      "PulseMeshEcho",
      "PulseMeshEndocrineSystem",
      "PulseMeshEnvironmentalField"
    ],
    never: [
      "legacyMeshFlow",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseMeshFlow({
  applyPulseSkin,
  createCommunityReflex,
  applyPulseCortex,
  applyTendons,
  applyPulseOrgans,
  applyPulseImmune,
  applyPulseMemory,
  applyPulseHormones,
  applyPulseAura,
  PulseHaloCounters,
  Router,
  SendSystem,
  log,
  warn,
  error
}) {

  // ---------------------------------------------------------------------------
  // META — v12.3 identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseFlow",
    role: "FLOW_ORCHESTRATOR",
    version: "12.3-PRESENCE-EVO-MAX-PRIME",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
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
      meshPressureAware: true,
      auraPressureAware: true,
      flowAware: true,
      driftAware: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    }
  };


  // ---------------------------------------------------------------------------
  // FLOW ENGINE (v12.3)
  // ---------------------------------------------------------------------------
  function PulseFlow() {
    const reflex = createCommunityReflex();

    return {
      meta,

      // -----------------------------------------------------------------------
      // FLOW_RUN (v12.3)
      // -----------------------------------------------------------------------
      async run(impulse, entryNodeId, context = {}) {
        impulse.flags = impulse.flags || {};
        impulse.flags.flow_meta = meta;
        impulse.flags.flow_started = true;

        // v12.3: dual-band + presence tagging
        if (context.binaryMode) impulse.flags.binary_mode = true;
        if (context.dualMode) impulse.flags.dual_mode = true;

        if (context.presenceBand) impulse.band = context.presenceBand;
        if (context.presenceTag) impulse.flags.aura_presence_tag = context.presenceTag;

        PulseHaloCounters?.impulseStarted?.({
          mode: context.binaryMode ? "binary" : context.dualMode ? "dual" : "symbolic",
          band: impulse.band,
          presenceTag: impulse.flags.aura_presence_tag
        });

        try {
          // 1. SKIN ENTRY
          applyPulseSkin(impulse, "entry");

          // 2. REFLEX
          const reflexDecision = reflex(impulse, {
            trustLevel: context.trustLevel,
            load: context.load
          });

          impulse.flags[`flow_reflex_${reflexDecision ? "pass" : "drop"}`] = true;

          if (reflexDecision === 0) {
            PulseHaloCounters?.reflexDropped?.();
            return finalize(impulse);
          }

          // 3. CORTEX
          applyPulseCortex(impulse, context);

          // 4. TENDONS
          applyTendons(impulse);

          // 5. ORGANS
          applyPulseOrgans(impulse);

          // 6. IMMUNE
          const immuneBefore = impulse.flags.immune_quarantined;
          applyPulseImmune(impulse);
          if (impulse.flags.immune_quarantined && !immuneBefore) {
            PulseHaloCounters?.immuneQuarantined?.();
          }

          // 7. MEMORY
          const memoryBefore = impulse.flags.memory_written;
          applyPulseMemory(impulse);
          if (impulse.flags.memory_written && !memoryBefore) {
            PulseHaloCounters?.memoryWrite?.();
          }

          // 8. HORMONES
          const hormoneBefore = impulse.flags.hormone_event;
          applyPulseHormones(impulse);
          if (impulse.flags.hormone_event && !hormoneBefore) {
            if (impulse.flags.hormone_event === "boost") {
              PulseHaloCounters?.hormoneBoost?.();
            } else if (impulse.flags.hormone_event === "damp") {
              PulseHaloCounters?.hormoneDamp?.();
            }
          }

          // 9. AURA
          const auraBeforeLoop = impulse.flags.aura_in_loop;
          const auraBeforeTension = impulse.flags.aura_system_under_tension;

          applyPulseAura(impulse);

          if (impulse.flags.aura_in_loop && !auraBeforeLoop) {
            PulseHaloCounters?.auraLooped?.();
          }
          if (impulse.flags.aura_system_under_tension && !auraBeforeTension) {
            PulseHaloCounters?.auraTensionTagged?.();
          }

          // 10. ROUTER v12.3 — deterministic routing
          const routed = await Router.route("pulse", {
            impulse,
            entryNodeId,
            sdnContext: context.sdnContext,
            binaryMode: context.binaryMode,
            presenceBand: impulse.band
          });

          // 11. SEND SYSTEM v12.3 — deterministic movement
          const moved = await SendSystem.move(routed);

          // 12. SKIN EXIT
          applyPulseSkin(moved, "exit");

          return finalize(moved);

        } catch (err) {
          warn?.("[PulseFlow v12.3] Flow error:", err);
          impulse.flags.flow_error = String(err);
          return finalize(impulse);
        }
      }
    };
  }


  // ---------------------------------------------------------------------------
  // FINALIZER
  // ---------------------------------------------------------------------------
  function finalize(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.flow_completed = true;

    PulseHaloCounters?.impulseCompleted?.();

    return impulse;
  }


  // ---------------------------------------------------------------------------
  // PUBLIC INTERFACE
  // ---------------------------------------------------------------------------
  return {
    create: PulseFlow
  };
}
