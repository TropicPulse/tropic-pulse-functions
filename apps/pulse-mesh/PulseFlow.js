// -----------------------------------------------------------
// [pulse:mesh] COMMUNITY_FLOW_LAYER  // rainbow
// -----------------------------------------------------------
// ROLE:
//   - Orchestrates the full impulse lifecycle through all layers
//   - Ensures smooth, frictionless, self-repairing pulse flow
//   - Sequences Skin → Reflex → Cortex → Tendons → Organs → Immune
//               → Memory → Hormones → Aura → Mesh → Skin(exit)
//   - NEVER computes payloads
//   - NEVER mutates data content
//   - Metadata-only orchestration for system-wide harmony
//
// THEME:
//   - Color: Rainbow (full-spectrum coordination)
//   - Subtheme: Flow, continuity, organism-wide coherence
//
// SAFETY CONTRACT:
//   - No payload access
//   - No compute
//   - No autonomy
//   - No routing override
//   - No mutation outside metadata
//
// -----------------------------------------------------------

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
// Flow Engine
// -----------------------------------------------------------

export function PulseFlow(mesh) {
  const reflex = createCommunityReflex();

  return {
    // -------------------------------------------------------
    // [pulse:mesh] FLOW_RUN  // rainbow
    // -------------------------------------------------------
    // Runs a full impulse through the entire pipeline
    // Metadata-only shaping, no payload access
    // -------------------------------------------------------
    run(impulse, entryNodeId, context = {}) {
      impulse.flags = impulse.flags || {};
      impulse.flags['flow_started'] = true;

      // HALO: impulse started
      PulseHaloCounters.impulseStarted();

      // -----------------------------------------------------
      // 1. SKIN ENTRY (normalize + boundary shaping)
      // -----------------------------------------------------
      applyPulseSkin(impulse, 'entry');

      // -----------------------------------------------------
      // 2. REFLEX (instinctive keep/drop)
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
      // 3. CORTEX (strategic shaping)
      // -----------------------------------------------------
      applyPulseCortex(impulse, context);

      // -----------------------------------------------------
      // 4. TENDONS (intent + routeHint + energy shaping)
      // -----------------------------------------------------
      applyTendons(impulse);

      // -----------------------------------------------------
      // 5. ORGANS (functional identity)
      // -----------------------------------------------------
      applyPulseOrgans(impulse);

      // -----------------------------------------------------
      // 6. IMMUNE (safety + validation)
      // -----------------------------------------------------
      const immuneBefore = impulse.flags?.immune_quarantined;
      applyPulseImmune(impulse);
      if (impulse.flags?.immune_quarantined && !immuneBefore) {
        PulseHaloCounters.immuneQuarantined();
      }

      // -----------------------------------------------------
      // 7. MEMORY (long-term pattern retention)
      // -----------------------------------------------------
      const memoryBefore = impulse.flags?.memory_written;
      applyPulseMemory(impulse);
      if (impulse.flags?.memory_written && !memoryBefore) {
        PulseHaloCounters.memoryWrite();
      }

      // -----------------------------------------------------
      // 8. HORMONES (global modulation)
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
      // 9. AURA (loop + sync field)
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
      // 10. MESH ROUTING (spine traversal)
      // -----------------------------------------------------
      const routed = mesh.routeImpulse(mesh, impulse, entryNodeId, context);

      // HALO: mesh hops (if mesh exposes hop count)
      if (routed.flags?.mesh_hops) {
        PulseHaloCounters.meshHops(routed.flags.mesh_hops);
      }

      // -----------------------------------------------------
      // 11. SKIN EXIT (clean + boundary-safe)
      // -----------------------------------------------------
      applyPulseSkin(routed, 'exit');

      return finalize(routed);
    },
  };
}

// -----------------------------------------------------------
// Finalizer
// -----------------------------------------------------------

function finalize(impulse) {
  impulse.flags = impulse.flags || {};
  impulse.flags['flow_completed'] = true;

  // HALO: impulse completed
  PulseHaloCounters.impulseCompleted();

  return impulse;
}
