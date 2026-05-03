// ============================================================================
//  PulseProxyMemoryAdapter.js — v15‑IMMORTAL‑PROXY‑MEMORY‑ADAPTER
//  “PROXY NEVER FETCHES TWICE. NEVER DECODE TWICE. NEVER DRIFTS.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence‑touch propagation (overlay.touch + deterministic epoch)
//  • hot‑loop promotion
//  • dual‑band metadata (proxy-in/out = binary)
//  • lineage + proxy‑shape metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreProxyMemoryAdapter",
  version: "v15-IMMORTAL-PROXY-MEMORY",
  layer: "corememory_adapter",
  role: "proxy_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    proxyBridge: true,
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

// deterministic epoch for Proxy adapter events
let PROXY_EPOCH = 0;
function nextProxyEpoch() {
  PROXY_EPOCH += 1;
  return PROXY_EPOCH;
}

export function createPulseProxyMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-PROXY-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
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
      dualBandSafe: true,
      proxyAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP WITH v15 METADATA + overlay touch
  // -------------------------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const epoch = nextProxyEpoch();

    const band = "binary"; // proxy-in/out always binary

    const proxySize =
      typeof payload === "object"
        ? JSON.stringify(payload).length
        : String(payload || "").length;

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      band,
      proxySize,
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
  //  PROXY INBOUND / OUTBOUND
  // -------------------------------------------------------------------------
  function inbound(routeId, payload) {
    return wrap(routeId, payload, "proxy-in");
  }

  function outbound(routeId, payload) {
    return wrap(routeId, payload, "proxy-out");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseProxyMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    inbound,
    outbound,

    promoteHot
  };
}
