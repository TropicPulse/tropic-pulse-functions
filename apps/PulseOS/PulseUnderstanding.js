// ============================================================================
//  PulseUnderstanding.js — v10.4
//  Kernel Opener • Organism Loader • Deterministic Frontend Brainstem
// ============================================================================
//
//  WHAT THIS IS:
//  • The unified loader for all PulseOS v10.4 organs.
//  • Loads SDN (Software‑Defined Nervous System), GPU‑v10.4,
//    Router‑v10.4, Send‑v10.4, Earn‑v10.4, ContinuancePulse‑v10.4.
//  • Boots Evolution → which boots Brain → which attaches to Kernel.
//  • No astral nervous system. No PNS. No legacy GPU.
//  • Deterministic, browser‑safe, zero drift.
// ============================================================================


// ============================================================================
//  IMPORTS — FRONTEND BARREL (ALL ORGANS ROUTE THROUGH HERE)
// ============================================================================

// OS Maps
import { PulseIntentMap } from "./PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "./PULSE-OS/PulseIQMap.js";
// ADD THIS LINE:
import { PulseIdentity } from "./PULSE-OS/PulseIdentity.js";

// OS Evolution + Brain
import { PulseOSEvolution } from "./PULSE-OS/PulseOSEvolution.js";
import { PulseOSBrain } from "./PULSE-OS/PulseOSBrain.js";

// Reflex + Vitals

import { VitalsMonitor } from "./pulse-proxy/PulseProxyVitalsMonitor.js";
import { attachScanner } from "./PULSE-OS/PulseOSSkinReflex.js";

// ROUTER (v10.4 deterministic)
import * as PulseRouter from "./pulse-router/PulseRouterEvolutionaryThought.js";

// GPU ORGAN (v10.4 deterministic)
import * as PulseGPU from "./pulse-gpu/PulseGPU-v10.4.js";

// SEND SYSTEM (v10.4 deterministic)
import { PulseSendSystem } from "./pulse-send/PulseSendSystem.js";

// EARN ORGANISM (v10.4 deterministic)
import * as PulseEarn from "./pulse-earn/PulseEarn.js";
import { PulseEarnSendSystem } from "./pulse-earn/PulseEarnSendSystem.js";
import { PulseEarnContinuancePulse } from "./pulse-earn/PulseEarnContinuancePulse.js";

// SDN (Software‑Defined Nervous System)
import { createPulseSDN } from "./pulse-sdn/PulseSDN.js";

// GOVERNOR
import { withOrganGuard } from "./PULSE-OS/PulseOSGovernor.js";


// ============================================================================
//  ATTACH SKIN REFLEX (AFTER LOGGER IS READY)
// ============================================================================
attachScanner(PulseIdentity);


// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v10.4)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "10.4",
  lineage: "cortical-opener",
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
  const meta = {
    ...PULSE_UNDERSTANDING_CONTEXT,
    identity: PulseIdentity,
    environment: PulseEnvironment
  };

  const Pulse = {
    meta,
    Identity: PulseIdentity,
    Environment: PulseEnvironment,

    GPU: PulseGPU,
    Router: PulseRouter,
    Send: PulseSendSystem,

    Earn: {
      Organism: PulseEarn,
      SendSystem: PulseEarnSendSystem,
      Continuance: PulseEarnContinuancePulse
    },

    Vitals: {
      Monitor: VitalsMonitor
    },

    SDN: null,  // will be attached after Brain boots

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
//  SDN BOOTSTRAP — Nervous System attaches AFTER Brain exists
// ============================================================================
PulseKernel.SDN = createPulseSDN({
  Router: PulseRouter,
  EventBus: PulseKernel.Earn?.Organism?.EventBus || null,
  Brain,
  Evolution,
  log: Brain.log,
  warn: Brain.warn
});


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (typeof window !== "undefined") {
  window.Pulse = window.Pulse
    ? {
        ...window.Pulse,
        meta: PulseKernel.meta,
        Governed: PulseKernel.Governed,
        SDN: PulseKernel.SDN
      }
    : PulseKernel;
}


// ============================================================================
//  EXPORTS — PRIMARY ENTRYPOINT
// ============================================================================
export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Identity: PulseIdentity,
  Environment: PulseEnvironment,
  Kernel: PulseKernel,
  runThroughGovernor
};

export default PulseKernel;
