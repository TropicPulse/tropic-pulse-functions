// ============================================================================
//  FILE: /apps/pulse-os/PulseOSBrainCortex.js
//  PULSE OS BRAIN v9.2 — CORTEX ORGAN
//  High‑Level Cognition • Shell Orchestration • Nervous System Supervisor
//  PURE FRONTEND INTELLIGENCE. NO IMPORTS. NO BACKEND. NO NETWORK CALLS.
// ============================================================================
//
//  IDENTITY — PULSE BRAIN (CORTEX) v9.2:
//  -------------------------------------
//  • The conscious layer of PulseOS (cortex).
//  • Interprets environment + identity into OS‑level understanding.
//  • Orchestrates shell state, PulseBand permission, and identity access.
//  • Sits behind the Outer BBB and above the Kernel (brainstem).
//  • Purely local: no backend, no TPProxy, no network dependency.
//  • Single source of truth for “what the OS thinks is happening”.
//
//  SAFETY CONTRACT (v9.2):
//  ------------------------
//  • No backend calls.
//  • No TPProxy usage.
//  • No DOM manipulation.
//  • No dynamic imports or eval.
//  • Pure, deterministic state transitions only.
//  • Local‑only cognition based on route + identity.
// ============================================================================

// ⭐ PulseRole — organism identity for CNS attachment
export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "Cortex",
  version: "9.2",
  identity: "PulseOSBrainCortex",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,

    // Conceptual compatibility (no logic impact)
    routingContract: "PulseSend-v9.2",
    osOrganContract: "PulseOS-v9.2",
    earnCompatibility: "PulseEarn-v9.2"
  }
};

// ============================================================================
//  FACTORY — ALL DEPENDENCIES ARE INJECTED BY THE CNS BRAIN
// ============================================================================
export function createPulseBrainCortex({
  SHELL_STATES,
  determineShellState,
  guardPulseBand,
  PulseKernel,
  getLocalIdentity,   // optional
  log                 // optional
}) {
  const BrainState = {
    bootTs: null,
    ready: false,
    routeName: null,
    hasIdentity: false,
    shellState: SHELL_STATES?.ANON_SHELL,
    allowPulseBand: true,
    allowIdentity: false
  };

  // ----------------------------------------------------------
  // Identity resolution (local-only, deterministic)
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Core cognition: interpret route + identity → shell + permissions
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // BOOT — Cortex comes online after Kernel readiness
  // ----------------------------------------------------------
  async function PulseBrainBoot(initialCtx = {}) {
    if (!BrainState.bootTs) {
      BrainState.bootTs = Date.now();
    }

    if (!PulseKernel.isReady()) {
      await PulseKernel.boot();
    }

    updateBrainFromContext({
      routeName: initialCtx.routeName || "main",
      hasIdentity: initialCtx.hasIdentity
    });

    BrainState.ready = true;
    log && log("[Cortex v9.2] Boot complete", { state: BrainState });
    return BrainState;
  }

  // ----------------------------------------------------------
  // UPDATE — Route or identity changed
  // ----------------------------------------------------------
  function PulseBrainUpdateContext(ctx = {}) {
    updateBrainFromContext({
      routeName: ctx.routeName ?? BrainState.routeName,
      hasIdentity: ctx.hasIdentity ?? BrainState.hasIdentity
    });
    return BrainState;
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    boot: PulseBrainBoot,
    updateContext: PulseBrainUpdateContext,
    state: BrainState,
    isReady: () => BrainState.ready
  };
}
