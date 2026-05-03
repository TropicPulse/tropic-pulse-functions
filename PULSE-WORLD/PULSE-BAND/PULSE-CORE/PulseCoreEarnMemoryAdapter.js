// ============================================================================
//  PulseEarnMemoryAdapter.js — v15‑IMMORTAL‑EARN‑MEMORY‑ADAPTER
//  “EARN FLOWS IN. VALUE ACCUMULATES. NOTHING DRIFTS.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence aware (overlay.touch + deterministic epoch)
//  • hot‑loop promotion
//  • dual‑band metadata (signal = binary, meta = symbolic)
//  • lineage + reward‑shape metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreEarnMemoryAdapter",
  version: "v15-IMMORTAL-EARN-MEMORY",
  layer: "corememory_adapter",
  role: "earn_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    earnMemoryBridge: true,
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

// deterministic epoch for Earn adapter events
let EARNMEM_EPOCH = 0;
function nextEarnEpoch() {
  EARNMEM_EPOCH += 1;
  return EARNMEM_EPOCH;
}

export function createPulseEarnMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-EARN-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
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
      rewardAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP WITH v15 METADATA + overlay touch
  // -------------------------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const epoch = nextEarnEpoch();

    // reward‑shape metadata
    const rewardSize =
      typeof payload === "object"
        ? JSON.stringify(payload).length
        : String(payload || "").length;

    const band =
      dataType === "earn-signal" ? "binary" :
      dataType === "earn-attachment" ? "binary" :
      "symbolic";

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      rewardSize,
      band,
      metaBlock
    };

    // Presence‑touch propagation
    try {
      if (overlay.touch) {
        overlay.touch(routeId, epoch, meta);
      }
    } catch {}

    // Canonicalize through v15 BinaryOverlay
    return overlay.canonicalize(routeId, payload, {
      dataType,
      band
    });
  }

  // -------------------------------------------------------------------------
  //  EARN SIGNALS (REWARD INFLOW)
  // -------------------------------------------------------------------------
  function registerEarnSignal(routeId, earnPayload) {
    return wrap(routeId, earnPayload, "earn-signal");
  }

  // -------------------------------------------------------------------------
  //  EARN METADATA (LINEAGE, SHAPE, FACTORS)
  // -------------------------------------------------------------------------
  function registerEarnMeta(routeId, metaObj) {
    return wrap(routeId, metaObj, "earn-meta");
  }

  // -------------------------------------------------------------------------
  //  EARN ATTACHMENTS (SIDE BENEFITS)
  // -------------------------------------------------------------------------
  function registerEarnAttachment(routeId, attachment) {
    return wrap(routeId, attachment, "earn-attachment");
  }

  // -------------------------------------------------------------------------
  //  EARN FORMULAS (PATTERN INTELLIGENCE)
  // -------------------------------------------------------------------------
  function registerEarnFormula(routeId, formulaStruct) {
    return wrap(routeId, formulaStruct, "earn-formula");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseEarnMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
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
