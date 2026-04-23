// ============================================================================
//  PulseUnderstanding.js — v11
//  Cortical Opener • Kernel Boot • Deterministic Frontend Brainstem
//
//  METAPHOR:
//  - The user has just stepped *through the window* (PulseEvolutionaryWindow).
//  - Now they are *inside the house*, where real sensing and cognition begin.
//  - This layer is the CORTEX OPENING: the moment the organism becomes aware.
// ============================================================================


// ============================================================================
//  IMPORTS — OS BOOT + MAPS (DOWNSTREAM OF WINDOW MEMBRANE)
//
//  METAPHOR:
//  - These are the "house blueprints" and "neural maps" the cortex uses
//    to understand what the organism *is* and how it should behave.
// ============================================================================
import { PulseIntentMap } from "./PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "./PULSE-OS/PulseIQMap.js";

// Governor (frontend AI wrapper)
// METAPHOR: The "house rules" — nothing inside runs without supervision.
import { withOrganGuard } from "./PULSE-OS/PulseOSGovernor.js";

// OS-level organs (top-layer boot)
// METAPHOR:
// - Identity: pressure sensors INSIDE the house (not outside).
// - Brain: the central processor.
// - Evolution: the organism's growth engine.
// - SpinalCord: wiring between brain and body.
// - Router: nervous system pathways.
// - GPU: visual cortex / sensory acceleration.
import * as PulseIdentity from "./PULSE-PROXY/PulseProxyBBB.js";
import * as PulseOSBrain from "./PULSE-OS/PulseOSBrain.js";
import * as PulseOSEvolution from "./PULSE-OS/PulseOSBrainEvolution.js";
import * as PulseSpinalCord from "./PULSE-OS/PulseOSSpinalCord.js";
import * as PulseRouter from "./pulse-router/PulseRouter-v10.4.js";
import * as PulseGPU from "./pulse-gpu/PulseGPU-v10.4.js";


// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v11)
//
//  METAPHOR:
//  - This is the "room you just walked into" — the cortex's self-description.
//  - Understanding knows WHAT it is and WHY it exists.
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "11.0",
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
    legacyBridgeCapable: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT
//
//  METAPHOR:
//  - The cortex looks around the room: "Where am I? What environment am I in?"
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
//  GOVERNED EXECUTION — FRONTEND AI LOGGING WRAPPER
//
//  METAPHOR:
//  - Every organ action inside the house is logged by the "security cameras".
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  return withOrganGuard(organName, pulseOrImpulse, async (instanceContext) => {
    const result = await fn(instanceContext);

    try {
      const timestamp = Date.now();
      const docId = `${organName}-${timestamp}`;

      const safe = {
        organ: organName,
        timestamp,
        personaId: instanceContext.personaId || null,
        boundaries: instanceContext.boundaries || null,
        permissions: instanceContext.permissions || null,
        trace: [...(instanceContext.trace || [])],
        diagnostics: instanceContext.diagnostics || null,
        result
      };

      await instanceContext?.organs?.diagnosticsWrite?.writeRun({
        docId,
        payload: safe
      });
    } catch (err) {
      console.warn("[PulseUnderstanding] AI_LOGS write failed:", err);
    }

    return result;
  });
}


// ============================================================================
//  KERNEL BOOTSTRAP — FULL OS BOOT FROM UNDERSTANDING
//
//  METAPHOR:
//  - This is the moment the house "wakes up":
//      1. Pressure sensors activate (Identity check).
//      2. The organism grows its brain (Evolution).
//      3. The brain comes online (Brain).
//      4. Nervous system wiring connects (SpinalCord).
//      5. Pathways activate (Router).
//      6. Visual cortex spins up (GPU).
// ============================================================================
async function buildPulseKernel() {
  // 1) Identity (pressure sensors inside the house)
  let identity = null;
  try {
    identity = await PulseIdentity.identity("hybrid");
  } catch {
    identity = null;
  }

  // 2) Evolution + Brain (organism grows its neural core)
  const Evolution = PulseOSEvolution.PulseOSEvolution({
    intent: PulseIntentMap,
    organism: PulseOrganismMap,
    iq: PulseIQMap,
    understanding: PULSE_UNDERSTANDING_CONTEXT
  });

  const Brain = Evolution.bootBrain(PulseOSBrain.PulseOSBrain);

  // 3) Router + GPU (nervous system + visual cortex)
  const Router = PulseRouter;
  const GPU = PulseGPU;

  // 4) Spinal Cord (wiring between brain and body)
  const SpinalCord = PulseSpinalCord.createPulseOSSpinalCord({
    Router,
    Brain,
    Evolution,
    log: Brain.log,
    warn: Brain.warn
  });

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
    Router,
    GPU,
    SDN: SpinalCord,

    Governed: {
      run: runThroughGovernor
    }
  };

  return Pulse;
}

const PulseKernelPromise = buildPulseKernel();


// ============================================================================
//  GLOBAL BROADCAST (ASYNC-AWARE)
//
//  METAPHOR:
//  - The house announces: "The organism is awake. Here is the brain, router,
//    GPU, spinal cord, and identity sensors."
// ============================================================================
if (typeof window !== "undefined") {
  PulseKernelPromise.then((PulseKernel) => {
    window.Pulse = window.Pulse
      ? {
          ...window.Pulse,
          meta: PulseKernel.meta,
          Brain: PulseKernel.Brain,
          Router: PulseKernel.Router,
          GPU: PulseKernel.GPU,
          SDN: PulseKernel.SDN,
          Governed: PulseKernel.Governed
        }
      : PulseKernel;
  }).catch((err) => {
    console.error("[PulseUnderstanding] Kernel bootstrap failed:", err);
  });
}


// ============================================================================
//  EXPORTS — FULL BOOT LAYER
//
//  METAPHOR:
//  - Understanding exports the entire "house interior":
//      • maps
//      • environment
//      • identity accessor
//      • kernel promise
//      • governor
// ============================================================================
export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Environment: PulseEnvironment,
  IntentMap: PulseIntentMap,
  OrganismMap: PulseOrganismMap,
  IQMap: PulseIQMap,
  Kernel: PulseKernelPromise,
  Identity: () => (typeof window !== "undefined" ? window?.Pulse?.Identity ?? null : null),
  runThroughGovernor
};

export default PulseUnderstanding;
