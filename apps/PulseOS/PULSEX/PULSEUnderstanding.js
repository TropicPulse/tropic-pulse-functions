// ============================================================================
//  PulseUnderstanding.js — v11-EVO
//  Cortical Opener • Kernel Boot • Deterministic Frontend Brainstem
//
//  METAPHOR:
//  - The user has just stepped *through the window* (PulseEvolutionaryWindow).
//  - Now they are *inside the house*, where real sensing and cognition begin.
//  - This layer is the CORTEX OPENING: the moment the organism becomes aware.
// ============================================================================


// ============================================================================
//  IMPORTS — MAPS + OS KERNEL (DOWNSTREAM OF WINDOW MEMBRANE)
// ============================================================================
import { PulseIntentMap } from "../PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "../PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "../PULSE-OS/PulseIQMap.js";

// OS kernel (v11-EVO handles Evolution + Brain + SpinalCord + Governor)
import { PulseOSv11Evo } from "./PulseOS-v11-Evo.js";

// Cortex-level / page-level organs
// - Proxy/Identity: external I/O + pressure sensors INSIDE the house.
// - Router: nervous system pathways.
// - GPU: visual cortex / sensory acceleration.
import * as PulseProxy from "../PULSE-PROXY/PulseProxy-v11-EVO.js";
import * as PulseRouter from "../pulse-router/PulseRouter-v11-EVO.js";
import * as PulseGPU from "../PULSE-GPU/PulseGPU-v11-EVO.js";


// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v11-EVO)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "11.0-EVO",
  lineage: "cortical-opener-core",
  evo: {
    dualMode: true,
    browserOnly: true,
    advantageCascadeAware: true,
    driftProof: true,
    unifiedAdvantageField: true,
    organismLoader: true,
    cognitiveBootstrap: false,
    zeroDriftIdentity: true,
    continuanceAware: true,
    legacyBridgeCapable: true,
    proxyEvoReady: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT
// ============================================================================
function buildEnvironmentSnapshot() {
  if (typeof window === "undefined") {
    return {
      runtime: "node-like",
      userAgent: null,
      language: null,
      online: null,
      platform: null
    };
  }

  return {
    runtime: "browser",
    userAgent: window.navigator?.userAgent || null,
    language: window.navigator?.language || null,
    online: window.navigator?.onLine ?? null,
    platform: window.navigator?.platform || null
  };
}

const PulseEnvironment = buildEnvironmentSnapshot();


// ============================================================================
//  GOVERNED EXECUTION — DELEGATE TO OS KERNEL GOVERNOR
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  // Delegate to OS-level governor so all runs share the same guard pattern
  return PulseOSv11Evo.runThroughGovernor(organName, pulseOrImpulse, fn);
}


// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER
//
//  METAPHOR:
//  - OS-Evo has already booted Evolution + Brain + SpinalCord + Governor.
//  - Understanding now:
//      1. Attaches Router + GPU.
//      2. Attaches Proxy v11-EVO (external I/O spine).
//      3. Wraps everything in a cortical meta context.
// ============================================================================
async function buildPulseKernel() {
  // 0) Get OS kernel (Evolution + Brain + SpinalCord + Governor)
  const OSKernel = await PulseOSv11Evo.Kernel;

  const Brain = OSKernel.Brain;
  const Evolution = OSKernel.Evolution;
  const SpinalCord = OSKernel.SDN;

  // 1) Identity via Proxy v11-EVO (pressure sensors inside the house)
  let identity = null;
  try {
    identity = await PulseProxy.identity?.("hybrid");
  } catch {
    identity = null;
  }

  // 2) Router + GPU (nervous system + visual cortex)
  const Router = PulseRouter;
  const GPU = PulseGPU;

  // 3) Proxy v11-EVO (external I/O spine)
  const Proxy = PulseProxy.createProxy
    ? PulseProxy.createProxy({
        Router,
        Brain,
        Evolution,
        Identity: identity,
        Environment: PulseEnvironment
      })
    : PulseProxy;

  const meta = {
    ...PULSE_UNDERSTANDING_CONTEXT,
    identity,
    environment: PulseEnvironment
  };

  const Pulse = {
    meta,
    Identity: identity,
    Environment: PulseEnvironment,

    Brain,
    Evolution,
    Router,
    GPU,
    SDN: SpinalCord,
    Proxy,

    Governed: {
      run: runThroughGovernor
    }
  };

  return Pulse;
}

const PulseKernelPromise = buildPulseKernel();


// ============================================================================
//  GLOBAL BROADCAST (ASYNC-AWARE)
// ============================================================================
if (typeof window !== "undefined") {
  PulseKernelPromise.then((PulseKernel) => {
    window.Pulse = window.Pulse
      ? {
          ...window.Pulse,
          meta: PulseKernel.meta,
          Brain: PulseKernel.Brain,
          Evolution: PulseKernel.Evolution,
          Router: PulseKernel.Router,
          GPU: PulseKernel.GPU,
          SDN: PulseKernel.SDN,
          Proxy: PulseKernel.Proxy,
          Governed: PulseKernel.Governed,
          Environment: PulseKernel.Environment,
          Identity: PulseKernel.Identity
        }
      : PulseKernel;
  }).catch((err) => {
    console.error("[PulseUnderstanding] Kernel bootstrap failed:", err);
  });
}


// ============================================================================
//  EXPORTS — FULL BOOT LAYER
// ============================================================================
export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Environment: PulseEnvironment,
  IntentMap: PulseIntentMap,
  OrganismMap: PulseOrganismMap,
  IQMap: PulseIQMap,
  Kernel: PulseKernelPromise,
  Identity: () =>
    typeof window !== "undefined" ? window?.Pulse?.Identity ?? null : null,
  runThroughGovernor
};

export default PulseUnderstanding;
