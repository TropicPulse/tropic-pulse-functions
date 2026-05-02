// ============================================================================
//  PulseRouterMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “ROUTER THINKS ONCE. ROUTES FOREVER. MEMORY NEVER DRIFTS.”
//  • MetaBlock (v12 identity)
//  • PulseRol / PresenceRol
//  • DNA‑aware
//  • Version‑aware
//  • Presence‑touch propagation
//  • Hot‑loop promotion
//  • Dual‑band metadata
//  • TTL + healing compatible
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreRouterMemoryAdapter",
  version: "v14-IMMORTAL",
  layer: "corememory_adapter",
  role: "router_memory_adapter",
  lineage: "PulseCoreMemory-v14",

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
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

export function createPulseRouterMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
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
      dualBandSafe: true
    }
  };

  // ---------------------------------------------------------
  //  INTERNAL: WRAP CANONICALIZE WITH v12 METADATA
  // ---------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const meta = {
      dataType,
      dnaTag,
      version,
      lastTouched: Date.now(),
      metaBlock
    };

    // Presence‑touch propagation
    try {
      overlay.touch(routeId, meta.lastTouched);
    } catch {}

    return overlay.canonicalize(routeId, payload, meta);
  }

  // ---------------------------------------------------------
  //  ROUTER SHAPE REGISTRATION / LOOKUP
  // ---------------------------------------------------------
  function registerRouteShape(routeId, shape) {
    return wrap(routeId, shape, "route-shape");
  }

  function getRouteShape(routeId, shape) {
    return wrap(routeId, shape, "route-lookup");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseRouterMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    registerRouteShape,
    getRouteShape,

    promoteHot
  };
}
