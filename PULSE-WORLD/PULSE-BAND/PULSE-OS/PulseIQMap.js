// -----------------------------------------------------------------------------
// PulseIQMapPrime.js — v13‑EVO‑PRIME
// INTERPRETATION LAYER OF THE GENOME (PulseOrganismMap)
// Zero top‑level routes. Zero static routing. Fully dynamic.
// -----------------------------------------------------------------------------
/*
AI_EXPERIENCE_META = {
  identity: "IQMap",
  version: "v14.9-IMMORTAL-CONSCIOUSNESS",
  layer: "consciousness",
  role: "ui_identity_and_routing_map",
  lineage: "PulseOS-v14",

  evo: {
    consciousness: true,          // This IS the consciousness map
    uiIdentity: true,             // Page-level identity
    routingIdentity: true,        // Page-level routing
    chunkingAware: true,          // Chunker integration
    prewarmAware: true,           // Prewarm surfaces
    gpuProfileAware: true,        // GPU profile mapping
    presenceAware: true,          // Presence surfaces
    meshAware: true,              // Mesh surfaces
    binaryAware: true,            // Binary UI surfaces
    generatedFromGenome: true,    // MUST be generated from OrganismMap
    deterministic: true,
    driftProof: true,
    safeRouteFree: true,
    zeroNetworkFetch: true,
    zeroMutationOfInput: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "OrganismMap",              // IQMap MUST be generated from genome
      "PulseChunker",
      "PulsePresence",
      "PulseMesh",
      "PulseUI",
      "PulseRouter",
      "PulseBinaryRouter"
    ],
    never: [
      "legacyIQMap",
      "manualRouting",
      "manualPageMap",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { PulseOrganismMap } from "./PulseOrganismMap.js";
import { log, warn, error as logError } from "../../PULSE-UI/PULSEProofLogger.js";
import { bootCortex } from "./PulseOSBrainCortex.js";

// -----------------------------------------------------------------------------
// VERSION MAP — text‑only, non‑executable, non‑binding
// -----------------------------------------------------------------------------
const VERSION_MAP = {
  organism: "v12.3‑PRESENCE‑EVO‑MAX‑PRIME",
  iq: "v13‑EVO‑PRIME",

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

// -----------------------------------------------------------------------------
// STATIC ACCESS BLUEPRINTS (Firebase, etc.)
// -----------------------------------------------------------------------------
const firebaseAccess = {
  provider: "Firebase",
  role: "REMOTE_STATE_STORE",
  routed: true,
  handle: "db",
  meta: {
    helperModule: "../NETLIFY/FUNCTIONS/helpers.js",
    contract: "PulseFirebase-v12.6-Routed"
  }
};

// -----------------------------------------------------------------------------
// FRONTEND / WORLD TOPOLOGY
// -----------------------------------------------------------------------------
const FRONTEND_ROOT = "PULSE-WORLD";

const FRONTEND_FILES = [
  "index.html",
  "dashboard.html",
  "checkemail.html",
  "userrecords.html"
];

const FRONTEND_SYSTEMS = [
  "PulseAdmin",
  "PulseDirectory",
  "PulseDelivery",
  "PulseRewards"
];

const WORLD_FOLDERS = [
  "NETLIFY/FUNCTIONS",
  "_PICTURES",
  "_REDIRECT",
  "_SOUNDS",
  "_LOADERS",
  "_HELPERS"
];

// -----------------------------------------------------------------------------
// ORGANISM INTERPRETATION HELPERS
// -----------------------------------------------------------------------------
function buildOrganExpectationsFromGenome(genome) {
  const systems = genome.systems || {};
  const organsBySystem = {};

  for (const [systemKey, systemDef] of Object.entries(systems)) {
    organsBySystem[systemKey] = systemDef.organs || [];
  }

  return organsBySystem;
}

// -----------------------------------------------------------------------------
// PAGE EXPECTATIONS — still allowed, but no top‑level routing
// -----------------------------------------------------------------------------
function buildPageExpectations() {
  return {
    "/": ["PulseEvolutionaryPage"],

    "/dashboard": ["PulseEvolutionaryPage"],
    "/send": ["PulseEvolutionaryPage"],
    "/forms/send": ["PulseEvolutionaryPage"],
    "/earn": ["PulseEvolutionaryPage"],
    "/settings": ["PulseEvolutionaryPage"],

    "/organism": ["PulseEvolutionaryPage"],
    "/scanner": ["PulseEvolutionaryPage"],
    "/scanner/file": ["PulseEvolutionaryPage"],

    "/proxy": ["PulseEvolutionaryPage"],
    "/proxy/health": ["PulseEvolutionaryPage"],
    "/proxy/metrics": ["PulseEvolutionaryPage"],
    "/proxy/node": ["PulseEvolutionaryPage"],

    "/admin": ["PulseEvolutionaryPage"],
    "/directory": ["PulseEvolutionaryPage"],
    "/delivery": ["PulseEvolutionaryPage"],
    "/rewards": ["PulseEvolutionaryPage"],
    "/userrecords": ["PulseEvolutionaryPage"]
  };
}

// -----------------------------------------------------------------------------
// DRIFT / REPAIR METADATA
// -----------------------------------------------------------------------------
const DRIFT_METADATA = {
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
};

// -----------------------------------------------------------------------------
// ROUTE INTERPRETER — v13‑EVO‑PRIME
// -----------------------------------------------------------------------------
function interpretRoute(path = "", genome, pageExpectations) {
  if (!path || typeof path !== "string") return "/";

  const clean = path.toLowerCase().split("?")[0].split("#")[0];
  if (clean === "/" || clean === "") return "/";

  if (pageExpectations[clean]) return clean;

  const asHtml = clean.replace("/", "") + ".html";
  if (FRONTEND_FILES.includes(asHtml)) return clean;

  const asSystem = clean.replace("/", "");
  if (FRONTEND_SYSTEMS.includes(asSystem)) return clean;

  if (genome.systems && genome.systems[asSystem]) return clean;

  return "/";
}

// -----------------------------------------------------------------------------
// PRIME IQ MAP — ASYNC CONSTRUCTION
// -----------------------------------------------------------------------------
async function buildPulseIQMapPrime() {
  const genome = await PulseOrganismMap;

  const organExpectations = buildOrganExpectationsFromGenome(genome);
  const pageExpectations = buildPageExpectations();

  return {
    log,
    warn,
    logError,
    bootCortex,
    firebase: firebaseAccess,

    version: VERSION_MAP,
    genome,

    topology: {
      backendRoot: "tropic-pulse-functions",
      publishRoot: FRONTEND_ROOT,
      frontendFiles: FRONTEND_FILES,
      frontendSystems: FRONTEND_SYSTEMS,
      worldFolders: WORLD_FOLDERS
    },

    // ⭐ REQUIRED BY BRAIN / EVOLUTION / CORTEX
    presenceConfig: {
      enabled: false,
      bluetoothPreferred: false,
      routes: []
    },

    meshPresenceConfig: {
      enabled: false,
      topology: "none",
      routes: []
    },

    // ⭐ REQUIRED BY BRAIN (chunking metadata)
    chunkingProfiles: {
      default: null,
      routes: {},
      gpu: {}
    },

    organs: organExpectations,
    pages: pageExpectations,
    drift: DRIFT_METADATA,

    // ⭐ REQUIRED BY BRAIN
    getRecoveryRoute() {
      return "/";
    },

    routeInterpreter: (path) =>
      interpretRoute(path, genome, pageExpectations)
  };
}

// -----------------------------------------------------------------------------
// EXPORT — PRIME IQ MAP (PROMISE)
// -----------------------------------------------------------------------------
export const PulseIQMap = await buildPulseIQMapPrime();

try {
  if (typeof window !== "undefined") {
    window.PulseIQMap = PulseIQMap;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseIQMap = PulseIQMap;
  }
} catch {
  // never throw
}
