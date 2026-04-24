// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseIQMap.js
// PULSE OS — v11‑EVO DESIGN UPGRADE
// “THE IQ WAREHOUSE / IMPORT CORTEX / KNOWLEDGE APPENDAGE STORE”
// ============================================================================
//
//  v11‑EVO DIRECTION:
//  ------------------
//  IQ is now:
//    • TEXT‑ONLY
//    • DESIGN‑ONLY
//    • BLUEPRINT‑ONLY
//    • NO organ imports
//    • NO page imports
//    • NO dynamic loading
//
//  IQ ONLY imports:
//    • logger   → brain must always speak
//    • boot     → brain must always re‑ignite
//    • firebase → external appendage (allowed)
//
//  IQ DOES NOT:
//    • import pages
//    • import organs
//    • import routers
//    • import binary organs
//
//  IQ DEFINES:
//    • organism expectations (text only)
//    • page expectations (text only)
//    • routing hints
//    • fallback routes
//    • drift metadata
//    • version map
//    • binary organism awareness
//    • proxy tier awareness
//    • mesh/send/pulse expectations
//    • dynamic wrapper page expectations
//
//  IQ IS THE “DESIGN BRAIN” — NOT THE EXECUTION BRAIN.
// ============================================================================


// ============================================================================
//  SAFE LOGGING (ACCESS IMPORT)
// ============================================================================
import { log, warn, error as logError } from "../PulseProofLogger.js";


// ============================================================================
//  CORTEX BOOT (ACCESS IMPORT)
// ============================================================================
import { boot } from "./PulseOSBrainCortex.js";


// ============================================================================
//  EXTERNAL SERVICE IQ (ALLOWED)
// ============================================================================
import * as firebase from "../netlify/functions/firebase.js";


// ============================================================================
//  VERSION MAP — v11‑EVO ORGANISM BLUEPRINT
// ============================================================================
const VERSION_MAP = {
  organism: "v11‑EVO",
  iq: "v11‑EVO",
  router: "v11‑EVO",
  mesh: "v11‑EVO",
  send: "v11‑EVO",
  pulse: "v11‑EVO",
  proxy: "v11‑EVO",
  gpu: "v11",
  sdn: "v11",
  binaryNervousSystem: "v11‑PURE",
  dynamicPageSystem: "v11‑EVO",
  fallbackSystem: "ContinuancePulse‑v2"
};


// ============================================================================
//  TOP‑LEVEL ROUTING DESIGN (TEXT‑ONLY)
// ============================================================================
const TOP_LEVEL_ROUTES = {
  root: "/",
  home: "/",
  dashboard: "/dashboard",
  send: "/send",
  earn: "/earn",
  settings: "/settings",
  organism: "/organism",
  scanner: "/scanner",
  fallback: "/"
};

function inferTopLevelFromPath(path = "") {
  if (!path || typeof path !== "string") return TOP_LEVEL_ROUTES.fallback;

  const lower = path.toLowerCase();

  if (lower.startsWith("/send")) return TOP_LEVEL_ROUTES.send;
  if (lower.startsWith("/earn")) return TOP_LEVEL_ROUTES.earn;
  if (lower.startsWith("/settings")) return TOP_LEVEL_ROUTES.settings;
  if (lower.startsWith("/organism")) return TOP_LEVEL_ROUTES.organism;
  if (lower.startsWith("/scanner")) return TOP_LEVEL_ROUTES.scanner;
  if (lower.startsWith("/dash") || lower.startsWith("/home"))
    return TOP_LEVEL_ROUTES.dashboard;

  return TOP_LEVEL_ROUTES.fallback;
}


// ============================================================================
//  IQ MAP — TEXT BLUEPRINT + ACCESS APPENDAGES
// ============================================================================
export const PulseIQMap = {

  // -------------------------------------------------------------------------
  // ACCESS UTILITIES
  // -------------------------------------------------------------------------
  log,
  warn,
  logError,
  boot,
  firebase,

  // -------------------------------------------------------------------------
  // VERSION MAP (TEXT‑ONLY)
  // -------------------------------------------------------------------------
  version: VERSION_MAP,

  // -------------------------------------------------------------------------
  // ORGANISM EXPECTATIONS (TEXT‑ONLY)
// -------------------------------------------------------------------------
  organs: {
    kernel: ["PulseKernel"],
    identity: ["BBB"],

    memory: [
      "LongTermMemory",
      "PulseOSShortTermMemory",
      "saveSnapshot",
      "recordDriftSignature",
      "createRestorePoint"
    ],

    evolution: ["evolveRaw", "boot"],

    nervousSystem: ["PulseSDN"],

    gpu: ["PulseGPU"],

    router: [
      "PulseRouter",
      "BinaryRouter",
      "BinaryRouterFallbackTier"
    ],

    send: [
      "PulseSendSystem",
      "BinarySend",
      "BinarySendFallbackTier"
    ],

    mesh: [
      "PulseMesh",
      "BinaryMesh",
      "BinaryMeshFallbackTier"
    ],

    pulse: [
      "PulseHeartbeat",
      "BinaryPulse",
      "BinaryPulseFallbackTier"
    ],

    proxy: [
      "PulseProxy-v11-Evo",
      "BinaryProxy-v11-PURE",
      "BinaryProxyFallbackTier"
    ],

    scanner: [
      "PageScanner",
      "BinaryMRI",
      "BinaryWaveScanner",
      "BinaryLoopScanner"
    ],

    archetypes: [
      "BinaryDoctor",
      "BinaryCommunicator",
      "BinaryAgent"
    ],

    dynamicPage: [
      "PulseEvolutionaryPage",
      "PageEvo",
      "DynamicWrapperPage"
    ]
  },

  // -------------------------------------------------------------------------
  // PAGE EXPECTATIONS (TEXT‑ONLY)
// -------------------------------------------------------------------------
  pages: {
    "/": ["PulseRouter", "PulseKernel"],
    "/dashboard": ["PulseRouter", "PulseGPU", "LongTermMemory"],
    "/send": ["PulseSendSystem", "BinarySend"],
    "/earn": ["PulseEarn", "PulseEarnSendSystem", "PulseEarnContinuancePulse"],
    "/settings": ["BBB", "LongTermMemory", "PulseOSShortTermMemory"],
    "/organism": ["BinaryProxy", "BinaryRouter", "BinaryMesh", "BinaryPulse"],
    "/scanner": ["BinaryMRI", "BinaryWaveScanner", "BinaryLoopScanner"]
  },

  // -------------------------------------------------------------------------
  // DRIFT / REPAIR METADATA (TEXT‑ONLY)
// -------------------------------------------------------------------------
  drift: {
    lastScan: null,
    lastRepair: null,
    signatures: []
  },

  // -------------------------------------------------------------------------
  // ROUTING HELPERS
  // -------------------------------------------------------------------------
  topLevelRoutes: TOP_LEVEL_ROUTES,

  getTopLevelRouteFor(path) {
    return inferTopLevelFromPath(path);
  },

  getRecoveryRoute() {
    return TOP_LEVEL_ROUTES.fallback;
  }
};

// ============================================================================
// END OF FILE — PULSE IQ / TEXT DESIGN + ACCESS APPENDAGES / v11‑EVO
// ============================================================================
