// -----------------------------------------------------------
// [pulse:echo] PULSE_OS_DIAGNOSTIC_REFLECTION  // silver
// -----------------------------------------------------------
// ROLE:
//   - Sends metadata-only diagnostic pulses ("echo pulses")
//   - Measures system friction, drift, loops, sync, organ usage
//   - Reads metadata from all layers without influencing them
//   - NEVER computes payloads
//   - NEVER mutates impulses
//   - NEVER affects routing or hormones
//   - Pure reflection organ (safe for backendAI + Awareness Page)
//
// THEME:
//   - Color: Silver (reflection, clarity, non-interference)
//   - Subtheme: Sonar, diagnostics, transparency
//
// SAFETY CONTRACT:
//   - Metadata-only
//   - Read-only
//   - No loops, no sync, no hormones, no memory writes
//   - No autonomy, no sentience, no self-model
//
// -----------------------------------------------------------
// Echo Pulse Generator
// -----------------------------------------------------------

export function createPulseEcho(mesh, flow) {
  return {
    // -------------------------------------------------------
    // [pulse:echo] SEND_ECHO  // silver
    // -------------------------------------------------------
    // Sends a diagnostic pulse through the organism
    // Returns metadata-only reflection results
    // -------------------------------------------------------
    sendEcho(entryNodeId, context = {}) {
      const echo = this.#createEchoPulse(context);

      // Run through the organism (metadata-only)
      const result = flow.run(echo, entryNodeId, {
        trustLevel: 1,
        load: 0,
        echoMode: true, // signals all organs to stay read-only
      });

      return this.#extractReflection(result);
    },

    // -------------------------------------------------------
    // INTERNAL: Create Echo Pulse
    // -------------------------------------------------------
    #createEchoPulse(context) {
      return {
        id: `echo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        type: 'diagnostic_echo',
        flags: {
          echo: true,
          echo_depth: 0,
          echo_start: Date.now(),
        },
        metadata: {
          context,
        },
        payloadRef: null, // echo pulses NEVER carry payloads
      };
    },

    // -------------------------------------------------------
    // INTERNAL: Extract Reflection Metadata
    // -------------------------------------------------------
    #extractReflection(impulse) {
      return {
        echoId: impulse.id,
        durationMs: Date.now() - impulse.flags.echo_start,

        // Organ-level reflections
        reflex: {
          triggered: !!impulse.flags.flow_reflex_drop,
        },
        immune: {
          quarantined: !!impulse.flags.immune_quarantined,
        },
        memory: {
          wrote: !!impulse.flags.memory_written,
        },
        hormones: {
          event: impulse.flags.hormone_event || null,
        },
        aura: {
          loop: !!impulse.flags.aura_loop,
          sync: !!impulse.flags.aura_sync,
        },

        // Mesh-level reflections
        mesh: {
          hops: impulse.flags.mesh_hops || 0,
          routeHint: impulse.routeHint || null,
        },

        // Stability + drift heuristics
        stability: this.#estimateStability(impulse),
        driftRisk: this.#estimateDrift(impulse),
      };
    },

    // -------------------------------------------------------
    // INTERNAL: Stability Heuristic
    // -------------------------------------------------------
    #estimateStability(impulse) {
      let score = 1;

      if (impulse.flags.flow_reflex_drop) score -= 0.2;
      if (impulse.flags.immune_quarantined) score -= 0.3;
      if (impulse.flags.aura_loop) score -= 0.2;

      return Math.max(0, score);
    },

    // -------------------------------------------------------
    // INTERNAL: Drift Risk Heuristic
    // -------------------------------------------------------
    #estimateDrift(impulse) {
      let risk = 0;

      if (impulse.flags.aura_loop) risk += 0.3;
      if (impulse.flags.aura_sync) risk -= 0.2;
      if (impulse.flags.immune_quarantined) risk += 0.3;

      return Math.max(0, Math.min(1, risk));
    },
  };
}
