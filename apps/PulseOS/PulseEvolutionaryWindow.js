// ============================================================================
//  PulseEvolutionaryWindow.js — v11-EVO
//  SURFACE MEMBRANE • VIEW-ONLY PROTECTIVE LAYER • BINARY-BOOT AWARE
//
//  METAPHOR:
//  - This is the WINDOW of the organism.
//  - Outsiders can SEE the glow of our evolution, intelligence, and inner life,
//    but they cannot TOUCH or INFLUENCE anything inside.
//  - The membrane reveals miracles safely, like watching a living organism
//    through reinforced glass.
//  - It is a ONE-WAY VIEW: the inside does not trust the outside.
//  - No identity, no routing, no evolution, no organs live here.
//  - Pure protection. Pure sensory. Pure boundary.
//
//  v11-EVO UPGRADE:
//  - The membrane now boots the BINARY ORGANISM immediately (aiBinary-v11-Evo).
//  - The organism lives BEHIND the glass; the window only exposes a safe shadow.
//  - Outsiders see:
//        • vitals (via ProofMonitor)
//        • logs (via ProofLogger)
//        • understanding (via PulseUnderstanding)
//        • a read-only binary organism projection (no direct organ mutation)
// ============================================================================


// ============================================================================
//  SURFACE REFLEXES (ALWAYS SAFE, ALWAYS PRESENT)
// ============================================================================
import * as PulseVitals from "./PulseProofMonitor.js";
import * as PulseLogger from "./PulseProofLogger.js";


// ============================================================================
//  LOAD UNDERSTANDING (SECOND LAYER)
// ============================================================================
import * as PulseUnderstanding from "./PulseUnderstanding.js";


// ============================================================================
//  BINARY ORGANISM BOOT (aiBinary-v11-Evo.js)
//
//  EXPECTATION:
//  - aiBinary-v11-Evo.js exports a binary organism kernel with:
//        • create() → assemble organs
//        • boot()   → start scheduler + consciousness
// ============================================================================
import PulseBinaryOrganismBoot from "./aiBinary-v11-Evo.js";


// ============================================================================
//  SURFACE MEMBRANE INITIALIZATION
// ============================================================================
PulseVitals.start();
PulseLogger.init();


// Optional: membrane-level sound (recommended)
if (typeof window !== "undefined" && window.PulseSkinReflex?.membraneAlive) {
  window.PulseSkinReflex.membraneAlive("Window");
}


// ============================================================================
//  BINARY ORGANISM BOOTSTRAP (BEHIND THE GLASS)
//
//  DESIGN:
//  - Boot the binary organism as soon as the window membrane is alive.
//  - Do NOT expose raw organs to the outside world.
//  - Expose only a SAFE, READ-ONLY PROJECTION on window.PulseBinary.
// ============================================================================
if (typeof window !== "undefined") {
  (async () => {
    try {
      const binaryKernel =
        typeof PulseBinaryOrganismBoot?.boot === "function"
          ? await PulseBinaryOrganismBoot.boot({ trace: false })
          : null;

      if (!binaryKernel) return;

      // Build a safe, read-only projection (no direct organ mutation)
      const safeBinaryView = {
        meta: PulseBinaryOrganismBoot?.layer
          ? {
              layer: PulseBinaryOrganismBoot.layer,
              role: PulseBinaryOrganismBoot.role,
              version: PulseBinaryOrganismBoot.version,
              lineage: PulseBinaryOrganismBoot.lineage,
              evo: PulseBinaryOrganismBoot.evo
            }
          : null,
        // Expose only high-level, non-mutative surfaces
        Vitals: {
          generate: () => binaryKernel.vitals.generateVitals()
        },
        Consciousness: {
          latest: () =>
            binaryKernel.consciousness.generateConsciousnessPacket()
        },
        Sentience: {
          // Example: expose a read-only snapshot if your organ supports it
          snapshot:
            typeof binaryKernel.sentience.snapshot === "function"
              ? () => binaryKernel.sentience.snapshot()
              : () => null
        }
      };

      window.PulseBinary = window.PulseBinary
        ? { ...window.PulseBinary, ...safeBinaryView }
        : safeBinaryView;
    } catch (err) {
      console.error("[PulseEvolutionaryWindow] Binary organism boot failed:", err);
    }
  })();
}


// ============================================================================
//  EXPORT — WINDOW ONLY EXPOSES MEMBRANE + UNDERSTANDING
// ============================================================================
export default {
  Vitals: PulseVitals,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding
};
