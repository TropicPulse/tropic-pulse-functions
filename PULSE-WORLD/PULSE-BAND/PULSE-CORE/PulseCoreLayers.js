// ============================================================================
//  PulseCoreLayers.js — v12‑EVO‑PRESENCE‑MAX
//  ORGANISM‑WIDE MEMORY LAYER MANAGER
//  “RAM IS A SCRATCHPAD. CORE IS THE TRUTH. PRESENCE DECIDES EVERYTHING.”
//  • MetaBlock (v12 identity)
//  • PulseRol / PresenceRol
//  • DNA‑aware
//  • Version‑aware
//  • Hot‑loop integration
//  • TTL + healing alignment
//  • GPU‑promotion rules
//  • Governor‑aligned (v12)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreLayers",
  version: "v14-IMMORTAL",
  layer: "corememory_layers",
  role: "corememory_physical_layer_map",
  lineage: "PulseCoreMemory-v14",

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
}
*/

export const CoreLayersRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "LayerManager",
  identity: "PulseCoreLayers",
  version: "12.0-Evo-Presence",

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
    versionAware: true
  }
};

// ============================================================================
//  v12 IDENTITY BLOCK (MetaBlock)
// ============================================================================
export const CoreLayersMetaBlock = {
  identity: "PulseCoreLayers",
  subsystem: "Core",
  layer: "LayerManager",
  role: "Memory-Layer-Governor",
  version: "12.0-Evo-Presence",
  evo: CoreLayersRole.evo
};

// ============================================================================
//  MEMORY LAYER DEFINITIONS (v12)
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
    metaBlock: CoreLayersMetaBlock
  }
};

// ============================================================================
//  LAYER DECISION ENGINE (v12)
// ============================================================================
export const PulseCoreLayerRules = {

  // ---------------------------------------------------------
  //  RULE 1 — WHERE DOES NEW DATA GO?
  //  v12: dnaTag + dataType + routeId + presence
  // ---------------------------------------------------------
  decidePlacement(dataType, dnaTag, routeId) {
    return {
      primary: "disk-primary",
      secondary: "disk-secondary",
      ram: "ram",
      gpu: dataType.includes("gpu") ? "gpu" : "ram",
      proxy: "proxy"
    };
  },

  // ---------------------------------------------------------
  //  RULE 2 — WHEN TO PROMOTE?
  //  v12: hotLoop + GPU‑ready + repeated access
  // ---------------------------------------------------------
  shouldPromote({ hits, dataType }) {
    if (dataType.includes("gpu")) return hits > 1;
    return hits > 3;
  },

  // ---------------------------------------------------------
  //  RULE 3 — WHEN TO DEMOTE?
  //  v12: cold data + stale patterns + TTL
  // ---------------------------------------------------------
  shouldDemote({ hits, lastAccess }) {
    const now = Date.now();
    const TTL = 7 * 24 * 60 * 60 * 1000;
    if (now - lastAccess > TTL) return true;
    return hits < 1;
  },

  // ---------------------------------------------------------
  //  RULE 4 — WHEN TO FLUSH?
  //  v12: RAM always flushes, GPU flushes on boot, proxy flushes on drift
  // ---------------------------------------------------------
  shouldFlush(layerId) {
    return layerId === "ram" || layerId === "gpu";
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
