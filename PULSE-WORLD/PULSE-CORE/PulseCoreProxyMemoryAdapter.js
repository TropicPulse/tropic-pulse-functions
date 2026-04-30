// ============================================================================
//  PulseProxyMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “PROXY NEVER FETCHES TWICE. NEVER DECODE TWICE. NEVER DRIFTS.”
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

export function createPulseProxyMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
  const metaBlock = {
    identity: "PulseProxyMemoryAdapter",
    subsystem: "Proxy",
    layer: "MemoryAdapter",
    role: "Proxy-Memory-Bridge",
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
  //  INTERNAL: WRAP INTERCEPT WITH v12 METADATA
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
  //  PROXY INBOUND / OUTBOUND
  // ---------------------------------------------------------
  function inbound(routeId, payload) {
    return wrap(routeId, payload, "proxy-in");
  }

  function outbound(routeId, payload) {
    return wrap(routeId, payload, "proxy-out");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseProxyMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    inbound,
    outbound,

    promoteHot
  };
}
