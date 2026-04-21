// ============================================================================
//  FILE: /apps/pulse-os/PulseOSBrainCortex.js
//  PULSE OS BRAIN v9.0 — CORTEX ORGAN
//  High‑Level Cognition • Shell Orchestration • Nervous System Supervisor
//  PURE FRONTEND INTELLIGENCE. NO BACKEND. NO NETWORK CALLS.
// ============================================================================
//
//  IDENTITY — PULSE BRAIN (CORTEX) v9.0:
//  -------------------------------------
//  • The conscious layer of PulseOS (cortex).
//  • Interprets environment + identity into OS‑level understanding.
//  • Orchestrates shell state, PulseBand permission, and identity access.
//  • Sits behind the Outer BBB and above the Kernel (brainstem).
//  • Purely local: no backend, no TPProxy, no network dependency.
//  • Single source of truth for “what the OS thinks is happening”.
//
//  ROLE IN THE DIGITAL BODY (v9.0):
//  --------------------------------
//  • Cortex → High‑level interpretation of route + identity.
//  • Shell Orchestrator → Decides NO_SHELL / ANON_SHELL / AUTH_SHELL.
//  • Nervous System Supervisor → Tells PulseBand whether it may exist.
//  • Identity Gate Collaborator → Works with Identity Organ (inner BBB).
//  • Kernel Consumer → Waits for PulseOSKernel to be ready, then thinks.
//  • Offline‑First Cognition → Works with or without network.
//
//  WHAT THIS FILE IS (v9.0):
//  --------------------------
//  • The PulseOS “brain” (cortex) for the frontend layer.
//  • The place where shell + identity + environment are understood.
//  • The coordinator between BBB, Kernel, and the rest of the OS.
//  • A pure logic organ: no DOM, no backend, no side‑effects beyond state.
//
//  WHAT THIS FILE IS NOT (v9.0):
//  ------------------------------
//  • NOT a backend module.
//  • NOT a UI renderer.
//  • NOT a network client.
//  • NOT a healing engine.
//  • NOT a place for dynamic eval.
//  • NOT responsible for GPU or engine boot (that’s the Kernel).
//
//  SAFETY CONTRACT (v9.0):
//  ------------------------
//  • No backend calls.
//  • No TPProxy usage.
//  • No DOM manipulation.
//  • No dynamic imports or eval.
//  • Pure, deterministic state transitions only.
//  • Local‑only cognition based on route + identity.
// ============================================================================
// ============================================================================
//  FILE: /apps/pulse-os/PulseOSBrainCortex.js
//  PULSE OS BRAIN v9.1 — CORTEX ORGAN
//  High‑Level Cognition • Shell Orchestration • Nervous System Supervisor
//  PURE FRONTEND INTELLIGENCE. NO IMPORTS. NO BACKEND. NO NETWORK CALLS.
// ============================================================================

// ⭐ PulseRole — so the organism can recognize this cortex organ
export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "Cortex",
  version: "9.1",
  identity: "PulseOSBrainCortex"
};

// ============================================================================
//  FACTORY — ALL DEPENDENCIES ARE INJECTED BY THE CNS BRAIN
// ============================================================================
export function createPulseBrainCortex({
  SHELL_STATES,
  determineShellState,
  guardPulseBand,
  PulseOSKernel,
  getLocalIdentity,   // optional, may be null/undefined
  log
}) {
  const BrainState = {
    bootTs: null,
    ready: false,
    routeName: null,
    hasIdentity: false,
    shellState: SHELL_STATES.ANON_SHELL,
    allowPulseBand: true,
    allowIdentity: false
  };

  function computeIdentityFlag(explicitHasIdentity) {
    if (typeof explicitHasIdentity === "boolean") {
      return explicitHasIdentity;
    }
    if (typeof getLocalIdentity === "function") {
      try {
        const id = getLocalIdentity();
        return !!id;
      } catch {
        return false;
      }
    }
    return false;
  }

  function updateBrainFromContext({ routeName, hasIdentity }) {
    const route = routeName || "";
    const identityFlag = computeIdentityFlag(hasIdentity);

    const shellState = determineShellState({
      routeName: route,
      hasIdentity: identityFlag
    });

    const { allowPulseBand, allowIdentity } = guardPulseBand({
      routeName: route,
      hasIdentity: identityFlag
    });

    BrainState.routeName = route;
    BrainState.hasIdentity = identityFlag;
    BrainState.shellState = shellState;
    BrainState.allowPulseBand = allowPulseBand;
    BrainState.allowIdentity = allowIdentity;
  }

  async function PulseBrainBoot(initialCtx = {}) {
    if (!BrainState.bootTs) {
      BrainState.bootTs = Date.now();
    }

    if (!PulseOSKernel.isReady()) {
      await PulseOSKernel.boot();
    }

    updateBrainFromContext({
      routeName: initialCtx.routeName || "main",
      hasIdentity: initialCtx.hasIdentity
    });

    BrainState.ready = true;
    log && log("[Cortex] Boot complete", { state: BrainState });
    return BrainState;
  }

  function PulseBrainUpdateContext(ctx = {}) {
    updateBrainFromContext({
      routeName: ctx.routeName ?? BrainState.routeName,
      hasIdentity: ctx.hasIdentity ?? BrainState.hasIdentity
    });
    return BrainState;
  }

  return {
    boot: PulseBrainBoot,
    updateContext: PulseBrainUpdateContext,
    state: BrainState,
    isReady: () => BrainState.ready
  };
}
