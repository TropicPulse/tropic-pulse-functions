// ============================================================================
// FILE: OrganismMesh-v1-EVO.js
// PULSE ORGANISM MESH — TOP-LEVEL ORGANISM LOADER
// “One page. One route. Whole organism.”
// ============================================================================

import { createPulseOrgans } from "./PulseMeshOrgans.js";

// ============================================================================
// META
// ============================================================================
export const OrganismMeshMeta = Object.freeze({
  layer: "Organism",
  role: "ORGANISM_MESH_ROOT",
  version: "v1-EVO",
  identity: "OrganismMesh-v1-EVO",
  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    mutationSafe: true,
    presenceAware: true,
    bandAware: true,
    dualMesh: true,
    survivalOrgansAttached: true
  })
});

// ============================================================================
// INTERNAL HELPERS
// ============================================================================
function safeLog(fn, fallback) {
  if (typeof fn === "function") return fn;
  if (typeof console !== "undefined" && typeof fallback === "function") return fallback;
  return () => {};
}

// ============================================================================
// ORGANISM MESH FACTORY
// IMPORTANT:
//   • Organism DOES NOT create meshes.
//   • Organism DOES NOT import mesh constructors.
//   • Organism DOES NOT import environments.
//   • The BARREL passes symbolicMeshEnv + binaryMeshEnv IN.
// ============================================================================
export function createOrganismMesh({
  context = {},
  symbolicMeshEnv,   // <-- PASSED IN BY BARREL
  binaryMeshEnv,     // <-- PASSED IN BY BARREL
  trace = false
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);

  // -------------------------------------------------------------------------
  // 1) SURVIVAL ORGANS (ONLY SUBSYSTEM CREATED HERE)
  // -------------------------------------------------------------------------
  const survivalOrgans = createPulseOrgans();

  // -------------------------------------------------------------------------
  // 2) PREWARM (CALLS ONLY SUBSYSTEMS + ENVS PASSED IN)
  // -------------------------------------------------------------------------
  function prewarm() {
    log("[OrganismMesh] Prewarm start");

    try {
      symbolicMeshEnv?.prewarm?.();
      log("[OrganismMesh] Prewarmed symbolic mesh");
    } catch (e) {
      warn("[OrganismMesh] Symbolic mesh prewarm failed", { error: e?.message });
    }

    try {
      binaryMeshEnv?.prewarm?.();
      log("[OrganismMesh] Prewarmed binary mesh");
    } catch (e) {
      warn("[OrganismMesh] Binary mesh prewarm failed", { error: e?.message });
    }

    try {
      survivalOrgans?.prewarm?.();
      log("[OrganismMesh] Prewarmed survival organs");
    } catch (e) {
      warn("[OrganismMesh] Survival organs prewarm failed", { error: e?.message });
    }

    log("[OrganismMesh] Prewarm complete");
  }

  // -------------------------------------------------------------------------
  // 3) ORGANISM ROUTES (USE ONLY ENVS PASSED IN)
// -------------------------------------------------------------------------
  function classifyImpulse(impulse) {
    return survivalOrgans.apply(impulse);
  }

  function transmitSymbolic(from, packet, options = {}) {
    return symbolicMeshEnv.transmit(from, packet, options);
  }

  function transmitBinary(from, bits, options = {}) {
    return binaryMeshEnv.binaryMesh.transmit(from, bits, options);
  }

  // -------------------------------------------------------------------------
  // 4) PUBLIC ORGANISM FACADE
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta: OrganismMeshMeta,

    // environments (PASSED IN)
    symbolicMeshEnv,
    binaryMeshEnv,

    // survival organs (SUBSYSTEM)
    survivalOrgans,

    // lifecycle
    prewarm,

    // routes
    classifyImpulse,
    transmitSymbolic,
    transmitBinary
  });
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  OrganismMeshMeta,
  createOrganismMesh
};
