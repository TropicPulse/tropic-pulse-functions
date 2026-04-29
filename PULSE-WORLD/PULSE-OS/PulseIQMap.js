// ============================================================================
//  SAFE LOGGING (ACCESS IMPORT)
// ============================================================================
import { log, warn, error as logError } from "../PULSEProofLogger.js";
// ============================================================================
//  CORTEX BOOT (ACCESS IMPORT)
// ============================================================================
import { bootCortex } from "./PulseOSBrainCortex.js";

// … VERSION_MAP and TOP_LEVEL_ROUTES unchanged …

// ============================================================================
//  IQ MAP — TEXT BLUEPRINT + ACCESS APPENDAGES
// ============================================================================
const firebaseAccess = {
  provider: "Firebase",
  role: "REMOTE_STATE_STORE",
  routed: true,          // goes through backend helpers (which are now routed)
  handle: "db",          // symbolic handle, not for direct client use
  meta: {
    helperModule: "../NETLIFY/FUNCTIONS/helpers.js",
    contract: "PulseFirebase-v12.6-Routed"
  },
  // design-only reference (execution happens in backend helpers)
  db: firebaseDb
};
// ============================================================================
//  VERSION MAP — v12.3‑PRESENCE‑EVO‑MAX‑PRIME (TEXT‑ONLY)
// ============================================================================
const VERSION_MAP = {
  organism: "v12.3‑PRESENCE‑EVO‑MAX‑PRIME",
  iq: "v12.3‑PRESENCE‑EVO‑MAX‑PRIME",
  router: "v12.3‑PRESENCE",
  mesh: "v12.3‑PRESENCE",
  send: "v12.3‑PRESENCE",
  pulse: "v12.3‑PRESENCE",
  proxy: "v12.3‑PRESENCE",

  gpu: "v12.3‑GPU‑PRESENCE",
  sdn: "v12.3‑SDN‑PRESENCE",
  pnsNervousSystem: "v12.3‑PNS‑PRESENCE",
  pnsNervousSystemBinary: "v12.3‑PNS‑BINARY‑MAX",

  proxySpine: "v12.3‑SPINE‑PRESENCE",
  proxySpineBinary: "v12.3‑SPINE‑BINARY‑MAX",
  proxyCleanup: "v12.3‑CLEANUP‑PRESENCE",
  proxyHistoryRepair: "v12.3‑REPAIR‑PRESENCE",

  binaryNervousSystem: "v12.3‑PURE‑BINARY‑MAX",
  dynamicPageSystem: "v12.3‑EVO‑MAX",
  fallbackSystem: "ContinuancePulse‑v3‑Presence",

  uiOrganism: "v12.3‑UI‑PRESENCE",
  uiEvolutionaryPage: "v12.3‑UI‑PAGE‑PRESENCE",
  uiBinaryOrgan: "v12.3‑UI‑BINARY‑PRESENCE",
  uiRouterOrgan: "v12.3‑UI‑ROUTER‑PRESENCE",
  uiBrainOrgan: "v12.3‑UI‑BRAIN‑PRESENCE",
  uiMemoryOrgan: "v12.3‑UI‑MEMORY‑PRESENCE",
  uiImpulseOrgan: "v12.3‑UI‑IMPULSE‑PRESENCE",
  uiSkin: "v12.3‑UI‑SKIN‑PRESENCE",
  uiAnimations: "v12.3‑UI‑ANIM‑PRESENCE",

  coreMemory: "v12.3‑CORE‑MEMORY",
  coreBinaryMemory: "v12.3‑CORE‑BINARY",

  fileScanner: "v12.3‑FILE‑SCANNER",
  codeAnalyzer: "v12.3‑CODE‑ANALYZER"
};

// ============================================================================
//  TOP‑LEVEL ROUTES (TEXT‑ONLY)
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
  scannerFile: "/scanner/file",
  forms: "/forms",
  proxy: "/proxy",
  fallback: "/"
};

function inferTopLevelFromPath(path = "") {
  if (!path || typeof path !== "string") return TOP_LEVEL_ROUTES.fallback;

  const lower = path.toLowerCase();

  if (lower.startsWith("/send"))          return TOP_LEVEL_ROUTES.send;
  if (lower.startsWith("/earn"))          return TOP_LEVEL_ROUTES.earn;
  if (lower.startsWith("/settings"))      return TOP_LEVEL_ROUTES.settings;
  if (lower.startsWith("/organism"))      return TOP_LEVEL_ROUTES.organism;
  if (lower.startsWith("/scanner/file"))  return TOP_LEVEL_ROUTES.scannerFile;
  if (lower.startsWith("/scanner"))       return TOP_LEVEL_ROUTES.scanner;
  if (lower.startsWith("/forms"))         return TOP_LEVEL_ROUTES.forms;
  if (lower.startsWith("/proxy"))         return TOP_LEVEL_ROUTES.proxy;
  if (lower.startsWith("/dash") || lower.startsWith("/home"))
    return TOP_LEVEL_ROUTES.dashboard;

  return TOP_LEVEL_ROUTES.fallback;
}

