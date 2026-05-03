// ============================================================================
//  PulseCoreLayers.js — v15-IMMORTAL-LAYERS
//  ORGANISM‑WIDE MEMORY LAYER MANAGER
//  “RAM IS A SCRATCHPAD. CORE IS THE TRUTH. PRESENCE DECIDES EVERYTHING.”
//  • MetaBlock (v15 IMMORTAL identity)
//  • PulseRol / PresenceRol
//  • DNA‑aware, version‑aware
//  • Hot‑loop integration
//  • TTL + healing alignment
//  • GPU‑promotion rules
//  • Governor‑aligned (CoreMemory v15 lineage)
//  • Dual‑band / binary‑aware placement hints
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreLayers",
  version: "v15-IMMORTAL-LAYERS",
  layer: "corememory_layers",
  role: "corememory_physical_layer_map",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    layerMap: true,                // RAM, DiskPrimary, DiskSecondary, GPU, Proxy
    memoryPhysics: true,
    hydrationRules: true,
    dehydrationRules: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseCoreMemory",
      "PulseBinaryCoreOverlay",
      "PulseCoreBrain",
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

export const CoreLayersRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "LayerManager",
  identity: "PulseCoreLayers",
  version: "15.0-IMMORTAL-LAYERS",

  evo: {
    binaryNative: true,
    dualBand: true,
    quadLayer: true,
    fallbackable: true,
    loopTheory: true,
    routeAware: true,
    dnaAware: true,
    governorAligned: true,
    presenceAware: true,
    versionAware: true,
    deterministic: true,
    driftProof: true
  }
};

// ============================================================================
//  v15 IDENTITY BLOCK (MetaBlock)
// ============================================================================
export const CoreLayersMetaBlock = {
  identity: "PulseCoreLayers",
  subsystem: "Core",
  layer: "LayerManager",
  role: "Memory-Layer-Governor",
  version: "15.0-IMMORTAL-LAYERS",
  evo: CoreLayersRole.evo
};

// ============================================================================
//  MEMORY LAYER DEFINITIONS (v15)
// ============================================================================
export const PulseCoreLayers = {
  RAM: {
    id: "ram",
    speed: "fastest",
    volatility: "volatile",
    authoritative: false,
    flushOnBoot: true,
    idealFor: [
      "hotLoopKeys",
      "workingSets",
      "gpuWarmBuffers",
      "proxyTempBuffers"
    ],
    bandHint: "dual",
    hydrationRole: "scratchpad",
    metaBlock: CoreLayersMetaBlock
  },

  DISK_PRIMARY: {
    id: "disk-primary",
    speed: "medium",
    volatility: "persistent",
    authoritative: true,
    fallback: "disk-secondary",
    idealFor: [
      "canonicalBlobs",
      "routeSnapshots",
      "patternMaps",
      "evolutionState"
    ],
    bandHint: "symbolic-primary",
    hydrationRole: "truth",
    metaBlock: CoreLayersMetaBlock
  },

  DISK_SECONDARY: {
    id: "disk-secondary",
    speed: "medium",
    volatility: "persistent",
    authoritative: false,
    fallback: null,
    idealFor: [
      "canonicalBlobsMirror",
      "routeSnapshotsMirror",
      "patternMapsMirror"
    ],
    bandHint: "symbolic-mirror",
    hydrationRole: "backup",
    metaBlock: CoreLayersMetaBlock
  },

  GPU: {
    id: "gpu",
    speed: "fast",
    volatility: "volatile",
    authoritative: false,
    idealFor: [
      "compiledKernels",
      "modelSegments",
      "binaryTransforms",
      "uiHydrationGraphs"
    ],
    bandHint: "binary-primary",
    hydrationRole: "compute-surface",
    metaBlock: CoreLayersMetaBlock
  },

  PROXY: {
    id: "proxy",
    speed: "fast",
    volatility: "transient",
    authoritative: false,
    idealFor: [
      "binaryTransit",
      "dedupedOutbound",
      "clientVersionMaps"
    ],
    bandHint: "binary-transit",
    hydrationRole: "edge-buffer",
    metaBlock: CoreLayersMetaBlock
  }
};

// ============================================================================
//  LAYER DECISION ENGINE (v15-IMMORTAL)
//  • uses dataType + dnaTag + routeId
//  • GPU‑aware, proxy‑aware
//  • still compatible with v12 call sites
// ============================================================================
export const PulseCoreLayerRules = {
  // ---------------------------------------------------------
  //  RULE 1 — WHERE DOES NEW DATA GO?
  //  v15: dnaTag + dataType + routeId (presence/band implied by dataType)
  // ---------------------------------------------------------
  decidePlacement(dataType, dnaTag, routeId) {
    const dt = String(dataType || "generic").toLowerCase();
    const route = String(routeId || "global");

    const gpuPreferred =
      dt.includes("gpu") ||
      dt.includes("binary") ||
      route.includes("gpu") ||
      route.includes("render");

    const proxyPreferred =
      dt.includes("proxy") ||
      dt.includes("network") ||
      dt.includes("transit");

    const primary = "disk-primary";
    const secondary = "disk-secondary";
    const ram = "ram";
    const gpu = gpuPreferred ? "gpu" : "ram";
    const proxy = proxyPreferred ? "proxy" : "ram";

    return {
      primary,
      secondary,
      ram,
      gpu,
      proxy,
      dnaTag,
      routeId: route
    };
  },

  // ---------------------------------------------------------
  //  RULE 2 — WHEN TO PROMOTE?
  //  v15: hotLoop + GPU‑ready + repeated access + route hint
  // ---------------------------------------------------------
  shouldPromote({ hits, dataType, routeId, dnaTag } = {}) {
    const dt = String(dataType || "generic").toLowerCase();
    const route = String(routeId || "global");
    const h = Number(hits || 0);

    if (dt.includes("gpu")) return h > 1;
    if (route.includes("hot") || route.includes("loop")) return h > 2;
    if (String(dnaTag || "").includes("prime")) return h > 2;

    return h > 3;
  },

  // ---------------------------------------------------------
  //  RULE 3 — WHEN TO DEMOTE?
  //  v15: cold data + stale patterns + TTL
  // ---------------------------------------------------------
  shouldDemote({ hits, lastAccess, layerId } = {}) {
    const now = Date.now();
    const TTL = 7 * 24 * 60 * 60 * 1000;
    const h = Number(hits || 0);
    const last = Number(lastAccess || 0);
    const layer = String(layerId || "");

    if (layer === "ram" || layer === "gpu") {
      if (now - last > TTL / 4) return true;
      return h < 1;
    }

    if (now - last > TTL) return true;
    return h < 1;
  },

  // ---------------------------------------------------------
  //  RULE 4 — WHEN TO FLUSH?
  //  v15: RAM always flushes, GPU flushes on boot, proxy flushes on drift
  // ---------------------------------------------------------
  shouldFlush(layerId) {
    const id = String(layerId || "");
    return id === "ram" || id === "gpu";
  }
};

// ============================================================================
//  PUBLIC EXPORT
// ============================================================================
export const PulseCoreLayersOrgan = {
  CoreLayersRole,
  CoreLayersMetaBlock,
  PulseCoreLayers,
  PulseCoreLayerRules
};
