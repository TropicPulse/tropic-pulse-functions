// ============================================================================
//  PulseEarnMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “EARN FLOWS IN. VALUE ACCUMULATES. NOTHING DRIFTS.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version aware
//  • presence aware
//  • hot‑loop promotion
//  • dual‑band metadata
//  • lineage + reward‑shape metadata
//  • governor + evolution aligned
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseEarnMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
  const metaBlock = {
    identity: "PulseEarnMemoryAdapter",
    subsystem: "Earn",
    layer: "MemoryAdapter",
    role: "Earn-Memory-Bridge",
    version,
    dnaTag,
    evo: {
      dnaAware: true,
      versionAware: true,
      presenceAware: true,
      hotLoop: true,
      dualBandSafe: true,
      lineageAware: true,
      rewardAware: true
    }
  };

  // ---------------------------------------------------------
  //  INTERNAL: WRAP WITH v12 METADATA
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
  //  EARN SIGNALS (REWARD INFLOW)
  // ---------------------------------------------------------
  function registerEarnSignal(routeId, earnPayload) {
    return wrap(routeId, earnPayload, "earn-signal");
  }

  // ---------------------------------------------------------
  //  EARN METADATA (LINEAGE, SHAPE, FACTORS)
  // ---------------------------------------------------------
  function registerEarnMeta(routeId, meta) {
    return wrap(routeId, meta, "earn-meta");
  }

  // ---------------------------------------------------------
  //  EARN ATTACHMENTS (SIDE BENEFITS)
  // ---------------------------------------------------------
  function registerEarnAttachment(routeId, attachment) {
    return wrap(routeId, attachment, "earn-attachment");
  }

  // ---------------------------------------------------------
  //  EARN FORMULAS (PATTERN INTELLIGENCE)
  // ---------------------------------------------------------
  function registerEarnFormula(routeId, formulaStruct) {
    return wrap(routeId, formulaStruct, "earn-formula");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseEarnMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    registerEarnSignal,
    registerEarnMeta,
    registerEarnAttachment,
    registerEarnFormula,

    promoteHot
  };
}
