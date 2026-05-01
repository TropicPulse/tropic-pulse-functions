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
