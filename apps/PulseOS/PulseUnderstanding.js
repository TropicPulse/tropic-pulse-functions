// ============================================================================
//  IMPORTS — FRONTEND BARREL (ALL ORGANS ROUTE THROUGH HERE)
// ============================================================================
import { PulseIntentMap } from "./PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "./PULSE-OS/PulseIQMap.js";

import { PulseOSEvolution } from "./PULSE-OS/PulseOSEvolution.js";
import { PulseOSBrain } from "./PULSE-OS/PulseOSBrain.js";

import { VitalsMonitor } from "./pulse-proxy/PulseProxyVitalsMonitor.js";
import { pulseband } from "./pulse-proxy/PulseProxyPNSNervousSystem.js";

import * as PulseRouter from "./pulse-router/PulseRouterEvolutionaryThought.js";
import { attachScanner } from "./PULSE-OS/PulseOSSkinReflex.js";

import * as PulseGPU from "./pulse-gpu/PulseGPUAstralNervousSystem.js";
import * as PulseEarn from "./pulse-earn/PulseEarn.js";
import * as PulseSend from "./pulse-send/PulseSend.js";

import { withOrganGuard } from "./PULSE-OS/PulseOSGovernor.js";


// ============================================================================
//  ATTACH SKIN REFLEX (AFTER LOGGER IS READY)
// ============================================================================
attachScanner(PulseIdentity);


// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v10)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "10.0",
  lineage: "cortical-opener",
  evo: {
    dualMode: true,
    browserOnly: true,
    advantageCascadeAware: true,
    driftProof: true,
    unifiedAdvantageField: true,
    organismLoader: true,
    cognitiveBootstrap: false,   // ❌ Understanding no longer boots Brain
    zeroDriftIdentity: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT (NO NETWORK)
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
//  GOVERNED EXECUTION — Run any organ through PulseOSGovernor
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  return withOrganGuard(organName, pulseOrImpulse, (instanceContext) => {
    return fn(instanceContext);
  });
}


// ============================================================================
//  KERNEL BOOTSTRAP — PURE WIRING, NO BACKEND CALLS ON LOAD
// ============================================================================
function buildPulseKernel() {
  const kernelTs = Date.now();

  const meta = {
    ...PULSE_UNDERSTANDING_CONTEXT,
    ts: kernelTs,
    identity: PulseIdentity,
    environment: PulseEnvironment
  };

  const Pulse = {
    meta,
    Identity: PulseIdentity,
    Environment: PulseEnvironment,
    Band: pulseband || null,
    GPU: PulseGPU || null,
    Earn: PulseEarn || null,
    Send: PulseSend || null,
    Router: PulseRouter || null,
    Vitals: {
      Monitor: VitalsMonitor || null,
      Logger: VitalsLogger || null
    },
    Governed: {
      run: runThroughGovernor
    }
  };

  return Pulse;
}

const PulseKernel = buildPulseKernel();


// ============================================================================
//  EVOLUTION BOOTSTRAP — Understanding boots Evolution (NOT Brain)
// ============================================================================
const Evolution = PulseOSEvolution({
  intent: PulseIntentMap,
  organism: PulseOrganismMap,
  iq: PulseIQMap,
  understanding: PULSE_UNDERSTANDING_CONTEXT
});

// ⭐ Evolution boots the Brain
const Brain = Evolution.bootBrain(PulseOSBrain);

// ⭐ Attach Brain to Kernel
PulseKernel.Brain = Brain;


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (typeof window !== "undefined") {
  window.Pulse = window.Pulse
    ? { ...window.Pulse, meta: PulseKernel.meta, Governed: PulseKernel.Governed }
    : PulseKernel;

  window.PulseHealers = {
    wireAll: wirePulseHealers,
    wireBand: wireCheckBandHealer,
    wireIdentity: wireCheckIdentityHealer,
    wireRouterMemory: wireCheckRouterMemoryHealer
  };
}


// ============================================================================
//  EXPORTS — PRIMARY ENTRYPOINT
// ============================================================================
export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Identity: PulseIdentity,
  Environment: PulseEnvironment,
  Kernel: PulseKernel,
  wireHealers: wirePulseHealers,
  wireCheckBandHealer,
  wireCheckIdentityHealer,
  wireCheckRouterMemoryHealer,
  runThroughGovernor
};

export default PulseKernel;
