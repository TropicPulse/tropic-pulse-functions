// ============================================================================
//  PulseMeshMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “GPU LOADS ONCE. COMPUTES FOREVER. MEMORY NEVER DRIFTS.”
//  • MetaBlock (v12 identity)
//  • PulseRol / PresenceRol
//  • DNA‑aware
//  • Version‑aware
//  • Hot‑loop promotion
//  • Presence‑touch propagation
//  • TTL + healing compatible
// ============================================================================

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

export function createPulseMeshMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
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
      dualBandSafe: true
    }
  };

  // ---------------------------------------------------------
  //  INTERNAL: WRAP CANONICALIZE WITH v12 METADATA
  // ---------------------------------------------------------
  function wrap(routeId, blob, dataType) {
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

    return overlay.canonicalize(routeId, blob, meta);
  }

  // ---------------------------------------------------------
  //  GPU MODEL / KERNEL / TRANSFORM REGISTRATION
  // ---------------------------------------------------------
  function registerModel(routeId, modelBlob) {
    return wrap(routeId, modelBlob, "gpu-model");
  }

  function registerKernel(routeId, kernelBlob) {
    return wrap(routeId, kernelBlob, "gpu-kernel");
  }

  function registerTransform(routeId, transform) {
    return wrap(routeId, transform, "gpu-transform");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseMeshMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
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
