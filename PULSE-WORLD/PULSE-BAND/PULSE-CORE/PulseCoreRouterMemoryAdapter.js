// ============================================================================
//  PulseRouterMemoryAdapter.js — v15‑IMMORTAL‑ROUTER‑MEMORY‑ADAPTER
//  “ROUTER THINKS ONCE. ROUTES FOREVER. MEMORY NEVER DRIFTS.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence‑touch propagation (overlay.touch + deterministic epoch)
//  • hot‑loop promotion
//  • dual‑band metadata (route-shape = symbolic, route-lookup = binary)
//  • lineage + router‑shape metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreRouterMemoryAdapter",
  version: "v15-IMMORTAL-ROUTER-MEMORY",
  layer: "corememory_adapter",
  role: "router_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    routerMemoryBridge: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseCoreBrain",
      "PulseCoreGovernor",
      "PulseBinaryCoreOverlay"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

// deterministic epoch for Router adapter events
let ROUTER_EPOCH = 0;
function nextRouterEpoch() {
  ROUTER_EPOCH += 1;
  return ROUTER_EPOCH;
}

export function createPulseRouterMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-ROUTER-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
  const metaBlock = {
    identity: "PulseRouterMemoryAdapter",
    subsystem: "Router",
    layer: "MemoryAdapter",
    role: "Router-Memory-Bridge",
    version,
    dnaTag,
    evo: {
      dnaAware: true,
      versionAware: true,
      presenceAware: true,
      hotLoop: true,
      dualBandSafe: true,
      routerAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP CANONICALIZE WITH v15 METADATA
  // -------------------------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const epoch = nextRouterEpoch();

    const band =
      dataType === "route-shape"
        ? "symbolic"
        : "binary"; // route-lookup is binary

    const routeSize =
      typeof payload === "object"
        ? JSON.stringify(payload).length
        : String(payload || "").length;

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      band,
      routeSize,
      metaBlock
    };

    // Presence‑touch propagation
    try {
      if (overlay.touch) {
        overlay.touch(routeId, epoch, meta);
      }
    } catch {}

    // Canonicalize through v15 BinaryOverlay
    return overlay.canonicalize(routeId, payload, {
      dataType,
      band
    });
  }

  // -------------------------------------------------------------------------
  //  ROUTER SHAPE REGISTRATION / LOOKUP
  // -------------------------------------------------------------------------
  function registerRouteShape(routeId, shape) {
    return wrap(routeId, shape, "route-shape");
  }

  function getRouteShape(routeId, shape) {
    return wrap(routeId, shape, "route-lookup");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseRouterMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    registerRouteShape,
    getRouteShape,

    promoteHot
  };
}
