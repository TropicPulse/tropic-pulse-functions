// ============================================================================
//  PulseSendMemoryAdapter.js — v11‑EVO‑SPINE
//  “SEND ONCE. REFERENCE FOREVER.”
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseSendMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  function prepareOutbound(routeId, payload) {
    return overlay.interceptOutbound(routeId, payload, { dataType: "send" });
  }

  return {
    role: "PulseSendMemoryAdapter",
    prepareOutbound
  };
}
