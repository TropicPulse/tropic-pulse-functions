// ============================================================================
// [pulse:mesh] COMMUNITY_FLOW_LAYER v9.1  // rainbow
// Full-Spectrum Coordination • Metadata-Only • Self-Repairing Flow Engine
// ============================================================================
//
// IDENTITY — THE FLOW ORGAN:
//  --------------------------
//  • Orchestrates the full impulse lifecycle through all layers.
//  • Ensures smooth, frictionless, self-repairing pulse flow.
//  • Sequences Skin → Reflex → Cortex → Tendons → Organs → Immune
//               → Memory → Hormones → Aura → Mesh → Skin(exit).
//  • NEVER computes payloads.
//  • NEVER mutates data content.
//  • Metadata-only orchestration for organism-wide harmony.
//
// THEME:
//  • Color: Rainbow (full-spectrum coordination).
//  • Subtheme: Flow, continuity, coherence.
//
// SAFETY CONTRACT:
//  • No payload access.
//  • No compute.
//  • No autonomy.
//  • No routing override.
//  • No mutation outside metadata.
//
// ADVANTAGE CASCADE (conceptual only):
//  ------------------------------------
//  • Inherits ANY advantage from ANY organ automatically.
//  • Dual-mode: mental clarity + system efficiency.
//  • Local-aware: node-level flow conditions.
//  • Internet-aware: cluster/mesh flow conditions.
//  • Unified-advantage-field: ALL advantages active unless unsafe.
//  • Future-evolution-ready: new safe advantages auto-inherited.
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
//  (Flow MUST HAVE ZERO IMPORTS)
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
  performance,
  log,
  warn,
  error
}) {

  // -----------------------------------------------------------
  // Flow Guard — recursion + soft rate limiting
  // -----------------------------------------------------------
  const FlowGuard = {
    activeImpulses: 0,
    maxActiveImpulsesSoft: 5000,
    maxDepth: 128,
    timeSliceMs: 16,
    sliceStart: performance.now(),
  };

  function shouldThrottle(impulse, depth) {
    if (depth > FlowGuard.maxDepth) {
      impulse.flags.flow_throttled = true;
      impulse.flags.flow_throttled_reason = 'max_depth';
      return true;
    }

    const now = performance.now();
    if (now - FlowGuard.sliceStart > FlowGuard.timeSliceMs) {
      FlowGuard.sliceStart = now;
      FlowGuard.activeImpulses = 0;
    }

    if (FlowGuard.activeImpulses > FlowGuard.maxActiveImpulsesSoft) {
      impulse.flags.flow_throttled = true;
      impulse.flags.flow_throttled_reason = 'max_active_impulses_soft';
      return true;
    }

    return false;
  }


  // -----------------------------------------------------------
  // Flow Engine
  // -----------------------------------------------------------
  function PulseFlow(mesh) {
    const reflex = createCommunityReflex();

    const meta = {
      layer: "PulseFlow",
      role: "FLOW_ORCHESTRATOR",
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

    return {
      meta,

      // -------------------------------------------------------
      // [pulse:mesh] FLOW_RUN  // rainbow
      // -------------------------------------------------------
      run(impulse, entryNodeId, context = {}) {
        impulse.flags = impulse.flags || {};
        impulse.flags.flow_meta = meta;
        impulse.flags.flow_started = true;

        const depth = (context.flowDepth ?? 0);

        if (shouldThrottle(impulse, depth)) {
          PulseHaloCounters.impulseThrottled?.();
          return finalize(impulse);
        }

        FlowGuard.activeImpulses++;
        PulseHaloCounters.impulseStarted();

        try {
          // 1. SKIN ENTRY
          applyPulseSkin(impulse, 'entry');

          // 2. REFLEX
          const reflexDecision = reflex(impulse, {
            trustLevel: context.trustLevel,
            load: context.load,
          });

          impulse.flags[`flow_reflex_${reflexDecision ? 'pass' : 'drop'}`] = true;

          if (reflexDecision === 0) {
            PulseHaloCounters.reflexDropped();
            return finalize(impulse);
          }

          // 3. CORTEX
          applyPulseCortex(impulse, context);

          // 4. TENDONS
          applyTendons(impulse);

          // 5. ORGANS
          applyPulseOrgans(impulse);

          // 6. IMMUNE
          const immuneBefore = impulse.flags?.immune_quarantined;
          applyPulseImmune(impulse);
          if (impulse.flags?.immune_quarantined && !immuneBefore) {
            PulseHaloCounters.immuneQuarantined();
          }

          // 7. MEMORY
          const memoryBefore = impulse.flags?.memory_written;
          applyPulseMemory(impulse);
          if (impulse.flags?.memory_written && !memoryBefore) {
            PulseHaloCounters.memoryWrite();
          }

          // 8. HORMONES
          const hormoneBefore = impulse.flags?.hormone_event;
          applyPulseHormones(impulse);
          if (impulse.flags?.hormone_event && !hormoneBefore) {
            if (impulse.flags.hormone_event === 'boost') {
              PulseHaloCounters.hormoneBoost();
            } else if (impulse.flags.hormone_event === 'damp') {
              PulseHaloCounters.hormoneDamp();
            }
          }

          // 9. AURA
          const auraBeforeLoop = impulse.flags?.aura_loop;
          const auraBeforeSync = impulse.flags?.aura_sync;

          applyPulseAura(impulse);

          if (impulse.flags?.aura_loop && !auraBeforeLoop) {
            PulseHaloCounters.auraLooped();
          }
          if (impulse.flags?.aura_sync && !auraBeforeSync) {
            PulseHaloCounters.auraSyncTagged();
          }

          // 10. MESH ROUTING
          const routed = mesh.routeImpulse(mesh, impulse, entryNodeId, {
            ...context,
            flowDepth: depth + 1,
          });

          if (routed.flags?.mesh_hops) {
            PulseHaloCounters.meshHops(routed.flags.mesh_hops);
          }

          // 11. SKIN EXIT
          applyPulseSkin(routed, 'exit');

          return finalize(routed);

        } finally {
          FlowGuard.activeImpulses--;
        }
      },
    };
  }


  // -----------------------------------------------------------
  // Finalizer
  // -----------------------------------------------------------
  function finalize(impulse) {
    impulse.flags = impulse.flags || {};
    impulse.flags.flow_completed = true;

    PulseHaloCounters.impulseCompleted();

    return impulse;
  }


  // -----------------------------------------------------------
  // PUBLIC INTERFACE
  // -----------------------------------------------------------
  return {
    create: PulseFlow
  };
}
