// ============================================================================
//  PulseSendMemoryAdapter.js — v15‑IMMORTAL‑SEND‑MEMORY‑ADAPTER
//  “SEND ONCE. REFERENCE FOREVER. MEMORY NEVER DRIFTS.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence‑touch propagation (overlay.touch + deterministic epoch)
//  • hot‑loop promotion
//  • dual‑band metadata (send = binary)
//  • lineage + send‑shape metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreSendMemoryAdapter",
  version: "v15-IMMORTAL-SEND-MEMORY",
  layer: "corememory_adapter",
  role: "send_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

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

// deterministic epoch for Send adapter events
let SEND_EPOCH = 0;
function nextSendEpoch() {
  SEND_EPOCH += 1;
  return SEND_EPOCH;
}

export function createPulseSendMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-SEND-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
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
      dualBandSafe: true,
      sendAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP OUTBOUND WITH v15 METADATA
  // -------------------------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const epoch = nextSendEpoch();

    const band = "binary"; // send is always binary

    const sendSize =
      typeof payload === "object"
        ? JSON.stringify(payload).length
        : String(payload || "").length;

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      band,
      sendSize,
      metaBlock
    };

    // Presence‑touch propagation
    try {
      if (overlay.touch) {
        overlay.touch(routeId, epoch, meta);
      }
    } catch {}

    // Outbound canonicalization through v15 BinaryOverlay
    return overlay.interceptOutbound(routeId, payload, {
      dataType,
      band
    });
  }

  // -------------------------------------------------------------------------
  //  SEND PREPARATION
  // -------------------------------------------------------------------------
  function prepareOutbound(routeId, payload) {
    return wrap(routeId, payload, "send");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseSendMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    prepareOutbound,
    promoteHot
  };
}
