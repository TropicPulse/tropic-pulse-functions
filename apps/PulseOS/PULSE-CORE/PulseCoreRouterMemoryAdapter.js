// ============================================================================
//  PulseRouterMemoryAdapter.js — v11‑EVO‑SPINE
//  “ROUTER THINKS ONCE. ROUTES FOREVER.”
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseRouterMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  function registerRouteShape(routeId, shape) {
    return overlay.canonicalize(routeId, shape, { dataType: "route-shape" });
  }

  function getRouteShape(routeId, shape) {
    return overlay.canonicalize(routeId, shape, { dataType: "route-lookup" });
  }

  return {
    role: "PulseRouterMemoryAdapter",
    registerRouteShape,
    getRouteShape
  };
}
