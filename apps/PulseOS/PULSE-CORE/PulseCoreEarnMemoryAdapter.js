// ============================================================================
//  PulseEarnMemoryAdapter.js — v11‑EVO‑SPINE
//  “EARN FLOWS IN. VALUE ACCUMULATES. NOTHING IS PROCESSED TWICE.”
//  Mirror of Send, but inbound reward/earn signals.
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseEarnMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  // EARN inbound reward payloads
  function registerEarnSignal(routeId, earnPayload) {
    return overlay.interceptInbound(routeId, earnPayload, {
      dataType: "earn-signal"
    });
  }

  // EARN metadata (lineage, shape, reward factors)
  function registerEarnMeta(routeId, meta) {
    return overlay.canonicalize(routeId, meta, {
      dataType: "earn-meta"
    });
  }

  // EARN attachments (your “always attached side benefit”)
  function registerEarnAttachment(routeId, attachment) {
    return overlay.canonicalize(routeId, attachment, {
      dataType: "earn-attachment"
    });
  }

  // EARN reward formulas (pattern intelligence)
  function registerEarnFormula(routeId, formulaStruct) {
    return overlay.canonicalize(routeId, formulaStruct, {
      dataType: "earn-formula"
    });
  }

  return {
    role: "PulseEarnMemoryAdapter",
    registerEarnSignal,
    registerEarnMeta,
    registerEarnAttachment,
    registerEarnFormula
  };
}
