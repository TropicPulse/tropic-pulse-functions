// ============================================================================
//  PulseCoreLayers.js — v11‑EVO‑DUALBAND‑MAX
//  ORGANISM‑WIDE MEMORY LAYER MANAGER
//  “RAM IS A SCRATCHPAD. CORE IS THE TRUTH.”
//  This organ decides WHERE data lives, HOW long it lives, and WHEN it moves.
//  It does NOT store data — it governs the layers that DO.
// ============================================================================

export const CoreLayersRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "LayerManager",
  version: "11.4-Evo-DualBand-Max",
  identity: "PulseCoreLayers",

  evo: {
    binaryNative: true,        // All decisions are binary-first
    dualBand: true,            // PRIMARY + SECONDARY memory bands
    quadLayer: true,           // RAM / Disk / GPU / Proxy
    fallbackable: true,        // If a layer fails, fallback to next
    loopTheory: true,          // Hot data spins faster
    routeAware: true,          // Route-level memory decisions
    dnaAware: true,            // dnaTag-based memory placement
    governorAligned: true      // Works with PulseCoreGovernor
  }
};

// ============================================================================
//  MEMORY LAYER DEFINITIONS
//  These are NOT implementations — they are contracts.
//  The Governor + CoreMemory + Adapters will use these rules.
// ============================================================================

export const PulseCoreLayers = {

  // -------------------------------------------------------------------------
  //  LAYER 0 — RAM (FAST / VOLATILE / SCRATCHPAD)
  //  Purpose:
  //    • transient working sets
  //    • hot-loop spin keys
  //    • ephemeral buffers
  //    • GPU warm-up staging
  //  Rules:
  //    • NEVER authoritative
  //    • ALWAYS disposable
  //    • Cleared on boot
  // -------------------------------------------------------------------------
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
    ]
  },

  // -------------------------------------------------------------------------
  //  LAYER 1 — DISK / PERSISTENT STORAGE (PRIMARY BAND)
  //  Purpose:
  //    • canonical binary blobs
  //    • route snapshots
  //    • pattern maps
  //    • evolution deltas
  //  Rules:
  //    • PRIMARY truth band
  //    • Used by CoreMemory bulkLoad/bulkFlush
  // -------------------------------------------------------------------------
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
    ]
  },

  // -------------------------------------------------------------------------
  //  LAYER 2 — DISK / SECONDARY BAND (FALLBACK)
  //  Purpose:
  //    • mirror of primary
  //    • fallback if primary fails
  //  Rules:
  //    • NEVER primary unless primary fails
  //    • Governor decides when to promote/demote
  // -------------------------------------------------------------------------
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
    ]
  },

  // -------------------------------------------------------------------------
  //  LAYER 3 — GPU / VRAM (COMPUTE BAND)
  //  Purpose:
  //    • compiled kernels
  //    • model segments
  //    • binary transforms
  //    • UI pre-hydration graphs
  //  Rules:
  //    • volatile but fast
  //    • promoted from RAM or DISK_PRIMARY
  // -------------------------------------------------------------------------
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
    ]
  },

  // -------------------------------------------------------------------------
  //  LAYER 4 — PROXY / NETWORK EDGE (FLOW BAND)
  //  Purpose:
  //    • binary blobs in transit
  //    • deduped outbound assets
  //    • client version manifests
  //  Rules:
  //    • NEVER authoritative
  //    • ALWAYS deduped
  //    • ALWAYS reference-first
  // -------------------------------------------------------------------------
  PROXY: {
    id: "proxy",
    speed: "fast",
    volatility: "transient",
    authoritative: false,
    idealFor: [
      "binaryTransit",
      "dedupedOutbound",
      "clientVersionMaps"
    ]
  }
};

// ============================================================================
//  LAYER DECISION ENGINE (CONTRACT ONLY)
//  The Governor + Adapters implement these decisions.
// ============================================================================

export const PulseCoreLayerRules = {

  // -------------------------------------------------------------------------
  //  RULE 1 — WHERE DOES NEW DATA GO?
  // -------------------------------------------------------------------------
  decidePlacement(dataType, dnaTag, routeId) {
    return {
      primary: "disk-primary",
      secondary: "disk-secondary",
      ram: "ram",
      gpu: "gpu",
      proxy: "proxy"
    };
  },

  // -------------------------------------------------------------------------
  //  RULE 2 — WHEN TO PROMOTE?
  //    • hotLoop hits
  //    • repeated access
  //    • GPU-ready patterns
  // -------------------------------------------------------------------------
  shouldPromote({ hits, dataType }) {
    return hits > 3;
  },

  // -------------------------------------------------------------------------
  //  RULE 3 — WHEN TO DEMOTE?
  //    • cold data
  //    • stale patterns
  //    • route unload
  // -------------------------------------------------------------------------
  shouldDemote({ hits, lastAccess }) {
    return hits < 1;
  },

  // -------------------------------------------------------------------------
  //  RULE 4 — WHEN TO FLUSH?
  //    • boot
  //    • drift detection
  //    • governor request
  // -------------------------------------------------------------------------
  shouldFlush(layerId) {
    return layerId === "ram";
  }
};

// ============================================================================
//  PUBLIC EXPORT
// ============================================================================
export const PulseCoreLayersOrgan = {
  CoreLayersRole,
  PulseCoreLayers,
  PulseCoreLayerRules
};
