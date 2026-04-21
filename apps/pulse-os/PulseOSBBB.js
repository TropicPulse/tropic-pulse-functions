// ============================================================================
//  PULSE OS v9.2 — OUTER BLOOD–BRAIN BARRIER (BBB)
//  Perivascular Shield • Shell Gatekeeper • Environmental Filter
//  PURE PERMISSION. NO BACKEND. NO NETWORK. NO UI.
// ============================================================================
//
//  IDENTITY — OUTER BBB (v9.2):
//  ----------------------------
//  • First defensive membrane of the PulseOS organism.
//  • Filters environmental context before it reaches the cortex (PulseBrain).
//  • Determines whether PulseBand (nervous system) may exist on this route.
//  • Distinguishes SAFE vs UNSAFE environments.
//  • Blocks identity access unless conditions are met.
//  • Protects the inner BBB (Identity Organ) from contamination.
//  • Fully LOCAL-FIRST — zero backend, zero network dependency.
//  • Drift-proof, deterministic, offline-capable.
//  • Pure shell-state engine — no side effects.
//
//  ROLE IN THE DIGITAL BODY (v9.2):
//  --------------------------------
//  • Environmental Filter → Screens unsafe routes.
//  • Shell Gatekeeper → Controls PulseBand existence.
//  • Identity Sentinel → Blocks unauthorized identity flow.
//  • Permission Valve → Determines anon/auth/no-shell modes.
//  • Cortex Perimeter → Protects PulseBrain + Identity Organ.
//  • Offline Autonomy → Works even with WiFi OFF.
//  • **Outer BBB = Shell Permission + Trust Boundary**.
//
//  WHAT THIS FILE IS (v9.2):
//  --------------------------
//  • Global shell boundary for PulseOS.
//  • Single source of truth for shell state.
//  • Permission engine for PulseBand existence.
//  • Identity-access gate for the frontend layer.
//  • Environmental classifier for all routes.
//  • First line of defense in the trust chain.
//  • Fully local — no backend calls required.
//  • Pure logic — no side effects, no mutations.
//
//  WHAT THIS FILE IS NOT (v9.2):
//  ------------------------------
//  • NOT a backend module.
//  • NOT an identity loader.
//  • NOT a UI renderer.
//  • NOT a healing engine.
//  • NOT a session validator.
//  • NOT a compute engine.
//  • NOT a place for dynamic imports or eval.
//  • NOT dependent on network state.
//  • NOT allowed to mutate identity or memory.
//
//  SAFETY CONTRACT (v9.2):
//  ------------------------
//  • No backend calls.
//  • No identity mutation.
//  • No UI logic.
//  • No compute.
//  • No dynamic imports.
//  • Deterministic, drift-proof shell-state behavior only.
//  • Local-only permission logic.
//  • Offline continuity guaranteed.
//  • Pure function purity — no side effects.
// ============================================================================


// ============================================================================
//  FACTORY — ALL DEPENDENCIES ARE INJECTED BY THE CNS BRAIN
//  (BBB MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseOSBBB({ log }) {

  // ========================================================================
  //  SHELL STATE ENUM (v9.2)
  // ========================================================================
  const SHELL_STATES = {
    NO_SHELL:  "no-shell",     // PulseBand forbidden
    ANON_SHELL:"anon-shell",   // PulseBand allowed, identity blocked
    AUTH_SHELL:"auth-shell"    // PulseBand + identity allowed
  };

  // ========================================================================
  //  ROUTE CLASSIFICATION (v9.2)
  //  Pure local classification of environment → SAFE / UNSAFE
  // ========================================================================
  const HARD_NO_SHELL_ROUTES = new Set([
    "login",
    "404",
    "expired",
    "maintenance",
    "offline",
    "fatal",
    "panic"
  ]);

  const ANON_SHELL_ROUTES = new Set([
    "main",
    "landing",
    "marketing",
    "moat",
    "public",
    "welcome"
  ]);

  // ========================================================================
  //  determineShellState (v9.2)
  //  Pure, deterministic, local-first shell-state engine.
  // ========================================================================
  function determineShellState({ routeName, hasIdentity }) {
    const route = (routeName || "").toLowerCase();

    // 1. Hard NO_SHELL routes — PulseBand forbidden
    if (HARD_NO_SHELL_ROUTES.has(route)) {
      return SHELL_STATES.NO_SHELL;
    }

    // 2. ANON_SHELL routes — PulseBand allowed, identity blocked
    if (ANON_SHELL_ROUTES.has(route)) {
      return SHELL_STATES.ANON_SHELL;
    }

    // 3. AUTH_SHELL routes — PulseBand + identity allowed
    if (hasIdentity) {
      return SHELL_STATES.AUTH_SHELL;
    }

    // 4. Fallback — anon-shell by default
    return SHELL_STATES.ANON_SHELL;
  }

  // ========================================================================
  //  guardPulseBand (v9.2)
  //  Convenience helper for PulseBand + connectors.
  // ========================================================================
  function guardPulseBand(ctx) {
    const shellState = determineShellState(ctx);

    return {
      shellState,
      allowPulseBand:
        shellState === SHELL_STATES.ANON_SHELL ||
        shellState === SHELL_STATES.AUTH_SHELL,

      allowIdentity:
        shellState === SHELL_STATES.AUTH_SHELL
    };
  }

  // ========================================================================
  //  PUBLIC BBB INTERFACE (v9.2)
  // ========================================================================
  return {
    SHELL_STATES,
    determineShellState,
    guardPulseBand
  };
}
