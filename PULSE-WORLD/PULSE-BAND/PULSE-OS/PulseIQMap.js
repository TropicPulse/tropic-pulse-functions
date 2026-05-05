// -----------------------------------------------------------------------------
// PulseIQMapPrime.js — v16-IMMORTAL-CONSCIOUSNESS
// INTERPRETATION LAYER OF THE GENOME (PulseOrganismMap)
// Zero top‑level routes. Zero static routing. Fully dynamic.
// Chunk-aware • Presence-aware • Mesh-aware • Dualband-aware
// -----------------------------------------------------------------------------
/*
AI_EXPERIENCE_META = {
  identity: "IQMap",
  version: "v16-Immortal-CONSCIOUSNESS",
  layer: "consciousness",
  role: "ui_identity_and_routing_map",
  lineage: "PulseOS-v14 → v16-Immortal-CONSCIOUSNESS",

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
    dualBandAware: true,          // Dualband organism awareness

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
      "PulseAIChunker",
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
import { log, warn, error as logError } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";
import { bootCortex } from "./PulseOSBrainCortex.js";
import { createPulseAIChunker } from "../ai-core/PulseAIChunker.js"; // path adjust as needed

// -----------------------------------------------------------------------------
// VERSION MAP — text‑only, non‑executable, non‑binding
// -----------------------------------------------------------------------------
const VERSION_MAP = {
  organism: "v16-IMMORTAL-ORGANISM",
  iq: "v16-Immortal-CONSCIOUSNESS",

  router: "v16-IMMORTAL-ROUTER",
  mesh: "v16-IMMORTAL-MESH",
  send: "v16-IMMORTAL-SEND",
  pulse: "v16-IMMORTAL-PULSE",
  proxy: "v16-IMMORTAL-PROXY",

  gpu: "v16-GPU-IMMORTAL",
  sdn: "v16-SDN-IMMORTAL",
  pnsNervousSystem: "v16-PNS-IMMORTAL",
  pnsNervousSystemBinary: "v16-PNS-BINARY-IMMORTAL",

  proxySpine: "v16-SPINE-IMMORTAL",
  proxySpineBinary: "v16-SPINE-BINARY-IMMORTAL",
  proxyCleanup: "v16-CLEANUP-IMMORTAL",
  proxyHistoryRepair: "v16-REPAIR-IMMORTAL",

  binaryNervousSystem: "v16-PURE-BINARY-IMMORTAL",
  dynamicPageSystem: "v16-EVO-IMMORTAL",
  fallbackSystem: "ContinuancePulse-v3-Presence",

  uiOrganism: "v16-UI-IMMORTAL",
  uiEvolutionaryPage: "v16-UI-PAGE-IMMORTAL",
  uiBinaryOrgan: "v16-UI-BINARY-IMMORTAL",
  uiRouterOrgan: "v16-UI-ROUTER-IMMORTAL",
  uiBrainOrgan: "v16-UI-BRAIN-IMMORTAL",
  uiMemoryOrgan: "v16-UI-MEMORY-IMMORTAL",
  uiImpulseOrgan: "v16-UI-IMPULSE-IMMORTAL",
  uiSkin: "v16-UI-SKIN-IMMORTAL",
  uiAnimations: "v16-UI-ANIM-IMMORTAL",

  coreMemory: "v16-CORE-MEMORY-IMMORTAL",
  coreBinaryMemory: "v16-CORE-BINARY-IMMORTAL",

  fileScanner: "v16-FILE-SCANNER-IMMORTAL",
  codeAnalyzer: "v16-CODE-ANALYZER-IMMORTAL"
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
    contract: "PulseFirebase-v16-IMMORTAL-Routed"
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
// ROUTE INTERPRETER — v16-IMMORTAL
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
// CHUNKER — IMMORTAL 32-LANE UI/ROUTING CHUNKER
// -----------------------------------------------------------------------------
const iqChunker = createPulseAIChunker({
  id: "PulseAIChunker-IQMap",
  defaultChunkSize: 4096,
  maxChunkSize: 32768,
  trace: false
});

// Prewarm profiles for routes, GPU, scanner, proxy, organism views
iqChunker.prewarmPattern("routes", {
  defaultChunkSize: 2048,
  maxChunkSize: 16384,
  band: "symbolic"
});

iqChunker.prewarmPattern("gpu_profiles", {
  defaultChunkSize: 1024,
  maxChunkSize: 8192,
  band: "symbolic"
});

iqChunker.prewarmPattern("scanner", {
  defaultChunkSize: 2048,
  maxChunkSize: 16384,
  band: "symbolic"
});

iqChunker.prewarmPattern("proxy", {
  defaultChunkSize: 2048,
  maxChunkSize: 16384,
  band: "symbolic"
});

iqChunker.prewarmPattern("organism_ui", {
  defaultChunkSize: 4096,
  maxChunkSize: 32768,
  band: "symbolic"
});

// -----------------------------------------------------------------------------
// CHUNKING PROFILES — REQUIRED BY BRAIN (now fully wired)
// -----------------------------------------------------------------------------
function buildChunkingProfiles(genome, pageExpectations) {
  const routeProfiles = {};
  for (const route of Object.keys(pageExpectations)) {
    routeProfiles[route] = {
      label: "routes",
      band: "symbolic",
      lanes: 32
    };
  }

  const gpuProfiles = {
    default: {
      label: "gpu_profiles",
      band: "symbolic",
      lanes: 32
    },
    scanner: {
      label: "scanner",
      band: "symbolic",
      lanes: 32
    },
    proxy: {
      label: "proxy",
      band: "symbolic",
      lanes: 32
    },
    organism: {
      label: "organism_ui",
      band: "symbolic",
      lanes: 32
    }
  };

  return {
    default: {
      label: "routes",
      band: "symbolic",
      lanes: 32
    },
    routes: routeProfiles,
    gpu: gpuProfiles
  };
}

// -----------------------------------------------------------------------------
// PRIME IQ MAP — ASYNC CONSTRUCTION
// -----------------------------------------------------------------------------
async function buildPulseIQMapPrime() {
  const genome = await PulseOrganismMap;

  const organExpectations = buildOrganExpectationsFromGenome(genome);
  const pageExpectations = buildPageExpectations();
  const chunkingProfiles = buildChunkingProfiles(genome, pageExpectations);

  // Pre-chunk static topology + expectations for fast cortex access
  const topology = {
    backendRoot: "tropic-pulse-functions",
    publishRoot: FRONTEND_ROOT,
    frontendFiles: FRONTEND_FILES,
    frontendSystems: FRONTEND_SYSTEMS,
    worldFolders: WORLD_FOLDERS
  };

  const topologyChunks = iqChunker.chunkJSON(topology, {
    label: "routes",
    band: "symbolic"
  });

  const organsChunks = iqChunker.chunkJSON(organExpectations, {
    label: "organism_ui",
    band: "symbolic"
  });

  const pagesChunks = iqChunker.chunkJSON(pageExpectations, {
    label: "routes",
    band: "symbolic"
  });

  const driftChunks = iqChunker.chunkJSON(DRIFT_METADATA, {
    label: "scanner",
    band: "symbolic"
  });

  const chunkingProfilesChunks = iqChunker.chunkJSON(chunkingProfiles, {
    label: "routes",
    band: "symbolic"
  });

  return {
    log,
    warn,
    logError,
    bootCortex,
    firebase: firebaseAccess,

    version: VERSION_MAP,
    genome,

    topology,
    topologyChunks,

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
    chunkingProfiles,
    chunkingProfilesChunks,

    organs: organExpectations,
    organsChunks,
    pages: pageExpectations,
    pagesChunks,
    drift: DRIFT_METADATA,
    driftChunks,

    // ⭐ REQUIRED BY BRAIN
    getRecoveryRoute() {
      return "/";
    },

    routeInterpreter: (path) =>
      interpretRoute(path, genome, pageExpectations),

    // IMMORTAL: expose chunker surface read-only for cortex/brain
    chunkerMeta: iqChunker.getMeta(),
    getChunkerLaneStats: () => iqChunker.getLaneStats()
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
