// ============================================================================
//  PULSE OS v9.2 — PULSE UNDERSTANDING (KERNEL OPENER)
//  “CORTICAL OPENER / ORGANISM LOADER / COGNITIVE BOOTSTRAP”
//  FRONTEND-ONLY • NO BACKEND CALLS ON LOAD • PURE WIRING
// ============================================================================
//
//  ROLE:
//    • Single entrypoint for the entire organism in the browser
//    • Loads OS, GPU, Earn, Mesh, Proxy Client, PulseSend, Band, Synapse
//    • Loads Logger, Router, Healers (client-visible), Identity + Device
//    • Exposes a unified, stable API on window.Pulse
//
//  SAFETY CONTRACT (v9.2):
//    • No backend calls during module evaluation
//    • No Firebase initialization here
//    • No heavy compute
//    • Pure composition + identity surface
// ============================================================================


// ============================================================================
//  IMPORTS — FRONTEND BARREL (paths may be adjusted per repo layout)
// ============================================================================

// Logger (console identity + telemetry packet formatter)
import {
  logger,
  log,
  warn,
  error,
  critical,
  makeTelemetryPacket
} from "./PulseLogger.js";

// Synapse / connectivity math + pulse-once
import { PulseNet } from "./PulseNet.js";

// Band / Nervous System (if you already have a PulseBand frontend organ)
import { PulseBand } from "./PulseBand.js";

// GPU OS (astral nervous system)
import { PulseGPU } from "./PulseGPU.js";

// Earn Engine (frontend-facing hooks, if present)
import { PulseEarn } from "./PulseEarn.js";

// Mesh / routing / overlay (if present)
import { PulseMesh } from "./PulseMesh.js";

// PulseSend (v1+ transport organ)
import { PulseSend } from "./PulseSend.js";

// Proxy client (browser-side helper for /TPProxy)
import { PulseProxyClient } from "./PulseProxyClient.js";

// Router / CNS nervous system (if you have a frontend router organ)
import { PulseRouter } from "./PulseRouter.js";

// OS Brainstem (frontend-visible control surface, not backend brain)
import { PulseOS } from "./PulseOSFrontend.js";


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

const PulseIdentity = {
  deviceId: getOrCreateDeviceId(),
  userId: getUserId()
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

  // Optional: tiny telemetry packet for other organs to send later
  const bootPacket = makeTelemetryPacket("identity", "kernel_boot", {
    deviceId: PulseIdentity.deviceId,
    userId: PulseIdentity.userId,
    environment: PulseEnvironment,
    version: PULSE_UNDERSTANDING_CONTEXT.version
  });

  log("identity", "PulseUnderstanding kernel_boot", {
    deviceId: PulseIdentity.deviceId,
    userId: PulseIdentity.userId,
    envRuntime: PulseEnvironment.runtime
  });

  // Unified organism surface
  const Pulse = {
    // Meta
    meta,
    bootPacket,

    // Identity
    Identity: PulseIdentity,
    Environment: PulseEnvironment,

    // Core OS / Brainstem (frontend surface)
    OS: PulseOS || null,

    // Nervous system + synapse
    Band: PulseBand || null,
    Synapse: PulseNet || null,

    // GPU / Astral nervous system
    GPU: PulseGPU || null,

    // Economic organs
    Earn: PulseEarn || null,

    // Mesh / overlay
    Mesh: PulseMesh || null,

    // Transport
    Send: PulseSend || null,

    // Proxy client
    Proxy: PulseProxyClient || null,

    // Routing
    Router: PulseRouter || null,

    // Logger
    Logger: logger,
    log,
    warn,
    error,
    critical
  };

  return Pulse;
}

const PulseKernel = buildPulseKernel();


// ============================================================================
//  GLOBAL BROADCAST — MAKE KERNEL AVAILABLE TO FRONTEND
// ============================================================================
if (typeof window !== "undefined") {
  // Non-destructive: only set if not already present
  if (!window.Pulse) {
    window.Pulse = PulseKernel;
  } else {
    // If something already set it, we at least expose our meta + logger
    window.Pulse = {
      ...window.Pulse,
      meta: PulseKernel.meta,
      Logger: PulseKernel.Logger,
      log: PulseKernel.log,
      warn: PulseKernel.warn,
      error: PulseKernel.error,
      critical: PulseKernel.critical
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
