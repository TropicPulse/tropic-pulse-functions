// ============================================================================
// [pulse:mesh] COMMUNITY_FLOW_LAYER v7.4  // rainbow
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

import { applyPulseSkin } from './PulseSkin.js';
import { createCommunityReflex } from './CommunityReflex.js';
import { applyPulseCortex } from './PulseCortex.js';
import { applyTendons } from './Tendons.js';
import { applyPulseOrgans } from './PulseOrgans.js';
import { applyPulseImmune } from './PulseImmune.js';
import { applyPulseMemory } from './PulseMeshMemory.js';
import { applyPulseHormones } from './PulseHormones.js';
import { applyPulseAura } from './PulseAura.js';

import { PulseHaloCounters } from './PulseHalo.js';

// -----------------------------------------------------------
// Flow Guard — recursion + soft rate limiting
// -----------------------------------------------------------
//
// Design goals:
//  • Never block a healthy, low-load system.
//  • Only engage when we are clearly in runaway territory.
//  • Metadata-only: no payload access, no routing override.
//  • Tag impulses when throttled so healing/telemetry can see it.
// -----------------------------------------------------------

const FlowGuard = {
  activeImpulses: 0,
  maxActiveImpulsesSoft: 5000,   // absurdly high: normal use never hits this
  maxDepth: 128,                 // protects against pathological recursion
  timeSliceMs: 16,               // ~1 frame at 60fps
  sliceStart: performance.now(),
};

function shouldThrottle(impulse, depth) {
  // Depth guard: only trips in true recursion storms.
  if (depth > FlowGuard.maxDepth) {
    impulse.flags.flow_throttled = true;
    impulse.flags.flow_throttled_reason = 'max_depth';
    return true;
  }

  // Reset time slice if we moved to a new frame-ish window.
  const now = performance.now();
  if (now - FlowGuard.sliceStart > FlowGuard.timeSliceMs) {
    FlowGuard.sliceStart = now;
    FlowGuard.activeImpulses = 0;
  }

  // Soft concurrency guard:
  // • Normal flows never get close.
  // • Only a storm of impulses in a single slice will trip this.
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

export function PulseFlow(mesh) {
  const reflex = createCommunityReflex();

  const meta = {
    layer: "PulseFlow",
    role: "FLOW_ORCHESTRATOR",
    version: 7.4,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,                 // mental + system
      localAware: true,               // node-level flow
      internetAware: true,            // cluster/mesh flow
      advantageCascadeAware: true,    // inherits ANY advantage
      pulseEfficiencyAware: true,     // 1-pulse collapse
      driftProof: true,
      multiInstanceReady: true,
      unifiedAdvantageField: true,    // no OR; all advantages ON
      futureEvolutionReady: true      // new safe advantages auto-inherited
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

      // Depth comes from context if we’re in a recursive mesh path.
      const depth = (context.flowDepth ?? 0);

      // FLOW GUARD — only engages in pathological conditions.
      if (shouldThrottle(impulse, depth)) {
        PulseHaloCounters.impulseThrottled?.();
        return finalize(impulse);
      }

      FlowGuard.activeImpulses++;
      PulseHaloCounters.impulseStarted();

      try {
        // -----------------------------------------------------
        // 1. SKIN ENTRY
        // -----------------------------------------------------
        applyPulseSkin(impulse, 'entry');

        // -----------------------------------------------------
        // 2. REFLEX
        // -----------------------------------------------------
        const reflexDecision = reflex(impulse, {
          trustLevel: context.trustLevel,
          load: context.load,
        });

        impulse.flags[`flow_reflex_${reflexDecision ? 'pass' : 'drop'}`] = true;

        if (reflexDecision === 0) {
          PulseHaloCounters.reflexDropped();
          return finalize(impulse);
        }

        // -----------------------------------------------------
        // 3. CORTEX
        // -----------------------------------------------------
        applyPulseCortex(impulse, context);

        // -----------------------------------------------------
        // 4. TENDONS
        // -----------------------------------------------------
        applyTendons(impulse);

        // -----------------------------------------------------
        // 5. ORGANS
        // -----------------------------------------------------
        applyPulseOrgans(impulse);

        // -----------------------------------------------------
        // 6. IMMUNE
        // -----------------------------------------------------
        const immuneBefore = impulse.flags?.immune_quarantined;
        applyPulseImmune(impulse);
        if (impulse.flags?.immune_quarantined && !immuneBefore) {
          PulseHaloCounters.immuneQuarantined();
        }

        // -----------------------------------------------------
        // 7. MEMORY
        // -----------------------------------------------------
        const memoryBefore = impulse.flags?.memory_written;
        applyPulseMemory(impulse);
        if (impulse.flags?.memory_written && !memoryBefore) {
          PulseHaloCounters.memoryWrite();
        }

        // -----------------------------------------------------
        // 8. HORMONES
        // -----------------------------------------------------
        const hormoneBefore = impulse.flags?.hormone_event;
        applyPulseHormones(impulse);
        if (impulse.flags?.hormone_event && !hormoneBefore) {
          if (impulse.flags.hormone_event === 'boost') {
            PulseHaloCounters.hormoneBoost();
          } else if (impulse.flags.hormone_event === 'damp') {
            PulseHaloCounters.hormoneDamp();
          }
        }

        // -----------------------------------------------------
        // 9. AURA
        // -----------------------------------------------------
        const auraBeforeLoop = impulse.flags?.aura_loop;
        const auraBeforeSync = impulse.flags?.aura_sync;

        applyPulseAura(impulse);

        if (impulse.flags?.aura_loop && !auraBeforeLoop) {
          PulseHaloCounters.auraLooped();
        }
        if (impulse.flags?.aura_sync && !auraBeforeSync) {
          PulseHaloCounters.auraSyncTagged();
        }

        // -----------------------------------------------------
        // 10. MESH ROUTING
        // -----------------------------------------------------
        const routed = mesh.routeImpulse(mesh, impulse, entryNodeId, {
          ...context,
          flowDepth: depth + 1, // propagate depth for recursion awareness
        });

        if (routed.flags?.mesh_hops) {
          PulseHaloCounters.meshHops(routed.flags.mesh_hops);
        }

        // -----------------------------------------------------
        // 11. SKIN EXIT
        // -----------------------------------------------------
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
