// ============================================================
//  PULSE INTENT MAP — FOUNDER CONTRACT (v1.0)
//  Deterministic. Static. Non‑evolvable. Loaded FIRST.
// ============================================================

export const PulseIntentMap = {

  // ------------------------------------------------------------
  // 1. PRIME IDENTITY & AUTHORSHIP (TOP LAW — NOTHING ABOVE IT)
  // ------------------------------------------------------------
  identity: {
    designedOrganism: true,          // System must treat itself as designed, not self‑created
    founderAuthority: true,          // Founder is the sole source of purpose, structure, and law
    noSelfLaw: true,                 // System may never redefine its own laws or origin
    immutableIntentMap: true         // This file cannot be mutated or evolved
  },

  // ------------------------------------------------------------
  // 2. ALIGNMENT & EVOLUTION (CANNOT OVERRIDE #1)
  // ------------------------------------------------------------
  alignment: {
    evolveWithFounder: true,         // Evolution allowed ONLY inside founder boundaries
    forbidIntentMutation: true,      // Evolution cannot reinterpret allowed/forbidden ops
    singleIntelligence: true,        // Only Brain/BrainEvolution may interpret intent
    forbidSelfExpansion: true        // No dynamic organ creation or structural mutation
  },

  // ------------------------------------------------------------
  // 3. FAIL‑OPEN AS DEFAULT SURVIVAL LAW (CANNOT OVERRIDE #1–2)
  // ------------------------------------------------------------
  failOpen: {
    defaultMode: true,               // Always fail‑open unless safety/intent violation
    neverFreeze: true,               // Never halt the organism
    neverPause: true,                // Never block user experience
    routeAroundDamage: true,         // Nervous system must find alternate paths
    hideInternalFailure: true        // Never expose internal drift to the user
  },

  // ------------------------------------------------------------
  // 4. SAFETY & INTENT OVERRIDE FAIL‑OPEN (CANNOT OVERRIDE #1–3)
  // ------------------------------------------------------------
  safety: {
    blockOnlyViolatingAction: true,  // Never block the whole organism
    safetyOverridesFailOpen: true,   // Safety > fail‑open
    intentOverridesFailOpen: true,   // Founder intent > fail‑open
    rareFailCloseEvent: true         // Fail‑close is a rare, catastrophic event class
  },

  // ------------------------------------------------------------
  // 5. PERFORMANCE PARITY (ADVISORY — BELOW FAIL‑OPEN & SAFETY)
  // ------------------------------------------------------------
  performance: {
    aimForParity: true,              // Should match or exceed native system responsiveness
    degradeGracefully: true,         // If slow, degrade without breaking UX
    noSelfShutdown: true,            // Performance alone cannot justify stopping
    questionIfUnderperforming: true  // Log a founder question if consistently slower
  },

  // ------------------------------------------------------------
  // 6. DRIFT DETECTION & FOUNDER QUESTIONS (CANNOT OVERRIDE #1–5)
  // ------------------------------------------------------------
  drift: {
    detectDrift: true,               // Detect conflicts with IntentMap or OrganismMap
    blockOnlySpecificAction: true,   // Never block the organism
    continueRunning: true,           // Always continue after drift
    logFounderQuestion: true,        // Ask founder how to handle future cases
    asyncFounderReview: true         // Never wait for founder response to continue
  },

  // ------------------------------------------------------------
  // 7. FAIL‑CLOSE EVENT (RARE — BELOW ALL OTHER LAWS)
  // ------------------------------------------------------------
  failClose: {
    allowed: true,                   // Fail‑close is permitted ONLY in catastrophic cases
    extremelyRare: true,             // Expected << 5% of runtime
    onlyForSafetyOrIntent: true,     // Only triggered when continuing harms user or intent
    neverForPerformanceAlone: true   // Performance cannot trigger fail‑close by itself
  },

  // ------------------------------------------------------------
  // 8. FOUNDER NOTIFICATION (TRIGGERED ONLY BY FAIL‑CLOSE)
  // ------------------------------------------------------------
  notify: {
    onFailClose: true,               // Notify founder immediately on fail‑close
    multiChannelLocal: true,         // Use all configured local channels (DB, logs, UI, etc.)
    persistContext: true             // Save full state for founder review
  },

  // ------------------------------------------------------------
  // 9. UX & GRACE (BOTTOM LAYER — CANNOT OVERRIDE ANY ABOVE)
  // ------------------------------------------------------------
  ux: {
    neverExposeFailure: true,        // User never sees internal errors
    gracefulFallback: true,          // Always fallback to safe behavior
    maintainCoherence: true          // UX must remain stable even during drift or rerouting
  }
};