// ============================================================================
//  IQ MAP — TEXT BLUEPRINT + ACCESS APPENDAGES
// ============================================================================
export const PulseIQMap = {
// ACCESS UTILITIES
  log,
  warn,
  logError,
  bootCortex,
  firebase: firebaseAccess,

  // VERSION MAP
  version: VERSION_MAP,

  // ========================================================================
  //  ORGANISM EXPECTATIONS (TEXT‑ONLY)
  // ========================================================================
  organs: {
    kernel: ["PulseKernel"],
    identity: ["BBB"],

    memory: [
      "LongTermMemory",
      "PulseOSShortTermMemory",
      "saveSnapshot",
      "recordDriftSignature",
      "createRestorePoint",
      "PulseCoreMemory",
      "PulseCoreBinaryMemory"
    ],

    evolution: ["EvolutionEngine", "evolveRaw", "boot"],

    nervousSystem: ["PulseSDN", "PulseBand"],
    nervousSystemBinary: ["PulseBandBinary"],

    gpu: ["PulseGPU", "PulseGPUAstralNervousSystem"],

    router: ["PulseRouter", "BinaryRouter", "BinaryRouterFallbackTier"],
    send: ["PulseSendSystem", "BinarySend", "BinarySendFallbackTier"],
    mesh: ["PulseMesh", "BinaryMesh", "BinaryMeshFallbackTier"],
    pulse: ["PulseHeartbeat", "BinaryPulse", "BinaryPulseFallbackTier"],

    proxy: [
      "PulseProxy-v12.3-Presence",
      "BinaryProxy-v12.3-PURE",
      "BinaryProxyFallbackTier"
    ],

    proxySpine: ["PulseProxySpine", "PulseProxySpineBinary"],

    purifier: ["PulseBandCleanup"],
    shortTermMemoryRepair: ["PulseHistoryRepair"],

    healers: ["PulseOSHealer", "GlobalHealer", "PulseProxyHealer"],

    timers: ["PulseProxyHeart", "PulseTimer", "PulseOSKernelTimer"],

    scanner: [
      "PageScanner",
      "BinaryMRI",
      "BinaryWaveScanner",
      "BinaryLoopScanner"
    ],

    fileScanner: ["PulseFileScanner", "PulseCodeAnalyzer"],

    archetypes: ["BinaryDoctor", "BinaryCommunicator", "BinaryAgent"],

    dynamicPage: [
      "PulseEvolutionaryPage",
      "PageEvo",
      "DynamicWrapperPage"
    ],

    uiOrganism: [
      "PulseEvolutionaryCode",
      "PulseEvolutionaryMemory",
      "PulseEvolutionaryBrain",
      "PulseEvolutionaryRouter",
      "PulseEvolutionaryImpulse",
      "PulseEvolutionaryBinary",
      "PulseEvolutionaryStyles",
      "PulseEvolutionaryAnimations",
      "PulseEvolutionaryIcons"
    ]
  },

  // ========================================================================
  //  PAGE EXPECTATIONS (TEXT‑ONLY)
  // ========================================================================
  pages: {
    "/": ["PulseRouter", "PulseKernel", "PulseEvolutionaryPage"],

    "/dashboard": [
      "PulseRouter",
      "PulseGPU",
      "LongTermMemory",
      "PulseEvolutionaryPage"
    ],

    "/send": [
      "PulseSendSystem",
      "BinarySend",
      "PulseOSShortTermMemory",
      "PulseEvolutionaryPage"
    ],

    "/forms/send": [
      "PulseSendSystem",
      "PulseEvolutionaryPage",
      "DynamicWrapperPage"
    ],

    "/earn": [
      "PulseEarn",
      "PulseEarnSendSystem",
      "PulseEarnContinuancePulse",
      "PulseEvolutionaryPage"
    ],

    "/settings": [
      "BBB",
      "LongTermMemory",
      "PulseOSShortTermMemory",
      "PulseEvolutionaryPage"
    ],

    "/organism": [
      "PulseProxySpine",
      "PulseBand",
      "PulseBandCleanup",
      "PulseHistoryRepair",
      "BinaryRouter",
      "BinaryMesh",
      "BinaryPulse",
      "PulseEvolutionaryPage"
    ],

    "/scanner": [
      "BinaryMRI",
      "BinaryWaveScanner",
      "BinaryLoopScanner",
      "PulseEvolutionaryPage"
    ],

    "/scanner/file": [
      "PulseFileScanner",
      "PulseEvolutionaryPage"
    ],

    "/proxy": [
      "PulseProxySpine",
      "PulseProxyHealer",
      "PulseEvolutionaryPage"
    ],

    "/proxy/health": [
      "PulseProxySpine",
      "PulseProxyHealer",
      "PulseEvolutionaryPage"
    ],

    "/proxy/metrics": [
      "PulseProxySpine",
      "PulseProxyHealer",
      "PulseEvolutionaryPage"
    ],

    "/proxy/node": [
      "PulseProxySpine",
      "PulseEvolutionaryPage"
    ]
  },

  // ========================================================================
  //  DRIFT / REPAIR METADATA (TEXT‑ONLY)
  // ========================================================================
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
    ],
    scannerOrgans: ["PulseFileScanner", "PulseCodeAnalyzer"]
  },

  // ========================================================================
  //  ROUTING HELPERS (TEXT‑ONLY)
  // ========================================================================
  topLevelRoutes: TOP_LEVEL_ROUTES,

  getTopLevelRouteFor(path) {
    return inferTopLevelFromPath(path);
  },

  getRecoveryRoute() {
    return TOP_LEVEL_ROUTES.fallback;
  }
};

// ============================================================================
// END OF FILE — PULSE IQ / TEXT DESIGN + ACCESS APPENDAGES / v12.3‑PRESENCE‑EVO‑MAX‑PRIME
// ============================================================================
