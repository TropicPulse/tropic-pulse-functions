// ============================================================================
//  PULSE OS v9.2 — KERNEL ORGAN (BRAINSTEM)
//  Central Nervous System • Autonomic Boot • Nervous System Orchestrator
//  PURE BOOT. ZERO IQ. ZERO BACKEND. ZERO NETWORK.
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  -------------------
//  • The autonomic brainstem of PulseOS
//  • Boots the nervous system (PulseBand)
//  • Boots GPU + graphics engine
//  • Boots engine warmup
//  • Runs BEFORE the cortex and BEFORE any cognition
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not intelligent
//  • Not a router
//  • Not a decision-maker
//  • Not a backend organ
//  • Not a Firebase organ
//  • Not a network organ
//
//  ROLE IN THE DIGITAL BODY:
//  -------------------------
//  • Autonomic boot sequence
//  • Deterministic nervous-system initialization
//  • Drift-proof startup
//  • Provides ready-state to CNS Brain
//
// ============================================================================


// ============================================================================
//  0) ORGAN IDENTITY (PulseRole) — v9.2
// ============================================================================
export const PulseRole = {
  type: "Kernel",
  subsystem: "OS",
  layer: "Brainstem",
  version: "9.2",
  identity: "PulseOSKernel",

  evo: {
    deterministicBoot: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    zeroNetworkBoot: true
  }
};


// ============================================================================
//  1) ORIGIN — Logger (side-effect import ONLY)
//  This is required because BrainStem runs BEFORE the CNS Brain.
//  It wires global log/warn/error. No other imports allowed for logging.
// ============================================================================
import "../pulse-proxy/PulseProxyVitalsLogger.js";


// ============================================================================
//  2) NERVOUS SYSTEM — PulseBand (pure organ)
//  NOTE: PulseBand must honor zero-network boot when called from Kernel.
// ============================================================================
import { pulseband } from "../pulse-proxy/PulseProxyPNSNervousSystem.js";


// ============================================================================
//  INTERNAL STATE — Brainstem Vital Signs
// ============================================================================
const KernelState = {
  bootTs: null,
  ready: false,
  version: "9.2",
  organ: "PulseOSKernel",
  role: "Brainstem"
};


// Safe console-based logging (logger already wrapped console)
const log = console.log;
const error = console.error;


// ============================================================================
//  KERNEL BOOT SEQUENCE (v9.2)
//  PURE BOOT: no fetch, no Firebase, no backend, no network.
// ============================================================================
export async function PulseOSKernelBoot() {
  KernelState.bootTs = Date.now();
  log(
    "%c[PulseOSKernel] v9.2 — Boot sequence started",
    "color:#66BB6A; font-weight:bold;"
  );

  try {
    // ------------------------------------------------------------
    // 1. NERVOUS SYSTEM BOOT — Connectivity + GPU + Engine
    //    Must remain zero-network in this phase.
    // ------------------------------------------------------------
    if (typeof navigator !== "undefined") {
      // Browser-only connectivity inference (no network calls)
      pulseband.inferConnectivityFromBrowser?.();
    }

    await pulseband.initGraphics?.({
      textures: [],
      meshes: [],
      animations: [],
      shaders: [],
      scenes: []
    });

    await pulseband.initEngine?.();

    // ------------------------------------------------------------
    // 2. MARK READY
    // ------------------------------------------------------------
    KernelState.ready = true;
    log(
      "%c[PulseOSKernel] v9.2 — Boot complete",
      "color:#66BB6A; font-weight:bold;"
    );

    return KernelState;

  } catch (err) {
    error(
      "%c[PulseOSKernel] v9.2 — Kernel boot failure",
      "color:#EF5350; font-weight:bold;",
      err
    );
    throw err;
  }
}


// ============================================================================
//  KERNEL STATUS API
// ============================================================================
export const PulseOSKernel = {
  boot: PulseOSKernelBoot,
  state: KernelState,
  isReady: () => KernelState.ready,
  role: PulseRole
};


// ============================================================================
//  AUTO-BOOT ON IMPORT (Autonomic Brainstem)
//  Safe because it performs zero-network, zero-backend boot only.
// ============================================================================
PulseOSKernelBoot();
