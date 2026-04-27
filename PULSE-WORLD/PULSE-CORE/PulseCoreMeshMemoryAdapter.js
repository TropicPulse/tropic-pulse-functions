// ============================================================================
//  PulseMeshMemoryAdapter.js — v11‑EVO‑SPINE
//  “GPU LOADS ONCE. COMPUTES FOREVER.”
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseMeshMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  function registerModel(routeId, modelBlob) {
    return overlay.canonicalize(routeId, modelBlob, { dataType: "gpu-model" });
  }

  function registerKernel(routeId, kernelBlob) {
    return overlay.canonicalize(routeId, kernelBlob, { dataType: "gpu-kernel" });
  }

  function registerTransform(routeId, transform) {
    return overlay.canonicalize(routeId, transform, { dataType: "gpu-transform" });
  }

  return {
    role: "PulseMeshMemoryAdapter",
    registerModel,
    registerKernel,
    registerTransform
  };
}
