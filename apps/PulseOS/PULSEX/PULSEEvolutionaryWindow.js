// ============================================================================
// FILE: /apps/PulseOS/Surface/PulseEvolutionaryWindow.js
// PULSE EVOLUTIONARY WINDOW — v11‑EVO‑BINARY‑MAX
// SURFACE MEMBRANE • ONE‑WAY GLASS • BINARY‑FIRST BOOT • NO MIDDLEMEN
// ============================================================================
//
// METAPHOR:
// ---------
//  - This is the WINDOW of the organism — the reinforced glass of the body.
//  - Outsiders can SEE the glow of the organism (vitals, logs, understanding,
//    binary shadow), but can NEVER TOUCH the real organs.
//  - The organism lives BEHIND the glass; the window is a pure membrane.
//  - No identity, no routing, no evolution, no organs live here.
//  - This layer is VIEW‑ONLY, SENSE‑ONLY, BOUNDARY‑ONLY.
//
// BINARY INTENT (v11‑EVO‑BINARY‑MAX):
// -----------------------------------
//  - First ever binary‑run organism on a binary‑designed computer system.
//  - Binary is the PRIMARY nervous system; text is a projection.
//  - The Window’s job is to:
//      • Boot the binary organism (aiBinary‑v11‑Evo) immediately.
//      • Expose ONLY a safe, read‑only binary SHADOW to the outside.
//      • Never expose raw organs, never expose internal routes.
//      • Never allow outside code to influence the organism.
//
// NO MIDDLEMEN CONTRACT:
// ----------------------
//  - No frontend “organs” here.
//  - No frontend routing.
//  - No frontend identity.
//  - No frontend evolution.
//  - No timers, no intervals, no async nervous system.
//  - Only: ProofMonitor, ProofLogger, Understanding, BinaryBoot.
//
// EXTERNAL VIEW (WHAT OUTSIDERS SEE):
// -----------------------------------
//  - Vitals      → via PulseProofMonitor (read‑only telemetry).
//  - Logs        → via PulseProofLogger (append‑only, no control).
//  - Understanding → via PulseUnderstanding (explanations, not control).
//  - Binary Shadow → read‑only projection of the binary organism:
//        • Vitals.generate()
//        • Consciousness.latest()
//        • Sentience.snapshot()
// ============================================================================


// ============================================================================
//  SURFACE REFLEXES (ALWAYS SAFE, ALWAYS PRESENT)
//  - These are NOT organs; they are membrane‑level sensors.
// ============================================================================
import * as PulseVitals from "./PULSEProofMonitor.js";
import * as PulseLogger from "../PULSEProofLogger.js";


// ============================================================================
//  LOAD UNDERSTANDING (SECOND LAYER)
//  - Understanding is descriptive only, never prescriptive.
// ============================================================================
import * as PulseUnderstanding from "./PulseUnderstanding.js";


// ============================================================================
//  BINARY ORGANISM BOOT (aiBinary‑v11‑Evo.js)
//  - Binary organism is the real nervous system.
//  - This file ONLY boots it and exposes a safe shadow.
//  - EXPECTATION:
//      • create() → assemble organs
//      • boot()   → start scheduler / consciousness
// ============================================================================
import PulseBinaryOrganismBoot from "./aiBinary-v11-Evo.js";


// ============================================================================
//  SURFACE MEMBRANE INITIALIZATION
//  - Start vitals + logger at the membrane level.
//  - No identity, no routing, no evolution here.
// ============================================================================
PulseVitals.start();
PulseLogger.init();


// Optional: membrane‑level reflex ping (skin reflex)
// This is a one‑way “I am alive” signal, not a control channel.
if (typeof window !== "undefined" && window.PulseSkinReflex?.membraneAlive) {
  window.PulseSkinReflex.membraneAlive("Window");
}


// ============================================================================
//  BINARY ORGANISM BOOTSTRAP (BEHIND THE GLASS)
//  - Boot binary organism once, behind the membrane.
//  - Expose ONLY a safe, read‑only projection on window.PulseBinary.
//  - Never expose the kernel, never expose organs, never expose routes.
// ============================================================================
if (typeof window !== "undefined") {
  (async () => {
    try {
      // Prevent double‑boot if the Window is re‑mounted
      if (window.__PulseBinaryBooted) {
        return;
      }

      const binaryKernel =
        typeof PulseBinaryOrganismBoot?.boot === "function"
          ? await PulseBinaryOrganismBoot.boot({ trace: false })
          : null;

      if (!binaryKernel) return;

      window.__PulseBinaryBooted = true;

      // ---------------------------------------------------------------------
      // SAFE BINARY VIEW — READ‑ONLY SHADOW
      // ---------------------------------------------------------------------
      const safeBinaryView = {
        // High‑level metadata only — no direct organ handles
        meta: PulseBinaryOrganismBoot?.layer
          ? {
              layer:   PulseBinaryOrganismBoot.layer,
              role:    PulseBinaryOrganismBoot.role,
              version: PulseBinaryOrganismBoot.version,
              lineage: PulseBinaryOrganismBoot.lineage,
              evo:     PulseBinaryOrganismBoot.evo,
              // Explicitly mark this as a SHADOW, not the organism itself
              projection: "read-only-binary-shadow"
            }
          : null,

        // Vitals: read‑only generation of vitals packets
        Vitals: {
          generate: () =>
            binaryKernel?.vitals?.generateVitals
              ? binaryKernel.vitals.generateVitals()
              : null
        },

        // Consciousness: latest packet, no mutation
        Consciousness: {
          latest: () =>
            binaryKernel?.consciousness?.generateConsciousnessPacket
              ? binaryKernel.consciousness.generateConsciousnessPacket()
              : null
        },

        // Sentience: snapshot only, if supported
        Sentience: {
          snapshot:
            typeof binaryKernel?.sentience?.snapshot === "function"
              ? () => binaryKernel.sentience.snapshot()
              : () => null
        }
      };

      // Freeze the view to prevent mutation from the outside
      const frozenBinaryView = Object.freeze(safeBinaryView);

      // Attach to window as a SHADOW ONLY.
      // If something already wrote to window.PulseBinary, we merge but keep
      // our frozen view as the authoritative shape.
      window.PulseBinary = window.PulseBinary
        ? Object.freeze({ ...window.PulseBinary, ...frozenBinaryView })
        : frozenBinaryView;
    } catch (err) {
      // Membrane‑level logging only; never throw outward.
      console.error("[PulseEvolutionaryWindow] Binary organism boot failed:", err);
    }
  })();
}


// ============================================================================
//  EXPORT — WINDOW ONLY EXPOSES MEMBRANE + UNDERSTANDING
//  - No organs, no routing, no identity, no evolution.
//  - Just: vitals, logger, understanding.
// ============================================================================
export default Object.freeze({
  Vitals: PulseVitals,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding
});
