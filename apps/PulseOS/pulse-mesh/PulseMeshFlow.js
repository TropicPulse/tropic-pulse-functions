// ============================================================================
// [pulse:mesh] COMMUNITY_FLOW_LAYER v11-Evo  // rainbow
// Full-Spectrum Coordination • Deterministic Lifecycle Sequencer
// Metadata-Only • Zero Recursion • Zero Routing • SDN-Aligned
// ============================================================================
//
// IDENTITY — THE FLOW ORGAN (v11-Evo):
// ------------------------------------
// • Pure lifecycle sequencer for impulses.
// • Coordinates Skin → Reflex → Cortex → Tendons → Organs → Immune
//                     → Memory → Hormones → Aura → Router → SendSystem.
// • No recursion, no timestamps, no rate limiting.
// • No routing logic — Router v11 handles all routing.
// • No movement logic — SendSystem v11 handles all movement.
// • No mesh routing — Mesh v11 is deterministic pathway engine.
// • Metadata-only shaping + sequencing.
// • SDN-aware: receives impulses from SDN, returns shaped impulses.
// • v11-Evo: binary-aware, dual-mode-ready, deterministic-field,
//            unified-advantage-field, drift-aware, mesh-pressure-aware.
//
// SAFETY CONTRACT (v11-Evo):
// • No payload access.
// • No compute.
// • No recursion.
// • No timestamps.
// • No routing override.
// • No mutation outside metadata.
// • Deterministic-field, unified-advantage-field, drift-proof.
// ============================================================================

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
  Router,        // v11-Evo — Router handles routing
  SendSystem,    // v11-Evo — SendSystem handles movement
  log,
  warn,
  error
}) {

  // ---------------------------------------------------------------------------
  // META — v11-Evo identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseFlow",
    role: "FLOW_ORCHESTRATOR",
    version: "11.0-Evo",
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
  // FLOW ENGINE (v11-Evo)
  // ---------------------------------------------------------------------------
  function PulseFlow() {
    const reflex = createCommunityReflex();

    return {
      meta,

      // -----------------------------------------------------------------------
      // FLOW_RUN (v11-Evo)
      // -----------------------------------------------------------------------
      async run(impulse, entryNodeId, context = {}) {
        impulse.flags = impulse.flags || {};
        impulse.flags.flow_meta = meta;
        impulse.flags.flow_started = true;

        // v11-Evo: dual-mode tagging
        if (context.binaryMode) impulse.flags.binary_mode = true;
        if (context.dualMode) impulse.flags.dual_mode = true;

        PulseHaloCounters?.impulseStarted?.({ mode: context.binaryMode ? "binary" : "symbolic" });

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

          // 10. ROUTER v11-Evo — deterministic routing
          const routed = await Router.route("pulse", {
            impulse,
            entryNodeId,
            sdnContext: context.sdnContext,
            binaryMode: context.binaryMode
          });

          // 11. SEND SYSTEM v11-Evo — deterministic movement
          const moved = await SendSystem.move(routed);

          // 12. SKIN EXIT
          applyPulseSkin(moved, "exit");

          return finalize(moved);

        } catch (err) {
          warn?.("[PulseFlow v11-Evo] Flow error:", err);
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
