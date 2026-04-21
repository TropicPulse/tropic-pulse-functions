// ============================================================================
//  PULSE OS v9.1 — KERNEL ORGAN (BRAINSTEM)
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
//  1) ORIGIN — Logger (side-effect import ONLY)
//  This is required because BrainStem runs BEFORE the CNS Brain.
//  It wires global log/warn/error. No other imports allowed.
// ============================================================================
import "../pulse-proxy/PulseProxyVitalsLogger.js";


// ============================================================================
//  2) NERVOUS SYSTEM — PulseBand (pure organ)
// ============================================================================
import { pulseband } from "../pulse-proxy/PulseProxyNervousSystem.js";


// ============================================================================
//  INTERNAL STATE — Brainstem Vital Signs
// ============================================================================
const KernelState = {
  bootTs: null,
  ready: false,
  version: "9.1",
  organ: "PulseOSKernel",
  role: "Brainstem"
};


// ============================================================================
//  KERNEL BOOT SEQUENCE (v9.1)
// ============================================================================
export async function PulseOSKernelBoot() {
  KernelState.bootTs = Date.now();
  log("identity", "PulseOSKernel v9.1 — Boot sequence started");

  try {
    // ------------------------------------------------------------
    // 1. NERVOUS SYSTEM BOOT — Connectivity + GPU + Engine
    // ------------------------------------------------------------
    if (typeof navigator !== "undefined") {
      pulseband.inferConnectivityFromBrowser();
    }

    await pulseband.initGraphics({
      textures: [],
      meshes: [],
      animations: [],
      shaders: [],
      scenes: []
    });

    await pulseband.initEngine();

    // ------------------------------------------------------------
    // 2. MARK READY
    // ------------------------------------------------------------
    KernelState.ready = true;
    log("identity", "PulseOSKernel v9.1 — Boot complete");

    return KernelState;

  } catch (err) {
    error("identity", "PulseOSKernel v9.1 — Kernel boot failure", err);
    throw err;
  }
}


// ============================================================================
//  KERNEL STATUS API
// ============================================================================
export const PulseOSKernel = {
  boot: PulseOSKernelBoot,
  state: KernelState,
  isReady: () => KernelState.ready
};


// ============================================================================
//  AUTO-BOOT ON IMPORT
// ============================================================================
PulseOSKernelBoot();
