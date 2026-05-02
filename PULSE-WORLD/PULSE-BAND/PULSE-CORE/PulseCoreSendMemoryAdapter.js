// ============================================================================
//  PulseSendMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “SEND ONCE. REFERENCE FOREVER. MEMORY NEVER DRIFTS.”
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
  identity: "PulseCoreSendMemoryAdapter",
  version: "v14-IMMORTAL",
  layer: "corememory_adapter",
  role: "send_memory_adapter",
  lineage: "PulseCoreMemory-v14",

  evo: {
    adapter: true,
    sendMemoryBridge: true,
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

export function createPulseSendMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
  const metaBlock = {
    identity: "PulseSendMemoryAdapter",
    subsystem: "Send",
    layer: "MemoryAdapter",
    role: "Send-Memory-Bridge",
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

    return overlay.interceptOutbound(routeId, payload, meta);
  }

  // ---------------------------------------------------------
  //  SEND PREPARATION
  // ---------------------------------------------------------
  function prepareOutbound(routeId, payload) {
    return wrap(routeId, payload, "send");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseSendMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    prepareOutbound,
    promoteHot
  };
}
