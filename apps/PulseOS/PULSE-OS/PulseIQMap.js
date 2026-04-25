// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseIQMap.js
// PULSE OS — v11‑EVO ORGANISM IQ MAP
// “THE IQ WAREHOUSE / IMPORT CORTEX / KNOWLEDGE APPENDAGE STORE”
// ============================================================================
//
//  v11‑EVO DIRECTION (LOCKED CONTRACT):
//  ------------------------------------
//  IQ is now:
//    • TEXT‑ONLY
//    • DESIGN‑ONLY
//    • BLUEPRINT‑ONLY
//    • NO organ imports
//    • NO page imports
//    • NO dynamic loading
//
//  IQ ONLY imports (ACCESS APPENDAGES):
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
//  IQ DEFINES (BLUEPRINT‑ONLY):
//    • organism expectations (text only)
//    • page expectations (text only)
//    • routing hints + fallbacks
//    • drift / repair metadata
//    • version map (symbolic + binary awareness)
//    • proxy tier + spine awareness
//    • mesh / send / pulse expectations
//    • dynamic wrapper page expectations
//    • new v11‑EVO organs: PulseBand, Cleanup, HistoryRepair, Spine
//
//  IQ IS THE “DESIGN BRAIN” — NOT THE EXECUTION BRAIN.
// ============================================================================


// ============================================================================
//  SAFE LOGGING (ACCESS IMPORT)
// ============================================================================
import { log, warn, error as logError } from "../PULSEX/PULSEProofLogger.js";


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
//  Symbolic + Binary Awareness (TEXT‑ONLY)
// ============================================================================
const VERSION_MAP = {
  // Core organism
  organism: "v11‑EVO",
  iq: "v11‑EVO",
  router: "v11‑EVO",
  mesh: "v11‑EVO",
  send: "v11‑EVO",
  pulse: "v11‑EVO",
  proxy: "v11‑EVO",

  // Compute / nervous system
  gpu: "v11.0",
  sdn: "v11.0",
  pnsNervousSystem: "v11.0",          // PulseBand (PNS)
  pnsNervousSystemBinary: "v11‑BINARY",

  // Backend spine + proxy
  proxySpine: "v11.0",                // PulseProxySpine (backend spine)
  proxySpineBinary: "v11‑BINARY",     // future binary spine partner (design‑only)
  proxyCleanup: "v11.0",              // PulseBandCleanup
  proxyHistoryRepair: "v11.0",        // PulseHistoryRepair

  // Dynamic systems
  binaryNervousSystem: "v11‑PURE",
  dynamicPageSystem: "v11‑EVO",
  fallbackSystem: "ContinuancePulse‑v2"
};


// ============================================================================
//  TOP‑LEVEL ROUTING DESIGN (TEXT‑ONLY)
//  High‑level page families + fallbacks
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
  forms: "/forms",
  proxy: "/proxy",
  fallback: "/"
};

function inferTopLevelFromPath(path = "") {
  if (!path || typeof path !== "string") return TOP_LEVEL_ROUTES.fallback;

  const lower = path.toLowerCase();

  if (lower.startsWith("/send"))      return TOP_LEVEL_ROUTES.send;
  if (lower.startsWith("/earn"))      return TOP_LEVEL_ROUTES.earn;
  if (lower.startsWith("/settings"))  return TOP_LEVEL_ROUTES.settings;
  if (lower.startsWith("/organism"))  return TOP_LEVEL_ROUTES.organism;
  if (lower.startsWith("/scanner"))   return TOP_LEVEL_ROUTES.scanner;
  if (lower.startsWith("/forms"))     return TOP_LEVEL_ROUTES.forms;
  if (lower.startsWith("/proxy"))     return TOP_LEVEL_ROUTES.proxy;
  if (lower.startsWith("/dash") || lower.startsWith("/home"))
    return TOP_LEVEL_ROUTES.dashboard;

  return TOP_LEVEL_ROUTES.fallback;
}


