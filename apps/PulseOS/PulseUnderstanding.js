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
//      (CheckBand, CheckIdentity, CheckRouterMemory) AFTER the door/lock decide
//      it’s safe.
//    • Exposes a GOVERNED execution surface (PulseOSGovernor) so all organs
//      can run under loop + multi-instance law.
// ============================================================================


// ============================================================================
//  GLOBAL LOGGER ATTACHMENT — v9.3
//  Ensures all organs have a working logger (frontend-safe).
//  PURE SIDE-EFFECT: logging only, no backend calls.
// ============================================================================
if (typeof global !== "undefined") {
  if (typeof global.log !== "function") {
    global.log = (...args) => console.log("[PULSE]", ...args);
  }
  if (typeof global.error !== "function") {
    global.error = (...args) => console.error("[PULSE-ERR]", ...args);
  }
}

// Route trace for this layer (Kernel Opener)
global?.log?.("route", {
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
      id =
        "dev_" +
        Math.random().toString(36).slice(2) +
        Date.now().toString(36);
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
//  IMPORTS — FRONTEND BARREL
// ============================================================================

// Vitals

import { log, warn, error, critical, logger, VitalsLogger } from "./pulse-proxy/PulseProxyVitalsLogger.js";
import { VitalsMonitor } from "./pulse-proxy/PulseProxyVitalsMonitor.js";
// Band / Nervous System
import { pulseband } from "./pulse-proxy/PulseProxyPNSNervousSystem.js";

// CNS / Router nervous system (if needed)
import * as route from "./pulse-router/PulseRouterEvolutionaryThought.js";

// Skin reflex (PageScanner / door)
import { attachScanner } from "./PULSE-OS/PulseOSSkinReflex.js";

// GPU OS (astral nervous system)
import * as PulseGPU from "./pulse-gpu/PulseGPUAstralNervousSystem.js";

// Earn Engine (frontend-facing hooks, if present)
import * as PulseEarnSystem from "./pulse-earn/PulseEarnSendSystem.js";

// Transport
import * as PulseSendSystem from "./pulse-send/PulseSendSystem.js";


// ⭐ Global loop + multi-instance governor (frontend-safe)
import { withOrganGuard } from "./PULSE-OS/PulseOSGovernor.js";


// ⭐ Attach the Skin Reflex with the FULL identity object (door sees identity)
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
//  This does NOT auto-run anything; it just exposes a safe wrapper.
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  return withOrganGuard(organName, pulseOrImpulse, (instanceContext) => {
    // fn gets instanceContext so it can slice work if it wants
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
    // Meta
    meta,

    // Identity
    Identity: PulseIdentity,
    Environment: PulseEnvironment,

    // Nervous system
    Band: pulseband || null,

    // GPU / Astral nervous system
    GPU: PulseGPU || null,

    // Economic organs
    Earn: PulseEarn || null,

    // Transport
    Send: PulseSend || null,

    // Routing / CNS
    Router: PulseRouter || null,

    // Vitals
    Vitals: {
      Monitor: VitalsMonitor || null,
      Logger: VitalsLogger || null
    },

    // ⭐ Governed execution surface (global loop + multi-instance law)
    Governed: {
      run: runThroughGovernor
    }
  };

  return Pulse;
}

const PulseKernel = buildPulseKernel();


// ============================================================================
//  BACKEND HEALER WIRING HOOKS (FAST, ADAPTIVE, DOOR-LEVEL, OPT-IN)
//  These DO NOT run on load. The door/lock calls them when ready.
//  They are smart about:
//    • window existence
//    • fetch availability
//    • online/offline state
//    • double-wiring
// ============================================================================
let bandHealerWired = false;
let identityHealerWired = false;
let routerMemoryHealerWired = false;

// Small helper: only run backend if we actually can
function canUseBackend() {
  if (!hasWindow || !hasFetch) return false;
  // if navigator is missing, we still allow (Node-like browser env)
  if (!window.navigator) return true;
  // prefer not to fire when explicitly offline
  if (window.navigator.onLine === false) return false;
  return true;
}

// 1) CheckBand — attach to PulseBand nervous updates
export function wireCheckBandHealer() {
  if (bandHealerWired) return;
  bandHealerWired = true;

  if (!pulseband || typeof pulseband.on !== "function") return;

  // Smart: only attach if backend is usable
  if (!canUseBackend()) return;

  // Smart: first update triggers healing; subsequent updates reuse wiring
  pulseband.on("update", async (status) => {
    if (!canUseBackend()) return;

    try {
      const res = await fetch("/.netlify/functions/CheckBand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ band: status })
      });

      const { band: healed } = await res.json();
      if (healed) {
        pulseband.setStatus?.({ live: healed });
      }
    } catch {
      // fail-open: door must never break
    }
  });
}

// 2) CheckIdentity — lock/door can call once when it’s safe
export async function wireCheckIdentityHealer() {
  if (identityHealerWired) return;
  identityHealerWired = true;

  if (!canUseBackend()) return;

  try {
    const res = await fetch("/.netlify/functions/CheckIdentity", {
      method: "POST",
      credentials: "include"
    });
    const identity = await res.json();

    if (hasWindow) {
      if (window.PulseIdentity && typeof window.PulseIdentity.load === "function") {
        window.PulseIdentity.load(identity);
      } else if (window.Pulse && window.Pulse.Identity) {
        window.Pulse.Identity.backend = identity;
      }
    }
  } catch {
    // fail-open
  }
}

// 3) CheckRouterMemory — attach to RouterMemory flush (door-level logs)
export function wireCheckRouterMemoryHealer() {
  if (routerMemoryHealerWired) return;
  routerMemoryHealerWired = true;

  if (!hasWindow || !window.RouterMemory || typeof window.RouterMemory.onFlush !== "function") {
    return;
  }

  if (!canUseBackend()) return;

  window.RouterMemory.onFlush(async (logs) => {
    if (!canUseBackend()) return;

    try {
      await fetch("/.netlify/functions/CheckRouterMemory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs })
      });
    } catch {
      // fail-open
    }
  });
}

// Convenience: wire all three in one fast call
export function wirePulseHealers() {
  wireCheckBandHealer();
  wireCheckIdentityHealer();
  wireCheckRouterMemoryHealer();
}


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (hasWindow) {
  if (!window.Pulse) {
    window.Pulse = PulseKernel;
  } else {
    window.Pulse = {
      ...window.Pulse,
      meta: PulseKernel.meta,
      // ensure Governed is present even if Pulse existed before
      Governed: PulseKernel.Governed
    };
  }

  // Expose healer wiring on window for door/lock
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
  // ⭐ expose governed runner for direct use
  runThroughGovernor
};

export default PulseKernel;
