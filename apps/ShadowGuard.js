// ======================================================
//  PULSE OS v6.3 — THE BLOOD–BRAIN BARRIER (OUTER LAYER)
//  Perivascular Shield • Shell Gatekeeper • Environmental Filter
//  PURE PERMISSION. NO IDENTITY. NO BACKEND. NO UI.
// ======================================================
//
// IDENTITY — OUTER BBB (PERIVASCULAR SHIELD):
//  -------------------------------------------
//  • The outer defensive membrane of the PulseOS shell.
//  • Filters environmental context before it reaches the cortex.
//  • Determines whether the shell may exist in the current route.
//  • Distinguishes SAFE vs UNSAFE environments for PulseBand.
//  • Blocks identity access unless conditions are met.
//  • Protects the inner BBB (Identity Organ) from contamination.
//  • The first gate in the OS trust hierarchy.
//
// ROLE IN THE DIGITAL BODY:
//  --------------------------
//  • Environmental Filter → Screens unsafe routes
//  • Shell Gatekeeper → Controls PulseBand existence
//  • Identity Sentinel → Blocks unauthorized identity flow
//  • Permission Valve → Determines anon/auth/no-shell modes
//  • Cortex Perimeter → Protects the inner identity layer
//  • **Outer BBB → Shell Permission + Trust Boundary**
//
// WHAT THIS FILE IS:
//  -------------------
//  • The global shell boundary for PulseOS.
//  • The single source of truth for shell state.
//  • The permission engine for PulseBand existence.
//  • The identity-access gate for the frontend layer.
//  • The environmental classifier for all routes.
//  • The first line of defense in the trust chain.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a backend module.
//  • NOT an identity loader.
//  • NOT a UI renderer.
//  • NOT a healing engine.
//  • NOT a session validator.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No backend calls.
//  • No identity mutation.
//  • No UI logic.
//  • No compute.
//  • No dynamic imports.
//  • Deterministic, drift-proof shell-state behavior only.
//
// ======================================================
//  SHELL STATE ENGINE — Outer BBB Permission Logic
// ======================================================


export const SHELL_STATES = {
  NO_SHELL: 'no-shell',
  ANON_SHELL: 'anon-shell',
  AUTH_SHELL: 'auth-shell',
};

/**
 * determineShellState
 *
 * A → B → A
 * A: Input intent (route + identity presence)
 * B: Guard logic
 * A: Stable shell state for the rest of the OS
 *
 * @param {Object} ctx
 * @param {string} ctx.routeName   - Logical route key (e.g. 'login', 'main', 'dashboard')
 * @param {boolean} ctx.hasIdentity - Whether a valid identity/session is present
 * @returns {string} one of SHELL_STATES
 */
export function determineShellState({ routeName, hasIdentity }) {
  // SECTION A — Intent: classify route
  const route = (routeName || '').toLowerCase();

  // SECTION B — Guard logic
  // 1. Hard NO_SHELL routes (never show PulseBand)
  if (
    route === 'login' ||
    route === '404' ||
    route === 'expired' ||
    route === 'maintenance' ||
    route === 'offline'
  ) {
    return SHELL_STATES.NO_SHELL;
  }

  // 2. ANON_SHELL routes (PulseBand allowed, no identity)
  if (route === 'main' || route === 'landing' || route === 'marketing' || route === 'moat') {
    // Even if identity is present, this environment treats PulseBand as anon.
    return SHELL_STATES.ANON_SHELL;
  }

  // 3. AUTH_SHELL routes (PulseBand + identity allowed)
  // Any route that is part of the real app shell.
  if (hasIdentity) {
    return SHELL_STATES.AUTH_SHELL;
  }

  // 4. Fallback: if we reach here with no identity, be conservative.
  return SHELL_STATES.ANON_SHELL;
}

/**
 * guardPulseBand
 *
 * Convenience helper for PulseBand + connectors.
 *
 * @param {Object} ctx
 * @returns {{ shellState: string, allowPulseBand: boolean, allowIdentity: boolean }}
 */
export function guardPulseBand(ctx) {
  const shellState = determineShellState(ctx);

  const allowPulseBand =
    shellState === SHELL_STATES.ANON_SHELL || shellState === SHELL_STATES.AUTH_SHELL;

  const allowIdentity = shellState === SHELL_STATES.AUTH_SHELL;

  return {
    shellState,
    allowPulseBand,
    allowIdentity,
  };
}
