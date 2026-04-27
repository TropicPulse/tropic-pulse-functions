// ============================================================================
//  PulseProxyMemoryAdapter.js — v11‑EVO‑SPINE
//  “PROXY NEVER FETCHES TWICE. NEVER DECODE TWICE.”
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseProxyMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  function inbound(routeId, payload) {
    return overlay.interceptInbound(routeId, payload, { dataType: "proxy-in" });
  }

  function outbound(routeId, payload) {
    return overlay.interceptOutbound(routeId, payload, { dataType: "proxy-out" });
  }

  return {
    role: "PulseProxyMemoryAdapter",
    inbound,
    outbound
  };
}
