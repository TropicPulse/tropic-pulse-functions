// ============================================================================
//  PULSE OS v9.2 — PULSE UNDERSTANDING (KERNEL OPENER)
//  “CORTICAL OPENER / ORGANISM LOADER / COGNITIVE BOOTSTRAP”
//  FRONTEND-ONLY • NO BACKEND CALLS ON LOAD • PURE WIRING
// ============================================================================
//
//  ROLE:
//    • Single entrypoint for the entire organism in the browser
//    • Loads Nervous System, GPU, Earn, Mesh, Transport, Router
//    • Provides Identity + Environment snapshot
//    • Exposes a unified, stable API on window.Pulse
// ============================================================================


// ============================================================================
//  IMPORTS — FRONTEND BARREL (adjust paths per repo layout)
// ============================================================================
// ============================================================================
//  v9.3 — FRONTEND SENSORY-INTELLIGENCE LOCK + CNS IMPORT LINK
//  Prevents import binding death AND connects skin → CNS import router.
// ============================================================================

// ============================================================================
//  v9.3 — FRONTEND SENSORY-INTELLIGENCE LOCK
//  Prevents import binding death. Does NOT define routes.
//  The CNS will build routes dynamically AFTER boot.
// ============================================================================

// Band / Nervous System
import * as pulseband from "./pulse-proxy/PulseProxyPNSNervousSystem.js";
import * as route from "./pulse-os/PulseOSCNSNervousSystem.js";
import { attachScanner } from "./PULSE-OS/PulseOSSkinReflex.js";

const PulseIdentity = {
  deviceId: getOrCreateDeviceId(),
  userId: getUserId()
};

// ⭐ CORRECT — attach the Skin Reflex with the FULL identity object
attachScanner(PulseIdentity);

// GPU OS (astral nervous system)
import * as PulseGPU from "./pulse-gpu/PulseGPUAstralNervousSystem.js";


// Earn Engine (frontend-facing hooks, if present)
import * as PulseEarn from "./pulse-earn/PulseEarnSendSystem.js";


// PulseSend (transport organ)
import * as PulseSend from "./pulse-send/PulseSendSystem.js";

// Router / CNS nervous system
import * as PulseRouter from "./pulse-router/PulseRouterEvolutionaryThought.js";
import { VitalsMonitor } from "./pulse-proxy/PulseProxyVitalsMonitor.js";
import { VitalsLogger } from "./pulse-proxy/PulseProxyVitalsLogger.js";

// ============================================================================
//  CONTEXT — KERNEL IDENTITY (v9.2)
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "9.2",
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
//  KERNEL BOOTSTRAP — PURE WIRING, NO BACKEND CALLS
// ============================================================================
function buildPulseKernel() {
  const kernelTs = Date.now();

  const meta = {
    ...PULSE_UNDERSTANDING_CONTEXT,
    ts: kernelTs,
    identity: PulseIdentity,
    environment: PulseEnvironment
  };

  // Unified organism surface
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

    // Mesh / overlay
    Mesh: PulseMesh || null,

    // Transport
    Send: PulseSend || null,

    // Routing
    Router: PulseRouter || null
  };

  return Pulse;
}

const PulseKernel = buildPulseKernel();


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (typeof window !== "undefined") {
  if (!window.Pulse) {
    window.Pulse = PulseKernel;
  } else {
    window.Pulse = {
      ...window.Pulse,
      meta: PulseKernel.meta
    };
  }
}


// ============================================================================
//  EXPORTS — PRIMARY ENTRYPOINT
// ============================================================================
export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Identity: PulseIdentity,
  Environment: PulseEnvironment,
  Kernel: PulseKernel
};

export default PulseKernel;
