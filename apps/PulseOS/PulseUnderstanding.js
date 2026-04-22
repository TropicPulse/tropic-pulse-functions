// ============================================================================
//  PULSE OS v9.3 — PULSE UNDERSTANDING (KERNEL OPENER)
//  “CORTICAL OPENER / ORGANISM LOADER / COGNITIVE BOOTSTRAP”
//  FRONTEND-ONLY • NO BACKEND CALLS ON LOAD • PURE WIRING
// ============================================================================
//
//  ROLE:
//    • Single entrypoint for the entire organism in the browser
//    • Loads Nervous System, GPU, Earn, Transport, Router
//    • Provides Identity + Environment snapshot
//    • Exposes a unified, stable API on window.Pulse
//    • Exposes FAST, ADAPTIVE hooks to attach backend healers
//    • Exposes a GOVERNED execution surface (PulseOSGovernor)
// ============================================================================


// ============================================================================
//  GLOBAL LOGGER ATTACHMENT — v9.3 (MUST RUN FIRST)
// ============================================================================
import { VitalsLogger } from "./pulse-proxy/PulseProxyVitalsLogger.js";

globalThis.log    = VitalsLogger.log;
globalThis.warn   = VitalsLogger.warn;
globalThis.error  = VitalsLogger.error;
globalThis.critical = VitalsLogger.critical;
globalThis.group  = VitalsLogger.group;
globalThis.groupEnd = VitalsLogger.groupEnd;
globalThis.makeTelemetryPacket = VitalsLogger.makeTelemetryPacket;

log("route", {
  layer: "PulseUnderstanding",
  organ: "KERNEL_OPENER",
  version: "9.3"
});


// ============================================================================
//  DEVICE + USER IDENTITY (FRONTEND-ONLY, NO BACKEND)
// ============================================================================
function getOrCreateDeviceId() {
  try {
    if (typeof localStorage === "undefined") return "device-unknown";
    const key = "tp_device_id_v9";
    let id = localStorage.getItem(key);
    if (!id) {
      id = "dev_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return "device-unknown";
  }
}

function getUserId() {
  try {
    if (typeof localStorage === "undefined") return "anonymous";
    return localStorage.getItem("tp_user_id_v9") || "anonymous";
  } catch {
    return "anonymous";
  }
}

const PulseIdentity = {
  deviceId: getOrCreateDeviceId(),
  userId: getUserId()
};


// ============================================================================
//  IMPORTS — FRONTEND BARREL (ALL ORGANS ROUTE THROUGH HERE)
// ============================================================================
import { PulseIntentMap } from "./PulseIntentMap";
import { PulseIQMap } from "./PulseIQMap.js";
import { PulseOrganismMap } from "./PulseOrganismMap";
import { cognitiveBootstrap } from "./PULSE-OS/PulseOSBrain.js";
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
//  CONTEXT — KERNEL IDENTITY (v9.3)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "9.3",
  lineage: "cortical-opener",
  evo: {
    dualMode: true,
    browserOnly: true,
    advantageCascadeAware: true,
    driftProof: true,
    unifiedAdvantageField: true,
    organismLoader: true,
    cognitiveBootstrap: true,
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

const hasWindow = typeof window !== "undefined";
const hasFetch = typeof fetch === "function";


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
//  COGNITIVE BOOTSTRAP — Understanding boots the Brain
// ============================================================================
const Brain = cognitiveBootstrap({
  intent: PulseIntentMap,
  organism: PulseOrganismMap,
  iqMap: PulseIQMap,          // optional, if Brain wants it
  understanding: {
    maps: {
      intent: PulseIntentMap,
      iq: PulseIQMap,
      organism: PulseOrganismMap
    },
    context: PULSE_UNDERSTANDING_CONTEXT
  }
});

// Optionally expose Brain on the kernel
PulseKernel.Brain = Brain;



// ============================================================================
//  BACKEND HEALER WIRING HOOKS (DOOR-LEVEL, OPT-IN)
// ============================================================================
let bandHealerWired = false;
let identityHealerWired = false;
let routerMemoryHealerWired = false;

function canUseBackend() {
  if (!hasWindow || !hasFetch) return false;
  if (!window.navigator) return true;
  if (window.navigator.onLine === false) return false;
  return true;
}

export function wireCheckBandHealer() {
  if (bandHealerWired) return;
  bandHealerWired = true;

  if (!pulseband || typeof pulseband.on !== "function") return;
  if (!canUseBackend()) return;

  pulseband.on("update", async (status) => {
    if (!canUseBackend()) return;

    try {
      const res = await fetch("/pulse-proxy/CheckBand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ band: status })
      });

      const { band: healed } = await res.json();
      if (healed) pulseband.setStatus?.({ live: healed });
    } catch {}
  });
}

export async function wireCheckIdentityHealer() {
  if (identityHealerWired) return;
  identityHealerWired = true;

  if (!canUseBackend()) return;

  try {
    const res = await fetch("/pulse-proxy/CheckIdentity", {
      method: "POST",
      credentials: "include"
    });
    const identity = await res.json();

    if (hasWindow) {
      if (window.PulseIdentity?.load) {
        window.PulseIdentity.load(identity);
      } else if (window.Pulse?.Identity) {
        window.Pulse.Identity.backend = identity;
      }
    }
  } catch {}
}

export function wireCheckRouterMemoryHealer() {
  if (routerMemoryHealerWired) return;
  routerMemoryHealerWired = true;

  if (!hasWindow || !window.RouterMemory?.onFlush) return;
  if (!canUseBackend()) return;

  window.RouterMemory.onFlush(async (logs) => {
    if (!canUseBackend()) return;

    try {
      await fetch("/pulse-proxy/CheckRouterMemory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs })
      });
    } catch {}
  });
}

export function wirePulseHealers() {
  wireCheckBandHealer();
  wireCheckIdentityHealer();
  wireCheckRouterMemoryHealer();
}


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (hasWindow) {
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