// ============================================================================
//  IQ MAP — TEXT BLUEPRINT + ACCESS APPENDAGES
// ============================================================================
export const PulseIQMap = {

  // -------------------------------------------------------------------------
  // ACCESS UTILITIES (ALLOWED IMPORTS)
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
    // Core OS
    kernel: ["PulseKernel"],
    identity: ["BBB"],

    memory: [
      "LongTermMemory",
      "PulseOSShortTermMemory",
      "saveSnapshot",
      "recordDriftSignature",
      "createRestorePoint"
    ],

    evolution: [
      "EvolutionEngine",
      "evolveRaw",
      "boot"
    ],

    // Nervous systems
    nervousSystem: [
      "PulseSDN",          // software‑defined nervous system
      "PulseBand"          // PNS nervous system (shell)
    ],

    nervousSystemBinary: [
      "PulseBandBinary"    // binary PNS partner (design‑only awareness)
    ],

    gpu: [
      "PulseGPU",
      "PulseGPUAstralNervousSystem"
    ],

    // Routing / mesh / pulse
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

    // Proxy + backend spine
    proxy: [
      "PulseProxy-v11-Evo",
      "BinaryProxy-v11-PURE",
      "BinaryProxyFallbackTier"
    ],

    proxySpine: [
      "PulseProxySpine",          // backend spine (v11)
      "PulseProxySpineBinary"     // future binary spine (design‑only)
    ],

    // Cleanup + repair (backend organs)
    purifier: [
      "PulseBandCleanup"          // PulseBandPurifier / cleanup organ
    ],

    shortTermMemoryRepair: [
      "PulseHistoryRepair"        // Short‑Term Memory Repair Engine
    ],

    // Healers / immune system
    healers: [
      "PulseOSHealer",
      "GlobalHealer",
      "PulseProxyHealer"
    ],

    timers: [
      "PulseProxyHeart",
      "PulseTimer",
      "PulseOSKernelTimer"
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
    // Core shell
    "/": ["PulseRouter", "PulseKernel"],
    "/dashboard": ["PulseRouter", "PulseGPU", "LongTermMemory"],

    // Send / earn flows (forms + working memory)
    "/send": [
      "PulseSendSystem",
      "BinarySend",
      "PulseOSShortTermMemory"
    ],
    "/forms/send": [
      "PulseSendSystem",
      "PulseEvolutionaryPage",
      "DynamicWrapperPage"
    ],
    "/earn": [
      "PulseEarn",
      "PulseEarnSendSystem",
      "PulseEarnContinuancePulse"
    ],

    // Settings / identity / memory
    "/settings": [
      "BBB",
      "LongTermMemory",
      "PulseOSShortTermMemory"
    ],

    // Organism view — now includes backend spine + PNS nervous system
    "/organism": [
      "PulseProxySpine",
      "PulseBand",
      "PulseBandCleanup",
      "PulseHistoryRepair",
      "BinaryRouter",
      "BinaryMesh",
      "BinaryPulse"
    ],

    // Scanner / diagnostics
    "/scanner": [
      "BinaryMRI",
      "BinaryWaveScanner",
      "BinaryLoopScanner"
    ],

    // Proxy / backend observability (front‑of‑house views)
    "/proxy": [
      "PulseProxySpine",
      "PulseProxyHealer",
      "PulseEvolutionaryPage"
    ],
    "/proxy/health": [
      "PulseProxySpine",
      "PulseProxyHealer"
    ],
    "/proxy/metrics": [
      "PulseProxySpine",
      "PulseProxyHealer"
    ],
    "/proxy/node": [
      "PulseProxySpine"
    ]
  },

  // -------------------------------------------------------------------------
  // DRIFT / REPAIR METADATA (TEXT‑ONLY)
// -------------------------------------------------------------------------
  drift: {
    lastScan: null,
    lastRepair: null,
    signatures: [],
    repairOrgans: [
      "PulseBandCleanup",
      "PulseHistoryRepair",
      "PulseOSHealer",
      "GlobalHealer",
      "PulseProxyHealer"
    ]
  },

  // -------------------------------------------------------------------------
  // ROUTING HELPERS (TEXT‑ONLY)
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
