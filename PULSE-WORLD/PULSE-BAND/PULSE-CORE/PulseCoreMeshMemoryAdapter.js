// ============================================================================
//  PulseMeshMemoryAdapter.js — v15‑IMMORTAL‑MESH‑MEMORY‑ADAPTER
//  “GPU LOADS ONCE. COMPUTES FOREVER. MEMORY NEVER DRIFTS.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence‑touch propagation (overlay.touch + deterministic epoch)
//  • hot‑loop promotion
//  • dual‑band metadata (gpu-model/kernel/transform = binary)
//  • lineage + mesh‑shape metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreMeshMemoryAdapter",
  version: "v15-IMMORTAL-MESH-MEMORY",
  layer: "corememory_adapter",
  role: "mesh_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    meshMemoryBridge: true,
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
      "PulseCoreMemory",
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

// deterministic epoch for Mesh adapter events
let MESH_EPOCH = 0;
function nextMeshEpoch() {
  MESH_EPOCH += 1;
  return MESH_EPOCH;
}

export function createPulseMeshMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-MESH-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
  const metaBlock = {
    identity: "PulseMeshMemoryAdapter",
    subsystem: "Mesh",
    layer: "MemoryAdapter",
    role: "GPU-Memory-Bridge",
    version,
    dnaTag,
    evo: {
      dnaAware: true,
      versionAware: true,
      hotLoop: true,
      presenceAware: true,
      dualBandSafe: true,
      meshAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP CANONICALIZE WITH v15 METADATA
  // -------------------------------------------------------------------------
  function wrap(routeId, blob, dataType) {
    const epoch = nextMeshEpoch();

    const band =
      dataType === "gpu-model" ||
      dataType === "gpu-kernel" ||
      dataType === "gpu-transform"
        ? "binary"
        : "symbolic";

    const meshSize =
      typeof blob === "object"
        ? JSON.stringify(blob).length
        : String(blob || "").length;

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      band,
      meshSize,
      metaBlock
    };

    // Presence‑touch propagation
    try {
      if (overlay.touch) {
        overlay.touch(routeId, epoch, meta);
      }
    } catch {}

    // Canonicalize through v15 BinaryOverlay
    return overlay.canonicalize(routeId, blob, {
      dataType,
      band
    });
  }

  // -------------------------------------------------------------------------
  //  GPU MODEL / KERNEL / TRANSFORM REGISTRATION
  // -------------------------------------------------------------------------
  function registerModel(routeId, modelBlob) {
    return wrap(routeId, modelBlob, "gpu-model");
  }

  function registerKernel(routeId, kernelBlob) {
    return wrap(routeId, kernelBlob, "gpu-kernel");
  }

  function registerTransform(routeId, transform) {
    return wrap(routeId, transform, "gpu-transform");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseMeshMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    registerModel,
    registerKernel,
    registerTransform,

    promoteHot
  };
}
