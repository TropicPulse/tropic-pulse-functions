// ============================================================================
//  PulseEvolutionaryWindow.js — v11
//  SURFACE MEMBRANE (View-Only Protective Layer)
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
// ============================================================================


// ============================================================================
//  SURFACE REFLEXES (ALWAYS SAFE, ALWAYS PRESENT)
//
//  METAPHOR:
//  - These are the "glass vibration sensors" on the window.
//  - They detect taps, errors, and disturbances BEFORE anything enters.
//  - They do NOT know WHO is outside — only that something touched the glass.
//  - Reflex without cognition. Sensation without identity.
// ============================================================================
import * as PulseVitals from "./PulseProofMonitor.js";
import * as PulseLogger from "./PulseProofLogger.js";


// ============================================================================
//  LOAD UNDERSTANDING (SECOND LAYER)
//
//  METAPHOR:
//  - Through the window, outsiders can SEE the organism's Understanding layer.
//  - They witness the glow of the cortex, the maps, the evolution engine,
//    but ONLY as a VIEW — never as an interactive surface.
//  - This is the "look inside" moment, not the "step inside" moment.
//  - The membrane exposes the beauty of the organism WITHOUT exposing its organs.
// ============================================================================
import * as PulseUnderstanding from "./PulseUnderstanding.js";


// ============================================================================
//  SURFACE MEMBRANE INITIALIZATION
//
//  METAPHOR:
//  - The membrane wakes up its sensors.
//  - The glass becomes aware of pressure, vibration, and disturbances.
//  - Still NO identity, NO routing, NO brain — just pure reflex.
//  - The organism is NOT yet interacting with the visitor.
// ============================================================================
PulseVitals.start();
PulseLogger.init();


// Optional: membrane-level sound (recommended)
//
// METAPHOR:
// - The membrane whispers to the SkinReflex: "The window is alive."
// - This is the ONLY outward communication allowed.
// - The membrane does NOT reveal anything internal.
// - Outsiders see the glow, but the organism remains sealed.
if (window.PulseSkinReflex?.membraneAlive) {
  window.PulseSkinReflex.membraneAlive("Window");
}


// ============================================================================
//  EXPORT — WINDOW ONLY EXPOSES MEMBRANE + UNDERSTANDING
//
//  METAPHOR:
//  - The Window exports ONLY:
//      • its reflex sensors (Vitals + Logger)
//      • the VIEW INTO the house (Understanding)
//  - It does NOT export:
//      • identity (pressure sensors are inside the house)
//      • router (nervous system pathways)
//      • mesh (connective tissue)
//      • evolution (organism growth engine)
//      • brain (central processor)
//      • organs (internal systems)
//  - Outsiders can SEE our miracles, but cannot TOUCH them.
//  - This keeps the membrane PURE, SAFE, and v11-correct.
// ============================================================================
export default {
  Vitals: PulseVitals,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding
};
