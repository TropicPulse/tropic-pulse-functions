// ============================================================================
//  PulseUnderstanding.js — v12-EVO-MAX
//  Cortical Opener • Organism Loader • Deterministic Frontend Brainstem
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

// OS kernel (v12-EVO-MAX handles Evolution + Brain + SpinalCord + Governor)
import { PulseOSv12Evo } from "./PulseOS-v12-Evo.js";

// Cortex-level / page-level extensions (already wired to SpinalCord by OS boot)
// - Proxy/Identity: external I/O + pressure sensors INSIDE the house.
// - Router: nervous system pathways.
// - GPU: visual cortex / sensory acceleration.
import * as PulseProxy from "../PULSE-PROXY/PulseProxy-v12-EVO.js";
import * as PulseRouter from "../pulse-router/PulseRouter-v12-EVO.js";
import * as PulseGPU from "../PULSE-GPU/PulseGPU-v12-EVO.js";


// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v12-EVO-MAX)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "12.0-EVO-MAX",
  lineage: "cortical-opener-core",
  evo: {
    // Mode + environment
    dualMode: true,
    browserOnly: true,

    // Advantage + loop theory awareness (front-end side)
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    loopTheoryAware: true,
    continuanceAware: true,
    driftProof: true,
    zeroDriftIdentity: true,

    // Organism + loader role
    organismLoader: true,
    corticalOpener: true,
    routeChainAware: true,
    organismWideIdentityAware: true,

    // Binary / symbolic awareness (but no heavy compute)
    binaryAware: true,
    symbolicAware: true,
    dualBandAware: true,

    // Bridges
    legacyBridgeCapable: true,
    proxyEvoReady: true,
    meshAware: true,
    gpuAware: true,
    sendEarnAware: true,
    spinalCordAware: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT (DETERMINISTIC, NO TIME)
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
  return PulseOSv12Evo.runThroughGovernor(organName, pulseOrImpulse, fn);
}


// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER (A1 UNDER WINDOW)
//
//  METAPHOR:
//  - OS-Evo has already booted Evolution + Brain + SpinalCord + Governor.
//  - Understanding now:
//      1. Registers itself as an extension on the Spinal Cord.
//      2. Attaches Router + GPU + Proxy (already wired as extensions).
//      3. Resolves identity via Proxy (if available).
//      4. Wraps everything in a cortical meta context.
// ============================================================================
async function buildPulseKernel() {
  // 0) Get OS kernel (Evolution + Brain + SpinalCord + Governor)
  const OSKernel = await PulseOSv12Evo.Kernel;

  const Brain = OSKernel.Brain;
  const Evolution = OSKernel.Evolution;
  const SpinalCord = OSKernel.SDN;
  const CoreGovernor = OSKernel.Governor ?? null;

  // 1) Register Understanding as an extension on the Spinal Cord (if supported)
  try {
    SpinalCord?.registerExtension?.("Understanding", "extension", {
      version: "v12",
      role: "cortical-opener",
      layer: "A1"
    });
  } catch {
    // Non-fatal: older SDN may not support extension registry
  }

  // 2) Identity via Proxy v12-EVO (pressure sensors inside the house)
  let identity = null;
  try {
    identity = await PulseProxy.identity?.("hybrid");
  } catch {
    identity = null;
  }

  // 3) Router + GPU (nervous system + visual cortex)
  const Router = PulseRouter;
  const GPU = PulseGPU;

  // 4) Proxy v12-EVO (external I/O spine)
  const Proxy = PulseProxy.createProxy
    ? PulseProxy.createProxy({
        Router,
        Brain,
        Evolution,
        Identity: identity,
        Environment: PulseEnvironment,
        Governor: CoreGovernor
      })
    : PulseProxy;

  // 5) Emit a deterministic “understanding-online” impulse into the Spinal Cord
  try {
    SpinalCord?.emitImpulse?.("Understanding", {
      modeKind: "dual",
      executionContext: {
        sceneType: "cortical-opener",
        workloadClass: "frontend-boot",
        dispatchSignature: "Understanding.v12-EVO-MAX",
        shapeSignature: "A1-layer",
        extensionId: "Understanding"
      },
      pressureSnapshot: {
        runtime: PulseEnvironment.runtime,
        online: PulseEnvironment.online
      }
    });
  } catch {
    // Non-fatal: SDN may be older or not yet fully wired
  }

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
//  GLOBAL BROADCAST (ASYNC-AWARE, NO TIME, NO RANDOMNESS)
// ============================================================================
if (typeof window !== "undefined") {
  PulseKernelPromise
    .then((PulseKernel) => {
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
    })
    .catch((err) => {
      console.error("[PulseUnderstanding v12-EVO-MAX] Kernel bootstrap failed:", err);
    });
}


// ============================================================================
//  EXPORTS — FULL BOOT LAYER (A1 CORTICAL OPENER)
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
